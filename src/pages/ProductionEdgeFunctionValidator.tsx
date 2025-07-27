import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Activity, 
  Zap, 
  Database,
  Cloud,
  Brain,
  Video,
  ShoppingCart,
  MessageSquare,
  BarChart3,
  Image
} from '@phosphor-icons/react'
import { useLanguage } from '@/contexts/LanguageContext'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://hbfgtdxvlbkvkrjqxnac.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiZmd0ZHh2bGJrdmtyanh4bmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ2NzI4MDAsImV4cCI6MjAyMDI0ODgwMH0.XYKhOW-Q5kz9O2P7vX1cFm3d8jR6sN0tA9wK4eL7mGp'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

interface TestResult {
  name: string
  status: 'success' | 'error' | 'pending' | 'running'
  responseTime?: number
  message?: string
  data?: any
}

interface EdgeFunction {
  name: string
  endpoint: string
  category: string
  icon: any
  description: string
  testPayload: any
}

const edgeFunctions: EdgeFunction[] = [
  {
    name: 'AI Content Generation',
    endpoint: 'ai-content-generation',
    category: 'AI Generation',
    icon: Brain,
    description: 'Complete AI pipeline for product validation',
    testPayload: {
      stepId: 'product-analysis',
      productData: {
        name: 'Smart Wireless Earbuds',
        description: 'Premium wireless earbuds with noise cancellation',
        price: 89.99,
        category: 'Electronics',
        targetAudience: 'Tech enthusiasts',
        keyFeatures: ['Noise cancellation', 'Wireless charging', '30-hour battery'],
        supplier: 'CJ Dropshipping'
      },
      language: 'en'
    }
  },
  {
    name: 'AI Content Generator',
    endpoint: 'ai-content-generator',
    category: 'AI Generation',
    icon: Brain,
    description: 'Dynamic content creation with multi-language support',
    testPayload: {
      type: 'product-description',
      product: 'Smart Wireless Earbuds',
      features: ['Noise cancellation', 'Wireless charging'],
      language: 'en'
    }
  },
  {
    name: 'Luma Video AI',
    endpoint: 'luma-video-ai',
    category: 'Video Generation',
    icon: Video,
    description: 'AI-powered video creation with Luma Dream Machine',
    testPayload: {
      prompt: 'A sleek pair of wireless earbuds floating in a modern tech environment',
      duration: 5,
      aspect_ratio: '16:9'
    }
  },
  {
    name: 'Video Generator',
    endpoint: 'video-generator',
    category: 'Video Generation',
    icon: Video,
    description: 'Comprehensive video generation hub',
    testPayload: {
      type: 'product-demo',
      product: 'Smart Wireless Earbuds',
      script: 'Experience premium sound quality with our latest wireless earbuds',
      style: 'modern'
    }
  },
  {
    name: 'CJ Dropshipping Catalog',
    endpoint: 'cj-dropshipping-catalog',
    category: 'E-commerce',
    icon: ShoppingCart,
    description: 'Product catalog management and search',
    testPayload: {
      action: 'search',
      keyword: 'wireless earbuds',
      category: 'Electronics',
      limit: 10
    }
  },
  {
    name: 'CJ Dropshipping Order',
    endpoint: 'cj-dropshipping-order',
    category: 'E-commerce',
    icon: ShoppingCart,
    description: 'Order processing and fulfillment',
    testPayload: {
      action: 'validate',
      productId: 'test-product-123',
      quantity: 1,
      shippingInfo: {
        country: 'US',
        state: 'CA',
        city: 'Los Angeles'
      }
    }
  },
  {
    name: 'Dropshipping Import',
    endpoint: 'dropshipping-import',
    category: 'E-commerce',
    icon: Database,
    description: 'Product import from multiple sources',
    testPayload: {
      source: 'cj',
      productUrl: 'https://example.com/product/123',
      userId: 'test-user'
    }
  },
  {
    name: 'Product Scraper',
    endpoint: 'product-scraper',
    category: 'E-commerce',
    icon: Database,
    description: 'Product data extraction and analysis',
    testPayload: {
      url: 'https://example.com/product/wireless-earbuds',
      includeImages: true,
      includeReviews: false
    }
  },
  {
    name: 'Facebook Ads Manager',
    endpoint: 'facebook-ads-manager',
    category: 'Marketing',
    icon: BarChart3,
    description: 'Automated Facebook Ads creation',
    testPayload: {
      action: 'create-campaign',
      product: {
        name: 'Smart Wireless Earbuds',
        price: 89.99,
        targetAudience: 'Tech enthusiasts'
      },
      budget: 50,
      objective: 'conversions'
    }
  },
  {
    name: 'WhatsApp Automation',
    endpoint: 'whatsapp-automation',
    category: 'Marketing',
    icon: MessageSquare,
    description: 'WhatsApp Business automation and chatbot',
    testPayload: {
      action: 'test-bot',
      message: 'Hello, I\'m interested in your wireless earbuds',
      phoneNumber: '+1234567890',
      context: 'product-inquiry'
    }
  },
  {
    name: 'Landing Page Builder',
    endpoint: 'landing-page-builder',
    category: 'Marketing',
    icon: Activity,
    description: 'AI-powered landing page generation',
    testPayload: {
      product: {
        name: 'Smart Wireless Earbuds',
        description: 'Premium wireless earbuds with noise cancellation',
        price: 89.99,
        features: ['Noise cancellation', 'Wireless charging', '30-hour battery']
      },
      template: 'modern',
      language: 'en'
    }
  },
  {
    name: 'Nexus API Manager',
    endpoint: 'nexus-api-manager',
    category: 'Utility',
    icon: Cloud,
    description: 'Central API management hub',
    testPayload: {
      action: 'health-check',
      service: 'all'
    }
  },
  {
    name: 'Usage Tracker',
    endpoint: 'usage-tracker',
    category: 'Utility',
    icon: BarChart3,
    description: 'Credits and usage monitoring',
    testPayload: {
      action: 'get-usage',
      userId: 'test-user',
      period: 'current-month'
    }
  },
  {
    name: 'Webhook Handler',
    endpoint: 'webhook-handler',
    category: 'Utility',
    icon: Zap,
    description: 'External webhook processing',
    testPayload: {
      source: 'test',
      event: 'health-check',
      data: { timestamp: new Date().toISOString() }
    }
  },
  {
    name: 'Unsplash API',
    endpoint: 'unsplash-api',
    category: 'Media',
    icon: Image,
    description: 'High-quality image access',
    testPayload: {
      query: 'wireless earbuds tech',
      count: 5,
      orientation: 'landscape'
    }
  }
]

