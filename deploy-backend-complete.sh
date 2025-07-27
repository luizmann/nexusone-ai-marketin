#!/bin/bash

echo "🚀 Starting NexusOneAI Backend Deployment..."
echo "=================================================="

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

# Initialize Supabase if not already done
if [ ! -f "supabase/config.toml" ]; then
    echo "🔧 Initializing Supabase project..."
    supabase init
fi

# Set environment variables
echo "🔑 Setting up environment variables..."

# Create .env.production if it doesn't exist
if [ ! -f "supabase/.env.production" ]; then
    cat > supabase/.env.production << EOF
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_ASSISTANT_ID=your_assistant_id_here

# Video Generation
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
REPLICATE_API_KEY=your_replicate_api_key_here
LUMA_API_KEY=your_luma_api_key_here

# Communication
GUPSHUP_API_KEY=your_gupshup_api_key_here

# Marketing
FACEBOOK_ACCESS_TOKEN=your_facebook_token_here

# E-commerce
CJ_DROPSHIPPING_API_KEY=your_cj_api_key_here

# Media
UNSPLASH_ACCESS_KEY=your_unsplash_key_here

# Supabase
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
EOF
    echo "✅ Created .env.production template"
    echo "⚠️  Please update supabase/.env.production with your actual API keys"
fi

# Login to Supabase (if not already logged in)
echo "🔐 Checking Supabase authentication..."
if ! supabase projects list &> /dev/null; then
    echo "🔑 Please login to Supabase:"
    supabase login
fi

# Link to Supabase project (replace with your project reference)
echo "🔗 Linking to Supabase project..."
# supabase link --project-ref your-project-ref

# Run database migrations
echo "📊 Running database migrations..."
supabase db push

# Deploy Edge Functions
echo "⚡ Deploying Edge Functions..."

FUNCTIONS=(
    "test-api-connection"
    "save-api-config"
    "api-proxy"
    "nexbrain-chat"
    "ai-content-generator"
    "landing-page-builder"
    "video-generator"
    "luma-video-ai"
    "facebook-ads-manager"
    "cj-dropshipping-catalog"
    "cj-dropshipping-order"
    "dropshipping-import"
    "product-scraper"
    "whatsapp-automation"
    "unsplash-api"
    "usage-tracker"
    "webhook-handler"
    "nexus-api-manager"
)

# Deploy each function
for func in "${FUNCTIONS[@]}"; do
    echo "📦 Deploying function: $func"
    if [ -d "supabase/functions/$func" ]; then
        supabase functions deploy $func --no-verify-jwt
        if [ $? -eq 0 ]; then
            echo "✅ Successfully deployed $func"
        else
            echo "❌ Failed to deploy $func"
        fi
    else
        echo "⚠️  Function directory not found: $func"
    fi
done

# Set environment variables for Edge Functions
echo "🌍 Setting environment variables for Edge Functions..."
supabase secrets set --env-file supabase/.env.production

echo "🎯 Testing API connections..."

# Create a simple test script
cat > test-deployment.js << 'EOF'
const testEndpoints = [
    '/functions/v1/test-api-connection',
    '/functions/v1/save-api-config',
    '/functions/v1/api-proxy',
    '/functions/v1/nexbrain-chat'
];

async function testDeployment() {
    const supabaseUrl = process.env.SUPABASE_URL;
    
    if (!supabaseUrl) {
        console.log('❌ SUPABASE_URL not set');
        return;
    }
    
    console.log('🧪 Testing deployment endpoints...');
    
    for (const endpoint of testEndpoints) {
        try {
            const response = await fetch(`${supabaseUrl}${endpoint}`, {
                method: 'OPTIONS'
            });
            
            if (response.ok) {
                console.log(`✅ ${endpoint} - OK`);
            } else {
                console.log(`❌ ${endpoint} - Failed (${response.status})`);
            }
        } catch (error) {
            console.log(`❌ ${endpoint} - Error: ${error.message}`);
        }
    }
}

testDeployment();
EOF

# Run the test
node test-deployment.js

# Clean up test file
rm test-deployment.js

echo "=================================================="
echo "🎉 Deployment Complete!"
echo ""
echo "📝 Next Steps:"
echo "1. Update your API keys in supabase/.env.production"
echo "2. Run: supabase secrets set --env-file supabase/.env.production"
echo "3. Test your API integrations in the dashboard"
echo "4. Configure your frontend with the Supabase URL and keys"
echo ""
echo "🔍 Monitor your functions:"
echo "supabase functions logs --follow"
echo ""
echo "📊 Check database:"
echo "supabase db start"
echo "=================================================="