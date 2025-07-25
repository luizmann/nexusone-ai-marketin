import React, { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ShoppingCart, 
  Sparkles, 
  Package,
  Truck,
  DollarSign,
  TrendingUp,
  Users,
  Target,
  ArrowRight,
  Play,
  Eye,
  Settings,
  BarChart3,
  MessageCircle,
  Globe,
  Star,
  CheckCircle
} from '@phosphor-icons/react'
import { DropshippingMarketplace } from './DropshippingMarketplace'
import { AICampaignBuilder } from './AICampaignBuilder'
import { CheckoutSystem } from './CheckoutSystem'
import { FulfillmentSystem } from './FulfillmentSystem'
import { useLanguage } from '../../contexts/LanguageContext'

export function DropshippingDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedProducts] = useKV<string[]>('selected-products', [])
  const { t } = useLanguage()

  const stats = {
    totalProducts: 247,
    activeCampaigns: 3,
    totalOrders: 28,
    revenue: 1847.50,
    profit: 923.75,
    conversionRate: 3.2,
    averageOrderValue: 65.98,
    customerSatisfaction: 4.7
  }

  const recentActivity = [
    {
      type: 'order',
      message: 'New order #NX-2025-0028 from Sarah Johnson',
      time: '2 minutes ago',
      amount: '$45.99'
    },
    {
      type: 'campaign',
      message: 'Campaign "Wireless Earbuds Pro" launched successfully',
      time: '1 hour ago',
      status: 'active'
    },
    {
      type: 'fulfillment',
      message: 'Order #NX-2025-0027 shipped via CJ Dropshipping',
      time: '3 hours ago',
      tracking: 'TRACK789456123'
    },
    {
      type: 'product',
      message: '15 new trending products added to marketplace',
      time: '6 hours ago',
      count: 15
    }
  ]

  const quickActions = [
    {
      title: 'Browse Products',
      description: 'Find winning products from our curated marketplace',
      icon: <ShoppingCart className="w-6 h-6" />,
      action: () => setActiveTab('marketplace'),
      color: 'bg-blue-500'
    },
    {
      title: 'Generate Campaign',
      description: 'Create AI-powered marketing campaigns instantly',
      icon: <Sparkles className="w-6 h-6" />,
      action: () => setActiveTab('campaigns'),
      color: 'bg-purple-500'
    },
    {
      title: 'Check Orders',
      description: 'Monitor fulfillment and customer orders',
      icon: <Package className="w-6 h-6" />,
      action: () => setActiveTab('fulfillment'),
      color: 'bg-green-500'
    },
    {
      title: 'View Analytics',
      description: 'Track performance and revenue metrics',
      icon: <BarChart3 className="w-6 h-6" />,
      action: () => setActiveTab('analytics'),
      color: 'bg-orange-500'
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dropshipping Center</h1>
          <p className="text-gray-600 mt-1">Complete marketplace solution with AI-powered campaigns</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="px-3 py-1">
            <Target className="w-4 h-4 mr-1" />
            {selectedProducts.length} Products Selected
          </Badge>
          
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Sparkles className="w-4 h-4 mr-2" />
            Quick Launch Campaign
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="checkout">Checkout</TabsTrigger>
          <TabsTrigger value="fulfillment">Fulfillment</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <ShoppingCart className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Products</p>
                    <p className="text-xl font-bold">{stats.totalProducts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Active Campaigns</p>
                    <p className="text-xl font-bold">{stats.activeCampaigns}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Package className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-xl font-bold">{stats.totalOrders}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <DollarSign className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Revenue</p>
                    <p className="text-xl font-bold">${stats.revenue}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Profit</p>
                    <p className="text-xl font-bold text-green-600">${stats.profit}</p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {((stats.profit / stats.revenue) * 100).toFixed(1)}% margin
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Conversion Rate</p>
                    <p className="text-xl font-bold text-blue-600">{stats.conversionRate}%</p>
                  </div>
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Above industry average
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg Order Value</p>
                    <p className="text-xl font-bold text-purple-600">${stats.averageOrderValue}</p>
                  </div>
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Satisfaction</p>
                    <p className="text-xl font-bold text-yellow-600">{stats.customerSatisfaction}</p>
                  </div>
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Based on 127 reviews
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={action.action}
                  >
                    <div className={`p-2 rounded-lg ${action.color} text-white`}>
                      {action.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{action.title}</h4>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                      activity.type === 'order' ? 'bg-green-500' :
                      activity.type === 'campaign' ? 'bg-purple-500' :
                      activity.type === 'fulfillment' ? 'bg-blue-500' :
                      'bg-orange-500'
                    }`}>
                      {activity.type === 'order' && <DollarSign className="w-4 h-4" />}
                      {activity.type === 'campaign' && <Sparkles className="w-4 h-4" />}
                      {activity.type === 'fulfillment' && <Truck className="w-4 h-4" />}
                      {activity.type === 'product' && <ShoppingCart className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                      {activity.amount && (
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {activity.amount}
                        </Badge>
                      )}
                      {activity.tracking && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {activity.tracking}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Process Flow */}
          <Card>
            <CardHeader>
              <CardTitle>Dropshipping Process Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {[
                  { title: 'Select Products', icon: <ShoppingCart className="w-6 h-6" />, desc: 'Browse marketplace' },
                  { title: 'Generate Campaign', icon: <Sparkles className="w-6 h-6" />, desc: 'AI-powered ads' },
                  { title: 'Customer Orders', icon: <MessageCircle className="w-6 h-6" />, desc: 'WhatsApp/Direct' },
                  { title: 'Auto Fulfillment', icon: <Package className="w-6 h-6" />, desc: 'CJ Dropshipping' },
                  { title: 'Profit & Scale', icon: <TrendingUp className="w-6 h-6" />, desc: 'Track & optimize' }
                ].map((step, index) => (
                  <div key={index} className="flex items-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2">
                        {step.icon}
                      </div>
                      <h4 className="font-medium text-sm">{step.title}</h4>
                      <p className="text-xs text-gray-500">{step.desc}</p>
                    </div>
                    {index < 4 && (
                      <ArrowRight className="w-6 h-6 text-gray-400 mx-4 hidden md:block" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Getting Started */}
          {selectedProducts.length === 0 && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500 text-white p-3 rounded-full">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900 mb-2">Ready to Start Dropshipping?</h3>
                    <p className="text-blue-700 mb-4">
                      Follow these simple steps to launch your first AI-powered dropshipping campaign in minutes:
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-blue-700">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        Browse our curated product marketplace
                      </div>
                      <div className="flex items-center gap-2 text-sm text-blue-700">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        Select winning products with high profit margins
                      </div>
                      <div className="flex items-center gap-2 text-sm text-blue-700">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        Generate complete marketing campaigns with AI
                      </div>
                      <div className="flex items-center gap-2 text-sm text-blue-700">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                        Launch and start receiving orders automatically
                      </div>
                    </div>
                    <Button 
                      onClick={() => setActiveTab('marketplace')}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Start with Product Selection
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="marketplace">
          <DropshippingMarketplace />
        </TabsContent>

        <TabsContent value="campaigns">
          <AICampaignBuilder />
        </TabsContent>

        <TabsContent value="checkout">
          <CheckoutSystem />
        </TabsContent>

        <TabsContent value="fulfillment">
          <FulfillmentSystem />
        </TabsContent>
      </Tabs>
    </div>
  )
}