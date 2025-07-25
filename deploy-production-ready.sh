#!/bin/bash

# NexusOne AI Platform - One-Click Production Deployment Script
# This script deploys your complete SaaS platform to production

set -e

echo "🚀 NexusOne AI Platform - Production Deployment Starting..."
echo "================================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Copy production environment variables
if [ ! -f ".env.production" ]; then
    echo "❌ Error: .env.production file not found!"
    echo "Please configure your environment variables in .env.production"
    exit 1
fi

echo "✅ Environment configuration found"

# Build the project
echo "🔨 Building production version..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please check for errors above."
    exit 1
fi

echo "✅ Build completed successfully"

# Check if Vercel CLI is installed
if command -v vercel &> /dev/null; then
    echo "🚢 Deploying to Vercel..."
    
    # Deploy to Vercel
    vercel --prod --yes
    
    if [ $? -eq 0 ]; then
        echo "🎉 DEPLOYMENT SUCCESSFUL!"
        echo "================================================================"
        echo "Your NexusOne AI Platform is now LIVE!"
        echo ""
        echo "Next steps:"
        echo "1. Configure your environment variables in Vercel dashboard"
        echo "2. Set up your domain (if custom domain needed)"
        echo "3. Test all features in production"
        echo "4. Start marketing your platform!"
        echo ""
        echo "🌍 Access your platform at the URL shown above"
        echo "📊 Monitor usage and revenue in the dashboard"
        echo "💰 Start earning with your AI marketing platform!"
        exit 0
    else
        echo "❌ Vercel deployment failed"
    fi
fi

# Check if Netlify CLI is installed
if command -v netlify &> /dev/null; then
    echo "🚢 Deploying to Netlify..."
    
    # Deploy to Netlify
    netlify deploy --prod --dir=dist
    
    if [ $? -eq 0 ]; then
        echo "🎉 DEPLOYMENT SUCCESSFUL!"
        echo "================================================================"
        echo "Your NexusOne AI Platform is now LIVE!"
        echo ""
        echo "Next steps:"
        echo "1. Configure your environment variables in Netlify dashboard"
        echo "2. Set up your domain (if custom domain needed)"  
        echo "3. Test all features in production"
        echo "4. Start marketing your platform!"
        echo ""
        echo "🌍 Access your platform at the URL shown above"
        echo "📊 Monitor usage and revenue in the dashboard"
        echo "💰 Start earning with your AI marketing platform!"
        exit 0
    else
        echo "❌ Netlify deployment failed"
    fi
fi

# No deployment platform found - provide manual instructions
echo "📁 Manual deployment ready!"
echo "================================================================"
echo "Your production build is ready in the 'dist' folder."
echo ""
echo "🔧 Choose your deployment platform:"
echo ""
echo "OPTION 1: Vercel (Recommended)"
echo "  npm install -g vercel"
echo "  vercel --prod"
echo ""
echo "OPTION 2: Netlify"
echo "  npm install -g netlify-cli"
echo "  netlify deploy --prod --dir=dist"
echo ""
echo "OPTION 3: Manual Upload"
echo "  Upload the 'dist' folder contents to your web hosting"
echo "  Supported: AWS S3, Google Cloud, DigitalOcean, cPanel, etc."
echo ""
echo "⚙️  Don't forget to configure environment variables!"
echo "📝 Use the values from .env.production"
echo ""
echo "🎯 After deployment:"
echo "1. Test user registration/login"
echo "2. Verify all AI features work"
echo "3. Test payment integration"
echo "4. Check multi-language support"
echo "5. Start marketing your platform!"
echo ""
echo "🚀 Your NexusOne AI Platform is ready to generate revenue!"

# Show environment variables reminder
echo ""
echo "🔑 REQUIRED ENVIRONMENT VARIABLES:"
echo "=================================="
echo "✅ VITE_SUPABASE_URL (configured)"
echo "✅ VITE_SUPABASE_ANON_KEY (configured)"
echo "✅ VITE_CJ_API_KEY (configured)"
echo "⚠️  VITE_OPENAI_API_KEY (add your OpenAI key)"
echo "⚠️  VITE_FACEBOOK_ACCESS_TOKEN (configured - verify)"
echo "⚠️  VITE_STRIPE_PUBLIC_KEY (add your Stripe key)"
echo ""
echo "🎯 Get API keys from:"
echo "• OpenAI: https://platform.openai.com/api-keys"
echo "• Stripe: https://dashboard.stripe.com/apikeys"
echo "• ElevenLabs: https://elevenlabs.io/api"
echo "• D-ID: https://studio.d-id.com/account-settings/api-keys"
echo ""

exit 0