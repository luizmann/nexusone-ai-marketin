#!/bin/bash

# NexusOne AI Production Deployment Test Script
# This script tests all AI features after deployment to ensure everything works correctly

echo "🚀 Starting NexusOne AI Production Test Suite..."
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test configuration
SUPABASE_URL=${SUPABASE_URL:-"https://your-project.supabase.co"}
API_BASE="$SUPABASE_URL/functions/v1"
AUTH_TOKEN=${SUPABASE_ANON_KEY:-"test-token"}

# Test results tracking
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_TOTAL=0

# Function to run a test
run_test() {
    local test_name="$1"
    local endpoint="$2"
    local test_data="$3"
    local expected_status=${4:-200}
    
    echo -e "${BLUE}Testing:${NC} $test_name"
    echo "Endpoint: $endpoint"
    
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
    
    # Make the API call
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" \
        -X POST \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $AUTH_TOKEN" \
        -d "$test_data" \
        "$API_BASE$endpoint")
    
    # Extract status code
    http_code=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    response_body=$(echo "$response" | sed -e 's/HTTPSTATUS:.*//g')
    
    # Check if test passed
    if [ "$http_code" -eq "$expected_status" ]; then
        echo -e "${GREEN}✅ PASSED${NC} (HTTP $http_code)"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        echo "Response: ${response_body:0:100}..."
    else
        echo -e "${RED}❌ FAILED${NC} (HTTP $http_code)"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        echo "Error: $response_body"
    fi
    echo ""
}

# Test 1: OpenAI GPT-4 Content Generation
echo -e "${YELLOW}🧠 Testing AI Content Generation...${NC}"
run_test "OpenAI GPT-4" "/openai-assistant" '{
    "prompt": "Generate a short product description for wireless headphones",
    "max_tokens": 150
}'

# Test 2: NexBrain AI Agent
run_test "NexBrain AI Agent" "/openai-assistant" '{
    "message": "Create a marketing campaign for a fitness product",
    "assistant_id": "asst_0jsx8eD6P3W9XGsSRRNU2Pfd"
}'

# Test 3: Replicate Image Generation
echo -e "${YELLOW}🎨 Testing AI Image Generation...${NC}"
run_test "Replicate Image Generation" "/replicate-image" '{
    "prompt": "Modern wireless headphones on white background, product photography",
    "model": "black-forest-labs/flux-schnell"
}'

# Test 4: Luma AI Video Generation
echo -e "${YELLOW}🎬 Testing AI Video Generation...${NC}"
run_test "Luma AI Video" "/luma-video" '{
    "prompt": "Sleek wireless headphone rotating on modern desk"
}'

# Test 5: ElevenLabs Text-to-Speech
echo -e "${YELLOW}🗣️ Testing Text-to-Speech...${NC}"
run_test "ElevenLabs TTS" "/elevenlabs-tts" '{
    "text": "Welcome to NexusOne AI marketing platform",
    "voice_id": "pNInz6obpgDQGcFmaJgB"
}'

# Test 6: CJ Dropshipping Integration
echo -e "${YELLOW}🛒 Testing E-commerce Integration...${NC}"
run_test "CJ Dropshipping" "/cj-dropshipping-catalog" '{
    "search": "wireless headphones",
    "page": 1,
    "pageSize": 10
}'

# Test 7: Facebook Ads Campaign Generation
echo -e "${YELLOW}📱 Testing Marketing Automation...${NC}"
run_test "Facebook Ads Generator" "/facebook-ads-generator" '{
    "productName": "Wireless Headphones Pro",
    "targetAudience": "Tech enthusiasts aged 25-40",
    "budget": 100
}'

# Test 8: WhatsApp Bot Integration
run_test "WhatsApp Automation" "/whatsapp-automation" '{
    "message": "Hi, I need product information",
    "phone": "+1234567890"
}'

# Test 9: Magic Page Generator
echo -e "${YELLOW}🪄 Testing Landing Page Generation...${NC}"
run_test "Magic Page Generator" "/magic-page-generator" '{
    "productName": "Wireless Headphones Pro",
    "productDescription": "Premium noise-cancelling headphones",
    "targetAudience": "Music lovers and professionals"
}'

# Test 10: Complete Campaign Generator
run_test "Campaign Generator" "/campaign-generator" '{
    "productId": "test-product-123",
    "campaignType": "product-launch",
    "budget": 500
}'

# Test Summary
echo "=================================================="
echo -e "${BLUE}🎯 NexusOne AI Test Results Summary${NC}"
echo "=================================================="
echo -e "Total Tests: ${TESTS_TOTAL}"
echo -e "${GREEN}Passed: ${TESTS_PASSED}${NC}"
echo -e "${RED}Failed: ${TESTS_FAILED}${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed! NexusOne AI is ready for production.${NC}"
    exit 0
else
    echo -e "${RED}⚠️ Some tests failed. Please check the configuration and API keys.${NC}"
    exit 1
fi