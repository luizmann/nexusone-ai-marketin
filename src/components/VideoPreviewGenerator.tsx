import React, { useState, useEffect, useRef } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
  Zap
} from '@phosphor-icons/react'
import { useLanguage } from '../contexts/LanguageContext'

interface VideoGenerationState {
  id: string
  prompt: string
  status: 'queued' | 'processing' | 'generating' | 'rendering' | 'completed' | 'failed'
  progress: number
  preview_frames?: string[]
  current_frame?: string
  estimated_time?: number
  quality: '720p' | '1080p' | '4K'
  style: 'cinematic' | 'commercial' | 'realistic' | 'artistic'
  final_url?: string
  thumbnail?: string
  duration?: number
  created_at: Date
  credits_used: number
}

interface PreviewFrame {
  timestamp: number
  image_url: string
  description: string
}

export function VideoPreviewGenerator({ 
  onGenerate, 
  isGenerating, 
  currentGeneration 
}: {
  onGenerate: (prompt: string, options: any) => void
  isGenerating: boolean
  currentGeneration?: VideoGenerationState | null
}) {
  const { t } = useLanguage()
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentFrame, setCurrentFrame] = useState(0)
  const [previewFrames, setPreviewFrames] = useState<PreviewFrame[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Simulate real-time frame generation during video creation
  useEffect(() => {
    if (isGenerating && currentGeneration) {
      simulateFrameGeneration()
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isGenerating, currentGeneration])

  const simulateFrameGeneration = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    let frameCount = 0
    const totalFrames = 30 // Simulate 30 frames for preview

    intervalRef.current = setInterval(() => {
      if (frameCount >= totalFrames) {
        clearInterval(intervalRef.current!)
        return
      }

      // Generate mock preview frame
      const newFrame: PreviewFrame = {
        timestamp: frameCount * 0.5, // Every 0.5 seconds
        image_url: `https://picsum.photos/640/360?random=${frameCount + Date.now()}`,
        description: getFrameDescription(frameCount, currentGeneration?.prompt || '')
      }

      setPreviewFrames(prev => [...prev, newFrame])
      frameCount++

      // Auto-advance current frame if playing
      if (isPlaying) {
        setCurrentFrame(frameCount - 1)
      }
    }, 1000) // New frame every second
  }

  const getFrameDescription = (frameIndex: number, prompt: string): string => {
    const descriptions = [
      "Establishing shot composition",
      "Camera movement planning",
      "Character positioning",
      "Lighting setup",
      "Background elements",
      "Foreground details",
      "Color grading preview",
      "Motion blur effects",
      "Depth of field",
      "Final rendering"
    ]
    
    return descriptions[frameIndex % descriptions.length] || "Generating frame..."
  }

  const getStatusIcon = () => {
    if (!currentGeneration) return <Wand2 className="w-4 h-4" />
    
    switch (currentGeneration.status) {
      case 'queued':
        return <Clock className="w-4 h-4 animate-pulse" />
      case 'processing':
      case 'generating':
        return <RefreshCw className="w-4 h-4 animate-spin" />
      case 'rendering':
        return <Zap className="w-4 h-4 animate-pulse" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <Wand2 className="w-4 h-4" />
    }
  }

  const getStatusText = () => {
    if (!currentGeneration) return 'Ready to generate'
    
    switch (currentGeneration.status) {
      case 'queued':
        return 'Queued for generation...'
      case 'processing':
        return 'Processing prompt...'
      case 'generating':
        return 'Generating video frames...'
      case 'rendering':
        return 'Rendering final video...'
      case 'completed':
        return 'Video completed!'
      case 'failed':
        return 'Generation failed'
      default:
        return 'Unknown status'
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
    
    if (!isPlaying && previewFrames.length > 0) {
      // Start frame animation
      const frameInterval = setInterval(() => {
        setCurrentFrame(prev => {
          if (prev >= previewFrames.length - 1) {
            clearInterval(frameInterval)
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 500) // Change frame every 500ms
    }
  }

  const openFullPreview = () => {
    setIsPreviewOpen(true)
  }

  const downloadPreview = () => {
    if (currentGeneration?.final_url) {
      // Create download link
      const link = document.createElement('a')
      link.href = currentGeneration.final_url
      link.download = `nexusone-video-${currentGeneration.id}.mp4`
      link.click()
      toast.success('Download started!')
    } else {
      toast.error('Video not ready for download')
    }
  }

  const shareVideo = async () => {
    if (currentGeneration?.final_url) {
      try {
        await navigator.share({
          title: 'NexusOne Generated Video',
          text: `Check out this AI-generated video: ${currentGeneration.prompt}`,
          url: currentGeneration.final_url
        })
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(currentGeneration.final_url)
        toast.success('Video URL copied to clipboard!')
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Real-time Preview Card */}
      <Card className="relative overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <CardTitle className="text-lg">Video Preview</CardTitle>
              {isGenerating && (
                <Badge variant="secondary" className="animate-pulse">
                  Generating
                </Badge>
              )}
            </div>
            
            {currentGeneration && (
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {currentGeneration.quality}
                </Badge>
                <Badge variant="outline">
                  {currentGeneration.style}
                </Badge>
              </div>
            )}
          </div>
          
          <CardDescription>
            {getStatusText()}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Progress Bar */}
          {isGenerating && currentGeneration && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(currentGeneration.progress)}%</span>
              </div>
              <Progress value={currentGeneration.progress} className="w-full" />
              
              {currentGeneration.estimated_time && (
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Estimated time remaining</span>
                  <span>{formatTime(currentGeneration.estimated_time)}</span>
                </div>
              )}
            </div>
          )}

          {/* Preview Canvas */}
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            {previewFrames.length > 0 && currentFrame < previewFrames.length ? (
              <div className="relative w-full h-full">
                <img
                  src={previewFrames[currentFrame]?.image_url}
                  alt={`Preview frame ${currentFrame + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Frame overlay info */}
                <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  Frame {currentFrame + 1}/{previewFrames.length}
                </div>
                
                <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  {previewFrames[currentFrame]?.description}
                </div>

                {/* Playback controls overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
                  <div className="flex items-center gap-4">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={togglePlayback}
                      className="bg-white/90 hover:bg-white"
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={openFullPreview}
                      className="bg-white/90 hover:bg-white"
                    >
                      <Maximize className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                {isGenerating ? (
                  <div className="text-center space-y-2">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto" />
                    <p className="text-sm">Generating preview frames...</p>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <Eye className="w-8 h-8 mx-auto" />
                    <p className="text-sm">Preview will appear here</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Frame timeline */}
          {previewFrames.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Timeline</span>
                <span>{formatTime(currentFrame * 0.5)} / {formatTime(previewFrames.length * 0.5)}</span>
              </div>
              
              <div className="flex gap-1 overflow-x-auto pb-2">
                {previewFrames.map((frame, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentFrame(index)}
                    className={`flex-shrink-0 w-16 h-9 rounded border-2 overflow-hidden transition-colors ${
                      index === currentFrame 
                        ? 'border-primary' 
                        : 'border-transparent hover:border-muted-foreground'
                    }`}
                  >
                    <img
                      src={frame.image_url}
                      alt={`Frame ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          {currentGeneration && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <Button
                size="sm"
                variant="outline"
                onClick={downloadPreview}
                disabled={currentGeneration.status !== 'completed'}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={shareVideo}
                disabled={currentGeneration.status !== 'completed'}
              >
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={openFullPreview}
                disabled={previewFrames.length === 0}
              >
                <Maximize className="w-4 h-4 mr-2" />
                Full Screen
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Full Screen Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Video Preview - Full Screen</DialogTitle>
            <DialogDescription>
              {currentGeneration?.prompt || 'Real-time video generation preview'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Full size preview */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              {previewFrames.length > 0 && currentFrame < previewFrames.length ? (
                <img
                  src={previewFrames[currentFrame]?.image_url}
                  alt={`Preview frame ${currentFrame + 1}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-white">
                  <div className="text-center space-y-2">
                    <Eye className="w-12 h-12 mx-auto" />
                    <p>No preview available</p>
                  </div>
                </div>
              )}
              
              {/* Full screen controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/50 px-4 py-2 rounded-full">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={togglePlayback}
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume className="w-5 h-5" />}
                </Button>
                
                <span className="text-white text-sm">
                  {formatTime(currentFrame * 0.5)} / {formatTime(previewFrames.length * 0.5)}
                </span>
              </div>
            </div>

            {/* Generation info */}
            {currentGeneration && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Status</div>
                  <div className="font-medium capitalize">{currentGeneration.status}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Quality</div>
                  <div className="font-medium">{currentGeneration.quality}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Style</div>
                  <div className="font-medium capitalize">{currentGeneration.style}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-muted-foreground">Credits Used</div>
                  <div className="font-medium">{currentGeneration.credits_used}</div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}