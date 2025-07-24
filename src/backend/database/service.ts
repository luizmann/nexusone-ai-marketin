import { createClient } from '@supabase/supabase-js'

// Database configuration and connection
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Database helper functions
export class DatabaseService {
  // User Management
  static async createUser(userData: {
    email: string
    password_hash: string
    first_name?: string
    last_name?: string
    preferred_language?: string
    subscription_plan?: string
  }) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getUserById(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  }

  static async updateUserSubscription(userId: string, planData: {
    subscription_plan: string
    subscription_status: string
    subscription_start_date?: string
    subscription_end_date?: string
    credits_balance?: number
    video_quota?: number
    landing_pages_quota?: number
    whatsapp_numbers_quota?: number
  }) {
    const { data, error } = await supabase
      .from('users')
      .update(planData)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Credits Management
  static async deductCredits(userId: string, amount: number, module: string, description?: string) {
    // Start transaction
    const { data: user } = await supabase
      .from('users')
      .select('credits_balance')
      .eq('id', userId)
      .single()

    if (!user || user.credits_balance < amount) {
      throw new Error('Insufficient credits')
    }

    // Update user credits
    await supabase
      .from('users')
      .update({ credits_balance: user.credits_balance - amount })
      .eq('id', userId)

    // Log transaction
    await supabase
      .from('credit_transactions')
      .insert([{
        user_id: userId,
        amount: -amount,
        transaction_type: 'usage',
        module_used: module,
        description
      }])

    return user.credits_balance - amount
  }

  static async addCredits(userId: string, amount: number, type: string, description?: string) {
    const { data: user } = await supabase
      .from('users')
      .select('credits_balance')
      .eq('id', userId)
      .single()

    if (!user) throw new Error('User not found')

    // Update user credits
    await supabase
      .from('users')
      .update({ credits_balance: user.credits_balance + amount })
      .eq('id', userId)

    // Log transaction
    await supabase
      .from('credit_transactions')
      .insert([{
        user_id: userId,
        amount,
        transaction_type: type,
        description
      }])

    return user.credits_balance + amount
  }

  // Magic Pages
  static async createMagicPage(pageData: {
    user_id: string
    title: string
    slug: string
    content: object
    template_id?: string
    language?: string
    meta_title?: string
    meta_description?: string
  }) {
    const { data, error } = await supabase
      .from('magic_pages')
      .insert([pageData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getMagicPages(userId: string) {
    const { data, error } = await supabase
      .from('magic_pages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async updateMagicPage(pageId: string, updates: object) {
    const { data, error } = await supabase
      .from('magic_pages')
      .update(updates)
      .eq('id', pageId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Video Projects
  static async createVideoProject(projectData: {
    user_id: string
    title: string
    script: string
    avatar_id?: string
    voice_id?: string
    language?: string
  }) {
    const { data, error } = await supabase
      .from('video_projects')
      .insert([projectData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async updateVideoProject(projectId: string, updates: object) {
    const { data, error } = await supabase
      .from('video_projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getVideoProjects(userId: string) {
    const { data, error } = await supabase
      .from('video_projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  // WhatsApp Management
  static async createWhatsAppNumber(numberData: {
    user_id: string
    phone_number: string
    display_name?: string
    access_token?: string
    verify_token?: string
  }) {
    const { data, error } = await supabase
      .from('whatsapp_numbers')
      .insert([numberData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getWhatsAppNumbers(userId: string) {
    const { data, error } = await supabase
      .from('whatsapp_numbers')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
    
    if (error) throw error
    return data
  }

  static async createWhatsAppFlow(flowData: {
    user_id: string
    whatsapp_number_id: string
    name: string
    trigger_keywords: string[]
    flow_config: object
  }) {
    const { data, error } = await supabase
      .from('whatsapp_flows')
      .insert([flowData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // CRM Functions
  static async createContact(contactData: {
    user_id: string
    first_name?: string
    last_name?: string
    email?: string
    phone?: string
    company?: string
    source?: string
    status?: string
    tags?: string[]
    notes?: string
  }) {
    const { data, error } = await supabase
      .from('contacts')
      .insert([contactData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getContacts(userId: string, filters?: object) {
    let query = supabase
      .from('contacts')
      .select('*')
      .eq('user_id', userId)

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }

    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async updateContact(contactId: string, updates: object) {
    const { data, error } = await supabase
      .from('contacts')
      .update(updates)
      .eq('id', contactId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // AI Agents
  static async createAIAgent(agentData: {
    user_id: string
    name: string
    description?: string
    personality?: string
    instructions?: string
    model?: string
    temperature?: number
    max_tokens?: number
  }) {
    const { data, error } = await supabase
      .from('ai_agents')
      .insert([agentData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getAIAgents(userId: string) {
    const { data, error } = await supabase
      .from('ai_agents')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  static async saveAIConversation(conversationData: {
    agent_id: string
    user_id: string
    session_id: string
    messages: object[]
    total_tokens: number
  }) {
    const { data, error } = await supabase
      .from('ai_agent_conversations')
      .insert([conversationData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // E-commerce Functions
  static async createStore(storeData: {
    user_id: string
    name: string
    domain?: string
    store_type?: string
    platform?: string
    api_credentials?: object
    settings?: object
  }) {
    const { data, error } = await supabase
      .from('stores')
      .insert([storeData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async createProduct(productData: {
    user_id: string
    store_id: string
    external_id?: string
    title: string
    description?: string
    price: number
    compare_price?: number
    cost?: number
    sku?: string
    images?: string[]
    category?: string
    tags?: string[]
    supplier_info?: object
  }) {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getProducts(userId: string, storeId?: string) {
    let query = supabase
      .from('products')
      .select('*')
      .eq('user_id', userId)

    if (storeId) {
      query = query.eq('store_id', storeId)
    }

    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  // Campaign Management
  static async createCampaign(campaignData: {
    user_id: string
    name: string
    platform: string
    campaign_type?: string
    objective?: string
    target_audience?: object
    budget?: number
    daily_budget?: number
    start_date?: string
    end_date?: string
    creative_assets?: object
  }) {
    const { data, error } = await supabase
      .from('campaigns')
      .insert([campaignData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getCampaigns(userId: string, platform?: string) {
    let query = supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', userId)

    if (platform) {
      query = query.eq('platform', platform)
    }

    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  // Content Generation
  static async saveGeneratedContent(contentData: {
    user_id: string
    content_type: string
    prompt: string
    generated_text: string
    language?: string
    model_used?: string
    tokens_used?: number
  }) {
    const { data, error } = await supabase
      .from('generated_content')
      .insert([contentData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Analytics and Tracking
  static async logUserActivity(activityData: {
    user_id: string
    activity_type: string
    module_name?: string
    action: string
    metadata?: object
    ip_address?: string
    user_agent?: string
  }) {
    const { data, error } = await supabase
      .from('user_activities')
      .insert([activityData])
    
    if (error) console.error('Failed to log user activity:', error)
    return data
  }

  static async getUserAnalytics(userId: string, startDate?: string, endDate?: string) {
    let query = supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)

    if (startDate) query = query.gte('created_at', startDate)
    if (endDate) query = query.lte('created_at', endDate)

    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  // API Key Management
  static async storeAPIKey(keyData: {
    user_id: string
    service_name: string
    key_name: string
    encrypted_key: string
  }) {
    const { data, error } = await supabase
      .from('api_keys')
      .upsert([keyData])
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async getAPIKey(userId: string, serviceName: string, keyName?: string) {
    let query = supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', userId)
      .eq('service_name', serviceName)
      .eq('is_active', true)

    if (keyName) {
      query = query.eq('key_name', keyName)
    }

    const { data, error } = await query.single()
    
    if (error) throw error
    return data
  }
}