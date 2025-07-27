#!/bin/bash

# NexusOne AI Platform - Environment Setup Script
# This script configures the Supabase environment for production deployment

set -e

echo "🔧 Setting up NexusOne AI Platform environment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.production exists
if [ ! -f "supabase/.env.production" ]; then
    echo -e "${RED}❌ Production environment file not found!${NC}"
    exit 1
fi

# Load environment variables
echo -e "${BLUE}🔧 Loading environment variables...${NC}"
export $(cat supabase/.env.production | grep -v '^#' | xargs)

# Verify required environment variables
REQUIRED_VARS=(
    "SUPABASE_PROJECT_ID"
    "SUPABASE_URL" 
    "SUPABASE_ANON_KEY"
    "SUPABASE_SERVICE_ROLE_KEY"
    "OPENAI_API_KEY"
    "ELEVENLABS_API_KEY"
    "REPLICATE_API_TOKEN"
    "LUMA_API_KEY"
    "GUPSHUP_API_KEY"
    "CJ_DROPSHIPPING_API_KEY"
    "FACEBOOK_ACCESS_TOKEN"
    "UNSPLASH_ACCESS_KEY"
)

echo -e "${BLUE}🔍 Verifying required environment variables...${NC}"
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        echo -e "${RED}❌ Missing required environment variable: $var${NC}"
        exit 1
    else
        echo -e "${GREEN}✅ $var is set${NC}"
    fi
done

# Create Supabase configuration
echo -e "${BLUE}📝 Creating Supabase configuration...${NC}"

# Update the environment in App.tsx to use production values
cat > src/lib/supabase.ts << EOF
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = '${SUPABASE_URL}'
const supabaseAnonKey = '${SUPABASE_ANON_KEY}'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Export for use in components
export const SUPABASE_URL = supabaseUrl
export const FUNCTIONS_URL = '${SUPABASE_URL}/functions/v1'
EOF

# Create API client
cat > src/lib/api.ts << EOF
import { supabase, FUNCTIONS_URL } from './supabase'

export interface ApiRequest {
  action: string
  payload: any
}

export interface ApiResponse {
  success: boolean
  data?: any
  error?: string
  creditsUsed?: number
}

export class NexusApiClient {
  private async makeRequest(endpoint: string, data: any): Promise<ApiResponse> {
    const { data: session } = await supabase.auth.getSession()
    
    if (!session?.session?.access_token) {
      throw new Error('No active session')
    }

    const response = await fetch(\`\${FUNCTIONS_URL}/\${endpoint}\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${session.session.access_token}\`
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error(\`API request failed: \${response.statusText}\`)
    }

    return await response.json()
  }

  // AI Services
  async generateContent(prompt: string, model = 'gpt-4o'): Promise<ApiResponse> {
    return this.makeRequest('nexus-api-manager', {
      action: 'openai_completion',
      payload: {
        messages: [{ role: 'user', content: prompt }],
        model
      }
    })
  }

  async askNexBrain(prompt: string): Promise<ApiResponse> {
    return this.makeRequest('nexus-api-manager', {
      action: 'openai_assistant',
      payload: { userPrompt: prompt }
    })
  }

  async generateSpeech(text: string, voiceId?: string): Promise<ApiResponse> {
    return this.makeRequest('nexus-api-manager', {
      action: 'elevenlabs_tts',
      payload: { text, voice_id: voiceId }
    })
  }

  async generateImage(prompt: string): Promise<ApiResponse> {
    return this.makeRequest('nexus-api-manager', {
      action: 'replicate_image',
      payload: {
        input: { prompt }
      }
    })
  }

  async generateVideo(prompt: string, aspectRatio = '16:9'): Promise<ApiResponse> {
    return this.makeRequest('nexus-api-manager', {
      action: 'luma_video',
      payload: { prompt, aspect_ratio: aspectRatio }
    })
  }

  // WhatsApp
  async sendWhatsAppMessage(phone: string, message: string): Promise<ApiResponse> {
    return this.makeRequest('nexus-api-manager', {
      action: 'gupshup_whatsapp',
      payload: { phone, message }
    })
  }

  // Dropshipping
  async searchProducts(query: string): Promise<ApiResponse> {
    return this.makeRequest('nexus-api-manager', {
      action: 'cj_dropshipping',
      payload: { action: 'search_products', productName: query }
    })
  }

  // Social Media
  async createFacebookCampaign(campaignData: any): Promise<ApiResponse> {
    return this.makeRequest('nexus-api-manager', {
      action: 'facebook_ads',
      payload: { action: 'create_campaign', ...campaignData }
    })
  }

  // Media
  async searchPhotos(query: string): Promise<ApiResponse> {
    return this.makeRequest('nexus-api-manager', {
      action: 'unsplash_photos',
      payload: { query }
    })
  }
}

export const apiClient = new NexusApiClient()
EOF

# Create production environment for frontend
cat > .env.production << EOF
# NexusOne AI Platform - Frontend Production Environment
VITE_SUPABASE_URL=${SUPABASE_URL}
VITE_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
VITE_FUNCTIONS_URL=${SUPABASE_URL}/functions/v1
VITE_APP_URL=https://app.nexusone.ai
VITE_API_BASE_URL=${SUPABASE_URL}
VITE_ENVIRONMENT=production
EOF

# Create deployment configuration
cat > deploy.config.js << EOF
export default {
  supabase: {
    projectId: '${SUPABASE_PROJECT_ID}',
    url: '${SUPABASE_URL}',
    functionsUrl: '${SUPABASE_URL}/functions/v1'
  },
  apis: {
    openai: {
      enabled: true,
      model: 'gpt-4o'
    },
    elevenlabs: {
      enabled: true,
      defaultVoice: 'pNInz6obpgDQGcFmaJgB'
    },
    replicate: {
      enabled: true
    },
    luma: {
      enabled: true
    },
    gupshup: {
      enabled: true
    },
    cj: {
      enabled: true
    },
    facebook: {
      enabled: true
    },
    unsplash: {
      enabled: true
    }
  },
  features: {
    aiGeneration: true,
    videoCreation: true,
    whatsappAutomation: true,
    dropshipping: true,
    socialMediaAds: true,
    analytics: true
  },
  limits: {
    free: {
      credits: 50,
      videos: 2,
      landingPages: 2,
      whatsappNumbers: 1
    },
    pro: {
      credits: 500,
      videos: 20,
      landingPages: 20,
      whatsappNumbers: 5
    },
    premium: {
      credits: 2000,
      videos: 100,
      landingPages: -1,
      whatsappNumbers: 20
    }
  }
}
EOF

echo -e "${GREEN}✅ Environment setup complete!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Supabase configuration: Created${NC}"
echo -e "${GREEN}✅ API client: Generated${NC}"
echo -e "${GREEN}✅ Production environment: Configured${NC}"
echo -e "${GREEN}✅ Deployment config: Ready${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "\n${YELLOW}📋 Next Steps:${NC}"
echo -e "1. Run: ./deploy-supabase-complete.sh to deploy backend"
echo -e "2. Run: npm run build:prod to build frontend" 
echo -e "3. Deploy frontend to your hosting provider"
echo -e "4. Configure custom domain and SSL"
echo -e "5. Test all integrations"

echo -e "\n${GREEN}🚀 NexusOne AI Platform is ready for production deployment!${NC}"