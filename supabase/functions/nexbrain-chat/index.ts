/**
 * NexusOneAI Edge Function: NexBrain AI Assistant
 * Handles all AI-powered content generation and marketing strategy
 */

import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NexBrainRequest {
  prompt: string
  context?: {
    type?: 'campaign' | 'magic_page' | 'video' | 'ads' | 'general'
    productUrl?: string
    targetAudience?: string
    budget?: number
    goals?: string[]
  }
  options?: {
    model?: 'gpt-4' | 'gpt-3.5-turbo'
    maxTokens?: number
    temperature?: number
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get user from JWT
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) {
      throw new Error('Unauthorized')
    }

    const body: NexBrainRequest = await req.json()
    const { prompt, context, options } = body

    // Check user credits
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('credits, plan')
      .eq('user_id', user.id)
      .single()

    if (!profile || profile.credits < 5) {
      throw new Error('Insufficient credits')
    }

    // Build context-aware system prompt
    let systemPrompt = `You are NexBrain, the AI marketing strategist for NexusOneAI platform. You help users create profitable marketing campaigns, sales pages, videos, and automated sales funnels.

Key capabilities:
- Generate complete marketing campaigns
- Create high-converting sales copy
- Develop video scripts and concepts
- Optimize Facebook/Instagram ads
- Design WhatsApp sales conversations
- Analyze market trends and opportunities

Always provide actionable, specific advice that drives real business results.`

    if (context?.type) {
      switch (context.type) {
        case 'campaign':
          systemPrompt += `\n\nFocus: Complete marketing campaign creation including strategy, content, and automation setup.`
          break
        case 'magic_page':
          systemPrompt += `\n\nFocus: High-converting sales page creation with persuasive copy, structure, and call-to-actions.`
          break
        case 'video':
          systemPrompt += `\n\nFocus: Engaging video content creation including scripts, concepts, and production guidance.`
          break
        case 'ads':
          systemPrompt += `\n\nFocus: Facebook/Instagram ad campaign optimization including targeting, copy, and creative suggestions.`
          break
      }
    }

    // Add context information
    let userPrompt = prompt
    if (context?.productUrl) {
      userPrompt += `\n\nProduct URL: ${context.productUrl}`
    }
    if (context?.targetAudience) {
      userPrompt += `\n\nTarget Audience: ${context.targetAudience}`
    }
    if (context?.budget) {
      userPrompt += `\n\nBudget: $${context.budget}`
    }

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: options?.model || 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: options?.maxTokens || 1500,
        temperature: options?.temperature || 0.7,
      }),
    })

    if (!openaiResponse.ok) {
      const error = await openaiResponse.text()
      console.error('OpenAI API Error:', error)
      throw new Error('Failed to generate AI response')
    }

    const aiData = await openaiResponse.json()
    const aiResponse = aiData.choices[0]?.message?.content

    if (!aiResponse) {
      throw new Error('No response from AI')
    }

    // Deduct credits
    const creditsUsed = Math.ceil(aiData.usage?.total_tokens / 100) || 5
    await supabase
      .from('user_profiles')
      .update({ credits: profile.credits - creditsUsed })
      .eq('user_id', user.id)

    // Log usage
    await supabase
      .from('usage_logs')
      .insert({
        user_id: user.id,
        action: 'nexbrain_chat',
        credits_used: creditsUsed,
        api_service: 'openai',
        metadata: {
          model: options?.model || 'gpt-4',
          tokens_used: aiData.usage?.total_tokens,
          context_type: context?.type
        }
      })

    return new Response(
      JSON.stringify({
        response: aiResponse,
        credits_used: creditsUsed,
        remaining_credits: profile.credits - creditsUsed,
        tokens_used: aiData.usage?.total_tokens
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('NexBrain Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})