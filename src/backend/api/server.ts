import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { DatabaseService } from '../database/service'

const app = express()

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
})
app.use('/api/', limiter)

// JWT Authentication Middleware
export const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Invalid token' })
    req.user = user
    next()
  })
}

// Credit check middleware
export const checkCredits = (requiredCredits: number) => {
  return async (req: any, res: any, next: any) => {
    try {
      const user = await DatabaseService.getUserById(req.user.id)
      if (user.credits_balance < requiredCredits) {
        return res.status(402).json({ 
          error: 'Insufficient credits',
          required: requiredCredits,
          available: user.credits_balance
        })
      }
      req.user.credits = user.credits_balance
      next()
    } catch (error) {
      res.status(500).json({ error: 'Failed to check credits' })
    }
  }
}

// Plan-based access control
export const checkPlanAccess = (requiredModules: string[]) => {
  return async (req: any, res: any, next: any) => {
    try {
      const user = await DatabaseService.getUserById(req.user.id)
      const userPlan = user.subscription_plan
      
      // Get plan details from database
      const { data: planData } = await supabase
        .from('subscription_plans')
        .select('enabled_modules')
        .eq('id', userPlan)
        .single()

      if (!planData) {
        return res.status(403).json({ error: 'Invalid subscription plan' })
      }

      const hasAccess = requiredModules.every(module => 
        planData.enabled_modules.includes(module)
      )

      if (!hasAccess) {
        return res.status(403).json({ 
          error: 'Upgrade required',
          required_modules: requiredModules,
          current_plan: userPlan
        })
      }

      next()
    } catch (error) {
      res.status(500).json({ error: 'Failed to check plan access' })
    }
  }
}

