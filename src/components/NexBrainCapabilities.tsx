import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Brain, Zap, MessageSquare, Video, TrendingUp, Target } from 'lucide-react'

interface Feature {
  name: string
  description: string
  icon: any
  benefits: string[]
  creditCost: number
  examples: string[]
}

export function NexBrainCapabilities() {
  const features: Feature[] = [
    {
      name: 'Magic Page Generator',
      description: 'AI-powered sales page creation with conversion optimization',
      icon: Zap,
      benefits: [
        'Compelling headlines with emotional hooks',
        'Problem-focused content structure',
        'Built-in social proof elements',
        'Mobile-responsive design',
        'SEO optimization'
      ],
      creditCost: 15,
      examples: [
        'Product sales pages',
        'Service landing pages',
        'Course enrollment pages',
        'App download pages'
      ]
    },
    {
      name: 'Facebook Ads Campaign Generator',
      description: 'Complete ad campaign creation with targeting and creatives',
      icon: TrendingUp,
      benefits: [
        'Multiple ad copy variations',
        'Audience targeting suggestions',
        'Creative concept development',
        'Budget allocation strategy',
        'A/B testing recommendations'
      ],
      creditCost: 20,
      examples: [
        'E-commerce product ads',
        'Lead generation campaigns',
        'Brand awareness campaigns',
        'Retargeting sequences'
      ]
    },
    {
      name: 'WhatsApp Sales Flow',
      description: 'Automated conversation flows for lead nurturing and sales',
      icon: MessageSquare,
      benefits: [
        'Welcome message sequences',
        'Objection handling responses',
        'Urgency and scarcity tactics',
        'Payment flow automation',
        'Follow-up sequences'
      ],
      creditCost: 10,
      examples: [
        'Product inquiry responses',
        'Service booking flows',
        'Customer support automation',
        'Order processing sequences'
      ]
    },
    {
      name: 'Video Script Generation',
      description: 'Professional video scripts for marketing and sales',
      icon: Video,
      benefits: [
        'Scene-by-scene breakdowns',
        'Voiceover scripts',
        'Visual descriptions',
        'Call-to-action placement',
        'Mobile optimization'
      ],
      creditCost: 12,
      examples: [
        'Product demonstration videos',
        'Testimonial video scripts',
        'Explainer video content',
        'Social media video content'
      ]
    },
    {
      name: 'Campaign Performance Analysis',
      description: 'AI-driven insights and optimization recommendations',
      icon: Target,
      benefits: [
        'Performance trend analysis',
        'Optimization suggestions',
        'ROI improvement strategies',
        'Audience insights',
        'Competitor analysis'
      ],
      creditCost: 8,
      examples: [
        'Campaign performance reports',
        'Optimization recommendations',
        'Audience behavior analysis',
        'Conversion rate improvements'
      ]
    }
  ]

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Brain className="h-6 w-6 text-primary" />
            NexBrain AI Assistant Capabilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            NexBrain is your AI-powered marketing assistant that automates content creation, 
            campaign generation, and performance optimization. Here's what it can do for your business:
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Features Overview</TabsTrigger>
          <TabsTrigger value="examples">Use Cases</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{feature.name}</h3>
                        <Badge variant="secondary">{feature.creditCost} credits</Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-3">{feature.description}</p>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Key Benefits:</h4>
                          <ul className="text-sm space-y-1">
                            {feature.benefits.map((benefit, idx) => (
                              <li key={idx} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2">Use Cases:</h4>
                          <ul className="text-sm space-y-1">
                            {feature.examples.map((example, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full"></div>
                                {example}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="examples" className="space-y-4">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🏪 E-commerce Business</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Workflow:</h4>
                    <ol className="text-sm space-y-1 text-muted-foreground">
                      <li>1. Import trending products</li>
                      <li>2. Generate product sales pages</li>
                      <li>3. Create Facebook ad campaigns</li>
                      <li>4. Set up WhatsApp sales flow</li>
                      <li>5. Monitor and optimize performance</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Expected Results:</h4>
                    <ul className="text-sm space-y-1 text-green-600">
                      <li>• 70% faster campaign setup</li>
                      <li>• 40% higher conversion rates</li>
                      <li>• 60% reduced ad spend waste</li>
                      <li>• 24/7 automated customer engagement</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🎓 Digital Course Creator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Workflow:</h4>
                    <ol className="text-sm space-y-1 text-muted-foreground">
                      <li>1. Create course landing pages</li>
                      <li>2. Generate educational video scripts</li>
                      <li>3. Build lead nurturing sequences</li>
                      <li>4. Create enrollment campaigns</li>
                      <li>5. Analyze student engagement</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Expected Results:</h4>
                    <ul className="text-sm space-y-1 text-blue-600">
                      <li>• 80% faster content creation</li>
                      <li>• 50% higher enrollment rates</li>
                      <li>• 65% improved student engagement</li>
                      <li>• Automated student support</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🏢 Service-Based Business</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Workflow:</h4>
                    <ol className="text-sm space-y-1 text-muted-foreground">
                      <li>1. Create service landing pages</li>
                      <li>2. Generate testimonial videos</li>
                      <li>3. Build consultation booking flow</li>
                      <li>4. Create local ad campaigns</li>
                      <li>5. Automate follow-up sequences</li>
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Expected Results:</h4>
                    <ul className="text-sm space-y-1 text-purple-600">
                      <li>• 90% automated lead qualification</li>
                      <li>• 45% more qualified appointments</li>
                      <li>• 35% higher closing rates</li>
                      <li>• Streamlined customer journey</li>
                    </ul>
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