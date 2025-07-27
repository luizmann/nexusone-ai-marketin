import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ApiConfig {
  key: string
  status: 'active' | 'inactive' | 'testing' | 'error'
  lastTested?: string
  description: string
  required: boolean
  category: string
}

interface SaveConfigRequest {
  configs: Record<string, ApiConfig>
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

    // Get the authenticated user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (req.method === 'POST') {
      const { configs }: SaveConfigRequest = await req.json()

      if (!configs) {
        return new Response(
          JSON.stringify({ error: 'Missing configs' }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      // Save API configurations to database
      const { error } = await supabaseClient
        .from('api_configurations')
        .upsert({
          user_id: user.id,
          configurations: configs,
          updated_at: new Date().toISOString()
        })

      if (error) {
        console.error('Error saving API configs:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to save configurations' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      // Also save to environment for immediate use
      const envUpdates: Record<string, string> = {}
      
      Object.entries(configs).forEach(([service, config]) => {
        if (config.key && config.status === 'active') {
          const envKey = service.toUpperCase().replace('-', '_') + '_API_KEY'
          envUpdates[envKey] = config.key
        }
      })

      // Save to system environment (this would be handled by deployment scripts)
      await supabaseClient
        .from('system_environment')
        .upsert({
          user_id: user.id,
          environment_variables: envUpdates,
          updated_at: new Date().toISOString()
        })

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'API configurations saved successfully',
          configs_saved: Object.keys(configs).length
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    if (req.method === 'GET') {
      // Retrieve saved configurations
      const { data, error } = await supabaseClient
        .from('api_configurations')
        .select('configurations')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching API configs:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to fetch configurations' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      const configurations = data?.configurations || {}

      return new Response(
        JSON.stringify({ 
          success: true, 
          configurations
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('API config error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})