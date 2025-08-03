/**
 * NexusOneAI Edge Function: Magic Page Generator
 * Creates high-converting sales pages from product URLs using AI
 */

import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MagicPageRequest {
  productUrl: string
  config?: {
    template?: 'modern' | 'minimal' | 'bold' | 'luxury'
    targetAudience?: string
    conversionGoal?: 'sales' | 'leads' | 'signups'
    language?: string
    customBranding?: {
      primaryColor?: string
      logo?: string
      companyName?: string
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get user from JWT
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) {
      throw new Error('Unauthorized')
    }

    const body: MagicPageRequest = await req.json()
    const { productUrl, config = {} } = body

    // Check user credits and plan limits
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('credits, plan')
      .eq('user_id', user.id)
      .single()

    if (!profile) {
      throw new Error('User profile not found')
    }

    const creditsNeeded = 10 // Cost for generating a magic page
    
    if (profile.credits < creditsNeeded) {
      throw new Error('Insufficient credits')
    }

    // Check plan limits
    const { data: existingPages } = await supabase
      .from('magic_pages')
      .select('id')
      .eq('user_id', user.id)

    const planLimits = {
      free: 2,
      pro: 20,
      premium: -1 // unlimited
    }

    const limit = planLimits[profile.plan as keyof typeof planLimits] || 2
    if (limit !== -1 && existingPages && existingPages.length >= limit) {
      throw new Error('Page limit reached for your plan')
    }

    // Scrape product data
    const productData = await scrapeProductData(productUrl)
    
    // Generate sales page content with AI
    const pageContent = await generatePageContent(productData, config)
    
    // Generate unique slug
    const slug = generateSlug(productData.title)
    
    // Create magic page record
    const { data: pageRecord, error: insertError } = await supabase
      .from('magic_pages')
      .insert({
        user_id: user.id,
        title: pageContent.title,
        slug,
        content: pageContent,
        product_url: productUrl,
        product_data: productData,
        template: config.template || 'modern',
        seo_title: pageContent.seoTitle,
        seo_description: pageContent.seoDescription,
        seo_keywords: pageContent.seoKeywords,
        published: false
      })
      .select()
      .single()

    if (insertError) {
      throw new Error('Failed to create magic page')
    }

    // Deduct credits
    await supabase
      .from('user_profiles')
      .update({ credits: profile.credits - creditsNeeded })
      .eq('user_id', user.id)

    // Log usage
    await supabase
      .from('usage_logs')
      .insert({
        user_id: user.id,
        action: 'magic_page_generation',
        credits_used: creditsNeeded,
        api_service: 'openai',
        metadata: {
          page_id: pageRecord.id,
          product_url: productUrl,
          template: config.template
        }
      })

    return new Response(
      JSON.stringify({
        page_id: pageRecord.id,
        title: pageContent.title,
        slug,
        preview_url: `https://nexusoneai.com/p/${slug}`,
        content: pageContent,
        credits_used: creditsNeeded,
        remaining_credits: profile.credits - creditsNeeded
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Magic Page Generation Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

async function scrapeProductData(url: string) {
  try {
    // Use a simple fetch for now - in production, you'd use a more robust scraper
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch product page')
    }
    
    const html = await response.text()
    
    // Basic HTML parsing - extract key information
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const descriptionMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"/i)
    const priceMatch = html.match(/\$[\d,]+\.?\d*/g)
    const imageMatches = html.match(/<img[^>]*src="([^"]+)"/gi)
    
    // Extract Open Graph data
    const ogTitleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/i)
    const ogDescriptionMatch = html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]+)"/i)
    const ogImageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i)
    
    const images = imageMatches?.map(match => {
      const srcMatch = match.match(/src="([^"]+)"/i)
      return srcMatch ? srcMatch[1] : null
    }).filter(Boolean).slice(0, 5) || []

    return {
      title: ogTitleMatch?.[1] || titleMatch?.[1] || 'Product',
      description: ogDescriptionMatch?.[1] || descriptionMatch?.[1] || '',
      price: priceMatch?.[0] || '',
      images,
      url
    }
  } catch (error) {
    console.error('Scraping error:', error)
    // Fallback data
    return {
      title: 'Amazing Product',
      description: 'High-quality product that solves your problems',
      price: '$99',
      images: [],
      url
    }
  }
}

async function generatePageContent(productData: any, config: any) {
  const prompt = `Create a high-converting sales page for this product:

Product: ${productData.title}
Description: ${productData.description}
Price: ${productData.price}
Template Style: ${config.template || 'modern'}
Target Audience: ${config.targetAudience || 'general consumers'}
Conversion Goal: ${config.conversionGoal || 'sales'}

Generate a complete sales page with:
1. Compelling headline
2. Product benefits (not just features)
3. Social proof section
4. Pricing section with urgency
5. FAQ section
6. Strong call-to-action
7. SEO title and meta description
8. Relevant keywords

Make it persuasive, professional, and conversion-focused. Use proven copywriting techniques like AIDA, PAS, or similar frameworks.

Return in JSON format with sections: headline, subheadline, benefits, features, social_proof, pricing, faq, cta, seoTitle, seoDescription, seoKeywords.`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a professional copywriter specializing in high-converting sales pages.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to generate page content')
  }

  const data = await response.json()
  const content = data.choices[0]?.message?.content

  try {
    return JSON.parse(content)
  } catch {
    // Fallback structure if JSON parsing fails
    return {
      title: productData.title,
      headline: `Get ${productData.title} - Limited Time Offer!`,
      subheadline: 'Transform your life with this amazing product',
      benefits: [
        'Solve your biggest problems instantly',
        'Save time and money',
        'Get results guaranteed'
      ],
      features: [
        'High-quality construction',
        'Easy to use',
        'Backed by warranty'
      ],
      social_proof: [
        '"This product changed my life!" - Happy Customer',
        '"Best purchase I ever made." - Satisfied User'
      ],
      pricing: {
        original_price: '$199',
        sale_price: productData.price || '$99',
        savings: '$100',
        urgency: 'Limited time offer - Order now!'
      },
      faq: [
        {
          question: 'How quickly will I see results?',
          answer: 'Most customers see results within the first week of use.'
        }
      ],
      cta: 'Order Now - Limited Time!',
      seoTitle: `${productData.title} - Best Deal Online`,
      seoDescription: `Get ${productData.title} at the best price. ${productData.description}`,
      seoKeywords: [productData.title.toLowerCase(), 'best deal', 'online shopping']
    }
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50) + '-' + Math.random().toString(36).substring(2, 8)
}