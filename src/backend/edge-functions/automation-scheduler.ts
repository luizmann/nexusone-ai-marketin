/**
 * Automation Scheduler Edge Function
 * 
 * Manages automated tasks for inventory sync and order fulfillment
 * including cron-like scheduling and webhook processing
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

interface ScheduleConfig {
  scheduleId: string
  userId: string
  frequency: 'hourly' | 'daily' | 'weekly' | 'custom'
  cronExpression?: string
  taskType: 'inventory_sync' | 'order_status_update' | 'stock_alert' | 'fulfillment_check'
  isActive: boolean
  filters?: {
    productIds?: string[]
    categories?: string[]
    suppliers?: string[]
    stockThreshold?: number
  }
  notifications?: {
    email?: boolean
    webhook?: string
    inApp?: boolean
  }
}

interface AutomationTask {
  id: string
  type: 'inventory_sync' | 'order_fulfillment' | 'stock_alert' | 'webhook_process'
  userId: string
  scheduleId?: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'pending' | 'running' | 'completed' | 'failed'
  config: any
  retryCount: number
  maxRetries: number
  scheduledAt: string
  startedAt?: string
  completedAt?: string
  error?: string
  result?: any
}

Deno.serve(async (req) => {
  try {
    // CORS headers
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        },
      })
    }

    const url = new URL(req.url)
    const action = url.searchParams.get('action')

    switch (action) {
      case 'schedule':
        return await handleScheduleTask(req)
      case 'process':
        return await handleProcessTasks()
      case 'status':
        return await handleGetStatus(req)
      case 'webhook':
        return await handleWebhook(req)
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
    }

  } catch (error) {
    console.error('Automation scheduler error:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})

/**
 * Schedule a new automation task
 */
