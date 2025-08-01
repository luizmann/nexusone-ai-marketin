# 🚀 NexusOne AI - Global Marketing Automation Platform

<div align="center">

![NexusOne AI Logo](https://img.shields.io/badge/NexusOne-AI%20Platform-blue?style=for-the-badge&logo=react)

**The Complete AI-Powered Marketing Automation SaaS Platform**

[![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green?logo=supabase)](https://supabase.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-orange?logo=openai)](https://openai.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

[🌐 Live Demo](https://nexusone-ai.vercel.app) | [📖 Documentation](./docs) | [🚀 Quick Start](#quick-start) | [🤝 Contributing](./CONTRIBUTING.md)

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [🌟 Features](#features)
- [🏗️ Architecture](#architecture)
- [🚀 Quick Start](#quick-start)
- [🔧 Installation](#installation)
- [🌍 Multi-Language Support](#multi-language-support)
- [🔌 API Integrations](#api-integrations)
- [💰 Pricing & Plans](#pricing--plans)
- [📱 Modules](#modules)
- [🛠️ Development](#development)
- [🚀 Deployment](#deployment)
- [📊 Usage Analytics](#usage-analytics)
- [🔒 Security](#security)
- [🤝 Contributing](#contributing)
- [📄 License](#license)

---

## Overview

**NexusOne AI** is a comprehensive SaaS platform designed to democratize digital marketing through artificial intelligence. Built for entrepreneurs, small businesses, and digital marketers worldwide, it automates the entire marketing funnel from product discovery to sales conversion.

### 🎯 Mission
Transform anyone into a successful digital entrepreneur using AI-powered automation, regardless of technical expertise.

### 🌍 Global Reach
- **5 Languages**: English, Portuguese, Spanish, Hebrew, Arabic
- **RTL Support**: Full right-to-left language compatibility
- **Multi-Currency**: Support for global payment systems
- **Timezone Aware**: Automatic timezone detection and conversion

---

## 🌟 Features

### 🤖 AI-Powered Core
- **NexBrain Agent**: Custom GPT-4 assistant for marketing automation
- **Intelligent Campaign Generation**: Complete marketing funnels in 5 minutes
- **Dynamic Content Creation**: AI-generated copy, images, and videos
- **Smart Product Selection**: AI-curated dropshipping products

### 📈 Marketing Automation
- **Magic Pages**: AI-generated landing pages with conversion optimization
- **Video Creator**: Automated video generation using Luma AI, Runway ML
- **Facebook Ads Generator**: Complete ad campaigns with targeting
- **WhatsApp Marketing**: Automated sales conversations and booking
- **Campaign Analytics**: Real-time performance tracking

### 🛒 E-commerce Integration
- **Dropshipping Marketplace**: 200+ curated products
- **CJ Dropshipping API**: Direct product import and fulfillment
- **Automated Order Processing**: From lead to delivery
- **Commission System**: 30% client, 70% platform revenue sharing

### 📊 Business Intelligence
- **Advanced CRM**: Lead scoring and pipeline management
- **Revenue Analytics**: ROI tracking and optimization
- **Customer Insights**: Behavioral analysis and segmentation
- **Performance Dashboards**: Real-time business metrics

---

## 🏗️ Architecture

### Frontend Stack
```
React 18.2.0 + TypeScript
├── UI Framework: Shadcn/ui (40+ components)
├── Styling: Tailwind CSS + Custom Design System
├── State Management: Context API + Custom Hooks
├── Routing: React Router DOM
├── Forms: React Hook Form + Zod Validation
├── Charts: Recharts + D3.js
└── Animations: Framer Motion
```

### Backend Infrastructure
```
Supabase Ecosystem
├── Database: PostgreSQL with RLS
├── Authentication: Supabase Auth
├── Storage: Supabase Storage
├── Edge Functions: 20+ Serverless Functions
├── Real-time: WebSocket subscriptions
└── API Gateway: Auto-generated REST API
```

### AI & External APIs
```
AI Services
├── OpenAI: GPT-4, DALL-E, Assistants API
├── Luma AI: Video generation
├── Runway ML: Video creation
├── ElevenLabs: Text-to-speech
├── Replicate: Image generation
└── Facebook Marketing API
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key

### 1-Minute Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/nexusone-ai.git
cd nexusone-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your API keys to .env.local

# Start development server
npm run dev
```

### Environment Variables
```env
# Required API Keys
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key

# Optional API Keys (for full features)
VITE_LUMA_API_KEY=your_luma_api_key
VITE_RUNWAY_API_KEY=your_runway_api_key
VITE_ELEVEN_LABS_API_KEY=your_eleven_labs_api_key
VITE_FACEBOOK_ACCESS_TOKEN=your_facebook_token
VITE_CJ_DROPSHIPPING_API_KEY=your_cj_api_key
```

---

## 🔧 Installation

### Development Setup

1. **Clone and Install**
```bash
git clone https://github.com/yourusername/nexusone-ai.git
cd nexusone-ai
npm install
```

2. **Database Setup**
```bash
# Initialize Supabase
npx supabase init
npx supabase start

# Run migrations
npx supabase db reset
```

3. **Deploy Edge Functions**
```bash
# Deploy all backend functions
npm run deploy:functions

# Or deploy individually
npx supabase functions deploy ai-campaign-generator
npx supabase functions deploy magic-pages-generator
npx supabase functions deploy video-creator
```

4. **Start Development**
```bash
npm run dev
```

### Production Deployment

#### Vercel (Recommended)
```bash
# Deploy to Vercel
npm run deploy:vercel

# Or use Vercel CLI
vercel --prod
```

#### Netlify
```bash
# Deploy to Netlify
npm run deploy:netlify

# Or use Netlify CLI
netlify deploy --prod --dir=dist
```

#### Docker
```bash
# Build and run with Docker
docker build -t nexusone-ai .
docker run -p 3000:3000 nexusone-ai
```

---

## 🌍 Multi-Language Support

### Supported Languages
- 🇺🇸 **English** (en)
- 🇧🇷 **Portuguese** (pt)
- 🇪🇸 **Spanish** (es)
- 🇮🇱 **Hebrew** (he) - RTL Support
- 🇸🇦 **Arabic** (ar) - RTL Support

### RTL Implementation
```typescript
// Automatic direction detection
const isRTL = ['he', 'ar'].includes(currentLanguage)

// Applied globally
document.dir = isRTL ? 'rtl' : 'ltr'
```

### Adding New Languages
1. Create translation file: `src/translations/[lang].json`
2. Add language option in `LanguageContext`
3. Update font loading in `index.html`
4. Test RTL layout if applicable

---

## 🔌 API Integrations

### AI Services
| Service | Purpose | Cost per Use |
|---------|---------|--------------|
| OpenAI GPT-4 | Content generation | $0.03/1K tokens |
| Luma AI | Video creation | $0.10/video |
| Runway ML | Advanced video | $0.05/second |
| ElevenLabs | Text-to-speech | $0.30/1K chars |
| DALL-E 3 | Image generation | $0.04/image |

### Marketing APIs
| Service | Purpose | Features |
|---------|---------|----------|
| Facebook Marketing | Ad campaigns | Targeting, optimization |
| WhatsApp Business | Customer communication | Chatbots, automation |
| Google Ads | Search advertising | Keyword targeting |
| YouTube API | Video marketing | Upload, analytics |

### E-commerce APIs
| Service | Purpose | Integration |
|---------|---------|-------------|
| CJ Dropshipping | Product sourcing | Catalog, fulfillment |
| Shopify | Store management | Products, orders |
| Stripe | Payments | Subscriptions, one-time |
| PayPal | Global payments | Multi-currency support |

---

## 💰 Pricing & Plans

### Free Plan - $0/month
- ✅ 50 credits/month
- ✅ 2 videos/month
- ✅ 2 landing pages/month
- ✅ 1 WhatsApp number
- ✅ Basic modules (5)
- ❌ Advanced AI features
- ❌ Custom branding

### Pro Plan - $97/month
- ✅ 500 credits/month
- ✅ 20 videos/month
- ✅ 20 landing pages/month
- ✅ 5 WhatsApp numbers
- ✅ Advanced modules (8)
- ✅ Priority support
- ✅ Custom branding

### Premium Plan - $297/month
- ✅ 2000 credits/month
- ✅ 100 videos/month
- ✅ Unlimited landing pages
- ✅ 20 WhatsApp numbers
- ✅ All modules (10)
- ✅ White-label options
- ✅ Dedicated support
- ✅ API access

---

## 📱 Modules

### 🎯 Core Modules (4)
1. **Dashboard Central** - Business overview and analytics
2. **Credit System** - Usage tracking and billing
3. **User Management** - Profile and preferences
4. **Analytics Engine** - Performance metrics

### 🤖 AI Generation (3)
5. **Magic Pages** - AI landing page creator
6. **AI Agents** - Custom chatbot creation
7. **Generate Income** - Business idea generator

### 🎬 Video Generation (2)
8. **Video Creator** - Automated video production
9. **YouTube Shorts** - Short-form content creation

### 📈 Marketing (4)
10. **Facebook Ads** - Campaign automation
11. **WhatsApp Marketing** - Conversation automation
12. **CRM** - Customer relationship management
13. **Campaign Manager** - Multi-channel campaigns

### 🛒 E-commerce (3)
14. **Product Scraper** - Data extraction tools
15. **Dropshipping** - Product sourcing and fulfillment
16. **Store Manager** - E-commerce operations

### ⚡ Automation (2)
17. **Autopilot** - Fully automated marketing
18. **Voice Commands** - Voice-controlled interface

### 🔗 Integrations (3)
19. **API Manager** - External service connections
20. **Connections** - Platform integrations
21. **Webhooks** - Real-time data sync

### 🏢 Enterprise (2)
22. **Admin Dashboard** - Platform management
23. **White Label** - Reseller solutions

---

## 🛠️ Development

### Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Shadcn/ui components
│   ├── layout/          # Layout components
│   └── modules/         # Feature-specific components
├── pages/               # Application pages
├── contexts/            # React contexts
├── hooks/               # Custom React hooks
├── services/            # API services
├── types/               # TypeScript definitions
├── utils/               # Utility functions
└── translations/        # i18n files

supabase/
├── functions/           # Edge Functions
├── migrations/          # Database migrations
└── config.toml         # Supabase configuration
```

### Key Components

#### NexBrain AI Assistant
```typescript
// AI Assistant integration
const nexBrain = {
  assistantId: "asst_0jsx8eD6P3W9XGsSRRNU2Pfd",
  model: "gpt-4",
  tools: [
    "import_dropshipping_product",
    "generate_sales_page",
    "generate_facebook_ads_campaign",
    "create_ai_video"
  ]
}
```

#### Campaign Generator
```typescript
// Complete marketing funnel generation
async function generateCampaign(productUrl: string) {
  const campaign = await nexBrain.createCampaign({
    product: productUrl,
    includeVideo: true,
    includeLandingPage: true,
    includeAds: true,
    includeWhatsApp: true
  })
  
  return campaign
}
```

### Development Commands
```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run type-check       # TypeScript validation

# Database
npm run db:reset         # Reset database
npm run db:migrate       # Run migrations
npm run db:generate      # Generate types

# Functions
npm run functions:serve  # Serve functions locally
npm run functions:deploy # Deploy to Supabase

# Testing
npm run test             # Run tests
npm run test:e2e         # End-to-end tests
npm run test:api         # API integration tests
```

---

## 🚀 Deployment

### Automated Deployment

The repository includes automated deployment scripts for multiple platforms:

#### Quick Deploy (All Platforms)
```bash
./deploy-nexusone-complete.sh
```

#### Platform-Specific Deployment

**Vercel**
```bash
npm run deploy:vercel
# or
./deploy-vercel-complete.sh
```

**Netlify**
```bash
npm run deploy:netlify
# or
./deploy-netlify.sh
```

**Supabase Functions**
```bash
npm run deploy:functions
# or
./deploy-supabase-complete.sh
```

### Manual Deployment Steps

1. **Environment Setup**
```bash
# Copy and configure environment
cp .env.example .env.production
# Add all required API keys
```

2. **Build Application**
```bash
npm run build
```

3. **Deploy Backend**
```bash
npx supabase functions deploy --create-jwt-secret
```

4. **Deploy Frontend**
```bash
# Vercel
vercel --prod

# Netlify
netlify deploy --prod --dir=dist

# Custom server
npm run start
```

### Environment Configuration

#### Required Environment Variables
```env
# Database
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# AI Services
VITE_OPENAI_API_KEY=sk-...
VITE_OPENAI_ASSISTANT_ID=asst_...

# Video Generation
VITE_LUMA_API_KEY=luma-...
VITE_RUNWAY_API_KEY=rw-...

# Marketing
VITE_FACEBOOK_ACCESS_TOKEN=your-token
VITE_GUPSHUP_API_KEY=your-gupshup-key

# E-commerce
VITE_CJ_DROPSHIPPING_API_KEY=your-cj-key
```

#### Production Configuration
```json
{
  "name": "nexusone-ai",
  "version": "1.0.0",
  "scripts": {
    "start": "vite preview --port 3000",
    "build": "vite build",
    "deploy": "npm run build && vercel --prod"
  }
}
```

---

## 📊 Usage Analytics

### Built-in Analytics
- **User Engagement**: Page views, session duration, feature usage
- **Campaign Performance**: Click-through rates, conversion rates, ROI
- **Revenue Tracking**: Subscription metrics, churn analysis, LTV
- **AI Usage**: API calls, credit consumption, feature popularity

### Custom Events
```typescript
// Track custom events
analytics.track('campaign_generated', {
  type: 'complete_funnel',
  product_category: 'electronics',
  credits_used: 150,
  generation_time: 45
})
```

### Performance Monitoring
- **Real-time Dashboards**: Grafana + Prometheus
- **Error Tracking**: Sentry integration
- **API Monitoring**: Uptime and response time tracking
- **User Feedback**: In-app feedback collection

---

## 🔒 Security

### Database Security
```sql
-- Row Level Security (RLS) policies
CREATE POLICY "Users can only see their own data" 
ON profiles FOR ALL 
TO authenticated 
USING (auth.uid() = id);
```

### API Security
- **JWT Authentication**: Supabase Auth tokens
- **Rate Limiting**: Per-user API quotas
- **Input Validation**: Zod schema validation
- **CORS Configuration**: Restricted origins

### Privacy & Compliance
- **GDPR Compliant**: Data export and deletion
- **SOC 2 Ready**: Security frameworks
- **Encryption**: Data at rest and in transit
- **Audit Logs**: Complete activity tracking

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Process
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- **TypeScript**: Strict type checking
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks

### Testing Requirements
- Unit tests for utilities and hooks
- Integration tests for API endpoints
- E2E tests for critical user flows
- Performance tests for heavy operations

---

## 📞 Support & Community

### Getting Help
- 📚 **Documentation**: [Full docs](./docs)
- 💬 **Discord Community**: [Join us](https://discord.gg/nexusone)
- 📧 **Email Support**: support@nexusone.ai
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/yourusername/nexusone-ai/issues)

### Roadmap
- **Q1 2025**: Mobile app (PWA)
- **Q2 2025**: Enterprise features
- **Q3 2025**: White-label solutions
- **Q4 2025**: Global expansion

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- **OpenAI** for GPT-4 and AI capabilities
- **Supabase** for backend infrastructure
- **Vercel** for hosting and deployment
- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first approach
- **Shadcn/ui** for beautiful components

---

<div align="center">

**Made with ❤️ by the NexusOne AI Team**

[🌐 Website](https://nexusone.ai) | [📱 Demo](https://demo.nexusone.ai) | [📧 Contact](mailto:hello@nexusone.ai)

⭐ **Star this repo if it helped you!**

</div>