import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CJProduct {
  pid: string
  productName: string
  productNameEn: string
  sellPrice: string
  originalPrice: string
  currency: string
  weight: string
  productImage: string
  productImages: string[]
  description: string
  categoryName: string
  shippingTime: string
  supplierName: string
  packQty: string
  sellQuantity: string
  variants: any[]
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

async function fetchCJProducts(
  accessToken: string,
  params: {
    pageNum?: number
    pageSize?: number
    categoryId?: string
    keyword?: string
    sortBy?: string
    priceMin?: number
    priceMax?: number
  }
): Promise<{ products: CJProduct[], total: number }> {
  const queryParams = new URLSearchParams({
    pageNum: (params.pageNum || 1).toString(),
    pageSize: (params.pageSize || 20).toString(),
    ...(params.categoryId && { categoryId: params.categoryId }),
    ...(params.keyword && { keyword: params.keyword }),
    ...(params.sortBy && { sortBy: params.sortBy }),
    ...(params.priceMin && { priceMin: params.priceMin.toString() }),
    ...(params.priceMax && { priceMax: params.priceMax.toString() })
  })

  const response = await fetch(
    `https://api.cjdropshipping.com/api/v2/products/list?${queryParams}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  )

  const data = await response.json()
  
  if (!data.result || !data.data) {
    throw new Error(`CJ API error: ${data.message || 'Failed to fetch products'}`)
  }

  return {
    products: data.data.list || [],
    total: data.data.total || 0
  }
}

async function fetchCJCategories(accessToken: string): Promise<any[]> {
  const response = await fetch(
    'https://api.cjdropshipping.com/api/v2/products/categories',
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    }
  )

  const data = await response.json()
  
  if (!data.result) {
    throw new Error(`CJ API error: ${data.message || 'Failed to fetch categories'}`)
  }

  return data.data || []
}

async function getTrendingProducts(accessToken: string, limit: number = 50): Promise<CJProduct[]> {
  const response = await fetchCJProducts(accessToken, {
    pageSize: limit,
    sortBy: 'sales'
  })
  
  return response.products
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, ...params } = await req.json()
    
    // Get Supabase client for user verification
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
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

    // Get CJ credentials from environment or user settings
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
      case 'getProducts':
        result = await fetchCJProducts(accessToken, params)
        break
        
      case 'getCategories':
        result = await fetchCJCategories(accessToken)
        break
        
      case 'getTrending':
        result = await getTrendingProducts(accessToken, params.limit)
        break
        
      case 'getProductDetails':
        if (!params.productId) {
          throw new Error('Product ID is required')
        }
        
        const detailResponse = await fetch(
          `https://api.cjdropshipping.com/api/v2/products/query?pid=${params.productId}`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
          }
        )
        
        const detailData = await detailResponse.json()
        
        if (!detailData.result) {
          throw new Error(`Failed to fetch product details: ${detailData.message}`)
        }
        
        result = detailData.data
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
    console.error('CJ Dropshipping Catalog Error:', error)
    
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