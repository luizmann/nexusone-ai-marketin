/**
 * Product Import Edge Function
 * 
 * Handles bulk import of products from CJ Dropshipping via URL or direct selection.
 * Supports both manual product selection and Chrome extension integration.
 */

import { createClient } from '@supabase/supabase-js'
import { createCJDropshippingService } from '../integrations/cj-dropshipping.js'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

interface ProductImportRequest {
  userId: string
  importType: 'url' | 'product_ids' | 'bulk_selection'
  data: {
    url?: string
    productIds?: string[]
    products?: Array<{
      id: string
      name: string
      price: number
      imageUrl: string
      category?: string
    }>
  }
  options?: {
    autoPublish?: boolean
    markupPercentage?: number
    category?: string
    tags?: string[]
  }
}

interface ImportResult {
  success: boolean
  importedProducts: number
  failedProducts: number
  skippedProducts: number
  errors: string[]
  productIds: string[]
  message: string
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
    const body: ProductImportRequest = await req.json()
    const { userId, importType, data, options = {} } = body

    console.log('Starting product import:', { userId, importType, dataKeys: Object.keys(data) })

    // Check user's subscription plan for import limits
    const { data: user } = await supabase
      .from('users')
      .select('subscription_plan')
      .eq('id', userId)
      .single()

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Check import limits based on plan
    const importLimits = {
      free: 10,
      pro: 100,
      premium: -1 // unlimited
    }

    const currentLimit = importLimits[user.subscription_plan as keyof typeof importLimits] || 10

