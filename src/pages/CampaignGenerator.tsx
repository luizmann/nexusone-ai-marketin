import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCredits } from '@/contexts/CreditContext'
import { fixedCampaignService, FixedCampaignData } from '@/services/fixedCampaignService'
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
  Download,
  Eye,
  Images,
  Copy,
  Share,
  ArrowRight,
  Brain,
  Megaphone
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface CampaignStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  result?: string
}

export const CampaignGenerator: React.FC = () => {
  const { credits, useCredits, getCreditCost } = useCredits()
  const [isGenerating, setIsGenerating] = useState(false)
  const [campaignData, setCampaignData] = useState({
    productUrl: '',
    productName: '',
    description: '',
    businessType: '',
    targetAudience: '',
    price: '',
    cta: 'Buy Now',
    budget: '',
    goals: ''
  })
  const [generationProgress, setGenerationProgress] = useState(0)
  const [campaignSteps, setCampaignSteps] = useState<CampaignStep[]>([])
  const [generatedCampaign, setGeneratedCampaign] = useState<FixedCampaignData | null>(null)
  const [activeAssetTab, setActiveAssetTab] = useState('overview')

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

    if (!campaignData.productName || !campaignData.targetAudience) {
      toast.error('Please fill in product name and target audience.')
      return
    }

    setIsGenerating(true)
    setGenerationProgress(0)
    
    const steps: CampaignStep[] = [
      {
        id: 'analyze',
        title: 'AI Content Analysis',
        description: 'NexBrain AI analyzing product and market data',
        status: 'processing'
      },
      {
        id: 'content',
        title: 'Content Generation',
        description: 'Creating persuasive sales copy with emotional triggers',
        status: 'pending'
      },
      {
        id: 'images',
        title: 'Visual Asset Creation',
        description: 'Generating high-quality marketing images',
        status: 'pending'
      },
      {
        id: 'landing',
        title: 'Landing Page Builder',
        description: 'Building conversion-optimized landing page',
        status: 'pending'
      },
      {
        id: 'ads',
        title: 'Facebook Ads Campaign',
        description: 'Creating targeted advertising campaigns',
        status: 'pending'
      },
      {
        id: 'video',
        title: 'Video Content',
        description: 'Generating promotional video scripts',
        status: 'pending'
      },
      {
        id: 'whatsapp',
        title: 'WhatsApp Sales Bot',
        description: 'Setting up automated sales conversations',
        status: 'pending'
      },
      {
        id: 'dragdrop',
        title: 'Drag & Drop Assets',
        description: 'Preparing editable design elements',
        status: 'pending'
      }
    ]

    setCampaignSteps(steps)

    try {
      // Generate campaign using the fixed service
      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        setCampaignSteps(prev => prev.map((step, index) => {
          if (index === i) {
            return { ...step, status: 'completed', result: 'Generated successfully' }
          } else if (index === i + 1) {
            return { ...step, status: 'processing' }
          }
          return step
        }))
        
        setGenerationProgress(((i + 1) / steps.length) * 90)
      }

      // Generate the actual campaign
      setGenerationProgress(95)
      const campaign = await fixedCampaignService.generateCompleteCampaign(campaignData)
      
      setGenerationProgress(100)
      setGeneratedCampaign(campaign)
      setIsGenerating(false)
      
      if (campaign.status === 'completed') {
        toast.success('🎉 Complete marketing campaign generated successfully!')
      } else {
        toast.warning('Campaign generated with fallback content. Some features may be limited.')
      }

    } catch (error) {
      console.error('Campaign generation failed:', error)
      setIsGenerating(false)
      setCampaignSteps(prev => prev.map(step => ({ ...step, status: 'failed' })))
      toast.error('Failed to generate campaign. Please try again.')
    }
  }

  // Create sample campaign for testing
  const createSampleCampaign = () => {
    const sampleCampaign: FixedCampaignData = {
      id: `sample_campaign_${Date.now()}`,
      title: 'Sample FitTracker Pro Campaign',
      productName: 'FitTracker Pro',
      description: 'Revolutionary fitness tracker that helps you achieve your health goals with AI-powered insights',
      targetAudience: 'Fitness enthusiasts and health-conscious individuals',
      businessType: 'E-commerce',
      price: '$149',
      cta: 'Order Now - Limited Time',
      generatedContent: {
        headline: 'Transform Your Health Journey with FitTracker Pro',
        subheadline: 'The smart fitness tracker that adapts to your lifestyle and motivates you every step of the way',
        heroSection: {
          title: 'Revolutionary FitTracker Pro',
          subtitle: 'Your personal health companion powered by AI',
          imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
          ctaText: 'Start Your Transformation'
        },
        problemSection: {
          title: 'Struggling to Stay Motivated?',
          description: 'Many fitness enthusiasts struggle with consistency, accurate tracking, and staying motivated to reach their health goals. Traditional fitness trackers provide data but lack the intelligence to truly guide your journey.',
          painPoints: [
            'Lack of personalized insights and recommendations',
            'Difficulty maintaining motivation and consistency',
            'Inaccurate tracking leading to frustration',
            'No adaptive coaching based on your progress'
          ]
        },
        solutionSection: {
          title: 'FitTracker Pro is Your AI-Powered Solution',
          description: 'Our revolutionary fitness tracker uses advanced AI algorithms to provide personalized insights, adaptive coaching, and motivation that evolves with your fitness journey.',
          benefits: [
            'AI-powered personalized workout recommendations',
            '24/7 comprehensive health monitoring with 99.5% accuracy',
            'Smart motivation system that adapts to your personality',
            'Advanced sleep and recovery analysis',
            'Water-resistant design for all activities'
          ]
        },
        featuresSection: {
          title: 'Powerful Features That Set Us Apart',
          features: [
            {
              title: 'AI Health Coach',
              description: 'Personalized workout plans and health recommendations based on your data',
              icon: 'brain'
            },
            {
              title: '24/7 Heart Rate Monitoring',
              description: 'Continuous, accurate heart rate tracking with zone analysis',
              icon: 'heart'
            },
            {
              title: 'Advanced Sleep Analysis',
              description: 'Detailed sleep quality insights with improvement suggestions',
              icon: 'moon'
            },
            {
              title: 'Smart Recovery Tracking',
              description: 'Monitor your recovery and get rest recommendations',
              icon: 'leaf'
            }
          ]
        },
        socialProof: {
          testimonials: [
            {
              name: 'Sarah Johnson',
              role: 'Marathon Runner',
              content: 'FitTracker Pro helped me improve my training efficiency by 40%. The AI insights are incredible - it\'s like having a personal trainer on my wrist!',
              rating: 5
            },
            {
              name: 'Mike Chen',
              role: 'Busy Professional',
              content: 'Finally a tracker that understands my hectic lifestyle. The sleep tracking and stress management features changed my life.',
              rating: 5
            },
            {
              name: 'Lisa Rodriguez',
              role: 'Fitness Enthusiast',
              content: 'The personalized workout recommendations are spot-on. I\'ve never been more motivated to stay active!',
              rating: 5
            }
          ],
          stats: [
            { number: '50,000+', label: 'Happy Users Worldwide' },
            { number: '99.5%', label: 'Accuracy Rate' },
            { number: '40%', label: 'Average Improvement' },
            { number: '7 Days', label: 'Battery Life' }
          ]
        },
        pricingSection: {
          title: 'Special Launch Offer - Limited Time Only',
          price: '$149',
          originalPrice: '$249',
          ctaText: 'Order Now - Save $100',
          guarantees: [
            '30-day money-back guarantee',
            'Free worldwide shipping',
            '2-year warranty included',
            '24/7 customer support'
          ]
        },
        faqSection: {
          title: 'Frequently Asked Questions',
          questions: [
            {
              question: 'How accurate is the heart rate monitoring?',
              answer: 'FitTracker Pro uses advanced optical sensors with 99.5% accuracy rate, clinically tested and verified by independent health organizations.'
            },
            {
              question: 'Is it waterproof?',
              answer: 'Yes, FitTracker Pro is rated IP68 for water resistance up to 50 meters, perfect for swimming, showering, and all water activities.'
            },
            {
              question: 'How long does the battery last?',
              answer: 'With normal usage, FitTracker Pro lasts up to 7 days on a single charge. Heavy GPS usage may reduce battery life to 3-4 days.'
            },
            {
              question: 'What smartphones are compatible?',
              answer: 'FitTracker Pro works with iPhone 6s and later (iOS 12+) and Android devices running Android 6.0 or later.'
            }
          ]
        },
        footer: {
          companyName: 'FitTech Solutions Inc.',
          contactInfo: 'support@fittrackerpro.com | 1-800-FIT-TRACK | Live Chat Available 24/7',
          disclaimer: 'Results may vary based on individual usage. This device is not intended for medical diagnosis or treatment.'
        }
      },
      marketingAssets: {
        landingPageUrl: 'https://nexusone.ai/campaigns/sample-fittracker',
        facebookAds: [
          {
            id: 'fb_ad_hero',
            headline: 'Transform Your Health Journey with AI-Powered FitTracker Pro',
            description: 'Get personalized insights, 24/7 monitoring, and smart coaching. Limited time: Save $100!',
            imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200',
            targeting: {
              interests: ['fitness', 'health tracking', 'wearable technology', 'personal training'],
              demographics: { ageRange: '25-65', income: 'middle to high' },
              behaviors: ['fitness enthusiasts', 'health conscious', 'tech early adopters']
            }
          },
          {
            id: 'fb_ad_social_proof',
            headline: '50,000+ People Transformed Their Health with FitTracker Pro',
            description: 'Join the fitness revolution. AI-powered insights that actually work. See results in just weeks!',
            imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200',
            targeting: {
              interests: ['fitness motivation', 'health goals', 'lifestyle change'],
              demographics: { ageRange: '25-55' },
              behaviors: ['recently searched for fitness trackers']
            }
          }
        ],
        videos: [
          {
            id: 'hero_video',
            title: 'FitTracker Pro - Your AI Health Coach',
            description: 'See how FitTracker Pro uses artificial intelligence to revolutionize your fitness journey',
            scriptContent: `
              [Scene 1 - Hook (0-3s)]
              "What if your fitness tracker could actually think?"
              
              [Scene 2 - Problem (3-11s)]
              "Most fitness trackers just collect data. But data without intelligence is just noise. You need insights, not just numbers."
              
              [Scene 3 - Solution (11-23s)]
              "Meet FitTracker Pro - the first AI-powered fitness tracker that learns from your behavior, adapts to your lifestyle, and provides personalized coaching that evolves with you. 24/7 heart rate monitoring, advanced sleep analysis, and smart recovery recommendations."
              
              [Scene 4 - Social Proof (23-27s)]
              "Join 50,000+ users who've already transformed their health with 40% better results than traditional trackers."
              
              [Scene 5 - CTA (27-30s)]
              "Limited time: Save $100. Order your FitTracker Pro today!"
            `,
            videoUrl: undefined
          }
        ],
        whatsappFlow: {
          welcomeMessage: 'Hi there! 👋 Welcome to FitTracker Pro! I\'m excited to help you discover how our AI-powered fitness tracker can transform your health journey. What brings you here today?',
          productPresentation: 'FitTracker Pro is revolutionary! 🚀 Here\'s what makes it special:\n\n✅ AI-powered personalized insights\n✅ 99.5% accurate 24/7 health monitoring\n✅ Smart coaching that adapts to YOU\n✅ Advanced sleep & recovery analysis\n✅ 7-day battery life\n✅ Waterproof design\n\nSpecial launch offer: Just $149 (normally $249) - that\'s $100 off! 💰',
          objectionHandling: [
            'I totally understand the price concern! Think of it this way - most people spend $149 on a few personal training sessions. FitTracker Pro gives you personalized AI coaching 24/7 for life. Plus, we offer a 30-day money-back guarantee, so there\'s zero risk! 💪',
            'Great question about effectiveness! Unlike other trackers that just show data, FitTracker Pro uses AI to actually improve your results. Our users see 40% better fitness outcomes on average. We have 50,000+ happy customers and a 99.5% accuracy rate - clinically verified! 📊',
            'I understand there are many options out there. What sets FitTracker Pro apart is the AI brain inside. It learns your patterns, adapts to your lifestyle, and provides coaching that gets smarter over time. No other tracker on the market has this level of intelligence. Plus, you get our premium health insights normally worth $20/month for free! 🧠'
          ],
          closingMessages: [
            'This special $100 discount is only available for a limited time. Would you like to secure your FitTracker Pro at this exclusive price? I can help you complete your order right now! ⏰',
            'Amazing choice! You\'re about to join 50,000+ people who\'ve transformed their health with FitTracker Pro. Ready to start your transformation? I can walk you through the simple ordering process! 🎉',
            'Perfect! Click this link to secure your FitTracker Pro at the special launch price: [ORDER LINK] Your new AI health coach will be on its way to you within 24 hours! 🚀'
          ]
        }
      },
      dragDropAssets: {
        generatedImages: [
          {
            id: 'hero_main',
            url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200',
            type: 'hero',
            prompt: 'Professional fitness tracker hero image with modern design'
          },
          {
            id: 'product_detail',
            url: 'https://images.unsplash.com/photo-1508746829417-e1b5e819d300?w=800',
            type: 'product',
            prompt: 'Detailed product showcase of smartwatch with health features'
          },
          {
            id: 'lifestyle_context',
            url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200',
            type: 'background',
            prompt: 'Active lifestyle background with fitness and health theme'
          },
          {
            id: 'social_proof',
            url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800',
            type: 'icon',
            prompt: 'Happy customers using fitness tracker testimonials'
          }
        ],
        designElements: [
          {
            id: 'main_headline',
            type: 'text',
            content: 'Transform Your Health Journey with FitTracker Pro',
            styles: {
              fontSize: '42px',
              fontWeight: 'bold',
              color: '#1a1a1a',
              textAlign: 'center',
              lineHeight: '1.2'
            }
          },
          {
            id: 'primary_cta',
            type: 'button',
            content: 'Order Now - Save $100',
            styles: {
              backgroundColor: '#007bff',
              color: '#ffffff',
              padding: '18px 36px',
              borderRadius: '12px',
              fontSize: '20px',
              fontWeight: '600',
              boxShadow: '0 4px 14px rgba(0, 123, 255, 0.3)'
            }
          },
          {
            id: 'feature_container',
            type: 'container',
            content: '',
            styles: {
              backgroundColor: '#f8f9fa',
              padding: '32px',
              borderRadius: '16px',
              border: '1px solid #e9ecef',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
            }
          }
        ]
      },
      status: 'completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setGeneratedCampaign(sampleCampaign);
    
    // Save to localStorage for drag & drop editor
    const existingCampaigns = JSON.parse(localStorage.getItem('generated-campaigns') || '[]');
    existingCampaigns.push(sampleCampaign);
    localStorage.setItem('generated-campaigns', JSON.stringify(existingCampaigns));

    // Set the campaign data fields
    setCampaignData({
      productUrl: '',
      productName: sampleCampaign.productName,
      description: sampleCampaign.description,
      businessType: sampleCampaign.businessType,
      targetAudience: sampleCampaign.targetAudience,
      price: sampleCampaign.price,
      cta: sampleCampaign.cta,
      budget: '$1000',
      goals: 'Increase sales and brand awareness'
    });

    toast.success('✨ Sample campaign loaded! Explore all the AI-generated content and assets.');
  };
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'processing':
        return <Brain className="h-5 w-5 text-blue-500 animate-pulse" />
      case 'failed':
        return <div className="h-5 w-5 rounded-full bg-red-500" />
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const openLandingPagePreview = () => {
    if (generatedCampaign) {
      window.open(generatedCampaign.marketingAssets.landingPageUrl, '_blank')
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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Choose Campaign Type</CardTitle>
                  <CardDescription>Select the type of campaign that best fits your goals</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  onClick={createSampleCampaign}
                  className="gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Try Sample
                </Button>
              </div>
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
                Provide detailed information about your product for optimal AI generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="product-name">Product/Service Name *</Label>
                  <Input
                    id="product-name"
                    placeholder="e.g., FitTracker Pro, Digital Marketing Course"
                    value={campaignData.productName}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, productName: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    placeholder="e.g., $99, $197, Free Trial"
                    value={campaignData.price}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, price: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Product Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your product, its main benefits, what problems it solves, and what makes it unique..."
                  value={campaignData.description}
                  onChange={(e) => setCampaignData(prev => ({ ...prev, description: e.target.value }))}
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="target-audience">Target Audience *</Label>
                  <Input
                    id="target-audience"
                    placeholder="e.g., Fitness enthusiasts aged 25-40, Small business owners"
                    value={campaignData.targetAudience}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, targetAudience: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="business-type">Business Category</Label>
                  <Input
                    id="business-type"
                    placeholder="e.g., E-commerce, SaaS, Consulting, Education"
                    value={campaignData.businessType}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, businessType: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="cta">Call-to-Action Text</Label>
                  <Input
                    id="cta"
                    placeholder="e.g., Buy Now, Get Started, Download Free"
                    value={campaignData.cta}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, cta: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="budget">Marketing Budget (Optional)</Label>
                  <Input
                    id="budget"
                    placeholder="e.g., $500, $1000, $5000"
                    value={campaignData.budget}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, budget: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="product-url">Product URL (Optional)</Label>
                <Input
                  id="product-url"
                  placeholder="https://example.com/product (for additional context)"
                  value={campaignData.productUrl}
                  onChange={(e) => setCampaignData(prev => ({ ...prev, productUrl: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="goals">Campaign Goals</Label>
                <Textarea
                  id="goals"
                  placeholder="What do you want to achieve? (e.g., Generate leads, Increase sales, Build brand awareness)"
                  value={campaignData.goals}
                  onChange={(e) => setCampaignData(prev => ({ ...prev, goals: e.target.value }))}
                />
              </div>

              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 gap-2"
                onClick={generateCampaign}
                disabled={isGenerating || !campaignData.productName || !campaignData.targetAudience || !campaignData.price}
              >
                {isGenerating ? (
                  <>
                    <Brain className="h-5 w-5 animate-pulse" />
                    NexBrain AI is creating your campaign...
                  </>
                ) : (
                  <>
                    <Lightning className="h-5 w-5" />
                    Generate Complete Campaign with AI (100 Credits)
                  </>
                )}
              </Button>

              {/* Required Fields Notice */}
              <div className="text-sm text-muted-foreground text-center">
                * Required fields for optimal AI generation
              </div>
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
            <h2 className="text-2xl font-bold mb-2">🎉 Complete Marketing Campaign Generated!</h2>
            <p className="text-muted-foreground">Your AI-powered campaign is ready with all assets and content</p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <Badge variant="secondary" className="gap-2">
                <Brain className="h-4 w-4" />
                NexBrain AI Generated
              </Badge>
              <Badge variant="outline" className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Status: {generatedCampaign?.status}
              </Badge>
            </div>
          </div>

          <Tabs value={activeAssetTab} onValueChange={setActiveAssetTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="content">AI Content</TabsTrigger>
              <TabsTrigger value="landing">Landing Page</TabsTrigger>
              <TabsTrigger value="ads">Facebook Ads</TabsTrigger>
              <TabsTrigger value="assets">Media Assets</TabsTrigger>
              <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Campaign Summary */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Campaign Summary</CardTitle>
                    <CardDescription>{generatedCampaign?.title}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-3">Campaign Details</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Product:</span>
                            <span className="font-medium">{generatedCampaign?.productName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Price:</span>
                            <span className="font-medium">{generatedCampaign?.price}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Target:</span>
                            <span className="font-medium">{generatedCampaign?.targetAudience}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Category:</span>
                            <span className="font-medium">{generatedCampaign?.businessType}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3">Generated Assets</h3>
                        <div className="space-y-2">
                          <Badge variant="outline" className="w-full justify-start gap-2">
                            <Globe className="h-3 w-3" />
                            Landing Page Ready
                          </Badge>
                          <Badge variant="outline" className="w-full justify-start gap-2">
                            <Megaphone className="h-3 w-3" />
                            {generatedCampaign?.marketingAssets.facebookAds.length || 0} Facebook Ads
                          </Badge>
                          <Badge variant="outline" className="w-full justify-start gap-2">
                            <Video className="h-3 w-3" />
                            {generatedCampaign?.marketingAssets.videos.length || 0} Video Scripts
                          </Badge>
                          <Badge variant="outline" className="w-full justify-start gap-2">
                            <WhatsappLogo className="h-3 w-3" />
                            WhatsApp Sales Flow
                          </Badge>
                          <Badge variant="outline" className="w-full justify-start gap-2">
                            <Images className="h-3 w-3" />
                            {generatedCampaign?.dragDropAssets.generatedImages.length || 0} AI Images
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2"
                        onClick={openLandingPagePreview}
                      >
                        <Eye className="h-4 w-4" />
                        Preview Page
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2"
                        onClick={() => copyToClipboard(generatedCampaign?.marketingAssets.landingPageUrl || '')}
                      >
                        <Copy className="h-4 w-4" />
                        Copy URL
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2"
                      >
                        <Share className="h-4 w-4" />
                        Share Campaign
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Export Assets
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Projections */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>AI Projections</CardTitle>
                      <CardDescription>Estimated performance metrics</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm">Conversion Rate</span>
                        <span className="font-semibold text-green-600">12-18%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Click-through Rate</span>
                        <span className="font-semibold">2.5-4.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Estimated ROAS</span>
                        <span className="font-semibold text-blue-600">3.2x</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Lead Quality</span>
                        <span className="font-semibold text-purple-600">High</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Next Steps</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full justify-start gap-2" size="sm">
                        <ArrowRight className="h-4 w-4" />
                        1. Review Generated Content
                      </Button>
                      <Button className="w-full justify-start gap-2" variant="outline" size="sm">
                        <ArrowRight className="h-4 w-4" />
                        2. Customize Landing Page
                      </Button>
                      <Button className="w-full justify-start gap-2" variant="outline" size="sm">
                        <ArrowRight className="h-4 w-4" />
                        3. Launch Facebook Ads
                      </Button>
                      <Button className="w-full justify-start gap-2" variant="outline" size="sm">
                        <ArrowRight className="h-4 w-4" />
                        4. Activate WhatsApp Bot
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-500" />
                    AI-Generated Sales Content
                  </CardTitle>
                  <CardDescription>
                    All content optimized for maximum conversions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {generatedCampaign?.generatedContent && (
                    <div className="grid lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-semibold">Headline</Label>
                          <div className="p-3 bg-muted/20 rounded-lg">
                            <p className="font-bold text-lg">{generatedCampaign.generatedContent.headline}</p>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-semibold">Subheadline</Label>
                          <div className="p-3 bg-muted/20 rounded-lg">
                            <p>{generatedCampaign.generatedContent.subheadline}</p>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-semibold">Problem Statement</Label>
                          <div className="p-3 bg-muted/20 rounded-lg">
                            <p>{generatedCampaign.generatedContent.problemSection.description}</p>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                              {generatedCampaign.generatedContent.problemSection.painPoints.map((point: string, index: number) => (
                                <li key={index} className="text-sm">{point}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-semibold">Solution & Benefits</Label>
                          <div className="p-3 bg-muted/20 rounded-lg">
                            <p className="mb-2">{generatedCampaign.generatedContent.solutionSection.description}</p>
                            <ul className="list-disc list-inside space-y-1">
                              {generatedCampaign.generatedContent.solutionSection.benefits.map((benefit: string, index: number) => (
                                <li key={index} className="text-sm">{benefit}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-semibold">Key Features</Label>
                          <div className="p-3 bg-muted/20 rounded-lg space-y-2">
                            {generatedCampaign.generatedContent.featuresSection.features.map((feature: any, index: number) => (
                              <div key={index} className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                <div>
                                  <p className="font-medium text-sm">{feature.title}</p>
                                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-semibold">Call-to-Action</Label>
                          <div className="p-3 bg-muted/20 rounded-lg">
                            <Button className="bg-gradient-to-r from-purple-500 to-pink-600">
                              {generatedCampaign.generatedContent.pricingSection.ctaText}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="landing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Landing Page Preview
                  </CardTitle>
                  <CardDescription>
                    Your conversion-optimized landing page
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden bg-white">
                    <div className="p-6 space-y-6">
                      {/* Hero Section Preview */}
                      <div className="text-center space-y-4">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                          {generatedCampaign?.generatedContent?.headline}
                        </h1>
                        <p className="text-lg text-gray-600">
                          {generatedCampaign?.generatedContent?.subheadline}
                        </p>
                        
                        {/* Hero Image */}
                        <div className="w-full h-48 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                          {generatedCampaign?.dragDropAssets.generatedImages[0] ? (
                            <img 
                              src={generatedCampaign.dragDropAssets.generatedImages[0].url} 
                              alt="Hero" 
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="text-center">
                              <Images className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                              <span className="text-muted-foreground">AI Generated Hero Image</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Features Preview */}
                      {generatedCampaign?.generatedContent?.featuresSection && (
                        <div className="grid md:grid-cols-3 gap-4">
                          {generatedCampaign.generatedContent.featuresSection.features.slice(0, 3).map((feature: any, index: number) => (
                            <div key={index} className="text-center p-4 border rounded-lg">
                              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                                <CheckCircle className="h-6 w-6 text-primary" />
                              </div>
                              <h3 className="font-medium mb-1">{feature.title}</h3>
                              <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Pricing Section */}
                      <div className="text-center bg-muted/20 p-6 rounded-lg">
                        <div className="text-4xl font-bold text-green-600 mb-2">{generatedCampaign?.price}</div>
                        <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-600">
                          {generatedCampaign?.cta}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ads" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {generatedCampaign?.marketingAssets.facebookAds.map((ad: any, index: number) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-sm">Facebook Ad #{index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                        {ad.imageUrl ? (
                          <img src={ad.imageUrl} alt={`Ad ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Images className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm mb-1">{ad.headline}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">{ad.description}</p>
                      </div>
                      <div className="text-xs space-y-1">
                        <div>Interests: {ad.targeting?.interests?.join(', ')}</div>
                        <div>Age: {ad.targeting?.ageRange}</div>
                      </div>
                      <Button size="sm" className="w-full">Launch Ad</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="assets" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {generatedCampaign?.dragDropAssets.generatedImages.map((image: any, index: number) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                        <img src={image.url} alt={image.type} className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-2">
                        <Badge variant="outline" className="text-xs">{image.type}</Badge>
                        <p className="text-xs text-muted-foreground">{image.prompt}</p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full"
                          onClick={() => copyToClipboard(image.url)}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy URL
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="whatsapp" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <WhatsappLogo className="h-5 w-5" />
                    WhatsApp Sales Flow
                  </CardTitle>
                  <CardDescription>
                    Automated conversation sequences for maximum conversion
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {generatedCampaign?.marketingAssets.whatsappFlow && (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-semibold">Welcome Message</Label>
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm">{generatedCampaign.marketingAssets.whatsappFlow.welcomeMessage}</p>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-semibold">Product Presentation</Label>
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm">{generatedCampaign.marketingAssets.whatsappFlow.productPresentation}</p>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-semibold">Objection Handling</Label>
                        <div className="space-y-2">
                          {generatedCampaign.marketingAssets.whatsappFlow.objectionHandling.map((response: string, index: number) => (
                            <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <p className="text-sm">{response}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-semibold">Closing Messages</Label>
                        <div className="space-y-2">
                          {generatedCampaign.marketingAssets.whatsappFlow.closingMessages.map((message: string, index: number) => (
                            <div key={index} className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                              <p className="text-sm">{message}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full">
                        <WhatsappLogo className="h-4 w-4 mr-2" />
                        Set Up WhatsApp Bot
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => {
                setGeneratedCampaign(null)
                setCampaignSteps([])
                setGenerationProgress(0)
                setCampaignData({
                  productUrl: '',
                  productName: '',
                  description: '',
                  businessType: '',
                  targetAudience: '',
                  price: '',
                  cta: 'Buy Now',
                  budget: '',
                  goals: ''
                })
                setActiveAssetTab('overview')
              }}
              className="gap-2"
            >
              <MagicWand className="h-4 w-4" />
              Generate New Campaign
            </Button>
            <Button className="gap-2">
              <Play className="h-4 w-4" />
              Launch All Assets
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}