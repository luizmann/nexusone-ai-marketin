import { supabase } from './supabase';

export interface MarketLocalization {
  country: string;
  language: string;
  currency: string;
  timezone: string;
  culturalNotes: string[];
  marketingStyle: 'direct' | 'relationship' | 'visual' | 'premium' | 'conservative';
  paymentMethods: string[];
  shippingOptions: string[];
  legalRequirements: string[];
}

export interface LocalizedPageData {
  title: string;
  headline: string;
  subheadline: string;
  description: string;
  features: string[];
  benefits: string[];
  pricing: {
    originalPrice: number;
    salePrice: number;
    currency: string;
    installments?: {
      enabled: boolean;
      options: number[];
    };
  };
  testimonials: Array<{
    name: string;
    location: string;
    text: string;
    rating: number;
  }>;
  socialProof: {
    customerCount: string;
    reviewCount: string;
    rating: number;
  };
  urgency: {
    type: 'limited_time' | 'limited_stock' | 'seasonal' | 'launch';
    message: string;
    countdown?: number;
  };
  cta: {
    primary: string;
    secondary: string;
    guarantee: string;
  };
  layout: {
    style: 'modern' | 'classic' | 'minimal' | 'vibrant';
    colorScheme: string[];
    fonts: string[];
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

const marketConfigurations: Record<string, MarketLocalization> = {
  US: {
    country: 'United States',
    language: 'English',
    currency: 'USD',
    timezone: 'America/New_York',
    culturalNotes: [
      'Direct, benefit-focused messaging',
      'Emphasize time-saving and efficiency',
      'Strong calls-to-action work well',
      'Social proof and reviews are crucial',
      'Mobile-first approach essential'
    ],
    marketingStyle: 'direct',
    paymentMethods: ['Credit Card', 'PayPal', 'Apple Pay', 'Google Pay'],
    shippingOptions: ['Standard', 'Express', 'Next Day'],
    legalRequirements: ['Return Policy', 'Privacy Policy', 'Terms of Service']
  },
  BR: {
    country: 'Brazil',
    language: 'Portuguese',
    currency: 'BRL',
    timezone: 'America/Sao_Paulo',
    culturalNotes: [
      'Relationship-focused messaging',
      'Installment payments are preferred',
      'Strong social proof needed',
      'Family-oriented benefits',
      'Trust signals are essential'
    ],
    marketingStyle: 'relationship',
    paymentMethods: ['Credit Card', 'PIX', 'Boleto', 'Installments'],
    shippingOptions: ['PAC', 'SEDEX', 'Express'],
    legalRequirements: ['Código de Defesa do Consumidor', 'Política de Privacidade']
  },
  ES: {
    country: 'Spain',
    language: 'Spanish',
    currency: 'EUR',
    timezone: 'Europe/Madrid',
    culturalNotes: [
      'Visual storytelling works well',
      'Family and tradition themes resonate',
      'Quality over quantity messaging',
      'Testimonials from locals important',
      'Siesta-aware timing'
    ],
    marketingStyle: 'visual',
    paymentMethods: ['Credit Card', 'PayPal', 'Bank Transfer', 'Bizum'],
    shippingOptions: ['Standard', 'Express', 'Same Day (Madrid/Barcelona)'],
    legalRequirements: ['GDPR Compliance', 'Cookie Policy', 'Return Policy']
  },
  IL: {
    country: 'Israel',
    language: 'Hebrew',
    currency: 'ILS',
    timezone: 'Asia/Jerusalem',
    culturalNotes: [
      'Tech-savvy audience',
      'Innovation and efficiency valued',
      'Security and privacy important',
      'Direct communication preferred',
      'Sabbath-aware scheduling'
    ],
    marketingStyle: 'direct',
    paymentMethods: ['Credit Card', 'PayPal', 'Bit', 'Bank Transfer'],
    shippingOptions: ['Standard', 'Express', 'Same Day (Tel Aviv area)'],
    legalRequirements: ['Privacy Protection Law', 'Consumer Protection Law']
  },
  SA: {
    country: 'Saudi Arabia',
    language: 'Arabic',
    currency: 'SAR',
    timezone: 'Asia/Riyadh',
    culturalNotes: [
      'Premium positioning works well',
      'Islamic values consideration',
      'Gender-specific messaging',
      'Family-oriented benefits',
      'Mobile commerce dominant'
    ],
    marketingStyle: 'premium',
    paymentMethods: ['Credit Card', 'mada', 'STC Pay', 'Apple Pay'],
    shippingOptions: ['Standard', 'Express', 'Same Day (Riyadh/Jeddah)'],
    legalRequirements: ['Islamic Commerce Guidelines', 'Data Protection Law']
  }
};

export class InternationalMarketingService {
  static async generateLocalizedPage(
    productUrl: string,
    productDescription: string,
    targetMarket: string
  ): Promise<LocalizedPageData> {
    const marketConfig = marketConfigurations[targetMarket];
    if (!marketConfig) {
      throw new Error(`Market configuration not found for ${targetMarket}`);
    }

    try {
      // Call Supabase Edge Function for AI-powered localization
      const { data, error } = await supabase.functions.invoke('generate-localized-page', {
        body: {
          productUrl,
          productDescription,
          marketConfig,
          targetLanguage: marketConfig.language,
          currency: marketConfig.currency,
          culturalContext: marketConfig.culturalNotes,
          marketingStyle: marketConfig.marketingStyle
        }
      });

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error generating localized page:', error);
      
      // Fallback: Generate basic localized content
      return this.generateFallbackLocalizedPage(productDescription, marketConfig);
    }
  }

  static generateFallbackLocalizedPage(
    productDescription: string,
    marketConfig: MarketLocalization
  ): LocalizedPageData {
    const localizedContent = this.getLocalizedContent(marketConfig.language);
    
    return {
      title: `${productDescription} - ${marketConfig.country}`,
      headline: localizedContent.headline,
      subheadline: localizedContent.subheadline,
      description: productDescription,
      features: localizedContent.features,
      benefits: localizedContent.benefits,
      pricing: {
        originalPrice: this.convertPrice(99.99, marketConfig.currency),
        salePrice: this.convertPrice(79.99, marketConfig.currency),
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
        countdown: 48 * 60 * 60 // 48 hours in seconds
      },
      cta: {
        primary: localizedContent.ctaPrimary,
        secondary: localizedContent.ctaSecondary,
        guarantee: localizedContent.guarantee
      },
      layout: {
        style: this.getLayoutStyle(marketConfig.marketingStyle),
        colorScheme: this.getColorScheme(marketConfig.country),
        fonts: this.getFonts(marketConfig.language)
      },
      seo: {
        metaTitle: `${productDescription} - ${localizedContent.seoTitle}`,
        metaDescription: localizedContent.seoDescription,
        keywords: localizedContent.keywords
      }
    };
  }

  static getLocalizedContent(language: string) {
    const content = {
      en: {
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
        seoDescription: 'Discover the best product for your needs with fast shipping and money-back guarantee.',
        keywords: ['premium', 'quality', 'fast shipping', 'guarantee']
      },
      pt: {
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
        seoDescription: 'Descubra o melhor produto para suas necessidades com frete rápido e garantia.',
        keywords: ['premium', 'qualidade', 'frete rápido', 'garantia']
      },
      es: {
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
        seoDescription: 'Descubre el mejor producto para tus necesidades con envío rápido y garantía.',
        keywords: ['premium', 'calidad', 'envío rápido', 'garantía']
      },
      he: {
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
        seoDescription: 'גלה את המוצר הטוב ביותר לצרכים שלך עם משלוח מהיר ואחריות.',
        keywords: ['פרמיום', 'איכות', 'משלוח מהיר', 'אחריות']
      },
      ar: {
        headline: 'غيّر حياتك مع هذا المنتج المذهل',
        subheadline: 'انضم إلى آلاف العملاء الراضين في المملكة العربية السعودية',
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
        seoDescription: 'اكتشف أفضل منتج لاحتياجاتك مع الشحن السريع والضمان.',
        keywords: ['فائق', 'جودة', 'شحن سريع', 'ضمان']
      }
    };

    return content[language as keyof typeof content] || content.en;
  }

  static convertPrice(usdPrice: number, targetCurrency: string): number {
    // Simplified currency conversion - in production, use real exchange rates
    const rates = {
      USD: 1,
      BRL: 5.2,
      EUR: 0.85,
      ILS: 3.7,
      SAR: 3.75
    };
    
    return Math.round(usdPrice * (rates[targetCurrency as keyof typeof rates] || 1) * 100) / 100;
  }

  static getLayoutStyle(marketingStyle: string): 'modern' | 'classic' | 'minimal' | 'vibrant' {
    const styleMap = {
      direct: 'modern',
      relationship: 'vibrant',
      visual: 'modern',
      premium: 'classic',
      conservative: 'minimal'
    };
    
    return styleMap[marketingStyle as keyof typeof styleMap] || 'modern';
  }

  static getColorScheme(country: string): string[] {
    const schemes = {
      'United States': ['#1D4ED8', '#DC2626', '#FFFFFF'], // Blue, Red, White
      'Brazil': ['#10B981', '#F59E0B', '#FFFFFF'], // Green, Yellow, White
      'Spain': ['#DC2626', '#F59E0B', '#FFFFFF'], // Red, Yellow, White
      'Israel': ['#2563EB', '#FFFFFF', '#1F2937'], // Blue, White, Dark
      'Saudi Arabia': ['#059669', '#FFFFFF', '#D97706'] // Green, White, Gold
    };
    
    return schemes[country as keyof typeof schemes] || ['#1D4ED8', '#FFFFFF', '#1F2937'];
  }

  static getFonts(language: string): string[] {
    const fontMap = {
      English: ['Inter', 'system-ui', 'sans-serif'],
      Portuguese: ['Inter', 'system-ui', 'sans-serif'],
      Spanish: ['Inter', 'system-ui', 'sans-serif'],
      Hebrew: ['Noto Sans Hebrew', 'system-ui', 'sans-serif'],
      Arabic: ['Noto Sans Arabic', 'system-ui', 'sans-serif']
    };
    
    return fontMap[language as keyof typeof fontMap] || ['Inter', 'system-ui', 'sans-serif'];
  }

  static async saveLocalizedPage(pageData: LocalizedPageData, userId: string, marketCode: string) {
    try {
      const { data, error } = await supabase
        .from('localized_pages')
        .insert({
          user_id: userId,
          market_code: marketCode,
          title: pageData.title,
          content: pageData,
          status: 'draft',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving localized page:', error);
      throw error;
    }
  }

  static async getMarketAnalytics(marketCode: string, userId: string) {
    try {
      const { data, error } = await supabase
        .from('page_analytics')
        .select('*')
        .eq('market_code', marketCode)
        .eq('user_id', userId);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching market analytics:', error);
      return [];
    }
  }

  static getMarketConfiguration(marketCode: string): MarketLocalization | null {
    return marketConfigurations[marketCode] || null;
  }

  static getAllMarkets(): MarketLocalization[] {
    return Object.values(marketConfigurations);
  }
}