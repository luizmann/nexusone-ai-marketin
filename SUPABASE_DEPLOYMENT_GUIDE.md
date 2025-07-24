# NexusOne AI Platform - Supabase Deployment Guide

## 🚀 Quick Deployment

### Prerequisites
- Supabase CLI installed
- Node.js 18+ installed
- Git repository access

### 1. Supabase Project Setup

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Create new project (or link existing)
supabase projects create nexusone-ai-platform
# OR link existing: supabase link --project-ref YOUR_PROJECT_REF

# Initialize Supabase in project
supabase init
```

### 2. Environment Configuration

Copy environment variables:
```bash
cp supabase/.env.example supabase/.env.local
```

Fill in your API keys in `.env.local`:
```bash
# Required for deployment
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI Services (Get from respective providers)
OPENAI_API_KEY=sk-your-openai-key
DID_API_KEY=your-d-id-api-key
ELEVENLABS_API_KEY=your-elevenlabs-key

# Social Media (Facebook Developer Console)
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret

# Payment (Stripe Dashboard)
STRIPE_SECRET_KEY=sk_test_your-stripe-key
```

### 3. Database Migration

Run all migrations:
```bash
supabase db push
```

Or run individually:
```bash
supabase migration up --include-all
```

### 4. Deploy Edge Functions

Deploy all functions:
```bash
supabase functions deploy

# Or deploy individually
supabase functions deploy ai-content-generator
supabase functions deploy video-generator
supabase functions deploy facebook-ads-manager
supabase functions deploy whatsapp-automation
supabase functions deploy product-scraper
supabase functions deploy landing-page-builder
```

### 5. Configure Storage

Storage buckets are created automatically via migration, but verify:
```bash
supabase storage ls
```

### 6. Set Environment Variables in Supabase

```bash
supabase secrets set OPENAI_API_KEY=your-key
supabase secrets set DID_API_KEY=your-key
supabase secrets set ELEVENLABS_API_KEY=your-key
supabase secrets set FACEBOOK_APP_ID=your-id
supabase secrets set FACEBOOK_APP_SECRET=your-secret
supabase secrets set STRIPE_SECRET_KEY=your-key
```

## 📊 Monitoring & Analytics

### Database Monitoring
```sql
-- Check function performance
SELECT * FROM pg_stat_user_functions;

-- Monitor table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Active connections
SELECT * FROM pg_stat_activity WHERE state = 'active';
```

### Usage Analytics Dashboard
```sql
-- Daily active users
SELECT DATE(created_at) as date, COUNT(DISTINCT user_id) as dau
FROM usage_analytics 
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE(created_at)
ORDER BY date;

-- Revenue by plan
SELECT plan, COUNT(*) as users, SUM(amount)/100 as revenue
FROM subscriptions s
JOIN users u ON s.user_id = u.id
WHERE s.status = 'active'
GROUP BY plan;

-- Most used modules
SELECT module, COUNT(*) as uses, SUM(credits_consumed) as credits
FROM usage_analytics
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY module
ORDER BY uses DESC;
```

## 🔒 Security Checklist

### Database Security
- ✅ Row Level Security enabled on all tables
- ✅ User can only access their own data
- ✅ API keys stored encrypted
- ✅ Service role key secured

### API Security
- ✅ JWT authentication on all functions
- ✅ Rate limiting implemented
- ✅ Input validation and sanitization
- ✅ CORS properly configured

### Storage Security
- ✅ Bucket policies restrict access
- ✅ File size limits enforced
- ✅ MIME type restrictions
- ✅ Automatic cleanup of old files

## 🚦 Testing Deployment

### 1. Test Database Connection
```bash
supabase db push --dry-run
```

### 2. Test Edge Functions
```bash
# Test AI content generator
curl -X POST "https://your-project.supabase.co/functions/v1/ai-content-generator" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Test prompt", "type": "text", "language": "en", "tone": "professional", "length": "short"}'

# Test video generator
curl -X POST "https://your-project.supabase.co/functions/v1/video-generator" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"script": "Hello world", "language": "en", "style": "professional"}'
```

### 3. Test Storage
```bash
# Upload test file
supabase storage cp test-image.jpg supabase://avatars/test/test-image.jpg
```

## 📈 Scaling Considerations

### Database Scaling
- Enable connection pooling
- Add read replicas for analytics
- Partition large tables by date
- Regular VACUUM and ANALYZE

### Function Scaling
- Monitor function execution time
- Implement proper error handling
- Use async operations where possible
- Cache frequently accessed data

### Storage Scaling
- Use CDN for public assets
- Implement image optimization
- Regular cleanup of unused files
- Monitor storage costs

## 🔧 Production Optimizations

### Database Optimizations
```sql
-- Add missing indexes
CREATE INDEX CONCURRENTLY idx_usage_analytics_performance 
ON usage_analytics(user_id, created_at, success);

-- Update table statistics
ANALYZE;

-- Vacuum tables
VACUUM ANALYZE;
```

### Caching Strategy
- Redis for session storage
- CloudFlare for static assets
- Database query caching
- API response caching

### Backup Strategy
```bash
# Enable point-in-time recovery
supabase db backup enable

# Schedule regular backups
supabase db backup create --description "Daily backup"
```

## 🚨 Troubleshooting

### Common Issues

1. **Function Timeout**
   - Increase timeout in function config
   - Optimize API calls
   - Implement async processing

2. **Database Connection Limit**
   - Enable connection pooling
   - Optimize query performance
   - Close unused connections

3. **Storage Upload Failures**
   - Check file size limits
   - Verify MIME types
   - Check bucket policies

4. **Authentication Issues**
   - Verify JWT tokens
   - Check RLS policies
   - Validate user permissions

### Monitoring Commands
```bash
# Check function logs
supabase functions logs ai-content-generator

# Monitor database performance
supabase db inspect

# Check storage usage
supabase storage inspect
```

## 📞 Support Resources

- **Supabase Documentation**: https://supabase.com/docs
- **API Reference**: https://supabase.com/docs/reference
- **Discord Community**: https://discord.supabase.com
- **GitHub Issues**: Create issues for platform-specific problems

---

## 🎯 Post-Deployment Checklist

- [ ] All migrations applied successfully
- [ ] Edge functions deployed and responding
- [ ] Storage buckets created with proper policies
- [ ] Environment variables set in production
- [ ] Authentication working correctly
- [ ] API integrations tested
- [ ] Monitoring and analytics configured
- [ ] Backup strategy implemented
- [ ] Security audit completed
- [ ] Performance optimization applied

**Deployment Status**: ✅ Ready for Production