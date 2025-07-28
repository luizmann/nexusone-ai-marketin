# 🚀 NexusOne AI - Complete Production Deployment Guide

**Status**: Ready for Production Launch  
**Last Updated**: January 2025  
**Platform**: Supabase + Vercel  

---

## 📋 Deployment Overview

This guide covers the complete deployment of NexusOne AI platform:
- **Backend**: Supabase (Database + Edge Functions)
- **Frontend**: Vercel (React Application)
- **APIs**: All integrated and configured

---

## 🔑 Prerequisites

### Required Tools
```bash
# Install required CLI tools
npm install -g vercel
npm install -g supabase
npm install -g netlify-cli (optional)
```

### Required Accounts
- [x] Supabase Account (Project: hbfgtdxvlbkvkrjqxnac)
- [x] Vercel Account
- [x] OpenAI API Account
- [x] All API keys configured

---

## 🏗️ Part 1: Supabase Backend Deployment

### 1.1 Database Setup
```bash
# Login to Supabase
supabase login

# Link to existing project
supabase link --project-ref hbfgtdxvlbkvkrjqxnac

# Push database schema
supabase db push

# Verify migrations
supabase db diff
```

### 1.2 Edge Functions Deployment
```bash
# Deploy all Edge Functions (20 functions)
supabase functions deploy ai-content-generator
supabase functions deploy ai-video-generator
supabase functions deploy whatsapp-smart-booking
supabase functions deploy facebook-ads-automation
supabase functions deploy cj-dropshipping-import
supabase functions deploy magic-page-builder
supabase functions deploy campaign-optimizer
supabase functions deploy lead-scorer
supabase functions deploy nexbrain-assistant
supabase functions deploy product-scraper
supabase functions deploy image-generator
supabase functions deploy video-creator-luma
supabase functions deploy whatsapp-gupshup
supabase functions deploy facebook-campaign-creator
supabase functions deploy dropshipping-fulfillment
supabase functions deploy ai-copywriter
supabase functions deploy landing-page-generator
supabase functions deploy crm-automation
supabase functions deploy analytics-processor
supabase functions deploy user-onboarding

# Verify deployment
supabase functions list
```

### 1.3 Environment Variables (Supabase)
```bash
# Set production secrets
supabase secrets set OPENAI_API_KEY=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

supabase secrets set ELEVENLABS_API_KEY=sk_189b755ede03dfdf1633da77e125d682b44c1ddb54b08a07

supabase secrets set REPLICATE_API_TOKEN=r8_HbwQQ4NxMfhVPy0BS0xqOMkERd9B5JM440l66

supabase secrets set GUPSHUP_API_KEY=sk_d5fe7cdab5164e53bcbffdc428fd431e

supabase secrets set LUMA_API_KEY=luma-12423eab-79ee-4f52-ad44-00c485686cf2-ab1b6b03-15a1-4c76-b056-6765bf41ab05

supabase secrets set CJ_API_KEY=5e0e680914c6462ebcf39059b21e70a9

supabase secrets set FACEBOOK_ACCESS_TOKEN=EAAI0DOV8GvcBPK4ZBUTybkGl66FwZA1s45Dx3cSjOVEO4lzZAifzVR6lIoVbW6HcsP2L7x4b0065VirgfhzyfIGNCCA9QCynR3twQB01ZCqjolM7b0QfGtBpj5ZCZA5kyWONQsaYmZBRvy1ByAziVPZAot50fp9ZB4ro71pZAPk7iK4ynEMkhG2LBqUmg2VFWZCPAYQ74T3ocUZCL7u69pCaZAhqUe29gMZALb2jZB5YWQrfHbreY0hIgZDZD

supabase secrets set UNSPLASH_ACCESS_KEY=zZ5LsB2CAMUhbPca_UKw31ngzc1W3_hfxSPdz_aBUE

supabase secrets set NEXBRAIN_ASSISTANT_ID=asst_0jsx8eD6P3W9XGsSRRNU2Pfd

# Verify secrets
supabase secrets list
```

### 1.4 Storage Buckets Setup
```sql
-- Create storage buckets (run in Supabase SQL editor)
INSERT INTO storage.buckets (id, name, public) VALUES 
('avatars', 'avatars', true),
('landing-pages', 'landing-pages', true),
('generated-content', 'generated-content', true),
('user-uploads', 'user-uploads', false),
('video-assets', 'video-assets', true),
('ai-generated', 'ai-generated', false),
('documents', 'documents', false),
('audio-files', 'audio-files', true),
('templates', 'templates', true),
('campaigns', 'campaigns', false);
```

