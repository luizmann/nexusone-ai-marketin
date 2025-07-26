import { supabase } from '../config/supabase'

export interface LumaGenerationRequest {
  prompt: string
  aspect_ratio?: '16:9' | '1:1' | '9:16' | '4:3' | '3:4' | '21:9'
  loop?: boolean
  keyframes?: {
    frame0?: {
      type: 'generation' | 'image'
      url?: string
    }
    frame1?: {
      type: 'generation' | 'image'
      url?: string
    }
  }
  credits_cost?: number
}

export interface LumaGeneration {
  id: string
  user_id: string
  prompt: string
  aspect_ratio: string
  loop: boolean
  state: 'queued' | 'dreaming' | 'completed' | 'failed'
  video_url?: string
  thumbnail_url?: string
  width?: number
  height?: number
  failure_reason?: string
  credits_used: number
  luma_data?: any
  created_at: string
  updated_at: string
}

export interface LumaAPIResponse {
  success: boolean
  generation?: any
  generations?: LumaGeneration[]
  credits_used?: number
  error?: string
  message?: string
}

class LumaAIService {
  private baseUrl: string

  constructor() {
    // Use production URL when deployed, localhost for development
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-project.supabase.co/functions/v1'
      : 'http://localhost:54321/functions/v1'
  }

  private async makeRequest(action: string, options: RequestInit = {}): Promise<LumaAPIResponse> {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        throw new Error('Not authenticated')
      }

      const url = `${this.baseUrl}/luma-ai-video?action=${action}`
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'API request failed')
      }

      return result
    } catch (error) {
      console.error('Luma API request failed:', error)
      throw error
    }
  }

  async generateVideo(request: LumaGenerationRequest): Promise<LumaAPIResponse> {
    // Validate request
    if (!request.prompt || request.prompt.trim().length === 0) {
      throw new Error('Prompt is required')
    }

    if (request.prompt.length > 1000) {
      throw new Error('Prompt too long (max 1000 characters)')
    }

    return this.makeRequest('generate', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  async getGenerationStatus(generationId: string): Promise<LumaAPIResponse> {
    return this.makeRequest(`status&generation_id=${generationId}`)
  }

  async listGenerations(): Promise<LumaAPIResponse> {
    return this.makeRequest('list')
  }

  async cancelGeneration(generationId: string): Promise<LumaAPIResponse> {
    return this.makeRequest(`cancel&generation_id=${generationId}`, {
      method: 'POST',
    })
  }

  // Helper method to poll generation status until completion
  async pollGenerationStatus(
    generationId: string, 
    onProgress?: (generation: any) => void,
    maxAttempts: number = 60, // 5 minutes with 5-second intervals
    intervalMs: number = 5000
  ): Promise<any> {
    let attempts = 0
    
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          attempts++
          
          const response = await this.getGenerationStatus(generationId)
          const generation = response.generation
          
          if (onProgress) {
            onProgress(generation)
          }
          
          if (generation.state === 'completed') {
            resolve(generation)
            return
          }
          
          if (generation.state === 'failed') {
            reject(new Error(generation.failure_reason || 'Video generation failed'))
            return
          }
          
          if (attempts >= maxAttempts) {
            reject(new Error('Generation timeout - please check back later'))
            return
          }
          
          // Continue polling
          setTimeout(poll, intervalMs)
          
        } catch (error) {
          reject(error)
        }
      }
      
      poll()
    })
  }

  // Calculate credits needed based on parameters
  calculateCredits(
    aspect_ratio: string = '16:9',
    loop: boolean = false,
    hasKeyframes: boolean = false
  ): number {
    let credits = 30 // Base cost

    // Aspect ratio modifiers
    if (aspect_ratio === '4K' || aspect_ratio === '21:9') {
      credits += 20
    }

    // Loop video costs more
    if (loop) {
      credits += 10
    }

    // Keyframes cost more
    if (hasKeyframes) {
      credits += 15
    }

    return credits
  }

  // Get optimal settings recommendations
  getRecommendedSettings(prompt: string): {
    aspect_ratio: string
    loop: boolean
    estimated_credits: number
    tips: string[]
  } {
    const tips: string[] = []
    let aspect_ratio = '16:9'
    let loop = false

    // Analyze prompt for recommendations
    const lowerPrompt = prompt.toLowerCase()

    // Social media content
    if (lowerPrompt.includes('instagram') || lowerPrompt.includes('story')) {
      aspect_ratio = '9:16'
      tips.push('Using vertical format for Instagram Stories')
    } else if (lowerPrompt.includes('tiktok') || lowerPrompt.includes('short')) {
      aspect_ratio = '9:16'
      tips.push('Using vertical format for TikTok/Shorts')
    } else if (lowerPrompt.includes('square') || lowerPrompt.includes('1:1')) {
      aspect_ratio = '1:1'
      tips.push('Using square format for social posts')
    }

    // Loop recommendations
    if (lowerPrompt.includes('seamless') || lowerPrompt.includes('continuous') || 
        lowerPrompt.includes('cycle') || lowerPrompt.includes('repeat')) {
      loop = true
      tips.push('Loop enabled for seamless repetition')
    }

    // Quality tips
    if (lowerPrompt.length < 50) {
      tips.push('Consider adding more detail to your prompt for better results')
    }

    if (lowerPrompt.includes('text') || lowerPrompt.includes('words')) {
      tips.push('Luma AI works best with visual descriptions rather than text content')
    }

    const estimated_credits = this.calculateCredits(aspect_ratio, loop, false)

    return {
      aspect_ratio,
      loop,
      estimated_credits,
      tips
    }
  }

  // Get sample prompts for inspiration
  getSamplePrompts(): Array<{
    category: string
    title: string
    prompt: string
    aspect_ratio: string
    loop: boolean
    credits: number
  }> {
    return [
      {
        category: 'Product',
        title: 'Luxury Product Showcase',
        prompt: 'A sleek smartphone rotating 360 degrees on a marble surface with dramatic studio lighting and subtle reflections',
        aspect_ratio: '16:9',
        loop: true,
        credits: 40
      },
      {
        category: 'Nature',
        title: 'Ocean Waves',
        prompt: 'Gentle ocean waves rolling onto a pristine sandy beach at golden hour with seagulls flying overhead',
        aspect_ratio: '16:9',
        loop: false,
        credits: 30
      },
      {
        category: 'Abstract',
        title: 'Fluid Art',
        prompt: 'Colorful liquid paint flowing and mixing in slow motion with vibrant blues, purples, and gold creating mesmerizing patterns',
        aspect_ratio: '1:1',
        loop: true,
        credits: 40
      },
      {
        category: 'Food',
        title: 'Cooking Process',
        prompt: 'Fresh ingredients being chopped and sautéed in a professional kitchen with steam rising and sizzling sounds',
        aspect_ratio: '16:9',
        loop: false,
        credits: 30
      },
      {
        category: 'Tech',
        title: 'Futuristic Interface',
        prompt: 'Holographic data visualization with floating geometric shapes and glowing particles in a dark sci-fi environment',
        aspect_ratio: '16:9',
        loop: true,
        credits: 45
      },
      {
        category: 'Fashion',
        title: 'Fabric Movement',
        prompt: 'Flowing silk fabric billowing in slow motion against a minimalist background with soft natural lighting',
        aspect_ratio: '9:16',
        loop: false,
        credits: 35
      }
    ]
  }
}

// Export singleton instance
export const lumaAI = new LumaAIService()
export default lumaAI