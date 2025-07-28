# 🚀 NexusOne AI - Production Deployment Guide

## 📋 Quick Start Deployment

### Option 1: Automated Script Deployment

```bash
# 1. Make script executable
chmod +x deploy-production.sh

# 2. Run deployment
./deploy-production.sh
```

### Option 2: Manual Step-by-Step Deployment

#### Step 1: Environment Setup
```bash
# Install Supabase CLI
npm install -g supabase

# Install Vercel CLI (optional)
npm install -g vercel

# Copy environment file
cp .env.production .env
```

#### Step 2: Build Application
```bash
# Install dependencies
npm install

# Build for production
npm run build
```

#### Step 3: Deploy Backend (Supabase)
```bash
# Login to Supabase
supabase login

# Link to production project
supabase link --project-ref hbfgtdxvlbkvkrjqxnac

# Deploy Edge Functions
supabase functions deploy ai-content-generation
supabase functions deploy ai-content-generator
supabase functions deploy cj-dropshipping-catalog
supabase functions deploy cj-dropshipping-order
supabase functions deploy dropshipping-import
supabase functions deploy facebook-ads-manager
supabase functions deploy landing-page-builder
supabase functions deploy luma-video-ai
supabase functions deploy nexbrain-chat
supabase functions deploy nexus-api-manager
supabase functions deploy product-scraper
supabase functions deploy save-api-config
supabase functions deploy test-api-connection
supabase functions deploy unsplash-api
supabase functions deploy usage-tracker
supabase functions deploy video-generator
supabase functions deploy webhook-handler
supabase functions deploy whatsapp-automation

# Configure API keys
supabase secrets set OPENAI_API_KEY="your_openai_key"
supabase secrets set OPENAI_ASSISTANT_ID="your_assistant_id"
supabase secrets set ELEVENLABS_API_KEY="your_elevenlabs_key"
supabase secrets set REPLICATE_API_TOKEN="your_replicate_token"
supabase secrets set LUMA_API_KEY="your_luma_key"
supabase secrets set GUPSHUP_API_KEY="your_gupshup_key"
supabase secrets set FACEBOOK_ACCESS_TOKEN="your_facebook_token"
supabase secrets set FACEBOOK_APP_ID="your_facebook_app_id"
supabase secrets set CJ_DROPSHIPPING_API_KEY="your_cj_key"
supabase secrets set UNSPLASH_ACCESS_KEY="your_unsplash_key"
```

#### Step 4: Deploy Frontend

##### Option A: Vercel
```bash
# Deploy to Vercel
vercel --prod

# Set environment variables in Vercel Dashboard:
# - VITE_SUPABASE_URL=https://hbfgtdxvlbkvkrjqxnac.supabase.co
# - VITE_SUPABASE_ANON_KEY=your_anon_key
```

##### Option B: Netlify
```bash
# Deploy using Netlify CLI
netlify deploy --prod --dir=dist

# Or connect Git repository to Netlify Dashboard
```

##### Option C: GitHub Pages
```bash
# Build and deploy to GitHub Pages
npm run build
# Then upload dist/ folder to your repository
```

## 🌍 Production Configuration

### Backend (Supabase)
- **Project ID**: `hbfgtdxvlbkvkrjqxnac`
- **URL**: `https://hbfgtdxvlbkvkrjqxnac.supabase.co`
- **Database**: PostgreSQL 15 with RLS
- **Functions**: 18 Edge Functions deployed
- **Storage**: Multiple buckets configured

### Frontend Deployment Options
- **Vercel**: `nexusone-ai.vercel.app`
- **Netlify**: `nexusone-ai.netlify.app`
- **Custom Domain**: `app.nexusone.ai`

### Required Environment Variables

#### Frontend (.env.production)
```
VITE_SUPABASE_URL=https://hbfgtdxvlbkvkrjqxnac.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_APP_NAME=NexusOne AI
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=production
```

#### Backend (Supabase Secrets)
```
OPENAI_API_KEY=sk-proj-...
OPENAI_ASSISTANT_ID=asst_...
ELEVENLABS_API_KEY=sk_...
REPLICATE_API_TOKEN=r8_...
LUMA_API_KEY=luma-...
GUPSHUP_API_KEY=sk_...
FACEBOOK_ACCESS_TOKEN=EAAI...
FACEBOOK_APP_ID=892734585139740
CJ_DROPSHIPPING_API_KEY=5e0e...
UNSPLASH_ACCESS_KEY=-zZ5...
```

## 🧪 Testing Deployment

