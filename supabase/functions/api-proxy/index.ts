import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

interface APICallRequest {
  apiName: string
  endpoint: string
  method: string
  data?: any
  parameters?: Record<string, any>
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

    const { apiName, endpoint, method, data, parameters }: APICallRequest = await req.json()

    // Get API configuration for user
    const { data: apiConfig, error: configError } = await supabase
      .from('api_configurations')
      .select('*')
      .eq('user_id', user.id)
      .eq('api_name', apiName)
      .single()

    if (configError || !apiConfig || !apiConfig.enabled) {
      return new Response(
        JSON.stringify({ error: `${apiName} not configured or disabled` }),
        { headers: corsHeaders, status: 400 }
      )
    }

    // Get API endpoint configuration
    const { data: endpointConfig, error: endpointError } = await supabase
      .from('api_endpoints')
      .select('*')
      .eq('api_name', apiName.toLowerCase().replace(' ', '_'))
      .single()

    if (endpointError || !endpointConfig) {
      return new Response(
        JSON.stringify({ error: `${apiName} endpoint configuration not found` }),
        { headers: corsHeaders, status: 400 }
      )
    }

    // Check API limits
    const { data: limits, error: limitsError } = await supabase
      .from('api_limits')
      .select('*')
      .eq('user_id', user.id)
      .eq('api_name', apiName)
      .single()

    if (limits && (limits.daily_used >= limits.daily_limit || limits.monthly_used >= limits.monthly_limit)) {
      return new Response(
        JSON.stringify({ error: 'API limit exceeded' }),
        { headers: corsHeaders, status: 429 }
      )
    }

    // Build request headers based on API auth config
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    const auth = endpointConfig.authentication
    if (auth.type === 'bearer') {
      headers[auth.header] = `${auth.prefix}${apiConfig.api_key}`
    } else if (auth.type === 'header') {
      headers[auth.header] = apiConfig.api_key
    }

    // Build URL with parameters if needed
    let url = endpointConfig.base_url + endpoint
    if (auth.type === 'query' && auth.parameter) {
      const separator = url.includes('?') ? '&' : '?'
      url += `${separator}${auth.parameter}=${apiConfig.api_key}`
    }

    if (parameters) {
      const urlParams = new URLSearchParams(parameters)
      const separator = url.includes('?') ? '&' : '?'
      url += separator + urlParams.toString()
    }

    const startTime = Date.now()

    // Make API call
    const fetchOptions: RequestInit = {
      method: method.toUpperCase(),
      headers
    }

    if (data && method.toUpperCase() !== 'GET') {
      fetchOptions.body = JSON.stringify(data)
    }

    const response = await fetch(url, fetchOptions)
    const responseData = await response.json()
    const executionTime = Date.now() - startTime

    // Get credits used from endpoint config
    const endpointCredits = endpointConfig.endpoints[endpoint]?.credits || 1

    // Log API usage
    await supabase.from('api_usage').insert({
      user_id: user.id,
      api_name: apiName,
      endpoint: endpoint,
      method: method.toUpperCase(),
      request_data: data,
      response_status: response.status,
      response_data: responseData,
      credits_used: endpointCredits,
      execution_time: executionTime
    })

    // Update API limits
    if (limits) {
      await supabase
        .from('api_limits')
        .update({
          daily_used: limits.daily_used + endpointCredits,
          monthly_used: limits.monthly_used + endpointCredits
        })
        .eq('user_id', user.id)
        .eq('api_name', apiName)
    } else {
      // Create new limits record
      await supabase.from('api_limits').insert({
        user_id: user.id,
        api_name: apiName,
        daily_used: endpointCredits,
        monthly_used: endpointCredits
      })
    }

    return new Response(
      JSON.stringify({
        success: response.ok,
        status: response.status,
        data: responseData,
        credits_used: endpointCredits,
        execution_time: executionTime
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: response.status,
      }
    )

  } catch (error) {
    console.error('Error making API call:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})