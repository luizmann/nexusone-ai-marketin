import { supabase, mockSupabase } from '@/lib/supabase'

interface ProductData {
  name: string
  description: string
  price: number
  category: string
  targetAudience: string
  keyFeatures: string[]
  supplier: string
}

interface GenerationStep {
  stepId: string
  name: string
  description: string
}

export class AIContentGenerationService {
  private static readonly FUNCTION_NAME = 'ai-content-generation'
  private static readonly USE_MOCK = true // Set to false when real APIs are available
  
  static async generateContentForStep(
    stepId: string, 
    productData: ProductData, 
    language: string = 'en'
  ): Promise<any> {
    try {
      const client = this.USE_MOCK ? mockSupabase : supabase
      
      const { data, error } = await client.functions.invoke(this.FUNCTION_NAME, {
        body: {
          stepId,
          productData,
          language
        }
      })

      if (error) throw error
      
      return data.result
    } catch (error) {
      console.error(`Error generating content for step ${stepId}:`, error)
      
      // Fallback to mock data if backend fails
      return this.getMockDataForStep(stepId, productData, language)
    }
  }

  static async generateCompleteContentPipeline(
    productData: ProductData,
    language: string = 'en',
    onStepComplete?: (step: string, result: any) => void
  ): Promise<Record<string, any>> {
    const steps = [
      'product-analysis',
      'audience-research', 
      'competitor-analysis',
      'landing-page',
      'facebook-ads',
      'video-script',
      'whatsapp-bot',
      'seo-content',
      'validation-metrics'
    ]

    const results: Record<string, any> = {}

    for (const stepId of steps) {
      try {
        const result = await this.generateContentForStep(stepId, productData, language)
        results[stepId] = result
        
        if (onStepComplete) {
          onStepComplete(stepId, result)
        }
      } catch (error) {
        console.error(`Failed to generate content for step: ${stepId}`, error)
        results[stepId] = { error: error.message }
      }
    }

    return results
  }

