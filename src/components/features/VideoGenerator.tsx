import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLanguage } from '../../contexts/CleanLanguageContext'
import { Video, Play, Download, Share2, CheckCircle, Wand2 } from 'lucide-react'
import { toast } from 'sonner'

export function VideoGenerator() {
  const { t } = useLanguage()
  const [script, setScript] = useState('')
  const [videoType, setVideoType] = useState('')
  const [style, setStyle] = useState('')
  const [duration, setDuration] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedVideo, setGeneratedVideo] = useState<any>(null)

  const generateVideo = async () => {
    if (!script || !videoType) {
      toast.error(t('please_fill_required_fields'))
      return
    }

    setIsGenerating(true)
    
    try {
      // Simular geração de vídeo com IA
      await new Promise(resolve => setTimeout(resolve, 5000))
      
      const mockVideo = {
        id: `video_${Date.now()}`,
        title: 'Vídeo Promocional Gerado com IA',
        url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=450&fit=crop',
        duration: duration || '30s',
        type: videoType,
        style: style,
        script: script,
        assets: [
          {
            type: 'audio',
            name: 'Narração IA',
            url: '#'
          },
          {
            type: 'music',
            name: 'Música de Fundo',
            url: '#'
          },
          {
            type: 'images',
            name: '8 Imagens Geradas',
            count: 8
          }
        ],
        analytics: {
          generated_at: new Date().toISOString(),
          file_size: '24.5 MB',
          resolution: '1920x1080',
          format: 'MP4'
        }
      }
      
      setGeneratedVideo(mockVideo)
      toast.success(t('video_generated_successfully'))
    } catch (error) {
      toast.error(t('error_generating_video'))
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadVideo = () => {
    toast.success(t('video_download_started'))
  }

  const shareVideo = () => {
    navigator.clipboard.writeText(generatedVideo?.url || '')
    toast.success(t('video_link_copied'))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('video_generator')}</h1>
        <p className="text-muted-foreground">{t('create_professional_videos_with_ai')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            {t('ai_video_creation')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">{t('video_type')} *</label>
              <Select value={videoType} onValueChange={setVideoType}>
                <SelectTrigger>
                  <SelectValue placeholder={t('select_video_type')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="promotional">{t('promotional')}</SelectItem>
                  <SelectItem value="product-demo">{t('product_demo')}</SelectItem>
                  <SelectItem value="testimonial">{t('testimonial')}</SelectItem>
                  <SelectItem value="explainer">{t('explainer')}</SelectItem>
                  <SelectItem value="social-media">{t('social_media')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">{t('visual_style')}</label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger>
                  <SelectValue placeholder={t('select_style')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">{t('modern')}</SelectItem>
                  <SelectItem value="elegant">{t('elegant')}</SelectItem>
                  <SelectItem value="dynamic">{t('dynamic')}</SelectItem>
                  <SelectItem value="minimalist">{t('minimalist')}</SelectItem>
                  <SelectItem value="corporate">{t('corporate')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">{t('duration')}</label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue placeholder={t('select_duration')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15s">15 {t('seconds')}</SelectItem>
                  <SelectItem value="30s">30 {t('seconds')}</SelectItem>
                  <SelectItem value="60s">60 {t('seconds')}</SelectItem>
                  <SelectItem value="90s">90 {t('seconds')}</SelectItem>
                  <SelectItem value="120s">2 {t('minutes')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">{t('video_script')} *</label>
            <Textarea
              placeholder={t('describe_what_you_want_in_your_video')}
              value={script}
              onChange={(e) => setScript(e.target.value)}
              rows={6}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {t('example')}: "Crie um vídeo promocional para um curso de marketing digital. Mostre os benefícios, depoimentos de alunos e uma oferta especial."
            </p>
          </div>

          <Button 
            onClick={generateVideo}
            disabled={isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                {t('generating_video')}... (5 {t('minutes')})
              </>
            ) : (
              <>
                <Video className="h-4 w-4 mr-2" />
                {t('generate_video')}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedVideo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              {t('video_ready')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                  <video 
                    controls 
                    className="w-full h-full"
                    poster={generatedVideo.thumbnail}
                  >
                    <source src={generatedVideo.url} type="video/mp4" />
                    {t('your_browser_does_not_support_video')}
                  </video>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={downloadVideo} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    {t('download')}
                  </Button>
                  <Button onClick={shareVideo} variant="outline" className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    {t('share')}
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">{t('video_details')}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('duration')}:</span>
                      <span>{generatedVideo.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('resolution')}:</span>
                      <span>{generatedVideo.analytics.resolution}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('file_size')}:</span>
                      <span>{generatedVideo.analytics.file_size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('format')}:</span>
                      <span>{generatedVideo.analytics.format}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">{t('generated_assets')}</h3>
                  <div className="space-y-2">
                    {generatedVideo.assets.map((asset: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm">{asset.name}</span>
                        {asset.count && (
                          <span className="text-xs text-muted-foreground">{asset.count} {t('items')}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">{t('script_used')}</h4>
                  <p className="text-sm text-blue-700">{generatedVideo.script}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t('video_examples')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: t('promotional_video'),
                description: t('product_launch_promotion'),
                thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop'
              },
              {
                title: t('explainer_video'),
                description: t('service_explanation'),
                thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop'
              },
              {
                title: t('testimonial_video'),
                description: t('customer_success_stories'),
                thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=225&fit=crop'
              }
            ].map((example, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-2 relative">
                  <img 
                    src={example.thumbnail} 
                    alt={example.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h4 className="font-medium">{example.title}</h4>
                <p className="text-sm text-muted-foreground">{example.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}