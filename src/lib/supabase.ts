import { createClient } from '@supabase/supabase-js'

// Production Supabase configuration
const supabaseUrl = 'https://hbfgtdxvlbkvkrjqxnac.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiZmd0ZHh2bGJrdmtyanh4bmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ2NzI4MDAsImV4cCI6MjAyMDI0ODgwMH0.XYKhOW-Q5kz9O2P7vX1cFm3d8jR6sN0tA9wK4eL7mGp'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      'X-Client-Info': 'nexusone-ai-platform'
    }
  }
})

// Export configuration constants
export const SUPABASE_URL = supabaseUrl
export const FUNCTIONS_URL = `${supabaseUrl}/functions/v1`

// Database type definitions
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name?: string
          avatar_url?: string
          plan: 'free' | 'pro' | 'premium'
          credits: number
          video_quota: number
          created_at: string
          updated_at: string
          subscription_expires_at?: string
          is_active: boolean
          total_spent: number
          referral_code?: string
          referred_by?: string
          language_preference: string
          timezone: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string
          avatar_url?: string
          plan?: 'free' | 'pro' | 'premium'
          credits?: number
          video_quota?: number
          subscription_expires_at?: string
          is_active?: boolean
          total_spent?: number
          referral_code?: string
          referred_by?: string
          language_preference?: string
          timezone?: string
        }
        Update: {
          email?: string
          full_name?: string
          avatar_url?: string
          plan?: 'free' | 'pro' | 'premium'
          credits?: number
          video_quota?: number
          subscription_expires_at?: string
          is_active?: boolean
          total_spent?: number
          language_preference?: string
          timezone?: string
        }
      }
      landing_pages: {
        Row: {
          id: string
          user_id: string
          title: string
          slug: string
          content: any
          template_id?: string
          is_published: boolean
          created_at: string
          updated_at: string
          views: number
          conversions: number
          meta_title?: string
          meta_description?: string
          custom_domain?: string
          seo_settings: any
        }
        Insert: {
          user_id: string
          title: string
          slug: string
          content: any
          template_id?: string
          is_published?: boolean
          meta_title?: string
          meta_description?: string
          custom_domain?: string
          seo_settings?: any
        }
        Update: {
          title?: string
          slug?: string
          content?: any
          template_id?: string
          is_published?: boolean
          meta_title?: string
          meta_description?: string
          custom_domain?: string
          seo_settings?: any
        }
      }
      generated_videos: {
        Row: {
          id: string
          user_id: string
          title: string
          prompt: string
          video_url?: string
          thumbnail_url?: string
          duration?: number
          status: string
          created_at: string
          updated_at: string
          provider: string
          metadata: any
        }
        Insert: {
          user_id: string
          title: string
          prompt: string
          video_url?: string
          thumbnail_url?: string
          duration?: number
          status?: string
          provider?: string
          metadata?: any
        }
        Update: {
          title?: string
          video_url?: string
          thumbnail_url?: string
          duration?: number
          status?: string
          metadata?: any
        }
      }
      ai_agents: {
        Row: {
          id: string
          user_id: string
          name: string
          description?: string
          personality?: string
          knowledge_base?: string
          instructions?: string
          avatar_url?: string
          is_active: boolean
          created_at: string
          updated_at: string
          conversation_count: number
          last_used_at?: string
        }
        Insert: {
          user_id: string
          name: string
          description?: string
          personality?: string
          knowledge_base?: string
          instructions?: string
          avatar_url?: string
          is_active?: boolean
        }
        Update: {
          name?: string
          description?: string
          personality?: string
          knowledge_base?: string
          instructions?: string
          avatar_url?: string
          is_active?: boolean
        }
      }
      whatsapp_integrations: {
        Row: {
          id: string
          user_id: string
          phone_number: string
          display_name?: string
          access_token?: string
          webhook_url?: string
          is_verified: boolean
          is_active: boolean
          created_at: string
          updated_at: string
          auto_reply_enabled: boolean
          auto_reply_message?: string
          business_hours: any
        }
        Insert: {
          user_id: string
          phone_number: string
          display_name?: string
          access_token?: string
          webhook_url?: string
          is_verified?: boolean
          is_active?: boolean
          auto_reply_enabled?: boolean
          auto_reply_message?: string
          business_hours?: any
        }
        Update: {
          display_name?: string
          access_token?: string
          webhook_url?: string
          is_verified?: boolean
          is_active?: boolean
          auto_reply_enabled?: boolean
          auto_reply_message?: string
          business_hours?: any
        }
      }
      leads: {
        Row: {
          id: string
          user_id: string
          name: string
          email?: string
          phone?: string
          company?: string
          source?: string
          status: string
          score: number
          notes?: string
          created_at: string
          updated_at: string
          last_contacted_at?: string
          converted_at?: string
          tags: string[]
          custom_fields: any
        }
        Insert: {
          user_id: string
          name: string
          email?: string
          phone?: string
          company?: string
          source?: string
          status?: string
          score?: number
          notes?: string
          tags?: string[]
          custom_fields?: any
        }
        Update: {
          name?: string
          email?: string
          phone?: string
          company?: string
          source?: string
          status?: string
          score?: number
          notes?: string
          last_contacted_at?: string
          converted_at?: string
          tags?: string[]
          custom_fields?: any
        }
      }
      dropshipping_products: {
        Row: {
          id: string
          user_id: string
          product_id: string
          name: string
          description?: string
          price: number
          sale_price?: number
          images: string[]
          category?: string
          supplier: string
          sku?: string
          is_active: boolean
          created_at: string
          updated_at: string
          commission_rate: number
          sales_count: number
          product_data: any
        }
        Insert: {
          user_id: string
          product_id: string
          name: string
          description?: string
          price: number
          sale_price?: number
          images?: string[]
          category?: string
          supplier?: string
          sku?: string
          is_active?: boolean
          commission_rate?: number
          product_data?: any
        }
        Update: {
          name?: string
          description?: string
          price?: number
          sale_price?: number
          images?: string[]
          category?: string
          sku?: string
          is_active?: boolean
          commission_rate?: number
          sales_count?: number
          product_data?: any
        }
      }
    }
    Functions: {
      deduct_user_credits: {
        Args: { user_id: string; amount: number }
        Returns: boolean
      }
      add_user_credits: {
        Args: { user_id: string; amount: number; transaction_type?: string }
        Returns: void
      }
      get_user_limits: {
        Args: { user_id: string }
        Returns: any
      }
      track_page_view: {
        Args: { page_id: string }
        Returns: void
      }
      track_conversion: {
        Args: { page_id: string }
        Returns: void
      }
    }
  }
}