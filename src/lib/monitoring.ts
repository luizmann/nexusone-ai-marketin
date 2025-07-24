/**
 * Monitoring service utilities for NexusOne platform
 * Provides functions for tracking system health, user analytics, and performance metrics
 */

export interface SystemHealthMetrics {
  uptime: number
  responseTime: number
  errorRate: number
  cpuUsage: number
  memoryUsage: number
  diskUsage: number
  networkThroughput: number
  dbConnections: number
  apiCalls: number
  status: 'healthy' | 'warning' | 'error'
}

export interface UserAnalyticsMetrics {
  totalUsers: number
  activeUsers: number
  newUsers: number
  returningUsers: number
  sessionDuration: number
  pageViews: number
  bounceRate: number
  conversionRate: number
  revenueGrowth: number
  churnRate: number
}

export interface PerformanceMetrics {
  apiResponseTimes: Record<string, number>
  successRates: Record<string, number>
  throughput: number
  errorCount: number
  creditUsage: number
  storageUsed: number
  bandwidthUsed: number
}

export interface Alert {
  id: string
  type: 'error' | 'warning' | 'info'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  message: string
  timestamp: Date
  resolved: boolean
  acknowledgedBy?: string
  resolutionTime?: Date
  category: 'system' | 'performance' | 'security' | 'user'
}

/**
 * Generate mock system health metrics for dashboard display
 */
export function generateSystemHealthMetrics(): SystemHealthMetrics {
  const now = Date.now()
  const baseResponseTime = 200 + Math.random() * 100
  const cpuUsage = 20 + Math.random() * 60
  const memoryUsage = 40 + Math.random() * 40
  
  return {
    uptime: 99.5 + Math.random() * 0.48,
    responseTime: Math.floor(baseResponseTime),
    errorRate: Math.random() * 2,
    cpuUsage: Math.floor(cpuUsage),
    memoryUsage: Math.floor(memoryUsage),
    diskUsage: 30 + Math.random() * 40,
    networkThroughput: 100 + Math.random() * 500,
    dbConnections: Math.floor(5 + Math.random() * 20),
    apiCalls: Math.floor(1000 + Math.random() * 2000),
    status: cpuUsage > 80 || memoryUsage > 85 ? 'warning' : 'healthy'
  }
}

/**
 * Generate mock user analytics metrics
 */
export function generateUserAnalyticsMetrics(): UserAnalyticsMetrics {
  const totalUsers = 1247 + Math.floor(Math.random() * 100)
  const activeUsers = Math.floor(totalUsers * 0.3 + Math.random() * totalUsers * 0.1)
  
  return {
    totalUsers,
    activeUsers,
    newUsers: Math.floor(50 + Math.random() * 100),
    returningUsers: Math.floor(activeUsers * 0.7),
    sessionDuration: 15 + Math.random() * 10,
    pageViews: Math.floor(8000 + Math.random() * 2000),
    bounceRate: 25 + Math.random() * 15,
    conversionRate: 2.5 + Math.random() * 2,
    revenueGrowth: 8 + Math.random() * 10,
    churnRate: 1.5 + Math.random() * 2
  }
}

/**
 * Generate mock performance metrics for various APIs and services
 */
export function generatePerformanceMetrics(): PerformanceMetrics {
  return {
    apiResponseTimes: {
      'OpenAI API': 200 + Math.random() * 100,
      'Facebook API': 400 + Math.random() * 300,
      'Supabase': 100 + Math.random() * 100,
      'Payment API': 250 + Math.random() * 150,
      'WhatsApp API': 300 + Math.random() * 200,
      'TikTok API': 500 + Math.random() * 300
    },
    successRates: {
      'API Calls': 98.5 + Math.random() * 1.4,
      'Payment Processing': 97.8 + Math.random() * 1.5,
      'Content Generation': 99.2 + Math.random() * 0.7,
      'Email Delivery': 94 + Math.random() * 4,
      'SMS Delivery': 96 + Math.random() * 3,
      'Image Processing': 98 + Math.random() * 1.8
    },
    throughput: Math.floor(15 + Math.random() * 30),
    errorCount: Math.floor(Math.random() * 10),
    creditUsage: Math.floor(1000 + Math.random() * 500),
    storageUsed: 2.1 + Math.random() * 1.5,
    bandwidthUsed: 120 + Math.random() * 80
  }
}

/**
 * Generate mock alert data for system monitoring
 */
