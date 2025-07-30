import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hbfgtdxvlbkvkrjqxnac.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiZmd0ZHh2bGJrdmtyanh4bmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ2NzI4MDAsImV4cCI6MjAyMDI0ODgwMH0.XYKhOW-Q5kz9O2P7vX1cFm3d8jR6sN0tA9wK4eL7mGp'

export const supabase = createClient(supabaseUrl, supabaseKey)

// AI Services Integration
class SupabaseAIService {
  private async callFunction(functionName: string, payload: any) {
    try {
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: payload
      })

      if (error) {
        console.error(`Error calling ${functionName}:`, error)
        throw new Error(error.message || `Failed to call ${functionName}`)
      }

      return data
    } catch (error) {
      console.error(`Function call failed for ${functionName}:`, error)
      throw error
    }
  }

  // NexBrain AI Assistant
  async chatWithNexBrain(message: string): Promise<string> {
    const response = await this.callFunction('nexbrain-chat', {
      message
    })
    return response.reply || response.message || 'No response from NexBrain'
  }

  // AI Content Generation
  async generateContent(prompt: string, type: string = 'marketing'): Promise<any> {
    const response = await this.callFunction('ai-content-generation', {
      prompt,
      type
    })
    return response
  }

  // Luma Video AI
  async generateVideo(prompt: string, duration: number = 5): Promise<any> {
    const response = await this.callFunction('luma-video-ai', {
      prompt,
      duration
    })
    return response
  }

  // CJ Dropshipping Catalog
  async getCJProducts(search?: string, category?: string, limit: number = 20): Promise<any[]> {
    const response = await this.callFunction('cj-dropshipping-catalog', {
      search,
      category,
      limit
    })
    return response.products || response || []
  }

  // Facebook Ads Manager
  async createFacebookAd(product: string, budget: number, audience: string): Promise<any> {
    const response = await this.callFunction('facebook-ads-manager', {
      product,
      budget,
      audience
    })
    return response
  }

  // WhatsApp Automation
  async generateWhatsAppMessage(context: string, product?: string): Promise<any> {
    const response = await this.callFunction('whatsapp-automation', {
      action: 'generate_message',
      context,
      product
    })
    return response
  }

  // Landing Page Builder
  async generateLandingPage(product: string, template: string = 'modern'): Promise<any> {
    const response = await this.callFunction('landing-page-builder', {
      product,
      template,
      generate_content: true
    })
    return response
  }

  // Product Scraper
  async scrapeProduct(url: string): Promise<any> {
    const response = await this.callFunction('product-scraper', {
      url,
      extract: ['title', 'price', 'images', 'description']
    })
    return response
  }

  // Unsplash Images
  async getUnsplashImages(query: string, count: number = 3): Promise<any[]> {
    const response = await this.callFunction('unsplash-api', {
      query,
      count,
      orientation: 'landscape'
    })
    return response.images || response || []
  }

  // Video Generator (Multi-platform)
  async generateVideoMultiPlatform(type: string, product: string, style: string = 'modern'): Promise<any> {
    const response = await this.callFunction('video-generator', {
      type,
      product,
      style
    })
    return response
  }

  // Test API Connection
  async testAPIConnection(api: string): Promise<boolean> {
    try {
      const response = await this.callFunction('test-api-connection', {
        api,
        test_type: 'connection'
      })
      return response.success || false
    } catch (error) {
      console.error(`API test failed for ${api}:`, error)
      return false
    }
  }

  // Usage Tracker
  async trackUsage(userId: string, action: string, creditsUsed: number): Promise<void> {
    try {
      await this.callFunction('usage-tracker', {
        user_id: userId,
        action,
        credits_used: creditsUsed
      })
    } catch (error) {
      console.error('Failed to track usage:', error)
    }
  }

  // Import Dropshipping Product
  async importDropshippingProduct(productUrl: string): Promise<any> {
    const response = await this.callFunction('dropshipping-import', {
      url: productUrl,
      auto_optimize: true
    })
    return response
  }

  // Complete AI Campaign Generation
  async generateCompleteCampaign(product: any, budget: number = 50): Promise<any> {
    try {
      // Step 1: Generate landing page
      const landingPage = await this.generateLandingPage(product.name || product.title)
      
      // Step 2: Generate Facebook ad
      const facebookAd = await this.createFacebookAd(
        product.name || product.title, 
        budget, 
        'interested in ' + (product.category || 'technology')
      )
      
      // Step 3: Generate video
      const video = await this.generateVideo(
        `Product demo for ${product.name || product.title}`,
        5
      )
      
      // Step 4: Generate WhatsApp messages
      const whatsappMessage = await this.generateWhatsAppMessage(
        'product_inquiry',
        product.name || product.title
      )
      
      // Step 5: Get images
      const images = await this.getUnsplashImages(
        product.name || product.title || 'product',
        3
      )

      return {
        product,
        landingPage,
        facebookAd,
        video,
        whatsappMessage,
        images,
        status: 'complete',
        generatedAt: new Date().toISOString()
      }
    } catch (error) {
      console.error('Complete campaign generation failed:', error)
      throw error
    }
  }

  // Test all AI integrations
  async testAllIntegrations(): Promise<any> {
    const tests = [
      { name: 'OpenAI', test: () => this.testAPIConnection('openai') },
      { name: 'Luma AI', test: () => this.testAPIConnection('luma') },
      { name: 'ElevenLabs', test: () => this.testAPIConnection('elevenlabs') },
      { name: 'Replicate', test: () => this.testAPIConnection('replicate') },
      { name: 'Gupshup', test: () => this.testAPIConnection('gupshup') },
      { name: 'Facebook', test: () => this.testAPIConnection('facebook') },
      { name: 'CJ Dropshipping', test: () => this.testAPIConnection('cj_dropshipping') },
      { name: 'Unsplash', test: () => this.testAPIConnection('unsplash') }
    ]

    const results = []
    for (const test of tests) {
      try {
        const result = await test.test()
        results.push({ name: test.name, status: result ? 'success' : 'failed' })
      } catch (error) {
        results.push({ name: test.name, status: 'error', error: error.message })
      }
    }

    return results
  }
}

export const supabaseAI = new SupabaseAIService()
export default supabaseAI