---

## 🌐 Part 2: Vercel Frontend Deployment

### 2.1 Project Setup
```bash
# Build the application
npm run build:prod

# Deploy to Vercel
vercel --prod

# Or use the configured script
npm run deploy:vercel
```

### 2.2 Environment Variables (Vercel)
Set these in Vercel Dashboard or via CLI:

```bash
# Required environment variables
vercel env add VITE_SUPABASE_URL production
# Value: https://hbfgtdxvlbkvkrjqxnac.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY production
# Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiZmd0ZHh2bGJrdmtyanlkHnhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY2NjA0NzcsImV4cCI6MjAyMjIzNjQ3N30.4L1VGpMOQR4zNjL5xVKjN8QX9hBf2wP0sA7rD3kF1mE

vercel env add VITE_APP_NAME production
# Value: NexusOne AI

vercel env add VITE_ENVIRONMENT production
# Value: production

vercel env add VITE_CJ_API_KEY production
# Value: 5e0e680914c6462ebcf39059b21e70a9

vercel env add VITE_FACEBOOK_ACCESS_TOKEN production
# Value: EAAI0DOV8GvcBPK4ZBUTybkGl66FwZA1s45Dx3cSjOVEO4lzZAifzVR6lIoVbW6HcsP2L7x4b0065VirgfhzyfIGNCCA9QCynR3twQB01ZCqjolM7b0QfGtBpj5ZCZA5kyWONQsaYmZBRvy1ByAziVPZAot50fp9ZB4ro71pZAPk7iK4ynEMkhG2LBqUmg2VFWZCPAYQ74T3ocUZCL7u69pCaZAhqUe29gMZALb2jZB5YWQrfHbreY0hIgZDZD
```

### 2.3 Domain Configuration
```bash
# Add custom domain (optional)
vercel domains add nexusone.ai
vercel domains add app.nexusone.ai
vercel domains add www.nexusone.ai

# Configure SSL (automatic with Vercel)
```

---

## 🔧 Part 3: Quick Deployment Scripts

### 3.1 One-Click Backend Deployment
```bash
#!/bin/bash
# deploy-backend.sh

echo "🚀 Deploying NexusOne AI Backend..."

# Deploy all Edge Functions
supabase functions deploy ai-content-generator
supabase functions deploy ai-video-generator  
supabase functions deploy whatsapp-smart-booking
supabase functions deploy facebook-ads-automation
supabase functions deploy cj-dropshipping-import
supabase functions deploy magic-page-builder
supabase functions deploy campaign-optimizer
supabase functions deploy lead-scorer
supabase functions deploy nexbrain-assistant
supabase functions deploy product-scraper
supabase functions deploy image-generator
supabase functions deploy video-creator-luma
supabase functions deploy whatsapp-gupshup
supabase functions deploy facebook-campaign-creator
supabase functions deploy dropshipping-fulfillment
supabase functions deploy ai-copywriter
supabase functions deploy landing-page-generator
supabase functions deploy crm-automation
supabase functions deploy analytics-processor
supabase functions deploy user-onboarding

echo "✅ Backend deployment complete!"
```

### 3.2 One-Click Frontend Deployment
```bash
#!/bin/bash
# deploy-frontend.sh

echo "🌐 Deploying NexusOne AI Frontend..."

# Build for production
npm run build:prod

# Deploy to Vercel
vercel --prod

echo "✅ Frontend deployment complete!"
```

### 3.3 Complete Deployment Script
```bash
#!/bin/bash
# deploy-complete.sh

echo "🚀 Complete NexusOne AI Deployment"
echo "=================================="

# 1. Backend deployment
echo "📊 Step 1: Deploying Backend..."
bash deploy-backend.sh

# 2. Frontend deployment  
echo "🌐 Step 2: Deploying Frontend..."
bash deploy-frontend.sh

# 3. Health check
echo "🔍 Step 3: Health Check..."
curl -f https://hbfgtdxvlbkvkrjqxnac.supabase.co/functions/v1/health-check || echo "⚠️ Backend health check failed"

echo "✅ Complete deployment finished!"
echo "🎯 Access your app at: https://nexusone.vercel.app"
```

---

## 📊 Part 4: Deployment Verification

