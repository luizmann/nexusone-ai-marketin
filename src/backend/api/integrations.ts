/**
 * Backend API Routes for CJ Dropshipping and WhatsApp Business
 * 
 * This file contains Express.js route handlers for all backend API endpoints
 * supporting CJ Dropshipping and WhatsApp Business integrations.
 */

import express from 'express'
import { createCJDropshippingService } from '../integrations/cj-dropshipping'
import { createWhatsAppBusinessService } from '../integrations/whatsapp-business'
import { verifyJWT, requireAuth } from '../middleware/auth'
import { validateRequest } from '../middleware/validation'
import { rateLimiter } from '../middleware/rate-limiter'

const router = express.Router()

// Apply authentication and rate limiting to all routes
router.use(verifyJWT)
router.use(rateLimiter)

// ==================== CJ DROPSHIPPING ROUTES ====================

/**
 * GET /api/cj/products
 * Get product list with pagination and filters
 */
router.get('/cj/products', requireAuth, async (req, res) => {
  try {
    const { pageNum, pageSize, categoryId, keyword, sortBy, priceMin, priceMax } = req.query

    const cjService = createCJDropshippingService({
      accessToken: process.env.CJ_ACCESS_TOKEN || '',
      email: process.env.CJ_EMAIL || '',
      password: process.env.CJ_PASSWORD || ''
    })

    // Authenticate if no token
    if (!process.env.CJ_ACCESS_TOKEN) {
      await cjService.authenticate()
    }

    const result = await cjService.getProducts({
      pageNum: pageNum ? parseInt(pageNum as string) : 1,
      pageSize: pageSize ? parseInt(pageSize as string) : 20,
      categoryId: categoryId as string,
      keyword: keyword as string,
      sortBy: sortBy as 'price' | 'sales' | 'newest',
      priceMin: priceMin ? parseFloat(priceMin as string) : undefined,
      priceMax: priceMax ? parseFloat(priceMax as string) : undefined
    })

    res.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('CJ get products error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products'
    })
  }
})

/**
 * GET /api/cj/products/:productId
 * Get detailed product information
 */
router.get('/cj/products/:productId', requireAuth, async (req, res) => {
  try {
    const { productId } = req.params

    const cjService = createCJDropshippingService({
      accessToken: process.env.CJ_ACCESS_TOKEN || '',
      email: process.env.CJ_EMAIL || '',
      password: process.env.CJ_PASSWORD || ''
    })

    if (!process.env.CJ_ACCESS_TOKEN) {
      await cjService.authenticate()
    }

    const product = await cjService.getProductDetails(productId)

    res.json({
      success: true,
      data: product
    })
  } catch (error) {
    console.error('CJ get product details error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product details'
    })
  }
})

/**
 * POST /api/cj/import-products
 * Import products to catalog
 */
router.post('/cj/import-products', requireAuth, validateRequest({
  body: {
    productIds: { type: 'array', required: true }
  }
}), async (req, res) => {
  try {
    const { productIds } = req.body
    const userId = req.user.id

    const cjService = createCJDropshippingService({
      accessToken: process.env.CJ_ACCESS_TOKEN || '',
      email: process.env.CJ_EMAIL || '',
      password: process.env.CJ_PASSWORD || ''
    })

    if (!process.env.CJ_ACCESS_TOKEN) {
      await cjService.authenticate()
    }

    await cjService.importProductsToCatalog(productIds, userId)

    res.json({
      success: true,
      message: 'Products imported successfully'
    })
  } catch (error) {
    console.error('CJ import products error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to import products'
    })
  }
})

/**
 * POST /api/cj/orders
 * Create order on CJ Dropshipping
 */
router.post('/cj/orders', requireAuth, validateRequest({
  body: {
    clientOrderId: { type: 'string', required: true },
    products: { type: 'array', required: true },
    shippingAddress: { type: 'object', required: true }
  }
}), async (req, res) => {
  try {
    const { clientOrderId, products, shippingAddress } = req.body
    const userId = req.user.id

    const cjService = createCJDropshippingService({
      accessToken: process.env.CJ_ACCESS_TOKEN || '',
      email: process.env.CJ_EMAIL || '',
      password: process.env.CJ_PASSWORD || ''
    })

    if (!process.env.CJ_ACCESS_TOKEN) {
      await cjService.authenticate()
    }

    const order = await cjService.createOrder({
      clientOrderId,
      products,
      shippingAddress,
      userId
    })

    res.json({
      success: true,
      data: order
    })
  } catch (error) {
    console.error('CJ create order error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create order'
    })
  }
})

/**
 * GET /api/cj/orders/:orderNumber
 * Get order status and tracking
 */
router.get('/cj/orders/:orderNumber', requireAuth, async (req, res) => {
  try {
    const { orderNumber } = req.params

    const cjService = createCJDropshippingService({
      accessToken: process.env.CJ_ACCESS_TOKEN || '',
      email: process.env.CJ_EMAIL || '',
      password: process.env.CJ_PASSWORD || ''
    })

    if (!process.env.CJ_ACCESS_TOKEN) {
      await cjService.authenticate()
    }

    const order = await cjService.getOrderStatus(orderNumber)

    res.json({
      success: true,
      data: order
    })
  } catch (error) {
    console.error('CJ get order status error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get order status'
    })
  }
})

