/**
 * Supabase Edge Functions for CJ Dropshipping and WhatsApp Business
 * 
 * This file contains all Edge Functions deployed to Supabase for handling
 * backend integrations with external APIs.
 */

// ==================== CJ DROPSHIPPING EDGE FUNCTIONS ====================

/**
 * Edge Function: cj-product-import
 * Handles CJ Dropshipping product import operations
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const { productIds, userId } = await req.json()
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Authenticate with CJ API
    const authResponse = await fetch('https://api.cjdropshipping.com/api/v2/authentication/getAccessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: Deno.env.get('CJ_EMAIL'),
        password: Deno.env.get('CJ_PASSWORD')
      })
    })

    const authData = await authResponse.json()
    
    if (!authData.result) {
      throw new Error('CJ authentication failed')
    }

    const accessToken = authData.data.accessToken
    const importedProducts = []

    // Import each product
    for (const productId of productIds) {
      try {
        const productResponse = await fetch(
          `https://api.cjdropshipping.com/api/v2/products/query?pid=${productId}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        )

        const productData = await productResponse.json()
        
        if (productData.result && productData.data) {
          const product = productData.data
          
          // Save to catalog
          const { error } = await supabaseClient
            .from('dropshipping_catalog')
            .upsert({
              external_id: product.pid,
              name: product.productName,
              description: product.description,
              price: parseFloat(product.sellPrice),
              original_price: parseFloat(product.originalPrice),
              currency: product.currency || 'USD',
              image_url: product.productImage,
              images: product.productImages || [product.productImage],
              category: product.categoryName,
              tags: product.productTags ? product.productTags.split(',') : [],
              stock_quantity: parseInt(product.sellQuantity),
              supplier: 'cj_dropshipping',
              supplier_data: {
                weight: parseFloat(product.weight),
                shippingTime: product.shippingTime,
                supplierName: product.supplierName,
                moq: parseInt(product.packQty || '1'),
                variants: product.variants || [],
                specifications: product.specifications || {}
              },
              imported_by: userId,
              is_active: true
            })

          if (!error) {
            importedProducts.push(product.pid)
          }
        }
      } catch (error) {
        console.error(`Failed to import product ${productId}:`, error)
      }
    }

    // Log import operation
    await supabaseClient
      .from('cj_product_sync_log')
      .insert({
        user_id: userId,
        operation: 'import',
        product_ids: productIds,
        status: 'completed',
        processed_count: importedProducts.length,
        total_count: productIds.length
      })

    return new Response(
      JSON.stringify({
        success: true,
        imported: importedProducts.length,
        total: productIds.length,
        products: importedProducts
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})

/**
 * Edge Function: cj-order-sync
 * Syncs order status from CJ Dropshipping
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get all pending orders
    const { data: orders } = await supabaseClient
      .from('dropshipping_orders')
      .select('*')
      .eq('supplier', 'cj_dropshipping')
      .in('status', ['pending', 'confirmed', 'shipped'])

    if (!orders?.length) {
      return new Response(
        JSON.stringify({ message: 'No orders to sync' }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Authenticate with CJ API
    const authResponse = await fetch('https://api.cjdropshipping.com/api/v2/authentication/getAccessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: Deno.env.get('CJ_EMAIL'),
        password: Deno.env.get('CJ_PASSWORD')
      })
    })

    const authData = await authResponse.json()
    const accessToken = authData.data.accessToken
    const updatedOrders = []

    // Check each order status
    for (const order of orders) {
      if (!order.external_order_id) continue

      try {
        const orderResponse = await fetch(
          `https://api.cjdropshipping.com/api/v2/orders/query?orderNumber=${order.external_order_id}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        )

        const orderData = await orderResponse.json()
        
        if (orderData.result && orderData.data) {
          const cjOrder = orderData.data
          const newStatus = mapCJOrderStatus(cjOrder.orderStatus)
          
          if (newStatus !== order.status) {
            await supabaseClient
              .from('dropshipping_orders')
              .update({
                status: newStatus,
                tracking_number: cjOrder.trackingNumber,
                tracking_data: cjOrder.trackingData || {},
                supplier_response: cjOrder,
                updated_at: new Date().toISOString()
              })
              .eq('id', order.id)

            updatedOrders.push(order.id)
          }
        }
      } catch (error) {
        console.error(`Failed to sync order ${order.id}:`, error)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        synced: updatedOrders.length,
        total: orders.length
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})

function mapCJOrderStatus(cjStatus: string): string {
  const statusMap: Record<string, string> = {
    'PENDING': 'pending',
    'CONFIRMED': 'confirmed',
    'SHIPPED': 'shipped',
    'DELIVERED': 'delivered',
    'CANCELLED': 'cancelled'
  }
  
  return statusMap[cjStatus] || 'pending'
}

// ==================== WHATSAPP BUSINESS EDGE FUNCTIONS ====================

/**
 * Edge Function: whatsapp-webhook
 * Handles WhatsApp Business API webhooks
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    if (req.method === 'GET') {
      // Webhook verification
      const url = new URL(req.url)
      const mode = url.searchParams.get('hub.mode')
      const token = url.searchParams.get('hub.verify_token')
      const challenge = url.searchParams.get('hub.challenge')

      if (mode === 'subscribe' && token === Deno.env.get('WHATSAPP_VERIFY_TOKEN')) {
        return new Response(challenge, { status: 200 })
      } else {
        return new Response('Verification failed', { status: 403 })
      }
    }

    if (req.method === 'POST') {
      const webhookData = await req.json()
      
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      // Process webhook data
      if (webhookData.object === 'whatsapp_business_account') {
        for (const entry of webhookData.entry) {
          for (const change of entry.changes) {
            if (change.field === 'messages') {
              await processMessages(change.value, supabaseClient)
            }
          }
        }
      }

      return new Response('OK', { status: 200 })
    }

    return new Response('Method not allowed', { status: 405 })
  } catch (error) {
    console.error('WhatsApp webhook error:', error)
    return new Response('Internal server error', { status: 500 })
  }
})

async function processMessages(messageData: any, supabaseClient: any) {
  try {
    if (messageData.messages) {
      for (const message of messageData.messages) {
        // Log incoming message
        await supabaseClient
          .from('whatsapp_messages')
          .insert({
            phone_number: message.from,
            phone_number_id: messageData.metadata?.phone_number_id,
            direction: 'inbound',
            message_type: message.type,
            content: extractMessageContent(message),
            message_id: message.id,
            status: 'received',
            timestamp: new Date(parseInt(message.timestamp) * 1000).toISOString()
          })

        // Update or create contact
        if (messageData.contacts?.[0]) {
          const contact = messageData.contacts[0]
          await supabaseClient
            .from('whatsapp_contacts')
            .upsert({
              phone_number: message.from,
              phone_number_id: messageData.metadata?.phone_number_id,
              name: contact.profile?.name,
              last_seen: new Date().toISOString()
            })
        }

        // Process business logic
        await processBusinessLogic(message, supabaseClient)
      }
    }

    // Update message statuses
    if (messageData.statuses) {
      for (const status of messageData.statuses) {
        await supabaseClient
          .from('whatsapp_messages')
          .update({
            status: status.status,
            updated_at: new Date().toISOString()
          })
          .eq('message_id', status.id)
      }
    }
  } catch (error) {
    console.error('Process messages error:', error)
  }
}

async function processBusinessLogic(message: any, supabaseClient: any) {
  try {
    const phoneNumber = message.from
    const messageText = extractMessageContent(message)

    // Get business configuration
    const { data: businessConfig } = await supabaseClient
      .from('whatsapp_business_config')
      .select('*')
      .eq('phone_number_id', message.metadata?.phone_number_id)
      .eq('is_active', true)
      .single()

    if (businessConfig && businessConfig.auto_respond) {
      // Generate AI response
      const prompt = `
        You are an AI assistant for ${businessConfig.business_name}, a ${businessConfig.business_category} business.
        
        Business description: ${businessConfig.business_description}
        
        Services offered:
        ${businessConfig.services.map((s: any) => `- ${s.name}: ${s.duration}min - $${s.price}`).join('\n')}
        
        Customer message: "${messageText}"
        
        Please respond in a helpful, friendly, and professional way. Keep response under 160 characters.
      `

      try {
        // Use OpenAI API to generate response
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [
              { role: 'system', content: 'You are a helpful business assistant.' },
              { role: 'user', content: prompt }
            ],
            max_tokens: 150,
            temperature: 0.7
          })
        })

        const openaiData = await openaiResponse.json()
        const aiResponse = openaiData.choices[0]?.message?.content || 'Thanks for your message! We\'ll get back to you soon.'

        // Send response via WhatsApp
        await sendWhatsAppMessage(phoneNumber, aiResponse, message.metadata?.phone_number_id)
      } catch (error) {
        console.error('AI response error:', error)
        await sendWhatsAppMessage(phoneNumber, 'Thanks for your message! We\'ll get back to you soon.', message.metadata?.phone_number_id)
      }
    }
  } catch (error) {
    console.error('Business logic processing error:', error)
  }
}

async function sendWhatsAppMessage(to: string, message: string, phoneNumberId: string) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('WHATSAPP_ACCESS_TOKEN')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to,
          type: 'text',
          text: {
            body: message
          }
        })
      }
    )

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Send WhatsApp message error:', error)
    throw error
  }
}

function extractMessageContent(message: any): string {
  switch (message.type) {
    case 'text':
      return message.text.body
    case 'button':
      return message.button.text
    case 'interactive':
      return message.interactive.button_reply?.title || 
             message.interactive.list_reply?.title || 
             'Interactive message'
    case 'image':
      return `[Image] ${message.image.caption || ''}`
    case 'document':
      return `[Document] ${message.document.caption || message.document.filename || ''}`
    case 'audio':
      return '[Audio message]'
    case 'video':
      return `[Video] ${message.video.caption || ''}`
    default:
      return `[${message.type}]`
  }
}

/**
 * Edge Function: whatsapp-appointment-reminder
 * Sends appointment reminders
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get appointments in the next hour that haven't had reminders sent
    const oneHourFromNow = new Date()
    oneHourFromNow.setHours(oneHourFromNow.getHours() + 1)

    const { data: appointments } = await supabaseClient
      .from('whatsapp_appointments')
      .select(`
        *,
        business:whatsapp_business_config(*)
      `)
      .eq('status', 'confirmed')
      .eq('reminder_sent', false)
      .lte('appointment_date', oneHourFromNow.toISOString().split('T')[0])
      .lte('appointment_time', oneHourFromNow.toTimeString().split(' ')[0])

    if (!appointments?.length) {
      return new Response(
        JSON.stringify({ message: 'No reminders to send' }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    let sentCount = 0

    for (const appointment of appointments) {
      try {
        const reminderMessage = `🔔 Reminder: You have an appointment for ${appointment.service_name} tomorrow at ${appointment.appointment_time}. See you at ${appointment.business.business_name}!`

        await sendWhatsAppMessage(
          appointment.phone_number,
          reminderMessage,
          appointment.business.phone_number_id
        )

        // Mark reminder as sent
        await supabaseClient
          .from('whatsapp_appointments')
          .update({ reminder_sent: true })
          .eq('id', appointment.id)

        sentCount++
      } catch (error) {
        console.error(`Failed to send reminder for appointment ${appointment.id}:`, error)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        sent: sentCount,
        total: appointments.length
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})

/**
 * Edge Function: integration-analytics
 * Collects and processes integration analytics
 */
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const { userId, integrationType, operation, status, executionTime, costCredits, metadata } = await req.json()
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Log analytics data
    await supabaseClient
      .from('integration_analytics')
      .insert({
        user_id: userId,
        integration_type: integrationType,
        operation: operation,
        status: status,
        execution_time: executionTime,
        cost_credits: costCredits,
        metadata: metadata || {}
      })

    // Update user credits if cost > 0
    if (costCredits > 0) {
      await supabaseClient.rpc('deduct_user_credits', {
        user_id: userId,
        credits_to_deduct: costCredits
      })
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})