import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GenerationRequest {
  stepId: string
  productData: {
    name: string
    description: string
    price: number
    category: string
    targetAudience: string
    keyFeatures: string[]
    supplier: string
  }
  language?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { stepId, productData, language = 'en' }: GenerationRequest = await req.json()

    // Get user
    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      throw new Error('Unauthorized')
    }

    let result: any = {}

    switch (stepId) {
      case 'product-analysis':
        result = await generateProductAnalysis(productData)
        break
      case 'audience-research':
        result = await generateAudienceResearch(productData)
        break
      case 'competitor-analysis':
        result = await generateCompetitorAnalysis(productData)
        break
      case 'landing-page':
        result = await generateLandingPage(productData, language)
        break
      case 'facebook-ads':
        result = await generateFacebookAds(productData, language)
        break
      case 'video-script':
        result = await generateVideoScript(productData, language)
        break
      case 'whatsapp-bot':
        result = await generateWhatsAppBot(productData, language)
        break
      case 'seo-content':
        result = await generateSEOContent(productData, language)
        break
      case 'validation-metrics':
        result = await generateValidationMetrics(productData)
        break
      default:
        throw new Error(`Unknown step: ${stepId}`)
    }

    // Store generation result
    await supabaseClient.from('ai_generations').insert({
      user_id: user.id,
      step_id: stepId,
      product_name: productData.name,
      result: result,
      language: language,
      created_at: new Date().toISOString()
    })

    return new Response(
      JSON.stringify({ success: true, result }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('AI Content Generation Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})

async function generateProductAnalysis(productData: any) {
  // Use real AI API call here - OpenAI, Claude, etc.
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
  
  if (!openaiApiKey) {
    // Fallback mock data
    return {
      marketSize: calculateMarketSize(productData.category),
      growthRate: "12-18% YoY",
      competitorCount: Math.floor(Math.random() * 50) + 10,
      profitMargin: "45-65%",
      demandScore: Math.random() * 3 + 7, // 7-10 scale
      trends: [
        "Increasing demand for smart features",
        "Price sensitivity in current market",
        "Brand loyalty important in category"
      ]
    }
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a market research analyst. Provide detailed product analysis based on the given product data.'
        },
        {
          role: 'user',
          content: `Analyze this product for dropshipping potential: ${JSON.stringify(productData)}`
        }
      ],
      max_tokens: 1000
    })
  })

  const data = await response.json()
  
  // Parse AI response and structure it
  return {
    marketSize: extractMarketSize(data.choices[0].message.content),
    growthRate: extractGrowthRate(data.choices[0].message.content),
    competitorCount: extractCompetitorCount(data.choices[0].message.content),
    profitMargin: extractProfitMargin(data.choices[0].message.content),
    demandScore: extractDemandScore(data.choices[0].message.content),
    aiAnalysis: data.choices[0].message.content
  }
}

async function generateAudienceResearch(productData: any) {
  return {
    primaryAudience: {
      age: getAgeRange(productData.category),
      gender: getGenderSplit(productData.category),
      income: getIncomeRange(productData.price),
      interests: generateInterests(productData.category, productData.keyFeatures),
      platforms: ["Facebook", "Instagram", "TikTok", "YouTube"],
      behavior: generateBehaviorInsights(productData)
    },
    secondaryAudience: {
      age: "35-55",
      gender: "55% Female, 45% Male",
      income: "$75k-$150k",
      interests: ["Quality products", "Online shopping", "Reviews"],
      platforms: ["Facebook", "Google", "Email"]
    },
    audienceSize: `${(Math.random() * 5 + 1).toFixed(1)}M users`,
    engagement: `${(Math.random() * 3 + 4).toFixed(1)}% average engagement rate`
  }
}

async function generateCompetitorAnalysis(productData: any) {
  return {
    topCompetitors: [
      {
        name: `${productData.category} Pro`,
        price: `$${(productData.price * 0.8).toFixed(2)}`,
        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
        strengths: ["Brand recognition", "Fast shipping"],
        weaknesses: ["Higher price", "Limited features"]
      },
      {
        name: `Elite ${productData.category}`,
        price: `$${(productData.price * 1.2).toFixed(2)}`,
        rating: (Math.random() * 1 + 4).toFixed(1),
        strengths: ["Premium quality", "Good reviews"],
        weaknesses: ["Expensive", "Limited availability"]
      },
      {
        name: `Budget ${productData.category}`,
        price: `$${(productData.price * 0.6).toFixed(2)}`,
        rating: (Math.random() * 1 + 3).toFixed(1),
        strengths: ["Low price", "Basic functionality"],
        weaknesses: ["Poor quality", "No warranty"]
      }
    ],
    priceAdvantage: calculatePriceAdvantage(productData.price),
    keyDifferentiators: productData.keyFeatures.slice(0, 3),
    marketGap: "Premium features at mid-range price point",
    recommendation: "Position as best value option with premium features"
  }
}

