import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Package, 
  Sync, 
  AlertTriangle, 
  TrendingUp, 
  ShoppingCart, 
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash2,
  BarChart3
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useLanguage } from '../../contexts/LanguageContext'

interface Product {
  id: string
  external_id: string
  name: string
  price: number
  cost: number
  stock_quantity: number
  category: string
  tags: string[]
  image_url: string
  is_active: boolean
  is_available: boolean
  total_sales: number
  last_sync_at?: string
  supplier: string
}

interface SyncSchedule {
  id: string
  name: string
  frequency: string
  is_active: boolean
  last_run_at?: string
  next_run_at?: string
}

export function InventoryManagement() {
  const { t } = useLanguage()
  const [user] = useKV('user-profile', null)
  const [products, setProducts] = useState<Product[]>([])
  const [syncSchedules, setSyncSchedules] = useState<SyncSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [importUrl, setImportUrl] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])

  useEffect(() => {
    if (user) {
      loadProducts()
      loadSyncSchedules()
    }
  }, [user])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/dropshipping/products', {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      }
    } catch (error) {
      console.error('Failed to load products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const loadSyncSchedules = async () => {
    try {
      const response = await fetch('/api/inventory/schedules', {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setSyncSchedules(data.schedules || [])
      }
    } catch (error) {
      console.error('Failed to load sync schedules:', error)
    }
  }

  const syncInventory = async (productIds?: string[]) => {
    try {
      setSyncing(true)
      const response = await fetch('/api/inventory/sync', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          productIds,
          syncAll: !productIds
        })
      })

      const result = await response.json()
      
      if (response.ok) {
        toast.success(`Inventory synced: ${result.syncedProducts} products updated`)
        
        if (result.lowStockAlerts > 0 || result.outOfStockAlerts > 0) {
          toast.warning(`${result.lowStockAlerts} low stock, ${result.outOfStockAlerts} out of stock`)
        }
        
        await loadProducts()
      } else {
        toast.error(result.error || 'Failed to sync inventory')
      }
    } catch (error) {
      console.error('Sync inventory error:', error)
      toast.error('Failed to sync inventory')
    } finally {
      setSyncing(false)
    }
  }

  const importProducts = async () => {
    if (!importUrl.trim()) {
      toast.error('Please enter a valid CJ Dropshipping URL')
      return
    }

    try {
      const response = await fetch('/api/products/import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          importType: 'url',
          data: { url: importUrl.trim() },
          options: {
            autoPublish: false,
            markupPercentage: 60
          }
        })
      })

      const result = await response.json()
      
      if (response.ok && result.success) {
        toast.success(`Successfully imported ${result.importedProducts} products`)
        setShowImportDialog(false)
        setImportUrl('')
        await loadProducts()
      } else {
        toast.error(result.errors?.[0] || 'Failed to import products')
      }
    } catch (error) {
      console.error('Import products error:', error)
      toast.error('Failed to import products')
    }
  }

  const updateProductStatus = async (productId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/dropshipping/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_active: isActive })
      })

      if (response.ok) {
        toast.success(`Product ${isActive ? 'activated' : 'deactivated'}`)
        await loadProducts()
      } else {
        toast.error('Failed to update product status')
      }
    } catch (error) {
      console.error('Update product status error:', error)
      toast.error('Failed to update product status')
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && product.is_active) ||
                         (filterStatus === 'inactive' && !product.is_active) ||
                         (filterStatus === 'low_stock' && product.stock_quantity <= 5) ||
                         (filterStatus === 'out_of_stock' && product.stock_quantity === 0)
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const categories = [...new Set(products.map(p => p.category))]
  const lowStockCount = products.filter(p => p.stock_quantity <= 5 && p.stock_quantity > 0).length
  const outOfStockCount = products.filter(p => p.stock_quantity === 0).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">
            Manage your dropshipping inventory and sync with suppliers
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Import Products
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Import Products from CJ Dropshipping</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Product URL</label>
                  <Input
                    placeholder="https://cjdropshipping.com/product/..."
                    value={importUrl}
                    onChange={(e) => setImportUrl(e.target.value)}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={importProducts}>
                    Import Product
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            onClick={() => syncInventory()} 
            disabled={syncing}
            variant="outline"
          >
            <Sync className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing...' : 'Sync All'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Products</p>
              <p className="text-2xl font-bold">{products.length}</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Products</p>
              <p className="text-2xl font-bold">{products.filter(p => p.is_active).length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
              <p className="text-2xl font-bold text-amber-600">{lowStockCount}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-amber-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">{outOfStockCount}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="low_stock">Low Stock</SelectItem>
              <SelectItem value="out_of_stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Products Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Sales</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Sync</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    Loading products...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <Package className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">No products found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium truncate max-w-[200px]">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.external_id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category}</Badge>
                  </TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${
                        product.stock_quantity === 0 ? 'text-red-600' :
                        product.stock_quantity <= 5 ? 'text-amber-600' :
                        'text-green-600'
                      }`}>
                        {product.stock_quantity}
                      </span>
                      {product.stock_quantity <= 5 && (
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{product.total_sales}</TableCell>
                  <TableCell>
                    <Badge variant={product.is_active ? 'default' : 'secondary'}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {product.last_sync_at ? (
                      <span className="text-sm text-muted-foreground">
                        {new Date(product.last_sync_at).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-sm text-muted-foreground">Never</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => syncInventory([product.external_id])}
                      >
                        <Sync className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => updateProductStatus(product.id, !product.is_active)}
                      >
                        {product.is_active ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}