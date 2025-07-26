/**
 * GupShup WhatsApp AI Automation System
 * Extreme AI-powered conversions using WhatsApp
 * Complete automation for maximum ROI
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../utils/cors.ts'

interface GupShupMessage {
  type: 'text' | 'image' | 'document' | 'button' | 'list' | 'flow'
  text?: string
  url?: string
  filename?: string
  caption?: string
  buttons?: Array<{
    type: 'reply'
    reply: {
      id: string
      title: string
    }
  }>
  interactive?: {
    type: 'list' | 'button'
    header?: { type: 'text', text: string }
    body: { text: string }
    footer?: { text: string }
    action: {
      button?: string
      sections?: Array<{
        title: string
        rows: Array<{
          id: string
          title: string
          description?: string
        }>
      }>
      buttons?: Array<{
        type: 'reply'
        reply: { id: string, title: string }
      }>
    }
  }
}

interface ConversationContext {
  userId: string
  phoneNumber: string
  stage: 'greeting' | 'qualification' | 'presentation' | 'objection' | 'closing' | 'follow_up'
  intent: 'shopping' | 'support' | 'appointment' | 'information' | 'complaint' | 'sales'
  lead_score: number
  products_shown: string[]
  budget_range?: string
  urgency_level: 'high' | 'medium' | 'low'
  pain_points: string[]
  previous_interactions: number
  last_activity: string
  conversion_probability: number
}

interface AIPersonality {
  name: string
  role: string
  tone: 'professional' | 'friendly' | 'casual' | 'urgent' | 'helpful'
  approach: 'consultative' | 'direct' | 'educational' | 'emotional'
  expertise: string[]
  sales_style: 'soft_sell' | 'hard_sell' | 'problem_solver' | 'relationship_builder'
}

class GupShupAIAutomation {
  private apiKey: string
  private appName: string
  private supabase: any
  private openaiKey: string

  constructor() {
    this.apiKey = Deno.env.get('GUPSHUP_API_KEY') || ''
    this.appName = Deno.env.get('GUPSHUP_APP_NAME') || 'nexusone'
    this.openaiKey = Deno.env.get('OPENAI_API_KEY') || ''
    this.supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_ANON_KEY') || ''
    )
  }

  async sendMessage(phoneNumber: string, message: GupShupMessage): Promise<boolean> {
    try {
      const response = await fetch('https://api.gupshup.io/sm/api/v1/msg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'apikey': this.apiKey
        },
        body: new URLSearchParams({
          channel: 'whatsapp',
          source: '917834811114', // Your WhatsApp Business number
          destination: phoneNumber,
          'src.name': this.appName,
          message: JSON.stringify(message)
        })
      })

      const result = await response.json()
      console.log('GupShup API Response:', result)
      
      // Log message to database
      await this.logMessage(phoneNumber, 'outbound', message, result.status === 'submitted')
      
      return result.status === 'submitted'
    } catch (error) {
      console.error('Error sending GupShup message:', error)
      return false
    }
  }

  async processIncomingMessage(webhook: any): Promise<void> {
    try {
      const { payload, type, timestamp } = webhook
      const phoneNumber = payload.sender.phone
      const messageText = payload.payload?.text || ''
      const messageType = payload.type || 'text'

      // Log incoming message
      await this.logMessage(phoneNumber, 'inbound', { text: messageText, type: messageType }, true)

      // Get or create conversation context
      let context = await this.getConversationContext(phoneNumber)
      if (!context) {
        context = await this.createConversationContext(phoneNumber)
      }

      // Update context based on message content
      context = await this.analyzeAndUpdateContext(context, messageText)

      // Generate AI response
      const aiResponse = await this.generateAIResponse(context, messageText)

      // Send response via GupShup
      await this.sendMessage(phoneNumber, aiResponse)

      // Update conversation context
      await this.updateConversationContext(context)

      // Trigger follow-up automation if needed
      await this.scheduleFollowUp(context)

    } catch (error) {
      console.error('Error processing incoming message:', error)
    }
  }

  async generateAIResponse(context: ConversationContext, userMessage: string): Promise<GupShupMessage> {
    try {
      // Get AI personality based on business type
      const personality = await this.getAIPersonality(context.userId)
      
      // Create context-aware prompt
      const prompt = this.buildConversationPrompt(context, userMessage, personality)

      // Call OpenAI for response generation
      const aiResponse = await this.callOpenAI(prompt)

      // Parse AI response and convert to GupShup format
      return this.parseAIResponseToGupShup(aiResponse, context)

    } catch (error) {
      console.error('Error generating AI response:', error)
      return {
        type: 'text',
        text: 'Desculpe, estou com problemas técnicos. Um humano entrará em contato em breve! 🤖'
      }
    }
  }

  buildConversationPrompt(context: ConversationContext, userMessage: string, personality: AIPersonality): string {
    return `
Você é ${personality.name}, um ${personality.role} especializado em ${personality.expertise.join(', ')}.

CONTEXTO DA CONVERSA:
- Estágio: ${context.stage}
- Intenção: ${context.intent}
- Score do Lead: ${context.lead_score}/100
- Produtos mostrados: ${context.products_shown.join(', ')}
- Nível de urgência: ${context.urgency_level}
- Pontos de dor: ${context.pain_points.join(', ')}
- Probabilidade de conversão: ${context.conversion_probability}%
- Interações anteriores: ${context.previous_interactions}

PERSONALIDADE:
- Tom: ${personality.tone}
- Abordagem: ${personality.approach}
- Estilo de vendas: ${personality.sales_style}

REGRAS IMPORTANTES:
1. Seja ${personality.tone} mas sempre focado em conversão
2. Use emojis relevantes para engajamento
3. Faça perguntas qualificadoras quando apropriado
4. Sempre direcione para ação (agendamento, compra, contato)
5. Responda em no máximo 160 caracteres quando possível
6. Se o lead score for >70, seja mais direto na venda
7. Se urgência for alta, crie senso de escassez
8. Sempre termine com call-to-action claro

ÚLTIMA MENSAGEM DO CLIENTE: "${userMessage}"

Gere uma resposta que maximize a probabilidade de conversão baseada no contexto acima.
Se apropriado, inclua:
- Botões interativos para facilitar resposta
- Listas de opções quando necessário
- Links para agendamento ou checkout
- Ofertas personalizadas baseadas no perfil

FORMATO DE RESPOSTA:
{
  "message_type": "text|buttons|list|flow",
  "text": "sua resposta aqui",
  "buttons": [...] // se aplicável
  "action_needed": "schedule|purchase|info|callback",
  "next_stage": "qualification|presentation|closing|follow_up",
  "urgency": "high|medium|low"
}
    `
  }

  async callOpenAI(prompt: string): Promise<any> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'Você é um especialista em conversões via WhatsApp. Gere respostas que maximizem vendas.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      })

      const result = await response.json()
      return JSON.parse(result.choices[0].message.content)
    } catch (error) {
      console.error('OpenAI API Error:', error)
      throw error
    }
  }

  parseAIResponseToGupShup(aiResponse: any, context: ConversationContext): GupShupMessage {
    const { message_type, text, buttons, action_needed } = aiResponse

    switch (message_type) {
      case 'buttons':
        return {
          type: 'button',
          text: text,
          buttons: buttons || [
            {
              type: 'reply',
              reply: { id: 'yes', title: '✅ Sim, me interessa!' }
            },
            {
              type: 'reply',
              reply: { id: 'info', title: '📋 Mais informações' }
            },
            {
              type: 'reply',
              reply: { id: 'schedule', title: '📅 Agendar conversa' }
            }
          ]
        }

      case 'list':
        return {
          type: 'interactive',
          interactive: {
            type: 'list',
            header: { type: 'text', text: '🎯 NexusOne AI' },
            body: { text: text },
            footer: { text: 'Selecione uma opção abaixo:' },
            action: {
              button: 'Ver Opções',
              sections: [
                {
                  title: 'Ações Disponíveis',
                  rows: [
                    { id: 'demo', title: '🎬 Ver Demonstração', description: 'Vídeo de 2 minutos' },
                    { id: 'price', title: '💰 Ver Preços', description: 'Planos e condições' },
                    { id: 'schedule', title: '📅 Agendar Call', description: 'Falar com especialista' },
                    { id: 'trial', title: '🆓 Teste Grátis', description: 'Acesso imediato' }
                  ]
                }
              ]
            }
          }
        }

      default:
        return {
          type: 'text',
          text: text
        }
    }
  }

  async analyzeAndUpdateContext(context: ConversationContext, message: string): Promise<ConversationContext> {
    // AI-powered intent detection and context update
    const analysisPrompt = `
Analise a mensagem: "${message}"

Contexto atual:
- Estágio: ${context.stage}
- Score: ${context.lead_score}
- Intenção: ${context.intent}

Determine:
1. Nova intenção (shopping, support, appointment, etc.)
2. Novo score do lead (0-100)
3. Nível de urgência (high, medium, low)
4. Pontos de dor identificados
5. Próximo estágio ideal
6. Probabilidade de conversão (0-100)

Responda em JSON:
{
  "intent": "...",
  "lead_score": 85,
  "urgency_level": "high",
  "pain_points": ["..."],
  "next_stage": "...",
  "conversion_probability": 75,
  "budget_signals": "...",
  "buying_intent": true/false
}
    `

    try {
      const analysis = await this.callOpenAI(analysisPrompt)
      
      return {
        ...context,
        intent: analysis.intent || context.intent,
        lead_score: analysis.lead_score || context.lead_score,
        urgency_level: analysis.urgency_level || context.urgency_level,
        pain_points: [...context.pain_points, ...(analysis.pain_points || [])],
        stage: analysis.next_stage || context.stage,
        conversion_probability: analysis.conversion_probability || context.conversion_probability,
        last_activity: new Date().toISOString(),
        previous_interactions: context.previous_interactions + 1
      }
    } catch (error) {
      console.error('Error analyzing context:', error)
      return context
    }
  }

  async getConversationContext(phoneNumber: string): Promise<ConversationContext | null> {
    try {
      const { data, error } = await this.supabase
        .from('whatsapp_conversations')
        .select('*')
        .eq('phone_number', phoneNumber)
        .single()

      if (error || !data) return null
      
      return data as ConversationContext
    } catch (error) {
      console.error('Error getting conversation context:', error)
      return null
    }
  }

  async createConversationContext(phoneNumber: string): Promise<ConversationContext> {
    const context: ConversationContext = {
      userId: 'default',
      phoneNumber,
      stage: 'greeting',
      intent: 'information',
      lead_score: 25,
      products_shown: [],
      urgency_level: 'low',
      pain_points: [],
      previous_interactions: 0,
      last_activity: new Date().toISOString(),
      conversion_probability: 15
    }

    try {
      const { data, error } = await this.supabase
        .from('whatsapp_conversations')
        .insert(context)
        .select()
        .single()

      return data || context
    } catch (error) {
      console.error('Error creating conversation context:', error)
      return context
    }
  }

  async updateConversationContext(context: ConversationContext): Promise<void> {
    try {
      await this.supabase
        .from('whatsapp_conversations')
        .update(context)
        .eq('phone_number', context.phoneNumber)
    } catch (error) {
      console.error('Error updating conversation context:', error)
    }
  }

  async getAIPersonality(userId: string): Promise<AIPersonality> {
    try {
      const { data } = await this.supabase
        .from('ai_personalities')
        .select('*')
        .eq('user_id', userId)
        .single()

      return data || {
        name: 'Sofia',
        role: 'Consultora de Automação',
        tone: 'friendly',
        approach: 'consultative',
        expertise: ['Marketing Digital', 'IA', 'Automação'],
        sales_style: 'problem_solver'
      }
    } catch (error) {
      return {
        name: 'Alex',
        role: 'Especialista em Vendas',
        tone: 'professional',
        approach: 'consultative',
        expertise: ['Vendas', 'Conversão', 'ROI'],
        sales_style: 'relationship_builder'
      }
    }
  }

  async scheduleFollowUp(context: ConversationContext): Promise<void> {
    // Schedule automatic follow-up based on context
    if (context.conversion_probability > 60 && context.stage !== 'closing') {
      // High probability - schedule quick follow-up
      await this.scheduleMessage(context.phoneNumber, this.generateFollowUpMessage(context), 3600) // 1 hour
    } else if (context.conversion_probability > 30) {
      // Medium probability - schedule next day follow-up
      await this.scheduleMessage(context.phoneNumber, this.generateFollowUpMessage(context), 86400) // 24 hours
    } else if (context.previous_interactions < 3) {
      // Low probability but new lead - nurture sequence
      await this.scheduleMessage(context.phoneNumber, this.generateNurtureMessage(context), 172800) // 48 hours
    }
  }

  generateFollowUpMessage(context: ConversationContext): GupShupMessage {
    const messages = {
      high_probability: [
        "🔥 Oi! Ainda tem interesse na automação que conversamos? Tenho uma proposta especial que pode te interessar!",
        "💡 Lembrei de você! Preparei uma demo personalizada baseada na nossa conversa. Quer ver?",
        "⚡ Última chance de garantir o desconto que ofereci! Posso processar agora se quiser."
      ],
      medium_probability: [
        "📈 Como estão os resultados por aí? A automação que discutimos poderia melhorar bastante isso!",
        "🎯 Vi que você se interessou pela nossa solução. Quer que eu tire mais alguma dúvida?",
        "💰 Calculei o ROI para seu caso específico. Os números são impressionantes! Quer ver?"
      ]
    }

    const messageArray = context.conversion_probability > 60 ? messages.high_probability : messages.medium_probability
    const selectedMessage = messageArray[Math.floor(Math.random() * messageArray.length)]

    return {
      type: 'text',
      text: selectedMessage
    }
  }

  generateNurtureMessage(context: ConversationContext): GupShupMessage {
    return {
      type: 'text',
      text: "📚 Preparei um material gratuito sobre automação de vendas que pode te ajudar! São 5 estratégias que aumentam conversão em 300%. Quer receber?"
    }
  }

  async scheduleMessage(phoneNumber: string, message: GupShupMessage, delaySeconds: number): Promise<void> {
    try {
      await this.supabase
        .from('scheduled_messages')
        .insert({
          phone_number: phoneNumber,
          message: JSON.stringify(message),
          scheduled_for: new Date(Date.now() + delaySeconds * 1000).toISOString(),
          status: 'pending'
        })
    } catch (error) {
      console.error('Error scheduling message:', error)
    }
  }

  async logMessage(phoneNumber: string, direction: 'inbound' | 'outbound', message: any, success: boolean): Promise<void> {
    try {
      await this.supabase
        .from('whatsapp_message_logs')
        .insert({
          phone_number: phoneNumber,
          direction,
          message_content: JSON.stringify(message),
          success,
          timestamp: new Date().toISOString()
        })
    } catch (error) {
      console.error('Error logging message:', error)
    }
  }

  async getConversionMetrics(phoneNumber?: string): Promise<any> {
    try {
      let query = this.supabase
        .from('whatsapp_conversations')
        .select(`
          *,
          whatsapp_message_logs (*)
        `)

      if (phoneNumber) {
        query = query.eq('phone_number', phoneNumber)
      }

      const { data, error } = await query

      if (error) throw error

      const metrics = {
        total_conversations: data.length,
        high_intent_leads: data.filter(c => c.lead_score > 70).length,
        conversion_ready: data.filter(c => c.conversion_probability > 80).length,
        average_lead_score: data.reduce((sum, c) => sum + c.lead_score, 0) / data.length,
        by_stage: data.reduce((acc, c) => {
          acc[c.stage] = (acc[c.stage] || 0) + 1
          return acc
        }, {}),
        by_intent: data.reduce((acc, c) => {
          acc[c.intent] = (acc[c.intent] || 0) + 1
          return acc
        }, {})
      }

      return metrics
    } catch (error) {
      console.error('Error getting conversion metrics:', error)
      return {}
    }
  }
}

// Main handler
serve(async (req) => {
  const { method } = req
  const url = new URL(req.url)

  // Handle CORS
  if (method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const automation = new GupShupAIAutomation()

    if (method === 'POST') {
      const body = await req.json()

      switch (url.pathname) {
        case '/webhook':
          // GupShup webhook for incoming messages
          await automation.processIncomingMessage(body)
          return new Response(JSON.stringify({ status: 'processed' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })

        case '/send-message':
          // Manual message sending
          const { phoneNumber, message } = body
          const success = await automation.sendMessage(phoneNumber, message)
          return new Response(JSON.stringify({ success }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })

        case '/metrics':
          // Get conversion metrics
          const { phone_number } = body
          const metrics = await automation.getConversionMetrics(phone_number)
          return new Response(JSON.stringify(metrics), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })

        case '/broadcast':
          // Send broadcast message to multiple contacts
          const { contacts, broadcastMessage } = body
          const results = await Promise.all(
            contacts.map((contact: string) => automation.sendMessage(contact, broadcastMessage))
          )
          return new Response(JSON.stringify({ sent: results.filter(Boolean).length }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })

        default:
          return new Response('Not Found', { status: 404, headers: corsHeaders })
      }
    }

    return new Response('Method Not Allowed', { status: 405, headers: corsHeaders })

  } catch (error) {
    console.error('Function error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})