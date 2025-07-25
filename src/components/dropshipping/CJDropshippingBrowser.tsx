import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Search, Grid3X3, List, Star, ShoppingCart, Eye, Heart } from '@phosphor-icons/react'
import { useLanguage } from '../../contexts/LanguageContext'
import { toast } from 'sonner'

interface CJProduct {
  pid: string
  productName: string
  productNameEn: string
  sellPrice: string
  originalPrice: string
  currency: string
  productImage: string
  productImages: string[]
  categoryName: string
  shippingTime: string
  supplierName: string
  sellQuantity: string
  variants?: any[]
}

interface CJCategory {
  id: string
  name: string
  nameEn: string
}

export function CJDropshippingBrowser() {
  const { t } = useLanguage()
  const [products, setProducts] = useState<CJProduct[]>([])
  const [categories, setCategories] = useState<CJCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('sales')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set())
  const [credentialsConfigured, setCredentialsConfigured] = useState(false)

  const pageSize = 20

  useEffect(() => {
    loadCategories()
    loadProducts()
  }, [])

  useEffect(() => {
    loadProducts()
  }, [currentPage, selectedCategory, sortBy, searchTerm])

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/cj-dropshipping-catalog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ action: 'getCategories' })
      })

      const data = await response.json()
      
      if (data.success) {
        setCategories(data.data)
        setCredentialsConfigured(true)
      } else if (data.requiresSetup) {
        setCredentialsConfigured(false)
        toast.error(t('cj.credentialsRequired'))
      }
    } catch (error) {
      console.error('Failed to load categories:', error)
      toast.error(t('cj.loadError'))
    }
  }

  const loadProducts = async () => {
    if (!credentialsConfigured) return
    
    setLoading(true)
    try {
      const params = {
        action: 'getProducts',
        pageNum: currentPage,
        pageSize,
        ...(selectedCategory && { categoryId: selectedCategory }),
        ...(searchTerm && { keyword: searchTerm }),
        ...(sortBy && { sortBy }),
        ...(priceRange.min && { priceMin: parseFloat(priceRange.min) }),
        ...(priceRange.max && { priceMax: parseFloat(priceRange.max) })
      }

      const response = await fetch('/api/cj-dropshipping-catalog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(params)
      })

      const data = await response.json()
      
      if (data.success) {
        setProducts(data.data.products)
        setTotalProducts(data.data.total)
      } else {
        toast.error(data.error || t('cj.loadError'))
      }
    } catch (error) {
      console.error('Failed to load products:', error)
      toast.error(t('cj.loadError'))
    } finally {
      setLoading(false)
    }
  }

  const loadTrendingProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/cj-dropshipping-catalog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ 
          action: 'getTrending',
          limit: 50 
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setProducts(data.data)
        setTotalProducts(data.data.length)
        toast.success(t('cj.trendingLoaded'))
      } else {
        toast.error(data.error || t('cj.loadError'))
      }
    } catch (error) {
      console.error('Failed to load trending products:', error)
      toast.error(t('cj.loadError'))
    } finally {
      setLoading(false)
    }
  }

  const importSelectedProducts = async () => {
    if (selectedProducts.size === 0) {
      toast.error(t('cj.selectProducts'))
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/dropshipping-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ 
          action: 'importProducts',
          productIds: Array.from(selectedProducts)
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success(t('cj.importSuccess', { count: data.data.length }))
        setSelectedProducts(new Set())
      } else {
        toast.error(data.error || t('cj.importError'))
      }
    } catch (error) {
      console.error('Failed to import products:', error)
      toast.error(t('cj.importError'))
    } finally {
      setLoading(false)
    }
  }

  const importTrendingProducts = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/dropshipping-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ 
          action: 'importTrending',
          categories: selectedCategory ? [selectedCategory] : [],
          limit: 100
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success(t('cj.trendingImported', { count: data.data.length }))
      } else {
        toast.error(data.error || t('cj.importError'))
      }
    } catch (error) {
      console.error('Failed to import trending products:', error)
      toast.error(t('cj.importError'))
    } finally {
      setLoading(false)
    }
  }

  const toggleProductSelection = (productId: string) => {
    const newSelection = new Set(selectedProducts)
    if (newSelection.has(productId)) {
      newSelection.delete(productId)
    } else {
      newSelection.add(productId)
    }
    setSelectedProducts(newSelection)
  }

  const handleSearch = () => {
    setCurrentPage(1)
    loadProducts()
  }

  const handlePriceFilter = () => {
    setCurrentPage(1)
    loadProducts()
  }

  if (!credentialsConfigured) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('cj.setupRequired')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              {t('cj.setupMessage')}
            </p>
            <Button onClick={() => window.location.href = '/settings'}>
              {t('cj.configureCredentials')}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {t('cj.productCatalog')}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? <List /> : <Grid3X3 />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={loadTrendingProducts}
                disabled={loading}
              >
                <Star />
                {t('cj.trending')}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="flex gap-2">
              <Input
                placeholder={t('cj.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={loading}>
                <Search />
              </Button>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder={t('cj.allCategories')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t('cj.allCategories')}</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.nameEn || cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">{t('cj.sortBySales')}</SelectItem>
                <SelectItem value="price">{t('cj.sortByPrice')}</SelectItem>
                <SelectItem value="newest">{t('cj.sortByNewest')}</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Input
                placeholder={t('cj.minPrice')}
                type="number"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              />
              <Input
                placeholder={t('cj.maxPrice')}
                type="number"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              />
              <Button variant="outline" onClick={handlePriceFilter}>
                {t('cj.filter')}
              </Button>
            </div>
          </div>

          {selectedProducts.size > 0 && (
            <div className="flex items-center justify-between p-4 bg-accent rounded-lg mb-4">
              <span>
                {t('cj.selectedProducts', { count: selectedProducts.size })}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedProducts(new Set())}
                >
                  {t('cj.clearSelection')}
                </Button>
                <Button onClick={importSelectedProducts} disabled={loading}>
                  {loading && <Loader2 className="animate-spin mr-2" />}
                  {t('cj.importSelected')}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products Grid/List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <div className={`grid gap-4 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {products.map((product) => (
              <Card 
                key={product.pid} 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedProducts.has(product.pid) ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => toggleProductSelection(product.pid)}
              >
                <CardContent className="p-4">
                  <div className={`${viewMode === 'list' ? 'flex gap-4' : ''}`}>
                    <div className={`${viewMode === 'list' ? 'w-24 h-24' : 'w-full h-48'} relative mb-2`}>
                      <img
                        src={product.productImage}
                        alt={product.productName}
                        className="w-full h-full object-cover rounded"
                      />
                      <div className="absolute top-2 right-2">
                        <Button
                          size="sm"
                          variant={selectedProducts.has(product.pid) ? "default" : "secondary"}
                          className="w-8 h-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleProductSelection(product.pid)
                          }}
                        >
                          <Heart 
                            className={selectedProducts.has(product.pid) ? "fill-current" : ""} 
                          />
                        </Button>
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium line-clamp-2 mb-1">
                        {product.productNameEn || product.productName}
                      </h3>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-bold text-primary">
                          ${parseFloat(product.sellPrice).toFixed(2)}
                        </span>
                        {parseFloat(product.originalPrice) > parseFloat(product.sellPrice) && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${parseFloat(product.originalPrice).toFixed(2)}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {product.categoryName}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {product.supplierName}
                        </Badge>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        <div>{t('cj.stock')}: {product.sellQuantity}</div>
                        <div>{t('cj.shipping')}: {product.shippingTime}</div>
                      </div>

                      {viewMode === 'list' && (
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline">
                            <Eye className="mr-1" />
                            {t('cj.viewDetails')}
                          </Button>
                          <Button size="sm">
                            <ShoppingCart className="mr-1" />
                            {t('cj.addToCatalog')}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalProducts > pageSize && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                {t('common.previous')}
              </Button>
              
              <span className="flex items-center px-4">
                {t('common.page')} {currentPage} {t('common.of')} {Math.ceil(totalProducts / pageSize)}
              </span>
              
              <Button
                variant="outline"
                disabled={currentPage >= Math.ceil(totalProducts / pageSize)}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                {t('common.next')}
              </Button>
            </div>
          )}

          {/* Bulk Actions */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{t('cj.bulkActions')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('cj.bulkActionsDescription')}
                  </p>
                </div>
                <Button onClick={importTrendingProducts} disabled={loading}>
                  {loading && <Loader2 className="animate-spin mr-2" />}
                  {t('cj.importTrendingBulk')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}