import React, { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import { 
  PlayCircle, 
  Download, 
  Share, 
  Wand2, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Video,
  Sparkles,
  Zap,
  Eye,
  Copy,
  Trash2
} from '@phosphor-icons/react'
import { useLanguage } from '../contexts/CleanLanguageContext'
import { RealTimeVideoPreview } from './RealTimeVideoPreview'
import { lumaAI, LumaGenerationRequest, LumaGeneration } from '../services/luma-ai'

interface LumaVideo {
  id: string
  prompt: string
  status: 'queued' | 'dreaming' | 'completed' | 'failed'
  url?: string
  thumbnail?: string
  duration?: number
  quality: '720p' | '1080p' | '4K'
  style: 'cinematic' | 'commercial' | 'realistic' | 'artistic'
  aspect_ratio: '16:9' | '1:1' | '9:16' | '4:3' | '3:4' | '21:9'
  loop: boolean
  createdAt: Date
  credits_used: number
  progress?: number
  estimated_time?: number
  preview_frames?: string[]
  current_frame?: string
}

interface LumaTemplate {
  id: string
  name: string
  prompt: string
  category: string
  thumbnail: string
  credits: number
}

const LUMA_TEMPLATES: LumaTemplate[] = [
  {
    id: 'product-showcase',
    name: 'Product Showcase',
    prompt: 'A sleek product rotating 360 degrees on a minimalist background with dramatic lighting, commercial style',
    category: 'E-commerce',
    thumbnail: '/assets/templates/product-showcase.jpg',
    credits: 25
  },
  {
    id: 'nature-cinematic',
    name: 'Nature Cinematic',
    prompt: 'Breathtaking aerial view of a pristine forest with morning mist, cinematic camera movement',
    category: 'Nature',
    thumbnail: '/assets/templates/nature-cinematic.jpg',
    credits: 30
  },
  {
    id: 'tech-intro',
    name: 'Tech Introduction',
    prompt: 'Futuristic holographic interface with floating data particles, high-tech environment',
    category: 'Technology',
    thumbnail: '/assets/templates/tech-intro.jpg',
    credits: 35
  },
  {
    id: 'food-preparation',
    name: 'Food Preparation',
    prompt: 'Professional chef preparing gourmet dish with precise movements, kitchen ambiance',
    category: 'Food',
    thumbnail: '/assets/templates/food-prep.jpg',
    credits: 20
  },
  {
    id: 'fashion-runway',
    name: 'Fashion Runway',
    prompt: 'Model walking down elegant runway with dramatic lighting and fashion photography style',
    category: 'Fashion',
    thumbnail: '/assets/templates/fashion-runway.jpg',
    credits: 40
  },
  {
    id: 'abstract-art',
    name: 'Abstract Art',
    prompt: 'Fluid abstract shapes morphing and flowing with vibrant colors, artistic style',
    category: 'Art',
    thumbnail: '/assets/templates/abstract-art.jpg',
    credits: 25
  }
]

// Mock Luma API integration - remove this section and replace with real integration
const useLumaAPI = () => {
  const callLumaAPI = async (action: string, params: any = {}) => {
    // This is now handled by the lumaAI service
    console.log('Legacy API call - use lumaAI service instead:', action, params)
    return { success: false, error: 'Use lumaAI service instead' }
  }

  return { callLumaAPI }
}

export function LumaVideoCreator() {
  const { t } = useLanguage()
  const [user] = useKV('user-profile', null)
  const [credits, setCredits] = useKV('user-credits', 100)
  const [videos, setVideos] = useKV<LumaVideo[]>('luma-videos', [])
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [selectedQuality, setSelectedQuality] = useState<'720p' | '1080p' | '4K'>('1080p')
  const [selectedStyle, setSelectedStyle] = useState<'cinematic' | 'commercial' | 'realistic' | 'artistic'>('cinematic')
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<'16:9' | '1:1' | '9:16' | '4:3' | '3:4' | '21:9'>('16:9')
  const [loopEnabled, setLoopEnabled] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [selectedTemplate, setSelectedTemplate] = useState<LumaTemplate | null>(null)
  const [currentGeneration, setCurrentGeneration] = useState<LumaVideo | null>(null)
  const [samplePrompts] = useState(lumaAI.getSamplePrompts())
  const { callLumaAPI } = useLumaAPI()

  // Calculate credits needed based on quality and style
  const calculateCredits = () => {
    return lumaAI.calculateCredits(selectedAspectRatio, loopEnabled, false)
  }

  // Get AI recommendations
  const getRecommendations = () => {
    if (!currentPrompt.trim()) return null
    return lumaAI.getRecommendedSettings(currentPrompt)
  }

  const generateVideo = async () => {
    const creditsNeeded = calculateCredits()
    
    if (credits < creditsNeeded) {
      toast.error('Insufficient credits')
      return
    }

    if (!currentPrompt.trim()) {
      toast.error('Please enter a video description')
      return
    }

    setIsGenerating(true)
    setGenerationProgress(0)

    try {
      // Prepare generation request
      const request: LumaGenerationRequest = {
        prompt: currentPrompt.trim(),
        aspect_ratio: selectedAspectRatio,
        loop: loopEnabled,
        credits_cost: creditsNeeded
      }

      toast.success('Starting video generation...')
      
      // Start generation
      const response = await lumaAI.generateVideo(request)
      
      if (!response.success || !response.generation) {
        throw new Error('Failed to start generation')
      }

      const generation = response.generation
      
      // Create local video object
      const newVideo: LumaVideo = {
        id: generation.id,
        prompt: currentPrompt,
        status: 'queued',
        quality: selectedQuality,
        style: selectedStyle,
        aspect_ratio: selectedAspectRatio,
        loop: loopEnabled,
        createdAt: new Date(),
        credits_used: creditsNeeded,
        progress: 0,
        estimated_time: 120 // 2 minutes estimate
      }

      setCurrentGeneration(newVideo)
      setVideos(prev => [newVideo, ...prev])

      // Deduct credits immediately
      setCredits(prev => Math.max(0, prev - creditsNeeded))

      // Poll for completion
      await lumaAI.pollGenerationStatus(
        generation.id,
        (updatedGeneration) => {
          // Update progress based on state
          let progress = 0
          let status: LumaVideo['status'] = 'queued'
          
          switch (updatedGeneration.state) {
            case 'queued':
              progress = 10
              status = 'queued'
              break
            case 'dreaming':
              progress = 50
              status = 'dreaming'
              break
            case 'completed':
              progress = 100
              status = 'completed'
              break
            case 'failed':
              progress = 0
              status = 'failed'
              break
          }

          const updatedVideo: LumaVideo = {
            ...newVideo,
            status,
            progress,
            url: updatedGeneration.video?.url,
            thumbnail: updatedGeneration.video?.thumbnail,
            duration: 15 // Default duration
          }

          setCurrentGeneration(updatedVideo)
          setGenerationProgress(progress)
          setVideos(prev => prev.map(v => v.id === newVideo.id ? updatedVideo : v))

          if (status === 'completed') {
            toast.success('Video generated successfully!')
          } else if (status === 'failed') {
            toast.error('Video generation failed')
          }
        }
      )

    } catch (error) {
      console.error('Video generation error:', error)
      
      const failedVideo: LumaVideo = {
        id: `failed_${Date.now()}`,
        prompt: currentPrompt,
        status: 'failed',
        quality: selectedQuality,
        style: selectedStyle,
        aspect_ratio: selectedAspectRatio,
        loop: loopEnabled,
        createdAt: new Date(),
        credits_used: 0,
        progress: 0
      }
      
      setCurrentGeneration(failedVideo)
      setVideos(prev => prev.map(v => v.id === currentGeneration?.id ? failedVideo : v))
      toast.error(error instanceof Error ? error.message : 'Failed to generate video')
    } finally {
      setIsGenerating(false)
      setTimeout(() => {
        setCurrentGeneration(null)
      }, 10000)
    }
  }

  const useTemplate = (template: LumaTemplate) => {
    setCurrentPrompt(template.prompt)
    setSelectedTemplate(template)
    toast.success(`Template "${template.name}" applied`)
  }

  const useSamplePrompt = (sample: any) => {
    setCurrentPrompt(sample.prompt)
    setSelectedAspectRatio(sample.aspect_ratio)
    setLoopEnabled(sample.loop)
    toast.success(`Sample prompt applied: "${sample.title}"`)
  }

  const downloadVideo = (video: LumaVideo) => {
    if (video.url) {
      const link = document.createElement('a')
      link.href = video.url
      link.download = `luma-video-${video.id}.mp4`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('Video download started')
    }
  }

  const copyVideoUrl = (video: LumaVideo) => {
    if (video.url) {
      navigator.clipboard.writeText(video.url)
      toast.success('Video URL copied to clipboard')
    }
  }

  const deleteVideo = (videoId: string) => {
    setVideos(prev => prev.filter(v => v.id !== videoId))
    toast.success('Video deleted')
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-purple-500" />
            Luma AI Video Creator
          </h1>
          <p className="text-muted-foreground mt-2">
            Generate stunning AI videos with Luma's advanced technology
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="px-3 py-1">
            <Zap className="h-4 w-4 mr-1" />
            {credits} Credits
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            {videos.length} Videos Created
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create Video</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="gallery">My Videos</TabsTrigger>
        </TabsList>

        {/* Create Tab */}
        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Video Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Video Generator
                </CardTitle>
                <CardDescription>
                  Describe your vision and let Luma AI create a professional video
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Prompt Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Video Description</label>
                  <Textarea
                    placeholder="Describe the video you want to create... e.g., 'A luxury car driving through a neon-lit city at night'"
                    value={currentPrompt}
                    onChange={(e) => setCurrentPrompt(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>

                {/* Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Aspect Ratio</label>
                    <Select value={selectedAspectRatio} onValueChange={setSelectedAspectRatio}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="16:9">16:9 Widescreen</SelectItem>
                        <SelectItem value="1:1">1:1 Square</SelectItem>
                        <SelectItem value="9:16">9:16 Vertical</SelectItem>
                        <SelectItem value="4:3">4:3 Classic</SelectItem>
                        <SelectItem value="3:4">3:4 Portrait</SelectItem>
                        <SelectItem value="21:9">21:9 Cinematic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Style</label>
                    <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realistic">Realistic</SelectItem>
                        <SelectItem value="cinematic">Cinematic</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="artistic">Artistic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Loop Option */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="loop"
                    checked={loopEnabled}
                    onChange={(e) => setLoopEnabled(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="loop" className="text-sm font-medium">
                    Create seamless loop (+10 credits)
                  </label>
                </div>

                {/* AI Recommendations */}
                {currentPrompt.trim() && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">AI Recommendations</h4>
                    {(() => {
                      const recommendations = getRecommendations()
                      if (!recommendations) return null
                      
                      return (
                        <div className="space-y-1 text-xs text-blue-700">
                          <p>Suggested aspect ratio: <span className="font-medium">{recommendations.aspect_ratio}</span></p>
                          <p>Estimated credits: <span className="font-medium">{recommendations.estimated_credits}</span></p>
                          {recommendations.tips.map((tip, index) => (
                            <p key={index}>💡 {tip}</p>
                          ))}
                        </div>
                      )
                    })()}
                  </div>
                )}

                {/* Generation Progress */}
                {isGenerating && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Generating video...</span>
                      <span>{Math.round(generationProgress)}%</span>
                    </div>
                    <Progress value={generationProgress} className="h-2" />
                  </div>
                )}

                {/* Generate Button */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Credits needed: <span className="font-medium">{calculateCredits()}</span>
                  </div>
                  <Button 
                    onClick={generateVideo}
                    disabled={isGenerating || !currentPrompt.trim() || credits < calculateCredits()}
                    className="px-6"
                  >
                    {isGenerating ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Generate Video
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Right Column - Real-time Preview */}
            <RealTimeVideoPreview
              onGenerate={generateVideo}
              isGenerating={isGenerating}
              currentGeneration={currentGeneration}
            />
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <div className="space-y-6">
            {/* Sample Prompts */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Sample Prompts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {samplePrompts.map((sample, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => useSamplePrompt(sample)}>
                    <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                      <Video className="h-8 w-8 text-purple-500" />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-sm">{sample.title}</h4>
                          <Badge variant="outline" className="text-xs mt-1">
                            {sample.category}
                          </Badge>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {sample.credits} credits
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {sample.prompt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{sample.aspect_ratio}</span>
                        {sample.loop && <span>Loop</span>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Original Templates */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Templates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {LUMA_TEMPLATES.map((template) => (
                  <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                      <Video className="h-12 w-12 text-purple-500" />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{template.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {template.category}
                          </Badge>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {template.credits} credits
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {template.prompt}
                      </p>
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => useTemplate(template)}
                      >
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Gallery Tab */}
        <TabsContent value="gallery" className="space-y-6">
          {videos.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Video className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No videos yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Create your first AI video to see it here
                </p>
                <Button onClick={() => document.querySelector('[value="create"]')?.click()}>
                  Create Video
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video) => (
                <Card key={video.id} className="overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-blue-500/20 relative group">
                    {video.status === 'completed' && video.thumbnail ? (
                      <img 
                        src={video.thumbnail} 
                        alt="Video thumbnail"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        {video.status === 'dreaming' ? (
                          <Clock className="h-8 w-8 text-purple-500 animate-spin" />
                        ) : video.status === 'failed' ? (
                          <AlertCircle className="h-8 w-8 text-red-500" />
                        ) : video.status === 'completed' ? (
                          <CheckCircle className="h-8 w-8 text-green-500" />
                        ) : (
                          <Clock className="h-8 w-8 text-blue-500 animate-pulse" />
                        )}
                      </div>
                    )}
                    
                    {video.status === 'completed' && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button size="sm" variant="secondary">
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Play
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm line-clamp-2 mb-2">{video.prompt}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline">{video.aspect_ratio}</Badge>
                          <Badge variant="outline">{video.style}</Badge>
                          {video.loop && <Badge variant="outline">Loop</Badge>}
                          {video.duration && <span>{video.duration}s</span>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="text-xs text-muted-foreground">
                        {video.credits_used} credits used
                      </div>
                      
                      {video.status === 'completed' && (
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost" onClick={() => copyVideoUrl(video)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => downloadVideo(video)}>
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => deleteVideo(video.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}