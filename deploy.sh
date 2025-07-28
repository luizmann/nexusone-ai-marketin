#!/bin/bash

# NexusOne AI - Production Deployment Script
echo "🚀 Starting NexusOne AI Deployment..."

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

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    if ! command -v supabase &> /dev/null; then
        print_warning "Supabase CLI not found. Installing..."
        npm install -g supabase
    fi
    
    print_success "Dependencies checked"
}

# Build the application
build_app() {
    print_status "Building application..."
    
    # Install dependencies
    npm install
    
    # Type check
    npm run type-check
    
    # Build
    npm run build
    
    print_success "Application built successfully"
}

# Deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    # Deploy to Vercel
    vercel --prod --yes
    
    print_success "Deployed to Vercel"
}

# Deploy Supabase Edge Functions
deploy_supabase() {
    print_status "Deploying Supabase Edge Functions..."
    
    # Create functions directory if it doesn't exist
    mkdir -p supabase/functions
    
    # Deploy all edge functions
    FUNCTIONS=(
        "ai-campaign-generator"
        "ai-content-generator"
        "ai-video-generator"
        "cj-dropshipping-catalog"
        "cj-dropshipping-order"
        "dropshipping-import"
        "facebook-ads-manager"
        "generate-income"
        "magic-pages-generator"
        "nexbrain-assistant"
        "product-scraper"
        "whatsapp-automation"
        "user-analytics"
        "payment-processor"
        "image-generator"
        "video-creator"
        "landing-page-builder"
        "campaign-optimizer"
        "lead-manager"
        "notification-service"
    )
    
    for func in "${FUNCTIONS[@]}"; do
        print_status "Deploying function: $func"
        supabase functions deploy $func --no-verify-jwt
    done
    
    print_success "Supabase Edge Functions deployed"
}

# Set environment variables
setup_env() {
    print_status "Setting up environment variables..."
    
    # Check if .env.local exists
    if [ ! -f .env.local ]; then
        print_warning ".env.local not found. Creating from .env.example..."
        cp .env.example .env.local
        print_warning "Please update .env.local with your actual API keys"
    fi
    
    # Set Vercel environment variables
    vercel env add VITE_SUPABASE_URL production
    vercel env add VITE_SUPABASE_ANON_KEY production
    vercel env add OPENAI_API_KEY production
    vercel env add OPENAI_ASSISTANT_ID production
    vercel env add ELEVENLABS_API_KEY production
    vercel env add REPLICATE_API_TOKEN production
    vercel env add LUMA_API_KEY production
    vercel env add GUPSHUP_API_KEY production
    vercel env add CJ_DROPSHIPPING_API_KEY production
    vercel env add FACEBOOK_ACCESS_TOKEN production
    vercel env add UNSPLASH_ACCESS_KEY production
    
    print_success "Environment variables configured"
}

# Verify deployment
verify_deployment() {
    print_status "Verifying deployment..."
    
    # Get deployment URL
    DEPLOYMENT_URL=$(vercel --prod --confirm)
    
    # Test if the site is accessible
    if curl -f -s "$DEPLOYMENT_URL" > /dev/null; then
        print_success "Deployment is accessible at: $DEPLOYMENT_URL"
    else
        print_error "Deployment verification failed"
        exit 1
    fi
}

# Main deployment function
main() {
    echo "🚀 NexusOne AI - Production Deployment"
    echo "======================================"
    
    check_dependencies
    build_app
    setup_env
    deploy_vercel
    deploy_supabase
    verify_deployment
    
    echo ""
    echo "🎉 Deployment completed successfully!"
    echo "📱 Your NexusOne AI platform is now live"
    echo ""
    echo "Next steps:"
    echo "1. Configure your domain in Vercel dashboard"
    echo "2. Set up SSL certificate"
    echo "3. Configure your custom domain DNS"
    echo "4. Test all features with production API keys"
    echo "5. Set up monitoring and analytics"
    echo ""
    print_success "Happy selling! 💰"
}

# Run main function
main "$@"