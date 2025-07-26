// Supabase Edge Function for Luma AI Video Generation
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LumaGenerationRequest {
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
}

interface LumaGenerationResponse {
  id: string
  state: 'queued' | 'dreaming' | 'completed' | 'failed'
  created_at: string
  video?: {
    url: string
    thumbnail: string
    width: number
    height: number
  }
  failure_reason?: string
}

// Luma AI API Configuration
const LUMA_API_KEY = 'luma-12423eab-79ee-4f52-ad44-00c485686cf2-ab1b6b03-15a1-4c76-b056-6765bf41ab05'
const LUMA_API_BASE = 'https://api.lumalabs.ai/dream-machine/v1'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseKey)

async function callLumaAPI(endpoint: string, method: string = 'GET', body?: any) {
  const url = `${LUMA_API_BASE}${endpoint}`
  
  const response = await fetch(url, {
    method,
    headers: {
      'Authorization': `Bearer ${LUMA_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Luma API error: ${response.status} - ${errorText}`)
  }

  return await response.json()
}

async function createGeneration(request: LumaGenerationRequest, userId: string): Promise<LumaGenerationResponse> {
  console.log('Creating Luma generation with request:', request)
  
  try {
    const generation = await callLumaAPI('/generations', 'POST', request)
    
    // Store generation in database
    const { error: dbError } = await supabase
      .from('luma_generations')
      .insert({
        id: generation.id,
        user_id: userId,
        prompt: request.prompt,
        aspect_ratio: request.aspect_ratio || '16:9',
        loop: request.loop || false,
        state: generation.state,
        created_at: generation.created_at,
        luma_data: generation
      })

    if (dbError) {
      console.error('Database error:', dbError)
      throw new Error('Failed to store generation data')
    }

    return generation
  } catch (error) {
    console.error('Error creating generation:', error)
    throw error
  }
}

async function getGeneration(generationId: string, userId: string): Promise<LumaGenerationResponse> {
  try {
    const generation = await callLumaAPI(`/generations/${generationId}`)
    
    // Update generation in database
    const { error: dbError } = await supabase
      .from('luma_generations')
      .update({
        state: generation.state,
        video_url: generation.video?.url,
        thumbnail_url: generation.video?.thumbnail,
        failure_reason: generation.failure_reason,
        luma_data: generation,
        updated_at: new Date().toISOString()
      })
      .match({ id: generationId, user_id: userId })

    if (dbError) {
      console.error('Database update error:', dbError)
    }

    return generation
  } catch (error) {
    console.error('Error getting generation:', error)
    throw error
  }
}

async function listGenerations(userId: string) {
  try {
    // Get generations from our database
    const { data: generations, error } = await supabase
      .from('luma_generations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error('Failed to fetch generations from database')
    }

    return { generations: generations || [] }
  } catch (error) {
    console.error('Error listing generations:', error)
    throw error
  }
}

async function deductCredits(userId: string, amount: number) {
  const { data: user, error: fetchError } = await supabase
    .from('user_profiles')
    .select('credits')
    .eq('id', userId)
    .single()

  if (fetchError || !user) {
    throw new Error('User not found')
  }

  if (user.credits < amount) {
    throw new Error('Insufficient credits')
  }

  const { error: updateError } = await supabase
    .from('user_profiles')
    .update({ 
      credits: user.credits - amount,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)

  if (updateError) {
    throw new Error('Failed to deduct credits')
  }

  // Log credit transaction
  await supabase
    .from('credit_transactions')
    .insert({
      user_id: userId,
      amount: -amount,
      type: 'deduction',
      description: 'Luma AI video generation',
      created_at: new Date().toISOString()
    })
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get user from auth header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    const url = new URL(req.url)
    const action = url.searchParams.get('action')

    switch (action) {
      case 'generate': {
        if (req.method !== 'POST') {
          throw new Error('Method not allowed')
        }

        const body = await req.json()
        const { prompt, aspect_ratio, loop, keyframes, credits_cost = 30 } = body

        // Validate input
        if (!prompt || prompt.trim().length === 0) {
          throw new Error('Prompt is required')
        }

        if (prompt.length > 1000) {
          throw new Error('Prompt too long (max 1000 characters)')
        }

        // Deduct credits before generation
        await deductCredits(user.id, credits_cost)

        const request: LumaGenerationRequest = {
          prompt: prompt.trim(),
          aspect_ratio: aspect_ratio || '16:9',
          loop: loop || false
        }

        if (keyframes) {
          request.keyframes = keyframes
        }

        const generation = await createGeneration(request, user.id)

        return new Response(
          JSON.stringify({
            success: true,
            generation,
            credits_used: credits_cost
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      case 'status': {
        const generationId = url.searchParams.get('generation_id')
        if (!generationId) {
          throw new Error('Generation ID is required')
        }

        const generation = await getGeneration(generationId, user.id)

        return new Response(
          JSON.stringify({
            success: true,
            generation
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      case 'list': {
        const result = await listGenerations(user.id)

        return new Response(
          JSON.stringify({
            success: true,
            ...result
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      case 'cancel': {
        const generationId = url.searchParams.get('generation_id')
        if (!generationId) {
          throw new Error('Generation ID is required')
        }

        // Note: Luma AI doesn't support cancellation, but we can mark as cancelled in our DB
        const { error } = await supabase
          .from('luma_generations')
          .update({
            state: 'failed',
            failure_reason: 'Cancelled by user',
            updated_at: new Date().toISOString()
          })
          .match({ id: generationId, user_id: user.id })

        if (error) {
          throw new Error('Failed to cancel generation')
        }

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Generation cancelled'
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      default:
        throw new Error('Invalid action')
    }

  } catch (error) {
    console.error('Edge function error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: error.message.includes('Unauthorized') ? 401 : 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})