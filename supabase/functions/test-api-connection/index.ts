import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface APITestRequest {
  apiName: string
  apiKey: string
  endpoint: string
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

    const { apiName, apiKey, endpoint }: APITestRequest = await req.json()

    let testResult = false
    let errorMessage = ''

    // Test different APIs based on their authentication methods
    switch (apiName.toLowerCase()) {
      case 'openai':
        try {
          const response = await fetch(endpoint, {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            }
          })
          testResult = response.ok
          if (!response.ok) {
            errorMessage = await response.text()
          }
        } catch (error) {
          errorMessage = error.message
        }
        break

      case 'elevenlabs':
        try {
          const response = await fetch(endpoint, {
            headers: {
              'xi-api-key': apiKey,
              'Content-Type': 'application/json'
            }
          })
          testResult = response.ok
          if (!response.ok) {
            errorMessage = await response.text()
          }
        } catch (error) {
          errorMessage = error.message
        }
        break

      case 'replicate':
        try {
          const response = await fetch(endpoint, {
            headers: {
              'Authorization': `Token ${apiKey}`,
              'Content-Type': 'application/json'
            }
          })
          testResult = response.ok
          if (!response.ok) {
            errorMessage = await response.text()
          }
        } catch (error) {
          errorMessage = error.message
        }
        break

      case 'gupshup whatsapp':
        try {
          const response = await fetch(endpoint, {
            headers: {
              'apikey': apiKey,
              'Content-Type': 'application/json'
            }
          })
          testResult = response.ok
          if (!response.ok) {
            errorMessage = await response.text()
          }
        } catch (error) {
          errorMessage = error.message
        }
        break

      case 'cj dropshipping':
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'CJ-Access-Token': apiKey,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              pageNum: 1,
              pageSize: 10
            })
          })
          testResult = response.ok
          if (!response.ok) {
            errorMessage = await response.text()
          }
        } catch (error) {
          errorMessage = error.message
        }
        break

      case 'facebook marketing':
        try {
          const response = await fetch(`${endpoint}?access_token=${apiKey}`, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
          testResult = response.ok
          if (!response.ok) {
            errorMessage = await response.text()
          }
        } catch (error) {
          errorMessage = error.message
        }
        break

      case 'unsplash':
        try {
          const response = await fetch(endpoint, {
            headers: {
              'Authorization': `Client-ID ${apiKey}`,
              'Content-Type': 'application/json'
            }
          })
          testResult = response.ok
          if (!response.ok) {
            errorMessage = await response.text()
          }
        } catch (error) {
          errorMessage = error.message
        }
        break

      case 'luma ai':
        try {
          const response = await fetch(endpoint, {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            }
          })
          testResult = response.ok
          if (!response.ok) {
            errorMessage = await response.text()
          }
        } catch (error) {
          errorMessage = error.message
        }
        break

      default:
        errorMessage = 'Unknown API'
        break
    }

    // Log the test result
    await supabase.from('api_usage').insert({
      api_name: apiName,
      endpoint: endpoint,
      method: 'GET',
      response_status: testResult ? 200 : 400,
      response_data: { test: true, success: testResult, error: errorMessage },
      credits_used: 0
    })

    return new Response(
      JSON.stringify({ 
        success: testResult, 
        message: testResult ? 'API connection successful' : errorMessage 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: testResult ? 200 : 400,
      }
    )

  } catch (error) {
    console.error('Error testing API:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})