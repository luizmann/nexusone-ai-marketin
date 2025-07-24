import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ProductScrapingRequest {
  url: string
  supplier: 'cj_dropshipping' | 'dsers' | 'aliexpress' | 'amazon'
  import_to_store?: boolean
  category?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { url, supplier, import_to_store, category }: ProductScrapingRequest = await req.json()
    
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

    const creditsRequired = 3 // Product scraping costs 3 credits
    if (userData.credits < creditsRequired) {
      return new Response('Insufficient credits', { status: 402, headers: corsHeaders })
    }

    // Scrape product based on supplier
    let productData
    switch (supplier) {
      case 'cj_dropshipping':
        productData = await scrapeCJDropshipping(url)
        break
      case 'dsers':
        productData = await scrapeDSers(url)
        break
      case 'aliexpress':
        productData = await scrapeAliExpress(url)
        break
      case 'amazon':
        productData = await scrapeAmazon(url)
        break
      default:
        throw new Error('Unsupported supplier')
    }

    if (!productData.success) {
      throw new Error(productData.error || 'Failed to scrape product')
    }

    // Save or update product in database if requested
    let savedProduct = null
    if (import_to_store) {
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          user_id: user.id,
          title: productData.title,
          description: productData.description,
          price: productData.price,
          compare_at_price: productData.compare_at_price,
          sku: productData.sku,
          supplier_info: {
            supplier,
            original_url: url,
            supplier_product_id: productData.supplier_product_id
          },
          images: productData.images,
          variants: productData.variants,
          inventory_quantity: productData.inventory_quantity || 0,
          is_dropshipping: true,
          supplier_product_id: productData.supplier_product_id,
          category: category || productData.category,
          tags: productData.tags || [],
          seo_meta: {
            title: productData.title,
            description: productData.description?.substring(0, 160),
            keywords: productData.tags?.join(', ')
          }
        })
        .select()
        .single()

      if (productError) {
        console.error('Error saving product:', productError)
      } else {
        savedProduct = product
      }
    }

    // Consume credits
    await supabase.rpc('consume_credits', {
      p_user_id: user.id,
      p_amount: creditsRequired,
      p_module: 'product_scraper',
      p_description: `Scraped product from ${supplier}`
    })

    // Log usage analytics
    await supabase
      .from('usage_analytics')
      .insert({
        user_id: user.id,
        module: 'product_scraper',
        action: 'scrape_product',
        credits_consumed: creditsRequired,
        success: true,
        metadata: {
          supplier,
          url,
          product_id: savedProduct?.id,
          imported_to_store: import_to_store
        }
      })

    return new Response(
      JSON.stringify({
        success: true,
        product: productData,
        saved_product_id: savedProduct?.id,
        imported_to_store: !!savedProduct,
        credits_used: creditsRequired,
        remaining_credits: userData.credits - creditsRequired
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in product-scraper:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function scrapeCJDropshipping(url: string) {
  try {
    // Extract product ID from URL
    const productIdMatch = url.match(/\/product\/(\d+)/)
    if (!productIdMatch) {
      throw new Error('Invalid CJ Dropshipping URL')
    }

    const productId = productIdMatch[1]
    const apiKey = Deno.env.get('CJ_DROPSHIPPING_API_KEY')
    
    // Use CJ Dropshipping API
    const response = await fetch(`https://developers.cjdropshipping.com/api2.0/v1/product/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'CJ-Access-Token': apiKey || ''
      },
      body: JSON.stringify({
        pid: productId
      })
    })

    if (!response.ok) {
      throw new Error(`CJ API error: ${response.statusText}`)
    }

    const data = await response.json()
    const product = data.data

    return {
      success: true,
      title: product.productName,
      description: product.description,
      price: parseFloat(product.sellPrice),
      compare_at_price: parseFloat(product.sourcePrice),
      sku: product.productSku,
      supplier_product_id: productId,
      images: product.productImages?.map((img: any) => img.imagePath) || [],
      variants: product.variants || [],
      inventory_quantity: product.stockQuantity || 0,
      category: product.categoryName,
      tags: product.keywords?.split(',') || []
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

async function scrapeDSers(url: string) {
  try {
    // DSers doesn't have a public API, so we'll use web scraping
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch product page: ${response.statusText}`)
    }

    const html = await response.text()
    
    // Parse HTML using simple regex (in production, use a proper HTML parser)
    const titleMatch = html.match(/<title>(.*?)<\/title>/)
    const priceMatch = html.match(/price[":'\s]*(\d+\.?\d*)/i)
    const imageMatches = html.match(/https:\/\/[^"]*\.(?:jpg|jpeg|png|gif)/gi)

    return {
      success: true,
      title: titleMatch?.[1] || 'Product Title',
      description: 'Product description scraped from DSers',
      price: parseFloat(priceMatch?.[1] || '0'),
      compare_at_price: null,
      sku: `DSERS_${Date.now()}`,
      supplier_product_id: url.split('/').pop() || '',
      images: imageMatches?.slice(0, 5) || [],
      variants: [],
      inventory_quantity: 100,
      category: 'General',
      tags: ['dsers', 'dropshipping']
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

async function scrapeAliExpress(url: string) {
  try {
    // AliExpress scraping with basic parsing
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch AliExpress page: ${response.statusText}`)
    }

    const html = await response.text()
    
    // Extract product data using regex patterns
    const titleMatch = html.match(/"subject":"([^"]*)"/)
    const priceMatch = html.match(/"minPrice":"([^"]*)"/)
    const imageMatches = html.match(/https:\/\/[^"]*\.alicdn\.com[^"]*\.(?:jpg|jpeg|png|gif)/gi)

    return {
      success: true,
      title: titleMatch?.[1] || 'AliExpress Product',
      description: 'Product imported from AliExpress',
      price: parseFloat(priceMatch?.[1] || '0'),
      compare_at_price: null,
      sku: `ALI_${Date.now()}`,
      supplier_product_id: url.match(/\/(\d+)\.html/)?.[1] || '',
      images: imageMatches?.slice(0, 8) || [],
      variants: [],
      inventory_quantity: 999,
      category: 'Import',
      tags: ['aliexpress', 'import']
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

async function scrapeAmazon(url: string) {
  try {
    // Amazon scraping (note: Amazon has strict anti-scraping measures)
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch Amazon page: ${response.statusText}`)
    }

    const html = await response.text()
    
    // Amazon parsing patterns
    const titleMatch = html.match(/<title[^>]*>([^<]*Amazon[^<]*)<\/title>/)
    const priceMatch = html.match(/\$(\d+\.?\d*)/);
    const asinMatch = url.match(/\/dp\/([A-Z0-9]{10})/)

    return {
      success: true,
      title: titleMatch?.[1]?.replace(' - Amazon.com', '') || 'Amazon Product',
      description: 'Product imported from Amazon',
      price: parseFloat(priceMatch?.[1] || '0'),
      compare_at_price: null,
      sku: `AMZ_${asinMatch?.[1] || Date.now()}`,
      supplier_product_id: asinMatch?.[1] || '',
      images: [],
      variants: [],
      inventory_quantity: 50,
      category: 'Amazon Import',
      tags: ['amazon', 'import']
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}