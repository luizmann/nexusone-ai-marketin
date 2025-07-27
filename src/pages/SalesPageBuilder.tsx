import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useCredits } from '@/contexts/CreditContext'
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
  Edit
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface PageTemplate {
  id: string
  name: string
  category: string
  preview: string
  conversionRate: string
  description: string
}

export const SalesPageBuilder: React.FC = () => {
  const { credits, useCredits, getCreditCost } = useCredits()
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [pageData, setPageData] = useState({
    title: '',
    description: '',
    productName: '',
    price: '',
    features: '',
    testimonials: '',
    cta: 'Buy Now'
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPage, setGeneratedPage] = useState<any>(null)

  const templates: PageTemplate[] = [
    {
      id: 'modern-minimal',
      name: 'Modern Minimal',
      category: 'Business',
      preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      conversionRate: '18.5%',
      description: 'Clean, professional design perfect for SaaS and digital products'
    },
    {
      id: 'ecommerce-hero',
      name: 'E-commerce Hero',
      category: 'E-commerce',
      preview: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
      conversionRate: '22.3%',
      description: 'Product-focused layout with strong visual hierarchy'
    },
    {
      id: 'service-landing',
      name: 'Service Landing',
      category: 'Services',
      preview: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop',
      conversionRate: '16.8%',
      description: 'Perfect for consultants, agencies, and service providers'
    },
    {
      id: 'course-promo',
      name: 'Course Promotion',
      category: 'Education',
      preview: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
      conversionRate: '25.1%',
      description: 'Optimized for online courses and educational content'
    },
    {
      id: 'app-download',
      name: 'App Download',
      category: 'Mobile',
      preview: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
      conversionRate: '19.7%',
      description: 'Mobile-first design for app promotion and downloads'
    },
    {
      id: 'webinar-signup',
      name: 'Webinar Signup',
      category: 'Events',
      preview: 'https://images.unsplash.com/photo-1515378791036-0648a814c963?w=400&h=300&fit=crop',
      conversionRate: '31.2%',
      description: 'High-converting layout for webinars and events'
    }
  ]

  const generatePage = async () => {
    if (!selectedTemplate || !pageData.title || !pageData.productName) {
      toast.error('Please select a template and fill required fields')
      return
    }

    const cost = getCreditCost('sales-page')
    if (!useCredits(cost)) {
      toast.error('Insufficient credits. Please upgrade your plan.')
      return
    }

    setIsGenerating(true)

    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 3000))

    const template = templates.find(t => t.id === selectedTemplate)
    setGeneratedPage({
      id: Date.now().toString(),
      title: pageData.title,
      template: template?.name,
      url: `https://nexusone.ai/p/${Date.now()}`,
      status: 'published',
      views: 0,
      conversions: 0,
      conversionRate: '0%',
      createdAt: new Date().toISOString()
    })

    setIsGenerating(false)
    toast.success('Sales page generated successfully!')
  }

  const resetBuilder = () => {
    setSelectedTemplate(null)
    setPageData({
      title: '',
      description: '',
      productName: '',
      price: '',
      features: '',
      testimonials: '',
      cta: 'Buy Now'
    })
    setGeneratedPage(null)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-xl">
            <Globe className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Sales Page Builder</h1>
        <p className="text-lg text-muted-foreground">
          Create high-converting landing pages with AI-powered optimization
        </p>
        <Badge variant="secondary" className="mt-2">
          {credits} Credits Available
        </Badge>
      </div>

      {!generatedPage ? (
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5" />
                Choose Template
              </CardTitle>
              <CardDescription>
                Select a high-converting template designed for your industry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <Card 
                    key={template.id}
                    className={`cursor-pointer hover:shadow-lg transition-all border-2 ${
                      selectedTemplate === template.id ? 'border-primary' : 'hover:border-primary/50'
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
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{template.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Page Configuration */}
          {selectedTemplate && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5" />
                  Page Content
                </CardTitle>
                <CardDescription>
                  Provide content for your sales page. AI will optimize the copy for conversions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="page-title">Page Title *</Label>
                    <Input
                      id="page-title"
                      placeholder="e.g., Revolutionary Fitness Tracker"
                      value={pageData.title}
                      onChange={(e) => setPageData(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="product-name">Product/Service Name *</Label>
                    <Input
                      id="product-name"
                      placeholder="e.g., FitTracker Pro"
                      value={pageData.productName}
                      onChange={(e) => setPageData(prev => ({ ...prev, productName: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Product Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your product benefits, what problems it solves..."
                    value={pageData.description}
                    onChange={(e) => setPageData(prev => ({ ...prev, description: e.target.value }))}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      placeholder="e.g., $99, Free, Contact Us"
                      value={pageData.price}
                      onChange={(e) => setPageData(prev => ({ ...prev, price: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cta">Call-to-Action Text</Label>
                    <Input
                      id="cta"
                      placeholder="e.g., Buy Now, Get Started, Download"
                      value={pageData.cta}
                      onChange={(e) => setPageData(prev => ({ ...prev, cta: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="features">Key Features (one per line)</Label>
                  <Textarea
                    id="features"
                    placeholder="24/7 Heart Rate Monitoring&#10;30-Day Battery Life&#10;Waterproof Design&#10;Smart Notifications"
                    value={pageData.features}
                    onChange={(e) => setPageData(prev => ({ ...prev, features: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="testimonials">Customer Testimonials</Label>
                  <Textarea
                    id="testimonials"
                    placeholder="Share any customer reviews, success stories, or testimonials..."
                    value={pageData.testimonials}
                    onChange={(e) => setPageData(prev => ({ ...prev, testimonials: e.target.value }))}
                  />
                </div>

                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:opacity-90"
                  onClick={generatePage}
                  disabled={isGenerating || !selectedTemplate || !pageData.title || !pageData.productName}
                >
                  {isGenerating ? (
                    <>
                      <Lightning className="h-5 w-5 mr-2 animate-pulse" />
                      Generating Sales Page...
                    </>
                  ) : (
                    <>
                      <Lightning className="h-5 w-5 mr-2" />
                      Generate Sales Page (30 Credits)
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        /* Generated Page Results */
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">🎉 Sales Page Created Successfully!</h2>
            <p className="text-muted-foreground">Your high-converting landing page is ready to launch</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Page Overview</span>
                <Badge variant="secondary">Live</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Page Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Title:</span>
                      <span className="font-medium">{generatedPage.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Template:</span>
                      <span className="font-medium">{generatedPage.template}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>URL:</span>
                      <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                        {generatedPage.url}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge variant="secondary">Published</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Performance</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Views:</span>
                      <span className="font-medium">{generatedPage.views}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conversions:</span>
                      <span className="font-medium">{generatedPage.conversions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Conversion Rate:</span>
                      <span className="font-medium">{generatedPage.conversionRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Created:</span>
                      <span className="font-medium">Just now</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Page Preview */}
              <div className="border rounded-lg p-4 bg-muted/20">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Page Preview
                </h3>
                <div className="bg-white border rounded-lg p-6 space-y-4">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">{pageData.title}</h1>
                    <p className="text-muted-foreground">{pageData.description}</p>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-48 h-32 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                      <span className="text-muted-foreground">Product Image</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">{pageData.price}</div>
                    <Button size="lg" className="bg-primary">
                      {pageData.cta}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  Desktop
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Mobile
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <SettingsIcon className="h-4 w-4" />
                  Settings
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="flex items-center gap-2">
                  <Share className="h-4 w-4" />
                  Share Page
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Embed Code
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={resetBuilder}
              >
                Create New Page
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default SalesPageBuilder