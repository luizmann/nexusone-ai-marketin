# 🚀 NexusOne AI Production Deployment Guide

## Pre-Deployment Checklist

### 1. Supabase Setup
- [ ] Create production Supabase project
- [ ] Import database schema from `supabase/migrations`
- [ ] Configure Row Level Security (RLS) policies
- [ ] Set up Edge Functions environment
- [ ] Configure environment variables

### 2. API Keys Configuration
Required API keys for full functionality:

#### Essential (Core Features)
- [ ] **OpenAI API Key** - GPT-4, Assistant API, DALL-E
- [ ] **Supabase URL & Anon Key** - Database and Auth

#### AI Features (Optional but Recommended)
- [ ] **Replicate API Key** - AI Image Generation
- [ ] **Luma AI API Key** - AI Video Generation  
- [ ] **ElevenLabs API Key** - Text-to-Speech
- [ ] **CJ Dropshipping API Key** - Product Catalog

#### Marketing Integrations (Optional)
- [ ] **Facebook Marketing API** - Ad Campaign Creation
- [ ] **WhatsApp Business API** - Gupshup or 360Dialog
- [ ] **Unsplash API Key** - Stock Images

### 3. Edge Functions Deployment

Deploy all 20 Edge Functions to Supabase:

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_ID

# Deploy all Edge Functions
supabase functions deploy openai-assistant
supabase functions deploy replicate-image
supabase functions deploy luma-video
supabase functions deploy elevenlabs-tts
supabase functions deploy cj-dropshipping-catalog
supabase functions deploy facebook-ads-generator
supabase functions deploy whatsapp-automation
supabase functions deploy magic-page-generator
supabase functions deploy campaign-generator
supabase functions deploy nexbrain-capabilities
supabase functions deploy winner-products
supabase functions deploy smart-appointments
supabase functions deploy video-processor
supabase functions deploy image-processor
supabase functions deploy content-generator
supabase functions deploy analytics-tracker
supabase functions deploy user-manager
supabase functions deploy credit-manager
supabase functions deploy notification-sender
supabase functions deploy webhook-handler
```

### 4. Frontend Deployment

#### Option A: Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel --prod

# Set environment variables in Vercel dashboard:
# REACT_APP_SUPABASE_URL=your_supabase_url
# REACT_APP_SUPABASE_ANON_KEY=your_anon_key
```

#### Option B: Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

#### Option C: GitHub Pages
```bash
# Build the application
npm run build

# Deploy to gh-pages
npm install -g gh-pages
gh-pages -d dist
```

## Post-Deployment Validation

### 1. Use the Built-in Deployment Validator
1. Go to **Admin Dashboard → Deployment Tab**
2. Enter your Supabase URL and Anon Key
3. Click "Run All Checks"
4. Verify all critical checks pass

### 2. Manual Testing
- [ ] User registration and login
- [ ] Dashboard loads correctly
- [ ] AI features respond (even with errors is fine, indicates connection)
- [ ] Credit system functions
- [ ] Multi-language switching works

### 3. API Keys Configuration
1. Go to **Admin Dashboard → API Configuration**
2. Add your API keys one by one
3. Use the "Test Connection" buttons
4. Verify each integration works

### 4. Production Monitoring
- [ ] Set up Supabase monitoring
- [ ] Configure error logging
- [ ] Monitor API usage and costs
- [ ] Set up user analytics

## Common Issues & Solutions

### Edge Functions Not Working
```bash
# Check function logs
supabase functions logs openai-assistant

# Redeploy specific function
supabase functions deploy openai-assistant --no-verify-jwt
```

### API Key Errors
- Verify keys are correctly set in Supabase Edge Functions environment
- Check API key permissions and quotas
- Test keys individually using the Admin Dashboard

### Frontend Build Issues
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Database Connection Issues
- Verify Supabase URL and Anon Key
- Check RLS policies are properly configured
- Ensure database tables exist

## Performance Optimization

### 1. Edge Functions Optimization
- Enable function caching where appropriate
- Optimize API call patterns
- Implement rate limiting

### 2. Frontend Optimization
- Enable compression in hosting provider
- Configure CDN for static assets
- Implement service worker for offline functionality

### 3. Database Optimization
- Index frequently queried columns
- Optimize RLS policies
- Set up database connection pooling

## Security Checklist

- [ ] All API keys stored securely in environment variables
- [ ] RLS policies properly configured
- [ ] No sensitive data in frontend code
- [ ] HTTPS enabled on all endpoints
- [ ] CORS properly configured
- [ ] Input validation on all Edge Functions

## Production URLs

After successful deployment, you should have:

- **Frontend Application**: `https://your-app.vercel.app`
- **Supabase Project**: `https://your-project.supabase.co`
- **Edge Functions**: `https://your-project.supabase.co/functions/v1/`

## Cost Monitoring

Monitor these services for cost optimization:

### API Costs (Monthly estimates)
- **OpenAI GPT-4**: $0.03/1K tokens (~$50-200/month)
- **Replicate**: $0.05/image (~$10-50/month)
- **Luma AI**: $0.10/video (~$20-100/month)
- **ElevenLabs**: $0.30/1K chars (~$15-75/month)
- **Supabase Pro**: $25/month (includes database and functions)

### Total Estimated Monthly Cost: $120-450

## Support & Maintenance

### Daily Tasks
- Monitor error logs
- Check API usage and costs
- Review user feedback

### Weekly Tasks
- Database performance review
- Security audit
- Feature usage analytics

### Monthly Tasks
- API key rotation
- Database backup verification
- Performance optimization review

---

## 🎯 Success Metrics

Your deployment is successful when:

✅ All users can register and login
✅ Core AI features generate content
✅ Payment system processes transactions
✅ API usage stays within budget
✅ System uptime > 99.5%
✅ User satisfaction > 4.5/5

## Need Help?

1. Check the **AI Test Suite** in the sidebar
2. Use the **Deployment Validator** in Admin Dashboard
3. Review Edge Function logs in Supabase
4. Test individual APIs using the Admin tools

---

**Next Steps**: After deployment, focus on user onboarding, content marketing, and iterating based on user feedback.