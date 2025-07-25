import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Package, 
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Star
} from '@phosphor-icons/react'

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

interface Props {
  report: CJTestReport
  onRetry: () => void
}

export function CJTestReportSummary({ report, onRetry }: Props) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'failed':
        return 'border-red-200 bg-red-50'
      default:
        return 'border-yellow-200 bg-yellow-50'
    }
  }

  return (
    <div className="space-y-6">
      {/* Overall Status */}
      <Card className={getStatusColor(report.apiConnection.status)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(report.apiConnection.status)}
            CJ Dropshipping Integration Test Results
          </CardTitle>
          <CardDescription>
            API Key: 5e0e680914c6... • Test completed at {new Date().toLocaleTimeString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {report.apiConnection.status === 'success' ? '✓' : '✗'}
              </div>
              <div className="text-sm text-muted-foreground">API Status</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {report.productSearch.totalProductsFound}
              </div>
              <div className="text-sm text-muted-foreground">Products Found</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {report.productImport.successfulImports}
              </div>
              <div className="text-sm text-muted-foreground">Imports Success</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {report.apiConnection.responseTime || 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground">Response Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* API Connection Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              API Connection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Status</span>
              <Badge variant={report.apiConnection.status === 'success' ? 'default' : 'destructive'}>
                {report.apiConnection.status.toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Response Time</span>
              <span className="text-sm text-muted-foreground">
                {report.apiConnection.responseTime || 'N/A'}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {report.apiConnection.message}
            </div>
          </CardContent>
        </Card>

        {/* Product Search Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Product Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Total Searches</span>
              <Badge variant="secondary">
                {report.productSearch.totalSearches}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Success Rate</span>
              <span className="text-sm font-medium">
                {report.productSearch.totalSearches > 0 
                  ? Math.round((report.productSearch.successfulSearches / report.productSearch.totalSearches) * 100)
                  : 0}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Products Found</span>
              <Badge variant="outline">
                {report.productSearch.totalProductsFound}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Import Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Import Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Total Attempts</span>
              <Badge variant="secondary">
                {report.productImport.totalImports}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Successful</span>
              <Badge className="bg-green-500">
                {report.productImport.successfulImports}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Failed</span>
              <Badge variant="destructive">
                {report.productImport.failedImports}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              {report.productImport.importedProductIds.length > 0 && (
                <div>
                  Latest: {report.productImport.importedProductIds[0]}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {report.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span>{rec}</span>
              </div>
            ))}
            {report.recommendations.length === 0 && (
              <div className="text-sm text-muted-foreground">
                No specific recommendations at this time.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button onClick={onRetry} variant="outline">
          Run Tests Again
        </Button>
        <Button>
          Start Using CJ Integration
        </Button>
      </div>
    </div>
  )
}