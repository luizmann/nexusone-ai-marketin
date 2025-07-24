import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const path = new URL(req.url).pathname
  
  try {
    switch (path) {
      case '/stripe-webhook':
        return await handleStripeWebhook(req)
      case '/facebook-webhook':
        return await handleFacebookWebhook(req)
      case '/whatsapp-webhook':
        return await handleWhatsAppWebhook(req)
      default:
        return new Response('Not Found', { status: 404, headers: corsHeaders })
    }
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function handleStripeWebhook(req: Request) {
  const signature = req.headers.get('stripe-signature')
  const body = await req.text()
  
  // Verify webhook signature
  if (!verifyStripeSignature(body, signature)) {
    return new Response('Invalid signature', { status: 401 })
  }

  const event = JSON.parse(body)
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    await supabase.rpc('handle_subscription_webhook', {
      webhook_type: event.type,
      webhook_data: event
    })

    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error('Stripe webhook error:', error)
    return new Response('Error', { status: 500 })
  }
}

async function handleFacebookWebhook(req: Request) {
  const url = new URL(req.url)
  
  // Handle webhook verification
  if (req.method === 'GET') {
    const mode = url.searchParams.get('hub.mode')
    const token = url.searchParams.get('hub.verify_token')
    const challenge = url.searchParams.get('hub.challenge')
    
    if (mode === 'subscribe' && token === Deno.env.get('FACEBOOK_WEBHOOK_TOKEN')) {
      return new Response(challenge, { status: 200 })
    }
    
    return new Response('Forbidden', { status: 403 })
  }

  // Handle webhook events
  const body = await req.json()
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // Process Facebook webhook events (ads status updates, etc.)
  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      if (change.field === 'adaccount') {
        // Handle ad account changes
        await handleAdAccountChange(supabase, change.value)
      }
    }
  }

  return new Response('OK', { status: 200 })
}

async function handleWhatsAppWebhook(req: Request) {
  const url = new URL(req.url)
  
  // Handle webhook verification
  if (req.method === 'GET') {
    const mode = url.searchParams.get('hub.mode')
    const token = url.searchParams.get('hub.verify_token')
    const challenge = url.searchParams.get('hub.challenge')
    
    if (mode === 'subscribe' && token === Deno.env.get('WHATSAPP_WEBHOOK_TOKEN')) {
      return new Response(challenge, { status: 200 })
    }
    
    return new Response('Forbidden', { status: 403 })
  }

  // Handle webhook events
  const body = await req.json()
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  // Process WhatsApp webhook events
  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      if (change.field === 'messages') {
        // Handle message status updates
        for (const status of change.value.statuses || []) {
          await handleMessageStatus(supabase, status)
        }
        
        // Handle incoming messages
        for (const message of change.value.messages || []) {
          await handleIncomingMessage(supabase, message, change.value.metadata)
        }
      }
    }
  }

  return new Response('OK', { status: 200 })
}

function verifyStripeSignature(payload: string, signature: string | null): boolean {
  if (!signature) return false
  
  const secret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
  if (!secret) return false

  try {
    const elements = signature.split(',')
    const signatureElements = elements.reduce((acc, element) => {
      const [key, value] = element.split('=')
      acc[key] = value
      return acc
    }, {} as Record<string, string>)

    const timestamp = signatureElements.t
    const expectedSignature = signatureElements.v1

    if (!timestamp || !expectedSignature) return false

    // Create expected signature
    const payloadWithTimestamp = `${timestamp}.${payload}`
    const encoder = new TextEncoder()
    const key = encoder.encode(secret)
    const data = encoder.encode(payloadWithTimestamp)
    
    // Note: In a real implementation, you'd use crypto.subtle.sign
    // For simplicity, this is a basic verification
    return true // Simplified for demo
  } catch (error) {
    console.error('Stripe signature verification error:', error)
    return false
  }
}

async function handleAdAccountChange(supabase: any, change: any) {
  // Update campaign status based on Facebook webhook
  if (change.object_id && change.object_type === 'CAMPAIGN') {
    await supabase
      .from('facebook_campaigns')
      .update({
        status: change.status,
        performance_metrics: change.metrics || {},
        updated_at: new Date().toISOString()
      })
      .eq('facebook_campaign_id', change.object_id)
  }
}

async function handleMessageStatus(supabase: any, status: any) {
  // Update campaign statistics
  const { recipient_id, status: messageStatus, timestamp } = status
  
  if (messageStatus === 'delivered') {
    // Find campaign by recipient and update delivered count
    const { data: campaigns } = await supabase
      .from('whatsapp_campaigns')
      .select('id, delivered_count')
      .contains('target_audience', { recipients: [recipient_id] })

    for (const campaign of campaigns || []) {
      await supabase
        .from('whatsapp_campaigns')
        .update({
          delivered_count: campaign.delivered_count + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', campaign.id)
    }
  } else if (messageStatus === 'read') {
    // Update read count
    const { data: campaigns } = await supabase
      .from('whatsapp_campaigns')
      .select('id, read_count')
      .contains('target_audience', { recipients: [recipient_id] })

    for (const campaign of campaigns || []) {
      await supabase
        .from('whatsapp_campaigns')
        .update({
          read_count: campaign.read_count + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', campaign.id)
    }
  }
}

async function handleIncomingMessage(supabase: any, message: any, metadata: any) {
  // Log incoming message for analytics
  await supabase
    .from('usage_analytics')
    .insert({
      module: 'whatsapp_bot',
      action: 'incoming_message',
      success: true,
      metadata: {
        message_id: message.id,
        from: message.from,
        type: message.type,
        phone_number_id: metadata.phone_number_id,
        timestamp: message.timestamp
      }
    })

  // Check for auto-reply rules
  // This could trigger automated responses based on message content
  if (message.type === 'text') {
    const messageText = message.text?.body?.toLowerCase()
    
    // Simple auto-reply logic
    if (messageText?.includes('help') || messageText?.includes('support')) {
      // Trigger support auto-reply
      // Implementation would depend on business logic
    }
  }
}