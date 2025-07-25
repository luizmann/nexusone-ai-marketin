import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project.supabase.co'
const supabaseAnonKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Mock implementation for testing
export const mockSupabase = {
  functions: {
    invoke: async (functionName: string, options: any) => {
      console.log(`Mock Supabase Function Call: ${functionName}`, options)
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
      
      return {
        data: { result: getMockResultForFunction(functionName, options.body) },
        error: null
      }
    }
  },
  from: (table: string) => ({
    insert: async (data: any) => {
      console.log(`Mock DB Insert to ${table}:`, data)
      return { data, error: null }
    },
    select: (fields: string) => ({
      order: (field: string, options: any) => ({
        limit: (count: number) => ({
          then: async (resolve: any) => {
            console.log(`Mock DB Select from ${table}`)
            resolve({ data: [], error: null })
          }
        })
      })
    })
  })
}

function getMockResultForFunction(functionName: string, body: any) {
  if (functionName === 'ai-content-generation') {
    const { stepId, productData } = body
    
    switch (stepId) {
      case 'product-analysis':
        return {
          marketSize: calculateMarketSize(productData.category),
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
            age: getAgeRange(productData.category),
            gender: getGenderSplit(productData.category),
            income: getIncomeRange(productData.price),
            interests: generateInterests(productData.category, productData.keyFeatures),
            platforms: ["Facebook", "Instagram", "TikTok", "YouTube"]
          },
          audienceSize: `${(Math.random() * 5 + 1).toFixed(1)}M users`
        }
      
      case 'landing-page':
        return {
          landingPage: {
            headline: `🔥 Revolutionary ${productData.name} - Limited Time 50% OFF!`,
            subheadline: `Experience premium quality with ${productData.keyFeatures[0]} technology`,
            benefits: [
              "Save 3 hours daily with superior performance",
              "Lifetime warranty and 30-day money back guarantee",
              "Trusted by 50,000+ satisfied customers worldwide"
            ],
            cta: "Order Now - Free Shipping Worldwide!",
            testimonials: [
              { name: "Sarah M.", review: "Best purchase I've made this year!", rating: 5 },
              { name: "Mike T.", review: "Incredible quality and fast shipping", rating: 5 }
            ]
          }
        }
      
      default:
        return { message: "Step completed successfully" }
    }
  }
  
  return { success: true }
}

// Helper functions
function calculateMarketSize(category: string): string {
  const sizes = {
    'Electronics': '$2.5B',
    'Home Security': '$1.8B',
    'Mobile Accessories': '$950M'
  }
  return sizes[category] || '$1.5B'
}

function getAgeRange(category: string): string {
  const ranges = {
    'Electronics': '18-45',
    'Home Security': '30-60',
    'Mobile Accessories': '16-40'
  }
  return ranges[category] || '25-45'
}

function getGenderSplit(category: string): string {
  const splits = {
    'Electronics': '65% Male, 35% Female',
    'Home Security': '55% Male, 45% Female',
    'Mobile Accessories': '50% Male, 50% Female'
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
    'Mobile Accessories': ['Smartphones', 'Technology', 'Productivity']
  }
  
  return [...(baseInterests[category] || ['Shopping']), ...features.slice(0, 2)]
}