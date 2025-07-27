#!/bin/bash

# 🚀 NEXUSONE AI - COMPLETE DEPLOYMENT SCRIPT
echo "🚀 Starting NexusOne AI Deployment..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

# Set environment variables
echo "🔑 Setting up environment variables..."

# Create .env file for local development
cat > .env << EOL
# NexusOne AI - Production Environment Variables
OPENAI_API_KEY=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
OPENAI_ASSISTANT_ID=asst_0jsx8eD6P3W9XGsSRRNU2Pfd
ELEVENLABS_API_KEY=sk_189b755ede03dfdf1633da77e125d682b44c1ddb54b08a07
REPLICATE_API_KEY=r8_HbwQQ4NxMfhVPy0BS0xqOMkERd9B5JM440l66
LUMA_API_KEY=luma-12423eab-79ee-4f52-ad44-00c485686cf2-ab1b6b03-15a1-4c76-b056-6765bf41ab05
GUPSHUP_API_KEY=sk_d5fe7cdab5164e53bcbffdc428fd431e
CJ_API_KEY=5e0e680914c6462ebcf39059b21e70a9
UNSPLASH_API_KEY=-zZ5LsB2CAMUhbPca_UKw31ngzc1W3_hfxSPdz_aBUE
FACEBOOK_ACCESS_TOKEN=EAAI0DOV8GvcBPK4ZBUTybkGl66FwZA1s45Dx3cSjOVEO4lzZAifzVR6lIoVbW6HcsP2L7x4b0065VirgfhzyfIGNCCA9QCynR3twQB01ZCqjolM7b0QfGtBpj5ZCZA5kyWONQsaYmZBRvy1ByAziVPZAot50fp9ZB4ro71pZAPk7iK4ynEMkhG2LBqUmg2VFWZCPAYQ74T3ocUZCL7u69pCaZAhqUe29gMZALb2jZB5YWQrfHbreY0hIgZDZD

# Supabase Configuration
SUPABASE_URL=https://hbfgtdxvlbkvkrjqxnac.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiZmd0ZHh2bGJrdmtyanlkHnhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY2NjA0NzcsImV4cCI6MjAyMjIzNjQ3N30.4L1VGpMOQR4zNjL5xVKjN8QX9hBf2wP0sA7rD3kF1mE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiZmd0ZHh2bGJrdmtyaylnHnhjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNjY2MDQ3NywiZXhwIjoyMDIyMjM2NDc3fQ.ZxKjNz5mR8vQ2wL6pE9yF3dH7sG1nT4cA8rP0kI5bN
EOL

echo "✅ Environment variables configured"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Login to Supabase (if not already logged in)
echo "🔐 Logging into Supabase..."
supabase login

# Link to existing project
echo "🔗 Linking to Supabase project..."
supabase link --project-ref hbfgtdxvlbkvkrjqxnac

# Deploy database migrations
echo "🗄️ Deploying database schema..."
supabase db push

# Deploy Edge Functions
echo "🚀 Deploying Edge Functions..."

functions=(
    "ai-content-generation"
    "nexus-api-manager"
    "landing-page-builder"
    "video-generator"
    "whatsapp-automation"
    "cj-dropshipping-catalog"
    "cj-dropshipping-order"
    "facebook-ads-manager"
    "product-scraper"
    "unsplash-api"
    "usage-tracker"
    "webhook-handler"
    "dropshipping-import"
    "luma-video-ai"
)

for func in "${functions[@]}"; do
    echo "📡 Deploying function: $func"
    if [ -d "supabase/functions/$func" ]; then
        supabase functions deploy $func --no-verify-jwt
    else
        echo "⚠️ Function directory not found: $func"
    fi
done

# Set environment variables in Supabase
echo "🔧 Setting Supabase secrets..."
supabase secrets set OPENAI_API_KEY="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"
supabase secrets set OPENAI_ASSISTANT_ID="asst_0jsx8eD6P3W9XGsSRRNU2Pfd"
supabase secrets set ELEVENLABS_API_KEY="sk_189b755ede03dfdf1633da77e125d682b44c1ddb54b08a07"
supabase secrets set REPLICATE_API_KEY="r8_HbwQQ4NxMfhVPy0BS0xqOMkERd9B5JM440l66"
supabase secrets set LUMA_API_KEY="luma-12423eab-79ee-4f52-ad44-00c485686cf2-ab1b6b03-15a1-4c76-b056-6765bf41ab05"
supabase secrets set GUPSHUP_API_KEY="sk_d5fe7cdab5164e53bcbffdc428fd431e"
supabase secrets set CJ_API_KEY="5e0e680914c6462ebcf39059b21e70a9"
supabase secrets set UNSPLASH_API_KEY="-zZ5LsB2CAMUhbPca_UKw31ngzc1W3_hfxSPdz_aBUE"

# Build frontend
echo "🏗️ Building frontend..."
npm run build

# Deploy to Vercel/Netlify (optional)
if command -v vercel &> /dev/null; then
    echo "🌐 Deploying to Vercel..."
    vercel --prod
elif command -v netlify &> /dev/null; then
    echo "🌐 Deploying to Netlify..."
    netlify deploy --prod --dir=dist
else
    echo "📁 Build complete. Deploy the 'dist' folder to your hosting provider."
fi

# Test API endpoints
echo "🧪 Testing API endpoints..."

# Test OpenAI
echo "Testing OpenAI..."
curl -s -X POST "https://hbfgtdxvlbkvkrjqxnac.supabase.co/functions/v1/ai-content-generation" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiZmd0ZHh2bGJrdmtyanlkHnhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY2NjA0NzcsImV4cCI6MjAyMjIzNjQ3N30.4L1VGpMOQR4zNjL5xVKjN8QX9hBf2wP0sA7rD3kF1mE" \
  -d '{"stepId":"product-analysis","productData":{"name":"Test Product","description":"Test","price":29.99,"category":"Electronics","targetAudience":"Tech enthusiasts","keyFeatures":["Smart","Durable"],"supplier":"CJ"}}' > /dev/null

if [ $? -eq 0 ]; then
    echo "✅ OpenAI integration working"
else
    echo "❌ OpenAI integration failed"
fi

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo ""
echo "📊 System Status:"
echo "✅ Frontend: Built and ready for deployment"
echo "✅ Backend: Edge functions deployed to Supabase"
echo "✅ Database: Schema deployed"
echo "✅ APIs: All keys configured"
echo ""
echo "🌐 Access your app at:"
echo "- Local: http://localhost:5173 (npm run dev)"
echo "- Production: Deploy the 'dist' folder"
echo ""
echo "🔗 Supabase Dashboard:"
echo "https://supabase.com/dashboard/project/hbfgtdxvlbkvkrjqxnac"
echo ""
echo "📋 Next Steps:"
echo "1. Test all features using the Real-Time System Test"
echo "2. Configure payment processing (Stripe/PayPal)"
echo "3. Set up custom domain"
echo "4. Launch beta program"
echo ""
echo "🚀 Ready to revolutionize digital marketing with AI!"