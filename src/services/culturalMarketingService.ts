import { openai } from '@/lib/openai';

// Cultural marketing contexts for different regions
export const culturalContexts = {
  'en-US': {
    name: 'United States',
    language: 'English',
    culturalNotes: 'Direct, action-oriented communication. Focus on individual benefits, time-saving, and ROI. Use power words like "breakthrough", "exclusive", "guaranteed".',
    marketingStyle: 'Bold headlines, clear CTAs, social proof, urgency tactics',
    buyingBehavior: 'Comparison shopping, reviews-driven, impulse buying',
    preferredTone: 'Confident, enthusiastic, results-focused',
    holidays: ['Black Friday', 'Cyber Monday', 'Christmas', 'Independence Day'],
    workingHours: '9 AM - 5 PM EST',
    currency: 'USD',
    demographics: 'Tech-savvy, time-conscious, value-oriented'
  },
  'es-ES': {
    name: 'Spain',
    language: 'Spanish',
    culturalNotes: 'Relationship-focused, family-oriented. Appreciate personal connections and trust-building. Avoid high-pressure tactics.',
    marketingStyle: 'Warm headlines, community focus, family benefits, trust signals',
    buyingBehavior: 'Relationship-based, word-of-mouth influenced, quality-focused',
    preferredTone: 'Warm, personal, trustworthy',
    holidays: ['Día de Reyes', 'Semana Santa', 'Navidad', 'Día Nacional'],
    workingHours: '9 AM - 6 PM CET (with siesta)',
    currency: 'EUR',
    demographics: 'Family-centered, relationship-oriented, quality-conscious'
  },
  'es-MX': {
    name: 'Mexico',
    language: 'Spanish',
    culturalNotes: 'Family-centric culture, respect for tradition, value community. Use familiar tone but maintain respect. Emphasize family benefits.',
    marketingStyle: 'Inclusive messaging, family imagery, community benefits, respect for tradition',
    buyingBehavior: 'Group decision-making, price-sensitive, brand loyalty',
    preferredTone: 'Respectful, family-oriented, inclusive',
    holidays: ['Día de los Muertos', 'Navidad', 'Día de la Independencia', 'Año Nuevo'],
    workingHours: '9 AM - 6 PM CST',
    currency: 'MXN',
    demographics: 'Family-focused, community-oriented, tradition-respecting'
  },
  'pt-BR': {
    name: 'Brazil',
    language: 'Portuguese',
    culturalNotes: 'Warm, expressive culture. Appreciate personal relationships and emotional connections. Use vibrant, energetic language.',
    marketingStyle: 'Emotional storytelling, vibrant visuals, community focus, celebration themes',
    buyingBehavior: 'Social-influenced, payment plan friendly, brand emotional connection',
    preferredTone: 'Energetic, warm, celebratory',
    holidays: ['Carnaval', 'Natal', 'Festa Junina', 'Independência'],
    workingHours: '9 AM - 6 PM BRT',
    currency: 'BRL',
    demographics: 'Social, expressive, celebration-loving, community-minded'
  },
  'he-IL': {
    name: 'Israel',
    language: 'Hebrew',
    culturalNotes: 'Direct communication style, innovation-focused, tech-savvy. Appreciate efficiency and cutting-edge solutions.',
    marketingStyle: 'Innovation highlights, tech benefits, efficiency focus, direct messaging',
    buyingBehavior: 'Tech-early adopters, research-heavy, innovation-seeking',
    preferredTone: 'Direct, innovative, tech-forward',
    holidays: ['Rosh Hashanah', 'Yom Kippur', 'Hanukkah', 'Independence Day'],
    workingHours: '8 AM - 5 PM IST (Sunday-Thursday)',
    currency: 'ILS',
    demographics: 'Tech-savvy, innovation-driven, efficiency-focused'
  },
  'ar-SA': {
    name: 'Saudi Arabia',
    language: 'Arabic',
    culturalNotes: 'Respect-based culture, family honor important. Formal communication, trust-building essential. Emphasize prestige and quality.',
    marketingStyle: 'Respectful tone, family benefits, prestige positioning, quality emphasis',
    buyingBehavior: 'Prestige-conscious, quality-focused, family-influenced decisions',
    preferredTone: 'Respectful, prestigious, quality-focused',
    holidays: ['Eid al-Fitr', 'Eid al-Adha', 'National Day', 'Ramadan'],
    workingHours: '8 AM - 5 PM AST (Saturday-Wednesday)',
    currency: 'SAR',
    demographics: 'Family-oriented, prestige-conscious, quality-demanding'
  },
  'ar-AE': {
    name: 'UAE',
    language: 'Arabic',
    culturalNotes: 'Cosmopolitan blend of traditional and modern. Business-focused, luxury-appreciating. International outlook.',
    marketingStyle: 'Luxury positioning, international appeal, business benefits, modern approach',
    buyingBehavior: 'Luxury-oriented, international brands preferred, business-focused',
    preferredTone: 'Professional, luxurious, international',
    holidays: ['Eid al-Fitr', 'Eid al-Adha', 'National Day', 'New Year'],
    workingHours: '9 AM - 6 PM GST (Sunday-Thursday)',
    currency: 'AED',
    demographics: 'Cosmopolitan, luxury-oriented, business-minded'
  }
};

