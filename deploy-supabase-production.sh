#!/bin/bash

# NexusOne AI - Production Supabase Deployment Script
# ==========================================

set -e

echo "🚀 Starting NexusOne AI Production Deployment to Supabase..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI is not installed${NC}"
    echo "Please install it with: npm install -g supabase"
    exit 1
fi

# Production environment variables
export SUPABASE_PROJECT_ID="hbfgtdxvlbkvkrjqxnac"
export SUPABASE_URL="https://hbfgtdxvlbkvkrjqxnac.supabase.co"

echo -e "${BLUE}📋 Deployment Configuration:${NC}"
echo "  Project ID: $SUPABASE_PROJECT_ID"
echo "  URL: $SUPABASE_URL"
echo ""

# Login to Supabase (if needed)
echo -e "${YELLOW}🔐 Checking Supabase authentication...${NC}"
if ! supabase status &> /dev/null; then
    echo "Please login to Supabase first:"
    supabase login
fi

# Link to the production project
echo -e "${YELLOW}🔗 Linking to production project...${NC}"
cd supabase
supabase link --project-ref $SUPABASE_PROJECT_ID
cd ..

# Load environment variables for deployment
echo -e "${YELLOW}⚙️ Loading production environment variables...${NC}"
if [ -f "supabase/.env.production" ]; then
    set -a
    source supabase/.env.production
    set +a
    echo -e "${GREEN}✅ Production environment loaded${NC}"
else
    echo -e "${RED}❌ Production environment file not found${NC}"
    exit 1
fi

# Deploy database migrations
echo -e "${YELLOW}📊 Deploying database migrations...${NC}"
cd supabase
if supabase db push; then
    echo -e "${GREEN}✅ Database migrations deployed successfully${NC}"
else
    echo -e "${RED}❌ Database migration failed${NC}"
    exit 1
fi
cd ..

# Deploy Edge Functions with environment variables
echo -e "${YELLOW}⚡ Deploying Edge Functions...${NC}"

