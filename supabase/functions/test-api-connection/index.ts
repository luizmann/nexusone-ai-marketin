import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { service, action } = await req.json()
    
    let result: any = { status: 'unknown' }

    switch (service) {
      case 'cj-dropshipping':
        if (action === 'test-auth') {
          // Test CJ Dropshipping API connection
          const cjEmail = Deno.env.get('CJ_DROPSHIPPING_EMAIL')
          const cjPassword = Deno.env.get('CJ_DROPSHIPPING_PASSWORD')
          
          if (!cjEmail || !cjPassword) {
            result = { 
              status: 'error', 
              message: 'CJ credentials not configured',
              configured: false
            }
          } else {
            try {
              // Test authentication with CJ API
              const authResponse = await fetch('https://api.cjdropshipping.com/api/v2/authentication/getAccessToken', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                  email: cjEmail, 
                  password: cjPassword 
                })
              })

              const authData = await authResponse.json()
              
              if (authData.result && authData.data?.accessToken) {
                result = { 
                  status: 'success', 
                  message: 'CJ API connected successfully',
                  configured: true,
                  hasToken: true
                }
              } else {
                result = { 
                  status: 'error', 
                  message: `CJ API authentication failed: ${authData.message}`,
                  configured: true,
                  hasToken: false
                }
              }
            } catch (error) {
              result = { 
                status: 'error', 
                message: `CJ API connection failed: ${error.message}`,
                configured: true,
                hasToken: false
              }
            }
          }
        }
        break

      case 'openai':
        if (action === 'test-auth') {
          const openaiKey = Deno.env.get('OPENAI_API_KEY')
          
          if (!openaiKey) {
            result = { 
              status: 'error', 
              message: 'OpenAI API key not configured',
              configured: false
            }
          } else {
            try {
              const response = await fetch('https://api.openai.com/v1/models', {
                headers: {
                  'Authorization': `Bearer ${openaiKey}`,
                  'Content-Type': 'application/json'
                }
              })
              
              if (response.ok) {
                result = { 
                  status: 'success', 
                  message: 'OpenAI API connected successfully',
                  configured: true
                }
              } else {
                result = { 
                  status: 'error', 
                  message: 'OpenAI API authentication failed',
                  configured: true
                }
              }
            } catch (error) {
              result = { 
                status: 'error', 
                message: `OpenAI API connection failed: ${error.message}`,
                configured: true
              }
            }
          }
        }
        break

      case 'luma':
        if (action === 'test-auth') {
          const lumaKey = Deno.env.get('LUMA_API_KEY')
          
          if (!lumaKey) {
            result = { 
              status: 'error', 
              message: 'Luma API key not configured',
              configured: false
            }
          } else {
            // Luma AI doesn't have a simple test endpoint, so we'll just validate the key format
            if (lumaKey.startsWith('luma-')) {
              result = { 
                status: 'success', 
                message: 'Luma API key configured',
                configured: true
              }
            } else {
              result = { 
                status: 'warning', 
                message: 'Luma API key format may be incorrect',
                configured: true
              }
            }
          }
        }
        break

      case 'replicate':
        if (action === 'test-auth') {
          const replicateToken = Deno.env.get('REPLICATE_API_TOKEN')
          
          if (!replicateToken) {
            result = { 
              status: 'error', 
              message: 'Replicate API token not configured',
              configured: false
            }
          } else {
            try {
              const response = await fetch('https://api.replicate.com/v1/account', {
                headers: {
                  'Authorization': `Token ${replicateToken}`,
                  'Content-Type': 'application/json'
                }
              })
              
              if (response.ok) {
                result = { 
                  status: 'success', 
                  message: 'Replicate API connected successfully',
                  configured: true
                }
              } else {
                result = { 
                  status: 'error', 
                  message: 'Replicate API authentication failed',
                  configured: true
                }
              }
            } catch (error) {
              result = { 
                status: 'error', 
                message: `Replicate API connection failed: ${error.message}`,
                configured: true
              }
            }
          }
        }
        break

      case 'unsplash':
        if (action === 'test-auth') {
          const unsplashKey = Deno.env.get('UNSPLASH_ACCESS_KEY')
          
          if (!unsplashKey) {
            result = { 
              status: 'error', 
              message: 'Unsplash API key not configured',
              configured: false
            }
          } else {
            try {
              const response = await fetch(`https://api.unsplash.com/me`, {
                headers: {
                  'Authorization': `Client-ID ${unsplashKey}`
                }
              })
              
              if (response.ok) {
                result = { 
                  status: 'success', 
                  message: 'Unsplash API connected successfully',
                  configured: true
                }
              } else {
                result = { 
                  status: 'error', 
                  message: 'Unsplash API authentication failed',
                  configured: true
                }
              }
            } catch (error) {
              result = { 
                status: 'error', 
                message: `Unsplash API connection failed: ${error.message}`,
                configured: true
              }
            }
          }
        }
        break

      case 'elevenlabs':
        if (action === 'test-auth') {
          const elevenKey = Deno.env.get('ELEVENLABS_API_KEY')
          
          if (!elevenKey) {
            result = { 
              status: 'error', 
              message: 'ElevenLabs API key not configured',
              configured: false
            }
          } else {
            try {
              const response = await fetch('https://api.elevenlabs.io/v1/user', {
                headers: {
                  'xi-api-key': elevenKey
                }
              })
              
              if (response.ok) {
                result = { 
                  status: 'success', 
                  message: 'ElevenLabs API connected successfully',
                  configured: true
                }
              } else {
                result = { 
                  status: 'error', 
                  message: 'ElevenLabs API authentication failed',
                  configured: true
                }
              }
            } catch (error) {
              result = { 
                status: 'error', 
                message: `ElevenLabs API connection failed: ${error.message}`,
                configured: true
              }
            }
          }
        }
        break

      default:
        result = { 
          status: 'error', 
          message: `Unknown service: ${service}` 
        }
    }

    return new Response(
      JSON.stringify({ success: result.status === 'success', ...result }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('API Test Error:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false,
        status: 'error',
        message: error.message || 'Internal server error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})