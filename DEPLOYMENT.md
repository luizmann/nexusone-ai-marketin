# NexusOne AI - Deployment Guide

## 🚀 Quick Deploy to Vercel

### Prerequisites
- Vercel account
- Supabase project
- All API keys from .env.example

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```

### Step 3: Set Environment Variables
Create `.env.local` file with your actual API keys:

```bash
# Copy the example file
cp .env.example .env.local

# Edit with your real API keys
nano .env.local
```

### Step 4: Deploy to Vercel
```bash
# Build the project
npm run build

# Deploy to production
vercel --prod
```

### Step 5: Configure Environment Variables in Vercel

In your Vercel dashboard, add these environment variables:

#### Core Services
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

#### AI Services
- `OPENAI_API_KEY`: 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
- `OPENAI_ASSISTANT_ID`: asst_0jsx8eD6P3W9XGsSRRNU2Pfd
- `ELEVENLABS_API_KEY`: sk_189b755ede03dfdf1633da77e125d682b44c1ddb54b08a07
- `REPLICATE_API_TOKEN`: r8_HbwQQ4NxMfhVPy0BS0xqOMkERd9B5JM440l66
- `LUMA_API_KEY`: luma-12423eab-79ee-4f52-ad44-00c485686cf2-ab1b6b03-15a1-4c76-b056-6765bf41ab05
- `GUPSHUP_API_KEY`: sk_d5fe7cdab5164e53bcbffdc428fd431e

#### E-commerce
- `CJ_DROPSHIPPING_API_KEY`: 5e0e680914c6462ebcf39059b21e70a9

#### Marketing
- `FACEBOOK_ACCESS_TOKEN`: EAAI0DOV8GvcBPK4ZBUTybkGl66FwZA1s45Dx3cSjOVEO4lzZAifzVR6lIoVbW6HcsP2L7x4b0065VirgfhzyfIGNCCA9QCynR3twQB01ZCqjolM7b0QfGtBpj5ZCZA5kyWONQsaYmZBRvy1ByAziVPZAot50fp9ZB4ro71pZAPk7iK4ynEMkhG2LBqUmg2VFWZCPAYQ74T3ocUZCL7u69pCaZAhqUe29gMZALb2jZB5YWQrfHbreY0hIgZDZD

#### Media
- `UNSPLASH_ACCESS_KEY`: -zZ5LsB2CAMUhbPca_UKw31ngzc1W3_hfxSPdz_aBUE

## 🗄️ Supabase Edge Functions Deployment

### Install Supabase CLI
```bash
npm install -g supabase
```

### Login to Supabase
```bash
supabase login
```

### Link to your project
```bash
supabase link --project-ref YOUR_PROJECT_REF
```

### Deploy Edge Functions
```bash
# Deploy all functions
supabase functions deploy ai-campaign-generator
supabase functions deploy ai-content-generator
supabase functions deploy ai-video-generator
supabase functions deploy cj-dropshipping-catalog
supabase functions deploy cj-dropshipping-order
supabase functions deploy dropshipping-import
supabase functions deploy facebook-ads-manager
supabase functions deploy generate-income
supabase functions deploy magic-pages-generator
supabase functions deploy nexbrain-assistant
supabase functions deploy product-scraper
supabase functions deploy whatsapp-automation
supabase functions deploy user-analytics
supabase functions deploy payment-processor
supabase functions deploy image-generator
supabase functions deploy video-creator
supabase functions deploy landing-page-builder
supabase functions deploy campaign-optimizer
supabase functions deploy lead-manager
supabase functions deploy notification-service
```

## 🔧 Post-Deployment Setup

### 1. Domain Configuration
1. Go to your Vercel dashboard
2. Add your custom domain
3. Configure DNS records
4. Enable SSL certificate

### 2. Database Setup
1. Run database migrations in Supabase
2. Set up Row Level Security policies
3. Create necessary tables and views
4. Configure triggers and functions

### 3. API Testing
Test each integration:
- OpenAI Assistant (NexBrain)
- Video generation (Luma AI)
- Image generation (Replicate)
- Voice synthesis (ElevenLabs)
- WhatsApp integration (Gupshup)
- CJ Dropshipping API
- Facebook Marketing API

### 4. Monitoring Setup
1. Enable Vercel Analytics
2. Set up Supabase monitoring
3. Configure error tracking
4. Set up performance monitoring

## 🚨 Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Ensure all variables are set in Vercel dashboard
   - Check variable names match exactly
   - Redeploy after adding variables

2. **API Rate Limits**
   - Monitor usage in each service
   - Implement proper rate limiting
   - Set up alerts for quota limits

3. **CORS Issues**
   - Configure proper origins in Supabase
   - Set up CORS policies for each API
   - Test with production domain

4. **Database Connection Issues**
   - Verify connection strings
   - Check firewall settings
   - Ensure proper SSL configuration

## 📊 Performance Optimization

1. **Frontend Optimization**
   - Enable Vercel edge caching
   - Optimize images and assets
   - Implement code splitting

2. **Backend Optimization**
   - Use connection pooling
   - Implement query optimization
   - Set up Redis caching

3. **API Optimization**
   - Implement request caching
   - Use batch requests where possible
   - Set up proper error handling

## 🔐 Security Checklist

- [ ] Environment variables secured
- [ ] API keys rotated regularly
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Input validation implemented
- [ ] Rate limiting enabled
- [ ] Authentication verified
- [ ] Database access controlled

## 📈 Post-Launch Tasks

1. **Analytics Setup**
   - Google Analytics
   - Mixpanel/Amplitude
   - Custom event tracking
   - User behavior analysis

2. **Marketing Integration**
   - Facebook Pixel
   - Google Tag Manager
   - Email marketing setup
   - Social media integration

3. **Support System**
   - Help desk integration
   - Documentation site
   - Video tutorials
   - Community forum

## 🎯 Success Metrics

Track these KPIs:
- User registration rate
- Feature adoption rate
- API usage metrics
- Revenue per user
- Customer satisfaction
- System uptime
- Performance metrics

Your NexusOne AI platform is now ready for global launch! 🚀