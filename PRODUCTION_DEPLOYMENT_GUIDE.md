# 🚀 NexusOne AI - Production Deployment Guide

## Overview
This guide covers the complete deployment of NexusOne AI to Vercel for global launch with all API integrations configured.

## Prerequisites

### Required Tools
- Node.js 18+ 
- npm or yarn
- Vercel CLI (`npm i -g vercel`)
- Git

### API Keys Required
All API keys are already configured for production:

#### Core APIs (Required)
- ✅ OpenAI API Key: `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`
- ✅ OpenAI Assistant ID: `asst_0jsx8eD6P3W9XGsSRRNU2Pfd`
- ✅ Supabase URL: `https://hbfgtdxvlbkvkrjqxnac.supabase.co`
- ✅ Supabase Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

#### AI Services (Configured)
- ✅ Luma AI: `luma-12423eab-79ee-4f52-ad44-00c485686cf2-ab1b6b03-15a1-4c76-b056-6765bf41ab05`
- ✅ ElevenLabs: `sk_189b755ede03dfdf1633da77e125d682b44c1ddb54b08a07`
- ✅ Replicate: `r8_HbwQQ4NxMfhVPy0BS0xqOMkERd9B5JM440l66`
- ✅ Unsplash: `-zZ5LsB2CAMUhbPca_UKw31ngzc1W3_hfxSPdz_aBUE`

#### Marketing APIs (Configured)
- ✅ Gupshup WhatsApp: `sk_d5fe7cdab5164e53bcbffdc428fd431e`
- ✅ Facebook: `EAAI0DOV8GvcBPK4ZBUTybkGl66FwZA1s45Dx3cSjOVEO4lzZAifzVR6lIoVbW6HcsP2L7x4b0065VirgfhzyfIGNCCA9QCynR3twQB01ZCqjolM7b0QfGtBpj5ZCZA5kyWONQsaYmZBRvy1ByAziVPZAot50fp9ZB4ro71pZAPk7iK4ynEMkhG2LBqUmg2VFWZCPAYQ74T3ocUZCL7u69pCaZAhqUe29gMZALb2jZB5YWQrfHbreY0hIgZDZD`
- ✅ CJ Dropshipping: `5e0e680914c6462ebcf39059b21e70a9`

## Quick Deployment (Recommended)

### Option 1: Automated Script
```bash
# Make script executable
chmod +x deploy-production-vercel.sh

# Run automated deployment
./deploy-production-vercel.sh
```

### Option 2: Manual Deployment
```bash
# 1. Install dependencies
npm ci

# 2. Build for production
npm run build:prod

# 3. Deploy to Vercel
vercel --prod

# 4. Configure environment variables
vercel env add VITE_OPENAI_API_KEY production
# ... (add all other variables)
```

## Detailed Deployment Steps

### Step 1: Validate APIs
```bash
# Test all API integrations
node production-api-validator.js
```

Expected output: All APIs should show ✅ PASS status

### Step 2: Build Application
```bash
# Clean previous builds
rm -rf dist/

# Install dependencies
npm ci

# Type check
npm run type-check

# Build for production
NODE_ENV=production npm run build:prod
```

### Step 3: Deploy to Vercel

#### Initialize Vercel
```bash
# Login to Vercel
vercel login

# Initialize project
vercel
```

#### Configure Environment Variables
```bash
# Core APIs
vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production
vercel env add VITE_OPENAI_API_KEY production
vercel env add VITE_OPENAI_ASSISTANT_ID production

# AI Services
vercel env add VITE_LUMA_API_KEY production
vercel env add VITE_ELEVEN_LABS_API_KEY production
vercel env add VITE_REPLICATE_API_TOKEN production
vercel env add VITE_UNSPLASH_ACCESS_KEY production

# Marketing APIs
vercel env add VITE_GUPSHUP_API_KEY production
vercel env add VITE_FACEBOOK_ACCESS_TOKEN production
vercel env add VITE_FACEBOOK_APP_ID production
vercel env add VITE_CJ_API_KEY production
```

#### Deploy to Production
```bash
# Deploy to production
vercel --prod
```

### Step 4: Verify Deployment

#### Check Deployment Status
```bash
# List deployments
vercel ls

# Check deployment logs
vercel logs
```

