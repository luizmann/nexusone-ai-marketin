# Netlify Deployment Guide for NexusOne AI Platform

## 🚀 Quick Deploy to Netlify

### 1. Push to Git Repository
```bash
git add .
git commit -m "feat: NexusOne AI Platform ready for production"
git push origin main
```

### 2. Connect to Netlify
1. Go to [Netlify](https://app.netlify.com/)
2. Click "New site from Git"
3. Connect your GitHub/GitLab repository
4. Select the NexusOne repository

### 3. Deploy Settings
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: `18`

### 4. Environment Variables
Add these in Netlify Dashboard → Site Settings → Environment Variables:

```env
VITE_SUPABASE_URL=https://lqcbkqacqgikpucuuhsm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxY2JrcWFjcWdpa3B1Y3V1aHNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4MDQ2MjcsImV4cCI6MjA1MDM4MDYyN30.qrcqjovFtqPYOqTlNJIGSqGULJO8POzFGMhHmJxgfTM
VITE_OPENAI_API_KEY=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
VITE_REPLICATE_API_TOKEN=r8_HbwQQ4NxMfhVPy0BS0xqOMkERd9B5JM440l66
VITE_ELEVENLABS_API_KEY=sk_189b755ede03dfdf1633da77e125d682b44c1ddb54b08a07
VITE_LUMA_API_KEY=luma-12423eab-79ee-4f52-ad44-00c485686cf2-ab1b6b03-15a1-4c76-b056-6765bf41ab05
VITE_GUPSHUP_API_KEY=sk_d5fe7cdab5164e53bcbffdc428fd431e
VITE_CJ_API_KEY=5e0e680914c6462ebcf39059b21e70a9
VITE_UNSPLASH_ACCESS_KEY=-zZ5LsB2CAMUhbPca_UKw31ngzc1W3_hfxSPdz_aBUE
```

### 5. Domain Setup (Optional)
- In Netlify Dashboard → Domain Settings
- Add your custom domain
- SSL is automatically enabled

## 🔧 Features Enabled
- ✅ AI Campaign Generator
- ✅ Magic Pages Creator  
- ✅ Video Generator (Luma AI)
- ✅ WhatsApp AI Assistant
- ✅ CJ Dropshipping Integration
- ✅ Facebook Ads Creator
- ✅ Multi-language Support
- ✅ Real-time Dashboard

## 📞 Support
Your NexusOne AI Platform will be live at: `https://your-site-name.netlify.app`

Deployment typically takes 2-3 minutes. Check deployment logs for any issues.