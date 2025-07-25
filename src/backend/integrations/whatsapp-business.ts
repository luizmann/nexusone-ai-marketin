/**
 * WhatsApp Business API Integration Service
 * 
 * This service provides comprehensive integration with WhatsApp Business API
 * for automated messaging, chatbots, appointment scheduling, and business automation.
 * 
 * Supports Cloud API and On-Premises API
 */

import { createClient } from '@supabase/supabase-js'

// WhatsApp Business API Configuration
const WHATSAPP_CLOUD_API_URL = 'https://graph.facebook.com'
const WHATSAPP_API_VERSION = 'v18.0'

interface WhatsAppConfig {
  accessToken: string
  phoneNumberId: string
  businessAccountId: string
  appId: string
  appSecret: string
  verifyToken: string
  webhookUrl?: string
}

interface WhatsAppMessage {
  to: string
  type: 'text' | 'template' | 'interactive' | 'image' | 'document' | 'audio' | 'video'
  text?: {
    body: string
    preview_url?: boolean
  }
  template?: {
    name: string
    language: {
      code: string
    }
    components?: any[]
  }
  interactive?: {
    type: 'button' | 'list'
    header?: any
    body: {
      text: string
    }
    footer?: {
      text: string
    }
    action: any
  }
  image?: {
    link?: string
    id?: string
    caption?: string
  }
  document?: {
    link?: string
    id?: string
    caption?: string
    filename?: string
  }
}

interface WhatsAppContact {
  phoneNumber: string
  name?: string
  profilePicture?: string
  status?: string
  lastSeen?: string
  tags?: string[]
  customFields?: Record<string, any>
}

interface AppointmentSlot {
  id: string
  date: string
  time: string
  duration: number
  available: boolean
  service?: string
  price?: number
}

interface BusinessSchedule {
  businessId: string
  name: string
  description: string
  category: string
  workingDays: {
    monday: { enabled: boolean; start: string; end: string }
    tuesday: { enabled: boolean; start: string; end: string }
    wednesday: { enabled: boolean; start: string; end: string }
    thursday: { enabled: boolean; start: string; end: string }
    friday: { enabled: boolean; start: string; end: string }
    saturday: { enabled: boolean; start: string; end: string }
    sunday: { enabled: boolean; start: string; end: string }
  }
  services: Array<{
    id: string
    name: string
    duration: number
    price: number
    description: string
  }>
  timeSlotDuration: number
  advanceBookingDays: number
  timezone: string
}

export class WhatsAppBusinessService {
  private config: WhatsAppConfig
  private supabase: any

