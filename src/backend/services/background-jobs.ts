import { DatabaseService } from '../database/service'
import { AIIntegrationService, WhatsAppBusinessService } from '../integrations/ai-services'

// Background Job Processor for video generation, campaign creation, etc.
export class BackgroundJobProcessor {
  private static instance: BackgroundJobProcessor
  private jobQueue: Map<string, any> = new Map()
  private isProcessing = false

  static getInstance(): BackgroundJobProcessor {
    if (!BackgroundJobProcessor.instance) {
      BackgroundJobProcessor.instance = new BackgroundJobProcessor()
    }
    return BackgroundJobProcessor.instance
  }

  async addJob(type: string, userId: string, data: any): Promise<string> {
    const jobId = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    this.jobQueue.set(jobId, {
      id: jobId,
      type,
      userId,
      data,
      status: 'pending',
      createdAt: new Date(),
      attempts: 0,
      maxAttempts: 3
    })

    if (!this.isProcessing) {
      this.processJobs()
    }

    return jobId
  }

  private async processJobs() {
    this.isProcessing = true

    while (this.jobQueue.size > 0) {
      const pendingJobs = Array.from(this.jobQueue.values())
        .filter(job => job.status === 'pending' && job.attempts < job.maxAttempts)

      if (pendingJobs.length === 0) break

      const job = pendingJobs[0]
      
      try {
        console.log(`Processing job ${job.id} of type ${job.type}`)
        
        job.status = 'processing'
        job.attempts += 1

        await this.executeJob(job)
        
        job.status = 'completed'
        this.jobQueue.delete(job.id)
        
        console.log(`Job ${job.id} completed successfully`)
        
      } catch (error) {
        console.error(`Job ${job.id} failed:`, error)
        
        if (job.attempts >= job.maxAttempts) {
          job.status = 'failed'
          job.error = error.message
          
          // Log failed job to database
          await DatabaseService.logUserActivity({
            user_id: job.userId,
            activity_type: 'job_failed',
            module_name: job.type,
            action: 'background_processing',
            metadata: { 
              job_id: job.id, 
              error: error.message,
              attempts: job.attempts 
            }
          })
          
          this.jobQueue.delete(job.id)
        } else {
          job.status = 'pending'
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, job.attempts) * 1000))
        }
      }
    }

    this.isProcessing = false
  }

  private async executeJob(job: any) {
    const aiService = new AIIntegrationService(job.userId)

    switch (job.type) {
      case 'video_generation':
        await this.processVideoGeneration(job, aiService)
        break
      
      case 'campaign_creation':
        await this.processCampaignCreation(job, aiService)
        break
      
      case 'magic_page_generation':
        await this.processMagicPageGeneration(job, aiService)
        break
      
      case 'whatsapp_message':
        await this.processWhatsAppMessage(job)
        break
      
      case 'product_import':
        await this.processProductImport(job, aiService)
        break
      
      case 'content_generation':
        await this.processContentGeneration(job, aiService)
        break
      
      default:
        throw new Error(`Unknown job type: ${job.type}`)
    }
  }

  private async processVideoGeneration(job: any, aiService: AIIntegrationService) {
    const { projectId, script, avatarId, voiceId } = job.data

    try {
      // Update project status
      await DatabaseService.updateVideoProject(projectId, { 
        status: 'processing',
        processing_job_id: job.id
      })

      // Generate video using D-ID
      const didService = await aiService.getServiceClient('did')
      
      // First, create the talk
      const talkResult = await didService.createTalk(script, avatarId, voiceId)
      
      if (!talkResult.id) {
        throw new Error('Failed to create D-ID talk')
      }

      // Poll for completion
      let attempts = 0
      const maxAttempts = 60 // 5 minutes max
      
      while (attempts < maxAttempts) {
        const status = await didService.getTalkStatus(talkResult.id)
        
        if (status.status === 'done') {
          // Update project with video URL
          await DatabaseService.updateVideoProject(projectId, {
            status: 'completed',
            video_url: status.result_url,
            duration: status.metadata?.duration || 0,
            processing_job_id: null
          })
          
          // Log success
          await DatabaseService.logUserActivity({
            user_id: job.userId,
            activity_type: 'video_generated',
            module_name: 'video_creator',
            action: 'video_completed',
            metadata: { 
              project_id: projectId,
              video_url: status.result_url,
              duration: status.metadata?.duration 
            }
          })
          
          return
        } else if (status.status === 'error') {
          throw new Error(`D-ID generation failed: ${status.error}`)
        }
        
        // Wait 5 seconds before next check
        await new Promise(resolve => setTimeout(resolve, 5000))
        attempts++
      }
      
      throw new Error('Video generation timeout')
      
    } catch (error) {
      // Update project with error
      await DatabaseService.updateVideoProject(projectId, {
        status: 'failed',
        error_message: error.message,
        processing_job_id: null
      })
      
      throw error
    }
  }

  private async processCampaignCreation(job: any, aiService: AIIntegrationService) {
    const { campaignId, platform, objective, targetAudience, budget } = job.data

    try {
      // Generate campaign content
      const content = await aiService.generateCampaignContent(platform, objective, targetAudience)
      
      // Create campaign via platform API
      let externalId = null
      
      if (platform === 'facebook') {
        const fbService = await aiService.getServiceClient('facebook')
        
        // Create campaign
        const campaignResult = await fbService.createCampaign(job.data.adAccountId, {
          name: content.campaign_name,
          objective: objective.toUpperCase(),
          status: 'PAUSED'
        })
        
        externalId = campaignResult.id
      }

      // Update campaign with generated content and external ID
      await DatabaseService.updateCampaign(campaignId, {
        status: 'active',
        external_id: externalId,
        creative_assets: content
      })

      // Log success
      await DatabaseService.logUserActivity({
        user_id: job.userId,
        activity_type: 'campaign_created',
        module_name: 'facebook_ads',
        action: 'campaign_launched',
        metadata: { 
          campaign_id: campaignId,
          platform,
          external_id: externalId
        }
      })

    } catch (error) {
      // Update campaign with error
      await DatabaseService.updateCampaign(campaignId, {
        status: 'failed',
        metadata: { error: error.message }
      })
      
      throw error
    }
  }

  private async processMagicPageGeneration(job: any, aiService: AIIntegrationService) {
    const { pageId, prompt, language } = job.data

    try {
      // Generate page content
      const content = await aiService.generateMagicPageContent(prompt, language)
      
      // Generate SEO-optimized images
      const pexelsService = await aiService.getServiceClient('pexels')
      const heroImages = await pexelsService.searchPhotos(prompt, 5)
      
      // Update page with generated content
      await DatabaseService.updateMagicPage(pageId, {
        content: {
          ...content,
          hero_images: heroImages.photos.slice(0, 3).map(photo => ({
            url: photo.src.large,
            alt: photo.alt
          }))
        },
        meta_title: content.headline,
        meta_description: content.subheadline
      })

      // Log success
      await DatabaseService.logUserActivity({
        user_id: job.userId,
        activity_type: 'magic_page_generated',
        module_name: 'magic_pages',
        action: 'content_generated',
        metadata: { 
          page_id: pageId,
          prompt,
          language
        }
      })

    } catch (error) {
      throw error
    }
  }

  private async processWhatsAppMessage(job: any) {
    const { phoneNumberId, to, message, accessToken } = job.data

    try {
      const whatsapp = new WhatsAppBusinessService(accessToken, phoneNumberId)
      
      let result
      if (message.type === 'text') {
        result = await whatsapp.sendTextMessage(to, message.text)
      } else if (message.type === 'template') {
        result = await whatsapp.sendTemplateMessage(
          to,
          message.template.name,
          message.template.language,
          message.template.components
        )
      } else {
        result = await whatsapp.sendMessage(to, message)
      }

      // Log message to database
      await DatabaseService.saveWhatsAppMessage({
        whatsapp_number_id: phoneNumberId,
        contact_number: to,
        message_type: message.type,
        content: JSON.stringify(message),
        direction: 'outbound',
        status: 'sent',
        message_id: result.messages?.[0]?.id
      })

    } catch (error) {
      // Log failed message
      await DatabaseService.saveWhatsAppMessage({
        whatsapp_number_id: phoneNumberId,
        contact_number: to,
        message_type: message.type,
        content: JSON.stringify(message),
        direction: 'outbound',
        status: 'failed'
      })
      
      throw error
    }
  }

  private async processProductImport(job: any, aiService: AIIntegrationService) {
    const { storeId, externalId, source } = job.data

    try {
      let productData
      
      if (source === 'cj_dropshipping') {
        const cjService = await aiService.getServiceClient('cj_dropshipping')
        const productDetail = await cjService.getProductDetail(externalId)
        const variants = await cjService.getProductVariants(externalId)
        
        productData = {
          user_id: job.userId,
          store_id: storeId,
          external_id: externalId,
          title: productDetail.data.productNameEn,
          description: productDetail.data.description,
          price: productDetail.data.sellPrice,
          cost: productDetail.data.sourcePrice,
          images: productDetail.data.productImages,
          category: productDetail.data.categoryName,
          supplier_info: {
            supplier: 'CJ Dropshipping',
            variants: variants.data
          }
        }
      }

      // Create product in database
      const product = await DatabaseService.createProduct(productData)

      // Log success
      await DatabaseService.logUserActivity({
        user_id: job.userId,
        activity_type: 'product_imported',
        module_name: 'product_scraper',
        action: 'import_completed',
        metadata: { 
          product_id: product.id,
          external_id: externalId,
          source
        }
      })

    } catch (error) {
      throw error
    }
  }

  private async processContentGeneration(job: any, aiService: AIIntegrationService) {
    const { contentType, prompt, language, options } = job.data

    try {
      const openai = await aiService.getServiceClient('openai')
      
      let systemPrompt = ''
      
      switch (contentType) {
        case 'blog_post':
          systemPrompt = `Write a comprehensive blog post in ${language} about: ${prompt}. Include SEO-optimized headings, engaging introduction, detailed sections, and conclusion.`
          break
        case 'social_media':
          systemPrompt = `Create engaging social media content in ${language} for: ${prompt}. Include multiple post variations, hashtags, and platform-specific optimizations.`
          break
        case 'email_campaign':
          systemPrompt = `Write a compelling email campaign in ${language} about: ${prompt}. Include subject line variations, email body, and call-to-action.`
          break
        case 'product_description':
          systemPrompt = `Write persuasive product descriptions in ${language} for: ${prompt}. Focus on benefits, features, and conversion optimization.`
          break
      }

      const result = await openai.generateContent(systemPrompt, 'gpt-4o', options?.maxTokens || 2000)
      
      // Save generated content
      await DatabaseService.saveGeneratedContent({
        user_id: job.userId,
        content_type: contentType,
        prompt,
        generated_text: result.content,
        language,
        model_used: 'gpt-4o',
        tokens_used: result.tokens
      })

      // Log success
      await DatabaseService.logUserActivity({
        user_id: job.userId,
        activity_type: 'content_generated',
        module_name: 'ai_content',
        action: contentType,
        metadata: { 
          prompt,
          language,
          tokens_used: result.tokens
        }
      })

    } catch (error) {
      throw error
    }
  }
}

