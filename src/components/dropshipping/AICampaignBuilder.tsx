import React, { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Sparkles, 
  Eye, 
  Share, 
  Download,
  Play,
  Pause,
  Settings,
  Target,
  DollarSign,
  TrendingUp,
  Users,
  Globe,
  ShoppingCart,
  MessageCircle,
  Image as ImageIcon,
  Video,
  Copy,
  ExternalLink,
  CheckCircle,
  Clock,
  BarChart3
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { useLanguage } from '../../contexts/LanguageContext'

interface Campaign {
  id: string
  name: string
  productIds: string[]
  status: 'draft' | 'active' | 'paused' | 'completed'
  landingPage: {
    url: string
    title: string
    description: string
    images: string[]
    videos: string[]
    copywriting: string
    cta: string
  }
  facebookAd: {
    headline: string
    primaryText: string
    description: string
    image: string
    video?: string
    targetAudience: {
      ageRange: [number, number]
      interests: string[]
      locations: string[]
      gender: 'all' | 'male' | 'female'
    }
    budget: number
    duration: number
  }
  whatsappCheckout: {
    enabled: boolean
    message: string
    number: string
  }
  directCheckout: {
    enabled: boolean
    paymentMethods: string[]
  }
  analytics: {
    views: number
    clicks: number
    conversions: number
    revenue: number
    ctr: number
    cpc: number
    roas: number
  }
  createdAt: string
  updatedAt: string
}

interface GenerationStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  progress: number
}

