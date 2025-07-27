// API Configuration Service - Full Feature Activation
import { API_KEYS, validateApiKeys } from '@/config/api-keys';

export interface ApiStatus {
  name: string;
  service: string;
  status: 'configured' | 'missing' | 'invalid' | 'testing';
  required: boolean;
  priority: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  testResult?: boolean;
  errorMessage?: string;
  lastTested?: Date;
}

export class ApiConfigurationService {
  private static instance: ApiConfigurationService;
  private apiStatuses: Map<string, ApiStatus> = new Map();

  public static getInstance(): ApiConfigurationService {
    if (!ApiConfigurationService.instance) {
      ApiConfigurationService.instance = new ApiConfigurationService();
    }
    return ApiConfigurationService.instance;
  }

  constructor() {
    this.initializeApiStatuses();
  }

  private initializeApiStatuses() {
    const apis: ApiStatus[] = [
      // Critical APIs (Required for core functionality)
      {
        name: 'OpenAI GPT-4',
        service: 'openai',
        status: this.checkKeyStatus(API_KEYS.openai.key),
        required: true,
        priority: 'critical',
        description: 'AI content generation, NexBrain assistant, Magic Pages creation'
      },
      {
        name: 'Supabase Database',
        service: 'supabase',
        status: this.checkKeyStatus(API_KEYS.supabase.url),
        required: true,
        priority: 'critical',
        description: 'User authentication, data storage, real-time features'
      },
      
      // High Priority APIs (Core features)
      {
        name: 'ElevenLabs TTS',
        service: 'elevenlabs',
        status: this.checkKeyStatus(API_KEYS.elevenlabs.key),
        required: true,
        priority: 'high',
        description: 'Text-to-speech for video generation and voice content'
      },
      {
        name: 'Replicate Images',
        service: 'replicate',
        status: this.checkKeyStatus(API_KEYS.replicate.key),
        required: true,
        priority: 'high',
        description: 'AI image generation for campaigns and Magic Pages'
      },
      {
        name: 'Luma AI Video',
        service: 'luma',
        status: this.checkKeyStatus(API_KEYS.luma.key),
        required: true,
        priority: 'high',
        description: 'AI video generation for Video Creator module'
      },
      {
        name: 'CJ Dropshipping',
        service: 'cjDropshipping',
        status: this.checkKeyStatus(API_KEYS.cjDropshipping.key),
        required: true,
        priority: 'high',
        description: 'Product catalog and dropshipping fulfillment'
      },
      {
        name: 'Gupshup WhatsApp',
        service: 'gupshup',
        status: this.checkKeyStatus(API_KEYS.gupshup.key),
        required: true,
        priority: 'high',
        description: 'WhatsApp automation and business messaging'
      },
      {
        name: 'Facebook Marketing',
        service: 'facebook',
        status: this.checkKeyStatus(API_KEYS.facebook.accessToken),
        required: true,
        priority: 'high',
        description: 'Facebook Ads campaign creation and management'
      },
      {
        name: 'Unsplash Images',
        service: 'unsplash',
        status: this.checkKeyStatus(API_KEYS.unsplash.key),
        required: false,
        priority: 'medium',
        description: 'Stock photos for campaigns and content'
      },

      // Medium Priority APIs (Enhanced features)
      {
        name: 'D-ID Avatars',
        service: 'did',
        status: this.checkKeyStatus(API_KEYS.did.key),
        required: false,
        priority: 'medium',
        description: 'AI avatar creation for advanced video content'
      },
      {
        name: 'Runway Video',
        service: 'runway',
        status: this.checkKeyStatus(API_KEYS.runway.key),
        required: false,
        priority: 'medium',
        description: 'Advanced video generation and editing'
      },
      {
        name: 'Stripe Payments',
        service: 'stripe',
        status: this.checkKeyStatus(API_KEYS.stripe.publishableKey),
        required: false,
        priority: 'medium',
        description: 'Payment processing for subscriptions and credits'
      },

      // Low Priority APIs (Future enhancements)
      {
        name: 'Google APIs',
        service: 'google',
        status: this.checkKeyStatus(API_KEYS.google.apiKey),
        required: false,
        priority: 'low',
        description: 'YouTube, Google Ads, and Google Analytics integration'
      },
      {
        name: 'TikTok Marketing',
        service: 'tiktok',
        status: this.checkKeyStatus(API_KEYS.tiktok.appId),
        required: false,
        priority: 'low',
        description: 'TikTok advertising and content distribution'
      },
      {
        name: 'Instagram Business',
        service: 'instagram',
        status: this.checkKeyStatus(API_KEYS.instagram.appId),
        required: false,
        priority: 'low',
        description: 'Instagram content posting and advertising'
      },
      {
        name: 'Pexels Images',
        service: 'pexels',
        status: this.checkKeyStatus(API_KEYS.pexels.key),
        required: false,
        priority: 'low',
        description: 'Alternative stock photo source'
      },
      {
        name: 'PayPal Payments',
        service: 'paypal',
        status: this.checkKeyStatus(API_KEYS.paypal.clientId),
        required: false,
        priority: 'low',
        description: 'Alternative payment processing'
      }
    ];

    apis.forEach(api => {
      this.apiStatuses.set(api.service, api);
    });
  }

