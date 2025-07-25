import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Truck, 
  Package, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Settings,
  Play,
  Pause,
  Activity,
  Eye,
  Download,
  Upload,
  Calendar,
  Filter
} from '@phosphor-icons/react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface Product {
  id: string
  external_id: string
  name: string
  price: number
  stock_quantity: number
  is_available: boolean
  last_sync_at: string
  supplier: string
  category: string
  image_url?: string
  total_sales: number
}

interface Order {
  id: string
  external_order_id?: string
  status: string
  products: any[]
  shipping_address: any
  tracking_number?: string
  total_amount: number
  created_at: string
  updated_at: string
  estimated_delivery_days?: number
}

interface SyncSchedule {
  id: string
  frequency: 'hourly' | 'daily' | 'weekly'
  is_active: boolean
  next_sync: string
  product_filter?: string[]
}

export function InventoryFulfillmentDashboard() {
  const { t } = useLanguage()
  const [user] = useKV('user-profile', null)
  
  // State management
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [syncSchedules, setSyncSchedules] = useState<SyncSchedule[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [syncProgress, setSyncProgress] = useState(0)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true)
  
  // Filters
  const [productFilter, setProductFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')
  
  // Stats
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    outOfStockProducts: 0,
    pendingOrders: 0,
    shippedOrders: 0,
    totalRevenue: 0,
    syncHealth: 100
  })

  useEffect(() => {
    loadDashboardData()
    loadSyncSchedules()
  }, [])

  const loadDashboardData = async () => {
    setIsLoading(true)
    try {
      // Simulate API calls - replace with actual Supabase queries
      const mockProducts: Product[] = [
        {
          id: '1',
          external_id: 'CJ123456',
          name: 'Wireless Bluetooth Headphones',
          price: 29.99,
          stock_quantity: 45,
          is_available: true,
          last_sync_at: new Date().toISOString(),
          supplier: 'cj_dropshipping',
          category: 'Electronics',
          image_url: 'https://via.placeholder.com/100',
          total_sales: 128
        },
        {
          id: '2',
          external_id: 'CJ789012',
          name: 'Smart Fitness Watch',
          price: 89.99,
          stock_quantity: 3,
          is_available: true,
          last_sync_at: new Date().toISOString(),
          supplier: 'cj_dropshipping',
          category: 'Electronics',
          image_url: 'https://via.placeholder.com/100',
          total_sales: 67
        },
        {
          id: '3',
          external_id: 'CJ345678',
          name: 'LED Strip Lights',
          price: 19.99,
          stock_quantity: 0,
          is_available: false,
          last_sync_at: new Date().toISOString(),
          supplier: 'cj_dropshipping',
          category: 'Home & Garden',
          image_url: 'https://via.placeholder.com/100',
          total_sales: 234
        }
      ]

      const mockOrders: Order[] = [
        {
          id: 'ORD001',
          external_order_id: 'CJ-ORD-123456',
          status: 'shipped',
          products: [{ productId: '1', quantity: 2 }],
          shipping_address: { country: 'US', state: 'CA' },
          tracking_number: 'TRK123456789',
          total_amount: 59.98,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          estimated_delivery_days: 7
        },
        {
          id: 'ORD002',
          external_order_id: 'CJ-ORD-789012',
          status: 'pending',
          products: [{ productId: '2', quantity: 1 }],
          shipping_address: { country: 'UK', state: 'London' },
          total_amount: 89.99,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          estimated_delivery_days: 10
        }
      ]

      setProducts(mockProducts)
      setOrders(mockOrders)
      
      // Calculate stats
      const newStats = {
        totalProducts: mockProducts.length,
        lowStockProducts: mockProducts.filter(p => p.stock_quantity <= 5 && p.stock_quantity > 0).length,
        outOfStockProducts: mockProducts.filter(p => p.stock_quantity === 0).length,
        pendingOrders: mockOrders.filter(o => o.status === 'pending').length,
        shippedOrders: mockOrders.filter(o => o.status === 'shipped').length,
        totalRevenue: mockOrders.reduce((sum, o) => sum + o.total_amount, 0),
        syncHealth: 98
      }
      setStats(newStats)

    } catch (error) {
      toast.error('Failed to load dashboard data')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadSyncSchedules = async () => {
    // Mock sync schedules
    const mockSchedules: SyncSchedule[] = [
      {
        id: '1',
        frequency: 'daily',
        is_active: true,
        next_sync: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        product_filter: ['Electronics']
      },
      {
        id: '2',
        frequency: 'hourly',
        is_active: false,
        next_sync: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        product_filter: ['Home & Garden']
      }
    ]
    setSyncSchedules(mockSchedules)
  }

  const handleSyncInventory = async (productIds?: string[]) => {
    setIsLoading(true)
    setSyncProgress(0)
    
    try {
      const progressInterval = setInterval(() => {
        setSyncProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Simulate API call to inventory sync edge function
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      clearInterval(progressInterval)
      setSyncProgress(100)
      
      toast.success(`Successfully synced ${productIds?.length || products.length} products`)
      await loadDashboardData()
      
    } catch (error) {
      toast.error('Sync failed: ' + error.message)
    } finally {
      setIsLoading(false)
      setSyncProgress(0)
    }
  }

  const handleFulfillOrder = async (orderId: string, action: string) => {
    setIsLoading(true)
    try {
      // Simulate API call to order fulfillment edge function
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success(`Order ${action} completed successfully`)
      await loadDashboardData()
      
    } catch (error) {
      toast.error(`Order ${action} failed: ` + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, icon: Clock },
      confirmed: { variant: 'default' as const, icon: CheckCircle },
      shipped: { variant: 'default' as const, icon: Truck },
      delivered: { variant: 'default' as const, icon: Package },
      cancelled: { variant: 'destructive' as const, icon: AlertTriangle }
    }
    
    const config = statusConfig[status] || statusConfig.pending
    const Icon = config.icon
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getStockBadge = (stockQuantity: number) => {
    if (stockQuantity === 0) {
      return <Badge variant="destructive" className="flex items-center gap-1">
        <AlertTriangle size={12} />
        Out of Stock
      </Badge>
    } else if (stockQuantity <= 5) {
      return <Badge variant="secondary" className="flex items-center gap-1">
        <TrendingDown size={12} />
        Low Stock
      </Badge>
    } else {
      return <Badge variant="default" className="flex items-center gap-1">
        <TrendingUp size={12} />
        In Stock
      </Badge>
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesName = product.name.toLowerCase().includes(productFilter.toLowerCase())
    const matchesStock = stockFilter === 'all' || 
      (stockFilter === 'low' && product.stock_quantity <= 5 && product.stock_quantity > 0) ||
      (stockFilter === 'out' && product.stock_quantity === 0) ||
      (stockFilter === 'available' && product.stock_quantity > 5)
    
    return matchesName && matchesStock
  })

  const filteredOrders = orders.filter(order => {
    return statusFilter === 'all' || order.status === statusFilter
  })

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory & Fulfillment</h1>
          <p className="text-muted-foreground">
            Automated inventory sync and order fulfillment management
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => handleSyncInventory()} 
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Sync All
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Sync Settings</DialogTitle>
                <DialogDescription>
                  Configure automatic inventory synchronization
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-sync">Enable Auto Sync</Label>
                  <Switch 
                    id="auto-sync"
                    checked={autoSyncEnabled}
                    onCheckedChange={setAutoSyncEnabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sync Frequency</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Every Hour</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Progress Bar */}
      {syncProgress > 0 && (
        <Alert>
          <Activity className="h-4 w-4" />
          <AlertDescription>
            Syncing inventory... {syncProgress}%
            <Progress value={syncProgress} className="mt-2" />
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.lowStockProducts} low stock, {stats.outOfStockProducts} out of stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">
              {stats.shippedOrders} shipped this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From {orders.length} orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sync Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.syncHealth}%</div>
            <p className="text-xs text-muted-foreground">
              Last sync: 2 minutes ago
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory Management</TabsTrigger>
          <TabsTrigger value="orders">Order Fulfillment</TabsTrigger>
          <TabsTrigger value="schedules">Sync Schedules</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Product Inventory</CardTitle>
                  <CardDescription>
                    Monitor stock levels and sync with CJ Dropshipping
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Search products..."
                    value={productFilter}
                    onChange={(e) => setProductFilter(e.target.value)}
                    className="w-64"
                  />
                  <Select value={stockFilter} onValueChange={setStockFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stock</SelectItem>
                      <SelectItem value="available">In Stock</SelectItem>
                      <SelectItem value="low">Low Stock</SelectItem>
                      <SelectItem value="out">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Last Sync</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="flex items-center gap-3">
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {product.external_id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>${product.price}</TableCell>
                      <TableCell>{product.stock_quantity}</TableCell>
                      <TableCell>{getStockBadge(product.stock_quantity)}</TableCell>
                      <TableCell>{product.total_sales}</TableCell>
                      <TableCell>
                        {new Date(product.last_sync_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleSyncInventory([product.external_id])}
                          >
                            <RefreshCw className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Order Management</CardTitle>
                  <CardDescription>
                    Track and fulfill orders automatically
                  </CardDescription>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Tracking</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{order.products.length} items</TableCell>
                      <TableCell>${order.total_amount}</TableCell>
                      <TableCell>
                        {order.tracking_number ? (
                          <Button variant="link" size="sm">
                            {order.tracking_number}
                          </Button>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(order.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {order.status === 'pending' && (
                            <Button 
                              size="sm"
                              onClick={() => handleFulfillOrder(order.id, 'confirm')}
                            >
                              Confirm
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleFulfillOrder(order.id, 'track')}
                          >
                            Track
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sync Schedules Tab */}
        <TabsContent value="schedules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sync Schedules</CardTitle>
              <CardDescription>
                Manage automated inventory synchronization schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {syncSchedules.map((schedule) => (
                  <div key={schedule.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {schedule.is_active ? (
                          <Play className="h-4 w-4 text-green-500" />
                        ) : (
                          <Pause className="h-4 w-4 text-gray-400" />
                        )}
                        <span className="font-medium">
                          {schedule.frequency.charAt(0).toUpperCase() + schedule.frequency.slice(1)} Sync
                        </span>
                      </div>
                      <Badge variant="outline">
                        {schedule.product_filter?.join(', ') || 'All Products'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        Next: {new Date(schedule.next_sync).toLocaleString()}
                      </span>
                      <Switch 
                        checked={schedule.is_active}
                        onCheckedChange={(checked) => {
                          // Update schedule status
                          setSyncSchedules(prev => 
                            prev.map(s => 
                              s.id === schedule.id 
                                ? { ...s, is_active: checked }
                                : s
                            )
                          )
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Products</span>
                    <span className="font-medium">{stats.totalProducts}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Stock Level</span>
                    <span className="font-medium">
                      {Math.round(products.reduce((sum, p) => sum + p.stock_quantity, 0) / products.length || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Stock Turnover Rate</span>
                    <span className="font-medium">2.4x/month</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order Fulfillment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Average Processing Time</span>
                    <span className="font-medium">1.2 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Fulfillment Success Rate</span>
                    <span className="font-medium">98.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Delivery Time</span>
                    <span className="font-medium">8.5 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default InventoryFulfillmentDashboard