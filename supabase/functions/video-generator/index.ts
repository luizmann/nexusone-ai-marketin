import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VideoGenerationRequest {
  script: string
  voice_id?: string
  avatar_id?: string
  language: 'en' | 'es' | 'pt' | 'ar' | 'he'
  style: 'professional' | 'casual' | 'energetic' | 'calm'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { script, voice_id, avatar_id, language, style }: VideoGenerationRequest = await req.json()
    
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    // Check user credits and video quota
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('credits, plan, video_quota')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      return new Response('User not found', { status: 404, headers: corsHeaders })
    }

    const creditsRequired = 25 // Video generation costs 25 credits
    if (userData.credits < creditsRequired) {
      return new Response('Insufficient credits', { status: 402, headers: corsHeaders })
    }

    if (userData.video_quota <= 0) {
      return new Response('Video quota exceeded', { status: 402, headers: corsHeaders })
    }

    // Create video job record
    const { data: videoJob, error: jobError } = await supabase
      .from('video_jobs')
      .insert({
        user_id: user.id,
        title: `Video - ${new Date().toISOString().split('T')[0]}`,
        script: {
          text: script,
          language,
          style,
          voice_id,
          avatar_id
        },
        status: 'processing'
      })
      .select()
      .single()

    if (jobError) {
      throw new Error('Failed to create video job')
    }

    // Step 1: Generate voice using ElevenLabs
    const voiceResponse = await generateVoice(script, voice_id || 'default', language)
    if (!voiceResponse.success) {
      throw new Error('Voice generation failed')
    }

    // Step 2: Create video with D-ID
    const videoResponse = await createVideo(voiceResponse.audio_url, avatar_id || 'default', style)
    if (!videoResponse.success) {
      throw new Error('Video generation failed')
    }

    // Poll for video completion
    const finalVideo = await pollVideoStatus(videoResponse.video_id)
    
    // Update video job with completion
    await supabase
      .from('video_jobs')
      .update({
        status: 'completed',
        video_url: finalVideo.video_url,
        thumbnail_url: finalVideo.thumbnail_url,
        duration: finalVideo.duration
      })
      .eq('id', videoJob.id)

    // Consume credits and video quota
    await supabase.rpc('consume_credits', {
      p_user_id: user.id,
      p_amount: creditsRequired,
      p_module: 'video_creator',
      p_description: 'Generated marketing video'
    })

    // Decrease video quota
    await supabase
      .from('users')
      .update({ video_quota: userData.video_quota - 1 })
      .eq('id', user.id)

    // Log usage analytics
    await supabase
      .from('usage_analytics')
      .insert({
        user_id: user.id,
        module: 'video_creator',
        action: 'generate_video',
        credits_consumed: creditsRequired,
        success: true,
        metadata: {
          video_id: videoJob.id,
          duration: finalVideo.duration,
          language,
          style
        }
      })

    return new Response(
      JSON.stringify({
        success: true,
        video_job_id: videoJob.id,
        video_url: finalVideo.video_url,
        thumbnail_url: finalVideo.thumbnail_url,
        duration: finalVideo.duration,
        credits_used: creditsRequired,
        remaining_credits: userData.credits - creditsRequired,
        remaining_videos: userData.video_quota - 1
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in video-generator:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function generateVoice(text: string, voiceId: string, language: string) {
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + voiceId, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('ELEVENLABS_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      }),
    })

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`)
    }

    const audioBlob = await response.blob()
    
    // Upload audio to Supabase Storage
    const fileName = `voice_${Date.now()}.mp3`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('ai-generated')
      .upload(fileName, audioBlob)

    if (uploadError) {
      throw new Error('Failed to upload audio')
    }

    const { data: { publicUrl } } = supabase.storage
      .from('ai-generated')
      .getPublicUrl(fileName)

    return {
      success: true,
      audio_url: publicUrl
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

async function createVideo(audioUrl: string, avatarId: string, style: string) {
  try {
    const response = await fetch('https://api.d-id.com/talks', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Deno.env.get('DID_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source_url: getAvatarUrl(avatarId),
        script: {
          type: 'audio',
          audio_url: audioUrl
        },
        config: {
          fluent: true,
          pad_audio: 0.0,
          stitch: true,
          result_format: 'mp4'
        }
      }),
    })

    if (!response.ok) {
      throw new Error(`D-ID API error: ${response.statusText}`)
    }

    const data = await response.json()
    
    return {
      success: true,
      video_id: data.id
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

async function pollVideoStatus(videoId: string, maxAttempts: number = 30): Promise<any> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await fetch(`https://api.d-id.com/talks/${videoId}`, {
        headers: {
          'Authorization': `Basic ${Deno.env.get('DID_API_KEY')}`,
        },
      })

      if (!response.ok) {
        throw new Error(`D-ID status check error: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.status === 'done') {
        return {
          video_url: data.result_url,
          thumbnail_url: data.thumbnail_url,
          duration: data.duration
        }
      } else if (data.status === 'error') {
        throw new Error('Video generation failed')
      }
      
      // Wait 10 seconds before next attempt
      await new Promise(resolve => setTimeout(resolve, 10000))
    } catch (error) {
      if (attempt === maxAttempts - 1) {
        throw error
      }
    }
  }
  
  throw new Error('Video generation timeout')
}

function getAvatarUrl(avatarId: string): string {
  const avatars = {
    'default': 'https://d-id-public-bucket.s3.amazonaws.com/avatars/default_avatar.jpg',
    'professional_male': 'https://d-id-public-bucket.s3.amazonaws.com/avatars/professional_male.jpg',
    'professional_female': 'https://d-id-public-bucket.s3.amazonaws.com/avatars/professional_female.jpg',
    'casual_male': 'https://d-id-public-bucket.s3.amazonaws.com/avatars/casual_male.jpg',
    'casual_female': 'https://d-id-public-bucket.s3.amazonaws.com/avatars/casual_female.jpg'
  }
  
  return avatars[avatarId] || avatars['default']
}