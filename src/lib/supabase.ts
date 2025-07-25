import { createClient } from '@supabase/supabase-js'
import { PRODUCTION_CONFIG } from '../config/production'

// Get configuration based on environment
const config = PRODUCTION_CONFIG

// Create Supabase client with production configuration
export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    },
    global: {
      headers: {
        'X-Client-Info': 'nexusone-ai-platform/1.0.0'
      }
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
)

// Admin client for server-side operations (use carefully)
export const supabaseAdmin = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      headers: {
        'X-Client-Info': 'nexusone-ai-platform-admin/1.0.0'
      }
    }
  }
)

// Database types
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          avatar_url: string | null
          subscription_plan: 'free' | 'pro' | 'premium'
          role: 'user' | 'admin'
          credits: number
          language: string
          timezone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_plan?: 'free' | 'pro' | 'premium'
          role?: 'user' | 'admin'
          credits?: number
          language?: string
          timezone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_plan?: 'free' | 'pro' | 'premium'
          role?: 'user' | 'admin'
          credits?: number
          language?: string
          timezone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_credits: {
        Row: {
          id: string
          user_id: string
          credits_used: number
          credits_earned: number
          transaction_type: 'purchase' | 'usage' | 'refund' | 'bonus'
          description: string | null
          metadata: any
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          credits_used?: number
          credits_earned?: number
          transaction_type: 'purchase' | 'usage' | 'refund' | 'bonus'
          description?: string | null
          metadata?: any
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          credits_used?: number
          credits_earned?: number
          transaction_type?: 'purchase' | 'usage' | 'refund' | 'bonus'
          description?: string | null
          metadata?: any
          created_at?: string
        }
      }
      magic_pages: {
        Row: {
          id: string
          user_id: string
          title: string
          content: any
          template_name: string
          is_published: boolean
          custom_domain: string | null
          seo_title: string | null
          seo_description: string | null
          analytics_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          content: any
          template_name: string
          is_published?: boolean
          custom_domain?: string | null
          seo_title?: string | null
          seo_description?: string | null
          analytics_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          content?: any
          template_name?: string
          is_published?: boolean
          custom_domain?: string | null
          seo_title?: string | null
          seo_description?: string | null
          analytics_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      dropshipping_products: {
        Row: {
          id: string
          user_id: string | null
          external_id: string
          title: string
          description: string
          price: number
          sale_price: number | null
          currency: string
          category: string
          subcategory: string | null
          images: string[]
          variants: any[]
          supplier: string
          supplier_url: string | null
          shipping_info: any
          is_active: boolean
          stock_quantity: number | null
          commission_rate: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          external_id: string
          title: string
          description: string
          price: number
          sale_price?: number | null
          currency?: string
          category: string
          subcategory?: string | null
          images?: string[]
          variants?: any[]
          supplier: string
          supplier_url?: string | null
          shipping_info?: any
          is_active?: boolean
          stock_quantity?: number | null
          commission_rate?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          external_id?: string
          title?: string
          description?: string
          price?: number
          sale_price?: number | null
          currency?: string
          category?: string
          subcategory?: string | null
          images?: string[]
          variants?: any[]
          supplier?: string
          supplier_url?: string | null
          shipping_info?: any
          is_active?: boolean
          stock_quantity?: number | null
          commission_rate?: number
          created_at?: string
          updated_at?: string
        }
      }
      sales: {
        Row: {
          id: string
          user_id: string
          product_id: string
          customer_email: string
          customer_name: string | null
          quantity: number
          unit_price: number
          total_amount: number
          commission_amount: number
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          payment_method: string | null
          shipping_address: any
          tracking_number: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          customer_email: string
          customer_name?: string | null
          quantity: number
          unit_price: number
          total_amount: number
          commission_amount: number
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          payment_method?: string | null
          shipping_address?: any
          tracking_number?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          customer_email?: string
          customer_name?: string | null
          quantity?: number
          unit_price?: number
          total_amount?: number
          commission_amount?: number
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          payment_method?: string | null
          shipping_address?: any
          tracking_number?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_system_health: {
        Args: {}
        Returns: any
      }
      log_api_usage: {
        Args: {
          p_endpoint: string
          p_method: string
          p_status_code: number
          p_response_time_ms: number
          p_credits_consumed?: number
        }
        Returns: undefined
      }
      log_error: {
        Args: {
          p_error_type: string
          p_error_message: string
          p_stack_trace?: string
          p_function_name?: string
          p_severity?: string
        }
        Returns: undefined
      }
      track_feature_usage: {
        Args: {
          p_feature_name: string
          p_usage_type: string
          p_metadata?: any
        }
        Returns: undefined
      }
    }
    Enums: {
      subscription_plan: 'free' | 'pro' | 'premium'
      user_role: 'user' | 'admin'
      transaction_type: 'purchase' | 'usage' | 'refund' | 'bonus'
      sale_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
    }
  }
}

// Utility functions for production
export const logApiUsage = async (
  endpoint: string,
  method: string,
  statusCode: number,
  responseTime: number,
  creditsConsumed = 0
) => {
  try {
    await supabase.rpc('log_api_usage', {
      p_endpoint: endpoint,
      p_method: method,
      p_status_code: statusCode,
      p_response_time_ms: responseTime,
      p_credits_consumed: creditsConsumed
    })
  } catch (error) {
    console.error('Failed to log API usage:', error)
  }
}

export const logError = async (
  errorType: string,
  errorMessage: string,
  stackTrace?: string,
  functionName?: string,
  severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
) => {
  try {
    await supabase.rpc('log_error', {
      p_error_type: errorType,
      p_error_message: errorMessage,
      p_stack_trace: stackTrace,
      p_function_name: functionName,
      p_severity: severity
    })
  } catch (error) {
    console.error('Failed to log error:', error)
  }
}

export const trackFeatureUsage = async (
  featureName: string,
  usageType: 'click' | 'view' | 'completion' | 'error',
  metadata: any = {}
) => {
  try {
    await supabase.rpc('track_feature_usage', {
      p_feature_name: featureName,
      p_usage_type: usageType,
      p_metadata: metadata
    })
  } catch (error) {
    console.error('Failed to track feature usage:', error)
  }
}

export const getSystemHealth = async () => {
  try {
    const { data, error } = await supabase.rpc('get_system_health')
    if (error) throw error
    return data
  } catch (error) {
    console.error('Failed to get system health:', error)
    return null
  }
}

// Mock Supabase client for testing (prevents real API calls during development)
export const mockSupabase = {
  functions: {
    invoke: async (functionName: string, options?: any) => {
      console.log(`Mock: Invoking function ${functionName} with options:`, options)
      
      // Mock responses for different functions
      if (functionName === 'ai-content-generation') {
        return {
          data: {
            success: true,
            stepId: options?.body?.stepId || 'unknown',
            content: `Mock generated content for step: ${options?.body?.stepId}`,
            metadata: { 
              creditsUsed: 5,
              generatedAt: new Date().toISOString(),
              language: options?.body?.language || 'en'
            }
          },
          error: null
        }
      }
      
      if (functionName === 'cj-dropshipping-catalog') {
        return {
          data: {
            success: true,
            products: [],
            totalCount: 0,
            message: 'Mock CJ API response'
          },
          error: null
        }
      }
      
      return {
        data: { success: true, message: `Mock response for ${functionName}` },
        error: null
      }
    }
  },
  from: (table: string) => ({
    select: () => ({
      eq: () => ({ data: [], error: null }),
      order: () => ({ data: [], error: null }),
      limit: () => ({ data: [], error: null })
    }),
    insert: () => ({ data: null, error: null }),
    update: () => ({ data: null, error: null }),
    delete: () => ({ data: null, error: null })
  }),
  rpc: async (functionName: string, params?: any) => {
    console.log(`Mock RPC: ${functionName}`, params)
    return { data: null, error: null }
  }
}

// Export configuration for use in components
export { config as productionConfig }
export type { Database }