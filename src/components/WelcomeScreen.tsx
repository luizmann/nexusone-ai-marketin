import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useKV } from '@github/spark/hooks'
import { SalesPage } from './SalesPage'
import { Documentation } from './ComprehensiveDocumentation'
import { ComprehensivePrivacyPolicy } from './ComprehensivePrivacyPolicy'
import { Zap, BookOpen, Shield, Sparkles } from '@phosphor-icons/react'
import { useLanguage } from '../contexts/LanguageContext'
import { LanguageSelector } from './LanguageSelector'

export function WelcomeScreen() {
  const [, setUser] = useKV('user-profile', null)
  const [showLogin, setShowLogin] = useState(false)
  const [activeTab, setActiveTab] = useState('sales')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const { t, isRTL } = useLanguage()
  
  const handleGetStarted = () => {
    setShowLogin(true)
  }

  const handleLogin = () => {
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

  // Show sales page by default
  if (!showLogin) {
    return (
      <div className={`min-h-screen ${isRTL ? 'rtl' : 'ltr'}`}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Navigation Header */}
          <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-2">
                    <Sparkles size={24} className="text-white" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    NexusOne
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <LanguageSelector />
                  <Button onClick={handleGetStarted} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    {t('welcome.get_started')}
                  </Button>
                </div>
              </div>
              
              <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
                <TabsTrigger value="sales" className="flex items-center gap-2">
                  <Zap size={16} />
                  {t('nav.sales')}
                </TabsTrigger>
                <TabsTrigger value="docs" className="flex items-center gap-2">
                  <BookOpen size={16} />
                  {t('nav.docs')}
                </TabsTrigger>
                <TabsTrigger value="privacy" className="flex items-center gap-2">
                  <Shield size={16} />
                  {t('nav.privacy')}
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Tab Contents */}
          <TabsContent value="sales" className="mt-0">
            <SalesPage onGetStarted={handleGetStarted} />
          </TabsContent>
          
          <TabsContent value="docs" className="mt-0">
            <Documentation />
          </TabsContent>
          
          <TabsContent value="privacy" className="mt-0">
            <ComprehensivePrivacyPolicy />
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  // Show login form when user clicks get started

  return (
    <div className={`min-h-screen bg-background flex items-center justify-center p-4 ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="absolute top-4 right-4">
        <LanguageSelector />
      </div>
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-3">
                <Zap className="w-6 h-6 text-primary-foreground" weight="fill" />
              </div>
              <CardTitle className="text-2xl">{t('common.nexusone')}</CardTitle>
            </div>
            <CardDescription>
              {t('welcome.description')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('common.name')}</Label>
              <Input
                id="name"
                placeholder={t('common.name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">{t('common.company')}</Label>
              <Input
                id="company"
                placeholder={t('common.company')}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            <Button 
              onClick={handleLogin} 
              className="w-full"
              disabled={!name.trim()}
            >
              {t('welcome.get_started')}
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowLogin(false)}
            >
              {isRTL ? '→' : '←'} {t('common.back')}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              {t('footer.terms')} & {t('footer.privacy')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}