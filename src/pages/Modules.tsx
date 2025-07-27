import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useLanguage } from '@/contexts/CleanLanguageContext'
import { useKV } from '@github/spark/hooks'
import { useModules, getUserAccessibleModules, getModulesByCategory, moduleCategories } from '@/config/modules'
import { 
  Lock,
  Zap,
  Crown,
  ArrowRight
} from '@phosphor-icons/react'

export function ModulesPage() {
  const { t } = useLanguage()
  const [userProfile] = useKV('user-profile', { plan: 'free' })
  const [userCredits] = useKV('user-credits', { general: 500 })
  
  const allModules = useModules()
  const accessibleModules = getUserAccessibleModules(allModules, userProfile.plan)
  const modulesByCategory = getModulesByCategory(accessibleModules)

  const handleModuleClick = (modulePath: string, requiredPlan: string) => {
    if (userProfile.plan === 'free' && requiredPlan !== 'free') {
      // Show upgrade prompt
      window.location.href = '/pricing'
      return
    }
    
    window.location.href = modulePath
  }

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'free':
        return <Badge variant="secondary">Free</Badge>
      case 'pro':
        return <Badge className="bg-blue-500 text-white">Pro</Badge>
      case 'premium':
        return <Badge className="bg-purple-500 text-white">Premium</Badge>
      default:
        return null
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'core':
        return '⚡'
      case 'generation':
        return '🎨'
      case 'marketing':
        return '📈'
      case 'automation':
        return '🤖'
      default:
        return '🔧'
    }
  }

  const isModuleAccessible = (requiredPlan: string) => {
    const planHierarchy = { free: 0, pro: 1, premium: 2 }
    return planHierarchy[userProfile.plan] >= planHierarchy[requiredPlan]
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">
          NexusOne AI Modules
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Comprehensive suite of AI-powered marketing tools designed to automate 
          and scale your digital business operations.
        </p>
        
        {/* Plan Status */}
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Current Plan:</span>
            {getPlanBadge(userProfile.plan)}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Credits:</span>
            <Badge variant="outline">{userCredits.general}</Badge>
          </div>
          {userProfile.plan === 'free' && (
            <Button size="sm" onClick={() => window.location.href = '/pricing'}>
              <Crown className="h-4 w-4 mr-1" />
              Upgrade Plan
            </Button>
          )}
        </div>
      </div>

      {/* Module Categories */}
      {Object.entries(modulesByCategory).map(([category, modules]) => (
        <div key={category} className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getCategoryIcon(category)}</span>
            <h2 className="text-2xl font-semibold">
              {moduleCategories[category as keyof typeof moduleCategories]}
            </h2>
            <Badge variant="outline">
              {modules.length} module{modules.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => {
              const accessible = isModuleAccessible(module.requiredPlan)
              
              return (
                <Card 
                  key={module.id} 
                  className={`relative transition-all hover:shadow-lg ${
                    !accessible ? 'opacity-75' : 'hover:scale-105'
                  }`}
                >
                  {!accessible && (
                    <div className="absolute top-2 right-2 z-10">
                      <Badge variant="destructive">
                        <Lock className="h-3 w-3 mr-1" />
                        {module.requiredPlan.toUpperCase()}
                      </Badge>
                    </div>
                  )}
                  
                  {module.beta && (
                    <div className="absolute top-2 left-2 z-10">
                      <Badge className="bg-orange-500 text-white">
                        Beta
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div className="text-3xl">{module.icon}</div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg leading-tight">
                          {module.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          {getPlanBadge(module.requiredPlan)}
                          <span className="text-xs text-muted-foreground">
                            {module.creditCost} credits
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0 space-y-4">
                    <CardDescription className="text-sm leading-relaxed">
                      {module.description}
                    </CardDescription>

                    {/* Module Features */}
                    <div className="space-y-2">
                      {module.id === 'magic-sales-generator' && (
                        <div className="text-xs space-y-1">
                          <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3 text-yellow-500" />
                            <span>URL to sales page in 2 minutes</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3 text-green-500" />
                            <span>AI copywriting & design</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3 text-blue-500" />
                            <span>Mobile-optimized templates</span>
                          </div>
                        </div>
                      )}
                      
                      {module.id === 'magic-video-creator' && (
                        <div className="text-xs space-y-1">
                          <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3 text-purple-500" />
                            <span>AI avatars & voiceovers</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3 text-red-500" />
                            <span>Professional video templates</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3 text-orange-500" />
                            <span>Social media ready formats</span>
                          </div>
                        </div>
                      )}
                      
                      {module.id === 'nexbrain-assistant' && (
                        <div className="text-xs space-y-1">
                          <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3 text-indigo-500" />
                            <span>Campaign optimization</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3 text-cyan-500" />
                            <span>Real-time insights</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3 text-teal-500" />
                            <span>Strategic recommendations</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <Button 
                      className={`w-full ${!accessible ? 'opacity-50' : ''}`}
                      onClick={() => handleModuleClick(module.path, module.requiredPlan)}
                      disabled={!accessible}
                    >
                      {!accessible ? (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Upgrade to Access
                        </>
                      ) : (
                        <>
                          {module.comingSoon ? 'Coming Soon' : 'Launch Module'}
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      ))}

      {/* Upgrade CTA */}
      {userProfile.plan === 'free' && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <Crown className="h-12 w-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Unlock Premium Features</h3>
            <p className="text-muted-foreground mb-4">
              Upgrade to Pro or Premium to access advanced AI modules, unlimited credits, 
              and priority support.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => window.location.href = '/pricing'}>
                View Pricing
              </Button>
              <Button onClick={() => window.location.href = '/pricing'}>
                <Crown className="h-4 w-4 mr-2" />
                Upgrade Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}