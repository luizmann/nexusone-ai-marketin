import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WhatsAppMessage {
  to: string
  type: 'text' | 'template' | 'media'
  text?: {
    body: string
  }
  template?: {
    name: string
    language: {
      code: string
    }
    components?: any[]
  }
  media?: {
    type: 'image' | 'video' | 'document'
    url: string
    caption?: string
  }
}

interface BulkMessageRequest {
  whatsapp_account_id: string
  message: WhatsAppMessage
  recipients: string[]
  schedule_date?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { whatsapp_account_id, message, recipients, schedule_date }: BulkMessageRequest = await req.json()
    
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    // Check user credits
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('credits, plan')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      return new Response('User not found', { status: 404, headers: corsHeaders })
    }

    const creditsRequired = recipients.length * 5 // 5 credits per message
    if (userData.credits < creditsRequired) {
      return new Response('Insufficient credits', { status: 402, headers: corsHeaders })
    }

    // Get WhatsApp account details
    const { data: whatsappAccount, error: accountError } = await supabase
      .from('whatsapp_accounts')
      .select('*')
      .eq('id', whatsapp_account_id)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    if (accountError || !whatsappAccount) {
      return new Response('WhatsApp account not found', { status: 404, headers: corsHeaders })
    }

    // Create campaign record
    const { data: campaign, error: campaignError } = await supabase
      .from('whatsapp_campaigns')
      .insert({
        user_id: user.id,
        whatsapp_account_id,
        name: `Campaign - ${new Date().toISOString().split('T')[0]}`,
        message_template: message,
        target_audience: { recipients },
        schedule_date: schedule_date ? new Date(schedule_date) : null,
        status: schedule_date ? 'scheduled' : 'running'
      })
      .select()
      .single()

    if (campaignError) {
      throw new Error('Failed to create campaign')
    }

    let sentCount = 0
    let deliveredCount = 0
    const errors: string[] = []

    // If scheduled, don't send immediately
    if (schedule_date) {
      return new Response(
        JSON.stringify({
          success: true,
          campaign_id: campaign.id,
          status: 'scheduled',
          scheduled_for: schedule_date,
          recipients_count: recipients.length,
          credits_used: creditsRequired
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Send messages immediately
    for (const recipient of recipients) {
      try {
        const result = await sendWhatsAppMessage(
          whatsappAccount.access_token,
          whatsappAccount.phone_number,
          {
            ...message,
            to: recipient
          }
        )

        if (result.success) {
          sentCount++
          deliveredCount++
        } else {
          errors.push(`${recipient}: ${result.error}`)
        }

        // Small delay between messages to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        errors.push(`${recipient}: ${error.message}`)
      }
    }

    // Update campaign with results
    await supabase
      .from('whatsapp_campaigns')
      .update({
        status: 'completed',
        sent_count: sentCount,
        delivered_count: deliveredCount
      })
      .eq('id', campaign.id)

    // Consume credits
    await supabase.rpc('consume_credits', {
      p_user_id: user.id,
      p_amount: creditsRequired,
      p_module: 'whatsapp_bot',
      p_description: `Sent ${sentCount} WhatsApp messages`
    })

    // Log usage analytics
    await supabase
      .from('usage_analytics')
      .insert({
        user_id: user.id,
        module: 'whatsapp_bot',
        action: 'send_bulk_messages',
        credits_consumed: creditsRequired,
        success: sentCount > 0,
        metadata: {
          campaign_id: campaign.id,
          recipients_count: recipients.length,
          sent_count: sentCount,
          delivered_count: deliveredCount,
          errors_count: errors.length
        }
      })

    return new Response(
      JSON.stringify({
        success: true,
        campaign_id: campaign.id,
        sent_count: sentCount,
        delivered_count: deliveredCount,
        failed_count: recipients.length - sentCount,
        errors: errors.slice(0, 10), // Return first 10 errors
        credits_used: creditsRequired,
        remaining_credits: userData.credits - creditsRequired
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in whatsapp-automation:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function sendWhatsAppMessage(accessToken: string, phoneNumberId: string, message: WhatsAppMessage) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: message.to,
          type: message.type,
          ...message
        })
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`WhatsApp API error: ${error.error?.message || response.statusText}`)
    }

    const data = await response.json()
    return {
      success: true,
      message_id: data.messages[0]?.id
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// Additional function to handle webhook events
export async function handleWebhook(req: Request) {
  try {
    const body = await req.json()
    
    // Verify webhook signature
    const signature = req.headers.get('x-hub-signature-256')
    if (!verifyWebhookSignature(JSON.stringify(body), signature)) {
      return new Response('Invalid signature', { status: 401 })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Process webhook events
    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field === 'messages') {
          for (const message of change.value.messages || []) {
            // Handle incoming message
            await handleIncomingMessage(supabase, message, change.value.metadata)
          }
          
          for (const status of change.value.statuses || []) {
            // Handle message status updates
            await handleMessageStatus(supabase, status)
          }
        }
      }
    }

    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('Error', { status: 500 })
  }
}

function verifyWebhookSignature(payload: string, signature: string | null): boolean {
  if (!signature) return false
  
  const expectedSignature = `sha256=${crypto.createHmac('sha256', Deno.env.get('WHATSAPP_WEBHOOK_SECRET') || '')
    .update(payload)
    .digest('hex')}`
  
  return signature === expectedSignature
}

async function handleIncomingMessage(supabase: any, message: any, metadata: any) {
  // Log incoming message for analytics and potential auto-replies
  await supabase
    .from('usage_analytics')
    .insert({
      module: 'whatsapp_bot',
      action: 'incoming_message',
      metadata: {
        message_id: message.id,
        from: message.from,
        type: message.type,
        phone_number_id: metadata.phone_number_id
      }
    })
}

async function handleMessageStatus(supabase: any, status: any) {
  // Update campaign statistics based on message status
  const { recipient_id, status: messageStatus } = status
  
  if (messageStatus === 'delivered') {
    // Update delivered count in campaigns
    // This would require tracking message IDs to campaign mapping
  } else if (messageStatus === 'read') {
    // Update read count in campaigns
  }
}