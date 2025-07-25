import React, { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Package, 
  Truck, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  Download,
  RefreshCw,
  ExternalLink,
  Eye,
  MessageCircle,
  DollarSign,
  Globe,
  Users,
  BarChart3
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useLanguage } from '../../contexts/LanguageContext'

interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  products: {
    id: string
    name: string
    image: string
    sku: string
    quantity: number
    price: number
    variant?: string
  }[]
  shippingAddress: {
    name: string
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  fulfillment: {
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
    supplier: 'cjdropshipping' | 'aliexpress' | 'dsers'
    supplierOrderId?: string
    trackingNumber?: string
    estimatedDelivery?: string
    actualDelivery?: string
    cost: number
    profit: number
  }
  payment: {
    status: 'pending' | 'paid' | 'refunded'
    method: string
    amount: number
    currency: string
  }
  createdAt: string
  updatedAt: string
}

interface SupplierAPI {
  name: string
  endpoint: string
  apiKey: string
  status: 'connected' | 'disconnected' | 'error'
  lastSync: string
}

export function FulfillmentSystem() {
  const [orders, setOrders] = useKV<Order[]>('fulfillment-orders', [])
  const [suppliers, setSuppliers] = useKV<SupplierAPI[]>('supplier-apis', [
    {
      name: 'CJ Dropshipping',
      endpoint: 'https://developers.cjdropshipping.com/api2.0',
      apiKey: 'test-api-key',
      status: 'connected',
      lastSync: new Date().toISOString()
    },
    {
      name: 'AliExpress',
      endpoint: 'https://gw.api.alibaba.com/openapi',
      apiKey: '',
      status: 'disconnected',
      lastSync: ''
    },
    {
      name: 'DSers',
      endpoint: 'https://openapi.dsers.com',
      apiKey: '',
      status: 'disconnected',
      lastSync: ''
    }
  ])
  const [activeTab, setActiveTab] = useState('orders')
  const [orderFilter, setOrderFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const { t } = useLanguage()

  // Sample orders data
  useEffect(() => {
    if (orders.length === 0) {
      const sampleOrders: Order[] = [
        {
          id: '1',
          orderNumber: 'NX-2025-0001',
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          customerPhone: '+1-555-123-4567',
          products: [
            {
              id: '1',
              name: 'Wireless Bluetooth Earbuds Pro Max',
              image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200',
              sku: 'WBE-001',
              quantity: 1,
              price: 29.99,
              variant: 'Black'
            }
          ],
          shippingAddress: {
            name: 'John Doe',
            street: '123 Main Street',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'United States'
          },
          fulfillment: {
            status: 'processing',
            supplier: 'cjdropshipping',
            supplierOrderId: 'CJ-789123456',
            cost: 15.00,
            profit: 14.99,
            estimatedDelivery: '2025-02-15'
          },
          payment: {
            status: 'paid',
            method: 'Credit Card',
            amount: 29.99,
            currency: 'USD'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          orderNumber: 'NX-2025-0002',
          customerName: 'Sarah Smith',
          customerEmail: 'sarah@example.com',
          customerPhone: '+1-555-987-6543',
          products: [
            {
              id: '2',
              name: 'Smart LED Strip Lights RGB 16.4ft',
              image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200',
              sku: 'LED-002',
              quantity: 2,
              price: 19.99,
              variant: 'RGB'
            }
          ],
          shippingAddress: {
            name: 'Sarah Smith',
            street: '456 Oak Avenue',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90210',
            country: 'United States'
          },
          fulfillment: {
            status: 'shipped',
            supplier: 'cjdropshipping',
            supplierOrderId: 'CJ-789123457',
            trackingNumber: 'TRACK123456789',
            cost: 12.00,
            profit: 27.98,
            estimatedDelivery: '2025-02-10'
          },
          payment: {
            status: 'paid',
            method: 'PayPal',
            amount: 39.98,
            currency: 'USD'
          },
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
      
      setOrders(sampleOrders)
    }
  }, [orders, setOrders])

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = orderFilter === 'all' || order.fulfillment.status === orderFilter
    
    return matchesSearch && matchesFilter
  })

  const fulfillOrder = async (orderId: string) => {
    setIsProcessing(true)
    
    try {
      const order = orders.find(o => o.id === orderId)
      if (!order) return

      // Simulate API call to supplier
      toast.loading('Sending order to supplier...')
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Update order status
      setOrders(prev => prev.map(o => 
        o.id === orderId 
          ? {
              ...o,
              fulfillment: {
                ...o.fulfillment,
                status: 'processing',
                supplierOrderId: `CJ-${Date.now()}`,
                estimatedDelivery: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
              },
              updatedAt: new Date().toISOString()
            }
          : o
      ))

      toast.success('Order sent to supplier successfully!')
      
    } catch (error) {
      toast.error('Failed to fulfill order')
    } finally {
      setIsProcessing(false)
    }
  }

  const updateTrackingInfo = async (orderId: string) => {
    setIsProcessing(true)
    
    try {
      // Simulate tracking update
      await new Promise(resolve => setTimeout(resolve, 1500))

      setOrders(prev => prev.map(o => 
        o.id === orderId 
          ? {
              ...o,
              fulfillment: {
                ...o.fulfillment,
                status: 'shipped',
                trackingNumber: `TRACK${Date.now()}`,
              },
              updatedAt: new Date().toISOString()
            }
          : o
      ))

      toast.success('Tracking information updated!')
      
    } catch (error) {
      toast.error('Failed to update tracking')
    } finally {
      setIsProcessing(false)
    }
  }

  const syncWithSupplier = async (supplierName: string) => {
    setIsProcessing(true)
    
    try {
      toast.loading(`Syncing with ${supplierName}...`)
      await new Promise(resolve => setTimeout(resolve, 3000))

      setSuppliers(prev => prev.map(s => 
        s.name === supplierName 
          ? {
              ...s,
              status: 'connected',
              lastSync: new Date().toISOString()
            }
          : s
      ))

      toast.success(`Successfully synced with ${supplierName}!`)
      
    } catch (error) {
      toast.error(`Failed to sync with ${supplierName}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-green-100 text-green-800'
      case 'delivered': return 'bg-emerald-100 text-emerald-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'processing': return <RefreshCw className="w-4 h-4" />
      case 'shipped': return <Truck className="w-4 h-4" />
      case 'delivered': return <CheckCircle className="w-4 h-4" />
      case 'cancelled': return <AlertTriangle className="w-4 h-4" />
      default: return <Package className="w-4 h-4" />
    }
  }

  const totalOrders = orders.length
  const pendingOrders = orders.filter(o => o.fulfillment.status === 'pending').length
  const shippedOrders = orders.filter(o => o.fulfillment.status === 'shipped').length
  const totalRevenue = orders.reduce((sum, o) => sum + o.payment.amount, 0)
  const totalProfit = orders.reduce((sum, o) => sum + o.fulfillment.profit, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fulfillment Center</h1>
          <p className="text-gray-600 mt-1">Manage orders and supplier integrations</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Orders
          </Button>
          
          <Button onClick={() => syncWithSupplier('CJ Dropshipping')}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Sync Orders
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-xl font-bold">{totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-xl font-bold">{pendingOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Truck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Shipped</p>
                <p className="text-xl font-bold">{shippedOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-xl font-bold">${totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Profit</p>
                <p className="text-xl font-bold">${totalProfit.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orders">Order Management</TabsTrigger>
          <TabsTrigger value="suppliers">Supplier APIs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <Select value={orderFilter} onValueChange={setOrderFilter}>
                  <SelectTrigger className="w-full lg:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{order.orderNumber}</h3>
                        <Badge className={getStatusColor(order.fulfillment.status)}>
                          {getStatusIcon(order.fulfillment.status)}
                          <span className="ml-1 capitalize">{order.fulfillment.status}</span>
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {order.fulfillment.supplier}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Customer</p>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-gray-500">{order.customerEmail}</p>
                        </div>
                        
                        <div>
                          <p className="text-gray-600">Products</p>
                          {order.products.map((product, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-8 h-8 object-cover rounded"
                              />
                              <span className="font-medium">{product.quantity}x {product.name}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div>
                          <p className="text-gray-600">Payment</p>
                          <p className="font-medium">${order.payment.amount}</p>
                          <p className="text-gray-500">{order.payment.method}</p>
                        </div>
                        
                        <div>
                          <p className="text-gray-600">Fulfillment</p>
                          <p className="font-medium">Cost: ${order.fulfillment.cost}</p>
                          <p className="text-green-600 font-medium">Profit: ${order.fulfillment.profit}</p>
                        </div>
                      </div>

                      {order.fulfillment.trackingNumber && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center gap-2 text-sm">
                            <Truck className="w-4 h-4 text-green-600" />
                            <span className="text-green-700 font-medium">
                              Tracking: {order.fulfillment.trackingNumber}
                            </span>
                            <Button variant="ghost" size="sm" className="text-green-600">
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      {order.fulfillment.status === 'pending' && (
                        <Button 
                          onClick={() => fulfillOrder(order.id)}
                          disabled={isProcessing}
                          size="sm"
                        >
                          <Package className="w-4 h-4 mr-2" />
                          Fulfill Order
                        </Button>
                      )}
                      
                      {order.fulfillment.status === 'processing' && (
                        <Button 
                          onClick={() => updateTrackingInfo(order.id)}
                          disabled={isProcessing}
                          variant="outline"
                          size="sm"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Update Tracking
                        </Button>
                      )}
                      
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contact Customer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredOrders.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suppliers.map(supplier => (
              <Card key={supplier.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{supplier.name}</CardTitle>
                    <Badge 
                      variant={supplier.status === 'connected' ? 'default' : 'secondary'}
                      className={
                        supplier.status === 'connected' ? 'bg-green-100 text-green-700' :
                        supplier.status === 'error' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }
                    >
                      {supplier.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor={`api-key-${supplier.name}`}>API Key</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id={`api-key-${supplier.name}`}
                        type="password"
                        value={supplier.apiKey}
                        placeholder="Enter API key"
                        className="text-sm"
                      />
                      <Button variant="outline" size="sm">
                        Save
                      </Button>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Endpoint</p>
                    <p className="text-xs text-gray-500 font-mono break-all">
                      {supplier.endpoint}
                    </p>
                  </div>

                  {supplier.lastSync && (
                    <div>
                      <p className="text-sm text-gray-600">Last Sync</p>
                      <p className="text-xs text-gray-500">
                        {new Date(supplier.lastSync).toLocaleString()}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => syncWithSupplier(supplier.name)}
                      disabled={isProcessing}
                      className="flex-1"
                      size="sm"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Sync
                    </Button>
                    
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* API Documentation */}
          <Card>
            <CardHeader>
              <CardTitle>Integration Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">CJ Dropshipping Setup</h4>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Create account at <a href="https://cjdropshipping.com" className="underline">cjdropshipping.com</a></li>
                  <li>Go to Developer Center and create API credentials</li>
                  <li>Copy your API key and paste it above</li>
                  <li>Click "Sync" to connect your account</li>
                </ol>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-900 mb-2">AliExpress Integration</h4>
                <ol className="text-sm text-orange-800 space-y-1 list-decimal list-inside">
                  <li>Apply for AliExpress Open Platform access</li>
                  <li>Get your App Key and App Secret</li>
                  <li>Configure webhook URLs for order updates</li>
                  <li>Test connection with sample orders</li>
                </ol>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">DSers Connection</h4>
                <ol className="text-sm text-purple-800 space-y-1 list-decimal list-inside">
                  <li>Install DSers browser extension</li>
                  <li>Connect your store to DSers platform</li>
                  <li>Generate API token from DSers dashboard</li>
                  <li>Enable automatic order fulfillment</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fulfillment Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
                <p className="text-gray-500 mb-4">
                  Detailed analytics will be available after processing more orders
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{totalOrders}</p>
                    <p className="text-sm text-gray-600">Total Orders</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(0)}</p>
                    <p className="text-sm text-gray-600">Revenue</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">${totalProfit.toFixed(0)}</p>
                    <p className="text-sm text-gray-600">Profit</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-600">
                      {totalOrders > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0}%
                    </p>
                    <p className="text-sm text-gray-600">Margin</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}