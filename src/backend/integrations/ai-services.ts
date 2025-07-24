import { DatabaseService } from '../database/service'

// OpenAI Integration
export class OpenAIService {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async generateContent(prompt: string, model = 'gpt-4o', maxTokens = 1000) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: maxTokens,
        temperature: 0.7
      })
    })

    const data = await response.json()
    return {
      content: data.choices[0].message.content,
      tokens: data.usage.total_tokens
    }
  }

  async generateImage(prompt: string, size = '1024x1024') {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        size,
        quality: 'standard',
        n: 1
      })
    })

    const data = await response.json()
    return data.data[0].url
  }
}

// D-ID Video Generation Service
export class DIDVideoService {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async createTalk(script: string, sourceUrl: string, voiceId?: string) {
    const response = await fetch('https://api.d-id.com/talks', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        script: {
          type: 'text',
          input: script,
          provider: {
            type: 'elevenlabs',
            voice_id: voiceId || 'pNInz6obpgDQGcFmaJgB'
          }
        },
        source_url: sourceUrl,
        config: {
          fluent: true,
          pad_audio: 0.0
        }
      })
    })

    const data = await response.json()
    return data
  }

  async getTalkStatus(talkId: string) {
    const response = await fetch(`https://api.d-id.com/talks/${talkId}`, {
      headers: {
        'Authorization': `Basic ${this.apiKey}`
      }
    })

    const data = await response.json()
    return data
  }
}

// ElevenLabs Text-to-Speech Service
export class ElevenLabsService {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async textToSpeech(text: string, voiceId = 'pNInz6obpgDQGcFmaJgB') {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    })

    return response.blob()
  }

  async getVoices() {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    })

    const data = await response.json()
    return data.voices
  }
}

// Replicate Image Generation Service
export class ReplicateService {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async generateImage(prompt: string, model = 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b') {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: model,
        input: {
          prompt,
          width: 1024,
          height: 1024,
          num_outputs: 1,
          guidance_scale: 7.5,
          num_inference_steps: 30
        }
      })
    })

    const data = await response.json()
    return data
  }

  async getPrediction(predictionId: string) {
    const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
      headers: {
        'Authorization': `Token ${this.apiKey}`
      }
    })

    const data = await response.json()
    return data
  }
}

// Facebook Marketing API Service
export class FacebookMarketingService {
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  async createCampaign(adAccountId: string, campaignData: {
    name: string
    objective: string
    status: string
    buying_type?: string
  }) {
    const response = await fetch(`https://graph.facebook.com/v18.0/act_${adAccountId}/campaigns`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(campaignData)
    })

    const data = await response.json()
    return data
  }

  async createAdSet(adAccountId: string, adSetData: {
    name: string
    campaign_id: string
    daily_budget: number
    billing_event: string
    optimization_goal: string
    targeting: object
    status: string
  }) {
    const response = await fetch(`https://graph.facebook.com/v18.0/act_${adAccountId}/adsets`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(adSetData)
    })

    const data = await response.json()
    return data
  }

  async createAd(adAccountId: string, adData: {
    name: string
    adset_id: string
    creative: object
    status: string
  }) {
    const response = await fetch(`https://graph.facebook.com/v18.0/act_${adAccountId}/ads`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(adData)
    })

    const data = await response.json()
    return data
  }

  async getCampaignInsights(campaignId: string) {
    const response = await fetch(`https://graph.facebook.com/v18.0/${campaignId}/insights`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    })

    const data = await response.json()
    return data
  }
}

// WhatsApp Business API Service
export class WhatsAppBusinessService {
  private accessToken: string
  private phoneNumberId: string

  constructor(accessToken: string, phoneNumberId: string) {
    this.accessToken = accessToken
    this.phoneNumberId = phoneNumberId
  }

  async sendMessage(to: string, message: any) {
    const response = await fetch(`https://graph.facebook.com/v18.0/${this.phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        ...message
      })
    })

    const data = await response.json()
    return data
  }

  async sendTextMessage(to: string, text: string) {
    return this.sendMessage(to, {
      type: 'text',
      text: { body: text }
    })
  }

  async sendTemplateMessage(to: string, templateName: string, languageCode: string, components?: any[]) {
    return this.sendMessage(to, {
      type: 'template',
      template: {
        name: templateName,
        language: { code: languageCode },
        components: components || []
      }
    })
  }
}

// CJ Dropshipping API Service
export class CJDropshippingService {
  private apiKey: string
  private email: string

  constructor(apiKey: string, email: string) {
    this.apiKey = apiKey
    this.email = email
  }

  private async makeRequest(endpoint: string, method = 'GET', data?: any) {
    const timestamp = Date.now().toString()
    const signature = this.generateSignature(timestamp)

    const response = await fetch(`https://developers.cjdropshipping.com/api2.0/v1${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'CJ-Access-Token': this.apiKey,
        'CJ-Timestamp': timestamp,
        'CJ-Signature': signature
      },
      body: data ? JSON.stringify(data) : undefined
    })

    return response.json()
  }

  private generateSignature(timestamp: string): string {
    // Implementation would require CJ's signature algorithm
    return 'signature_placeholder'
  }

  async searchProducts(query: string, page = 1, pageSize = 20) {
    return this.makeRequest(`/product/list?keywords=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}`)
  }

  async getProductDetail(productId: string) {
    return this.makeRequest(`/product/query?productId=${productId}`)
  }

  async getProductVariants(productId: string) {
    return this.makeRequest(`/product/variant/query?productId=${productId}`)
  }
}

