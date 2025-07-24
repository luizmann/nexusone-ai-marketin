import crypto from 'crypto'
import jwt from 'jsonwebtoken'

// Encryption utilities for API keys and sensitive data
export class EncryptionUtils {
  private static readonly algorithm = 'aes-256-gcm'
  private static readonly keyLength = 32
  
  static encrypt(text: string, secretKey?: string): string {
    const key = secretKey || process.env.ENCRYPTION_KEY!
    if (!key) throw new Error('Encryption key not provided')
    
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipher(this.algorithm, key)
    
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    const authTag = cipher.getAuthTag()
    
    return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted
  }
  
  static decrypt(encryptedData: string, secretKey?: string): string {
    const key = secretKey || process.env.ENCRYPTION_KEY!
    if (!key) throw new Error('Encryption key not provided')
    
    const parts = encryptedData.split(':')
    if (parts.length !== 3) throw new Error('Invalid encrypted data format')
    
    const iv = Buffer.from(parts[0], 'hex')
    const authTag = Buffer.from(parts[1], 'hex')
    const encrypted = parts[2]
    
    const decipher = crypto.createDecipher(this.algorithm, key)
    decipher.setAuthTag(authTag)
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    return decrypted
  }
  
  static generateApiKey(): string {
    return crypto.randomBytes(32).toString('hex')
  }
  
  static hashPassword(password: string, saltRounds = 12): Promise<string> {
    const bcrypt = require('bcryptjs')
    return bcrypt.hash(password, saltRounds)
  }
  
  static comparePassword(password: string, hash: string): Promise<boolean> {
    const bcrypt = require('bcryptjs')
    return bcrypt.compare(password, hash)
  }
}

// JWT utilities
export class JWTUtils {
  static generateToken(payload: object, expiresIn = '7d'): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn })
  }
  
  static verifyToken(token: string): any {
    return jwt.verify(token, process.env.JWT_SECRET!)
  }
  
  static generateRefreshToken(payload: object): string {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: '30d' })
  }
}

// Validation utilities
export class ValidationUtils {
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
    return phoneRegex.test(phone)
  }
  
  static isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }
  
  static sanitizeHtml(html: string): string {
    // Basic HTML sanitization - in production use a library like DOMPurify
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '')
  }
  
  static validateCreditDeduction(amount: number, userCredits: number): boolean {
    return amount > 0 && amount <= userCredits
  }
  
  static validatePlanAccess(userPlan: string, requiredModules: string[]): boolean {
    const planModules = {
      free: ['magic_pages', 'product_scraper', 'crm', 'generate_income', 'whatsapp_bot'],
      pro: ['magic_pages', 'video_creator', 'facebook_ads', 'product_scraper', 'crm', 'generate_income', 'whatsapp_bot', 'ai_agents'],
      premium: ['magic_pages', 'video_creator', 'facebook_ads', 'tiktok_ads', 'product_scraper', 'crm', 'generate_income', 'whatsapp_bot', 'ai_agents', 'youtube_automation']
    }
    
    const userModules = planModules[userPlan] || []
    return requiredModules.every(module => userModules.includes(module))
  }
}

// API response utilities
export class ResponseUtils {
  static success(data: any, message?: string) {
    return {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString()
    }
  }
  
  static error(message: string, code?: string, details?: any) {
    return {
      success: false,
      error: message,
      code,
      details,
      timestamp: new Date().toISOString()
    }
  }
  
  static paginated(data: any[], page: number, limit: number, total: number) {
    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      timestamp: new Date().toISOString()
    }
  }
}

// File handling utilities
export class FileUtils {
  static validateFileType(filename: string, allowedTypes: string[]): boolean {
    const extension = filename.split('.').pop()?.toLowerCase()
    return extension ? allowedTypes.includes(extension) : false
  }
  
  static validateFileSize(size: number, maxSize: number): boolean {
    return size <= maxSize
  }
  
  static generateUniqueFilename(originalName: string): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 15)
    const extension = originalName.split('.').pop()
    return `${timestamp}_${random}.${extension}`
  }
  
  static getFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }
}

// Date and time utilities
export class DateUtils {
  static formatDate(date: Date, format = 'YYYY-MM-DD'): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    
    return format
      .replace('YYYY', year.toString())
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds)
  }
  
  static addDays(date: Date, days: number): Date {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }
  
  static getDaysBetween(date1: Date, date2: Date): number {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime())
    return Math.ceil(timeDiff / (1000 * 3600 * 24))
  }
  
  static isExpired(expiryDate: Date): boolean {
    return new Date() > expiryDate
  }
}