async function generateLandingPage(productData: any, language: string) {
  const headlines = {
    en: `🔥 Revolutionary ${productData.name} - Limited Time 50% OFF!`,
    es: `🔥 Revolucionario ${productData.name} - ¡50% DE DESCUENTO por Tiempo Limitado!`,
    pt: `🔥 Revolucionário ${productData.name} - 50% DE DESCONTO por Tempo Limitado!`,
    ar: `🔥 ثوري ${productData.name} - خصم 50% لفترة محدودة!`,
    he: `🔥 מהפכני ${productData.name} - 50% הנחה לזמן محدود!`
  }

  const ctas = {
    en: "Order Now - Free Shipping Worldwide!",
    es: "¡Ordenar Ahora - Envío Gratis Mundial!",
    pt: "Peça Agora - Frete Grátis Mundial!",
    ar: "اطلب الآن - شحن مجاني في جميع أنحاء العالم!",
    he: "הזמן עכשיו - משלוח חינם לכל העולם!"
  }

  return {
    landingPage: {
      headline: headlines[language] || headlines.en,
      subheadline: `Experience the future of ${productData.category.toLowerCase()} with ${productData.keyFeatures[0]}`,
      benefits: [
        `Save ${Math.floor(Math.random() * 5 + 2)} hours daily with superior performance`,
        "Lifetime warranty and 30-day money back guarantee",
        `Trusted by ${Math.floor(Math.random() * 50 + 10)}K+ satisfied customers worldwide`,
        "Free shipping and 24/7 customer support"
      ],
      cta: ctas[language] || ctas.en,
      testimonials: [
        {
          name: "Sarah M.",
          review: "Best purchase I've made this year! Quality is outstanding.",
          rating: 5,
          verified: true
        },
        {
          name: "Mike T.",
          review: "Incredible quality and fast shipping. Highly recommended!",
          rating: 5,
          verified: true
        },
        {
          name: "Jennifer L.",
          review: "Worth every penny. Great customer service too.",
          rating: 5,
          verified: true
        }
      ],
      urgency: "Only 47 units left in stock!",
      guarantee: "30-day money back guarantee",
      shipping: "Free worldwide shipping",
      security: "SSL secured checkout"
    }
  }
}

async function generateFacebookAds(productData: any, language: string) {
  const headlines = {
    en: `🔥 ${productData.name} - 50% OFF Today Only!`,
    es: `🔥 ${productData.name} - ¡50% DE DESCUENTO Solo Hoy!`,
    pt: `🔥 ${productData.name} - 50% DE DESCONTO Apenas Hoje!`,
    ar: `🔥 ${productData.name} - خصم 50% اليوم فقط!`,
    he: `🔥 ${productData.name} - 50% הנחה היום בלבד!`
  }

  return {
    facebookAd: {
      headline: headlines[language] || headlines.en,
      description: `Join thousands of happy customers who upgraded their ${productData.category.toLowerCase()}. Limited stock available - order now!`,
      cta: language === 'ar' ? 'تسوق الآن' : language === 'he' ? 'קנה עכשיו' : 'Shop Now',
      targetAudience: {
        interests: generateAdInterests(productData.category),
        age: "25-55",
        behavior: "Online shoppers, Tech enthusiasts",
        countries: ["US", "CA", "AU", "UK", "DE"],
        languages: [language]
      },
      budget: Math.floor(Math.random() * 50 + 30),
      creative: {
        primaryText: generateAdCopy(productData, language),
        callToAction: language === 'ar' ? 'تسوق الآن' : language === 'he' ? 'קנה עכשיו' : 'Shop Now',
        imageStyle: "Product showcase with lifestyle context"
      }
    }
  }
}

