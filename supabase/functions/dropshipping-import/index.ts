import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function importProductsFromCJ(
  supabaseClient: any,
  accessToken: string,
  productIds: string[],
  userId: string
): Promise<any[]> {
  const importedProducts = []
  
  for (const productId of productIds) {
    try {
      // Get product details from CJ
      const response = await fetch(
        `https://api.cjdropshipping.com/api/v2/products/query?pid=${productId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      const data = await response.json()
      
      if (!data.result || !data.data) {
        console.error(`Failed to fetch product ${productId}:`, data.message)
        continue
      }

      const product = data.data
      
      // Transform and save to our catalog
      const catalogProduct = {
        external_id: product.pid,
        name: product.productName,
        description: product.description || product.productName,
        price: parseFloat(product.sellPrice),
        original_price: parseFloat(product.originalPrice),
        currency: product.currency || 'USD',
        image_url: product.productImage,
        images: product.productImages || [product.productImage],
        category: product.categoryName,
        tags: product.productTags ? product.productTags.split(',') : [],
        stock_quantity: parseInt(product.sellQuantity) || 0,
        supplier: 'cj_dropshipping',
        supplier_data: {
          weight: product.weight,
          shippingTime: product.shippingTime,
          supplierName: product.supplierName,
          moq: parseInt(product.packQty || '1'),
          variants: product.variants || [],
          specifications: product.specifications || {}
        },
        imported_by: userId,
        is_active: true,
        commission_rate: 0.30 // 30% default commission
      }

      // Insert or update in catalog
      const { data: insertedProduct, error } = await supabaseClient
        .from('dropshipping_catalog')
        .upsert(catalogProduct, { onConflict: 'external_id' })
        .select()
        .single()

      if (error) {
        console.error(`Failed to save product ${productId}:`, error)
        continue
      }

      // Add to user's product assignments
      await supabaseClient
        .from('dropshipping_user_products')
        .upsert({
          user_id: userId,
          product_id: insertedProduct.id,
          assigned_at: new Date().toISOString(),
          is_active: true
        }, { onConflict: 'user_id,product_id' })

      importedProducts.push(insertedProduct)
      
    } catch (error) {
      console.error(`Error importing product ${productId}:`, error)
    }
  }
  
  return importedProducts
}

async function bulkImportTrendingProducts(
  supabaseClient: any,
  accessToken: string,
  userId: string,
  categories: string[] = [],
  limit: number = 100
): Promise<any[]> {
  try {
    // Get trending products from CJ
    const queryParams = new URLSearchParams({
      pageNum: '1',
      pageSize: limit.toString(),
      sortBy: 'sales'
    })

    if (categories.length > 0) {
      queryParams.append('categoryId', categories[0]) // CJ API typically accepts one category
    }

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
    
    if (!data.result || !data.data?.list) {
      throw new Error(`Failed to fetch trending products: ${data.message}`)
    }

    const productIds = data.data.list.map((p: any) => p.pid)
    
    // Import these products
    return await importProductsFromCJ(supabaseClient, accessToken, productIds, userId)
    
  } catch (error) {
    console.error('Bulk import error:', error)
    throw error
  }
}

async function syncProductStock(
  supabaseClient: any,
  accessToken: string,
  productIds: string[]
): Promise<void> {
  for (const productId of productIds) {
    try {
      // Get current stock from CJ
      const response = await fetch(
        `https://api.cjdropshipping.com/api/v2/products/query?pid=${productId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      const data = await response.json()
      
      if (data.result && data.data) {
        // Update stock in our catalog
        await supabaseClient
          .from('dropshipping_catalog')
          .update({
            stock_quantity: parseInt(data.data.sellQuantity) || 0,
            price: parseFloat(data.data.sellPrice),
            updated_at: new Date().toISOString()
          })
          .eq('external_id', productId)
          .eq('supplier', 'cj_dropshipping')
      }
      
    } catch (error) {
      console.error(`Error syncing stock for product ${productId}:`, error)
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, ...params } = await req.json()
    
    // Get Supabase client
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
    const authResponse = await fetch('https://api.cjdropshipping.com/api/v2/authentication/getAccessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: cjEmail, password: cjPassword })
    })

    const authData = await authResponse.json()
    
    if (!authData.result || !authData.data?.accessToken) {
      throw new Error(`CJ Authentication failed: ${authData.message || 'Unknown error'}`)
    }
    
    const accessToken = authData.data.accessToken

    let result: any

    switch (action) {
      case 'importProducts':
        if (!params.productIds || !Array.isArray(params.productIds)) {
          throw new Error('Product IDs array is required')
        }
        
        result = await importProductsFromCJ(
          supabaseClient,
          accessToken,
          params.productIds,
          user.id
        )
        break
        
      case 'importTrending':
        result = await bulkImportTrendingProducts(
          supabaseClient,
          accessToken,
          user.id,
          params.categories || [],
          params.limit || 100
        )
        break
        
      case 'syncStock':
        if (!params.productIds || !Array.isArray(params.productIds)) {
          throw new Error('Product IDs array is required')
        }
        
        await syncProductStock(supabaseClient, accessToken, params.productIds)
        result = { success: true, message: 'Stock synced successfully' }
        break
        
      case 'getUserProducts':
        // Get user's assigned products
        const { data: userProducts, error: userProductsError } = await supabaseClient
          .from('dropshipping_user_products')
          .select(`
            *,
            product:dropshipping_catalog(*)
          `)
          .eq('user_id', user.id)
          .eq('is_active', true)
        
        if (userProductsError) {
          throw new Error('Failed to fetch user products')
        }
        
        result = userProducts
        break
        
      case 'removeUserProduct':
        if (!params.productId) {
          throw new Error('Product ID is required')
        }
        
        await supabaseClient
          .from('dropshipping_user_products')
          .update({ is_active: false })
          .eq('user_id', user.id)
          .eq('product_id', params.productId)
        
        result = { success: true, message: 'Product removed from your catalog' }
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
    console.error('Dropshipping Import Error:', error)
    
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