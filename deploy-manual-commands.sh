#!/bin/bash

# NexusOne AI - Simple Edge Functions Deployment
# Execute these commands manually in your terminal

echo "🚀 NexusOne AI Platform - Manual Deployment Commands"
echo "Copy and paste these commands one by one in your terminal:"
echo ""

echo "# 1. Install Supabase CLI (if not installed)"
echo 'curl -s https://cli.supabase.com/install.sh | bash'
echo 'export PATH=$PATH:~/.local/bin'
echo ""

echo "# 2. Login to Supabase"
echo 'supabase login'
echo ""

echo "# 3. Link to your project"
echo 'supabase link --project-ref hbfgtdxvlbkvkrjqxnac'
echo ""

echo "# 4. Deploy database migrations"
echo 'supabase db push'
echo ""

echo "# 5. Deploy Edge Functions (20 functions)"
echo 'supabase functions deploy ai-content-generation --no-verify-jwt'
echo 'supabase functions deploy ai-content-generator --no-verify-jwt'
echo 'supabase functions deploy api-proxy --no-verify-jwt'
echo 'supabase functions deploy cj-dropshipping-catalog --no-verify-jwt'
echo 'supabase functions deploy cj-dropshipping-order --no-verify-jwt'
echo 'supabase functions deploy dropshipping-import --no-verify-jwt'
echo 'supabase functions deploy facebook-ads-manager --no-verify-jwt'
echo 'supabase functions deploy landing-page-builder --no-verify-jwt'
echo 'supabase functions deploy luma-video-ai --no-verify-jwt'
echo 'supabase functions deploy nexbrain-chat --no-verify-jwt'
echo 'supabase functions deploy nexus-api-manager --no-verify-jwt'
echo 'supabase functions deploy product-scraper --no-verify-jwt'
echo 'supabase functions deploy save-api-config --no-verify-jwt'
echo 'supabase functions deploy test-api-connection --no-verify-jwt'
echo 'supabase functions deploy unsplash-api --no-verify-jwt'
echo 'supabase functions deploy usage-tracker --no-verify-jwt'
echo 'supabase functions deploy video-generator --no-verify-jwt'
echo 'supabase functions deploy webhook-handler --no-verify-jwt'
echo 'supabase functions deploy whatsapp-automation --no-verify-jwt'
echo ""

echo "# 6. Set API Secrets"
echo 'supabase secrets set OPENAI_API_KEY="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"'
echo 'supabase secrets set OPENAI_ASSISTANT_ID="asst_0jsx8eD6P3W9XGsSRRNU2Pfd"'
echo 'supabase secrets set ELEVENLABS_API_KEY="sk_189b755ede03dfdf1633da77e125d682b44c1ddb54b08a07"'
echo 'supabase secrets set REPLICATE_API_TOKEN="r8_HbwQQ4NxMfhVPy0BS0xqOMkERd9B5JM440l66"'
echo 'supabase secrets set LUMA_API_KEY="luma-12423eab-79ee-4f52-ad44-00c485686cf2-ab1b6b03-15a1-4c76-b056-6765bf41ab05"'
echo 'supabase secrets set GUPSHUP_API_KEY="sk_d5fe7cdab5164e53bcbffdc428fd431e"'
echo 'supabase secrets set FACEBOOK_ACCESS_TOKEN="EAAI0DOV8GvcBPK4ZBUTybkGl66FwZA1s45Dx3cSjOVEO4lzZAifzVR6lIoVbW6HcsP2L7x4b0065VirgfhzyfIGNCCA9QCynR3twQB01ZCqjolM7b0QfGtBpj5ZCZA5kyWONQsaYmZBRvy1ByAziVPZAot50fp9ZB4ro71pZAPk7iK4ynEMkhG2LBqUmg2VFWZCPAYQ74T3ocUZCL7u69pCaZAhqUe29gMZALb2jZB5YWQrfHbreY0hIgZDZD"'
echo 'supabase secrets set FACEBOOK_APP_ID="892734585139740"'
echo 'supabase secrets set CJ_DROPSHIPPING_API_KEY="5e0e680914c6462ebcf39059b21e70a9"'
echo 'supabase secrets set UNSPLASH_ACCESS_KEY="-zZ5LsB2CAMUhbPca_UKw31ngzc1W3_hfxSPdz_aBUE"'
echo ""

echo "# 7. Test deployment"
echo 'curl -X GET "https://hbfgtdxvlbkvkrjqxnac.supabase.co/functions/v1/test-api-connection" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiZmd0ZHh2bGJrdmtyanh4bmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ2NzI4MDAsImV4cCI6MjAyMDI0ODgwMH0.XYKhOW-Q5kz9O2P7vX1cFm3d8jR6sN0tA9wK4eL7mGp"'
echo ""

echo "🎉 Deployment Complete! Your NexusOne AI Platform is ready for production!"
echo ""
echo "📊 Production URLs:"
echo "Project: https://hbfgtdxvlbkvkrjqxnac.supabase.co"
echo "Functions: https://hbfgtdxvlbkvkrjqxnac.supabase.co/functions/v1"
echo "Dashboard: https://supabase.com/dashboard/project/hbfgtdxvlbkvkrjqxnac"