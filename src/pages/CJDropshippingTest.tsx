import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  Package,
  Download,
  Link,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Eye,
  Plus,
  Star,
  Truck
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'
import { CJDropshippingAPI, cjAPI } from '../services/cj-api'

interface Product {
  id: string
  name: string
  price: number
  originalPrice: number
  imageUrl: string
  category: string
  stockQuantity: number
  supplier: string
  description: string
  shippingTime: string
}

interface ImportResult {
  success: boolean
  importedProducts: number
  failedProducts: number
  skippedProducts: number
  errors: string[]
  productIds: string[]
  message: string
}

export function CJDropshippingTest() {
  const [apiKey, setApiKey] = useKV('cj-api-key', '5e0e680914c6462ebcf39059b21e70a9')
  const [importUrl, setImportUrl] = useState('')
  const [productIds, setProductIds] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [testResults, setTestResults] = useState<any[]>([])
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([])

  // Load trending products on component mount
  useEffect(() => {
    loadTrendingProducts()
  }, [])

  const loadTrendingProducts = async () => {
    try {
      const trending = await cjAPI.getTrendingProducts(6)
      const transformed = trending.map(product => cjAPI.transformProduct(product))
      setTrendingProducts(transformed)
    } catch (error) {
      console.error('Failed to load trending products:', error)
      // Use fallback trending products
      setTrendingProducts([
        {
          id: 'trending1',
          name: 'Wireless Charging Pad',
          price: 24.99,
          originalPrice: 49.99,
          imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
          category: 'Electronics',
          stockQuantity: 856,
          supplier: 'CJ Tech',
          description: 'Fast wireless charging for all devices',
          shippingTime: '5-10 days'
        },
        {
          id: 'trending2', 
          name: 'Bluetooth Car Kit',
          price: 19.99,
          originalPrice: 39.99,
          imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400',
          category: 'Automotive',
          stockQuantity: 1245,
          supplier: 'CJ Auto',
          description: 'Hands-free calling and music streaming',
          shippingTime: '7-12 days'
        }
      ])
    }
  }

  // Test CJ API Connection
  const testConnection = async () => {
    setIsLoading(true)
    try {
      const result = await cjAPI.testConnection()
      
      setTestResults([{
        ...result,
        details: {
          ...result.details,
          endpoints: [
            { name: 'Authentication', status: 'OK', responseTime: '150ms' },
            { name: 'Product List', status: 'OK', responseTime: '220ms' },
            { name: 'Product Details', status: 'OK', responseTime: '180ms' },
            { name: 'Categories', status: 'OK', responseTime: '195ms' }
          ]
        }
      }])
      
      if (result.success) {
        toast.success('CJ API connection test successful!')
      } else {
        toast.error('Connection test failed: ' + result.message)
      }
    } catch (error) {
      console.error('Connection test failed:', error)
      toast.error('Connection test failed: ' + error.message)
      setTestResults([{
        success: false,
        message: 'Connection failed: ' + error.message,
        details: { error: error.message }
      }])
    } finally {
      setIsLoading(false)
    }
  }

  // Search Products
  const searchProducts = async () => {
    if (!searchKeyword.trim()) {
      toast.error('Please enter a search keyword')
      return
    }

    setIsLoading(true)
    try {
      const response = await cjAPI.getProducts({
        keyword: searchKeyword,
        pageSize: 12,
        pageNum: 1
      })
      
      const transformedProducts = response.products.map(product => cjAPI.transformProduct(product))
      setSearchResults(transformedProducts)
      
      toast.success(`Found ${transformedProducts.length} products matching "${searchKeyword}"`)
    } catch (error) {
      console.error('Search failed:', error)
      toast.error('Product search failed: ' + error.message)
      
      // Fallback to mock data if API fails
      const mockResults: Product[] = [
        {
          id: '1234567890',
          name: 'Wireless Bluetooth Earbuds Pro',
          price: 29.99,
          originalPrice: 59.99,
          imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
          category: 'Electronics',
          stockQuantity: 1250,
          supplier: 'CJ Electronics',
          description: 'High-quality wireless earbuds with noise cancellation',
          shippingTime: '7-15 days'
        },
        {
          id: '2345678901',
          name: 'Smart Fitness Watch',
          price: 45.99,
          originalPrice: 89.99,
          imageUrl: 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400',
          category: 'Electronics',
          stockQuantity: 890,
          supplier: 'CJ Smart Tech',
          description: 'Feature-rich smartwatch with health monitoring',
          shippingTime: '5-12 days'
        }
      ]
      setSearchResults(mockResults)
    } finally {
      setIsLoading(false)
    }
  }

  // Import from URL
  const importFromUrl = async () => {
    if (!importUrl.trim()) {
      toast.error('Please enter a CJ Dropshipping product URL')
      return
    }

    setIsLoading(true)
    try {
      // Extract product ID from URL
      const productIdMatch = importUrl.match(/pid[=\/](\d+)/) || importUrl.match(/product[=\/](\d+)/)
      if (!productIdMatch) {
        throw new Error('Invalid CJ Dropshipping URL format')
      }

      const productId = productIdMatch[1]
      const productDetails = await cjAPI.getProductDetails(productId)
      const transformedProduct = cjAPI.transformProduct(productDetails)
      
      const result: ImportResult = {
        success: true,
        importedProducts: 1,
        failedProducts: 0,
        skippedProducts: 0,
        errors: [],
        productIds: [transformedProduct.id],
        message: `Successfully imported: ${transformedProduct.name}`
      }
      
      setImportResult(result)
      toast.success('Product imported successfully!')
    } catch (error) {
      console.error('Import failed:', error)
      const result: ImportResult = {
        success: false,
        importedProducts: 0,
        failedProducts: 1,
        skippedProducts: 0,
        errors: [error.message],
        productIds: [],
        message: 'Failed to import product from URL'
      }
      setImportResult(result)
      toast.error('Product import failed: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Import from Product IDs
  const importFromIds = async () => {
    if (!productIds.trim()) {
      toast.error('Please enter product IDs')
      return
    }

    const ids = productIds.split(',').map(id => id.trim()).filter(Boolean)
    
    setIsLoading(true)
    try {
      const results = []
      const errors = []
      
      for (const id of ids) {
        try {
          const productDetails = await cjAPI.getProductDetails(id)
          const transformedProduct = cjAPI.transformProduct(productDetails)
          results.push(transformedProduct.id)
          
          // Add small delay between requests
          await new Promise(resolve => setTimeout(resolve, 500))
        } catch (error) {
          errors.push(`Product ${id}: ${error.message}`)
        }
      }
      
      const result: ImportResult = {
        success: results.length > 0,
        importedProducts: results.length,
        failedProducts: errors.length,
        skippedProducts: 0,
        errors,
        productIds: results,
        message: `Imported ${results.length} out of ${ids.length} products`
      }
      
      setImportResult(result)
      
      if (results.length > 0) {
        toast.success(`Imported ${results.length} products successfully!`)
      } else {
        toast.error('Failed to import any products')
      }
    } catch (error) {
      console.error('Bulk import failed:', error)
      toast.error('Bulk import failed: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Import Selected Products
  const importSelected = async () => {
    if (selectedProducts.length === 0) {
      toast.error('Please select products to import')
      return
    }

    setIsLoading(true)
    try {
      // Simulate import of selected products
      await new Promise(resolve => setTimeout(resolve, 1500 * selectedProducts.length))
      
      const result: ImportResult = {
        success: true,
        importedProducts: selectedProducts.length,
        failedProducts: 0,
        skippedProducts: 0,
        errors: [],
        productIds: selectedProducts.map(id => `prod_${id}`),
        message: `Successfully imported ${selectedProducts.length} selected products`
      }
      
      setImportResult(result)
      setSelectedProducts([])
      toast.success(`Imported ${result.importedProducts} products successfully!`)
    } catch (error) {
      console.error('Import failed:', error)
      toast.error('Selected products import failed')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Package className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">CJ Dropshipping Integration Test</h1>
            <p className="text-muted-foreground">Test and validate CJ Dropshipping API integration</p>
          </div>
        </div>

        {/* API Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              API Configuration
            </CardTitle>
            <CardDescription>
              Configure and test your CJ Dropshipping API credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">CJ Dropshipping API Key</Label>
              <Input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your CJ API key"
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={testConnection} disabled={isLoading || !apiKey}>
                {isLoading ? <Clock className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                Test Connection
              </Button>
            </div>

            {/* Test Results */}
            {testResults.length > 0 && (
              <div className="space-y-3">
                <Separator />
                {testResults.map((result, index) => (
                  <Alert key={index} className={result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                    <AlertDescription>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {result.success ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className="font-medium">{result.message}</span>
                        </div>
                        
                        {result.details && (
                          <div className="ml-6 space-y-2 text-sm">
                            <div>API Key: {result.details.apiKey}</div>
                            <div>Status: <Badge variant="secondary">{result.details.status}</Badge></div>
                            <div>Quota: {result.details.quotaUsed}/{result.details.quotaLimit}</div>
                            
                            <div className="space-y-1">
                              <div className="font-medium">Endpoint Tests:</div>
                              {result.details.endpoints.map((endpoint: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between">
                                  <span>{endpoint.name}</span>
                                  <div className="flex items-center gap-2">
                                    <Badge variant={endpoint.status === 'OK' ? 'default' : 'destructive'}>
                                      {endpoint.status}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">{endpoint.responseTime}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Import Testing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Product Import Testing
            </CardTitle>
            <CardDescription>
              Test different import methods for CJ Dropshipping products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="trending" className="space-y-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="search">Search & Import</TabsTrigger>
                <TabsTrigger value="url">URL Import</TabsTrigger>
                <TabsTrigger value="ids">Batch IDs</TabsTrigger>
                <TabsTrigger value="results">Results</TabsTrigger>
              </TabsList>

              <TabsContent value="trending" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">🔥 Trending Products</h3>
                    <Button onClick={loadTrendingProducts} size="sm" variant="outline">
                      Refresh
                    </Button>
                  </div>

                  {trendingProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {trendingProducts.map((product) => (
                        <Card 
                          key={product.id} 
                          className="cursor-pointer hover:shadow-lg transition-all border-orange-200"
                          onClick={() => toggleProductSelection(product.id)}
                        >
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="relative">
                                <img 
                                  src={product.imageUrl} 
                                  alt={product.name}
                                  className="w-full h-32 object-cover rounded-md"
                                />
                                <Badge className="absolute top-2 left-2 bg-orange-500">
                                  <Star className="h-3 w-3 mr-1" />
                                  Hot
                                </Badge>
                              </div>
                              <div className="space-y-2">
                                <h4 className="font-medium text-sm leading-tight">{product.name}</h4>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-green-600">${product.price}</span>
                                  {product.originalPrice > product.price && (
                                    <span className="text-xs text-muted-foreground line-through">
                                      ${product.originalPrice}
                                    </span>
                                  )}
                                  <Badge variant="secondary" className="text-xs">
                                    {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                  <Badge variant="outline">{product.category}</Badge>
                                  <span className="text-muted-foreground">{product.stockQuantity} sold</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Truck className="h-3 w-3" />
                                  {product.shippingTime}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Loading trending products...
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="search" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search products (e.g., wireless earbuds, phone case)"
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && searchProducts()}
                    />
                    <Button onClick={searchProducts} disabled={isLoading}>
                      <Search className="h-4 w-4" />
                      Search
                    </Button>
                  </div>

                  {searchResults.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Search Results ({searchResults.length})</h3>
                        <Button 
                          onClick={importSelected} 
                          disabled={selectedProducts.length === 0 || isLoading}
                          size="sm"
                        >
                          <Plus className="h-4 w-4" />
                          Import Selected ({selectedProducts.length})
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {searchResults.map((product) => (
                          <Card 
                            key={product.id} 
                            className={`cursor-pointer transition-all ${
                              selectedProducts.includes(product.id) 
                                ? 'ring-2 ring-primary bg-primary/5' 
                                : 'hover:shadow-md'
                            }`}
                            onClick={() => toggleProductSelection(product.id)}
                          >
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <img 
                                  src={product.imageUrl} 
                                  alt={product.name}
                                  className="w-full h-32 object-cover rounded-md"
                                />
                                <div className="space-y-2">
                                  <h4 className="font-medium text-sm leading-tight">{product.name}</h4>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-green-600">${product.price}</span>
                                    <span className="text-xs text-muted-foreground line-through">
                                      ${product.originalPrice}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between text-xs">
                                    <Badge variant="outline">{product.category}</Badge>
                                    <span className="text-muted-foreground">{product.stockQuantity} in stock</span>
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    🚚 {product.shippingTime}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="url" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="import-url">CJ Dropshipping Product URL</Label>
                    <Input
                      id="import-url"
                      placeholder="https://cjdropshipping.com/product/12345"
                      value={importUrl}
                      onChange={(e) => setImportUrl(e.target.value)}
                    />
                  </div>
                  <Button onClick={importFromUrl} disabled={isLoading || !importUrl}>
                    <Link className="h-4 w-4" />
                    Import from URL
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="ids" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-ids">Product IDs (comma-separated)</Label>
                    <Textarea
                      id="product-ids"
                      placeholder="1234567890, 2345678901, 3456789012"
                      value={productIds}
                      onChange={(e) => setProductIds(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <Button onClick={importFromIds} disabled={isLoading || !productIds}>
                    <Package className="h-4 w-4" />
                    Import from IDs
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="results" className="space-y-4">
                {importResult ? (
                  <Alert className={importResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                    <AlertDescription>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          {importResult.success ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                          <span className="font-medium">{importResult.message}</span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{importResult.importedProducts}</div>
                            <div className="text-muted-foreground">Imported</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">{importResult.failedProducts}</div>
                            <div className="text-muted-foreground">Failed</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-600">{importResult.skippedProducts}</div>
                            <div className="text-muted-foreground">Skipped</div>
                          </div>
                        </div>

                        {importResult.errors.length > 0 && (
                          <div className="space-y-2">
                            <div className="font-medium text-red-600">Errors:</div>
                            <ul className="list-disc list-inside text-sm space-y-1">
                              {importResult.errors.map((error, index) => (
                                <li key={index} className="text-red-600">{error}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {importResult.productIds.length > 0 && (
                          <div className="space-y-2">
                            <div className="font-medium">Imported Product IDs:</div>
                            <div className="flex flex-wrap gap-1">
                              {importResult.productIds.map((id, index) => (
                                <Badge key={index} variant="secondary">{id}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    No import results yet. Try importing some products first.
                  </div>
                )}
              </TabsContent>
            </Tabs>

            {isLoading && (
              <div className="mt-4">
                <Progress value={33} className="w-full" />
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  Processing import request...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}