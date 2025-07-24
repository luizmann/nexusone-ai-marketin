import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface UsageEvent {
  user_id: string
  module: string
  action: string
  credits_consumed: number
  success: boolean
  processing_time?: number
  error_message?: string
  metadata?: any
  ip_address?: string
  user_agent?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const events: UsageEvent[] = Array.isArray(await req.json()) 
      ? await req.json() 
      : [await req.json()]
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get IP and User-Agent from headers
    const ip_address = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const user_agent = req.headers.get('user-agent') || 'unknown'

    // Process each event
    const results = []
    for (const event of events) {
      try {
        // Insert usage analytics record
        const { data, error } = await supabase
          .from('usage_analytics')
          .insert({
            user_id: event.user_id,
            module: event.module,
            action: event.action,
            credits_consumed: event.credits_consumed || 0,
            success: event.success,
            processing_time: event.processing_time,
            error_message: event.error_message,
            metadata: event.metadata,
            ip_address: event.ip_address || ip_address,
            user_agent: event.user_agent || user_agent
          })
          .select()
          .single()

        if (error) {
          console.error('Error inserting usage analytics:', error)
          results.push({ success: false, error: error.message })
        } else {
          results.push({ success: true, id: data.id })
        }

        // Update user engagement score periodically
        if (Math.random() < 0.1) { // 10% chance to update engagement
          await updateUserEngagement(supabase, event.user_id)
        }

      } catch (error) {
        console.error('Error processing event:', error)
        results.push({ success: false, error: error.message })
      }
    }

    // Calculate success rate
    const successCount = results.filter(r => r.success).length
    const successRate = successCount / results.length

    return new Response(
      JSON.stringify({
        success: successRate > 0.5,
        processed: results.length,
        successful: successCount,
        failed: results.length - successCount,
        results: results
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in usage-tracker:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function updateUserEngagement(supabase: any, userId: string) {
  try {
    // Calculate engagement score
    const { data: engagementScore } = await supabase
      .rpc('calculate_user_engagement_score', { p_user_id: userId })

    if (engagementScore !== null) {
      // Update user record with engagement score
      await supabase
        .from('users')
        .update({ 
          updated_at: new Date().toISOString(),
          // You could store engagement score in a metadata field
          // metadata: { engagement_score: engagementScore }
        })
        .eq('id', userId)
    }
  } catch (error) {
    console.error('Error updating user engagement:', error)
  }
}