### Health Check
```bash
# Test API health
curl -X GET "https://hbfgtdxvlbkvkrjqxnac.supabase.co/functions/v1/test-api-connection"

# Test AI generation
curl -X POST "https://hbfgtdxvlbkvkrjqxnac.supabase.co/functions/v1/ai-content-generation" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test generation", "type": "marketing"}'
```

### Frontend Test
1. Visit your deployed URL
2. Create an account
3. Test core features:
   - Campaign Generator
   - Magic Video
   - Drop Magic
   - WhatsApp Marketing

## 📊 Monitoring & Logs

### Supabase Dashboard
- **Main Dashboard**: https://supabase.com/dashboard/project/hbfgtdxvlbkvkrjqxnac
- **Functions**: https://supabase.com/dashboard/project/hbfgtdxvlbkvkrjqxnac/functions
- **Logs**: https://supabase.com/dashboard/project/hbfgtdxvlbkvkrjqxnac/logs
- **Database**: https://supabase.com/dashboard/project/hbfgtdxvlbkvkrjqxnac/editor

### Function Logs
```bash
# View specific function logs
supabase functions logs ai-content-generation --project-ref hbfgtdxvlbkvkrjqxnac
supabase functions logs video-generator --project-ref hbfgtdxvlbkvkrjqxnac
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Edge Function Deployment Fails
```bash
# Check function syntax
supabase functions serve

# Deploy with more verbose output
supabase functions deploy function-name --debug
```

#### 2. API Keys Not Working
```bash
# List current secrets
supabase secrets list

# Update secret
supabase secrets set KEY_NAME="new_value"
```

#### 3. Frontend Build Errors
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 4. CORS Issues
- Ensure proper origin configuration in Supabase Dashboard
- Check Auth settings for redirect URLs

## 🚀 CI/CD with GitHub Actions

### Setup GitHub Secrets
In your GitHub repository settings, add these secrets:
- `SUPABASE_ACCESS_TOKEN`
- `VITE_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`
- `OPENAI_ASSISTANT_ID`
- `ELEVENLABS_API_KEY`
- `REPLICATE_API_TOKEN`
- `LUMA_API_KEY`
- `GUPSHUP_API_KEY`
- `FACEBOOK_ACCESS_TOKEN`
- `FACEBOOK_APP_ID`
- `CJ_DROPSHIPPING_API_KEY`
- `UNSPLASH_ACCESS_KEY`
- `VERCEL_TOKEN` (if using Vercel)
- `VERCEL_ORG_ID` (if using Vercel)
- `VERCEL_PROJECT_ID` (if using Vercel)

### Automatic Deployment
- Push to `main` branch triggers automatic deployment
- GitHub Actions will build and deploy both backend and frontend
- Check deployment status in GitHub Actions tab

## 📈 Performance Optimization

### Edge Function Performance
- Functions are deployed globally via Supabase Edge
- Average response time: 1-3 seconds
- Auto-scaling enabled

### Frontend Performance
- Built with Vite for optimal bundling
- Code splitting implemented
- Assets optimized and cached

### Database Performance
- Connection pooling enabled
- Row Level Security (RLS) optimized
- Indexes on frequently queried columns

## 🔐 Security Checklist

- [x] Environment variables secured
- [x] API keys encrypted
- [x] HTTPS enforced
- [x] CORS properly configured
- [x] Row Level Security enabled
- [x] JWT tokens validated
- [x] Rate limiting implemented
- [x] Input validation on all endpoints

## 📞 Support & Monitoring

### Health Monitoring
- Built-in health checks for all functions
- Real-time error tracking
- Performance monitoring

### Support Tools
- Comprehensive error logging
- User activity tracking
- API usage analytics

## 🎉 Post-Deployment

### Launch Checklist
- [ ] Domain configured (app.nexusone.ai)
- [ ] SSL certificates active
- [ ] Analytics tracking setup
- [ ] Customer support system ready
- [ ] Payment integration (Stripe)
- [ ] Marketing campaign launched

### Success Metrics
- Response time < 3 seconds
- 99.9% uptime target
- User acquisition tracking
- Revenue monitoring

---

## 📋 Quick Reference

### Important URLs
- **Production Backend**: https://hbfgtdxvlbkvkrjqxnac.supabase.co
- **Supabase Dashboard**: https://supabase.com/dashboard/project/hbfgtdxvlbkvkrjqxnac
- **GitHub Repository**: https://github.com/your-username/nexusone-ai

### Key Commands
```bash
# Deploy everything
./deploy-production.sh

# Deploy specific function
supabase functions deploy function-name

# Check deployment status
supabase functions list

# View logs
supabase functions logs function-name
```

**🚀 Your NexusOne AI platform is ready for production launch!**