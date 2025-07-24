import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useKV } from '@github/spark/hooks'
import { BarChart3, TrendUp, Eye, Users, Target, MousePointer } from '@phosphor-icons/react'

export function Analytics() {
  const [campaigns] = useKV('campaigns', [])
  const [generatedContent] = useKV('generated-content', [])

  const totalCampaigns = campaigns.length
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length
  const totalImpressions = campaigns.reduce((sum, c) => sum + c.performance.impressions, 0)
  const totalClicks = campaigns.reduce((sum, c) => sum + c.performance.clicks, 0)
  const totalConversions = campaigns.reduce((sum, c) => sum + c.performance.conversions, 0)
  const clickRate = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00'
  const conversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : '0.00'

  const stats = [
    {
      title: 'Total Impressions',
      value: totalImpressions.toLocaleString(),
      description: 'Across all campaigns',
      icon: Eye,
      color: 'text-blue-600'
    },
    {
      title: 'Total Clicks',
      value: totalClicks.toLocaleString(),
      description: 'User interactions',
      icon: MousePointer,
      color: 'text-green-600'
    },
    {
      title: 'Click Rate',
      value: `${clickRate}%`,
      description: 'Average CTR',
      icon: TrendUp,
      color: 'text-accent'
    },
    {
      title: 'Conversions',
      value: totalConversions.toString(),
      description: 'Goal completions',
      icon: Target,
      color: 'text-purple-600'
    },
    {
      title: 'Conversion Rate',
      value: `${conversionRate}%`,
      description: 'From clicks',
      icon: BarChart3,
      color: 'text-red-600'
    },
    {
      title: 'Content Generated',
      value: generatedContent.length.toString(),
      description: 'AI-created pieces',
      icon: Users,
      color: 'text-indigo-600'
    }
  ]

  const campaignPerformance = campaigns.map(campaign => ({
    name: campaign.name,
    type: campaign.type,
    impressions: campaign.performance.impressions,
    clicks: campaign.performance.clicks,
    conversions: campaign.performance.conversions,
    clickRate: campaign.performance.impressions > 0 
      ? ((campaign.performance.clicks / campaign.performance.impressions) * 100).toFixed(2)
      : '0.00',
    conversionRate: campaign.performance.clicks > 0
      ? ((campaign.performance.conversions / campaign.performance.clicks) * 100).toFixed(2)
      : '0.00'
  }))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Analytics</h2>
        <p className="text-muted-foreground">
          Track your marketing performance and campaign metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${stat.color}`} weight="fill" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Overview</CardTitle>
            <CardDescription>Summary of all your campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Campaigns</span>
                <span className="text-lg font-semibold">{totalCampaigns}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Active Campaigns</span>
                <span className="text-lg font-semibold text-green-600">{activeCampaigns}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Paused Campaigns</span>
                <span className="text-lg font-semibold text-yellow-600">
                  {campaigns.filter(c => c.status === 'paused').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Draft Campaigns</span>
                <span className="text-lg font-semibold text-gray-600">
                  {campaigns.filter(c => c.status === 'draft').length}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
            <CardDescription>Key metrics analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-800">Impression Performance</p>
                <p className="text-xs text-blue-600">
                  Your campaigns have generated {totalImpressions.toLocaleString()} total impressions
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-800">Engagement Rate</p>
                <p className="text-xs text-green-600">
                  Average click-through rate of {clickRate}% across all campaigns
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm font-medium text-purple-800">Conversion Success</p>
                <p className="text-xs text-purple-600">
                  {conversionRate}% conversion rate from clicks to goals
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {campaignPerformance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>Detailed metrics for each campaign</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Campaign</th>
                    <th className="text-left p-2">Type</th>
                    <th className="text-right p-2">Impressions</th>
                    <th className="text-right p-2">Clicks</th>
                    <th className="text-right p-2">CTR</th>
                    <th className="text-right p-2">Conversions</th>
                    <th className="text-right p-2">CVR</th>
                  </tr>
                </thead>
                <tbody>
                  {campaignPerformance.map((campaign, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2 font-medium">{campaign.name}</td>
                      <td className="p-2 capitalize">{campaign.type}</td>
                      <td className="p-2 text-right">{campaign.impressions.toLocaleString()}</td>
                      <td className="p-2 text-right">{campaign.clicks.toLocaleString()}</td>
                      <td className="p-2 text-right">{campaign.clickRate}%</td>
                      <td className="p-2 text-right">{campaign.conversions}</td>
                      <td className="p-2 text-right">{campaign.conversionRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {campaigns.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Analytics Data</h3>
            <p className="text-muted-foreground">
              Create some campaigns to see performance analytics here
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}