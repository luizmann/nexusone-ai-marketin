import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LocalizedPageRequest {
  productUrl?: string;
  productDescription: string;
  marketConfig: {
    country: string;
    language: string;
    currency: string;
    culturalNotes: string[];
    marketingStyle: string;
  };
  targetLanguage: string;
  currency: string;
  culturalContext: string[];
  marketingStyle: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { 
      productUrl, 
      productDescription, 
      marketConfig,
      targetLanguage,
      currency,
      culturalContext,
      marketingStyle 
    }: LocalizedPageRequest = await req.json()

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Prepare AI prompt for localization
    const prompt = `
You are an expert international marketing AI that creates culturally adapted sales pages.

Context:
- Product: ${productDescription}
- Target Market: ${marketConfig.country}
- Language: ${targetLanguage}
- Currency: ${currency}
- Marketing Style: ${marketingStyle}
- Cultural Notes: ${culturalContext.join(', ')}

Create a localized sales page with the following elements:
1. Compelling headline in ${targetLanguage}
2. Subheadline that resonates with ${marketConfig.country} culture
3. Product description adapted for local preferences
4. 5 key features that matter to this market
5. 5 benefits written in local communication style
6. Pricing in ${currency} with local payment preferences
7. 3 testimonials with local names and locations
8. Social proof numbers formatted for this culture
9. Urgency message appropriate for this market
10. Call-to-action buttons in ${targetLanguage}
11. Money-back guarantee terms
12. SEO metadata in ${targetLanguage}

Important cultural considerations for ${marketConfig.country}:
${culturalContext.map(note => `- ${note}`).join('\n')}

Marketing style: ${marketingStyle}

Return a JSON object with all these elements structured properly.
`

    // Call OpenAI API if available
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (openaiApiKey) {
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
              content: 'You are an expert international marketing AI that creates culturally adapted sales pages. Always respond with valid JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      })

      if (response.ok) {
        const data = await response.json()
        const content = data.choices[0].message.content
        
        try {
          const localizedPageData = JSON.parse(content)
          
          return new Response(
            JSON.stringify(localizedPageData),
            { 
              headers: { 
                ...corsHeaders, 
                'Content-Type': 'application/json' 
              } 
            }
          )
        } catch (parseError) {
          console.error('Error parsing OpenAI response:', parseError)
        }
      }
    }

    // Fallback: Generate basic localized content
    const fallbackData = generateFallbackLocalizedPage(productDescription, marketConfig)
    
    return new Response(
      JSON.stringify(fallbackData),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in generate-localized-page function:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})

function generateFallbackLocalizedPage(productDescription: string, marketConfig: any) {
  const localizedContent = getLocalizedContent(marketConfig.language)
  
  return {
    title: `${productDescription} - ${marketConfig.country}`,
    headline: localizedContent.headline,
    subheadline: localizedContent.subheadline,
    description: productDescription,
    features: localizedContent.features,
    benefits: localizedContent.benefits,
    pricing: {
      originalPrice: convertPrice(99.99, marketConfig.currency),
      salePrice: convertPrice(79.99, marketConfig.currency),
      currency: marketConfig.currency,
      installments: marketConfig.currency === 'BRL' ? {
        enabled: true,
        options: [3, 6, 12]
      } : undefined
    },
    testimonials: localizedContent.testimonials,
    socialProof: {
      customerCount: localizedContent.customerCount,
      reviewCount: localizedContent.reviewCount,
      rating: 4.8
    },
    urgency: {
      type: 'limited_time',
      message: localizedContent.urgencyMessage,
      countdown: 48 * 60 * 60
    },
    cta: {
      primary: localizedContent.ctaPrimary,
      secondary: localizedContent.ctaSecondary,
      guarantee: localizedContent.guarantee
    },
    layout: {
      style: getLayoutStyle(marketConfig.marketingStyle),
      colorScheme: getColorScheme(marketConfig.country),
      fonts: getFonts(marketConfig.language)
    },
    seo: {
      metaTitle: `${productDescription} - ${localizedContent.seoTitle}`,
      metaDescription: localizedContent.seoDescription,
      keywords: localizedContent.keywords
    }
  }
}