// String utilities
export class StringUtils {
  static generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
  
  static truncate(text: string, length: number, suffix = '...'): string {
    if (text.length <= length) return text
    return text.substring(0, length - suffix.length) + suffix
  }
  
  static capitalizeWords(text: string): string {
    return text.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )
  }
  
  static extractHashtags(text: string): string[] {
    const hashtagRegex = /#[\w]+/g
    return text.match(hashtagRegex) || []
  }
  
  static extractUrls(text: string): string[] {
    const urlRegex = /https?:\/\/[^\s]+/g
    return text.match(urlRegex) || []
  }
}

// Number utilities
export class NumberUtils {
  static formatCurrency(amount: number, currency = 'USD', locale = 'en-US'): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    }).format(amount)
  }
  
  static formatNumber(number: number, locale = 'en-US'): string {
    return new Intl.NumberFormat(locale).format(number)
  }
  
  static roundToDecimals(number: number, decimals: number): number {
    return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals)
  }
  
  static generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}

// Language and localization utilities
export class LocalizationUtils {
  static getSupportedLanguages(): string[] {
    return ['en', 'es', 'pt', 'ar', 'he']
  }
  
  static isRTLLanguage(language: string): boolean {
    return ['ar', 'he'].includes(language)
  }
  
  static getLanguageName(code: string): string {
    const languageNames = {
      en: 'English',
      es: 'Español',
      pt: 'Português',
      ar: 'العربية',
      he: 'עברית'
    }
    return languageNames[code] || code
  }
  
  static formatDateForLocale(date: Date, locale: string): string {
    return new Intl.DateTimeFormat(locale).format(date)
  }
  
  static getCurrencyForCountry(countryCode: string): string {
    const currencyMap = {
      US: 'USD',
      GB: 'GBP',
      EU: 'EUR',
      BR: 'BRL',
      ES: 'EUR',
      SA: 'SAR',
      IL: 'ILS'
    }
    return currencyMap[countryCode] || 'USD'
  }
}

// Analytics utilities
export class AnalyticsUtils {
  static calculateConversionRate(conversions: number, visitors: number): number {
    if (visitors === 0) return 0
    return Math.round((conversions / visitors) * 100 * 100) / 100
  }
  
  static calculateAverageOrderValue(totalRevenue: number, orderCount: number): number {
    if (orderCount === 0) return 0
    return Math.round((totalRevenue / orderCount) * 100) / 100
  }
  
  static calculateGrowthRate(currentValue: number, previousValue: number): number {
    if (previousValue === 0) return 0
    return Math.round(((currentValue - previousValue) / previousValue) * 100 * 100) / 100
  }
  
  static getTimeRangeFilter(range: string): { start: Date; end: Date } {
    const now = new Date()
    const end = new Date(now)
    let start = new Date(now)
    
    switch (range) {
      case 'today':
        start.setHours(0, 0, 0, 0)
        break
      case 'yesterday':
        start.setDate(start.getDate() - 1)
        start.setHours(0, 0, 0, 0)
        end.setDate(end.getDate() - 1)
        end.setHours(23, 59, 59, 999)
        break
      case 'week':
        start.setDate(start.getDate() - 7)
        break
      case 'month':
        start.setMonth(start.getMonth() - 1)
        break
      case 'quarter':
        start.setMonth(start.getMonth() - 3)
        break
      case 'year':
        start.setFullYear(start.getFullYear() - 1)
        break
      default:
        start.setDate(start.getDate() - 30)
    }
    
    return { start, end }
  }
}

// Error handling utilities
export class ErrorUtils {
  static createError(message: string, statusCode: number, code?: string): Error {
    const error = new Error(message)
    error.name = 'APIError'
    ;(error as any).statusCode = statusCode
    ;(error as any).code = code
    return error
  }
  
  static isOperationalError(error: Error): boolean {
    return error.name === 'APIError' || error.name === 'ValidationError'
  }
  
  static logError(error: Error, context?: any): void {
    console.error('Error:', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    })
  }
}

// Export all utilities
export {
  EncryptionUtils,
  JWTUtils,
  ValidationUtils,
  ResponseUtils,
  FileUtils,
  DateUtils,
  StringUtils,
  NumberUtils,
  LocalizationUtils,
  AnalyticsUtils,
  ErrorUtils
}