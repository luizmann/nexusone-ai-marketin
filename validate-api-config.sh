#!/bin/bash

# 🔧 NexusOne AI - API Configuration Validator
# This script validates all API configurations and tests connectivity

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENV_FILE=".env.production"
LOG_FILE="api-validation.log"
TIMEOUT=10

echo -e "${BLUE}🔧 NexusOne AI - API Configuration Validator${NC}"
echo "================================================"
echo "Starting comprehensive API validation..."
echo "Log file: $LOG_FILE"
echo ""

# Initialize log file
echo "API Validation Log - $(date)" > $LOG_FILE
echo "======================================" >> $LOG_FILE

# Load environment variables
if [ -f "$ENV_FILE" ]; then
    echo -e "${GREEN}✅ Loading environment from $ENV_FILE${NC}"
    source $ENV_FILE
else
    echo -e "${RED}❌ Environment file $ENV_FILE not found!${NC}"
    exit 1
fi

# Validation counters
TOTAL_APIS=0
HEALTHY_APIS=0
CRITICAL_FAILURES=0
WARNINGS=0

# Function to validate API endpoint
validate_api() {
    local name=$1
    local url=$2
    local headers=$3
    local required=$4
    local description=$5
    
    TOTAL_APIS=$((TOTAL_APIS + 1))
    
    echo -e "${BLUE}🔍 Testing $name API...${NC}"
    echo "Testing $name API - $(date)" >> $LOG_FILE
    
    if [ -z "$url" ]; then
        echo -e "${YELLOW}⚠️  $name: URL not configured${NC}"
        echo "  Status: URL not configured" >> $LOG_FILE
        if [ "$required" = "true" ]; then
            CRITICAL_FAILURES=$((CRITICAL_FAILURES + 1))
        else
            WARNINGS=$((WARNINGS + 1))
        fi
        return
    fi
    
    # Test API connectivity
    if [ -n "$headers" ]; then
        HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
            --connect-timeout $TIMEOUT \
            --max-time $TIMEOUT \
            -H "$headers" \
            "$url" 2>> $LOG_FILE)
    else
        HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
            --connect-timeout $TIMEOUT \
            --max-time $TIMEOUT \
            "$url" 2>> $LOG_FILE)
    fi
    
    if [ "$HTTP_STATUS" -ge 200 ] && [ "$HTTP_STATUS" -lt 400 ]; then
        echo -e "${GREEN}✅ $name: Healthy (HTTP $HTTP_STATUS)${NC}"
        echo "  Status: Healthy (HTTP $HTTP_STATUS)" >> $LOG_FILE
        HEALTHY_APIS=$((HEALTHY_APIS + 1))
    elif [ "$HTTP_STATUS" -eq 401 ] || [ "$HTTP_STATUS" -eq 403 ]; then
        echo -e "${YELLOW}⚠️  $name: Authentication issue (HTTP $HTTP_STATUS)${NC}"
        echo "  Status: Authentication issue (HTTP $HTTP_STATUS)" >> $LOG_FILE
        WARNINGS=$((WARNINGS + 1))
    else
        echo -e "${RED}❌ $name: Unhealthy (HTTP $HTTP_STATUS)${NC}"
        echo "  Status: Unhealthy (HTTP $HTTP_STATUS)" >> $LOG_FILE
        if [ "$required" = "true" ]; then
            CRITICAL_FAILURES=$((CRITICAL_FAILURES + 1))
        else
            WARNINGS=$((WARNINGS + 1))
        fi
    fi
    
    if [ -n "$description" ]; then
        echo "  Description: $description"
        echo "  Description: $description" >> $LOG_FILE
    fi
    
    echo "" >> $LOG_FILE
}

# Function to validate environment variable
validate_env_var() {
    local var_name=$1
    local required=$2
    local description=$3
    
    if [ -n "${!var_name}" ]; then
        echo -e "${GREEN}✅ $var_name: Configured${NC}"
        if [ -n "$description" ]; then
            echo "  $description"
        fi
    else
        if [ "$required" = "true" ]; then
            echo -e "${RED}❌ $var_name: Missing (Required)${NC}"
            CRITICAL_FAILURES=$((CRITICAL_FAILURES + 1))
        else
            echo -e "${YELLOW}⚠️  $var_name: Not configured (Optional)${NC}"
            WARNINGS=$((WARNINGS + 1))
        fi
        if [ -n "$description" ]; then
            echo "  $description"
        fi
    fi
}

echo -e "${BLUE}🔑 Environment Variables Validation${NC}"
echo "-----------------------------------"

# Critical environment variables
validate_env_var "VITE_SUPABASE_URL" "true" "Supabase database URL"
validate_env_var "VITE_SUPABASE_ANON_KEY" "true" "Supabase anonymous key"
validate_env_var "SUPABASE_SERVICE_ROLE_KEY" "true" "Supabase service role key"
validate_env_var "OPENAI_API_KEY" "true" "OpenAI GPT-4 API key"
validate_env_var "OPENAI_ASSISTANT_ID" "true" "OpenAI Assistant ID (NexBrain)"

# Optional but important variables
validate_env_var "ELEVENLABS_API_KEY" "false" "ElevenLabs text-to-speech"
validate_env_var "REPLICATE_API_TOKEN" "false" "Replicate image generation"
validate_env_var "LUMA_API_KEY" "false" "Luma AI video generation"
validate_env_var "GUPSHUP_API_KEY" "false" "Gupshup WhatsApp Business"
validate_env_var "CJ_API_KEY" "false" "CJ Dropshipping integration"
validate_env_var "FACEBOOK_ACCESS_TOKEN" "false" "Facebook Marketing API"
validate_env_var "UNSPLASH_ACCESS_KEY" "false" "Unsplash images API"

