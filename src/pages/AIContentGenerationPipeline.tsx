import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { useLanguage } from '@/contexts/LanguageContext'
import { AIContentGenerationService } from '@/services/aiContentGeneration'
import { 
  Loader2, 
  Play, 
  CheckCircle, 
  AlertCircle, 
  Target, 
  BarChart3, 
  Zap, 
  Globe,
  Video,
  MessageSquare,
  Image,
  ShoppingCart,
  TrendingUp,
  Users,
  Heart,
  Share2,
  Download,
  Eye,
  DollarSign,
  Sparkles,
  Save,
  History
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface AIGenerationResult {
  step: string
  status: 'pending' | 'running' | 'completed' | 'error'
  result?: any
  error?: string
  duration?: number
}

interface ProductData {
  name: string
  description: string
  price: number
  category: string
  targetAudience: string
  keyFeatures: string[]
  images: string[]
  supplier: string
}

interface GeneratedContent {
  landingPage?: {
    headline: string
    subheadline: string
    benefits: string[]
    cta: string
    testimonials: any[]
  }
  facebookAd?: {
    headline: string
    description: string
    cta: string
    targetAudience: any
    budget: number
  }
  videoScript?: {
    hook: string
    problem: string
    solution: string
    benefits: string[]
    cta: string
  }
  whatsappBot?: {
    greeting: string
    productInfo: string
    objectionHandling: string[]
    closingScript: string
  }
  seoContent?: {
    title: string
    metaDescription: string
    keywords: string[]
    content: string
  }
}

export function AIContentGenerationPipeline() {
  const { t, language } = useLanguage()
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<AIGenerationResult[]>([])
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent>({})
  const [selectedProduct, setSelectedProduct] = useState<ProductData | null>(null)
  
  // Sample product data for testing
  const sampleProducts: ProductData[] = [
    {
      name: "Wireless Bluetooth Earbuds Pro",
      description: "Premium quality wireless earbuds with noise cancellation and 24-hour battery life",
      price: 89.99,
      category: "Electronics",
      targetAudience: "Young professionals, fitness enthusiasts, music lovers",
      keyFeatures: ["Active Noise Cancellation", "24H Battery", "Waterproof IPX7", "Touch Controls"],
      images: ["earbud1.jpg", "earbud2.jpg"],
      supplier: "TechSupplier Co."
    },
    {
      name: "Smart Home Security Camera",
      description: "AI-powered security camera with night vision and mobile app control",
      price: 149.99,
      category: "Home Security",
      targetAudience: "Homeowners, security-conscious individuals, tech enthusiasts",
      keyFeatures: ["4K Resolution", "Night Vision", "AI Detection", "Cloud Storage"],
      images: ["camera1.jpg", "camera2.jpg"],
      supplier: "SecurityTech Ltd."
    },
    {
      name: "Portable Phone Charger Power Bank",
      description: "High-capacity portable charger with fast charging and multiple ports",
      price: 39.99,
      category: "Mobile Accessories",
      targetAudience: "Travelers, students, remote workers, mobile users",
      keyFeatures: ["20000mAh Capacity", "Fast Charging", "3 USB Ports", "LED Display"],
      images: ["powerbank1.jpg", "powerbank2.jpg"],
      supplier: "PowerTech Solutions"
    }
  ]

  const generationSteps = [
    { id: 'product-analysis', name: 'Product Analysis & Market Research', icon: Target },
    { id: 'audience-research', name: 'Target Audience Research', icon: Users },
    { id: 'competitor-analysis', name: 'Competitor Analysis', icon: BarChart3 },
    { id: 'landing-page', name: 'Landing Page Generation', icon: Globe },
    { id: 'facebook-ads', name: 'Facebook Ads Creation', icon: Share2 },
    { id: 'video-script', name: 'Video Script Generation', icon: Video },
    { id: 'whatsapp-bot', name: 'WhatsApp Bot Setup', icon: MessageSquare },
    { id: 'seo-content', name: 'SEO Content Creation', icon: TrendingUp },
    { id: 'validation-metrics', name: 'Validation Metrics Setup', icon: Sparkles }
  ]

  const executeAIGeneration = async () => {
    if (!selectedProduct) {
      toast.error('Please select a product first')
      return
    }

    setIsRunning(true)
    setProgress(0)
    setResults([])
    setGeneratedContent({})

    const stepDuration = 100 / generationSteps.length

    for (let i = 0; i < generationSteps.length; i++) {
      const step = generationSteps[i]
      
      // Update step to running
      setResults(prev => [...prev, {
        step: step.name,
        status: 'running'
      }])

      try {
        const startTime = Date.now()
        
        // Use real AI service
        const result = await AIContentGenerationService.generateContentForStep(
          step.id, 
          selectedProduct, 
          language
        )
        
        const duration = Date.now() - startTime
        
        // Update step to completed
        setResults(prev => prev.map((r, idx) => 
          idx === i ? { ...r, status: 'completed', result, duration } : r
        ))

        // Update generated content
        setGeneratedContent(prev => ({ ...prev, ...result }))

        // Update progress
        setProgress((i + 1) * stepDuration)
        
        // Small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 300))
        
      } catch (error) {
        setResults(prev => prev.map((r, idx) => 
          idx === i ? { ...r, status: 'error', error: error.message } : r
        ))
        toast.error(`Error in ${step.name}: ${error.message}`)
      }
    }

    // Save results
    try {
      await AIContentGenerationService.saveGenerationResults(
        selectedProduct.name,
        generatedContent,
        language
      )
      toast.success('AI Content Generation Pipeline Completed and Saved!')
    } catch (error) {
      toast.success('AI Content Generation Pipeline Completed!')
      console.error('Error saving results:', error)
    }

    setIsRunning(false)
  }

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-accent" />
            AI Content Generation Pipeline
          </h1>
          <p className="text-muted-foreground">
            Complete automated content generation for product validation and marketing
          </p>
        </div>

        {/* Product Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Select Product for Testing
            </CardTitle>
            <CardDescription>
              Choose a product to generate complete marketing assets and validation content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sampleProducts.map((product, index) => (
                <Card 
                  key={index}
                  className={`cursor-pointer transition-all ${
                    selectedProduct?.name === product.name 
                      ? 'ring-2 ring-accent border-accent' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedProduct(product)}
                >
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Badge variant="secondary">{product.category}</Badge>
                        <span className="font-bold text-accent">${product.price}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {product.keyFeatures.slice(0, 2).map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Generation Controls */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Execute AI Generation Pipeline</h3>
                  <p className="text-sm text-muted-foreground">
                    Generate complete marketing ecosystem for product validation
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={language} onValueChange={(value) => console.log('Language change:', value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                      <SelectItem value="es">🇪🇸 Español</SelectItem>
                      <SelectItem value="pt">🇧🇷 Português</SelectItem>
                      <SelectItem value="ar">🇸🇦 العربية</SelectItem>
                      <SelectItem value="he">🇮🇱 עברית</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={executeAIGeneration}
                    disabled={!selectedProduct || isRunning}
                    size="lg"
                    className="min-w-[150px]"
                  >
                    {isRunning ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Start Pipeline
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              {isRunning && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Using advanced AI models to generate high-converting content...
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pipeline Status */}
        {results.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Pipeline Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {generationSteps.map((step, index) => {
                  const result = results[index]
                  const StepIcon = step.icon
                  
                  return (
                    <div key={step.id} className="flex items-center gap-3 p-3 rounded-lg border">
                      <StepIcon className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{step.name}</span>
                          {result && (
                            <div className="flex items-center gap-2">
                              {result.duration && (
                                <span className="text-xs text-muted-foreground">
                                  {result.duration}ms
                                </span>
                              )}
                              {getStepIcon(result.status)}
                            </div>
                          )}
                        </div>
                        {result?.error && (
                          <p className="text-sm text-red-500 mt-1">{result.error}</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generated Content Display */}
        {Object.keys(generatedContent).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Generated Content Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="landing-page" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="landing-page">Landing Page</TabsTrigger>
                  <TabsTrigger value="facebook-ad">Facebook Ad</TabsTrigger>
                  <TabsTrigger value="video-script">Video Script</TabsTrigger>
                  <TabsTrigger value="whatsapp-bot">WhatsApp Bot</TabsTrigger>
                </TabsList>
                
                <TabsContent value="landing-page" className="space-y-4">
                  {generatedContent.landingPage && (
                    <div className="space-y-4">
                      <div>
                        <Label>Headline</Label>
                        <div className="p-3 bg-muted rounded-md">
                          <h2 className="text-xl font-bold">{generatedContent.landingPage.headline}</h2>
                        </div>
                      </div>
                      <div>
                        <Label>Benefits</Label>
                        <div className="p-3 bg-muted rounded-md">
                          <ul className="space-y-1">
                            {generatedContent.landingPage.benefits.map((benefit, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="facebook-ad" className="space-y-4">
                  {generatedContent.facebookAd && (
                    <div className="space-y-4">
                      <div>
                        <Label>Ad Copy</Label>
                        <div className="p-3 bg-muted rounded-md">
                          <h3 className="font-bold mb-2">{generatedContent.facebookAd.headline}</h3>
                          <p>{generatedContent.facebookAd.description}</p>
                          <Button className="mt-2" size="sm">{generatedContent.facebookAd.cta}</Button>
                        </div>
                      </div>
                      <div>
                        <Label>Target Audience</Label>
                        <div className="p-3 bg-muted rounded-md">
                          <p><strong>Age:</strong> {generatedContent.facebookAd.targetAudience.age}</p>
                          <p><strong>Interests:</strong> {generatedContent.facebookAd.targetAudience.interests.join(', ')}</p>
                          <p><strong>Daily Budget:</strong> ${generatedContent.facebookAd.budget}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="video-script" className="space-y-4">
                  {generatedContent.videoScript && (
                    <div className="space-y-4">
                      {Object.entries(generatedContent.videoScript).map(([key, value]) => (
                        <div key={key}>
                          <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                          <div className="p-3 bg-muted rounded-md">
                            {Array.isArray(value) ? (
                              <ul className="space-y-1">
                                {value.map((item, idx) => (
                                  <li key={idx}>• {item}</li>
                                ))}
                              </ul>
                            ) : (
                              <p>{value}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="whatsapp-bot" className="space-y-4">
                  {generatedContent.whatsappBot && (
                    <div className="space-y-4">
                      {Object.entries(generatedContent.whatsappBot).map(([key, value]) => (
                        <div key={key}>
                          <Label className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                          <div className="p-3 bg-muted rounded-md">
                            {Array.isArray(value) ? (
                              <ul className="space-y-1">
                                {value.map((item, idx) => (
                                  <li key={idx}>• {item}</li>
                                ))}
                              </ul>
                            ) : (
                              <p>{value}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Validation Metrics */}
        {generatedContent.kpis && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Validation Metrics & KPIs
              </CardTitle>
              <CardDescription>
                Track these metrics to validate product market fit and optimize performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {generatedContent.kpis.map((kpi, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{kpi.metric}</span>
                      <Badge variant="outline">{kpi.target}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {kpi.description}
                    </p>
                    <div className="flex justify-between items-center text-sm">
                      <span>Current: {kpi.current}</span>
                      <span className="text-xs text-muted-foreground">Target: {kpi.target}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Testing Plan */}
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Testing & Validation Plan</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  {generatedContent.testingPlan || "A/B test all generated assets over 7-14 days with statistical significance"}
                </p>
                
                {generatedContent.successCriteria && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Success Criteria:</h5>
                    {Object.entries(generatedContent.successCriteria).map(([phase, criteria], idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <Badge variant="secondary" className="text-xs">
                          {phase.replace('phase', 'Phase ')}
                        </Badge>
                        <span className="text-muted-foreground">{criteria}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        {Object.keys(generatedContent).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Deploy and test your generated content immediately
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="h-20 flex-col gap-2" variant="outline">
                  <Globe className="h-5 w-5" />
                  <span className="text-sm">Deploy Landing Page</span>
                </Button>
                <Button className="h-20 flex-col gap-2" variant="outline">
                  <Share2 className="h-5 w-5" />
                  <span className="text-sm">Launch Facebook Campaign</span>
                </Button>
                <Button className="h-20 flex-col gap-2" variant="outline">
                  <MessageSquare className="h-5 w-5" />
                  <span className="text-sm">Setup WhatsApp Bot</span>
                </Button>
                <Button className="h-20 flex-col gap-2" variant="outline">
                  <Video className="h-5 w-5" />
                  <span className="text-sm">Generate Video</span>
                </Button>
                <Button className="h-20 flex-col gap-2" variant="outline">
                  <Download className="h-5 w-5" />
                  <span className="text-sm">Export All Assets</span>
                </Button>
                <Button className="h-20 flex-col gap-2" variant="outline">
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-sm">Setup Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Real-time Testing Status */}
        {Object.keys(generatedContent).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Live Testing Dashboard
              </CardTitle>
              <CardDescription>
                Monitor real-time performance of your generated content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-500">0</div>
                  <div className="text-sm text-muted-foreground">Landing Page Views</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-500">0%</div>
                  <div className="text-sm text-muted-foreground">Conversion Rate</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-500">$0</div>
                  <div className="text-sm text-muted-foreground">Ad Spend</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-accent">0x</div>
                  <div className="text-sm text-muted-foreground">ROAS</div>
                </div>
              </div>
              
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Connect your tracking pixels and analytics to see real-time data. 
                  <Button variant="link" className="p-0 h-auto ml-2">Setup tracking →</Button>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}