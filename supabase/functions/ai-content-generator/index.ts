import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GenerateContentRequest {
  prompt: string
  type: 'text' | 'marketing_copy' | 'social_media' | 'email' | 'blog_post'
  language: 'en' | 'es' | 'pt' | 'ar' | 'he'
  tone: 'professional' | 'casual' | 'friendly' | 'persuasive' | 'informative'
  length: 'short' | 'medium' | 'long'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { prompt, type, language, tone, length }: GenerateContentRequest = await req.json()
    
    // Verify user authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    // Check user credits
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('credits, plan')
      .eq('id', user.id)
      .single()

    if (userError || !userData) {
      return new Response('User not found', { status: 404, headers: corsHeaders })
    }

    const creditsRequired = getCreditsRequired(type)
    if (userData.credits < creditsRequired) {
      return new Response('Insufficient credits', { status: 402, headers: corsHeaders })
    }

    // Generate content using OpenAI
    const systemPrompt = buildSystemPrompt(type, language, tone, length)
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: getMaxTokens(length),
        temperature: getTone(tone),
      }),
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`)
    }

    const openaiData = await openaiResponse.json()
    const generatedContent = openaiData.choices[0].message.content

    // Consume credits
    const { error: creditError } = await supabase.rpc('consume_credits', {
      p_user_id: user.id,
      p_amount: creditsRequired,
      p_module: 'ai_content',
      p_description: `Generated ${type} content`
    })

    if (creditError) {
      throw new Error('Failed to consume credits')
    }

    // Save generated content
    const { data: contentData, error: contentError } = await supabase
      .from('ai_content')
      .insert({
        user_id: user.id,
        module: 'ai_content',
        content_type: 'text',
        title: `${type} - ${new Date().toISOString().split('T')[0]}`,
        content: {
          prompt,
          generated_text: generatedContent,
          type,
          language,
          tone,
          length,
          metadata: {
            tokens_used: openaiData.usage?.total_tokens || 0,
            model: 'gpt-4o'
          }
        },
        language,
        credits_used: creditsRequired
      })
      .select()
      .single()

    if (contentError) {
      console.error('Error saving content:', contentError)
    }

    // Log usage analytics
    await supabase
      .from('usage_analytics')
      .insert({
        user_id: user.id,
        module: 'ai_content',
        action: 'generate_content',
        credits_consumed: creditsRequired,
        success: true,
        metadata: {
          type,
          language,
          tone,
          length,
          tokens_used: openaiData.usage?.total_tokens || 0
        }
      })

    return new Response(
      JSON.stringify({
        success: true,
        content: generatedContent,
        content_id: contentData?.id,
        credits_used: creditsRequired,
        remaining_credits: userData.credits - creditsRequired
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in ai-content-generator:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

function getCreditsRequired(type: string): number {
  const costs = {
    'text': 5,
    'marketing_copy': 10,
    'social_media': 8,
    'email': 12,
    'blog_post': 15
  }
  return costs[type] || 10
}

function buildSystemPrompt(type: string, language: string, tone: string, length: string): string {
  const languagePrompts = {
    en: 'Respond in English',
    es: 'Responde en español',
    pt: 'Responda em português',
    ar: 'أجب باللغة العربية',
    he: 'ענה בעברית'
  }

  const typePrompts = {
    text: 'Generate clear and concise text content',
    marketing_copy: 'Create compelling marketing copy that drives conversions',
    social_media: 'Write engaging social media content with hooks and calls-to-action',
    email: 'Craft professional email content with clear subject lines',
    blog_post: 'Write informative blog post content with proper structure'
  }

  const tonePrompts = {
    professional: 'Use a professional and authoritative tone',
    casual: 'Use a casual and conversational tone',
    friendly: 'Use a warm and friendly tone',
    persuasive: 'Use a persuasive and compelling tone',
    informative: 'Use an informative and educational tone'
  }

  const lengthPrompts = {
    short: 'Keep the response concise (100-200 words)',
    medium: 'Provide a medium-length response (200-400 words)',
    long: 'Create a comprehensive response (400-800 words)'
  }

  return `${languagePrompts[language]}. ${typePrompts[type]}. ${tonePrompts[tone]}. ${lengthPrompts[length]}. Focus on quality and relevance.`
}

function getMaxTokens(length: string): number {
  const tokens = {
    short: 300,
    medium: 600,
    long: 1200
  }
  return tokens[length] || 600
}

function getTone(tone: string): number {
  const temperatures = {
    professional: 0.3,
    casual: 0.7,
    friendly: 0.6,
    persuasive: 0.8,
    informative: 0.4
  }
  return temperatures[tone] || 0.5
}