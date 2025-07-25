import React, { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { useLanguage } from '../contexts/LanguageContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Copy, 
  Share, 
  Gift,
  Target,
  Award,
  Handshake,
  Globe,
  BarChart3,
  CreditCard,
  Link,
  Eye,
  MousePointer,
  CheckCircle,
  ExternalLink,
  Download,
  Calendar,
  Zap,
  Crown,
  Star,
  Rocket
} from '@phosphor-icons/react'
import { toast } from 'sonner'

// Affiliate Program Types
interface AffiliateProfile {
  id: string
  userId: string
  affiliateCode: string
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'
  status: 'active' | 'pending' | 'suspended'
  totalReferrals: number
  totalEarnings: number
  monthlyEarnings: number
  conversionRate: number
  joinedAt: string
  payoutMethod: 'bank' | 'paypal' | 'crypto' | 'pix'
  payoutDetails: any
  specializations: string[]
  languages: string[]
  marketingChannels: string[]
}

interface Referral {
  id: string
  affiliateId: string
  referredUserId: string
  referralCode: string
  status: 'pending' | 'confirmed' | 'paid'
  planType: 'pro' | 'premium'
  commissionAmount: number
  conversionDate: string
  payoutDate?: string
  recurringCommissions: number
}

interface Commission {
  id: string
  affiliateId: string
  type: 'first_sale' | 'recurring' | 'bonus' | 'tier_bonus'
  amount: number
  percentage: number
  referralId: string
  status: 'pending' | 'approved' | 'paid'
  createdAt: string
  paidAt?: string
}

interface Partner {
  id: string
  name: string
  type: 'technology' | 'marketing' | 'integration' | 'reseller'
  status: 'active' | 'pending' | 'negotiating'
  commissionRate: number
  minimumVolume: number
  contractValue: number
  integrationStatus: 'planning' | 'development' | 'testing' | 'live'
  contact: {
    name: string
    email: string
    phone: string
  }
  apiAccess: boolean
  whiteLabel: boolean
}