async function generateVideoScript(productData: any, language: string) {
  const scripts = {
    en: {
      hook: `Are you tired of ${productData.category.toLowerCase()} that break after a few months?`,
      problem: `Most ${productData.category.toLowerCase()} on the market are cheaply made and don't last...`,
      solution: `That's why we created the ${productData.name} - engineered for durability and performance`,
      benefits: productData.keyFeatures,
      cta: "Click the link below to get yours with 50% off today!"
    },
    es: {
      hook: `¿Estás cansado de ${productData.category.toLowerCase()} que se rompen después de unos meses?`,
      problem: `La mayoría de ${productData.category.toLowerCase()} en el mercado están mal hechos y no duran...`,
      solution: `Por eso creamos el ${productData.name} - diseñado para durabilidad y rendimiento`,
      benefits: productData.keyFeatures,
      cta: "¡Haz clic en el enlace para obtener el tuyo con 50% de descuento hoy!"
    }
  }

  return {
    videoScript: scripts[language] || scripts.en
  }
}

async function generateWhatsAppBot(productData: any, language: string) {
  const greetings = {
    en: `Hi! 👋 Thanks for your interest in the ${productData.name}!`,
    es: `¡Hola! 👋 ¡Gracias por tu interés en el ${productData.name}!`,
    pt: `Oi! 👋 Obrigado pelo seu interesse no ${productData.name}!`,
    ar: `مرحبا! 👋 شكرا لاهتمامك بـ ${productData.name}!`,
    he: `שלום! 👋 תודה על העניין שלך ב-${productData.name}!`
  }

  return {
    whatsappBot: {
      greeting: greetings[language] || greetings.en,
      productInfo: `Our ${productData.name} features ${productData.keyFeatures.join(', ')} for just $${productData.price}`,
      objectionHandling: [
        "Price concerns: We offer payment plans and price matching",
        "Quality doubts: 30-day money back guarantee + lifetime warranty",
        "Shipping worries: Free shipping worldwide with tracking",
        "Trust issues: 50K+ verified customer reviews"
      ],
      closingScript: "Ready to upgrade your life? Let's get your order started! 🚀",
      followUp: "Did you have any other questions about the product?",
      urgency: "This special price is only available for 24 more hours!"
    }
  }
}

async function generateSEOContent(productData: any, language: string) {
  return {
    seoContent: {
      title: `Best ${productData.name} 2024 - Premium Quality & Fast Shipping`,
      metaDescription: `Shop the highest rated ${productData.name} with ${productData.keyFeatures[0]}. Free shipping, 30-day returns. Order now!`,
      keywords: [
        productData.name.toLowerCase(),
        productData.category.toLowerCase(),
        "best",
        "premium",
        "2024",
        "review",
        "buy",
        "online"
      ],
      content: `# Complete ${productData.name} Buying Guide 2024\n\nLooking for the best ${productData.name}? Our comprehensive review covers everything you need to know...`,
      h1: `Best ${productData.name} - Complete 2024 Review & Buying Guide`,
      h2Tags: [
        `What Makes ${productData.name} Special?`,
        "Key Features and Benefits",
        "Customer Reviews and Ratings",
        "Pricing and Where to Buy",
        "Frequently Asked Questions"
      ]
    }
  }
}

async function generateValidationMetrics(productData: any) {
  return {
    kpis: [
      { metric: "Landing Page CVR", target: "3.5%", current: "0%", description: "Conversion rate target" },
      { metric: "Facebook CPM", target: "$8.50", current: "TBD", description: "Cost per mille" },
      { metric: "ROAS Target", target: "4.0x", current: "TBD", description: "Return on ad spend" },
      { metric: "WhatsApp Response Rate", target: "85%", current: "TBD", description: "Bot response rate" },
      { metric: "Email Open Rate", target: "28%", current: "TBD", description: "Email engagement" },
      { metric: "Cart Abandonment", target: "<65%", current: "TBD", description: "Checkout completion" }
    ],
    testingPlan: "A/B test headlines, images, and CTAs over 7 days with 1000 visitors minimum",
    successCriteria: {
      phase1: "Achieve 2%+ landing page conversion",
      phase2: "ROAS of 3x+ on Facebook ads",
      phase3: "Scale to $1000+ daily revenue"
    }
  }
}

// Helper functions
function calculateMarketSize(category: string): string {
  const sizes = {
    'Electronics': '$2.5B',
    'Home Security': '$1.8B',
    'Mobile Accessories': '$950M',
    'Fitness': '$1.2B',
    'Beauty': '$3.1B'
  }
  return sizes[category] || '$1.5B'
}

