#!/bin/bash

# 🚀 NexusOne AI - Production Migration Script
# This script helps migrate the NexusOne platform to a Git repository

set -e

echo "🚀 NexusOne AI - Git Repository Migration"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if repository name is provided
if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: Repository name required${NC}"
    echo "Usage: ./migrate-to-git.sh <repository-name>"
    echo "Example: ./migrate-to-git.sh nexusone-ai"
    exit 1
fi

REPO_NAME=$1
CURRENT_DIR=$(pwd)
MIGRATION_DIR="../${REPO_NAME}"

echo -e "${BLUE}📋 Migration Configuration${NC}"
echo "Repository Name: ${REPO_NAME}"
echo "Current Directory: ${CURRENT_DIR}"
echo "Migration Directory: ${MIGRATION_DIR}"
echo ""

# Create migration directory
echo -e "${YELLOW}📁 Creating migration directory...${NC}"
mkdir -p "$MIGRATION_DIR"
cd "$MIGRATION_DIR"

# Initialize Git repository
echo -e "${YELLOW}🔧 Initializing Git repository...${NC}"
git init
echo "# ${REPO_NAME}" > README.md

# Copy essential files
echo -e "${YELLOW}📋 Copying essential application files...${NC}"

# Core files
cp "${CURRENT_DIR}/package.json" ./
cp "${CURRENT_DIR}/package-lock.json" ./
cp "${CURRENT_DIR}/index.html" ./
cp "${CURRENT_DIR}/vite.config.ts" ./
cp "${CURRENT_DIR}/tsconfig.json" ./
cp "${CURRENT_DIR}/tailwind.config.js" ./
cp "${CURRENT_DIR}/components.json" ./

# Source directory
echo -e "${YELLOW}📁 Copying source code...${NC}"
cp -r "${CURRENT_DIR}/src" ./

# Supabase backend
echo -e "${YELLOW}🗄️ Copying Supabase backend...${NC}"
cp -r "${CURRENT_DIR}/supabase" ./

# Documentation
echo -e "${YELLOW}📚 Copying documentation...${NC}"
cp "${CURRENT_DIR}/PRD.md" ./
cp "${CURRENT_DIR}/NEXUSONE_COMPLETE_DOCUMENTATION.md" ./
cp "${CURRENT_DIR}/PRODUCTION_DEPLOYMENT_COMPLETE.md" ./
cp "${CURRENT_DIR}/API_INTEGRATION_FINAL_REPORT.md" ./

# Deployment configurations
echo -e "${YELLOW}🚀 Copying deployment configurations...${NC}"
cp "${CURRENT_DIR}/vercel.json" ./
cp "${CURRENT_DIR}/netlify.toml" ./

# Create .gitignore
echo -e "${YELLOW}📝 Creating .gitignore...${NC}"
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
/.pnp
.pnp.js

# Production builds
/dist
/build

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env.production

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
.vite.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# NYC test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Snowpack dependency directory (https://snowpack.dev/)
web_modules/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# GitHub Spark specific files
.spark-*
.file-manifest
.devcontainer/

# Supabase local development
supabase/.temp
EOF

# Create environment template
echo -e "${YELLOW}🔐 Creating environment template...${NC}"
cat > .env.example << 'EOF'
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_ASSISTANT_ID=your_assistant_id_here

# Video Generation APIs
LUMA_API_KEY=your_luma_api_key_here
RUNWAY_API_TOKEN=your_runway_token_here
REPLICATE_API_TOKEN=your_replicate_token_here

# Text-to-Speech
ELEVENLABS_API_KEY=your_elevenlabs_key_here

# Image APIs
UNSPLASH_ACCESS_KEY=your_unsplash_key_here

# WhatsApp Integration
GUPSHUP_API_KEY=your_gupshup_key_here

# CJ Dropshipping
CJ_DROPSHIPPING_API_KEY=your_cj_api_key_here

# Facebook Marketing
FACEBOOK_ACCESS_TOKEN=your_facebook_token_here
FACEBOOK_APP_ID=your_facebook_app_id_here
FACEBOOK_APP_SECRET=your_facebook_app_secret_here
EOF

