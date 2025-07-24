import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useKV } from '@github/spark/hooks'
import {
  Calendar,
  Clock,
  TrendUp,
  Users,
  Share,
  Heart,
  ChatCircle,
  Repeat,
  Eye
} from '@phosphor-icons/react'

interface SocialPostPerformanceProps {
  campaign: any
}

export function SocialPostPerformance({ campaign }: SocialPostPerformanceProps) {
  const [expandedPost, setExpandedPost] = useState<string | null>(null)

  // Mock performance data - in a real app this would come from social media APIs
  const mockPerformanceData = {
    instagram: {
      likes: 1247,
      comments: 89,
      shares: 156,
      reach: 8934,
      engagement: 18.2
    },
    facebook: {
      likes: 892,
      comments: 45,
      shares: 234,
      reach: 12450,
      engagement: 12.8
    },
    twitter: {
      likes: 567,
      retweets: 123,
      comments: 34,
      views: 15670,
      engagement: 4.6
    },
    linkedin: {
      likes: 234,
      comments: 28,
      shares: 67,
      views: 5432,
      engagement: 6.1
    }
  }

  const getPlatformMetrics = (platformId: string) => {
    const data = mockPerformanceData[platformId as keyof typeof mockPerformanceData]
    if (!data) return null

    const platformConfig = {
      instagram: {
        primary: { icon: Heart, label: 'Likes', value: data.likes },
        secondary: [
          { icon: ChatCircle, label: 'Comments', value: data.comments },
          { icon: Share, label: 'Shares', value: data.shares },
          { icon: Eye, label: 'Reach', value: data.reach }
        ]
      },
      facebook: {
        primary: { icon: Heart, label: 'Likes', value: data.likes },
        secondary: [
          { icon: ChatCircle, label: 'Comments', value: data.comments },
          { icon: Share, label: 'Shares', value: data.shares },
          { icon: Eye, label: 'Reach', value: data.reach }
        ]
      },
      twitter: {
        primary: { icon: Heart, label: 'Likes', value: data.likes },
        secondary: [
          { icon: Repeat, label: 'Retweets', value: (data as any).retweets },
          { icon: ChatCircle, label: 'Replies', value: data.comments },
          { icon: Eye, label: 'Views', value: (data as any).views }
        ]
      },
      linkedin: {
        primary: { icon: Heart, label: 'Likes', value: data.likes },
        secondary: [
          { icon: ChatCircle, label: 'Comments', value: data.comments },
          { icon: Share, label: 'Shares', value: data.shares },
          { icon: Eye, label: 'Views', value: (data as any).views }
        ]
      }
    }

    return platformConfig[platformId as keyof typeof platformConfig]
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const getEngagementColor = (rate: number) => {
    if (rate >= 15) return 'text-green-600'
    if (rate >= 8) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (!campaign || !campaign.contents) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">No campaign data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Campaign Performance</h3>
        <Badge variant="outline" className="flex items-center">
          <TrendUp className="w-3 h-3 mr-1" />
          Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(campaign.contents).map(([platformId, content]: [string, any]) => {
          const performanceData = mockPerformanceData[platformId as keyof typeof mockPerformanceData]
          const metrics = getPlatformMetrics(platformId)
          
          if (!performanceData || !metrics) return null

          return (
            <Card key={platformId} className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm capitalize flex items-center justify-between">
                  {platformId}
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getEngagementColor(performanceData.engagement)}`}
                  >
                    {performanceData.engagement}% eng
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <metrics.primary.icon className="w-4 h-4 text-red-500" />
                    <span className="text-2xl font-bold">
                      {formatNumber(metrics.primary.value)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{metrics.primary.label}</p>
                </div>

                <Separator />

                <div className="grid grid-cols-3 gap-2 text-center">
                  {metrics.secondary.map((metric, index) => {
                    const Icon = metric.icon
                    return (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-center">
                          <Icon className="w-3 h-3 text-muted-foreground" />
                        </div>
                        <p className="text-xs font-medium">{formatNumber(metric.value)}</p>
                        <p className="text-xs text-muted-foreground">{metric.label}</p>
                      </div>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setExpandedPost(expandedPost === platformId ? null : platformId)}
                >
                  {expandedPost === platformId ? 'Hide Details' : 'View Details'}
                </Button>

                {expandedPost === platformId && (
                  <div className="mt-3 p-3 bg-muted/50 rounded-lg space-y-2">
                    <div className="text-xs">
                      <div className="flex justify-between">
                        <span>Best performing time:</span>
                        <span className="font-medium">2:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Audience age:</span>
                        <span className="font-medium">25-34</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Top location:</span>
                        <span className="font-medium">São Paulo</span>
                      </div>
                    </div>
                    <Separator />
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {content.mainText}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Campaign Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-accent">86.4K</p>
              <p className="text-xs text-muted-foreground">Total Reach</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">12.8%</p>
              <p className="text-xs text-muted-foreground">Avg. Engagement</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">340</p>
              <p className="text-xs text-muted-foreground">New Followers</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recommendations</h4>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li className="flex items-start">
                <TrendUp className="w-3 h-3 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                Instagram posts perform best with carousel format
              </li>
              <li className="flex items-start">
                <Clock className="w-3 h-3 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
                Post on LinkedIn during weekday lunch hours
              </li>
              <li className="flex items-start">
                <Users className="w-3 h-3 mr-2 mt-0.5 text-purple-500 flex-shrink-0" />
                Your audience is most active on mobile devices
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}