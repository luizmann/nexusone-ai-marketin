import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useCredits } from '@/contexts/CreditContext'
import { 
  Video, 
  Play, 
  Download, 
  Sparkles,
  Lightning,
  Clock,
  Film,
  Camera,
  Waveform,
  Image as ImageIcon,
  Magic,
  Stars
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface VideoProject {
  id: string
  title: string
  type: string
  status: 'draft' | 'generating' | 'completed'
  duration: number
  thumbnail: string
  createdAt: string
}

export const MagicVideo: React.FC = () => {
  const { credits, videoCredits, useCredits, useVideoCredits, getCreditCost } = useCredits()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    type: '',
    duration: '30',
    style: '',
    voiceType: '',
    background: '',
    productUrl: ''
  })
  
  const [projects, setProjects] = useState<VideoProject[]>([
    {
      id: '1',
      title: 'Fitness Tracker Promo',
      type: 'Product Demo',
      status: 'completed',
      duration: 30,
      thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
      createdAt: '2 hours ago'
    },
    {
      id: '2',
      title: 'Brand Introduction',
      type: 'Explainer Video',
      status: 'completed',
      duration: 45,
      thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=200&fit=crop',
      createdAt: '1 day ago'
    }
  ])

  const videoTypes = [
    {
      id: 'product-demo',
      title: 'Product Demo',
      description: 'Showcase product features and benefits',
      icon: <Camera className="h-5 w-5" />,
      credits: 50,
      engines: ['Luma AI', 'Runway']
    },
    {
      id: 'explainer',
      title: 'Explainer Video',
      description: 'Explain concepts or services clearly',
      icon: <Film className="h-5 w-5" />,
      credits: 40,
      engines: ['Luma AI']
    },
    {
      id: 'social-ad',
      title: 'Social Media Ad',
      description: 'Short form content for social platforms',
      icon: <Lightning className="h-5 w-5" />,
      credits: 30,
      engines: ['Runway', 'Stable Video']
    },
    {
      id: 'testimonial',
      title: 'Testimonial Video',
      description: 'Customer reviews and success stories',
      icon: <Stars className="h-5 w-5" />,
      credits: 45,
      engines: ['D-ID', 'Synthesia']
    }
  ]

  const styles = [
    'Realistic',
    'Animated',
    'Minimalist',
    'Cinematic',
    'Corporate',
    'Trendy'
  ]

  const voiceTypes = [
    'Professional Male',
    'Professional Female',
    'Energetic Male',
    'Energetic Female',
    'Calm Narrator',
    'No Voice'
  ]

  const backgrounds = [
    'Studio White',
    'Modern Office',
    'Outdoor Nature',
    'Abstract Gradient',
    'Product Showcase',
    'Custom Upload'
  ]

  const generateVideo = async () => {
    if (!videoForm.title || !videoForm.type) {
      toast.error('Please fill in required fields')
      return
    }

    const selectedType = videoTypes.find(t => t.id === videoForm.type)
    if (!selectedType) return

    if (!useVideoCredits(1)) {
      toast.error('Insufficient video credits. Please upgrade your plan.')
      return
    }

    setIsGenerating(true)
    setGenerationProgress(0)
    
    // Simulate video generation process
    const steps = [
      'Analyzing content requirements...',
      'Generating script with AI...',
      'Creating visual storyboard...',
      'Rendering video scenes...',
      'Adding voice narration...',
      'Finalizing video output...'
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 3000))
      setGenerationProgress(((i + 1) / steps.length) * 100)
    }

    // Add new project
    const newProject: VideoProject = {
      id: Date.now().toString(),
      title: videoForm.title,
      type: selectedType.title,
      status: 'completed',
      duration: parseInt(videoForm.duration),
      thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop',
      createdAt: 'Just now'
    }

    setProjects(prev => [newProject, ...prev])
    setIsGenerating(false)
    setGenerationProgress(0)
    
    // Reset form
    setVideoForm({
      title: '',
      description: '',
      type: '',
      duration: '30',
      style: '',
      voiceType: '',
      background: '',
      productUrl: ''
    })

    toast.success('Video generated successfully!')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-green-500 to-teal-600 p-3 rounded-xl">
            <Video className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Magic Video Generator</h1>
        <p className="text-lg text-muted-foreground">
          Create professional marketing videos with AI in minutes
        </p>
        <div className="flex items-center justify-center gap-4 mt-2">
          <Badge variant="secondary">
            {videoCredits} Video Credits
          </Badge>
          <Badge variant="outline">
            {credits} AI Credits
          </Badge>
        </div>
      </div>

      {!isGenerating ? (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Creation Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Types */}
            <Card>
              <CardHeader>
                <CardTitle>Choose Video Type</CardTitle>
                <CardDescription>Select the type of video you want to create</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {videoTypes.map((type) => (
                    <Card 
                      key={type.id} 
                      className={`cursor-pointer hover:shadow-lg transition-all border-2 ${
                        videoForm.type === type.id ? 'border-primary' : 'hover:border-primary/50'
                      }`}
                      onClick={() => setVideoForm(prev => ({ ...prev, type: type.id }))}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            {type.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{type.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{type.description}</p>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline">{type.credits} Credits</Badge>
                              <div className="text-xs text-muted-foreground">
                                {type.engines.join(', ')}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Video Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Magic className="h-5 w-5" />
                  Video Configuration
                </CardTitle>
                <CardDescription>
                  Customize your video settings and content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="video-title">Video Title *</Label>
                    <Input
                      id="video-title"
                      placeholder="e.g., Amazing Fitness Tracker Review"
                      value={videoForm.title}
                      onChange={(e) => setVideoForm(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="product-url">Product URL (Optional)</Label>
                    <Input
                      id="product-url"
                      placeholder="https://example.com/product"
                      value={videoForm.productUrl}
                      onChange={(e) => setVideoForm(prev => ({ ...prev, productUrl: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="video-description">Video Description</Label>
                  <Textarea
                    id="video-description"
                    placeholder="Describe what you want the video to showcase..."
                    value={videoForm.description}
                    onChange={(e) => setVideoForm(prev => ({ ...prev, description: e.target.value }))}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="duration">Duration (seconds)</Label>
                    <Select value={videoForm.duration} onValueChange={(value) => setVideoForm(prev => ({ ...prev, duration: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 seconds</SelectItem>
                        <SelectItem value="30">30 seconds</SelectItem>
                        <SelectItem value="45">45 seconds</SelectItem>
                        <SelectItem value="60">1 minute</SelectItem>
                        <SelectItem value="90">1.5 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="style">Visual Style</Label>
                    <Select value={videoForm.style} onValueChange={(value) => setVideoForm(prev => ({ ...prev, style: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Style" />
                      </SelectTrigger>
                      <SelectContent>
                        {styles.map(style => (
                          <SelectItem key={style} value={style.toLowerCase()}>
                            {style}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="voice">Voice Type</Label>
                    <Select value={videoForm.voiceType} onValueChange={(value) => setVideoForm(prev => ({ ...prev, voiceType: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Voice" />
                      </SelectTrigger>
                      <SelectContent>
                        {voiceTypes.map(voice => (
                          <SelectItem key={voice} value={voice.toLowerCase()}>
                            {voice}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="background">Background Setting</Label>
                  <Select value={videoForm.background} onValueChange={(value) => setVideoForm(prev => ({ ...prev, background: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Background" />
                    </SelectTrigger>
                    <SelectContent>
                      {backgrounds.map(bg => (
                        <SelectItem key={bg} value={bg.toLowerCase()}>
                          {bg}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:opacity-90"
                  onClick={generateVideo}
                  disabled={!videoForm.title || !videoForm.type}
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate Magic Video (1 Video Credit)
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Video Projects */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Film className="h-5 w-5" />
                  Your Videos
                </CardTitle>
                <CardDescription>
                  Recent video projects
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="border rounded-lg p-3">
                    <div className="flex gap-3">
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-16 h-12 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">{project.title}</h3>
                        <p className="text-xs text-muted-foreground">{project.type}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs">{project.duration}s</span>
                          <span className="text-xs text-muted-foreground">• {project.createdAt}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Play className="h-3 w-3 mr-1" />
                        Play
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {projects.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No videos yet</p>
                    <p className="text-sm">Create your first video to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Engines Info */}
            <Card>
              <CardHeader>
                <CardTitle>AI Engines</CardTitle>
                <CardDescription>Powered by cutting-edge AI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Luma AI - Realistic videos</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Runway - Creative effects</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">D-ID - Talking avatars</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">ElevenLabs - Voice synthesis</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        /* Generation Progress */
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Video className="h-6 w-6 animate-pulse" />
                Creating Your Magic Video
              </CardTitle>
              <CardDescription>
                This may take 2-5 minutes. Please don't close this page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Generation Progress</span>
                  <span>{Math.round(generationProgress)}%</span>
                </div>
                <Progress value={generationProgress} className="h-3" />
              </div>

              <div className="text-center">
                <div className="w-32 h-20 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <Video className="h-8 w-8 text-white animate-pulse" />
                </div>
                <h3 className="font-semibold mb-1">{videoForm.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {videoForm.duration}s • {videoForm.style} style
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <Waveform className="h-5 w-5 mx-auto mb-1" />
                  <div className="text-sm font-medium">Audio</div>
                  <div className="text-xs text-muted-foreground">ElevenLabs</div>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <ImageIcon className="h-5 w-5 mx-auto mb-1" />
                  <div className="text-sm font-medium">Visuals</div>
                  <div className="text-xs text-muted-foreground">Luma AI</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}