  constructor(config: WhatsAppConfig) {
    this.config = config
    this.supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_KEY || ''
    )
  }

  /**
   * Send text message
   */
  async sendTextMessage(to: string, message: string, previewUrl: boolean = false): Promise<any> {
    try {
      const response = await fetch(
        `${WHATSAPP_CLOUD_API_URL}/${WHATSAPP_API_VERSION}/${this.config.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: to,
            type: 'text',
            text: {
              body: message,
              preview_url: previewUrl
            }
          })
        }
      )

      const data = await response.json()
      
      if (response.ok) {
        // Log message to database
        await this.logMessage({
          phoneNumber: to,
          direction: 'outbound',
          messageType: 'text',
          content: message,
          messageId: data.messages[0].id,
          status: 'sent'
        })
        
        return data
      }
      
      throw new Error(`Failed to send message: ${data.error?.message || 'Unknown error'}`)
    } catch (error) {
      console.error('WhatsApp send text message error:', error)
      throw error
    }
  }

  /**
   * Send template message
   */
  async sendTemplateMessage(to: string, templateName: string, languageCode: string, components?: any[]): Promise<any> {
    try {
      const response = await fetch(
        `${WHATSAPP_CLOUD_API_URL}/${WHATSAPP_API_VERSION}/${this.config.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            to: to,
            type: 'template',
            template: {
              name: templateName,
              language: {
                code: languageCode
              },
              ...(components && { components })
            }
          })
        }
      )

      const data = await response.json()
      
      if (response.ok) {
        await this.logMessage({
          phoneNumber: to,
          direction: 'outbound',
          messageType: 'template',
          content: `Template: ${templateName}`,
          messageId: data.messages[0].id,
          status: 'sent'
        })
        
        return data
      }
      
      throw new Error(`Failed to send template: ${data.error?.message || 'Unknown error'}`)
    } catch (error) {
      console.error('WhatsApp send template message error:', error)
      throw error
    }
  }

  /**
   * Send interactive button message
   */
  async sendButtonMessage(
    to: string,
    bodyText: string,
    buttons: Array<{ id: string; title: string }>,
    headerText?: string,
    footerText?: string
  ): Promise<any> {
    try {
      const message: any = {
        messaging_product: 'whatsapp',
        to: to,
        type: 'interactive',
        interactive: {
          type: 'button',
          body: {
            text: bodyText
          },
          action: {
            buttons: buttons.map(btn => ({
              type: 'reply',
              reply: {
                id: btn.id,
                title: btn.title
              }
            }))
          }
        }
      }

      if (headerText) {
        message.interactive.header = {
          type: 'text',
          text: headerText
        }
      }

      if (footerText) {
        message.interactive.footer = {
          text: footerText
        }
      }

      const response = await fetch(
        `${WHATSAPP_CLOUD_API_URL}/${WHATSAPP_API_VERSION}/${this.config.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(message)
        }
      )

      const data = await response.json()
      
      if (response.ok) {
        await this.logMessage({
          phoneNumber: to,
          direction: 'outbound',
          messageType: 'interactive',
          content: bodyText,
          messageId: data.messages[0].id,
          status: 'sent'
        })
        
        return data
      }
      
      throw new Error(`Failed to send button message: ${data.error?.message || 'Unknown error'}`)
    } catch (error) {
      console.error('WhatsApp send button message error:', error)
      throw error
    }
  }

  /**
   * Send list message
   */
  async sendListMessage(
    to: string,
    bodyText: string,
    buttonText: string,
    sections: Array<{
      title: string
      rows: Array<{ id: string; title: string; description?: string }>
    }>,
    headerText?: string,
    footerText?: string
  ): Promise<any> {
    try {
      const message: any = {
        messaging_product: 'whatsapp',
        to: to,
        type: 'interactive',
        interactive: {
          type: 'list',
          body: {
            text: bodyText
          },
          action: {
            button: buttonText,
            sections: sections
          }
        }
      }

      if (headerText) {
        message.interactive.header = {
          type: 'text',
          text: headerText
        }
      }

      if (footerText) {
        message.interactive.footer = {
          text: footerText
        }
      }

      const response = await fetch(
        `${WHATSAPP_CLOUD_API_URL}/${WHATSAPP_API_VERSION}/${this.config.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(message)
        }
      )

      const data = await response.json()
      
      if (response.ok) {
        await this.logMessage({
          phoneNumber: to,
          direction: 'outbound',
          messageType: 'interactive',
          content: bodyText,
          messageId: data.messages[0].id,
          status: 'sent'
        })
        
        return data
      }
      
      throw new Error(`Failed to send list message: ${data.error?.message || 'Unknown error'}`)
    } catch (error) {
      console.error('WhatsApp send list message error:', error)
      throw error
    }
  }

  /**
   * Handle incoming webhook messages
   */
  async handleWebhook(webhookData: any): Promise<void> {
    try {
      if (webhookData.object === 'whatsapp_business_account') {
        for (const entry of webhookData.entry) {
          for (const change of entry.changes) {
            if (change.field === 'messages') {
              await this.processIncomingMessages(change.value)
            }
          }
        }
      }
    } catch (error) {
      console.error('WhatsApp webhook handling error:', error)
      throw error
    }
  }

  /**
   * Process incoming messages
   */
  private async processIncomingMessages(messageData: any): Promise<void> {
    try {
      if (messageData.messages) {
        for (const message of messageData.messages) {
          await this.processMessage(message, messageData.contacts?.[0])
        }
      }

      if (messageData.statuses) {
        for (const status of messageData.statuses) {
          await this.updateMessageStatus(status)
        }
      }
    } catch (error) {
      console.error('Process incoming messages error:', error)
      throw error
    }
  }

  /**
   * Process individual message
   */
  private async processMessage(message: any, contact?: any): Promise<void> {
    try {
      // Log incoming message
      await this.logMessage({
        phoneNumber: message.from,
        direction: 'inbound',
        messageType: message.type,
        content: this.extractMessageContent(message),
        messageId: message.id,
        status: 'received',
        timestamp: new Date(parseInt(message.timestamp) * 1000).toISOString()
      })

      // Update or create contact
      if (contact) {
        await this.updateContact({
          phoneNumber: message.from,
          name: contact.profile?.name,
          lastSeen: new Date().toISOString()
        })
      }

      // Process message based on type and business logic
      await this.processBusinessLogic(message)
    } catch (error) {
      console.error('Process message error:', error)
      throw error
    }
  }

  /**
   * Process business logic (appointments, AI responses, etc.)
   */
  private async processBusinessLogic(message: any): Promise<void> {
    try {
      const phoneNumber = message.from
      const messageText = this.extractMessageContent(message)

      // Get user's business configuration
      const businessConfig = await this.getBusinessConfig(phoneNumber)
      
      if (businessConfig) {
        // Check if this is an appointment-related message
        if (this.isAppointmentRequest(messageText)) {
          await this.handleAppointmentRequest(phoneNumber, messageText, businessConfig)
        } else {
          // Use AI to generate response
          await this.handleAIResponse(phoneNumber, messageText, businessConfig)
        }
      } else {
        // Send default response for unregistered business
        await this.sendTextMessage(
          phoneNumber,
          "Hello! Thanks for your message. This WhatsApp number is managed by NexusOne AI. Please contact the business owner to set up automated responses."
        )
      }
    } catch (error) {
      console.error('Process business logic error:', error)
    }
  }

  /**
   * Handle appointment scheduling requests
   */
  private async handleAppointmentRequest(phoneNumber: string, message: string, businessConfig: BusinessSchedule): Promise<void> {
    try {
      // Generate AI prompt for appointment handling
      const prompt = spark.llmPrompt`
        You are an AI assistant for ${businessConfig.name}, a ${businessConfig.category} business.
        
        Business description: ${businessConfig.description}
        
        Services offered:
        ${businessConfig.services.map(s => `- ${s.name}: ${s.duration}min - $${s.price}`).join('\n')}
        
        Working hours:
        ${Object.entries(businessConfig.workingDays)
          .filter(([_, day]: [string, any]) => day.enabled)
          .map(([dayName, day]: [string, any]) => `${dayName}: ${day.start} - ${day.end}`)
          .join('\n')}
        
        Customer message: "${message}"
        
        Please respond in a helpful way to schedule an appointment. If they're asking about availability, 
        suggest some available times. If they want to book, ask for their preferred service and time.
        
        Keep response friendly, professional, and under 160 characters.
      `

      const aiResponse = await spark.llm(prompt)
      
      // Check if we need to show available slots
      if (this.needsAvailableSlots(message)) {
        const availableSlots = await this.getAvailableSlots(businessConfig, 7) // Next 7 days
        
        if (availableSlots.length > 0) {
          // Create interactive list with available slots
          const sections = this.groupSlotsByDate(availableSlots)
          
          await this.sendListMessage(
            phoneNumber,
            aiResponse,
            "Select Time",
            sections,
            "Available Appointments",
            `${businessConfig.name} - Powered by NexusOne AI`
          )
        } else {
          await this.sendTextMessage(phoneNumber, `${aiResponse}\n\nSorry, no available slots in the next 7 days. Please call us directly.`)
        }
      } else {
        await this.sendTextMessage(phoneNumber, aiResponse)
      }
    } catch (error) {
      console.error('Handle appointment request error:', error)
      await this.sendTextMessage(phoneNumber, "Sorry, I'm having trouble processing your request. Please try again later.")
    }
  }

  /**
   * Handle AI-powered responses
   */
  private async handleAIResponse(phoneNumber: string, message: string, businessConfig: BusinessSchedule): Promise<void> {
    try {
      const prompt = spark.llmPrompt`
        You are an AI assistant for ${businessConfig.name}, a ${businessConfig.category} business.
        
        Business description: ${businessConfig.description}
        
        Services offered:
        ${businessConfig.services.map(s => `- ${s.name}: ${s.duration}min - $${s.price}`).join('\n')}
        
        Customer message: "${message}"
        
        Please respond in a helpful, friendly, and professional way. If they ask about services, 
        provide information. If they want to book, guide them to schedule an appointment.
        
        Keep response under 160 characters and always end with an offer to help.
      `

      const aiResponse = await spark.llm(prompt)
      await this.sendTextMessage(phoneNumber, aiResponse)
    } catch (error) {
      console.error('Handle AI response error:', error)
      await this.sendTextMessage(phoneNumber, "Thanks for your message! We'll get back to you soon.")
    }
  }

  /**
   * Setup appointment scheduling for a business
   */
  async setupBusinessScheduling(userId: string, businessData: BusinessSchedule): Promise<void> {
    try {
      await this.supabase
        .from('whatsapp_business_config')
        .upsert({
          user_id: userId,
          phone_number_id: this.config.phoneNumberId,
          business_name: businessData.name,
          business_description: businessData.description,
          business_category: businessData.category,
          working_days: businessData.workingDays,
          services: businessData.services,
          time_slot_duration: businessData.timeSlotDuration,
          advance_booking_days: businessData.advanceBookingDays,
          timezone: businessData.timezone,
          is_active: true
        })
    } catch (error) {
      console.error('Setup business scheduling error:', error)
      throw error
    }
  }

  /**
   * Get available appointment slots
   */
  async getAvailableSlots(businessConfig: BusinessSchedule, daysAhead: number = 7): Promise<AppointmentSlot[]> {
    try {
      const slots: AppointmentSlot[] = []
      const startDate = new Date()
      startDate.setDate(startDate.getDate() + 1) // Start from tomorrow

      for (let i = 0; i < daysAhead; i++) {
        const currentDate = new Date(startDate)
        currentDate.setDate(startDate.getDate() + i)
        
        const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'lowercase' }) as keyof typeof businessConfig.workingDays
        const workingDay = businessConfig.workingDays[dayName]

        if (workingDay.enabled) {
          const daySlots = await this.generateSlotsForDay(currentDate, workingDay, businessConfig)
          slots.push(...daySlots)
        }
      }

      // Filter out booked slots
      const bookedSlots = await this.getBookedSlots(businessConfig.businessId, startDate, daysAhead)
      const bookedSlotKeys = new Set(bookedSlots.map(slot => `${slot.date}_${slot.time}`))

      return slots.filter(slot => !bookedSlotKeys.has(`${slot.date}_${slot.time}`))
    } catch (error) {
      console.error('Get available slots error:', error)
      return []
    }
  }

  /**
   * Book appointment slot
   */
  async bookAppointment(
    phoneNumber: string,
    slotId: string,
    serviceId: string,
    customerName?: string,
    notes?: string
  ): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('whatsapp_appointments')
        .insert({
          phone_number: phoneNumber,
          slot_id: slotId,
          service_id: serviceId,
          customer_name: customerName,
          notes: notes,
          status: 'confirmed',
          created_at: new Date().toISOString()
        })

      if (!error) {
        // Send confirmation message
        await this.sendTextMessage(
          phoneNumber,
          `✅ Appointment confirmed! We'll send you a reminder 1 hour before your appointment. Thank you!`
        )
        return true
      }

      return false
    } catch (error) {
      console.error('Book appointment error:', error)
      return false
    }
  }

  /**
   * Log message to database
   */
  private async logMessage(messageData: {
    phoneNumber: string
    direction: 'inbound' | 'outbound'
    messageType: string
    content: string
    messageId: string
    status: string
    timestamp?: string
  }): Promise<void> {
    try {
      await this.supabase
        .from('whatsapp_messages')
        .insert({
          phone_number: messageData.phoneNumber,
          phone_number_id: this.config.phoneNumberId,
          direction: messageData.direction,
          message_type: messageData.messageType,
          content: messageData.content,
          message_id: messageData.messageId,
          status: messageData.status,
          timestamp: messageData.timestamp || new Date().toISOString()
        })
    } catch (error) {
      console.error('Log message error:', error)
    }
  }

  /**
   * Update or create contact
   */
  private async updateContact(contactData: Partial<WhatsAppContact>): Promise<void> {
    try {
      await this.supabase
        .from('whatsapp_contacts')
        .upsert({
          phone_number: contactData.phoneNumber,
          phone_number_id: this.config.phoneNumberId,
          name: contactData.name,
          profile_picture: contactData.profilePicture,
          status: contactData.status,
          last_seen: contactData.lastSeen,
          tags: contactData.tags,
          custom_fields: contactData.customFields,
          updated_at: new Date().toISOString()
        })
    } catch (error) {
      console.error('Update contact error:', error)
    }
  }

  /**
   * Extract message content based on type
   */
  private extractMessageContent(message: any): string {
    switch (message.type) {
      case 'text':
        return message.text.body
      case 'button':
        return message.button.text
      case 'interactive':
        return message.interactive.button_reply?.title || 
               message.interactive.list_reply?.title || 
               'Interactive message'
      case 'image':
        return `[Image] ${message.image.caption || ''}`
      case 'document':
        return `[Document] ${message.document.caption || message.document.filename || ''}`
      case 'audio':
        return '[Audio message]'
      case 'video':
        return `[Video] ${message.video.caption || ''}`
      default:
        return `[${message.type}]`
    }
  }

  // Helper methods
  private isAppointmentRequest(message: string): boolean {
    const appointmentKeywords = [
      'appointment', 'booking', 'schedule', 'available', 'time', 'date',
      'agendamento', 'horário', 'disponível', 'marcar', 'agendar',
      'cita', 'reserva', 'disponible', 'hora', 'fecha'
    ]
    
    return appointmentKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    )
  }

  private needsAvailableSlots(message: string): boolean {
    const slotKeywords = [
      'available', 'when', 'time', 'schedule', 'disponível', 'quando', 
      'horário', 'disponible', 'cuándo', 'hora'
    ]
    
    return slotKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    )
  }

  private async getBusinessConfig(phoneNumber: string): Promise<BusinessSchedule | null> {
    try {
      const { data } = await this.supabase
        .from('whatsapp_business_config')
        .select('*')
        .eq('phone_number_id', this.config.phoneNumberId)
        .eq('is_active', true)
        .single()

      return data ? {
        businessId: data.id,
        name: data.business_name,
        description: data.business_description,
        category: data.business_category,
        workingDays: data.working_days,
        services: data.services,
        timeSlotDuration: data.time_slot_duration,
        advanceBookingDays: data.advance_booking_days,
        timezone: data.timezone
      } : null
    } catch (error) {
      console.error('Get business config error:', error)
      return null
    }
  }

  private async generateSlotsForDay(
    date: Date,
    workingDay: { start: string; end: string },
    businessConfig: BusinessSchedule
  ): Promise<AppointmentSlot[]> {
    const slots: AppointmentSlot[] = []
    const startTime = new Date(`${date.toDateString()} ${workingDay.start}`)
    const endTime = new Date(`${date.toDateString()} ${workingDay.end}`)

    let currentTime = new Date(startTime)
    
    while (currentTime < endTime) {
      slots.push({
        id: `${date.toISOString().split('T')[0]}_${currentTime.toTimeString().split(':').slice(0, 2).join(':')}`,
        date: date.toISOString().split('T')[0],
        time: currentTime.toTimeString().split(':').slice(0, 2).join(':'),
        duration: businessConfig.timeSlotDuration,
        available: true
      })
      
      currentTime.setMinutes(currentTime.getMinutes() + businessConfig.timeSlotDuration)
    }

    return slots
  }

  private async getBookedSlots(businessId: string, startDate: Date, daysAhead: number): Promise<AppointmentSlot[]> {
    try {
      const endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + daysAhead)

      const { data } = await this.supabase
        .from('whatsapp_appointments')
        .select('*')
        .eq('business_id', businessId)
        .gte('appointment_date', startDate.toISOString())
        .lte('appointment_date', endDate.toISOString())
        .eq('status', 'confirmed')

      return data || []
    } catch (error) {
      console.error('Get booked slots error:', error)
      return []
    }
  }

  private groupSlotsByDate(slots: AppointmentSlot[]): Array<{ title: string; rows: Array<{ id: string; title: string; description?: string }> }> {
    const grouped: Record<string, AppointmentSlot[]> = {}
    
    slots.forEach(slot => {
      if (!grouped[slot.date]) {
        grouped[slot.date] = []
      }
      grouped[slot.date].push(slot)
    })

    return Object.entries(grouped).map(([date, dateSlots]) => ({
      title: new Date(date).toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      }),
      rows: dateSlots.slice(0, 10).map(slot => ({ // Limit to 10 slots per day
        id: slot.id,
        title: slot.time,
        description: `${slot.duration} minutes`
      }))
    }))
  }

  private async updateMessageStatus(status: any): Promise<void> {
    try {
      await this.supabase
        .from('whatsapp_messages')
        .update({
          status: status.status,
          updated_at: new Date().toISOString()
        })
        .eq('message_id', status.id)
    } catch (error) {
      console.error('Update message status error:', error)
    }
  }
}

// Export factory function
export function createWhatsAppBusinessService(config: WhatsAppConfig): WhatsAppBusinessService {
  return new WhatsAppBusinessService(config)
}

// Export types
export type {
  WhatsAppConfig,
  WhatsAppMessage,
  WhatsAppContact,
  AppointmentSlot,
  BusinessSchedule
}