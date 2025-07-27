import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface NexBrainRequest {
  message: string
  context?: any
  userId?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user from auth header
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { headers: corsHeaders, status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { headers: corsHeaders, status: 401 }
      )
    }

    const { message, context }: NexBrainRequest = await req.json()

    // Get OpenAI API key for user
    const { data: openaiConfig, error: configError } = await supabase
      .from('api_configurations')
      .select('*')
      .eq('user_id', user.id)
      .eq('api_name', 'OpenAI')
      .single()

    if (configError || !openaiConfig || !openaiConfig.enabled) {
      return new Response(
        JSON.stringify({ error: 'OpenAI not configured' }),
        { headers: corsHeaders, status: 400 }
      )
    }

    // Create thread with OpenAI Assistants API
    const threadResponse = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiConfig.api_key}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({})
    })

    if (!threadResponse.ok) {
      throw new Error('Failed to create thread')
    }

    const thread = await threadResponse.json()

    // Add message to thread
    const messageResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiConfig.api_key}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        role: 'user',
        content: message
      })
    })

    if (!messageResponse.ok) {
      throw new Error('Failed to add message to thread')
    }

    // Create run with NexBrain assistant
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiConfig.api_key}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        assistant_id: 'asst_0jsx8eD6P3W9XGsSRRNU2Pfd', // NexBrain Assistant ID
        additional_instructions: context ? `Context: ${JSON.stringify(context)}` : undefined
      })
    })

    if (!runResponse.ok) {
      throw new Error('Failed to create run')
    }

    const run = await runResponse.json()

    // Poll for completion
    let status = 'queued'
    let attempts = 0
    const maxAttempts = 30 // 30 seconds timeout

    while (status !== 'completed' && status !== 'failed' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const statusResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`, {
        headers: {
          'Authorization': `Bearer ${openaiConfig.api_key}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      })
      
      const statusData = await statusResponse.json()
      status = statusData.status
      attempts++
    }

    if (status !== 'completed') {
      throw new Error('Assistant run did not complete in time')
    }

    // Get messages
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      headers: {
        'Authorization': `Bearer ${openaiConfig.api_key}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    })

    const messages = await messagesResponse.json()
    const assistantMessage = messages.data.find((msg: any) => msg.role === 'assistant')

    if (!assistantMessage) {
      throw new Error('No assistant response found')
    }

    const responseText = assistantMessage.content[0].text.value

    // Log the interaction
    await supabase.from('api_usage').insert({
      user_id: user.id,
      api_name: 'NexBrain',
      endpoint: '/chat',
      method: 'POST',
      request_data: { message, context },
      response_status: 200,
      response_data: { response: responseText },
      credits_used: 10,
      execution_time: Date.now()
    })

    return new Response(
      JSON.stringify({
        success: true,
        response: responseText,
        thread_id: thread.id,
        credits_used: 10
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error with NexBrain:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})