export default function ProductionEdgeFunctionValidator() {
  const { t, language } = useLanguage()
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({})
  const [isRunning, setIsRunning] = useState(false)
  const [overallProgress, setOverallProgress] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = ['all', 'AI Generation', 'Video Generation', 'E-commerce', 'Marketing', 'Utility', 'Media']

  const filteredFunctions = selectedCategory === 'all' 
    ? edgeFunctions 
    : edgeFunctions.filter(func => func.category === selectedCategory)

  const runSingleTest = async (func: EdgeFunction) => {
    const startTime = Date.now()
    
    setTestResults(prev => ({
      ...prev,
      [func.name]: { name: func.name, status: 'running' }
    }))

    try {
      const { data: session } = await supabase.auth.getSession()
      
      const response = await fetch(`${SUPABASE_URL}/functions/v1/${func.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.session?.access_token || SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY
        },
        body: JSON.stringify(func.testPayload)
      })

      const responseTime = Date.now() - startTime
      const data = await response.json()

      if (response.ok) {
        setTestResults(prev => ({
          ...prev,
          [func.name]: {
            name: func.name,
            status: 'success',
            responseTime,
            message: 'Function executed successfully',
            data: data
          }
        }))
      } else {
        setTestResults(prev => ({
          ...prev,
          [func.name]: {
            name: func.name,
            status: 'error',
            responseTime,
            message: data.error || 'Function returned an error',
            data: data
          }
        }))
      }
    } catch (error) {
      const responseTime = Date.now() - startTime
      setTestResults(prev => ({
        ...prev,
        [func.name]: {
          name: func.name,
          status: 'error',
          responseTime,
          message: error.message || 'Network or execution error',
          data: null
        }
      }))
    }
  }

  const runAllTests = async () => {
    setIsRunning(true)
    setTestResults({})
    setOverallProgress(0)

    const totalTests = filteredFunctions.length
    let completedTests = 0

    for (const func of filteredFunctions) {
      await runSingleTest(func)
      completedTests++
      setOverallProgress((completedTests / totalTests) * 100)
      
      // Small delay between tests to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    setIsRunning(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'running':
        return <Clock className="w-5 h-5 text-blue-500 animate-spin" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      case 'running':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const successCount = Object.values(testResults).filter(r => r.status === 'success').length
  const errorCount = Object.values(testResults).filter(r => r.status === 'error').length
  const totalTests = Object.keys(testResults).length

  const avgResponseTime = totalTests > 0 
    ? Object.values(testResults)
        .filter(r => r.responseTime)
        .reduce((sum, r) => sum + r.responseTime!, 0) / 
      Object.values(testResults).filter(r => r.responseTime).length
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🚀 NexusOne Edge Functions Validator
          </h1>
          <p className="text-lg text-gray-600">
            Production deployment validation and real-time testing
          </p>
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-green-600">
                    {totalTests > 0 ? Math.round((successCount / totalTests) * 100) : 0}%
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Functions Tested</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {totalTests}/{filteredFunctions.length}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Response</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {avgResponseTime > 0 ? Math.round(avgResponseTime) : 0}ms
                  </p>
                </div>
                <Zap className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Errors</p>
                  <p className="text-2xl font-bold text-red-600">{errorCount}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        {isRunning && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Testing Progress</span>
                <span className="text-sm text-gray-500">{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="w-full" />
            </CardContent>
          </Card>
        )}

        {/* Controls */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button 
                  onClick={runAllTests} 
                  disabled={isRunning}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isRunning ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Activity className="w-4 h-4 mr-2" />
                      Run All Tests
                    </>
                  )}
                </Button>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-sm text-gray-600">
                Base URL: <code className="bg-gray-100 px-2 py-1 rounded">{SUPABASE_URL}/functions/v1</code>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Tabs defaultValue="functions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="functions">Function Tests</TabsTrigger>
            <TabsTrigger value="logs">Detailed Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="functions">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredFunctions.map((func) => {
                const result = testResults[func.name]
                const IconComponent = func.icon

                return (
                  <Card key={func.name} className="relative overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <IconComponent className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-sm font-semibold">{func.name}</CardTitle>
                            <p className="text-xs text-gray-500">{func.category}</p>
                          </div>
                        </div>
                        {result && getStatusIcon(result.status)}
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600 mb-4">{func.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Endpoint:</span>
                          <code className="text-blue-600">/{func.endpoint}</code>
                        </div>
                        
                        {result && (
                          <>
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500">Status:</span>
                              <Badge className={getStatusColor(result.status)}>
                                {result.status.toUpperCase()}
                              </Badge>
                            </div>
                            
                            {result.responseTime && (
                              <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Response Time:</span>
                                <span className="font-mono">{result.responseTime}ms</span>
                              </div>
                            )}
                            
                            {result.message && (
                              <Alert className="mt-3">
                                <AlertDescription className="text-xs">
                                  {result.message}
                                </AlertDescription>
                              </Alert>
                            )}
                          </>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => runSingleTest(func)}
                        disabled={isRunning}
                        className="w-full mt-4"
                      >
                        {result?.status === 'running' ? (
                          <>
                            <Clock className="w-3 h-3 mr-2 animate-spin" />
                            Testing...
                          </>
                        ) : (
                          <>
                            <Activity className="w-3 h-3 mr-2" />
                            Test Function
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Test Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {Object.values(testResults).map((result, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold flex items-center gap-2">
                          {getStatusIcon(result.status)}
                          {result.name}
                        </h4>
                        <Badge className={getStatusColor(result.status)}>
                          {result.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      {result.message && (
                        <p className="text-sm text-gray-600 mb-2">{result.message}</p>
                      )}
                      
                      {result.responseTime && (
                        <p className="text-xs text-gray-500">Response time: {result.responseTime}ms</p>
                      )}
                      
                      {result.data && (
                        <details className="mt-2">
                          <summary className="text-xs text-blue-600 cursor-pointer">
                            Show response data
                          </summary>
                          <pre className="text-xs bg-gray-50 p-2 rounded mt-2 overflow-x-auto">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))}
                  
                  {Object.keys(testResults).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No test results yet. Click "Run All Tests" to begin validation.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}