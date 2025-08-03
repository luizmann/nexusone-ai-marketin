/**
 * NexusOneAI Edge Function: Luma AI Video Generation
 * Generates professional marketing videos using Luma AI
 */

import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VideoGenerationRequest {
  type: 'product_demo' | 'social_short' | 'avatar_promo' | 'explainer'
  title: string
  description: string
  config: {
    duration: number
    aspectRatio: string
    style: string
    voiceScript?: string
    productImages?: string[]
    targetAudience?: string
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get user from JWT
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) {
      throw new Error('Unauthorized')
    }

    const body: VideoGenerationRequest = await req.json()
    const { type, title, description, config } = body

    // Check user credits and video quota
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('credits, video_quota, plan')
      .eq('user_id', user.id)
      .single()

    if (!profile) {
      throw new Error('User profile not found')
    }

    // Calculate credits needed based on video type and duration
    const creditsNeeded = calculateVideoCredits(type, config.duration)
    
    if (profile.credits < creditsNeeded) {
      throw new Error('Insufficient credits')
    }

    if (profile.video_quota <= 0) {
      throw new Error('Video quota exceeded')
    }

    // Create video record in database
    const { data: videoRecord, error: insertError } = await supabase
      .from('videos')
      .insert({
        user_id: user.id,
        title,
        type,
        status: 'generating',
        ai_provider: 'luma',
        duration: config.duration,
        aspect_ratio: config.aspectRatio,
        config: {
          ...config,
          description
        }
      })
      .select()
      .single()

    if (insertError) {
      throw new Error('Failed to create video record')
    }

    // Generate video with Luma AI
    try {
      // Prepare Luma AI request
      const lumaPrompt = buildLumaPrompt(type, description, config)
      
      const lumaResponse = await fetch('https://api.lumalabs.ai/dream-machine/v1/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('LUMA_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: lumaPrompt,
          aspect_ratio: config.aspectRatio,
          loop: false,
          keyframes: config.productImages ? {
            frame0: {
              type: 'image',
              url: config.productImages[0]
            }
          } : undefined
        }),
      })

      if (!lumaResponse.ok) {
        const error = await lumaResponse.text()
        console.error('Luma AI Error:', error)
        throw new Error('Failed to generate video with Luma AI')
      }

      const lumaData = await lumaResponse.json()
      const generationId = lumaData.id

      // Start polling for completion
      const videoUrl = await pollLumaGeneration(generationId)

      // Update video record with results
      await supabase
        .from('videos')
        .update({
          status: 'completed',
          url: videoUrl,
          thumbnail: `${videoUrl}_thumbnail.jpg`,
          generation_params: {
            luma_generation_id: generationId,
            prompt: lumaPrompt
          }
        })
        .eq('id', videoRecord.id)

      // Deduct credits and video quota
      await supabase
        .from('user_profiles')
        .update({
          credits: profile.credits - creditsNeeded,
          video_quota: profile.video_quota - 1
        })
        .eq('user_id', user.id)

      // Log usage
      await supabase
        .from('usage_logs')
        .insert({
          user_id: user.id,
          action: 'video_generation',
          credits_used: creditsNeeded,
          api_service: 'luma',
          metadata: {
            video_id: videoRecord.id,
            type,
            duration: config.duration,
            generation_id: generationId
          }
        })

      return new Response(
        JSON.stringify({
          video_id: videoRecord.id,
          video_url: videoUrl,
          thumbnail: `${videoUrl}_thumbnail.jpg`,
          credits_used: creditsNeeded,
          remaining_credits: profile.credits - creditsNeeded,
          remaining_quota: profile.video_quota - 1
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )

    } catch (generationError) {
      console.error('Video generation error:', generationError)
      
      // Update video record with error
      await supabase
        .from('videos')
        .update({
          status: 'failed',
          error_message: generationError.message
        })
        .eq('id', videoRecord.id)

      throw generationError
    }

  } catch (error) {
    console.error('Video Generation Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

function calculateVideoCredits(type: string, duration: number): number {
  const baseCredits = {
    'product_demo': 25,
    'social_short': 15,
    'avatar_promo': 35,
    'explainer': 30
  }
  
  const base = baseCredits[type as keyof typeof baseCredits] || 25
  const durationMultiplier = Math.ceil(duration / 30) // Extra credits for longer videos
  
  return base * durationMultiplier
}

function buildLumaPrompt(type: string, description: string, config: any): string {
  let prompt = ''

  switch (type) {
    case 'product_demo':
      prompt = `Create a professional product demonstration video showing ${description}. 
                Style: ${config.style}, clean and modern presentation with smooth camera movements. 
                Focus on product features and benefits. High quality, commercial-grade visuals.`
      break
    
    case 'social_short':
      prompt = `Generate an engaging short-form video for social media about ${description}. 
                Style: ${config.style}, energetic and attention-grabbing. Quick cuts, vibrant colors. 
                Perfect for TikTok, Instagram Reels, YouTube Shorts.`
      break
    
    case 'avatar_promo':
      prompt = `Create a promotional video with an AI avatar presenter talking about ${description}. 
                Professional spokesperson style, clear articulation, engaging presentation. 
                Studio background, good lighting.`
      break
    
    case 'explainer':
      prompt = `Generate an explainer video that clearly demonstrates ${description}. 
                Educational style with smooth animations, clear visuals, and easy-to-follow content. 
                Professional and informative.`
      break
  }

  if (config.targetAudience) {
    prompt += ` Target audience: ${config.targetAudience}.`
  }

  return prompt
}

async function pollLumaGeneration(generationId: string): Promise<string> {
  const maxAttempts = 60 // 5 minutes with 5-second intervals
  let attempts = 0

  while (attempts < maxAttempts) {
    try {
      const response = await fetch(`https://api.lumalabs.ai/dream-machine/v1/generations/${generationId}`, {
        headers: {
          'Authorization': `Bearer ${Deno.env.get('LUMA_API_KEY')}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to check generation status')
      }

      const data = await response.json()

      if (data.state === 'completed') {
        return data.assets.video
      } else if (data.state === 'failed') {
        throw new Error('Video generation failed')
      }

      // Wait 5 seconds before next poll
      await new Promise(resolve => setTimeout(resolve, 5000))
      attempts++

    } catch (error) {
      console.error('Polling error:', error)
      attempts++
      await new Promise(resolve => setTimeout(resolve, 5000))
    }
  }

  throw new Error('Video generation timeout')
}