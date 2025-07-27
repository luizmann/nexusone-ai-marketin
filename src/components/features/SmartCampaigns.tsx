import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLanguage } from '../../contexts/CleanLanguageContext'
import { Target, Image, Users, DollarSign, Play, CheckCircle, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

export function SmartCampaigns() {
  const { t } = useLanguage()
  const [productUrl, setProductUrl] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [budget, setBudget] = useState('')
  const [campaignType, setCampaignType] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCampaign, setGeneratedCampaign] = useState<any>(null)

  const generateCampaign = async () => {
    if (!productUrl || !targetAudience || !budget) {
      toast.error(t('please_fill_all_required_fields'))
      return
    }

    setIsGenerating(true)
    
    try {
      // Simular geração de campanha com IA
      await new Promise(resolve => setTimeout(resolve, 4000))
      
      const mockCampaign = {
        id: `campaign_${Date.now()}`,
        name: `Smart Campaign - ${new Date().toLocaleDateString()}`,
        type: campaignType,
        budget: budget,
        audience: {
          size: '50,000 - 80,000',
          demographics: targetAudience,
          interests: ['E-commerce', 'Online Shopping', 'Technology', 'Innovation'],
          locations: ['Brazil', 'United States', 'Europe']
        },
        creatives: [
          {
            type: 'image',
            url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=630&fit=crop',
            headline: 'Transforme Sua Vida Hoje! 🔥',
            description: 'Descubra o produto que mudará tudo. Oferta especial por tempo limitado!',
            cta: 'Comprar Agora'
          },
          {
            type: 'video',
            url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            headline: 'Veja Como Funciona! 🎥',
            description: 'Demonstração completa em menos de 2 minutos.',
            cta: 'Assistir Demo'
          }
        ],
        copy: {
          primary: 'ÚLTIMAS 24 HORAS! Desconto de 50% + Frete Grátis 🚚',
          secondary: 'Mais de 10.000 clientes satisfeitos. Garantia de 30 dias.',
          cta: 'GARANTIR DESCONTO AGORA'
        },
        targeting: {
          age: '25-45',
          gender: 'All',
          device: 'Mobile First',
          placement: 'Facebook Feed, Instagram Stories, Reels'
        },
        estimated: {
          reach: '15,000 - 45,000',
          clicks: '750 - 2,250',
          conversions: '38 - 113',
          cost_per_click: 'R$ 0,45 - R$ 1,20',
          roas: '4.2x - 6.8x'
        }
      }
      
      setGeneratedCampaign(mockCampaign)
      toast.success(t('campaign_generated_successfully'))
    } catch (error) {
      toast.error(t('error_generating_campaign'))
    } finally {
      setIsGenerating(false)
    }
  }

  const launchCampaign = () => {
    toast.success(t('campaign_launched_successfully'))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('smart_campaigns')}</h1>
        <p className="text-muted-foreground">{t('create_automated_facebook_ads_campaigns_with_ai')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {t('campaign_generator')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">{t('product_url')} *</label>
              <Input
                placeholder="https://exemplo.com/produto"
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">{t('daily_budget')} *</label>
              <Input
                placeholder="R$ 50,00"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">{t('target_audience')} *</label>
            <Textarea
              placeholder={t('describe_your_ideal_customer')}
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t('campaign_type')}</label>
            <Select value={campaignType} onValueChange={setCampaignType}>
              <SelectTrigger>
                <SelectValue placeholder={t('select_campaign_objective')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conversions">{t('conversions')}</SelectItem>
                <SelectItem value="traffic">{t('traffic')}</SelectItem>
                <SelectItem value="awareness">{t('brand_awareness')}</SelectItem>
                <SelectItem value="engagement">{t('engagement')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={generateCampaign}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Target className="h-4 w-4 mr-2 animate-spin" />
                {t('generating_campaign')}...
              </>
            ) : (
              <>
                <Target className="h-4 w-4 mr-2" />
                {t('generate_smart_campaign')}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedCampaign && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                {t('campaign_ready')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-700">{t('audience_size')}</span>
                  </div>
                  <p className="text-xl font-bold text-blue-800">{generatedCampaign.audience.size}</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-700">{t('estimated_roas')}</span>
                  </div>
                  <p className="text-xl font-bold text-green-800">{generatedCampaign.estimated.roas}</p>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-purple-700">{t('estimated_reach')}</span>
                  </div>
                  <p className="text-xl font-bold text-purple-800">{generatedCampaign.estimated.reach}</p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Image className="h-4 w-4 text-orange-600" />
                    <span className="font-medium text-orange-700">{t('creatives')}</span>
                  </div>
                  <p className="text-xl font-bold text-orange-800">{generatedCampaign.creatives.length}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{t('generated_creatives')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generatedCampaign.creatives.map((creative: any, index: number) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                          {creative.type === 'image' ? (
                            <img 
                              src={creative.url} 
                              alt="Campaign Creative"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-900">
                              <Play className="h-12 w-12 text-white" />
                            </div>
                          )}
                        </div>
                        <h4 className="font-medium mb-2">{creative.headline}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{creative.description}</p>
                        <Button size="sm" variant="outline" className="w-full">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          {creative.cta}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800 mb-2">{t('campaign_copy')}</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-green-700">{t('primary')}: </span>
                    <span className="text-green-600">{generatedCampaign.copy.primary}</span>
                  </div>
                  <div>
                    <span className="font-medium text-green-700">{t('secondary')}: </span>
                    <span className="text-green-600">{generatedCampaign.copy.secondary}</span>
                  </div>
                  <div>
                    <span className="font-medium text-green-700">CTA: </span>
                    <span className="text-green-600">{generatedCampaign.copy.cta}</span>
                  </div>
                </div>
              </div>

              <Button onClick={launchCampaign} className="w-full mt-6" size="lg">
                <Play className="h-4 w-4 mr-2" />
                {t('launch_campaign')}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}