import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, CheckCircle, Loader2, Play, RefreshCw } from '@phosphor-icons/react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'

interface TestResult {
  status: 'pending' | 'running' | 'success' | 'error'
  message: string
  duration?: number
  data?: any
}

interface AITest {
  id: string
  name: string
  description: string
  category: string
  endpoint: string
  testData: any
  result: TestResult
}

export function AITestSuite() {
  const [tests, setTests] = useState<AITest[]>([
    {
      id: 'openai-gpt',
      name: 'OpenAI GPT-4',
      description: 'Test content generation with OpenAI',
      category: 'AI Generation',
      endpoint: '/functions/v1/openai-assistant',
      testData: { prompt: 'Generate a short product description for a wireless headphone' },
      result: { status: 'pending', message: 'Not tested' }
    },
    {
      id: 'nexbrain-agent',
      name: 'NexBrain AI Agent',
      description: 'Test the main AI assistant',
      category: 'AI Generation',
      endpoint: '/functions/v1/openai-assistant',
      testData: { 
        message: 'Create a marketing campaign for a fitness product',
        assistant_id: 'asst_0jsx8eD6P3W9XGsSRRNU2Pfd'
      },
      result: { status: 'pending', message: 'Not tested' }
    },
    {
      id: 'replicate-image',
      name: 'Replicate Image Generation',
      description: 'Test AI image generation',
      category: 'Media Generation',
      endpoint: '/functions/v1/replicate-image',
      testData: { 
        prompt: 'Modern wireless headphones on a clean white background, product photography style',
        model: 'black-forest-labs/flux-schnell'
      },
      result: { status: 'pending', message: 'Not tested' }
    },
    {
      id: 'luma-video',
      name: 'Luma AI Video',
      description: 'Test AI video generation',
      category: 'Media Generation',
      endpoint: '/functions/v1/luma-video',
      testData: { 
        prompt: 'A sleek wireless headphone rotating slowly on a modern desk'
      },
      result: { status: 'pending', message: 'Not tested' }
    },
    {
      id: 'elevenlabs-tts',
      name: 'ElevenLabs Text-to-Speech',
      description: 'Test voice generation',
      category: 'Media Generation',
      endpoint: '/functions/v1/elevenlabs-tts',
      testData: { 
        text: 'Welcome to NexusOne AI, your marketing automation platform',
        voice_id: 'pNInz6obpgDQGcFmaJgB'
      },
      result: { status: 'pending', message: 'Not tested' }
    },
    {
      id: 'cj-dropshipping',
      name: 'CJ Dropshipping Products',
      description: 'Test product catalog integration',
      category: 'E-commerce',
      endpoint: '/functions/v1/cj-dropshipping-catalog',
      testData: { 
        search: 'wireless headphones',
        page: 1,
        pageSize: 10
      },
      result: { status: 'pending', message: 'Not tested' }
    },
    {
      id: 'facebook-ads',
      name: 'Facebook Ads Campaign',
      description: 'Test ad campaign generation',
      category: 'Marketing',
      endpoint: '/functions/v1/facebook-ads-generator',
      testData: { 
        productName: 'Wireless Headphones Pro',
        targetAudience: 'Tech enthusiasts aged 25-40',
        budget: 100
      },
      result: { status: 'pending', message: 'Not tested' }
    },
    {
      id: 'whatsapp-bot',
      name: 'WhatsApp Bot Integration',
      description: 'Test WhatsApp automation',
      category: 'Communication',
      endpoint: '/functions/v1/whatsapp-automation',
      testData: { 
        message: 'Hi, I need information about your products',
        phone: '+1234567890'
      },
      result: { status: 'pending', message: 'Not tested' }
    },
    {
      id: 'magic-page',
      name: 'Magic Page Generator',
      description: 'Test landing page creation',
      category: 'Web Generation',
      endpoint: '/functions/v1/magic-page-generator',
      testData: { 
        productName: 'Wireless Headphones Pro',
        productDescription: 'Premium wireless headphones with noise cancellation',
        targetAudience: 'Music lovers and professionals'
      },
      result: { status: 'pending', message: 'Not tested' }
    },
    {
      id: 'campaign-generator',
      name: 'Complete Campaign Generator',
      description: 'Test full marketing campaign creation',
      category: 'Marketing',
      endpoint: '/functions/v1/campaign-generator',
      testData: { 
        productId: 'test-product-123',
        campaignType: 'product-launch',
        budget: 500
      },
      result: { status: 'pending', message: 'Not tested' }
    }
  ])

  const [isRunningAll, setIsRunningAll] = useState(false)
  const [customTest, setCustomTest] = useState({
    endpoint: '',
    data: ''
  })

  const updateTestResult = (testId: string, result: TestResult) => {
    setTests(prev => prev.map(test => 
      test.id === testId ? { ...test, result } : test
    ))
  }

  const getAPIKeyForEndpoint = (endpoint: string, apiConfigs: any) => {
    if (endpoint.includes('openai')) return apiConfigs.openai?.key
    if (endpoint.includes('replicate')) return apiConfigs.replicate?.key
    if (endpoint.includes('luma')) return apiConfigs.luma?.key
    if (endpoint.includes('elevenlabs')) return apiConfigs.elevenlabs?.key
    if (endpoint.includes('cj-dropshipping')) return apiConfigs['cj-dropshipping']?.key
    if (endpoint.includes('facebook')) return apiConfigs.facebook?.key
    if (endpoint.includes('whatsapp')) return apiConfigs.gupshup?.key
    return null
  }

  const runSingleTest = async (test: AITest) => {
    const startTime = Date.now()
    
    updateTestResult(test.id, { 
      status: 'running', 
      message: 'Testing...' 
    })

    try {
      // Use direct Supabase Edge Functions URL
      const supabaseUrl = 'https://your-project.supabase.co'
      
      // Get API keys from localStorage
      const apiConfigs = JSON.parse(localStorage.getItem('nexusone-api-configs') || '{}')
      
      // Add API keys to test data based on endpoint
      const enhancedTestData = { 
        ...test.testData,
        apiKey: getAPIKeyForEndpoint(test.endpoint, apiConfigs)
      }
      
      const response = await fetch(`${supabaseUrl}${test.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('sb-access-token') || 'test-token'}`
        },
        body: JSON.stringify(enhancedTestData)
      })

      const duration = Date.now() - startTime
      
      if (response.ok) {
        const data = await response.json()
        updateTestResult(test.id, {
          status: 'success',
          message: `✅ Success (${duration}ms)`,
          duration,
          data
        })
        toast.success(`${test.name} test passed`)
      } else {
        const errorData = await response.text()
        updateTestResult(test.id, {
          status: 'error',
          message: `❌ Error: ${response.status} - ${errorData}`,
          duration
        })
        toast.error(`${test.name} test failed`)
      }
    } catch (error) {
      const duration = Date.now() - startTime
      updateTestResult(test.id, {
        status: 'error',
        message: `❌ Network Error: ${error.message}`,
        duration
      })
      toast.error(`${test.name} test failed`)
    }
  }

  const runAllTests = async () => {
    setIsRunningAll(true)
    toast.info('Running all AI tests...')
    
    for (const test of tests) {
      await runSingleTest(test)
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    setIsRunningAll(false)
    
    const passed = tests.filter(t => t.result.status === 'success').length
    const total = tests.length
    
    if (passed === total) {
      toast.success(`All tests passed! (${passed}/${total})`)
    } else {
      toast.warning(`${passed}/${total} tests passed`)
    }
  }

  const runCustomTest = async () => {
    if (!customTest.endpoint || !customTest.data) {
      toast.error('Please fill in endpoint and test data')
      return
    }

    try {
      const testData = JSON.parse(customTest.data)
      const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co'
      
      const response = await fetch(`${supabaseUrl}${customTest.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('sb-access-token') || 'test-token'}`
        },
        body: JSON.stringify(testData)
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Custom test passed')
        console.log('Custom test result:', data)
      } else {
        const errorData = await response.text()
        toast.error(`Custom test failed: ${response.status}`)
        console.error('Custom test error:', errorData)
      }
    } catch (error) {
      toast.error(`Custom test error: ${error.message}`)
    }
  }

  const resetAllTests = () => {
    setTests(prev => prev.map(test => ({
      ...test,
      result: { status: 'pending', message: 'Not tested' }
    })))
    toast.info('All tests reset')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />
      case 'running':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'secondary'
      case 'running':
        return 'default'
      case 'success':
        return 'default'
      case 'error':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const categories = [...new Set(tests.map(test => test.category))]
  const testsByCategory = categories.reduce((acc, category) => {
    acc[category] = tests.filter(test => test.category === category)
    return acc
  }, {} as Record<string, AITest[]>)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Test Suite</h2>
          <p className="text-muted-foreground">
            Validate all AI integrations and features
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={resetAllTests}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button 
            onClick={runAllTests} 
            disabled={isRunningAll}
            size="sm"
          >
            {isRunningAll ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            Run All Tests
          </Button>
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          These tests validate that all AI features are working correctly in production. 
          Make sure your API keys are configured in the Admin Dashboard.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="tests" className="w-full">
        <TabsList>
          <TabsTrigger value="tests">AI Tests</TabsTrigger>
          <TabsTrigger value="custom">Custom Test</TabsTrigger>
          <TabsTrigger value="results">Results Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="tests" className="space-y-4">
          {categories.map(category => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-lg">{category}</CardTitle>
                <CardDescription>
                  {testsByCategory[category].length} tests in this category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {testsByCategory[category].map(test => (
                    <div 
                      key={test.id} 
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(test.result.status)}
                        <div>
                          <div className="font-medium">{test.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {test.description}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {test.endpoint}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusColor(test.result.status)}>
                          {test.result.status}
                        </Badge>
                        {test.result.duration && (
                          <Badge variant="outline">
                            {test.result.duration}ms
                          </Badge>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => runSingleTest(test)}
                          disabled={test.result.status === 'running'}
                        >
                          {test.result.status === 'running' ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Custom API Test</CardTitle>
              <CardDescription>
                Test any Edge Function endpoint manually
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Endpoint Path
                </label>
                <Input
                  placeholder="/functions/v1/your-endpoint"
                  value={customTest.endpoint}
                  onChange={(e) => setCustomTest(prev => ({
                    ...prev,
                    endpoint: e.target.value
                  }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Test Data (JSON)
                </label>
                <Textarea
                  placeholder='{"key": "value"}'
                  value={customTest.data}
                  onChange={(e) => setCustomTest(prev => ({
                    ...prev,
                    data: e.target.value
                  }))}
                  rows={6}
                />
              </div>
              <Button onClick={runCustomTest}>
                <Play className="h-4 w-4 mr-2" />
                Run Custom Test
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Results Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-500">
                    {tests.filter(t => t.result.status === 'success').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Passed</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-red-500">
                    {tests.filter(t => t.result.status === 'error').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-500">
                    {tests.filter(t => t.result.status === 'running').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Running</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-muted-foreground">
                    {tests.filter(t => t.result.status === 'pending').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
              </div>

              <div className="space-y-2">
                {tests.map(test => (
                  <div 
                    key={test.id}
                    className="flex items-center justify-between p-3 border rounded"
                  >
                    <div className="flex items-center gap-2">
                      {getStatusIcon(test.result.status)}
                      <span className="font-medium">{test.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {test.result.message}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}