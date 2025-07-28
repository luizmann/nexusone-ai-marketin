# 🚀 NexusOne AI - Manual Production Deployment

## Quick Copy-Paste Commands for Production Deployment

### Step 1: Install Supabase CLI
```bash
curl -s https://cli.supabase.com/install.sh | bash
export PATH=$PATH:~/.local/bin
```

### Step 2: Login and Link Project
```bash
supabase login
supabase link --project-ref hbfgtdxvlbkvkrjqxnac
```

### Step 3: Deploy Database (if migrations exist)
```bash
supabase db push
```

### Step 4: Deploy All Edge Functions
Copy and paste each line individually:

```bash
supabase functions deploy ai-content-generation --no-verify-jwt
supabase functions deploy ai-content-generator --no-verify-jwt
supabase functions deploy api-proxy --no-verify-jwt
supabase functions deploy cj-dropshipping-catalog --no-verify-jwt
supabase functions deploy cj-dropshipping-order --no-verify-jwt
supabase functions deploy dropshipping-import --no-verify-jwt
supabase functions deploy facebook-ads-manager --no-verify-jwt
supabase functions deploy landing-page-builder --no-verify-jwt
supabase functions deploy luma-video-ai --no-verify-jwt
supabase functions deploy nexbrain-chat --no-verify-jwt
supabase functions deploy nexus-api-manager --no-verify-jwt
supabase functions deploy product-scraper --no-verify-jwt
supabase functions deploy save-api-config --no-verify-jwt
supabase functions deploy test-api-connection --no-verify-jwt
supabase functions deploy unsplash-api --no-verify-jwt
supabase functions deploy usage-tracker --no-verify-jwt
supabase functions deploy video-generator --no-verify-jwt
supabase functions deploy webhook-handler --no-verify-jwt
supabase functions deploy whatsapp-automation --no-verify-jwt
```

### Step 5: Configure API Secrets
Copy and paste each line individually:

```bash
supabase secrets set OPENAI_API_KEY="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"
supabase secrets set OPENAI_ASSISTANT_ID="asst_0jsx8eD6P3W9XGsSRRNU2Pfd"
supabase secrets set ELEVENLABS_API_KEY="sk_189b755ede03dfdf1633da77e125d682b44c1ddb54b08a07"
supabase secrets set REPLICATE_API_TOKEN="r8_HbwQQ4NxMfhVPy0BS0xqOMkERd9B5JM440l66"
supabase secrets set LUMA_API_KEY="luma-12423eab-79ee-4f52-ad44-00c485686cf2-ab1b6b03-15a1-4c76-b056-6765bf41ab05"
supabase secrets set GUPSHUP_API_KEY="sk_d5fe7cdab5164e53bcbffdc428fd431e"
supabase secrets set FACEBOOK_ACCESS_TOKEN="EAAI0DOV8GvcBPK4ZBUTybkGl66FwZA1s45Dx3cSjOVEO4lzZAifzVR6lIoVbW6HcsP2L7x4b0065VirgfhzyfIGNCCA9QCynR3twQB01ZCqjolM7b0QfGtBpj5ZCZA5kyWONQsaYmZBRvy1ByAziVPZAot50fp9ZB4ro71pZAPk7iK4ynEMkhG2LBqUmg2VFWZCPAYQ74T3ocUZCL7u69pCaZAhqUe29gMZALb2jZB5YWQrfHbreY0hIgZDZD"
supabase secrets set FACEBOOK_APP_ID="892734585139740"
supabase secrets set CJ_DROPSHIPPING_API_KEY="5e0e680914c6462ebcf39059b21e70a9"
supabase secrets set UNSPLASH_ACCESS_KEY="-zZ5LsB2CAMUhbPca_UKw31ngzc1W3_hfxSPdz_aBUE"
```

### Step 6: Build and Deploy Frontend
```bash
npm install
npm run build:prod
npm run deploy:vercel
```

### Step 7: Test Deployment
```bash
# Test API health
curl -X GET "https://hbfgtdxvlbkvkrjqxnac.supabase.co/functions/v1/test-api-connection" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiZmd0ZHh2bGJrdmtyanh4bmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ2NzI4MDAsImV4cCI6MjAyMDI0ODgwMH0.XYKhOW-Q5kz9O2P7vX1cFm3d8jR6sN0tA9wK4eL7mGp"

# Test AI content generation
curl -X POST "https://hbfgtdxvlbkvkrjqxnac.supabase.co/functions/v1/ai-content-generation" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiZmd0ZHh2bGJrdmtyanh4bmFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ2NzI4MDAsImV4cCI6MjAyMDI0ODgwMH0.XYKhOW-Q5kz9O2P7vX1cFm3d8jR6sN0tA9wK4eL7mGp" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Generate marketing copy for AI platform", "type": "marketing"}'
```

## Production URLs

- **API Base**: https://hbfgtdxvlbkvkrjqxnac.supabase.co/functions/v1
- **Database**: https://hbfgtdxvlbkvkrjqxnac.supabase.co
- **Dashboard**: https://supabase.com/dashboard/project/hbfgtdxvlbkvkrjqxnac

## Alternative: Use Automated Script

```bash
# Make script executable
chmod +x deploy-quick.sh

# Run automated deployment
./deploy-quick.sh
```

---

✅ **Your NexusOne AI platform will be live in production after completing these steps!**