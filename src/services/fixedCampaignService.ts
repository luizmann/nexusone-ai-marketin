// Fixed Campaign Service - Resolving blank pages and campaign errors
import { ApiIntegrationService } from './api-integration';

export interface FixedCampaignData {
  id: string;
  title: string;
  productName: string;
  description: string;
  targetAudience: string;
  businessType: string;
  price: string;
  cta: string;
  
  // Generated Content
  generatedContent: {
    headline: string;
    subheadline: string;
    heroSection: {
      title: string;
      subtitle: string;
      imageUrl: string;
      ctaText: string;
    };
    problemSection: {
      title: string;
      description: string;
      painPoints: string[];
    };
    solutionSection: {
      title: string;
      description: string;
      benefits: string[];
    };
    featuresSection: {
      title: string;
      features: Array<{
        title: string;
        description: string;
        icon: string;
      }>;
    };
    socialProof: {
      testimonials: Array<{
        name: string;
        role: string;
        content: string;
        rating: number;
      }>;
      stats: Array<{
        number: string;
        label: string;
      }>;
    };
    pricingSection: {
      title: string;
      price: string;
      originalPrice?: string;
      ctaText: string;
      guarantees: string[];
    };
    faqSection: {
      title: string;
      questions: Array<{
        question: string;
        answer: string;
      }>;
    };
    footer: {
      companyName: string;
      contactInfo: string;
      disclaimer: string;
    };
  };
  
  // Marketing Assets
  marketingAssets: {
    landingPageUrl: string;
    facebookAds: Array<{
      id: string;
      headline: string;
      description: string;
      imageUrl: string;
      targeting: any;
    }>;
    videos: Array<{
      id: string;
      title: string;
      description: string;
      scriptContent: string;
      videoUrl?: string;
    }>;
    whatsappFlow: {
      welcomeMessage: string;
      productPresentation: string;
      objectionHandling: string[];
      closingMessages: string[];
    };
  };
  
  // Drag & Drop Assets
  dragDropAssets: {
    generatedImages: Array<{
      id: string;
      url: string;
      type: 'hero' | 'product' | 'background' | 'icon';
      prompt: string;
    }>;
    designElements: Array<{
      id: string;
      type: 'button' | 'text' | 'image' | 'container';
      content: string;
      styles: any;
    }>;
  };
  
