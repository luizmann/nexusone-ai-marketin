#!/bin/bash

# 🚀 NexusOne AI - Simple Production Deployment
# Deploy your platform in 5 minutes!

set -e

echo "🚀 NexusOne AI - Quick Deploy Starting..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check dependencies
echo -e "${BLUE}🔍 Checking dependencies...${NC}"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is required but not installed.${NC}"
    exit 1
fi

# Build the application
echo -e "${BLUE}📦 Building NexusOne AI for production...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

# Check if Vercel CLI is available
if command -v vercel &> /dev/null; then
    echo -e "${BLUE}🚀 Deploying to Vercel...${NC}"
    vercel --prod --yes
    echo -e "${GREEN}✅ Deployed to Vercel!${NC}"
elif command -v netlify &> /dev/null; then
    echo -e "${BLUE}🚀 Deploying to Netlify...${NC}"
    netlify deploy --prod --dir=dist
    echo -e "${GREEN}✅ Deployed to Netlify!${NC}"
else
    echo -e "${YELLOW}⚠️  No deployment platform found.${NC}"
    echo -e "${BLUE}Options:${NC}"
    echo "1. Install Vercel: npm i -g vercel"
    echo "2. Install Netlify: npm i -g netlify-cli"
    echo "3. Manual upload: Use dist/ folder"
    echo ""
    echo -e "${GREEN}✅ Build completed! Your app is in the dist/ folder${NC}"
fi

# Show next steps
echo ""
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Configure your API keys in production"
echo "2. Set up Supabase project (optional)"
echo "3. Test all features"
echo "4. Set up custom domain"
echo ""
echo -e "${YELLOW}💡 Your NexusOne AI platform is ready to serve global customers!${NC}"