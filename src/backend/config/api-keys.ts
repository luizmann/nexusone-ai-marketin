/**
 * API Keys Configuration for NexusOne Platform
 * 
 * Centralized configuration for all external API integrations
 */

export const API_KEYS = {
  // CJ Dropshipping API Configuration
  CJ_DROPSHIPPING: {
    ACCESS_TOKEN: "5e0e680914c6462ebcf39059b21e70a9", // Your provided CJ API key
    EMAIL: "", // Set this in your CJ account settings
    PASSWORD: "", // Set this in your CJ account settings
    WAREHOUSE_CODE: "CN_1", // Default China warehouse
  },

  // Facebook Marketing API Configuration
  FACEBOOK: {
    ACCESS_TOKEN: "EAAI0DOV8GvcBPK4ZBUTybkGl66FwZA1s45Dx3cSjOVEO4lzZAifzVR6lIoVbW6HcsP2L7x4b0065VirgfhzyfIGNCCA9QCynR3twQB01ZCqjolM7b0QfGtBpj5ZCZA5kyWONQsaYmZBRvy1ByAziVPZAot50fp9ZB4ro71pZAPk7iK4ynEMkhG2LBqUmg2VFWZCPAYQ74T3ocUZCL7u69pCaZAhqUe29gMZALb2jZB5YWQrfHbreY0hIgZDZD",
    APP_ID: "", // Set your Facebook App ID
    APP_SECRET: "", // Set your Facebook App Secret
  },

  // WhatsApp Business API Configuration
  WHATSAPP: {
    ACCESS_TOKEN: "", // Set your WhatsApp access token
    PHONE_NUMBER_ID: "", // Set your WhatsApp phone number ID
    WEBHOOK_VERIFY_TOKEN: "", // Set your webhook verify token
  },

  // OpenAI API Configuration
  OPENAI: {
    API_KEY: "", // Set your OpenAI API key
    ORGANIZATION_ID: "", // Optional: OpenAI organization ID
  },

  // D-ID API Configuration (Avatar Videos)
  DID: {
    API_KEY: "", // Set your D-ID API key
    CLIENT_ID: "", // Set your D-ID client ID
  },

  // ElevenLabs API Configuration (Text-to-Speech)
  ELEVENLABS: {
    API_KEY: "", // Set your ElevenLabs API key
  },

  // Replicate API Configuration (AI Image Generation)
  REPLICATE: {
    API_TOKEN: "", // Set your Replicate API token
  },

  // YouTube API Configuration
  YOUTUBE: {
    API_KEY: "", // Set your YouTube Data API key
    CLIENT_ID: "", // Set your YouTube OAuth client ID
    CLIENT_SECRET: "", // Set your YouTube OAuth client secret
  },

  // TikTok Marketing API Configuration
  TIKTOK: {
    ACCESS_TOKEN: "", // Set your TikTok access token
    APP_ID: "", // Set your TikTok app ID
    SECRET: "", // Set your TikTok app secret
  },

  // Shopify API Configuration
  SHOPIFY: {
    ACCESS_TOKEN: "", // Set your Shopify access token
    SHOP_DOMAIN: "", // Set your Shopify shop domain
    API_VERSION: "2023-10", // Shopify API version
  },

  // Square Payment API Configuration
  SQUARE: {
    ACCESS_TOKEN: "", // Set your Square access token
    APPLICATION_ID: "", // Set your Square application ID
    ENVIRONMENT: "sandbox", // "sandbox" or "production"
  },

  // Pexels API Configuration (Free Images)
  PEXELS: {
    API_KEY: "", // Set your Pexels API key
  },

  // Unsplash API Configuration (Free Images)
  UNSPLASH: {
    ACCESS_KEY: "", // Set your Unsplash access key
    SECRET_KEY: "", // Set your Unsplash secret key
  },

  // Supabase Configuration
  SUPABASE: {
    URL: "", // Set your Supabase project URL
    ANON_KEY: "", // Set your Supabase anon key
    SERVICE_KEY: "", // Set your Supabase service role key
  }
}

/**
 * Get API configuration for specific service
 */
export function getAPIConfig(service: keyof typeof API_KEYS) {
  return API_KEYS[service]
}

/**
 * Validate if required API keys are configured
 */
export function validateAPIKeys(): { isValid: boolean; missing: string[] } {
  const missing: string[] = []
  
  // Check critical API keys
  if (!API_KEYS.CJ_DROPSHIPPING.ACCESS_TOKEN || API_KEYS.CJ_DROPSHIPPING.ACCESS_TOKEN === "") {
    missing.push("CJ_DROPSHIPPING.ACCESS_TOKEN")
  }
  
  if (!API_KEYS.FACEBOOK.ACCESS_TOKEN || API_KEYS.FACEBOOK.ACCESS_TOKEN === "") {
    missing.push("FACEBOOK.ACCESS_TOKEN")
  }
  
  // Add more validations as needed
  
  return {
    isValid: missing.length === 0,
    missing
  }
}

export default API_KEYS