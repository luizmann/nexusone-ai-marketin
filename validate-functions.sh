#!/bin/bash

# NexusOne AI - Edge Functions Validation Script
# Validates all 20 Edge Functions before deployment

echo "🔍 Validating NexusOne AI Edge Functions..."

FUNCTIONS_DIR="/workspaces/spark-template/supabase/functions"
TOTAL_FUNCTIONS=0
VALID_FUNCTIONS=0
ERRORS=0

# Function to validate TypeScript file
validate_function() {
    local func_name=$1
    local func_path="$FUNCTIONS_DIR/$func_name"
    
    echo -n "📦 Checking $func_name... "
    TOTAL_FUNCTIONS=$((TOTAL_FUNCTIONS + 1))
    
    # Check if directory exists
    if [ ! -d "$func_path" ]; then
        echo "❌ Directory missing"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
    
    # Check if index.ts exists
    if [ ! -f "$func_path/index.ts" ]; then
        echo "❌ index.ts missing"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
    
    # Check for basic TypeScript structure
    if grep -q "serve" "$func_path/index.ts" && grep -q "export" "$func_path/index.ts"; then
        echo "✅ Valid"
        VALID_FUNCTIONS=$((VALID_FUNCTIONS + 1))
        return 0
    else
        echo "⚠️  Structure issue"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

echo "🚀 Starting validation of Edge Functions..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# AI & Content Generation Functions
echo "🤖 AI & Content Generation Functions:"
validate_function "nexbrain-chat"
validate_function "ai-content-generation"
validate_function "ai-content-generator"
validate_function "luma-video-ai"
validate_function "video-generator"

# E-commerce & Dropshipping Functions
echo ""
echo "🛒 E-commerce & Dropshipping Functions:"
validate_function "cj-dropshipping-catalog"
validate_function "cj-dropshipping-order"
validate_function "dropshipping-import"
validate_function "product-scraper"

# Social Media & Marketing Functions
echo ""
echo "📱 Social Media & Marketing Functions:"
validate_function "facebook-ads-manager"
validate_function "whatsapp-automation"
validate_function "landing-page-builder"

# Infrastructure & Management Functions
echo ""
echo "🔧 Infrastructure & Management Functions:"
validate_function "nexus-api-manager"
validate_function "save-api-config"
validate_function "test-api-connection"
validate_function "api-proxy"

# Analytics & Utilities Functions
echo ""
echo "📊 Analytics & Utilities Functions:"
validate_function "usage-tracker"
validate_function "webhook-handler"
validate_function "unsplash-api"

# Shared utilities
echo ""
echo "🔧 Shared Utilities:"
if [ -d "$FUNCTIONS_DIR/_shared" ]; then
    echo "📦 Checking _shared... ✅ Present"
    TOTAL_FUNCTIONS=$((TOTAL_FUNCTIONS + 1))
    VALID_FUNCTIONS=$((VALID_FUNCTIONS + 1))
else
    echo "📦 Checking _shared... ⚠️  Missing"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 VALIDATION SUMMARY:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Total Functions: $TOTAL_FUNCTIONS"
echo "Valid Functions: $VALID_FUNCTIONS"
echo "Errors Found: $ERRORS"

if [ $ERRORS -eq 0 ]; then
    echo ""
    echo "🎉 ALL FUNCTIONS VALIDATED SUCCESSFULLY!"
    echo "✅ Ready for production deployment"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Run: supabase login"
    echo "2. Run: supabase link --project-ref hbfgtdxvlbkvkrjqxnac"
    echo "3. Deploy all functions with the commands in FINAL_DEPLOYMENT_STATUS_COMPLETE.md"
    echo ""
    echo "🚀 Estimated deployment time: 30 minutes"
    
    exit 0
else
    echo ""
    echo "❌ VALIDATION FAILED!"
    echo "⚠️  Please fix errors before deployment"
    echo ""
    
    exit 1
fi