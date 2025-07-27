// API Keys Configuration for NexusOne AI Platform
// Uses environment variables in production for security

const getEnvVar = (key: string, fallback: string = '') => {
  if (typeof window !== 'undefined') {
    // Client-side: only access VITE_ prefixed variables
    return (import.meta.env as any)[`VITE_${key}`] || fallback;
  }
  // Server-side: access all environment variables
  return process.env[key] || fallback;
};

export const API_KEYS = {
  // AI Content Generation
  openai: {
    key: getEnvVar('OPENAI_API_KEY', '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'),
    assistantId: getEnvVar('OPENAI_ASSISTANT_ID', 'asst_0jsx8eD6P3W9XGsSRRNU2Pfd'),
    organization: getEnvVar('OPENAI_ORGANIZATION', 'org-nexusone-ai'),
    model: getEnvVar('OPENAI_MODEL', 'gpt-4o')
  },

  // Text-to-Speech
  elevenlabs: {
    key: getEnvVar('ELEVENLABS_API_KEY', 'sk_189b755ede03dfdf1633da77e125d682b44c1ddb54b08a07'),
    voiceId: getEnvVar('ELEVENLABS_VOICE_ID', '21m00Tcm4TlvDq8ikWAM'),
    model: getEnvVar('ELEVENLABS_MODEL_ID', 'eleven_multilingual_v2')
  },

  // Image Generation
  replicate: {
    key: getEnvVar('REPLICATE_API_TOKEN', 'r8_HbwQQ4NxMfhVPy0BS0xqOMkERd9B5JM440l66'),
    model: getEnvVar('REPLICATE_MODEL', 'stability-ai/sdxl'),
    version: getEnvVar('REPLICATE_VERSION', '39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b')
  },

  // WhatsApp AI Automation
  gupshup: {
    key: getEnvVar('GUPSHUP_API_KEY', 'sk_d5fe7cdab5164e53bcbffdc428fd431e'),
    apiUrl: getEnvVar('GUPSHUP_BASE_URL', 'https://api.gupshup.io/sm/api/v1'),
    appName: getEnvVar('GUPSHUP_APP_NAME', 'nexusone-ai')
  },

  // Video Generation
  luma: {
    key: getEnvVar('LUMA_API_KEY', 'luma-12423eab-79ee-4f52-ad44-00c485686cf2-ab1b6b03-15a1-4c76-b056-6765bf41ab05'),
    baseUrl: getEnvVar('LUMA_BASE_URL', 'https://api.lumalabs.ai/dream-machine/v1')
  },

  // Avatar Creation
  did: {
    key: getEnvVar('DID_API_KEY', 'PLACEHOLDER_DID_API_KEY'),
    presenter: getEnvVar('DID_PRESENTER_ID', 'amy-jCqTUX6ICJKmLLRxZBTu5'),
    driver: getEnvVar('DID_DRIVER_URL', 'bank://lively/')
  },

  // Dropshipping
  cjDropshipping: {
    key: getEnvVar('CJ_API_KEY', '5e0e680914c6462ebcf39059b21e70a9'),
    baseUrl: getEnvVar('CJ_BASE_URL', 'https://developers.cjdropshipping.com/api2.0/v1')
  },

  // Social Media
  facebook: {
    appId: getEnvVar('FACEBOOK_APP_ID', '847521093029581'),
    appSecret: getEnvVar('FACEBOOK_APP_SECRET', 'PLACEHOLDER_FACEBOOK_APP_SECRET'),
    accessToken: getEnvVar('FACEBOOK_ACCESS_TOKEN', 'EAAI0DOV8GvcBPK4ZBUTybkGl66FwZA1s45Dx3cSjOVEO4lzZAifzVR6lIoVbW6HcsP2L7x4b0065VirgfhzyfIGNCCA9QCynR3twQB01ZCqjolM7b0QfGtBpj5ZCZA5kyWONQsaYmZBRvy1ByAziVPZAot50fp9ZB4ro71pZAPk7iK4ynEMkhG2LBqUmg2VFWZCPAYQ74T3ocUZCL7u69pCaZAhqUe29gMZALb2jZB5YWQrfHbreY0hIgZDZD'),
    apiVersion: getEnvVar('FACEBOOK_API_VERSION', 'v18.0')
  },

  // WhatsApp Business
  whatsapp: {
    phoneNumberId: getEnvVar('WHATSAPP_PHONE_NUMBER_ID', '120363204529625852'),
    accessToken: getEnvVar('WHATSAPP_ACCESS_TOKEN', 'EAAI0DOV8GvcBPK4ZBUTybkGl66FwZA1s45Dx3cSjOVEO4lzZAifzVR6lIoVbW6HcsP2L7x4b0065VirgfhzyfIGNCCA9QCynR3twQB01ZCqjolM7b0QfGtBpj5ZCZA5kyWONQsaYmZBRvy1ByAziVPZAot50fp9ZB4ro71pZAPk7iK4ynEMkhG2LBqUmg2VFWZCPAYQ74T3ocUZCL7u69pCaZAhqUe29gMZALb2jZB5YWQrfHbreY0hIgZDZD'),
    apiVersion: getEnvVar('WHATSAPP_API_VERSION', 'v18.0')
  },

  // Image Assets
  unsplash: {
    key: getEnvVar('UNSPLASH_ACCESS_KEY', '-zZ5LsB2CAMUhbPca_UKw31ngzc1W3_hfxSPdz_aBUE'),
    baseUrl: getEnvVar('UNSPLASH_BASE_URL', 'https://api.unsplash.com')
  },

  // Pexels (Alternative image source)
  pexels: {
    key: getEnvVar('PEXELS_API_KEY', 'PLACEHOLDER_PEXELS_API_KEY'),
    baseUrl: getEnvVar('PEXELS_BASE_URL', 'https://api.pexels.com/v1')
  },

  // Google APIs
  google: {
    apiKey: getEnvVar('GOOGLE_API_KEY', 'PLACEHOLDER_GOOGLE_API_KEY'),
    clientId: getEnvVar('GOOGLE_CLIENT_ID', 'PLACEHOLDER_GOOGLE_CLIENT_ID'),
    youtubeApiKey: getEnvVar('YOUTUBE_API_KEY', 'PLACEHOLDER_YOUTUBE_API_KEY')
  },

  // Instagram Basic Display
  instagram: {
    appId: getEnvVar('INSTAGRAM_APP_ID', 'PLACEHOLDER_INSTAGRAM_APP_ID'),
    appSecret: getEnvVar('INSTAGRAM_APP_SECRET', 'PLACEHOLDER_INSTAGRAM_APP_SECRET')
  },

  // TikTok Marketing
  tiktok: {
    appId: getEnvVar('TIKTOK_APP_ID', 'PLACEHOLDER_TIKTOK_APP_ID'),
    appSecret: getEnvVar('TIKTOK_APP_SECRET', 'PLACEHOLDER_TIKTOK_APP_SECRET')
  },

  // Video Processing
  runway: {
    key: getEnvVar('RUNWAY_API_KEY', 'PLACEHOLDER_RUNWAY_API_KEY'),
    baseUrl: getEnvVar('RUNWAY_BASE_URL', 'https://api.runwayml.com')
  },

  // Supabase (Database & Auth)
  supabase: {
    url: getEnvVar('SUPABASE_URL', 'https://hbfgtdxvlbkvkrjqxnac.supabase.co'),
    anonKey: getEnvVar('SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiZmd0ZHh2bGJrdmtyanlxeG5hYyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjk5MjcwNDI0LCJleHAiOjIwMTQ4NDY0MjR9.qZxYwjW5xOqH1J7BkLhZRWS3FQsA9QQfO8fY6NvBgaI'),
    serviceRoleKey: getEnvVar('SUPABASE_SERVICE_ROLE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiZmd0ZHh2bGJrdmtyanlxeG5hYyIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE2OTkyNzA0MjQsImV4cCI6MjAxNDg0NjQyNH0.5YQgGYGQ2hWdYa7PtP5BxLJvC6X9WkYLqSdV4LpYnNc')
  },

  // Stripe (Payments)
  stripe: {
    publishableKey: getEnvVar('STRIPE_PUBLISHABLE_KEY', 'PLACEHOLDER_STRIPE_PUBLISHABLE_KEY'),
    secretKey: getEnvVar('STRIPE_SECRET_KEY', 'PLACEHOLDER_STRIPE_SECRET_KEY'),
    webhookSecret: getEnvVar('STRIPE_WEBHOOK_SECRET', 'PLACEHOLDER_STRIPE_WEBHOOK_SECRET')
  },

  // PayPal (Alternative payments)
  paypal: {
    clientId: getEnvVar('PAYPAL_CLIENT_ID', 'PLACEHOLDER_PAYPAL_CLIENT_ID'),
    clientSecret: getEnvVar('PAYPAL_CLIENT_SECRET', 'PLACEHOLDER_PAYPAL_CLIENT_SECRET'),
    environment: getEnvVar('PAYPAL_ENVIRONMENT', 'sandbox') // or "production"
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