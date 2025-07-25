/**
 * Backend Services for Integration Management
 * 
 * This file contains service classes for managing integrations,
 * handling business logic, and coordinating between frontend and APIs.
 */

import { createClient } from '@supabase/supabase-js'
import { createCJDropshippingService } from '../integrations/cj-dropshipping'
import { createWhatsAppBusinessService } from '../integrations/whatsapp-business'

export class IntegrationService {
  private supabase: any

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_KEY || ''
    )
  }

  /**
   * Initialize user integrations
   */
  async initializeUserIntegrations(userId: string): Promise<void> {
    try {
      // Create default integration settings
      const defaultIntegrations = [
        {
          user_id: userId,
          integration_type: 'cj_dropshipping',
          configuration: {
            autoSync: false,
            importLimit: 50,
            notifications: true
          },
          credentials: {},
          is_active: false
        },
        {
          user_id: userId,
          integration_type: 'whatsapp_business',
          configuration: {
            autoRespond: false,
            businessHours: {
              enabled: false,
              start: '09:00',
              end: '18:00'
            },
            appointmentBooking: false
          },
          credentials: {},
          is_active: false
        }
      ]

      for (const integration of defaultIntegrations) {
        await this.supabase
          .from('user_integration_settings')
          .upsert(integration)
      }
    } catch (error) {
      console.error('Initialize user integrations error:', error)
      throw error
    }
  }

  /**
   * Get user integration settings
   */
  async getUserIntegrationSettings(userId: string, integrationType?: string): Promise<any[]> {
    try {
      let query = this.supabase
        .from('user_integration_settings')
        .select('*')
        .eq('user_id', userId)

      if (integrationType) {
        query = query.eq('integration_type', integrationType)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Get user integration settings error:', error)
      throw error
    }
  }

  /**
   * Update integration settings
   */
  async updateIntegrationSettings(
    userId: string,
    integrationType: string,
    configuration: any,
    credentials?: any
  ): Promise<void> {
    try {
      const updateData: any = {
        user_id: userId,
        integration_type: integrationType,
        configuration: configuration,
        is_active: true,
        updated_at: new Date().toISOString()
      }

      if (credentials) {
        updateData.credentials = credentials
      }

      await this.supabase
        .from('user_integration_settings')
        .upsert(updateData)
    } catch (error) {
      console.error('Update integration settings error:', error)
      throw error
    }
  }

  /**
   * Test integration connection
   */
  async testIntegrationConnection(userId: string, integrationType: string): Promise<{ success: boolean; message: string }> {
    try {
      const settings = await this.getUserIntegrationSettings(userId, integrationType)
      
      if (!settings.length) {
        return { success: false, message: 'Integration not configured' }
      }

      const setting = settings[0]

      switch (integrationType) {
        case 'cj_dropshipping':
          return await this.testCJDropshippingConnection(setting.credentials)
        
        case 'whatsapp_business':
          return await this.testWhatsAppConnection(setting.credentials)
        
        default:
          return { success: false, message: 'Unknown integration type' }
      }
    } catch (error) {
      console.error('Test integration connection error:', error)
      return { success: false, message: error.message }
    }
  }

  /**
   * Test CJ Dropshipping connection
   */
  private async testCJDropshippingConnection(credentials: any): Promise<{ success: boolean; message: string }> {
    try {
      const cjService = createCJDropshippingService({
        accessToken: credentials.accessToken || '',
        email: credentials.email || '',
        password: credentials.password || ''
      })

      await cjService.authenticate()
      
      // Try to fetch one product to test connection
      const result = await cjService.getProducts({ pageSize: 1 })
      
      return { 
        success: true, 
        message: `Connected successfully. Found ${result.total} products available.` 
      }
    } catch (error) {
      return { 
        success: false, 
        message: `Connection failed: ${error.message}` 
      }
    }
  }

  /**
   * Test WhatsApp Business connection
   */
  private async testWhatsAppConnection(credentials: any): Promise<{ success: boolean; message: string }> {
    try {
      // Test by verifying phone number ID
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${credentials.phoneNumberId}`,
        {
          headers: {
            'Authorization': `Bearer ${credentials.accessToken}`
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        return { 
          success: true, 
          message: `Connected successfully to ${data.display_phone_number}` 
        }
      } else {
        return { 
          success: false, 
          message: 'Failed to verify WhatsApp Business account' 
        }
      }
    } catch (error) {
      return { 
        success: false, 
        message: `Connection failed: ${error.message}` 
      }
    }
  }

  /**
   * Get integration analytics
   */
  async getIntegrationAnalytics(
    userId: string,
    integrationType?: string,
    startDate?: string,
    endDate?: string
  ): Promise<any> {
    try {
      let query = this.supabase
        .from('integration_analytics')
        .select('*')
        .eq('user_id', userId)

      if (integrationType) {
        query = query.eq('integration_type', integrationType)
      }

      if (startDate) {
        query = query.gte('created_at', startDate)
      }

      if (endDate) {
        query = query.lte('created_at', endDate)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error

      // Calculate summary statistics
      const summary = {
        totalOperations: data.length,
        successfulOperations: data.filter(d => d.status === 'success').length,
        failedOperations: data.filter(d => d.status === 'error').length,
        totalCreditsUsed: data.reduce((sum, d) => sum + (d.cost_credits || 0), 0),
        averageExecutionTime: data.length > 0 
          ? data.reduce((sum, d) => sum + (d.execution_time || 0), 0) / data.length 
          : 0,
        operationsByType: this.groupByField(data, 'operation'),
        dailyUsage: this.groupByDate(data)
      }

      return {
        summary,
        operations: data
      }
    } catch (error) {
      console.error('Get integration analytics error:', error)
      throw error
    }
  }

  /**
   * Log integration usage
   */
  async logIntegrationUsage(
    userId: string,
    integrationType: string,
    operation: string,
    status: 'success' | 'error' | 'timeout',
    executionTime?: number,
    costCredits?: number,
    metadata?: any
  ): Promise<void> {
    try {
      await this.supabase
        .from('integration_analytics')
        .insert({
          user_id: userId,
          integration_type: integrationType,
          operation: operation,
          status: status,
          execution_time: executionTime,
          cost_credits: costCredits || 0,
          metadata: metadata || {}
        })
    } catch (error) {
      console.error('Log integration usage error:', error)
    }
  }

  /**
   * Get user's dropshipping products
   */
  async getUserDropshippingProducts(userId: string, filters?: {
    category?: string
    search?: string
    priceMin?: number
    priceMax?: number
    limit?: number
    offset?: number
  }): Promise<{ products: any[]; total: number }> {
    try {
      let query = this.supabase
        .from('dropshipping_catalog')
        .select('*', { count: 'exact' })
        .eq('is_active', true)

      if (filters?.category) {
        query = query.eq('category', filters.category)
      }

      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      if (filters?.priceMin) {
        query = query.gte('price', filters.priceMin)
      }

      if (filters?.priceMax) {
        query = query.lte('price', filters.priceMax)
      }

      if (filters?.limit) {
        query = query.limit(filters.limit)
      }

      if (filters?.offset) {
        query = query.range(filters.offset, (filters.offset + (filters.limit || 20)) - 1)
      }

      const { data, error, count } = await query.order('created_at', { ascending: false })

      if (error) throw error

      return {
        products: data || [],
        total: count || 0
      }
    } catch (error) {
      console.error('Get user dropshipping products error:', error)
      throw error
    }
  }

  /**
   * Get user's WhatsApp business configurations
   */
  async getUserWhatsAppConfigs(userId: string): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from('whatsapp_business_config')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Get user WhatsApp configs error:', error)
      throw error
    }
  }

  /**
   * Get WhatsApp messages for user
   */
  async getUserWhatsAppMessages(
    userId: string,
    phoneNumberId?: string,
    limit: number = 50
  ): Promise<any[]> {
    try {
      // First get user's phone number IDs
      const { data: configs } = await this.supabase
        .from('whatsapp_business_config')
        .select('phone_number_id')
        .eq('user_id', userId)
        .eq('is_active', true)

      if (!configs?.length) return []

      const phoneNumberIds = configs.map(c => c.phone_number_id)

      let query = this.supabase
        .from('whatsapp_messages')
        .select('*')
        .in('phone_number_id', phoneNumberIds)

      if (phoneNumberId) {
        query = query.eq('phone_number_id', phoneNumberId)
      }

      const { data, error } = await query
        .order('timestamp', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Get user WhatsApp messages error:', error)
      throw error
    }
  }

  /**
   * Get user's appointments
   */
  async getUserAppointments(
    userId: string,
    status?: string,
    startDate?: string,
    endDate?: string
  ): Promise<any[]> {
    try {
      // Get user's business IDs
      const { data: businesses } = await this.supabase
        .from('whatsapp_business_config')
        .select('id')
        .eq('user_id', userId)
        .eq('is_active', true)

      if (!businesses?.length) return []

      const businessIds = businesses.map(b => b.id)

      let query = this.supabase
        .from('whatsapp_appointments')
        .select(`
          *,
          business:whatsapp_business_config(business_name)
        `)
        .in('business_id', businessIds)

      if (status) {
        query = query.eq('status', status)
      }

      if (startDate) {
        query = query.gte('appointment_date', startDate)
      }

      if (endDate) {
        query = query.lte('appointment_date', endDate)
      }

      const { data, error } = await query.order('appointment_date', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Get user appointments error:', error)
      throw error
    }
  }

  /**
   * Create campaign from dropshipping product
   */
  async createDropshippingCampaign(
    userId: string,
    productId: string,
    campaignData: {
      name: string
      targetAudience: any
      budget: number
      duration: number
      platforms: string[]
    }
  ): Promise<{ success: boolean; campaignId?: string; message: string }> {
    try {
      // Get product details
      const { data: product, error: productError } = await this.supabase
        .from('dropshipping_catalog')
        .select('*')
        .eq('id', productId)
        .single()

      if (productError || !product) {
        return { success: false, message: 'Product not found' }
      }

      // Create campaign record
      const { data: campaign, error: campaignError } = await this.supabase
        .from('marketing_campaigns')
        .insert({
          user_id: userId,
          name: campaignData.name,
          type: 'dropshipping',
          product_id: productId,
          target_audience: campaignData.targetAudience,
          budget: campaignData.budget,
          duration: campaignData.duration,
          platforms: campaignData.platforms,
          status: 'draft',
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (campaignError) {
        return { success: false, message: 'Failed to create campaign' }
      }

      // Generate marketing assets using AI
      await this.generateMarketingAssets(userId, campaign.id, product)

      return { 
        success: true, 
        campaignId: campaign.id,
        message: 'Campaign created successfully' 
      }
    } catch (error) {
      console.error('Create dropshipping campaign error:', error)
      return { success: false, message: error.message }
    }
  }

  /**
   * Generate marketing assets for campaign
   */
  private async generateMarketingAssets(userId: string, campaignId: string, product: any): Promise<void> {
    try {
      // Generate landing page
      const landingPagePrompt = `Create a high-converting landing page for this product:
        Product: ${product.name}
        Price: $${product.price}
        Description: ${product.description}
        
        Generate HTML content for a modern, mobile-responsive landing page with:
        - Hero section with product image
        - Benefits and features
        - Social proof
        - Clear call-to-action
        - Urgency elements`

      // Generate Facebook Ad copy
      const adCopyPrompt = `Create compelling Facebook ad copy for this product:
        Product: ${product.name}
        Price: $${product.price}
        Target audience: interested in ${product.category}
        
        Generate:
        - Primary text (125 characters)
        - Headline (40 characters)
        - Description (30 characters)
        - Call-to-action button text`

      // Generate video script
      const videoScriptPrompt = `Create a 30-second video script for this product:
        Product: ${product.name}
        Key benefits: ${product.description}
        
        Include:
        - Hook (first 3 seconds)
        - Problem identification
        - Solution presentation
        - Call-to-action`

      // Use AI service to generate content
      // This would integrate with OpenAI or other AI services
      // For now, we'll store placeholder data

      await this.supabase
        .from('campaign_assets')
        .insert([
          {
            campaign_id: campaignId,
            asset_type: 'landing_page',
            content: 'Generated landing page content',
            status: 'generated'
          },
          {
            campaign_id: campaignId,
            asset_type: 'ad_copy',
            content: 'Generated ad copy',
            status: 'generated'
          },
          {
            campaign_id: campaignId,
            asset_type: 'video_script',
            content: 'Generated video script',
            status: 'generated'
          }
        ])

      // Log the operation
      await this.logIntegrationUsage(
        userId,
        'campaign_generator',
        'generate_assets',
        'success',
        undefined,
        25, // Cost in credits
        { productId: product.id, campaignId }
      )
    } catch (error) {
      console.error('Generate marketing assets error:', error)
      throw error
    }
  }

  // Helper methods
  private groupByField(data: any[], field: string): Record<string, number> {
    return data.reduce((acc, item) => {
      const key = item[field] || 'unknown'
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})
  }

  private groupByDate(data: any[]): Record<string, number> {
    return data.reduce((acc, item) => {
      const date = new Date(item.created_at).toISOString().split('T')[0]
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {})
  }
}

// Export singleton instance
export const integrationService = new IntegrationService()