// Pexels API Service
export class PexelsService {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async searchPhotos(query: string, perPage = 20, page = 1) {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}`, {
      headers: {
        'Authorization': this.apiKey
      }
    })

    const data = await response.json()
    return data
  }

  async searchVideos(query: string, perPage = 20, page = 1) {
    const response = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${perPage}&page=${page}`, {
      headers: {
        'Authorization': this.apiKey
      }
    })

    const data = await response.json()
    return data
  }
}

// AI Integration Manager
export class AIIntegrationService {
  private userId: string

  constructor(userId: string) {
    this.userId = userId
  }

  async getServiceClient(serviceName: string) {
    const apiKey = await DatabaseService.getAPIKey(this.userId, serviceName)
    if (!apiKey) {
      throw new Error(`No API key found for ${serviceName}`)
    }

    const decryptedKey = this.decryptKey(apiKey.encrypted_key)

    switch (serviceName) {
      case 'openai':
        return new OpenAIService(decryptedKey)
      case 'did':
        return new DIDVideoService(decryptedKey)
      case 'elevenlabs':
        return new ElevenLabsService(decryptedKey)
      case 'replicate':
        return new ReplicateService(decryptedKey)
      case 'facebook':
        return new FacebookMarketingService(decryptedKey)
      case 'cj_dropshipping':
        const emailKey = await DatabaseService.getAPIKey(this.userId, serviceName, 'email')
        return new CJDropshippingService(decryptedKey, this.decryptKey(emailKey.encrypted_key))
      case 'pexels':
        return new PexelsService(decryptedKey)
      default:
        throw new Error(`Unknown service: ${serviceName}`)
    }
  }

  private decryptKey(encryptedKey: string): string {
    // Implementation would use proper encryption/decryption
    // For now, returning as-is (keys should be encrypted in production)
    return encryptedKey
  }

  async generateMagicPageContent(prompt: string, language = 'en') {
    const openai = await this.getServiceClient('openai') as OpenAIService
    
    const systemPrompt = `You are an expert landing page copywriter. Generate compelling, conversion-focused content for a landing page in ${language}. Include:
    - Attention-grabbing headline
    - Persuasive subheadline
    - Key benefits (3-5 bullet points)
    - Social proof elements
    - Strong call-to-action
    - Features section
    - FAQ section
    
    Return the content as structured JSON with clear sections.`

    const result = await openai.generateContent(`${systemPrompt}\n\nTopic: ${prompt}`)
    
    await DatabaseService.saveGeneratedContent({
      user_id: this.userId,
      content_type: 'magic_page',
      prompt,
      generated_text: result.content,
      language,
      model_used: 'gpt-4o',
      tokens_used: result.tokens
    })

    return JSON.parse(result.content)
  }

  async generateVideoScript(topic: string, duration = 60, language = 'en') {
    const openai = await this.getServiceClient('openai') as OpenAIService
    
    const systemPrompt = `You are a professional video script writer. Create an engaging ${duration}-second video script in ${language} for the following topic. The script should be:
    - Conversational and engaging
    - Appropriate for AI avatar presentation
    - Include natural pauses and emphasis
    - Hook viewers in the first 5 seconds
    - Clear call-to-action at the end
    
    Format as plain text script ready for text-to-speech.`

    const result = await openai.generateContent(`${systemPrompt}\n\nTopic: ${topic}`)
    
    await DatabaseService.saveGeneratedContent({
      user_id: this.userId,
      content_type: 'video_script',
      prompt: topic,
      generated_text: result.content,
      language,
      model_used: 'gpt-4o',
      tokens_used: result.tokens
    })

    return result.content
  }

  async generateCampaignContent(platform: string, objective: string, targetAudience: string, language = 'en') {
    const openai = await this.getServiceClient('openai') as OpenAIService
    
    const systemPrompt = `You are a digital marketing expert specializing in ${platform} advertising. Create compelling ad campaign content in ${language} with the following specifications:
    - Platform: ${platform}
    - Objective: ${objective}
    - Target Audience: ${targetAudience}
    
    Generate:
    - Campaign name
    - 5 headline variations
    - 3 description variations
    - Hashtag suggestions
    - Targeting recommendations
    - Budget suggestions
    
    Return as structured JSON.`

    const result = await openai.generateContent(systemPrompt)
    
    await DatabaseService.saveGeneratedContent({
      user_id: this.userId,
      content_type: 'campaign_content',
      prompt: `${platform} - ${objective}`,
      generated_text: result.content,
      language,
      model_used: 'gpt-4o',
      tokens_used: result.tokens
    })

    return JSON.parse(result.content)
  }

  async generateBusinessIdeas(industry: string, budget: string, language = 'en') {
    const openai = await this.getServiceClient('openai') as OpenAIService
    
    const systemPrompt = `You are a business consultant and entrepreneur. Generate profitable business ideas in ${language} for:
    - Industry: ${industry}
    - Budget Range: ${budget}
    
    Provide 5 detailed business ideas including:
    - Business concept
    - Target market
    - Revenue model
    - Initial investment required
    - Marketing strategy
    - Growth potential
    - Risk assessment
    
    Return as structured JSON with actionable insights.`

    const result = await openai.generateContent(systemPrompt)
    
    await DatabaseService.saveGeneratedContent({
      user_id: this.userId,
      content_type: 'business_ideas',
      prompt: `${industry} - ${budget}`,
      generated_text: result.content,
      language,
      model_used: 'gpt-4o',
      tokens_used: result.tokens
    })

    return JSON.parse(result.content)
  }
}