# Create comprehensive README
echo -e "${YELLOW}📄 Creating comprehensive README...${NC}"
cat > README.md << 'EOF'
# 🚀 NexusOne AI - Global Marketing Automation Platform

<div align="center">
  <h3>AI-Powered All-in-One Marketing Suite</h3>
  <p>Transform anyone into a digital entrepreneur with automated marketing campaigns, dropshipping, and AI-generated content.</p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)
</div>

## 🌟 Features

### 🤖 AI-Powered Marketing
- **NexBrain AI Assistant** - GPT-4 powered business automation
- **Magic Pages** - AI-generated landing pages with drag & drop editor
- **Campaign Generator** - Complete marketing funnels in minutes
- **Video Creator** - AI video generation with Luma, Runway, and Replicate
- **Smart Copywriting** - Emotional sales copy generation

### 🛒 E-commerce & Dropshipping
- **CJ Dropshipping Integration** - Access to millions of products
- **Automated Product Import** - One-click product importing
- **Smart Product Catalog** - Curated trending products
- **Commission System** - 30% earnings on every sale
- **Order Fulfillment** - Automated order processing

### 📱 Multi-Channel Marketing
- **WhatsApp Automation** - AI chatbots and sales funnels
- **Facebook Ads** - Automated campaign creation and optimization
- **Instagram Marketing** - Content scheduling and engagement
- **Email Campaigns** - Drip campaigns and autoresponders
- **SMS Marketing** - Automated text message campaigns

### 📊 Business Intelligence
- **CRM System** - Lead management and scoring
- **Analytics Dashboard** - Real-time performance metrics
- **ROI Tracking** - Campaign profitability analysis
- **A/B Testing** - Automated split testing
- **Conversion Optimization** - AI-powered improvements

