import { createClient } from '@supabase/supabase-js'

// API Configuration service
export class APIService {
  private supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL || '',
    import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  )

  // Get user's API configurations
  async getAPIConfigurations(userId: string) {
    const { data, error } = await this.supabase
      .from('api_configurations')
      .select('*')
      .eq('user_id', userId)
      .eq('enabled', true)

    if (error) throw error
    return data
  }

  // Save API configuration
  async saveAPIConfiguration(apiConfig: {
    apiName: string
    apiKey: string
    enabled: boolean
    status: string
  }) {
    const { data, error } = await this.supabase
      .from('api_configurations')
      .upsert({
        api_name: apiConfig.apiName,
        api_key: apiConfig.apiKey,
        enabled: apiConfig.enabled,
        status: apiConfig.status
      })

    if (error) throw error
    return data
  }

  // Test API connection
  async testAPIConnection(apiName: string, apiKey: string, endpoint: string) {
    const { data, error } = await this.supabase.functions.invoke('test-api-connection', {
      body: { apiName, apiKey, endpoint }
    })

    if (error) throw error
    return data
  }

  // Make API call through proxy
  async makeAPICall(
    apiName: string,
    endpoint: string,
    method: string = 'GET',
    data?: any,
    parameters?: Record<string, any>
  ) {
    const { data: response, error } = await this.supabase.functions.invoke('api-proxy', {
      body: { apiName, endpoint, method, data, parameters }
    })

    if (error) throw error
    return response
  }

  // Chat with NexBrain
  async chatWithNexBrain(message: string, context?: any) {
    const { data, error } = await this.supabase.functions.invoke('nexbrain-chat', {
      body: { message, context }
    })

    if (error) throw error
    return data
  }

  // Get API usage statistics
  async getAPIUsage(userId: string, timeframe: 'day' | 'week' | 'month' = 'day') {
    const { data, error } = await this.supabase
      .from('api_usage')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', this.getTimeframeDate(timeframe))
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  // Get API limits
  async getAPILimits(userId: string) {
    const { data, error } = await this.supabase
      .from('api_limits')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error
    return data
  }

  private getTimeframeDate(timeframe: 'day' | 'week' | 'month'): string {
    const now = new Date()
    switch (timeframe) {
      case 'day':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
      case 'month':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
      default:
        return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()
    }
  }
}

// AI Generation service
export class AIGenerationService extends APIService {
  // Generate text with OpenAI
  async generateText(prompt: string, model: string = 'gpt-4') {
    return this.makeAPICall('OpenAI', '/chat/completions', 'POST', {
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000
    })
  }

  // Generate image with DALL-E
  async generateImage(prompt: string, size: string = '1024x1024') {
    return this.makeAPICall('OpenAI', '/images/generations', 'POST', {
      prompt,
      n: 1,
      size
    })
  }

  // Generate voice with ElevenLabs
  async generateVoice(text: string, voiceId: string = 'EXAVITQu4vr4xnSDxMaL') {
    return this.makeAPICall('ElevenLabs', `/text-to-speech/${voiceId}`, 'POST', {
      text,
      model_id: 'eleven_monolingual_v1'
    })
  }

  // Generate video with Luma AI
  async generateVideo(prompt: string) {
    return this.makeAPICall('Luma AI', '/generations', 'POST', {
      prompt,
      aspect_ratio: '16:9'
    })
  }

  // Get generation status
  async getGenerationStatus(apiName: string, generationId: string) {
    return this.makeAPICall(apiName, `/generations/${generationId}`, 'GET')
  }
}

// WhatsApp service
export class WhatsAppService extends APIService {
  // Send WhatsApp message
  async sendMessage(phoneNumber: string, message: string) {
    return this.makeAPICall('Gupshup WhatsApp', '/api/v1/msg', 'POST', {
      channel: 'whatsapp',
      source: '+1234567890', // This should be configured
      destination: phoneNumber,
      message: {
        type: 'text',
        text: message
      }
    })
  }

  // Get WhatsApp users
  async getUsers() {
    return this.makeAPICall('Gupshup WhatsApp', '/api/v1/users', 'GET')
  }

  // Create WhatsApp template
  async createTemplate(templateData: any) {
    return this.makeAPICall('Gupshup WhatsApp', '/api/v1/template', 'POST', templateData)
  }
}

// E-commerce service
export class EcommerceService extends APIService {
  // Get CJ Dropshipping products
  async getCJProducts(pageNum: number = 1, pageSize: number = 20, filters?: any) {
    return this.makeAPICall('CJ Dropshipping', '/v1/product/list', 'POST', {
      pageNum,
      pageSize,
      ...filters
    })
  }

  // Get product details
  async getProductDetail(productId: string) {
    return this.makeAPICall('CJ Dropshipping', '/v1/product/query', 'POST', {
      pid: productId
    })
  }

  // Create order
  async createOrder(orderData: any) {
    return this.makeAPICall('CJ Dropshipping', '/v1/shopping/order/createOrder', 'POST', orderData)
  }

  // Get order status
  async getOrderStatus(orderId: string) {
    return this.makeAPICall('CJ Dropshipping', '/v1/shopping/order/getOrderDetail', 'POST', {
      orderId
    })
  }
}

// Social Media Marketing service
export class SocialMediaService extends APIService {
  // Get Facebook ad accounts
  async getFacebookAdAccounts() {
    return this.makeAPICall('Facebook Marketing', '/me/adaccounts', 'GET')
  }

  // Create Facebook campaign
  async createFacebookCampaign(adAccountId: string, campaignData: any) {
    return this.makeAPICall('Facebook Marketing', `/${adAccountId}/campaigns`, 'POST', campaignData)
  }

  // Create Facebook ad set
  async createFacebookAdSet(adAccountId: string, adSetData: any) {
    return this.makeAPICall('Facebook Marketing', `/${adAccountId}/adsets`, 'POST', adSetData)
  }

  // Create Facebook ad
  async createFacebookAd(adAccountId: string, adData: any) {
    return this.makeAPICall('Facebook Marketing', `/${adAccountId}/ads`, 'POST', adData)
  }
}

// Media service
export class MediaService extends APIService {
  // Search Unsplash photos
  async searchUnsplashPhotos(query: string, page: number = 1, perPage: number = 10) {
    return this.makeAPICall('Unsplash', '/search/photos', 'GET', null, {
      query,
      page,
      per_page: perPage
    })
  }

  // Get Unsplash photo download URL
  async getUnsplashDownloadURL(photoId: string) {
    return this.makeAPICall('Unsplash', `/photos/${photoId}/download`, 'GET')
  }

  // Search Pexels photos
  async searchPexelsPhotos(query: string, page: number = 1, perPage: number = 15) {
    return this.makeAPICall('Pexels', '/search', 'GET', null, {
      query,
      page,
      per_page: perPage
    })
  }
}

// Export singleton instances
export const apiService = new APIService()
export const aiService = new AIGenerationService()
export const whatsappService = new WhatsAppService()
export const ecommerceService = new EcommerceService()
export const socialMediaService = new SocialMediaService()
export const mediaService = new MediaService()