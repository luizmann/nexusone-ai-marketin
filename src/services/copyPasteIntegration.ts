/**
 * Copy-Paste Integration Service
 * Handles various content extraction and processing scenarios
 */

export interface ExtractedContent {
  type: 'url' | 'text' | 'image' | 'video' | 'product' | 'social' | 'email' | 'phone';
  content: string;
  metadata: {
    title?: string;
    description?: string;
    image?: string;
    price?: string;
    brand?: string;
    author?: string;
    domain?: string;
    extractedAt: string;
    confidence: number;
    tags: string[];
    [key: string]: any;
  };
}

export class CopyPasteIntegrationService {
  private static instance: CopyPasteIntegrationService;
  
  static getInstance(): CopyPasteIntegrationService {
    if (!CopyPasteIntegrationService.instance) {
      CopyPasteIntegrationService.instance = new CopyPasteIntegrationService();
    }
    return CopyPasteIntegrationService.instance;
  }

  // URL patterns for different content types
  private urlPatterns = {
    ecommerce: [
      /amazon\.(com|co\.uk|de|fr|it|es|ca|au)/i,
      /shopify\.com/i,
      /etsy\.com/i,
      /ebay\.(com|co\.uk|de|fr|it|es|ca|au)/i,
      /aliexpress\.com/i,
      /walmart\.com/i,
      /target\.com/i
    ],
    social: [
      /instagram\.com/i,
      /facebook\.com/i,
      /twitter\.com/i,
      /linkedin\.com/i,
      /tiktok\.com/i,
      /youtube\.com/i,
      /pinterest\.com/i
    ],
    video: [
      /youtube\.com/i,
      /vimeo\.com/i,
      /twitch\.tv/i,
      /dailymotion\.com/i,
      /wistia\.com/i
    ],
    images: [
      /unsplash\.com/i,
      /pexels\.com/i,
      /pixabay\.com/i,
      /shutterstock\.com/i,
      /gettyimages\.com/i
    ]
  };

  /**
   * Main extraction method that determines content type and extracts relevant data
   */
  async extractContent(input: string): Promise<ExtractedContent> {
    const trimmedInput = input.trim();
    
    // Check if input is a URL
    if (this.isURL(trimmedInput)) {
      return this.extractFromURL(trimmedInput);
    }
    
    // Check if input contains URLs
    const urls = this.extractURLs(trimmedInput);
    if (urls.length > 0) {
      return this.extractFromURL(urls[0]);
    }
    
    // Check if input is an image URL
    if (this.isImageURL(trimmedInput)) {
      return this.extractImageContent(trimmedInput);
    }
    
    // Check for social media patterns
    const socialContent = this.extractSocialContent(trimmedInput);
    if (socialContent) {
      return socialContent;
    }
    
    // Check for contact information
    const contactInfo = this.extractContactInfo(trimmedInput);
    if (contactInfo.emails.length > 0 || contactInfo.phones.length > 0) {
      return this.createContactContent(contactInfo);
    }
    
    // Default to text content
    return this.extractTextContent(trimmedInput);
  }

  /**
   * Extract content from URLs
   */
  private async extractFromURL(url: string): Promise<ExtractedContent> {
    const domain = new URL(url).hostname;
    
    // E-commerce URL extraction
    if (this.matchesPattern(url, this.urlPatterns.ecommerce)) {
      return this.extractEcommerceContent(url);
    }
    
    // Social media URL extraction
    if (this.matchesPattern(url, this.urlPatterns.social)) {
      return this.extractSocialMediaContent(url);
    }
    
    // Video URL extraction
    if (this.matchesPattern(url, this.urlPatterns.video)) {
      return this.extractVideoContent(url);
    }
    
    // Image service URL extraction
    if (this.matchesPattern(url, this.urlPatterns.images)) {
      return this.extractImageServiceContent(url);
    }
    
    // Generic URL extraction
    return this.extractGenericURLContent(url);
  }