// Webhook Handler for external services
export class WebhookHandler {
  static async handleWhatsAppWebhook(payload: any) {
    try {
      if (payload.entry?.[0]?.changes?.[0]?.value?.messages) {
        const messages = payload.entry[0].changes[0].value.messages
        const phoneNumberId = payload.entry[0].changes[0].value.metadata.phone_number_id
        
        for (const message of messages) {
          // Save incoming message
          await DatabaseService.saveWhatsAppMessage({
            whatsapp_number_id: phoneNumberId,
            contact_number: message.from,
            message_type: message.type,
            content: JSON.stringify(message),
            direction: 'inbound',
            status: 'received',
            message_id: message.id
          })

          // Process automation flows
          await this.processWhatsAppAutomation(phoneNumberId, message)
        }
      }
    } catch (error) {
      console.error('WhatsApp webhook error:', error)
    }
  }

  private static async processWhatsAppAutomation(phoneNumberId: string, message: any) {
    // Get active flows for this number
    const { data: flows } = await supabase
      .from('whatsapp_flows')
      .select('*')
      .eq('whatsapp_number_id', phoneNumberId)
      .eq('is_active', true)

    if (!flows) return

    const messageText = message.text?.body?.toLowerCase() || ''
    
    for (const flow of flows) {
      const triggerWords = flow.trigger_keywords
      const hasKeyword = triggerWords.some(keyword => 
        messageText.includes(keyword.toLowerCase())
      )

      if (hasKeyword) {
        // Execute flow
        await this.executeWhatsAppFlow(flow, message)
        break // Only trigger first matching flow
      }
    }
  }