  private checkKeyStatus(key: string | undefined): 'configured' | 'missing' | 'invalid' {
    if (!key) return 'missing';
    if (key.includes('PLACEHOLDER') || key.includes('your_') || key.includes('_here')) {
      return 'missing';
    }
    return 'configured';
  }

  // Test individual API connectivity
  async testApiConnectivity(service: string): Promise<boolean> {
    const api = this.apiStatuses.get(service);
    if (!api) return false;

    api.status = 'testing';
    api.lastTested = new Date();

    try {
      let testResult = false;

      switch (service) {
        case 'openai':
          testResult = await this.testOpenAI();
          break;
        case 'elevenlabs':
          testResult = await this.testElevenLabs();
          break;
        case 'replicate':
          testResult = await this.testReplicate();
          break;
        case 'luma':
          testResult = await this.testLuma();
          break;
        case 'cjDropshipping':
          testResult = await this.testCJDropshipping();
          break;
        case 'gupshup':
          testResult = await this.testGupshup();
          break;
        case 'facebook':
          testResult = await this.testFacebook();
          break;
        case 'unsplash':
          testResult = await this.testUnsplash();
          break;
        case 'supabase':
          testResult = await this.testSupabase();
          break;
        default:
          testResult = false;
      }

      api.testResult = testResult;
      api.status = testResult ? 'configured' : 'invalid';
      api.errorMessage = testResult ? undefined : 'API test failed';

      return testResult;
    } catch (error) {
      api.testResult = false;
      api.status = 'invalid';
      api.errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return false;
    }
  }

