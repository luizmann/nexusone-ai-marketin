/**
 * Facebook Marketing API Integration
 * Handles Facebook Ads, Pages, and Instagram marketing automation
 */

export interface FacebookConfig {
  accessToken: string;
  appId: string;
  appSecret: string;
  apiVersion?: string;
}

export interface FacebookAdAccount {
  id: string;
  name: string;
  currency: string;
  timezone: string;
  status: string;
}

export interface FacebookCampaign {
  id?: string;
  name: string;
  objective: string;
  status: 'ACTIVE' | 'PAUSED' | 'DELETED';
  daily_budget?: number;
  lifetime_budget?: number;
  start_time?: string;
  end_time?: string;
}

export interface FacebookAdSet {
  id?: string;
  name: string;
  campaign_id: string;
  targeting: {
    geo_locations?: {
      countries?: string[];
      cities?: any[];
    };
    age_min?: number;
    age_max?: number;
    genders?: number[];
    interests?: any[];
    behaviors?: any[];
    custom_audiences?: string[];
  };
  optimization_goal: string;
  billing_event: string;
  bid_amount?: number;
  daily_budget?: number;
  start_time?: string;
  end_time?: string;
}

export interface FacebookAd {
  id?: string;
  name: string;
  adset_id: string;
  creative: {
    object_story_spec: {
      page_id: string;
      link_data?: {
        call_to_action?: {
          type: string;
          value?: {
            link: string;
          };
        };
        description?: string;
        link: string;
        message: string;
        name: string;
        image_hash?: string;
        video_id?: string;
      };
      video_data?: {
        call_to_action?: {
          type: string;
          value?: {
            link: string;
          };
        };
        description?: string;
        message: string;
        title: string;
        video_id: string;
      };
    };
  };
}

export interface FacebookInsights {
  impressions: number;
  clicks: number;
  spend: number;
  ctr: number;
  cpm: number;
  cpc: number;
  conversions?: number;
  cost_per_conversion?: number;
  roas?: number;
}

export class FacebookMarketingAPI {
  private config: FacebookConfig;
  private baseUrl: string;

  constructor(config: FacebookConfig) {
    this.config = config;
    this.baseUrl = `https://graph.facebook.com/${config.apiVersion || 'v18.0'}`;
  }