export interface MarketingCopyRequest {
  productName: string;
  productDescription: string;
  targetMarket: string;
  copyType: 'headline' | 'description' | 'cta' | 'social_post' | 'email_subject' | 'full_page';
  tone?: 'professional' | 'casual' | 'urgent' | 'friendly' | 'luxurious';
  industry?: string;
  targetAudience?: string;
}

export interface CulturallyAdaptedCopy {
  originalCopy: string;
  adaptedCopy: string;
  culturalExplanation: string;
  localizedElements: string[];
  targetMarket: string;
  language: string;
  suggestedTiming: string;
  localizedCta: string;
}

// Mock data for development/demo purposes
const generateMockCulturalCopy = (request: MarketingCopyRequest): CulturallyAdaptedCopy => {
  const context = culturalContexts[request.targetMarket as keyof typeof culturalContexts];
  
  const mockCopyTemplates = {
    'en-US': {
      headline: `Revolutionary ${request.productName} - Transform Your Business Today!`,
      description: `Discover how ${request.productName} can skyrocket your productivity and deliver guaranteed results. Join thousands of successful entrepreneurs who've already transformed their business with our cutting-edge solution.`,
      cta: 'Get Started Now - Limited Time Offer!',
      social_post: `🚀 Game-changer alert! ${request.productName} is revolutionizing the way we work. Don't miss out on this breakthrough technology! #Innovation #Business #Success`,
      explanation: 'Used direct, action-oriented language with power words like "revolutionary", "transform", "breakthrough". Emphasized individual benefits and urgency.'
    },
    'es-ES': {
      headline: `${request.productName} - Una Solución de Confianza para Tu Familia`,
      description: `Descubre cómo ${request.productName} puede ayudar a mejorar la vida de tu familia. Una solución confiable y de calidad que ya han elegido miles de familias españolas.`,
      cta: 'Descubre Más - Para Tu Familia',
      social_post: `👨‍👩‍👧‍👦 Perfecto para familias! ${request.productName} nos está ayudando mucho. Os lo recomiendo a todos. #Familia #Calidad #Confianza`,
      explanation: 'Emphasized family values, trust, and community. Used warmer, more personal tone avoiding high-pressure tactics.'
    },
    'pt-BR': {
      headline: `${request.productName} - A Revolução que o Brasil Esperava! 🇧🇷`,
      description: `Chegou a novidade que vai transformar sua vida! ${request.productName} é a solução perfeita para brasileiros que querem mais sucesso e alegria. Junte-se à nossa comunidade vibrante!`,
      cta: 'Vamos Juntos! Começar Agora 🎉',
      social_post: `🎉 Brasil! Que descoberta incrível! ${request.productName} está mudando tudo aqui em casa. Família toda amando! #BrasilAcima #Sucesso #Alegria`,
      explanation: 'Used energetic, celebratory language with emojis. Emphasized community and emotional connection typical of Brazilian culture.'
    },
    'he-IL': {
      headline: `${request.productName} - הטכנולוגיה המתקדמת של העתיד`,
      description: `פתרון חדשני ויעיל ל${request.productDescription}. טכנולוגיה מתקדמת שמעוצבת במיוחד עבור הצרכים הישראליים. יעילות מקסימלית, תוצאות מוכחות.`,
      cta: 'התחל עכשיו - חדשנות ישראלית',
      social_post: `🇮🇱 חדשנות ישראלית במיטבה! ${request.productName} מביא טכנולוגיה מתקדמת לכולם. #חדשנות #טכנולוגיה #ישראל`,
      explanation: 'Emphasized innovation, efficiency, and cutting-edge technology. Used direct Hebrew communication style.'
    },
    'ar-SA': {
      headline: `${request.productName} - حل مميز ومحترم للعائلة الكريمة`,
      description: `نقدم لكم ${request.productName} بأعلى معايير الجودة والاحترام. حل مناسب للعائلات السعودية الكريمة مع ضمان الجودة والاستقامة.`,
      cta: 'اكتشف المزيد - بكل احترام',
      social_post: `🕋 منتج محترم ومميز! ${request.productName} يلبي احتياجات العائلة بأفضل ما يكون. جودة عالية ومصداقية. #جودة #احترام #ثقة`,
      explanation: 'Used respectful, formal tone emphasizing family honor, prestige, and quality. Included cultural respect elements.'
    }
  };

  const template = mockCopyTemplates[request.targetMarket as keyof typeof mockCopyTemplates] || mockCopyTemplates['en-US'];
  const copyContent = template[request.copyType as keyof typeof template] || template.headline;

  return {
    originalCopy: `Standard ${request.copyType} for ${request.productName}`,
    adaptedCopy: copyContent as string,
    culturalExplanation: template.explanation,
    localizedElements: [
      'Cultural tone adaptation',
      'Local language patterns',
      'Region-specific references',
      'Culturally appropriate CTAs'
    ],
    targetMarket: request.targetMarket,
    language: context?.language || 'English',
    suggestedTiming: context?.workingHours || '9 AM - 5 PM',
    localizedCta: template.cta
  };
};

