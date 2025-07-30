#!/bin/bash




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
    "save-api-config"
    "unsplash-api"
    "video-generato
    "whatsapp-automatio

for func in "${FUNCTI
    
    for i in {1..3
            echo -e
        else
            if [ $i -
            fi
 

# Set environment variables for functio

supabase secrets set OPENAI_API_KEY="$OPENAI_API_KEY" 
supa
supabase secrets set LUMA

supabase secrets set FACEBOOK_ACCESS_TOKEN="$FACEBOOK_ACCESS_TOKEN" --project-ref $
supabase secrets set WHATSAPP_ACCESS_TOKEN="$WHATSAPP_ACCESS_TOK
# E-commerce APIs
supabase sec
# Database


echo -e "${YEL
# Test critical fun
    "nexbr
    "lum
    

for func in "${test_functions[@]}"; do
    

        -H "Author
        -d '{"test": true}' \
    
        echo -e "${GREEN}✅ $func is responding${NC}"
        echo -e "${YELLOW}⚠️ $func returned status: $response${NC}"
done
# Verify database connection

else
fi
# Generate deployment report
cat > DEPLOYMENT_REPORT_$(date +%Y%m%d_%H%M%S).md << EOF

**Project ID**: $

$(for func in "${FUNCTIONS[@]}"; do echo "- $func"; done)

- ELEVENLA
- LUMA_API_KEY ✅

- UNSPLASH_ACCESS_KEY ✅


- Migrations: Applied ✅

Update your frontend envi
VITE_SUPABASE_UR
\`\`\`
## 🧪 Test Commands
# Test NexBrain Cha
  -H "Authorization: Bearer $
  -d '{"message": "Hello N
# Test AI Content Generat
 



echo
echo -e "${BLUE}📊 Summar
echo "  • Database migrations applied"
echo "  • API end
echo -e "${BLUE}🔗 Your production URLs:${NC}"
echo "  • Functions: $SUPABASE_URL/functions/
echo ""
echo "  1. Update frontend environment variables"
echo
echo ""























































































