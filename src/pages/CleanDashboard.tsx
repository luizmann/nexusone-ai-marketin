import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/AuthContext'
import { useCredits } from '@/contexts/CreditContext'
import { useLanguage } from '@/contexts/CleanLanguageContext'
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
  CheckCircle,
  ArrowRight,
  Plus,
  Brain,
  Wand2,
  Target,
  MessageCircle
} from '@phosphor-icons/react'

interface DashboardProps {
  onModuleChange?: (module: string) => void
}

export const Dashboard: React.FC<DashboardProps> = ({ onModuleChange }) => {
  const { user } = useAuth()
  const { credits, videoCredits } = useCredits()
  const { t } = useLanguage()

  const stats = [
    {
      title: 'AI Campaigns',
      value: '12',
      change: '+5 this week',
      icon: <Robot className="h-5 w-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Leads',
      value: '847',
      change: '+23% this month',
      icon: <Users className="h-5 w-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Revenue Generated',
      value: '$12,450',
      change: '+18% this month',
      icon: <DollarSign className="h-5 w-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Videos Created',
      value: '23',
      change: '+8 this week',
      icon: <Video className="h-5 w-5" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  const quickActions = [
    {
      title: 'Generate Campaign',
      description: 'Create complete marketing funnel with AI',
      icon: <Lightning className="h-6 w-6" />,
      action: () => onModuleChange?.('smart-campaigns'),
      color: 'bg-gradient-to-r from-blue-500 to-purple-600',
      credits: 25
    },
    {
      title: 'Create Landing Page',
      description: 'AI-powered sales pages in minutes',
      icon: <Wand2 className="h-6 w-6" />,
      action: () => onModuleChange?.('magic-pages'),
      color: 'bg-gradient-to-r from-green-500 to-blue-500',
      credits: 15
    },
    {
      title: 'Generate Video',
      description: 'Professional videos with AI',
      icon: <Video className="h-6 w-6" />,
      action: () => onModuleChange?.('video-generator'),
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      credits: 30
    },
    {
      title: 'WhatsApp Bot',
      description: 'Automated sales conversations',
      icon: <MessageCircle className="h-6 w-6" />,
      action: () => onModuleChange?.('whatsapp-ai'),
      color: 'bg-gradient-to-r from-green-600 to-teal-500',
      credits: 10
    }
  ]

  const recentActivity = [
    { action: 'Created landing page for "Wireless Headphones"', time: '2 hours ago', status: 'success' },
    { action: 'Generated Facebook ad campaign', time: '4 hours ago', status: 'success' },
    { action: 'WhatsApp bot captured 5 new leads', time: '6 hours ago', status: 'success' },
    { action: 'Video generation completed', time: '1 day ago', status: 'success' },
    { action: 'Campaign optimization suggested', time: '2 days ago', status: 'info' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.name || 'Creator'}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Ready to create amazing campaigns with AI?
          </p>
        </div>
        <Button 
          onClick={() => onModuleChange?.('nexbrain')}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Brain className="mr-2 h-4 w-4" />
          Talk to NexBrain
        </Button>
      </div>

      {/* Credits Status */}
      <Card className="border-l-4 border-l-primary">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">General Credits</p>
                  <p className="text-2xl font-bold">{credits}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Video Credits</p>
                  <p className="text-2xl font-bold">{videoCredits}</p>
                </div>
              </div>
              <div className="space-y-1">
                <Progress value={(credits / 500) * 100} className="w-48" />
                <p className="text-xs text-muted-foreground">Pro Plan • Resets monthly</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => onModuleChange?.('credits')}>
              Manage Credits
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <div className={stat.color}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightning className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Start creating with AI in just one click
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Card 
                key={index} 
                className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 border-0"
                onClick={action.action}
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4`}>
                    <div className="text-white">
                      {action.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{action.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {action.credits} credits
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50">
                  <div className="flex-shrink-0">
                    {activity.status === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Robot className="h-5 w-5" />
              AI System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">OpenAI GPT-4</span>
                <Badge className="bg-green-100 text-green-800">Operational</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Luma Video AI</span>
                <Badge className="bg-green-100 text-green-800">Operational</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Facebook API</span>
                <Badge className="bg-green-100 text-green-800">Operational</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">WhatsApp API</span>
                <Badge className="bg-green-100 text-green-800">Operational</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">CJ Dropshipping</span>
                <Badge className="bg-green-100 text-green-800">Operational</Badge>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full mt-4"
                onClick={() => onModuleChange?.('admin')}
              >
                View Detailed Status
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Tips */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Star className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-blue-900">AI Tip of the Day</h3>
              <p className="text-blue-700 mt-1">
                Try using specific product benefits in your landing page descriptions. 
                NexBrain performs 40% better with detailed product information!
              </p>
              <Button 
                variant="link" 
                className="mt-2 p-0 h-auto text-blue-600"
                onClick={() => onModuleChange?.('nexbrain')}
              >
                Ask NexBrain for tips <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}