class CulturalMarketingService {
  
  async generateCulturallyAdaptedCopy(request: MarketingCopyRequest): Promise<CulturallyAdaptedCopy> {
    const context = culturalContexts[request.targetMarket as keyof typeof culturalContexts];
    
    if (!context) {
      throw new Error(`Market ${request.targetMarket} not supported`);
    }

    // For development, return mock data immediately
    if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
      return generateMockCulturalCopy(request);
    }

    const prompt = this.buildCulturalPrompt(request, context);
    
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are a cultural marketing expert specializing in creating culturally adapted marketing copy for global markets. You understand cultural nuances, buying behaviors, and communication styles across different regions.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      });

      const response = completion.choices[0]?.message?.content;
      
      if (!response) {
        throw new Error('Failed to generate culturally adapted copy');
      }

      return this.parseCulturalResponse(response, request.targetMarket, context);
      
    } catch (error) {
      console.error('Error generating cultural copy:', error);
      // Fallback to mock data if API fails
      return generateMockCulturalCopy(request);
    }
  }

  private buildCulturalPrompt(request: MarketingCopyRequest, context: any): string {
    return `
Create culturally adapted marketing copy for the following product:

PRODUCT DETAILS:
- Name: ${request.productName}
- Description: ${request.productDescription}
- Copy Type: ${request.copyType}
- Industry: ${request.industry || 'General'}
- Target Audience: ${request.targetAudience || 'General consumers'}

TARGET MARKET: ${context.name}
LANGUAGE: ${context.language}
CULTURAL CONTEXT:
- Cultural Notes: ${context.culturalNotes}
- Marketing Style: ${context.marketingStyle}
- Buying Behavior: ${context.buyingBehavior}
- Preferred Tone: ${context.preferredTone}
- Demographics: ${context.demographics}
- Currency: ${context.currency}
- Working Hours: ${context.workingHours}
- Major Holidays: ${context.holidays.join(', ')}

REQUIREMENTS:
1. Create compelling marketing copy that resonates with the local culture
2. Use appropriate tone and communication style for the region
3. Include cultural references or themes when relevant
4. Ensure language is natural and native-sounding
5. Consider local buying behaviors and decision-making processes
6. Include region-appropriate calls-to-action
7. Suggest optimal timing for campaigns based on local patterns

Please provide:
1. The adapted marketing copy in the target language
2. Brief explanation of cultural adaptations made
3. Key localized elements used
4. Recommended campaign timing
5. Culturally appropriate call-to-action

Format your response as JSON with the following structure:
{
  "adaptedCopy": "The culturally adapted marketing copy",
  "culturalExplanation": "Explanation of cultural adaptations",
  "localizedElements": ["element1", "element2", "element3"],
  "suggestedTiming": "Best time/season for campaign",
  "localizedCta": "Culturally appropriate call-to-action",
  "additionalNotes": "Any additional cultural considerations"
}
`;
  }

  private parseCulturalResponse(response: string, targetMarket: string, context: any): CulturallyAdaptedCopy {
    try {
      const parsed = JSON.parse(response);
      
      return {
        originalCopy: '', // Would be provided separately
        adaptedCopy: parsed.adaptedCopy,
        culturalExplanation: parsed.culturalExplanation,
        localizedElements: parsed.localizedElements || [],
        targetMarket: targetMarket,
        language: context.language,
        suggestedTiming: parsed.suggestedTiming,
        localizedCta: parsed.localizedCta
      };
    } catch (error) {
      // Fallback parsing if JSON is malformed
      return {
        originalCopy: '',
        adaptedCopy: response,
        culturalExplanation: 'AI generated culturally adapted copy',
        localizedElements: ['Culturally adapted tone', 'Local language optimization'],
        targetMarket: targetMarket,
        language: context.language,
        suggestedTiming: context.workingHours,
        localizedCta: 'Start Now'
      };
    }
  }

  async generateMultiMarketCopy(
    request: Omit<MarketingCopyRequest, 'targetMarket'>,
    markets: string[]
  ): Promise<Record<string, CulturallyAdaptedCopy>> {
    const results: Record<string, CulturallyAdaptedCopy> = {};
    
    for (const market of markets) {
      try {
        const marketRequest = { ...request, targetMarket: market };
        results[market] = await this.generateCulturallyAdaptedCopy(marketRequest);
        
        // Add delay to avoid rate limiting (only in production)
        if (process.env.NODE_ENV !== 'development') {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      } catch (error) {
        console.error(`Failed to generate copy for market ${market}:`, error);
        // Continue with other markets, but add a fallback result
        try {
          const fallbackRequest = { ...request, targetMarket: market };
          results[market] = generateMockCulturalCopy(fallbackRequest);
        } catch (fallbackError) {
          console.error(`Fallback also failed for ${market}:`, fallbackError);
        }
      }
    }
    
    return results;
  }

  getCulturalInsights(marketCode: string) {
    return culturalContexts[marketCode as keyof typeof culturalContexts];
  }

  getSupportedMarkets() {
    return Object.keys(culturalContexts);
  }

  getMarketsByLanguage() {
    const marketsByLang: Record<string, string[]> = {};
    
    Object.entries(culturalContexts).forEach(([code, context]) => {
      const lang = context.language;
      if (!marketsByLang[lang]) {
        marketsByLang[lang] = [];
      }
      marketsByLang[lang].push(code);
    });
    
    return marketsByLang;
  }

  async generateLocalizedSocialPosts(
    productName: string,
    productDescription: string,
    targetMarkets: string[]
  ) {
    const socialTypes = ['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok'];
    const results: Record<string, Record<string, string>> = {};

    for (const market of targetMarkets) {
      results[market] = {};
      
      for (const platform of socialTypes) {
        try {
          const request: MarketingCopyRequest = {
            productName,
            productDescription,
            targetMarket: market,
            copyType: 'social_post',
            industry: 'Technology',
            targetAudience: `${platform} users`
          };
          
          const copy = await this.generateCulturallyAdaptedCopy(request);
          results[market][platform] = copy.adaptedCopy;
          
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error(`Failed to generate ${platform} copy for ${market}:`, error);
        }
      }
    }
    
    return results;
  }

  async generateEmailCampaigns(
    productName: string,
    productDescription: string,
    targetMarkets: string[]
  ) {
    const emailTypes = ['welcome', 'promotional', 'abandoned_cart', 'newsletter'];
    const results: Record<string, Record<string, any>> = {};

    for (const market of targetMarkets) {
      results[market] = {};
      
      for (const emailType of emailTypes) {
        try {
          const subjectRequest: MarketingCopyRequest = {
            productName,
            productDescription,
            targetMarket: market,
            copyType: 'email_subject',
            industry: 'E-commerce',
            targetAudience: emailType + ' email recipients'
          };
          
          const bodyRequest: MarketingCopyRequest = {
            productName,
            productDescription,
            targetMarket: market,
            copyType: 'description',
            industry: 'E-commerce',
            targetAudience: emailType + ' email recipients'
          };

          const [subject, body] = await Promise.all([
            this.generateCulturallyAdaptedCopy(subjectRequest),
            this.generateCulturallyAdaptedCopy(bodyRequest)
          ]);

          results[market][emailType] = {
            subject: subject.adaptedCopy,
            body: body.adaptedCopy,
            timing: subject.suggestedTiming,
            cta: subject.localizedCta
          };
          
          await new Promise(resolve => setTimeout(resolve, 800));
        } catch (error) {
          console.error(`Failed to generate ${emailType} email for ${market}:`, error);
        }
      }
    }
    
    return results;
  }

  async generateSeasonalCampaigns(
    productName: string,
    productDescription: string,
    targetMarket: string,
    season: 'spring' | 'summer' | 'fall' | 'winter' | 'holiday'
  ) {
    const context = culturalContexts[targetMarket as keyof typeof culturalContexts];
    
    if (!context) {
      throw new Error(`Market ${targetMarket} not supported`);
    }

    const seasonalPrompt = `
Create a seasonal marketing campaign for ${season} targeting ${context.name}.

Product: ${productName}
Description: ${productDescription}

Consider:
- Local seasonal patterns and weather
- Cultural holidays: ${context.holidays.join(', ')}
- Seasonal buying behaviors
- Local traditions and celebrations
- Seasonal color preferences
- Holiday shopping patterns

Generate:
1. Campaign theme
2. Seasonal headlines (5 variations)
3. Holiday-specific messaging
4. Seasonal CTAs
5. Timing recommendations
6. Visual suggestions
7. Cultural tie-ins
`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a seasonal marketing expert who creates culturally relevant campaigns for specific regions and seasons."
          },
          {
            role: "user",
            content: seasonalPrompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000
      });

      return completion.choices[0]?.message?.content || 'Failed to generate seasonal campaign';
    } catch (error) {
      console.error('Error generating seasonal campaign:', error);
      throw error;
    }
  }
}

export const culturalMarketingService = new CulturalMarketingService();