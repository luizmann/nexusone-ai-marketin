# Deployment Guide

This guide covers how to deploy NexusOne AI to various platforms.

## 🚀 Quick Deploy Options

### Vercel (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/nexusone-ai)

### Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yourusername/nexusone-ai)

## 📋 Prerequisites

- Node.js 18+
- Supabase account and project
- Required API keys (see [Environment Setup](#environment-setup))

## 🌍 Platform-Specific Deployment

### Vercel Deployment

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel --prod
```

4. **Environment Variables**
Add these in your Vercel dashboard:
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_OPENAI_API_KEY
# ... other API keys
```

### Netlify Deployment

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Build the project**
```bash
npm run build
```

3. **Deploy**
```bash
netlify deploy --prod --dir=dist
```

### Docker Deployment

1. **Build the Docker image**
```bash
docker build -t nexusone-ai .
```

2. **Run the container**
```bash
docker run -p 3000:3000 \
  -e VITE_SUPABASE_URL=your_url \
  -e VITE_SUPABASE_ANON_KEY=your_key \
  nexusone-ai
```

## 🔧 Environment Setup

### Required Environment Variables

```env
# Core Infrastructure
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_OPENAI_API_KEY=sk-proj-your-openai-key

# Optional API Keys
VITE_LUMA_API_KEY=luma-your-key
VITE_ELEVEN_LABS_API_KEY=sk_your-key
VITE_FACEBOOK_ACCESS_TOKEN=your-token
# ... see .env.example for complete list
```

### Production Configuration

Create a `.env.production` file:
```env
NODE_ENV=production
VITE_APP_URL=https://your-domain.com
VITE_API_URL=https://your-project.supabase.co/functions/v1
```

## 🗄️ Database Setup

### Supabase Configuration

1. **Create Supabase Project**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Create new project
   - Note your URL and anon key

2. **Run Database Migrations**
```bash
npx supabase db reset
```

3. **Deploy Edge Functions**
```bash
npx supabase functions deploy --create-jwt-secret
```

## 🔒 Security Configuration

### SSL/TLS Certificate
- Vercel and Netlify provide automatic HTTPS
- For custom domains, ensure SSL is configured

### CORS Configuration
Update your Supabase project settings:
```json
{
  "cors": {
    "allowed_origins": [
      "https://your-domain.com",
      "https://app.your-domain.com"
    ]
  }
}
```

### Content Security Policy
Add to your hosting platform headers:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' *.vercel.app; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com
```

## 📊 Monitoring Setup

### Analytics
```env
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### Error Tracking
```env
VITE_SENTRY_DSN=your-sentry-dsn
```

### Performance Monitoring
- Enable Vercel Analytics
- Configure Supabase monitoring
- Set up alert notifications

## 🔄 CI/CD Pipeline

### GitHub Actions

The repository includes GitHub Actions workflows:
- **CI**: Run tests and build on PR
- **Deploy**: Automatic deployment on merge to main
- **Security**: Weekly security scans

### Required Secrets

Add these to your GitHub repository secrets:
```
VERCEL_TOKEN
PRODUCTION_SUPABASE_URL
PRODUCTION_SUPABASE_ANON_KEY
STAGING_SUPABASE_URL
STAGING_SUPABASE_ANON_KEY
```

## 🌐 Custom Domain Setup

### Vercel
1. Go to your project settings
2. Add your custom domain
3. Configure DNS records as instructed

### Netlify
1. Go to Domain management
2. Add custom domain
3. Update DNS settings

## 📈 Performance Optimization

### Build Optimization
```json
{
  "build": {
    "env": {
      "NODE_OPTIONS": "--max-old-space-size=4096"
    }
  }
}
```

### CDN Configuration
- Static assets are automatically cached
- API responses include appropriate cache headers
- Images are optimized and served via CDN

## 🐛 Troubleshooting

### Common Issues

**Build Fails**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Environment Variables Not Working**
- Ensure variables start with `VITE_` for frontend access
- Restart development server after changes
- Check platform-specific environment variable syntax

**Supabase Connection Issues**
- Verify URL and key are correct
- Check CORS settings in Supabase dashboard
- Ensure RLS policies are configured

### Support Channels
- 📚 Documentation: Check this guide and API docs
- 💬 Discord: [Join our community](https://discord.gg/nexusone)
- 📧 Email: support@nexusone.ai
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/nexusone-ai/issues)

## 🚀 Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Edge functions deployed
- [ ] SSL certificate active
- [ ] Custom domain configured (if applicable)
- [ ] Analytics tracking enabled
- [ ] Error monitoring setup
- [ ] Performance monitoring configured
- [ ] Backup strategy implemented
- [ ] Monitoring alerts configured

---

For additional help, contact our support team or check the comprehensive documentation.