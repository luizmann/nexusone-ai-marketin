#!/bin/bash

# 🚀 NexusOne AI - Production Deployment Script
# Complete automated deployment with validation

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 NexusOne AI - Production Deployment${NC}"
echo "====================================="
echo "Starting automated deployment pipeline..."
echo ""

# Step 1: Environment Validation
echo -e "${BLUE}🔍 Step 1: Environment Validation${NC}"
echo "--------------------------------"

if [ ! -f ".env.production" ]; then
    echo -e "${RED}❌ .env.production file not found!${NC}"
    echo "Please create .env.production with your API keys"
    exit 1
fi

echo -e "${GREEN}✅ Environment file found${NC}"

# Step 2: Dependency Check
echo -e "\n${BLUE}📦 Step 2: Dependency Validation${NC}"
echo "--------------------------------"

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json not found!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Package.json validated${NC}"

# Step 3: API Validation
echo -e "\n${BLUE}🔌 Step 3: API Configuration Check${NC}"
echo "----------------------------------"

# Source environment variables
source .env.production

CRITICAL_APIS=0
OPTIONAL_APIS=0

# Check critical APIs
if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
    echo -e "${RED}❌ Supabase configuration missing${NC}"
    CRITICAL_APIS=$((CRITICAL_APIS + 1))
else
    echo -e "${GREEN}✅ Supabase configured${NC}"
fi

if [ -z "$OPENAI_API_KEY" ] || [ -z "$OPENAI_ASSISTANT_ID" ]; then
    echo -e "${RED}❌ OpenAI configuration missing${NC}"
    CRITICAL_APIS=$((CRITICAL_APIS + 1))
else
    echo -e "${GREEN}✅ OpenAI configured${NC}"
fi

# Check optional APIs
[ -n "$ELEVENLABS_API_KEY" ] && echo -e "${GREEN}✅ ElevenLabs configured${NC}" || echo -e "${YELLOW}⚠️  ElevenLabs not configured${NC}"
[ -n "$REPLICATE_API_TOKEN" ] && echo -e "${GREEN}✅ Replicate configured${NC}" || echo -e "${YELLOW}⚠️  Replicate not configured${NC}"
[ -n "$LUMA_API_KEY" ] && echo -e "${GREEN}✅ Luma AI configured${NC}" || echo -e "${YELLOW}⚠️  Luma AI not configured${NC}"
[ -n "$GUPSHUP_API_KEY" ] && echo -e "${GREEN}✅ Gupshup WhatsApp configured${NC}" || echo -e "${YELLOW}⚠️  Gupshup not configured${NC}"
[ -n "$CJ_API_KEY" ] && echo -e "${GREEN}✅ CJ Dropshipping configured${NC}" || echo -e "${YELLOW}⚠️  CJ Dropshipping not configured${NC}"
[ -n "$FACEBOOK_ACCESS_TOKEN" ] && echo -e "${GREEN}✅ Facebook API configured${NC}" || echo -e "${YELLOW}⚠️  Facebook API not configured${NC}"

if [ $CRITICAL_APIS -gt 0 ]; then
    echo -e "\n${RED}❌ Critical API configuration missing! Cannot deploy.${NC}"
    echo "Please configure the missing APIs in .env.production"
    exit 1
fi

echo -e "\n${GREEN}✅ API configuration validated${NC}"

# Step 4: Build Process
echo -e "\n${BLUE}🔨 Step 4: Building Application${NC}"
echo "------------------------------"

echo "Installing dependencies..."
npm ci --only=production

echo "Building application..."
npm run build:prod

if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Build failed - dist directory not created${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Application built successfully${NC}"
echo "Build size: $(du -sh dist | cut -f1)"

# Step 5: Security Check
echo -e "\n${BLUE}🔒 Step 5: Security Validation${NC}"
echo "-----------------------------"

# Check for exposed secrets in build
if grep -r "sk-" dist/ 2>/dev/null || grep -r "eyJ" dist/ 2>/dev/null; then
    echo -e "${RED}❌ Potential secrets found in build files!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Security validation passed${NC}"

# Step 6: Deployment Summary
echo -e "\n${BLUE}📋 Step 6: Deployment Summary${NC}"
echo "----------------------------"

echo "Deployment Configuration:"
echo "• Environment: Production"
echo "• Build size: $(du -sh dist | cut -f1)"
echo "• Supabase: $([ -n "$VITE_SUPABASE_URL" ] && echo "Configured" || echo "Missing")"
echo "• OpenAI: $([ -n "$OPENAI_API_KEY" ] && echo "Configured" || echo "Missing")"
echo "• Video Generation: $([ -n "$LUMA_API_KEY" ] && echo "Enabled" || echo "Disabled")"
echo "• WhatsApp: $([ -n "$GUPSHUP_API_KEY" ] && echo "Enabled" || echo "Disabled")"
echo "• Dropshipping: $([ -n "$CJ_API_KEY" ] && echo "Enabled" || echo "Disabled")"

# Step 7: Deployment Instructions
echo -e "\n${BLUE}🚀 Step 7: Deployment Ready${NC}"
echo "---------------------------"

echo -e "${GREEN}✅ All validations passed!${NC}"
echo ""
echo "Next steps for deployment:"
echo ""
echo "1. Deploy to Netlify:"
echo "   npm run deploy:netlify"
echo ""
echo "2. Deploy to Vercel:"
echo "   npm run deploy:vercel"
echo ""
echo "3. Manual deployment:"
echo "   • Upload the 'dist' folder to your hosting provider"
echo "   • Configure environment variables on your platform"
echo "   • Set up custom domain and SSL certificate"
echo ""
echo "4. Post-deployment checklist:"
echo "   • Test all API integrations"
echo "   • Verify user registration and login"
echo "   • Test payment processing (if configured)"
echo "   • Monitor application logs"
echo "   • Set up monitoring and alerts"

# Step 8: Health Check URL
echo -e "\n${BLUE}🔍 Step 8: Health Check Information${NC}"
echo "--------------------------------"

echo "After deployment, verify these endpoints:"
echo "• Main application: https://your-domain.com"
echo "• Health check: https://your-domain.com/health"
echo "• API status: Check the dashboard for API connectivity"

echo -e "\n${GREEN}🎉 Deployment preparation completed successfully!${NC}"
echo "Ready for production deployment."