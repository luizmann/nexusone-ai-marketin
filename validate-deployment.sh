#!/bin/bash
# Deployment Validation and Health Check Script

echo "🔍 NexusOne AI - Deployment Validation"
echo "======================================"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Counters
PASSED=0
FAILED=0

check_test() {
    local name="$1"
    local command="$2"
    
    echo -n "Testing $name... "
    
    if eval $command >/dev/null 2>&1; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}"
        ((FAILED++))
    fi
}

echo "🌐 Frontend Tests"
echo "=================="

# Check if build exists
check_test "Build Directory" "test -d dist"
check_test "Index HTML" "test -f dist/index.html"
check_test "Assets Directory" "test -d dist/assets"

echo ""
echo "📊 Backend Tests"
echo "================"

# Check Supabase connection
check_test "Supabase CLI" "command -v supabase"
check_test "Vercel CLI" "command -v vercel"

echo ""
echo "🔑 API Configuration Tests"
echo "=========================="

# Check environment files
check_test "Vercel Config" "test -f vercel.json"
check_test "Supabase Config" "test -f supabase/config.prod.toml"

echo ""
echo "📦 Edge Functions Tests"
echo "======================"

# Check Edge Functions directories
FUNCTIONS=(
    "ai-content-generator"
    "nexbrain-assistant" 
    "whatsapp-smart-booking"
    "video-creator-luma"
    "magic-page-builder"
)

for func in "${FUNCTIONS[@]}"; do
    check_test "Function: $func" "test -d supabase/functions/$func"
done

echo ""
echo "🎯 Production Readiness Tests"
echo "============================="

check_test "Package.json" "test -f package.json"
check_test "Production Build Script" "grep -q 'build:prod' package.json"
check_test "Deployment Scripts" "test -f deploy-production.sh"

echo ""
echo "📊 Test Summary"
echo "==============="
echo -e "✅ Passed: ${GREEN}$PASSED${NC}"
echo -e "❌ Failed: ${RED}$FAILED${NC}"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed! Ready for deployment.${NC}"
    echo ""
    echo "🚀 To deploy, run:"
    echo "   bash deploy-production.sh"
    exit 0
else
    echo -e "${RED}⚠️  Some tests failed. Please fix issues before deployment.${NC}"
    exit 1
fi