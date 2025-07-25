/**
 * Facebook Token Analysis Service
 * Analyzes Facebook access tokens and provides recommendations
 */

import { FacebookMarketingAPI, FacebookConfig } from '../integrations/facebook-marketing';

export interface TokenAnalysisResult {
  isValid: boolean;
  tokenType: 'USER' | 'PAGE' | 'APP' | 'UNKNOWN';
  expiresAt?: string;
  scopes: string[];
  userInfo?: {
    id: string;
    name: string;
    email?: string;
  };
  businessAccounts?: any[];
  adAccounts?: any[];
  pages?: any[];
  capabilities: {
    canCreateAds: boolean;
    canManagePages: boolean;
    canAccessInsights: boolean;
    canUploadMedia: boolean;
  };
  limitations: string[];
  recommendations: string[];
  setupSteps?: string[];
}

export class FacebookTokenAnalyzer {
  private baseUrl = 'https://graph.facebook.com/v18.0';

  async analyzeToken(accessToken: string): Promise<TokenAnalysisResult> {
    try {
      console.log('🔍 Analyzing Facebook Access Token...');
      
      // Step 1: Get token info
      const tokenInfo = await this.getTokenInfo(accessToken);
      
      if (!tokenInfo.isValid) {
        return {
          isValid: false,
          tokenType: 'UNKNOWN',
          scopes: [],
          capabilities: {
            canCreateAds: false,
            canManagePages: false,
            canAccessInsights: false,
            canUploadMedia: false
          },
          limitations: ['Invalid or expired access token'],
          recommendations: [
            'Generate a new access token from Facebook Developer Console',
            'Ensure you have the correct permissions: ads_management, pages_manage_ads, business_management',
            'Check if your Facebook App is approved for marketing API access'
          ]
        };
      }

      // Step 2: Get user information
      const userInfo = await this.getUserInfo(accessToken);
      
      // Step 3: Get permissions
      const permissions = await this.getPermissions(accessToken);
      
      // Step 4: Get business assets
      const [adAccounts, pages, businessAccounts] = await Promise.all([
        this.getAdAccounts(accessToken),
        this.getPages(accessToken),
        this.getBusinessAccounts(accessToken)
      ]);

      // Step 5: Analyze capabilities
      const capabilities = this.analyzeCapabilities(permissions);
      
      // Step 6: Generate recommendations
      const { limitations, recommendations, setupSteps } = this.generateRecommendations(
        permissions,
        adAccounts,
        pages,
        capabilities
      );

      return {
        isValid: true,
        tokenType: this.determineTokenType(tokenInfo),
        expiresAt: tokenInfo.expires_at,
        scopes: permissions,
        userInfo,
        businessAccounts,
        adAccounts,
        pages,
        capabilities,
        limitations,
        recommendations,
        setupSteps
      };

    } catch (error) {
      console.error('❌ Error analyzing token:', error);
      
      return {
        isValid: false,
        tokenType: 'UNKNOWN',
        scopes: [],
        capabilities: {
          canCreateAds: false,
          canManagePages: false,
          canAccessInsights: false,
          canUploadMedia: false
        },
        limitations: ['Failed to analyze token - network or permission error'],
        recommendations: [
          'Check your internet connection',
          'Verify the token is correctly formatted',
          'Ensure you have proper Facebook developer access'
        ]
      };
    }
  }