// ===== AUTHENTICATION ROUTES =====

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, first_name, last_name, preferred_language = 'en' } = req.body

    // Hash password
    const password_hash = await bcrypt.hash(password, 12)

    // Create user
    const user = await DatabaseService.createUser({
      email,
      password_hash,
      first_name,
      last_name,
      preferred_language
    })

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    // Remove password from response
    const { password_hash: _, ...userWithoutPassword } = user

    res.status(201).json({
      success: true,
      token,
      user: userWithoutPassword
    })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
})

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Get user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    // Remove password from response
    const { password_hash: _, ...userWithoutPassword } = user

    res.json({
      success: true,
      token,
      user: userWithoutPassword
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// ===== USER MANAGEMENT ROUTES =====

// Get current user profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await DatabaseService.getUserById(req.user.id)
    const { password_hash: _, ...userWithoutPassword } = user
    res.json(userWithoutPassword)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Update user profile
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const updates = req.body
    delete updates.id
    delete updates.email
    delete updates.password_hash
    delete updates.created_at

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', req.user.id)
      .select()
      .single()

    if (error) throw error

    const { password_hash: _, ...userWithoutPassword } = data
    res.json(userWithoutPassword)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// ===== CREDITS MANAGEMENT ROUTES =====

// Get credit balance and transactions
app.get('/api/credits', authenticateToken, async (req, res) => {
  try {
    const user = await DatabaseService.getUserById(req.user.id)
    
    const { data: transactions } = await supabase
      .from('credit_transactions')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    res.json({
      balance: user.credits_balance,
      video_quota: user.video_quota,
      landing_pages_quota: user.landing_pages_quota,
      whatsapp_numbers_quota: user.whatsapp_numbers_quota,
      transactions
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Purchase credits
app.post('/api/credits/purchase', authenticateToken, async (req, res) => {
  try {
    const { amount, payment_method } = req.body
    
    // TODO: Integrate with payment processor
    // For now, just add credits
    const newBalance = await DatabaseService.addCredits(
      req.user.id,
      amount,
      'purchase',
      `Purchased ${amount} credits`
    )

    res.json({
      success: true,
      new_balance: newBalance,
      amount_purchased: amount
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// ===== MAGIC PAGES ROUTES =====

// Get user's magic pages
app.get('/api/magic-pages', authenticateToken, async (req, res) => {
  try {
    const pages = await DatabaseService.getMagicPages(req.user.id)
    res.json(pages)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Create new magic page
app.post('/api/magic-pages', 
  authenticateToken, 
  checkPlanAccess(['magic_pages']),
  checkCredits(10),
  async (req, res) => {
    try {
      const { title, content, template_id, language = 'en', meta_title, meta_description } = req.body
      
      // Generate unique slug
      const slug = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '-' + Date.now()

      const page = await DatabaseService.createMagicPage({
        user_id: req.user.id,
        title,
        slug,
        content,
        template_id,
        language,
        meta_title,
        meta_description
      })

      // Deduct credits
      await DatabaseService.deductCredits(req.user.id, 10, 'magic_pages', `Created page: ${title}`)

      // Log activity
      await DatabaseService.logUserActivity({
        user_id: req.user.id,
        activity_type: 'create',
        module_name: 'magic_pages',
        action: 'page_created',
        metadata: { page_id: page.id, title }
      })

      res.status(201).json(page)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

// Update magic page
app.put('/api/magic-pages/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body
    delete updates.id
    delete updates.user_id
    delete updates.created_at

    const page = await DatabaseService.updateMagicPage(id, updates)
    res.json(page)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// ===== VIDEO CREATOR ROUTES =====

// Get user's video projects
app.get('/api/video-projects', authenticateToken, async (req, res) => {
  try {
    const projects = await DatabaseService.getVideoProjects(req.user.id)
    res.json(projects)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Create new video project
app.post('/api/video-projects', 
  authenticateToken,
  checkPlanAccess(['video_creator']),
  checkCredits(25),
  async (req, res) => {
    try {
      const { title, script, avatar_id, voice_id, language = 'en' } = req.body

      const project = await DatabaseService.createVideoProject({
        user_id: req.user.id,
        title,
        script,
        avatar_id,
        voice_id,
        language
      })

      // Deduct credits
      await DatabaseService.deductCredits(req.user.id, 25, 'video_creator', `Created video: ${title}`)

      // TODO: Queue video generation job

      res.status(201).json(project)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

// ===== WHATSAPP ROUTES =====

// Get WhatsApp numbers
app.get('/api/whatsapp/numbers', authenticateToken, async (req, res) => {
  try {
    const numbers = await DatabaseService.getWhatsAppNumbers(req.user.id)
    res.json(numbers)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Add WhatsApp number
app.post('/api/whatsapp/numbers', 
  authenticateToken,
  checkPlanAccess(['whatsapp_bot']),
  async (req, res) => {
    try {
      const { phone_number, display_name } = req.body
      
      const user = await DatabaseService.getUserById(req.user.id)
      const currentNumbers = await DatabaseService.getWhatsAppNumbers(req.user.id)
      
      if (currentNumbers.length >= user.whatsapp_numbers_quota) {
        return res.status(403).json({ 
          error: 'WhatsApp number quota exceeded',
          current: currentNumbers.length,
          limit: user.whatsapp_numbers_quota
        })
      }

      const number = await DatabaseService.createWhatsAppNumber({
        user_id: req.user.id,
        phone_number,
        display_name,
        verify_token: Math.random().toString(36).substring(7)
      })

      res.status(201).json(number)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

// ===== CRM ROUTES =====

// Get contacts
app.get('/api/crm/contacts', authenticateToken, async (req, res) => {
  try {
    const { status, source } = req.query
    const filters: any = {}
    if (status) filters.status = status
    if (source) filters.source = source

    const contacts = await DatabaseService.getContacts(req.user.id, filters)
    res.json(contacts)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Create contact
app.post('/api/crm/contacts', 
  authenticateToken,
  checkPlanAccess(['crm']),
  checkCredits(5),
  async (req, res) => {
    try {
      const contactData = { ...req.body, user_id: req.user.id }
      const contact = await DatabaseService.createContact(contactData)

      // Deduct credits
      await DatabaseService.deductCredits(req.user.id, 5, 'crm', `Added contact: ${contact.email}`)

      res.status(201).json(contact)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

// ===== AI AGENTS ROUTES =====

// Get AI agents
app.get('/api/ai-agents', authenticateToken, async (req, res) => {
  try {
    const agents = await DatabaseService.getAIAgents(req.user.id)
    res.json(agents)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Create AI agent
app.post('/api/ai-agents', 
  authenticateToken,
  checkPlanAccess(['ai_agents']),
  checkCredits(20),
  async (req, res) => {
    try {
      const agentData = { ...req.body, user_id: req.user.id }
      const agent = await DatabaseService.createAIAgent(agentData)

      // Deduct credits
      await DatabaseService.deductCredits(req.user.id, 20, 'ai_agents', `Created agent: ${agent.name}`)

      res.status(201).json(agent)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

// ===== E-COMMERCE ROUTES =====

// Get stores
app.get('/api/stores', authenticateToken, async (req, res) => {
  try {
    const { data: stores, error } = await supabase
      .from('stores')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('is_active', true)

    if (error) throw error
    res.json(stores)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Create store
app.post('/api/stores', authenticateToken, async (req, res) => {
  try {
    const storeData = { ...req.body, user_id: req.user.id }
    const store = await DatabaseService.createStore(storeData)
    res.status(201).json(store)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Get products
app.get('/api/products', authenticateToken, async (req, res) => {
  try {
    const { store_id } = req.query
    const products = await DatabaseService.getProducts(req.user.id, store_id as string)
    res.json(products)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Import product (from dropshipping APIs)
app.post('/api/products/import', 
  authenticateToken,
  checkPlanAccess(['product_scraper']),
  checkCredits(3),
  async (req, res) => {
    try {
      const { external_id, store_id, source } = req.body
      
      // TODO: Integrate with CJ Dropshipping / DSers API
      // For now, create a mock product
      const productData = {
        user_id: req.user.id,
        store_id,
        external_id,
        title: 'Imported Product',
        description: 'Product imported from ' + source,
        price: 29.99,
        status: 'draft'
      }

      const product = await DatabaseService.createProduct(productData)

      // Deduct credits
      await DatabaseService.deductCredits(req.user.id, 3, 'product_scraper', `Imported product: ${external_id}`)

      res.status(201).json(product)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

// ===== CAMPAIGN ROUTES =====

// Get campaigns
app.get('/api/campaigns', authenticateToken, async (req, res) => {
  try {
    const { platform } = req.query
    const campaigns = await DatabaseService.getCampaigns(req.user.id, platform as string)
    res.json(campaigns)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Create campaign
app.post('/api/campaigns', 
  authenticateToken,
  checkPlanAccess(['facebook_ads']),
  checkCredits(15),
  async (req, res) => {
    try {
      const campaignData = { ...req.body, user_id: req.user.id }
      const campaign = await DatabaseService.createCampaign(campaignData)

      // Deduct credits
      await DatabaseService.deductCredits(req.user.id, 15, 'facebook_ads', `Created campaign: ${campaign.name}`)

      res.status(201).json(campaign)
    } catch (error: any) {
      res.status(500).json({ error: error.message })
    }
  }
)

// ===== ANALYTICS ROUTES =====

// Get user analytics
app.get('/api/analytics', authenticateToken, async (req, res) => {
  try {
    const { start_date, end_date } = req.query
    const analytics = await DatabaseService.getUserAnalytics(
      req.user.id,
      start_date as string,
      end_date as string
    )
    res.json(analytics)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Error handling middleware
app.use((error: any, req: any, res: any, next: any) => {
  console.error('Server error:', error)
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`NexusOne API Server running on port ${PORT}`)
})

export default app