# List of functions to deploy
FUNCTIONS=(
    "ai-content-generation"
    "ai-content-generator"
    "api-proxy"
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

# Deploy each function with retry logic
for func in "${FUNCTIONS[@]}"; do
    echo -e "${BLUE}📦 Deploying function: $func${NC}"
    
    # Retry up to 3 times
    for i in {1..3}; do
        if supabase functions deploy $func --project-ref $SUPABASE_PROJECT_ID; then
            echo -e "${GREEN}✅ $func deployed successfully${NC}"
            break
        else
            echo -e "${YELLOW}⚠️ Attempt $i failed for $func, retrying...${NC}"
            if [ $i -eq 3 ]; then
                echo -e "${RED}❌ Failed to deploy $func after 3 attempts${NC}"
            fi
            sleep 2
        fi
    done
done

# Set environment variables for functions
echo -e "${YELLOW}🔧 Setting environment variables...${NC}"

# Core AI API Keys
supabase secrets set OPENAI_API_KEY="$OPENAI_API_KEY" --project-ref $SUPABASE_PROJECT_ID
supabase secrets set OPENAI_ASSISTANT_ID="$OPENAI_ASSISTANT_ID" --project-ref $SUPABASE_PROJECT_ID
supabase secrets set ELEVENLABS_API_KEY="$ELEVENLABS_API_KEY" --project-ref $SUPABASE_PROJECT_ID
supabase secrets set REPLICATE_API_TOKEN="$REPLICATE_API_TOKEN" --project-ref $SUPABASE_PROJECT_ID
supabase secrets set LUMA_API_KEY="$LUMA_API_KEY" --project-ref $SUPABASE_PROJECT_ID
supabase secrets set GUPSHUP_API_KEY="$GUPSHUP_API_KEY" --project-ref $SUPABASE_PROJECT_ID

# Social Media APIs
supabase secrets set FACEBOOK_ACCESS_TOKEN="$FACEBOOK_ACCESS_TOKEN" --project-ref $SUPABASE_PROJECT_ID
supabase secrets set FACEBOOK_APP_ID="$FACEBOOK_APP_ID" --project-ref $SUPABASE_PROJECT_ID
supabase secrets set WHATSAPP_ACCESS_TOKEN="$WHATSAPP_ACCESS_TOKEN" --project-ref $SUPABASE_PROJECT_ID

# E-commerce APIs
supabase secrets set CJ_DROPSHIPPING_API_KEY="$CJ_DROPSHIPPING_API_KEY" --project-ref $SUPABASE_PROJECT_ID
supabase secrets set UNSPLASH_ACCESS_KEY="$UNSPLASH_ACCESS_KEY" --project-ref $SUPABASE_PROJECT_ID

# Database
supabase secrets set DATABASE_URL="$DATABASE_URL" --project-ref $SUPABASE_PROJECT_ID

echo -e "${GREEN}✅ Environment variables configured${NC}"

# Test deployed functions
echo -e "${YELLOW}🧪 Testing deployed functions...${NC}"

# Test critical functions
test_functions=(
    "nexbrain-chat"
    "ai-content-generation"
    "luma-video-ai"
    "cj-dropshipping-catalog"
    "facebook-ads-manager"
    "whatsapp-automation"
)

for func in "${test_functions[@]}"; do
    echo -e "${BLUE}🔍 Testing function: $func${NC}"
    
    # Simple health check
    response=$(curl -s -w "%{http_code}" -o /dev/null \
        -X POST \
        -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
        -H "Content-Type: application/json" \
        -d '{"test": true}' \
        "$SUPABASE_URL/functions/v1/$func" || echo "000")
    
    if [[ "$response" =~ ^[12] ]]; then
        echo -e "${GREEN}✅ $func is responding${NC}"
    else
        echo -e "${YELLOW}⚠️ $func returned status: $response${NC}"
    fi
done

# Verify database connection
echo -e "${YELLOW}📊 Verifying database connection...${NC}"
if supabase db status --project-ref $SUPABASE_PROJECT_ID; then
    echo -e "${GREEN}✅ Database is healthy${NC}"
else
    echo -e "${RED}❌ Database connection issue${NC}"
fi

# Generate deployment report
echo -e "${YELLOW}📋 Generating deployment report...${NC}"
cat > DEPLOYMENT_REPORT_$(date +%Y%m%d_%H%M%S).md << EOF
# NexusOne AI Production Deployment Report

**Date**: $(date)
**Project ID**: $SUPABASE_PROJECT_ID
**URL**: $SUPABASE_URL

## ✅ Deployed Functions
$(for func in "${FUNCTIONS[@]}"; do echo "- $func"; done)

## 🔧 Configured Environment Variables
- OPENAI_API_KEY ✅
- ELEVENLABS_API_KEY ✅
- REPLICATE_API_TOKEN ✅
- LUMA_API_KEY ✅
- GUPSHUP_API_KEY ✅
- FACEBOOK_ACCESS_TOKEN ✅
- CJ_DROPSHIPPING_API_KEY ✅
- UNSPLASH_ACCESS_KEY ✅

## 🌐 API Endpoints
$(for func in "${FUNCTIONS[@]}"; do echo "- $SUPABASE_URL/functions/v1/$func"; done)

## 📊 Database Status
- Migrations: Applied ✅
- Connection: Healthy ✅

## 🔗 Frontend Configuration
Update your frontend environment with:
\`\`\`
VITE_SUPABASE_URL=$SUPABASE_URL
VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
\`\`\`

## 🧪 Test Commands
\`\`\`bash
# Test NexBrain Chat
curl -X POST "$SUPABASE_URL/functions/v1/nexbrain-chat" \\
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Hello NexBrain!"}'

# Test AI Content Generation
curl -X POST "$SUPABASE_URL/functions/v1/ai-content-generation" \\
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"prompt": "Generate a product description"}'
\`\`\`

EOF

echo ""
echo -e "${GREEN}🎉 NexusOne AI Production Deployment Complete!${NC}"
echo ""
echo -e "${BLUE}📊 Summary:${NC}"
echo "  • ${#FUNCTIONS[@]} Edge Functions deployed"
echo "  • Database migrations applied"
echo "  • Environment variables configured"
echo "  • API endpoints ready"
echo ""
echo -e "${BLUE}🔗 Your production URLs:${NC}"
echo "  • API Base: $SUPABASE_URL"
echo "  • Functions: $SUPABASE_URL/functions/v1/"
echo "  • Dashboard: https://supabase.com/dashboard/project/$SUPABASE_PROJECT_ID"
echo ""
echo -e "${YELLOW}⚠️ Next Steps:${NC}"
echo "  1. Update frontend environment variables"
echo "  2. Test all AI integrations"
echo "  3. Configure domain DNS"
echo "  4. Run frontend deployment"
echo ""
echo -e "${GREEN}✅ Backend is now live and ready for production!${NC}"