  private async getTokenInfo(accessToken: string): Promise<{ isValid: boolean; expires_at?: string; token_type?: string }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/oauth/access_token_info?access_token=${accessToken}`
      );

      if (!response.ok) {
        return { isValid: false };
      }

      const data = await response.json();
      return {
        isValid: true,
        expires_at: data.expires_at ? new Date(data.expires_at * 1000).toISOString() : undefined,
        token_type: data.type
      };
    } catch (error) {
      return { isValid: false };
    }
  }

  private async getUserInfo(accessToken: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/me?fields=id,name,email,first_name,last_name&access_token=${accessToken}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  }

  private async getPermissions(accessToken: string): Promise<string[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/me/permissions?access_token=${accessToken}`
      );

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.data
        .filter((p: any) => p.status === 'granted')
        .map((p: any) => p.permission);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      return [];
    }
  }

  private async getAdAccounts(accessToken: string): Promise<any[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/me/adaccounts?fields=id,name,currency,timezone_name,account_status,amount_spent,balance&access_token=${accessToken}`
      );

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching ad accounts:', error);
      return [];
    }
  }

  private async getPages(accessToken: string): Promise<any[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/me/accounts?fields=id,name,access_token,category,about,fan_count,link&access_token=${accessToken}`
      );

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching pages:', error);
      return [];
    }
  }

  private async getBusinessAccounts(accessToken: string): Promise<any[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/me/businesses?fields=id,name,verification_status&access_token=${accessToken}`
      );

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching business accounts:', error);
      return [];
    }
  }

  private determineTokenType(tokenInfo: any): 'USER' | 'PAGE' | 'APP' | 'UNKNOWN' {
    if (tokenInfo.token_type) {
      return tokenInfo.token_type.toUpperCase();
    }
    return 'USER'; // Default assumption
  }

  private analyzeCapabilities(permissions: string[]) {
    return {
      canCreateAds: permissions.includes('ads_management') || permissions.includes('ads_read'),
      canManagePages: permissions.includes('pages_manage_ads') || permissions.includes('pages_read_engagement'),
      canAccessInsights: permissions.includes('read_insights') || permissions.includes('ads_read'),
      canUploadMedia: permissions.includes('ads_management')
    };
  }

  private generateRecommendations(
    permissions: string[],
    adAccounts: any[],
    pages: any[],
    capabilities: any
  ): { limitations: string[]; recommendations: string[]; setupSteps: string[] } {
    const limitations: string[] = [];
    const recommendations: string[] = [];
    const setupSteps: string[] = [];

    // Check for essential permissions
    const requiredPermissions = [
      'ads_management',
      'pages_manage_ads',
      'business_management',
      'read_insights'
    ];

    const missingPermissions = requiredPermissions.filter(p => !permissions.includes(p));

    if (missingPermissions.length > 0) {
      limitations.push(`Missing permissions: ${missingPermissions.join(', ')}`);
      recommendations.push('Request additional permissions in Facebook App settings');
      setupSteps.push('Go to Facebook Developer Console → Your App → App Review → Permissions and Features');
    }

    // Check for ad accounts
    if (adAccounts.length === 0) {
      limitations.push('No advertising accounts found');
      recommendations.push('Create a Facebook Business Manager account and add advertising accounts');
      setupSteps.push('Visit business.facebook.com to create a Business Manager account');
    } else {
      const activeAccounts = adAccounts.filter(acc => acc.account_status === 1);
      if (activeAccounts.length === 0) {
        limitations.push('No active ad accounts found');
        recommendations.push('Ensure your ad accounts are active and properly funded');
      } else {
        recommendations.push(`✅ Found ${activeAccounts.length} active ad account(s) ready for automation!`);
      }
    }

    // Check for pages
    if (pages.length === 0) {
      limitations.push('No Facebook pages found');
      recommendations.push('Create Facebook pages to run ads and publish content');
      setupSteps.push('Create Facebook pages at facebook.com/pages/create');
    } else {
      recommendations.push(`✅ Found ${pages.length} Facebook page(s) for content publishing!`);
    }

    // Overall readiness assessment
    if (capabilities.canCreateAds && adAccounts.length > 0 && pages.length > 0) {
      recommendations.push('🚀 Your token is ready for NexusOne marketing automation!');
      recommendations.push('You can now create automated dropshipping campaigns');
      setupSteps.push('Save this token in NexusOne Settings → API Configuration');
      setupSteps.push('Test campaign creation with a small budget first');
    }

    // Specific feature recommendations
    if (capabilities.canCreateAds) {
      recommendations.push('✅ Can create and manage Facebook ad campaigns');
    }
    
    if (capabilities.canManagePages) {
      recommendations.push('✅ Can manage Facebook pages and post content');
    }
    
    if (capabilities.canAccessInsights) {
      recommendations.push('✅ Can access campaign performance insights');
    }

    return { limitations, recommendations, setupSteps };
  }

  /**
   * Quick validation method for integration testing
   */
  async quickValidation(accessToken: string): Promise<{
    isValid: boolean;
    canUseForMarketing: boolean;
    summary: string;
  }> {
    try {
      const analysis = await this.analyzeToken(accessToken);
      
      const canUseForMarketing = 
        analysis.isValid &&
        analysis.capabilities.canCreateAds &&
        (analysis.adAccounts?.length || 0) > 0 &&
        (analysis.pages?.length || 0) > 0;

      let summary = '';
      if (!analysis.isValid) {
        summary = 'Invalid access token';
      } else if (canUseForMarketing) {
        summary = `Ready for marketing! ${analysis.adAccounts?.length} ad accounts, ${analysis.pages?.length} pages`;
      } else {
        summary = `Limited access: ${analysis.limitations.join(', ')}`;
      }

      return {
        isValid: analysis.isValid,
        canUseForMarketing,
        summary
      };
    } catch (error) {
      return {
        isValid: false,
        canUseForMarketing: false,
        summary: 'Analysis failed'
      };
    }
  }
}

// Export singleton instance
export const facebookTokenAnalyzer = new FacebookTokenAnalyzer();