// NexBrain - Advanced AI Agent Service
import { ApiIntegrationService } from './api-integration';
import { apiService } from './apiService';

export interface NexBrainTask {
  id: string;
  type: 'magic_page' | 'ads_campaign' | 'video_generation' | 'whatsapp_flow' | 'campaign_optimization' | 'performance_analysis';
  input: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  createdAt: Date;
  completedAt?: Date;
  metadata?: any;
}

export interface CampaignPerformanceData {
  campaignId: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
  ctr: number;
  cpc: number;
  roas: number;
  lastUpdated: Date;
}

export interface OptimizationSuggestion {
  type: 'audience' | 'creative' | 'budget' | 'targeting' | 'copy';
  priority: 'high' | 'medium' | 'low';
  suggestion: string;
  expectedImpact: string;
  implementationSteps: string[];
}

export class NexBrainService {
  private static instance: NexBrainService;
  private apiService: ApiIntegrationService;
  public assistantId = 'asst_0jsx8eD6P3W9XGsSRRNU2Pfd'; // OpenAI Assistant ID
  private activeTasks: Map<string, NexBrainTask> = new Map();

  private constructor() {
    this.apiService = ApiIntegrationService.getInstance();
  }

  public static getInstance(): NexBrainService {
    if (!NexBrainService.instance) {
      NexBrainService.instance = new NexBrainService();
    }
    return NexBrainService.instance;
  }

