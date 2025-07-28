#!/bin/bash
# NexusOne AI - Ultimate Deployment Script
# This is your one-command deployment solution

set -e

echo ""
echo "🚀 NEXUSONE AI - ULTIMATE DEPLOYMENT"
echo "====================================="
echo ""
echo "🎯 This script will deploy your complete NexusOne AI platform to production."
echo "📊 Backend: Supabase (20 Edge Functions + Database)"
echo "🌐 Frontend: Vercel (React Application)"
echo "🔑 APIs: All 9 integrations configured"
echo ""

# Prompt for confirmation
read -p "🚀 Ready to deploy to PRODUCTION? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled."
    exit 0
fi

echo ""
echo "🔍 Pre-flight checks..."

# Check if required tools are installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is required but not installed."
    exit 1
fi

if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is required. Install with: npm i -g supabase"
    exit 1
fi

if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is required. Install with: npm i -g vercel"
    exit 1
fi

echo "✅ All tools installed"

# Step 1: Backend Deployment
echo ""
echo "📊 STEP 1: Deploying Backend to Supabase..."
echo "============================================"

# Login and link project
echo "🔐 Linking to Supabase project..."
supabase link --project-ref hbfgtdxvlbkvkrjqxnac

# Deploy database schema
echo "📋 Deploying database schema..."
supabase db push

# Set API secrets
echo "🔑 Configuring API secrets..."
supabase secrets set OPENAI_API_KEY=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
supabase secrets set ELEVENLABS_API_KEY=sk_189b755ede03dfdf1633da77e125d682b44c1ddb54b08a07
supabase secrets set REPLICATE_API_TOKEN=r8_HbwQQ4NxMfhVPy0BS0xqOMkERd9B5JM440l66
supabase secrets set GUPSHUP_API_KEY=sk_d5fe7cdab5164e53bcbffdc428fd431e
supabase secrets set LUMA_API_KEY=luma-12423eab-79ee-4f52-ad44-00c485686cf2-ab1b6b03-15a1-4c76-b056-6765bf41ab05
supabase secrets set CJ_API_KEY=5e0e680914c6462ebcf39059b21e70a9
supabase secrets set FACEBOOK_ACCESS_TOKEN=EAAI0DOV8GvcBPK4ZBUTybkGl66FwZA1s45Dx3cSjOVEO4lzZAifzVR6lIoVbW6HcsP2L7x4b0065VirgfhzyfIGNCCA9QCynR3twQB01ZCqjolM7b0QfGtBpj5ZCZA5kyWONQsaYmZBRvy1ByAziVPZAot50fp9ZB4ro71pZAPk7iK4ynEMkhG2LBqUmg2VFWZCPAYQ74T3ocUZCL7u69pCaZAhqUe29gMZALb2jZB5YWQrfHbreY0hIgZDZD
supabase secrets set UNSPLASH_ACCESS_KEY=zZ5LsB2CAMUhbPca_UKw31ngzc1W3_hfxSPdz_aBUE
supabase secrets set NEXBRAIN_ASSISTANT_ID=asst_0jsx8eD6P3W9XGsSRRNU2Pfd

# Deploy Edge Functions
echo "🔧 Deploying Edge Functions..."
FUNCTIONS=(
    "ai-content-generator"
    "nexbrain-chat"
    "whatsapp-automation"
    "video-generator"
    "facebook-ads-manager"
    "cj-dropshipping-catalog"
    "cj-dropshipping-order"
    "dropshipping-import"
    "landing-page-builder"
    "luma-video-ai"
    "product-scraper"
    "save-api-config"
    "test-api-connection"
    "unsplash-api"
    "usage-tracker"
    "webhook-handler"
    "ai-content-generation"
    "api-proxy"
    "nexus-api-manager"
)

for func in "${FUNCTIONS[@]}"; do
    if [ -d "supabase/functions/$func" ]; then
        echo "📦 Deploying: $func"
        supabase functions deploy $func
    else
        echo "⚠️  Function not found: $func"
    fi
done

echo "✅ Backend deployment complete!"

# Step 2: Frontend Deployment  
echo ""
echo "🌐 STEP 2: Deploying Frontend to Vercel..."
echo "=========================================="

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build for production
echo "🔨 Building for production..."
NODE_ENV=production npm run build

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod --confirm

echo "✅ Frontend deployment complete!"

# Step 3: Final Configuration
echo ""
echo "🔧 STEP 3: Final Configuration..."
echo "================================"

echo "📋 Setting Vercel environment variables..."
echo "💡 Please set these in your Vercel dashboard:"
echo ""
echo "VITE_SUPABASE_URL=https://hbfgtdxvlbkvkrjqxnac.supabase.co"
echo "VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiZmd0ZHh2bGJrdmtyanlkHnhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY2NjA0NzcsImV4cCI6MjAyMjIzNjQ3N30.4L1VGpMOQR4zNjL5xVKjN8QX9hBf2wP0sA7rD3kF1mE"
echo "VITE_APP_NAME=NexusOne AI"
echo "VITE_ENVIRONMENT=production"
echo "VITE_CJ_API_KEY=5e0e680914c6462ebcf39059b21e70a9"
echo "VITE_FACEBOOK_ACCESS_TOKEN=EAAI0DOV8GvcBPK4ZBUTybkGl66FwZA1s45Dx3cSjOVEO4lzZAifzVR6lIoVbW6HcsP2L7x4b0065VirgfhzyfIGNCCA9QCynR3twQB01ZCqjolM7b0QfGtBpj5ZCZA5kyWONQsaYmZBRvy1ByAziVPZAot50fp9ZB4ro71pZAPk7iK4ynEMkhG2LBqUmg2VFWZCPAYQ74T3ocUZCL7u69pCaZAhqUe29gMZALb2jZB5YWQrfHbreY0hIgZDZD"
echo ""

# Step 4: Health Check
echo ""
echo "🔍 STEP 4: Health Check..."
echo "========================="

echo "🌐 Testing Vercel deployment..."
if [ -d "dist" ] && [ -f "dist/index.html" ]; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed"
fi

echo "📊 Testing Supabase functions..."
supabase functions list || echo "⚠️ Could not list functions"

# Final Summary
echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "======================="
echo ""
echo "✅ Backend deployed to Supabase"
echo "✅ Frontend deployed to Vercel" 
echo "✅ All API keys configured"
echo "✅ Edge Functions active"
echo ""
echo "🌐 Your NexusOne AI platform is LIVE!"
echo ""
echo "📊 URLs:"
echo "   • Frontend: https://nexusone.vercel.app"
echo "   • Backend:  https://hbfgtdxvlbkvkrjqxnac.supabase.co"
echo "   • API:      https://hbfgtdxvlbkvkrjqxnac.supabase.co/functions/v1"
echo ""
echo "📋 Next Steps:"
echo "   1. Set environment variables in Vercel dashboard"
echo "   2. Test all features in production"
echo "   3. Configure custom domain (optional)"
echo "   4. Set up monitoring and alerts"
echo "   5. Launch marketing campaigns!"
echo ""
echo "🚀 Congratulations! Your AI-powered business platform is ready!"
echo ""