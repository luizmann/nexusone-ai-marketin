import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useKV } from '@github/spark/hooks'
import { SocialPostPerformance } from './SocialPostPerformance'
import { 
  InstagramLogo, 
  FacebookLogo, 
  TwitterLogo, 
  LinkedinLogo,
  TiktokLogo,
  YoutubeLogo,
  Sparkle, 
  Copy, 
  Save,
  Download,
  Wand,
  Calendar,
  Hash,
  TrendUp,
  Target,
  Users,
  BarChart3
} from '@phosphor-icons/react'
import { toast } from 'sonner'

export function SocialMediaGenerator() {
  const [user, setUser] = useKV('user-profile', null)
  const [socialContent, setSocialContent] = useKV('social-media-content', [])
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState('generate')
  
  // Form state
  const [campaignName, setCampaignName] = useState('')
  const [campaignGoal, setCampaignGoal] = useState('')
  const [brandVoice, setBrandVoice] = useState('')
  const [targetAudience, setTargetAudience] = useState('')
  const [contentTopic, setContentTopic] = useState('')
  const [callToAction, setCallToAction] = useState('')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram'])
  const [contentType, setContentType] = useState('')
  
  // Generated content state
  const [generatedContents, setGeneratedContents] = useState<Record<string, any>>({})
  const [activePreview, setActivePreview] = useState('instagram')

  const platforms = [
    { 
      id: 'instagram', 
      name: 'Instagram', 
      icon: InstagramLogo, 
      color: 'from-purple-500 to-pink-500',
      charLimit: 2200,
      features: ['Stories', 'Posts', 'Reels']
    },
    { 
      id: 'facebook', 
      name: 'Facebook', 
      icon: FacebookLogo, 
      color: 'from-blue-600 to-blue-700',
      charLimit: 63206,
      features: ['Posts', 'Ads', 'Stories']
    },
    { 
      id: 'twitter', 
      name: 'Twitter/X', 
      icon: TwitterLogo, 
      color: 'from-gray-800 to-black',
      charLimit: 280,
      features: ['Tweets', 'Threads', 'Spaces']
    },
    { 
      id: 'linkedin', 
      name: 'LinkedIn', 
      icon: LinkedinLogo, 
      color: 'from-blue-700 to-blue-800',
      charLimit: 3000,
      features: ['Posts', 'Articles', 'Stories']
    },
    { 
      id: 'tiktok', 
      name: 'TikTok', 
      icon: TiktokLogo, 
      color: 'from-pink-500 to-red-500',
      charLimit: 2200,
      features: ['Videos', 'Stories', 'Live']
    },
    { 
      id: 'youtube', 
      name: 'YouTube', 
      icon: YoutubeLogo, 
      color: 'from-red-600 to-red-700',
      charLimit: 5000,
      features: ['Videos', 'Shorts', 'Community']
    }
  ]

  const campaignGoals = [
    { value: 'brand-awareness', label: 'Brand Awareness' },
    { value: 'lead-generation', label: 'Lead Generation' },
    { value: 'sales', label: 'Drive Sales' },
    { value: 'engagement', label: 'Increase Engagement' },
    { value: 'traffic', label: 'Website Traffic' },
    { value: 'community', label: 'Build Community' }
  ]

  const brandVoices = [
    { value: 'professional', label: 'Professional' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'witty', label: 'Witty & Humorous' },
    { value: 'inspirational', label: 'Inspirational' },
    { value: 'authoritative', label: 'Authoritative' },
    { value: 'conversational', label: 'Conversational' },
    { value: 'trendy', label: 'Trendy & Hip' }
  ]

  const contentTypes = [
    { value: 'promotional', label: 'Promotional Post' },
    { value: 'educational', label: 'Educational Content' },
    { value: 'behind-scenes', label: 'Behind the Scenes' },
    { value: 'user-generated', label: 'User-Generated Content' },
    { value: 'trending', label: 'Trending Topic' },
    { value: 'testimonial', label: 'Customer Testimonial' },
    { value: 'announcement', label: 'Announcement' },
    { value: 'question', label: 'Engagement Question' }
  ]

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    )
  }

  const generateSocialContent = async () => {
    if (selectedPlatforms.length === 0 || !contentTopic || !brandVoice || !campaignGoal) {
      toast.error('Please fill in all required fields and select at least one platform')
      return
    }

    const requiredCredits = selectedPlatforms.length * 15
    if (user && user.credits < requiredCredits) {
      toast.error(`Insufficient credits. You need ${requiredCredits} credits to generate content for ${selectedPlatforms.length} platform(s).`)
      return
    }

    setIsGenerating(true)
    const newContents: Record<string, any> = {}

    try {
      for (const platformId of selectedPlatforms) {
        const platform = platforms.find(p => p.id === platformId)
        if (!platform) continue

        const prompt = spark.llmPrompt`Create engaging ${contentType} social media content for ${platform.name} about "${contentTopic}".

Campaign Details:
- Goal: ${campaignGoal}
- Brand Voice: ${brandVoice}
- Target Audience: ${targetAudience || 'general audience'}
- Call to Action: ${callToAction || 'engage with our brand'}
- Character Limit: ${platform.charLimit}

Requirements:
- Optimize for ${platform.name}'s algorithm and best practices
- Include relevant hashtags (5-10 for Instagram, 2-3 for others)
- Write in ${brandVoice} tone
- Make it engaging and shareable
- Include the call to action naturally
- Stay within character limits

Return a JSON object with this structure:
{
  "mainText": "The main post content",
  "hashtags": ["hashtag1", "hashtag2"],
  "hooks": ["Alternative opening line 1", "Alternative opening line 2"],
  "variations": ["Content variation 1", "Content variation 2"],
  "bestTimeToPost": "Suggested posting time",
  "engagementTips": ["Tip 1", "Tip 2"],
  "characterCount": number
}`

        const result = await spark.llm(prompt, 'gpt-4o', true)
        const contentData = JSON.parse(result)
        
        newContents[platformId] = {
          platform: platform.name,
          ...contentData,
          createdAt: new Date().toISOString()
        }
      }

      setGeneratedContents(newContents)
      setActivePreview(selectedPlatforms[0])

      // Deduct credits
      if (user) {
        setUser({ ...user, credits: user.credits - requiredCredits })
      }

      toast.success(`Content generated for ${selectedPlatforms.length} platform(s)!`)
    } catch (error) {
      toast.error('Failed to generate content. Please try again.')
      console.error('Social media generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const saveAllContent = () => {
    if (Object.keys(generatedContents).length === 0) return

    const campaignData = {
      id: Date.now(),
      name: campaignName || `Campaign ${new Date().toLocaleDateString()}`,
      goal: campaignGoal,
      topic: contentTopic,
      platforms: selectedPlatforms,
      contents: generatedContents,
      createdAt: new Date().toISOString()
    }

    setSocialContent((prev: any[]) => [campaignData, ...prev])
    toast.success('Campaign content saved to your library!')
  }

  const copyContent = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success('Content copied to clipboard!')
  }

  const exportContent = () => {
    const exportData = {
      campaign: campaignName,
      contents: generatedContents,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${campaignName || 'social-campaign'}-content.json`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success('Content exported successfully!')
  }

  const renderPlatformPreview = (platformId: string) => {
    const content = generatedContents[platformId]
    const platform = platforms.find(p => p.id === platformId)
    
    if (!content || !platform) return null

    const Icon = platform.icon

    return (
      <Card key={platformId} className="h-fit">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center`}>
                <Icon className="w-4 h-4 text-white" weight="fill" />
              </div>
              <div>
                <CardTitle className="text-sm">{platform.name}</CardTitle>
                <CardDescription className="text-xs">
                  {content.characterCount}/{platform.charLimit} chars
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              {content.bestTimeToPost}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm whitespace-pre-wrap">{content.mainText}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {content.hashtags.map((tag: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-xs font-medium">Alternative Hooks</Label>
            {content.hooks.map((hook: string, index: number) => (
              <div key={index} className="text-xs p-2 bg-accent/5 border border-accent/20 rounded">
                {hook}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">Engagement Tips</Label>
            <ul className="space-y-1">
              {content.engagementTips.map((tip: string, index: number) => (
                <li key={index} className="text-xs text-muted-foreground flex items-start">
                  <TrendUp className="w-3 h-3 mr-1 mt-0.5 text-accent flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex space-x-2 pt-2 border-t">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => copyContent(content.mainText + '\n\n' + content.hashtags.map((tag: string) => `#${tag}`).join(' '))}
              className="flex-1"
            >
              <Copy className="w-3 h-3 mr-1" />
              Copy
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <Calendar className="w-3 h-3 mr-1" />
              Schedule
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">AI Social Media Generator</h2>
        <p className="text-muted-foreground">
          Create engaging, platform-optimized social media content for your marketing campaigns
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate" className="flex items-center">
            <Wand className="w-4 h-4 mr-2" />
            Generate Content
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center">
            <Hash className="w-4 h-4 mr-2" />
            My Campaigns
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Content Generation Form */}
            <div className="lg:col-span-2 space-y-6">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Generation Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wand className="w-5 h-5 mr-2" />
                Campaign Setup
              </CardTitle>
              <CardDescription>
                Configure your social media campaign details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-name">Campaign Name</Label>
                  <Input
                    id="campaign-name"
                    placeholder="e.g., Summer Product Launch"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign-goal">Campaign Goal *</Label>
                  <Select value={campaignGoal} onValueChange={setCampaignGoal}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select campaign goal" />
                    </SelectTrigger>
                    <SelectContent>
                      {campaignGoals.map((goal) => (
                        <SelectItem key={goal.value} value={goal.value}>
                          {goal.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content-topic">Content Topic/Subject *</Label>
                <Input
                  id="content-topic"
                  placeholder="e.g., New eco-friendly product line launch"
                  value={contentTopic}
                  onChange={(e) => setContentTopic(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand-voice">Brand Voice *</Label>
                  <Select value={brandVoice} onValueChange={setBrandVoice}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand voice" />
                    </SelectTrigger>
                    <SelectContent>
                      {brandVoices.map((voice) => (
                        <SelectItem key={voice.value} value={voice.value}>
                          {voice.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content-type">Content Type</Label>
                  <Select value={contentType} onValueChange={setContentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      {contentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="target-audience">Target Audience</Label>
                  <Input
                    id="target-audience"
                    placeholder="e.g., Environmentally conscious millennials"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="call-to-action">Call to Action</Label>
                  <Input
                    id="call-to-action"
                    placeholder="e.g., Shop now, Learn more, Sign up"
                    value={callToAction}
                    onChange={(e) => setCallToAction(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Select Platforms
              </CardTitle>
              <CardDescription>
                Choose which social media platforms to generate content for
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {platforms.map((platform) => {
                  const Icon = platform.icon
                  const isSelected = selectedPlatforms.includes(platform.id)
                  
                  return (
                    <div
                      key={platform.id}
                      onClick={() => togglePlatform(platform.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:scale-105 ${
                        isSelected 
                          ? 'border-accent bg-accent/10' 
                          : 'border-border hover:border-accent/50'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" weight="fill" />
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-sm">{platform.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {platform.charLimit} chars
                          </p>
                        </div>
                        {isSelected && (
                          <Badge className="text-xs bg-accent">Selected</Badge>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
              
              <Separator className="my-4" />
              
              <Button 
                onClick={generateSocialContent}
                disabled={isGenerating || selectedPlatforms.length === 0 || !contentTopic || !brandVoice || !campaignGoal}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Sparkle className="w-4 h-4 mr-2 animate-spin" />
                    Generating Content...
                  </>
                ) : (
                  <>
                    <Sparkle className="w-4 h-4 mr-2" />
                    Generate Content ({selectedPlatforms.length * 15} credits)
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {Object.keys(generatedContents).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Hash className="w-5 h-5 mr-2" />
                    Generated Content
                  </span>
                  <div className="flex space-x-2">
                    <Button onClick={saveAllContent} variant="outline" size="sm">
                      <Save className="w-4 h-4 mr-2" />
                      Save Campaign
                    </Button>
                    <Button onClick={exportContent} variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activePreview} onValueChange={setActivePreview}>
                  <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
                    {selectedPlatforms.map((platformId) => {
                      const platform = platforms.find(p => p.id === platformId)
                      if (!platform) return null
                      const Icon = platform.icon
                      return (
                        <TabsTrigger key={platformId} value={platformId} className="flex items-center">
                          <Icon className="w-4 h-4 mr-1" />
                          <span className="hidden sm:inline">{platform.name}</span>
                        </TabsTrigger>
                      )
                    })}
                  </TabsList>
                  {selectedPlatforms.map((platformId) => (
                    <TabsContent key={platformId} value={platformId} className="mt-6">
                      {renderPlatformPreview(platformId)}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Credit Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-accent">{user?.credits || 0}</p>
                <p className="text-sm text-muted-foreground">Credits remaining</p>
                <p className="text-xs text-muted-foreground mt-2">
                  15 credits per platform
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Campaigns</CardTitle>
              <CardDescription>Your latest social media campaigns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {socialContent.slice(0, 3).map((campaign: any) => (
                <div key={campaign.id} className="p-3 bg-muted/50 rounded-lg">
                  <p className="font-medium text-sm">{campaign.name}</p>
                  <p className="text-xs text-muted-foreground mb-2">
                    {campaign.platforms.length} platform(s)
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {campaign.platforms.map((platformId: string) => {
                      const platform = platforms.find(p => p.id === platformId)
                      if (!platform) return null
                      const Icon = platform.icon
                      return (
                        <div key={platformId} className={`w-5 h-5 rounded bg-gradient-to-br ${platform.color} flex items-center justify-center`}>
                          <Icon className="w-3 h-3 text-white" weight="fill" />
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pro Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <TrendUp className="w-4 h-4 text-accent mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    Use trending hashtags to increase visibility
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <Target className="w-4 h-4 text-accent mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    Post when your audience is most active
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <Users className="w-4 h-4 text-accent mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    Engage with comments within 1 hour
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {socialContent.map((campaign: any) => (
              <Card key={campaign.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{campaign.name}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {campaign.platforms.length} platforms
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">
                    {new Date(campaign.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground">{campaign.topic}</p>
                  <div className="flex flex-wrap gap-1">
                    {campaign.platforms.map((platformId: string) => {
                      const platform = platforms.find(p => p.id === platformId)
                      if (!platform) return null
                      const Icon = platform.icon
                      return (
                        <div key={platformId} className={`w-6 h-6 rounded bg-gradient-to-br ${platform.color} flex items-center justify-center`}>
                          <Icon className="w-3 h-3 text-white" weight="fill" />
                        </div>
                      )
                    })}
                  </div>
                  <Button size="sm" variant="outline" className="w-full">
                    View Campaign
                  </Button>
                </CardContent>
              </Card>
            ))}
            {socialContent.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Hash className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">No campaigns yet</p>
                <p className="text-sm text-muted-foreground">Create your first social media campaign to get started</p>
                <Button 
                  className="mt-4" 
                  onClick={() => setActiveTab('generate')}
                >
                  Create Campaign
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {socialContent.length > 0 ? (
            <SocialPostPerformance campaign={socialContent[0]} />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BarChart3 className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">No performance data available</p>
                <p className="text-sm text-muted-foreground text-center">
                  Create and publish social media campaigns to see performance analytics
                </p>
                <Button 
                  className="mt-4" 
                  onClick={() => setActiveTab('generate')}
                >
                  Create First Campaign
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}