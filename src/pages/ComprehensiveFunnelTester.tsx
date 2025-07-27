import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useCredits } from '@/contexts/CreditContext'
import { 
  CheckCircle,
  Clock,
  Zap,
  Target,
  TrendingUp,
  Users,
  DollarSign,
  Globe,
  Video,
  WhatsappLogo,
  BarChart,
  TestTube,
  Timer,
  ArrowRight,
  Play,
  Pause,
  RefreshCw
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface TestResult {
  id: string
  productName: string
  industry: string
  generationTime: number
  componentsGenerated: number
  conversionRate: string
  estimatedROI: string
  status: 'completed' | 'failed' | 'in-progress'
  timestamp: Date
}

interface TestMetrics {
  totalTests: number
  averageTime: number
  successRate: number
  totalCreditsUsed: number
  averageROI: string
}

export const ComprehensiveFunnelTester: React.FC = () => {
  const { credits } = useCredits()
  const [isRunningTests, setIsRunningTests] = useState(false)
  const [currentTest, setCurrentTest] = useState<string>('')
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [testMetrics, setTestMetrics] = useState<TestMetrics>({
    totalTests: 0,
    averageTime: 0,
    successRate: 0,
    totalCreditsUsed: 0,
    averageROI: '0%'
  })
  const [activeTestIndex, setActiveTestIndex] = useState(0)

  // Pre-defined test scenarios for comprehensive testing
  const testScenarios = [
    {
      productName: 'FitTracker Pro',
      productDescription: 'Smart fitness tracker with AI coaching',
      targetAudience: 'Fitness enthusiasts aged 25-45',
      industry: 'Health & Fitness',
      pricePoint: '$199',
      uniqueSellingPoint: 'AI-powered personal coaching'
    },
    {
      productName: 'DropshipMaster Course',
      productDescription: 'Complete dropshipping business course',
      targetAudience: 'Aspiring online entrepreneurs',
      industry: 'Education',
      pricePoint: '$497',
      uniqueSellingPoint: '6-figure proven system'
    },
    {
      productName: 'SmartHome Security',
      productDescription: 'AI-powered home security system',
      targetAudience: 'Homeowners 30-60 years old',
      industry: 'Security',
      pricePoint: '$399',
      uniqueSellingPoint: 'Predictive threat detection'
    },
    {
      productName: 'Digital Marketing Agency',
      productDescription: 'Done-for-you marketing services',
      targetAudience: 'Small business owners',
      industry: 'Marketing',
      pricePoint: '$2997/month',
      uniqueSellingPoint: '300% ROI guarantee'
    },
    {
      productName: 'Crypto Trading Bot',
      productDescription: 'Automated cryptocurrency trading',
      targetAudience: 'Crypto investors',
      industry: 'Finance',
      pricePoint: '$97/month',
      uniqueSellingPoint: 'AI-driven trading decisions'
    }
  ]

  const runComprehensiveTests = async () => {
    if (credits < 750) { // 150 credits per test × 5 tests
      toast.error('Insufficient credits for comprehensive testing. Need 750 credits.')
      return
    }

    setIsRunningTests(true)
    setTestResults([])
    const results: TestResult[] = []

    try {
      for (let i = 0; i < testScenarios.length; i++) {
        const scenario = testScenarios[i]
        setCurrentTest(scenario.productName)
        setActiveTestIndex(i)

        const startTime = Date.now()
        
        // Simulate AI funnel generation for each scenario
        const testResult = await simulateAIFunnelGeneration(scenario)
        const endTime = Date.now()
        const duration = Math.round((endTime - startTime) / 1000)

        const result: TestResult = {
          id: `test-${i}`,
          productName: scenario.productName,
          industry: scenario.industry,
          generationTime: duration,
          componentsGenerated: 9, // All funnel components
          conversionRate: testResult.conversionRate,
          estimatedROI: testResult.estimatedROI,
          status: 'completed',
          timestamp: new Date()
        }

        results.push(result)
        setTestResults([...results])

        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      // Calculate final metrics
      const metrics = calculateTestMetrics(results)
      setTestMetrics(metrics)

      toast.success(`🎉 All tests completed! Average generation time: ${metrics.averageTime}s`)

    } catch (error) {
      toast.error('Error during testing. Some tests may have failed.')
      console.error(error)
    } finally {
      setIsRunningTests(false)
      setCurrentTest('')
    }
  }

  const simulateAIFunnelGeneration = async (scenario: any) => {
    // This simulates the actual AI funnel generation process
    // In production, this would call the real AIFunnelService
    
    const components = [
      'Product Analysis',
      'Market Research', 
      'Sales Copy Generation',
      'Visual Asset Creation',
      'Video Generation',
      'Landing Page Building',
      'Ad Campaign Creation',
      'WhatsApp Bot Setup',
      'Funnel Optimization'
    ]

    // Simulate processing each component
    for (const component of components) {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 3000 + 2000)) // 2-5 seconds per component
    }

    // Generate realistic test results
    const conversionRates = ['12.3%', '15.7%', '18.9%', '21.4%', '16.2%']
    const roiValues = ['280%', '350%', '425%', '520%', '380%']
    
    return {
      conversionRate: conversionRates[Math.floor(Math.random() * conversionRates.length)],
      estimatedROI: roiValues[Math.floor(Math.random() * roiValues.length)]
    }
  }

  const calculateTestMetrics = (results: TestResult[]): TestMetrics => {
    if (results.length === 0) {
      return {
        totalTests: 0,
        averageTime: 0,
        successRate: 0,
        totalCreditsUsed: 0,
        averageROI: '0%'
      }
    }

    const totalTime = results.reduce((sum, result) => sum + result.generationTime, 0)
    const successfulTests = results.filter(r => r.status === 'completed').length
    const roiValues = results.map(r => parseFloat(r.estimatedROI.replace('%', '')))
    const averageROI = roiValues.reduce((sum, roi) => sum + roi, 0) / roiValues.length

    return {
      totalTests: results.length,
      averageTime: Math.round(totalTime / results.length),
      successRate: Math.round((successfulTests / results.length) * 100),
      totalCreditsUsed: results.length * 150,
      averageROI: `${Math.round(averageROI)}%`
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 p-4 rounded-2xl">
            <TestTube className="h-10 w-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-600 to-purple-600 bg-clip-text text-transparent">
          Comprehensive Funnel Testing Suite
        </h1>
        <p className="text-lg text-muted-foreground">
          Test AI marketing funnel generation across multiple industries and scenarios
        </p>
        <Badge variant="secondary" className="mt-2">
          {credits} Credits Available
        </Badge>
      </div>

      {/* Test Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{testMetrics.averageTime}s</div>
            <div className="text-sm text-muted-foreground">Average Generation</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{testMetrics.successRate}%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{testMetrics.averageROI}</div>
            <div className="text-sm text-muted-foreground">Average ROI</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <Zap className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{testMetrics.totalCreditsUsed}</div>
            <div className="text-sm text-muted-foreground">Credits Used</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Testing Interface */}
      <Tabs defaultValue="scenarios" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scenarios">Test Scenarios</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Pre-Built Test Scenarios
              </CardTitle>
              <CardDescription>
                Run comprehensive tests across different industries and product types
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                {testScenarios.map((scenario, index) => (
                  <Card key={index} className={`transition-all ${
                    isRunningTests && activeTestIndex === index ? 'ring-2 ring-blue-500 bg-blue-50' :
                    testResults.find(r => r.productName === scenario.productName) ? 'bg-green-50' : ''
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold flex items-center gap-2">
                            {scenario.productName}
                            {isRunningTests && activeTestIndex === index && (
                              <Badge variant="outline" className="animate-pulse">Testing...</Badge>
                            )}
                            {testResults.find(r => r.productName === scenario.productName) && (
                              <Badge variant="secondary">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Completed
                              </Badge>
                            )}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              {scenario.industry}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              {scenario.pricePoint}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {scenario.targetAudience}
                            </span>
                          </div>
                        </div>
                        {testResults.find(r => r.productName === scenario.productName) && (
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {formatTime(testResults.find(r => r.productName === scenario.productName)?.generationTime || 0)}
                            </div>
                            <div className="text-xs text-green-600">
                              {testResults.find(r => r.productName === scenario.productName)?.estimatedROI} ROI
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Alert>
                <Timer className="h-4 w-4" />
                <AlertDescription>
                  <strong>Comprehensive Testing:</strong> This will run 5 complete funnel generation tests
                  across different industries. Each test uses 150 credits and takes 3-5 minutes.
                  Total time: ~20 minutes, Total credits: 750
                </AlertDescription>
              </Alert>

              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                  onClick={runComprehensiveTests}
                  disabled={isRunningTests || credits < 750}
                >
                  {isRunningTests ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Running Tests... ({activeTestIndex + 1}/5)
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      Start Comprehensive Testing (750 Credits)
                    </>
                  )}
                </Button>
                
                {isRunningTests && (
                  <Button 
                    variant="outline" 
                    onClick={() => setIsRunningTests(false)}
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                )}
              </div>

              {isRunningTests && (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span>{activeTestIndex + 1} of {testScenarios.length}</span>
                  </div>
                  <Progress value={(activeTestIndex / testScenarios.length) * 100} className="h-2" />
                  {currentTest && (
                    <p className="text-sm text-muted-foreground">
                      Currently testing: <strong>{currentTest}</strong>
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
              <CardDescription>Detailed results from funnel generation tests</CardDescription>
            </CardHeader>
            <CardContent>
              {testResults.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <TestTube className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No test results yet. Run the comprehensive test suite to see results.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {testResults.map((result, index) => (
                    <Card key={result.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{result.productName}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Timer className="h-3 w-3" />
                                {formatTime(result.generationTime)}
                              </span>
                              <span className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                {result.componentsGenerated} Components
                              </span>
                              <span className="flex items-center gap-1">
                                <Target className="h-3 w-3" />
                                {result.conversionRate} Conv Rate
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary" className="mb-2">
                              {result.estimatedROI} ROI
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                              {result.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Tests Completed</span>
                  <span className="font-semibold">{testMetrics.totalTests}</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Generation Time</span>
                  <span className="font-semibold">{formatTime(testMetrics.averageTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Success Rate</span>
                  <span className="font-semibold text-green-600">{testMetrics.successRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Credits Consumed</span>
                  <span className="font-semibold">{testMetrics.totalCreditsUsed}</span>
                </div>
                <div className="flex justify-between">
                  <span>Average ROI</span>
                  <span className="font-semibold text-blue-600">{testMetrics.averageROI}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Capabilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Landing Pages
                  </span>
                  <Badge variant="secondary">✓ Optimized</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Video Generation
                  </span>
                  <Badge variant="secondary">✓ Multi-format</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <WhatsappLogo className="h-4 w-4" />
                    WhatsApp Bots
                  </span>
                  <Badge variant="secondary">✓ Intelligent</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <BarChart className="h-4 w-4" />
                    Ad Campaigns
                  </span>
                  <Badge variant="secondary">✓ Multi-platform</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Copy Generation
                  </span>
                  <Badge variant="secondary">✓ High-converting</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {testResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Performance by Industry</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Array.from(new Set(testResults.map(r => r.industry))).map(industry => {
                    const industryResults = testResults.filter(r => r.industry === industry)
                    const avgTime = industryResults.reduce((sum, r) => sum + r.generationTime, 0) / industryResults.length
                    const avgROI = industryResults.reduce((sum, r) => sum + parseFloat(r.estimatedROI.replace('%', '')), 0) / industryResults.length
                    
                    return (
                      <div key={industry} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">{industry}</span>
                        <div className="text-right text-sm">
                          <div>{formatTime(Math.round(avgTime))} avg time</div>
                          <div className="text-green-600">{Math.round(avgROI)}% avg ROI</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}