# NexusOne AI Platform - Supabase Configuration Guide

## 🎯 Production Setup Instructions

### Prerequisites
1. **Supabase CLI**: Install with `npm install -g supabase`
2. **Account Access**: Ensure you have admin access to the Supabase project
3. **Environment Setup**: All credentials configured in `.env` file

### 1. Project Configuration

**Project Details:**
- Project ID: `hbfgtdxvlbkvkrjqxnac`
- Organization: `nexusone`
- Region: `us-east-1`
- Database: PostgreSQL 15

**Production URLs:**
```
Database URL: https://hbfgtdxvlbkvkrjqxnac.supabase.co
API URL: https://hbfgtdxvlbkvkrjqxnac.supabase.co/rest/v1
Auth URL: https://hbfgtdxvlbkvkrjqxnac.supabase.co/auth/v1
Storage URL: https://hbfgtdxvlbkvkrjqxnac.supabase.co/storage/v1
Functions URL: https://hbfgtdxvlbkvkrjqxnac.supabase.co/functions/v1
```

### 2. Database Setup

**Connection String:**
```
postgresql://postgres:nexusone2025secure@db.hbfgtdxvlbkvkrjqxnac.supabase.co:5432/postgres
```

**Required Migrations:**
- `001_initial_schema.sql` - Core tables and RLS policies
- `002_storage_setup.sql` - Storage buckets and policies  
- `003_advanced_features.sql` - AI features and integrations

### 3. Authentication Configuration

**Enabled Providers:**
- ✅ Email/Password
- ✅ Google OAuth
- ✅ Facebook OAuth
- ✅ GitHub OAuth (optional)

**Settings:**
- JWT Expiry: 24 hours
- Email Confirmations: Enabled
- Secure Password Changes: Enabled
- Multi-factor Authentication: Available

**Redirect URLs:**
```
https://nexusone.ai/auth/callback
https://app.nexusone.ai/auth/callback
http://localhost:3000 (development)
http://localhost:5173 (development)
```

### 4. Storage Buckets

| Bucket | Public | Size Limit | Purpose |
|--------|--------|------------|---------|
| `avatars` | ✅ | 5MB | User profile pictures |
| `landing-pages` | ✅ | 10MB | Generated landing pages |
| `generated-content` | ✅ | 50MB | AI generated content |
| `user-uploads` | ❌ | 20MB | Private user files |
| `video-assets` | ✅ | 100MB | Video content |
| `ai-generated` | ❌ | 50MB | Private AI outputs |
| `documents` | ❌ | 10MB | PDFs and documents |
| `audio-files` | ✅ | 20MB | Audio content |
| `templates` | ✅ | 5MB | Page templates |
| `campaigns` | ❌ | 30MB | Marketing campaigns |

### 5. Edge Functions

**Deployed Functions:**
1. `ai-content-generator` - AI content creation
2. `cj-dropshipping-catalog` - Product catalog management
3. `cj-dropshipping-order` - Order processing
4. `facebook-ads-generator` - Ad campaign creation
5. `whatsapp-automation` - WhatsApp bot management
6. `video-creator` - Video generation
7. `magic-pages-generator` - Landing page creation
8. `crm-automation` - CRM operations
9. `ai-agents` - AI assistant management
10. `income-generator` - Revenue optimization
11. `product-scraper` - Product data extraction
12. `dropshipping-import` - Product import
13. `inventory-sync` - Inventory management
14. `email-automation` - Email campaigns
15. `analytics-processor` - Data analytics

### 6. Environment Variables

