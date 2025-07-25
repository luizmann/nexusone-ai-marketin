import React, { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { useLanguage } from '../contexts/LanguageContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Globe, 
  BarChart3,
  Rocket,
  Target,
  Zap,
  Star,
  Award,
  Crown,
  ChartLine,
  Calendar,
  Download,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowUp,
  ArrowDown
} from '@phosphor-icons/react'
import { toast } from 'sonner'

// Market Expansion Types
interface MarketData {
  country: string
  region: string
  marketSize: number
  competition: 'low' | 'medium' | 'high'
  opportunity: number
  language: string
  currency: string
  regulatoryComplexity: 'low' | 'medium' | 'high'
  entryBarriers: string[]
  keyChannels: string[]
  avgCPA: number
  conversionRate: number
  preferences: string[]
}

interface ExpansionPlan {
  id: string
  name: string
  phase: 'planning' | 'preparation' | 'launch' | 'scaling' | 'optimization'
  priority: 'high' | 'medium' | 'low'
  markets: string[]
  budget: number
  timeline: string
  expectedROI: number
  progress: number
  milestones: {
    id: string
    name: string
    status: 'completed' | 'in_progress' | 'pending'
    dueDate: string
    description: string
  }[]
  risks: {
    id: string
    type: 'market' | 'regulatory' | 'competitive' | 'operational'
    description: string
    impact: 'low' | 'medium' | 'high'
    probability: 'low' | 'medium' | 'high'
    mitigation: string
  }[]
}

interface CampaignMetrics {
  country: string
  impressions: number
  clicks: number
  conversions: number
  cost: number
  revenue: number
  roi: number
  ctr: number
  conversionRate: number
  avgOrderValue: number
}