  private static getMockDataForStep(stepId: string, productData: ProductData, language: string = 'en'): any {
    switch (stepId) {
      case 'product-analysis':
        return {
          marketSize: this.calculateMarketSize(productData.category),
          growthRate: "15% YoY",
          competitorCount: Math.floor(Math.random() * 50) + 10,
          profitMargin: "60%",
          demandScore: Math.random() * 3 + 7,
          trends: [
            "Increasing demand for smart features",
            "Price sensitivity in current market", 
            "Brand loyalty important in category"
          ]
        }

      case 'audience-research':
        return {
          primaryAudience: {
            age: this.getAgeRange(productData.category),
            gender: this.getGenderSplit(productData.category),
            income: this.getIncomeRange(productData.price),
            interests: this.generateInterests(productData.category, productData.keyFeatures),
            platforms: ["Facebook", "Instagram", "TikTok", "YouTube"],
            behavior: [
              "Research products online before buying",
              "Read reviews and compare prices",
              "Share purchases on social media"
            ]
          },
          audienceSize: `${(Math.random() * 5 + 1).toFixed(1)}M users`
        }

      case 'competitor-analysis':
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
            }
          ],
          priceAdvantage: "20% better value than competitors",
          keyDifferentiators: productData.keyFeatures.slice(0, 3)
        }

      case 'landing-page':
        return {
          landingPage: {
            headline: this.getLocalizedHeadline(productData.name, language),
            subheadline: `Experience premium quality with ${productData.keyFeatures[0]} technology`,
            benefits: [
              "Save 3 hours daily with superior performance",
              "Lifetime warranty and 30-day money back guarantee",
              "Trusted by 50,000+ satisfied customers worldwide",
              "Free shipping and 24/7 customer support"
            ],
            cta: this.getLocalizedCTA(language),
            testimonials: [
              { name: "Sarah M.", review: "Best purchase I've made this year!", rating: 5 },
              { name: "Mike T.", review: "Incredible quality and fast shipping", rating: 5 }
            ],
            urgency: "Only 47 units left in stock!",
            guarantee: "30-day money back guarantee"
          }
        }

      case 'facebook-ads':
        return {
          facebookAd: {
            headline: `🔥 ${productData.name} - 50% OFF Today Only!`,
            description: `Join thousands of happy customers who upgraded their ${productData.category.toLowerCase()}. Limited stock available!`,
            cta: "Shop Now",
            targetAudience: {
              interests: this.generateAdInterests(productData.category),
              age: "25-55",
              behavior: "Online shoppers, Tech enthusiasts"
            },
            budget: Math.floor(Math.random() * 50 + 30),
            creative: {
              primaryText: `🌟 AMAZING DEAL: Get the ${productData.name} with ${productData.keyFeatures[0]} for just $${productData.price}!`,
              callToAction: "Shop Now"
            }
          }
        }

      case 'video-script':
        return {
          videoScript: {
            hook: `Are you tired of ${productData.category.toLowerCase()} that don't deliver on their promises?`,
            problem: `Most products in this category fail to provide lasting value and break after a few months...`,
            solution: `That's why we created the ${productData.name} - engineered for durability and performance`,
            benefits: productData.keyFeatures,
            cta: "Click the link below to get yours with 50% off today!",
            duration: "60-90 seconds",
            style: "Problem-solution format with product demonstration"
          }
        }

      case 'whatsapp-bot':
        return {
          whatsappBot: {
            greeting: `Hi! 👋 Thanks for your interest in the ${productData.name}!`,
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

      case 'seo-content':
        return {
          seoContent: {
            title: `Best ${productData.name} 2024 - Premium Quality & Fast Shipping`,
            metaDescription: `Shop the highest rated ${productData.name} with ${productData.keyFeatures[0]}. Free shipping, 30-day returns. Order now!`,
            keywords: [
              productData.name.toLowerCase(),
              productData.category.toLowerCase(),
              "best", "premium", "2024", "review", "buy"
            ],
            content: `# Complete ${productData.name} Buying Guide 2024\n\nLooking for the best ${productData.name}? Our comprehensive review covers everything you need to know...`,
            h1: `Best ${productData.name} - Complete 2024 Review & Buying Guide`,
            h2Tags: [
              `What Makes ${productData.name} Special?`,
              "Key Features and Benefits", 
              "Customer Reviews and Ratings",
              "Pricing and Where to Buy"
            ]
          }
        }

      case 'validation-metrics':
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
          },
          timeline: "2 weeks for initial validation, 4 weeks for optimization"
        }

      default:
        return { message: "Step completed successfully" }
    }
  }

  // Helper methods
  private static calculateMarketSize(category: string): string {
    const sizes = {
      'Electronics': '$2.5B',
      'Home Security': '$1.8B', 
      'Mobile Accessories': '$950M',
      'Fitness': '$1.2B',
      'Beauty': '$3.1B',
      'Home & Garden': '$1.9B',
      'Fashion': '$2.8B',
      'Automotive': '$1.4B'
    }
    return sizes[category] || '$1.5B'
  }

  private static getAgeRange(category: string): string {
    const ranges = {
      'Electronics': '18-45',
      'Home Security': '30-60',
      'Mobile Accessories': '16-40', 
      'Fitness': '20-50',
      'Beauty': '18-55',
      'Home & Garden': '25-65',
      'Fashion': '16-45',
      'Automotive': '25-55'
    }
    return ranges[category] || '25-45'
  }

  private static getGenderSplit(category: string): string {
    const splits = {
      'Electronics': '65% Male, 35% Female',
      'Home Security': '55% Male, 45% Female',
      'Mobile Accessories': '50% Male, 50% Female',
      'Fitness': '45% Male, 55% Female', 
      'Beauty': '20% Male, 80% Female',
      'Home & Garden': '40% Male, 60% Female',
      'Fashion': '30% Male, 70% Female',
      'Automotive': '70% Male, 30% Female'
    }
    return splits[category] || '50% Male, 50% Female'
  }

  private static getIncomeRange(price: number): string {
    if (price < 25) return '$25k-$50k'
    if (price < 50) return '$30k-$75k'
    if (price < 100) return '$50k-$100k'
    if (price < 200) return '$75k-$150k'
    return '$100k+'
  }

  private static generateInterests(category: string, features: string[]): string[] {
    const baseInterests = {
      'Electronics': ['Technology', 'Gadgets', 'Innovation', 'Smart devices'],
      'Home Security': ['Home improvement', 'Safety', 'Smart homes', 'Security'],
      'Mobile Accessories': ['Smartphones', 'Technology', 'Productivity', 'Mobile apps'],
      'Fitness': ['Health', 'Exercise', 'Wellness', 'Gym', 'Sports'],
      'Beauty': ['Skincare', 'Makeup', 'Self-care', 'Beauty tips'],
      'Home & Garden': ['Home decor', 'Gardening', 'DIY', 'Interior design'],
      'Fashion': ['Fashion', 'Style', 'Clothing', 'Trends'],
      'Automotive': ['Cars', 'Auto parts', 'Driving', 'Car maintenance']
    }
    
    const interests = baseInterests[category] || ['Shopping', 'Quality products', 'Consumer goods']
    return [...interests.slice(0, 3), ...features.slice(0, 2)]
  }

  private static generateAdInterests(category: string): string[] {
    const interests = {
      'Electronics': ['Consumer electronics', 'Technology early adopters', 'Online shopping', 'Tech gadgets'],
      'Home Security': ['Home security', 'Smart home technology', 'Home improvement', 'Safety products'],
      'Mobile Accessories': ['Mobile technology', 'Smartphone accessories', 'Tech gadgets', 'Mobile apps'],
      'Fitness': ['Fitness and wellness', 'Health and fitness', 'Exercise equipment', 'Gym equipment'],
      'Beauty': ['Beauty', 'Skincare', 'Cosmetics and beauty products', 'Personal care'],
      'Home & Garden': ['Home improvement', 'Home decor', 'Gardening', 'Interior design'],
      'Fashion': ['Fashion', 'Clothing', 'Style and fashion', 'Online fashion'],
      'Automotive': ['Automotive', 'Car accessories', 'Auto parts', 'Car enthusiasts']
    }
    
    return interests[category] || ['Shopping', 'Consumer goods', 'Quality products', 'Online shopping']
  }

  // Localization helpers
  private static getLocalizedHeadline(productName: string, language: string): string {
    const headlines = {
      en: `🔥 Revolutionary ${productName} - Limited Time 50% OFF!`,
      es: `🔥 Revolucionario ${productName} - ¡50% DE DESCUENTO por Tiempo Limitado!`,
      pt: `🔥 Revolucionário ${productName} - 50% DE DESCONTO por Tempo Limitado!`,
      ar: `🔥 ثوري ${productName} - خصم 50% لفترة محدودة!`,
      he: `🔥 מהפכני ${productName} - 50% הנחה לזמן محدود!`
    }
    return headlines[language] || headlines.en
  }

  private static getLocalizedCTA(language: string): string {
    const ctas = {
      en: "Order Now - Free Shipping Worldwide!",
      es: "¡Ordenar Ahora - Envío Gratis Mundial!",
      pt: "Peça Agora - Frete Grátis Mundial!",
      ar: "اطلب الآن - شحن مجاني في جميع أنحاء العالم!",
      he: "הזמן עכשיו - משלוח חינם לכל העולם!"
    }
    return ctas[language] || ctas.en
  }

  static async saveGenerationResults(
    productName: string,
    results: Record<string, any>,
    language: string = 'en'
  ): Promise<void> {
    try {
      const client = this.USE_MOCK ? mockSupabase : supabase
      
      const { error } = await client.from('ai_generation_sessions').insert({
        product_name: productName,
        results: results,
        language: language,
        created_at: new Date().toISOString()
      })

      if (error) throw error
      console.log('Generation results saved successfully')
    } catch (error) {
      console.error('Error saving generation results:', error)
    }
  }

  static async getGenerationHistory(limit: number = 10): Promise<any[]> {
    try {
      const client = this.USE_MOCK ? mockSupabase : supabase
      
      const { data, error } = await client
        .from('ai_generation_sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching generation history:', error)
      return []
    }
  }
}