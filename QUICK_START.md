# Quick Start Guide - GitHub Repository Setup

## 🚀 1-Minute Setup Instructions

### Step 1: Make Setup Script Executable
```bash
chmod +x setup-github-repo.sh
```

### Step 2: Run Setup Script
```bash
./setup-github-repo.sh
```

### Step 3: Create GitHub Repository
1. Go to [GitHub](https://github.com/new)
2. Create new repository named `nexusone-ai`
3. Don't initialize with README (we have one)

### Step 4: Push to GitHub
```bash
git remote add origin https://github.com/YOURUSERNAME/nexusone-ai.git
git branch -M main
git push -u origin main
```

### Step 5: Configure Environment
```bash
cp .env.example .env.local
# Edit .env.local with your API keys
```

### Step 6: Deploy (Choose One)

#### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

#### Netlify
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

## 🔑 Required API Keys

### Essential (Free)
- **Supabase**: Create project at [supabase.com](https://supabase.com)
- **OpenAI**: Get API key at [platform.openai.com](https://platform.openai.com)

### Optional (Paid - Enhances Features)
- **Luma AI**: Video generation
- **ElevenLabs**: Text-to-speech
- **Facebook**: Ad campaigns
- **WhatsApp**: Business messaging

## 🎯 What You Get

- ✅ Complete SaaS platform
- ✅ AI-powered marketing automation
- ✅ Multi-language support (5 languages)
- ✅ Production-ready deployment
- ✅ Comprehensive documentation
- ✅ GitHub Actions CI/CD
- ✅ Security best practices

## 📞 Need Help?

- 📖 Read the complete [README.md](./README.md)
- 🚀 Check [DEPLOYMENT.md](./docs/DEPLOYMENT.md)
- 🔧 Review [API.md](./docs/API.md)
- 🤝 See [CONTRIBUTING.md](./CONTRIBUTING.md)

**Total setup time: Under 30 minutes** 🚀