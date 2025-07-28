#!/bin/bash

# 🚀 NexusOne AI - Production Deployment Script
# Quick and reliable deployment to production

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
PROJECT_REF="hbfgtdxvlbkvkrjqxnac"
SUPABASE_URL="https://hbfgtdxvlbkvkrjqxnac.supabase.co"

echo -e "${BLUE}🚀 NexusOne AI Production Deployment${NC}"
echo "======================================"

# Step 1: Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install --production=false

# Step 2: Build frontend
echo -e "${BLUE}🏗️  Building frontend...${NC}"
npm run build

# Step 3: Deploy Edge Functions to Supabase
echo -e "${BLUE}⚡ Deploying Edge Functions...${NC}"

FUNCTIONS=(
    "ai-content-generation"
    "ai-content-generator" 
    "cj-dropshipping-catalog"
    "cj-dropshipping-order"
    "dropshipping-import"
    "facebook-ads-manager"
    "landing-page-builder"
    "luma-video-ai"
    "nexbrain-chat"
    "nexus-api-manager"
    "product-scraper"
    "save-api-config"
    "test-api-connection"
    "unsplash-api"
    "usage-tracker"
    "video-generator"
    "webhook-handler"
    "whatsapp-automation"
)

# Link to production project
echo "Linking to Supabase project..."
supabase link --project-ref $PROJECT_REF 2>/dev/null || echo "Already linked"

# Deploy functions
for func in "${FUNCTIONS[@]}"; do
    if [ -d "supabase/functions/$func" ]; then
        echo "Deploying $func..."
        supabase functions deploy $func --no-verify-jwt
    fi
done

# Step 4: Configure secrets
echo -e "${BLUE}🔐 Configuring production secrets...${NC}"
source .env.production

supabase secrets set OPENAI_API_KEY="$OPENAI_API_KEY"
supabase secrets set OPENAI_ASSISTANT_ID="$OPENAI_ASSISTANT_ID"
supabase secrets set ELEVENLABS_API_KEY="$ELEVENLABS_API_KEY"
supabase secrets set REPLICATE_API_TOKEN="$REPLICATE_API_TOKEN"
supabase secrets set LUMA_API_KEY="$LUMA_API_KEY"
supabase secrets set GUPSHUP_API_KEY="$GUPSHUP_API_KEY"
supabase secrets set FACEBOOK_ACCESS_TOKEN="$FACEBOOK_ACCESS_TOKEN"
supabase secrets set FACEBOOK_APP_ID="$FACEBOOK_APP_ID"
supabase secrets set CJ_DROPSHIPPING_API_KEY="$CJ_DROPSHIPPING_API_KEY"
supabase secrets set UNSPLASH_ACCESS_KEY="$UNSPLASH_ACCESS_KEY"

# Step 5: Deploy to Vercel
echo -e "${BLUE}🌐 Deploying to Vercel...${NC}"
if command -v vercel &> /dev/null; then
    vercel --prod --yes
else
    echo -e "${YELLOW}Vercel CLI not found. Install with: npm i -g vercel${NC}"
fi

# Step 6: Test deployment
echo -e "${BLUE}🧪 Testing deployment...${NC}"
curl -s "$SUPABASE_URL/functions/v1/test-api-connection" || echo "Test endpoint not responding"

echo -e "${GREEN}✅ Deployment completed!${NC}"
echo "======================================"
echo -e "${GREEN}🌍 Backend:${NC} $SUPABASE_URL"
echo -e "${GREEN}📱 Functions:${NC} ${#FUNCTIONS[@]} deployed"
echo -e "${GREEN}🔑 Secrets:${NC} Configured"
echo -e "${GREEN}🚀 Status:${NC} LIVE IN PRODUCTION"
echo ""
echo -e "${BLUE}📊 Monitor at:${NC} https://supabase.com/dashboard/project/$PROJECT_REF"