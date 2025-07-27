// API Keys Configuration for NexusOne AI Platform
// IMPORTANT: In production, these should be environment variables

export const API_KEYS = {
  // AI Content Generation
  openai: {
    key: "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",
    assistantId: "asst_0jsx8eD6P3W9XGsSRRNU2Pfd",
    organization: "org-nexusone-ai",
    model: "gpt-4o"
  },

  // Text-to-Speech
  elevenlabs: {
    key: "sk_189b755ede03dfdf1633da77e125d682b44c1ddb54b08a07",
    voiceId: "21m00Tcm4TlvDq8ikWAM",
    model: "eleven_multilingual_v2"
  },

  // Image Generation
  replicate: {
    key: "r8_HbwQQ4NxMfhVPy0BS0xqOMkERd9B5JM440l66",
    model: "stability-ai/sdxl",
    version: "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b"
  },

  // WhatsApp AI Automation
  gupshup: {
    key: "sk_d5fe7cdab5164e53bcbffdc428fd431e",
    apiUrl: "https://api.gupshup.io/sm/api/v1",
    appName: "nexusone-ai"
  },

  // Video Generation
  luma: {
    key: "luma-12423eab-79ee-4f52-ad44-00c485686cf2-ab1b6b03-15a1-4c76-b056-6765bf41ab05",
    baseUrl: "https://api.lumalabs.ai/dream-machine/v1"
  },

  // Avatar Creation
  did: {
    key: "PLACEHOLDER_DID_API_KEY",
    presenter: "amy-jCqTUX6ICJKmLLRxZBTu5",
    driver: "bank://lively/"
  },

  // Dropshipping
  cjDropshipping: {
    key: "5e0e680914c6462ebcf39059b21e70a9",
    baseUrl: "https://developers.cjdropshipping.com/api2.0"
  },

  // Social Media
  facebook: {
    appId: "847521093029581",
    appSecret: "PLACEHOLDER_FACEBOOK_APP_SECRET",
    accessToken: "EAAI0DOV8GvcBPK4ZBUTybkGl66FwZA1s45Dx3cSjOVEO4lzZAifzVR6lIoVbW6HcsP2L7x4b0065VirgfhzyfIGNCCA9QCynR3twQB01ZCqjolM7b0QfGtBpj5ZCZA5kyWONQsaYmZBRvy1ByAziVPZAot50fp9ZB4ro71pZAPk7iK4ynEMkhG2LBqUmg2VFWZCPAYQ74T3ocUZCL7u69pCaZAhqUe29gMZALb2jZB5YWQrfHbreY0hIgZDZD",
    apiVersion: "v18.0"
  },

  // WhatsApp Business
  whatsapp: {
    phoneNumberId: "120363204529625852",
    accessToken: "EAAI0DOV8GvcBPK4ZBUTybkGl66FwZA1s45Dx3cSjOVEO4lzZAifzVR6lIoVbW6HcsP2L7x4b0065VirgfhzyfIGNCCA9QCynR3twQB01ZCqjolM7b0QfGtBpj5ZCZA5kyWONQsaYmZBRvy1ByAziVPZAot50fp9ZB4ro71pZAPk7iK4ynEMkhG2LBqUmg2VFWZCPAYQ74T3ocUZCL7u69pCaZAhqUe29gMZALb2jZB5YWQrfHbreY0hIgZDZD",
    apiVersion: "v18.0"
  },

  // Image Assets
  unsplash: {
    key: "-zZ5LsB2CAMUhbPca_UKw31ngzc1W3_hfxSPdz_aBUE",
    baseUrl: "https://api.unsplash.com"
  },

  // Pexels (Alternative image source)
  pexels: {
    key: "PLACEHOLDER_PEXELS_API_KEY",
    baseUrl: "https://api.pexels.com/v1"
  },

  // Google APIs
  google: {
    apiKey: "PLACEHOLDER_GOOGLE_API_KEY",
    clientId: "PLACEHOLDER_GOOGLE_CLIENT_ID",
    youtubeApiKey: "PLACEHOLDER_YOUTUBE_API_KEY"
  },

  // Instagram Basic Display
  instagram: {
    appId: "PLACEHOLDER_INSTAGRAM_APP_ID",
    appSecret: "PLACEHOLDER_INSTAGRAM_APP_SECRET"
  },

  // TikTok Marketing
  tiktok: {
    appId: "PLACEHOLDER_TIKTOK_APP_ID",
    appSecret: "PLACEHOLDER_TIKTOK_APP_SECRET"
  },

  // Video Processing
  runway: {
    key: "PLACEHOLDER_RUNWAY_API_KEY",
    baseUrl: "https://api.runwayml.com"
  },

  // Supabase (Database & Auth)
  supabase: {
    url: "https://hbfgtdxvlbkvkrjqxnac.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiZmd0ZHh2bGJrdmtyanlkHnhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY2NjA0NzcsImV4cCI6MjAyMjIzNjQ3N30.4L1VGpMOQR4zNjL5xVKjN8QX9hBf2wP0sA7rD3kF1mE",
    serviceRoleKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiZmd0ZHh2bGJrdmtyaylnHnhjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNjY2MDQ3NywiZXhwIjoyMDIyMjM2NDc3fQ.ZxKjNz5mR8vQ2wL6pE9yF3dH7sG1nT4cA8rP0kI5bN"
  },

  // Stripe (Payments)
  stripe: {
    publishableKey: "PLACEHOLDER_STRIPE_PUBLISHABLE_KEY",
    secretKey: "PLACEHOLDER_STRIPE_SECRET_KEY",
    webhookSecret: "PLACEHOLDER_STRIPE_WEBHOOK_SECRET"
  },

  // PayPal (Alternative payments)
  paypal: {
    clientId: "PLACEHOLDER_PAYPAL_CLIENT_ID",
    clientSecret: "PLACEHOLDER_PAYPAL_CLIENT_SECRET",
    environment: "sandbox" // or "production"
  }
} as const;

