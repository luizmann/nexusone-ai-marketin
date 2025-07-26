import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for better TypeScript support
export interface Database {
  public: {
    Tables: {
      luma_generations: {
        Row: {
          id: string
          user_id: string
          prompt: string
          aspect_ratio: string
          loop: boolean
          state: 'queued' | 'dreaming' | 'completed' | 'failed'
          video_url: string | null
          thumbnail_url: string | null
          width: number | null
          height: number | null
          failure_reason: string | null
          credits_used: number
          luma_data: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          user_id: string
          prompt: string
          aspect_ratio?: string
          loop?: boolean
          state?: 'queued' | 'dreaming' | 'completed' | 'failed'
          video_url?: string | null
          thumbnail_url?: string | null
          width?: number | null
          height?: number | null
          failure_reason?: string | null
          credits_used?: number
          luma_data?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          prompt?: string
          aspect_ratio?: string
          loop?: boolean
          state?: 'queued' | 'dreaming' | 'completed' | 'failed'
          video_url?: string | null
          thumbnail_url?: string | null
          width?: number | null
          height?: number | null
          failure_reason?: string | null
          credits_used?: number
          luma_data?: any
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}