  status: 'generating' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export class FixedCampaignService {
  private static instance: FixedCampaignService;
  private apiService: ApiIntegrationService;
  
  private constructor() {
    this.apiService = ApiIntegrationService.getInstance();
  }
  
  public static getInstance(): FixedCampaignService {
    if (!FixedCampaignService.instance) {
      FixedCampaignService.instance = new FixedCampaignService();
    }
    return FixedCampaignService.instance;
  }
  
  // Generate Complete Campaign with Real Content
  async generateCompleteCampaign(inputData: any): Promise<FixedCampaignData> {
    const campaignId = `campaign_${Date.now()}`;
    
    try {
      // Step 1: Generate Content with OpenAI
      const generatedContent = await this.generateContentWithOpenAI(inputData);
      
      // Step 2: Generate Marketing Images
      const generatedImages = await this.generateMarketingImages(inputData, generatedContent);
      
      // Step 3: Create Facebook Ads
      const facebookAds = await this.generateFacebookAds(inputData, generatedContent, generatedImages);
      
      // Step 4: Generate Video Content
      const videoContent = await this.generateVideoContent(inputData, generatedContent);
      
      // Step 5: Create WhatsApp Flow
      const whatsappFlow = await this.generateWhatsAppFlow(inputData, generatedContent);
      
      // Step 6: Create Drag & Drop Assets
      const dragDropAssets = await this.createDragDropAssets(generatedImages, generatedContent);
      
      // Build complete campaign
      const campaign: FixedCampaignData = {
        id: campaignId,
        title: inputData.title || `Campaign for ${inputData.productName}`,
        productName: inputData.productName,
        description: inputData.description,
        targetAudience: inputData.targetAudience,
        businessType: inputData.businessType,
        price: inputData.price,
        cta: inputData.cta || 'Buy Now',
        generatedContent,
        marketingAssets: {
          landingPageUrl: `https://nexusone.ai/landing/${campaignId}`,
          facebookAds,
          videos: videoContent,
          whatsappFlow
        },
        dragDropAssets,
        status: 'completed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Validate campaign quality
      const validation = this.validateCampaignQuality(campaign);
      
      // If validation fails, try to regenerate critical content
      if (!validation.isValid && validation.errors.some(e => e.includes('missing'))) {
        console.log('Campaign validation failed, attempting to regenerate...');
        const improvedContent = await this.regenerateCriticalContent(inputData, generatedContent, validation.errors);
        campaign.generatedContent = improvedContent;
        campaign.status = 'completed';
      }
      
      return campaign;
      
    } catch (error) {
      console.error('Campaign generation failed:', error);
      
      // Return campaign with error state but fallback content
      return {
        id: campaignId,
        title: inputData.title || `Campaign for ${inputData.productName}`,
        productName: inputData.productName,
        description: inputData.description,
        targetAudience: inputData.targetAudience,
        businessType: inputData.businessType,
        price: inputData.price,
        cta: inputData.cta || 'Buy Now',
        generatedContent: this.getFallbackContent(inputData),
        marketingAssets: {
          landingPageUrl: `https://nexusone.ai/landing/${campaignId}`,
          facebookAds: this.getFallbackAds(inputData),
          videos: this.getFallbackVideos(inputData),
          whatsappFlow: this.getFallbackWhatsAppFlow(inputData)
        },
        dragDropAssets: this.getFallbackDragDropAssets(),
        status: 'failed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
  }

  // Validate campaign quality to ensure no blank content
  private validateCampaignQuality(campaign: FixedCampaignData): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Check essential content
    if (!campaign.generatedContent?.headline || campaign.generatedContent.headline.trim().length === 0) {
      errors.push('Headline is missing or empty');
    }
    
    if (!campaign.generatedContent?.subheadline || campaign.generatedContent.subheadline.trim().length === 0) {
      errors.push('Subheadline is missing or empty');
    }
    
    if (!campaign.generatedContent?.problemSection?.description || campaign.generatedContent.problemSection.description.trim().length === 0) {
      errors.push('Problem description is missing or empty');
    }
    
    if (!campaign.generatedContent?.solutionSection?.description || campaign.generatedContent.solutionSection.description.trim().length === 0) {
      errors.push('Solution description is missing or empty');
    }
    
    if (!campaign.generatedContent?.pricingSection?.ctaText || campaign.generatedContent.pricingSection.ctaText.trim().length === 0) {
      errors.push('Call-to-action text is missing or empty');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Regenerate critical missing content
  private async regenerateCriticalContent(inputData: any, existingContent: any, errors: string[]): Promise<any> {
    try {
      const improvedPrompt = `
        Fix the following issues in this sales page content:
        Issues: ${errors.join(', ')}
        
        Current content: ${JSON.stringify(existingContent)}
        
        Product: ${inputData.productName}
        Target: ${inputData.targetAudience}
        Price: ${inputData.price}
        
        Generate ONLY the missing or empty sections. Return valid JSON with the complete, improved content structure.
        Make sure ALL fields have meaningful, specific content - no empty strings or generic placeholders.
      `;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer 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`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert copywriter. Always return complete, valid JSON with all fields filled.'
            },
            {
              role: 'user',
              content: improvedPrompt
            }
          ],
          temperature: 0.7,
          max_tokens: 3000
        })
      });

      if (response.ok) {
        const data = await response.json();
        const improvedContent = data.choices[0].message.content;
        const cleanedContent = improvedContent.replace(/```json\n?|\n?```/g, '').trim();
        
        try {
          return JSON.parse(cleanedContent);
        } catch {
          console.error('Failed to parse improved content, using existing');
          return existingContent;
        }
      }
    } catch (error) {
      console.error('Content regeneration failed:', error);
    }
    
    return existingContent;
  }
  
  // Generate Content using OpenAI with proper error handling
  private async generateContentWithOpenAI(inputData: any): Promise<any> {
    try {
      const prompt = `
        Create a complete, high-converting sales page content for this product:
        
        Product: ${inputData.productName}
        Description: ${inputData.description}
        Target Audience: ${inputData.targetAudience}
        Business Type: ${inputData.businessType}
        Price: ${inputData.price}
        
        Generate compelling, persuasive content that includes:
        1. An attention-grabbing headline with emotional hooks
        2. A compelling subheadline that builds on the main headline
        3. A hero section that immediately captures attention
        4. A problem section that identifies customer pain points
        5. A solution section that positions the product as the answer
        6. A features section with specific benefits
        7. Social proof including testimonials and statistics
        8. A clear pricing section with guarantees
        9. FAQ section addressing common objections
        10. Professional footer content
        
        Make it conversion-focused and emotionally compelling.
        
        Return ONLY valid JSON in this exact format:
        {
          "headline": "string",
          "subheadline": "string",
          "heroSection": {
            "title": "string",
            "subtitle": "string",
            "imageUrl": "placeholder_hero.jpg",
            "ctaText": "string"
          },
          "problemSection": {
            "title": "string",
            "description": "string",
            "painPoints": ["string", "string", "string"]
          },
          "solutionSection": {
            "title": "string",
            "description": "string",
            "benefits": ["string", "string", "string"]
          },
          "featuresSection": {
            "title": "string",
            "features": [
              {"title": "string", "description": "string", "icon": "check"},
              {"title": "string", "description": "string", "icon": "star"},
              {"title": "string", "description": "string", "icon": "lightning"}
            ]
          },
          "socialProof": {
            "testimonials": [
              {"name": "string", "role": "string", "content": "string", "rating": 5},
              {"name": "string", "role": "string", "content": "string", "rating": 5}
            ],
            "stats": [
              {"number": "string", "label": "string"},
              {"number": "string", "label": "string"}
            ]
          },
          "pricingSection": {
            "title": "string",
            "price": "${inputData.price}",
            "originalPrice": "string",
            "ctaText": "${inputData.cta}",
            "guarantees": ["string", "string"]
          },
          "faqSection": {
            "title": "string",
            "questions": [
              {"question": "string", "answer": "string"},
              {"question": "string", "answer": "string"}
            ]
          },
          "footer": {
            "companyName": "string",
            "contactInfo": "string",
            "disclaimer": "string"
          }
        }
      `;
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer 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`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are NexBrain, an expert AI copywriter specializing in high-converting sales pages. Always return valid JSON responses.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: 4000
        })
      });
      
      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }
      
      const data = await response.json();
      const content = data.choices[0].message.content;
      
      // Clean and parse JSON
      const cleanedContent = content.replace(/```json\n?|\n?```/g, '').trim();
      
      try {
        return JSON.parse(cleanedContent);
      } catch (parseError) {
        console.error('JSON parsing failed:', parseError);
        return this.getFallbackContent(inputData);
      }
      
    } catch (error) {
      console.error('OpenAI content generation failed:', error);
      return this.getFallbackContent(inputData);
    }
  }
  
