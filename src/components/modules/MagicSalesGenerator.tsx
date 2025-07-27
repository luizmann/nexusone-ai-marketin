import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useLanguage } from '@/contexts/LanguageContext'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { 
  Globe, 
  Zap, 
  Eye, 
  Edit, 
  Share2, 
  Download,
  ExternalLink,
  Sparkles,
  TrendingUp
} from '@phosphor-icons/react'

interface GeneratedPage {
  id: string
  url: string
  productData: any
  generatedHtml: string
  createdAt: string
  views: number
  conversions: number
  status: 'generating' | 'completed' | 'error'
}

export function MagicSalesGenerator() {
  const { t } = useLanguage()
  const [inputUrl, setInputUrl] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const [generatedPages, setGeneratedPages] = useKV<GeneratedPage[]>('generated-sales-pages', [])
  const [userCredits, setUserCredits] = useKV('user-credits', { general: 500 })

  const generationSteps = [
    'Analyzing product URL...',
    'Extracting product data...',
    'Analyzing competitors...',
    'Generating copywriting...',
    'Creating design layout...',
    'Optimizing for conversions...',
    'Finalizing sales page...'
  ]

  const handleGenerate = async () => {
    if (!inputUrl.trim()) {
      toast.error('Please enter a product URL')
      return
    }

    if (userCredits.general < 15) {
      toast.error('Insufficient credits. You need 15 credits to generate a sales page.')
      return
    }

    setIsGenerating(true)
    setGenerationProgress(0)

    try {
      const newPage: GeneratedPage = {
        id: Date.now().toString(),
        url: inputUrl,
        productData: null,
        generatedHtml: '',
        createdAt: new Date().toISOString(),
        views: 0,
        conversions: 0,
        status: 'generating'
      }

      setGeneratedPages(prev => [newPage, ...prev])

      // Simulate AI generation process
      for (let i = 0; i < generationSteps.length; i++) {
        setCurrentStep(generationSteps[i])
        setGenerationProgress((i + 1) / generationSteps.length * 100)
        
        // Real API call would go here
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        if (i === 1) {
          // Simulate product data extraction
          newPage.productData = {
            title: 'Premium Wireless Headphones',
            price: '$129.99',
            originalPrice: '$199.99',
            description: 'High-quality wireless headphones with noise cancellation',
            images: ['/api/placeholder/400/400'],
            features: ['Noise Cancellation', '30hr Battery', 'Wireless Charging'],
            reviews: 4.8,
            inStock: true
          }
        }
      }

      // Simulate successful generation
      newPage.status = 'completed'
      newPage.generatedHtml = generateSalesPageHTML(newPage.productData)

      setGeneratedPages(prev => 
        prev.map(page => page.id === newPage.id ? newPage : page)
      )

      // Deduct credits
      setUserCredits(prev => ({
        ...prev,
        general: prev.general - 15
      }))

      toast.success('Sales page generated successfully!')
      setInputUrl('')

    } catch (error) {
      toast.error('Failed to generate sales page')
    } finally {
      setIsGenerating(false)
      setGenerationProgress(0)
      setCurrentStep('')
    }
  }

  const generateSalesPageHTML = (productData: any) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${productData.title} - Limited Time Offer</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">
    <div class="max-w-4xl mx-auto p-6">
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="p-8 text-center">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">${productData.title}</h1>
                <p class="text-xl text-gray-600 mb-6">${productData.description}</p>
                <div class="flex items-center justify-center space-x-4 mb-8">
                    <span class="text-3xl font-bold text-green-600">${productData.price}</span>
                    <span class="text-xl text-gray-400 line-through">${productData.originalPrice}</span>
                    <span class="bg-red-500 text-white px-3 py-1 rounded-full text-sm">35% OFF</span>
                </div>
                <button class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-colors">
                    Order Now - Limited Time!
                </button>
            </div>
        </div>
    </div>
</body>
</html>`
  }

  const handlePreview = (page: GeneratedPage) => {
    const newWindow = window.open('', '_blank')
    if (newWindow) {
      newWindow.document.write(page.generatedHtml)
      newWindow.document.close()
    }
  }

  const handleEdit = (page: GeneratedPage) => {
    // Navigate to drag & drop editor
    window.location.href = `/page-editor?page=${page.id}`
  }

  const handlePublish = (page: GeneratedPage) => {
    toast.success('Page published successfully!')
    // In real implementation, this would publish to a public URL
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-purple-500" />
          Magic Sales Generator
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Transform any product URL into a high-converting sales page using advanced AI. 
          Perfect for dropshipping, affiliate marketing, and product launches.
        </p>
      </div>

      {/* URL Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Product URL Input
          </CardTitle>
          <CardDescription>
            Paste any product URL from Amazon, AliExpress, Shopify stores, or any e-commerce site
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="url">Product URL</Label>
              <Input
                id="url"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://example.com/product/amazing-gadget"
                disabled={isGenerating}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating || !inputUrl.trim()}
                className="w-full sm:w-auto min-w-[140px]"
              >
                {isGenerating ? (
                  <>
                    <Zap className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Page
                  </>
                )}
              </Button>
            </div>
          </div>

          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{currentStep}</span>
                <span>{Math.round(generationProgress)}%</span>
              </div>
              <Progress value={generationProgress} className="w-full" />
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Cost: 15 credits per generation</span>
            <span>Available: {userCredits.general} credits</span>
          </div>
        </CardContent>
      </Card>

      {/* Generated Pages */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Generated Sales Pages</h2>
          <Badge variant="secondary">
            {generatedPages.length} page{generatedPages.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        {generatedPages.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No sales pages yet</h3>
              <p className="text-muted-foreground mb-4">
                Generate your first AI-powered sales page by entering a product URL above
              </p>
              <div className="text-sm text-muted-foreground">
                ✨ AI analyzes products and creates optimized pages<br/>
                🎨 Professional designs that convert<br/>
                📱 Mobile-responsive and fast-loading
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {generatedPages.map((page) => (
              <Card key={page.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate">
                        {page.productData?.title || 'Analyzing...'}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {new Date(page.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant={page.status === 'completed' ? 'default' : 
                               page.status === 'generating' ? 'secondary' : 'destructive'}
                    >
                      {page.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0 space-y-4">
                  {page.productData && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Price</span>
                        <span className="font-medium">{page.productData.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Views</span>
                        <span className="font-medium">{page.views}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Conversions</span>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{page.conversions}</span>
                          <TrendingUp className="h-3 w-3 text-green-500" />
                        </div>
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePreview(page)}
                      disabled={page.status !== 'completed'}
                      className="flex-1"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(page)}
                      disabled={page.status !== 'completed'}
                      className="flex-1"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>

                  <Button
                    onClick={() => handlePublish(page)}
                    disabled={page.status !== 'completed'}
                    className="w-full"
                    size="sm"
                  >
                    <Share2 className="h-3 w-3 mr-1" />
                    Publish & Share
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Features Info */}
      <Card>
        <CardHeader>
          <CardTitle>Magic Sales Generator Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">🧠 AI-Powered Analysis</h4>
              <p className="text-sm text-muted-foreground">
                Advanced AI analyzes product data, competitor pages, and market trends to create optimal sales copy
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">🎨 Professional Design</h4>
              <p className="text-sm text-muted-foreground">
                Mobile-responsive designs with proven conversion patterns and modern aesthetics
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">⚡ Lightning Fast</h4>
              <p className="text-sm text-muted-foreground">
                Generate complete sales pages in under 2 minutes with optimized loading speeds
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">📊 Conversion Optimized</h4>
              <p className="text-sm text-muted-foreground">
                Built-in A/B testing elements, trust signals, and psychological triggers for maximum conversions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}