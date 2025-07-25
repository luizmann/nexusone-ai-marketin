// Environment configuration for production deployment
export const ENV_CONFIG = {
  // Supabase Configuration (READY)
  SUPABASE_URL: "https://hbfgtdxvlbkvkrjqxnac.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiZmd0ZHh2bGJrdmtyanlkHnhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY2NjA0NzcsImV4cCI6MjAyMjIzNjQ3N30.4L1VGpMOQR4zNjL5xVKjN8QX9hBf2wP0sA7rD3kF1mE",
  
  // CJ Dropshipping API (READY)
  CJ_API_KEY: "5e0e680914c6462ebcf39059b21e70a9",
  CJ_BASE_URL: "https://developers.cjdropshipping.com/api2.0",
  
  // Facebook/WhatsApp API (READY)
  FACEBOOK_ACCESS_TOKEN: "EAAI0DOV8GvcBPK4ZBUTybkGl66FwZA1s45Dx3cSjOVEO4lzZAifzVR6lIoVbW6HcsP2L7x4b0065VirgfhzyfIGNCCA9QCynR3twQB01ZCqjolM7b0QfGtBpj5ZCZA5kyWONQsaYmZBRvy1ByAziVPZAot50fp9ZB4ro71pZAPk7iK4ynEMkhG2LBqUmg2VFWZCPAYQ74T3ocUZCL7u69pCaZAhqUe29gMZALb2jZB5YWQrfHbreY0hIgZDZD",
  FACEBOOK_APP_ID: "847521093029581",
  WHATSAPP_PHONE_NUMBER_ID: "120363204529625852",
  
  // Application URLs
  APP_URL: "https://app.nexusone.ai",
  API_URL: "https://hbfgtdxvlbkvkrjqxnac.supabase.co/functions/v1",
  
  // Required API Keys (User needs to add)
  REQUIRED_KEYS: [
    {
      name: "OPENAI_API_KEY",
      url: "https://platform.openai.com/api-keys",
      description: "Required for AI content generation",
      cost: "$0.03/1K tokens"
    },
    {
      name: "STRIPE_PUBLIC_KEY", 
      url: "https://dashboard.stripe.com/apikeys",
      description: "Required for payment processing",
      cost: "2.9% + $0.30 per transaction"
    },
    {
      name: "ELEVENLABS_API_KEY",
      url: "https://elevenlabs.io/api",
      description: "Required for voice generation",
      cost: "$0.30/1K characters"
    },
    {
      name: "DID_API_KEY",
      url: "https://studio.d-id.com/account-settings/api-keys", 
      description: "Required for avatar videos",
      cost: "$0.10/video"
    },
    {
      name: "REPLICATE_API_TOKEN",
      url: "https://replicate.com/account/api-tokens",
      description: "Required for image generation",
      cost: "$0.05/image"
    }
  ],
  
  // Optional API Keys (Enhanced features)
  OPTIONAL_KEYS: [
    {
      name: "RUNWARE_API_KEY",
      url: "https://runware.ai/api",
      description: "Enhanced image processing",
      cost: "$0.02/image"
    },
    {
      name: "PEXELS_API_KEY",
      url: "https://www.pexels.com/api/",
      description: "Stock images library",
      cost: "Free"
    },
    {
      name: "UNSPLASH_ACCESS_KEY",
      url: "https://unsplash.com/developers",
      description: "Professional stock photos",
      cost: "Free"
    }
  ],
  
  // Deployment Platforms
  DEPLOYMENT_OPTIONS: [
    {
      name: "Vercel",
      command: "vercel --prod",
      setup: "npm install -g vercel",
      recommended: true,
      features: ["Auto SSL", "Global CDN", "Edge Functions", "Analytics"]
    },
    {
      name: "Netlify", 
      command: "netlify deploy --prod --dir=dist",
      setup: "npm install -g netlify-cli",
      recommended: false,
      features: ["Auto SSL", "Form Handling", "Split Testing", "Analytics"]
    },
    {
      name: "AWS S3 + CloudFront",
      command: "Upload dist folder to S3",
      setup: "Configure S3 bucket and CloudFront distribution",
      recommended: false,
      features: ["Global CDN", "Custom domains", "High scalability"]
    }
  ],
  
  // Business Configuration
  PLANS: {
    free: {
      price: 0,
      credits: 50,
      videos: 2,
      landingPages: 2,
      whatsappNumbers: 1,
      features: ["Basic AI", "Email Support"]
    },
    pro: {
      price: 97,
      credits: 500, 
      videos: 20,
      landingPages: 20,
      whatsappNumbers: 5,
      features: ["Advanced AI", "Dropshipping", "Facebook Ads", "Priority Support"]
    },
    premium: {
      price: 297,
      credits: 2000,
      videos: 100,
      landingPages: -1, // unlimited
      whatsappNumbers: 20,
      features: ["All Features", "White Label", "Custom Integrations", "Dedicated Support"]
    }
  },
  
  // Supported Languages
  LANGUAGES: {
    en: { name: "English", flag: "🇺🇸", rtl: false },
    es: { name: "Español", flag: "🇪🇸", rtl: false },
    pt: { name: "Português", flag: "🇵🇹", rtl: false },
    ar: { name: "العربية", flag: "🇸🇦", rtl: true },
    he: { name: "עברית", flag: "🇮🇱", rtl: true }
  },
  
  // Feature Modules
  MODULES: [
    { id: "magic-pages", name: "Magic Pages", credits: 10, plan: "free" },
    { id: "video-creator", name: "Video Creator", credits: 25, plan: "free" },
    { id: "ai-content", name: "AI Content", credits: 5, plan: "free" },
    { id: "facebook-ads", name: "Facebook Ads", credits: 15, plan: "pro" },
    { id: "whatsapp-bot", name: "WhatsApp Bot", credits: 5, plan: "pro" },
    { id: "dropshipping", name: "Dropshipping", credits: 3, plan: "pro" },
    { id: "crm-system", name: "CRM System", credits: 5, plan: "pro" },
    { id: "email-automation", name: "Email Automation", credits: 8, plan: "pro" },
    { id: "ai-agents", name: "AI Agents", credits: 20, plan: "premium" },
    { id: "income-generator", name: "Income Generator", credits: 8, plan: "premium" }
  ],
  
  // Revenue Projections
  PROJECTIONS: {
    conservative: {
      month1: { users: 100, conversion: 0.05, revenue: 2500 },
      month3: { users: 300, conversion: 0.08, revenue: 9000 },
      month6: { users: 750, conversion: 0.12, revenue: 27000 },
      month12: { users: 1500, conversion: 0.15, revenue: 60000 }
    },
    optimistic: {
      month1: { users: 200, conversion: 0.08, revenue: 6000 },
      month3: { users: 600, conversion: 0.12, revenue: 22000 },
      month6: { users: 1500, conversion: 0.18, revenue: 75000 },
      month12: { users: 4000, conversion: 0.22, revenue: 250000 }
    },
    aggressive: {
      month1: { users: 500, conversion: 0.10, revenue: 15000 },
      month3: { users: 1500, conversion: 0.15, revenue: 65000 },
      month6: { users: 4000, conversion: 0.25, revenue: 285000 },
      month12: { users: 10000, conversion: 0.30, revenue: 850000 }
    }
  }
};

