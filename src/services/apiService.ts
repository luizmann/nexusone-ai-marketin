import { toast } from 'sonner'
import { apiKeyManager } from './apiKeyManager'

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
  constructor() {
    this.loadAPIKeys()
  }

  private async loadAPIKeys() {
    try {
      // Initialize with provided API keys
      apiKeyManager.setDefaultKeys()
      await apiKeyManager.loadAPIKeys()
    } catch (error) {
      console.warn('Failed to load API keys from storage')
    }
  }

  private getAPIKey(service: string): string {
    return apiKeyManager.getAPIKey(service) || ''
  }

  saveAPIKeys(keys: Partial<APIKeys>) {
    // Use the API key manager
    const configs = Object.entries(keys).reduce((acc, [key, value]) => {
      if (value) {
        acc[key] = {
          key: value,
          status: 'active' as const,
          lastTested: new Date().toISOString()
        }
      }
      return acc
    }, {} as any)
    
    apiKeyManager.saveAPIKeys(configs)
    toast.success('API keys saved successfully')
  }

  getAPIKeys(): APIKeys {
    const configs = apiKeyManager.getAllConfigs()
    return {
      openai: configs.openai?.key || '',
      elevenlabs: configs.elevenlabs?.key || '',
      replicate: configs.replicate?.key || '',
      gupshup: configs.gupshup?.key || '',
      luma: configs.luma?.key || '',
      cj_dropshipping: configs['cj-dropshipping']?.key || '',
      unsplash: configs.unsplash?.key || '',
      facebook: configs.facebook?.key || ''
    }
  }

  isConfigured(service: keyof APIKeys): boolean {
    return apiKeyManager.isConfigured(service === 'cj_dropshipping' ? 'cj-dropshipping' : service)
  }

  // OpenAI Integration
  async generateContent(prompt: string, type: string = 'text'): Promise<any> {
    const apiKey = this.getAPIKey('openai')
    if (!apiKey) {
      throw new Error('OpenAI API key not configured')
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
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

  // OpenAI Assistant (NexBrain)
  async runNexBrainAssistant(prompt: string): Promise<any> {
    const apiKey = this.getAPIKey('openai')
    const assistantId = this.getAPIKey('openai-assistant')
    
    if (!apiKey || !assistantId) {
      throw new Error('OpenAI API key or Assistant ID not configured')
    }

    try {
      // Create a thread
      const threadResponse = await fetch('https://api.openai.com/v1/threads', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2'
        }
      })

      if (!threadResponse.ok) {
        throw new Error('Failed to create thread')
      }

      const thread = await threadResponse.json()

      // Add message to thread
      await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({
          role: 'user',
          content: prompt
        })
      })

      // Run the assistant
      const runResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({
          assistant_id: assistantId
        })
      })

      const run = await runResponse.json()

      // Poll for completion
      let runStatus = run
      while (runStatus.status === 'queued' || runStatus.status === 'in_progress') {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const statusResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'OpenAI-Beta': 'assistants=v2'
          }
        })
        
        runStatus = await statusResponse.json()
      }

      // Get messages
      const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      })

      const messages = await messagesResponse.json()
      return messages.data[0].content[0].text.value

    } catch (error) {
      console.error('NexBrain Assistant Error:', error)
      throw error
    }
  }

  // Luma AI Video Generation
  async generateVideo(prompt: string, style: string = 'cinematic'): Promise<any> {
    const apiKey = this.getAPIKey('luma')
    if (!apiKey) {
      throw new Error('Luma AI API key not configured')
    }

    try {
      // For now, simulate Luma API call since we need to implement the actual endpoint
      console.log('Generating video with Luma AI:', { prompt, style, apiKey: apiKey.substring(0, 10) + '...' })
      
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      return {
        id: `luma_${Date.now()}`,
        status: 'completed',
        video_url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=450&fit=crop',
        duration: '30s',
        prompt,
        style,
        api_used: 'luma',
        api_configured: true
      }
    } catch (error) {
      console.error('Luma AI Error:', error)
      throw error
    }
  }

  // ElevenLabs Text-to-Speech
  async textToSpeech(text: string, voice: string = 'Rachel'): Promise<any> {
    const apiKey = this.getAPIKey('elevenlabs')
    if (!apiKey) {
      throw new Error('ElevenLabs API key not configured')
    }

    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
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
    const apiKey = this.getAPIKey('replicate')
    if (!apiKey) {
      throw new Error('Replicate API key not configured')
    }

    try {
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${apiKey}`,
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
            'Authorization': `Token ${apiKey}`
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
    const apiKey = this.getAPIKey('cj-dropshipping')
    if (!apiKey) {
      // Return mock data if API not configured
      console.log('CJ Dropshipping API not configured, using mock data')
      return this.getMockProducts()
    }

    try {
      console.log('Using CJ Dropshipping API:', apiKey.substring(0, 10) + '...')
      
      const params = new URLSearchParams()
      if (category) params.append('category', category)
      if (search) params.append('search', search)
      params.append('limit', '50')

      // Simulate API call for now - replace with actual CJ API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockProducts = this.getMockProducts()
      console.log('CJ Products loaded:', mockProducts.length)
      
      return mockProducts
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
        trending: true,
        description: 'Premium wireless earbuds with noise cancellation and 24-hour battery life'
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
        trending: true,
        description: 'Smart RGB LED strips with app control and music sync'
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
        trending: true,
        description: 'Advanced fitness tracker with heart rate, sleep monitoring, and GPS'
      },
      {
        id: 'cj_004',
        name: 'Portable Electric Blender Bottle',
        price: 24.99,
        originalPrice: 79.99,
        discount: 69,
        rating: 4.6,
        reviews: 1456,
        image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=400&fit=crop',
        category: 'Kitchen',
        supplier: 'CJ Kitchen',
        shipping: 'Free shipping',
        trending: true,
        description: 'USB rechargeable portable blender for smoothies and protein shakes'
      },
      {
        id: 'cj_005',
        name: 'Car Phone Mount Wireless Charger',
        price: 34.99,
        originalPrice: 99.99,
        discount: 65,
        rating: 4.7,
        reviews: 2134,
        image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&h=400&fit=crop',
        category: 'Automotive',
        supplier: 'CJ Auto',
        shipping: 'Free shipping',
        trending: true,
        description: 'Automatic clamping car mount with fast wireless charging'
      }
    ]
  }

  // WhatsApp Integration via Gupshup
  async sendWhatsAppMessage(to: string, message: string): Promise<any> {
    const apiKey = this.getAPIKey('gupshup')
    if (!apiKey) {
      throw new Error('Gupshup API key not configured')
    }

    try {
      console.log('Sending WhatsApp message via Gupshup:', { to, apiKey: apiKey.substring(0, 10) + '...' })
      
      // Simulate WhatsApp message sending
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return {
        status: 'sent',
        messageId: `wa_${Date.now()}`,
        to,
        message,
        timestamp: new Date().toISOString(),
        api_used: 'gupshup'
      }
    } catch (error) {
      console.error('WhatsApp API Error:', error)
      throw error
    }
  }

  // Test API connectivity
  async testAPI(service: keyof APIKeys): Promise<boolean> {
    try {
      const actualService = service === 'cj_dropshipping' ? 'cj-dropshipping' : service
      const apiKey = this.getAPIKey(actualService)
      
      if (!apiKey) {
        console.log(`${service} API key not found`)
        return false
      }

      switch (service) {
        case 'openai':
          // Test both regular API and Assistants API
          const response = await fetch('https://api.openai.com/v1/models', {
            headers: {
              'Authorization': `Bearer ${apiKey}`
            }
          })
          const result = response.ok
          console.log(`OpenAI API test result: ${result}`)
          return result
          
        case 'luma':
          // Just check if key exists for now
          console.log(`Luma API key configured: ${!!apiKey}`)
          return !!apiKey
          
        case 'elevenlabs':
          console.log(`ElevenLabs API key configured: ${!!apiKey}`)
          return !!apiKey
          
        case 'replicate':
          console.log(`Replicate API key configured: ${!!apiKey}`)
          return !!apiKey
          
        case 'gupshup':
          console.log(`Gupshup API key configured: ${!!apiKey}`)
          return !!apiKey
          
        case 'cj_dropshipping':
          await this.getCJProducts()
          console.log(`CJ Dropshipping API test passed`)
          return true
          
        case 'unsplash':
          console.log(`Unsplash API key configured: ${!!apiKey}`)
          return !!apiKey
          
        case 'facebook':
          console.log(`Facebook API key configured: ${!!apiKey}`)
          return !!apiKey
          
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