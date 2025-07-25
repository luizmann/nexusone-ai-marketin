/**
 * Backend Middleware for Authentication, Validation, and Rate Limiting
 * 
 * This file contains Express.js middleware functions for securing
 * the backend API endpoints.
 */

import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import rateLimit from 'express-rate-limit'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
)

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

/**
 * JWT Token Verification Middleware
 */
export const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'No authorization header provided'
      })
    }

    const token = authHeader.split(' ')[1] // Bearer <token>
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      })
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      })
    }

    req.user = user
    next()
  } catch (error) {
    console.error('JWT verification error:', error)
    return res.status(401).json({
      success: false,
      error: 'Token verification failed'
    })
  }
}

/**
 * Require authenticated user
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    })
  }
  next()
}

/**
 * Rate limiting middleware
 */
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Different limits for different endpoints
  keyGenerator: (req) => {
    // Use user ID if authenticated, otherwise IP
    return req.user?.id || req.ip
  },
  skip: (req) => {
    // Skip rate limiting for webhook endpoints
    return req.path.includes('/webhook')
  }
})

/**
 * Heavy operation rate limiter (for AI/API calls)
 */
export const heavyOperationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit to 10 heavy operations per minute
  message: {
    success: false,
    error: 'Too many heavy operations, please try again later'
  },
  keyGenerator: (req) => req.user?.id || req.ip
})

/**
 * Request validation middleware
 */
export const validateRequest = (schema: {
  body?: Record<string, { type: string; required?: boolean; min?: number; max?: number }>
  query?: Record<string, { type: string; required?: boolean }>
  params?: Record<string, { type: string; required?: boolean }>
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = []

    // Validate body
    if (schema.body) {
      for (const [field, rules] of Object.entries(schema.body)) {
        const value = req.body?.[field]
        
        if (rules.required && (value === undefined || value === null || value === '')) {
          errors.push(`Field '${field}' is required`)
          continue
        }

        if (value !== undefined && value !== null) {
          if (!validateFieldType(value, rules.type)) {
            errors.push(`Field '${field}' must be of type ${rules.type}`)
          }

          if (rules.type === 'string' && typeof value === 'string') {
            if (rules.min && value.length < rules.min) {
              errors.push(`Field '${field}' must be at least ${rules.min} characters`)
            }
            if (rules.max && value.length > rules.max) {
              errors.push(`Field '${field}' must be at most ${rules.max} characters`)
            }
          }

          if (rules.type === 'number' && typeof value === 'number') {
            if (rules.min && value < rules.min) {
              errors.push(`Field '${field}' must be at least ${rules.min}`)
            }
            if (rules.max && value > rules.max) {
              errors.push(`Field '${field}' must be at most ${rules.max}`)
            }
          }
        }
      }
    }

    // Validate query parameters
    if (schema.query) {
      for (const [field, rules] of Object.entries(schema.query)) {
        const value = req.query[field]
        
        if (rules.required && !value) {
          errors.push(`Query parameter '${field}' is required`)
          continue
        }

        if (value && !validateFieldType(value, rules.type)) {
          errors.push(`Query parameter '${field}' must be of type ${rules.type}`)
        }
      }
    }

    // Validate URL parameters
    if (schema.params) {
      for (const [field, rules] of Object.entries(schema.params)) {
        const value = req.params[field]
        
        if (rules.required && !value) {
          errors.push(`URL parameter '${field}' is required`)
          continue
        }

        if (value && !validateFieldType(value, rules.type)) {
          errors.push(`URL parameter '${field}' must be of type ${rules.type}`)
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      })
    }

    next()
  }
}

/**
 * Validate field type
 */
function validateFieldType(value: any, expectedType: string): boolean {
  switch (expectedType) {
    case 'string':
      return typeof value === 'string'
    case 'number':
      return typeof value === 'number' && !isNaN(value)
    case 'boolean':
      return typeof value === 'boolean'
    case 'array':
      return Array.isArray(value)
    case 'object':
      return typeof value === 'object' && value !== null && !Array.isArray(value)
    case 'email':
      return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    case 'url':
      return typeof value === 'string' && /^https?:\/\/.+/.test(value)
    case 'uuid':
      return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
    case 'phone':
      return typeof value === 'string' && /^\+?[\d\s\-\(\)]{10,}$/.test(value)
    default:
      return true
  }
}

/**
 * API Key validation middleware (for external webhooks)
 */
export const validateAPIKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string
  const expectedKey = process.env.API_KEY

  if (!apiKey || !expectedKey) {
    return res.status(401).json({
      success: false,
      error: 'API key required'
    })
  }

  if (apiKey !== expectedKey) {
    return res.status(401).json({
      success: false,
      error: 'Invalid API key'
    })
  }

  next()
}

/**
 * CORS middleware
 */
export const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = [
    'http://localhost:3000',
    'https://nexusone.ai',
    'https://app.nexusone.ai',
    process.env.FRONTEND_URL
  ].filter(Boolean)

  const origin = req.headers.origin
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key')
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
    return
  }

  next()
}

/**
 * Error handling middleware
 */
export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  console.error('API Error:', error)

  // Supabase errors
  if (error.code && error.message) {
    return res.status(400).json({
      success: false,
      error: error.message,
      code: error.code
    })
  }

  // Validation errors
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: error.details
    })
  }

  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    })
  }

  // Rate limit errors
  if (error.status === 429) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests'
    })
  }

  // Default error
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { details: error.message })
  })
}

/**
 * Request logging middleware
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - start
    const userId = req.user?.id || 'anonymous'
    
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms - User: ${userId}`)

    // Log to analytics if it's an integration endpoint
    if (req.path.startsWith('/api/') && req.user) {
      // This would be handled by the integration service
      // integrationService.logAPICall(req, res, duration)
    }
  })

  next()
}

/**
 * Credit validation middleware
 */
export const validateCredits = (creditCost: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        })
      }

      // Get user's current credit balance
      const { data: userProfile, error } = await supabase
        .from('user_profiles')
        .select('credits')
        .eq('user_id', req.user.id)
        .single()

      if (error) {
        return res.status(500).json({
          success: false,
          error: 'Failed to check credit balance'
        })
      }

      if (!userProfile || userProfile.credits < creditCost) {
        return res.status(402).json({
          success: false,
          error: 'Insufficient credits',
          required: creditCost,
          available: userProfile?.credits || 0
        })
      }

      // Store credit cost in request for later deduction
      req.creditCost = creditCost
      next()
    } catch (error) {
      console.error('Credit validation error:', error)
      return res.status(500).json({
        success: false,
        error: 'Credit validation failed'
      })
    }
  }
}

/**
 * Plan validation middleware
 */
export const validatePlan = (requiredPlans: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        })
      }

      // Get user's current plan
      const { data: userProfile, error } = await supabase
        .from('user_profiles')
        .select('plan')
        .eq('user_id', req.user.id)
        .single()

      if (error) {
        return res.status(500).json({
          success: false,
          error: 'Failed to check user plan'
        })
      }

      const userPlan = userProfile?.plan || 'free'

      if (!requiredPlans.includes(userPlan)) {
        return res.status(403).json({
          success: false,
          error: 'Plan upgrade required',
          required: requiredPlans,
          current: userPlan
        })
      }

      next()
    } catch (error) {
      console.error('Plan validation error:', error)
      return res.status(500).json({
        success: false,
        error: 'Plan validation failed'
      })
    }
  }
}

// Extend Express Request type for credit cost
declare global {
  namespace Express {
    interface Request {
      creditCost?: number
    }
  }
}