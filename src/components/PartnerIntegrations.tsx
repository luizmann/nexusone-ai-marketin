import React, { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { useLanguage } from '../contexts/CleanLanguageContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { 
  Building2, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Globe, 
  Zap,
  Target,
  Award,
  Handshake,
  BarChart3,
  Settings,
  ExternalLink,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Code,
  Palette,
  Megaphone,
  Crown,
  Star,
  Rocket,
  Shield
} from '@phosphor-icons/react'
import { toast } from 'sonner'

// Partner Integration Types
interface Partner {
  id: string
  name: string
  type: 'technology' | 'marketing' | 'integration' | 'reseller' | 'agency'
  status: 'active' | 'pending' | 'negotiating' | 'inactive'
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'enterprise'
  commissionRate: number
  recurringRate: number
  minimumVolume: number
  contractValue: number
  integrationStatus: 'planning' | 'development' | 'testing' | 'live' | 'maintenance'
  contact: {
    name: string
    email: string
    phone: string
    company: string
    role: string
  }
  features: {
    apiAccess: boolean
    whiteLabel: boolean
    customBranding: boolean
    dedicatedSupport: boolean
    priorityIntegration: boolean
    revenueSharing: boolean
  }
  metrics: {
    totalSales: number
    monthlyRevenue: number
    conversionRate: number
    customerRetention: number
    avgOrderValue: number
  }
  integrationDetails: {
    apiKey?: string
    webhookUrl?: string
    customDomain?: string
    ssoEnabled: boolean
    lastSync?: string
  }
  contractDetails: {
    startDate: string
    endDate: string
    autoRenewal: boolean
    paymentTerms: string
    exclusivity: boolean
    territories: string[]
  }
}

interface Integration {
  id: string
  partnerId: string
  type: 'api' | 'webhook' | 'iframe' | 'redirect' | 'sso'
  status: 'active' | 'inactive' | 'error' | 'testing'
  name: string
  description: string
  endpoint: string
  lastActivity: string
  monthlyRequests: number
  errorRate: number
  responseTime: number
}

interface Opportunity {
  id: string
  partnerName: string
  type: 'lead' | 'proposal' | 'trial' | 'demo'
  status: 'new' | 'contacted' | 'negotiating' | 'closed_won' | 'closed_lost'
  value: number
  probability: number
  expectedCloseDate: string
  lastActivity: string
  contact: {
    name: string
    email: string
    company: string
  }
  notes: string
}

