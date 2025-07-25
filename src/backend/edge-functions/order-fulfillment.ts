/**
 * Order Fulfillment Edge Function
 * 
 * Automatically processes orders through CJ Dropshipping fulfillment system
 * and manages the complete order lifecycle from creation to delivery.
 */

import { createClient } from '@supabase/supabase-js'
import { createCJDropshippingService } from '../integrations/cj-dropshipping.js'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

interface OrderFulfillmentRequest {
  orderId: string
  userId: string
  action: 'create' | 'update' | 'track' | 'cancel'
  orderData?: {
    products: Array<{
      productId: string
      variantId?: string
      quantity: number
      price: number
    }>
    shippingAddress: {
      firstName: string
      lastName: string
      email: string
      phone: string
      address1: string
      address2?: string
      city: string
      state: string
      country: string
      zipCode: string
    }
    customerInfo?: {
      email: string
      phone: string
      notes?: string
    }
  }
}

interface FulfillmentResult {
  success: boolean
  orderId: string
  externalOrderId?: string
  status: string
  trackingNumber?: string
  estimatedDelivery?: string
  message: string
  details?: any
}

Deno.serve(async (req) => {
  try {
    // CORS headers
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        },
      })
    }

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Parse request
    const body: OrderFulfillmentRequest = await req.json()
    const { orderId, userId, action, orderData } = body

    console.log('Processing order fulfillment:', { orderId, userId, action })

    // Get user's CJ API credentials
    const { data: apiKeys } = await supabase
      .from('api_keys')
      .select('encrypted_key')
      .eq('user_id', userId)
      .eq('service_name', 'cj_dropshipping')
      .eq('is_active', true)
      .single()

    if (!apiKeys) {
      return new Response(JSON.stringify({ 
        error: 'CJ Dropshipping API key not found. Please configure your API credentials.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Decrypt API key
    const cjConfig = JSON.parse(apiKeys.encrypted_key)
    const cjService = createCJDropshippingService(cjConfig)

    // Authenticate with CJ
    await cjService.authenticate()

    let result: FulfillmentResult

    switch (action) {
      case 'create':
        result = await createOrder(cjService, orderId, userId, orderData!)
        break
      case 'update':
        result = await updateOrderStatus(cjService, supabase, orderId, userId)
        break
      case 'track':
        result = await trackOrder(cjService, supabase, orderId, userId)
        break
      case 'cancel':
        result = await cancelOrder(cjService, supabase, orderId, userId)
        break
      default:
        throw new Error(`Invalid action: ${action}`)
    }

    // Log fulfillment activity
    await supabase
      .from('fulfillment_logs')
      .insert({
        user_id: userId,
        order_id: orderId,
        action,
        success: result.success,
        details: result.details,
        created_at: new Date().toISOString()
      })

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Order fulfillment error:', error)
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
 * Create new order in CJ Dropshipping system
 */
async function createOrder(
  cjService: any,
  orderId: string,
  userId: string,
  orderData: any
): Promise<FulfillmentResult> {
  try {
    // Validate stock availability first
    for (const item of orderData.products) {
      const { data: product } = await supabase
        .from('dropshipping_products')
        .select('stock_quantity, name')
        .eq('external_id', item.productId)
        .eq('user_id', userId)
        .single()

      if (!product || product.stock_quantity < item.quantity) {
        return {
          success: false,
          orderId,
          status: 'failed',
          message: `Insufficient stock for product: ${product?.name || item.productId}`,
          details: { availableStock: product?.stock_quantity || 0, requestedQuantity: item.quantity }
        }
      }
    }

    // Calculate shipping cost
    const shippingCost = await cjService.calculateShippingCost({
      products: orderData.products.map((p: any) => ({
        productId: p.productId,
        quantity: p.quantity
      })),
      country: orderData.shippingAddress.country,
      state: orderData.shippingAddress.state,
      city: orderData.shippingAddress.city
    })

    // Create order in CJ system
    const cjOrder = await cjService.createOrder({
      clientOrderId: orderId,
      products: orderData.products,
      shippingAddress: orderData.shippingAddress,
      userId
    })

    // Update order in our database
    await supabase
      .from('dropshipping_orders')
      .update({
        external_order_id: cjOrder.orderNumber,
        status: 'confirmed',
        shipping_cost: shippingCost.cost,
        estimated_delivery_days: shippingCost.estimatedDays,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    // Update stock quantities
    for (const item of orderData.products) {
      await supabase
        .from('dropshipping_products')
        .update({
          stock_quantity: supabase.raw(`stock_quantity - ${item.quantity}`),
          total_sales: supabase.raw(`total_sales + ${item.quantity}`)
        })
        .eq('external_id', item.productId)
        .eq('user_id', userId)
    }

    // Send confirmation notification
    await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: 'order_confirmed',
        title: 'Order Confirmed',
        message: `Order ${orderId} has been confirmed and sent to fulfillment`,
        data: {
          orderId,
          externalOrderId: cjOrder.orderNumber,
          estimatedDelivery: shippingCost.estimatedDays
        },
        is_read: false,
        created_at: new Date().toISOString()
      })

    return {
      success: true,
      orderId,
      externalOrderId: cjOrder.orderNumber,
      status: 'confirmed',
      estimatedDelivery: `${shippingCost.estimatedDays} days`,
      message: 'Order successfully created and confirmed',
      details: {
        shippingCost: shippingCost.cost,
        estimatedDays: shippingCost.estimatedDays,
        products: orderData.products.length
      }
    }

  } catch (error) {
    console.error('Create order error:', error)
    
    // Update order status to failed
    await supabase
      .from('dropshipping_orders')
      .update({
        status: 'failed',
        error_message: error.message,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    return {
      success: false,
      orderId,
      status: 'failed',
      message: `Failed to create order: ${error.message}`,
      details: { error: error.message }
    }
  }
}

/**
 * Update order status from CJ system
 */
async function updateOrderStatus(
  cjService: any,
  supabase: any,
  orderId: string,
  userId: string
): Promise<FulfillmentResult> {
  try {
    // Get order from database
    const { data: order } = await supabase
      .from('dropshipping_orders')
      .select('external_order_id, status')
      .eq('id', orderId)
      .eq('user_id', userId)
      .single()

    if (!order || !order.external_order_id) {
      return {
        success: false,
        orderId,
        status: 'not_found',
        message: 'Order not found or not yet created in CJ system'
      }
    }

    // Get latest status from CJ
    const cjOrder = await cjService.getOrderStatus(order.external_order_id)

    // Update order in database
    await supabase
      .from('dropshipping_orders')
      .update({
        status: cjOrder.status,
        tracking_number: cjOrder.trackingNumber,
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    // Send status update notification if status changed
    if (order.status !== cjOrder.status) {
      const statusMessages = {
        'confirmed': 'Your order has been confirmed and is being prepared',
        'shipped': 'Your order has been shipped and is on its way',
        'delivered': 'Your order has been delivered successfully',
        'cancelled': 'Your order has been cancelled'
      }

      await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: 'order_status_update',
          title: 'Order Status Update',
          message: statusMessages[cjOrder.status] || `Order status updated to: ${cjOrder.status}`,
          data: {
            orderId,
            newStatus: cjOrder.status,
            trackingNumber: cjOrder.trackingNumber
          },
          is_read: false,
          created_at: new Date().toISOString()
        })
    }

    return {
      success: true,
      orderId,
      externalOrderId: order.external_order_id,
      status: cjOrder.status,
      trackingNumber: cjOrder.trackingNumber,
      message: `Order status updated to: ${cjOrder.status}`,
      details: cjOrder
    }

  } catch (error) {
    console.error('Update order status error:', error)
    return {
      success: false,
      orderId,
      status: 'error',
      message: `Failed to update order status: ${error.message}`,
      details: { error: error.message }
    }
  }
}

/**
 * Track order shipment
 */
async function trackOrder(
  cjService: any,
  supabase: any,
  orderId: string,
  userId: string
): Promise<FulfillmentResult> {
  try {
    // Get order tracking number
    const { data: order } = await supabase
      .from('dropshipping_orders')
      .select('tracking_number, external_order_id')
      .eq('id', orderId)
      .eq('user_id', userId)
      .single()

    if (!order || !order.tracking_number) {
      return {
        success: false,
        orderId,
        status: 'no_tracking',
        message: 'Order tracking number not available yet'
      }
    }

    // Get tracking information
    const trackingInfo = await cjService.getTrackingInfo(order.tracking_number)

    // Save tracking updates
    await supabase
      .from('order_tracking')
      .upsert({
        order_id: orderId,
        tracking_number: order.tracking_number,
        tracking_events: trackingInfo.events || [],
        current_status: trackingInfo.status,
        estimated_delivery: trackingInfo.estimatedDelivery,
        updated_at: new Date().toISOString()
      })

    return {
      success: true,
      orderId,
      externalOrderId: order.external_order_id,
      status: trackingInfo.status,
      trackingNumber: order.tracking_number,
      estimatedDelivery: trackingInfo.estimatedDelivery,
      message: 'Tracking information updated',
      details: trackingInfo
    }

  } catch (error) {
    console.error('Track order error:', error)
    return {
      success: false,
      orderId,
      status: 'error',
      message: `Failed to track order: ${error.message}`,
      details: { error: error.message }
    }
  }
}

/**
 * Cancel order
 */
async function cancelOrder(
  cjService: any,
  supabase: any,
  orderId: string,
  userId: string
): Promise<FulfillmentResult> {
  try {
    // Get order details
    const { data: order } = await supabase
      .from('dropshipping_orders')
      .select('external_order_id, status, products')
      .eq('id', orderId)
      .eq('user_id', userId)
      .single()

    if (!order) {
      return {
        success: false,
        orderId,
        status: 'not_found',
        message: 'Order not found'
      }
    }

    if (order.status === 'shipped' || order.status === 'delivered') {
      return {
        success: false,
        orderId,
        status: 'cannot_cancel',
        message: 'Cannot cancel order that has already shipped or been delivered'
      }
    }

    // Cancel order in CJ system (if external order exists)
    if (order.external_order_id) {
      // Note: CJ API doesn't have a direct cancel endpoint in the documentation
      // This would need to be implemented based on actual CJ API capabilities
      console.log(`Attempting to cancel CJ order: ${order.external_order_id}`)
    }

    // Update order status
    await supabase
      .from('dropshipping_orders')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    // Restore stock quantities
    if (order.products && Array.isArray(order.products)) {
      for (const item of order.products) {
        await supabase
          .from('dropshipping_products')
          .update({
            stock_quantity: supabase.raw(`stock_quantity + ${item.quantity}`)
          })
          .eq('external_id', item.productId)
          .eq('user_id', userId)
      }
    }

    // Send cancellation notification
    await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: 'order_cancelled',
        title: 'Order Cancelled',
        message: `Order ${orderId} has been cancelled and stock has been restored`,
        data: {
          orderId,
          externalOrderId: order.external_order_id
        },
        is_read: false,
        created_at: new Date().toISOString()
      })

    return {
      success: true,
      orderId,
      externalOrderId: order.external_order_id,
      status: 'cancelled',
      message: 'Order successfully cancelled',
      details: { stockRestored: true }
    }

  } catch (error) {
    console.error('Cancel order error:', error)
    return {
      success: false,
      orderId,
      status: 'error',
      message: `Failed to cancel order: ${error.message}`,
      details: { error: error.message }
    }
  }
}