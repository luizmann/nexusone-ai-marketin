import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/contexts/AuthContext'
import { useCredits } from '@/contexts/CreditContext'
import { 
  CreditCard, 
  Lightning, 
  Star,
  Video,
  Calendar,
  TrendingUp,
  Gift,
  Crown,
  Plus,
  Clock
} from '@phosphor-icons/react'
import { toast } from 'sonner'

export const Credits: React.FC = () => {
  const { user, updateProfile } = useAuth()
  const { credits, videoCredits } = useCredits()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'Forever',
      credits: 50,
      videoCredits: 1,
      features: [
        '50 AI Credits monthly',
        '1 Video generation',
        '3 Campaigns maximum',
        'Basic templates',
        'Community support'
      ],
      popular: false,
      current: user?.plan === 'free'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 97,
      period: 'per month',
      credits: 500,
      videoCredits: 20,
      features: [
        '500 AI Credits monthly',
        '20 Video generations',
        'Unlimited campaigns',
        'Premium templates',
        'WhatsApp integration',
        'Priority support'
      ],
      popular: true,
      current: user?.plan === 'pro'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 297,
      period: 'per month',
      credits: 2000,
      videoCredits: 100,
      features: [
        '2000 AI Credits monthly',
        '100 Video generations',
        'Everything unlimited',
        'Custom branding',
        'Multiple WhatsApp numbers',
        '1-on-1 strategy calls',
        'Early access features'
      ],
      popular: false,
      current: user?.plan === 'premium'
    }
  ]

  const creditPacks = [
    {
      credits: 100,
      price: 19,
      bonus: 0,
      popular: false
    },
    {
      credits: 500,
      price: 89,
      bonus: 50,
      popular: true
    },
    {
      credits: 1000,
      price: 169,
      bonus: 150,
      popular: false
    },
    {
      credits: 2500,
      price: 399,
      bonus: 500,
      popular: false
    }
  ]

  const usageHistory = [
    {
      action: 'Campaign Generation',
      credits: -100,
      timestamp: '2 hours ago',
      type: 'campaign'
    },
    {
      action: 'Video Creation',
      credits: -1,
      timestamp: '1 day ago',
      type: 'video'
    },
    {
      action: 'Sales Page Builder',
      credits: -30,
      timestamp: '2 days ago',
      type: 'page'
    },
    {
      action: 'Product Import',
      credits: -10,
      timestamp: '3 days ago',
      type: 'import'
    },
    {
      action: 'Monthly Credit Refill',
      credits: +500,
      timestamp: '1 week ago',
      type: 'refill'
    }
  ]

  const upgradeplan = (planId: string) => {
    const plan = plans.find(p => p.id === planId)
    if (!plan) return

    // Simulate upgrade
    updateProfile({ 
      plan: planId as 'free' | 'pro' | 'premium',
      credits: plan.credits,
      videoCredits: plan.videoCredits
    })
    
    toast.success(`Successfully upgraded to ${plan.name} plan!`)
  }

  const buyCreditPack = (pack: any) => {
    const totalCredits = pack.credits + pack.bonus
    updateProfile({ 
      credits: credits + totalCredits
    })
    
    toast.success(`Added ${totalCredits} credits to your account!`)
  }

  const getPlanProgress = () => {
    const maxCredits = user?.plan === 'free' ? 50 : user?.plan === 'pro' ? 500 : 2000
    return (credits / maxCredits) * 100
  }

  const getVideoProgress = () => {
    const maxVideos = user?.plan === 'free' ? 1 : user?.plan === 'pro' ? 20 : 100
    return (videoCredits / maxVideos) * 100
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-yellow-500 to-orange-600 p-3 rounded-xl">
            <CreditCard className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Credits & Billing</h1>
        <p className="text-lg text-muted-foreground">
          Manage your subscription and purchase additional credits
        </p>
      </div>

      {/* Current Usage */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightning className="h-5 w-5" />
              AI Credits
            </CardTitle>
            <CardDescription>Used for campaigns, pages, and AI features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{credits}</span>
                <Badge variant="secondary">
                  {user?.plan?.toUpperCase()} Plan
                </Badge>
              </div>
              <Progress value={getPlanProgress()} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Resets monthly with your subscription
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Video Credits
            </CardTitle>
            <CardDescription>Used for AI video generation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{videoCredits}</span>
                <Badge variant="secondary">
                  Monthly Limit
                </Badge>
              </div>
              <Progress value={getVideoProgress()} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Premium video generation capability
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plans</CardTitle>
          <CardDescription>Upgrade your plan for more credits and features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className={`relative ${plan.current ? 'border-primary shadow-lg' : ''} ${plan.popular ? 'border-orange-200' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-orange-500 hover:bg-orange-600">
                      Most Popular
                    </Badge>
                  </div>
                )}
                {plan.current && (
                  <div className="absolute -top-3 right-4">
                    <Badge variant="secondary">
                      Current Plan
                    </Badge>
                  </div>
                )}
                
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="text-center p-2 bg-muted/50 rounded">
                        <div className="font-bold text-primary">{plan.credits}</div>
                        <div className="text-xs text-muted-foreground">AI Credits</div>
                      </div>
                      <div className="text-center p-2 bg-muted/50 rounded">
                        <div className="font-bold text-accent">{plan.videoCredits}</div>
                        <div className="text-xs text-muted-foreground">Videos</div>
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full ${plan.current ? 'opacity-50' : ''}`}
                    disabled={plan.current}
                    onClick={() => upgradeplan(plan.id)}
                  >
                    {plan.current ? 'Current Plan' : 
                     plan.price === 0 ? 'Downgrade' : 'Upgrade'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Credit Packs */}
      <Card>
        <CardHeader>
          <CardTitle>Buy Additional Credits</CardTitle>
          <CardDescription>Top up your credits anytime for extra usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {creditPacks.map((pack, index) => (
              <Card 
                key={index}
                className={`${pack.popular ? 'border-primary shadow-lg relative' : ''}`}
              >
                {pack.popular && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary">
                      Best Value
                    </Badge>
                  </div>
                )}
                
                <CardContent className="p-4 text-center">
                  <div className="mb-3">
                    <div className="text-2xl font-bold">{pack.credits}</div>
                    <div className="text-sm text-muted-foreground">Credits</div>
                    {pack.bonus > 0 && (
                      <div className="text-sm text-green-600">
                        +{pack.bonus} bonus
                      </div>
                    )}
                  </div>
                  
                  <div className="text-xl font-bold mb-3">${pack.price}</div>
                  
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => buyCreditPack(pack)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Buy Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Usage
          </CardTitle>
          <CardDescription>Your credit usage history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {usageHistory.map((usage, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    usage.credits > 0 ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <h3 className="font-medium">{usage.action}</h3>
                    <p className="text-sm text-muted-foreground">{usage.timestamp}</p>
                  </div>
                </div>
                <div className={`font-semibold ${
                  usage.credits > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {usage.credits > 0 ? '+' : ''}{Math.abs(usage.credits)} 
                  {usage.type === 'video' ? ' video' : ' credits'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade CTA */}
      {user?.plan === 'free' && (
        <Card className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <Crown className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Ready to Scale Your Business?</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Upgrade to Pro and get 10x more credits, unlimited campaigns, and WhatsApp integration
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => upgradeplan('pro')}>
                <TrendingUp className="h-5 w-5 mr-2" />
                Upgrade to Pro
              </Button>
              <Button size="lg" variant="outline" onClick={() => upgradeplan('premium')}>
                <Crown className="h-5 w-5 mr-2" />
                Go Premium
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Credits