  /**
   * Extract e-commerce product information
   */
  private async extractEcommerceContent(url: string): Promise<ExtractedContent> {
    const domain = new URL(url).hostname;
    
    // Enhanced product data simulation based on URL patterns
    const getProductDataByUrl = (url: string, domain: string) => {
      // Amazon product patterns
      if (domain.includes('amazon')) {
        if (url.includes('headphones') || url.includes('B08N5WRWNW')) {
          return {
            title: "Sony WH-1000XM4 Wireless Premium Noise Canceling Overhead Headphones",
            description: "Industry-leading noise canceling technology means you hear every word, note, and tune with incredible clarity. Digital noise canceling technology, powered by the V1 Processor, cancels out even more mid and high-frequency sounds.",
            price: "$279.99",
            originalPrice: "$349.99",
            discount: "20% off",
            brand: "Sony",
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
            rating: "4.4/5",
            reviews: "75,234 reviews",
            features: ["30hr battery", "Quick Charge", "Touch Sensor Controls", "Speak-to-Chat Technology"]
          };
        }
        return {
          title: "Amazon Echo Dot (5th Gen)",
          description: "Our most popular smart speaker with Alexa. Crisp vocals and balanced bass for full sound.",
          price: "$49.99",
          originalPrice: "$59.99",
          discount: "17% off",
          brand: "Amazon",
          image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=400",
          rating: "4.6/5",
          reviews: "45,678 reviews",
          features: ["Voice Control", "Smart Home Hub", "Premium Audio", "Compact Design"]
        };
      }

      // Shopify store patterns
      if (domain.includes('shopify') || url.includes('shopify')) {
        return {
          title: "Organic Superfood Protein Powder",
          description: "Premium plant-based protein blend with organic superfoods. Perfect for post-workout recovery and daily nutrition.",
          price: "$49.99",
          originalPrice: "$64.99",
          discount: "23% off",
          brand: "Nature's Best",
          image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
          rating: "4.8/5",
          reviews: "2,456 reviews",
          features: ["100% Organic", "25g Protein", "No Artificial Sweeteners", "Vegan Friendly"]
        };
      }

      // eBay patterns
      if (domain.includes('ebay')) {
        return {
          title: "Vintage Leather Messenger Bag",
          description: "Handcrafted genuine leather messenger bag perfect for work or travel. Distressed finish gives it a unique vintage look.",
          price: "$89.99",
          originalPrice: "$129.99",
          discount: "31% off",
          brand: "Heritage Leather Co.",
          image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
          rating: "4.7/5",
          reviews: "892 reviews",
          features: ["Genuine Leather", "Multiple Compartments", "Adjustable Strap", "Vintage Style"]
        };
      }

      // Default fallback
      return {
        title: "Premium Wireless Bluetooth Earbuds",
        description: "High-quality wireless earbuds with active noise cancellation and premium sound quality.",
        price: "$129.99",
        originalPrice: "$199.99",
        discount: "35% off",
        brand: "TechAudio",
        image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400",
        rating: "4.5/5",
        reviews: "3,247 reviews",
        features: ["Noise Cancellation", "24hr Battery", "Wireless Charging", "Water Resistant"]
      };
    };

    const productData = getProductDataByUrl(url, domain);

    return {
      type: 'product',
      content: url,
      metadata: {
        ...productData,
        domain,
        extractedAt: new Date().toISOString(),
        confidence: 0.95,
        tags: ['ecommerce', 'product', domain.split('.')[0], 'bestseller'],
        originalUrl: url,
        currency: 'USD',
        category: this.detectProductCategory(productData.title),
        inStock: true,
        fastShipping: true
      }
    };
  }

