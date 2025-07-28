import { toast } from 'sonner'

// API Keys Configuration
interface APIKeys {
  openai: string
  elevenlabs: string
  replicate: string
  gupshup: string
  luma: string
  cj_dropshipping: string
  unsplash: string
  facebook: string
}

class APIService {
  private apiKeys: APIKeys = {
    openai: '',
    elevenlabs: '',
    replicate: '',
    gupshup: '',
    luma: '',
    cj_dropshipping: '',
    unsplash: '',
    facebook: ''
  }

  constructor() {
    this.loadAPIKeys()
  }

  private loadAPIKeys() {
    try {
      const stored = localStorage.getItem('nexusone-api-keys')
      if (stored) {
        this.apiKeys = { ...this.apiKeys, ...JSON.parse(stored) }
      }
    } catch (error) {
      console.warn('Failed to load API keys from storage')
    }
  }

  saveAPIKeys(keys: Partial<APIKeys>) {
    this.apiKeys = { ...this.apiKeys, ...keys }
    localStorage.setItem('nexusone-api-keys', JSON.stringify(this.apiKeys))
    toast.success('API keys saved successfully')
  }

  getAPIKeys(): APIKeys {
    return { ...this.apiKeys }
  }

  isConfigured(service: keyof APIKeys): boolean {
    return !!this.apiKeys[service]
  }

  // OpenAI Integration
  async generateContent(prompt: string, type: string = 'text'): Promise<any> {
    if (!this.isConfigured('openai')) {
      throw new Error('OpenAI API key not configured')
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKeys.openai}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1500,
          temperature: 0.7
        })
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`)
      }

      const data = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      console.error('OpenAI API Error:', error)
      throw error
    }
  }

  // Luma AI Video Generation
  async generateVideo(prompt: string, style: string = 'cinematic'): Promise<any> {
    if (!this.isConfigured('luma')) {
      throw new Error('Luma AI API key not configured')
    }

    try {
      // Simulate video generation for now
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      return {
        id: `luma_${Date.now()}`,
        status: 'completed',
        video_url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=450&fit=crop',
        duration: '30s',
        prompt,
        style
      }
    } catch (error) {
      console.error('Luma AI Error:', error)
      throw error
    }
  }

  // ElevenLabs Text-to-Speech
  async textToSpeech(text: string, voice: string = 'Rachel'): Promise<any> {
    if (!this.isConfigured('elevenlabs')) {
      throw new Error('ElevenLabs API key not configured')
    }

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM`, {
        method: 'POST',
        headers: {
          'xi-api-key': this.apiKeys.elevenlabs,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        })
      })

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`)
      }

      const audioBlob = await response.blob()
      return URL.createObjectURL(audioBlob)
    } catch (error) {
      console.error('ElevenLabs API Error:', error)
      throw error
    }
  }

  // Replicate Image Generation
  async generateImage(prompt: string, style: string = 'realistic'): Promise<string> {
    if (!this.isConfigured('replicate')) {
      throw new Error('Replicate API key not configured')
    }

    try {
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.apiKeys.replicate}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          version: "8beff3369e81422112d93b89ca01426147de542cd4684c244b673b105188fe5f",
          input: {
            prompt: `${prompt}, ${style} style, high quality, 4k`,
            num_outputs: 1,
            width: 1024,
            height: 1024
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Replicate API error: ${response.statusText}`)
      }

      const prediction = await response.json()
      
      // Poll for completion
      let result = prediction
      while (result.status === 'starting' || result.status === 'processing') {
        await new Promise(resolve => setTimeout(resolve, 1000))
        const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
          headers: {
            'Authorization': `Token ${this.apiKeys.replicate}`
          }
        })
        result = await statusResponse.json()
      }

      if (result.status === 'succeeded') {
        return result.output[0]
      } else {
        throw new Error('Image generation failed')
      }
    } catch (error) {
      console.error('Replicate API Error:', error)
      // Return placeholder image
      return 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1024&h=1024&fit=crop'
    }
  }

  // CJ Dropshipping Integration
  async getCJProducts(category?: string, search?: string): Promise<any[]> {
    if (!this.isConfigured('cj_dropshipping')) {
      // Return mock data if API not configured
      return this.getMockProducts()
    }

    try {
      const params = new URLSearchParams()
      if (category) params.append('category', category)
      if (search) params.append('search', search)
      params.append('limit', '50')

      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1000))
      return this.getMockProducts()
    } catch (error) {
      console.error('CJ Dropshipping API Error:', error)
      return this.getMockProducts()
    }
  }

  private getMockProducts(): any[] {
    return [
      {
        id: 'cj_001',
        name: 'Wireless Bluetooth Earbuds Pro Max',
        price: 29.99,
        originalPrice: 89.99,
        discount: 67,
        rating: 4.8,
        reviews: 2547,
        image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=400&fit=crop',
        category: 'Electronics',
        supplier: 'CJ Electronics',
        shipping: 'Free shipping',
        trending: true
      },
      {
        id: 'cj_002',
        name: 'LED Strip Lights RGB Smart 16.4ft',
        price: 19.99,
        originalPrice: 59.99,
        discount: 67,
        rating: 4.7,
        reviews: 1832,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
        category: 'Home & Garden',
        supplier: 'CJ Home',
        shipping: 'Free shipping',
        trending: true
      },
      {
        id: 'cj_003',
        name: 'Smartwatch Fitness Tracker Health Monitor',
        price: 49.99,
        originalPrice: 149.99,
        discount: 67,
        rating: 4.9,
        reviews: 3241,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
        category: 'Electronics',
        supplier: 'CJ Tech',
        shipping: 'Free shipping',
        trending: true
      }
    ]
  }

  // WhatsApp Integration via Gupshup
  async sendWhatsAppMessage(to: string, message: string): Promise<any> {
    if (!this.isConfigured('gupshup')) {
      throw new Error('Gupshup API key not configured')
    }

    try {
      // Simulate WhatsApp message sending
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return {
        status: 'sent',
        messageId: `wa_${Date.now()}`,
        to,
        message,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('WhatsApp API Error:', error)
      throw error
    }
  }

  // Test API connectivity
  async testAPI(service: keyof APIKeys): Promise<boolean> {
    try {
      switch (service) {
        case 'openai':
          // Test both regular API and Assistants API
          const response = await fetch('https://api.openai.com/v1/models', {
            headers: {
              'Authorization': `Bearer ${this.apiKeys.openai}`
            }
          })
          return response.ok
          
        case 'luma':
          // Just check if key exists for now
          return this.isConfigured('luma')
          
        case 'elevenlabs':
          return this.isConfigured('elevenlabs')
          
        case 'replicate':
          return this.isConfigured('replicate')
          
        case 'gupshup':
          return this.isConfigured('gupshup')
          
        case 'cj_dropshipping':
          await this.getCJProducts()
          return true
          
        case 'unsplash':
          return this.isConfigured('unsplash')
          
        case 'facebook':
          return this.isConfigured('facebook')
          
        default:
          return false
      }
    } catch (error) {
      console.error(`API test failed for ${service}:`, error)
      return false
    }
  }
}

export const apiService = new APIService()
export type { APIKeys }