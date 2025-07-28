# 🚀 NexusOne AI - Quick Deployment Instructions

## Ready to Deploy? Here's how:

### 🛠️ Prerequisites
Make sure you have these installed:
```bash
npm install -g supabase vercel
```

### 📋 Step-by-Step Deployment

#### Option 1: Complete Deployment (Recommended)
```bash
# Run the complete deployment script
bash deploy-production.sh
```

#### Option 2: Deploy Components Separately

**Backend (Supabase):**
```bash
bash deploy-backend-quick.sh
```

**Frontend (Vercel):**
```bash
bash deploy-frontend-quick.sh
```

### 🔍 Validate Before Deployment
```bash
bash validate-deployment.sh
```

### 🎯 Manual Deployment Commands

**Supabase Backend:**
```bash
# 1. Login and link project
supabase login
supabase link --project-ref hbfgtdxvlbkvkrjqxnac

# 2. Deploy database
supabase db push

# 3. Deploy Edge Functions
supabase functions deploy ai-content-generator
supabase functions deploy nexbrain-assistant
supabase functions deploy whatsapp-smart-booking
# ... (see deploy-backend-quick.sh for full list)

# 4. Set API secrets
supabase secrets set OPENAI_API_KEY=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
# ... (see deploy-backend-quick.sh for all secrets)
```

**Vercel Frontend:**
```bash
# 1. Build for production
npm run build:prod

# 2. Deploy to Vercel
vercel --prod

# 3. Set environment variables in Vercel dashboard:
# VITE_SUPABASE_URL=https://hbfgtdxvlbkvkrjqxnac.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
# VITE_APP_NAME=NexusOne AI
# VITE_ENVIRONMENT=production
```

### 🔧 Environment Variables

**Supabase Secrets:**
- OPENAI_API_KEY
- ELEVENLABS_API_KEY 
- REPLICATE_API_TOKEN
- GUPSHUP_API_KEY
- LUMA_API_KEY
- CJ_API_KEY
- FACEBOOK_ACCESS_TOKEN
- UNSPLASH_ACCESS_KEY
- NEXBRAIN_ASSISTANT_ID

**Vercel Environment:**
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_APP_NAME
- VITE_ENVIRONMENT
- VITE_CJ_API_KEY
- VITE_FACEBOOK_ACCESS_TOKEN

### ✅ Post-Deployment Checklist

1. **Test Core Features:**
   - User registration/login
   - AI content generation
   - Video creation
   - WhatsApp integration
   - Dropshipping marketplace

2. **Monitor Performance:**
   - Check Vercel dashboard
   - Monitor Supabase usage
   - Track API costs

3. **Set Up Monitoring:**
   - Error tracking
   - Performance monitoring
   - User analytics

### 🎯 Production URLs

After deployment, your app will be available at:
- **Frontend**: https://nexusone.vercel.app
- **Backend**: https://hbfgtdxvlbkvkrjqxnac.supabase.co
- **API Functions**: https://hbfgtdxvlbkvkrjqxnac.supabase.co/functions/v1

### 🆘 Troubleshooting

**Common Issues:**

1. **Supabase login fails:**
   ```bash
   supabase login
   ```

2. **Build fails:**
   ```bash
   npm ci
   npm run build:prod
   ```

3. **Edge Functions not deploying:**
   - Check function directory exists
   - Verify Supabase project link

4. **Environment variables not set:**
   - Use Vercel dashboard to set variables
   - Use `supabase secrets set` for backend

### 📞 Support

If you encounter issues:
1. Check the logs in Vercel dashboard
2. Check Supabase logs in the dashboard
3. Run `validate-deployment.sh` to identify problems
4. Review the complete deployment guide: `COMPLETE_DEPLOYMENT_GUIDE.md`

---

**🎊 Ready to launch your NexusOne AI platform!**