  // Individual API test methods
  private async testOpenAI(): Promise<boolean> {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${API_KEYS.openai.key}`,
        'Content-Type': 'application/json'
      }
    });
    return response.ok;
  }

  private async testElevenLabs(): Promise<boolean> {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': API_KEYS.elevenlabs.key
      }
    });
    return response.ok;
  }

  private async testReplicate(): Promise<boolean> {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'GET',
      headers: {
        'Authorization': `Token ${API_KEYS.replicate.key}`
      }
    });
    return response.ok;
  }

  private async testLuma(): Promise<boolean> {
    const response = await fetch(`${API_KEYS.luma.baseUrl}/generations`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEYS.luma.key}`,
        'Content-Type': 'application/json'
      }
    });
    return response.ok;
  }

  private async testCJDropshipping(): Promise<boolean> {
    const response = await fetch(`${API_KEYS.cjDropshipping.baseUrl}/commonApi/categories`, {
      headers: {
        'CJ-Access-Token': API_KEYS.cjDropshipping.key,
        'Content-Type': 'application/json'
      }
    });
    return response.ok;
  }

  private async testGupshup(): Promise<boolean> {
    const response = await fetch(`${API_KEYS.gupshup.apiUrl}/app`, {
      headers: {
        'apikey': API_KEYS.gupshup.key,
        'Content-Type': 'application/json'
      }
    });
    return response.ok;
  }

  private async testFacebook(): Promise<boolean> {
    const response = await fetch(`https://graph.facebook.com/v${API_KEYS.facebook.apiVersion}/me?access_token=${API_KEYS.facebook.accessToken}`);
    return response.ok;
  }

  private async testUnsplash(): Promise<boolean> {
    const response = await fetch('https://api.unsplash.com/photos?per_page=1', {
      headers: {
        'Authorization': `Client-ID ${API_KEYS.unsplash.key}`
      }
    });
    return response.ok;
  }

  private async testSupabase(): Promise<boolean> {
    const response = await fetch(`${API_KEYS.supabase.url}/rest/v1/`, {
      headers: {
        'apikey': API_KEYS.supabase.anonKey,
        'Authorization': `Bearer ${API_KEYS.supabase.anonKey}`
      }
    });
    return response.ok;
  }

  // Test all APIs
  async testAllApis(): Promise<{ [service: string]: boolean }> {
    const results: { [service: string]: boolean } = {};
    
    const testPromises = Array.from(this.apiStatuses.keys()).map(async (service) => {
      results[service] = await this.testApiConnectivity(service);
    });

    await Promise.all(testPromises);
    return results;
  }

  // Get configuration summary
  getConfigurationSummary() {
    const all = Array.from(this.apiStatuses.values());
    const configured = all.filter(api => api.status === 'configured');
    const missing = all.filter(api => api.status === 'missing');
    const invalid = all.filter(api => api.status === 'invalid');
    const critical = all.filter(api => api.priority === 'critical');
    const criticalConfigured = critical.filter(api => api.status === 'configured');

    return {
      total: all.length,
      configured: configured.length,
      missing: missing.length,
      invalid: invalid.length,
      criticalTotal: critical.length,
      criticalConfigured: criticalConfigured.length,
      readyForLaunch: criticalConfigured.length === critical.length,
      completionPercentage: Math.round((configured.length / all.length) * 100)
    };
  }

  // Get APIs by priority
  getApisByPriority(priority: 'critical' | 'high' | 'medium' | 'low'): ApiStatus[] {
    return Array.from(this.apiStatuses.values())
      .filter(api => api.priority === priority)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  // Get missing critical APIs
  getMissingCriticalApis(): ApiStatus[] {
    return Array.from(this.apiStatuses.values())
      .filter(api => api.priority === 'critical' && api.status !== 'configured');
  }

  // Get next priority configuration
  getNextPriorityConfig(): ApiStatus | null {
    const priorities: Array<'critical' | 'high' | 'medium' | 'low'> = ['critical', 'high', 'medium', 'low'];
    
    for (const priority of priorities) {
      const missingApis = Array.from(this.apiStatuses.values())
        .filter(api => api.priority === priority && api.status !== 'configured');
      
      if (missingApis.length > 0) {
        return missingApis[0];
      }
    }
    
    return null;
  }

  // Generate configuration instructions
  generateConfigInstructions(): string[] {
    const instructions: string[] = [];
    const missing = this.getMissingCriticalApis();

    if (missing.length > 0) {
      instructions.push("🔧 CRITICAL: Configure these APIs first for core functionality:");
      missing.forEach(api => {
        instructions.push(`   • ${api.name}: ${api.description}`);
      });
      instructions.push("");
    }

    const nextPriority = this.getNextPriorityConfig();
    if (nextPriority && nextPriority.priority !== 'critical') {
      instructions.push(`📈 NEXT: Configure ${nextPriority.name} for enhanced features`);
      instructions.push(`   ${nextPriority.description}`);
    }

    return instructions;
  }

  // Get all API statuses
  getAllApiStatuses(): ApiStatus[] {
    return Array.from(this.apiStatuses.values())
      .sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
  }

  // Check if ready for production
  isReadyForProduction(): boolean {
    const critical = this.getApisByPriority('critical');
    return critical.every(api => api.status === 'configured');
  }

  // Get feature availability based on API configuration
  getFeatureAvailability() {
    const apis = this.apiStatuses;
    
    return {
      magicPages: apis.get('openai')?.status === 'configured',
      videoCreator: apis.get('luma')?.status === 'configured' && apis.get('elevenlabs')?.status === 'configured',
      campaignGenerator: apis.get('openai')?.status === 'configured' && apis.get('replicate')?.status === 'configured',
      whatsappAutomation: apis.get('gupshup')?.status === 'configured',
      facebookAds: apis.get('facebook')?.status === 'configured',
      dropshipping: apis.get('cjDropshipping')?.status === 'configured',
      imageGeneration: apis.get('replicate')?.status === 'configured',
      textToSpeech: apis.get('elevenlabs')?.status === 'configured',
      stockImages: apis.get('unsplash')?.status === 'configured',
      payments: apis.get('stripe')?.status === 'configured',
      advancedVideo: apis.get('did')?.status === 'configured' && apis.get('runway')?.status === 'configured'
    };
  }
}

// Export singleton instance
export const apiConfigService = ApiConfigurationService.getInstance();

// Export types
export type ApiPriority = 'critical' | 'high' | 'medium' | 'low';
export type ApiStatusType = 'configured' | 'missing' | 'invalid' | 'testing';