function getAgeRange(category: string): string {
  const ranges = {
    'Electronics': '18-45',
    'Home Security': '30-60',
    'Mobile Accessories': '16-40',
    'Fitness': '20-50',
    'Beauty': '18-55'
  }
  return ranges[category] || '25-45'
}

function getGenderSplit(category: string): string {
  const splits = {
    'Electronics': '65% Male, 35% Female',
    'Home Security': '55% Male, 45% Female',
    'Mobile Accessories': '50% Male, 50% Female',
    'Fitness': '45% Male, 55% Female',
    'Beauty': '20% Male, 80% Female'
  }
  return splits[category] || '50% Male, 50% Female'
}

function getIncomeRange(price: number): string {
  if (price < 50) return '$30k-$75k'
  if (price < 100) return '$50k-$100k'
  if (price < 200) return '$75k-$150k'
  return '$100k+'
}

function generateInterests(category: string, features: string[]): string[] {
  const baseInterests = {
    'Electronics': ['Technology', 'Gadgets', 'Innovation'],
    'Home Security': ['Home improvement', 'Safety', 'Smart homes'],
    'Mobile Accessories': ['Smartphones', 'Technology', 'Productivity'],
    'Fitness': ['Health', 'Exercise', 'Wellness'],
    'Beauty': ['Skincare', 'Makeup', 'Self-care']
  }
  
  return [...(baseInterests[category] || ['Shopping', 'Quality products']), ...features.slice(0, 2)]
}

function generateBehaviorInsights(productData: any): string[] {
  return [
    "Research products online before buying",
    "Read reviews and compare prices",
    "Share purchases on social media",
    "Influenced by video demonstrations",
    "Price sensitive but value quality"
  ]
}

function calculatePriceAdvantage(price: number): string {
  const advantage = Math.floor(Math.random() * 25 + 10)
  return `${advantage}% better value than competitors`
}

function generateAdInterests(category: string): string[] {
  const interests = {
    'Electronics': ['Consumer electronics', 'Technology early adopters', 'Online shopping'],
    'Home Security': ['Home security', 'Smart home technology', 'Home improvement'],
    'Mobile Accessories': ['Mobile technology', 'Smartphone accessories', 'Tech gadgets'],
    'Fitness': ['Fitness and wellness', 'Health and fitness', 'Exercise equipment'],
    'Beauty': ['Beauty', 'Skincare', 'Cosmetics and beauty products']
  }
  
  return interests[category] || ['Shopping', 'Consumer goods', 'Quality products']
}

function generateAdCopy(productData: any, language: string): string {
  const templates = {
    en: `🌟 AMAZING DEAL: Get the ${productData.name} with ${productData.keyFeatures[0]} for just $${productData.price}! ✨ Free shipping worldwide 🚚 30-day guarantee 💯`,
    es: `🌟 OFERTA INCREÍBLE: ¡Consigue el ${productData.name} con ${productData.keyFeatures[0]} por solo $${productData.price}! ✨ Envío gratis mundial 🚚 Garantía de 30 días 💯`,
    pt: `🌟 OFERTA INCRÍVEL: Tenha o ${productData.name} com ${productData.keyFeatures[0]} por apenas $${productData.price}! ✨ Frete grátis mundial 🚚 Garantia de 30 dias 💯`
  }
  
  return templates[language] || templates.en
}

// Helper extraction functions for AI responses
function extractMarketSize(content: string): string {
  const match = content.match(/market size.*?(\$[\d.]+[BMK])/i)
  return match ? match[1] : '$1.5B'
}

function extractGrowthRate(content: string): string {
  const match = content.match(/growth.*?(\d+%)/i)
  return match ? match[1] + ' YoY' : '12% YoY'
}

function extractCompetitorCount(content: string): number {
  const match = content.match(/competitor.*?(\d+)/i)
  return match ? parseInt(match[1]) : Math.floor(Math.random() * 40 + 10)
}

function extractProfitMargin(content: string): string {
  const match = content.match(/margin.*?(\d+%)/i)
  return match ? match[1] : '55%'
}

function extractDemandScore(content: string): number {
  const match = content.match(/demand.*?(\d+\.?\d*)/i)
  return match ? parseFloat(match[1]) : Math.random() * 3 + 7
}