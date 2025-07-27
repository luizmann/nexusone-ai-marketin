import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useLanguage } from '../../contexts/CleanLanguageContext'
import { Brain, MessageCircle, Wand2, Lightbulb, Target, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'

export function NexBrain() {
  const { t } = useLanguage()
  const [query, setQuery] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [suggestions] = useState([
    {
      title: t('create_complete_campaign'),
      description: t('generate_landing_page_ads_and_copy'),
      action: 'campaign'
    },
    {
      title: t('find_winning_products'),
      description: t('analyze_trending_products_for_dropshipping'),
      action: 'products'
    },
    {
      title: t('optimize_conversions'),
      description: t('improve_existing_campaigns_performance'),
      action: 'optimize'
    },
    {
      title: t('create_video_content'),
      description: t('generate_promotional_videos_with_ai'),
      action: 'video'
    }
  ])

  const [conversation, setConversation] = useState([
    {
      type: 'assistant',
      message: t('hello_im_nexbrain_how_can_i_help'),
      timestamp: new Date().toLocaleTimeString()
    }
  ])

  const sendMessage = async () => {
    if (!query.trim()) return

    const userMessage = {
      type: 'user',
      message: query,
      timestamp: new Date().toLocaleTimeString()
    }

    setConversation(prev => [...prev, userMessage])
    setQuery('')
    setIsProcessing(true)

    try {
      // Simular processamento da IA
      await new Promise(resolve => setTimeout(resolve, 2000))

      const aiResponse = {
        type: 'assistant',
        message: generateAIResponse(userMessage.message),
        timestamp: new Date().toLocaleTimeString()
      }

      setConversation(prev => [...prev, aiResponse])
    } catch (error) {
      toast.error(t('error_processing_request'))
    } finally {
      setIsProcessing(false)
    }
  }

  const generateAIResponse = (userQuery: string) => {
    const query = userQuery.toLowerCase()
    
    if (query.includes('campanha') || query.includes('campaign')) {
      return `🎯 ${t('perfect')}! ${t('i_can_create_complete_campaign_for_you')}

**${t('what_ill_do')}:**
• ${t('analyze_your_product_or_service')}
• ${t('create_optimized_landing_page')}
• ${t('generate_facebook_ads_creatives')}
• ${t('write_compelling_copy')}
• ${t('set_up_whatsapp_automation')}

${t('just_provide_product_url_or_description')}!`
    }
    
    if (query.includes('produto') || query.includes('product')) {
      return `🔍 ${t('great')}! ${t('i_can_help_find_winning_products')}

**${t('trending_categories')}:**
• ${t('tech_gadgets')}
• ${t('home_improvement')}
• ${t('fitness_health')}
• ${t('fashion_accessories')}

${t('would_you_like_me_to_show_current_trending_products')}?`
    }
    
    if (query.includes('video') || query.includes('vídeo')) {
      return `🎥 ${t('excellent')}! ${t('i_can_create_professional_videos')}

**${t('video_types_i_can_make')}:**
• ${t('product_demonstrations')}
• ${t('promotional_videos')}
• ${t('customer_testimonials')}
• ${t('explainer_videos')}

${t('describe_what_video_you_need')}!`
    }
    
    return `💡 ${t('understood')}! ${t('based_on_your_request_i_suggest')}:

1. **${t('analyze_opportunity')}**: ${t('let_me_research_market_data')}
2. **${t('create_strategy')}**: ${t('develop_comprehensive_marketing_plan')}
3. **${t('implement_solution')}**: ${t('execute_with_ai_automation')}

${t('would_you_like_me_to_proceed_with_analysis')}?`
  }

  const executeSuggestion = async (action: string) => {
    setIsProcessing(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const responses = {
        campaign: `🚀 ${t('creating_complete_campaign')}...

✅ ${t('landing_page_generated')}
✅ ${t('facebook_ads_created')}  
✅ ${t('copy_optimized')}
✅ ${t('whatsapp_bot_configured')}

${t('campaign_ready_to_launch')}!`,
        products: `📊 ${t('analyzing_winning_products')}...

✅ ${t('found_trending_products')} (127)
✅ ${t('profit_margins_calculated')}
✅ ${t('supplier_data_verified')}
✅ ${t('competition_analyzed')}

${t('showing_top_10_opportunities')}!`,
        optimize: `📈 ${t('optimizing_campaigns')}...

✅ ${t('performance_data_analyzed')}
✅ ${t('audience_insights_generated')}
✅ ${t('creative_variations_created')}
✅ ${t('bid_strategy_optimized')}

${t('projected_improvement')}: +45% ROAS!`,
        video: `🎬 ${t('generating_video_content')}...

✅ ${t('script_written')}
✅ ${t('visuals_generated')}
✅ ${t('voiceover_created')}
✅ ${t('music_added')}

${t('video_ready_for_download')}!`
      }

      const response = {
        type: 'assistant',
        message: responses[action as keyof typeof responses] || t('task_completed_successfully'),
        timestamp: new Date().toLocaleTimeString()
      }

      setConversation(prev => [...prev, response])
      toast.success(t('task_completed_successfully'))
    } catch (error) {
      toast.error(t('error_executing_task'))
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Brain className="h-8 w-8 text-purple-600" />
          NexBrain
        </h1>
        <p className="text-muted-foreground">{t('your_intelligent_marketing_assistant')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              {t('ai_assistant')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-96 bg-muted rounded-lg p-4 overflow-y-auto space-y-4">
              {conversation.map((message, index) => (
                <div 
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-background border'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{message.message}</p>
                    <p className="text-xs opacity-75 mt-1">{message.timestamp}</p>
                  </div>
                </div>
              ))}
              
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-background border p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 animate-pulse text-purple-600" />
                      <span className="text-sm">{t('thinking')}...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Textarea
                placeholder={t('ask_nexbrain_anything')}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                rows={2}
                className="flex-1"
              />
              <Button 
                onClick={sendMessage}
                disabled={isProcessing || !query.trim()}
                size="lg"
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              {t('quick_suggestions')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full h-auto p-4 flex flex-col items-start gap-2"
                onClick={() => executeSuggestion(suggestion.action)}
                disabled={isProcessing}
              >
                <h4 className="font-medium text-left">{suggestion.title}</h4>
                <p className="text-xs text-muted-foreground text-left">{suggestion.description}</p>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Features Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            {t('nexbrain_capabilities')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Target className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-blue-800 mb-2">{t('campaign_automation')}</h3>
              <p className="text-sm text-blue-700">{t('create_complete_marketing_campaigns_automatically')}</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <TrendingUp className="h-8 w-8 text-green-600 mb-3" />
              <h3 className="font-semibold text-green-800 mb-2">{t('market_analysis')}</h3>
              <p className="text-sm text-green-700">{t('analyze_trends_and_find_profitable_opportunities')}</p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <Brain className="h-8 w-8 text-purple-600 mb-3" />
              <h3 className="font-semibold text-purple-800 mb-2">{t('content_generation')}</h3>
              <p className="text-sm text-purple-700">{t('generate_copy_images_videos_and_landing_pages')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Example Prompts */}
      <Card>
        <CardHeader>
          <CardTitle>{t('example_prompts')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              t('create_campaign_for_fitness_product'),
              t('find_trending_tech_gadgets'),
              t('optimize_my_facebook_ads'),
              t('generate_video_for_restaurant'),
              t('analyze_competitor_campaigns'),
              t('create_whatsapp_sales_funnel')
            ].map((prompt, index) => (
              <Button
                key={index}
                variant="ghost"
                className="h-auto p-3 text-left justify-start"
                onClick={() => setQuery(prompt)}
              >
                <MessageCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">{prompt}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}