export function AICampaignBuilder() {
  const [campaigns, setCampaigns] = useKV<Campaign[]>('ai-campaigns', [])
  const [selectedProducts] = useKV<string[]>('selected-products', [])
  const [currentCampaign, setCurrentCampaign] = useState<Campaign | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>([])
  const [activeTab, setActiveTab] = useState('overview')
  const { t } = useLanguage()

  const initializeGeneration = () => {
    const steps: GenerationStep[] = [
      {
        id: 'analysis',
        title: 'Product Analysis',
        description: 'Analyzing selected products and market trends',
        status: 'pending',
        progress: 0
      },
      {
        id: 'audience',
        title: 'Target Audience Research',
        description: 'Identifying optimal target demographics and interests',
        status: 'pending',
        progress: 0
      },
      {
        id: 'copywriting',
        title: 'AI Copywriting',
        description: 'Generating persuasive ad copy and landing page content',
        status: 'pending',
        progress: 0
      },
      {
        id: 'creative',
        title: 'Creative Assets',
        description: 'Creating images, videos and visual elements',
        status: 'pending',
        progress: 0
      },
      {
        id: 'landing',
        title: 'Landing Page',
        description: 'Building conversion-optimized landing page',
        status: 'pending',
        progress: 0
      },
      {
        id: 'facebook',
        title: 'Facebook Ad Campaign',
        description: 'Setting up Facebook ad with targeting and budget',
        status: 'pending',
        progress: 0
      },
      {
        id: 'checkout',
        title: 'Checkout Integration',
        description: 'Configuring WhatsApp and direct checkout options',
        status: 'pending',
        progress: 0
      },
      {
        id: 'deployment',
        title: 'Campaign Deployment',
        description: 'Finalizing and activating the complete campaign',
        status: 'pending',
        progress: 0
      }
    ]
    
    setGenerationSteps(steps)
  }

  const generateCampaign = async () => {
    if (selectedProducts.length === 0) {
      toast.error('No products selected for campaign generation')
      return
    }

    setIsGenerating(true)
    initializeGeneration()

    try {
      // Simulate step-by-step generation
      for (let i = 0; i < generationSteps.length; i++) {
        setGenerationSteps(prev => prev.map((step, index) => 
          index === i 
            ? { ...step, status: 'processing' as const }
            : step
        ))

        // Simulate processing time with progress updates
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100))
          setGenerationSteps(prev => prev.map((step, index) => 
            index === i 
              ? { ...step, progress }
              : step
          ))
        }

        setGenerationSteps(prev => prev.map((step, index) => 
          index === i 
            ? { ...step, status: 'completed' as const, progress: 100 }
            : step
        ))
      }

      // Create the campaign
      const newCampaign: Campaign = {
        id: Date.now().toString(),
        name: `AI Campaign ${new Date().toLocaleDateString()}`,
        productIds: selectedProducts,
        status: 'draft',
        landingPage: {
          url: `https://nexusone.ai/lp/${Date.now()}`,
          title: 'Premium Wireless Earbuds - Limited Time 50% Off!',
          description: 'Experience premium sound quality with our latest wireless earbuds featuring active noise cancellation and 48-hour battery life.',
          images: [
            'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800',
            'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800'
          ],
          videos: ['https://player.vimeo.com/video/example'],
          copywriting: `
# Revolutionary Sound, Unmatched Comfort

## 🎵 Why Choose Our Premium Earbuds?

✅ **Active Noise Cancellation** - Block out distractions
✅ **48-Hour Battery Life** - Never worry about charging
✅ **IPX7 Waterproof** - Perfect for workouts and rain
✅ **Premium Hi-Fi Sound** - Studio-quality audio
✅ **Comfortable Fit** - Designed for all-day wear

### ⚡ Limited Time Offer: 50% OFF
**Was $59.99 → Now $29.99**

*Free worldwide shipping • 30-day money-back guarantee*

---

**🌟 Over 15,000 Happy Customers**
*"Best earbuds I've ever owned!" - Sarah M.*
*"Amazing sound quality for the price" - John D.*

### Order Now and Save $30!
`,
          cta: 'Order Now - 50% OFF'
        },
        facebookAd: {
          headline: '🎵 Premium Wireless Earbuds - 50% OFF Today Only!',
          primaryText: 'Experience studio-quality sound with active noise cancellation and 48-hour battery life. Over 15,000 satisfied customers worldwide. Limited time offer - was $59.99, now just $29.99 with FREE shipping!',
          description: 'Premium wireless earbuds with noise cancellation, waterproof design, and incredible battery life. Perfect for music lovers, athletes, and professionals.',
          image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1200',
          video: 'https://example.com/earbud-demo-video.mp4',
          targetAudience: {
            ageRange: [18, 45],
            interests: [
              'Wireless technology',
              'Music',
              'Fitness and wellness',
              'Consumer electronics',
              'Audio equipment',
              'Technology',
              'Gadgets'
            ],
            locations: ['United States', 'Canada', 'United Kingdom', 'Australia'],
            gender: 'all'
          },
          budget: 100,
          duration: 7
        },
        whatsappCheckout: {
          enabled: true,
          message: 'Hi! I\'m interested in the Premium Wireless Earbuds at 50% off. Can you help me complete my order?',
          number: '+1234567890'
        },
        directCheckout: {
          enabled: true,
          paymentMethods: ['Credit Card', 'PayPal', 'Apple Pay', 'Google Pay']
        },
        analytics: {
          views: 0,
          clicks: 0,
          conversions: 0,
          revenue: 0,
          ctr: 0,
          cpc: 0,
          roas: 0
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      setCampaigns(prev => [newCampaign, ...prev])
      setCurrentCampaign(newCampaign)
      
      toast.success('AI Campaign generated successfully!')
      
    } catch (error) {
      toast.error('Failed to generate campaign')
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }

  const launchCampaign = async (campaignId: string) => {
    try {
      setCampaigns(prev => prev.map(c => 
        c.id === campaignId 
          ? { ...c, status: 'active' as const, updatedAt: new Date().toISOString() }
          : c
      ))
      
      if (currentCampaign?.id === campaignId) {
        setCurrentCampaign(prev => prev ? { ...prev, status: 'active' } : null)
      }
      
      toast.success('Campaign launched successfully!')
    } catch (error) {
      toast.error('Failed to launch campaign')
    }
  }

  const pauseCampaign = async (campaignId: string) => {
    try {
      setCampaigns(prev => prev.map(c => 
        c.id === campaignId 
          ? { ...c, status: 'paused' as const, updatedAt: new Date().toISOString() }
          : c
      ))
      
      if (currentCampaign?.id === campaignId) {
        setCurrentCampaign(prev => prev ? { ...prev, status: 'paused' } : null)
      }
      
      toast.success('Campaign paused')
    } catch (error) {
      toast.error('Failed to pause campaign')
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Campaign Builder</h1>
          <p className="text-gray-600 mt-1">Generate complete marketing campaigns with landing pages, ads & checkout</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="px-3 py-1">
            <Target className="w-4 h-4 mr-1" />
            {selectedProducts.length} Products
          </Badge>
          
          <Button 
            onClick={generateCampaign}
            disabled={isGenerating || selectedProducts.length === 0}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate AI Campaign'}
          </Button>
        </div>
      </div>

      {/* Generation Progress */}
      {isGenerating && (
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-900">
              <Sparkles className="w-5 h-5" />
              Generating Your AI Campaign
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {generationSteps.map((step, index) => (
              <div key={step.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.status === 'completed' ? 'bg-green-500 text-white' :
                      step.status === 'processing' ? 'bg-purple-500 text-white' :
                      step.status === 'error' ? 'bg-red-500 text-white' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {step.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : step.status === 'processing' ? (
                        <Sparkles className="w-5 h-5 animate-spin" />
                      ) : step.status === 'error' ? (
                        '✕'
                      ) : (
                        index + 1
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{step.title}</h4>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {step.progress}%
                  </div>
                </div>
                <Progress value={step.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Campaign Results */}
      {currentCampaign && !isGenerating && (
        <div className="space-y-6">
          {/* Campaign Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    {currentCampaign.name}
                  </CardTitle>
                  <p className="text-gray-600 mt-1">
                    Complete AI-generated campaign ready to launch
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={
                      currentCampaign.status === 'active' ? 'default' :
                      currentCampaign.status === 'paused' ? 'secondary' :
                      'outline'
                    }
                  >
                    {currentCampaign.status}
                  </Badge>
                  
                  {currentCampaign.status === 'draft' && (
                    <Button onClick={() => launchCampaign(currentCampaign.id)}>
                      <Play className="w-4 h-4 mr-2" />
                      Launch Campaign
                    </Button>
                  )}
                  
                  {currentCampaign.status === 'active' && (
                    <Button variant="outline" onClick={() => pauseCampaign(currentCampaign.id)}>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Campaign Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="landing">Landing Page</TabsTrigger>
              <TabsTrigger value="facebook">Facebook Ad</TabsTrigger>
              <TabsTrigger value="checkout">Checkout</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Eye className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Views</p>
                        <p className="text-xl font-bold">{currentCampaign.analytics.views.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">CTR</p>
                        <p className="text-xl font-bold">{currentCampaign.analytics.ctr}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <ShoppingCart className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Conversions</p>
                        <p className="text-xl font-bold">{currentCampaign.analytics.conversions}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-100 p-2 rounded-lg">
                        <DollarSign className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Revenue</p>
                        <p className="text-xl font-bold">${currentCampaign.analytics.revenue}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Campaign Components</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Landing Page</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Facebook Ad Campaign</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium">WhatsApp Checkout</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Test
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Direct Checkout</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Configure
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Share className="w-4 h-4 mr-2" />
                      Share Campaign
                    </Button>
                    
                    <Button className="w-full justify-start" variant="outline">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Landing Page URL
                    </Button>
                    
                    <Button className="w-full justify-start" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export Campaign Data
                    </Button>
                    
                    <Button className="w-full justify-start" variant="outline">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Detailed Analytics
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="landing" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>AI-Generated Landing Page</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Open
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Landing Page URL</label>
                    <div className="flex items-center gap-2">
                      <Input value={currentCampaign.landingPage.url} readOnly />
                      <Button variant="outline" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Page Title</label>
                    <Input value={currentCampaign.landingPage.title} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Meta Description</label>
                    <Textarea value={currentCampaign.landingPage.description} rows={3} />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">AI-Generated Copy</label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700">
                        {currentCampaign.landingPage.copywriting}
                      </pre>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Product Images</label>
                      <div className="grid grid-cols-2 gap-2">
                        {currentCampaign.landingPage.images.map((image, index) => (
                          <img 
                            key={index}
                            src={image} 
                            alt={`Product ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Call to Action</label>
                      <Input value={currentCampaign.landingPage.cta} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="facebook" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Facebook Ad Campaign</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Headline</label>
                        <Input value={currentCampaign.facebookAd.headline} />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Primary Text</label>
                        <Textarea value={currentCampaign.facebookAd.primaryText} rows={4} />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <Textarea value={currentCampaign.facebookAd.description} rows={3} />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Ad Creative</label>
                        <img 
                          src={currentCampaign.facebookAd.image} 
                          alt="Ad Creative"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Budget</label>
                          <Input value={`$${currentCampaign.facebookAd.budget}`} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Duration</label>
                          <Input value={`${currentCampaign.facebookAd.duration} days`} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Target Audience</label>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">Age Range:</span>
                        <Badge variant="outline">
                          {currentCampaign.facebookAd.targetAudience.ageRange[0]} - {currentCampaign.facebookAd.targetAudience.ageRange[1]} years
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">Gender:</span>
                        <Badge variant="outline">
                          {currentCampaign.facebookAd.targetAudience.gender}
                        </Badge>
                      </div>

                      <div>
                        <span className="text-sm text-gray-600 block mb-2">Interests:</span>
                        <div className="flex flex-wrap gap-1">
                          {currentCampaign.facebookAd.targetAudience.interests.map((interest, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-sm text-gray-600 block mb-2">Locations:</span>
                        <div className="flex flex-wrap gap-1">
                          {currentCampaign.facebookAd.targetAudience.locations.map((location, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {location}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="checkout" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-green-600" />
                      WhatsApp Checkout
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status</span>
                      <Badge variant={currentCampaign.whatsappCheckout.enabled ? 'default' : 'secondary'}>
                        {currentCampaign.whatsappCheckout.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">WhatsApp Number</label>
                      <Input value={currentCampaign.whatsappCheckout.number} />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Auto Message</label>
                      <Textarea value={currentCampaign.whatsappCheckout.message} rows={3} />
                    </div>

                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Test WhatsApp Integration
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5 text-blue-600" />
                      Direct Checkout
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status</span>
                      <Badge variant={currentCampaign.directCheckout.enabled ? 'default' : 'secondary'}>
                        {currentCampaign.directCheckout.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Payment Methods</label>
                      <div className="space-y-2">
                        {currentCampaign.directCheckout.paymentMethods.map((method, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm">{method}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      Configure Payment Gateway
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Coming Soon</h3>
                    <p className="text-gray-500">Launch your campaign to start tracking performance metrics</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Empty State */}
      {!currentCampaign && !isGenerating && (
        <Card>
          <CardContent className="text-center py-12">
            <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Campaign Generated</h3>
            <p className="text-gray-500 mb-4">
              Select products from the marketplace and generate your first AI campaign
            </p>
            <Button 
              onClick={generateCampaign}
              disabled={selectedProducts.length === 0}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate AI Campaign
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}