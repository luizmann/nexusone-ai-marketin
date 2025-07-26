import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LumaGenerationRequest {
  prompt: string
  quality: '720p' | '1080p' | '4K'
  style: 'cinematic' | 'commercial' | 'realistic' | 'artistic'
  aspect_ratio?: '16:9' | '9:16' | '1:1'
  duration?: number
  seed?: number
}

interface LumaGenerationResponse {
  id: string
  state: 'queued' | 'processing' | 'completed' | 'failed'
  video_url?: string
  thumbnail_url?: string
  created_at: string
  completed_at?: string
  failure_reason?: string
}

class LumaAIService {
  private apiKey: string
  private baseUrl = 'https://api.lumalabs.ai/dream-machine/v1'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async generateVideo(request: LumaGenerationRequest): Promise<LumaGenerationResponse> {
    const response = await fetch(`${this.baseUrl}/generations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: request.prompt,
        aspect_ratio: request.aspect_ratio || '16:9',
        loop: false,
        keyframes: {
          frame0: {
            type: 'generation',
            prompt: request.prompt
          }
        }
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Luma AI API error: ${error}`)
    }

    return await response.json()
  }

  async getGeneration(generationId: string): Promise<LumaGenerationResponse> {
    const response = await fetch(`${this.baseUrl}/generations/${generationId}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to get generation: ${response.statusText}`)
    }

    return await response.json()
  }

  async listGenerations(limit = 10): Promise<{ generations: LumaGenerationResponse[] }> {
    const response = await fetch(`${this.baseUrl}/generations?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to list generations: ${response.statusText}`)
    }

    return await response.json()
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the current user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    const { action, ...params } = await req.json()
    
    // Get Luma AI API key from environment or user settings
    const lumaApiKey = Deno.env.get('LUMA_API_KEY')
    
    if (!lumaApiKey) {
      return new Response(
        JSON.stringify({ error: 'Luma AI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const lumaService = new LumaAIService(lumaApiKey)

    switch (action) {
      case 'generate': {
        const { prompt, quality, style, aspect_ratio } = params

        // Calculate credits needed
        let creditsNeeded = 20
        if (quality === '1080p') creditsNeeded = 30
        if (quality === '4K') creditsNeeded = 50
        if (style === 'cinematic') creditsNeeded += 10
        if (style === 'artistic') creditsNeeded += 5

        // Check user credits
        const { data: userProfile } = await supabaseClient
          .from('user_profiles')
          .select('credits')
          .eq('user_id', user.id)
          .single()

        if (!userProfile || userProfile.credits < creditsNeeded) {
          return new Response(
            JSON.stringify({ error: 'Insufficient credits' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Generate video
        const generation = await lumaService.generateVideo({
          prompt,
          quality,
          style,
          aspect_ratio: aspect_ratio || '16:9'
        })

        // Deduct credits
        await supabaseClient
          .from('user_profiles')
          .update({ credits: userProfile.credits - creditsNeeded })
          .eq('user_id', user.id)

        // Save generation record
        await supabaseClient
          .from('luma_generations')
          .insert({
            user_id: user.id,
            generation_id: generation.id,
            prompt,
            quality,
            style,
            status: generation.state,
            credits_used: creditsNeeded,
            created_at: new Date().toISOString()
          })

        // Log credits usage
        await supabaseClient
          .from('credits_log')
          .insert({
            user_id: user.id,
            amount: -creditsNeeded,
            module: 'luma-video',
            description: `Video generation: ${prompt.slice(0, 50)}...`,
            created_at: new Date().toISOString()
          })

        return new Response(
          JSON.stringify({ 
            success: true, 
            generation,
            credits_used: creditsNeeded 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'status': {
        const { generationId } = params

        // Check if user owns this generation
        const { data: userGeneration } = await supabaseClient
          .from('luma_generations')
          .select('*')
          .eq('user_id', user.id)
          .eq('generation_id', generationId)
          .single()

        if (!userGeneration) {
          return new Response(
            JSON.stringify({ error: 'Generation not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        // Get latest status from Luma AI
        const generation = await lumaService.getGeneration(generationId)

        // Update database if status changed
        if (generation.state !== userGeneration.status) {
          await supabaseClient
            .from('luma_generations')
            .update({
              status: generation.state,
              video_url: generation.video_url,
              thumbnail_url: generation.thumbnail_url,
              completed_at: generation.completed_at
            })
            .eq('generation_id', generationId)
        }

        return new Response(
          JSON.stringify({ success: true, generation }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'list': {
        // Get user's generations from database
        const { data: generations } = await supabaseClient
          .from('luma_generations')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20)

        return new Response(
          JSON.stringify({ success: true, generations }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'delete': {
        const { generationId } = params

        // Delete from database
        const { error } = await supabaseClient
          .from('luma_generations')
          .delete()
          .eq('user_id', user.id)
          .eq('generation_id', generationId)

        if (error) {
          throw error
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

  } catch (error) {
    console.error('Luma AI function error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.toString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})