**Critical Secrets:**
```bash
# Core Supabase
SUPABASE_URL=https://hbfgtdxvlbkvkrjqxnac.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# AI Services
OPENAI_API_KEY=sk-proj-7wP9xF2mQ4nK8vE1dR6tY3bG5hL9jI0cA8sM7eN2fX...
DID_API_KEY=bWFpbF9hY2NvdW50Omh0dHBzOi8vYXBpLmQtaWQuY29t...
ELEVENLABS_API_KEY=sk_1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t...

# Social Media
FACEBOOK_ACCESS_TOKEN=EAAI0DOV8GvcBPK4ZBUTybkGl66FwZA1s45Dx3cSjOVEO...
WHATSAPP_ACCESS_TOKEN=EAAI0DOV8GvcBPK4ZBUTybkGl66FwZA1s45Dx3cSjOVEO...

# E-commerce
CJ_DROPSHIPPING_API_KEY=5e0e680914c6462ebcf39059b21e70a9

# Payments
STRIPE_SECRET_KEY=sk_live_51N4xY7mP2kQ6wE9tR8uI5oA3dF1gH4jK7cV0bN...
```

### 7. Security Configuration

**Row Level Security (RLS):**
- ✅ Enabled on all tables
- ✅ User isolation policies
- ✅ Admin access controls
- ✅ API rate limiting

**CORS Settings:**
```javascript
origins: [
  "https://nexusone.ai",
  "https://app.nexusone.ai", 
  "https://www.nexusone.ai"
]
```

**Rate Limits:**
- Anonymous: 100 requests/hour
- Authenticated: 1000 requests/hour
- Premium users: 5000 requests/hour

### 8. Monitoring & Analytics

**Enabled Features:**
- ✅ Query logging
- ✅ Slow query detection (>1s)
- ✅ Real-time analytics
- ✅ Error tracking
- ✅ Performance metrics

**Backup Schedule:**
- Daily backups at 2:00 AM UTC
- 30-day retention period
- Point-in-time recovery available

### 9. Deployment Commands

**Login to Supabase:**
```bash
supabase auth login
```

**Link Project:**
```bash
supabase link --project-ref hbfgtdxvlbkvkrjqxnac
```

**Deploy Database:**
```bash
supabase db push
```

**Deploy Functions:**
```bash
supabase functions deploy ai-content-generator
supabase functions deploy cj-dropshipping-catalog
# ... repeat for all functions
```

**Set Secrets:**
```bash
echo "your-openai-key" | supabase secrets set OPENAI_API_KEY
echo "your-facebook-token" | supabase secrets set FACEBOOK_ACCESS_TOKEN
# ... repeat for all secrets
```

### 10. Health Checks

**Database Test:**
```bash
supabase db ping
```

**Functions Test:**
```bash
supabase functions list
```

**Storage Test:**
```bash
supabase storage list
```

### 11. Production Checklist

**Pre-Deployment:**
- [ ] All environment variables configured
- [ ] Database migrations tested
- [ ] Edge functions tested locally
- [ ] Storage buckets configured
- [ ] Authentication providers set up

**Post-Deployment:**
- [ ] Health checks passed
- [ ] End-to-end tests completed
- [ ] Monitoring alerts configured
- [ ] Backup verification
- [ ] Performance baseline established

### 12. Troubleshooting

**Common Issues:**

1. **Migration Failures:**
   - Check for naming conflicts
   - Verify RLS policies
   - Ensure proper permissions

2. **Function Deployment:**
   - Verify import paths
   - Check secret availability
   - Review function logs

3. **Authentication Issues:**
   - Verify redirect URLs
   - Check provider credentials
   - Test JWT configuration

4. **Storage Problems:**
   - Verify bucket policies
   - Check file size limits
   - Review CORS settings

### 13. Support & Resources

**Documentation:**
- [Supabase Docs](https://supabase.com/docs)
- [Edge Functions Guide](https://supabase.com/docs/guides/functions)
- [Database Guide](https://supabase.com/docs/guides/database)

**Monitoring URLs:**
- Dashboard: https://app.supabase.com/project/hbfgtdxvlbkvkrjqxnac
- Logs: https://app.supabase.com/project/hbfgtdxvlbkvkrjqxnac/logs
- Settings: https://app.supabase.com/project/hbfgtdxvlbkvkrjqxnac/settings

---

**⚠️ SECURITY NOTICE:**
Never commit the `.env` file to version control. Keep all production credentials secure and rotate them regularly.