#### Test Production Features
1. Visit deployed URL
2. Test user registration/login
3. Test AI content generation
4. Test video creation
5. Test WhatsApp integration
6. Test Facebook Ads creation
7. Test dropshipping products

## Production Configuration

### Environment Variables
All environment variables are configured in `vercel.json`:

```json
{
  "env": {
    "VITE_SUPABASE_URL": "https://hbfgtdxvlbkvkrjqxnac.supabase.co",
    "VITE_SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "VITE_OPENAI_API_KEY": "sk-proj-iK3l7-pTvRbXgZKErx4MTjafV3tSCdu1...",
    // ... all other API keys
  }
}
```

### Feature Flags
```bash
VITE_ENABLE_VIDEO_GENERATION=true
VITE_ENABLE_DROPSHIPPING=true
VITE_ENABLE_WHATSAPP=true
VITE_ENABLE_FACEBOOK_ADS=true
VITE_ENABLE_AI_AGENTS=true
```

### Multi-Language Support
```bash
VITE_DEFAULT_LANGUAGE=en
VITE_SUPPORTED_LANGUAGES=en,pt,es,he,ar
```

## Backend Deployment (Supabase)

### Edge Functions
Deploy all edge functions to Supabase:

```bash
# Deploy all functions
supabase functions deploy --project-ref hbfgtdxvlbkvkrjqxnac

# Deploy specific function
supabase functions deploy ai-campaign-generator --project-ref hbfgtdxvlbkvkrjqxnac
```

### Database Schema
Ensure all tables are created in Supabase:
- users
- user_credits
- campaigns
- generated_content
- ai_agents
- whatsapp_numbers
- facebook_campaigns
- dropshipping_products

## Security Configuration

### Headers
Security headers are configured in `vercel.json`:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

### API Protection
- Rate limiting: 1000 requests/hour
- CORS configured for production domain
- API keys stored as environment variables
- JWT authentication for user sessions

## Monitoring & Analytics

### Error Tracking
- Sentry integration configured
- Real-time error monitoring
- Performance tracking

### Analytics
- Google Analytics configured
- User behavior tracking
- Conversion funnel analysis

### Health Checks
- API endpoint monitoring
- Database connection checks
- Third-party service status

## Post-Deployment Checklist

### Immediate Actions
- [ ] Verify all features work in production
- [ ] Test payment processing (if enabled)
- [ ] Check API rate limits
- [ ] Verify email notifications
- [ ] Test mobile responsiveness

### Marketing Launch
- [ ] Set up Google Analytics goals
- [ ] Configure Facebook Pixel
- [ ] Create landing page campaigns
- [ ] Set up affiliate program
- [ ] Launch social media campaigns

### Operations
- [ ] Set up monitoring alerts
- [ ] Configure backup procedures
- [ ] Document troubleshooting steps
- [ ] Train support team
- [ ] Prepare scaling plan

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and rebuild
rm -rf node_modules/ dist/
npm ci
npm run build:prod
```

#### API Integration Errors
```bash
# Validate API keys
node production-api-validator.js

# Check environment variables
vercel env ls
```

#### Performance Issues
```bash
# Analyze bundle size
npm run build:prod -- --analyze

# Check lighthouse score
npx lighthouse https://your-domain.vercel.app
```

### Support Contacts
- Technical Issues: dev@nexusone.ai
- API Issues: api@nexusone.ai
- Emergency: emergency@nexusone.ai

## Success Metrics

### Technical KPIs
- ✅ 99.9% uptime
- ✅ < 3s page load time
- ✅ 90+ Lighthouse score
- ✅ < 1% error rate

### Business KPIs
- User registrations: Target 1000/month
- Feature adoption: > 70%
- Customer satisfaction: > 4.5/5
- Revenue growth: 20% monthly

## Next Steps After Launch

### Phase 1 (Month 1)
- Monitor system performance
- Fix critical bugs
- Gather user feedback
- Optimize conversion funnel

### Phase 2 (Month 2-3)
- Add new AI models
- Expand language support
- Integrate more marketing APIs
- Launch mobile app

### Phase 3 (Month 4-6)
- Enterprise features
- White-label solutions
- API marketplace
- International expansion

---

## Quick Launch Commands

```bash
# Complete deployment in one command
npm run deploy:all

# Or step by step
npm run build:prod
npm run deploy:vercel
npm run deploy:supabase
npm run validate
```

🚀 **NexusOne AI is ready for global launch!**