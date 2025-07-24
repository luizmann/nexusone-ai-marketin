import request from 'supertest'
import app from '../api/server'
import { DatabaseService } from '../database/service'

describe('NexusOne API Tests', () => {
  let authToken: string
  let testUserId: string

  beforeAll(async () => {
    // Create test user and get auth token
    const testUser = {
      email: 'test@nexusone.ai',
      password: 'testpassword123',
      first_name: 'Test',
      last_name: 'User'
    }

    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(testUser)

    authToken = registerResponse.body.token
    testUserId = registerResponse.body.user.id
  })

  describe('Authentication', () => {
    test('should register new user', async () => {
      const newUser = {
        email: 'newuser@test.com',
        password: 'password123',
        first_name: 'New',
        last_name: 'User'
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser)

      expect(response.status).toBe(201)
      expect(response.body.success).toBe(true)
      expect(response.body.token).toBeDefined()
      expect(response.body.user.email).toBe(newUser.email)
    })

    test('should login existing user', async () => {
      const credentials = {
        email: 'test@nexusone.ai',
        password: 'testpassword123'
      }

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.token).toBeDefined()
    })

    test('should reject invalid credentials', async () => {
      const credentials = {
        email: 'test@nexusone.ai',
        password: 'wrongpassword'
      }

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)

      expect(response.status).toBe(401)
      expect(response.body.error).toBe('Invalid credentials')
    })
  })

  describe('User Profile', () => {
    test('should get user profile', async () => {
      const response = await request(app)
        .get('/api/user/profile')
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(response.body.email).toBe('test@nexusone.ai')
      expect(response.body.subscription_plan).toBe('free')
    })

    test('should update user profile', async () => {
      const updates = {
        first_name: 'Updated',
        preferred_language: 'es'
      }

      const response = await request(app)
        .put('/api/user/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates)

      expect(response.status).toBe(200)
      expect(response.body.first_name).toBe('Updated')
      expect(response.body.preferred_language).toBe('es')
    })
  })

  describe('Credits System', () => {
    test('should get credit balance', async () => {
      const response = await request(app)
        .get('/api/credits')
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(response.body.balance).toBe(50) // Default free plan credits
      expect(response.body.transactions).toBeDefined()
    })

    test('should purchase credits', async () => {
      const purchaseData = {
        amount: 100,
        payment_method: 'test'
      }

      const response = await request(app)
        .post('/api/credits/purchase')
        .set('Authorization', `Bearer ${authToken}`)
        .send(purchaseData)

      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.new_balance).toBe(150)
    })
  })

  describe('Magic Pages', () => {
    test('should create magic page', async () => {
      const pageData = {
        title: 'Test Landing Page',
        content: {
          headline: 'Amazing Product',
          subheadline: 'Revolutionary solution'
        },
        language: 'en'
      }

      const response = await request(app)
        .post('/api/magic-pages')
        .set('Authorization', `Bearer ${authToken}`)
        .send(pageData)

      expect(response.status).toBe(201)
      expect(response.body.title).toBe(pageData.title)
      expect(response.body.slug).toContain('test-landing-page')
    })

    test('should get user magic pages', async () => {
      const response = await request(app)
        .get('/api/magic-pages')
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
    })

    test('should reject creation with insufficient credits', async () => {
      // Deduct all credits first
      await DatabaseService.deductCredits(testUserId, 150, 'test', 'Clear credits for test')

      const pageData = {
        title: 'Another Page',
        content: { headline: 'Test' }
      }

      const response = await request(app)
        .post('/api/magic-pages')
        .set('Authorization', `Bearer ${authToken}`)
        .send(pageData)

      expect(response.status).toBe(402)
      expect(response.body.error).toBe('Insufficient credits')
    })
  })

  describe('Video Projects', () => {
    beforeEach(async () => {
      // Add credits for video tests
      await DatabaseService.addCredits(testUserId, 100, 'test', 'Credits for video tests')
    })

    test('should create video project', async () => {
      const videoData = {
        title: 'Test Video',
        script: 'Hello, this is a test video script',
        avatar_id: 'anna_costume1_cameraA',
        voice_id: 'pNInz6obpgDQGcFmaJgB',
        language: 'en'
      }

      const response = await request(app)
        .post('/api/video-projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send(videoData)

      expect(response.status).toBe(201)
      expect(response.body.title).toBe(videoData.title)
      expect(response.body.status).toBe('pending')
    })

    test('should get user video projects', async () => {
      const response = await request(app)
        .get('/api/video-projects')
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
    })
  })

  describe('CRM Contacts', () => {
    beforeEach(async () => {
      // Add credits for CRM tests
      await DatabaseService.addCredits(testUserId, 50, 'test', 'Credits for CRM tests')
    })

    test('should create contact', async () => {
      const contactData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        company: 'Test Corp',
        source: 'website'
      }

      const response = await request(app)
        .post('/api/crm/contacts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(contactData)

      expect(response.status).toBe(201)
      expect(response.body.email).toBe(contactData.email)
      expect(response.body.status).toBe('lead')
    })

    test('should get contacts', async () => {
      const response = await request(app)
        .get('/api/crm/contacts')
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
    })

    test('should filter contacts by status', async () => {
      const response = await request(app)
        .get('/api/crm/contacts?status=lead')
        .set('Authorization', `Bearer ${authToken}`)

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
    })
  })

  describe('E-commerce', () => {
    let storeId: string

    beforeEach(async () => {
      // Create test store
      const storeData = {
        name: 'Test Store',
        store_type: 'dropship'
      }

      const storeResponse = await request(app)
        .post('/api/stores')
        .set('Authorization', `Bearer ${authToken}`)
        .send(storeData)

      storeId = storeResponse.body.id
    })

    test('should create store', async () => {
      const storeData = {
        name: 'Another Store',
        domain: 'mystore.com',
        store_type: 'regular'
      }

      const response = await request(app)
        .post('/api/stores')
        .set('Authorization', `Bearer ${authToken}`)
        .send(storeData)

      expect(response.status).toBe(201)
      expect(response.body.name).toBe(storeData.name)
    })

    test('should import product', async () => {
      // Add credits for product import
      await DatabaseService.addCredits(testUserId, 10, 'test', 'Credits for product import')

      const importData = {
        external_id: 'CJ123456',
        store_id: storeId,
        source: 'cj_dropshipping'
      }

      const response = await request(app)
        .post('/api/products/import')
        .set('Authorization', `Bearer ${authToken}`)
        .send(importData)

      expect(response.status).toBe(201)
      expect(response.body.external_id).toBe(importData.external_id)
    })
  })

  describe('Rate Limiting', () => {
    test('should enforce rate limits', async () => {
      // Make many requests to hit rate limit
      const requests = Array(101).fill(null).map(() =>
        request(app)
          .get('/api/user/profile')
          .set('Authorization', `Bearer ${authToken}`)
      )

      const responses = await Promise.all(requests)
      const rateLimitedResponses = responses.filter(res => res.status === 429)

      expect(rateLimitedResponses.length).toBeGreaterThan(0)
    })
  })

  describe('Error Handling', () => {
    test('should handle invalid JSON', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send('invalid json')
        .set('Content-Type', 'application/json')

      expect(response.status).toBe(400)
    })

    test('should handle missing authorization', async () => {
      const response = await request(app)
        .get('/api/user/profile')

      expect(response.status).toBe(401)
      expect(response.body.error).toBe('Access token required')
    })

    test('should handle non-existent routes', async () => {
      const response = await request(app)
        .get('/api/non-existent-endpoint')

      expect(response.status).toBe(404)
      expect(response.body.error).toBe('Route not found')
    })
  })

  afterAll(async () => {
    // Cleanup test data
    await DatabaseService.deleteUser(testUserId)
  })
})