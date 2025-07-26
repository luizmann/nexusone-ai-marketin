import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { 
  Rocket, 
  Play, 
  Pause, 
  Mail, 
  MessageCircle, 
  Share2, 
  Target,
  TrendingUp,
  Users,
  Globe,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  BarChart3,
  Video,
  Image,
  FileText,
  Bot
} from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { launchCampaignService } from '../services/launchCampaignService'
import { LAUNCH_CAMPAIGN_TEMPLATES, getCampaignTemplate } from '../lib/campaignTemplates'

interface Campaign {
  id: string
  name: string
  type: string
  status: 'draft' | 'active' | 'paused' | 'completed'
  channel: string
  audience: string
  content: string
  metrics: {
    reach: number
    engagement: number
    clicks: number
    conversions: number
  }
  schedule: {
    startDate: string
    endDate: string
    timezone: string
  }
}

interface ContentAsset {
  id: string
  type: 'email' | 'social' | 'ad' | 'video' | 'article'
  title: string
  status: 'generating' | 'ready' | 'published'
  language: string
  channels: string[]
}

export function LaunchCampaignManager() {
  const [campaigns, setCampaigns] = useKV('launch-campaigns', [])
  const [contentAssets, setContentAssets] = useKV('launch-content', [])
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null)

  const generateLaunchCampaign = async () => {
    setIsGenerating(true)
    
    try {
      // Use the campaign service to generate comprehensive campaign
      const result = await launchCampaignService.generateLaunchCampaign({
        channels: ['email', 'social', 'pr', 'content', 'ads'],
        languages: ['en', 'es', 'pt', 'he', 'ar'],
        targetAudience: 'global marketing professionals',
        budget: 25000,
        duration: 45
      })
      
      if (result.success) {
        setCampaigns(result.templates || [])
        
        // Generate additional content assets
        const emailContent = await launchCampaignService.createEmailSequence('en', 'marketing professionals')
        const socialCalendar = await launchCampaignService.createSocialCalendar(30, ['en', 'es', 'pt'])
        const pressRelease = await launchCampaignService.createPressRelease('en')
        
        const newAssets = [
          {
            id: 'email-sequence-en',
            type: 'email' as const,
            title: 'Launch Email Sequence (English)',
            status: 'ready' as const,
            language: 'en',
            channels: ['email'],
            content: JSON.stringify(emailContent)
          },
          {
            id: 'social-calendar-global',
            type: 'social' as const,
            title: 'Global Social Media Calendar',
            status: 'ready' as const,
            language: 'multi',
            channels: ['social'],
            content: JSON.stringify(socialCalendar)
          },
          {
            id: 'press-release-en',
            type: 'press' as const,
            title: 'Official Press Release',
            status: 'ready' as const,
            language: 'en',
            channels: ['pr'],
            content: pressRelease.content
          }
        ]
        
        setContentAssets(newAssets)
        toast.success('Complete launch campaign generated successfully!')
      }
    } catch (error) {
      console.error('Campaign generation error:', error)
      toast.error('Failed to generate campaign. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const generateLaunchContent = async () => {
    const prompt = spark.llmPrompt`
    Generate comprehensive launch content for NexusOne - Global Marketing Automation Platform.
    
    Create content for:
    1. Email announcement (English, Spanish, Portuguese, Hebrew, Arabic)
    2. Social media posts (LinkedIn, Twitter, Facebook, Instagram)
    3. Press release
    4. Product demo video script
    5. Blog article about AI marketing automation
    6. Ad copy for paid campaigns
    
    Focus on:
    - AI-powered marketing automation
    - Global multi-language support
    - All-in-one platform benefits
    - Competitive advantages
    - Call-to-action for beta signup
    
    Return structured content with titles, descriptions, and copy for each piece.
    `
    
    const content = await spark.llm(prompt, 'gpt-4o', true)
    const parsedContent = JSON.parse(content)
    
    // Transform to content assets format
    return Object.entries(parsedContent).map(([key, value]: [string, any], index) => ({
      id: `asset-${index}`,
      type: value.type || 'article',
      title: value.title || key,
      status: 'ready' as const,
      language: value.language || 'en',
      channels: value.channels || ['website'],
      content: value.content || value.copy || ''
    }))
  }

  const createAutomatedCampaigns = async (content: ContentAsset[]) => {
    return [
      {
        id: 'campaign-announcement',
        name: 'Global Launch Announcement',
        type: 'Multi-Channel',
        status: 'draft' as const,
        channel: 'Email + Social + PR',
        audience: 'All Subscribers + Press + Influencers',
        content: 'Comprehensive launch announcement',
        metrics: { reach: 0, engagement: 0, clicks: 0, conversions: 0 },
        schedule: {
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          timezone: 'UTC'
        }
      },
      {
        id: 'campaign-beta-signup',
        name: 'Beta Signup Drive',
        type: 'Conversion',
        status: 'draft' as const,
        channel: 'Paid Ads + Content Marketing',
        audience: 'Marketing Professionals + Entrepreneurs',
        content: 'Beta signup focused campaign',
        metrics: { reach: 0, engagement: 0, clicks: 0, conversions: 0 },
        schedule: {
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          timezone: 'UTC'
        }
      },
      {
        id: 'campaign-influencer',
        name: 'Influencer Outreach',
        type: 'Partnership',
        status: 'draft' as const,
        channel: 'Direct Outreach + Collaborations',
        audience: 'Marketing Influencers + Tech Leaders',
        content: 'Personalized influencer outreach',
        metrics: { reach: 0, engagement: 0, clicks: 0, conversions: 0 },
        schedule: {
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
          timezone: 'UTC'
        }
      },
      {
        id: 'campaign-content-series',
        name: 'Educational Content Series',
        type: 'Content Marketing',
        status: 'draft' as const,
        channel: 'Blog + YouTube + Webinars',
        audience: 'Marketing Professionals + Small Business Owners',
        content: 'Weekly educational content about AI marketing',
        metrics: { reach: 0, engagement: 0, clicks: 0, conversions: 0 },
        schedule: {
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          timezone: 'UTC'
        }
      }
    ]
  }

  const activateCampaign = async (campaignId: string) => {
    try {
      await launchCampaignService.activateCampaign(campaignId)
      
      const updatedCampaigns = campaigns.map((campaign: Campaign) =>
        campaign.id === campaignId
          ? { ...campaign, status: 'active' as const }
          : campaign
      )
      setCampaigns(updatedCampaigns)
      
      // Start automation workflows
      await launchCampaignService.startAutomationWorkflow(campaignId, [
        'social-autopilot',
        'email-nurture',
        'press-distribution'
      ])
      
      toast.success('Campaign activated and automation started!')
    } catch (error) {
      toast.error('Failed to activate campaign')
    }
  }

  const pauseCampaign = async (campaignId: string) => {
    const updatedCampaigns = campaigns.map((campaign: Campaign) =>
      campaign.id === campaignId
        ? { ...campaign, status: 'paused' as const }
        : campaign
    )
    setCampaigns(updatedCampaigns)
    toast.info('Campaign paused')
  }

  const generateAdditionalContent = async (type: string, language: string) => {
    setIsGenerating(true)
    
    try {
      const content = await launchCampaignService.generateChannelContent(type, language, {
        product: 'NexusOne',
        category: 'AI Marketing Automation Platform',
        benefits: ['Multi-language support', 'All-in-one platform', 'AI-powered content generation']
      })
      
      const newAsset: ContentAsset = {
        id: `asset-${Date.now()}`,
        type: type as any,
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} Content - ${language.toUpperCase()}`,
        status: 'ready',
        language,
        channels: type === 'email' ? ['email'] : ['social'],
        content: content.content
      }
      
      setContentAssets([...contentAssets, newAsset])
      toast.success(`${type} content generated in ${language}!`)
    } catch (error) {
      toast.error('Failed to generate content')
    } finally {
      setIsGenerating(false)
    }
  }

  const CampaignCard = ({ campaign }: { campaign: Campaign }) => (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" 
          onClick={() => setSelectedCampaign(campaign.id)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{campaign.name}</CardTitle>
        <Badge variant={
          campaign.status === 'active' ? 'default' :
          campaign.status === 'paused' ? 'secondary' :
          campaign.status === 'completed' ? 'outline' : 'destructive'
        }>
          {campaign.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground mb-2">
          {campaign.channel} • {campaign.type}
        </div>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">{campaign.metrics.reach.toLocaleString()}</div>
          <div className="flex space-x-1">
            {campaign.status === 'draft' && (
              <Button size="sm" onClick={(e) => {
                e.stopPropagation()
                activateCampaign(campaign.id)
              }}>
                <Play className="h-4 w-4" />
              </Button>
            )}
            {campaign.status === 'active' && (
              <Button size="sm" variant="outline" onClick={(e) => {
                e.stopPropagation()
                pauseCampaign(campaign.id)
              }}>
                <Pause className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="text-xs text-muted-foreground">Reach</div>
      </CardContent>
    </Card>
  )

  const ContentAssetCard = ({ asset }: { asset: ContentAsset }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{asset.title}</CardTitle>
        <Badge variant={
          asset.status === 'ready' ? 'default' :
          asset.status === 'generating' ? 'secondary' : 'outline'
        }>
          {asset.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-2">
          {asset.type === 'email' && <Mail className="h-4 w-4" />}
          {asset.type === 'social' && <Share2 className="h-4 w-4" />}
          {asset.type === 'ad' && <Target className="h-4 w-4" />}
          {asset.type === 'video' && <Video className="h-4 w-4" />}
          {asset.type === 'article' && <FileText className="h-4 w-4" />}
          <span>{asset.type}</span>
          <span>•</span>
          <span>{asset.language}</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Channels: {asset.channels.join(', ')}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Rocket className="h-8 w-8 text-primary" />
            Launch Campaign Manager
          </h1>
          <p className="text-muted-foreground">
            Automated marketing campaigns for NexusOne global launch
          </p>
        </div>
        <Button 
          onClick={generateLaunchCampaign}
          disabled={isGenerating}
          size="lg"
        >
          {isGenerating ? (
            <>
              <Bot className="h-5 w-5 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Rocket className="h-5 w-5 mr-2" />
              Generate Launch Campaign
            </>
          )}
        </Button>
      </div>

      {/* Campaign Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.filter((c: Campaign) => c.status === 'active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.reduce((acc: number, c: Campaign) => acc + c.metrics.reach, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Assets</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contentAssets.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Languages</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(contentAssets.map((a: ContentAsset) => a.language)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="content">Content Assets</TabsTrigger>
          <TabsTrigger value="automation">Automation Rules</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          {/* Campaign Template Selector */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Start Templates</CardTitle>
              <CardDescription>
                Choose a pre-built campaign template to get started quickly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {LAUNCH_CAMPAIGN_TEMPLATES.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{template.name}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{template.type}</Badge>
                        <Badge variant="secondary">{template.duration} days</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground mb-3">
                        {template.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-xs">
                          <div>Reach: {template.metrics.expectedReach.toLocaleString()}</div>
                          <div>ROI: {template.metrics.estimatedROI}%</div>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => {
                            // Use template to generate campaign
                            generateLaunchCampaign()
                          }}
                        >
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {campaigns.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Rocket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No campaigns yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Generate your first automated launch campaign to get started
                  </p>
                  <Button onClick={generateLaunchCampaign} disabled={isGenerating}>
                    {isGenerating ? 'Generating...' : 'Create Launch Campaign'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {campaigns.map((campaign: Campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Content Assets</h3>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateAdditionalContent('email', 'en')}
                disabled={isGenerating}
              >
                <Mail className="h-4 w-4 mr-2" />
                Generate Email
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateAdditionalContent('social', 'es')}
                disabled={isGenerating}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Generate Social
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateAdditionalContent('ad', 'pt')}
                disabled={isGenerating}
              >
                <Target className="h-4 w-4 mr-2" />
                Generate Ad
              </Button>
            </div>
          </div>

          {contentAssets.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No content assets yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Generate launch campaigns to create content assets automatically
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contentAssets.map((asset: ContentAsset) => (
                <ContentAssetCard key={asset.id} asset={asset} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automation Rules</CardTitle>
              <CardDescription>
                Configure automated triggers and actions for your launch campaigns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium">Auto-publish to social media</div>
                      <div className="text-sm text-muted-foreground">
                        Automatically post to LinkedIn, Twitter, Facebook every 6 hours
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium">Email sequence trigger</div>
                      <div className="text-sm text-muted-foreground">
                        Send welcome email when user signs up for beta
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    <div>
                      <div className="font-medium">Press release distribution</div>
                      <div className="text-sm text-muted-foreground">
                        Distribute to 500+ press outlets on launch day
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary">Scheduled</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-medium">Influencer outreach</div>
                      <div className="text-sm text-muted-foreground">
                        Send personalized messages to 100 marketing influencers
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary">Scheduled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Email Open Rate</span>
                      <span>24.5%</span>
                    </div>
                    <Progress value={24.5} className="mt-1" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Social Engagement</span>
                      <span>12.3%</span>
                    </div>
                    <Progress value={12.3} className="mt-1" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Click-through Rate</span>
                      <span>8.7%</span>
                    </div>
                    <Progress value={8.7} className="mt-1" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Conversion Rate</span>
                      <span>3.2%</span>
                    </div>
                    <Progress value={3.2} className="mt-1" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Geographic Reach</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">North America</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Europe</span>
                    <span className="text-sm font-medium">30%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Asia Pacific</span>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Latin America</span>
                    <span className="text-sm font-medium">8%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Other</span>
                    <span className="text-sm font-medium">2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}