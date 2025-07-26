import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { 
  PlayCircle, 
  Pause, 
  Download, 
  Share, 
  Wand2, 
  Clock, 
  Eye,
  Maximize,
  Volume,
  VolumeX,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Zap,
  SkipBack,
  SkipForward,
  Camera,
  Film,
  Settings,
  Monitor
} from '@phosphor-icons/react'
import { useLanguage } from '../contexts/LanguageContext'

interface VideoGenerationState {
  id: string
  prompt: string
  status: 'queued' | 'processing' | 'generating' | 'rendering' | 'completed' | 'failed'
  progress: number
  preview_frames?: PreviewFrame[]
  current_frame?: string
  estimated_time?: number
  quality: '720p' | '1080p' | '4K'
  style: 'cinematic' | 'commercial' | 'realistic' | 'artistic'
  final_url?: string
  thumbnail?: string
  duration?: number
  created_at: Date
  credits_used: number
  generation_logs?: GenerationLog[]
}

interface PreviewFrame {
  id: string
  timestamp: number
  image_url: string
  description: string
  frame_type: 'keyframe' | 'interpolated' | 'refined'
  quality_score: number
}

interface GenerationLog {
  timestamp: Date
  stage: string
  message: string
  progress: number
}

export function RealTimeVideoPreview({ 
  onGenerate, 
  isGenerating, 
  currentGeneration 
}: {
  onGenerate: (prompt: string, options: any) => void
  isGenerating: boolean
  currentGeneration?: VideoGenerationState | null
}) {
  const { t } = useLanguage()
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0)
  const [previewFrames, setPreviewFrames] = useState<PreviewFrame[]>([])
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [autoPlay, setAutoPlay] = useState(true)
  const [showGenerationLogs, setShowGenerationLogs] = useState(false)
  const [frameBuffer, setFrameBuffer] = useState<PreviewFrame[]>([])
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const playbackRef = useRef<NodeJS.Timeout | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<boolean>(false)

  // Simulate real-time frame streaming during video generation
  useEffect(() => {
    if (isGenerating && currentGeneration) {
      startFrameStream()
    } else {
      stopFrameStream()
    }

    return () => {
      stopFrameStream()
    }
  }, [isGenerating, currentGeneration])

  // Auto-play new frames as they arrive
  useEffect(() => {
    if (autoPlay && previewFrames.length > 0 && isGenerating) {
      setCurrentFrameIndex(previewFrames.length - 1)
    }
  }, [previewFrames.length, autoPlay, isGenerating])

  const startFrameStream = useCallback(() => {
    if (streamRef.current) return
    
    streamRef.current = true
    setPreviewFrames([])
    setFrameBuffer([])
    
    let frameCount = 0
    const totalExpectedFrames = 30
    const frameGenerationInterval = 1000 // Generate new frame every second

    const generateFrame = () => {
      if (!streamRef.current || frameCount >= totalExpectedFrames) {
        stopFrameStream()
        return
      }

      // Simulate different types of frames
      const frameTypes: PreviewFrame['frame_type'][] = ['keyframe', 'interpolated', 'refined']
      const frameType = frameTypes[frameCount % 3]
      
      // Generate realistic frame descriptions based on the prompt
      const frameDescription = generateFrameDescription(frameCount, currentGeneration?.prompt || '', frameType)
      
      const newFrame: PreviewFrame = {
        id: `frame_${currentGeneration?.id}_${frameCount}`,
        timestamp: frameCount * 0.5,
        image_url: generateFrameImage(frameCount, currentGeneration?.prompt || ''),
        description: frameDescription,
        frame_type: frameType,
        quality_score: Math.random() * 0.3 + 0.7 // Quality score between 0.7-1.0
      }

      // Add to frame buffer first
      setFrameBuffer(prev => [...prev, newFrame])
      
      // After a slight delay, move to main preview
      setTimeout(() => {
        setPreviewFrames(prev => [...prev, newFrame])
        
        // Add generation log
        addGenerationLog({
          timestamp: new Date(),
          stage: getGenerationStage(frameCount, totalExpectedFrames),
          message: `Generated ${frameType} frame ${frameCount + 1}/${totalExpectedFrames}`,
          progress: ((frameCount + 1) / totalExpectedFrames) * 100
        })
      }, 200)

      frameCount++
      
      if (streamRef.current) {
        setTimeout(generateFrame, frameGenerationInterval)
      }
    }

    generateFrame()
  }, [currentGeneration])

  const stopFrameStream = () => {
    streamRef.current = false
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (playbackRef.current) {
      clearTimeout(playbackRef.current)
      playbackRef.current = null
    }
  }

  const generateFrameImage = (frameIndex: number, prompt: string): string => {
    // Use different image sources to simulate frame generation
    const imageParams = {
      width: 640,
      height: 360,
      seed: frameIndex + Date.now(),
      blur: Math.floor(frameIndex / 10), // Progressively less blur
      grayscale: frameIndex < 5 ? 1 : 0 // First few frames in grayscale
    }
    
    return `https://picsum.photos/${imageParams.width}/${imageParams.height}?random=${imageParams.seed}&blur=${imageParams.blur}&grayscale=${imageParams.grayscale}`
  }

  const generateFrameDescription = (frameIndex: number, prompt: string, frameType: PreviewFrame['frame_type']): string => {
    const baseDescriptions = [
      "Initializing scene composition",
      "Setting up camera angles",
      "Generating background elements",
      "Adding lighting effects",
      "Rendering character movements",
      "Applying texture details",
      "Processing motion blur",
      "Adding environmental effects",
      "Refining color grading",
      "Optimizing visual quality",
      "Adding atmospheric effects",
      "Finalizing frame composition"
    ]

    const typePrefix = {
      keyframe: "Key: ",
      interpolated: "Inter: ",
      refined: "Refine: "
    }

    const baseDescription = baseDescriptions[frameIndex % baseDescriptions.length]
    return `${typePrefix[frameType]}${baseDescription}`
  }

  const getGenerationStage = (frameIndex: number, totalFrames: number): string => {
    const progress = frameIndex / totalFrames
    if (progress < 0.2) return "Scene Setup"
    if (progress < 0.4) return "Object Generation"
    if (progress < 0.6) return "Motion Synthesis"
    if (progress < 0.8) return "Texture Rendering"
    return "Quality Refinement"
  }

  const addGenerationLog = (log: GenerationLog) => {
    if (currentGeneration) {
      // In a real app, this would update the generation state
      console.log('Generation Log:', log)
    }
  }

  const togglePlayback = () => {
    if (previewFrames.length === 0) return
    
    setIsPlaying(!isPlaying)
    
    if (!isPlaying) {
      startPlayback()
    } else {
      stopPlayback()
    }
  }

  const startPlayback = () => {
    if (playbackRef.current) {
      clearTimeout(playbackRef.current)
    }

    const playFrame = () => {
      setCurrentFrameIndex(prev => {
        const nextIndex = prev + 1
        if (nextIndex >= previewFrames.length) {
          setIsPlaying(false)
          return 0
        }
        
        if (isPlaying) {
          playbackRef.current = setTimeout(playFrame, 500 / playbackSpeed)
        }
        
        return nextIndex
      })
    }

    playFrame()
  }

  const stopPlayback = () => {
    if (playbackRef.current) {
      clearTimeout(playbackRef.current)
      playbackRef.current = null
    }
  }

  const goToFrame = (frameIndex: number) => {
    setCurrentFrameIndex(Math.max(0, Math.min(frameIndex, previewFrames.length - 1)))
  }

  const getStatusIcon = () => {
    if (!currentGeneration) return <Camera className="w-5 h-5 text-muted-foreground" />
    
    switch (currentGeneration.status) {
      case 'queued':
        return <Clock className="w-5 h-5 animate-pulse text-yellow-500" />
      case 'processing':
      case 'generating':
        return <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
      case 'rendering':
        return <Film className="w-5 h-5 animate-pulse text-purple-500" />
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <Camera className="w-5 h-5 text-muted-foreground" />
    }
  }

  const getStatusText = () => {
    if (!currentGeneration) return 'Ready for video generation'
    
    const statusMessages = {
      queued: 'Queued for generation...',
      processing: 'Processing your prompt...',
      generating: `Generating frames... (${previewFrames.length}/30)`,
      rendering: 'Rendering final video...',
      completed: 'Video generation completed!',
      failed: 'Generation failed - please try again'
    }

    return statusMessages[currentGeneration.status] || 'Unknown status'
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const currentFrame = previewFrames[currentFrameIndex]

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <CardTitle className="text-lg">Real-time Preview</CardTitle>
              <CardDescription className="text-sm">
                {getStatusText()}
              </CardDescription>
            </div>
          </div>
          
          {currentGeneration && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {currentGeneration.quality}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {currentGeneration.style}
              </Badge>
            </div>
          )}
        </div>
        
        {/* Progress indicator */}
        {isGenerating && currentGeneration && (
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs">
              <span>Generation Progress</span>
              <span>{Math.round(currentGeneration.progress || 0)}%</span>
            </div>
            <Progress value={currentGeneration.progress || 0} className="h-1.5" />
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Main Preview Area */}
        <div className="relative aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden border">
          {currentFrame ? (
            <>
              <img
                src={currentFrame.image_url}
                alt={`Preview frame ${currentFrameIndex + 1}`}
                className="w-full h-full object-cover transition-opacity duration-300"
                loading="lazy"
              />
              
              {/* Frame overlay info */}
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                <Badge variant="secondary" className="text-xs w-fit">
                  Frame {currentFrameIndex + 1}/{previewFrames.length}
                </Badge>
                <Badge variant="outline" className="text-xs w-fit bg-black/50 text-white border-white/20">
                  {currentFrame.frame_type}
                </Badge>
              </div>
              
              <div className="absolute top-2 right-2">
                <Badge variant="outline" className="text-xs bg-black/50 text-white border-white/20">
                  Quality: {Math.round(currentFrame.quality_score * 100)}%
                </Badge>
              </div>

              <div className="absolute bottom-2 left-2 right-2">
                <div className="bg-black/70 text-white px-2 py-1 rounded text-xs text-center">
                  {currentFrame.description}
                </div>
              </div>

              {/* Playback controls overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => goToFrame(currentFrameIndex - 1)}
                    disabled={currentFrameIndex === 0}
                    className="bg-white/90 hover:bg-white"
                  >
                    <SkipBack className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={togglePlayback}
                    disabled={previewFrames.length === 0}
                    className="bg-white/90 hover:bg-white"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => goToFrame(currentFrameIndex + 1)}
                    disabled={currentFrameIndex >= previewFrames.length - 1}
                    className="bg-white/90 hover:bg-white"
                  >
                    <SkipForward className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              {isGenerating ? (
                <div className="text-center space-y-3">
                  <RefreshCw className="w-12 h-12 animate-spin mx-auto text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Generating preview frames...</p>
                    <p className="text-xs">This may take a few moments</p>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <Monitor className="w-12 h-12 mx-auto" />
                  <div>
                    <p className="text-sm font-medium">Preview will appear here</p>
                    <p className="text-xs">Start generating a video to see real-time preview</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Timeline and Controls */}
        {previewFrames.length > 0 && (
          <div className="space-y-3">
            {/* Timeline scrubber */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Timeline</span>
                <span>{formatTime(currentFrameIndex * 0.5)} / {formatTime(previewFrames.length * 0.5)}</span>
              </div>
              
              <Slider
                value={[currentFrameIndex]}
                onValueChange={([value]) => goToFrame(value)}
                max={previewFrames.length - 1}
                step={1}
                className="w-full"
              />
            </div>
            
            {/* Frame thumbnails */}
            <div className="flex gap-1 overflow-x-auto pb-2">
              {previewFrames.slice(-10).map((frame, index) => {
                const actualIndex = previewFrames.length - 10 + index
                return (
                  <button
                    key={frame.id}
                    onClick={() => goToFrame(actualIndex)}
                    className={`flex-shrink-0 w-16 h-9 rounded border-2 overflow-hidden transition-all ${
                      actualIndex === currentFrameIndex 
                        ? 'border-primary ring-2 ring-primary/20' 
                        : 'border-transparent hover:border-muted-foreground/50'
                    }`}
                  >
                    <img
                      src={frame.image_url}
                      alt={`Frame ${actualIndex + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                )
              })}
              
              {isGenerating && (
                <div className="flex-shrink-0 w-16 h-9 rounded border-2 border-dashed border-muted-foreground/50 flex items-center justify-center">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Playback Controls */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs">Speed:</label>
              <Slider
                value={[playbackSpeed]}
                onValueChange={([value]) => setPlaybackSpeed(value)}
                min={0.25}
                max={2}
                step={0.25}
                className="w-16"
              />
              <span className="text-xs w-8">{playbackSpeed}x</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Switch
                checked={autoPlay}
                onCheckedChange={setAutoPlay}
                id="auto-play"
              />
              <label htmlFor="auto-play" className="text-xs">Auto-play</label>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowGenerationLogs(!showGenerationLogs)}
              className="text-xs"
            >
              <Settings className="w-3 h-3 mr-1" />
              Logs
            </Button>
          </div>
        </div>

        {/* Generation Logs */}
        {showGenerationLogs && currentGeneration && (
          <div className="mt-4 p-3 bg-muted rounded-lg max-h-32 overflow-y-auto">
            <div className="text-xs font-medium mb-2">Generation Logs</div>
            <div className="space-y-1 text-xs">
              {/* Mock logs based on current state */}
              <div className="flex justify-between">
                <span>Status: {currentGeneration.status}</span>
                <span>{new Date().toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Frames generated: {previewFrames.length}/30</span>
                <span>Quality: {currentGeneration.quality}</span>
              </div>
              <div className="flex justify-between">
                <span>Style: {currentGeneration.style}</span>
                <span>Credits: {currentGeneration.credits_used}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}