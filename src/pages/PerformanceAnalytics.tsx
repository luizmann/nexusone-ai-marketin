import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  ChartLine, 
  TrendingUp, 
  TrendingDown,
  Users,
  DollarSign,
  Eye,
  MousePointer,
  Calendar,
  Download
} from '@phosphor-icons/react'

export const PerformanceAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d')

  const metrics = {
    totalViews: 12847,
    totalClicks: 3621,
    conversions: 289,
    revenue: 14250,
    ctr: 28.2,
    conversionRate: 7.98,
    avgOrderValue: 49.31,
    roas: 4.2
  }

  const changes = {
    totalViews: 15.3,
    totalClicks: 8.7,
    conversions: 23.1,
    revenue: 31.5,
    ctr: -2.1,
    conversionRate: 4.8,
    avgOrderValue: 12.3,
    roas: 18.9
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Performance Analytics</h1>
          <p className="text-lg text-muted-foreground">
            Track your marketing performance and ROI
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Today</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">{metrics.totalViews.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+{changes.totalViews}%</span>
                </div>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Clicks</p>
                <p className="text-2xl font-bold">{metrics.totalClicks.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+{changes.totalClicks}%</span>
                </div>
              </div>
              <MousePointer className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversions</p>
                <p className="text-2xl font-bold">{metrics.conversions}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+{changes.conversions}%</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                <p className="text-2xl font-bold">${metrics.revenue.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+{changes.revenue}%</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Click-Through Rate</p>
              <p className="text-3xl font-bold">{metrics.ctr}%</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <TrendingDown className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-600">{changes.ctr}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
              <p className="text-3xl font-bold">{metrics.conversionRate}%</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">+{changes.conversionRate}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Avg Order Value</p>
              <p className="text-3xl font-bold">${metrics.avgOrderValue}</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">+{changes.avgOrderValue}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">ROAS</p>
              <p className="text-3xl font-bold">{metrics.roas}x</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">+{changes.roas}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Placeholder */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Daily revenue over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <ChartLine className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Chart visualization coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your visitors come from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Facebook Ads</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full">
                    <div className="w-16 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">67%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Landing Pages</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full">
                    <div className="w-12 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">50%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">WhatsApp</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full">
                    <div className="w-8 h-2 bg-purple-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">33%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Instagram</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full">
                    <div className="w-6 h-2 bg-orange-500 rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">25%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Campaigns</CardTitle>
          <CardDescription>Your best converting campaigns this period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: 'Fitness Tracker Summer Sale', views: 4200, conversions: 89, revenue: 4450 },
              { name: 'Wireless Earbuds Promo', views: 3800, conversions: 76, revenue: 3800 },
              { name: 'Smart Watch Collection', views: 2900, conversions: 58, revenue: 3480 },
              { name: 'Phone Accessories Bundle', views: 1900, conversions: 34, revenue: 1700 }
            ].map((campaign, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold">{campaign.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {campaign.views.toLocaleString()} views • {campaign.conversions} conversions
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">${campaign.revenue.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Revenue</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PerformanceAnalytics