echo ""
echo -e "${BLUE}🔌 API Connectivity Tests${NC}"
echo "-------------------------"

# Test critical APIs
if [ -n "$VITE_SUPABASE_URL" ]; then
    validate_api "Supabase" "${VITE_SUPABASE_URL}/rest/v1/" "" "true" "Database and authentication service"
fi

if [ -n "$OPENAI_API_KEY" ]; then
    validate_api "OpenAI" "https://api.openai.com/v1/models" "Authorization: Bearer $OPENAI_API_KEY" "true" "GPT-4 and NexBrain assistant"
fi

# Test optional APIs
if [ -n "$ELEVENLABS_API_KEY" ]; then
    validate_api "ElevenLabs" "https://api.elevenlabs.io/v1/voices" "xi-api-key: $ELEVENLABS_API_KEY" "false" "Text-to-speech generation"
fi

if [ -n "$REPLICATE_API_TOKEN" ]; then
    validate_api "Replicate" "https://api.replicate.com/v1/models" "Authorization: Token $REPLICATE_API_TOKEN" "false" "Image generation"
fi

if [ -n "$LUMA_API_KEY" ]; then
    validate_api "Luma AI" "https://api.lumalabs.ai/dream-machine/v1/generations" "Authorization: Bearer $LUMA_API_KEY" "false" "Video generation"
fi

if [ -n "$GUPSHUP_API_KEY" ]; then
    validate_api "Gupshup" "https://api.gupshup.io/sm/api/v1/app" "apikey: $GUPSHUP_API_KEY" "false" "WhatsApp Business messaging"
fi

if [ -n "$CJ_API_KEY" ]; then
    validate_api "CJ Dropshipping" "https://developers.cjdropshipping.com/api2.0/v1/ping" "CJ-Access-Token: $CJ_API_KEY" "false" "Dropshipping product catalog"
fi

if [ -n "$FACEBOOK_ACCESS_TOKEN" ]; then
    validate_api "Facebook" "https://graph.facebook.com/v18.0/me?access_token=$FACEBOOK_ACCESS_TOKEN" "" "false" "Facebook Marketing API"
fi

if [ -n "$UNSPLASH_ACCESS_KEY" ]; then
    validate_api "Unsplash" "https://api.unsplash.com/photos/random" "Authorization: Client-ID $UNSPLASH_ACCESS_KEY" "false" "Stock photo service"
fi

echo ""
echo -e "${BLUE}📊 Validation Summary${NC}"
echo "===================="
echo -e "Total APIs tested: ${BLUE}$TOTAL_APIS${NC}"
echo -e "Healthy APIs: ${GREEN}$HEALTHY_APIS${NC}"
echo -e "Warnings: ${YELLOW}$WARNINGS${NC}"
echo -e "Critical failures: ${RED}$CRITICAL_FAILURES${NC}"

# Calculate percentage
if [ $TOTAL_APIS -gt 0 ]; then
    HEALTH_PERCENTAGE=$(( (HEALTHY_APIS * 100) / TOTAL_APIS ))
    echo -e "Health percentage: ${BLUE}${HEALTH_PERCENTAGE}%${NC}"
fi

echo ""
echo -e "${BLUE}📝 Recommendations${NC}"
echo "=================="

if [ $CRITICAL_FAILURES -gt 0 ]; then
    echo -e "${RED}❌ CRITICAL: Fix critical API failures before deployment!${NC}"
    echo "• Configure missing required environment variables"
    echo "• Verify API keys are valid and active"
    echo "• Check network connectivity to API endpoints"
elif [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  WARNING: Some optional APIs are not configured${NC}"
    echo "• Consider configuring optional APIs for full functionality"
    echo "• Monitor performance of available APIs"
    echo "• Test integrations in staging environment"
else
    echo -e "${GREEN}✅ EXCELLENT: All APIs are properly configured!${NC}"
    echo "• System is ready for production deployment"
    echo "• Monitor API usage and rate limits"
    echo "• Set up automated health checks"
fi

echo ""
echo -e "${BLUE}🚀 Next Steps${NC}"
echo "============="
echo "1. Review the validation log: $LOG_FILE"
echo "2. Fix any critical issues identified"
echo "3. Test integrations in staging environment"
echo "4. Monitor API costs and usage limits"
echo "5. Set up alerts for API failures"

# Write summary to log
echo "" >> $LOG_FILE
echo "VALIDATION SUMMARY" >> $LOG_FILE
echo "==================" >> $LOG_FILE
echo "Total APIs: $TOTAL_APIS" >> $LOG_FILE
echo "Healthy: $HEALTHY_APIS" >> $LOG_FILE
echo "Warnings: $WARNINGS" >> $LOG_FILE
echo "Critical failures: $CRITICAL_FAILURES" >> $LOG_FILE
echo "Validation completed: $(date)" >> $LOG_FILE

# Exit with appropriate code
if [ $CRITICAL_FAILURES -gt 0 ]; then
    echo -e "\n${RED}❌ Validation failed with critical errors!${NC}"
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    echo -e "\n${YELLOW}⚠️  Validation completed with warnings${NC}"
    exit 0
else
    echo -e "\n${GREEN}✅ Validation passed successfully!${NC}"
    exit 0
fi