    // Count existing products for this user
    const { count: existingProducts } = await supabase
      .from('dropshipping_products')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)

    const remainingSlots = currentLimit === -1 ? 999999 : Math.max(0, currentLimit - (existingProducts || 0))

    if (remainingSlots <= 0) {
      return new Response(JSON.stringify({ 
        error: `Import limit reached. Your ${user.subscription_plan} plan allows ${currentLimit} products.` 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

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

    let result: ImportResult

    switch (importType) {
      case 'url':
        result = await importFromUrl(cjService, userId, data.url!, options, remainingSlots)
        break
      case 'product_ids':
        result = await importFromProductIds(cjService, userId, data.productIds!, options, remainingSlots)
        break
      case 'bulk_selection':
        result = await importFromBulkSelection(cjService, userId, data.products!, options, remainingSlots)
        break
      default:
        throw new Error(`Invalid import type: ${importType}`)
    }

    // Log import activity
    await supabase
      .from('import_logs')
      .insert({
        user_id: userId,
        import_type: importType,
        products_imported: result.importedProducts,
        products_failed: result.failedProducts,
        products_skipped: result.skippedProducts,
        errors: result.errors,
        options,
        created_at: new Date().toISOString()
      })

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Product import error:', error)
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
 * Import products from CJ Dropshipping URL
 */
async function importFromUrl(
  cjService: any,
  userId: string,
  url: string,
  options: any,
  remainingSlots: number
): Promise<ImportResult> {
  try {
    // Extract product ID from CJ URL
    const productIdMatch = url.match(/\/product\/(\d+)/)
    if (!productIdMatch) {
      return {
        success: false,
        importedProducts: 0,
        failedProducts: 1,
        skippedProducts: 0,
        errors: ['Invalid CJ Dropshipping URL format'],
        productIds: [],
        message: 'Failed to extract product ID from URL'
      }
    }

    const productId = productIdMatch[1]
    return await importFromProductIds(cjService, userId, [productId], options, remainingSlots)

  } catch (error) {
    console.error('Import from URL error:', error)
    return {
      success: false,
      importedProducts: 0,
      failedProducts: 1,
      skippedProducts: 0,
      errors: [error.message],
      productIds: [],
      message: 'Failed to import from URL'
    }
  }
}

/**
 * Import products from CJ product IDs
 */
async function importFromProductIds(
  cjService: any,
  userId: string,
  productIds: string[],
  options: any,
  remainingSlots: number
): Promise<ImportResult> {
  
  const errors: string[] = []
  const importedProductIds: string[] = []
  let imported = 0
  let failed = 0
  let skipped = 0

  // Limit to remaining slots
  const idsToProcess = productIds.slice(0, remainingSlots)
  
  if (productIds.length > remainingSlots) {
    errors.push(`Limited to ${remainingSlots} products due to plan restrictions`)
  }

  console.log(`Processing ${idsToProcess.length} product IDs`)

  // Process products in batches
  const batchSize = 5
  for (let i = 0; i < idsToProcess.length; i += batchSize) {
    const batch = idsToProcess.slice(i, i + batchSize)
    
    await Promise.all(batch.map(async (productId) => {
      try {
        // Check if product already exists
        const { data: existingProduct } = await supabase
          .from('dropshipping_products')
          .select('id')
          .eq('external_id', productId)
          .eq('user_id', userId)
          .single()

        if (existingProduct) {
          console.log(`Product ${productId} already exists, skipping`)
          skipped++
          return
        }

        // Get product details from CJ
        const cjProduct = await cjService.getProductDetails(productId)
        
        // Apply markup if specified
        const finalPrice = options.markupPercentage 
          ? cjProduct.sellPrice * (1 + options.markupPercentage / 100)
          : cjProduct.sellPrice

        // Prepare product data
        const productData = {
          user_id: userId,
          external_id: cjProduct.id,
          name: cjProduct.name,
          description: cjProduct.description,
          price: finalPrice,
          original_price: cjProduct.originalPrice,
          cost: cjProduct.sellPrice,
          currency: cjProduct.currency,
          image_url: cjProduct.imageUrl,
          images: cjProduct.images,
          category: options.category || cjProduct.category,
          tags: options.tags || cjProduct.tags,
          stock_quantity: cjProduct.stockQuantity,
          weight: cjProduct.weight,
          supplier: 'cj_dropshipping',
          supplier_data: {
            supplierName: cjProduct.supplierName,
            shippingTime: cjProduct.shippingTime,
            moq: cjProduct.moq,
            variants: cjProduct.variants,
            specifications: cjProduct.specifications
          },
          is_active: options.autoPublish || false,
          is_available: cjProduct.stockQuantity > 0,
          created_at: new Date().toISOString()
        }

        // Insert product
        const { data: insertedProduct } = await supabase
          .from('dropshipping_products')
          .insert(productData)
          .select('id')
          .single()

        if (insertedProduct) {
          importedProductIds.push(insertedProduct.id)
          imported++
          console.log(`Successfully imported product: ${cjProduct.name}`)
        }

      } catch (error) {
        console.error(`Failed to import product ${productId}:`, error)
        errors.push(`Product ${productId}: ${error.message}`)
        failed++
      }
    }))

    // Rate limiting between batches
    if (i + batchSize < idsToProcess.length) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  return {
    success: imported > 0,
    importedProducts: imported,
    failedProducts: failed,
    skippedProducts: skipped,
    errors,
    productIds: importedProductIds,
    message: `Import completed: ${imported} imported, ${failed} failed, ${skipped} skipped`
  }
}

/**
 * Import products from bulk selection (Chrome extension)
 */
async function importFromBulkSelection(
  cjService: any,
  userId: string,
  products: Array<{ id: string; name: string; price: number; imageUrl: string; category?: string }>,
  options: any,
  remainingSlots: number
): Promise<ImportResult> {
  
  const errors: string[] = []
  const importedProductIds: string[] = []
  let imported = 0
  let failed = 0
  let skipped = 0

  // Limit to remaining slots
  const productsToProcess = products.slice(0, remainingSlots)
  
  if (products.length > remainingSlots) {
    errors.push(`Limited to ${remainingSlots} products due to plan restrictions`)
  }

  console.log(`Processing ${productsToProcess.length} products from bulk selection`)

  for (const product of productsToProcess) {
    try {
      // Check if product already exists
      const { data: existingProduct } = await supabase
        .from('dropshipping_products')
        .select('id')
        .eq('external_id', product.id)
        .eq('user_id', userId)
        .single()

      if (existingProduct) {
        console.log(`Product ${product.id} already exists, skipping`)
        skipped++
        continue
      }

      // Get full product details from CJ
      const cjProduct = await cjService.getProductDetails(product.id)
      
      // Apply markup if specified
      const finalPrice = options.markupPercentage 
        ? cjProduct.sellPrice * (1 + options.markupPercentage / 100)
        : cjProduct.sellPrice

      // Prepare product data
      const productData = {
        user_id: userId,
        external_id: cjProduct.id,
        name: cjProduct.name,
        description: cjProduct.description,
        price: finalPrice,
        original_price: cjProduct.originalPrice,
        cost: cjProduct.sellPrice,
        currency: cjProduct.currency,
        image_url: cjProduct.imageUrl,
        images: cjProduct.images,
        category: options.category || product.category || cjProduct.category,
        tags: options.tags || cjProduct.tags,
        stock_quantity: cjProduct.stockQuantity,
        weight: cjProduct.weight,
        supplier: 'cj_dropshipping',
        supplier_data: {
          supplierName: cjProduct.supplierName,
          shippingTime: cjProduct.shippingTime,
          moq: cjProduct.moq,
          variants: cjProduct.variants,
          specifications: cjProduct.specifications
        },
        is_active: options.autoPublish || false,
        is_available: cjProduct.stockQuantity > 0,
        created_at: new Date().toISOString()
      }

      // Insert product
      const { data: insertedProduct } = await supabase
        .from('dropshipping_products')
        .insert(productData)
        .select('id')
        .single()

      if (insertedProduct) {
        importedProductIds.push(insertedProduct.id)
        imported++
        console.log(`Successfully imported product: ${cjProduct.name}`)
      }

    } catch (error) {
      console.error(`Failed to import product ${product.id}:`, error)
      errors.push(`Product ${product.name}: ${error.message}`)
      failed++
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  return {
    success: imported > 0,
    importedProducts: imported,
    failedProducts: failed,
    skippedProducts: skipped,
    errors,
    productIds: importedProductIds,
    message: `Bulk import completed: ${imported} imported, ${failed} failed, ${skipped} skipped`
  }
}