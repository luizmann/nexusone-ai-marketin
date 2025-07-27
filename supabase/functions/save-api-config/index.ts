import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface SaveConfigRequest {
  apis: Array<{
    name: string
    key: string
    enabled: boolean
    status: string
  }>
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

    const { apis }: SaveConfigRequest = await req.json()

    // Save or update each API configuration
    const results = []
    for (const api of apis) {
      const { data, error } = await supabase
        .from('api_configurations')
        .upsert({
          user_id: user.id,
          api_name: api.name,
          api_key: api.key,
          enabled: api.enabled,
          status: api.status,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,api_name'
        })

      if (error) {
        console.error(`Error saving ${api.name}:`, error)
        results.push({ api: api.name, success: false, error: error.message })
      } else {
        results.push({ api: api.name, success: true })
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'API configurations saved',
        results 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error saving API config:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})