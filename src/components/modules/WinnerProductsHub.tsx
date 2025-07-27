import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLanguage } from '@/contexts/CleanLanguageContext'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { 
  Trophy, 
  TrendingUp, 
  ShoppingBag, 
  Star, 
  DollarSign,
  Eye,
  Zap,
  Filter,
  Search,
  Download,
  Plus,
  ChartBar,
  Globe,
  Clock
} from '@phosphor-icons/react'

interface WinnerProduct {
  id: string
  title: string
  price: number
  originalPrice: number
  discount: number
  rating: number
  reviews: number
  sales: number
  image: string
  category: string
  supplier: string
  trending: boolean
  featured: boolean
  commission: number
  countries: string[]
  tags: string[]
  profitMargin: number
  conversionRate: number
  adSpend: number
  roas: number
}

export function WinnerProductsHub() {
  const { t } = useLanguage()
  const [products, setProducts] = useState<WinnerProduct[]>([])
  const [filteredProducts, setFilteredProducts] = useState<WinnerProduct[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('trending')
  const [isLoading, setIsLoading] = useState(true)
  const [userCredits, setUserCredits] = useKV('user-credits', { general: 500 })
  const [importedProducts, setImportedProducts] = useKV<string[]>('imported-winner-products', [])

  // Mock winner products data
  const mockProducts: WinnerProduct[] = [
    {
      id: '1',
      title: 'Wireless Charging Phone Stand',
      price: 29.99,
      originalPrice: 59.99,
      discount: 50,
      rating: 4.8,
      reviews: 2547,
      sales: 15420,
      image: '/api/placeholder/300/300',
      category: 'Electronics',
      supplier: 'TechPro Supply',
      trending: true,
      featured: true,
      commission: 8.99,
      countries: ['US', 'UK', 'CA', 'AU'],
      tags: ['fast-charging', 'universal', 'trending'],
      profitMargin: 65,
      conversionRate: 3.2,
      adSpend: 4.50,
      roas: 4.8
    },
    {
      id: '2',
      title: 'LED Strip Lights RGB',
      price: 19.99,
      originalPrice: 39.99,
      discount: 50,
      rating: 4.6,
      reviews: 1923,
      sales: 12850,
      image: '/api/placeholder/300/300',
      category: 'Home & Garden',
      supplier: 'LightMaster',
      trending: true,
      featured: false,
      commission: 6.50,
      countries: ['US', 'UK', 'DE', 'FR'],
      tags: ['smart-home', 'rgb', 'wifi'],
      profitMargin: 70,
      conversionRate: 2.8,
      adSpend: 3.20,
      roas: 5.2
    },
    {
      id: '3',
      title: 'Portable Bluetooth Speaker',
      price: 39.99,
      originalPrice: 89.99,
      discount: 56,
      rating: 4.9,
      reviews: 3156,
      sales: 8760,
      image: '/api/placeholder/300/300',
      category: 'Electronics',
      supplier: 'AudioMax',
      trending: false,
      featured: true,
      commission: 12.99,
      countries: ['US', 'CA', 'AU'],
      tags: ['waterproof', 'premium', 'bass'],
      profitMargin: 60,
      conversionRate: 4.1,
      adSpend: 8.50,
      roas: 3.8
    },
    {
      id: '4',
      title: 'Fitness Resistance Bands Set',
      price: 24.99,
      originalPrice: 49.99,
      discount: 50,
      rating: 4.7,
      reviews: 1845,
      sales: 9430,
      image: '/api/placeholder/300/300',
      category: 'Sports & Fitness',
      supplier: 'FitGear Pro',
      trending: true,
      featured: false,
      commission: 7.50,
      countries: ['US', 'UK', 'CA'],
      tags: ['workout', 'portable', 'complete-set'],
      profitMargin: 68,
      conversionRate: 3.5,
      adSpend: 5.80,
      roas: 4.2
    }
  ]

  const categories = ['all', 'Electronics', 'Home & Garden', 'Fashion', 'Sports & Fitness', 'Beauty', 'Automotive']

  useEffect(() => {
    // Simulate loading products
    const loadProducts = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1500))
      setProducts(mockProducts)
      setFilteredProducts(mockProducts)
      setIsLoading(false)
    }
    
    loadProducts()
  }, [])

  useEffect(() => {
    let filtered = [...products]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    // Sort products
    switch (sortBy) {
      case 'trending':
        filtered.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0) || b.sales - a.sales)
        break
      case 'sales':
        filtered.sort((a, b) => b.sales - a.sales)
        break
      case 'commission':
        filtered.sort((a, b) => b.commission - a.commission)
        break
      case 'profit':
        filtered.sort((a, b) => b.profitMargin - a.profitMargin)
        break
      case 'roas':
        filtered.sort((a, b) => b.roas - a.roas)
        break
      default:
        break
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, selectedCategory, sortBy])

  const handleImportProduct = async (product: WinnerProduct) => {
    if (userCredits.general < 8) {
      toast.error('Insufficient credits. You need 8 credits to import a winner product.')
      return
    }

    if (importedProducts.includes(product.id)) {
      toast.error('Product already imported!')
      return
    }

    try {
      // Simulate import process
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setImportedProducts(prev => [...prev, product.id])
      setUserCredits(prev => ({
        ...prev,
        general: prev.general - 8
      }))

      toast.success(`${product.title} imported successfully!`)
    } catch (error) {
      toast.error('Failed to import product')
    }
  }

  const handleBulkImport = async (category: string) => {
    const categoryProducts = products.filter(p => p.category === category && !importedProducts.includes(p.id))
    const totalCost = categoryProducts.length * 8

    if (userCredits.general < totalCost) {
      toast.error(`Insufficient credits. You need ${totalCost} credits to import all ${category} products.`)
      return
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newImports = categoryProducts.map(p => p.id)
      setImportedProducts(prev => [...prev, ...newImports])
      setUserCredits(prev => ({
        ...prev,
        general: prev.general - totalCost
      }))

      toast.success(`${categoryProducts.length} ${category} products imported successfully!`)
    } catch (error) {
      toast.error('Failed to import products')
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-12">
          <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <h3 className="text-lg font-medium mb-2">Loading Winner Products...</h3>
          <p className="text-muted-foreground">
            Analyzing market data and curating the best products for you
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Trophy className="h-8 w-8 text-yellow-500" />
          Winner Products Hub
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover proven, high-converting products with real sales data. 
          Import winners directly to your sales generator and start profiting immediately.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Trending Products</p>
                <p className="text-xl font-bold">{products.filter(p => p.trending).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg. Commission</p>
                <p className="text-xl font-bold">
                  ${(products.reduce((acc, p) => acc + p.commission, 0) / products.length).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ChartBar className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg. ROAS</p>
                <p className="text-xl font-bold">
                  {(products.reduce((acc, p) => acc + p.roas, 0) / products.length).toFixed(1)}x
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Imported</p>
                <p className="text-xl font-bold">{importedProducts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products, categories, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trending">Trending</SelectItem>
                <SelectItem value="sales">Best Sales</SelectItem>
                <SelectItem value="commission">Commission</SelectItem>
                <SelectItem value="profit">Profit Margin</SelectItem>
                <SelectItem value="roas">ROAS</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">All Products</TabsTrigger>
          <TabsTrigger value="trending">Trending Now</TabsTrigger>
          <TabsTrigger value="featured">Featured Winners</TabsTrigger>
          <TabsTrigger value="imported">My Imports</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          {filteredProducts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="relative overflow-hidden">
                  {product.trending && (
                    <div className="absolute top-2 left-2 z-10">
                      <Badge className="bg-red-500 text-white">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    </div>
                  )}
                  
                  {product.featured && (
                    <div className="absolute top-2 right-2 z-10">
                      <Badge variant="secondary">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  )}

                  <div className="aspect-square relative">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 right-2">
                      <Badge className="bg-green-500 text-white">
                        {product.profitMargin}% profit
                      </Badge>
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <CardTitle className="text-base line-clamp-2">
                      {product.title}
                    </CardTitle>
                    <CardDescription>
                      <Badge variant="outline" className="text-xs">
                        {product.category}
                      </Badge>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-green-600">
                          ${product.price}
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.originalPrice}
                        </span>
                      </div>
                      <Badge variant="destructive" className="text-xs">
                        -{product.discount}%
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{product.rating}</span>
                        <span className="text-muted-foreground">({product.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <ShoppingBag className="h-3 w-3" />
                        <span>{product.sales.toLocaleString()} sold</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Commission:</span>
                        <span className="font-medium ml-1">${product.commission}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">ROAS:</span>
                        <span className="font-medium ml-1">{product.roas}x</span>
                      </div>
                    </div>

                    <div className="flex gap-1 flex-wrap">
                      {product.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          // Open product details modal
                          toast.info('Product details coming soon!')
                        }}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Details
                      </Button>
                      
                      <Button
                        size="sm"
                        onClick={() => handleImportProduct(product)}
                        disabled={importedProducts.includes(product.id)}
                        className="flex-1"
                      >
                        {importedProducts.includes(product.id) ? (
                          <>
                            <Zap className="h-3 w-3 mr-1" />
                            Imported
                          </>
                        ) : (
                          <>
                            <Plus className="h-3 w-3 mr-1" />
                            Import
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="trending">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {products.filter(p => p.trending).map((product) => (
              <Card key={product.id} className="relative overflow-hidden border-orange-200">
                <div className="absolute top-2 left-2 z-10">
                  <Badge className="bg-orange-500 text-white">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Hot Trend
                  </Badge>
                </div>
                
                <div className="aspect-square relative">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <CardHeader>
                  <CardTitle className="text-base">{product.title}</CardTitle>
                  <CardDescription>
                    Trending in {product.category}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Daily Sales:</span>
                      <span className="font-medium">{Math.floor(product.sales / 30)}/day</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Trend Duration:</span>
                      <span className="font-medium">7 days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Growth Rate:</span>
                      <span className="font-medium text-green-600">+{Math.floor(Math.random() * 50 + 50)}%</span>
                    </div>
                  </div>
                  
                  <Button
                    className="w-full mt-4"
                    onClick={() => handleImportProduct(product)}
                    disabled={importedProducts.includes(product.id)}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Import Trending Product
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="featured">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {products.filter(p => p.featured).map((product) => (
              <Card key={product.id} className="border-yellow-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        Featured Winner
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Hand-picked by our experts
                      </CardDescription>
                    </div>
                    <Badge className="bg-yellow-500 text-white">Editor's Choice</Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{product.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {product.category} • {product.supplier}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-lg font-bold text-green-600">
                          ${product.price}
                        </span>
                        <Badge variant="destructive" className="text-xs">
                          -{product.discount}%
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{product.roas}x</p>
                      <p className="text-xs text-muted-foreground">ROAS</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">{product.profitMargin}%</p>
                      <p className="text-xs text-muted-foreground">Profit</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-600">{product.conversionRate}%</p>
                      <p className="text-xs text-muted-foreground">CVR</p>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => handleImportProduct(product)}
                    disabled={importedProducts.includes(product.id)}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Import Featured Product
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="imported">
          {importedProducts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Download className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No products imported yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start importing winner products to build your catalog
                </p>
                <Button onClick={() => {
                  // Switch to products tab
                  const productsTab = document.querySelector('[value="products"]') as HTMLElement
                  productsTab?.click()
                }}>
                  Browse Products
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  Your Imported Products ({importedProducts.length})
                </h3>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Sales Assets
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {products.filter(p => importedProducts.includes(p.id)).map((product) => (
                  <Card key={product.id}>
                    <div className="aspect-video relative">
                      <img 
                        src={product.image} 
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-green-500 text-white">
                          <Zap className="h-3 w-3 mr-1" />
                          Imported
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-4 space-y-3">
                      <h4 className="font-medium line-clamp-2">{product.title}</h4>
                      
                      <div className="flex justify-between text-sm">
                        <span>Commission:</span>
                        <span className="font-medium">${product.commission}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" className="flex-1">
                          <Zap className="h-3 w-3 mr-1" />
                          Generate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Credits Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span className="text-sm">Available Credits: <strong>{userCredits.general}</strong></span>
            </div>
            <div className="text-sm text-muted-foreground">
              Import cost: 8 credits per product
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}