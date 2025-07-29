#!/bin/bash

# NexusOne AI Platform - Quick Netlify Deploy Script
# Run this script to deploy your platform to Netlify

echo "🚀 Starting NexusOne AI Platform deployment..."

# Build the project
echo "📦 Building production version..."
npm run build

echo "✅ Build completed successfully!"

# Instructions for manual deployment
echo ""
echo "📋 NEXT STEPS FOR NETLIFY DEPLOYMENT:"
echo ""
echo "1. Go to https://app.netlify.com/teams/luizmann/projects"
echo "2. Click 'New site from Git'"
echo "3. Connect your GitHub repository"
echo "4. Use these settings:"
echo "   - Build command: npm run build"
echo "   - Publish directory: dist"
echo "   - Node version: 18"
echo ""
echo "5. Add these environment variables in Netlify:"
echo "   VITE_SUPABASE_URL=https://lqcbkqacqgikpucuuhsm.supabase.co"
echo "   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
echo "   VITE_OPENAI_API_KEY=sk-proj-iK3l7-pTvRbXgZKErx4MTjafV3tSCdu1..."
echo "   VITE_REPLICATE_API_TOKEN=r8_HbwQQ4NxMfhVPy0BS0xqOMkERd9B5JM440l66"
echo "   VITE_ELEVENLABS_API_KEY=sk_189b755ede03dfdf1633da77e125d682b44c1ddb54b08a07"
echo "   VITE_LUMA_API_KEY=luma-12423eab-79ee-4f52-ad44-00c485686cf2..."
echo "   VITE_GUPSHUP_API_KEY=sk_d5fe7cdab5164e53bcbffdc428fd431e"
echo "   VITE_CJ_API_KEY=5e0e680914c6462ebcf39059b21e70a9"
echo "   VITE_UNSPLASH_ACCESS_KEY=-zZ5LsB2CAMUhbPca_UKw31ngzc1W3_hfxSPdz_aBUE"
echo ""
echo "6. Deploy and your site will be live at: https://your-site-name.netlify.app"
echo ""
echo "🎉 Your NexusOne AI Platform is ready for global launch!"

# Create a quick setup file for Netlify
cat > netlify-env-vars.txt << EOF
# Copy these environment variables to your Netlify dashboard
VITE_SUPABASE_URL=https://lqcbkqacqgikpucuuhsm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxY2JrcWFjcWdpa3B1Y3V1aHNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4MDQ2MjcsImV4cCI6MjA1MDM4MDYyN30.qrcqjovFtqPYOqTlNJIGSqGULJO8POzFGMhHmJxgfTM
VITE_OPENAI_API_KEY=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
VITE_REPLICATE_API_TOKEN=r8_HbwQQ4NxMfhVPy0BS0xqOMkERd9B5JM440l66
VITE_ELEVENLABS_API_KEY=sk_189b755ede03dfdf1633da77e125d682b44c1ddb54b08a07
VITE_LUMA_API_KEY=luma-12423eab-79ee-4f52-ad44-00c485686cf2-ab1b6b03-15a1-4c76-b056-6765bf41ab05
VITE_GUPSHUP_API_KEY=sk_d5fe7cdab5164e53bcbffdc428fd431e
VITE_CJ_API_KEY=5e0e680914c6462ebcf39059b21e70a9
VITE_UNSPLASH_ACCESS_KEY=-zZ5LsB2CAMUhbPca_UKw31ngzc1W3_hfxSPdz_aBUE
EOF

echo "📝 Environment variables saved to: netlify-env-vars.txt"
echo "📋 All deployment files ready!"