function getLocalizedContent(language: string) {
  const content = {
    English: {
      headline: 'Transform Your Life with This Amazing Product',
      subheadline: 'Join thousands of satisfied customers worldwide',
      features: ['Premium Quality', 'Fast Shipping', '30-Day Guarantee'],
      benefits: ['Save Time', 'Increase Productivity', 'Feel Confident'],
      testimonials: [
        { name: 'John Smith', location: 'New York, USA', text: 'Absolutely amazing product!', rating: 5 },
        { name: 'Sarah Johnson', location: 'Los Angeles, USA', text: 'Best purchase I ever made.', rating: 5 }
      ],
      customerCount: '50,000+',
      reviewCount: '12,000+',
      urgencyMessage: 'Limited time offer - 48 hours left!',
      ctaPrimary: 'Get Yours Now',
      ctaSecondary: 'Learn More',
      guarantee: '30-Day Money Back Guarantee',
      seoTitle: 'Premium Quality Product',
      seoDescription: 'Discover the best product for your needs.',
      keywords: ['premium', 'quality', 'guarantee']
    },
    Portuguese: {
      headline: 'Transforme Sua Vida com Este Produto Incrível',
      subheadline: 'Junte-se a milhares de clientes satisfeitos no Brasil',
      features: ['Qualidade Premium', 'Frete Rápido', 'Garantia de 30 Dias'],
      benefits: ['Economize Tempo', 'Aumente Produtividade', 'Sinta-se Confiante'],
      testimonials: [
        { name: 'João Silva', location: 'São Paulo, Brasil', text: 'Produto absolutamente incrível!', rating: 5 },
        { name: 'Maria Santos', location: 'Rio de Janeiro, Brasil', text: 'Melhor compra que já fiz.', rating: 5 }
      ],
      customerCount: '50.000+',
      reviewCount: '12.000+',
      urgencyMessage: 'Oferta por tempo limitado - restam 48 horas!',
      ctaPrimary: 'Comprar Agora',
      ctaSecondary: 'Saiba Mais',
      guarantee: 'Garantia de 30 Dias ou Seu Dinheiro de Volta',
      seoTitle: 'Produto de Qualidade Premium',
      seoDescription: 'Descubra o melhor produto para suas necessidades.',
      keywords: ['premium', 'qualidade', 'garantia']
    },
    Spanish: {
      headline: 'Transforma Tu Vida con Este Producto Increíble',
      subheadline: 'Únete a miles de clientes satisfechos en España',
      features: ['Calidad Premium', 'Envío Rápido', 'Garantía de 30 Días'],
      benefits: ['Ahorra Tiempo', 'Aumenta Productividad', 'Siéntete Seguro'],
      testimonials: [
        { name: 'Carlos García', location: 'Madrid, España', text: '¡Producto absolutamente increíble!', rating: 5 },
        { name: 'Ana López', location: 'Barcelona, España', text: 'La mejor compra que he hecho.', rating: 5 }
      ],
      customerCount: '50.000+',
      reviewCount: '12.000+',
      urgencyMessage: 'Oferta por tiempo limitado - ¡quedan 48 horas!',
      ctaPrimary: 'Comprar Ahora',
      ctaSecondary: 'Saber Más',
      guarantee: 'Garantía de 30 Días o Devolución del Dinero',
      seoTitle: 'Producto de Calidad Premium',
      seoDescription: 'Descubre el mejor producto para tus necesidades.',
      keywords: ['premium', 'calidad', 'garantía']
    },
    Hebrew: {
      headline: 'שנה את חייך עם המוצר המדהים הזה',
      subheadline: 'הצטרף לאלפי לקוחות מרוצים בישראל',
      features: ['איכות פרמיום', 'משלוח מהיר', 'אחריות 30 יום'],
      benefits: ['חסוך זמן', 'הגדל פרודקטיביות', 'הרגש בטוח'],
      testimonials: [
        { name: 'דוד כהן', location: 'תל אביב, ישראל', text: 'מוצר מדהים לחלוטין!', rating: 5 },
        { name: 'שרה לוי', location: 'ירושלים, ישראל', text: 'הקנייה הטובה ביותר שעשיתי.', rating: 5 }
      ],
      customerCount: '50,000+',
      reviewCount: '12,000+',
      urgencyMessage: 'הצעה לזמן מגובל - נותרו 48 שעות!',
      ctaPrimary: 'קנה עכשיו',
      ctaSecondary: 'למד עוד',
      guarantee: 'אחריות 30 יום או החזר כספי מלא',
      seoTitle: 'מוצר איכות פרמיום',
      seoDescription: 'גלה את המוצר הטוב ביותר לצרכים שלך.',
      keywords: ['פרמיום', 'איכות', 'אחריות']
    },
    Arabic: {
      headline: 'غيّر حياتك مع هذا المنتج المذهل',
      subheadline: 'انضم إلى آلاف العملاء الراضين',
      features: ['جودة فائقة', 'شحن سريع', 'ضمان 30 يوم'],
      benefits: ['وفر الوقت', 'زد الإنتاجية', 'اشعر بالثقة'],
      testimonials: [
        { name: 'أحمد محمد', location: 'الرياض، السعودية', text: 'منتج مذهل حقاً!', rating: 5 },
        { name: 'فاطمة أحمد', location: 'جدة، السعودية', text: 'أفضل عملية شراء قمت بها.', rating: 5 }
      ],
      customerCount: '50,000+',
      reviewCount: '12,000+',
      urgencyMessage: 'عرض لفترة محدودة - تبقى 48 ساعة!',
      ctaPrimary: 'اشتر الآن',
      ctaSecondary: 'تعلم المزيد',
      guarantee: 'ضمان 30 يوماً أو استرداد كامل للمال',
      seoTitle: 'منتج عالي الجودة',
      seoDescription: 'اكتشف أفضل منتج لاحتياجاتك.',
      keywords: ['فائق', 'جودة', 'ضمان']
    }
  }

  return content[language as keyof typeof content] || content.English
}

