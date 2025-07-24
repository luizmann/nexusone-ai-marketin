import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useKV } from '@github/spark/hooks'
import { Zap, Target, BarChart3, Users } from '@phosphor-icons/react'

export function WelcomeScreen() {
  const [, setUser] = useKV('user-profile', null)
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  
  const handleGetStarted = () => {
    if (name.trim()) {
      setUser({
        name: name.trim(),
        company: company.trim() || 'Personal',
        credits: 50,
        plan: 'free',
        createdAt: new Date().toISOString()
      })

      // Add some sample data to make the dashboard more engaging
      const sampleCampaigns = [
        {
          id: 1,
          name: 'Welcome Campaign',
          type: 'email',
          objective: 'engagement',
          targetAudience: 'New users',
          budget: '$500',
          duration: '1 week',
          description: 'Onboarding email sequence for new users',
          status: 'active',
          createdAt: new Date().toISOString(),
          performance: {
            impressions: 1250,
            clicks: 87,
            conversions: 12,
            spent: 45
          }
        }
      ]

      const sampleContent = [
        {
          id: 1,
          type: 'social-post',
          topic: 'Marketing automation benefits',
          tone: 'professional',
          content: '🚀 Transform your marketing with automation! Save 10+ hours per week while boosting engagement by 40%. Ready to scale your business? #MarketingAutomation #GrowthHacking',
          createdAt: new Date().toISOString()
        }
      ]

      // Set sample data using functional updates to avoid stale closure issues
      setTimeout(() => {
        window.spark.kv.set('campaigns', sampleCampaigns)
        window.spark.kv.set('generated-content', sampleContent)
      }, 100)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-3">
              <Zap className="w-6 h-6 text-primary-foreground" weight="fill" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">NexusOne</h1>
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Marketing Automation Platform
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Streamline your marketing with AI-powered content generation, campaign management, and analytics tools.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <Target className="w-8 h-8 text-accent mx-auto mb-3" weight="fill" />
                  <h3 className="font-semibold mb-2">AI Content Generation</h3>
                  <p className="text-sm text-muted-foreground">Create compelling marketing copy in seconds</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <BarChart3 className="w-8 h-8 text-accent mx-auto mb-3" weight="fill" />
                  <h3 className="font-semibold mb-2">Campaign Analytics</h3>
                  <p className="text-sm text-muted-foreground">Track performance with detailed insights</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-accent mx-auto mb-3" weight="fill" />
                  <h3 className="font-semibold mb-2">Lead Management</h3>
                  <p className="text-sm text-muted-foreground">Organize and nurture your prospects</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Zap className="w-8 h-8 text-accent mx-auto mb-3" weight="fill" />
                  <h3 className="font-semibold mb-2">Automation</h3>
                  <p className="text-sm text-muted-foreground">Set up workflows that run themselves</p>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Get Started Free</CardTitle>
              <CardDescription>
                Start with 50 free credits. No credit card required.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company (Optional)</Label>
                <Input
                  id="company"
                  placeholder="Your company name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleGetStarted} 
                className="w-full"
                disabled={!name.trim()}
              >
                Start Marketing Automation
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                By continuing, you agree to our terms of service and privacy policy.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}