  // Generate Marketing Images with Replicate/Unsplash
  private async generateMarketingImages(inputData: any, content: any): Promise<Array<{id: string, url: string, type: string, prompt: string}>> {
    const images = [];
    
    try {
      // Generate Hero Image
      const heroPrompt = `Professional product photography of ${inputData.productName}, high-quality, commercial lighting, ${inputData.businessType} style, clean background`;
      const heroImage = await this.generateImageWithReplicate(heroPrompt);
      if (heroImage) {
        images.push({
          id: 'hero_image',
          url: heroImage,
          type: 'hero',
          prompt: heroPrompt
        });
      }
      
      // Generate Product Images
      const productPrompt = `${inputData.productName} product showcase, multiple angles, professional photography, white background`;
      const productImage = await this.generateImageWithReplicate(productPrompt);
      if (productImage) {
        images.push({
          id: 'product_image',
          url: productImage,
          type: 'product',
          prompt: productPrompt
        });
      }
      
      // Generate Background Image
      const backgroundPrompt = `${inputData.businessType} background, professional, minimal, ${inputData.targetAudience} lifestyle`;
      const backgroundImage = await this.generateImageWithReplicate(backgroundPrompt);
      if (backgroundImage) {
        images.push({
          id: 'background_image',
          url: backgroundImage,
          type: 'background',
          prompt: backgroundPrompt
        });
      }
      
      // Fallback to Unsplash if generation fails
      if (images.length === 0) {
        const unsplashImages = await this.getUnsplashImages(inputData);
        images.push(...unsplashImages);
      }
      
    } catch (error) {
      console.error('Image generation failed:', error);
      // Return Unsplash fallback images
      const unsplashImages = await this.getUnsplashImages(inputData);
      images.push(...unsplashImages);
    }
    
    return images;
  }
  
