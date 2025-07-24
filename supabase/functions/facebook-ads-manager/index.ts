import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FacebookCampaignRequest {
  campaign_name: string
  objective: 'REACH' | 'TRAFFIC' | 'CONVERSIONS' | 'LEAD_GENERATION' | 'BRAND_AWARENESS'
  target_audience: {
    age_min: number
    age_max: number
    genders: string[]
    interests: string[]
    countries: string[]
    languages: string[]
  }
  ad_creative: {
    title: string
    description: string
    image_url?: string
    video_url?: string
    call_to_action: string
    destination_url: string
  }
  budget: {
    type: 'daily' | 'lifetime'
    amount: number
    currency: string
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const campaignData: FacebookCampaignRequest = await req.json()
    
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

    const creditsRequired = 15 // Facebook ads creation costs 15 credits
    if (userData.credits < creditsRequired) {
      return new Response('Insufficient credits', { status: 402, headers: corsHeaders })
    }

    // Get user's Facebook integration
    const { data: fbIntegration, error: integrationError } = await supabase
      .from('user_integrations')
      .select('api_credentials')
      .eq('user_id', user.id)
      .eq('service_name', 'facebook')
      .eq('is_active', true)
      .single()

    if (integrationError || !fbIntegration) {
      return new Response('Facebook integration not found', { status: 404, headers: corsHeaders })
    }

    const fbCredentials = fbIntegration.api_credentials as any
    const accessToken = fbCredentials.access_token
    const adAccountId = fbCredentials.ad_account_id

    // Step 1: Create Campaign
    const campaign = await createFacebookCampaign(
      adAccountId,
      accessToken,
      campaignData.campaign_name,
      campaignData.objective
    )

    if (!campaign.success) {
      throw new Error('Failed to create Facebook campaign')
    }

    // Step 2: Create Ad Set
    const adSet = await createAdSet(
      adAccountId,
      accessToken,
      campaign.campaign_id,
      campaignData.target_audience,
      campaignData.budget
    )

    if (!adSet.success) {
      throw new Error('Failed to create ad set')
    }

    // Step 3: Create Ad Creative
    const creative = await createAdCreative(
      adAccountId,
      accessToken,
      campaignData.ad_creative
    )

    if (!creative.success) {
      throw new Error('Failed to create ad creative')
    }

    // Step 4: Create Ad
    const ad = await createAd(
      adAccountId,
      accessToken,
      adSet.adset_id,
      creative.creative_id
    )

    if (!ad.success) {
      throw new Error('Failed to create ad')
    }

    // Save campaign to database
    const { data: savedCampaign, error: saveError } = await supabase
      .from('facebook_campaigns')
      .insert({
        user_id: user.id,
        campaign_name: campaignData.campaign_name,
        objective: campaignData.objective,
        target_audience: campaignData.target_audience,
        ad_creative: campaignData.ad_creative,
        budget_type: campaignData.budget.type,
        budget_amount: campaignData.budget.amount,
        currency: campaignData.budget.currency,
        facebook_campaign_id: campaign.campaign_id,
        status: 'active'
      })
      .select()
      .single()

    if (saveError) {
      console.error('Error saving campaign:', saveError)
    }

    // Consume credits
    await supabase.rpc('consume_credits', {
      p_user_id: user.id,
      p_amount: creditsRequired,
      p_module: 'facebook_ads',
      p_description: `Created Facebook campaign: ${campaignData.campaign_name}`
    })

    // Log usage analytics
    await supabase
      .from('usage_analytics')
      .insert({
        user_id: user.id,
        module: 'facebook_ads',
        action: 'create_campaign',
        credits_consumed: creditsRequired,
        success: true,
        metadata: {
          campaign_id: savedCampaign?.id,
          facebook_campaign_id: campaign.campaign_id,
          objective: campaignData.objective,
          budget_amount: campaignData.budget.amount
        }
      })

    return new Response(
      JSON.stringify({
        success: true,
        campaign_id: savedCampaign?.id,
        facebook_campaign_id: campaign.campaign_id,
        facebook_adset_id: adSet.adset_id,
        facebook_ad_id: ad.ad_id,
        credits_used: creditsRequired,
        remaining_credits: userData.credits - creditsRequired
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in facebook-ads-manager:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function createFacebookCampaign(
  adAccountId: string,
  accessToken: string,
  campaignName: string,
  objective: string
) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/act_${adAccountId}/campaigns`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: campaignName,
          objective,
          status: 'ACTIVE',
          access_token: accessToken
        })
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Facebook API error: ${error.error?.message || response.statusText}`)
    }

    const data = await response.json()
    return {
      success: true,
      campaign_id: data.id
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

async function createAdSet(
  adAccountId: string,
  accessToken: string,
  campaignId: string,
  targetAudience: any,
  budget: any
) {
  try {
    const targeting = {
      age_min: targetAudience.age_min,
      age_max: targetAudience.age_max,
      genders: targetAudience.genders,
      geo_locations: {
        countries: targetAudience.countries
      },
      locales: targetAudience.languages,
      interests: targetAudience.interests.map((interest: string) => ({
        name: interest
      }))
    }

    const budgetField = budget.type === 'daily' ? 'daily_budget' : 'lifetime_budget'
    const budgetValue = budget.amount * 100 // Convert to cents

    const response = await fetch(
      `https://graph.facebook.com/v18.0/act_${adAccountId}/adsets`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `AdSet - ${Date.now()}`,
          campaign_id: campaignId,
          [budgetField]: budgetValue,
          billing_event: 'IMPRESSIONS',
          optimization_goal: 'REACH',
          targeting,
          status: 'ACTIVE',
          access_token: accessToken
        })
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Facebook AdSet API error: ${error.error?.message || response.statusText}`)
    }

    const data = await response.json()
    return {
      success: true,
      adset_id: data.id
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

async function createAdCreative(
  adAccountId: string,
  accessToken: string,
  adCreative: any
) {
  try {
    const objectStorySpec = {
      page_id: adCreative.page_id || '',
      link_data: {
        image_url: adCreative.image_url,
        video_id: adCreative.video_url,
        link: adCreative.destination_url,
        message: adCreative.description,
        name: adCreative.title,
        call_to_action: {
          type: adCreative.call_to_action
        }
      }
    }

    const response = await fetch(
      `https://graph.facebook.com/v18.0/act_${adAccountId}/adcreatives`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `Creative - ${Date.now()}`,
          object_story_spec: objectStorySpec,
          access_token: accessToken
        })
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Facebook Creative API error: ${error.error?.message || response.statusText}`)
    }

    const data = await response.json()
    return {
      success: true,
      creative_id: data.id
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

async function createAd(
  adAccountId: string,
  accessToken: string,
  adsetId: string,
  creativeId: string
) {
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/act_${adAccountId}/ads`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `Ad - ${Date.now()}`,
          adset_id: adsetId,
          creative: {
            creative_id: creativeId
          },
          status: 'ACTIVE',
          access_token: accessToken
        })
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Facebook Ad API error: ${error.error?.message || response.statusText}`)
    }

    const data = await response.json()
    return {
      success: true,
      ad_id: data.id
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}