  private static async executeWhatsAppFlow(flow: any, incomingMessage: any) {
    const flowConfig = flow.flow_config
    const steps = flowConfig.steps || []
    
    for (const step of steps) {
      try {
        if (step.type === 'delay') {
          await new Promise(resolve => setTimeout(resolve, step.duration * 1000))
        } else if (step.type === 'message') {
          // Get WhatsApp number details
          const { data: whatsappNumber } = await supabase
            .from('whatsapp_numbers')
            .select('*')
            .eq('id', flow.whatsapp_number_id)
            .single()

          if (whatsappNumber?.access_token) {
            const jobProcessor = BackgroundJobProcessor.getInstance()
            await jobProcessor.addJob('whatsapp_message', flow.user_id, {
              phoneNumberId: flow.whatsapp_number_id,
              to: incomingMessage.from,
              message: step.message,
              accessToken: whatsappNumber.access_token
            })
          }
        } else if (step.type === 'add_contact') {
          // Add contact to CRM
          await DatabaseService.createContact({
            user_id: flow.user_id,
            phone: incomingMessage.from,
            source: 'whatsapp',
            status: 'lead',
            notes: `Added via WhatsApp flow: ${flow.name}`
          })
        }
      } catch (error) {
        console.error(`Flow step error:`, error)
        // Continue with next step
      }
    }
  }