async function handleScheduleTask(req: Request) {
  const { userId, taskType, config, priority = 'medium', scheduleAt } = await req.json()

  // Create automation task
  const task: Partial<AutomationTask> = {
    type: taskType,
    userId,
    priority,
    status: 'pending',
    config,
    retryCount: 0,
    maxRetries: 3,
    scheduledAt: scheduleAt || new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('automation_tasks')
    .insert([task])
    .select()
    .single()

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify({ 
    success: true, 
    taskId: data.id,
    message: 'Task scheduled successfully' 
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}

/**
 * Process pending automation tasks
 */
async function handleProcessTasks() {
  // Get pending tasks ordered by priority and scheduled time
  const { data: tasks, error } = await supabase
    .from('automation_tasks')
    .select('*')
    .eq('status', 'pending')
    .lte('scheduledAt', new Date().toISOString())
    .order('priority', { ascending: false })
    .order('scheduledAt', { ascending: true })
    .limit(10)

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const results = []

  for (const task of tasks) {
    try {
      // Mark task as running
      await supabase
        .from('automation_tasks')
        .update({ 
          status: 'running',
          startedAt: new Date().toISOString() 
        })
        .eq('id', task.id)

      let result
      
      switch (task.type) {
        case 'inventory_sync':
          result = await processInventorySync(task)
          break
        case 'order_fulfillment':
          result = await processOrderFulfillment(task)
          break
        case 'stock_alert':
          result = await processStockAlert(task)
          break
        case 'webhook_process':
          result = await processWebhook(task)
          break
        default:
          throw new Error(`Unknown task type: ${task.type}`)
      }

      // Mark task as completed
      await supabase
        .from('automation_tasks')
        .update({ 
          status: 'completed',
          completedAt: new Date().toISOString(),
          result
        })
        .eq('id', task.id)

      results.push({ taskId: task.id, status: 'completed', result })

    } catch (error) {
      console.error(`Task ${task.id} failed:`, error)
      
      // Check if we should retry
      const shouldRetry = task.retryCount < task.maxRetries
      
      if (shouldRetry) {
        // Schedule retry with exponential backoff
        const retryDelay = Math.pow(2, task.retryCount) * 60000 // Minutes to milliseconds
        const nextRetry = new Date(Date.now() + retryDelay).toISOString()
        
        await supabase
          .from('automation_tasks')
          .update({ 
            status: 'pending',
            retryCount: task.retryCount + 1,
            scheduledAt: nextRetry,
            error: error.message
          })
          .eq('id', task.id)
          
        results.push({ taskId: task.id, status: 'retry_scheduled', nextRetry })
      } else {
        // Mark as failed
        await supabase
          .from('automation_tasks')
          .update({ 
            status: 'failed',
            completedAt: new Date().toISOString(),
            error: error.message
          })
          .eq('id', task.id)
          
        results.push({ taskId: task.id, status: 'failed', error: error.message })
      }
    }
  }

  return new Response(JSON.stringify({ 
    success: true,
    processedTasks: results.length,
    results 
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}

/**
 * Get automation status and metrics
 */
async function handleGetStatus(req: Request) {
  const url = new URL(req.url)
  const userId = url.searchParams.get('userId')

  let query = supabase
    .from('automation_tasks')
    .select('status, type, created_at')

  if (userId) {
    query = query.eq('userId', userId)
  }

  const { data: tasks, error } = await query
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // Last 24 hours

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // Calculate metrics
  const metrics = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    failed: tasks.filter(t => t.status === 'failed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    running: tasks.filter(t => t.status === 'running').length,
    successRate: tasks.length > 0 ? 
      (tasks.filter(t => t.status === 'completed').length / tasks.length * 100).toFixed(1) : 0,
    byType: tasks.reduce((acc, task) => {
      acc[task.type] = (acc[task.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  return new Response(JSON.stringify({ 
    success: true,
    metrics,
    tasks: tasks.slice(0, 20) // Return latest 20 tasks
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}

/**
 * Handle incoming webhooks from CJ Dropshipping
 */
async function handleWebhook(req: Request) {
  const webhookData = await req.json()
  const headers = Object.fromEntries(req.headers.entries())
  
  console.log('Received webhook:', { headers, data: webhookData })

  // Verify webhook signature (implement based on CJ requirements)
  // const isValid = await verifyWebhookSignature(headers, webhookData)
  // if (!isValid) {
  //   return new Response('Invalid signature', { status: 401 })
  // }

  // Process webhook based on type
  if (webhookData.type === 'order_status_update') {
    await processOrderStatusWebhook(webhookData)
  } else if (webhookData.type === 'inventory_update') {
    await processInventoryWebhook(webhookData)
  } else if (webhookData.type === 'shipping_update') {
    await processShippingWebhook(webhookData)
  }

  return new Response(JSON.stringify({ status: 'received' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}

/**
 * Process inventory sync task
 */
async function processInventorySync(task: AutomationTask) {
  const { productIds, syncAll = false } = task.config

  // Call inventory sync edge function
  const syncResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/inventory-sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
    },
    body: JSON.stringify({
      userId: task.userId,
      productIds,
      syncAll,
      scheduleId: task.scheduleId
    })
  })

  const result = await syncResponse.json()
  
  if (!syncResponse.ok) {
    throw new Error(result.error || 'Inventory sync failed')
  }

  return result
}

/**
 * Process order fulfillment task
 */
async function processOrderFulfillment(task: AutomationTask) {
  const { orderId, action } = task.config

  // Call order fulfillment edge function
  const fulfillmentResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/order-fulfillment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
    },
    body: JSON.stringify({
      orderId,
      userId: task.userId,
      action
    })
  })

  const result = await fulfillmentResponse.json()
  
  if (!fulfillmentResponse.ok) {
    throw new Error(result.error || 'Order fulfillment failed')
  }

  return result
}

/**
 * Process stock alert task
 */
async function processStockAlert(task: AutomationTask) {
  const { threshold = 5 } = task.config

  // Get low stock products
  const { data: lowStockProducts, error } = await supabase
    .from('dropshipping_products')
    .select('*')
    .eq('user_id', task.userId)
    .lte('stock_quantity', threshold)
    .gt('stock_quantity', 0)

  if (error) {
    throw new Error(`Failed to get low stock products: ${error.message}`)
  }

  // Get out of stock products
  const { data: outOfStockProducts } = await supabase
    .from('dropshipping_products')
    .select('*')
    .eq('user_id', task.userId)
    .eq('stock_quantity', 0)

  const totalAlerts = (lowStockProducts?.length || 0) + (outOfStockProducts?.length || 0)

  if (totalAlerts > 0) {
    // Create notification
    await supabase
      .from('notifications')
      .insert({
        user_id: task.userId,
        type: 'stock_alert',
        title: 'Stock Alert',
        message: `${lowStockProducts?.length || 0} products are low in stock, ${outOfStockProducts?.length || 0} are out of stock`,
        data: {
          lowStock: lowStockProducts,
          outOfStock: outOfStockProducts
        },
        is_read: false,
        created_at: new Date().toISOString()
      })
  }

  return {
    lowStockCount: lowStockProducts?.length || 0,
    outOfStockCount: outOfStockProducts?.length || 0,
    alertsSent: totalAlerts > 0
  }
}

/**
 * Process generic webhook task
 */
async function processWebhook(task: AutomationTask) {
  const { url, method = 'POST', headers = {}, body } = task.config

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: method !== 'GET' ? JSON.stringify(body) : undefined
  })

  const result = await response.text()
  
  return {
    status: response.status,
    success: response.ok,
    response: result
  }
}

/**
 * Process order status webhook from CJ
 */
async function processOrderStatusWebhook(webhookData: any) {
  const { orderNumber, status, trackingNumber } = webhookData

  // Update order in database
  await supabase
    .from('dropshipping_orders')
    .update({
      status,
      tracking_number: trackingNumber,
      updated_at: new Date().toISOString()
    })
    .eq('external_order_id', orderNumber)

  console.log(`Order ${orderNumber} status updated to ${status}`)
}

/**
 * Process inventory webhook from CJ
 */
async function processInventoryWebhook(webhookData: any) {
  const { productId, stockQuantity, price } = webhookData

  // Update product inventory
  await supabase
    .from('dropshipping_products')
    .update({
      stock_quantity: stockQuantity,
      price: price,
      last_sync_at: new Date().toISOString()
    })
    .eq('external_id', productId)

  console.log(`Product ${productId} inventory updated: stock=${stockQuantity}, price=${price}`)
}

/**
 * Process shipping webhook from CJ
 */
async function processShippingWebhook(webhookData: any) {
  const { trackingNumber, status, events } = webhookData

  // Update tracking information
  await supabase
    .from('order_tracking')
    .upsert({
      tracking_number: trackingNumber,
      current_status: status,
      tracking_events: events,
      updated_at: new Date().toISOString()
    })

  console.log(`Tracking ${trackingNumber} updated: ${status}`)
}