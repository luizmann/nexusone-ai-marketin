import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  Play,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  Search,
  Download,
  TrendingUp
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { cjAPI } from '../services/cj-api'
import { CJTestReportSummary } from '../components/CJTestReportSummary'

interface TestStep {
  id: string
  name: string
  description: string
  status: 'pending' | 'running' | 'success' | 'failed'
  result?: any
  error?: string
  duration?: number
}

interface CJTestReport {
  apiConnection: {
    status: 'success' | 'failed' | 'pending'
    responseTime?: string
    message: string
  }
  productSearch: {
    totalSearches: number
    successfulSearches: number
    totalProductsFound: number
  }
  productImport: {
    totalImports: number
    successfulImports: number
    failedImports: number
    importedProductIds: string[]
  }
  recommendations: string[]
}

export function CJComprehensiveTest() {
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [testSteps, setTestSteps] = useState<TestStep[]>([
    {
      id: 'auth',
      name: 'API Authentication',
      description: 'Test CJ Dropshipping API authentication',
      status: 'pending'
    },
    {
      id: 'connection',
      name: 'Connection Test',
      description: 'Verify API connectivity and response times',
      status: 'pending'
    },
    {
      id: 'categories',
      name: 'Category Listing',
      description: 'Fetch available product categories',
      status: 'pending'
    },
    {
      id: 'trending',
      name: 'Trending Products',
      description: 'Get trending/bestselling products',
      status: 'pending'
    },
    {
      id: 'search',
      name: 'Product Search',
      description: 'Search products with various keywords',
      status: 'pending'
    },
    {
      id: 'details',
      name: 'Product Details',
      description: 'Fetch detailed product information',
      status: 'pending'
    },
    {
      id: 'shipping',
      name: 'Shipping Calculation',
      description: 'Calculate shipping costs for sample products',
      status: 'pending'
    }
  ])
  const [finalReport, setFinalReport] = useState<CJTestReport | null>(null)

  const updateStepStatus = (stepId: string, status: TestStep['status'], result?: any, error?: string) => {
    setTestSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status, result, error, duration: Date.now() }
        : step
    ))
  }

  const runComprehensiveTest = async () => {
    setIsRunning(true)
    setProgress(0)
    setCurrentStep(0)
    setFinalReport(null)

    const report: CJTestReport = {
      apiConnection: { status: 'pending', message: '' },
      productSearch: { totalSearches: 0, successfulSearches: 0, totalProductsFound: 0 },
      productImport: { totalImports: 0, successfulImports: 0, failedImports: 0, importedProductIds: [] },
      recommendations: []
    }

    try {
      // Step 1: Authentication Test
      setCurrentStep(0)
      updateStepStatus('auth', 'running')
      try {
        const startTime = Date.now()
        const token = await cjAPI.authenticate()
        const responseTime = Date.now() - startTime
        updateStepStatus('auth', 'success', { token: token.substring(0, 8) + '...', responseTime })
        report.apiConnection.responseTime = `${responseTime}ms`
        setProgress(14)
      } catch (error) {
        updateStepStatus('auth', 'failed', null, error.message)
        report.apiConnection.status = 'failed'
        report.apiConnection.message = error.message
        throw error
      }

      // Step 2: Connection Test
      setCurrentStep(1)
      updateStepStatus('connection', 'running')
      try {
        const connectionResult = await cjAPI.testConnection()
        updateStepStatus('connection', 'success', connectionResult)
        report.apiConnection.status = connectionResult.success ? 'success' : 'failed'
        report.apiConnection.message = connectionResult.message
        setProgress(28)
      } catch (error) {
        updateStepStatus('connection', 'failed', null, error.message)
        report.apiConnection.status = 'failed'
        report.apiConnection.message = error.message
      }

      // Step 3: Categories Test
      setCurrentStep(2)
      updateStepStatus('categories', 'running')
      try {
        const categories = await cjAPI.getCategories()
        updateStepStatus('categories', 'success', { count: categories.length, categories: categories.slice(0, 5) })
        setProgress(42)
      } catch (error) {
        updateStepStatus('categories', 'failed', null, error.message)
      }

      // Step 4: Trending Products Test
      setCurrentStep(3)
      updateStepStatus('trending', 'running')
      try {
        const trending = await cjAPI.getTrendingProducts(10)
        const transformed = trending.map(p => cjAPI.transformProduct(p))
        updateStepStatus('trending', 'success', { count: transformed.length, products: transformed.slice(0, 3) })
        setProgress(56)
      } catch (error) {
        updateStepStatus('trending', 'failed', null, error.message)
      }

      // Step 5: Product Search Test
      setCurrentStep(4)
      updateStepStatus('search', 'running')
      const searchKeywords = ['wireless', 'phone case', 'bluetooth']
      let searchResults = []
      
      for (const keyword of searchKeywords) {
        try {
          const results = await cjAPI.getProducts({ keyword, pageSize: 5 })
          searchResults.push(...results.products)
          report.productSearch.totalSearches++
          report.productSearch.successfulSearches++
          report.productSearch.totalProductsFound += results.products.length
          await new Promise(resolve => setTimeout(resolve, 500)) // Rate limiting
        } catch (error) {
          report.productSearch.totalSearches++
          console.error(`Search failed for "${keyword}":`, error)
        }
      }
      
      if (searchResults.length > 0) {
        updateStepStatus('search', 'success', { 
          totalSearches: report.productSearch.totalSearches,
          productsFound: report.productSearch.totalProductsFound,
          sampleProducts: searchResults.slice(0, 3).map(p => cjAPI.transformProduct(p))
        })
      } else {
        updateStepStatus('search', 'failed', null, 'No products found in searches')
      }
      setProgress(70)

      // Step 6: Product Details Test
      setCurrentStep(5)
      updateStepStatus('details', 'running')
      if (searchResults.length > 0) {
        try {
          const productId = searchResults[0].pid
          const details = await cjAPI.getProductDetails(productId)
          const transformed = cjAPI.transformProduct(details)
          updateStepStatus('details', 'success', { product: transformed })
          report.productImport.totalImports++
          report.productImport.successfulImports++
          report.productImport.importedProductIds.push(transformed.id)
        } catch (error) {
          updateStepStatus('details', 'failed', null, error.message)
          report.productImport.totalImports++
          report.productImport.failedImports++
        }
      } else {
        updateStepStatus('details', 'failed', null, 'No products available for testing')
      }
      setProgress(84)

      // Step 7: Shipping Calculation Test
      setCurrentStep(6)
      updateStepStatus('shipping', 'running')
      if (searchResults.length > 0) {
        try {
          const shipping = await cjAPI.calculateShippingCost({
            products: [{ pid: searchResults[0].pid, quantity: 1 }],
            country: 'US'
          })
          updateStepStatus('shipping', 'success', shipping)
        } catch (error) {
          updateStepStatus('shipping', 'failed', null, error.message)
        }
      } else {
        updateStepStatus('shipping', 'failed', null, 'No products available for shipping test')
      }
      
      setProgress(100)

      // Generate recommendations
      const recommendations = []
      
      if (report.apiConnection.status === 'success') {
        recommendations.push('API integration is working correctly')
      } else {
        recommendations.push('Check API credentials and network connectivity')
      }
      
      if (report.productSearch.successfulSearches > 0) {
        recommendations.push(`Product search is functional with ${report.productSearch.totalProductsFound} products found`)
      } else {
        recommendations.push('Consider expanding search keywords or checking product availability')
      }
      
      if (report.productImport.successfulImports > 0) {
        recommendations.push('Product import is ready for production use')
      } else {
        recommendations.push('Review import process and error handling')
      }
      
      recommendations.push('Consider implementing caching for frequently accessed data')
      recommendations.push('Set up monitoring for API rate limits and quotas')

      report.recommendations = recommendations
      setFinalReport(report)

      toast.success('CJ Dropshipping integration test completed!')

    } catch (error) {
      console.error('Test failed:', error)
      toast.error('Test suite failed: ' + error.message)
      
      if (!finalReport) {
        setFinalReport({
          apiConnection: { status: 'failed', message: error.message },
          productSearch: { totalSearches: 0, successfulSearches: 0, totalProductsFound: 0 },
          productImport: { totalImports: 0, successfulImports: 0, failedImports: 0, importedProductIds: [] },
          recommendations: ['Fix API authentication issues before proceeding']
        })
      }
    } finally {
      setIsRunning(false)
    }
  }

  const getStepIcon = (status: TestStep['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'running':
        return <Clock className="h-5 w-5 text-blue-600 animate-spin" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStepColor = (status: TestStep['status']) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'failed':
        return 'border-red-200 bg-red-50'
      case 'running':
        return 'border-blue-200 bg-blue-50'
      default:
        return 'border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Package className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">CJ Dropshipping Comprehensive Test</h1>
            <p className="text-muted-foreground">
              Complete integration testing with your API key: 5e0e680914c6...
            </p>
          </div>
        </div>

        {/* Test Control */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Test Suite Control
            </CardTitle>
            <CardDescription>
              Run comprehensive tests to validate all CJ Dropshipping API functions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={runComprehensiveTest} 
              disabled={isRunning}
              size="lg"
              className="w-full"
            >
              {isRunning ? (
                <>
                  <Clock className="h-4 w-4 animate-spin mr-2" />
                  Running Tests... Step {currentStep + 1}/7
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start Comprehensive Test
                </>
              )}
            </Button>
            
            {isRunning && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground text-center">
                  {progress}% Complete
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Steps */}
        <div className="space-y-3">
          {testSteps.map((step, index) => (
            <Card key={step.id} className={getStepColor(step.status)}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  {getStepIcon(step.status)}
                  <div className="flex-1">
                    <h3 className="font-medium">{step.name}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                    
                    {step.result && step.status === 'success' && (
                      <div className="mt-2 text-xs text-green-700">
                        {step.id === 'auth' && `Token: ${step.result.token}, Response: ${step.result.responseTime}ms`}
                        {step.id === 'connection' && step.result.message}
                        {step.id === 'categories' && `Found ${step.result.count} categories`}
                        {step.id === 'trending' && `Found ${step.result.count} trending products`}
                        {step.id === 'search' && `${step.result.totalSearches} searches, ${step.result.productsFound} products found`}
                        {step.id === 'details' && `Product: ${step.result.product?.name}`}
                        {step.id === 'shipping' && `Shipping: $${step.result.cost} ${step.result.currency}`}
                      </div>
                    )}
                    
                    {step.error && step.status === 'failed' && (
                      <div className="mt-2 text-xs text-red-700">
                        Error: {step.error}
                      </div>
                    )}
                  </div>
                  <Badge variant={step.status === 'success' ? 'default' : step.status === 'failed' ? 'destructive' : 'secondary'}>
                    {step.status.toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Final Report */}
        {finalReport && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Test Report Summary</h2>
            <CJTestReportSummary 
              report={finalReport} 
              onRetry={runComprehensiveTest}
            />
          </div>
        )}
      </div>
    </div>
  )
}