  static async handlePaymentWebhook(provider: string, payload: any) {
    try {
      // Handle payment confirmations, subscription updates, etc.
      if (provider === 'stripe') {
        const event = payload.type
        
        if (event === 'invoice.payment_succeeded') {
          const subscription = payload.data.object
          // Update user subscription status
          await this.updateUserSubscription(subscription.customer, subscription)
        }
      }
    } catch (error) {
      console.error('Payment webhook error:', error)
    }
  }

  private static async updateUserSubscription(customerId: string, subscriptionData: any) {
    // Find user by Stripe customer ID
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('stripe_customer_id', customerId)
      .single()

    if (user) {
      // Update subscription details
      await DatabaseService.updateUserSubscription(user.id, {
        subscription_status: 'active',
        subscription_start_date: new Date(subscriptionData.current_period_start * 1000).toISOString(),
        subscription_end_date: new Date(subscriptionData.current_period_end * 1000).toISOString()
      })

      // Add subscription credits
      const planCredits = this.getPlanCredits(subscriptionData.plan?.id)
      if (planCredits > 0) {
        await DatabaseService.addCredits(
          user.id,
          planCredits,
          'subscription',
          `Monthly subscription credits - ${subscriptionData.plan?.id}`
        )
      }
    }
  }

  private static getPlanCredits(planId: string): number {
    const creditMap = {
      'pro': 500,
      'premium': 2000
    }
    return creditMap[planId] || 0
  }
}

// Initialize background services
export function initializeBackgroundServices() {
  console.log('Initializing NexusOne background services...')
  
  // Start job processor
  const jobProcessor = BackgroundJobProcessor.getInstance()
  
  // Set up webhook endpoints
  const app = require('../api/server').default
  
  app.post('/webhooks/whatsapp', async (req: any, res: any) => {
    await WebhookHandler.handleWhatsAppWebhook(req.body)
    res.status(200).send('OK')
  })
  
  app.post('/webhooks/payment/:provider', async (req: any, res: any) => {
    await WebhookHandler.handlePaymentWebhook(req.params.provider, req.body)
    res.status(200).send('OK')
  })
  
  console.log('Background services initialized successfully')
}