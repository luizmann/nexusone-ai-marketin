// Centralized API Integration Service for NexusOne
import { API_KEYS, validateApiKeys } from '@/config/api-keys';

export class ApiIntegrationService {
  private static instance: ApiIntegrationService;
  
  public static getInstance(): ApiIntegrationService {
    if (!ApiIntegrationService.instance) {
      ApiIntegrationService.instance = new ApiIntegrationService();
    }
    return ApiIntegrationService.instance;
  }

  // OpenAI Integration
  async generateContent(prompt: string, options: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
  } = {}) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEYS.openai.key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: options.model || 'gpt-4o',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: options.maxTokens || 2000,
          temperature: options.temperature || 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI generation failed:', error);
      throw error;
    }
  }

  // ElevenLabs Text-to-Speech
  async generateSpeech(text: string, voiceId?: string) {
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId || API_KEYS.elevenlabs.voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': API_KEYS.elevenlabs.key
        },
        body: JSON.stringify({
          text,
          model_id: API_KEYS.elevenlabs.model,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`);
      }

      return await response.blob();
    } catch (error) {
      console.error('ElevenLabs TTS failed:', error);
      throw error;
    }
  }

  // Replicate Image Generation
  async generateImage(prompt: string, options: {
    width?: number;
    height?: number;
    numOutputs?: number;
  } = {}) {
    try {
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${API_KEYS.replicate.key}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          version: API_KEYS.replicate.model.split(':')[1],
          input: {
            prompt,
            width: options.width || 1024,
            height: options.height || 1024,
            num_outputs: options.numOutputs || 1,
            scheduler: "K_EULER",
            num_inference_steps: 20,
            guidance_scale: 7.5
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Replicate API error: ${response.statusText}`);
      }

      const prediction = await response.json();
      
      // Poll for completion
      return await this.pollReplicateResult(prediction.id);
    } catch (error) {
      console.error('Replicate image generation failed:', error);
      throw error;
    }
  }

  private async pollReplicateResult(predictionId: string, maxAttempts = 30): Promise<string[]> {
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
      
      const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
        headers: {
          'Authorization': `Token ${API_KEYS.replicate.key}`
        }
      });

      const result = await response.json();
      
      if (result.status === 'succeeded') {
        return result.output;
      } else if (result.status === 'failed') {
        throw new Error('Replicate prediction failed');
      }
    }
    
    throw new Error('Replicate prediction timeout');
  }

  // Unsplash Image Search
  async searchImages(query: string, options: {
    perPage?: number;
    orientation?: 'landscape' | 'portrait' | 'squarish';
  } = {}) {
    try {
      const params = new URLSearchParams({
        query,
        per_page: String(options.perPage || 12),
        orientation: options.orientation || 'landscape'
      });

      const response = await fetch(`https://api.unsplash.com/search/photos?${params}`, {
        headers: {
          'Authorization': `Client-ID ${API_KEYS.unsplash.key}`
        }
      });

      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.results.map((photo: any) => ({
        id: photo.id,
        url: photo.urls.regular,
        thumbnail: photo.urls.thumb,
        description: photo.alt_description,
        photographer: photo.user.name,
        downloadUrl: photo.links.download
      }));
    } catch (error) {
      console.error('Unsplash search failed:', error);
      throw error;
    }
  }

  // CJ Dropshipping Product Search
  async searchProducts(options: {
    categoryId?: string;
    keyword?: string;
    pageNum?: number;
    pageSize?: number;
    priceFrom?: number;
    priceTo?: number;
  } = {}) {
    try {
      const params = new URLSearchParams({
        pageNum: String(options.pageNum || 1),
        pageSize: String(options.pageSize || 20),
        ...(options.keyword && { keyword: options.keyword }),
        ...(options.categoryId && { categoryId: options.categoryId }),
        ...(options.priceFrom && { priceFrom: String(options.priceFrom) }),
        ...(options.priceTo && { priceTo: String(options.priceTo) })
      });

      const response = await fetch(`${API_KEYS.cjDropshipping.baseUrl}/products/search?${params}`, {
        headers: {
          'CJ-Access-Token': API_KEYS.cjDropshipping.key,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`CJ Dropshipping API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('CJ Dropshipping search failed:', error);
      throw error;
    }
  }

  // Facebook Marketing API - Create Campaign
  async createFacebookCampaign(campaignData: {
    name: string;
    objective: string;
    status: string;
    adSetData?: any;
    adData?: any;
  }) {
    try {
      const response = await fetch(`https://graph.facebook.com/v18.0/act_${API_KEYS.facebook.appId}/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          access_token: API_KEYS.facebook.accessToken,
          name: campaignData.name,
          objective: campaignData.objective,
          status: campaignData.status
        })
      });

      if (!response.ok) {
        throw new Error(`Facebook API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Facebook campaign creation failed:', error);
      throw error;
    }
  }

  // WhatsApp Business API - Send Message
  async sendWhatsAppMessage(phoneNumber: string, message: string, type: 'text' | 'template' = 'text') {
    try {
      const response = await fetch(`https://graph.facebook.com/v18.0/${API_KEYS.whatsapp.phoneNumberId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEYS.whatsapp.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: phoneNumber,
          type,
          text: { body: message }
        })
      });

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('WhatsApp message failed:', error);
      throw error;
    }
  }

  // API Health Check
  async checkApiHealth() {
    const results = {
      openai: false,
      elevenlabs: false,
      replicate: false,
      unsplash: false,
      cjDropshipping: false,
      facebook: false,
      whatsapp: false
    };

    // Test OpenAI
    try {
      await fetch('https://api.openai.com/v1/models', {
        headers: { 'Authorization': `Bearer ${API_KEYS.openai.key}` }
      });
      results.openai = true;
    } catch (e) {
      console.error('OpenAI health check failed:', e);
    }

    // Test ElevenLabs
    try {
      await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: { 'xi-api-key': API_KEYS.elevenlabs.key }
      });
      results.elevenlabs = true;
    } catch (e) {
      console.error('ElevenLabs health check failed:', e);
    }

    // Test Replicate
    try {
      await fetch('https://api.replicate.com/v1/predictions', {
        headers: { 'Authorization': `Token ${API_KEYS.replicate.key}` }
      });
      results.replicate = true;
    } catch (e) {
      console.error('Replicate health check failed:', e);
    }

    // Test Unsplash
    try {
      await fetch('https://api.unsplash.com/photos?per_page=1', {
        headers: { 'Authorization': `Client-ID ${API_KEYS.unsplash.key}` }
      });
      results.unsplash = true;
    } catch (e) {
      console.error('Unsplash health check failed:', e);
    }

    // Test CJ Dropshipping
    try {
      await fetch(`${API_KEYS.cjDropshipping.baseUrl}/categories`, {
        headers: { 'CJ-Access-Token': API_KEYS.cjDropshipping.key }
      });
      results.cjDropshipping = true;
    } catch (e) {
      console.error('CJ Dropshipping health check failed:', e);
    }

    return results;
  }

  // API Usage Tracking
  async trackApiUsage(service: string, operation: string, cost: number = 0) {
    // This would typically save to database
    console.log(`API Usage: ${service}.${operation} - Cost: $${cost}`);
    
    // Send to Supabase for tracking
    // Implementation depends on your tracking requirements
  }

  // Get API Status Summary
  getApiStatus() {
    const validation = validateApiKeys();
    
    return {
      configured: validation.configuredKeys.length,
      missing: validation.missingKeys.length,
      total: validation.configuredKeys.length + validation.missingKeys.length,
      readyForProduction: validation.isValid,
      missingKeys: validation.missingKeys
    };
  }
}

// Export singleton instance
export const apiService = ApiIntegrationService.getInstance();

// Export types
export interface ApiGenerationOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface ImageGenerationOptions {
  width?: number;
  height?: number;
  numOutputs?: number;
}

export interface ImageSearchOptions {
  perPage?: number;
  orientation?: 'landscape' | 'portrait' | 'squarish';
}

export interface ProductSearchOptions {
  categoryId?: string;
  keyword?: string;
  pageNum?: number;
  pageSize?: number;
  priceFrom?: number;
  priceTo?: number;
}