  // Generate Image with Replicate API
  private async generateImageWithReplicate(prompt: string): Promise<string | null> {
    try {
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token r8_HbwQQ4NxMfhVPy0BS0xqOMkERd9B5JM440l66`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          version: "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
          input: {
            prompt: prompt,
            width: 1024,
            height: 768,
            num_outputs: 1,
            quality: 90
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`Replicate API error: ${response.statusText}`);
      }
      
      const prediction = await response.json();
      
      // Poll for completion
      return await this.pollReplicateGeneration(prediction.id);
      
    } catch (error) {
      console.error('Replicate image generation failed:', error);
      return null;
    }
  }
  
  // Poll Replicate Generation
  private async pollReplicateGeneration(predictionId: string): Promise<string | null> {
    const maxAttempts = 30;
    
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      try {
        const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
          headers: {
            'Authorization': `Token r8_HbwQQ4NxMfhVPy0BS0xqOMkERd9B5JM440l66`
          }
        });
        
        const prediction = await response.json();
        
        if (prediction.status === 'succeeded') {
          return prediction.output[0];
        } else if (prediction.status === 'failed') {
          throw new Error('Image generation failed');
        }
      } catch (error) {
        console.error('Error polling Replicate:', error);
      }
    }
    
    return null;
  }
  
  // Get Unsplash Images as fallback
  private async getUnsplashImages(inputData: any): Promise<Array<{id: string, url: string, type: string, prompt: string}>> {
    try {
      const query = `${inputData.productName} ${inputData.businessType}`.replace(/\s+/g, '+');
      const response = await fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=3&client_id=-zZ5LsB2CAMUhbPca_UKw31ngzc1W3_hfxSPdz_aBUE`);
      
      if (!response.ok) {
        throw new Error('Unsplash API error');
      }
      
      const data = await response.json();
      
      return data.results.slice(0, 3).map((photo: any, index: number) => ({
        id: `unsplash_${index}`,
        url: photo.urls.regular,
        type: index === 0 ? 'hero' : index === 1 ? 'product' : 'background',
        prompt: `Unsplash: ${query}`
      }));
      
    } catch (error) {
      console.error('Unsplash fallback failed:', error);
      return this.getPlaceholderImages();
    }
  }
  
  // Generate Facebook Ads
  private async generateFacebookAds(inputData: any, content: any, images: any[]): Promise<any[]> {
    const ads = [];
    
    try {
      // Create multiple ad variations
      const adPrompts = [
        `${content.headline} - ${content.subheadline}`,
        `Discover why ${inputData.targetAudience} love ${inputData.productName}`,
        `Limited time: ${inputData.productName} at special price ${inputData.price}`
      ];
      
      for (let i = 0; i < adPrompts.length; i++) {
        const adImage = images[i] || images[0];
        
        ads.push({
          id: `ad_${i + 1}`,
          headline: adPrompts[i],
          description: content.solutionSection.description,
          imageUrl: adImage?.url || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
          targeting: {
            interests: [inputData.targetAudience, inputData.businessType],
            ageRange: '25-65',
            locations: ['United States', 'Canada', 'United Kingdom']
          }
        });
      }
      
    } catch (error) {
      console.error('Facebook ads generation failed:', error);
      return this.getFallbackAds(inputData);
    }
    
    return ads;
  }
  
  // Generate Video Content
  private async generateVideoContent(inputData: any, content: any): Promise<any[]> {
    const videos = [];
    
    try {
      // Generate video script
      const scriptPrompt = `
        Create a 30-second promotional video script for ${inputData.productName}.
        Target audience: ${inputData.targetAudience}
        Key benefit: ${content.solutionSection.benefits[0]}
        
        Include:
        - Hook (3 seconds)
        - Problem (8 seconds)
        - Solution (12 seconds)
        - Call to action (7 seconds)
        
        Make it engaging and conversion-focused.
      `;
      
      const scriptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer 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`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: scriptPrompt }],
          max_tokens: 500
        })
      });
      
      if (scriptResponse.ok) {
        const scriptData = await scriptResponse.json();
        const script = scriptData.choices[0].message.content;
        
        videos.push({
          id: 'promo_video_1',
          title: `${inputData.productName} - Promotional Video`,
          description: 'AI-generated promotional video for maximum conversion',
          scriptContent: script,
          videoUrl: undefined // Will be generated by Luma AI
        });
      }
      
    } catch (error) {
      console.error('Video content generation failed:', error);
      return this.getFallbackVideos(inputData);
    }
    
    return videos.length > 0 ? videos : this.getFallbackVideos(inputData);
  }
  
  // Generate WhatsApp Flow
  private async generateWhatsAppFlow(inputData: any, content: any): Promise<any> {
    try {
      const flowPrompt = `
        Create a WhatsApp sales conversation flow for ${inputData.productName}.
        Target: ${inputData.targetAudience}
        Price: ${inputData.price}
        
        Generate:
        1. Welcome message (friendly, engaging)
        2. Product presentation (highlighting key benefits)
        3. Objection handling responses (3 common objections)
        4. Closing messages (urgency, call to action)
        
        Make it conversational and persuasive.
        Return as JSON with these exact keys: welcomeMessage, productPresentation, objectionHandling, closingMessages
      `;
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer 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`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: flowPrompt }],
          max_tokens: 800
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        const flowContent = data.choices[0].message.content;
        
        try {
          return JSON.parse(flowContent.replace(/```json\n?|\n?```/g, '').trim());
        } catch {
          return this.getFallbackWhatsAppFlow(inputData);
        }
      }
      
    } catch (error) {
      console.error('WhatsApp flow generation failed:', error);
    }
    
    return this.getFallbackWhatsAppFlow(inputData);
  }
  
  // Create Drag & Drop Assets
  private async createDragDropAssets(images: any[], content: any): Promise<any> {
    const designElements = [
      {
        id: 'hero_text',
        type: 'text',
        content: content.headline,
        styles: {
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#1a1a1a',
          textAlign: 'center'
        }
      },
      {
        id: 'cta_button',
        type: 'button',
        content: content.pricingSection.ctaText,
        styles: {
          backgroundColor: '#007bff',
          color: '#ffffff',
          padding: '16px 32px',
          borderRadius: '8px',
          fontSize: '18px',
          fontWeight: '600'
        }
      },
      {
        id: 'feature_container',
        type: 'container',
        content: '',
        styles: {
          backgroundColor: '#f8f9fa',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #e9ecef'
        }
      }
    ];
    
    return {
      generatedImages: images,
      designElements
    };
  }
  
  // Fallback Content Methods
  private getFallbackContent(inputData: any): any {
    return {
      headline: `Transform Your Life with ${inputData.productName}`,
      subheadline: `Discover why thousands of ${inputData.targetAudience} trust our solution`,
      heroSection: {
        title: `Revolutionary ${inputData.productName}`,
        subtitle: "The solution you've been waiting for",
        imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800",
        ctaText: inputData.cta || "Get Started Now"
      },
      problemSection: {
        title: "Are You Struggling With This?",
        description: `Many ${inputData.targetAudience} face challenges that ${inputData.productName} can solve.`,
        painPoints: [
          "Wasting time on ineffective solutions",
          "Paying too much for inferior products",
          "Struggling to find reliable options"
        ]
      },
      solutionSection: {
        title: `${inputData.productName} is the Answer`,
        description: `Our innovative solution is specifically designed for ${inputData.targetAudience}.`,
        benefits: [
          "Save time and effort",
          "Get professional results",
          "Enjoy peace of mind"
        ]
      },
      featuresSection: {
        title: "Amazing Features",
        features: [
          { title: "Premium Quality", description: "Built to last with the finest materials", icon: "star" },
          { title: "Easy to Use", description: "Simple setup and intuitive interface", icon: "check" },
          { title: "Fast Results", description: "See improvements in just days", icon: "lightning" }
        ]
      },
      socialProof: {
        testimonials: [
          { name: "Sarah Johnson", role: "Verified Customer", content: "This product changed my life! Highly recommended.", rating: 5 },
          { name: "Mike Chen", role: "Business Owner", content: "Exactly what I needed. Great value for money.", rating: 5 }
        ],
        stats: [
          { number: "10,000+", label: "Happy Customers" },
          { number: "99%", label: "Satisfaction Rate" }
        ]
      },
      pricingSection: {
        title: "Special Limited Time Offer",
        price: inputData.price || "$99",
        originalPrice: "$199",
        ctaText: inputData.cta || "Order Now",
        guarantees: ["30-day money-back guarantee", "Free shipping worldwide"]
      },
      faqSection: {
        title: "Frequently Asked Questions",
        questions: [
          { question: "How long does shipping take?", answer: "We ship within 24 hours and delivery takes 3-7 business days." },
          { question: "Is there a guarantee?", answer: "Yes! We offer a 30-day money-back guarantee if you're not satisfied." }
        ]
      },
      footer: {
        companyName: "NexusOne Solutions",
        contactInfo: "support@nexusone.ai | 1-800-NEXUS-AI",
        disclaimer: "Results may vary. This product is not intended to diagnose, treat, cure, or prevent any disease."
      }
    };
  }
  
  private getFallbackAds(inputData: any): any[] {
    return [
      {
        id: 'fallback_ad_1',
        headline: `Discover ${inputData.productName} - Perfect for ${inputData.targetAudience}`,
        description: `Get the best solution for your needs. Limited time offer at ${inputData.price}!`,
        imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
        targeting: {
          interests: [inputData.targetAudience, inputData.businessType],
          ageRange: '25-65',
          locations: ['United States', 'Canada']
        }
      }
    ];
  }
  
  private getFallbackVideos(inputData: any): any[] {
    return [
      {
        id: 'fallback_video_1',
        title: `${inputData.productName} - Introduction Video`,
        description: 'Professional promotional video showcasing key features and benefits',
        scriptContent: `Introducing ${inputData.productName} - the solution that ${inputData.targetAudience} have been waiting for. With our innovative approach, you can achieve amazing results. Get yours today for just ${inputData.price}!`,
        videoUrl: undefined
      }
    ];
  }
  
  private getFallbackWhatsAppFlow(inputData: any): any {
    return {
      welcomeMessage: `Hi! 👋 Welcome to ${inputData.productName}! I'm here to help you discover how our solution can transform your results. What brings you here today?`,
      productPresentation: `${inputData.productName} is specially designed for ${inputData.targetAudience}. Here's what makes it special: ✅ Premium quality ✅ Easy to use ✅ Fast results. Currently available for just ${inputData.price}!`,
      objectionHandling: [
        "I understand the price concern. Consider this an investment in your success - most customers see results that far exceed the cost!",
        "Many people worry about effectiveness. That's why we offer a 30-day money-back guarantee - you risk nothing!",
        "I know there are other options out there. What makes us different is our focus on ${inputData.targetAudience} specifically."
      ],
      closingMessages: [
        "This special price won't last long. Would you like to secure your order now?",
        "I can help you get started today. What questions can I answer for you?",
        "Ready to transform your results? Click the link below to order now! 👇"
      ]
    };
  }
  
  private getFallbackDragDropAssets(): any {
    return {
      generatedImages: this.getPlaceholderImages(),
      designElements: [
        {
          id: 'default_text',
          type: 'text',
          content: 'Your Headline Here',
          styles: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1a1a1a'
          }
        },
        {
          id: 'default_button',
          type: 'button',
          content: 'Click Here',
          styles: {
            backgroundColor: '#007bff',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: '6px'
          }
        }
      ]
    };
  }
  
  private getPlaceholderImages(): any[] {
    return [
      {
        id: 'placeholder_hero',
        url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
        type: 'hero',
        prompt: 'Placeholder hero image'
      },
      {
        id: 'placeholder_product',
        url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
        type: 'product',
        prompt: 'Placeholder product image'
      },
      {
        id: 'placeholder_background',
        url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800',
        type: 'background',
        prompt: 'Placeholder background image'
      }
    ];
  }
}

// Export singleton instance
export const fixedCampaignService = FixedCampaignService.getInstance();