import { openai } from '@/lib/openai';

  'en-US': {
    language: 'English',
    marketin
    preferredTone: 'Confid
    workingHours: '9 AM 
    demographics: 'Tech-savvy, time-conscious, value-oriented'
  'es-ES': {
    language: 'Spanish',
    marketingStyle: 'Warm headlines, community focus, family b
    preferredTone: 'Warm, personal, trustworthy',
    workingHours: '9 AM - 6 PM CET (
    demographics: 'F
  'es-MX': {
    
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
    workingHours: '9 AM - 6 PM BRT',
    demographics: 'Social, expressive, celebration-loving, community-minded'
  'he-IL': {
    language: 'Hebrew',
    marketingStyle: 'Innovation high
    preferredTone: '
    workingHours: '8 AM - 5 PM IST (Sunday-Thursday)',
    
  'ar-SA': {
    language: 'Arab
    marketingStyle: 'Respec
    preferredTone: 'Respectful, prestigious, quality-focused',
    workingHours: '8 AM - 5 PM AST (Saturday-Wednesday)',
    demographics: 'Family-oriented, prestige-conscious, quality-demanding'
  'ar-AE': {
    language: 'Arabic',
    marketingStyle: 'Luxury position
    preferredTone: '
    workingHours: '9 AM - 6 PM GST (Sunday-Thursday)',
    
};
export interface Ma
  productDescription: s
  copyType: 'headline' | 'description' | 'cta' | 'social_post' | 'email_subject' | 'full_page';
  industry?: string;
}
export interface CulturallyAdaptedCopy {
  adaptedCopy: string;
  localizedElements: string[];
  language: string;
  localizedCta: string;

  
    const context = cultu
    if (!context) {
    }
    const prompt = this.buildCulturalPrompt(request, context);
    try {
        model: "gpt-4",
          {
            content: `You are a cultural marketing expert
          {
            content: prompt
    
        max_

      
        throw new Error('Failed to generate culturally adapted copy');

      
      console.error('Error generating cultural copy:', error
    }

    return `

- N
- 

TARGET MARKET: ${context.name}
CULTURAL CONTEXT:
- Marketing Style: ${context.
- Preferred Tone: ${con
- Currency: ${context.currency}
- Major Holidays: ${context.holidays.join(', ')}
REQUIREMENTS:
2. Use appropriate tone an
4


1. The adapted marketin
3. Key localized eleme
5. Culturally appropriate call
Format your response as JSON w
  "adaptedCopy": "The c
  "localizedElement
  "localizedCta": "Cultura
}
 

      const parsed = JSON.parse(
  
        adaptedCopy: parsed.adaptedCopy,
        localizedElements: parsed.localizedElements || [],
    
        localizedCt
    } catch (error) {
     

        localizedElements: ['Culturally adapted tone', 'Local 
    
        l
    }

    request: Omit<M
  ): Promis
    
      try {
        resu
        // 
      } catch (error) {
        // Continue with ot
    }
    return

    return culturalConte



    co
    Object.entries(cul
      if (!marketsByLang[lang]) {
      }

    return marketsByLang;

    productName: stri
    targetMarkets: string[]
    const socialTy

   

          const request: MarketingCopyRequest = {
            
            copyType: 'social_post',

          
          results[market][plat
          await new Promise(resolve => setTi
          console.error(`Failed 
      }
    

  async generateEmailCampaigns
    productDescription: strin
  ) {
    const results: Record<string, Record<s
    for (const market of targetMarkets) {
      
        try {
            productName,
            targetMarket: marke
            industry: 'E-commerce',
          };

            p
            copyType: 'description',
            targetAudience: emailType + ' email recipients'

            this.generateCulturallyAdaptedCopy(su
          ]);
          results[market][emailType] = {
            body: body.adaptedCopy,

          
        } catch (error) {
        }
    }
    return results;


    targetMarket: string,
 
    
      throw new Error(`Market ${targetMarket} not supported`);

Create a seasonal marketing campaign for ${season} ta
Product: ${productName}

-
- 
- S

1. Campaign theme
3. Holida
5. Timing recommendations
7. Cul

      const completion = await openai.chat.completions.cr
        messages: [
            role: "system",
          },
            role: "user",
          }
        temperature: 0.8,
      });
      re
      console.error('
    }
}
export const culturalMark












































































































































































































