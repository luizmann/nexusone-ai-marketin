import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useLanguage } from '@/contexts/LanguageContext'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { 
  Brain, 
  Send, 
  Sparkles, 
  TrendingUp, 
  BarChart, 
  Target,
  Lightbulb,
  Zap,
  Copy,
  Download,
  RefreshCw
} from '@phosphor-icons/react'

interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: string
  tokens?: number
}

interface MarketingInsight {
  type: 'optimization' | 'trend' | 'opportunity' | 'warning'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  actionable: boolean
}

export function NexBrainAssistant() {
  const { t } = useLanguage()
  const [messages, setMessages] = useKV<ChatMessage[]>('nexbrain-chat-history', [])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userCredits, setUserCredits] = useKV('user-credits', { general: 500 })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const marketingInsights: MarketingInsight[] = [
    {
      type: 'optimization',
      title: 'Landing Page Performance',
      description: 'Your Magic Sales pages show 23% higher conversion on mobile devices',
      impact: 'high',
      actionable: true
    },
    {
      type: 'trend',
      title: 'Video Content Trending',
      description: 'Short-form videos are getting 340% more engagement this week',
      impact: 'high',
      actionable: true
    },
    {
      type: 'opportunity',
      title: 'WhatsApp Automation Gap',
      description: 'You could increase conversions by 45% with automated follow-ups',
      impact: 'medium',
      actionable: true
    },
    {
      type: 'warning',
      title: 'Campaign Budget Alert',
      description: 'Facebook campaign #3 is overspending by 15% with low ROAS',
      impact: 'medium',
      actionable: true
    }
  ]

  const quickPrompts = [
    "Optimize my Facebook ad campaign",
    "Analyze my conversion funnel",
    "Create a content calendar",
    "Improve my landing page copy",
    "Find trending products to sell",
    "Plan my marketing budget"
  ]

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    if (userCredits.general < 10) {
      toast.error('Insufficient credits. You need 10 credits to consult NexBrain.')
      return
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      // Simulate AI response with OpenAI GPT-4
      const aiResponse = await generateAIResponse(inputMessage)
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
        tokens: Math.floor(aiResponse.length / 4) // Approximate token count
      }

      setMessages(prev => [...prev, assistantMessage])
      
      // Deduct credits
      setUserCredits(prev => ({
        ...prev,
        general: prev.general - 10
      }))

      toast.success('NexBrain analysis complete!')

    } catch (error) {
      toast.error('Failed to get AI response')
    } finally {
      setIsLoading(false)
    }
  }

  const generateAIResponse = async (prompt: string): Promise<string> => {
    // In real implementation, this would call OpenAI API
    await new Promise(resolve => setTimeout(resolve, 2000))

    const responses = {
      "optimize": `🎯 **Campaign Optimization Analysis**

Based on your current data, here are my recommendations:

**Facebook Ads Performance:**
- Increase budget on Ad Set #2 (ROAS: 4.2x)
- Pause underperforming audiences (ROAS < 2.0x)
- Test video creatives - they're showing 23% higher CTR

**Landing Page Optimization:**
- Add urgency elements (limited time offers)
- Improve mobile loading speed (currently 3.2s)
- A/B test the CTA button color (try green vs orange)

**Budget Allocation:**
- Shift 30% budget from search to video ads
- Increase retargeting spend by 15%

**Predicted Impact:** 35-50% improvement in overall ROAS within 14 days.

Would you like me to implement these changes automatically?`,

      "funnel": `📊 **Conversion Funnel Analysis**

Your marketing funnel performance breakdown:

**Stage 1: Traffic Generation**
- 10,000 monthly visitors
- Top sources: Facebook (45%), Google (25%), Direct (20%)
- **Issue:** High bounce rate on mobile (68%)

**Stage 2: Lead Capture**
- 1,500 leads captured (15% conversion)
- Best performer: Exit-intent popup (22% conversion)
- **Opportunity:** Add WhatsApp lead magnet

**Stage 3: Sales Conversion**
- 180 sales (12% lead-to-sale conversion)
- Average order value: $127
- **Bottleneck:** Abandoned cart rate 73%

**Recommendations:**
1. Implement WhatsApp recovery sequences
2. Add social proof to checkout page
3. Create urgency with countdown timers
4. Optimize mobile checkout flow

**Expected Results:** 40% increase in overall conversion rate.`,

      "content": `📅 **30-Day Content Calendar Strategy**

**Week 1: Education & Trust Building**
- Mon: "How to" tutorial videos
- Wed: Industry insights blog post
- Fri: Customer success story
- Sun: Behind-the-scenes content

**Week 2: Product Focus**
- Mon: Product demonstration video
- Wed: Feature comparison post
- Fri: User-generated content
- Sun: Product benefits infographic

**Week 3: Social Proof & Authority**
- Mon: Expert interview/podcast
- Wed: Case study deep-dive
- Fri: Customer testimonials video
- Sun: Industry news commentary

**Week 4: Conversion & Retargeting**
- Mon: Limited-time offer announcement
- Wed: FAQ addressing objections
- Fri: Urgency-driven sales post
- Sun: Community highlights

**Content Mix:**
- 40% Educational
- 30% Product-focused
- 20% Social proof
- 10% Promotional

**Posting Schedule:**
- Facebook: Daily at 3 PM
- Instagram: Daily at 6 PM
- LinkedIn: 3x per week at 9 AM
- TikTok: Daily at 7 PM

Would you like me to generate specific content for any of these days?`,

      "default": `🧠 **NexBrain Marketing Intelligence**

I've analyzed your question and here's my strategic recommendation:

**Current Situation Analysis:**
Your marketing ecosystem shows strong potential with some optimization opportunities.

**Key Insights:**
• Video content is outperforming static posts by 340%
• Mobile traffic represents 68% of your audience
• WhatsApp automation could boost conversions by 45%
• Your best-performing demographic is 25-34 years old

**Action Plan:**
1. **Immediate (Next 7 days):**
   - Increase video content production
   - Optimize mobile user experience
   - Set up WhatsApp automation sequences

2. **Short-term (Next 30 days):**
   - Launch retargeting campaigns
   - A/B test new creative formats
   - Implement exit-intent captures

3. **Long-term (Next 90 days):**
   - Scale winning campaigns
   - Expand to new platforms
   - Build marketing automation workflows

**Expected ROI:** 200-300% improvement in marketing efficiency.

Would you like me to elaborate on any specific area or implement these recommendations?`
    }

    // Simple keyword matching for demo
    const lowerPrompt = prompt.toLowerCase()
    if (lowerPrompt.includes('optimize') || lowerPrompt.includes('campaign')) {
      return responses.optimize
    } else if (lowerPrompt.includes('funnel') || lowerPrompt.includes('conversion')) {
      return responses.funnel
    } else if (lowerPrompt.includes('content') || lowerPrompt.includes('calendar')) {
      return responses.content
    } else {
      return responses.default
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt)
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
    toast.success('Message copied to clipboard!')
  }

  const handleClearChat = () => {
    setMessages([])
    toast.success('Chat history cleared!')
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <TrendingUp className="h-4 w-4" />
      case 'trend': return <BarChart className="h-4 w-4" />
      case 'opportunity': return <Lightbulb className="h-4 w-4" />
      case 'warning': return <Zap className="h-4 w-4 text-orange-500" />
      default: return <Target className="h-4 w-4" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'optimization': return 'text-blue-600 bg-blue-50'
      case 'trend': return 'text-green-600 bg-green-50'
      case 'opportunity': return 'text-purple-600 bg-purple-50'
      case 'warning': return 'text-orange-600 bg-orange-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Brain className="h-8 w-8 text-purple-500" />
          NexBrain Assistant
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Your AI-powered marketing consultant. Get instant insights, optimization recommendations, 
          and strategic guidance for all your campaigns.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/api/placeholder/32/32" />
                    <AvatarFallback>
                      <Brain className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">NexBrain Assistant</CardTitle>
                    <CardDescription>AI Marketing Intelligence</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {userCredits.general} credits
                  </Badge>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleClearChat}
                  >
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              <ScrollArea className="flex-1 p-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12 space-y-4">
                    <Brain className="h-12 w-12 text-muted-foreground mx-auto" />
                    <div>
                      <h3 className="font-medium mb-2">Welcome to NexBrain</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Ask me anything about marketing optimization, campaign analysis, or growth strategies.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md mx-auto">
                      {quickPrompts.slice(0, 4).map((prompt, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuickPrompt(prompt)}
                          className="text-xs"
                        >
                          {prompt}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg p-3 ${
                          message.type === 'user' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}>
                          <div className="flex items-start gap-2">
                            {message.type === 'assistant' && (
                              <Avatar className="h-6 w-6 mt-1">
                                <AvatarFallback className="text-xs">
                                  <Brain className="h-3 w-3" />
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="prose prose-sm max-w-none">
                                {message.content.split('\n').map((line, index) => (
                                  <div key={index}>
                                    {line.startsWith('**') && line.endsWith('**') ? (
                                      <strong>{line.slice(2, -2)}</strong>
                                    ) : line.startsWith('•') ? (
                                      <div className="ml-4">• {line.slice(2)}</div>
                                    ) : (
                                      line
                                    )}
                                  </div>
                                ))}
                              </div>
                              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                                <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                                <div className="flex items-center gap-1">
                                  {message.tokens && (
                                    <span>{message.tokens} tokens</span>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleCopyMessage(message.content)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>
                                <Brain className="h-3 w-3 animate-pulse" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask NexBrain about your marketing strategy..."
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    disabled={isLoading}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Cost: 10 credits per consultation • Press Enter to send
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights Sidebar */}
        <div className="space-y-4">
          {/* Quick Prompts */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Consultations</CardTitle>
              <CardDescription>Popular marketing questions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickPrompt(prompt)}
                  className="w-full text-left justify-start text-xs"
                >
                  <Sparkles className="h-3 w-3 mr-2" />
                  {prompt}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Live Insights */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Live Marketing Insights</CardTitle>
              <CardDescription>Real-time performance alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {marketingInsights.map((insight, index) => (
                <div key={index} className={`p-3 rounded-lg ${getInsightColor(insight.type)}`}>
                  <div className="flex items-start gap-2">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm">{insight.title}</h4>
                      <p className="text-xs mt-1 opacity-80">{insight.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge 
                          variant="secondary" 
                          className="text-xs"
                        >
                          {insight.impact} impact
                        </Badge>
                        {insight.actionable && (
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="h-6 text-xs px-2"
                            onClick={() => setInputMessage(`Tell me more about: ${insight.title}`)}
                          >
                            Ask NexBrain
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">NexBrain Capabilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <span>Campaign optimization</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart className="h-4 w-4 text-green-500" />
                <span>Performance analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-500" />
                <span>Strategy planning</span>
              </div>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-orange-500" />
                <span>Growth opportunities</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}