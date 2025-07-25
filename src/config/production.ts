// Production configuration for NexusOne AI Platform

export const PRODUCTION_CONFIG = {
  // Supabase Configuration
  supabase: {
    url: "https://hbfgtdxvlbkvkrjqxnac.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiZmd0ZHh2bGJrdmtyanlkHnhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY2NjA0NzcsImV4cCI6MjAyMjIzNjQ3N30.4L1VGpMOQR4zNjL5xVKjN8QX9hBf2wP0sA7rD3kF1mE",
    serviceRoleKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiZmd0ZHh2bGJrdmtyaylnHnhjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNjY2MDQ3NywiZXhwIjoyMDIyMjM2NDc3fQ.ZxKjNz5mR8vQ2wL6pE9yF3dH7sG1nT4cA8rP0kI5bN"
  },

  // Application URLs
  app: {
    baseUrl: "https://nexusone.ai",
    appUrl: "https://app.nexusone.ai",
    apiUrl: "https://hbfgtdxvlbkvkrjqxnac.supabase.co/functions/v1",
    storageUrl: "https://hbfgtdxvlbkvkrjqxnac.supabase.co/storage/v1"
  },

  // API Configuration
  apis: {
    openai: {
      model: "gpt-4",
      maxTokens: 4000,
      temperature: 0.7
    },
    elevenlabs: {
      voiceId: "21m00Tcm4TlvDq8ikWAM",
      model: "eleven_multilingual_v2"
    },
    did: {
      presenter: "amy-jCqTUX6ICJKmLLRxZBTu5",
      driver: "bank://lively/"
    },
    replicate: {
      model: "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b"
    },
    cjDropshipping: {
      baseUrl: "https://developers.cjdropshipping.com/api2.0",
      version: "2.0"
    }
  },

  // Rate Limiting
  rateLimits: {
    anonymous: 100, // requests per hour
    authenticated: 1000,
    premium: 5000,
    burst: 50 // burst requests
  },

  // Feature Flags
  features: {
    aiContentGenerator: true,
    videoCreator: true,
    dropshippingMarketplace: true,
    whatsappAutomation: true,
    facebookAds: true,
    magicPages: true,
    crmSystem: true,
    aiAgents: true,
    incomeGenerator: true,
    productScraper: true,
    emailAutomation: true,
    analyticsTracking: true,
    multiLanguageSupport: true,
    realTimeChat: true,
    advancedReporting: true
  },

  // Subscription Plans
  plans: {
    free: {
      name: "Free",
      price: 0,
      credits: 50,
      videos: 2,
      landingPages: 2,
      whatsappNumbers: 1,
      modules: ["ai-content", "basic-analytics", "email-support"]
    },
    pro: {
      name: "Pro",
      price: 97,
      credits: 500,
      videos: 20,
      landingPages: 20,
      whatsappNumbers: 5,
      modules: ["all-basic", "video-creator", "dropshipping", "facebook-ads", "crm"]
    },
    premium: {
      name: "Premium",
      price: 297,
      credits: 2000,
      videos: 100,
      landingPages: -1, // unlimited
      whatsappNumbers: 20,
      modules: ["all-features", "priority-support", "custom-integrations"]
    }
  },

  // Storage Configuration
  storage: {
    buckets: {
      avatars: { public: true, maxSize: 5 * 1024 * 1024 },
      landingPages: { public: true, maxSize: 10 * 1024 * 1024 },
      generatedContent: { public: true, maxSize: 50 * 1024 * 1024 },
      userUploads: { public: false, maxSize: 20 * 1024 * 1024 },
      videoAssets: { public: true, maxSize: 100 * 1024 * 1024 },
      aiGenerated: { public: false, maxSize: 50 * 1024 * 1024 }
    }
  },

  // Security Settings
  security: {
    jwtExpiry: 86400, // 24 hours in seconds
    passwordMinLength: 8,
    sessionTimeout: 3600, // 1 hour
    maxLoginAttempts: 5,
    lockoutDuration: 900 // 15 minutes
  },

  // Monitoring & Analytics
  monitoring: {
    enableErrorTracking: true,
    enablePerformanceTracking: true,
    enableUserAnalytics: true,
    errorReportingLevel: "error", // debug, info, warn, error
    metricsRetentionDays: 90
  },

  // Email Configuration
  email: {
    fromAddress: "noreply@nexusone.ai",
    supportAddress: "support@nexusone.ai",
    templates: {
      welcome: "welcome-template",
      resetPassword: "reset-password-template",
      upgrade: "upgrade-template",
      lowCredits: "low-credits-template"
    }
  },

  // Internationalization
  i18n: {
    defaultLanguage: "en",
    supportedLanguages: ["en", "es", "pt", "ar", "he"],
    fallbackLanguage: "en"
  },

  // Social Media Configuration
  social: {
    facebook: {
      appId: "847521093029581",
      apiVersion: "v18.0"
    },
    whatsapp: {
      phoneNumberId: "120363204529625852",
      apiVersion: "v18.0"
    }
  },

  // Payment Configuration
  payments: {
    stripe: {
      currency: "usd",
      webhookTolerance: 300,
      testMode: false
    }
  },

  // AI Service Limits
  aiLimits: {
    openai: {
      monthlyTokenLimit: 1000000,
      dailyRequestLimit: 10000
    },
    elevenlabs: {
      monthlyCharacterLimit: 500000,
      dailyRequestLimit: 1000
    },
    replicate: {
      monthlyImageLimit: 50000,
      dailyRequestLimit: 1000
    }
  },

  // Cache Configuration
  cache: {
    redis: {
      defaultTtl: 3600, // 1 hour
      maxTtl: 86400 // 24 hours
    }
  },

  // Backup Configuration
  backup: {
    enabled: true,
    schedule: "0 2 * * *", // Daily at 2 AM
    retentionDays: 30,
    compression: true
  }
} as const;

// Environment-specific overrides
export const getConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  
  if (env === 'development') {
    return {
      ...PRODUCTION_CONFIG,
      app: {
        ...PRODUCTION_CONFIG.app,
        baseUrl: "http://localhost:3000",
        appUrl: "http://localhost:3000"
      },
      security: {
        ...PRODUCTION_CONFIG.security,
        jwtExpiry: 3600 // 1 hour for development
      },
      rateLimits: {
        ...PRODUCTION_CONFIG.rateLimits,
        anonymous: 1000, // More lenient for development
        authenticated: 10000
      }
    };
  }
  
  return PRODUCTION_CONFIG;
};

export type AppConfig = typeof PRODUCTION_CONFIG;