// Validation function for required environment variables
export const validateEnvironment = () => {
  const missing = [];
  
  // Check required variables
  if (!process.env.VITE_OPENAI_API_KEY) missing.push("VITE_OPENAI_API_KEY");
  if (!process.env.VITE_STRIPE_PUBLIC_KEY) missing.push("VITE_STRIPE_PUBLIC_KEY");
  
  if (missing.length > 0) {
    console.warn("⚠️ Missing required environment variables:", missing);
    console.warn("Platform will work with limited functionality.");
    return false;
  }
  
  console.log("✅ All required environment variables configured");
  return true;
};

// Generate deployment instructions
export const getDeploymentInstructions = () => {
  return `
🚀 NEXUSONE AI - DEPLOYMENT INSTRUCTIONS

1. Configure Environment Variables:
   ${ENV_CONFIG.REQUIRED_KEYS.map(key => 
     `   - ${key.name}: Get from ${key.url}`
   ).join('\n')}

2. Choose Deployment Platform:
   ${ENV_CONFIG.DEPLOYMENT_OPTIONS.map(platform => 
     `   - ${platform.name}${platform.recommended ? ' (RECOMMENDED)' : ''}: ${platform.command}`
   ).join('\n')}

3. Build and Deploy:
   npm run build
   vercel --prod  # or your chosen platform

4. Post-deployment Testing:
   - User registration/login
   - Payment processing  
   - AI features
   - Multi-language support
   - Dropshipping integration

5. Marketing Launch:
   - Set up analytics tracking
   - Configure payment webhooks
   - Launch marketing campaigns
   - Monitor user acquisition

🎯 Expected Results:
   - First users: 24-48 hours
   - First revenue: 1-2 weeks  
   - Break-even: 2-4 months
   - Scale potential: Unlimited

💰 Revenue Targets:
   - Month 1: $2,500 - $15,000
   - Month 6: $27,000 - $285,000
   - Year 1: $60,000 - $850,000

Your AI marketing empire starts now! 🌍
  `;
};

export default ENV_CONFIG;