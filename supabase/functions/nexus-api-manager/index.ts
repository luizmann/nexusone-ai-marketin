import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

interface ApiRequest {
  action: string
  payload: any
  userId?: string
}

interface ApiResponse {
  success: boolean
  data?: any
  error?: string
  creditsUsed?: number
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, payload, userId } = await req.json() as ApiRequest

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify user authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Invalid authentication')
    }

    // Route to appropriate service
    let result: any = null
    let creditsUsed = 0

    switch (action) {
      case 'openai_completion':
        result = await handleOpenAI(payload)
        creditsUsed = 10
        break
        
      case 'openai_assistant':
        result = await handleOpenAIAssistant(payload)
        creditsUsed = 15
        break
        
      case 'elevenlabs_tts':
        result = await handleElevenLabs(payload)
        creditsUsed = 5
        break
        
      case 'replicate_image':
        result = await handleReplicate(payload)
        creditsUsed = 8
        break
        
      case 'luma_video':
        result = await handleLumaVideo(payload)
        creditsUsed = 25
        break
        
      case 'gupshup_whatsapp':
        result = await handleGupShupWhatsApp(payload)
        creditsUsed = 3
        break
        
      case 'cj_dropshipping':
        result = await handleCJDropshipping(payload)
        creditsUsed = 2
        break
        
      case 'facebook_ads':
        result = await handleFacebookAds(payload)
        creditsUsed = 12
        break
        
      case 'unsplash_photos':
        result = await handleUnsplash(payload)
        creditsUsed = 1
        break
        
      default:
        throw new Error(`Unknown action: ${action}`)
    }

    // Deduct credits from user
    await deductCredits(supabase, user.id, creditsUsed)

    // Log usage
    await logUsage(supabase, user.id, action, creditsUsed)

    return new Response(
      JSON.stringify({
        success: true,
        data: result,
        creditsUsed
      } as ApiResponse),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('API Manager Error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      } as ApiResponse),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})

// OpenAI Standard Completion
async function handleOpenAI(payload: any) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: payload.model || 'gpt-4o',
      messages: payload.messages,
      max_tokens: payload.max_tokens || 2000,
      temperature: payload.temperature || 0.7,
      ...payload.options
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`)
  }

  return await response.json()
}

// OpenAI Assistant (NexBrain)
async function handleOpenAIAssistant(payload: any) {
  const { userPrompt } = payload
  
  // Create thread
  const threadResponse = await fetch('https://api.openai.com/v1/threads', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'assistants=v2'
    },
    body: JSON.stringify({})
  })
  
  const thread = await threadResponse.json()
  
  // Add message
  await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'assistants=v2'
    },
    body: JSON.stringify({
      role: 'user',
      content: userPrompt
    })
  })
  
  // Run assistant
  const runResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
      'OpenAI-Beta': 'assistants=v2'
    },
    body: JSON.stringify({
      assistant_id: Deno.env.get('OPENAI_ASSISTANT_ID')
    })
  })
  
  const run = await runResponse.json()
  
  // Wait for completion
  let status = 'queued'
  while (status !== 'completed') {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const statusResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`, {
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    })
    
    const statusData = await statusResponse.json()
    status = statusData.status
    
    if (status === 'failed') {
      throw new Error('Assistant run failed')
    }
  }
  
  // Get messages
  const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'OpenAI-Beta': 'assistants=v2'
    }
  })
  
  const messages = await messagesResponse.json()
  return messages.data[0].content[0].text.value
}

