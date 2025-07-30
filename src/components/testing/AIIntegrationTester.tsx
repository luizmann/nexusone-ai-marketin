import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { supabaseAI } from '@/services/supabaseAI'
import { toast } from 'sonner'
import { 
  Brain, 
  Video, 
  MessageSquare, 
  ShoppingBag, 
  Image, 
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  Play
} from '@phosphor-icons/react'

interface TestResult {
  name: string
  status: 'idle' | 'loading' | 'success' | 'error'
  response?: any
  error?: string
}

export function AIIntegrationTester() {
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({})
  const [testInput, setTestInput] = useState('')
  const [isRunningAll, setIsRunningAll] = useState(false)

  const updateTestResult = (testName: string, result: Partial<TestResult>) => {
    setTestResults(prev => ({
      ...prev,
      [testName]: { ...prev[testName], name: testName, ...result }
    }))
  }

  const runTest = async (testName: string, testFunction: () => Promise<any>) => {
    updateTestResult(testName, { status: 'loading' })
    
    try {
      const response = await testFunction()
      updateTestResult(testName, { 
        status: 'success', 
        response,
        error: undefined 
      })
      toast.success(`${testName} test passed!`)
    } catch (error) {
      updateTestResult(testName, { 
        status: 'error', 
        error: error.message || 'Unknown error',
        response: undefined 
      })
      toast.error(`${testName} test failed: ${error.message}`)
    }
  }

  const tests = [
    {
      name: 'NexBrain Chat',
      icon: Brain,
      description: 'AI Assistant & Content Generation',
      test: () => supabaseAI.chatWithNexBrain(testInput || 'Hello NexBrain! Generate a product description for wireless earbuds.')
    },
    {
      name: 'Luma Video AI',
      icon: Video,
      description: 'AI Video Generation',
      test: () => supabaseAI.generateVideo('Product demo for wireless headphones', 5)
    },
    {
      name: 'Content Generation',
      icon: MessageSquare,
      description: 'Marketing Content Creation',
      test: () => supabaseAI.generateContent('Create engaging sales copy for a fitness app', 'marketing')
    },
    {
      name: 'CJ Dropshipping',
      icon: ShoppingBag,
      description: 'Product Catalog Integration',
      test: () => supabaseAI.getCJProducts('wireless headphones', 'electronics', 5)
    },
    {
      name: 'Facebook Ads',
      icon: Zap,
      description: 'Automated Ad Creation',
      test: () => supabaseAI.createFacebookAd('wireless earbuds', 50, 'tech enthusiasts')
    },
    {
      name: 'WhatsApp Automation',
      icon: MessageSquare,
      description: 'Automated Messaging',
      test: () => supabaseAI.generateWhatsAppMessage('product_inquiry', 'fitness tracker')
    },
    {
      name: 'Landing Page Builder',
      icon: MessageSquare,
      description: 'AI-Powered Page Generation',
      test: () => supabaseAI.generateLandingPage('smart watch', 'modern')
    },
    {
      name: 'Unsplash Images',
      icon: Image,
      description: 'Stock Image Integration',
      test: () => supabaseAI.getUnsplashImages('technology product', 3)
    }
  ]

  const runAllTests = async () => {
    setIsRunningAll(true)
    
    for (const test of tests) {
      await runTest(test.name, test.test)
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    setIsRunningAll(false)
    toast.success('All tests completed!')
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'loading':
        return <Clock className="h-4 w-4 animate-spin text-yellow-500" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-300" />
    }
  }

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'loading':
        return <Badge variant="secondary">Testing...</Badge>
      case 'success':
        return <Badge variant="default" className="bg-green-500">Passed</Badge>
      case 'error':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">Not Tested</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            AI Integration Test Suite
          </CardTitle>
          <CardDescription>
            Test all AI integrations and backend functions to ensure everything is working correctly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Test Input (Optional)</label>
            <Textarea
              placeholder="Enter custom test prompt or leave empty for default..."
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={runAllTests} 
              disabled={isRunningAll}
              className="flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              {isRunningAll ? 'Running All Tests...' : 'Run All Tests'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tests.map((test) => {
          const result = testResults[test.name] || { status: 'idle' }
          const Icon = test.icon

          return (
            <Card key={test.name} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{test.name}</CardTitle>
                  </div>
                  {getStatusIcon(result.status)}
                </div>
                <CardDescription>{test.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Button
                    size="sm"
                    onClick={() => runTest(test.name, test.test)}
                    disabled={result.status === 'loading' || isRunningAll}
                  >
                    Test {test.name}
                  </Button>
                  {getStatusBadge(result.status)}
                </div>

                {result.response && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-green-700">Response:</p>
                    <div className="bg-green-50 p-2 rounded text-xs max-h-32 overflow-y-auto">
                      <pre className="whitespace-pre-wrap">
                        {typeof result.response === 'object' 
                          ? JSON.stringify(result.response, null, 2)
                          : result.response
                        }
                      </pre>
                    </div>
                  </div>
                )}

                {result.error && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-red-700">Error:</p>
                    <div className="bg-red-50 p-2 rounded text-xs">
                      {result.error}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Test Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Test Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-600">
                {Object.keys(testResults).length}
              </div>
              <div className="text-sm text-gray-500">Total Tests</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {Object.values(testResults).filter(r => r.status === 'success').length}
              </div>
              <div className="text-sm text-gray-500">Passed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {Object.values(testResults).filter(r => r.status === 'error').length}
              </div>
              <div className="text-sm text-gray-500">Failed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {Object.values(testResults).filter(r => r.status === 'loading').length}
              </div>
              <div className="text-sm text-gray-500">Running</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}