export function MarketExpansion() {
  const { t } = useLanguage()
  const [user] = useKV('user-profile', null)
  const [marketData, setMarketData] = useKV<MarketData[]>('market-data', [])
  const [expansionPlans, setExpansionPlans] = useKV<ExpansionPlan[]>('expansion-plans', [])
  const [campaignMetrics, setCampaignMetrics] = useKV<CampaignMetrics[]>('campaign-metrics', [])
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedMarket, setSelectedMarket] = useState<MarketData | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Initialize sample data
  useEffect(() => {
    if (marketData.length === 0) {
      const sampleMarketData: MarketData[] = [
        {
          country: 'United States',
          region: 'North America',
          marketSize: 2850000000,
          competition: 'high',
          opportunity: 85,
          language: 'English',
          currency: 'USD',
          regulatoryComplexity: 'medium',
          entryBarriers: ['High customer acquisition costs', 'Established competitors', 'Complex compliance'],
          keyChannels: ['Google Ads', 'Facebook Ads', 'LinkedIn', 'Content Marketing'],
          avgCPA: 125,
          conversionRate: 3.2,
          preferences: ['Self-service platforms', 'Enterprise features', 'API integrations', 'Security compliance']
        },
        {
          country: 'Germany',
          region: 'Europe',
          marketSize: 890000000,
          competition: 'medium',
          opportunity: 92,
          language: 'German',
          currency: 'EUR',
          regulatoryComplexity: 'high',
          entryBarriers: ['GDPR compliance', 'Language localization', 'Cultural adaptation'],
          keyChannels: ['XING', 'Google Ads', 'Industry publications', 'Trade shows'],
          avgCPA: 85,
          conversionRate: 4.1,
          preferences: ['Data privacy', 'Local support', 'German language', 'Enterprise reliability']
        },
        {
          country: 'Japan',
          region: 'Asia Pacific',
          marketSize: 1250000000,
          competition: 'medium',
          opportunity: 88,
          language: 'Japanese',
          currency: 'JPY',
          regulatoryComplexity: 'medium',
          entryBarriers: ['Cultural differences', 'Language barriers', 'Local partnerships required'],
          keyChannels: ['Yahoo Japan', 'LINE Business', 'Industry networks', 'Partnership channels'],
          avgCPA: 95,
          conversionRate: 5.3,
          preferences: ['Mobile-first design', 'Quality focus', 'Relationship building', 'Long-term partnerships']
        },
        {
          country: 'United Kingdom',
          region: 'Europe',
          marketSize: 650000000,
          competition: 'high',
          opportunity: 78,
          language: 'English',
          currency: 'GBP',
          regulatoryComplexity: 'medium',
          entryBarriers: ['Brexit implications', 'Saturated market', 'High competition'],
          keyChannels: ['Google Ads', 'LinkedIn', 'Industry events', 'Referral programs'],
          avgCPA: 110,
          conversionRate: 2.8,
          preferences: ['Innovation focus', 'ROI-driven decisions', 'Professional services', 'Compliance tools']
        },
        {
          country: 'Australia',
          region: 'Asia Pacific',
          marketSize: 420000000,
          competition: 'low',
          opportunity: 94,
          language: 'English',
          currency: 'AUD',
          regulatoryComplexity: 'low',
          entryBarriers: ['Geographic isolation', 'Smaller market size', 'Distance from support'],
          keyChannels: ['Google Ads', 'Facebook Ads', 'Industry associations', 'Local events'],
          avgCPA: 75,
          conversionRate: 4.8,
          preferences: ['Local presence', 'Time zone considerations', 'Australian support', 'Simple solutions']
        },
        {
          country: 'Canada',
          region: 'North America',
          marketSize: 380000000,
          competition: 'medium',
          opportunity: 91,
          language: 'English/French',
          currency: 'CAD',
          regulatoryComplexity: 'medium',
          entryBarriers: ['Bilingual requirements', 'Provincial regulations', 'US market dominance'],
          keyChannels: ['Google Ads', 'LinkedIn', 'Industry publications', 'Government programs'],
          avgCPA: 68,
          conversionRate: 3.9,
          preferences: ['Bilingual support', 'Canadian hosting', 'Government compliance', 'Environmental responsibility']
        }
      ]
      setMarketData(sampleMarketData)

      const sampleExpansionPlans: ExpansionPlan[] = [
        {
          id: 'plan_1',
          name: 'European Market Entry',
          phase: 'preparation',
          priority: 'high',
          markets: ['Germany', 'United Kingdom', 'France'],
          budget: 250000,
          timeline: 'Q2-Q4 2024',
          expectedROI: 285,
          progress: 35,
          milestones: [
            {
              id: 'ms_1',
              name: 'GDPR Compliance Implementation',
              status: 'completed',
              dueDate: '2024-02-15',
              description: 'Implement GDPR-compliant data handling and privacy controls'
            },
            {
              id: 'ms_2',
              name: 'German Localization',
              status: 'in_progress',
              dueDate: '2024-03-01',
              description: 'Complete German language translation and cultural adaptation'
            },
            {
              id: 'ms_3',
              name: 'EU Payment Integration',
              status: 'pending',
              dueDate: '2024-03-15',
              description: 'Integrate European payment methods and currency support'
            }
          ],
          risks: [
            {
              id: 'risk_1',
              type: 'regulatory',
              description: 'Complex GDPR compliance requirements',
              impact: 'high',
              probability: 'medium',
              mitigation: 'Engage local legal counsel and implement privacy-by-design'
            },
            {
              id: 'risk_2',
              type: 'competitive',
              description: 'Strong local competitors with established market presence',
              impact: 'medium',
              probability: 'high',
              mitigation: 'Focus on unique AI capabilities and superior user experience'
            }
          ]
        },
        {
          id: 'plan_2',
          name: 'Asia Pacific Expansion',
          phase: 'planning',
          priority: 'medium',
          markets: ['Japan', 'Australia', 'Singapore'],
          budget: 180000,
          timeline: 'Q3-Q1 2025',
          expectedROI: 220,
          progress: 15,
          milestones: [
            {
              id: 'ms_4',
              name: 'Market Research Completion',
              status: 'in_progress',
              dueDate: '2024-02-28',
              description: 'Complete comprehensive market analysis for APAC region'
            },
            {
              id: 'ms_5',
              name: 'Partnership Identification',
              status: 'pending',
              dueDate: '2024-03-30',
              description: 'Identify and engage potential local partners'
            },
            {
              id: 'ms_6',
              name: 'Japanese Localization',
              status: 'pending',
              dueDate: '2024-04-30',
              description: 'Adapt platform for Japanese market requirements'
            }
          ],
          risks: [
            {
              id: 'risk_3',
              type: 'market',
              description: 'Cultural differences affecting product-market fit',
              impact: 'high',
              probability: 'medium',
              mitigation: 'Partner with local experts and conduct extensive user research'
            }
          ]
        }
      ]
      setExpansionPlans(sampleExpansionPlans)

      const sampleCampaignMetrics: CampaignMetrics[] = [
        {
          country: 'Brazil',
          impressions: 1250000,
          clicks: 38500,
          conversions: 1240,
          cost: 15800,
          revenue: 89500,
          roi: 466,
          ctr: 3.08,
          conversionRate: 3.22,
          avgOrderValue: 72.18
        },
        {
          country: 'Mexico',
          impressions: 850000,
          clicks: 22800,
          conversions: 685,
          cost: 9200,
          revenue: 41800,
          roi: 354,
          ctr: 2.68,
          conversionRate: 3.00,
          avgOrderValue: 61.02
        },
        {
          country: 'Argentina',
          impressions: 425000,
          clicks: 12100,
          conversions: 348,
          cost: 4800,
          revenue: 21600,
          roi: 350,
          ctr: 2.85,
          conversionRate: 2.88,
          avgOrderValue: 62.07
        }
      ]
      setCampaignMetrics(sampleCampaignMetrics)
    }
  }, [marketData])

  // Analyze market opportunity
  const analyzeMarket = async (market: MarketData) => {
    setIsAnalyzing(true)
    setSelectedMarket(market)
    
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 3000))
      toast.success(`Market analysis completed for ${market.country}`)
    } catch (error) {
      toast.error('Error analyzing market opportunity')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Get opportunity color
  const getOpportunityColor = (opportunity: number) => {
    if (opportunity >= 90) return 'text-green-600'
    if (opportunity >= 80) return 'text-blue-600'
    if (opportunity >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  // Get competition color
  const getCompetitionColor = (competition: string) => {
    switch (competition) {
      case 'low': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'high': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Global Market Expansion</h1>
          <p className="text-muted-foreground">Strategic market analysis and expansion planning</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => analyzeMarket(marketData[0])} disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <BarChart3 className="w-4 h-4 mr-2" />
                Analyze Markets
              </>
            )}
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Market Size</p>
                <p className="text-2xl font-bold">
                  ${(marketData.reduce((sum, m) => sum + m.marketSize, 0) / 1000000000).toFixed(1)}B
                </p>
              </div>
              <Globe className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Markets</p>
                <p className="text-2xl font-bold">{campaignMetrics.length}</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg ROI</p>
                <p className="text-2xl font-bold">
                  {(campaignMetrics.reduce((sum, c) => sum + c.roi, 0) / campaignMetrics.length || 0).toFixed(0)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expansion Plans</p>
                <p className="text-2xl font-bold">{expansionPlans.length}</p>
              </div>
              <Rocket className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="markets">Market Analysis</TabsTrigger>
          <TabsTrigger value="plans">Expansion Plans</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Market Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Top Market Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketData
                    .sort((a, b) => b.opportunity - a.opportunity)
                    .slice(0, 4)
                    .map((market) => (
                      <div key={market.country} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                            <Globe className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium">{market.country}</p>
                            <p className="text-sm text-muted-foreground">{market.region}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${getOpportunityColor(market.opportunity)}`}>
                            {market.opportunity}%
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ${(market.marketSize / 1000000).toFixed(0)}M
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Expansion Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="w-5 h-5" />
                  Expansion Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expansionPlans.map((plan) => (
                    <div key={plan.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{plan.name}</p>
                          <p className="text-sm text-muted-foreground">{plan.timeline}</p>
                        </div>
                        <Badge variant={plan.priority === 'high' ? 'default' : 'secondary'}>
                          {plan.priority}
                        </Badge>
                      </div>
                      <Progress value={plan.progress} className="h-2" />
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{plan.progress}% complete</span>
                        <span>ROI: {plan.expectedROI}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Current Market Performance</CardTitle>
              <CardDescription>Performance metrics from active markets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {campaignMetrics.map((metric) => (
                  <div key={metric.country} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{metric.country}</h4>
                      <Badge variant="outline">{metric.roi}% ROI</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Revenue</p>
                        <p className="font-medium">${metric.revenue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Conversions</p>
                        <p className="font-medium">{metric.conversions}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">CTR</p>
                        <p className="font-medium">{metric.ctr}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">CVR</p>
                        <p className="font-medium">{metric.conversionRate}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Market Analysis Tab */}
        <TabsContent value="markets" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {marketData.map((market) => (
              <Card key={market.country} className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedMarket(market)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{market.country}</CardTitle>
                    <Badge variant="outline">{market.region}</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`text-2xl font-bold ${getOpportunityColor(market.opportunity)}`}>
                      {market.opportunity}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Opportunity Score
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Market Size</p>
                      <p className="font-medium">${(market.marketSize / 1000000).toFixed(0)}M</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Competition</p>
                      <p className={`font-medium ${getCompetitionColor(market.competition)}`}>
                        {market.competition}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Avg CPA</p>
                      <p className="font-medium">${market.avgCPA}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">CVR</p>
                      <p className="font-medium">{market.conversionRate}%</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm font-medium mb-2">Key Channels</p>
                    <div className="flex flex-wrap gap-1">
                      {market.keyChannels.slice(0, 2).map((channel) => (
                        <Badge key={channel} variant="outline" className="text-xs">
                          {channel}
                        </Badge>
                      ))}
                      {market.keyChannels.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{market.keyChannels.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full" 
                          onClick={(e) => {
                            e.stopPropagation()
                            analyzeMarket(market)
                          }}>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analyze Market
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Market Details Modal would go here */}
          {selectedMarket && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>{selectedMarket.country} - Detailed Analysis</CardTitle>
                <CardDescription>Comprehensive market overview and recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Market Preferences</h4>
                    <div className="space-y-2">
                      {selectedMarket.preferences.map((preference, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{preference}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Entry Barriers</h4>
                    <div className="space-y-2">
                      {selectedMarket.entryBarriers.map((barrier, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm">{barrier}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button>
                    <Target className="w-4 h-4 mr-2" />
                    Create Expansion Plan
                  </Button>
                  <Button variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Full Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Other tabs would be implemented similarly... */}
        <TabsContent value="plans">
          <div className="text-center py-12">
            <Rocket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Expansion Plans</h3>
            <p className="text-muted-foreground">Detailed expansion planning interface coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Performance Analytics</h3>
            <p className="text-muted-foreground">Advanced performance tracking interface coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="insights">
          <div className="text-center py-12">
            <Zap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">AI Market Insights</h3>
            <p className="text-muted-foreground">AI-powered market analysis and recommendations coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}