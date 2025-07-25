import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Package, 
  Truck, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
  Eye,
  MapPin,
  Calendar,
  DollarSign,
  User,
  Phone,
  Mail,
  Navigation
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useLanguage } from '../../contexts/LanguageContext'

interface Order {
  id: string
  client_order_id: string
  external_order_id?: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'failed'
  total_amount: number
  currency: string
  tracking_number?: string
  estimated_delivery_days?: number
  products: Array<{
    productId: string
    name: string
    quantity: number
    price: number
  }>
  shipping_address: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address1: string
    city: string
    state: string
    country: string
    zipCode: string
  }
  created_at: string
  updated_at: string
  shipped_at?: string
  delivered_at?: string
}

interface TrackingInfo {
  trackingNumber: string
  currentStatus: string
  currentLocation?: string
  estimatedDelivery?: string
  events: Array<{
    status: string
    location: string
    timestamp: string
    description: string
  }>
}

export function OrderFulfillment() {
  const { t } = useLanguage()
  const [user] = useKV('user-profile', null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null)
  const [showTrackingDialog, setShowTrackingDialog] = useState(false)

  useEffect(() => {
    if (user) {
      loadOrders()
    }
  }, [user])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/dropshipping/orders', {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error('Failed to load orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string) => {
    try {
      const response = await fetch('/api/order-fulfillment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId,
          userId: user.id,
          action: 'update'
        })
      })

      const result = await response.json()
      
      if (response.ok && result.success) {
        toast.success(`Order status updated to: ${result.status}`)
        await loadOrders()
      } else {
        toast.error(result.message || 'Failed to update order status')
      }
    } catch (error) {
      console.error('Update order status error:', error)
      toast.error('Failed to update order status')
    }
  }

  const trackOrder = async (orderId: string) => {
    try {
      const response = await fetch('/api/order-fulfillment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId,
          userId: user.id,
          action: 'track'
        })
      })

      const result = await response.json()
      
      if (response.ok && result.success) {
        setTrackingInfo(result.details)
        setShowTrackingDialog(true)
      } else {
        toast.error(result.message || 'Failed to get tracking information')
      }
    } catch (error) {
      console.error('Track order error:', error)
      toast.error('Failed to track order')
    }
  }

  const cancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return
    }

    try {
      const response = await fetch('/api/order-fulfillment', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId,
          userId: user.id,
          action: 'cancel'
        })
      })

      const result = await response.json()
      
      if (response.ok && result.success) {
        toast.success('Order cancelled successfully')
        await loadOrders()
      } else {
        toast.error(result.message || 'Failed to cancel order')
      }
    } catch (error) {
      console.error('Cancel order error:', error)
      toast.error('Failed to cancel order')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-purple-100 text-purple-800'
      case 'shipped': return 'bg-indigo-100 text-indigo-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'confirmed': return <CheckCircle className="h-4 w-4" />
      case 'processing': return <Package className="h-4 w-4" />
      case 'shipped': return <Truck className="h-4 w-4" />
      case 'delivered': return <CheckCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      case 'failed': return <AlertTriangle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.client_order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.external_order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.shipping_address.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.shipping_address.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Order Fulfillment</h1>
          <p className="text-muted-foreground">
            Track and manage your dropshipping orders
          </p>
        </div>
        <Button onClick={loadOrders} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold">{orders.length}</p>
            <p className="text-sm text-muted-foreground">Total Orders</p>
          </div>
        </Card>
        
        {Object.entries(statusCounts).map(([status, count]) => (
          <Card key={status} className="p-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                {getStatusIcon(status)}
              </div>
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-sm text-muted-foreground capitalize">{status}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order ID, customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Orders Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tracking</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    Loading orders...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <div className="flex flex-col items-center gap-2">
                    <Package className="h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">No orders found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.client_order_id}</p>
                      {order.external_order_id && (
                        <p className="text-sm text-muted-foreground">{order.external_order_id}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {order.shipping_address.firstName} {order.shipping_address.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{order.shipping_address.email}</p>
                      <p className="text-sm text-muted-foreground">{order.shipping_address.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px]">
                      {order.products.map((product, index) => (
                        <div key={index} className="text-sm">
                          <span className="font-medium">{product.quantity}x</span> {product.name}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">${order.total_amount}</p>
                      <p className="text-sm text-muted-foreground">{order.currency}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {order.tracking_number ? (
                      <div>
                        <p className="text-sm font-medium">{order.tracking_number}</p>
                        <Button
                          size="sm"
                          variant="link"
                          className="p-0 h-auto text-xs"
                          onClick={() => trackOrder(order.id)}
                        >
                          Track Package
                        </Button>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">No tracking</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => updateOrderStatus(order.id)}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      {(order.status === 'pending' || order.status === 'confirmed') && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => cancelOrder(order.id)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Order Details - {selectedOrder.client_order_id}</DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="shipping">Shipping</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">Order Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Order ID:</span>
                        <span className="font-medium">{selectedOrder.client_order_id}</span>
                      </div>
                      {selectedOrder.external_order_id && (
                        <div className="flex justify-between">
                          <span>CJ Order ID:</span>
                          <span className="font-medium">{selectedOrder.external_order_id}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <Badge className={getStatusColor(selectedOrder.status)}>
                          {selectedOrder.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span className="font-medium">${selectedOrder.total_amount}</span>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2">Customer Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{selectedOrder.shipping_address.firstName} {selectedOrder.shipping_address.lastName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{selectedOrder.shipping_address.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{selectedOrder.shipping_address.phone}</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="products" className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.products.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>${product.price}</TableCell>
                        <TableCell>${(product.quantity * product.price).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              
              <TabsContent value="shipping" className="space-y-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Shipping Address
                  </h3>
                  <div className="space-y-1">
                    <p>{selectedOrder.shipping_address.firstName} {selectedOrder.shipping_address.lastName}</p>
                    <p>{selectedOrder.shipping_address.address1}</p>
                    <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.zipCode}</p>
                    <p>{selectedOrder.shipping_address.country}</p>
                  </div>
                </Card>
                
                {selectedOrder.tracking_number && (
                  <Card className="p-4">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Navigation className="h-4 w-4" />
                      Tracking Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Tracking Number:</span>
                        <span className="font-medium">{selectedOrder.tracking_number}</span>
                      </div>
                      <Button onClick={() => trackOrder(selectedOrder.id)}>
                        View Tracking Details
                      </Button>
                    </div>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="timeline" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Order Created</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(selectedOrder.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  {selectedOrder.shipped_at && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">Order Shipped</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(selectedOrder.shipped_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {selectedOrder.delivered_at && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <div>
                        <p className="font-medium">Order Delivered</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(selectedOrder.delivered_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}

      {/* Tracking Dialog */}
      {trackingInfo && (
        <Dialog open={showTrackingDialog} onOpenChange={setShowTrackingDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Package Tracking - {trackingInfo.trackingNumber}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Current Status:</span>
                <Badge>{trackingInfo.currentStatus}</Badge>
              </div>
              
              {trackingInfo.currentLocation && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">Current Location:</span>
                  <span>{trackingInfo.currentLocation}</span>
                </div>
              )}
              
              {trackingInfo.estimatedDelivery && (
                <div className="flex justify-between items-center">
                  <span className="font-medium">Estimated Delivery:</span>
                  <span>{new Date(trackingInfo.estimatedDelivery).toLocaleDateString()}</span>
                </div>
              )}
              
              <div className="space-y-2">
                <h4 className="font-medium">Tracking Events</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {trackingInfo.events.map((event, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="font-medium">{event.status}</p>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {event.location} • {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}