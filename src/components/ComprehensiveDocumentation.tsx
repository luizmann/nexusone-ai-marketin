import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { 
  BookOpen, 
  Code, 
  Zap, 
  Shield, 
  CreditCard, 
  Users,
  Sparkles,
  Video,
  MessageCircle,
  Target,
  Brain,
  ShoppingCart,
  BarChart3,
  Lightbulb,
  Globe,
  Magic,
  CheckCircle,
  AlertTriangle,
  Info,
  ArrowRight,
  Download,
  Link,
  Clock,
  Star
} from "@phosphor-icons/react"
import { useLanguage } from '../contexts/CleanLanguageContext'
import { LanguageSelector } from './LanguageSelector'

export function Documentation() {
  const { t, isRTL } = useLanguage()

  const modules = [
    {
      name: "Magic Pages",
      icon: <Magic size={24} className="text-purple-500" />,
      credits: 10,
      description: "AI-powered landing page generator",
      features: ["Template Library", "A/B Testing", "Conversion Analytics", "Custom Domains"],
      category: "Content Creation"
    },
    {
      name: "Video Creator",
      icon: <Video size={24} className="text-blue-500" />,
      credits: 25,
      description: "Generate professional videos with AI avatars",
      features: ["AI Avatars", "Voice Synthesis", "Auto Subtitles", "Multiple Formats"],
      category: "Content Creation"
    },
    {
      name: "WhatsApp Marketing",
      icon: <MessageCircle size={24} className="text-green-500" />,
      credits: 5,
      description: "Build powerful WhatsApp automation flows",
      features: ["Chatbots", "Broadcast Messages", "Contact Management", "Analytics"],
      category: "Communication"
    },
    {
      name: "Facebook Ads",
      icon: <Target size={24} className="text-red-500" />,
      credits: 15,
      description: "Create and optimize Facebook campaigns",
      features: ["Campaign Builder", "Auto Optimization", "Audience Targeting", "Performance Tracking"],
      category: "Advertising"
    },
    {
      name: "AI Agents",
      icon: <Brain size={24} className="text-indigo-500" />,
      credits: 20,
      description: "Custom virtual assistants for your business",
      features: ["Natural Language", "Task Automation", "Learning Capabilities", "Integration APIs"],
      category: "Automation"
    },
    {
      name: "Dropshipping",
      icon: <ShoppingCart size={24} className="text-orange-500" />,
      credits: 3,
      description: "Complete e-commerce and dropshipping solution",
      features: ["Product Import", "Inventory Sync", "Order Management", "Supplier Integration"],
      category: "E-commerce"
    },
    {
      name: "CRM System",
      icon: <Users size={24} className="text-cyan-500" />,
      credits: 5,
      description: "Manage leads and customers effectively",
      features: ["Contact Management", "Lead Scoring", "Pipeline Tracking", "Email Integration"],
      category: "Customer Management"
    },
    {
      name: "Generate Income",
      icon: <Lightbulb size={24} className="text-yellow-500" />,
      credits: 8,
      description: "Discover business opportunities with AI",
      features: ["Market Analysis", "Opportunity Detection", "Revenue Forecasting", "Trend Analysis"],
      category: "Business Intelligence"
    },
    {
      name: "Social Media",
      icon: <Sparkles size={24} className="text-pink-500" />,
      credits: 5,
      description: "Create content for all social networks",
      features: ["Multi-Platform", "Content Calendar", "Auto Posting", "Engagement Analytics"],
      category: "Social Media"
    },
    {
      name: "Analytics Hub",
      icon: <BarChart3 size={24} className="text-emerald-500" />,
      credits: 0,
      description: "Comprehensive performance dashboards",
      features: ["Real-time Metrics", "Custom Reports", "Data Export", "Trend Analysis"],
      category: "Analytics"
    }
  ]

  const integrations = [
    { name: "OpenAI GPT-4o", type: "AI", description: "Advanced language model for content generation" },
    { name: "D-ID", type: "Video", description: "AI avatar and video generation" },
    { name: "ElevenLabs", type: "Audio", description: "Text-to-speech synthesis" },
    { name: "Replicate", type: "AI", description: "Image generation and processing" },
    { name: "Facebook Marketing API", type: "Social", description: "Facebook and Instagram advertising" },
    { name: "WhatsApp Business API", type: "Communication", description: "WhatsApp messaging automation" },
    { name: "CJ Dropshipping", type: "E-commerce", description: "Product sourcing and fulfillment" },
    { name: "DSers", type: "E-commerce", description: "Dropshipping management" },
    { name: "Shopify", type: "E-commerce", description: "Online store integration" },
    { name: "Pexels", type: "Media", description: "Stock photos and videos" },
    { name: "Unsplash", type: "Media", description: "High-quality photography" },
    { name: "YouTube API", type: "Video", description: "Video upload and management" }
  ]

  const pricingPlans = [
    {
      name: "FREE",
      price: "$0",
      period: "month",
      credits: "50",
      videos: "2",
      whatsapp: "1",
      modules: "5",
      features: ["Basic modules", "Email support", "Community access"]
    },
    {
      name: "PRO",
      price: "$97",
      period: "month",
      credits: "500",
      videos: "20",
      whatsapp: "5",
      modules: "8",
      features: ["Advanced modules", "Priority support", "Advanced analytics", "API access"],
      popular: true
    },
    {
      name: "PREMIUM",
      price: "$297",
      period: "month",
      credits: "2000",
      videos: "100",
      whatsapp: "20",
      modules: "10",
      features: ["All modules", "24/7 support", "White-label", "Custom training", "Dedicated account manager"]
    }
  ]

  return (
    <div className={`min-h-screen bg-gradient-to-br from-background to-secondary/20 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BookOpen size={32} className="text-accent" />
            <h1 className="text-2xl font-bold">NexusOne Documentation</h1>
          </div>
          <LanguageSelector />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8">
              <TabsTrigger value="overview">{t('docs.overview')}</TabsTrigger>
              <TabsTrigger value="modules">{t('docs.modules')}</TabsTrigger>
              <TabsTrigger value="pricing">{t('docs.pricing')}</TabsTrigger>
              <TabsTrigger value="api">{t('docs.api')}</TabsTrigger>
              <TabsTrigger value="integrations">{t('docs.integrations')}</TabsTrigger>
              <TabsTrigger value="support">{t('docs.support')}</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="text-accent" />
                    {t('docs.what_is_nexusone')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-lg text-muted-foreground">
                    {t('docs.platform_description')}
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <CheckCircle size={20} className="text-green-500" />
                        {t('docs.key_features')}
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground pl-6">
                        <li>• 10 integrated marketing modules</li>
                        <li>• AI-powered content generation</li>
                        <li>• Real-time analytics and insights</li>
                        <li>• Multi-language support (5 languages)</li>
                        <li>• Credit-based usage system</li>
                        <li>• Enterprise-grade security</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Star size={20} className="text-yellow-500" />
                        {t('docs.supported_languages')}
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <Badge variant="outline">🇺🇸 English</Badge>
                        <Badge variant="outline">🇪🇸 Español</Badge>
                        <Badge variant="outline">🇧🇷 Português</Badge>
                        <Badge variant="outline">🇮🇱 עברית</Badge>
                        <Badge variant="outline">🇸🇦 العربية</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Info size={20} className="text-blue-500 mt-0.5" />
                      <div>
                        <h5 className="font-semibold text-blue-800 mb-1">{t('docs.getting_started')}</h5>
                        <p className="text-sm text-blue-700">
                          {t('docs.getting_started_desc')}
                        </p>
                        <Button className="mt-3" size="sm">
                          {t('docs.quick_start_guide')}
                          <ArrowRight size={16} className="ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="text-green-500" />
                    {t('docs.system_requirements')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">{t('docs.browser_support')}</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Chrome 90+ (Recommended)</li>
                        <li>• Firefox 88+</li>
                        <li>• Safari 14+</li>
                        <li>• Edge 90+</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">{t('docs.minimum_requirements')}</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• 4GB RAM</li>
                        <li>• Stable internet connection</li>
                        <li>• JavaScript enabled</li>
                        <li>• Cookies enabled</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Modules Tab */}
            <TabsContent value="modules" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">{t('docs.available_modules')}</h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  {t('docs.modules_description')}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((module, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        {module.icon}
                        <Badge variant={module.credits === 0 ? "secondary" : "default"}>
                          {module.credits === 0 ? t('common.free') : `${module.credits} ${t('common.credits')}`}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{module.name}</CardTitle>
                      <Badge variant="outline" className="w-fit">
                        {module.category}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {module.description}
                      </p>
                      <div>
                        <h5 className="font-semibold text-sm mb-2">{t('docs.features')}:</h5>
                        <ul className="space-y-1">
                          {module.features.map((feature, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                              <CheckCircle size={12} className="text-green-500" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Pricing Tab */}
            <TabsContent value="pricing" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">{t('docs.pricing_plans')}</h2>
                <p className="text-lg text-muted-foreground">
                  {t('docs.pricing_description')}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {pricingPlans.map((plan, index) => (
                  <Card key={index} className={`relative ${plan.popular ? 'border-purple-500 shadow-lg' : ''}`}>
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-purple-500 text-white px-4 py-1">
                          {t('pricing.most_popular')}
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <div className="text-3xl font-bold">
                        {plan.price}
                        <span className="text-sm font-normal text-muted-foreground">/{plan.period}</span>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center p-2 bg-purple-50 rounded">
                          <div className="font-semibold">{plan.credits}</div>
                          <div className="text-muted-foreground">{t('common.credits')}</div>
                        </div>
                        <div className="text-center p-2 bg-blue-50 rounded">
                          <div className="font-semibold">{plan.videos}</div>
                          <div className="text-muted-foreground">{t('common.videos')}</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded">
                          <div className="font-semibold">{plan.whatsapp}</div>
                          <div className="text-muted-foreground">WhatsApp</div>
                        </div>
                        <div className="text-center p-2 bg-orange-50 rounded">
                          <div className="font-semibold">{plan.modules}</div>
                          <div className="text-muted-foreground">{t('common.modules')}</div>
                        </div>
                      </div>
                      
                      <ul className="space-y-2">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle size={16} className="text-green-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      
                      <Button className={`w-full ${plan.popular ? 'bg-purple-600 hover:bg-purple-700' : ''}`}>
                        {t('common.get_started')}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-4xl mx-auto">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={24} className="text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-2">{t('docs.credit_system')}</h4>
                    <p className="text-sm text-yellow-700 mb-3">
                      {t('docs.credit_system_desc')}
                    </p>
                    <ul className="space-y-1 text-sm text-yellow-700">
                      <li>• Credits reset monthly on your billing date</li>
                      <li>• Unused credits don't roll over to the next month</li>
                      <li>• You can purchase additional credits if needed</li>
                      <li>• Some features (like Analytics) are free and don't use credits</li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* API Tab */}
            <TabsContent value="api" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="text-blue-500" />
                    {t('docs.api_documentation')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground">
                    {t('docs.api_description')}
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">{t('docs.authentication')}</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <code className="text-sm">
                          Authorization: Bearer YOUR_API_KEY
                        </code>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t('docs.api_key_info')}
                      </p>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold">{t('docs.base_url')}</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <code className="text-sm">
                          https://api.nexusone.ai/v1/
                        </code>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {t('docs.api_version_info')}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">{t('docs.available_endpoints')}</h4>
                    <div className="space-y-3">
                      {[
                        { method: 'POST', endpoint: '/magic-pages', description: 'Create landing pages' },
                        { method: 'POST', endpoint: '/video-creator', description: 'Generate videos' },
                        { method: 'POST', endpoint: '/whatsapp/send', description: 'Send WhatsApp messages' },
                        { method: 'GET', endpoint: '/analytics', description: 'Retrieve analytics data' },
                        { method: 'GET', endpoint: '/credits', description: 'Check credit balance' }
                      ].map((endpoint, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <Badge variant={endpoint.method === 'GET' ? 'secondary' : 'default'}>
                            {endpoint.method}
                          </Badge>
                          <code className="text-sm flex-1">{endpoint.endpoint}</code>
                          <span className="text-sm text-muted-foreground">{endpoint.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button>
                      <Download size={16} className="mr-2" />
                      {t('docs.download_postman')}
                    </Button>
                    <Button variant="outline">
                      <Link size={16} className="mr-2" />
                      {t('docs.api_reference')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Integrations Tab */}
            <TabsContent value="integrations" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">{t('docs.third_party_integrations')}</h2>
                <p className="text-lg text-muted-foreground">
                  {t('docs.integrations_description')}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrations.map((integration, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <Badge variant="outline">{integration.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {integration.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>{t('docs.custom_integrations')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {t('docs.custom_integrations_desc')}
                  </p>
                  <Button>
                    {t('docs.request_integration')}
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Support Tab */}
            <TabsContent value="support" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">{t('docs.support_center')}</h2>
                <p className="text-lg text-muted-foreground">
                  {t('docs.support_description')}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="text-blue-500" />
                      {t('docs.support_hours')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>{t('docs.email_support')}</span>
                      <span className="text-muted-foreground">24/7</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('docs.live_chat')}</span>
                      <span className="text-muted-foreground">9 AM - 6 PM UTC</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('docs.phone_support')}</span>
                      <span className="text-muted-foreground">Premium only</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="text-green-500" />
                      {t('docs.global_support')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {t('docs.multilingual_support')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">English</Badge>
                      <Badge variant="outline">Español</Badge>
                      <Badge variant="outline">Português</Badge>
                      <Badge variant="outline">עברית</Badge>
                      <Badge variant="outline">العربية</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>{t('docs.contact_options')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Button className="h-auto p-4 flex-col">
                      <MessageCircle size={24} className="mb-2" />
                      <span>{t('docs.start_chat')}</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex-col">
                      <Users size={24} className="mb-2" />
                      <span>{t('docs.community_forum')}</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex-col">
                      <BookOpen size={24} className="mb-2" />
                      <span>{t('docs.knowledge_base')}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle size={24} className="text-green-600" />
                  <h4 className="font-semibold text-green-800">{t('docs.satisfaction_guarantee')}</h4>
                </div>
                <p className="text-sm text-green-700">
                  {t('docs.satisfaction_guarantee_desc')}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}