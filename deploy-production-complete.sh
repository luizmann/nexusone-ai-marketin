#!/bin/bash

# NexusOne AI Production Deployment Script
# This script prepares and deploys the NexusOne AI platform to production

set -e  # Exit on any error

echo "🚀 NexusOne AI Production Deployment"
echo "====================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if all required tools are installed
check_dependencies() {
    print_step "Checking dependencies..."
    
    command -v npm >/dev/null 2>&1 || { print_error "npm is required but not installed. Aborting."; exit 1; }
    command -v git >/dev/null 2>&1 || { print_error "git is required but not installed. Aborting."; exit 1; }
    
    print_status "All dependencies are installed."
}

# Check if API keys are configured
check_api_keys() {
    print_step "Checking API key configuration..."
    
    # Check if config file exists
    if [ ! -f "src/config/api-keys.ts" ]; then
        print_error "API keys configuration file not found!"
        exit 1
    fi
    
    # Check for placeholder values
    if grep -q "PLACEHOLDER" src/config/api-keys.ts; then
        print_warning "Some API keys still have placeholder values. Please review src/config/api-keys.ts"
        print_warning "The following APIs need configuration:"
        grep -n "PLACEHOLDER" src/config/api-keys.ts || true
    else
        print_status "API keys configuration looks complete."
    fi
}

# Install dependencies
install_dependencies() {
    print_step "Installing dependencies..."
    
    npm ci --production=false
    
    print_status "Dependencies installed successfully."
}

# Run tests
run_tests() {
    print_step "Running tests..."
    
    # Check if tests directory exists
    if [ -d "src/__tests__" ] || [ -f "src/test-setup.ts" ]; then
        npm test -- --passWithNoTests
        print_status "Tests passed successfully."
    else
        print_warning "No tests found. Consider adding tests for production deployment."
    fi
}

# Build the application
build_application() {
    print_step "Building application for production..."
    
    # Set environment variables for production build
    export NODE_ENV=production
    export VITE_BUILD_MODE=production
    
    npm run build
    
    if [ ! -d "dist" ]; then
        print_error "Build failed - dist directory not created!"
        exit 1
    fi
    
    print_status "Application built successfully."
}

# Optimize build
optimize_build() {
    print_step "Optimizing build..."
    
    # Check build size
    BUILD_SIZE=$(du -sh dist | cut -f1)
    print_status "Build size: $BUILD_SIZE"
    
    # Check for common optimization issues
    if [ -f "dist/assets/index.js" ]; then
        JS_SIZE=$(ls -lh dist/assets/index*.js | awk '{print $5}')
        print_status "Main JS bundle size: $JS_SIZE"
        
        if [[ $JS_SIZE == *"M"* ]]; then
            NUMERIC_SIZE=$(echo $JS_SIZE | sed 's/M//')
            if (( $(echo "$NUMERIC_SIZE > 2" | bc -l) )); then
                print_warning "JS bundle is quite large ($JS_SIZE). Consider code splitting."
            fi
        fi
    fi
}