export function PartnerIntegrations() {
  const { t } = useLanguage()
  const [user] = useKV('user-profile', null)
  const [partners, setPartners] = useKV<Partner[]>('partners', [])
  const [integrations, setIntegrations] = useKV<Integration[]>('partner-integrations', [])
  const [opportunities, setOpportunities] = useKV<Opportunity[]>('partner-opportunities', [])
  const [activeTab, setActiveTab] = useState('partners')
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [isAddingPartner, setIsAddingPartner] = useState(false)

  // Initialize sample data
  useEffect(() => {
    if (partners.length === 0) {
      const samplePartners: Partner[] = [
        {
          id: 'partner_1',
          name: 'TechFlow Solutions',
          type: 'technology',
          status: 'active',
          tier: 'gold',
          commissionRate: 25,
          recurringRate: 15,
          minimumVolume: 50,
          contractValue: 250000,
          integrationStatus: 'live',
          contact: {
            name: 'Carlos Silva',
            email: 'carlos@techflow.com',
            phone: '+55 11 99999-9999',
            company: 'TechFlow Solutions',
            role: 'CTO'
          },
          features: {
            apiAccess: true,
            whiteLabel: true,
            customBranding: true,
            dedicatedSupport: true,
            priorityIntegration: true,
            revenueSharing: false
          },
          metrics: {
            totalSales: 127,
            monthlyRevenue: 48500,
            conversionRate: 18.5,
            customerRetention: 89,
            avgOrderValue: 382
          },
          integrationDetails: {
            apiKey: 'tf_live_...',
            webhookUrl: 'https://techflow.com/webhooks/nexus',
            customDomain: 'nexus.techflow.com',
            ssoEnabled: true,
            lastSync: new Date().toISOString()
          },
          contractDetails: {
            startDate: '2024-01-15',
            endDate: '2025-01-15',
            autoRenewal: true,
            paymentTerms: 'Net 30',
            exclusivity: false,
            territories: ['Brazil', 'Argentina']
          }
        },
        {
          id: 'partner_2',
          name: 'Digital Marketing Pro',
          type: 'marketing',
          status: 'negotiating',
          tier: 'silver',
          commissionRate: 35,
          recurringRate: 20,
          minimumVolume: 25,
          contractValue: 150000,
          integrationStatus: 'development',
          contact: {
            name: 'Maria Santos',
            email: 'maria@digitalmarketing.com',
            phone: '+55 21 88888-8888',
            company: 'Digital Marketing Pro',
            role: 'CEO'
          },
          features: {
            apiAccess: false,
            whiteLabel: true,
            customBranding: false,
            dedicatedSupport: true,
            priorityIntegration: false,
            revenueSharing: true
          },
          metrics: {
            totalSales: 0,
            monthlyRevenue: 0,
            conversionRate: 0,
            customerRetention: 0,
            avgOrderValue: 0
          },
          integrationDetails: {
            ssoEnabled: false
          },
          contractDetails: {
            startDate: '2024-03-01',
            endDate: '2025-03-01',
            autoRenewal: false,
            paymentTerms: 'Net 15',
            exclusivity: true,
            territories: ['Rio de Janeiro', 'São Paulo']
          }
        },
        {
          id: 'partner_3',
          name: 'Global Agencies Network',
          type: 'agency',
          status: 'active',
          tier: 'platinum',
          commissionRate: 40,
          recurringRate: 25,
          minimumVolume: 100,
          contractValue: 500000,
          integrationStatus: 'live',
          contact: {
            name: 'John Smith',
            email: 'john@globalagencies.com',
            phone: '+1 555 123-4567',
            company: 'Global Agencies Network',
            role: 'VP of Partnerships'
          },
          features: {
            apiAccess: true,
            whiteLabel: true,
            customBranding: true,
            dedicatedSupport: true,
            priorityIntegration: true,
            revenueSharing: true
          },
          metrics: {
            totalSales: 328,
            monthlyRevenue: 125000,
            conversionRate: 22.3,
            customerRetention: 94,
            avgOrderValue: 581
          },
          integrationDetails: {
            apiKey: 'gan_live_...',
            webhookUrl: 'https://api.globalagencies.com/nexus',
            customDomain: 'nexus.globalagencies.com',
            ssoEnabled: true,
            lastSync: new Date(Date.now() - 3600000).toISOString()
          },
          contractDetails: {
            startDate: '2023-06-01',
            endDate: '2024-06-01',
            autoRenewal: true,
            paymentTerms: 'Net 45',
            exclusivity: false,
            territories: ['United States', 'Canada', 'Europe']
          }
        }
      ]
      setPartners(samplePartners)

      const sampleIntegrations: Integration[] = [
        {
          id: 'int_1',
          partnerId: 'partner_1',
          type: 'api',
          status: 'active',
          name: 'TechFlow API Integration',
          description: 'Real-time customer sync and campaign management',
          endpoint: 'https://api.techflow.com/v1',
          lastActivity: new Date(Date.now() - 1800000).toISOString(),
          monthlyRequests: 15420,
          errorRate: 0.2,
          responseTime: 180
        },
        {
          id: 'int_2',
          partnerId: 'partner_3',
          type: 'webhook',
          status: 'active',
          name: 'Global Agencies Webhook',
          description: 'Event-driven notifications for sales and updates',
          endpoint: 'https://webhooks.globalagencies.com/nexus',
          lastActivity: new Date(Date.now() - 900000).toISOString(),
          monthlyRequests: 8750,
          errorRate: 0.1,
          responseTime: 95
        }
      ]
      setIntegrations(sampleIntegrations)

      const sampleOpportunities: Opportunity[] = [
        {
          id: 'opp_1',
          partnerName: 'European Marketing Solutions',
          type: 'proposal',
          status: 'negotiating',
          value: 180000,
          probability: 75,
          expectedCloseDate: '2024-02-15',
          lastActivity: new Date(Date.now() - 86400000).toISOString(),
          contact: {
            name: 'Pierre Dubois',
            email: 'pierre@euromarketing.eu',
            company: 'European Marketing Solutions'
          },
          notes: 'Interested in white-label solution for European market. Discussing custom pricing.'
        },
        {
          id: 'opp_2',
          partnerName: 'Asia Pacific Digital',
          type: 'demo',
          status: 'contacted',
          value: 320000,
          probability: 45,
          expectedCloseDate: '2024-03-30',
          lastActivity: new Date(Date.now() - 172800000).toISOString(),
          contact: {
            name: 'Yuki Tanaka',
            email: 'yuki@apdigital.jp',
            company: 'Asia Pacific Digital'
          },
          notes: 'Scheduled demo for next week. Looking for multi-language support.'
        }
      ]
      setOpportunities(sampleOpportunities)
    }
  }, [partners])

  const getTierInfo = (tier: string) => {
    const tiers = {
      bronze: { name: 'Bronze', color: 'bg-orange-500', icon: Award },
      silver: { name: 'Silver', color: 'bg-gray-400', icon: Star },
      gold: { name: 'Gold', color: 'bg-yellow-500', icon: Crown },
      platinum: { name: 'Platinum', color: 'bg-purple-500', icon: Zap },
      enterprise: { name: 'Enterprise', color: 'bg-blue-500', icon: Rocket }
    }
    return tiers[tier as keyof typeof tiers] || tiers.bronze
  }

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-500',
      pending: 'bg-yellow-500',
      negotiating: 'bg-blue-500',
      inactive: 'bg-gray-500',
      error: 'bg-red-500',
      testing: 'bg-purple-500',
      live: 'bg-green-500',
      development: 'bg-blue-500',
      planning: 'bg-yellow-500',
      maintenance: 'bg-orange-500'
    }
    return colors[status as keyof typeof colors] || colors.inactive
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('partners.title')}</h1>
          <p className="text-muted-foreground">{t('partners.subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setIsAddingPartner(true)}>
            <Plus className="w-4 h-4 mr-2" />
            {t('partners.addPartner')}
          </Button>
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            {t('partners.exportReport')}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('partners.totalPartners')}</p>
                <p className="text-2xl font-bold">{partners.length}</p>
              </div>
              <Handshake className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('partners.monthlyRevenue')}</p>
                <p className="text-2xl font-bold">
                  R$ {partners.reduce((sum, p) => sum + p.metrics.monthlyRevenue, 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('partners.activeIntegrations')}</p>
                <p className="text-2xl font-bold">{integrations.filter(i => i.status === 'active').length}</p>
              </div>
              <Zap className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('partners.avgConversion')}</p>
                <p className="text-2xl font-bold">
                  {(partners.reduce((sum, p) => sum + p.metrics.conversionRate, 0) / partners.length || 0).toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="partners">{t('partners.partners')}</TabsTrigger>
          <TabsTrigger value="integrations">{t('partners.integrations')}</TabsTrigger>
          <TabsTrigger value="opportunities">{t('partners.opportunities')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('partners.analytics')}</TabsTrigger>
          <TabsTrigger value="settings">{t('partners.settings')}</TabsTrigger>
        </TabsList>

        {/* Partners Tab */}
        <TabsContent value="partners" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {partners.map((partner) => {
              const tierInfo = getTierInfo(partner.tier)
              const TierIcon = tierInfo.icon
              
              return (
                <Card key={partner.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => setSelectedPartner(partner)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{partner.name}</CardTitle>
                      <Badge className={`${tierInfo.color} text-white`}>
                        <TierIcon className="w-3 h-3 mr-1" />
                        {tierInfo.name}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{partner.type}</Badge>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(partner.status)}`} />
                      <span className="text-sm text-muted-foreground">{partner.status}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">{t('partners.commission')}</p>
                        <p className="font-medium">{partner.commissionRate}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('partners.recurring')}</p>
                        <p className="font-medium">{partner.recurringRate}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('partners.sales')}</p>
                        <p className="font-medium">{partner.metrics.totalSales}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('partners.revenue')}</p>
                        <p className="font-medium">R$ {partner.metrics.monthlyRevenue.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <p className="text-muted-foreground">{t('partners.integration')}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {partner.integrationStatus}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {integrations.map((integration) => (
              <Card key={integration.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{integration.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(integration.status)}`} />
                      <Badge variant="outline">{integration.type}</Badge>
                    </div>
                  </div>
                  <CardDescription>{integration.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">{t('partners.requests')}</p>
                      <p className="font-medium">{integration.monthlyRequests.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('partners.errorRate')}</p>
                      <p className="font-medium">{integration.errorRate}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('partners.responseTime')}</p>
                      <p className="font-medium">{integration.responseTime}ms</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <p className="text-muted-foreground">{t('partners.lastActivity')}</p>
                      <p>{new Date(integration.lastActivity).toLocaleString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('partners.addIntegration')}</CardTitle>
              <CardDescription>{t('partners.addIntegrationDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-6 border rounded-lg cursor-pointer hover:bg-muted/50">
                  <Code className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">REST API</h4>
                  <p className="text-sm text-muted-foreground">Direct API integration</p>
                </div>
                <div className="text-center p-6 border rounded-lg cursor-pointer hover:bg-muted/50">
                  <Zap className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Webhook</h4>
                  <p className="text-sm text-muted-foreground">Event-driven notifications</p>
                </div>
                <div className="text-center p-6 border rounded-lg cursor-pointer hover:bg-muted/50">
                  <Globe className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">SSO</h4>
                  <p className="text-sm text-muted-foreground">Single sign-on integration</p>
                </div>
                <div className="text-center p-6 border rounded-lg cursor-pointer hover:bg-muted/50">
                  <Palette className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">White Label</h4>
                  <p className="text-sm text-muted-foreground">Custom branding solution</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Opportunities Tab */}
        <TabsContent value="opportunities" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">{t('partners.totalOpportunities')}</p>
                  <p className="text-2xl font-bold">{opportunities.length}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">{t('partners.pipelineValue')}</p>
                  <p className="text-2xl font-bold">
                    R$ {opportunities.reduce((sum, o) => sum + o.value, 0).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">{t('partners.avgProbability')}</p>
                  <p className="text-2xl font-bold">
                    {(opportunities.reduce((sum, o) => sum + o.probability, 0) / opportunities.length || 0).toFixed(0)}%
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">{t('partners.avgCloseTime')}</p>
                  <p className="text-2xl font-bold">45d</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('partners.activeOpportunities')}</CardTitle>
              <CardDescription>{t('partners.activeOpportunitiesDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {opportunities.map((opportunity) => (
                  <div key={opportunity.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{opportunity.partnerName}</h4>
                        <p className="text-sm text-muted-foreground">{opportunity.contact.company}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">R$ {opportunity.value.toLocaleString()}</p>
                        <Badge variant="outline">{opportunity.probability}% probability</Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-muted-foreground">{t('partners.type')}</p>
                        <Badge variant="outline" className="text-xs">{opportunity.type}</Badge>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('partners.status')}</p>
                        <Badge variant="outline" className="text-xs">{opportunity.status}</Badge>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('partners.expectedClose')}</p>
                        <p>{new Date(opportunity.expectedCloseDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('partners.lastActivity')}</p>
                        <p>{new Date(opportunity.lastActivity).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {opportunity.notes && (
                      <div className="text-sm text-muted-foreground border-t pt-3">
                        <p>{opportunity.notes}</p>
                      </div>
                    )}

                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        {t('partners.edit')}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Megaphone className="w-4 h-4 mr-1" />
                        {t('partners.contact')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('partners.performanceByTier')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['platinum', 'gold', 'silver', 'bronze'].map((tier) => {
                    const tierPartners = partners.filter(p => p.tier === tier)
                    const totalRevenue = tierPartners.reduce((sum, p) => sum + p.metrics.monthlyRevenue, 0)
                    const avgConversion = tierPartners.reduce((sum, p) => sum + p.metrics.conversionRate, 0) / tierPartners.length || 0
                    const tierInfo = getTierInfo(tier)
                    const TierIcon = tierInfo.icon

                    return (
                      <div key={tier} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <TierIcon className="w-6 h-6 text-gray-600" />
                          <div>
                            <p className="font-medium">{tierInfo.name}</p>
                            <p className="text-sm text-muted-foreground">{tierPartners.length} partners</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">R$ {totalRevenue.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">{avgConversion.toFixed(1)}% conversion</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('partners.integrationHealth')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {integrations.map((integration) => (
                    <div key={integration.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(integration.status)}`} />
                        <div>
                          <p className="font-medium">{integration.name}</p>
                          <p className="text-sm text-muted-foreground">{integration.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{integration.responseTime}ms</p>
                        <p className="text-sm text-muted-foreground">{integration.errorRate}% errors</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('partners.globalSettings')}</CardTitle>
                <CardDescription>{t('partners.globalSettingsDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-approve">{t('partners.autoApprove')}</Label>
                    <p className="text-sm text-muted-foreground">{t('partners.autoApproveDesc')}</p>
                  </div>
                  <Switch id="auto-approve" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="api-access">{t('partners.defaultApiAccess')}</Label>
                    <p className="text-sm text-muted-foreground">{t('partners.defaultApiAccessDesc')}</p>
                  </div>
                  <Switch id="api-access" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min-commission">{t('partners.minimumCommission')}</Label>
                  <Input id="min-commission" type="number" placeholder="15" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-commission">{t('partners.maximumCommission')}</Label>
                  <Input id="max-commission" type="number" placeholder="50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('partners.notificationSettings')}</CardTitle>
                <CardDescription>{t('partners.notificationSettingsDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="new-partner">{t('partners.newPartnerNotifications')}</Label>
                    <p className="text-sm text-muted-foreground">{t('partners.newPartnerNotificationsDesc')}</p>
                  </div>
                  <Switch id="new-partner" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="integration-alerts">{t('partners.integrationAlerts')}</Label>
                    <p className="text-sm text-muted-foreground">{t('partners.integrationAlertsDesc')}</p>
                  </div>
                  <Switch id="integration-alerts" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="performance-reports">{t('partners.performanceReports')}</Label>
                    <p className="text-sm text-muted-foreground">{t('partners.performanceReportsDesc')}</p>
                  </div>
                  <Switch id="performance-reports" defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}