#!/bin/bash

# NexusOneAI Deployment Script for Vercel
# This script handles the complete deployment process

set -e

echo "🚀 Starting NexusOneAI deployment to Vercel..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI is not installed. Installing...${NC}"
    npm install -g vercel
fi

# Check if environment file exists
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚠️  .env.local file not found. Creating template...${NC}"
    cat > .env.local << EOF
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# AI API Keys
VITE_OPENAI_API_KEY=sk-proj-your-openai-key
VITE_LUMA_API_KEY=luma-your-luma-key
VITE_RUNWAY_API_KEY=your-runway-key
VITE_REPLICATE_API_KEY=r8_your-replicate-key
VITE_ELEVENLABS_API_KEY=sk_your-elevenlabs-key
VITE_DID_API_KEY=your-did-key

# Marketing APIs
VITE_GUPSHUP_API_KEY=your-gupshup-key
VITE_FACEBOOK_ACCESS_TOKEN=your-facebook-token
VITE_CJ_API_KEY=your-cj-dropshipping-key

# Optional APIs
VITE_UNSPLASH_ACCESS_KEY=your-unsplash-key
VITE_PEXELS_API_KEY=your-pexels-key
EOF
    echo -e "${YELLOW}⚠️  Please update .env.local with your actual API keys before deploying!${NC}"
    exit 1
fi

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install

# Type check
echo -e "${BLUE}🔍 Running type check...${NC}"
npm run typecheck

# Build the project
echo -e "${BLUE}🏗️  Building project...${NC}"
npm run build

# Deploy to Vercel
echo -e "${BLUE}🚀 Deploying to Vercel...${NC}"
vercel --prod

# Check if Supabase CLI is available for edge functions
if command -v supabase &> /dev/null; then
    echo -e "${BLUE}⚡ Deploying Supabase Edge Functions...${NC}"
    
    # List of edge functions to deploy
    FUNCTIONS=(
        "nexbrain-chat"
        "generate-magic-page"
        "generate-video"
        "create-facebook-campaign"
        "connect-whatsapp"
        "cj-dropshipping-catalog"
        "cj-dropshipping-order"
        "deduct-credits"
        "get-analytics"
        "process-webhook"
        "image-generation"
        "voice-synthesis"
        "dropshipping-import"
        "campaign-optimizer"
        "lead-scoring"
        "automated-responses"
        "performance-tracker"
        "content-generator"
        "audience-analyzer"
        "conversion-optimizer"
    )
    
    # Deploy each function
    for func in "${FUNCTIONS[@]}"; do
        if [ -d "supabase/functions/$func" ]; then
            echo -e "${YELLOW}📡 Deploying function: $func${NC}"
            supabase functions deploy $func --project-ref ${SUPABASE_PROJECT_REF:-your-project-ref}
        fi
    done
else
    echo -e "${YELLOW}⚠️  Supabase CLI not found. Skipping edge function deployment.${NC}"
    echo -e "${YELLOW}   Install with: npm i supabase --save-dev${NC}"
fi

# Success message
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${GREEN}🌍 Your NexusOneAI platform is now live!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Update your domain in Supabase Auth settings"
echo "2. Configure your production API keys in Vercel dashboard"
echo "3. Set up monitoring and analytics"
echo "4. Test all AI integrations"
echo ""
echo -e "${BLUE}🔗 Useful Links:${NC}"
echo "• Vercel Dashboard: https://vercel.com/dashboard"
echo "• Supabase Dashboard: https://app.supabase.com/"
echo "• Production URL: Check Vercel deployment output above"
echo ""
echo -e "${GREEN}🎉 Happy launching!${NC}"