export function AffiliateProgram() {
  const { t } = useLanguage()
  const [user] = useKV('user-profile', null)
  const [affiliateProfile, setAffiliateProfile] = useKV<AffiliateProfile | null>('affiliate-profile', null)
  const [referrals, setReferrals] = useKV<Referral[]>('affiliate-referrals', [])
  const [commissions, setCommissions] = useKV<Commission[]>('affiliate-commissions', [])
  const [partners, setPartners] = useKV<Partner[]>('affiliate-partners', [])
  const [activeTab, setActiveTab] = useState('overview')
  const [isGeneratingMaterials, setIsGeneratingMaterials] = useState(false)

  // Initialize affiliate profile if user doesn't have one
  useEffect(() => {
    if (user && !affiliateProfile) {
      const newProfile: AffiliateProfile = {
        id: `aff_${Date.now()}`,
        userId: user.id,
        affiliateCode: generateAffiliateCode(),
        tier: 'bronze',
        status: 'active',
        totalReferrals: 0,
        totalEarnings: 0,
        monthlyEarnings: 0,
        conversionRate: 0,
        joinedAt: new Date().toISOString(),
        payoutMethod: 'pix',
        payoutDetails: {},
        specializations: [],
        languages: [user.language || 'en'],
        marketingChannels: []
      }
      setAffiliateProfile(newProfile)
    }
  }, [user, affiliateProfile])

  // Generate unique affiliate code
  const generateAffiliateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = 'NX'
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // Get tier info
  const getTierInfo = (tier: string) => {
    const tiers = {
      bronze: { 
        name: 'Bronze', 
        commission: '25%', 
        recurring: '10%', 
        color: 'bg-orange-500',
        icon: Award,
        benefits: ['Basic marketing materials', 'Monthly payouts', 'Email support']
      },
      silver: { 
        name: 'Silver', 
        commission: '30%', 
        recurring: '15%', 
        color: 'bg-gray-400',
        icon: Star,
        benefits: ['Advanced materials', 'Bi-weekly payouts', 'Priority support', 'Custom landing pages']
      },
      gold: { 
        name: 'Gold', 
        commission: '35%', 
        recurring: '20%', 
        color: 'bg-yellow-500',
        icon: Crown,
        benefits: ['Premium materials', 'Weekly payouts', 'Dedicated manager', 'White-label options']
      },
      platinum: { 
        name: 'Platinum', 
        commission: '40%', 
        recurring: '25%', 
        color: 'bg-purple-500',
        icon: Zap,
        benefits: ['Exclusive materials', 'Real-time payouts', 'Direct API access', 'Custom integrations']
      },
      diamond: { 
        name: 'Diamond', 
        commission: '50%', 
        recurring: '30%', 
        color: 'bg-blue-500',
        icon: Rocket,
        benefits: ['Partner status', 'Revenue sharing', 'Co-marketing', 'Strategic planning']
      }
    }
    return tiers[tier as keyof typeof tiers] || tiers.bronze
  }

  // Copy affiliate link
  const copyAffiliateLink = () => {
    const link = `https://nexusone.ai/?ref=${affiliateProfile?.affiliateCode}`
    navigator.clipboard.writeText(link)
    toast.success(t('affiliate.linkCopied'))
  }

  // Generate marketing materials
  const generateMarketingMaterials = async () => {
    setIsGeneratingMaterials(true)
    try {
      // Simulate AI generation of marketing materials
      await new Promise(resolve => setTimeout(resolve, 3000))
      toast.success(t('affiliate.materialsGenerated'))
    } catch (error) {
      toast.error(t('affiliate.materialsError'))
    } finally {
      setIsGeneratingMaterials(false)
    }
  }

  // Add sample data for demo
  useEffect(() => {
    if (affiliateProfile && referrals.length === 0) {
      // Add sample referrals
      const sampleReferrals: Referral[] = [
        {
          id: 'ref_1',
          affiliateId: affiliateProfile.id,
          referredUserId: 'user_123',
          referralCode: affiliateProfile.affiliateCode,
          status: 'confirmed',
          planType: 'pro',
          commissionAmount: 29.10,
          conversionDate: new Date(Date.now() - 86400000 * 5).toISOString(),
          recurringCommissions: 2
        },
        {
          id: 'ref_2',
          affiliateId: affiliateProfile.id,
          referredUserId: 'user_124',
          referralCode: affiliateProfile.affiliateCode,
          status: 'confirmed',
          planType: 'premium',
          commissionAmount: 89.10,
          conversionDate: new Date(Date.now() - 86400000 * 12).toISOString(),
          recurringCommissions: 1
        }
      ]
      setReferrals(sampleReferrals)

      // Add sample commissions
      const sampleCommissions: Commission[] = [
        {
          id: 'comm_1',
          affiliateId: affiliateProfile.id,
          type: 'first_sale',
          amount: 29.10,
          percentage: 30,
          referralId: 'ref_1',
          status: 'paid',
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          paidAt: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        {
          id: 'comm_2',
          affiliateId: affiliateProfile.id,
          type: 'recurring',
          amount: 14.55,
          percentage: 15,
          referralId: 'ref_1',
          status: 'approved',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
        }
      ]
      setCommissions(sampleCommissions)

      // Add sample partners
      const samplePartners: Partner[] = [
        {
          id: 'partner_1',
          name: 'TechFlow Solutions',
          type: 'technology',
          status: 'active',
          commissionRate: 20,
          minimumVolume: 50,
          contractValue: 150000,
          integrationStatus: 'live',
          contact: {
            name: 'Carlos Silva',
            email: 'carlos@techflow.com',
            phone: '+55 11 99999-9999'
          },
          apiAccess: true,
          whiteLabel: false
        },
        {
          id: 'partner_2',
          name: 'Digital Marketing Pro',
          type: 'marketing',
          status: 'negotiating',
          commissionRate: 35,
          minimumVolume: 25,
          contractValue: 75000,
          integrationStatus: 'planning',
          contact: {
            name: 'Maria Santos',
            email: 'maria@digitalmarketing.com',
            phone: '+55 21 88888-8888'
          },
          apiAccess: false,
          whiteLabel: true
        }
      ]
      setPartners(samplePartners)

      // Update affiliate profile with earnings
      setAffiliateProfile(prev => prev ? {
        ...prev,
        totalReferrals: 2,
        totalEarnings: 118.20,
        monthlyEarnings: 43.65,
        conversionRate: 12.5,
        tier: 'silver'
      } : prev)
    }
  }, [affiliateProfile])

  if (!affiliateProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Handshake className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">{t('affiliate.loading')}</h3>
          <p className="text-muted-foreground">{t('affiliate.loadingDesc')}</p>
        </div>
      </div>
    )
  }

  const tierInfo = getTierInfo(affiliateProfile.tier)
  const TierIcon = tierInfo.icon

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('affiliate.title')}</h1>
          <p className="text-muted-foreground">{t('affiliate.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={`${tierInfo.color} text-white`}>
            <TierIcon className="w-4 h-4 mr-1" />
            {tierInfo.name}
          </Badge>
          <Button onClick={copyAffiliateLink}>
            <Copy className="w-4 h-4 mr-2" />
            {t('affiliate.copyLink')}
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('affiliate.totalEarnings')}</p>
                <p className="text-2xl font-bold">R$ {affiliateProfile.totalEarnings.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('affiliate.totalReferrals')}</p>
                <p className="text-2xl font-bold">{affiliateProfile.totalReferrals}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('affiliate.conversionRate')}</p>
                <p className="text-2xl font-bold">{affiliateProfile.conversionRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('affiliate.monthlyEarnings')}</p>
                <p className="text-2xl font-bold">R$ {affiliateProfile.monthlyEarnings.toFixed(2)}</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">{t('affiliate.overview')}</TabsTrigger>
          <TabsTrigger value="referrals">{t('affiliate.referrals')}</TabsTrigger>
          <TabsTrigger value="commissions">{t('affiliate.commissions')}</TabsTrigger>
          <TabsTrigger value="materials">{t('affiliate.materials')}</TabsTrigger>
          <TabsTrigger value="partners">{t('affiliate.partners')}</TabsTrigger>
          <TabsTrigger value="settings">{t('affiliate.settings')}</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Commission Structure */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  {t('affiliate.commissionStructure')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>{t('affiliate.firstSale')}</span>
                    <Badge variant="secondary">{tierInfo.commission}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('affiliate.recurring')}</span>
                    <Badge variant="secondary">{tierInfo.recurring}</Badge>
                  </div>
                  <Separator />
                  <div className="text-sm text-muted-foreground">
                    <p className="mb-2">{t('affiliate.tierBenefits')}:</p>
                    <ul className="space-y-1">
                      {tierInfo.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  {t('affiliate.quickActions')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={copyAffiliateLink}>
                  <Copy className="w-4 h-4 mr-2" />
                  {t('affiliate.copyAffiliateLink')}
                </Button>
                <Button variant="outline" className="w-full" onClick={generateMarketingMaterials} disabled={isGeneratingMaterials}>
                  {isGeneratingMaterials ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                      {t('affiliate.generating')}
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      {t('affiliate.generateMaterials')}
                    </>
                  )}
                </Button>
                <Button variant="outline" className="w-full">
                  <Share className="w-4 h-4 mr-2" />
                  {t('affiliate.shareOnSocial')}
                </Button>
                <Button variant="outline" className="w-full">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  {t('affiliate.viewAnalytics')}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Affiliate Link */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="w-5 h-5" />
                {t('affiliate.yourLink')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input 
                  value={`https://nexusone.ai/?ref=${affiliateProfile.affiliateCode}`}
                  readOnly
                  className="font-mono"
                />
                <Button onClick={copyAffiliateLink}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {t('affiliate.linkDescription')}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Referrals Tab */}
        <TabsContent value="referrals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('affiliate.recentReferrals')}</CardTitle>
              <CardDescription>{t('affiliate.recentReferralsDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {referrals.map((referral) => (
                  <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <div>
                        <p className="font-medium">Referral #{referral.id.slice(-4)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(referral.conversionDate).toLocaleDateString()} • {referral.planType.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">R$ {referral.commissionAmount.toFixed(2)}</p>
                      <Badge variant={referral.status === 'confirmed' ? 'default' : 'secondary'}>
                        {referral.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Commissions Tab */}
        <TabsContent value="commissions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <CreditCard className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">{t('affiliate.pendingCommissions')}</p>
                  <p className="text-2xl font-bold">R$ {commissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0).toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <CheckCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">{t('affiliate.approvedCommissions')}</p>
                  <p className="text-2xl font-bold">R$ {commissions.filter(c => c.status === 'approved').reduce((sum, c) => sum + c.amount, 0).toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <DollarSign className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">{t('affiliate.paidCommissions')}</p>
                  <p className="text-2xl font-bold">R$ {commissions.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.amount, 0).toFixed(2)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('affiliate.commissionHistory')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commissions.map((commission) => (
                  <div key={commission.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${
                        commission.status === 'paid' ? 'bg-green-500' : 
                        commission.status === 'approved' ? 'bg-blue-500' : 'bg-yellow-500'
                      }`} />
                      <div>
                        <p className="font-medium">{commission.type.replace('_', ' ').toUpperCase()}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(commission.createdAt).toLocaleDateString()} • {commission.percentage}%
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">R$ {commission.amount.toFixed(2)}</p>
                      <Badge variant={
                        commission.status === 'paid' ? 'default' : 
                        commission.status === 'approved' ? 'secondary' : 'outline'
                      }>
                        {commission.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Marketing Materials Tab */}
        <TabsContent value="materials" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('affiliate.bannerAds')}</CardTitle>
                <CardDescription>{t('affiliate.bannerAdsDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-video bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center text-white font-bold">
                    728x90
                  </div>
                  <div className="aspect-square bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center text-white font-bold">
                    300x300
                  </div>
                </div>
                <Button className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  {t('affiliate.downloadBanners')}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('affiliate.emailTemplates')}</CardTitle>
                <CardDescription>{t('affiliate.emailTemplatesDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium">{t('affiliate.introductionEmail')}</p>
                    <p className="text-sm text-muted-foreground">{t('affiliate.introductionEmailDesc')}</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="font-medium">{t('affiliate.followUpEmail')}</p>
                    <p className="text-sm text-muted-foreground">{t('affiliate.followUpEmailDesc')}</p>
                  </div>
                </div>
                <Button className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  {t('affiliate.downloadTemplates')}
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('affiliate.socialMediaPosts')}</CardTitle>
              <CardDescription>{t('affiliate.socialMediaPostsDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">LinkedIn Post</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    "Transform your business with AI-powered marketing automation..."
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Twitter Thread</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    "🚀 Just discovered the ultimate marketing automation platform..."
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Instagram Story</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    "Swipe up to see how I 10x'd my marketing results..."
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Partners Tab */}
        <TabsContent value="partners" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Handshake className="w-5 h-5" />
                {t('affiliate.strategicPartners')}
              </CardTitle>
              <CardDescription>{t('affiliate.strategicPartnersDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {partners.map((partner) => (
                  <div key={partner.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold">{partner.name}</h4>
                        <p className="text-sm text-muted-foreground">{partner.type}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={partner.status === 'active' ? 'default' : 'secondary'}>
                          {partner.status}
                        </Badge>
                        <Badge variant="outline">
                          {partner.commissionRate}%
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">{t('affiliate.contractValue')}</p>
                        <p className="font-medium">R$ {partner.contractValue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('affiliate.minimumVolume')}</p>
                        <p className="font-medium">{partner.minimumVolume} sales/month</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('affiliate.integration')}</p>
                        <Badge variant="outline" className="text-xs">
                          {partner.integrationStatus}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-muted-foreground">{t('affiliate.features')}</p>
                        <div className="flex gap-1">
                          {partner.apiAccess && <Badge variant="outline" className="text-xs">API</Badge>}
                          {partner.whiteLabel && <Badge variant="outline" className="text-xs">White Label</Badge>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('affiliate.becomePartner')}</CardTitle>
              <CardDescription>{t('affiliate.becomePartnerDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 border rounded-lg">
                  <Globe className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">{t('affiliate.reseller')}</h4>
                  <p className="text-sm text-muted-foreground mb-4">{t('affiliate.resellerDesc')}</p>
                  <Button variant="outline" className="w-full">
                    {t('affiliate.applyNow')}
                  </Button>
                </div>
                <div className="text-center p-6 border rounded-lg">
                  <Zap className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">{t('affiliate.technology')}</h4>
                  <p className="text-sm text-muted-foreground mb-4">{t('affiliate.technologyDesc')}</p>
                  <Button variant="outline" className="w-full">
                    {t('affiliate.learnMore')}
                  </Button>
                </div>
                <div className="text-center p-6 border rounded-lg">
                  <Target className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">{t('affiliate.agency')}</h4>
                  <p className="text-sm text-muted-foreground mb-4">{t('affiliate.agencyDesc')}</p>
                  <Button variant="outline" className="w-full">
                    {t('affiliate.getStarted')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('affiliate.payoutSettings')}</CardTitle>
                <CardDescription>{t('affiliate.payoutSettingsDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="payout-method">{t('affiliate.payoutMethod')}</Label>
                  <Select value={affiliateProfile.payoutMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="bank">{t('affiliate.bankTransfer')}</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="crypto">{t('affiliate.cryptocurrency')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="payout-threshold">{t('affiliate.minimumPayout')}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="R$ 100" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50">R$ 50</SelectItem>
                      <SelectItem value="100">R$ 100</SelectItem>
                      <SelectItem value="250">R$ 250</SelectItem>
                      <SelectItem value="500">R$ 500</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full">
                  {t('affiliate.updatePayoutSettings')}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('affiliate.profileSettings')}</CardTitle>
                <CardDescription>{t('affiliate.profileSettingsDesc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="specializations">{t('affiliate.specializations')}</Label>
                  <Textarea 
                    id="specializations"
                    placeholder={t('affiliate.specializationsPlaceholder')}
                    className="resize-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="marketing-channels">{t('affiliate.marketingChannels')}</Label>
                  <Textarea 
                    id="marketing-channels"
                    placeholder={t('affiliate.marketingChannelsPlaceholder')}
                    className="resize-none"
                  />
                </div>

                <Button className="w-full">
                  {t('affiliate.updateProfile')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}