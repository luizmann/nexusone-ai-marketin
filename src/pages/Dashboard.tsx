import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'
import { useCredits } from '@/contexts/CreditContext'
import { ApiStatusWidget } from '@/components/widgets/ApiStatusWidget'
import { AISystemStatus } from '@/components/AISystemStatus'
import { toast } from 'sonner'
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Video,
  Robot,
  Lightning,
  Eye,
  ShoppingBag,
  Star,
  Fire,
  Clock,
  CheckCircle
} from '@phosphor-icons/react'

export const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const { credits, videoCredits } = useCredits()

  const stats = [
    {
      title: 'Total Campaigns',
      value: '12',
      change: '+5 this week',
      icon: <Robot className="h-5 w-5" />,
      color: 'text-blue-600'
    },
    {
      title: 'Active Leads',
      value: '847',
      change: '+23% this month',
      icon: <Users className="h-5 w-5" />,
      color: 'text-green-600'
    },
    {
      title: 'Revenue Generated',
      value: '$12,450',
      change: '+18% this month',
      icon: <DollarSign className="h-5 w-5" />,
      color: 'text-purple-600'
    },
    {
      title: 'Conversion Rate',
      value: '24.3%',
      change: '+2.1% this week',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'text-orange-600'
    }
  ]

  const recentActivities = [
    {
      action: 'Created new campaign "Summer Collection"',
      time: '5 minutes ago',
      status: 'success',
      icon: <CheckCircle className="h-4 w-4 text-green-500" />
    },
    {
      action: 'Generated video for "Fitness Bundle"',
      time: '2 hours ago',
      status: 'success',
      icon: <Video className="h-4 w-4 text-blue-500" />
    },
    {
      action: 'Imported 15 products from Winner Products',
      time: '1 day ago',
      status: 'success',
      icon: <ShoppingBag className="h-4 w-4 text-purple-500" />
    },
    {
      action: 'WhatsApp bot generated 23 leads',
      time: '2 days ago',
      status: 'success',
      icon: <Users className="h-4 w-4 text-orange-500" />
    }
  ]

  const quickActions = [
    {
      title: 'AI Campaign Generator',
      description: 'Create a complete marketing campaign in 5 minutes',
      icon: <Robot className="h-6 w-6" />,
      gradient: 'from-blue-500 to-purple-600',
      action: 'campaign-generator'
    },
    {
      title: 'Winner Products',
      description: 'Browse trending products ready to sell',
      icon: <Fire className="h-6 w-6" />,
      gradient: 'from-red-500 to-orange-600',
      action: 'winner-products'
    },
    {
      title: 'Magic Video Generator',
      description: 'Create professional videos with AI',
      icon: <Video className="h-6 w-6" />,
      gradient: 'from-green-500 to-teal-600',
      action: 'magic-video'
    },
    {
      title: 'Sales Page Builder',
      description: 'Build high-converting landing pages',
      icon: <Lightning className="h-6 w-6" />,
      gradient: 'from-purple-500 to-pink-600',
      action: 'sales-page-builder'
    }
  ]

  const getPlanProgress = () => {
    switch (user?.plan) {
      case 'free':
        return { current: 1, total: 3, percentage: 33 }
      case 'pro':
        return { current: 2, total: 3, percentage: 66 }
      case 'premium':
        return { current: 3, total: 3, percentage: 100 }
      default:
        return { current: 1, total: 3, percentage: 33 }
    }
  }

  const planProgress = getPlanProgress()

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary via-accent to-primary text-white rounded-xl p-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name}! 🚀
            </h1>
            <p className="text-white/90 text-lg">
              Ready to scale your business with AI-powered automation?
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Button 
              size="lg" 
              variant="secondary" 
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => {
                // Quick system test
                import('../services/apiService').then(({ apiService }) => {
                  Promise.all([
                    apiService.testAPI('openai'),
                    apiService.testAPI('luma'),
                    apiService.testAPI('cj_dropshipping')
                  ]).then(results => {
                    const working = results.filter(Boolean).length
                    toast.success(`✅ ${working}/3 core systems operational!`)
                  })
                })
              }}
            >
              <Lightning className="h-5 w-5 mr-2" />
              Test Systems
            </Button>
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
              <Lightning className="h-5 w-5 mr-2" />
              Generate Campaign
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-green-600">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-full bg-muted ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI System Status */}
      <AISystemStatus onOpenSettings={() => {
        // Navigate to admin dashboard API configuration
        console.log('Navigate to Admin Dashboard API Configuration')
      }} />

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightning className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Jump into the most powerful NexusOneAI features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary/50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${action.gradient} text-white`}>
                          {action.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{action.title}</h3>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Account Overview */}
        <div className="space-y-6">
          {/* Plan Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Current Plan:</span>
                <Badge variant="secondary" className="font-medium">
                  {user?.plan?.toUpperCase()}
                </Badge>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Plan Progress</span>
                  <span>{planProgress.current}/{planProgress.total}</span>
                </div>
                <Progress value={planProgress.percentage} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-xl font-bold text-primary">{credits}</div>
                  <div className="text-xs text-muted-foreground">AI Credits</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-xl font-bold text-accent">{videoCredits}</div>
                  <div className="text-xs text-muted-foreground">Video Credits</div>
                </div>
              </div>

              {user?.plan === 'free' && (
                <Button className="w-full mt-4">
                  Upgrade to Pro
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50">
                    {activity.icon}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}