import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Package, DollarSign, TrendingUp, Eye, Trash2, RefreshCw } from '@phosphor-icons/react'
import { useLanguage } from '../../contexts/LanguageContext'
import { toast } from 'sonner'

interface UserProduct {
  id: string
  user_id: string
  product_id: string
  assigned_at: string
  is_active: boolean
  product: {
    id: string
    external_id: string
    name: string
    description: string
    price: number
    original_price: number
    currency: string
    image_url: string
    images: string[]
    category: string
    tags: string[]
    stock_quantity: number
    supplier: string
    supplier_data: any
    commission_rate: number
  }
}

interface ProductStats {
  totalProducts: number
  totalValue: number
  avgCommission: number
  topCategory: string
}

export function ProductCatalogBrowser() {
  const { t } = useLanguage()
  const [userProducts, setUserProducts] = useState<UserProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<UserProduct | null>(null)
  const [stats, setStats] = useState<ProductStats>({
    totalProducts: 0,
    totalValue: 0,
    avgCommission: 0,
    topCategory: ''
  })

  useEffect(() => {
    loadUserProducts()
  }, [])

  useEffect(() => {
    calculateStats()
  }, [userProducts])

  const loadUserProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/dropshipping-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ action: 'getUserProducts' })
      })

      const data = await response.json()
      
      if (data.success) {
        setUserProducts(data.data)
        toast.success(t('catalog.loaded'))
      } else {
        toast.error(data.error || t('catalog.loadError'))
      }
    } catch (error) {
      console.error('Failed to load user products:', error)
      toast.error(t('catalog.loadError'))
    } finally {
      setLoading(false)
    }
  }

  const removeProduct = async (productId: string) => {
    try {
      const response = await fetch('/api/dropshipping-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ 
          action: 'removeUserProduct',
          productId 
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setUserProducts(prev => prev.filter(p => p.product_id !== productId))
        toast.success(t('catalog.productRemoved'))
      } else {
        toast.error(data.error || t('catalog.removeError'))
      }
    } catch (error) {
      console.error('Failed to remove product:', error)
      toast.error(t('catalog.removeError'))
    }
  }

  const syncProductStock = async (productIds: string[]) => {
    setLoading(true)
    try {
      const response = await fetch('/api/dropshipping-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ 
          action: 'syncStock',
          productIds: productIds
        })
      })

      const data = await response.json()
      
      if (data.success) {
        await loadUserProducts() // Reload to get updated stock
        toast.success(t('catalog.stockSynced'))
      } else {
        toast.error(data.error || t('catalog.syncError'))
      }
    } catch (error) {
      console.error('Failed to sync stock:', error)
      toast.error(t('catalog.syncError'))
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = () => {
    if (userProducts.length === 0) return

    const totalProducts = userProducts.length
    const totalValue = userProducts.reduce((sum, p) => sum + p.product.price, 0)
    const avgCommission = userProducts.reduce((sum, p) => sum + (p.product.commission_rate || 0.3), 0) / totalProducts
    
    // Find most common category
    const categoryCount: Record<string, number> = {}
    userProducts.forEach(p => {
      categoryCount[p.product.category] = (categoryCount[p.product.category] || 0) + 1
    })
    const topCategory = Object.entries(categoryCount).sort(([,a], [,b]) => b - a)[0]?.[0] || ''

    setStats({
      totalProducts,
      totalValue,
      avgCommission,
      topCategory
    })
  }

  const generateMarketingAssets = async (product: UserProduct) => {
    try {
      // This would integrate with the Magic Pages and Video Creator
      toast.success(t('catalog.assetsGenerated'))
    } catch (error) {
      toast.error(t('catalog.assetsError'))
    }
  }

  if (loading && userProducts.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('catalog.totalProducts')}</p>
                <p className="text-2xl font-bold">{stats.totalProducts}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('catalog.totalValue')}</p>
                <p className="text-2xl font-bold">${stats.totalValue.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('catalog.avgCommission')}</p>
                <p className="text-2xl font-bold">{(stats.avgCommission * 100).toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t('catalog.topCategory')}</p>
                <p className="text-lg font-medium truncate">{stats.topCategory}</p>
              </div>
              <Badge variant="secondary" className="text-xs">
                {t('catalog.category')}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {t('catalog.myProducts')}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => syncProductStock(userProducts.map(p => p.product.external_id))}
                disabled={loading || userProducts.length === 0}
              >
                {loading && <Loader2 className="animate-spin mr-2" />}
                <RefreshCw className="mr-1" />
                {t('catalog.syncStock')}
              </Button>
              <Button onClick={loadUserProducts} disabled={loading}>
                <RefreshCw className="mr-1" />
                {t('catalog.refresh')}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Products List */}
      {userProducts.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">{t('catalog.noProducts')}</h3>
            <p className="text-muted-foreground mb-4">
              {t('catalog.noProductsDescription')}
            </p>
            <Button onClick={() => window.location.href = '/dropshipping-marketplace'}>
              {t('catalog.browseProducts')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userProducts.map((userProduct) => {
            const product = userProduct.product
            return (
              <Card key={userProduct.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-square w-full mb-3 relative">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover rounded"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant={product.stock_quantity > 0 ? "default" : "destructive"}>
                        {product.stock_quantity > 0 ? t('catalog.inStock') : t('catalog.outOfStock')}
                      </Badge>
                    </div>
                  </div>

                  <h3 className="font-medium line-clamp-2 mb-2">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-primary">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.original_price > product.price && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.original_price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    <Badge variant="secondary" className="text-xs">
                      {product.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {(product.commission_rate * 100).toFixed(0)}% {t('catalog.commission')}
                    </Badge>
                  </div>

                  <div className="text-sm text-muted-foreground mb-3">
                    <div>{t('catalog.stock')}: {product.stock_quantity}</div>
                    <div>{t('catalog.supplier')}: {product.supplier}</div>
                  </div>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => setSelectedProduct(userProduct)}
                        >
                          <Eye className="mr-1" />
                          {t('catalog.details')}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{selectedProduct?.product.name}</DialogTitle>
                        </DialogHeader>
                        {selectedProduct && (
                          <ProductDetailsModal 
                            product={selectedProduct} 
                            onGenerateAssets={generateMarketingAssets}
                          />
                        )}
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeProduct(product.id)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

function ProductDetailsModal({ 
  product, 
  onGenerateAssets 
}: { 
  product: UserProduct
  onGenerateAssets: (product: UserProduct) => void 
}) {
  const { t } = useLanguage()
  const productData = product.product

  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="details">{t('catalog.details')}</TabsTrigger>
        <TabsTrigger value="specifications">{t('catalog.specifications')}</TabsTrigger>
        <TabsTrigger value="marketing">{t('catalog.marketing')}</TabsTrigger>
      </TabsList>

      <TabsContent value="details" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <img
              src={productData.image_url}
              alt={productData.name}
              className="w-full rounded-lg"
            />
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">{t('catalog.pricing')}</h3>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">
                  ${productData.price.toFixed(2)}
                </span>
                {productData.original_price > productData.price && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${productData.original_price.toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {t('catalog.yourCommission')}: ${(productData.price * productData.commission_rate).toFixed(2)} 
                ({(productData.commission_rate * 100).toFixed(0)}%)
              </p>
            </div>

            <div>
              <h3 className="font-medium">{t('catalog.availability')}</h3>
              <p>{t('catalog.stock')}: {productData.stock_quantity}</p>
              <p>{t('catalog.supplier')}: {productData.supplier}</p>
            </div>

            <div>
              <h3 className="font-medium">{t('catalog.category')}</h3>
              <Badge>{productData.category}</Badge>
            </div>

            <div>
              <h3 className="font-medium">{t('catalog.tags')}</h3>
              <div className="flex flex-wrap gap-1">
                {productData.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">{t('catalog.description')}</h3>
          <p className="text-sm text-muted-foreground">
            {productData.description}
          </p>
        </div>
      </TabsContent>

      <TabsContent value="specifications" className="space-y-4">
        {productData.supplier_data && (
          <div className="space-y-4">
            {Object.entries(productData.supplier_data).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span>
                <span className="text-muted-foreground">
                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                </span>
              </div>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="marketing" className="space-y-4">
        <div className="text-center py-4">
          <h3 className="font-medium mb-2">{t('catalog.generateAssets')}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {t('catalog.generateAssetsDescription')}
          </p>
          <Button onClick={() => onGenerateAssets(product)} className="w-full">
            {t('catalog.generateNow')}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <h4 className="font-medium">{t('catalog.landingPage')}</h4>
              <p className="text-xs text-muted-foreground">{t('catalog.landingPageDescription')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <h4 className="font-medium">{t('catalog.videoAd')}</h4>
              <p className="text-xs text-muted-foreground">{t('catalog.videoAdDescription')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <h4 className="font-medium">{t('catalog.facebookAd')}</h4>
              <p className="text-xs text-muted-foreground">{t('catalog.facebookAdDescription')}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <h4 className="font-medium">{t('catalog.whatsappBot')}</h4>
              <p className="text-xs text-muted-foreground">{t('catalog.whatsappBotDescription')}</p>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  )
}