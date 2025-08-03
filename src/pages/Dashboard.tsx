import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserProfile } from '@/contexts/AuthContext';
import { 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign,
  Plus,
  Play,
  Eye,
  MessageCircle,
  Zap,
  BarChart3,
  Globe
} from '@phosphor-icons/react';

interface QuickStat {
  label: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'orange' | 'purple';
}

interface RecentActivity {
  id: string;
  action: string;
  time: string;
  status: 'success' | 'pending' | 'failed';
}

export default function Dashboard() {
  const { t } = useLanguage();
  const { profile } = useUserProfile();

  // Mock data - would come from real API in production
  const quickStats: QuickStat[] = [
    {
      label: t('dashboard.total_campaigns'),
      value: '12',
      change: '+23%',
      icon: <Target size={24} />,
      color: 'blue'
    },
    {
      label: t('dashboard.active_pages'),
      value: '8',
      change: '+12%',
      icon: <Globe size={24} />,
      color: 'green'
    },
    {
      label: t('dashboard.total_leads'),
      value: '156',
      change: '+45%',
      icon: <Users size={24} />,
      color: 'orange'
    },
    {
      label: t('dashboard.conversion_rate'),
      value: '3.2%',
      change: '+0.8%',
      icon: <TrendingUp size={24} />,
      color: 'purple'
    }
  ];

  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      action: 'Magic Page created for "Wireless Earbuds"',
      time: '2 hours ago',
      status: 'success'
    },
    {
      id: '2',
      action: 'Facebook campaign "Summer Sale" launched',
      time: '4 hours ago',
      status: 'success'
    },
    {
      id: '3',
      action: 'Video generation in progress',
      time: '6 hours ago',
      status: 'pending'
    },
    {
      id: '4',
      action: 'WhatsApp bot connected successfully',
      time: '1 day ago',
      status: 'success'
    }
  ];

  const quickActions = [
    {
      title: 'Generate Campaign',
      description: 'Create a complete marketing campaign with AI',
      icon: <Zap size={20} />,
      color: 'bg-blue-500',
      action: 'create-campaign'
    },
    {
      title: 'Magic Page',
      description: 'Build a high-converting sales page',
      icon: <Globe size={20} />,
      color: 'bg-green-500',
      action: 'magic-page'
    },
    {
      title: 'AI Video',
      description: 'Generate promotional videos instantly',
      icon: <Play size={20} />,
      color: 'bg-purple-500',
      action: 'ai-video'
    },
    {
      title: 'WhatsApp Bot',
      description: 'Set up automated sales conversations',
      icon: <MessageCircle size={20} />,
      color: 'bg-orange-500',
      action: 'whatsapp-bot'
    }
  ];

  const getStatColor = (color: string) => {
    const colors = {
      blue: 'text-blue-600 bg-blue-50',
      green: 'text-green-600 bg-green-50',
      orange: 'text-orange-600 bg-orange-50',
      purple: 'text-purple-600 bg-purple-50'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    };
    return variants[status as keyof typeof variants] || variants.success;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {t('dashboard.welcome')}
        </h1>
        <p className="text-muted-foreground">
          {t('dashboard.subtitle')}
        </p>
      </div>

      {/* Credits & Plan Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('credits.remaining')}
                </p>
                <p className="text-2xl font-bold">
                  {profile?.credits || 0}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t('plans.current_plan')}
                </p>
                <p className="text-2xl font-bold capitalize">
                  {profile?.plan || 'Free'}
                </p>
              </div>
              <Badge variant="secondary" className="capitalize">
                {profile?.plan || 'free'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Video Quota
                </p>
                <p className="text-2xl font-bold">
                  {profile?.video_quota || 0}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Play className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          {t('dashboard.quick_stats')}
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <TrendingUp size={12} />
                      {stat.change}
                    </p>
                  </div>
                  <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${getStatColor(stat.color)}`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className={`h-12 w-12 rounded-lg ${action.color} flex items-center justify-center text-white`}>
                    {action.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {action.description}
                    </p>
                  </div>
                  <Button size="sm" className="w-full">
                    <Plus size={16} className="mr-2" />
                    Start
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity & Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.recent_activity')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={getStatusBadge(activity.status)}
                  >
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              {t('dashboard.view_all')}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Page Views</span>
                <span className="font-medium">2,845</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Click Rate</span>
                <span className="font-medium">12.4%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Revenue</span>
                <span className="font-medium">$1,249</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Conversions</span>
                <span className="font-medium">38</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              <BarChart3 size={16} className="mr-2" />
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}