/**
 * POST /api/cj/shipping-cost
 * Calculate shipping cost
 */
router.post('/cj/shipping-cost', requireAuth, validateRequest({
  body: {
    products: { type: 'array', required: true },
    country: { type: 'string', required: true }
  }
}), async (req, res) => {
  try {
    const { products, country, state, city } = req.body

    const cjService = createCJDropshippingService({
      accessToken: process.env.CJ_ACCESS_TOKEN || '',
      email: process.env.CJ_EMAIL || '',
      password: process.env.CJ_PASSWORD || ''
    })

    if (!process.env.CJ_ACCESS_TOKEN) {
      await cjService.authenticate()
    }

    const shippingCost = await cjService.calculateShippingCost({
      products,
      country,
      state,
      city
    })

    res.json({
      success: true,
      data: shippingCost
    })
  } catch (error) {
    console.error('CJ calculate shipping cost error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to calculate shipping cost'
    })
  }
})

/**
 * GET /api/cj/trending-products
 * Get trending/hot products
 */
router.get('/cj/trending-products', requireAuth, async (req, res) => {
  try {
    const { limit } = req.query

    const cjService = createCJDropshippingService({
      accessToken: process.env.CJ_ACCESS_TOKEN || '',
      email: process.env.CJ_EMAIL || '',
      password: process.env.CJ_PASSWORD || ''
    })

    if (!process.env.CJ_ACCESS_TOKEN) {
      await cjService.authenticate()
    }

    const products = await cjService.getTrendingProducts(
      limit ? parseInt(limit as string) : 50
    )

    res.json({
      success: true,
      data: products
    })
  } catch (error) {
    console.error('CJ get trending products error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trending products'
    })
  }
})

/**
 * GET /api/cj/categories
 * Get product categories
 */
router.get('/cj/categories', requireAuth, async (req, res) => {
  try {
    const cjService = createCJDropshippingService({
      accessToken: process.env.CJ_ACCESS_TOKEN || '',
      email: process.env.CJ_EMAIL || '',
      password: process.env.CJ_PASSWORD || ''
    })

    if (!process.env.CJ_ACCESS_TOKEN) {
      await cjService.authenticate()
    }

    const categories = await cjService.getCategories()

    res.json({
      success: true,
      data: categories
    })
  } catch (error) {
    console.error('CJ get categories error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories'
    })
  }
})

// ==================== WHATSAPP BUSINESS ROUTES ====================

/**
 * POST /api/whatsapp/send-message
 * Send text message
 */
router.post('/whatsapp/send-message', requireAuth, validateRequest({
  body: {
    to: { type: 'string', required: true },
    message: { type: 'string', required: true },
    previewUrl: { type: 'boolean', required: false }
  }
}), async (req, res) => {
  try {
    const { to, message, previewUrl } = req.body

    const whatsappService = createWhatsAppBusinessService({
      accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
      businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '',
      appId: process.env.WHATSAPP_APP_ID || '',
      appSecret: process.env.WHATSAPP_APP_SECRET || '',
      verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || ''
    })

    const result = await whatsappService.sendTextMessage(to, message, previewUrl)

    res.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('WhatsApp send message error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to send message'
    })
  }
})

/**
 * POST /api/whatsapp/send-template
 * Send template message
 */
router.post('/whatsapp/send-template', requireAuth, validateRequest({
  body: {
    to: { type: 'string', required: true },
    templateName: { type: 'string', required: true },
    languageCode: { type: 'string', required: true },
    components: { type: 'array', required: false }
  }
}), async (req, res) => {
  try {
    const { to, templateName, languageCode, components } = req.body

    const whatsappService = createWhatsAppBusinessService({
      accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
      businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '',
      appId: process.env.WHATSAPP_APP_ID || '',
      appSecret: process.env.WHATSAPP_APP_SECRET || '',
      verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || ''
    })

    const result = await whatsappService.sendTemplateMessage(to, templateName, languageCode, components)

    res.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('WhatsApp send template error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to send template'
    })
  }
})

/**
 * POST /api/whatsapp/send-buttons
 * Send interactive button message
 */
router.post('/whatsapp/send-buttons', requireAuth, validateRequest({
  body: {
    to: { type: 'string', required: true },
    bodyText: { type: 'string', required: true },
    buttons: { type: 'array', required: true },
    headerText: { type: 'string', required: false },
    footerText: { type: 'string', required: false }
  }
}), async (req, res) => {
  try {
    const { to, bodyText, buttons, headerText, footerText } = req.body

    const whatsappService = createWhatsAppBusinessService({
      accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
      businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '',
      appId: process.env.WHATSAPP_APP_ID || '',
      appSecret: process.env.WHATSAPP_APP_SECRET || '',
      verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || ''
    })

    const result = await whatsappService.sendButtonMessage(to, bodyText, buttons, headerText, footerText)

    res.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('WhatsApp send buttons error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to send button message'
    })
  }
})

