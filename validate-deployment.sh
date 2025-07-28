#!/bin/bash

# NexusOne AI - Deployment Validation Script
# Validates that all services are working correctly

echo "🔍 NexusOne AI - Deployment Validation"
echo "====================================="

SUPABASE_URL="https://hbfgtdxvlbkvkrjqxnac.supabase.co"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiZmd0ZHh2bGJrdmtyanh4bmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ2NzI4MDAsImV4cCI6MjAyMDI0ODgwMH0.XYKhOW-Q5kz9O2P7vX1cFm3d8jR6sN0tA9wK4eL7mGp"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test functions
FUNCTIONS=(
    "test-api-connection"
    "ai-content-generation"
    "video-generator" 
    "cj-dropshipping-catalog"
    "whatsapp-automation"
    "nexus-api-manager"
)

echo "Testing backend services..."

# Test each function
for func in "${FUNCTIONS[@]}"; do
    echo -n "Testing $func... "
    
    response=$(curl -s -w "%{http_code}" "$SUPABASE_URL/functions/v1/$func" \
        -H "Authorization: Bearer $ANON_KEY" \
        -H "Content-Type: application/json" \
        -d '{"test": true}' \
        -o /dev/null)
    
    if [ "$response" -eq 200 ] || [ "$response" -eq 201 ]; then
        echo -e "${GREEN}✅ PASS${NC}"
    else
        echo -e "${RED}❌ FAIL (HTTP $response)${NC}"
    fi
done

echo ""
echo "Testing frontend build..."

# Check if dist directory exists
if [ -d "dist" ]; then
    echo -e "${GREEN}✅ Frontend build exists${NC}"
    
    # Check if index.html exists
    if [ -f "dist/index.html" ]; then
        echo -e "${GREEN}✅ index.html found${NC}"
    else
        echo -e "${RED}❌ index.html missing${NC}"
    fi
    
    # Check if assets exist
    if [ -d "dist/assets" ]; then
        echo -e "${GREEN}✅ Assets directory found${NC}"
    else
        echo -e "${RED}❌ Assets directory missing${NC}"
    fi
else
    echo -e "${RED}❌ Frontend build missing - run 'npm run build'${NC}"
fi

echo ""
echo "Environment validation..."

# Check if .env.production exists
if [ -f ".env.production" ]; then
    echo -e "${GREEN}✅ Production environment file exists${NC}"
else
    echo -e "${YELLOW}⚠️  .env.production missing${NC}"
fi

# Check package.json scripts
if grep -q "\"build\":" package.json; then
    echo -e "${GREEN}✅ Build script found${NC}"
else
    echo -e "${RED}❌ Build script missing${NC}"
fi

echo ""
echo "Deployment readiness:"

# Check if Supabase CLI is available
if command -v supabase &> /dev/null; then
    echo -e "${GREEN}✅ Supabase CLI installed${NC}"
else
    echo -e "${YELLOW}⚠️  Supabase CLI not found${NC}"
fi

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${RED}❌ Dependencies missing - run 'npm install'${NC}"
fi

echo ""
echo "====================================="
echo "🎯 Deployment validation complete!"
echo ""
echo "Next steps:"
echo "1. Run './deploy-production.sh' for full deployment"
echo "2. Or deploy manually using the guide"
echo "3. Monitor at: https://supabase.com/dashboard/project/hbfgtdxvlbkvkrjqxnac"