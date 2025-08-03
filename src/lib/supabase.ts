import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          email: string;
          full_name: string | null;
          plan: 'free' | 'pro' | 'premium';
          credits: number;
          video_quota: number;
          whatsapp_numbers: number;
          created_at: string;
          updated_at: string;
        };
      };
      campaigns: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: string;
          status: 'draft' | 'active' | 'paused' | 'completed';
          config: any;
          metrics: any;
          created_at: string;
          updated_at: string;
        };
      };
      magic_pages: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          slug: string;
          content: any;
          product_url: string | null;
          views: number;
          conversions: number;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      videos: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          type: string;
          status: 'generating' | 'completed' | 'failed';
          url: string | null;
          config: any;
          created_at: string;
          updated_at: string;
        };
      };
      whatsapp_sessions: {
        Row: {
          id: string;
          user_id: string;
          phone_number: string;
          session_data: any;
          status: 'connected' | 'disconnected';
          created_at: string;
          updated_at: string;
        };
      };
      dropshipping_products: {
        Row: {
          id: string;
          user_id: string;
          cj_product_id: string;
          title: string;
          description: string;
          price: number;
          images: string[];
          category: string;
          status: 'active' | 'inactive';
          created_at: string;
          updated_at: string;
        };
      };
      api_configurations: {
        Row: {
          id: string;
          user_id: string;
          service: string;
          api_key: string;
          config: any;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      usage_logs: {
        Row: {
          id: string;
          user_id: string;
          action: string;
          credits_used: number;
          metadata: any;
          created_at: string;
        };
      };
    };
  };
}

// API Service classes for organized API calls
export class APIService {
  // OpenAI/NexBrain Integration
  static async generateWithNexBrain(prompt: string, context?: any) {
    try {
      const { data, error } = await supabase.functions.invoke('nexbrain-chat', {
        body: { prompt, context }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('NexBrain API Error:', error);
      throw error;
    }
  }

  // Magic Pages Generation
  static async generateMagicPage(productUrl: string, config?: any) {
    try {
      const { data, error } = await supabase.functions.invoke('generate-magic-page', {
        body: { productUrl, config }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Magic Page Generation Error:', error);
      throw error;
    }
  }

  // Video Generation (Luma AI)
  static async generateVideo(config: any) {
    try {
      const { data, error } = await supabase.functions.invoke('generate-video', {
        body: { config }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Video Generation Error:', error);
      throw error;
    }
  }

  // Facebook Ads Creation
  static async createFacebookCampaign(campaignData: any) {
    try {
      const { data, error } = await supabase.functions.invoke('create-facebook-campaign', {
        body: campaignData
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Facebook Campaign Error:', error);
      throw error;
    }
  }

  // WhatsApp Integration
  static async connectWhatsApp(config: any) {
    try {
      const { data, error } = await supabase.functions.invoke('connect-whatsapp', {
        body: config
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('WhatsApp Connection Error:', error);
      throw error;
    }
  }

  // CJ Dropshipping
  static async fetchCJProducts(filters?: any) {
    try {
      const { data, error } = await supabase.functions.invoke('cj-dropshipping-catalog', {
        body: { filters }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('CJ Dropshipping Error:', error);
      throw error;
    }
  }

  // Credit Management
  static async deductCredits(amount: number, action: string) {
    try {
      const { data, error } = await supabase.functions.invoke('deduct-credits', {
        body: { amount, action }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Credit Deduction Error:', error);
      throw error;
    }
  }

  // Analytics
  static async getAnalytics(timeframe: string = '30d') {
    try {
      const { data, error } = await supabase.functions.invoke('get-analytics', {
        body: { timeframe }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Analytics Error:', error);
      throw error;
    }
  }
}

// Real-time subscriptions helper
export function subscribeToUserData(userId: string, callback: (payload: any) => void) {
  return supabase
    .channel('user-data')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      filter: `user_id=eq.${userId}` 
    }, callback)
    .subscribe();
}

// Helper function to check if user has sufficient credits
export async function checkCredits(requiredAmount: number): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('credits')
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    return data.credits >= requiredAmount;
  } catch (error) {
    console.error('Credit Check Error:', error);
    return false;
  }
}

// Helper function to get user's current plan limits
export async function getPlanLimits(): Promise<any> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('plan, credits, video_quota, whatsapp_numbers')
      .eq('user_id', user.id)
      .single();

    if (error) throw error;

    const planLimits = {
      free: { 
        campaigns: 3, 
        videos: 2, 
        pages: 2, 
        whatsapp: 1, 
        credits: 50 
      },
      pro: { 
        campaigns: 30, 
        videos: 20, 
        pages: 20, 
        whatsapp: 5, 
        credits: 500 
      },
      premium: { 
        campaigns: -1, // unlimited
        videos: 100, 
        pages: -1, // unlimited
        whatsapp: 20, 
        credits: 2000 
      }
    };

    return {
      ...planLimits[data.plan as keyof typeof planLimits],
      current: data
    };
  } catch (error) {
    console.error('Plan Limits Error:', error);
    return null;
  }
}