function convertPrice(usdPrice: number, targetCurrency: string): number {
  const rates = {
    USD: 1,
    BRL: 5.2,
    EUR: 0.85,
    ILS: 3.7,
    SAR: 3.75
  }
  
  return Math.round(usdPrice * (rates[targetCurrency as keyof typeof rates] || 1) * 100) / 100
}

function getLayoutStyle(marketingStyle: string): string {
  const styleMap = {
    direct: 'modern',
    relationship: 'vibrant',
    visual: 'modern',
    premium: 'classic',
    conservative: 'minimal'
  }
  
  return styleMap[marketingStyle as keyof typeof styleMap] || 'modern'
}

function getColorScheme(country: string): string[] {
  const schemes = {
    'United States': ['#1D4ED8', '#DC2626', '#FFFFFF'],
    'Brazil': ['#10B981', '#F59E0B', '#FFFFFF'],
    'Spain': ['#DC2626', '#F59E0B', '#FFFFFF'],
    'Israel': ['#2563EB', '#FFFFFF', '#1F2937'],
    'Saudi Arabia': ['#059669', '#FFFFFF', '#D97706']
  }
  
  return schemes[country as keyof typeof schemes] || ['#1D4ED8', '#FFFFFF', '#1F2937']
}

function getFonts(language: string): string[] {
  const fontMap = {
    English: ['Inter', 'system-ui', 'sans-serif'],
    Portuguese: ['Inter', 'system-ui', 'sans-serif'],
    Spanish: ['Inter', 'system-ui', 'sans-serif'],
    Hebrew: ['Noto Sans Hebrew', 'system-ui', 'sans-serif'],
    Arabic: ['Noto Sans Arabic', 'system-ui', 'sans-serif']
  }
  
  return fontMap[language as keyof typeof fontMap] || ['Inter', 'system-ui', 'sans-serif']
}