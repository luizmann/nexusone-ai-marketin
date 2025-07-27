import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ApiTestRequest {
  service: string
  apiKey: string
  endpoint: string
}

const testEndpoints = {
  openai: async (apiKey: string) => {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })
    return response.ok
  },
  
  elevenlabs: async (apiKey: string) => {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    })
    return response.ok
  },
  
  replicate: async (apiKey: string) => {
    const response = await fetch('https://api.replicate.com/v1/models', {
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })
    return response.ok
  },
  
  gupshup: async (apiKey: string) => {
    const response = await fetch('https://api.gupshup.io/wa/api/v1/users', {
      headers: {
        'apikey': apiKey,
        'Content-Type': 'application/json'
      }
    })
    return response.ok
  },
  
  facebook: async (apiKey: string) => {
    const response = await fetch(`https://graph.facebook.com/v18.0/me?access_token=${apiKey}`)
    return response.ok
  },
  
  'cj-dropshipping': async (apiKey: string) => {
    const response = await fetch('https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken', {
      method: 'POST',
      headers: {
        'CJ-Access-Token': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    })
    return response.ok
  },
  
  unsplash: async (apiKey: string) => {
    const response = await fetch('https://api.unsplash.com/photos?per_page=1', {
      headers: {
        'Authorization': `Client-ID ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })
    return response.ok
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { service, apiKey, endpoint }: ApiTestRequest = await req.json()

    if (!service || !apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing service or API key' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Test the specific service
    const testFunction = testEndpoints[service as keyof typeof testEndpoints]
    
    if (!testFunction) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unsupported service' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const isValid = await testFunction(apiKey)

    if (isValid) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `${service} API connection successful`,
          timestamp: new Date().toISOString()
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    } else {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `${service} API connection failed - Invalid credentials`
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

  } catch (error) {
    console.error('API test error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Internal server error during API test'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})