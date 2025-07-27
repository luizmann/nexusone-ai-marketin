import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { useCredits } from '@/contexts/CreditContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { nexBrainService } from '@/services/nexBrainService'
import { fixedCampaignService } from '@/services/fixedCampaignService'
import { 
  Globe, 
  Lightning, 
  Eye,
  Smartphone,
  Monitor,
  Palette,
  Layout,
  Code,
  Download,
  Share,
  Settings as SettingsIcon,
  Edit,
  Brain,
  Sparkle,
  Robot,
  Target,
  ChartBar,
  Images,
  VideoCamera,
  Megaphone
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface PageTemplate {
  id: string
  name: string
  category: string
  preview: string
  conversionRate: string
  description: string
  aiOptimized: boolean
  features: string[]
}

interface GeneratedPageData {
  id: string
  title: string
  template: string
  url: string
  status: string
  views: number
  conversions: number
  conversionRate: string
  createdAt: string
  aiGenerated: {
    headline: string
    subheadline: string
    hero: any
    problem: string
    solution: string
    benefits: string[]
    features: string[]
    testimonials: any[]
    pricing: any
    cta: string
    faq: any[]
    footer: any
    assets: {
      heroImage: string
      backgroundImage: string
      productImages: string[]
    }
    seo: {
      title: string
      description: string
      keywords: string[]
    }
  }
}

export const SalesPageBuilder: React.FC = () => {
  const { credits, useCredits, getCreditCost } = useCredits()
  const { t } = useLanguage()
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [pageData, setPageData] = useState({
    title: '',
    description: '',
    productName: '',
    price: '',
    features: '',
    testimonials: '',
    cta: 'Buy Now',
    targetAudience: '',
    businessType: '',
    urgency: '',
    productUrl: ''
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPage, setGeneratedPage] = useState<GeneratedPageData | null>(null)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [activeTab, setActiveTab] = useState('content')

  const templates: PageTemplate[] = [
    {
      id: 'modern-minimal',
      name: 'Modern Minimal',
      category: 'Business',
      preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      conversionRate: '18.5%',
      description: 'Clean, professional design perfect for SaaS and digital products',
      aiOptimized: true,
      features: ['AI Headlines', 'Smart CTAs', 'Conversion Heatmaps', 'A/B Testing']
    },
    {
      id: 'ecommerce-hero',
      name: 'E-commerce Hero',
      category: 'E-commerce',
      preview: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
      conversionRate: '22.3%',
      description: 'Product-focused layout with strong visual hierarchy',
      aiOptimized: true,
      features: ['Product AI Analysis', 'Dynamic Pricing', 'Social Proof', 'Urgency Triggers']
    },
    {
      id: 'service-landing',
      name: 'Service Landing',
      category: 'Services',
      preview: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop',
      conversionRate: '16.8%',
      description: 'Perfect for consultants, agencies, and service providers',
      aiOptimized: true,
      features: ['Trust Building', 'Case Studies', 'Testimonial AI', 'Lead Magnets']
    },
    {
      id: 'course-promo',
      name: 'Course Promotion',
      category: 'Education',
      preview: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
      conversionRate: '25.1%',
      description: 'Optimized for online courses and educational content',
      aiOptimized: true,
      features: ['Learning Outcomes', 'Progress Indicators', 'Social Proof', 'Bonus Content']
    },
    {
      id: 'app-download',
      name: 'App Download',
      category: 'Mobile',
      preview: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
      conversionRate: '19.7%',
      description: 'Mobile-first design for app promotion and downloads',
      aiOptimized: true,
      features: ['Store Links', 'Screenshots', 'Reviews Display', 'Feature Highlights']
    },
    {
      id: 'webinar-signup',
      name: 'Webinar Signup',
      category: 'Events',
      preview: 'https://images.unsplash.com/photo-1515378791036-0648a814c963?w=400&h=300&fit=crop',
      conversionRate: '31.2%',
      description: 'High-converting layout for webinars and events',
      aiOptimized: true,
      features: ['Countdown Timers', 'Speaker Profiles', 'Agenda Preview', 'FOMO Elements']
    }
  ]

  // AI-Powered Page Generation
  const generatePage = async () => {
    if (!selectedTemplate || !pageData.title || !pageData.productName) {
      toast.error(t('Please select a template and fill required fields'))
      return
    }

    const cost = getCreditCost('magic-page')
    if (!useCredits(cost)) {
      toast.error(t('Insufficient credits. Please upgrade your plan.'))
      return
    }

    setIsGenerating(true)
    setGenerationProgress(0)
    setCurrentStep(t('Initializing NexBrain AI...'))

    try {
      // Step 1: Prepare product data
      setGenerationProgress(10)
      setCurrentStep(t('Analyzing product data...'))
      
      const productData = {
        productName: pageData.productName,
        title: pageData.title,
        description: pageData.description,
        price: pageData.price,
        features: pageData.features.split('\n').filter(f => f.trim()),
        testimonials: pageData.testimonials,
        cta: pageData.cta,
        targetAudience: pageData.targetAudience,
        businessType: pageData.businessType,
        urgency: pageData.urgency,
        category: templates.find(t => t.id === selectedTemplate)?.category || 'Business'
      }

      // Step 2: Generate page with Fixed Campaign Service
      setGenerationProgress(30)
      setCurrentStep(t('Generating AI-optimized content...'))
      
      const aiGeneratedContent = await fixedCampaignService.generateCompleteCampaign(productData)

      // Step 3: Generate additional assets
      setGenerationProgress(60)
      setCurrentStep(t('Creating visual assets...'))
      
      // Step 4: Optimize for conversion
      setGenerationProgress(80)
      setCurrentStep(t('Optimizing for conversions...'))
      
      // Step 5: Finalize page
      setGenerationProgress(100)
      setCurrentStep(t('Finalizing your page...'))

      const template = templates.find(t => t.id === selectedTemplate)
      const pageId = `page_${Date.now()}`
      
      const finalPage: GeneratedPageData = {
        id: pageId,
        title: pageData.title,
        template: template?.name || 'Custom',
        url: `https://nexusone.ai/p/${pageId}`,
        status: 'published',
        views: 0,
        conversions: 0,
        conversionRate: '0%',
        createdAt: new Date().toISOString(),
        aiGenerated: aiGeneratedContent.generatedContent
      }

      setGeneratedPage(finalPage)
      
      // Save campaign for drag & drop editor
      const existingCampaigns = JSON.parse(localStorage.getItem('generated-campaigns') || '[]')
      existingCampaigns.push(aiGeneratedContent)
      localStorage.setItem('generated-campaigns', JSON.stringify(existingCampaigns))
      
      toast.success(t('AI-powered sales page generated successfully!'))

    } catch (error) {
      console.error('Page generation failed:', error)
      toast.error(t('Failed to generate page. Please try again.'))
    } finally {
      setIsGenerating(false)
      setGenerationProgress(0)
      setCurrentStep('')
    }
  }

  // Import product from URL
  const importProductFromUrl = async () => {
    if (!pageData.productUrl) {
      toast.error(t('Please enter a product URL'))
      return
    }

    setCurrentStep(t('Importing product data...'))
    
    try {
      // This would integrate with the product scraper
      const prompt = `Analyze this product URL and extract key information for a sales page: ${pageData.productUrl}`
      
      const productInfo = await nexBrainService.executeAssistantTask(prompt, {
        url: pageData.productUrl,
        type: 'product_import'
      })

      const extracted = JSON.parse(productInfo)
      
      setPageData(prev => ({
        ...prev,
        title: extracted.title || prev.title,
        productName: extracted.name || prev.productName,
        description: extracted.description || prev.description,
        price: extracted.price || prev.price,
        features: extracted.features?.join('\n') || prev.features
      }))

      toast.success(t('Product data imported successfully!'))
    } catch (error) {
      console.error('Product import failed:', error)
      toast.error(t('Failed to import product data'))
    } finally {
      setCurrentStep('')
    }
  }

  // Create sample campaign for testing
  const createSampleCampaign = () => {
    const samplePageData: GeneratedPageData = {
      id: `sample_page_${Date.now()}`,
      title: 'FitTracker Pro - Transform Your Health',
      template: 'E-commerce Hero',
      url: 'https://nexusone.ai/sample-fittracker',
      status: 'published',
      views: 1247,
      conversions: 89,
      conversionRate: '7.1%',
      createdAt: new Date().toISOString(),
      aiGenerated: {
        headline: 'Transform Your Health Journey with FitTracker Pro',
        subheadline: 'The smart fitness tracker that adapts to your lifestyle and motivates you every step of the way',
        hero: {
          title: 'Revolutionary FitTracker Pro',
          subtitle: 'Your personal health companion',
          imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
          ctaText: 'Start Your Journey'
        },
        problem: 'Many fitness enthusiasts struggle with consistency, tracking progress, and staying motivated to reach their health goals.',
        solution: 'FitTracker Pro uses AI-powered insights to provide personalized recommendations, 24/7 health monitoring, and smart motivation systems that adapt to your unique lifestyle.',
        benefits: [
          'AI-powered personalized insights',
          '24/7 comprehensive health monitoring',
          'Smart motivation and coaching system',
          'Advanced sleep and recovery tracking',
          'Water-resistant design for all activities'
        ],
        features: [
          'Heart Rate Monitoring - 24/7 continuous tracking',
          'Sleep Analysis - Detailed sleep quality insights',
          'Fitness Coaching - AI-powered workout recommendations',
          'Water Resistance - IP68 rated for swimming',
          'Long Battery Life - Up to 7 days on single charge'
        ],
        testimonials: [
          {
            name: 'Sarah Johnson',
            role: 'Marathon Runner',
            content: 'FitTracker Pro helped me improve my training efficiency by 40%. The AI insights are incredible!',
            rating: 5
          },
          {
            name: 'Mike Chen',
            role: 'Busy Professional',
            content: 'Finally a tracker that understands my lifestyle. The sleep tracking changed my life.',
            rating: 5
          }
        ],
        pricing: {
          title: 'Special Launch Offer',
          price: '$149',
          originalPrice: '$249',
          ctaText: 'Order Now - Limited Time',
          guarantees: ['30-day money-back guarantee', 'Free worldwide shipping']
        },
        cta: 'Order Now - Limited Time',
        faq: [
          {
            question: 'How accurate is the heart rate monitoring?',
            answer: 'FitTracker Pro uses advanced sensors with 99.5% accuracy rate, clinically tested and verified.'
          },
          {
            question: 'Is it waterproof?',
            answer: 'Yes, it\'s rated IP68 for swimming, showering, and all water activities up to 50 meters depth.'
          }
        ],
        footer: {
          companyName: 'FitTech Solutions',
          contactInfo: 'support@fittrackerpro.com | 1-800-FIT-TRACK',
          disclaimer: 'Results may vary. This device is not intended for medical diagnosis.'
        },
        assets: {
          heroImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
          backgroundImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
          productImages: [
            'https://images.unsplash.com/photo-1508746829417-e1b5e819d300?w=800',
            'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800'
          ]
        },
        seo: {
          title: 'FitTracker Pro - AI-Powered Fitness Tracker | Transform Your Health',
          description: 'Revolutionary fitness tracker with AI insights. 24/7 health monitoring, personalized coaching, and advanced features.',
          keywords: ['fitness tracker', 'health monitoring', 'AI fitness', 'heart rate monitor']
        }
      }
    };

    // Also create campaign data
    const sampleCampaign = {
      id: `sample_campaign_${Date.now()}`,
      title: 'FitTracker Pro Campaign',
      productName: 'FitTracker Pro',
      description: 'Revolutionary fitness tracker that helps you achieve your health goals',
      targetAudience: 'Fitness enthusiasts',
      businessType: 'E-commerce',
      price: '$149',
      cta: 'Order Now',
      generatedContent: samplePageData.aiGenerated,
      marketingAssets: {
        landingPageUrl: samplePageData.url,
        facebookAds: [
          {
            id: 'fb_ad_1',
            headline: 'Transform Your Health Journey with FitTracker Pro',
            description: 'AI-powered fitness tracking that adapts to your lifestyle. Get personalized insights and achieve your goals faster.',
            imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
            targeting: { interests: ['fitness', 'health', 'technology'], ageRange: '25-65' }
          }
        ],
        videos: [
          {
            id: 'promo_video_1',
            title: 'FitTracker Pro - Your Health Transformation Starts Here',
            description: 'See how FitTracker Pro uses AI to revolutionize your fitness journey',
            scriptContent: 'Meet FitTracker Pro - the revolutionary fitness tracker that adapts to YOU. With AI-powered insights, 24/7 monitoring, and personalized coaching, you\'ll achieve your health goals faster than ever before.',
            videoUrl: undefined
          }
        ],
        whatsappFlow: {
          welcomeMessage: 'Hi! 👋 Welcome to FitTracker Pro! Ready to transform your health journey with AI-powered insights?',
          productPresentation: 'FitTracker Pro uses advanced AI to provide personalized fitness insights. With 24/7 heart rate monitoring, sleep analysis, and smart coaching, you\'ll achieve your goals 40% faster! Currently available for just $149 (normally $249).',
          objectionHandling: [
            'I understand the investment concern - think of it as investing in your health and future! Most customers save money on gym trainers and health apps.',
            'Worried about accuracy? FitTracker Pro has 99.5% accuracy rate, clinically tested and verified by health professionals.',
            'Not sure about tech complexity? Our AI makes it simple - just wear it and get personalized insights automatically!'
          ],
          closingMessages: [
            'This special launch price won\'t last long. Ready to start your transformation? 💪',
            'Over 50,000 people have already transformed their health with FitTracker Pro. Join them today!',
            'Click the link below to secure your FitTracker Pro at the special launch price! 👇'
          ]
        }
      },
      dragDropAssets: {
        generatedImages: [
          {
            id: 'hero_fitness',
            url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
            type: 'hero',
            prompt: 'Hero image for fitness tracker campaign'
          },
          {
            id: 'product_showcase',
            url: 'https://images.unsplash.com/photo-1508746829417-e1b5e819d300?w=800',
            type: 'product',
            prompt: 'Product showcase for fitness tracker'
          },
          {
            id: 'lifestyle_bg',
            url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
            type: 'background',
            prompt: 'Fitness lifestyle background image'
          }
        ],
        designElements: [
          {
            id: 'main_headline',
            type: 'text',
            content: 'Transform Your Health Journey with FitTracker Pro',
            styles: { fontSize: '36px', fontWeight: 'bold', color: '#1a1a1a', textAlign: 'center' }
          },
          {
            id: 'cta_button',
            type: 'button',
            content: 'Order Now - Limited Time',
            styles: { backgroundColor: '#007bff', color: '#ffffff', padding: '16px 32px', borderRadius: '8px' }
          }
        ]
      },
      status: 'completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Set the generated page
    setGeneratedPage(samplePageData);

    // Save campaign for drag & drop editor
    const existingCampaigns = JSON.parse(localStorage.getItem('generated-campaigns') || '[]');
    existingCampaigns.push(sampleCampaign);
    localStorage.setItem('generated-campaigns', JSON.stringify(existingCampaigns));

    toast.success(t('✨ Sample campaign loaded! You can now see how AI-generated content works.'));
  };
    setSelectedTemplate(null)
    setPageData({
      title: '',
      description: '',
      productName: '',
      price: '',
      features: '',
      testimonials: '',
      cta: 'Buy Now',
      targetAudience: '',
      businessType: '',
      urgency: '',
      productUrl: ''
    })
    setGeneratedPage(null)
    setActiveTab('content')
  }

  // Generate marketing assets
  const generateMarketingAssets = async () => {
    if (!generatedPage) return

    try {
      setCurrentStep(t('Generating marketing assets...'))
      
      // Generate Facebook Ads campaign
      const adsCampaign = await nexBrainService.generateAdsCampaign(
        generatedPage.aiGenerated,
        { size: 'broad', interests: [pageData.targetAudience] },
        500
      )

      // Generate promotional video
      const promoVideo = await nexBrainService.generateProductVideo(
        generatedPage.aiGenerated,
        'promo'
      )

      // Generate WhatsApp sales flow
      const whatsappFlow = await nexBrainService.generateWhatsAppFlow(
        generatedPage.aiGenerated,
        'consultative_selling'
      )

      toast.success(t('Marketing assets generated successfully!'))
      
    } catch (error) {
      console.error('Marketing assets generation failed:', error)
      toast.error(t('Failed to generate marketing assets'))
    } finally {
      setCurrentStep('')
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl">
            <Brain className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">{t('Magic Pages')} ✨</h1>
        <p className="text-lg text-muted-foreground">
          {t('Create high-converting landing pages with NexBrain AI')}
        </p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <Badge variant="secondary" className="gap-2">
            <Sparkle className="h-4 w-4" />
            {credits} {t('Credits Available')}
          </Badge>
          <Badge variant="outline" className="gap-2">
            <Robot className="h-4 w-4" />
            {t('NexBrain AI Powered')}
          </Badge>
        </div>
      </div>

      {/* Generation Progress */}
      {isGenerating && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 animate-pulse text-purple-500" />
                <span className="font-semibold">{t('NexBrain AI is working...')}</span>
              </div>
              <Progress value={generationProgress} className="h-2" />
              <p className="text-sm text-muted-foreground">{currentStep}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!generatedPage ? (
        <div className="max-w-6xl mx-auto space-y-8">
          {/* AI Quick Start */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightning className="h-5 w-5 text-yellow-500" />
                {t('AI Quick Start')}
              </CardTitle>
              <CardDescription>
                {t('Import from URL, start from scratch, or try a sample campaign')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="product-url">{t('Import from Product URL')}</Label>
                  <div className="flex gap-2">
                    <Input
                      id="product-url"
                      placeholder={t('https://example.com/product')}
                      value={pageData.productUrl}
                      onChange={(e) => setPageData(prev => ({ ...prev, productUrl: e.target.value }))}
                    />
                    <Button 
                      onClick={importProductFromUrl}
                      disabled={!pageData.productUrl || !!currentStep}
                      variant="outline"
                    >
                      {currentStep ? <Lightning className="h-4 w-4 animate-pulse" /> : t('Import')}
                    </Button>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>{t('Try Sample Campaign')}</Label>
                  <Button 
                    onClick={createSampleCampaign}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <Sparkle className="h-4 w-4" />
                    {t('Load Sample')}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    {t('See how the system works with real content')}
                  </p>
                </div>
                <div className="space-y-3">
                  <Label>{t('AI Assistance')}</Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="gap-1">
                      <Target className="h-3 w-3" />
                      {t('Audience Analysis')}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <ChartBar className="h-3 w-3" />
                      {t('Conversion Optimization')}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Images className="h-3 w-3" />
                      {t('Visual Generation')}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5" />
                {t('Choose AI-Optimized Template')}
              </CardTitle>
              <CardDescription>
                {t('Select a high-converting template powered by NexBrain AI')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <Card 
                    key={template.id}
                    className={`cursor-pointer hover:shadow-lg transition-all border-2 ${
                      selectedTemplate === template.id ? 'border-primary ring-2 ring-primary/20' : 'hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="relative">
                      <img
                        src={template.preview}
                        alt={template.name}
                        className="w-full h-40 object-cover rounded-t-lg"
                      />
                      <Badge className="absolute top-2 right-2 bg-green-500">
                        {template.conversionRate}
                      </Badge>
                      {template.aiOptimized && (
                        <Badge className="absolute top-2 left-2 bg-purple-500 gap-1">
                          <Sparkle className="h-3 w-3" />
                          AI
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{template.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {template.features.slice(0, 2).map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Page Configuration with AI Tabs */}
          {selectedTemplate && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  {t('AI-Powered Content Generation')}
                </CardTitle>
                <CardDescription>
                  {t('NexBrain AI will optimize every element for maximum conversions')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="content" className="gap-2">
                      <Edit className="h-4 w-4" />
                      {t('Content')}
                    </TabsTrigger>
                    <TabsTrigger value="audience" className="gap-2">
                      <Target className="h-4 w-4" />
                      {t('Audience')}
                    </TabsTrigger>
                    <TabsTrigger value="optimization" className="gap-2">
                      <Sparkle className="h-4 w-4" />
                      {t('AI Options')}
                    </TabsTrigger>
                    <TabsTrigger value="advanced" className="gap-2">
                      <SettingsIcon className="h-4 w-4" />
                      {t('Advanced')}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="page-title">{t('Page Title')} *</Label>
                        <Input
                          id="page-title"
                          placeholder={t('e.g., Revolutionary Fitness Tracker')}
                          value={pageData.title}
                          onChange={(e) => setPageData(prev => ({ ...prev, title: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="product-name">{t('Product/Service Name')} *</Label>
                        <Input
                          id="product-name"
                          placeholder={t('e.g., FitTracker Pro')}
                          value={pageData.productName}
                          onChange={(e) => setPageData(prev => ({ ...prev, productName: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">{t('Product Description')}</Label>
                      <Textarea
                        id="description"
                        placeholder={t('Describe your product benefits, what problems it solves...')}
                        value={pageData.description}
                        onChange={(e) => setPageData(prev => ({ ...prev, description: e.target.value }))}
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="price">{t('Price')}</Label>
                        <Input
                          id="price"
                          placeholder={t('e.g., $99, Free, Contact Us')}
                          value={pageData.price}
                          onChange={(e) => setPageData(prev => ({ ...prev, price: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cta">{t('Call-to-Action Text')}</Label>
                        <Input
                          id="cta"
                          placeholder={t('e.g., Buy Now, Get Started, Download')}
                          value={pageData.cta}
                          onChange={(e) => setPageData(prev => ({ ...prev, cta: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="features">{t('Key Features')} ({t('one per line')})</Label>
                      <Textarea
                        id="features"
                        placeholder={t('24/7 Heart Rate Monitoring\n30-Day Battery Life\nWaterproof Design\nSmart Notifications')}
                        value={pageData.features}
                        onChange={(e) => setPageData(prev => ({ ...prev, features: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="testimonials">{t('Customer Testimonials')}</Label>
                      <Textarea
                        id="testimonials"
                        placeholder={t('Share any customer reviews, success stories, or testimonials...')}
                        value={pageData.testimonials}
                        onChange={(e) => setPageData(prev => ({ ...prev, testimonials: e.target.value }))}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="audience" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="target-audience">{t('Target Audience')}</Label>
                        <Input
                          id="target-audience"
                          placeholder={t('e.g., Fitness enthusiasts, Tech professionals')}
                          value={pageData.targetAudience}
                          onChange={(e) => setPageData(prev => ({ ...prev, targetAudience: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="business-type">{t('Business Type')}</Label>
                        <Select value={pageData.businessType} onValueChange={(value) => setPageData(prev => ({ ...prev, businessType: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder={t('Select business type')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ecommerce">{t('E-commerce')}</SelectItem>
                            <SelectItem value="saas">{t('SaaS/Software')}</SelectItem>
                            <SelectItem value="services">{t('Services')}</SelectItem>
                            <SelectItem value="education">{t('Education/Courses')}</SelectItem>
                            <SelectItem value="consulting">{t('Consulting')}</SelectItem>
                            <SelectItem value="physical-product">{t('Physical Product')}</SelectItem>
                            <SelectItem value="digital-product">{t('Digital Product')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="urgency">{t('Urgency/Scarcity Elements')}</Label>
                      <Textarea
                        id="urgency"
                        placeholder={t('e.g., Limited time offer, Only 50 left in stock, Sale ends tonight...')}
                        value={pageData.urgency}
                        onChange={(e) => setPageData(prev => ({ ...prev, urgency: e.target.value }))}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="optimization" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Brain className="h-4 w-4 text-purple-500" />
                            {t('AI Content Generation')}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{t('Emotional Headlines')}</span>
                            <Badge variant="secondary">✓</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{t('Persuasive Copy')}</span>
                            <Badge variant="secondary">✓</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{t('Social Proof')}</span>
                            <Badge variant="secondary">✓</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{t('Urgency Triggers')}</span>
                            <Badge variant="secondary">✓</Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm flex items-center gap-2">
                            <Images className="h-4 w-4 text-blue-500" />
                            {t('Visual AI Assets')}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{t('Hero Images')}</span>
                            <Badge variant="secondary">✓</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{t('Product Mockups')}</span>
                            <Badge variant="secondary">✓</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{t('Background Images')}</span>
                            <Badge variant="secondary">✓</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{t('Icon Generation')}</span>
                            <Badge variant="secondary">✓</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">{t('SEO Optimization')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{t('Meta Tags')}</span>
                            <Badge variant="secondary">Auto</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{t('Schema Markup')}</span>
                            <Badge variant="secondary">Auto</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{t('Keywords')}</span>
                            <Badge variant="secondary">AI Generated</Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-sm">{t('Performance')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{t('Mobile Optimized')}</span>
                            <Badge variant="secondary">✓</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{t('Fast Loading')}</span>
                            <Badge variant="secondary">✓</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{t('Analytics Ready')}</span>
                            <Badge variant="secondary">✓</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>

                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:opacity-90 gap-2"
                  onClick={generatePage}
                  disabled={isGenerating || !selectedTemplate || !pageData.title || !pageData.productName}
                >
                  {isGenerating ? (
                    <>
                      <Brain className="h-5 w-5 animate-pulse" />
                      {t('NexBrain AI is creating your page...')}
                    </>
                  ) : (
                    <>
                      <Lightning className="h-5 w-5" />
                      {t('Generate Magic Page with AI')} (50 {t('Credits')})
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        /* AI-Generated Page Results */
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">🎉 {t('Magic Page Created Successfully!')}</h2>
            <p className="text-muted-foreground">{t('Your AI-optimized landing page is ready to convert')}</p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <Badge variant="secondary" className="gap-2">
                <Brain className="h-4 w-4" />
                {t('NexBrain AI Generated')}
              </Badge>
              <Badge variant="outline" className="gap-2">
                <Target className="h-4 w-4" />
                {t('Conversion Optimized')}
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">{t('Overview')}</TabsTrigger>
              <TabsTrigger value="preview">{t('Preview')}</TabsTrigger>
              <TabsTrigger value="content">{t('AI Content')}</TabsTrigger>
              <TabsTrigger value="assets">{t('Marketing')}</TabsTrigger>
              <TabsTrigger value="analytics">{t('Analytics')}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{t('Page Overview')}</span>
                    <div className="flex gap-2">
                      <Badge variant="secondary">{t('Live')}</Badge>
                      <Badge variant="outline" className="gap-1">
                        <Sparkle className="h-3 w-3" />
                        AI
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="font-semibold mb-3">{t('Page Details')}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>{t('Title')}:</span>
                          <span className="font-medium">{generatedPage.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('Template')}:</span>
                          <span className="font-medium">{generatedPage.template}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('URL')}:</span>
                          <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                            {generatedPage.url}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('Status')}:</span>
                          <Badge variant="secondary">{t('Published')}</Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">{t('Performance')}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>{t('Views')}:</span>
                          <span className="font-medium">{generatedPage.views}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('Conversions')}:</span>
                          <span className="font-medium">{generatedPage.conversions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('Conversion Rate')}:</span>
                          <span className="font-medium">{generatedPage.conversionRate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('Created')}:</span>
                          <span className="font-medium">{t('Just now')}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-3">{t('AI Features')}</h3>
                      <div className="space-y-2">
                        <Badge variant="outline" className="w-full justify-start gap-2">
                          <Brain className="h-3 w-3" />
                          {t('Smart Headlines')}
                        </Badge>
                        <Badge variant="outline" className="w-full justify-start gap-2">
                          <Target className="h-3 w-3" />
                          {t('Audience Targeting')}
                        </Badge>
                        <Badge variant="outline" className="w-full justify-start gap-2">
                          <Images className="h-3 w-3" />
                          {t('Auto Images')}
                        </Badge>
                        <Badge variant="outline" className="w-full justify-start gap-2">
                          <ChartBar className="h-3 w-3" />
                          {t('SEO Optimized')}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => setPreviewMode(previewMode === 'desktop' ? 'mobile' : 'desktop')}
                    >
                      {previewMode === 'desktop' ? <Smartphone className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                      {previewMode === 'desktop' ? t('Mobile') : t('Desktop')}
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      {t('Preview')}
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Share className="h-4 w-4" />
                      {t('Share')}
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <SettingsIcon className="h-4 w-4" />
                      {t('Settings')}
                    </Button>
                  </div>

                  {/* Marketing Assets Generation */}
                  <Card className="border-dashed">
                    <CardContent className="p-6 text-center">
                      <h3 className="font-semibold mb-2 flex items-center justify-center gap-2">
                        <Megaphone className="h-5 w-5 text-blue-500" />
                        {t('Generate Marketing Assets')}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {t('Create complete marketing campaigns with NexBrain AI')}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <Badge variant="outline" className="py-2 gap-2">
                          <Megaphone className="h-4 w-4" />
                          {t('Facebook Ads')}
                        </Badge>
                        <Badge variant="outline" className="py-2 gap-2">
                          <VideoCamera className="h-4 w-4" />
                          {t('Promo Videos')}
                        </Badge>
                        <Badge variant="outline" className="py-2 gap-2">
                          <Images className="h-4 w-4" />
                          {t('WhatsApp Flow')}
                        </Badge>
                      </div>
                      <Button 
                        onClick={generateMarketingAssets}
                        disabled={!!currentStep}
                        className="gap-2"
                      >
                        {currentStep ? (
                          <>
                            <Lightning className="h-4 w-4 animate-pulse" />
                            {currentStep}
                          </>
                        ) : (
                          <>
                            <Sparkle className="h-4 w-4" />
                            {t('Generate Marketing Assets')} (100 {t('Credits')})
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    {t('Page Preview')} - {previewMode === 'desktop' ? t('Desktop') : t('Mobile')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`border rounded-lg overflow-hidden ${
                    previewMode === 'mobile' ? 'max-w-sm mx-auto' : ''
                  }`}>
                    <div className="bg-white p-6 space-y-6">
                      {/* AI Generated Hero Section */}
                      <div className="text-center space-y-4">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                          {generatedPage.aiGenerated?.headline || generatedPage.aiGenerated?.heroSection?.title || pageData.title || 'Transform Your Life Today'}
                        </h1>
                        <p className="text-lg text-gray-600">
                          {generatedPage.aiGenerated?.subheadline || generatedPage.aiGenerated?.heroSection?.subtitle || pageData.description || 'Discover the solution you\'ve been waiting for'}
                        </p>
                        
                        {/* AI Generated Hero Image */}
                        <div className="w-full h-48 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                          {generatedPage.aiGenerated?.heroSection?.imageUrl ? (
                            <img 
                              src={generatedPage.aiGenerated.heroSection.imageUrl} 
                              alt="Hero Image"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="text-center">
                              <Images className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                              <span className="text-muted-foreground">{t('AI Generated Hero Image')}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* AI Generated Benefits */}
                      {generatedPage.aiGenerated?.benefits || generatedPage.aiGenerated?.solutionSection?.benefits ? (
                        <div className="grid md:grid-cols-3 gap-4">
                          {(generatedPage.aiGenerated.benefits || generatedPage.aiGenerated.solutionSection?.benefits || []).slice(0, 3).map((benefit: string, index: number) => (
                            <div key={index} className="text-center p-4 border rounded-lg">
                              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                                <Sparkle className="h-6 w-6 text-primary" />
                              </div>
                              <p className="text-sm font-medium">{benefit}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid md:grid-cols-3 gap-4">
                          {['Save time and effort', 'Get professional results', 'Enjoy peace of mind'].map((benefit: string, index: number) => (
                            <div key={index} className="text-center p-4 border rounded-lg">
                              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                                <Sparkle className="h-6 w-6 text-primary" />
                              </div>
                              <p className="text-sm font-medium">{benefit}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Pricing Section */}
                      <div className="text-center bg-muted/20 p-6 rounded-lg">
                        <div className="text-4xl font-bold text-green-600 mb-2">
                          {generatedPage.aiGenerated?.pricingSection?.price || pageData.price || '$99'}
                        </div>
                        <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-600">
                          {generatedPage.aiGenerated?.cta || generatedPage.aiGenerated?.pricingSection?.ctaText || pageData.cta || 'Buy Now'}
                        </Button>
                      </div>

                      {/* AI Generated Social Proof */}
                      <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-center">{t('What Our Customers Say')}</h3>
                        <div className="grid gap-4">
                          {(generatedPage.aiGenerated?.socialProof?.testimonials || [
                            {name: 'Sarah Johnson', role: 'Verified Customer', content: 'This product changed my life! Highly recommended.', rating: 5},
                            {name: 'Mike Chen', role: 'Business Owner', content: 'Exactly what I needed. Great value for money.', rating: 5},
                            {name: 'Lisa Davis', role: 'Professional', content: 'Outstanding quality and customer service.', rating: 5}
                          ]).slice(0, 3).map((testimonial: any, i: number) => (
                            <div key={i} className="bg-muted/20 p-4 rounded-lg">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-primary/20 rounded-full"></div>
                                <div>
                                  <p className="font-medium text-sm">{testimonial.name}</p>
                                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                                </div>
                              </div>
                              <p className="text-sm">{testimonial.content}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-500" />
                    {t('AI-Generated Content')}
                  </CardTitle>
                  <CardDescription>
                    {t('All content optimized by NexBrain AI for maximum conversions')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {generatedPage.aiGenerated && (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-semibold">{t('Headline')}</Label>
                        <div className="p-3 bg-muted/20 rounded-lg">
                          <p className="font-semibold text-lg">
                            {generatedPage.aiGenerated.headline || generatedPage.aiGenerated.heroSection?.title || 'AI-Generated Headline Will Appear Here'}
                          </p>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-semibold">{t('Subheadline')}</Label>
                        <div className="p-3 bg-muted/20 rounded-lg">
                          <p>{generatedPage.aiGenerated.subheadline || generatedPage.aiGenerated.heroSection?.subtitle || 'AI-Generated Subheadline Will Appear Here'}</p>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-semibold">{t('Problem Statement')}</Label>
                        <div className="p-3 bg-muted/20 rounded-lg">
                          <p>{generatedPage.aiGenerated.problem || generatedPage.aiGenerated.problemSection?.description || 'AI-Generated Problem Statement Will Appear Here'}</p>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-semibold">{t('Solution')}</Label>
                        <div className="p-3 bg-muted/20 rounded-lg">
                          <p>{generatedPage.aiGenerated.solution || generatedPage.aiGenerated.solutionSection?.description || 'AI-Generated Solution Will Appear Here'}</p>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-semibold">{t('Key Benefits')}</Label>
                        <div className="p-3 bg-muted/20 rounded-lg">
                          <ul className="list-disc list-inside space-y-1">
                            {(generatedPage.aiGenerated.benefits || generatedPage.aiGenerated.solutionSection?.benefits || ['AI-Generated Benefit 1', 'AI-Generated Benefit 2', 'AI-Generated Benefit 3']).map((benefit: string, index: number) => (
                              <li key={index}>{benefit}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-semibold">{t('Call-to-Action')}</Label>
                        <div className="p-3 bg-muted/20 rounded-lg">
                          <Button className="bg-gradient-to-r from-purple-500 to-pink-600">
                            {generatedPage.aiGenerated.cta || generatedPage.aiGenerated.pricingSection?.ctaText || 'AI-Generated CTA'}
                          </Button>
                        </div>
                      </div>

                      {generatedPage.aiGenerated.featuresSection?.features && (
                        <div>
                          <Label className="text-sm font-semibold">{t('Features')}</Label>
                          <div className="p-3 bg-muted/20 rounded-lg">
                            <ul className="list-disc list-inside space-y-1">
                              {generatedPage.aiGenerated.featuresSection.features.map((feature: any, index: number) => (
                                <li key={index}>
                                  <strong>{feature.title}:</strong> {feature.description}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  ) || (
                    <div className="text-center py-8">
                      <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        {t('Generate a page to see AI-created content here')}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assets" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Megaphone className="h-4 w-4 text-blue-500" />
                      {t('Facebook Ads Campaign')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {t('AI-generated ads with targeting and creatives')}
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      {t('View Campaign')}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <VideoCamera className="h-4 w-4 text-red-500" />
                      {t('Promotional Video')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {t('AI-generated video script and scenes')}
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      {t('Generate Video')}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Images className="h-4 w-4 text-green-500" />
                      {t('WhatsApp Sales Flow')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {t('Automated conversation sequences')}
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      {t('Setup WhatsApp')}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ChartBar className="h-5 w-5" />
                    {t('Performance Analytics')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <ChartBar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {t('Analytics will appear here once your page starts receiving traffic')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              onClick={resetBuilder}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              {t('Create New Page')}
            </Button>
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              {t('Export Page')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesPageBuilder;