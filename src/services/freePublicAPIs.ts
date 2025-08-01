/**
 * Free Public APIs Integration Hub
 * Collection of free APIs that can enhance NexusOne AI functionality
 */

export interface PublicAPI {
  name: string;
  description: string;
  baseUrl: string;
  requiresAuth: boolean;
  authType?: 'api_key' | 'bearer' | 'basic';
  rateLimits?: {
    requests: number;
    period: string;
  };
  categories: string[];
}

export class FreePublicAPIsHub {
  private apis: PublicAPI[] = [
    // Content Generation APIs
    {
      name: 'Lorem Picsum',
      description: 'Random placeholder images',
      baseUrl: 'https://picsum.photos',
      requiresAuth: false,
      categories: ['images', 'placeholder']
    },
    {
      name: 'Quotable',
      description: 'Famous quotes API',
      baseUrl: 'https://api.quotable.io',
      requiresAuth: false,
      categories: ['content', 'inspiration']
    },
    {
      name: 'JSONPlaceholder',
      description: 'Fake JSON data for testing',
      baseUrl: 'https://jsonplaceholder.typicode.com',
      requiresAuth: false,
      categories: ['testing', 'development']
    },
    
    // Business & Marketing APIs
    {
      name: 'REST Countries',
      description: 'Country information',
      baseUrl: 'https://restcountries.com/v3.1',
      requiresAuth: false,
      categories: ['geography', 'business']
    },
    {
      name: 'Open Exchange Rates',
      description: 'Currency exchange rates',
      baseUrl: 'https://api.exchangerate-api.com/v4',
      requiresAuth: false,
      categories: ['finance', 'business']
    },
    {
      name: 'IP Geolocation',
      description: 'User location data',
      baseUrl: 'https://api.ipgeolocation.io',
      requiresAuth: true,
      authType: 'api_key',
      categories: ['geolocation', 'analytics']
    },
    
    // Content & Media APIs
    {
      name: 'Unsplash',
      description: 'High-quality photos',
      baseUrl: 'https://api.unsplash.com',
      requiresAuth: true,
      authType: 'api_key',
      rateLimits: { requests: 50, period: 'hour' },
      categories: ['images', 'photography']
    },
    {
      name: 'NewsAPI',
      description: 'Global news articles',
      baseUrl: 'https://newsapi.org/v2',
      requiresAuth: true,
      authType: 'api_key',
      rateLimits: { requests: 1000, period: 'day' },
      categories: ['news', 'content']
    },
    
    // Fun & Engagement APIs
    {
      name: 'Cat Facts',
      description: 'Random cat facts',
      baseUrl: 'https://catfact.ninja',
      requiresAuth: false,
      categories: ['fun', 'content']
    },
    {
      name: 'Jokes API',
      description: 'Programming jokes',
      baseUrl: 'https://official-joke-api.appspot.com',
      requiresAuth: false,
      categories: ['humor', 'content']
    },
    {
      name: 'Dog API',
      description: 'Random dog images',
      baseUrl: 'https://dog.ceo/api',
      requiresAuth: false,
      categories: ['images', 'fun']
    },
    
    // Utility APIs
    {
      name: 'QR Server',
      description: 'QR code generation',
      baseUrl: 'https://api.qrserver.com/v1',
      requiresAuth: false,
      categories: ['qr', 'utility']
    },
    {
      name: 'Email Validation',
      description: 'Email address validation',
      baseUrl: 'https://api.emailvalidation.io/v1',
      requiresAuth: true,
      authType: 'api_key',
      categories: ['validation', 'utility']
    }
  ];

  // Content Generation Methods
  async getRandomImage(width: number = 800, height: number = 600): Promise<string> {
    return `https://picsum.photos/${width}/${height}`;
  }

  async getRandomImageWithCategory(category: string, width: number = 800, height: number = 600): Promise<string> {
    const seed = encodeURIComponent(category);
    return `https://picsum.photos/seed/${seed}/${width}/${height}`;
  }

  async getInspirationalQuote(): Promise<any> {
    try {
      const response = await fetch('https://api.quotable.io/random?tags=motivational,success,business');
      return await response.json();
    } catch (error) {
      return { content: 'Success is not final, failure is not fatal: it is the courage to continue that counts.', author: 'Winston Churchill' };
    }
  }

  async getQuotesByTag(tag: string, limit: number = 5): Promise<any> {
    try {
      const response = await fetch(`https://api.quotable.io/quotes?tags=${tag}&limit=${limit}`);
      return await response.json();
    } catch (error) {
      return { results: [] };
    }
  }

  // Business Data Methods
  async getCountryInfo(countryCode: string): Promise<any> {
    try {
      const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
      return await response.json();
    } catch (error) {
      return null;
    }
  }