// ElevenLabs Text-to-Speech
async function handleElevenLabs(payload: any) {
  const { text, voice_id = 'pNInz6obpgDQGcFmaJgB' } = payload
  
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`, {
    method: 'POST',
    headers: {
      'xi-api-key': Deno.env.get('ELEVENLABS_API_KEY') || '',
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

  const audioBuffer = await response.arrayBuffer()
  return {
    audio: Array.from(new Uint8Array(audioBuffer)),
    contentType: 'audio/mpeg'
  }
}

// Replicate Image Generation
async function handleReplicate(payload: any) {
  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${Deno.env.get('REPLICATE_API_TOKEN')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: payload.version || 'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
      input: payload.input
    }),
  })

  if (!response.ok) {
    throw new Error(`Replicate API error: ${response.statusText}`)
  }

  return await response.json()
}

// Luma Video Generation
async function handleLumaVideo(payload: any) {
  const { prompt, aspect_ratio = '16:9', loop = false } = payload
  
  const response = await fetch('https://api.lumalabs.ai/dream-machine/v1/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('LUMA_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      aspect_ratio,
      loop
    }),
  })

  if (!response.ok) {
    throw new Error(`Luma API error: ${response.statusText}`)
  }

  const result = await response.json()
  
  // Poll for completion
  let status = 'pending'
  let generationData = result
  
  while (status === 'pending' || status === 'processing') {
    await new Promise(resolve => setTimeout(resolve, 5000))
    
    const statusResponse = await fetch(`https://api.lumalabs.ai/dream-machine/v1/generations/${result.id}`, {
      headers: {
        'Authorization': `Bearer ${Deno.env.get('LUMA_API_KEY')}`,
      }
    })
    
    generationData = await statusResponse.json()
    status = generationData.state
  }
  
  return generationData
}

// GupShup WhatsApp
async function handleGupShupWhatsApp(payload: any) {
  const { phone, message, type = 'text' } = payload
  
  const response = await fetch('https://api.gupshup.io/sm/api/v1/msg', {
    method: 'POST',
    headers: {
      'apikey': Deno.env.get('GUPSHUP_API_KEY') || '',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      channel: 'whatsapp',
      source: '917834811114', // Your WhatsApp number
      destination: phone,
      message: JSON.stringify({
        type,
        text: message
      })
    }),
  })

  if (!response.ok) {
    throw new Error(`GupShup API error: ${response.statusText}`)
  }

  return await response.json()
}

// CJ Dropshipping
async function handleCJDropshipping(payload: any) {
  const { action: cjAction, ...params } = payload
  
  let endpoint = ''
  switch (cjAction) {
    case 'search_products':
      endpoint = '/product/search'
      break
    case 'get_product':
      endpoint = `/product/variant/${params.vid}`
      break
    case 'create_order':
      endpoint = '/order/createOrder'
      break
    default:
      throw new Error(`Unknown CJ action: ${cjAction}`)
  }
  
  const response = await fetch(`https://developers.cjdropshipping.com/api2.0${endpoint}`, {
    method: 'POST',
    headers: {
      'CJ-Access-Token': Deno.env.get('CJ_DROPSHIPPING_API_KEY') || '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    throw new Error(`CJ Dropshipping API error: ${response.statusText}`)
  }

  return await response.json()
}

// Facebook Ads
async function handleFacebookAds(payload: any) {
  const { action: fbAction, ...params } = payload
  
  let endpoint = ''
  let method = 'GET'
  
  switch (fbAction) {
    case 'create_campaign':
      endpoint = `/act_${params.ad_account_id}/campaigns`
      method = 'POST'
      break
    case 'create_adset':
      endpoint = `/act_${params.ad_account_id}/adsets`
      method = 'POST'
      break
    case 'create_ad':
      endpoint = `/act_${params.ad_account_id}/ads`
      method = 'POST'
      break
    default:
      throw new Error(`Unknown Facebook action: ${fbAction}`)
  }
  
  const response = await fetch(`https://graph.facebook.com/v18.0${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${Deno.env.get('FACEBOOK_ACCESS_TOKEN')}`,
      'Content-Type': 'application/json',
    },
    body: method === 'POST' ? JSON.stringify(params) : undefined,
  })

  if (!response.ok) {
    throw new Error(`Facebook API error: ${response.statusText}`)
  }

  return await response.json()
}

// Unsplash Photos
async function handleUnsplash(payload: any) {
  const { query, per_page = 30 } = payload
  
  const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${per_page}`, {
    headers: {
      'Authorization': `Client-ID ${Deno.env.get('UNSPLASH_ACCESS_KEY')}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Unsplash API error: ${response.statusText}`)
  }

  return await response.json()
}

// Helper function to deduct credits
async function deductCredits(supabase: any, userId: string, amount: number) {
  const { error } = await supabase.rpc('deduct_user_credits', {
    user_id: userId,
    amount: amount
  })
  
  if (error) {
    throw new Error(`Failed to deduct credits: ${error.message}`)
  }
}

// Helper function to log usage
async function logUsage(supabase: any, userId: string, action: string, creditsUsed: number) {
  await supabase.from('usage_logs').insert({
    user_id: userId,
    action,
    credits_used: creditsUsed,
    timestamp: new Date().toISOString()
  })
}