export function generateMockAlerts(): Alert[] {
  const alertTypes = ['error', 'warning', 'info'] as const
  const severities = ['low', 'medium', 'high', 'critical'] as const
  const categories = ['system', 'performance', 'security', 'user'] as const
  
  const mockAlerts = [
    {
      type: 'warning' as const,
      severity: 'medium' as const,
      title: 'High API Response Time',
      message: 'Facebook API response time increased by 25% in the last hour',
      category: 'performance' as const
    },
    {
      type: 'info' as const,
      severity: 'low' as const,
      title: 'Database Backup Completed',
      message: 'Scheduled daily backup completed successfully at 2:00 AM',
      category: 'system' as const
    },
    {
      type: 'error' as const,
      severity: 'high' as const,
      title: 'Payment Processing Failed',
      message: 'Payment processing failed for user #1234 - credit card declined',
      category: 'user' as const
    },
    {
      type: 'warning' as const,
      severity: 'medium' as const,
      title: 'High Memory Usage',
      message: 'Server memory usage reached 85% - consider scaling resources',
      category: 'system' as const
    },
    {
      type: 'info' as const,
      severity: 'low' as const,
      title: 'New User Registration Peak',
      message: '50% increase in new user registrations compared to yesterday',
      category: 'user' as const
    }
  ]
  
  return mockAlerts.map((alert, index) => ({
    id: `alert-${index + 1}`,
    ...alert,
    timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
    resolved: Math.random() > 0.6,
    acknowledgedBy: Math.random() > 0.5 ? 'admin@nexusone.ai' : undefined,
    resolutionTime: Math.random() > 0.7 ? new Date(Date.now() - Math.random() * 12 * 60 * 60 * 1000) : undefined
  }))
}

/**
 * Calculate system health score based on various metrics
 */
export function calculateHealthScore(metrics: SystemHealthMetrics): number {
  const weights = {
    uptime: 0.3,
    responseTime: 0.2,
    errorRate: 0.2,
    cpuUsage: 0.15,
    memoryUsage: 0.15
  }
  
  const normalizedMetrics = {
    uptime: Math.min(metrics.uptime / 100, 1),
    responseTime: Math.max(0, 1 - (metrics.responseTime - 100) / 500),
    errorRate: Math.max(0, 1 - metrics.errorRate / 5),
    cpuUsage: Math.max(0, 1 - metrics.cpuUsage / 100),
    memoryUsage: Math.max(0, 1 - metrics.memoryUsage / 100)
  }
  
  return Math.round(
    (normalizedMetrics.uptime * weights.uptime +
     normalizedMetrics.responseTime * weights.responseTime +
     normalizedMetrics.errorRate * weights.errorRate +
     normalizedMetrics.cpuUsage * weights.cpuUsage +
     normalizedMetrics.memoryUsage * weights.memoryUsage) * 100
  )
}

/**
 * Format bytes to human readable format
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Format milliseconds to human readable duration
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`
  if (ms < 60000) return `${Math.round(ms / 1000)}s`
  if (ms < 3600000) return `${Math.round(ms / 60000)}m`
  return `${Math.round(ms / 3600000)}h`
}

/**
 * Get status color based on metric value and thresholds
 */
export function getStatusColor(value: number, thresholds: { warning: number; error: number }): string {
  if (value >= thresholds.error) return 'text-red-600'
  if (value >= thresholds.warning) return 'text-yellow-600'
  return 'text-green-600'
}

/**
 * Monitor real-time system metrics (would connect to actual monitoring APIs in production)
 */
export class MonitoringService {
  private static instance: MonitoringService
  private updateCallbacks: Array<(data: any) => void> = []
  private intervalId: NodeJS.Timeout | null = null
  
  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService()
    }
    return MonitoringService.instance
  }
  
  subscribe(callback: (data: any) => void) {
    this.updateCallbacks.push(callback)
    
    if (!this.intervalId) {
      this.startMonitoring()
    }
  }
  
  unsubscribe(callback: (data: any) => void) {
    this.updateCallbacks = this.updateCallbacks.filter(cb => cb !== callback)
    
    if (this.updateCallbacks.length === 0 && this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }
  
  private startMonitoring() {
    this.intervalId = setInterval(() => {
      const data = {
        systemHealth: generateSystemHealthMetrics(),
        userAnalytics: generateUserAnalyticsMetrics(),
        performance: generatePerformanceMetrics(),
        timestamp: new Date()
      }
      
      this.updateCallbacks.forEach(callback => callback(data))
    }, 5000) // Update every 5 seconds
  }
  
  // Method to send alerts to external monitoring services
  async sendAlert(alert: Omit<Alert, 'id' | 'timestamp'>): Promise<void> {
    // In production, this would send to services like PagerDuty, Slack, etc.
    console.log('Alert sent:', alert)
  }
  
  // Method to log metrics to external analytics services
  async logMetrics(metrics: any): Promise<void> {
    // In production, this would send to services like DataDog, New Relic, etc.
    console.log('Metrics logged:', metrics)
  }
}