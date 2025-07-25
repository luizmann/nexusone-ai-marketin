/**
 * Inventory Sync Edge Function
 * 
 * Automatically syncs product inventory levels from CJ Dropshipping
 * and updates stock quantities in real-time to prevent overselling.
 */

import { createClient } from '@supabase/supabase-js'
import { createCJDropshippingService } from '../integrations/cj-dropshipping.js'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

interface InventorySyncRequest {
  userId: string
  productIds?: string[]
  syncAll?: boolean
  scheduleId?: string
}

interface InventoryUpdate {
  productId: string
  stockQuantity: number
  price: number
  isAvailable: boolean
  lastSyncAt: string
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
    const body: InventorySyncRequest = await req.json()
    const { userId, productIds, syncAll = false, scheduleId } = body

    console.log('Starting inventory sync:', { userId, productIds, syncAll, scheduleId })

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

    // Decrypt API key (simplified - in production use proper encryption)
    const cjConfig = JSON.parse(apiKeys.encrypted_key)
    const cjService = createCJDropshippingService(cjConfig)

    // Authenticate with CJ
    await cjService.authenticate()

    // Get products to sync
    let productsToSync: any[] = []
    
    if (syncAll) {
      // Get all user's dropshipping products
      const { data: allProducts } = await supabase
        .from('dropshipping_products')
        .select('external_id, id, name')
        .eq('user_id', userId)
        .eq('supplier', 'cj_dropshipping')
        .eq('is_active', true)
      
      productsToSync = allProducts || []
    } else if (productIds && productIds.length > 0) {
      // Get specific products
      const { data: specificProducts } = await supabase
        .from('dropshipping_products')
        .select('external_id, id, name')
        .eq('user_id', userId)
        .eq('supplier', 'cj_dropshipping')
        .in('external_id', productIds)
      
      productsToSync = specificProducts || []
    }

    if (productsToSync.length === 0) {
      return new Response(JSON.stringify({ 
        message: 'No products found to sync',
        syncedProducts: 0
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    console.log(`Syncing ${productsToSync.length} products`)

    const updates: InventoryUpdate[] = []
    const errors: string[] = []

    // Process products in batches to avoid API rate limits
    const batchSize = 10
    for (let i = 0; i < productsToSync.length; i += batchSize) {
      const batch = productsToSync.slice(i, i + batchSize)
      
      await Promise.all(batch.map(async (product) => {
        try {
          // Get latest product data from CJ
          const cjProduct = await cjService.getProductDetails(product.external_id)
          
          const update: InventoryUpdate = {
            productId: product.id,
            stockQuantity: cjProduct.stockQuantity,
            price: cjProduct.sellPrice,
            isAvailable: cjProduct.stockQuantity > 0,
            lastSyncAt: new Date().toISOString()
          }
          
          updates.push(update)
          
          // Update product in database
          await supabase
            .from('dropshipping_products')
            .update({
              stock_quantity: update.stockQuantity,
              price: update.price,
              is_available: update.isAvailable,
              last_sync_at: update.lastSyncAt
            })
            .eq('id', product.id)
          
          console.log(`Updated product ${product.name}: stock=${update.stockQuantity}, price=${update.price}`)
          
        } catch (error) {
          const errorMsg = `Failed to sync product ${product.name}: ${error.message}`
          console.error(errorMsg)
          errors.push(errorMsg)
        }
      }))
      
      // Rate limiting - wait between batches
      if (i + batchSize < productsToSync.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    // Log sync activity
    await supabase
      .from('inventory_sync_logs')
      .insert({
        user_id: userId,
        products_synced: updates.length,
        products_failed: errors.length,
        schedule_id: scheduleId,
        sync_details: {
          updates: updates.map(u => ({
            productId: u.productId,
            stockQuantity: u.stockQuantity,
            price: u.price
          })),
          errors
        },
        created_at: new Date().toISOString()
      })

    // Check for low stock alerts
    const lowStockProducts = updates.filter(u => u.stockQuantity <= 5 && u.stockQuantity > 0)
    const outOfStockProducts = updates.filter(u => u.stockQuantity === 0)

    if (lowStockProducts.length > 0 || outOfStockProducts.length > 0) {
      // Send notifications
      await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: 'inventory_alert',
          title: 'Inventory Alert',
          message: `${lowStockProducts.length} products are low in stock, ${outOfStockProducts.length} are out of stock`,
          data: {
            lowStock: lowStockProducts.length,
            outOfStock: outOfStockProducts.length,
            products: [...lowStockProducts, ...outOfStockProducts]
          },
          is_read: false,
          created_at: new Date().toISOString()
        })
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Inventory sync completed`,
      syncedProducts: updates.length,
      failedProducts: errors.length,
      lowStockAlerts: lowStockProducts.length,
      outOfStockAlerts: outOfStockProducts.length,
      updates,
      errors
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Inventory sync error:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})