### 🌍 Global Reach
- **Multi-Language Support** - English, Spanish, Portuguese, Hebrew, Arabic
- **Currency Support** - Multiple payment methods and currencies
- **RTL Support** - Right-to-left language optimization
- **Global CDN** - Fast worldwide content delivery

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/nexusone-ai.git
cd nexusone-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your API keys
```

4. **Start development server**
```bash
npm run dev
```

5. **Deploy to production**
```bash
npm run deploy:vercel
# or
npm run deploy:netlify
```

## 📋 API Integrations

### Required APIs
- ✅ OpenAI (GPT-4, DALL-E, Assistants)
- ✅ Supabase (Database, Auth, Storage)
- ✅ Luma AI (Video generation)
- ✅ Runway ML (Video generation)
- ✅ Replicate (Image generation)
- ✅ ElevenLabs (Text-to-speech)
- ✅ Unsplash (Stock images)
- ✅ Gupshup (WhatsApp Business)
- ✅ CJ Dropshipping (Product catalog)

### Optional APIs
- Facebook Marketing API
- Instagram Basic Display API
- Google Ads API
- Stripe/PayPal (Payments)

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Edge Functions)
- **Authentication**: Supabase Auth
- **UI Components**: Shadcn/ui, Radix UI
- **Animation**: Framer Motion
- **Charts**: Recharts, D3.js
- **Deployment**: Vercel, Netlify

## 💰 Pricing Plans

### 🆓 Free Plan
- 50 credits/month
- 2 videos/month
- 2 landing pages/month
- 1 WhatsApp number
- Basic modules

### 🔥 Pro Plan - $97/month
- 500 credits/month
- 20 videos/month
- 20 landing pages/month
- 5 WhatsApp numbers
- Advanced modules

### 💎 Premium Plan - $297/month
- 2000 credits/month
- 100 videos/month
- Unlimited landing pages
- 20 WhatsApp numbers
- All modules + priority support

## 📚 Documentation

- [Complete Feature Documentation](./NEXUSONE_COMPLETE_DOCUMENTATION.md)
- [Production Deployment Guide](./PRODUCTION_DEPLOYMENT_COMPLETE.md)
- [API Integration Guide](./API_INTEGRATION_FINAL_REPORT.md)
- [Product Requirements](./PRD.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- 📧 Email: support@nexusone.ai
- 💬 Discord: [Join our community](https://discord.gg/nexusone)
- 📖 Documentation: [Full docs](./docs)

---

<div align="center">
  <p>Made with ❤️ by the NexusOne Team</p>
  <p>Empowering entrepreneurs worldwide with AI</p>
</div>
EOF

# Create GitHub workflows directory
echo -e "${YELLOW}⚙️ Creating GitHub Actions workflows...${NC}"
mkdir -p .github/workflows

cat > .github/workflows/deploy.yml << 'EOF'
name: Deploy to Production

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
      env:
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
    
    - name: Deploy to Vercel
      if: github.ref == 'refs/heads/main'
      run: npx vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
EOF

# Create LICENSE file
echo -e "${YELLOW}📜 Creating LICENSE file...${NC}"
cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2025 NexusOne AI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF

# Create security policy
echo -e "${YELLOW}🔒 Creating security policy...${NC}"
mkdir -p .github
cat > .github/SECURITY.md << 'EOF'
# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please send an email to security@nexusone.ai.

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will respond within 48 hours and provide updates every 72 hours until resolved.
EOF

# Create contributing guidelines
cat > .github/CONTRIBUTING.md << 'EOF'
# Contributing to NexusOne AI

We love your input! We want to make contributing to NexusOne AI as easy and transparent as possible.

## Development Process

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure the test suite passes
4. Make sure your code lints
5. Issue that pull request!

## Pull Request Process

1. Update the README.md with details of changes to the interface
2. Increase the version numbers in any examples files and the README.md
3. You may merge the Pull Request in once you have the sign-off of two other developers

## Any contributions you make will be under the MIT Software License

When you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project.

## Report bugs using Github's [issue tracker](https://github.com/YOUR_USERNAME/nexusone-ai/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/YOUR_USERNAME/nexusone-ai/issues/new).

## License

By contributing, you agree that your contributions will be licensed under its MIT License.
EOF

# Create deployment script
echo -e "${YELLOW}🚀 Creating deployment script...${NC}"
cat > deploy.sh << 'EOF'
#!/bin/bash

# NexusOne AI Deployment Script

set -e

echo "🚀 Deploying NexusOne AI..."

# Build the application
echo "📦 Building application..."
npm run build

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
npx vercel --prod

echo "✅ Deployment complete!"
EOF

chmod +x deploy.sh

# Create issue templates
mkdir -p .github/ISSUE_TEMPLATE

cat > .github/ISSUE_TEMPLATE/bug_report.md << 'EOF'
---
name: Bug report
about: Create a report to help us improve
title: '[BUG] '
labels: bug
assignees: ''

---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment (please complete the following information):**
 - OS: [e.g. iOS]
 - Browser [e.g. chrome, safari]
 - Version [e.g. 22]

**Additional context**
Add any other context about the problem here.
EOF

cat > .github/ISSUE_TEMPLATE/feature_request.md << 'EOF'
---
name: Feature request
about: Suggest an idea for this project
title: '[FEATURE] '
labels: enhancement
assignees: ''

---

**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
EOF

# Stage all files
echo -e "${YELLOW}📋 Staging files for commit...${NC}"
git add .

# Create initial commit
echo -e "${YELLOW}💾 Creating initial commit...${NC}"
git commit -m "🚀 Initial commit: NexusOne AI Platform

- Complete React + TypeScript application
- 60+ UI components with Shadcn/ui  
- 25+ pages and features
- Supabase backend with 15+ Edge Functions
- Multi-language support (EN/ES/PT/HE/AR)
- AI integrations (OpenAI, Luma, Runway, Replicate)
- WhatsApp automation and CRM
- Dropshipping marketplace
- Production-ready deployment configuration
- Comprehensive documentation and guides"

echo ""
echo -e "${GREEN}✅ Migration completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Create GitHub repository: https://github.com/new"
echo "2. Add remote origin: git remote add origin https://github.com/YOUR_USERNAME/${REPO_NAME}.git"
echo "3. Push to GitHub: git push -u origin main"
echo "4. Set up environment variables on deployment platform"
echo "5. Deploy Supabase backend: supabase functions deploy"
echo ""
echo -e "${BLUE}📁 Migration Directory: ${MIGRATION_DIR}${NC}"
echo ""
echo -e "${GREEN}🚀 Ready to launch NexusOne AI!${NC}"