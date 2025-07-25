import React, { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  ShoppingCart, 
  TrendingUp, 
  Star, 
  Search, 
  Filter,
  Zap,
  Eye,
  Heart,
  ArrowRight,
  DollarSign,
  Package,
  Users,
  Target
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useLanguage } from '../../contexts/LanguageContext'

interface Product {
  id: string
  name: string
  image: string
  price: number
  originalPrice: number
  discount: number
  rating: number
  reviews: number
  sales: number
  category: string
  tags: string[]
  trending: boolean
  bestSeller: boolean
  supplier: 'cjdropshipping' | 'aliexpress' | 'dsers'
  description: string
  variants: {
    color?: string[]
    size?: string[]
  }
  shippingTime: string
  profit: number
}

export function DropshippingMarketplace() {
  const [products, setProducts] = useKV<Product[]>('dropshipping-products', [])
  const [selectedProducts, setSelectedProducts] = useKV<string[]>('selected-products', [])
  const [activeTab, setActiveTab] = useState('trending')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('popularity')
  const { t } = useLanguage()

  // Sample products data
  useEffect(() => {
    if (products.length === 0) {
      const sampleProducts: Product[] = [
        {
          id: '1',
          name: 'Wireless Bluetooth Earbuds Pro Max',
          image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300',
          price: 29.99,
          originalPrice: 59.99,
          discount: 50,
          rating: 4.8,
          reviews: 2847,
          sales: 15420,
          category: 'Electronics',
          tags: ['trending', 'bestseller', 'tech'],
          trending: true,
          bestSeller: true,
          supplier: 'cjdropshipping',
          description: 'Premium wireless earbuds with noise cancellation and 48h battery life',
          variants: {
            color: ['Black', 'White', 'Blue', 'Rose Gold']
          },
          shippingTime: '7-15 days',
          profit: 15.00
        },
        {
          id: '2',
          name: 'Smart LED Strip Lights RGB 16.4ft',
          image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300',
          price: 19.99,
          originalPrice: 39.99,
          discount: 50,
          rating: 4.6,
          reviews: 1923,
          sales: 8765,
          category: 'Home & Garden',
          tags: ['smart', 'lighting', 'rgb'],
          trending: true,
          bestSeller: false,
          supplier: 'cjdropshipping',
          description: 'App-controlled LED strips with 16 million colors and music sync',
          variants: {
            color: ['RGB', 'Warm White', 'Cool White']
          },
          shippingTime: '5-12 days',
          profit: 10.00
        },
        {
          id: '3',
          name: 'Portable Phone Stand Adjustable',
          image: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=300',
          price: 9.99,
          originalPrice: 19.99,
          discount: 50,
          rating: 4.5,
          reviews: 3241,
          sales: 12890,
          category: 'Electronics',
          tags: ['phone', 'stand', 'portable'],
          trending: false,
          bestSeller: true,
          supplier: 'aliexpress',
          description: 'Foldable aluminum phone stand compatible with all devices',
          variants: {
            color: ['Silver', 'Black', 'Rose Gold']
          },
          shippingTime: '10-20 days',
          profit: 5.00
        },
        {
          id: '4',
          name: 'Skincare Set Anti-Aging Vitamin C',
          image: 'https://images.unsplash.com/photo-1556228578-dd6645bd1b1f?w=300',
          price: 34.99,
          originalPrice: 79.99,
          discount: 56,
          rating: 4.7,
          reviews: 1567,
          sales: 5432,
          category: 'Beauty & Health',
          tags: ['skincare', 'vitamin-c', 'anti-aging'],
          trending: true,
          bestSeller: false,
          supplier: 'dsers',
          description: 'Complete 3-step skincare routine with Vitamin C serum',
          variants: {},
          shippingTime: '7-14 days',
          profit: 20.00
        },
        {
          id: '5',
          name: 'Magnetic Car Phone Mount 360°',
          image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=300',
          price: 12.99,
          originalPrice: 24.99,
          discount: 48,
          rating: 4.4,
          reviews: 987,
          sales: 3456,
          category: 'Automotive',
          tags: ['car', 'mount', 'magnetic'],
          trending: false,
          bestSeller: true,
          supplier: 'cjdropshipping',
          description: 'Strong magnetic mount with 360° rotation for car dashboard',
          variants: {
            color: ['Black', 'Silver']
          },
          shippingTime: '8-16 days',
          profit: 7.00
        }
      ]
      
      setProducts(sampleProducts)
    }
  }, [products, setProducts])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
    
    switch (activeTab) {
      case 'trending':
        return matchesSearch && matchesCategory && product.trending
      case 'bestsellers':
        return matchesSearch && matchesCategory && product.bestSeller
      case 'all':
        return matchesSearch && matchesCategory
      default:
        return matchesSearch && matchesCategory
    }
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'sales':
        return b.sales - a.sales
      default:
        return b.sales - a.sales
    }
  })

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))]

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const generateCampaign = async () => {
    if (selectedProducts.length === 0) {
      toast.error('Please select at least one product to generate campaign')
      return
    }

    toast.loading('Generating AI campaign...')
    
    try {
      // Simulate campaign generation
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      toast.success(`Campaign generated for ${selectedProducts.length} products!`)
      
      // Navigate to campaign builder (you can implement this)
      // router.push('/campaign-builder')
      
    } catch (error) {
      toast.error('Failed to generate campaign')
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dropshipping Marketplace</h1>
          <p className="text-gray-600 mt-1">Choose products and create AI-powered campaigns instantly</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="px-3 py-1">
            <Package className="w-4 h-4 mr-1" />
            {selectedProducts.length} Selected
          </Badge>
          
          <Button 
            onClick={generateCampaign}
            disabled={selectedProducts.length === 0}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Zap className="w-4 h-4 mr-2" />
            Generate AI Campaign
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full lg:w-48">
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
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Trending Products
          </TabsTrigger>
          <TabsTrigger value="bestsellers" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Best Sellers
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            All Products
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <Card 
                key={product.id} 
                className={`group cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedProducts.includes(product.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => toggleProductSelection(product.id)}
              >
                <CardContent className="p-0">
                  {/* Product Image */}
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.trending && (
                        <Badge className="bg-red-500 text-white text-xs">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                      {product.bestSeller && (
                        <Badge className="bg-orange-500 text-white text-xs">
                          <Star className="w-3 h-3 mr-1" />
                          Best Seller
                        </Badge>
                      )}
                    </div>
                    
                    {/* Discount */}
                    {product.discount > 0 && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-green-500 text-white">
                          -{product.discount}%
                        </Badge>
                      </div>
                    )}
                    
                    {/* Selection Indicator */}
                    {selectedProducts.includes(product.id) && (
                      <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                        <div className="bg-blue-500 text-white rounded-full p-2">
                          <ShoppingCart className="w-6 h-6" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                    </div>

                    {/* Rating & Reviews */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {product.rating} ({product.reviews.toLocaleString()})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-green-600">
                          ${product.price}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                      
                      <Badge variant="outline" className="text-xs">
                        <DollarSign className="w-3 h-3 mr-1" />
                        +${product.profit} profit
                      </Badge>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {product.sales.toLocaleString()} sold
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {product.supplier}
                      </div>
                    </div>

                    {/* Shipping */}
                    <div className="text-xs text-gray-500 bg-gray-50 rounded p-2">
                      📦 Shipping: {product.shippingTime}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Selected Products Summary */}
      {selectedProducts.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 text-white rounded-full p-2">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">
                    {selectedProducts.length} Products Selected
                  </h3>
                  <p className="text-sm text-blue-700">
                    Ready to generate complete AI campaign with landing page, ads & checkout
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={generateCampaign}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Generate Campaign
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}