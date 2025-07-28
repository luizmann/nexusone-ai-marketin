import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '../../contexts/CleanLanguageContext'
import { TrendingUp, Search, Star, ShoppingCart, Eye, Plus, Filter } from 'lucide-react'
import { toast } from 'sonner'

interface Product {
  id: string
  name: string
  price: number
  originalPrice: number
  discount: number
  rating: number
  reviews: number
  image: string
  category: string
  trending: boolean
  bestseller: boolean
}

export function WinnerProducts() {
  const { t } = useLanguage()
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true)
        // Try to load products from CJ Dropshipping API via service
        const { apiService } = await import('../../services/apiService')
        const loadedProducts = await apiService.getCJProducts(
          selectedCategory === 'all' ? undefined : selectedCategory,
          searchTerm
        )
        
        // Transform API response to our Product interface
        const transformedProducts: Product[] = loadedProducts.map(product => ({
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          discount: product.discount,
          rating: product.rating,
          reviews: product.reviews,
          image: product.image,
          category: product.category,
          trending: product.trending || false,
          bestseller: product.reviews > 2000
        }))
        
        setProducts(transformedProducts)
        toast.success(`${transformedProducts.length} products loaded from CJ Dropshipping`)
      } catch (error) {
        console.error('Failed to load products:', error)
        toast.error('Failed to load products. Please check your CJ Dropshipping API configuration.')
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [selectedCategory, searchTerm])

  const categories = ['all', 'Electronics', 'Home & Garden', 'Kitchen', 'Automotive', 'Fashion', 'Sports']

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const createCampaign = (product: Product) => {
    toast.success(`${t('campaign_created_for')} ${product.name}`)
  }

  const addToStore = (product: Product) => {
    toast.success(`${product.name} ${t('added_to_your_store')}`)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('winner_products')}</h1>
          <p className="text-muted-foreground">{t('discover_trending_products_for_dropshipping')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="aspect-square bg-muted rounded-lg mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-2/3 mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-muted rounded flex-1"></div>
                  <div className="h-8 bg-muted rounded flex-1"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('winner_products')}</h1>
        <p className="text-muted-foreground">{t('discover_trending_products_for_dropshipping')}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('search_products')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              <Filter className="h-3 w-3 mr-1" />
              {category === 'all' ? t('all_categories') : category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="relative aspect-square bg-muted rounded-lg overflow-hidden mb-4">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-2 left-2 flex gap-1">
                  {product.trending && (
                    <Badge className="bg-red-500 text-white">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {t('trending')}
                    </Badge>
                  )}
                  {product.bestseller && (
                    <Badge className="bg-green-500 text-white">
                      <Star className="h-3 w-3 mr-1" />
                      {t('bestseller')}
                    </Badge>
                  )}
                </div>
                <div className="absolute top-2 right-2">
                  <Badge variant="destructive">
                    -{product.discount}%
                  </Badge>
                </div>
              </div>
              
              <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
              
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium ml-1">{product.rating}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  ({product.reviews} {t('reviews')})
                </span>
              </div>
              
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg font-bold text-foreground">
                  ${product.price}
                </span>
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice}
                </span>
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={() => createCampaign(product)}
                  className="w-full"
                  size="sm"
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {t('create_campaign')}
                </Button>
                
                <Button 
                  onClick={() => addToStore(product)}
                  variant="outline" 
                  className="w-full"
                  size="sm"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {t('add_to_store')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('no_products_found')}</h3>
            <p className="text-muted-foreground">{t('try_different_search_terms')}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t('dropshipping_stats')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">10,000+</div>
              <div className="text-sm text-blue-700">{t('available_products')}</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">98.5%</div>
              <div className="text-sm text-green-700">{t('fulfillment_rate')}</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">3-7</div>
              <div className="text-sm text-purple-700">{t('delivery_days')}</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">24/7</div>
              <div className="text-sm text-orange-700">{t('support')}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}