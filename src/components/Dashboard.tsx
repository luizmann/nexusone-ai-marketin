import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useKV } from '@github/spark/hooks'
import { 
  PenNib, 
  Target, 
  BarChart3, 
  TrendUp,
  Users,
  Eye,
  CheckCircle,
  Clock,
  Hash,
  Layout
} from '@phosphor-icons/react'
import { useLanguage } from '../contexts/LanguageContext'

interface DashboardProps {
  onModuleChange?: (module: string) => void
}

export function Dashboard({ onModuleChange }: DashboardProps) {
  const [user] = useKV('user-profile', null)
  const [campaigns] = useKV('campaigns', [])
  const [generatedContent] = useKV('generated-content', [])
  const [socialContent] = useKV('social-media-content', [])
  const { t, isRTL } = useLanguage()

  const stats = [
    {
      title: t('dashboard.stats.total_campaigns'),
      value: campaigns.length,
      description: t('dashboard.stats.total_campaigns'),
      icon: Target,
      trend: '+12%'
    },
    {
      title: t('modules.social_media.title'),
      value: socialContent.length,
      description: t('modules.social_media.description'),
      icon: Hash,
      trend: '+35%'
    },
    {
      title: t('dashboard.stats.credits_used'),
      value: generatedContent.length,
      description: t('modules.ai_agents.description'),
      icon: PenNib,
      trend: '+25%'
    },
    {
      title: t('dashboard.stats.conversion_rate'),
      value: '3.2%',
      description: 'Average across campaigns',
      icon: TrendUp,
      trend: '+1.2%'
    }
  ]

  const recentActivities = [
    {
      title: 'Social media campaign generated',
      description: 'AI created multi-platform content for Summer Sale',
      time: '1 hour ago',
      icon: Hash,
      status: 'success'
    },
    {
      title: 'Campaign "Summer Sale" launched',
      description: 'Email campaign sent to 1,250 subscribers',
      time: '2 hours ago',
      icon: Target,
      status: 'success'
    },
    {
      title: 'New blog post content generated',
      description: 'AI created "10 Marketing Tips for Small Business"',
      time: '4 hours ago',
      icon: PenNib,
      status: 'success'
    }
  ]

  const quickActions = [
    {
      title: 'Visual Page Editor',
      description: 'Build pages with drag & drop editor',
      icon: Layout,
      action: 'page-editor',
      color: 'accent'
    },
    {
      title: 'Social Media AI',
      description: 'Generate multi-platform social content',
      icon: Hash,
      action: 'social-media',
      color: 'accent'
    },
    {
      title: 'Generate Content',
      description: 'Create marketing copy with AI',
      icon: PenNib,
      action: 'content',
      color: 'primary'
    },
    {
      title: 'New Campaign',
      description: 'Start a new marketing campaign',
      icon: Target,
      action: 'campaigns',
      color: 'secondary'
    },
    {
      title: 'View Analytics',
      description: 'Check your performance metrics',
      icon: BarChart3,
      action: 'analytics',
      color: 'muted'
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your marketing automation platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </div>
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-accent" weight="fill" />
                  </div>
                </div>
                <div className="mt-3 flex items-center text-xs">
                  <TrendUp className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">{stat.trend}</span>
                  <span className="text-muted-foreground ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates from your campaigns and content</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => {
              const Icon = activity.icon
              return (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    activity.status === 'success' ? 'bg-green-100 text-green-600' :
                    activity.status === 'info' ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    <Icon className="w-4 h-4" weight="fill" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Jump into key tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Button
                  key={action.action}
                  variant="outline"
                  className="w-full justify-start text-left h-auto p-4"
                  onClick={() => onModuleChange?.(action.action)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4 text-accent" weight="fill" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{action.title}</p>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                </Button>
              )
            })}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Account Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">{user?.credits || 0}</p>
              <p className="text-sm text-muted-foreground">Credits Remaining</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{user?.plan?.toUpperCase()}</p>
              <p className="text-sm text-muted-foreground">Current Plan</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">Active</p>
              <p className="text-sm text-muted-foreground">Account Status</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}