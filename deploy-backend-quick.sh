#!/bin/bash
# Quick Supabase Edge Functions Deployment

echo "🚀 Deploying NexusOne AI Edge Functions to Supabase..."

# Set project reference
PROJECT_REF="hbfgtdxvlbkvkrjqxnac"

# Link to project
supabase link --project-ref $PROJECT_REF

# Deploy all Edge Functions
echo "📦 Deploying Edge Functions..."

supabase functions deploy ai-content-generator
supabase functions deploy ai-video-generator  
supabase functions deploy whatsapp-smart-booking
supabase functions deploy facebook-ads-automation
supabase functions deploy cj-dropshipping-import
supabase functions deploy magic-page-builder
supabase functions deploy campaign-optimizer
supabase functions deploy lead-scorer
supabase functions deploy nexbrain-assistant
supabase functions deploy product-scraper
supabase functions deploy image-generator
supabase functions deploy video-creator-luma
supabase functions deploy whatsapp-gupshup
supabase functions deploy facebook-campaign-creator
supabase functions deploy dropshipping-fulfillment
supabase functions deploy ai-copywriter
supabase functions deploy landing-page-generator
supabase functions deploy crm-automation
supabase functions deploy analytics-processor
supabase functions deploy user-onboarding

echo "✅ All Edge Functions deployed successfully!"

# Set API secrets
echo "🔑 Setting API secrets..."

supabase secrets set OPENAI_API_KEY=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

supabase secrets set ELEVENLABS_API_KEY=sk_189b755ede03dfdf1633da77e125d682b44c1ddb54b08a07

supabase secrets set REPLICATE_API_TOKEN=r8_HbwQQ4NxMfhVPy0BS0xqOMkERd9B5JM440l66

supabase secrets set GUPSHUP_API_KEY=sk_d5fe7cdab5164e53bcbffdc428fd431e

supabase secrets set LUMA_API_KEY=luma-12423eab-79ee-4f52-ad44-00c485686cf2-ab1b6b03-15a1-4c76-b056-6765bf41ab05

supabase secrets set CJ_API_KEY=5e0e680914c6462ebcf39059b21e70a9

supabase secrets set FACEBOOK_ACCESS_TOKEN=EAAI0DOV8GvcBPK4ZBUTybkGl66FwZA1s45Dx3cSjOVEO4lzZAifzVR6lIoVbW6HcsP2L7x4b0065VirgfhzyfIGNCCA9QCynR3twQB01ZCqjolM7b0QfGtBpj5ZCZA5kyWONQsaYmZBRvy1ByAziVPZAot50fp9ZB4ro71pZAPk7iK4ynEMkhG2LBqUmg2VFWZCPAYQ74T3ocUZCL7u69pCaZAhqUe29gMZALb2jZB5YWQrfHbreY0hIgZDZD

supabase secrets set UNSPLASH_ACCESS_KEY=zZ5LsB2CAMUhbPca_UKw31ngzc1W3_hfxSPdz_aBUE

supabase secrets set NEXBRAIN_ASSISTANT_ID=asst_0jsx8eD6P3W9XGsSRRNU2Pfd

echo "✅ API secrets configured!"

# Test deployment
echo "🔍 Testing deployment..."
supabase functions list

echo "🎉 Backend deployment complete!"
echo "📊 Database URL: https://hbfgtdxvlbkvkrjqxnac.supabase.co"
echo "🔧 Functions URL: https://hbfgtdxvlbkvkrjqxnac.supabase.co/functions/v1"