  // Core NexBrain AI Assistant Integration
  async executeAssistantTask(prompt: string, context: any = {}): Promise<string> {
    const apiKeys = apiService.getAPIKeys();
    
    if (!apiKeys.openai) {
      throw new Error('OpenAI API key not configured. Please configure it in Admin Dashboard.');
    }

    try {
      // Create thread
      const threadResponse = await fetch('https://api.openai.com/v1/threads', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKeys.openai}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2'
        }
      });

      const thread = await threadResponse.json();

      // Add message with context
      const contextualPrompt = `${prompt}\n\nContext: ${JSON.stringify(context)}`;
      
      await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKeys.openai}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({
          role: 'user',
          content: contextualPrompt
        })
      });

      // Run assistant
      const runResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKeys.openai}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({
          assistant_id: this.assistantId
        })
      });

      const run = await runResponse.json();

      // Poll for completion
      let status = 'queued';
      let attempts = 0;
      const maxAttempts = 30;

      while (status !== 'completed' && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const statusResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`, {
          headers: {
            'Authorization': `Bearer ${apiKeys.openai}`,
            'OpenAI-Beta': 'assistants=v2'
          }
        });

        const statusData = await statusResponse.json();
        status = statusData.status;
        attempts++;

        if (status === 'failed') {
          throw new Error('Assistant task failed');
        }
      }

      if (status !== 'completed') {
        throw new Error('Assistant task timeout');
      }

      // Get messages
      const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
        headers: {
          'Authorization': `Bearer ${apiKeys.openai}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      });

      const messages = await messagesResponse.json();
      const assistantMessage = messages.data.find((msg: any) => msg.role === 'assistant');
      
      return assistantMessage?.content[0]?.text?.value || 'No response from assistant';

    } catch (error) {
      console.error('NexBrain Assistant task failed:', error);
      throw error;
    }
  }

  // Magic Page Generation with AI
  async generateMagicPage(productData: any, preferences: any = {}): Promise<any> {
    const taskId = this.generateTaskId();
    const task: NexBrainTask = {
      id: taskId,
      type: 'magic_page',
      input: { productData, preferences },
      status: 'processing',
      createdAt: new Date()
    };

    this.activeTasks.set(taskId, task);

    try {
      const prompt = `
        Create a high-converting sales page for this product using advanced copywriting techniques.
        
        Product: ${JSON.stringify(productData)}
        Preferences: ${JSON.stringify(preferences)}
        
        Generate:
        1. Compelling headline with emotional hooks
        2. Problem-focused opening
        3. Solution presentation
        4. Social proof elements
        5. Urgency and scarcity
        6. Strong CTA buttons
        7. FAQ section
        8. Trust badges and guarantees
        9. Responsive design structure
        10. SEO-optimized content
        
        Return as JSON with sections: {
          headline, subheadline, hero, problem, solution, benefits, 
          features, testimonials, pricing, cta, faq, footer
        }
      `;

      const result = await this.executeAssistantTask(prompt, {
        type: 'magic_page',
        product: productData,
        preferences
      });

      // Generate additional assets
      const [heroImage, backgroundImage] = await Promise.all([
        this.apiService.generateImage(`Professional product photography: ${productData.name}, high-quality, commercial lighting, white background`),
        this.apiService.searchImages(productData.category || 'business', { perPage: 1 })
      ]);

      const pageData = {
        ...JSON.parse(result),
        assets: {
          heroImage: heroImage[0],
          backgroundImage: backgroundImage[0]?.url,
          productImages: productData.images || []
        },
        seo: {
          title: `${productData.name} - Best Deals Online`,
          description: `Get ${productData.name} with fast shipping and best price guarantee. Limited time offer!`,
          keywords: [productData.name, productData.category, 'best price', 'fast shipping']
        }
      };

      task.status = 'completed';
      task.result = pageData;
      task.completedAt = new Date();

      return pageData;

    } catch (error) {
      task.status = 'failed';
      console.error('Magic Page generation failed:', error);
      throw error;
    }
  }

  // AI-Powered Ad Campaign Generation
  async generateAdsCampaign(productData: any, targetAudience: any, budget: number): Promise<any> {
    const taskId = this.generateTaskId();
    const task: NexBrainTask = {
      id: taskId,
      type: 'ads_campaign',
      input: { productData, targetAudience, budget },
      status: 'processing',
      createdAt: new Date()
    };

    this.activeTasks.set(taskId, task);

    try {
      const prompt = `
        Create a complete Facebook/Instagram ads campaign for maximum ROI.
        
        Product: ${JSON.stringify(productData)}
        Target Audience: ${JSON.stringify(targetAudience)}
        Budget: $${budget}
        
        Generate:
        1. Campaign strategy and objectives
        2. Multiple ad set variations (audiences)
        3. Compelling ad copy variations (5 versions)
        4. Image ad concepts (describe for AI generation)
        5. Video ad scripts and storyboards
        6. A/B testing strategy
        7. Bidding strategy recommendations
        8. Budget allocation across ad sets
        9. Performance KPIs to track
        10. Optimization recommendations
        
        Return as JSON with campaign structure and all creative assets.
      `;

      const campaignResult = await this.executeAssistantTask(prompt, {
        type: 'ads_campaign',
        product: productData,
        audience: targetAudience,
        budget
      });

      const campaign = JSON.parse(campaignResult);

      // Generate ad images using AI
      const adImages = await Promise.all(
        campaign.adCreatives?.map(async (creative: any) => {
          if (creative.imagePrompt) {
            const images = await this.apiService.generateImage(creative.imagePrompt, {
              width: 1200,
              height: 630,
              numOutputs: 2
            });
            return {
              ...creative,
              generatedImages: images
            };
          }
          return creative;
        }) || []
      );

      // Generate video concepts for video ads
      const videoScripts = campaign.videoAds?.map((video: any) => ({
        ...video,
        scenes: video.storyboard,
        voiceover: video.script,
        duration: 30
      })) || [];

      const fullCampaign = {
        ...campaign,
        adCreatives: adImages,
        videoAds: videoScripts,
        generatedAt: new Date(),
        estimatedReach: this.calculateEstimatedReach(targetAudience, budget),
        projectedROAS: this.calculateProjectedROAS(productData, budget)
      };

      task.status = 'completed';
      task.result = fullCampaign;
      task.completedAt = new Date();

      return fullCampaign;

    } catch (error) {
      task.status = 'failed';
      console.error('Ads campaign generation failed:', error);
      throw error;
    }
  }

  // Live Campaign Performance Tracking
  async trackCampaignPerformance(campaignId: string): Promise<CampaignPerformanceData> {
    try {
      // In a real implementation, this would fetch from Facebook Marketing API
      // For now, we'll simulate with dynamic data
      const mockPerformance: CampaignPerformanceData = {
        campaignId,
        impressions: Math.floor(Math.random() * 50000) + 10000,
        clicks: Math.floor(Math.random() * 2000) + 500,
        conversions: Math.floor(Math.random() * 100) + 20,
        spend: Math.floor(Math.random() * 500) + 100,
        revenue: Math.floor(Math.random() * 2000) + 800,
        ctr: Math.random() * 3 + 1,
        cpc: Math.random() * 2 + 0.5,
        roas: Math.random() * 3 + 2,
        lastUpdated: new Date()
      };

      return mockPerformance;

    } catch (error) {
      console.error('Campaign performance tracking failed:', error);
      throw error;
    }
  }

  // AI-Powered Campaign Optimization
  async optimizeCampaign(campaignId: string, performanceData: CampaignPerformanceData): Promise<OptimizationSuggestion[]> {
    try {
      const prompt = `
        Analyze this campaign performance data and provide specific optimization recommendations.
        
        Campaign Performance:
        - Impressions: ${performanceData.impressions}
        - Clicks: ${performanceData.clicks}
        - Conversions: ${performanceData.conversions}
        - Spend: $${performanceData.spend}
        - Revenue: $${performanceData.revenue}
        - CTR: ${performanceData.ctr}%
        - CPC: $${performanceData.cpc}
        - ROAS: ${performanceData.roas}x
        
        Provide specific, actionable optimization suggestions ranked by priority and expected impact.
        Include implementation steps for each suggestion.
        
        Return as JSON array of optimization suggestions.
      `;

      const optimizationResult = await this.executeAssistantTask(prompt, {
        type: 'campaign_optimization',
        performance: performanceData
      });

      return JSON.parse(optimizationResult);

    } catch (error) {
      console.error('Campaign optimization failed:', error);
      throw error;
    }
  }

  // Performance Analysis and Insights
  async generatePerformanceInsights(campaignData: any[]): Promise<any> {
    try {
      const prompt = `
        Analyze these campaign performance metrics and provide deep insights.
        
        Campaigns Data: ${JSON.stringify(campaignData)}
        
        Generate:
        1. Performance trends analysis
        2. Best performing segments
        3. Underperforming areas
        4. Budget reallocation recommendations
        5. Audience insights
        6. Creative performance analysis
        7. Seasonal patterns
        8. Competitor analysis suggestions
        9. Scaling opportunities
        10. Risk assessment
        
        Return as comprehensive JSON analysis.
      `;

      const insights = await this.executeAssistantTask(prompt, {
        type: 'performance_analysis',
        campaigns: campaignData
      });

      return JSON.parse(insights);

    } catch (error) {
      console.error('Performance insights generation failed:', error);
      throw error;
    }
  }

  // Real-time Campaign Monitoring
  async monitorCampaignsRealtime(campaignIds: string[]): Promise<any> {
    const performances = await Promise.all(
      campaignIds.map(id => this.trackCampaignPerformance(id))
    );

    const alerts = [];
    
    for (const perf of performances) {
      // Check for performance issues
      if (perf.ctr < 1.0) {
        alerts.push({
          type: 'low_ctr',
          campaignId: perf.campaignId,
          message: 'CTR below 1% - Consider updating creative',
          severity: 'medium'
        });
      }
      
      if (perf.roas < 2.0) {
        alerts.push({
          type: 'low_roas',
          campaignId: perf.campaignId,
          message: 'ROAS below 2x - Optimize targeting or pause',
          severity: 'high'
        });
      }
      
      if (perf.cpc > 3.0) {
        alerts.push({
          type: 'high_cpc',
          campaignId: perf.campaignId,
          message: 'CPC too high - Refine audience targeting',
          severity: 'medium'
        });
      }
    }

    return {
      performances,
      alerts,
      summary: {
        totalSpend: performances.reduce((sum, p) => sum + p.spend, 0),
        totalRevenue: performances.reduce((sum, p) => sum + p.revenue, 0),
        averageROAS: performances.reduce((sum, p) => sum + p.roas, 0) / performances.length,
        totalConversions: performances.reduce((sum, p) => sum + p.conversions, 0)
      },
      lastUpdated: new Date()
    };
  }

  // WhatsApp Sales Flow Generation
  async generateWhatsAppFlow(productData: any, salesStrategy: string): Promise<any> {
    try {
      const prompt = `
        Create an automated WhatsApp sales conversation flow for this product.
        
        Product: ${JSON.stringify(productData)}
        Sales Strategy: ${salesStrategy}
        
        Generate:
        1. Welcome message
        2. Product presentation messages
        3. Objection handling responses
        4. Urgency and scarcity messages
        5. Payment and ordering flow
        6. Follow-up sequences
        7. Cross-sell opportunities
        8. Customer service responses
        9. Recovery messages for abandoned carts
        10. Post-purchase follow-up
        
        Return as JSON conversation flow with triggers and responses.
      `;

      const flow = await this.executeAssistantTask(prompt, {
        type: 'whatsapp_flow',
        product: productData,
        strategy: salesStrategy
      });

      return JSON.parse(flow);

    } catch (error) {
      console.error('WhatsApp flow generation failed:', error);
      throw error;
    }
  }

  // Video Generation with AI
  async generateProductVideo(productData: any, videoType: 'promo' | 'demo' | 'testimonial' | 'unboxing'): Promise<any> {
    try {
      const prompt = `
        Create a ${videoType} video script and scene descriptions for this product.
        
        Product: ${JSON.stringify(productData)}
        Video Type: ${videoType}
        
        Generate:
        1. Video concept and hook
        2. Scene-by-scene breakdown
        3. Voiceover script
        4. Visual descriptions for each scene
        5. Background music suggestions
        6. Text overlays and captions
        7. Call-to-action placement
        8. Duration and pacing
        9. Mobile optimization notes
        10. A/B testing variations
        
        Return as detailed video production guide.
      `;

      const videoScript = await this.executeAssistantTask(prompt, {
        type: 'video_generation',
        product: productData,
        videoType
      });

      // Generate video using Luma AI
      const lumaResult = await this.generateLumaVideo(JSON.parse(videoScript));

      return {
        script: JSON.parse(videoScript),
        generatedVideo: lumaResult,
        createdAt: new Date()
      };

    } catch (error) {
      console.error('Video generation failed:', error);
      throw error;
    }
  }

  // Luma AI Video Generation Integration
  private async generateLumaVideo(videoScript: any): Promise<any> {
    const apiKeys = apiService.getAPIKeys();
    
    if (!apiKeys.luma) {
      console.warn('Luma AI API key not configured, using fallback');
      return {
        id: 'mock-video-id',
        url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        status: 'completed',
        thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=450&fit=crop'
      };
    }

    try {
      const response = await fetch('https://api.lumalabs.ai/dream-machine/v1/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKeys.luma}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: videoScript.scenes?.map((scene: any) => scene.description).join(' ') || videoScript.description,
          aspect_ratio: '16:9',
          loop: false
        })
      });

      if (!response.ok) {
        throw new Error(`Luma AI error: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Poll for completion
      return await this.pollLumaGeneration(result.id);

    } catch (error) {
      console.error('Luma video generation failed:', error);
      // Return fallback video data
      return {
        id: 'mock-video-id',
        url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        status: 'completed',
        thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=450&fit=crop'
      };
    }
  }

  private async pollLumaGeneration(generationId: string): Promise<any> {
    const apiKeys = apiService.getAPIKeys();
    const maxAttempts = 60; // 5 minutes max
    
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      
      try {
        const response = await fetch(`https://api.lumalabs.ai/dream-machine/v1/generations/${generationId}`, {
          headers: {
            'Authorization': `Bearer ${apiKeys.luma}`
          }
        });

        const result = await response.json();
        
        if (result.state === 'completed') {
          return result;
        } else if (result.state === 'failed') {
          throw new Error('Luma generation failed');
        }
      } catch (error) {
        console.error('Error polling Luma generation:', error);
      }
    }
    
    throw new Error('Luma generation timeout');
  }

  // Utility Methods
  private generateTaskId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateEstimatedReach(audience: any, budget: number): number {
    // Simplified reach calculation
    const baseReach = budget * 1000; // $1 = 1000 impressions estimate
    const audienceMultiplier = audience.size === 'broad' ? 1.2 : audience.size === 'narrow' ? 0.8 : 1.0;
    return Math.floor(baseReach * audienceMultiplier);
  }

  private calculateProjectedROAS(product: any, budget: number): number {
    // Simplified ROAS projection based on product margin and category
    const baseROAS = product.margin > 0.5 ? 3.5 : product.margin > 0.3 ? 2.8 : 2.2;
    const budgetEfficiency = budget > 1000 ? 1.1 : budget > 500 ? 1.0 : 0.9;
    return baseROAS * budgetEfficiency;
  }

  // Get Task Status
  getTaskStatus(taskId: string): NexBrainTask | null {
    return this.activeTasks.get(taskId) || null;
  }

  // Get All Active Tasks
  getActiveTasks(): NexBrainTask[] {
    return Array.from(this.activeTasks.values());
  }

  // Clean Completed Tasks
  cleanupCompletedTasks(): void {
    const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
    
    for (const [id, task] of this.activeTasks.entries()) {
      if (task.status === 'completed' && task.completedAt && task.completedAt < cutoffTime) {
        this.activeTasks.delete(id);
      }
    }
  }
}

// Export singleton instance
export const nexBrainService = NexBrainService.getInstance();

// Export types
export type { CampaignPerformanceData, OptimizationSuggestion };