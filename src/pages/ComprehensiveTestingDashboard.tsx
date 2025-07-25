import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AIContentGenerationService } from '@/services/aiContentGeneration'
import { 
  Play, 
  CheckCircle, 
  AlertCircle, 
  Target,
  Loader2,
  Zap,
  Globe,
  BarChart3,
  Users,
  MessageSquare,
  Video,
  TrendingUp
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface TestResult {
  testName: string
  product: string
  language: string
  status: 'pending' | 'running' | 'passed' | 'failed'
  duration?: number
  results?: any
  error?: string
}

export function ComprehensiveTestingDashboard() {
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [currentTest, setCurrentTest] = useState<string>('')

  const testScenarios = [
    {
      name: "Electronics - English Market",
      product: {
        name: "Wireless Bluetooth Earbuds Pro",
        description: "Premium quality wireless earbuds with noise cancellation and 24-hour battery life",
        price: 89.99,
        category: "Electronics",
        targetAudience: "Young professionals, fitness enthusiasts, music lovers",
        keyFeatures: ["Active Noise Cancellation", "24H Battery", "Waterproof IPX7", "Touch Controls"],
        supplier: "TechSupplier Co."
      },
      language: "en",
      expectedResults: {
        marketSize: "$2.5B",
        audienceAge: "18-45",
        cta: "Order Now"
      }
    },
    {
      name: "Security - Spanish Market",
      product: {
        name: "Smart Home Security Camera",
        description: "AI-powered security camera with night vision and mobile app control",
        price: 149.99,
        category: "Home Security",
        targetAudience: "Homeowners, security-conscious individuals, tech enthusiasts",
        keyFeatures: ["4K Resolution", "Night Vision", "AI Detection", "Cloud Storage"],
        supplier: "SecurityTech Ltd."
      },
      language: "es",
      expectedResults: {
        marketSize: "$1.8B",
        audienceAge: "30-60",
        cta: "Ordenar Ahora"
      }
    },
    {
      name: "Accessories - Portuguese Market",
      product: {
        name: "Portable Phone Charger Power Bank",
        description: "High-capacity portable charger with fast charging and multiple ports",
        price: 39.99,
        category: "Mobile Accessories",
        targetAudience: "Travelers, students, remote workers, mobile users",
        keyFeatures: ["20000mAh Capacity", "Fast Charging", "3 USB Ports", "LED Display"],
        supplier: "PowerTech Solutions"
      },
      language: "pt",
      expectedResults: {
        marketSize: "$950M",
        audienceAge: "16-40",
        cta: "Peça Agora"
      }
    },
    {
      name: "Electronics - Arabic Market",
      product: {
        name: "Smart Fitness Watch",
        description: "Advanced fitness tracker with heart rate monitoring and GPS",
        price: 199.99,
        category: "Electronics",
        targetAudience: "Fitness enthusiasts, health-conscious individuals",
        keyFeatures: ["Heart Rate Monitor", "GPS Tracking", "Water Resistant", "7-Day Battery"],
        supplier: "FitTech Solutions"
      },
      language: "ar",
      expectedResults: {
        marketSize: "$2.5B",
        audienceAge: "18-45",
        cta: "اطلب الآن"
      }
    },
    {
      name: "Tech - Hebrew Market",
      product: {
        name: "Wireless Phone Charger Pad",
        description: "Fast wireless charging pad compatible with all modern smartphones",
        price: 49.99,
        category: "Mobile Accessories",
        targetAudience: "Tech enthusiasts, professionals, convenience seekers",
        keyFeatures: ["Fast Charging", "Universal Compatibility", "LED Indicator", "Safety Protection"],
        supplier: "ChargeTech Pro"
      },
      language: "he",
      expectedResults: {
        marketSize: "$950M",
        audienceAge: "16-40",
        cta: "הזמן עכשיו"
      }
    }
  ]

  const allSteps = [
    'product-analysis',
    'audience-research', 
    'competitor-analysis',
    'landing-page',
    'facebook-ads',
    'video-script',
    'whatsapp-bot',
    'seo-content',
    'validation-metrics'
  ]

  const runComprehensiveTests = async () => {
    setIsRunning(true)
    setProgress(0)
    setTestResults([])
    
    const totalTests = testScenarios.length
    
    for (let i = 0; i < testScenarios.length; i++) {
      const scenario = testScenarios[i]
      
      setCurrentTest(scenario.name)
      setTestResults(prev => [...prev, {
        testName: scenario.name,
        product: scenario.product.name,
        language: scenario.language,
        status: 'running'
      }])

      try {
        const startTime = Date.now()
        
        // Test complete pipeline for this scenario
        const results = await AIContentGenerationService.generateCompleteContentPipeline(
          scenario.product,
          scenario.language
        )
        
        const duration = Date.now() - startTime
        
        // Validate results
        const isValid = validateTestResults(results, scenario.expectedResults)
        
        setTestResults(prev => prev.map((test, idx) => 
          idx === i ? {
            ...test,
            status: isValid ? 'passed' : 'failed',
            duration,
            results,
            error: isValid ? undefined : 'Validation failed'
          } : test
        ))

        if (isValid) {
          toast.success(`✅ ${scenario.name} - PASSED`)
        } else {
          toast.error(`❌ ${scenario.name} - FAILED`)
        }
        
      } catch (error) {
        setTestResults(prev => prev.map((test, idx) => 
          idx === i ? {
            ...test,
            status: 'failed',
            error: error.message
          } : test
        ))
        
        toast.error(`❌ ${scenario.name} - ERROR: ${error.message}`)
      }
      
      setProgress(((i + 1) / totalTests) * 100)
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    setIsRunning(false)
    setCurrentTest('')
    
    const passedTests = testResults.filter(t => t.status === 'passed').length
    const totalTestsRun = testResults.length
    
    toast.success(`🏁 Testing Complete: ${passedTests}/${totalTestsRun} tests passed`)
  }

  const validateTestResults = (results: any, expected: any): boolean => {
    try {
      // Check if all required steps completed
      const requiredSteps = allSteps.length
      const completedSteps = Object.keys(results).length
      
      if (completedSteps < requiredSteps) {
        console.log(`Missing steps: ${requiredSteps - completedSteps}`)
        return false
      }
      
      // Validate specific content exists
      if (!results['landing-page']?.landingPage?.headline) {
        console.log('Missing landing page headline')
        return false
      }
      
      if (!results['facebook-ads']?.facebookAd?.cta) {
        console.log('Missing Facebook ad CTA')
        return false
      }
      
      if (!results['whatsapp-bot']?.whatsappBot?.greeting) {
        console.log('Missing WhatsApp greeting')
        return false
      }
      
      return true
    } catch (error) {
      console.error('Validation error:', error)
      return false
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
    }
  }

  const getLanguageFlag = (language: string) => {
    const flags = {
      en: '🇺🇸',
      es: '🇪🇸', 
      pt: '🇧🇷',
      ar: '🇸🇦',
      he: '🇮🇱'
    }
    return flags[language] || '🌍'
  }

  const passedTests = testResults.filter(t => t.status === 'passed').length
  const failedTests = testResults.filter(t => t.status === 'failed').length
  const totalTests = testResults.length

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
            <Target className="h-8 w-8 text-accent" />
            Comprehensive AI Testing Dashboard
          </h1>
          <p className="text-muted-foreground">
            Complete validation of AI content generation across all markets and languages
          </p>
        </div>

        {/* Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Execute Full Test Suite
            </CardTitle>
            <CardDescription>
              Run complete AI pipeline tests across 5 scenarios and 5 languages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Test Scenarios: {testScenarios.length}</h3>
                  <p className="text-sm text-muted-foreground">
                    Each scenario tests all 9 AI generation steps
                  </p>
                </div>
                <Button 
                  onClick={runComprehensiveTests}
                  disabled={isRunning}
                  size="lg"
                  className="min-w-[150px]"
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start All Tests
                    </>
                  )}
                </Button>
              </div>
              
              {isRunning && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress: {currentTest}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {totalTests > 0 && (
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Passed: {passedTests}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span>Failed: {failedTests}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4 text-blue-500" />
                    <span>Total: {totalTests}</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Test Scenarios Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Test Scenarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {testScenarios.map((scenario, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm">{scenario.name}</h3>
                    <Badge variant="outline">
                      {getLanguageFlag(scenario.language)} {scenario.language.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {scenario.product.name}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    {scenario.product.category} • ${scenario.product.price}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        {testResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Test Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex items-center gap-2 flex-1">
                      {getStatusIcon(result.status)}
                      <div>
                        <div className="font-medium">{result.testName}</div>
                        <div className="text-sm text-muted-foreground">
                          {result.product} • {getLanguageFlag(result.language)} {result.language.toUpperCase()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {result.duration && (
                        <div className="text-sm font-medium">
                          {(result.duration / 1000).toFixed(1)}s
                        </div>
                      )}
                      {result.status === 'passed' && (
                        <Badge variant="default" className="bg-green-500">
                          PASSED
                        </Badge>
                      )}
                      {result.status === 'failed' && (
                        <Badge variant="destructive">
                          FAILED
                        </Badge>
                      )}
                      {result.status === 'running' && (
                        <Badge variant="secondary">
                          RUNNING
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success Metrics */}
        {totalTests > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Test Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-500">{totalTests}</div>
                  <div className="text-sm text-muted-foreground">Total Tests</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-500">{passedTests}</div>
                  <div className="text-sm text-muted-foreground">Passed</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-red-500">{failedTests}</div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-accent">
                    {totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0}%
                  </div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>
              
              {passedTests === totalTests && totalTests > 0 && (
                <Alert className="mt-4">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    🎉 All tests passed! AI Content Generation Pipeline is fully operational across all markets and languages.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}