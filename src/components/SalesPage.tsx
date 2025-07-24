import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Zap, 
  Target, 
  TrendUp, 
  Clock, 
  Shield, 
  Users, 
  CheckCircle, 
  Star,
  ArrowRight,
  Sparkle,
  RocketLaunch,
  ChartLine,
  MagicWand,
  Crown,
  Gift
} from "@phosphor-icons/react"

export function SalesPage() {
  const [selectedPlan, setSelectedPlan] = useState('pro')

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <Badge variant="outline" className="px-4 py-2 text-sm">
            🚀 Revolutionary AI Marketing Platform
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight">
            Transform Your Marketing with AI That Actually Works
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Generate high-converting campaigns, create viral content, and automate your entire marketing funnel 
            with NexusOne – the only AI platform that pays for itself in the first month.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="px-8 py-4 text-lg">
              Start Free Trial <ArrowRight className="ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
              Watch Demo
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              No Credit Card Required
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              14-Day Free Trial
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              Cancel Anytime
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Agitation Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Are You Tired of Marketing That Doesn't Convert?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Every day you delay implementing AI-powered marketing is another day your competitors 
              gain an unfair advantage while you struggle with outdated, time-consuming methods.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock size={32} className="text-destructive" />
                </div>
                <h3 className="text-xl font-bold mb-3">Wasting Hours Daily</h3>
                <p className="text-muted-foreground">
                  Spending 4-6 hours creating mediocre content instead of focusing on strategy and growth
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendUp size={32} className="text-destructive" />
                </div>
                <h3 className="text-xl font-bold mb-3">Poor ROI</h3>
                <p className="text-muted-foreground">
                  Campaigns that barely break even while competitors achieve 300%+ returns with AI optimization
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target size={32} className="text-destructive" />
                </div>
                <h3 className="text-xl font-bold mb-3">Inconsistent Results</h3>
                <p className="text-muted-foreground">
                  Hit-or-miss campaigns because you're guessing instead of using data-driven AI insights
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center bg-accent/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">
              The harsh reality: While you're manually creating content, your competitors are using AI to:
            </h3>
            <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              <div className="flex items-center gap-3 text-left">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>Generate 50+ pieces of content per day</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>Optimize campaigns in real-time</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>Scale their business 10x faster</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>Dominate their market while you struggle</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">
              <Sparkle className="mr-2" size={16} />
              The Solution You've Been Waiting For
            </Badge>
            <h2 className="text-4xl font-bold mb-6">
              Introducing NexusOne: The AI Marketing Revolution
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The first all-in-one AI platform that handles every aspect of your marketing – 
              from content creation to campaign optimization – while you sleep.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-accent text-accent-foreground rounded-lg flex items-center justify-center flex-shrink-0">
                  <MagicWand size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">AI Content Generator</h3>
                  <p className="text-muted-foreground">
                    Create blog posts, social media content, email campaigns, and ad copy that converts 
                    3x better than human-written content – in seconds, not hours.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-accent text-accent-foreground rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Smart Campaign Builder</h3>
                  <p className="text-muted-foreground">
                    Build multi-channel campaigns that automatically optimize themselves based on 
                    real-time performance data and user behavior patterns.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-accent text-accent-foreground rounded-lg flex items-center justify-center flex-shrink-0">
                  <ChartLine size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Predictive Analytics</h3>
                  <p className="text-muted-foreground">
                    Know which campaigns will succeed before you launch them with AI-powered 
                    predictions and optimization recommendations.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-accent text-accent-foreground rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Automation Engine</h3>
                  <p className="text-muted-foreground">
                    Set it and forget it. Our AI handles posting, engagement, lead nurturing, 
                    and conversion optimization 24/7 without your intervention.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl p-8">
              <div className="text-center space-y-6">
                <h3 className="text-2xl font-bold">What Our Users Achieve:</h3>
                
                <div className="grid gap-4">
                  <div className="bg-card rounded-lg p-4">
                    <div className="text-3xl font-bold text-accent">847%</div>
                    <div className="text-sm text-muted-foreground">Average ROI Increase</div>
                  </div>
                  
                  <div className="bg-card rounded-lg p-4">
                    <div className="text-3xl font-bold text-accent">23hrs</div>
                    <div className="text-sm text-muted-foreground">Time Saved Per Week</div>
                  </div>
                  
                  <div className="bg-card rounded-lg p-4">
                    <div className="text-3xl font-bold text-accent">312%</div>
                    <div className="text-sm text-muted-foreground">More Leads Generated</div>
                  </div>
                </div>
                
                <Button size="lg" className="w-full">
                  Join 10,000+ Successful Marketers
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Deep Dive */}
      <section className="container mx-auto px-4 py-20 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Everything You Need to Dominate Your Market
            </h2>
            <p className="text-xl text-muted-foreground">
              10 powerful modules that replace dozens of expensive tools and agencies
            </p>
          </div>
          
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="content">Content AI</TabsTrigger>
              <TabsTrigger value="social">Social Media</TabsTrigger>
              <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="automation">Automation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="content" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MagicWand className="text-accent" />
                      AI Content Generator
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>Transform any topic into high-converting content in seconds:</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        Blog posts that rank on Google page 1
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        Email sequences with 45%+ open rates
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        Ad copy that converts 3x better
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        Product descriptions that sell
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        Video scripts that go viral
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <div className="space-y-4">
                  <Badge variant="outline">Real User Result</Badge>
                  <blockquote className="border-l-4 border-accent pl-4 italic">
                    "I used to spend 3 hours writing one blog post. Now I create 10 high-quality 
                    articles in the same time, and they rank better than anything I wrote manually. 
                    My organic traffic increased 400% in 2 months."
                  </blockquote>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-accent rounded-full"></div>
                    <div>
                      <div className="font-semibold">Sarah Chen</div>
                      <div className="text-sm text-muted-foreground">Marketing Director, TechCorp</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="social" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="text-accent" />
                      Social Media Mastery
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>Dominate every social platform with AI-optimized content:</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        Platform-specific content optimization
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        Viral hashtag research and implementation
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        Automated posting schedules
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        Engagement monitoring and response
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        Influencer collaboration tools
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-card rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-accent">2.3M</div>
                      <div className="text-sm text-muted-foreground">Avg Monthly Reach</div>
                    </div>
                    <div className="bg-card rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-accent">18.7%</div>
                      <div className="text-sm text-muted-foreground">Engagement Rate</div>
                    </div>
                  </div>
                  <blockquote className="border-l-4 border-accent pl-4 italic">
                    "My Instagram following grew from 5K to 150K in 6 months using NexusOne's 
                    AI content suggestions. The engagement is through the roof!"
                  </blockquote>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="campaigns" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <RocketLaunch className="text-accent" />
                      Campaign Automation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>Launch campaigns that optimize themselves for maximum ROI:</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        Multi-channel campaign orchestration
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        Real-time budget optimization
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        Automatic A/B testing
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        Lead scoring and nurturing
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        Conversion rate optimization
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <div className="bg-gradient-to-br from-green-500/20 to-accent/20 rounded-lg p-6">
                  <h4 className="font-bold mb-4">Campaign Success Story</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Previous Manual Campaigns:</span>
                      <span className="font-bold text-destructive">2.1% CTR</span>
                    </div>
                    <div className="flex justify-between">
                      <span>With NexusOne AI:</span>
                      <span className="font-bold text-green-500">12.8% CTR</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ROI Improvement:</span>
                      <span className="font-bold text-accent">509%</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ChartLine className="text-accent" />
                      Predictive Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>See the future of your marketing with AI-powered insights:</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        Revenue forecasting with 94% accuracy
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        Customer lifetime value predictions
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        Churn risk identification
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        Optimal timing recommendations
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        Market trend analysis
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <div className="space-y-4">
                  <h4 className="font-bold">What You'll Know Before Your Competitors:</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted rounded border-l-4 border-accent">
                      <strong>Which campaigns will fail</strong> before you waste money on them
                    </div>
                    <div className="p-3 bg-muted rounded border-l-4 border-accent">
                      <strong>When customers are ready to buy</strong> so you can close more deals
                    </div>
                    <div className="p-3 bg-muted rounded border-l-4 border-accent">
                      <strong>What content will go viral</strong> before you create it
                    </div>
                    <div className="p-3 bg-muted rounded border-l-4 border-accent">
                      <strong>Market shifts</strong> 30 days before they happen
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="automation" className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="text-accent" />
                      Complete Automation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>Your marketing runs itself while you focus on growth:</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        24/7 lead generation and qualification
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        Automated email sequences
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        Smart retargeting campaigns
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        Customer journey optimization
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        Revenue attribution tracking
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <div className="bg-accent/10 rounded-lg p-6">
                  <h4 className="font-bold mb-4 text-center">Time Saved Per Month</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Content Creation:</span>
                      <span className="font-bold">92 hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Campaign Management:</span>
                      <span className="font-bold">67 hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Analytics & Reporting:</span>
                      <span className="font-bold">34 hours</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Lead Nurturing:</span>
                      <span className="font-bold">45 hours</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total Time Saved:</span>
                      <span className="text-accent">238 hours</span>
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      That's 6 full work weeks back in your schedule
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Join 10,000+ Businesses Already Winning with AI
            </h2>
            <p className="text-xl text-muted-foreground">
              See why industry leaders choose NexusOne over expensive agencies and outdated tools
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="border-accent/20 bg-accent/5">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} className="text-yellow-500 fill-current" />
                  ))}
                </div>
                <blockquote className="mb-4 italic">
                  "NexusOne replaced our entire marketing team of 5 people and delivers better results. 
                  We're saving $50K/month and our revenue increased 300%."
                </blockquote>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-accent rounded-full"></div>
                  <div>
                    <div className="font-semibold">Michael Rodriguez</div>
                    <div className="text-sm text-muted-foreground">CEO, GrowthTech</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-accent/20 bg-accent/5">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} className="text-yellow-500 fill-current" />
                  ))}
                </div>
                <blockquote className="mb-4 italic">
                  "I was skeptical about AI marketing, but NexusOne proved me wrong. My ROI went from 
                  150% to 800% in just 3 months. This is a game-changer."
                </blockquote>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-accent rounded-full"></div>
                  <div>
                    <div className="font-semibold">Jennifer Adams</div>
                    <div className="text-sm text-muted-foreground">Marketing Director, EcomPlus</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-accent/20 bg-accent/5">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} className="text-yellow-500 fill-current" />
                  ))}
                </div>
                <blockquote className="mb-4 italic">
                  "The predictive analytics alone saved us from a $100K campaign that would have flopped. 
                  NexusOne paid for itself 20x over in the first quarter."
                </blockquote>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-accent rounded-full"></div>
                  <div>
                    <div className="font-semibold">David Park</div>
                    <div className="text-sm text-muted-foreground">CMO, InnovateCorp</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-accent mb-2">10,000+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent mb-2">$2.3B</div>
              <div className="text-muted-foreground">Revenue Generated</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent mb-2">847%</div>
              <div className="text-muted-foreground">Avg ROI Increase</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent mb-2">99.9%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Choose Your Competitive Advantage
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Every plan pays for itself in the first month. Guaranteed.
            </p>
            <Badge variant="outline" className="px-4 py-2">
              <Gift className="mr-2" size={16} />
              Limited Time: 50% Off First 3 Months
            </Badge>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <Card className="relative">
              <CardHeader>
                <div className="text-center">
                  <h3 className="text-2xl font-bold">Starter</h3>
                  <div className="text-4xl font-bold mt-4">$0</div>
                  <div className="text-muted-foreground">Forever Free</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    50 AI credits per month
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    Basic content generation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    2 social media accounts
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    Email support
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    Basic analytics
                  </li>
                </ul>
                <Button className="w-full" variant="outline">
                  Start Free
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Perfect for testing the waters
                </p>
              </CardContent>
            </Card>
            
            {/* Pro Plan */}
            <Card className="relative border-accent border-2">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="px-4 py-1">
                  <Crown className="mr-1" size={14} />
                  Most Popular
                </Badge>
              </div>
              <CardHeader>
                <div className="text-center">
                  <h3 className="text-2xl font-bold">Professional</h3>
                  <div className="text-4xl font-bold mt-4">
                    $97
                    <span className="text-lg text-muted-foreground line-through ml-2">$194</span>
                  </div>
                  <div className="text-muted-foreground">per month</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    500 AI credits per month
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    Advanced content generation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    20 social media accounts
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    Campaign automation
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    Predictive analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    Priority support
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    A/B testing
                  </li>
                </ul>
                <Button 
                  className="w-full" 
                  onClick={() => setSelectedPlan('pro')}
                  variant={selectedPlan === 'pro' ? 'default' : 'outline'}
                >
                  Start Pro Trial
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Typically saves $3,000/month vs agencies
                </p>
              </CardContent>
            </Card>
            
            {/* Premium Plan */}
            <Card className="relative">
              <CardHeader>
                <div className="text-center">
                  <h3 className="text-2xl font-bold">Enterprise</h3>
                  <div className="text-4xl font-bold mt-4">
                    $297
                    <span className="text-lg text-muted-foreground line-through ml-2">$594</span>
                  </div>
                  <div className="text-muted-foreground">per month</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    2,000 AI credits per month
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    Everything in Pro
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    Unlimited social accounts
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    White-label options
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    Custom integrations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    Dedicated success manager
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    API access
                  </li>
                </ul>
                <Button className="w-full" variant="outline">
                  Start Enterprise Trial
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Replaces entire marketing department
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <div className="bg-green-500/10 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold mb-2 text-green-700">ROI Guarantee</h3>
              <p className="text-muted-foreground">
                If NexusOne doesn't increase your marketing ROI by at least 200% in the first 90 days, 
                we'll refund your money and pay you $500 for your time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Urgency/Scarcity Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-destructive/20 to-accent/20 rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">
              ⚠️ Warning: Your Competitors Are Already Using AI
            </h2>
            <p className="text-xl text-muted-foreground mb-6">
              Every day you wait is another day they get further ahead. The businesses using AI marketing 
              today will dominate their markets tomorrow.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-card rounded-lg p-4">
                <div className="text-2xl font-bold text-destructive mb-2">-67%</div>
                <div className="text-sm text-muted-foreground">
                  Cost per lead for AI-powered campaigns vs traditional methods
                </div>
              </div>
              <div className="bg-card rounded-lg p-4">
                <div className="text-2xl font-bold text-destructive mb-2">5x</div>
                <div className="text-sm text-muted-foreground">
                  Faster content creation with AI vs manual writing
                </div>
              </div>
              <div className="bg-card rounded-lg p-4">
                <div className="text-2xl font-bold text-destructive mb-2">+312%</div>
                <div className="text-sm text-muted-foreground">
                  Average revenue increase in first 6 months
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Special Launch Bonus (Expires Soon)</h3>
              <div className="text-left max-w-md mx-auto space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  <span>$2,000 worth of premium templates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  <span>1-on-1 strategy session ($500 value)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  <span>Priority queue for new features</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-500" />
                  <span>Lifetime 20% discount on upgrades</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to 10x Your Marketing Results?
          </h2>
          <p className="text-xl opacity-90">
            Join thousands of businesses already dominating their markets with AI-powered marketing
          </p>
          
          <div className="space-y-4">
            <Button size="lg" variant="secondary" className="px-12 py-6 text-xl">
              Start Your Free Trial Now
              <ArrowRight className="ml-2" size={24} />
            </Button>
            <p className="text-sm opacity-80">
              14-day free trial • No credit card required • Cancel anytime
            </p>
          </div>
          
          <div className="flex items-center justify-center gap-8 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <Shield size={16} />
              Enterprise Security
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} />
              99.9% Uptime SLA
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} />
              24/7 Support
            </div>
          </div>
        </div>
      </section>

      {/* Risk Reversal */}
      <section className="container mx-auto px-4 py-12 bg-muted/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Shield size={32} className="text-green-500" />
            <h3 className="text-2xl font-bold">Zero Risk. All Reward.</h3>
          </div>
          <p className="text-muted-foreground">
            Try NexusOne risk-free for 14 days. If you're not completely satisfied, 
            get a full refund with one click. No questions asked.
          </p>
        </div>
      </section>
    </div>
  )
}