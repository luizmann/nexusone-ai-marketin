import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useLanguage } from '../../contexts/CleanLanguageContext'
import { Wand2, Globe, Palette, Type, Image, CheckCircle, Copy } from 'lucide-react'
import { toast } from 'sonner'

export function MagicPages() {
  const { t } = useLanguage()
  const [productUrl, setProductUrl] = useState('')
  const [businessDescription, setBusinessDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedPage, setGeneratedPage] = useState<any>(null)

  const generateLandingPage = async () => {
    if (!productUrl && !businessDescription) {
      toast.error(t('please_provide_product_url_or_description'))
      return
    }

    setIsGenerating(true)
    
    try {
      // Simular geração de página com IA
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const mockPage = {
        title: businessDescription ? `${businessDescription} - Solução Perfeita` : 'Produto Incrível - Oferta Especial',
        subtitle: 'Transforme sua vida hoje mesmo com esta oportunidade única!',
        sections: [
          {
            type: 'hero',
            title: 'OFERTA IMPERDÍVEL! 🔥',
            subtitle: 'Últimas 24 horas com desconto de 50%',
            cta: 'GARANTIR AGORA',
            image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop'
          },
          {
            type: 'benefits',
            title: 'Por que escolher nossa solução?',
            items: [
              '✅ Resultados garantidos em 30 dias',
              '✅ Suporte 24/7 especializado',
              '✅ Garantia de 100% do dinheiro de volta',
              '✅ Mais de 10.000 clientes satisfeitos'
            ]
          },
          {
            type: 'testimonials',
            title: 'O que nossos clientes dizem',
            testimonials: [
              {
                name: 'Maria Silva',
                comment: 'Produto mudou minha vida! Recomendo para todos.',
                rating: 5
              },
              {
                name: 'João Santos',
                comment: 'Excelente qualidade e entrega rápida.',
                rating: 5
              }
            ]
          },
          {
            type: 'urgency',
            title: 'ATENÇÃO: Oferta por tempo limitado!',
            countdown: '23:59:45',
            originalPrice: 'R$ 297,00',
            currentPrice: 'R$ 147,00'
          }
        ],
        url: `https://nexusone.ai/page/${Date.now()}`,
        analytics: {
          views: 0,
          conversions: 0,
          revenue: 0
        }
      }
      
      setGeneratedPage(mockPage)
      toast.success(t('landing_page_generated_successfully'))
    } catch (error) {
      toast.error(t('error_generating_page'))
    } finally {
      setIsGenerating(false)
    }
  }

  const copyPageUrl = () => {
    if (generatedPage?.url) {
      navigator.clipboard.writeText(generatedPage.url)
      toast.success(t('url_copied_to_clipboard'))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('magic_pages')}</h1>
        <p className="text-muted-foreground">{t('create_high_converting_landing_pages_with_ai')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            {t('generate_landing_page')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">{t('product_url')} ({t('optional')})</label>
            <Input
              placeholder="https://exemplo.com/produto"
              value={productUrl}
              onChange={(e) => setProductUrl(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">{t('business_description')}</label>
            <Textarea
              placeholder={t('describe_your_product_or_service')}
              value={businessDescription}
              onChange={(e) => setBusinessDescription(e.target.value)}
              rows={4}
            />
          </div>

          <Button 
            onClick={generateLandingPage}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                {t('generating_page')}...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                {t('generate_landing_page')}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedPage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              {t('page_generated_successfully')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold text-lg">{generatedPage.title}</h3>
              <p className="text-muted-foreground">{generatedPage.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-700">{t('url')}</span>
                </div>
                <p className="text-sm text-green-600 truncate">{generatedPage.url}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyPageUrl}
                  className="mt-2 w-full border-green-300 text-green-700 hover:bg-green-50"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  {t('copy_url')}
                </Button>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Palette className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-700">{t('design')}</span>
                </div>
                <p className="text-sm text-blue-600">{t('modern_responsive_design')}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  <Type className="h-3 w-3 mr-1" />
                  {t('customize')}
                </Button>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Image className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-purple-700">{t('assets')}</span>
                </div>
                <p className="text-sm text-purple-600">{generatedPage.sections.length} {t('sections_created')}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 w-full border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  <Image className="h-3 w-3 mr-1" />
                  {t('view_assets')}
                </Button>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-800 mb-2">{t('page_sections')}</h4>
              <div className="space-y-2">
                {generatedPage.sections.map((section: any, index: number) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-yellow-700">
                    <CheckCircle className="h-3 w-3" />
                    <span>{section.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}