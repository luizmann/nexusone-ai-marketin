import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Sparkles, 
  Zap, 
  Target, 
  MessageCircle, 
  Video, 
  ShoppingCart, 
  BarChart3, 
  Users, 
  CheckCircle, 
  Star,
  ArrowRight,
  Brain,
  Rocket,
  Shield,
  Globe,
  Play,
  TrendUp,
  Clock,
  Lightbulb,
  CurrencyDollar,
  Magic
} from '@phosphor-icons/react'
import { useLanguage } from '../contexts/LanguageContext'
import { LanguageSelector } from './LanguageSelector'

interface PricingTier {
  name: string
  price: number
  originalPrice?: number
  period: string
  description: string
  features: string[]
  credits: string
  videos: string
  whatsapp: string
  modules: string
  highlighted?: boolean
  buttonText: string
}

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
  credits: number
}

interface Testimonial {
  name: string
  role: string
  company: string
  content: string
  rating: number
}

const pricingTiers: PricingTier[] = [
  {
    name: "FREE",
    price: 0,
    period: "mês",
    description: "Perfeito para começar e testar nossa plataforma",
    features: [
      "50 créditos mensais",
      "2 vídeos com IA por mês",
      "2 landing pages por mês",
      "1 número WhatsApp",
      "5 módulos básicos",
      "Suporte por email"
    ],
    credits: "50/mês",
    videos: "2/mês",
    whatsapp: "1 número",
    modules: "5 módulos",
    buttonText: "Começar Grátis"
  },
  {
    name: "PRO",
    price: 97,
    originalPrice: 197,
    period: "mês",
    description: "Para empresas que querem automatizar e escalar",
    features: [
      "500 créditos mensais",
      "20 vídeos com IA por mês",
      "20 landing pages por mês",
      "5 números WhatsApp",
      "8 módulos avançados",
      "Suporte prioritário",
      "Relatórios avançados",
      "Integrações ilimitadas"
    ],
    credits: "500/mês",
    videos: "20/mês",
    whatsapp: "5 números",
    modules: "8 módulos",
    highlighted: true,
    buttonText: "Começar Teste de 7 Dias"
  },
  {
    name: "PREMIUM",
    price: 297,
    originalPrice: 497,
    period: "mês",
    description: "Para agências e empresas que precisam de tudo",
    features: [
      "2000 créditos mensais",
      "100 vídeos com IA por mês",
      "Landing pages ilimitadas",
      "20 números WhatsApp",
      "Todos os 10 módulos",
      "Suporte 24/7 dedicado",
      "White-label disponível",
      "Treinamento personalizado",
      "API personalizada"
    ],
    credits: "2000/mês",
    videos: "100/mês",
    whatsapp: "20 números",
    modules: "Todos (10)",
    buttonText: "Começar Teste de 14 Dias"
  }
]

const features = [
  {
    icon: Brain,
    title: "IA Avançada Multi-Modal",
    description: "Integração com GPT-4, D-ID, ElevenLabs e mais de 10 APIs de IA para automação completa"
  },
  {
    icon: Video,
    title: "Criador de Vídeos com IA",
    description: "Gere vídeos promocionais profissionais com avatares falantes em minutos"
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Automation",
    description: "Chatbots inteligentes, funis de conversão e gestão de múltiplos números"
  },
  {
    icon: Target,
    title: "Facebook & TikTok Ads",
    description: "Campanhas automatizadas com copy gerado por IA e otimização contínua"
  },
  {
    icon: ShoppingCart,
    title: "Dropshipping Completo",
    description: "Importação automática de produtos, campanhas multi-canal e sistema de pagamento"
  },
  {
    icon: Sparkles,
    title: "Magic Pages",
    description: "Landing pages de alta conversão geradas automaticamente com IA"
  },
  {
    icon: BarChart3,
    title: "CRM Inteligente",
    description: "Gestão automatizada de leads com scoring e follow-up por IA"
  },
  {
    icon: Users,
    title: "AI Agents Personalizados",
    description: "Assistentes virtuais especializados para diferentes nichos de negócio"
  }
]

const testimonials = [
  {
    name: "Carlos Silva",
    role: "CEO, Marketing Digital Pro",
    content: "NexusOne revolucionou nossa agência. Em 3 meses aumentamos nossa produtividade em 300% e reduzimos custos operacionais pela metade.",
    rating: 5
  },
  {
    name: "Ana Rodrigues",
    role: "E-commerce Manager",
    content: "O sistema de dropshipping integrado é incrível. Conseguimos lançar 50 produtos por semana com campanhas automáticas que convertem muito bem.",
    rating: 5
  },
  {
    name: "Pedro Santos",
    role: "Consultor de Vendas",
    content: "Os chatbots do WhatsApp aumentaram nossa taxa de conversão em 180%. O ROI foi positivo já no primeiro mês.",
    rating: 5
  }
]

const stats = [
  { value: "98%", label: "Taxa de Satisfação" },
  { value: "300%", label: "Aumento Médio de Produtividade" },
  { value: "45 dias", label: "ROI Médio Positivo" },
  { value: "10,000+", label: "Empresas Atendidas" }
]

interface SalesPageProps {
  onGetStarted?: () => void
}