  async getCurrencyRates(baseCurrency: string = 'USD'): Promise<any> {
    try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
      return await response.json();
    } catch (error) {
      return null;
    }
  }

  async getUserLocation(ip?: string): Promise<any> {
    try {
      const url = ip ? `https://ipapi.co/${ip}/json/` : 'https://ipapi.co/json/';
      const response = await fetch(url);
      return await response.json();
    } catch (error) {
      return null;
    }
  }

  // Content & Media Methods
  async getUnsplashPhotos(query: string, apiKey: string, perPage: number = 20): Promise<any> {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&client_id=${apiKey}`
      );
      return await response.json();
    } catch (error) {
      return { results: [] };
    }
  }

  async getLatestNews(apiKey: string, category: string = 'business', country: string = 'us'): Promise<any> {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?category=${category}&country=${country}&apiKey=${apiKey}`
      );
      return await response.json();
    } catch (error) {
      return { articles: [] };
    }
  }

  // Fun Content Methods
  async getCatFact(): Promise<any> {
    try {
      const response = await fetch('https://catfact.ninja/fact');
      return await response.json();
    } catch (error) {
      return { fact: 'Cats are amazing creatures!' };
    }
  }

  async getRandomJoke(): Promise<any> {
    try {
      const response = await fetch('https://official-joke-api.appspot.com/random_joke');
      return await response.json();
    } catch (error) {
      return { setup: 'Why do programmers prefer dark mode?', punchline: 'Because light attracts bugs!' };
    }
  }

  async getRandomDogImage(): Promise<any> {
    try {
      const response = await fetch('https://dog.ceo/api/breeds/image/random');
      return await response.json();
    } catch (error) {
      return { message: 'https://via.placeholder.com/400x300?text=🐕' };
    }
  }

  // Utility Methods
  async generateQRCode(text: string, size: number = 200): Promise<string> {
    const encodedText = encodeURIComponent(text);
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}`;
  }

  async validateEmail(email: string, apiKey?: string): Promise<any> {
    if (!apiKey) {
      // Simple regex validation if no API key
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return { valid: emailRegex.test(email) };
    }

    try {
      const response = await fetch(`https://api.emailvalidation.io/v1/info?apikey=${apiKey}&email=${email}`);
      return await response.json();
    } catch (error) {
      return { valid: false };
    }
  }

  // Development & Testing Methods
  async getFakeUserData(count: number = 1): Promise<any> {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/users?_limit=${count}`);
      return await response.json();
    } catch (error) {
      return [];
    }
  }

  async getFakePostData(count: number = 10): Promise<any> {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${count}`);
      return await response.json();
    } catch (error) {
      return [];
    }
  }

  // Batch Content Generation
  async generateCampaignAssets(theme: string, apiKeys: { [key: string]: string } = {}): Promise<any> {
    try {
      const [quote, image, joke, news] = await Promise.allSettled([
        this.getQuotesByTag(theme, 1),
        this.getRandomImageWithCategory(theme),
        this.getRandomJoke(),
        apiKeys.newsApi ? this.getLatestNews(apiKeys.newsApi, 'business') : Promise.resolve({ articles: [] })
      ]);

      return {
        inspirationalQuote: quote.status === 'fulfilled' ? quote.value : null,
        heroImage: image.status === 'fulfilled' ? image.value : null,
        engagementContent: joke.status === 'fulfilled' ? joke.value : null,
        trendingNews: news.status === 'fulfilled' ? news.value : null,
        qrCode: await this.generateQRCode(`Campaign: ${theme}`)
      };
    } catch (error) {
      console.error('Error generating campaign assets:', error);
      return null;
    }
  }

  // Social Media Content Generation
  async generateSocialMediaContent(topic: string, platform: string = 'general'): Promise<any> {
    try {
      const [quote, image, catFact] = await Promise.allSettled([
        this.getInspirationalQuote(),
        this.getRandomImageWithCategory(topic),
        this.getCatFact()
      ]);

      const baseContent = {
        topic,
        platform,
        createdAt: new Date().toISOString()
      };

      switch (platform.toLowerCase()) {
        case 'instagram':
          return {
            ...baseContent,
            caption: quote.status === 'fulfilled' ? `"${quote.value.content}" - ${quote.value.author}` : '',
            image: image.status === 'fulfilled' ? image.value : '',
            hashtags: this.generateHashtags(topic),
            type: 'image_post'
          };

        case 'twitter':
          return {
            ...baseContent,
            text: quote.status === 'fulfilled' ? `${quote.value.content.substring(0, 200)}...` : '',
            hashtags: this.generateHashtags(topic).slice(0, 3),
            type: 'text_post'
          };

        case 'facebook':
          return {
            ...baseContent,
            text: quote.status === 'fulfilled' ? quote.value.content : '',
            image: image.status === 'fulfilled' ? image.value : '',
            funFact: catFact.status === 'fulfilled' ? catFact.value.fact : '',
            type: 'mixed_post'
          };

        default:
          return {
            ...baseContent,
            quote: quote.status === 'fulfilled' ? quote.value : null,
            image: image.status === 'fulfilled' ? image.value : null,
            type: 'general_post'
          };
      }
    } catch (error) {
      console.error('Error generating social media content:', error);
      return null;
    }
  }

  private generateHashtags(topic: string): string[] {
    const baseHashtags = ['#marketing', '#business', '#success', '#motivation'];
    const topicHashtags = [
      `#${topic.toLowerCase().replace(/\s+/g, '')}`,
      `#${topic.toLowerCase().replace(/\s+/g, '')}marketing`,
      `#digital${topic.toLowerCase().replace(/\s+/g, '')}`
    ];
    
    return [...baseHashtags, ...topicHashtags].slice(0, 8);
  }

  // API Discovery Methods
  getAvailableAPIs(): PublicAPI[] {
    return this.apis;
  }

  getAPIsByCategory(category: string): PublicAPI[] {
    return this.apis.filter(api => api.categories.includes(category));
  }

  getFreeAPIs(): PublicAPI[] {
    return this.apis.filter(api => !api.requiresAuth);
  }

  getAPIInfo(name: string): PublicAPI | undefined {
    return this.apis.find(api => api.name === name);
  }

  // Health Check
  async checkAPIHealth(apiName: string): Promise<boolean> {
    const api = this.getAPIInfo(apiName);
    if (!api) return false;

    try {
      const response = await fetch(api.baseUrl, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async checkAllAPIsHealth(): Promise<{ [key: string]: boolean }> {
    const results: { [key: string]: boolean } = {};
    
    for (const api of this.apis) {
      results[api.name] = await this.checkAPIHealth(api.name);
    }
    
    return results;
  }
}

// Export singleton instance
export const freePublicAPIs = new FreePublicAPIsHub();