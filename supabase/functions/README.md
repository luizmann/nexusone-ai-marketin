# NexusOne AI Platform - Supabase Edge Functions

This directory contains all the serverless Edge Functions for the NexusOne AI platform.

## Functions Overview

### AI Content Generation
- `ai-content-generator` - Generate text content using OpenAI GPT-4
- `image-generator` - Create images using Replicate/Runware APIs
- `video-generator` - Generate marketing videos using D-ID
- `voice-generator` - Convert text to speech using ElevenLabs

### Marketing Automation
- `facebook-ads-manager` - Create and manage Facebook ad campaigns
- `whatsapp-automation` - Handle WhatsApp Business API integration
- `landing-page-builder` - Generate and deploy landing pages
- `email-automation` - Send automated email campaigns

### E-commerce & Dropshipping
- `product-scraper` - Scrape products from suppliers
- `inventory-sync` - Sync inventory with suppliers
- `order-fulfillment` - Handle dropshipping orders

### Analytics & Monitoring
- `usage-tracker` - Track API usage and credits
- `analytics-collector` - Collect user behavior data

## Deployment

All functions are deployed to Supabase Edge Runtime and use Deno runtime.

## Environment Variables

Each function requires specific environment variables for API integrations:

```bash
# OpenAI
OPENAI_API_KEY=

# D-ID
DID_API_KEY=

# ElevenLabs
ELEVENLABS_API_KEY=

# Facebook
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=

# WhatsApp
WHATSAPP_ACCESS_TOKEN=

# And more...
```