  /**
   * Validate Facebook Access Token
   */
  async validateToken(): Promise<{ valid: boolean; scopes: string[]; error?: string }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/me?fields=id,name&access_token=${this.config.accessToken}`
      );
      
      if (!response.ok) {
        return { valid: false, scopes: [], error: 'Invalid access token' };
      }

      // Check token permissions
      const tokenInfo = await fetch(
        `${this.baseUrl}/me/permissions?access_token=${this.config.accessToken}`
      );
      
      const permissions = await tokenInfo.json();
      const scopes = permissions.data
        .filter((p: any) => p.status === 'granted')
        .map((p: any) => p.permission);

      return { valid: true, scopes };
    } catch (error) {
      return { 
        valid: false, 
        scopes: [], 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get user's Facebook Ad Accounts
   */
  async getAdAccounts(): Promise<FacebookAdAccount[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/me/adaccounts?fields=id,name,currency,timezone_name,account_status&access_token=${this.config.accessToken}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch ad accounts: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data.map((account: any) => ({
        id: account.id,
        name: account.name,
        currency: account.currency,
        timezone: account.timezone_name,
        status: account.account_status
      }));
    } catch (error) {
      console.error('Error fetching ad accounts:', error);
      throw error;
    }
  }

  /**
   * Get Facebook Pages managed by user
   */
  async getPages(): Promise<any[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/me/accounts?fields=id,name,access_token,category,about&access_token=${this.config.accessToken}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch pages: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching pages:', error);
      throw error;
    }
  }

  /**
   * Create Facebook Campaign
   */
  async createCampaign(adAccountId: string, campaign: FacebookCampaign): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('name', campaign.name);
      formData.append('objective', campaign.objective);
      formData.append('status', campaign.status);
      
      if (campaign.daily_budget) {
        formData.append('daily_budget', campaign.daily_budget.toString());
      }
      if (campaign.lifetime_budget) {
        formData.append('lifetime_budget', campaign.lifetime_budget.toString());
      }
      if (campaign.start_time) {
        formData.append('start_time', campaign.start_time);
      }
      if (campaign.end_time) {
        formData.append('end_time', campaign.end_time);
      }

      const response = await fetch(
        `${this.baseUrl}/${adAccountId}/campaigns?access_token=${this.config.accessToken}`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create campaign: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  }

  /**
   * Create Facebook Ad Set
   */
  async createAdSet(adAccountId: string, adSet: FacebookAdSet): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('name', adSet.name);
      formData.append('campaign_id', adSet.campaign_id);
      formData.append('optimization_goal', adSet.optimization_goal);
      formData.append('billing_event', adSet.billing_event);
      formData.append('targeting', JSON.stringify(adSet.targeting));
      
      if (adSet.daily_budget) {
        formData.append('daily_budget', adSet.daily_budget.toString());
      }
      if (adSet.bid_amount) {
        formData.append('bid_amount', adSet.bid_amount.toString());
      }
      if (adSet.start_time) {
        formData.append('start_time', adSet.start_time);
      }
      if (adSet.end_time) {
        formData.append('end_time', adSet.end_time);
      }

      const response = await fetch(
        `${this.baseUrl}/${adAccountId}/adsets?access_token=${this.config.accessToken}`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create ad set: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('Error creating ad set:', error);
      throw error;
    }
  }

  /**
   * Upload image to Facebook
   */
  async uploadImage(adAccountId: string, imageUrl: string, imageName: string): Promise<string> {
    try {
      // First, fetch the image
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
      }
      
      const imageBuffer = await imageResponse.arrayBuffer();
      const blob = new Blob([imageBuffer]);
      
      const formData = new FormData();
      formData.append('filename', imageName);
      formData.append('source', blob);

      const response = await fetch(
        `${this.baseUrl}/${adAccountId}/adimages?access_token=${this.config.accessToken}`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to upload image: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return data.images[imageName]?.hash || '';
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  /**
   * Upload video to Facebook
   */
  async uploadVideo(adAccountId: string, videoUrl: string, videoName: string): Promise<string> {
    try {
      // First, fetch the video
      const videoResponse = await fetch(videoUrl);
      if (!videoResponse.ok) {
        throw new Error(`Failed to fetch video: ${videoResponse.statusText}`);
      }
      
      const videoBuffer = await videoResponse.arrayBuffer();
      const blob = new Blob([videoBuffer]);
      
      const formData = new FormData();
      formData.append('title', videoName);
      formData.append('source', blob);

      const response = await fetch(
        `${this.baseUrl}/${adAccountId}/advideos?access_token=${this.config.accessToken}`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to upload video: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  }

  /**
   * Create Facebook Ad
   */
  async createAd(adAccountId: string, ad: FacebookAd): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('name', ad.name);
      formData.append('adset_id', ad.adset_id);
      formData.append('creative', JSON.stringify(ad.creative));

      const response = await fetch(
        `${this.baseUrl}/${adAccountId}/ads?access_token=${this.config.accessToken}`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create ad: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('Error creating ad:', error);
      throw error;
    }
  }

  /**
   * Get Campaign Insights
   */
  async getCampaignInsights(
    campaignId: string, 
    dateRange: { since: string; until: string }
  ): Promise<FacebookInsights> {
    try {
      const fields = [
        'impressions',
        'clicks',
        'spend',
        'ctr',
        'cpm',
        'cpc',
        'conversions',
        'cost_per_conversion',
        'actions'
      ].join(',');

      const response = await fetch(
        `${this.baseUrl}/${campaignId}/insights?fields=${fields}&time_range=${JSON.stringify(dateRange)}&access_token=${this.config.accessToken}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch insights: ${response.statusText}`);
      }

      const data = await response.json();
      const insights = data.data[0] || {};

      return {
        impressions: parseInt(insights.impressions || '0'),
        clicks: parseInt(insights.clicks || '0'),
        spend: parseFloat(insights.spend || '0'),
        ctr: parseFloat(insights.ctr || '0'),
        cpm: parseFloat(insights.cpm || '0'),
        cpc: parseFloat(insights.cpc || '0'),
        conversions: parseInt(insights.conversions || '0'),
        cost_per_conversion: parseFloat(insights.cost_per_conversion || '0'),
        roas: insights.actions ? this.calculateROAS(insights) : 0
      };
    } catch (error) {
      console.error('Error fetching insights:', error);
      throw error;
    }
  }

  /**
   * Calculate ROAS from Facebook actions data
   */
  private calculateROAS(insights: any): number {
    try {
      const purchases = insights.actions?.find((action: any) => 
        action.action_type === 'purchase' || action.action_type === 'offsite_conversion.fb_pixel_purchase'
      );
      
      if (purchases && insights.spend) {
        const revenue = parseFloat(purchases.value || '0');
        const spend = parseFloat(insights.spend);
        return spend > 0 ? revenue / spend : 0;
      }
      
      return 0;
    } catch (error) {
      console.error('Error calculating ROAS:', error);
      return 0;
    }
  }

  /**
   * Create complete dropshipping campaign
   */
  async createDropshippingCampaign(params: {
    adAccountId: string;
    pageId: string;
    productName: string;
    productPrice: number;
    landingPageUrl: string;
    imageUrl?: string;
    videoUrl?: string;
    targetAudience: {
      countries: string[];
      ageMin: number;
      ageMax: number;
      interests: string[];
    };
    budget: {
      daily: number;
      total?: number;
    };
  }): Promise<{
    campaignId: string;
    adSetId: string;
    adId: string;
  }> {
    try {
      // 1. Create Campaign
      const campaignId = await this.createCampaign(params.adAccountId, {
        name: `${params.productName} - Dropshipping Campaign`,
        objective: 'CONVERSIONS',
        status: 'PAUSED', // Start paused for review
        daily_budget: params.budget.daily * 100, // Facebook expects cents
        lifetime_budget: params.budget.total ? params.budget.total * 100 : undefined
      });

      // 2. Create Ad Set
      const adSetId = await this.createAdSet(params.adAccountId, {
        name: `${params.productName} - Target Audience`,
        campaign_id: campaignId,
        optimization_goal: 'OFFSITE_CONVERSIONS',
        billing_event: 'IMPRESSIONS',
        daily_budget: params.budget.daily * 100,
        targeting: {
          geo_locations: {
            countries: params.targetAudience.countries
          },
          age_min: params.targetAudience.ageMin,
          age_max: params.targetAudience.ageMax,
          interests: params.targetAudience.interests.map(interest => ({ name: interest }))
        }
      });

      // 3. Upload media if provided
      let imageHash: string | undefined;
      let videoId: string | undefined;

      if (params.imageUrl) {
        imageHash = await this.uploadImage(
          params.adAccountId, 
          params.imageUrl, 
          `${params.productName}-image.jpg`
        );
      }

      if (params.videoUrl) {
        videoId = await this.uploadVideo(
          params.adAccountId, 
          params.videoUrl, 
          `${params.productName}-video`
        );
      }

      // 4. Create Ad Creative
      const creative: FacebookAd['creative'] = {
        object_story_spec: {
          page_id: params.pageId,
          link_data: {
            call_to_action: {
              type: 'SHOP_NOW',
              value: {
                link: params.landingPageUrl
              }
            },
            description: `Get ${params.productName} now for only $${params.productPrice}! Limited time offer with free shipping worldwide.`,
            link: params.landingPageUrl,
            message: `🔥 AMAZING DEAL! ${params.productName} - Don't miss out on this incredible offer!`,
            name: `${params.productName} - Special Offer`,
            image_hash: imageHash,
            video_id: videoId
          }
        }
      };

      // 5. Create Ad
      const adId = await this.createAd(params.adAccountId, {
        name: `${params.productName} - Main Ad`,
        adset_id: adSetId,
        creative
      });

      return {
        campaignId,
        adSetId,
        adId
      };
    } catch (error) {
      console.error('Error creating dropshipping campaign:', error);
      throw error;
    }
  }

  /**
   * Analyze provided access token
   */
  async analyzeToken(token: string): Promise<{
    isValid: boolean;
    userInfo?: any;
    adAccounts?: FacebookAdAccount[];
    pages?: any[];
    permissions?: string[];
    recommendations?: string[];
  }> {
    try {
      // Temporarily use provided token
      const originalToken = this.config.accessToken;
      this.config.accessToken = token;

      // Validate and get info
      const validation = await this.validateToken();
      
      if (!validation.valid) {
        this.config.accessToken = originalToken; // Restore original
        return {
          isValid: false,
          recommendations: [
            'The provided access token is invalid or expired',
            'Please obtain a new access token from Facebook Developer Console',
            'Ensure the token has required permissions: ads_management, pages_manage_ads, business_management'
          ]
        };
      }

      // Get user info
      const userResponse = await fetch(
        `${this.baseUrl}/me?fields=id,name,email&access_token=${token}`
      );
      const userInfo = await userResponse.json();

      // Get ad accounts and pages
      const [adAccounts, pages] = await Promise.all([
        this.getAdAccounts().catch(() => []),
        this.getPages().catch(() => [])
      ]);

      // Restore original token
      this.config.accessToken = originalToken;

      const recommendations = [];
      
      if (adAccounts.length === 0) {
        recommendations.push('No ad accounts found. You may need to create a Facebook Business Manager account.');
      }
      
      if (pages.length === 0) {
        recommendations.push('No Facebook pages found. Create a Facebook page to run ads.');
      }

      if (!validation.scopes.includes('ads_management')) {
        recommendations.push('Missing ads_management permission. This is required to create and manage ads.');
      }

      if (validation.scopes.length > 0 && adAccounts.length > 0 && pages.length > 0) {
        recommendations.push('✅ Token is ready for Facebook marketing automation!');
        recommendations.push('You can now create automated campaigns for your dropshipping products.');
      }

      return {
        isValid: true,
        userInfo,
        adAccounts,
        pages,
        permissions: validation.scopes,
        recommendations
      };

    } catch (error) {
      return {
        isValid: false,
        recommendations: [
          `Error analyzing token: ${error instanceof Error ? error.message : 'Unknown error'}`,
          'Please check your internet connection and try again',
          'Ensure the token is properly formatted and not expired'
        ]
      };
    }
  }
}

// Utility function to create Facebook Marketing instance
export function createFacebookMarketing(config: FacebookConfig): FacebookMarketingAPI {
  return new FacebookMarketingAPI(config);
}

// Export types
export type {
  FacebookConfig,
  FacebookAdAccount,
  FacebookCampaign,
  FacebookAdSet,
  FacebookAd,
  FacebookInsights
};