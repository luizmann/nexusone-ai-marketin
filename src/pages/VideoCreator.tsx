import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } = '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/contexts/LanguageContext';
import { APIService } from '@/lib/supabase';
import { toast } from 'sonner';
import { 
  Play, 
  Download, 
  Share, 
  Sparkles,
  Film,
  Smartphone,
  User,
  Image,
  Settings,
  Clock,
  CheckCircle,
  AlertCircle
} from '@phosphor-icons/react';

interface Video {
  id: string;
  title: string;
  type: 'product_demo' | 'social_short' | 'avatar_promo' | 'explainer';
  status: 'generating' | 'completed' | 'failed';
  url?: string;
  thumbnail?: string;
  duration?: number;
  created_at: string;
  config: any;
}

export default function VideoCreator() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [videoConfig, setVideoConfig] = useState({
    type: '',
    title: '',
    description: '',
    productImages: [],
    voiceScript: '',
    style: 'modern',
    duration: 30,
    aspectRatio: '16:9'
  });

  const [videos, setVideos] = useState<Video[]>([
    {
      id: '1',
      title: 'Wireless Earbuds Product Demo',
      type: 'product_demo',
      status: 'completed',
      url: 'https://example.com/video1.mp4',
      thumbnail: 'https://via.placeholder.com/320x180',
      duration: 45,
      created_at: '2024-01-15',
      config: {}
    },
    {
      id: '2',
      title: 'Summer Sale Social Media Short',
      type: 'social_short',
      status: 'completed',
      url: 'https://example.com/video2.mp4',
      thumbnail: 'https://via.placeholder.com/320x180',
      duration: 15,
      created_at: '2024-01-12',
      config: {}
    },
    {
      id: '3',
      title: 'AI Avatar Product Explanation',
      type: 'avatar_promo',
      status: 'generating',
      duration: 60,
      created_at: '2024-01-10',
      config: {}
    }
  ]);

  const videoTypes = [
    {
      id: 'product_demo',
      name: 'Product Demo',
      description: 'Showcase your product with engaging visuals and narration',
      icon: <Film className="h-6 w-6" />,
      credits: 25,
      duration: '30-60s'
    },
    {
      id: 'social_short',
      name: 'Social Media Short',
      description: 'Quick, engaging videos for TikTok, Instagram, and YouTube Shorts',
      icon: <Smartphone className="h-6 w-6" />,
      credits: 15,
      duration: '15-30s'
    },
    {
      id: 'avatar_promo',
      name: 'Avatar Spokesperson',
      description: 'AI-generated avatar delivering your sales message',
      icon: <User className="h-6 w-6" />,
      credits: 35,
      duration: '30-90s'
    },
    {
      id: 'explainer',
      name: 'Explainer Video',
      description: 'Clear explanations with animations and graphics',
      icon: <Sparkles className="h-6 w-6" />,
      credits: 30,
      duration: '60-120s'
    }
  ];

  const handleGenerateVideo = async () => {
    if (!videoConfig.type || !videoConfig.title) {
      toast.error('Please complete the video configuration');
      return;
    }

    setLoading(true);
    setGenerationProgress(0);

    try {
      // Show progress simulation
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 10;
        });
      }, 1000);

      toast.info(t('video.generating'));

      // Call Luma AI API
      const result = await APIService.generateVideo({
        ...videoConfig,
        ai_provider: 'luma'
      });

      // Simulate video generation completion
      setTimeout(() => {
        clearInterval(progressInterval);
        setGenerationProgress(100);

        const newVideo: Video = {
          id: Date.now().toString(),
          title: videoConfig.title,
          type: videoConfig.type as any,
          status: 'completed',
          url: result.video_url || 'https://example.com/generated-video.mp4',
          thumbnail: result.thumbnail || 'https://via.placeholder.com/320x180',
          duration: videoConfig.duration,
          created_at: new Date().toISOString().split('T')[0],
          config: videoConfig
        };

        setVideos(prev => [newVideo, ...prev]);
        setVideoConfig({
          type: '',
          title: '',
          description: '',
          productImages: [],
          voiceScript: '',
          style: 'modern',
          duration: 30,
          aspectRatio: '16:9'
        });
        setCurrentStep(1);
        toast.success('Video generated successfully!');
        setLoading(false);
      }, 3000);

    } catch (error) {
      console.error('Error generating video:', error);
      toast.error('Failed to generate video. Please try again.');
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'generating':
        return <Clock className="h-5 w-5 text-yellow-600 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-green-100 text-green-800',
      generating: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    };
    return variants[status as keyof typeof variants] || variants.completed;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {t('video.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('video.subtitle')}
        </p>
      </div>

      {/* Video Creation Wizard */}
      {!loading && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              {t('video.create_new')}
            </CardTitle>
            <CardDescription>
              Choose a video type and configure your content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Video Type Selection */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <Label className="text-base font-medium">Choose Video Type</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  {videoTypes.map((type) => (
                    <Card 
                      key={type.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        videoConfig.type === type.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setVideoConfig(prev => ({ ...prev, type: type.id }))}
                    >
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                {type.icon}
                              </div>
                              <div>
                                <h3 className="font-medium">{type.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {type.duration}
                                </p>
                              </div>
                            </div>
                            <Badge variant="secondary">{type.credits} credits</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {type.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {videoConfig.type && (
                  <Button onClick={() => setCurrentStep(2)} className="w-full">
                    Continue to Configuration
                  </Button>
                )}
              </div>
            )}

            {/* Step 2: Video Configuration */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Video Configuration</Label>
                  <Button variant="outline" size="sm" onClick={() => setCurrentStep(1)}>
                    Back
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="title">Video Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter video title"
                      value={videoConfig.title}
                      onChange={(e) => setVideoConfig(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (seconds)</Label>
                    <Select 
                      value={videoConfig.duration.toString()}
                      onValueChange={(value) => setVideoConfig(prev => ({ ...prev, duration: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 seconds</SelectItem>
                        <SelectItem value="30">30 seconds</SelectItem>
                        <SelectItem value="45">45 seconds</SelectItem>
                        <SelectItem value="60">60 seconds</SelectItem>
                        <SelectItem value="90">90 seconds</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Video Description/Script</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your product or provide a script for the video"
                    value={videoConfig.description}
                    onChange={(e) => setVideoConfig(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="style">Video Style</Label>
                    <Select 
                      value={videoConfig.style}
                      onValueChange={(value) => setVideoConfig(prev => ({ ...prev, style: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="modern">Modern & Clean</SelectItem>
                        <SelectItem value="energetic">Energetic & Bold</SelectItem>
                        <SelectItem value="minimal">Minimal & Elegant</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aspect">Aspect Ratio</Label>
                    <Select 
                      value={videoConfig.aspectRatio}
                      onValueChange={(value) => setVideoConfig(prev => ({ ...prev, aspectRatio: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="16:9">16:9 (YouTube, Facebook)</SelectItem>
                        <SelectItem value="9:16">9:16 (TikTok, Instagram Stories)</SelectItem>
                        <SelectItem value="1:1">1:1 (Instagram Square)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={handleGenerateVideo}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  disabled={!videoConfig.title || !videoConfig.description}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Video
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Generation Progress */}
      {loading && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4 text-center">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mx-auto">
                <Sparkles className="h-8 w-8 text-white animate-pulse" />
              </div>
              <h3 className="text-lg font-semibold">Generating Your Video</h3>
              <p className="text-muted-foreground">
                Our AI is creating your video with Luma AI technology...
              </p>
              <div className="space-y-2">
                <Progress value={generationProgress} className="w-full" />
                <p className="text-sm text-muted-foreground">
                  {Math.round(generationProgress)}% complete
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Videos List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Videos</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <Card key={video.id} className="overflow-hidden">
              <div className="aspect-video bg-muted relative">
                {video.thumbnail ? (
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Film className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                {video.status === 'completed' && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Button size="sm" variant="secondary" className="rounded-full">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium line-clamp-2">{video.title}</h3>
                    {getStatusIcon(video.status)}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="capitalize">{video.type.replace('_', ' ')}</span>
                    {video.duration && (
                      <span>{formatDuration(video.duration)}</span>
                    )}
                  </div>

                  <Badge 
                    variant="secondary" 
                    className={getStatusBadge(video.status)}
                  >
                    {video.status}
                  </Badge>

                  {video.status === 'completed' && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Download className="h-4 w-4 mr-1" />
                        {t('video.download')}
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Share className="h-4 w-4 mr-1" />
                        {t('video.share')}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {videos.length === 0 && (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <Film className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No videos yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first AI-generated video to start engaging your audience.
              </p>
              <Button>
                <Sparkles className="mr-2 h-4 w-4" />
                Create Your First Video
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}