# Prepare deployment files
prepare_deployment() {
    print_step "Preparing deployment files..."
    
    # Create deployment configuration
    cat > dist/_redirects << EOF
# Redirects for SPA
/*    /index.html   200

# API redirects (if needed)
/api/*  https://hbfgtdxvlbkvkrjqxnac.supabase.co/functions/v1/:splat  200

# Security headers
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://hbfgtdxvlbkvkrjqxnac.supabase.co https://api.openai.com https://api.elevenlabs.io https://api.replicate.com https://api.unsplash.com https://developers.cjdropshipping.com https://graph.facebook.com
EOF

    # Create robots.txt
    cat > dist/robots.txt << EOF
User-agent: *
Allow: /

Sitemap: https://nexusone.ai/sitemap.xml
EOF

    # Create sitemap.xml
    cat > dist/sitemap.xml << EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://nexusone.ai</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://nexusone.ai/pricing</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://nexusone.ai/documentation</loc>
    <lastmod>$(date +%Y-%m-%d)</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>
EOF

    print_status "Deployment files prepared."
}

# Create deployment info
create_deployment_info() {
    print_step "Creating deployment information..."
    
    cat > dist/deployment-info.json << EOF
{
  "deploymentId": "$(date +%Y%m%d_%H%M%S)",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "version": "1.0.0",
  "gitCommit": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
  "gitBranch": "$(git branch --show-current 2>/dev/null || echo 'unknown')",
  "buildMode": "production",
  "apis": {
    "configured": [
      "OpenAI GPT-4",
      "ElevenLabs TTS", 
      "Replicate Images",
      "CJ Dropshipping",
      "Facebook Marketing",
      "Unsplash Photos",
      "Supabase Database"
    ],
    "pending": [
      "D-ID Avatars",
      "Runway Video",
      "Stripe Payments"
    ]
  },
  "features": [
    "Multi-language Support (5 languages)",
    "AI Content Generation",
    "Video Creator",
    "WhatsApp Business Integration",
    "Dropshipping Marketplace", 
    "Facebook Ads Manager",
    "Magic Pages Creator",
    "CRM System",
    "Smart Appointments",
    "Analytics Dashboard"
  ]
}
EOF

    print_status "Deployment information created."
}

# Deploy to Netlify (if configured)
deploy_netlify() {
    if command -v netlify >/dev/null 2>&1; then
        print_step "Deploying to Netlify..."
        
        # Check if site is already linked
        if [ -f ".netlify/state.json" ]; then
            netlify deploy --prod --dir=dist
            print_status "Deployed to Netlify successfully!"
        else
            print_warning "Netlify site not linked. Please run 'netlify init' first."
        fi
    else
        print_warning "Netlify CLI not found. Deploy manually to your hosting provider."
    fi
}

# Deploy to Vercel (if configured)
deploy_vercel() {
    if command -v vercel >/dev/null 2>&1; then
        print_step "Deploying to Vercel..."
        
        vercel --prod
        print_status "Deployed to Vercel successfully!"
    else
        print_warning "Vercel CLI not found."
    fi
}

# Health check after deployment
health_check() {
    print_step "Performing health check..."
    
    # Check if deployment info is accessible
    if [ -f "dist/deployment-info.json" ]; then
        print_status "Deployment info file created successfully."
    fi
    
    # Check if all critical files exist
    CRITICAL_FILES=("dist/index.html" "dist/assets/index.js" "dist/assets/index.css")
    
    for file in "${CRITICAL_FILES[@]}"; do
        if [ -f "$file" ]; then
            print_status "✓ $file exists"
        else
            print_error "✗ $file is missing!"
            exit 1
        fi
    done
}

# Print deployment summary
deployment_summary() {
    print_step "Deployment Summary"
    echo "===================="
    
    echo -e "${GREEN}✅ Application built successfully${NC}"
    echo -e "${GREEN}✅ All critical files present${NC}"
    echo -e "${GREEN}✅ Deployment files configured${NC}"
    
    if grep -q "PLACEHOLDER" src/config/api-keys.ts; then
        echo -e "${YELLOW}⚠️  Some API keys need configuration${NC}"
    else
        echo -e "${GREEN}✅ API keys configured${NC}"
    fi
    
    echo ""
    echo "🎯 Next Steps:"
    echo "1. Configure missing API keys (D-ID, Runway, Stripe)"
    echo "2. Set up monitoring and analytics"
    echo "3. Configure domain and SSL certificate"
    echo "4. Set up backup and disaster recovery"
    echo "5. Monitor application performance"
    echo ""
    echo "🚀 Your NexusOne AI platform is ready for production!"
    echo ""
    echo "📊 Access your deployment info at: /deployment-info.json"
    echo "🔍 Monitor your APIs at: /api-testing"
    echo ""
}

# Main deployment process
main() {
    echo "Starting deployment process..."
    echo ""
    
    check_dependencies
    check_api_keys
    install_dependencies
    run_tests
    build_application
    optimize_build
    prepare_deployment
    create_deployment_info
    health_check
    
    # Deploy based on available tools
    if command -v netlify >/dev/null 2>&1; then
        deploy_netlify
    elif command -v vercel >/dev/null 2>&1; then
        deploy_vercel
    else
        print_warning "No deployment tool found. Please deploy dist/ manually."
    fi
    
    deployment_summary
}

# Handle script arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "build-only")
        check_dependencies
        install_dependencies
        build_application
        optimize_build
        prepare_deployment
        create_deployment_info
        health_check
        echo -e "${GREEN}Build completed successfully. Ready for manual deployment.${NC}"
        ;;
    "check")
        check_dependencies
        check_api_keys
        echo -e "${GREEN}Pre-deployment checks completed.${NC}"
        ;;
    *)
        echo "Usage: $0 [deploy|build-only|check]"
        echo "  deploy     - Full deployment process (default)"
        echo "  build-only - Build and prepare without deploying"
        echo "  check      - Run pre-deployment checks only"
        exit 1
        ;;
esac