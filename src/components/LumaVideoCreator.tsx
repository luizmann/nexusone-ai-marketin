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
import { useLanguage } from '../contexts/LanguageContext'
import { RealTimeVideoPreview } from './RealTimeVideoPreview'

interface LumaVideo {
  id: string
  prompt: string
  status: 'queued' | 'processing' | 'generating' | 'rendering' | 'completed' | 'failed'
  url?: string
  thumbnail?: string
  duration?: number
  quality: '720p' | '1080p' | '4K'
  style: 'cinematic' | 'commercial' | 'realistic' | 'artistic'
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

// Mock Luma API integration
const useLumaAPI = () => {
  const callLumaAPI = async (action: string, params: any = {}) => {
    try {
      // In production, this would call the actual Supabase Edge Function
      // For now, we'll simulate the API behavior
      console.log('Calling Luma API:', action, params)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      switch (action) {
        case 'generate':
          return {
            success: true,
            generation: {
              id: `gen_${Date.now()}`,
              state: 'queued',
              created_at: new Date().toISOString()
            },
            credits_used: params.credits || 30
          }
        
        case 'status':
          return {
            success: true,
            generation: {
              id: params.generationId,
              state: Math.random() > 0.5 ? 'completed' : 'processing',
              video_url: 'https://example-video.mp4',
              thumbnail_url: 'https://example-thumbnail.jpg',
              completed_at: new Date().toISOString()
            }
          }
        
        case 'list':
          return {
            success: true,
            generations: []
          }
        
        default:
          throw new Error('Unknown action')
      }
    } catch (error) {
      console.error('Luma API Error:', error)
      throw error
    }
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
  const [generationProgress, setGenerationProgress] = useState(0)
  const [selectedTemplate, setSelectedTemplate] = useState<LumaTemplate | null>(null)
  const [currentGeneration, setCurrentGeneration] = useState<LumaVideo | null>(null)
  const { callLumaAPI } = useLumaAPI()

  // Calculate credits needed based on quality and style
  const calculateCredits = () => {
    let baseCredits = 20
    if (selectedQuality === '1080p') baseCredits = 30
    if (selectedQuality === '4K') baseCredits = 50
    if (selectedStyle === 'cinematic') baseCredits += 10
    if (selectedStyle === 'artistic') baseCredits += 5
    return baseCredits
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

    // Create new video generation object
    const newVideo: LumaVideo = {
      id: `luma_${Date.now()}`,
      prompt: currentPrompt,
      status: 'queued',
      quality: selectedQuality,
      style: selectedStyle,
      createdAt: new Date(),
      credits_used: creditsNeeded,
      progress: 0,
      estimated_time: 120 // 2 minutes estimate
    }

    setCurrentGeneration(newVideo)
    setVideos(prev => [newVideo, ...prev])

    try {
      // Simulate realistic video generation progress
      const progressSteps = [
        { status: 'queued' as const, progress: 0, time: 5, message: 'Queuing generation...' },
        { status: 'processing' as const, progress: 10, time: 15, message: 'Processing prompt...' },
        { status: 'generating' as const, progress: 30, time: 60, message: 'Generating video frames...' },
        { status: 'rendering' as const, progress: 80, time: 30, message: 'Rendering final video...' },
        { status: 'completed' as const, progress: 100, time: 0, message: 'Video completed!' }
      ]

      for (const step of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, step.time * 100)) // Accelerated for demo
        
        const updatedVideo = {
          ...newVideo,
          status: step.status,
          progress: step.progress,
          estimated_time: step.time
        }

        setCurrentGeneration(updatedVideo)
        setGenerationProgress(step.progress)
        
        // Update in videos array
        setVideos(prev => prev.map(v => v.id === newVideo.id ? updatedVideo : v))
        
        if (step.status === 'completed') {
          // Add final video URL and thumbnail
          const finalVideo = {
            ...updatedVideo,
            url: `https://example-video-${newVideo.id}.mp4`,
            thumbnail: `https://picsum.photos/640/360?random=${newVideo.id}`,
            duration: 15 // 15 seconds
          }
          
          setCurrentGeneration(finalVideo)
          setVideos(prev => prev.map(v => v.id === newVideo.id ? finalVideo : v))
        }
        
        toast.success(step.message)
      }

      // Deduct credits
      setCredits(prev => Math.max(0, prev - creditsNeeded))
      toast.success('Video generated successfully!')

    } catch (error) {
      console.error('Video generation error:', error)
      
      const failedVideo = {
        ...newVideo,
        status: 'failed' as const,
        progress: 0
      }
      
      setCurrentGeneration(failedVideo)
      setVideos(prev => prev.map(v => v.id === newVideo.id ? failedVideo : v))
      toast.error('Failed to generate video')
    } finally {
      setIsGenerating(false)
      // Clear current generation after a delay
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
                    <label className="text-sm font-medium">Quality</label>
                    <Select value={selectedQuality} onValueChange={setSelectedQuality}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="720p">720p HD (+20 credits)</SelectItem>
                        <SelectItem value="1080p">1080p Full HD (+30 credits)</SelectItem>
                        <SelectItem value="4K">4K Ultra HD (+50 credits)</SelectItem>
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
                        <SelectItem value="cinematic">Cinematic (+10 credits)</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="artistic">Artistic (+5 credits)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

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
                        {video.status === 'generating' ? (
                          <Clock className="h-8 w-8 text-purple-500 animate-spin" />
                        ) : video.status === 'failed' ? (
                          <AlertCircle className="h-8 w-8 text-red-500" />
                        ) : (
                          <CheckCircle className="h-8 w-8 text-green-500" />
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
                          <Badge variant="outline">{video.quality}</Badge>
                          <Badge variant="outline">{video.style}</Badge>
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