import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useKV } from '@github/spark/hooks'
import { SalesPage } from './SalesPage'
import { Zap } from '@phosphor-icons/react'

export function WelcomeScreen() {
  const [, setUser] = useKV('user-profile', null)
  const [showLogin, setShowLogin] = useState(false)
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  
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
    return <SalesPage onGetStarted={handleGetStarted} />
  }

  // Show login form when user clicks get started

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mr-3">
                <Zap className="w-6 h-6 text-primary-foreground" weight="fill" />
              </div>
              <CardTitle className="text-2xl">NexusOne</CardTitle>
            </div>
            <CardDescription>
              Complete seu cadastro para acessar a plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Seu Nome</Label>
              <Input
                id="name"
                placeholder="Digite seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Empresa (Opcional)</Label>
              <Input
                id="company"
                placeholder="Nome da sua empresa"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleLogin} 
              className="w-full"
              disabled={!name.trim()}
            >
              Entrar na Plataforma
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowLogin(false)}
            >
              ← Voltar para Sales Page
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Ao continuar, você concorda com nossos termos de serviço e política de privacidade.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}