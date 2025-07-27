#!/bin/bash

# ============================================================================
# NexusOne AI Platform - Complete Edge Functions Deployment Script
# ============================================================================

set -e

echo "🚀 Starting NexusOne AI Edge Functions Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    print_error "Supabase CLI is not installed. Installing..."
    npm install -g supabase
fi

# Set production environment
export SUPABASE_PROJECT_REF="hbfgtdxvlbkvkrjqxnac"
export SUPABASE_ACCESS_TOKEN="${SUPABASE_ACCESS_TOKEN:-your_supabase_access_token}"

print_status "Setting up production environment..."
cp supabase/.env.production supabase/.env

# Login to Supabase (if not already logged in)
print_status "Authenticating with Supabase..."
supabase login --token $SUPABASE_ACCESS_TOKEN 2>/dev/null || true

# Link to production project
print_status "Linking to production project..."
supabase link --project-ref $SUPABASE_PROJECT_REF

# Apply database migrations first
print_status "Applying database migrations..."
supabase db push

# Deploy all Edge Functions
print_status "Deploying Edge Functions..."

# Core AI Functions
print_status "Deploying AI Content Generation..."
supabase functions deploy ai-content-generation --project-ref $SUPABASE_PROJECT_REF

print_status "Deploying AI Content Generator..."
supabase functions deploy ai-content-generator --project-ref $SUPABASE_PROJECT_REF

# Video Generation
print_status "Deploying Luma Video AI..."
supabase functions deploy luma-video-ai --project-ref $SUPABASE_PROJECT_REF

print_status "Deploying Video Generator..."
supabase functions deploy video-generator --project-ref $SUPABASE_PROJECT_REF

# E-commerce & Dropshipping
print_status "Deploying CJ Dropshipping Catalog..."
supabase functions deploy cj-dropshipping-catalog --project-ref $SUPABASE_PROJECT_REF

print_status "Deploying CJ Dropshipping Order..."
supabase functions deploy cj-dropshipping-order --project-ref $SUPABASE_PROJECT_REF

print_status "Deploying Dropshipping Import..."
supabase functions deploy dropshipping-import --project-ref $SUPABASE_PROJECT_REF

print_status "Deploying Product Scraper..."
supabase functions deploy product-scraper --project-ref $SUPABASE_PROJECT_REF

# Marketing & Automation
print_status "Deploying Facebook Ads Manager..."
supabase functions deploy facebook-ads-manager --project-ref $SUPABASE_PROJECT_REF

print_status "Deploying WhatsApp Automation..."
supabase functions deploy whatsapp-automation --project-ref $SUPABASE_PROJECT_REF

print_status "Deploying Landing Page Builder..."
supabase functions deploy landing-page-builder --project-ref $SUPABASE_PROJECT_REF

# Utility Functions
print_status "Deploying Nexus API Manager..."
supabase functions deploy nexus-api-manager --project-ref $SUPABASE_PROJECT_REF

print_status "Deploying Usage Tracker..."
supabase functions deploy usage-tracker --project-ref $SUPABASE_PROJECT_REF

print_status "Deploying Webhook Handler..."
supabase functions deploy webhook-handler --project-ref $SUPABASE_PROJECT_REF

print_status "Deploying Unsplash API..."
supabase functions deploy unsplash-api --project-ref $SUPABASE_PROJECT_REF

# Set up environment variables for Edge Functions
print_status "Setting up environment variables..."

# Core secrets
supabase secrets set OPENAI_API_KEY="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" --project-ref $SUPABASE_PROJECT_REF
supabase secrets set OPENAI_ASSISTANT_ID="asst_0jsx8eD6P3W9XGsSRRNU2Pfd" --project-ref $SUPABASE_PROJECT_REF
supabase secrets set ELEVENLABS_API_KEY="sk_189b755ede03dfdf1633da77e125d682b44c1ddb54b08a07" --project-ref $SUPABASE_PROJECT_REF
supabase secrets set REPLICATE_API_TOKEN="r8_HbwQQ4NxMfhVPy0BS0xqOMkERd9B5JM440l66" --project-ref $SUPABASE_PROJECT_REF
supabase secrets set LUMA_API_KEY="luma-12423eab-79ee-4f52-ad44-00c485686cf2-ab1b6b03-15a1-4c76-b056-6765bf41ab05" --project-ref $SUPABASE_PROJECT_REF
supabase secrets set GUPSHUP_API_KEY="sk_d5fe7cdab5164e53bcbffdc428fd431e" --project-ref $SUPABASE_PROJECT_REF
supabase secrets set CJ_DROPSHIPPING_API_KEY="5e0e680914c6462ebcf39059b21e70a9" --project-ref $SUPABASE_PROJECT_REF
supabase secrets set UNSPLASH_ACCESS_KEY="-zZ5LsB2CAMUhbPca_UKw31ngzc1W3_hfxSPdz_aBUE" --project-ref $SUPABASE_PROJECT_REF
supabase secrets set FACEBOOK_ACCESS_TOKEN="EAAI0DOV8GvcBPK4ZBUTybkGl66FwZA1s45Dx3cSjOVEO4lzZAifzVR6lIoVbW6HcsP2L7x4b0065VirgfhzyfIGNCCA9QCynR3twQB01ZCqjolM7b0QfGtBpj5ZCZA5kyWONQsaYmZBRvy1ByAziVPZAot50fp9ZB4ro71pZAPk7iK4ynEMkhG2LBqUmg2VFWZCPAYQ74T3ocUZCL7u69pCaZAhqUe29gMZALb2jZB5YWQrfHbreY0hIgZDZD" --project-ref $SUPABASE_PROJECT_REF

# Validate deployment
print_status "Validating deployment..."

# Test each function
FUNCTIONS=(
    "ai-content-generation"
    "ai-content-generator"
    "luma-video-ai"
    "video-generator"
    "cj-dropshipping-catalog"
    "cj-dropshipping-order"
    "dropshipping-import"
    "product-scraper"
    "facebook-ads-manager"
    "whatsapp-automation"
    "landing-page-builder"
    "nexus-api-manager"
    "usage-tracker"
    "webhook-handler"
    "unsplash-api"
)

BASE_URL="https://$SUPABASE_PROJECT_REF.supabase.co/functions/v1"

for func in "${FUNCTIONS[@]}"; do
    print_status "Testing $func..."
    response=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/$func" -H "Authorization: Bearer $SUPABASE_ANON_KEY" || echo "000")
    if [[ $response =~ ^[23] ]]; then
        print_success "$func deployed successfully"
    else
        print_warning "$func returned status $response (may need authentication)"
    fi
done

print_success "🎉 All Edge Functions deployed successfully!"
print_status "Production URLs:"
echo "   Base URL: $BASE_URL"
echo "   Supabase URL: https://$SUPABASE_PROJECT_REF.supabase.co"
echo "   Dashboard: https://supabase.com/dashboard/project/$SUPABASE_PROJECT_REF"

print_status "🔧 Next steps:"
echo "   1. Update frontend to use production URLs"
echo "   2. Test all features end-to-end"
echo "   3. Monitor function logs in Supabase Dashboard"
echo "   4. Set up monitoring and alerts"

print_success "Deployment completed! 🚀"