  /**
   * Detect product category from title
   */
  private detectProductCategory(title: string): string {
    const categories = {
      'Electronics': ['headphones', 'earbuds', 'speaker', 'phone', 'laptop', 'tablet', 'echo', 'smart'],
      'Fashion': ['bag', 'shoes', 'clothing', 'watch', 'jewelry', 'accessories'],
      'Health': ['protein', 'vitamin', 'supplement', 'fitness', 'wellness'],
      'Home': ['furniture', 'decor', 'kitchen', 'bathroom', 'bedroom'],
      'Sports': ['equipment', 'gear', 'fitness', 'outdoor', 'exercise']
    };

    const titleLower = title.toLowerCase();
    
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(keyword => titleLower.includes(keyword))) {
        return category;
      }
    }
    
    return 'General';
  }

  /**
   * Extract social media content
   */
  private async extractSocialMediaContent(url: string): Promise<ExtractedContent> {
    const domain = new URL(url).hostname;
    
    const mockSocialData = {
      instagram: {
        title: "Amazing sunset photo",
        description: "Check out this incredible sunset I captured during my trip!",
        author: "@photographer_jane",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
        likes: "1,234",
        platform: "Instagram"
      },
      youtube: {
        title: "How to Create Landing Pages",
        description: "Learn the secrets of creating high-converting landing pages in this comprehensive tutorial.",
        author: "Marketing Pro",
        image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400",
        views: "45,678",
        duration: "12:34",
        platform: "YouTube"
      }
    };

    const socialData = domain.includes('instagram') ? mockSocialData.instagram : mockSocialData.youtube;

    return {
      type: 'social',
      content: url,
      metadata: {
        ...socialData,
        domain,
        extractedAt: new Date().toISOString(),
        confidence: 0.9,
        tags: ['social', 'media', domain.split('.')[0]],
        originalUrl: url
      }
    };
  }

  /**
   * Extract video content
   */
  private async extractVideoContent(url: string): Promise<ExtractedContent> {
    const domain = new URL(url).hostname;
    
    return {
      type: 'video',
      content: url,
      metadata: {
        title: "Educational Video Content",
        description: "Engaging video content for your audience.",
        thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400",
        duration: "5:23",
        platform: domain.includes('youtube') ? 'YouTube' : 'Video Platform',
        domain,
        extractedAt: new Date().toISOString(),
        confidence: 0.85,
        tags: ['video', 'media', domain.split('.')[0]]
      }
    };
  }

  /**
   * Extract image content
   */
  private extractImageContent(url: string): ExtractedContent {
    return {
      type: 'image',
      content: url,
      metadata: {
        title: "Image Content",
        description: "Image added from URL",
        image: url,
        extractedAt: new Date().toISOString(),
        confidence: 1.0,
        tags: ['image', 'visual']
      }
    };
  }

  /**
   * Extract text content with intelligent parsing
   */
  private extractTextContent(text: string): ExtractedContent {
    const lines = text.split('\n').filter(line => line.trim());
    const firstLine = lines[0] || '';
    const restContent = lines.slice(1).join('\n');
    
    // Detect potential titles (short first lines)
    const isTitle = firstLine.length < 100 && lines.length > 1;
    
    // Detect quotes
    const isQuote = text.includes('"') || text.includes(''') || text.includes('"');
    
    // Detect testimonial patterns
    const isTestimonial = /great|amazing|excellent|recommend|love|perfect/i.test(text) && text.length < 500;
    
    // Detect contact information
    const hasContact = /\b[\w._%+-]+@[\w.-]+\.[A-Z]{2,}\b/i.test(text) || 
                      /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(text);

    const contentType = isTestimonial ? 'testimonial' : 
                       hasContact ? 'contact' : 
                       isQuote ? 'quote' : 'text';

    return {
      type: 'text',
      content: text,
      metadata: {
        title: isTitle ? firstLine : undefined,
        description: isTitle ? restContent : text,
        contentType,
        extractedAt: new Date().toISOString(),
        confidence: 0.8,
        tags: [contentType, 'text'],
        wordCount: text.split(/\s+/).length,
        hasEmoji: /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(text)
      }
    };
  }

  /**
   * Extract social content patterns from text
   */
  private extractSocialContent(text: string): ExtractedContent | null {
    // Instagram post pattern
    if (text.includes('#') && text.includes('@')) {
      const hashtags = text.match(/#\w+/g) || [];
      const mentions = text.match(/@\w+/g) || [];
      
      return {
        type: 'social',
        content: text,
        metadata: {
          title: "Social Media Post",
          description: text.replace(/#\w+/g, '').replace(/@\w+/g, '').trim(),
          hashtags,
          mentions,
          extractedAt: new Date().toISOString(),
          confidence: 0.85,
          tags: ['social', 'post', 'instagram']
        }
      };
    }
    
    return null;
  }

  /**
   * Extract contact information
   */
  private extractContactInfo(text: string): { emails: string[], phones: string[] } {
    const emailRegex = /\b[\w._%+-]+@[\w.-]+\.[A-Z]{2,}\b/gi;
    const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g;
    
    const emails = text.match(emailRegex) || [];
    const phones = text.match(phoneRegex) || [];
    
    return { emails, phones };
  }

  /**
   * Create contact content from extracted info
   */
  private createContactContent(contactInfo: { emails: string[], phones: string[] }): ExtractedContent {
    const primaryContact = contactInfo.emails[0] || contactInfo.phones[0];
    
    return {
      type: contactInfo.emails.length > 0 ? 'email' : 'phone',
      content: primaryContact,
      metadata: {
        title: "Contact Information",
        description: `Contact: ${primaryContact}`,
        emails: contactInfo.emails,
        phones: contactInfo.phones,
        extractedAt: new Date().toISOString(),
        confidence: 1.0,
        tags: ['contact', 'communication']
      }
    };
  }

  /**
   * Extract content from image service URLs
   */
  private extractImageServiceContent(url: string): ExtractedContent {
    const domain = new URL(url).hostname;
    
    return {
      type: 'image',
      content: url,
      metadata: {
        title: "Stock Image",
        description: `High-quality image from ${domain}`,
        image: url,
        source: domain,
        extractedAt: new Date().toISOString(),
        confidence: 0.9,
        tags: ['image', 'stock', domain.split('.')[0]]
      }
    };
  }

  /**
   * Extract content from generic URLs
   */
  private async extractGenericURLContent(url: string): Promise<ExtractedContent> {
    const domain = new URL(url).hostname;
    
    return {
      type: 'url',
      content: url,
      metadata: {
        title: `Content from ${domain}`,
        description: "Web content extracted from URL",
        domain,
        extractedAt: new Date().toISOString(),
        confidence: 0.7,
        tags: ['url', 'web', 'generic']
      }
    };
  }

  /**
   * Utility functions
   */
  private isURL(text: string): boolean {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  }

  private extractURLs(text: string): string[] {
    const urlRegex = /https?:\/\/[^\s]+/g;
    return text.match(urlRegex) || [];
  }

  private isImageURL(url: string): boolean {
    return /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url);
  }

  private matchesPattern(url: string, patterns: RegExp[]): boolean {
    return patterns.some(pattern => pattern.test(url));
  }

  /**
   * Generate suggestions for content enhancement
   */
  generateContentSuggestions(content: ExtractedContent): string[] {
    const suggestions = [];
    
    switch (content.type) {
      case 'product':
        suggestions.push(
          "Add customer testimonials",
          "Include product specifications",
          "Create urgency with limited time offers",
          "Add social proof badges"
        );
        break;
        
      case 'text':
        suggestions.push(
          "Break into smaller paragraphs",
          "Add bullet points for readability",
          "Include a compelling headline",
          "Add a call-to-action"
        );
        break;
        
      case 'image':
        suggestions.push(
          "Add descriptive alt text",
          "Include image caption",
          "Optimize for mobile viewing",
          "Consider adding overlay text"
        );
        break;
        
      case 'video':
        suggestions.push(
          "Add video thumbnail",
          "Include video transcript",
          "Set up autoplay options",
          "Add closed captions"
        );
        break;
        
      case 'social':
        suggestions.push(
          "Cross-promote on multiple platforms",
          "Schedule optimal posting times",
          "Add engagement hooks",
          "Include trending hashtags"
        );
        break;
        
      default:
        suggestions.push(
          "Enhance with AI-generated content",
          "Add visual elements",
          "Improve formatting",
          "Include relevant links"
        );
    }
    
    return suggestions;
  }

  /**
   * Convert extracted content to page elements
   */
  convertToPageElements(content: ExtractedContent): any[] {
    const elements = [];
    
    switch (content.type) {
      case 'product':
        elements.push(
          {
            type: 'image',
            content: content.metadata.image,
            title: content.metadata.title
          },
          {
            type: 'text',
            content: content.metadata.title,
            style: { fontSize: '2rem', fontWeight: 'bold' }
          },
          {
            type: 'text',
            content: content.metadata.description
          },
          {
            type: 'text',
            content: content.metadata.price,
            style: { fontSize: '1.5rem', color: '#007bff', fontWeight: 'bold' }
          }
        );
        break;
        
      case 'social':
        elements.push(
          {
            type: 'text',
            content: content.metadata.title,
            style: { fontWeight: 'bold' }
          },
          {
            type: 'image',
            content: content.metadata.image
          },
          {
            type: 'text',
            content: `By ${content.metadata.author}`
          }
        );
        break;
        
      case 'text':
        if (content.metadata.title) {
          elements.push({
            type: 'text',
            content: content.metadata.title,
            style: { fontSize: '1.5rem', fontWeight: 'bold' }
          });
        }
        elements.push({
          type: 'text',
          content: content.metadata.description || content.content
        });
        break;
        
      default:
        elements.push({
          type: 'text',
          content: content.content
        });
    }
    
    return elements;
  }
}

// Export singleton instance
export const copyPasteService = CopyPasteIntegrationService.getInstance();