// Environment variable mappings for production
export const getApiKey = (service: keyof typeof API_KEYS, key?: string) => {
  if (typeof window !== 'undefined') {
    // Client-side: return only safe, public keys
    const publicKeys = {
      supabase: API_KEYS.supabase.anonKey,
      facebook: API_KEYS.facebook.appId,
      stripe: API_KEYS.stripe.publishableKey,
      google: API_KEYS.google.clientId
    };
    
    return publicKeys[service as keyof typeof publicKeys] || null;
  }

  // Server-side: return the requested key
  const serviceKeys = API_KEYS[service];
  if (key && serviceKeys && typeof serviceKeys === 'object') {
    return (serviceKeys as any)[key];
  }
  
  return serviceKeys;
};

// Validation function to check if required keys are available
export const validateApiKeys = () => {
  const requiredKeys = [
    'openai.key',
    'elevenlabs.key', 
    'replicate.key',
    'cjDropshipping.key',
    'facebook.accessToken',
    'unsplash.key',
    'supabase.url',
    'supabase.anonKey'
  ];

  const missingKeys: string[] = [];

  requiredKeys.forEach(keyPath => {
    const [service, key] = keyPath.split('.');
    const value = getApiKey(service as keyof typeof API_KEYS, key);
    
    if (!value || value.includes('PLACEHOLDER')) {
      missingKeys.push(keyPath);
    }
  });

  return {
    isValid: missingKeys.length === 0,
    missingKeys,
    configuredKeys: requiredKeys.filter(key => !missingKeys.includes(key))
  };
};

// API Status Check
export const API_STATUS = {
  // Configured and Ready ✅
  READY: [
    'OpenAI GPT-4',
    'ElevenLabs TTS',
    'Replicate Image Generation',
    'CJ Dropshipping',
    'Facebook Marketing',
    'Unsplash Images',
    'Supabase Database'
  ],

  // Needs Configuration 🔧
  NEEDS_CONFIG: [
    'D-ID Avatar Creation',
    'Runway Video Generation',
    'Google APIs (YouTube, Ads)',
    'TikTok Marketing API',
    'Instagram Business API',
    'Stripe Payments',
    'PayPal Payments',
    'Pexels Images'
  ],

  // Optional/Future 📋
  OPTIONAL: [
    'AWS Services',
    'Azure Cognitive Services',
    'SendGrid Email',
    'Twilio SMS',
    'Zapier Webhooks',
    'HubSpot CRM'
  ]
};

export type ApiService = keyof typeof API_KEYS;
export type ApiKeyConfig = typeof API_KEYS;