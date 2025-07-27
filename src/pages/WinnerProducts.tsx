import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCredits } from '@/contexts/CreditContext'
import { 
  Fire, 
  TrendingUp, 
  Star, 
  ShoppingBag,
  Lightning,
  Plus,
  Eye,
  Heart,
  ShoppingCart,
  Crown,
  Sparkles,
  Filter
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface Product {
  id: string
  title: string
  price: number
  originalPrice: number
  image: string
  rating: number
  reviews: number
  category: string
  supplier: string
  trending: boolean
  bestseller: boolean
  profitMargin: number
  description: string
  tags: string[]
}

export const WinnerProducts: React.FC = () => {
  const { credits, useCredits, getCreditCost } = useCredits()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSupplier, setSelectedSupplier] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [favorites, setFavorites] = useState<string[]>([])

  // Sample winner products data
  const products: Product[] = [
    {
      id: '1',
      title: 'Smart Fitness Tracker Watch Pro',
      price: 39.99,
      originalPrice: 89.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
      rating: 4.8,
      reviews: 2847,
      category: 'Electronics',
      supplier: 'CJ Dropshipping',
      trending: true,
      bestseller: true,
      profitMargin: 65,
      description: 'Advanced fitness tracking with heart rate monitoring, sleep tracking, and 30-day battery life.',
      tags: ['fitness', 'health', 'wearable', 'trending']
    },
    {
      id: '2',
      title: 'Wireless Bluetooth Earbuds Ultra',
      price: 29.99,
      originalPrice: 79.99,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop',
      rating: 4.7,
      reviews: 1923,
      category: 'Electronics',
      supplier: 'CJ Dropshipping',
      trending: true,
      bestseller: false,
      profitMargin: 70,
      description: 'Premium sound quality with noise cancellation and 24-hour battery life.',
      tags: ['audio', 'wireless', 'music', 'trending']
    },
    {
      id: '3',
      title: 'LED Strip Lights RGB Smart',
      price: 19.99,
      originalPrice: 49.99,
      image: 'https://images.unsplash.com/photo-1558618666-7e51a892ac6f?w=300&h=300&fit=crop',
      rating: 4.6,
      reviews: 3421,
      category: 'Home & Garden',
      supplier: 'CJ Dropshipping',
      trending: false,
      bestseller: true,
      profitMargin: 75,
      description: 'Smart RGB LED strips with app control, music sync, and voice control compatibility.',
      tags: ['lighting', 'smart home', 'decor', 'rgb']
    },
    {
      id: '4',
      title: 'Portable Phone Stand Adjustable',
      price: 12.99,
      originalPrice: 24.99,
      image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=300&h=300&fit=crop',
      rating: 4.5,
      reviews: 1567,
      category: 'Phone Accessories',
      supplier: 'CJ Dropshipping',
      trending: false,
      bestseller: false,
      profitMargin: 80,
      description: 'Universal adjustable phone stand compatible with all smartphones and tablets.',
      tags: ['phone', 'stand', 'desk', 'universal']
    },
    {
      id: '5',
      title: 'Car Phone Mount Magnetic',
      price: 15.99,
      originalPrice: 34.99,
      image: 'https://images.unsplash.com/photo-1556784344-ca-28ad4798c44?w=300&h=300&fit=crop',
      rating: 4.7,
      reviews: 892,
      category: 'Car Accessories',
      supplier: 'CJ Dropshipping',
      trending: true,
      bestseller: false,
      profitMargin: 68,
      description: 'Strong magnetic car mount with 360° rotation and one-hand operation.',
      tags: ['car', 'mount', 'magnetic', 'phone']
    },
    {
      id: '6',
      title: 'Skincare Facial Cleansing Brush',
      price: 34.99,
      originalPrice: 69.99,
      image: 'https://images.unsplash.com/photo-1556228822-d00dd8e87c70?w=300&h=300&fit=crop',
      rating: 4.8,
      reviews: 2156,
      category: 'Beauty & Health',
      supplier: 'CJ Dropshipping',
      trending: true,
      bestseller: true,
      profitMargin: 72,
      description: 'Sonic facial cleansing brush with multiple speed settings and waterproof design.',
      tags: ['skincare', 'beauty', 'cleansing', 'trending']
    }
  ]

  const categories = ['all', 'Electronics', 'Home & Garden', 'Phone Accessories', 'Car Accessories', 'Beauty & Health']
  const suppliers = ['all', 'CJ Dropshipping', 'AliExpress', 'DSers']

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesSupplier = selectedSupplier === 'all' || product.supplier === selectedSupplier
    
    return matchesSearch && matchesCategory && matchesSupplier
  })

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const importProduct = (product: Product) => {
    const cost = getCreditCost('product-import')
    
    if (!useCredits(cost)) {
      toast.error('Insufficient credits. Please upgrade your plan.')
      return
    }

    toast.success(`${product.title} imported successfully!`)
  }

  const generateCampaign = (product: Product) => {
    const cost = getCreditCost('campaign-generation')
    
    if (!useCredits(cost)) {
      toast.error('Insufficient credits. Please upgrade your plan.')
      return
    }

    toast.success(`Campaign generation started for ${product.title}`)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-red-500 to-orange-600 p-3 rounded-xl">
            <Fire className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Winner Products</h1>
        <p className="text-lg text-muted-foreground">
          Curated dropshipping products with proven sales performance
        </p>
        <Badge variant="secondary" className="mt-2">
          {credits} Credits Available
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{products.length}</div>
            <div className="text-sm text-muted-foreground">Total Products</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{products.filter(p => p.trending).length}</div>
            <div className="text-sm text-muted-foreground">Trending Now</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{products.filter(p => p.bestseller).length}</div>
            <div className="text-sm text-muted-foreground">Bestsellers</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">70%</div>
            <div className="text-sm text-muted-foreground">Avg. Profit</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
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
            </div>
            <div>
              <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                <SelectTrigger>
                  <SelectValue placeholder="Supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map(supplier => (
                    <SelectItem key={supplier} value={supplier}>
                      {supplier === 'all' ? 'All Suppliers' : supplier}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                List
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {filteredProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-all">
            <div className="relative">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="absolute top-2 left-2 flex gap-1">
                {product.trending && (
                  <Badge className="bg-red-500 hover:bg-red-600">
                    <Fire className="h-3 w-3 mr-1" />
                    Trending
                  </Badge>
                )}
                {product.bestseller && (
                  <Badge className="bg-yellow-500 hover:bg-yellow-600">
                    <Crown className="h-3 w-3 mr-1" />
                    Bestseller
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                onClick={() => toggleFavorite(product.id)}
              >
                <Heart className={`h-4 w-4 ${favorites.includes(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>

            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg leading-tight">{product.title}</h3>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">${product.price}</div>
                  <div className="text-sm text-muted-foreground line-through">${product.originalPrice}</div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-3">{product.description}</p>

              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-sm text-muted-foreground">({product.reviews})</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {product.profitMargin}% Profit
                </Badge>
              </div>

              <div className="flex gap-1 mb-4">
                {product.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => importProduct(product)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Import (10c)
                </Button>
                <Button 
                  size="sm"
                  onClick={() => generateCampaign(product)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90"
                >
                  <Lightning className="h-4 w-4 mr-1" />
                  Campaign
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-1 mt-2">
                <Button variant="ghost" size="sm" className="h-8">
                  <Eye className="h-3 w-3 mr-1" />
                  Preview
                </Button>
                <Button variant="ghost" size="sm" className="h-8">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Analytics
                </Button>
                <Button variant="ghost" size="sm" className="h-8">
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  Store
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No products found</h3>
          <p className="text-muted-foreground">Try adjusting your search filters</p>
        </div>
      )}

      {/* Import Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg mb-1">Ready to Scale Your Business?</h3>
              <p className="text-muted-foreground">
                Import trending products and generate AI-powered campaigns to start selling immediately
              </p>
            </div>
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600">
              <Sparkles className="h-5 w-5 mr-2" />
              Bulk Import
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}