/**
 * POST /api/whatsapp/send-list
 * Send interactive list message
 */
router.post('/whatsapp/send-list', requireAuth, validateRequest({
  body: {
    to: { type: 'string', required: true },
    bodyText: { type: 'string', required: true },
    buttonText: { type: 'string', required: true },
    sections: { type: 'array', required: true },
    headerText: { type: 'string', required: false },
    footerText: { type: 'string', required: false }
  }
}), async (req, res) => {
  try {
    const { to, bodyText, buttonText, sections, headerText, footerText } = req.body

    const whatsappService = createWhatsAppBusinessService({
      accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
      businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '',
      appId: process.env.WHATSAPP_APP_ID || '',
      appSecret: process.env.WHATSAPP_APP_SECRET || '',
      verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || ''
    })

    const result = await whatsappService.sendListMessage(to, bodyText, buttonText, sections, headerText, footerText)

    res.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('WhatsApp send list error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to send list message'
    })
  }
})

/**
 * POST /api/whatsapp/webhook
 * Handle incoming webhook messages
 */
router.post('/whatsapp/webhook', async (req, res) => {
  try {
    const whatsappService = createWhatsAppBusinessService({
      accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
      businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '',
      appId: process.env.WHATSAPP_APP_ID || '',
      appSecret: process.env.WHATSAPP_APP_SECRET || '',
      verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || ''
    })

    await whatsappService.handleWebhook(req.body)

    res.status(200).send('OK')
  } catch (error) {
    console.error('WhatsApp webhook error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to process webhook'
    })
  }
})

/**
 * GET /api/whatsapp/webhook
 * Verify webhook
 */
router.get('/whatsapp/webhook', (req, res) => {
  const mode = req.query['hub.mode']
  const token = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log('WhatsApp webhook verified')
    res.status(200).send(challenge)
  } else {
    res.status(403).send('Verification failed')
  }
})

/**
 * POST /api/whatsapp/setup-business
 * Setup appointment scheduling for business
 */
router.post('/whatsapp/setup-business', requireAuth, validateRequest({
  body: {
    businessData: { type: 'object', required: true }
  }
}), async (req, res) => {
  try {
    const { businessData } = req.body
    const userId = req.user.id

    const whatsappService = createWhatsAppBusinessService({
      accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
      businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '',
      appId: process.env.WHATSAPP_APP_ID || '',
      appSecret: process.env.WHATSAPP_APP_SECRET || '',
      verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || ''
    })

    await whatsappService.setupBusinessScheduling(userId, businessData)

    res.json({
      success: true,
      message: 'Business scheduling setup successfully'
    })
  } catch (error) {
    console.error('WhatsApp setup business error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to setup business scheduling'
    })
  }
})

/**
 * GET /api/whatsapp/available-slots
 * Get available appointment slots
 */
router.get('/whatsapp/available-slots', requireAuth, async (req, res) => {
  try {
    const { businessId, daysAhead } = req.query

    const whatsappService = createWhatsAppBusinessService({
      accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
      businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '',
      appId: process.env.WHATSAPP_APP_ID || '',
      appSecret: process.env.WHATSAPP_APP_SECRET || '',
      verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || ''
    })

    // Get business config first
    const businessConfig = await whatsappService.getBusinessConfig(businessId as string)
    
    if (!businessConfig) {
      return res.status(404).json({
        success: false,
        error: 'Business configuration not found'
      })
    }

    const slots = await whatsappService.getAvailableSlots(
      businessConfig,
      daysAhead ? parseInt(daysAhead as string) : 7
    )

    res.json({
      success: true,
      data: slots
    })
  } catch (error) {
    console.error('WhatsApp get available slots error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get available slots'
    })
  }
})

/**
 * POST /api/whatsapp/book-appointment
 * Book appointment slot
 */
router.post('/whatsapp/book-appointment', requireAuth, validateRequest({
  body: {
    phoneNumber: { type: 'string', required: true },
    slotId: { type: 'string', required: true },
    serviceId: { type: 'string', required: true },
    customerName: { type: 'string', required: false },
    notes: { type: 'string', required: false }
  }
}), async (req, res) => {
  try {
    const { phoneNumber, slotId, serviceId, customerName, notes } = req.body

    const whatsappService = createWhatsAppBusinessService({
      accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
      phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
      businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '',
      appId: process.env.WHATSAPP_APP_ID || '',
      appSecret: process.env.WHATSAPP_APP_SECRET || '',
      verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || ''
    })

    const success = await whatsappService.bookAppointment(
      phoneNumber,
      slotId,
      serviceId,
      customerName,
      notes
    )

    res.json({
      success,
      message: success ? 'Appointment booked successfully' : 'Failed to book appointment'
    })
  } catch (error) {
    console.error('WhatsApp book appointment error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to book appointment'
    })
  }
})

export default router