import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useCredits } from '@/contexts/CreditContext'
import { 
  Robot, 
  Lightning, 
  Sparkles, 
  MagicWand,
  Target,
  TrendingUp,
  Globe,
  Video,
  WhatsappLogo,
  CheckCircle,
  Play,
  Pause,
  Download
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface CampaignStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'processing' | 'completed'
  result?: string
}

export const CampaignGenerator: React.FC = () => {
  const { credits, useCredits, getCreditCost } = useCredits()
  const [isGenerating, setIsGenerating] = useState(false)
  const [campaignData, setCampaignData] = useState({
    productUrl: '',
    businessType: '',
    targetAudience: '',
    budget: '',
    goals: ''
  })
  const [generationProgress, setGenerationProgress] = useState(0)
  const [campaignSteps, setCampaignSteps] = useState<CampaignStep[]>([])
  const [generatedCampaign, setGeneratedCampaign] = useState<any>(null)

  const campaignTypes = [
    {
      title: 'Product Launch',
      description: 'Complete funnel for new product introduction',
      icon: <Sparkles className="h-5 w-5" />,
      credits: 100
    },
    {
      title: 'Lead Generation',
      description: 'Capture and nurture potential customers',
      icon: <Target className="h-5 w-5" />,
      credits: 80
    },
    {
      title: 'Sales Boost',
      description: 'Increase sales for existing products',
      icon: <TrendingUp className="h-5 w-5" />,
      credits: 90
    },
    {
      title: 'Brand Awareness',
      description: 'Build recognition and trust',
      icon: <Globe className="h-5 w-5" />,
      credits: 70
    }
  ]

  const generateCampaign = async () => {
    const cost = getCreditCost('campaign-generation')
    
    if (!useCredits(cost)) {
      toast.error('Insufficient credits. Please upgrade your plan.')
      return
    }

    setIsGenerating(true)
    setGenerationProgress(0)
    
    const steps: CampaignStep[] = [
      {
        id: 'analyze',
        title: 'Product Analysis',
        description: 'Analyzing product and market potential',
        status: 'processing'
      },
      {
        id: 'audience',
        title: 'Audience Research',
        description: 'Identifying target demographics',
        status: 'pending'
      },
      {
        id: 'copy',
        title: 'Copy Generation',
        description: 'Creating persuasive sales copy',
        status: 'pending'
      },
      {
        id: 'visuals',
        title: 'Visual Assets',
        description: 'Generating images and videos',
        status: 'pending'
      },
      {
        id: 'landing',
        title: 'Landing Page',
        description: 'Building conversion-optimized page',
        status: 'pending'
      },
      {
        id: 'ads',
        title: 'Ad Campaigns',
        description: 'Creating Facebook/Google ads',
        status: 'pending'
      },
      {
        id: 'whatsapp',
        title: 'WhatsApp Bot',
        description: 'Setting up sales conversations',
        status: 'pending'
      }
    ]

    setCampaignSteps(steps)

    // Simulate AI generation process
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setCampaignSteps(prev => prev.map((step, index) => {
        if (index === i) {
          return { ...step, status: 'completed', result: 'Generated successfully' }
        } else if (index === i + 1) {
          return { ...step, status: 'processing' }
        }
        return step
      }))
      
      setGenerationProgress(((i + 1) / steps.length) * 100)
    }

    // Generate campaign results
    const campaign = {
      title: `AI Campaign for ${campaignData.businessType}`,
      landingPage: {
        url: 'https://nexusone.ai/campaigns/generated-123',
        conversionRate: '15.2%',
        visitors: '0'
      },
      ads: {
        facebook: {
          reach: '25,000',
          ctr: '3.2%',
          cpc: '$0.45'
        },
        google: {
          impressions: '12,000',
          ctr: '2.8%',
          cpc: '$0.67'
        }
      },
      whatsapp: {
        messages: '150',
        responses: '89',
        conversions: '23'
      },
      roi: '320%',
      estimatedRevenue: '$4,250'
    }

    setGeneratedCampaign(campaign)
    setIsGenerating(false)
    toast.success('Campaign generated successfully!')
  }

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'processing':
        return <Lightning className="h-5 w-5 text-blue-500 animate-pulse" />
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
            <Robot className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">AI Campaign Generator</h1>
        <p className="text-lg text-muted-foreground">
          Create complete marketing campaigns in under 5 minutes with AI
        </p>
        <Badge variant="secondary" className="mt-2">
          {credits} Credits Available
        </Badge>
      </div>

      {!isGenerating && !generatedCampaign ? (
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Campaign Types */}
          <Card>
            <CardHeader>
              <CardTitle>Choose Campaign Type</CardTitle>
              <CardDescription>Select the type of campaign that best fits your goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {campaignTypes.map((type, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary/50">
                    <CardContent className="p-4 text-center">
                      <div className="flex justify-center mb-3">
                        <div className="p-3 bg-primary/10 rounded-full text-primary">
                          {type.icon}
                        </div>
                      </div>
                      <h3 className="font-semibold mb-2">{type.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{type.description}</p>
                      <Badge variant="outline">{type.credits} Credits</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Campaign Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MagicWand className="h-5 w-5" />
                Campaign Configuration
              </CardTitle>
              <CardDescription>
                Provide details about your product and goals for better AI generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="product-url">Product/Service URL (Optional)</Label>
                  <Input
                    id="product-url"
                    placeholder="https://example.com/product"
                    value={campaignData.productUrl}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, productUrl: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="business-type">Business/Product Type</Label>
                  <Input
                    id="business-type"
                    placeholder="e.g., Fitness supplements, Online course, SaaS tool"
                    value={campaignData.businessType}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, businessType: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="target-audience">Target Audience</Label>
                <Input
                  id="target-audience"
                  placeholder="e.g., Fitness enthusiasts aged 25-40, Small business owners"
                  value={campaignData.targetAudience}
                  onChange={(e) => setCampaignData(prev => ({ ...prev, targetAudience: e.target.value }))}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="budget">Marketing Budget (USD)</Label>
                  <Input
                    id="budget"
                    placeholder="e.g., $500, $1000, $5000"
                    value={campaignData.budget}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, budget: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="goals">Primary Goals</Label>
                  <Input
                    id="goals"
                    placeholder="e.g., Generate leads, Increase sales, Build awareness"
                    value={campaignData.goals}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, goals: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="additional-info">Additional Information</Label>
                <Textarea
                  id="additional-info"
                  placeholder="Describe your product benefits, unique selling points, or any specific requirements..."
                  className="min-h-[100px]"
                />
              </div>

              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90"
                onClick={generateCampaign}
                disabled={!campaignData.businessType || !campaignData.targetAudience}
              >
                <Lightning className="h-5 w-5 mr-2" />
                Generate AI Campaign (100 Credits)
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : isGenerating ? (
        /* Generation Progress */
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Robot className="h-6 w-6 animate-pulse" />
                AI is Creating Your Campaign
              </CardTitle>
              <CardDescription>
                This may take a few minutes. Please don't close this page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Generation Progress</span>
                  <span>{Math.round(generationProgress)}%</span>
                </div>
                <Progress value={generationProgress} className="h-3" />
              </div>

              <div className="space-y-4">
                {campaignSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-4 p-4 rounded-lg border">
                    {getStepIcon(step.status)}
                    <div className="flex-1">
                      <h3 className="font-medium">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                      {step.result && (
                        <p className="text-sm text-green-600 mt-1">{step.result}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Generated Campaign Results */
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">🎉 Campaign Generated Successfully!</h2>
            <p className="text-muted-foreground">Your complete marketing campaign is ready to launch</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Campaign Overview */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Campaign Overview</CardTitle>
                <CardDescription>{generatedCampaign?.title}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Landing Page */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Landing Page
                    </h3>
                    <Badge variant="secondary">Ready</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    High-converting sales page optimized for your product
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Play className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button size="sm">
                      Launch Page
                    </Button>
                  </div>
                </div>

                {/* Video Content */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Marketing Videos
                    </h3>
                    <Badge variant="secondary">3 Videos</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Professional videos for social media and ads
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Play className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>

                {/* WhatsApp Bot */}
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      <WhatsappLogo className="h-4 w-4" />
                      WhatsApp Sales Bot
                    </h3>
                    <Badge variant="secondary">Configured</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Intelligent bot ready to convert leads into sales
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Test Bot
                    </Button>
                    <Button size="sm">
                      Activate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Predictions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Predictions</CardTitle>
                  <CardDescription>AI-powered projections</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Estimated ROI</span>
                    <span className="font-semibold text-green-600">320%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Conversion Rate</span>
                    <span className="font-semibold">15.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Monthly Revenue</span>
                    <span className="font-semibold">$4,250</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Lead Quality</span>
                    <span className="font-semibold text-blue-600">High</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Next Steps</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" size="sm">
                    1. Launch Landing Page
                  </Button>
                  <Button className="w-full" variant="outline" size="sm">
                    2. Start Ad Campaigns
                  </Button>
                  <Button className="w-full" variant="outline" size="sm">
                    3. Activate WhatsApp Bot
                  </Button>
                  <Button className="w-full" variant="outline" size="sm">
                    4. Monitor Performance
                  </Button>
                </CardContent>
              </Card>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setGeneratedCampaign(null)
                  setCampaignSteps([])
                  setGenerationProgress(0)
                  setCampaignData({
                    productUrl: '',
                    businessType: '',
                    targetAudience: '',
                    budget: '',
                    goals: ''
                  })
                }}
              >
                Generate New Campaign
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}