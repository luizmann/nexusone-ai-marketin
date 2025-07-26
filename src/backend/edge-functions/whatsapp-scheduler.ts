/**
 * WhatsApp Scheduler Service
 * Processes scheduled messages and follow-ups
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../utils/cors.ts'

class WhatsAppScheduler {
  private supabase: any
  private gupshupApiKey: string

  constructor() {
    this.supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_ANON_KEY') || ''
    )
    this.gupshupApiKey = Deno.env.get('GUPSHUP_API_KEY') || ''
  }

  async processScheduledMessages(): Promise<void> {
    try {
      // Get all pending messages that are due
      const { data: messages, error } = await this.supabase
        .from('scheduled_messages')
        .select('*')
        .eq('status', 'pending')
        .lte('scheduled_for', new Date().toISOString())
        .limit(100)

      if (error) {
        console.error('Error fetching scheduled messages:', error)
        return
      }

      console.log(`Processing ${messages.length} scheduled messages`)

      for (const message of messages) {
        await this.sendScheduledMessage(message)
      }

    } catch (error) {
      console.error('Error processing scheduled messages:', error)
    }
  }

  async sendScheduledMessage(message: any): Promise<void> {
    try {
      // Get user's GupShup configuration
      const { data: config } = await this.supabase
        .from('gupshup_configurations')
        .select('*')
        .eq('user_id', message.user_id)
        .single()

      if (!config || !config.active) {
        console.log(`Skipping message for inactive user: ${message.user_id}`)
        await this.markMessageFailed(message.id, 'User configuration inactive')
        return
      }

      // Send via GupShup API
      const response = await fetch('https://api.gupshup.io/sm/api/v1/msg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'apikey': config.api_key
        },
        body: new URLSearchParams({
          channel: 'whatsapp',
          source: config.source_number,
          destination: message.phone_number,
          'src.name': config.app_name,
          message: typeof message.message === 'string' ? message.message : JSON.stringify(message.message)
        })
      })

      const result = await response.json()

      if (result.status === 'submitted') {
        await this.markMessageSent(message.id, result.messageId)
        console.log(`Message sent successfully to ${message.phone_number}`)
      } else {
        await this.markMessageFailed(message.id, result.message || 'Unknown error')
        console.error(`Failed to send message to ${message.phone_number}:`, result)
      }

    } catch (error) {
      console.error(`Error sending scheduled message ${message.id}:`, error)
      await this.markMessageFailed(message.id, error.message)
    }
  }

  async markMessageSent(messageId: string, gupshupMessageId?: string): Promise<void> {
    await this.supabase
      .from('scheduled_messages')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
        gupshup_message_id: gupshupMessageId
      })
      .eq('id', messageId)
  }

  async markMessageFailed(messageId: string, errorMessage: string): Promise<void> {
    await this.supabase
      .from('scheduled_messages')
      .update({
        status: 'failed',
        error_message: errorMessage
      })
      .eq('id', messageId)
  }

  async generateFollowUpSequences(): Promise<void> {
    try {
      // Get conversations that need follow-up
      const { data: conversations, error } = await this.supabase
        .from('whatsapp_conversations')
        .select('*')
        .in('stage', ['qualification', 'presentation', 'objection'])
        .gte('conversion_probability', 30)
        .lt('last_activity', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()) // 24 hours ago

      if (error) {
        console.error('Error fetching conversations for follow-up:', error)
        return
      }

      for (const conversation of conversations) {
        await this.scheduleFollowUp(conversation)
      }

    } catch (error) {
      console.error('Error generating follow-up sequences:', error)
    }
  }

  async scheduleFollowUp(conversation: any): Promise<void> {
    try {
      // Check if there's already a pending follow-up
      const { data: existing } = await this.supabase
        .from('scheduled_messages')
        .select('*')
        .eq('phone_number', conversation.phone_number)
        .eq('status', 'pending')
        .single()

      if (existing) {
        console.log(`Follow-up already scheduled for ${conversation.phone_number}`)
        return
      }

      // Generate follow-up message based on conversation context
      const followUpMessage = this.generateContextualFollowUp(conversation)
      
      // Calculate optimal timing
      const scheduleTime = this.calculateOptimalTiming(conversation)

      // Schedule the message
      await this.supabase
        .from('scheduled_messages')
        .insert({
          user_id: conversation.user_id,
          phone_number: conversation.phone_number,
          message: followUpMessage,
          scheduled_for: scheduleTime.toISOString()
        })

      console.log(`Follow-up scheduled for ${conversation.phone_number} at ${scheduleTime}`)

    } catch (error) {
      console.error(`Error scheduling follow-up for ${conversation.phone_number}:`, error)
    }
  }

  generateContextualFollowUp(conversation: any): any {
    const { stage, conversion_probability, urgency_level, pain_points } = conversation

    if (conversion_probability > 70) {
      // High probability - direct approach
      return {
        type: 'text',
        text: '🔥 Oi! Ainda tem interesse na solução que conversamos? Preparei uma proposta especial que expira hoje! Posso enviar agora?'
      }
    } else if (conversion_probability > 50) {
      // Medium probability - value reinforcement
      return {
        type: 'text',
        text: '💡 Lembrei de você! Acabei de ver um case de sucesso que combina exatamente com seu perfil. Cliente aumentou vendas em 250%! Quer ver?'
      }
    } else if (stage === 'qualification') {
      // Still qualifying - educational approach
      return {
        type: 'text',
        text: '📚 Preparei um material gratuito sobre automação de vendas que pode te ajudar! São 5 estratégias comprovadas. Quer receber?'
      }
    } else {
      // General follow-up
      return {
        type: 'text',
        text: '👋 Como estão os resultados por aí? Lembrei da nossa conversa e tenho algumas ideias que podem te ajudar!'
      }
    }
  }

  calculateOptimalTiming(conversation: any): Date {
    const now = new Date()
    const { urgency_level, conversion_probability, stage } = conversation

    let hoursToAdd = 24 // default 24 hours

    // Adjust based on urgency
    if (urgency_level === 'high') {
      hoursToAdd = 4 // 4 hours for high urgency
    } else if (urgency_level === 'medium') {
      hoursToAdd = 12 // 12 hours for medium urgency
    }

    // Adjust based on conversion probability
    if (conversion_probability > 80) {
      hoursToAdd = Math.min(hoursToAdd, 2) // Max 2 hours for very hot leads
    } else if (conversion_probability > 60) {
      hoursToAdd = Math.min(hoursToAdd, 6) // Max 6 hours for hot leads
    }

    // Adjust based on stage
    if (stage === 'closing') {
      hoursToAdd = Math.min(hoursToAdd, 3) // Quick follow-up for closing stage
    }

    // Ensure it's during business hours (9 AM - 6 PM)
    const followUpTime = new Date(now.getTime() + hoursToAdd * 60 * 60 * 1000)
    const hour = followUpTime.getHours()

    if (hour < 9) {
      followUpTime.setHours(9, 0, 0, 0)
    } else if (hour > 18) {
      followUpTime.setDate(followUpTime.getDate() + 1)
      followUpTime.setHours(9, 0, 0, 0)
    }

    return followUpTime
  }

  async updateDailyLimits(): Promise<void> {
    try {
      // Reset daily message counts
      const today = new Date().toISOString().split('T')[0]
      
      await this.supabase
        .from('gupshup_configurations')
        .update({
          current_daily_count: 0,
          last_reset_date: today
        })
        .neq('last_reset_date', today)

      console.log('Daily limits updated')

    } catch (error) {
      console.error('Error updating daily limits:', error)
    }
  }

  async cleanupOldData(): Promise<void> {
    try {
      // Delete failed messages older than 7 days
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      
      await this.supabase
        .from('scheduled_messages')
        .delete()
        .eq('status', 'failed')
        .lt('created_at', weekAgo)

      // Delete old message logs (keep last 30 days)
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      
      await this.supabase
        .from('whatsapp_message_logs')
        .delete()
        .lt('timestamp', monthAgo)

      console.log('Old data cleaned up')

    } catch (error) {
      console.error('Error cleaning up old data:', error)
    }
  }

  async generateAnalytics(): Promise<void> {
    try {
      const today = new Date().toISOString().split('T')[0]
      
      // Get today's stats for each user
      const { data: users } = await this.supabase
        .from('gupshup_configurations')
        .select('user_id')
        .eq('active', true)

      for (const user of users || []) {
        await this.generateUserAnalytics(user.user_id, today)
      }

    } catch (error) {
      console.error('Error generating analytics:', error)
    }
  }

  async generateUserAnalytics(userId: string, date: string): Promise<void> {
    try {
      // Get conversation stats
      const { data: conversations } = await this.supabase
        .from('whatsapp_conversations')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', `${date}T00:00:00Z`)
        .lt('created_at', `${date}T23:59:59Z`)

      // Get message stats
      const { data: messages } = await this.supabase
        .from('whatsapp_message_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('timestamp', `${date}T00:00:00Z`)
        .lt('timestamp', `${date}T23:59:59Z`)

      // Get conversion stats
      const { data: conversions } = await this.supabase
        .from('whatsapp_conversions')
        .select('*')
        .eq('user_id', userId)
        .gte('converted_at', `${date}T00:00:00Z`)
        .lt('converted_at', `${date}T23:59:59Z`)

      const analytics = {
        user_id: userId,
        date,
        total_conversations: conversations?.length || 0,
        new_conversations: conversations?.filter(c => c.created_at.startsWith(date)).length || 0,
        messages_sent: messages?.filter(m => m.direction === 'outbound').length || 0,
        messages_received: messages?.filter(m => m.direction === 'inbound').length || 0,
        conversions: conversions?.length || 0,
        total_revenue: conversions?.reduce((sum, c) => sum + (c.conversion_value || 0), 0) || 0,
        average_response_time: this.calculateAverageResponseTime(messages || []),
        lead_quality_score: this.calculateLeadQualityScore(conversations || [])
      }

      // Insert or update analytics
      await this.supabase
        .from('whatsapp_analytics')
        .upsert(analytics, { onConflict: 'user_id, date' })

    } catch (error) {
      console.error(`Error generating analytics for user ${userId}:`, error)
    }
  }

  calculateAverageResponseTime(messages: any[]): number {
    const responseTimes: number[] = []
    
    for (let i = 1; i < messages.length; i++) {
      const prev = messages[i - 1]
      const curr = messages[i]
      
      if (prev.direction === 'inbound' && curr.direction === 'outbound') {
        const prevTime = new Date(prev.timestamp).getTime()
        const currTime = new Date(curr.timestamp).getTime()
        responseTimes.push(currTime - prevTime)
      }
    }

    return responseTimes.length > 0 
      ? Math.round(responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length / 1000)
      : 0
  }

  calculateLeadQualityScore(conversations: any[]): number {
    if (conversations.length === 0) return 0

    const totalScore = conversations.reduce((sum, conv) => sum + (conv.lead_score || 0), 0)
    return Math.round((totalScore / conversations.length) * 100) / 100
  }
}

// Main scheduler handler
serve(async (req) => {
  const { method } = req
  const url = new URL(req.url)

  // Handle CORS
  if (method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const scheduler = new WhatsAppScheduler()

    if (method === 'POST') {
      const action = url.searchParams.get('action')

      switch (action) {
        case 'process-scheduled':
          await scheduler.processScheduledMessages()
          return new Response(JSON.stringify({ status: 'processed' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })

        case 'generate-followups':
          await scheduler.generateFollowUpSequences()
          return new Response(JSON.stringify({ status: 'followups_generated' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })

        case 'update-limits':
          await scheduler.updateDailyLimits()
          return new Response(JSON.stringify({ status: 'limits_updated' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })

        case 'cleanup':
          await scheduler.cleanupOldData()
          return new Response(JSON.stringify({ status: 'cleaned_up' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })

        case 'analytics':
          await scheduler.generateAnalytics()
          return new Response(JSON.stringify({ status: 'analytics_generated' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })

        case 'run-all':
          await Promise.all([
            scheduler.processScheduledMessages(),
            scheduler.generateFollowUpSequences(),
            scheduler.updateDailyLimits(),
            scheduler.generateAnalytics()
          ])
          return new Response(JSON.stringify({ status: 'all_tasks_completed' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })

        default:
          return new Response('Invalid action', { status: 400, headers: corsHeaders })
      }
    }

    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders })

  } catch (error) {
    console.error('Scheduler error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})