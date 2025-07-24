import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useKV } from '@github/spark/hooks'
import { PenNib, Sparkle, Copy, Save } from '@phosphor-icons/react'
import { toast } from 'sonner'

export function ContentGenerator() {
  const [user, setUser] = useKV('user-profile', null)
  const [generatedContent, setGeneratedContent] = useKV('generated-content', [])
  const [isGenerating, setIsGenerating] = useState(false)
  const [contentType, setContentType] = useState('')
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('')
  const [generatedText, setGeneratedText] = useState('')
  const [audienceTarget, setAudienceTarget] = useState('')

  const contentTypes = [
    { value: 'social-post', label: 'Social Media Post' },
    { value: 'email-subject', label: 'Email Subject Line' },
    { value: 'blog-intro', label: 'Blog Introduction' },
    { value: 'ad-copy', label: 'Advertisement Copy' },
    { value: 'product-description', label: 'Product Description' },
    { value: 'headline', label: 'Marketing Headline' }
  ]

  const toneOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'friendly', label: 'Friendly' },
    { value: 'excited', label: 'Excited' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'casual', label: 'Casual' },
    { value: 'persuasive', label: 'Persuasive' }
  ]

  const generateContent = async () => {
    if (!contentType || !topic || !tone) {
      toast.error('Please fill in all required fields')
      return
    }

    if (user && user.credits < 10) {
      toast.error('Insufficient credits. You need 10 credits to generate content.')
      return
    }

    setIsGenerating(true)

    try {
      const prompt = spark.llmPrompt`Create ${contentType} content about ${topic} with a ${tone} tone for ${audienceTarget || 'general audience'}. Make it engaging and actionable.`
      
      const result = await spark.llm(prompt)
      setGeneratedText(result)

      if (user) {
        setUser({ ...user, credits: user.credits - 10 })
      }

      toast.success('Content generated successfully!')
    } catch (error) {
      toast.error('Failed to generate content. Please try again.')
      console.error('Content generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedText)
    toast.success('Content copied to clipboard!')
  }

  const saveContent = () => {
    if (!generatedText) return

    const newContent = {
      id: Date.now(),
      type: contentType,
      topic: topic,
      tone: tone,
      content: generatedText,
      createdAt: new Date().toISOString()
    }

    setGeneratedContent((prev) => [newContent, ...prev])
    toast.success('Content saved to your library!')
  }

  const recentContent = generatedContent.slice(0, 3)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Content Generator</h2>
        <p className="text-muted-foreground">
          Create compelling marketing content with AI assistance
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PenNib className="w-5 h-5 mr-2" />
                Generate New Content
              </CardTitle>
              <CardDescription>
                Fill in the details below to generate AI-powered marketing content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="content-type">Content Type *</Label>
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

                <div className="space-y-2">
                  <Label htmlFor="tone">Tone *</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {toneOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">Topic/Subject *</Label>
                <Input
                  id="topic"
                  placeholder="e.g., New product launch, Black Friday sale, Marketing tips"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience">Target Audience (Optional)</Label>
                <Input
                  id="audience"
                  placeholder="e.g., Small business owners, Tech enthusiasts, Young professionals"
                  value={audienceTarget}
                  onChange={(e) => setAudienceTarget(e.target.value)}
                />
              </div>

              <Button 
                onClick={generateContent} 
                disabled={isGenerating || !contentType || !topic || !tone}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Sparkle className="w-4 h-4 mr-2 animate-spin" />
                    Generating Content...
                  </>
                ) : (
                  <>
                    <Sparkle className="w-4 h-4 mr-2" />
                    Generate Content (10 credits)
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {generatedText && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Content</CardTitle>
                <CardDescription>Your AI-generated marketing content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={generatedText}
                  onChange={(e) => setGeneratedText(e.target.value)}
                  rows={8}
                  className="font-mono text-sm"
                />
                <div className="flex space-x-2">
                  <Button onClick={copyToClipboard} variant="outline">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button onClick={saveContent} variant="outline">
                    <Save className="w-4 h-4 mr-2" />
                    Save to Library
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Credit Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-accent">{user?.credits || 0}</p>
                <p className="text-sm text-muted-foreground">Credits remaining</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Content generation costs 10 credits per use
                </p>
              </div>
            </CardContent>
          </Card>

          {recentContent.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Content</CardTitle>
                <CardDescription>Your latest generated content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentContent.map((content) => (
                  <div key={content.id} className="p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-sm capitalize">
                      {content.type.replace('-', ' ')}
                    </p>
                    <p className="text-xs text-muted-foreground mb-2">
                      {content.topic}
                    </p>
                    <p className="text-xs text-foreground line-clamp-2">
                      {content.content}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}