export function SalesPage({ onGetStarted }: SalesPageProps = {}) {
  const [selectedPlan, setSelectedPlan] = useState<string>('PRO')
  const { t, isRTL } = useLanguage()

  const handleGetStarted = (planName: string) => {
    if (onGetStarted) {
      onGetStarted()
    } else {
      // In a real app, this would redirect to signup/checkout
      console.log(`Starting with ${planName} plan`)
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-background via-background to-secondary ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Language Selector */}
      <div className="absolute top-4 right-4 z-50">
        <LanguageSelector />
      </div>
      
      {/* Hero Section */}
      <section className="relative px-4 py-20 text-center">
        <div className="mx-auto max-w-6xl">
          <Badge variant="secondary" className="mb-6 text-sm font-medium">
            <Sparkles className="mr-2 h-4 w-4" />
            {t('sales_page.hero.subtitle')}
          </Badge>
          
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            {t('sales_page.hero.title')}
          </h1>
          
          <p className="mx-auto mb-8 max-w-3xl text-lg text-muted-foreground md:text-xl">
            {t('welcome.description')}
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="text-lg" onClick={() => handleGetStarted('PRO')}>
              {t('sales_page.hero.cta')}
              <ArrowRight className={`h-5 w-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
            </Button>
            <Button size="lg" variant="outline" className="text-lg">
              {t('welcome.watch_demo')}
              <Video className={`h-5 w-5 ${isRTL ? 'mr-2' : 'ml-2'}`} />
            </Button>
          </div>
          
          <p className="mt-4 text-sm text-muted-foreground">
            ✅ Sem compromisso • ✅ Cancele quando quiser • ✅ Suporte em português
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary md:text-4xl">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Tudo Que Sua Empresa Precisa em Uma Só Plataforma
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Pare de pagar por dezenas de ferramentas separadas. NexusOne integra tudo que você precisa 
              para automatizar e escalar seu negócio.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 bg-card/50 backdrop-blur-sm transition-all hover:bg-card/80">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-accent" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="px-4 py-20 bg-muted/30">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                Chega de Perder Tempo e Dinheiro com Ferramentas Fragmentadas
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-destructive/10 p-2">
                    <span className="text-destructive">❌</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Custo Alto de Múltiplas Ferramentas</h3>
                    <p className="text-muted-foreground">Pagando R$ 2.000+ por mês em ferramentas separadas</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-destructive/10 p-2">
                    <span className="text-destructive">❌</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Perda de Tempo na Integração</h3>
                    <p className="text-muted-foreground">Horas perdidas conectando sistemas diferentes</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-destructive/10 p-2">
                    <span className="text-destructive">❌</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">Dados Espalhados</h3>
                    <p className="text-muted-foreground">Informações em plataformas diferentes, sem visão unificada</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="rounded-2xl bg-gradient-to-br from-accent/10 to-primary/10 p-8">
                <h3 className="mb-6 text-2xl font-bold">Com NexusOne Você Tem:</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-accent" />
                    <div>
                      <h4 className="font-semibold">Economia de até 80%</h4>
                      <p className="text-muted-foreground">Uma única assinatura substitui 10+ ferramentas</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-accent" />
                    <div>
                      <h4 className="font-semibold">Automação Real</h4>
                      <p className="text-muted-foreground">IA que trabalha 24/7 para seu negócio</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-accent" />
                    <div>
                      <h4 className="font-semibold">Visão Unificada</h4>
                      <p className="text-muted-foreground">Todos os dados em um só dashboard</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-4 py-20" id="pricing">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Escolha o Plano Ideal Para Seu Negócio
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Preços transparentes, sem taxas ocultas. Comece grátis e escale conforme seu crescimento.
            </p>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-3">
            {pricingTiers.map((tier, index) => (
              <Card 
                key={index} 
                className={`relative transition-all hover:shadow-lg ${
                  tier.highlighted 
                    ? 'border-accent bg-accent/5 scale-105 shadow-accent/20 shadow-lg' 
                    : 'border-border'
                }`}
              >
                {tier.highlighted && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground">
                    Mais Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <div className="mt-4">
                    <div className="flex items-center justify-center gap-2">
                      {tier.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          R$ {tier.originalPrice}
                        </span>
                      )}
                      <span className="text-4xl font-bold">
                        R$ {tier.price}
                      </span>
                    </div>
                    <span className="text-muted-foreground">/{tier.period}</span>
                  </div>
                  <CardDescription className="mt-4">{tier.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-semibold">Créditos</div>
                      <div className="text-muted-foreground">{tier.credits}</div>
                    </div>
                    <div>
                      <div className="font-semibold">Vídeos IA</div>
                      <div className="text-muted-foreground">{tier.videos}</div>
                    </div>
                    <div>
                      <div className="font-semibold">WhatsApp</div>
                      <div className="text-muted-foreground">{tier.whatsapp}</div>
                    </div>
                    <div>
                      <div className="font-semibold">Módulos</div>
                      <div className="text-muted-foreground">{tier.modules}</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <ul className="space-y-3">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full" 
                    variant={tier.highlighted ? "default" : "outline"}
                    size="lg"
                    onClick={() => handleGetStarted(tier.name)}
                  >
                    {tier.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Garantia de 30 dias:</strong> Não ficou satisfeito? Devolvemos 100% do seu dinheiro
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-4 py-20 bg-muted/30">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              O Que Nossos Clientes Estão Falando
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Mais de 10.000 empresas já transformaram seus resultados com NexusOne
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="mb-4 flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                    ))}
                  </div>
                  <p className="mb-4 text-sm leading-relaxed">{testimonial.content}</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            Pronto Para Transformar Seu Negócio?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Junte-se a milhares de empresas que já automatizaram seus processos e 
            <strong> aumentaram suas vendas em até 300%</strong> com NexusOne.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" className="text-lg" onClick={() => handleGetStarted('PRO')}>
              Começar Agora - 7 Dias Grátis
              <Rocket className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg">
              Falar com Especialista
              <MessageCircle className="ml-2 h-5 w-5" />
            </Button>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Segurança Garantida
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Suporte em Português
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Sem Compromisso
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}