### 4.1 Backend Health Check
```bash
# Test Edge Functions
curl https://hbfgtdxvlbkvkrjqxnac.supabase.co/functions/v1/ai-content-generator/health
curl https://hbfgtdxvlbkvkrjqxnac.supabase.co/functions/v1/nexbrain-assistant/health
curl https://hbfgtdxvlbkvkrjqxnac.supabase.co/functions/v1/whatsapp-smart-booking/health

# Check database connectivity
supabase db ping
```

### 4.2 Frontend Health Check
```bash
# Test main application
curl -f https://nexusone.vercel.app || echo "Frontend not accessible"

# Test API endpoints
curl -f https://nexusone.vercel.app/api/health || echo "API not accessible"

# Test critical features
curl -f https://nexusone.vercel.app/dashboard || echo "Dashboard not accessible"
```

### 4.3 API Integration Tests
```javascript
// test-apis.js
const testAPIs = async () => {
  const tests = [
    'OpenAI GPT-4',
    'ElevenLabs TTS',
    'Replicate Images', 
    'CJ Dropshipping',
    'Facebook Marketing',
    'WhatsApp Gupshup',
    'Luma Video AI'
  ];
  
  for (const api of tests) {
    console.log(`Testing ${api}...`);
    // Add specific API tests here
  }
};

testAPIs();
```

---

## 🛡️ Part 5: Security & Monitoring

### 5.1 Security Headers (Vercel)
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ]
}
```

### 5.2 Monitoring Setup
```bash
# Set up monitoring
vercel env add MONITORING_ENABLED production
vercel env add LOG_LEVEL production
# Value: info

# Configure alerts
vercel env add ALERT_EMAIL production
# Value: admin@nexusone.ai
```

---

## 🎯 Part 6: Post-Deployment Tasks

### 6.1 DNS Configuration
```bash
# Configure DNS records
# A record: nexusone.ai → Vercel IP
# CNAME: www.nexusone.ai → nexusone.vercel.app
# CNAME: app.nexusone.ai → nexusone.vercel.app
```

### 6.2 SSL Certificate
```bash
# Vercel automatically provides SSL
# Verify SSL status
curl -I https://nexusone.ai
```

### 6.3 Performance Optimization
```bash
# Enable edge caching
vercel env add EDGE_CACHE_ENABLED production
# Value: true

# Configure CDN
vercel env add CDN_ENABLED production  
# Value: true
```

---

## 📈 Part 7: Launch Checklist

### Pre-Launch ✅
- [x] All API keys configured
- [x] Database schema deployed
- [x] Edge Functions deployed  
- [x] Frontend built and deployed
- [x] Environment variables set
- [x] SSL certificates active
- [x] Domain configuration complete

### Post-Launch 🚀
- [ ] Monitor application logs
- [ ] Track user registrations
- [ ] Monitor API usage and costs
- [ ] Set up analytics
- [ ] Configure backup strategy
- [ ] Set up monitoring alerts
- [ ] Create support documentation

---

## 🔄 Part 8: Continuous Deployment

### 8.1 Auto-Deployment Setup
```yaml
# .github/workflows/deploy.yml
name: Deploy NexusOne AI
on:
  push:
    branches: [main]
    
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build:prod
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### 8.2 Staging Environment
```bash
# Create staging deployment
vercel --prod --scope staging

# Set staging environment variables
vercel env add VITE_ENVIRONMENT staging
```

---

## 📞 Support & Troubleshooting

### Common Issues
1. **Edge Functions not deploying**: Check Supabase CLI authentication
2. **Frontend build failing**: Verify Node.js version (18+)
3. **API keys not working**: Ensure secrets are set correctly
4. **Database connection issues**: Verify Supabase project settings

### Emergency Rollback
```bash
# Rollback to previous deployment
vercel rollback

# Rollback specific Edge Function
supabase functions deploy function-name --project-ref hbfgtdxvlbkvkrjqxnac
```

---

## 🎊 Deployment Complete!

Your NexusOne AI platform is now live and ready for users!

**Production URLs:**
- **Main App**: https://nexusone.vercel.app
- **API Base**: https://hbfgtdxvlbkvkrjqxnac.supabase.co/functions/v1
- **Dashboard**: https://nexusone.vercel.app/dashboard

**Next Steps:**
1. Monitor initial user registrations
2. Track API usage and optimize costs
3. Gather user feedback for improvements
4. Scale infrastructure as needed

---

*Deployment Guide - NexusOne AI Platform*  
*Version 1.0 - Production Ready*