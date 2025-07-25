import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CJOrderProduct {
  pid: string
  vid?: string
  quantity: number
  price: number
  name: string
}

interface CJShippingAddress {
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

interface CJOrderRequest {
  clientOrderId: string
  products: CJOrderProduct[]
  shippingAddress: CJShippingAddress
  warehouseCode?: string
}

async function authenticateCJ(email: string, password: string): Promise<string> {
  const response = await fetch('https://api.cjdropshipping.com/api/v2/authentication/getAccessToken', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password })
  })

  const data = await response.json()
  
  if (!data.result || !data.data?.accessToken) {
    throw new Error(`CJ Authentication failed: ${data.message || 'Unknown error'}`)
  }
  
  return data.data.accessToken
}

async function createCJOrder(
  accessToken: string,
  orderData: CJOrderRequest
): Promise<any> {
  const response = await fetch(
    'https://api.cjdropshipping.com/api/v2/orders/create',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orderNumber: orderData.clientOrderId,
        products: orderData.products.map(p => ({
          pid: p.pid,
          vid: p.vid,
          quantity: p.quantity
        })),
        shippingAddress: orderData.shippingAddress,
        warehouseCode: orderData.warehouseCode || 'CN'
      })
    }
  )

  const data = await response.json()
  
  if (!data.result) {
    throw new Error(`CJ Order creation failed: ${data.message || 'Unknown error'}`)
  }

  return data.data
}

async function getCJOrderStatus(
  accessToken: string,
  orderNumber: string
): Promise<any> {
  const response = await fetch(
    `https://api.cjdropshipping.com/api/v2/orders/query?orderNumber=${orderNumber}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  )

  const data = await response.json()
  
  if (!data.result) {
    throw new Error(`CJ Order query failed: ${data.message || 'Unknown error'}`)
  }

  return data.data
}

async function getCJTrackingInfo(
  accessToken: string,
  trackingNumber: string
): Promise<any> {
  const response = await fetch(
    `https://api.cjdropshipping.com/api/v2/logistic/tracking?trackingNumber=${trackingNumber}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  )

  const data = await response.json()
  
  if (!data.result) {
    throw new Error(`CJ Tracking query failed: ${data.message || 'Unknown error'}`)
  }

  return data.data
}

async function calculateCJShippingCost(
  accessToken: string,
  params: {
    products: { pid: string; quantity: number }[]
    country: string
    state?: string
    city?: string
  }
): Promise<any> {
  const response = await fetch(
    'https://api.cjdropshipping.com/api/v2/logistic/shipping-cost',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        products: params.products,
        country: params.country,
        state: params.state,
        city: params.city
      })
    }
  )

  const data = await response.json()
  
  if (!data.result) {
    throw new Error(`CJ Shipping cost calculation failed: ${data.message || 'Unknown error'}`)
  }

  return data.data
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, ...params } = await req.json()
    
    // Get Supabase client for user verification and data storage
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Verify user authentication
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get CJ credentials
    const cjEmail = Deno.env.get('CJ_API_EMAIL') || params.cjEmail
    const cjPassword = Deno.env.get('CJ_API_PASSWORD') || params.cjPassword

    if (!cjEmail || !cjPassword) {
      return new Response(
        JSON.stringify({ 
          error: 'CJ Dropshipping credentials not configured',
          requiresSetup: true 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Authenticate with CJ
    const accessToken = await authenticateCJ(cjEmail, cjPassword)

    let result: any

    switch (action) {
      case 'createOrder':
        if (!params.orderData) {
          throw new Error('Order data is required')
        }
        
        // Create order on CJ
        const cjOrderResult = await createCJOrder(accessToken, params.orderData)
        
        // Store order in our database
        const { data: orderRecord, error: orderError } = await supabaseClient
          .from('dropshipping_orders')
          .insert({
            external_order_id: cjOrderResult.orderNumber,
            client_order_id: params.orderData.clientOrderId,
            user_id: user.id,
            products: params.orderData.products,
            shipping_address: params.orderData.shippingAddress,
            status: 'pending',
            total_amount: params.orderData.products.reduce((sum, p) => sum + (p.price * p.quantity), 0),
            currency: 'USD',
            supplier: 'cj_dropshipping',
            supplier_data: cjOrderResult
          })
          .select()
          .single()
        
        if (orderError) {
          console.error('Database error:', orderError)
          throw new Error('Failed to save order to database')
        }
        
        result = { 
          cjOrder: cjOrderResult, 
          localOrder: orderRecord 
        }
        break
        
      case 'getOrderStatus':
        if (!params.orderNumber) {
          throw new Error('Order number is required')
        }
        
        result = await getCJOrderStatus(accessToken, params.orderNumber)
        
        // Update local order status if needed
        await supabaseClient
          .from('dropshipping_orders')
          .update({
            status: mapCJOrderStatus(result.orderStatus),
            supplier_data: result,
            updated_at: new Date().toISOString()
          })
          .eq('external_order_id', params.orderNumber)
        
        break
        
      case 'getTracking':
        if (!params.trackingNumber) {
          throw new Error('Tracking number is required')
        }
        
        result = await getCJTrackingInfo(accessToken, params.trackingNumber)
        break
        
      case 'calculateShipping':
        if (!params.products || !params.country) {
          throw new Error('Products and country are required for shipping calculation')
        }
        
        result = await calculateCJShippingCost(accessToken, {
          products: params.products,
          country: params.country,
          state: params.state,
          city: params.city
        })
        break
        
      default:
        throw new Error(`Unknown action: ${action}`)
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('CJ Dropshipping Order Error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        success: false 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
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