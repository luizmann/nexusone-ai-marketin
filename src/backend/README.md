# NexusOne AI Marketing Platform - Backend API Documentation

## Overview

The NexusOne backend provides a comprehensive REST API for managing AI-powered marketing automation, multi-language support, and integration with 15+ external services.

## Getting Started

### Prerequisites
- Node.js 18+ 
- Supabase account
- API keys for integrated services

### Installation

```bash
cd src/backend
npm install
cp .env.example .env
# Configure your environment variables
npm run dev
```

### Database Setup

```bash
# Run database migrations
npm run db:migrate

# Generate TypeScript types
npm run db:generate-types
```

## API Endpoints

### Authentication

#### POST `/api/auth/register`
Create new user account
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "first_name": "John",
  "last_name": "Doe",
  "preferred_language": "en"
}
```

#### POST `/api/auth/login`
User login
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### User Management

#### GET `/api/user/profile`
Get current user profile (requires authentication)

#### PUT `/api/user/profile`
Update user profile
```json
{
  "first_name": "John",
  "last_name": "Smith",
  "preferred_language": "es",
  "timezone": "America/New_York"
}
```

### Credits Management

#### GET `/api/credits`
Get credit balance and transaction history

#### POST `/api/credits/purchase`
Purchase additional credits
```json
{
  "amount": 500,
  "payment_method": "stripe"
}
```

### Magic Pages (Landing Pages)

#### GET `/api/magic-pages`
Get user's landing pages

#### POST `/api/magic-pages`
Create new landing page (requires 10 credits)
```json
{
  "title": "Product Launch Page",
  "content": {
    "headline": "Revolutionary Product",
    "subheadline": "Transform your business"
  },
  "template_id": "modern-tech",
  "language": "en"
}
```

#### PUT `/api/magic-pages/:id`
Update landing page

### Video Creator

#### GET `/api/video-projects`
Get user's video projects

#### POST `/api/video-projects`
Create new video project (requires 25 credits)
```json
{
  "title": "Product Demo Video",
  "script": "Welcome to our amazing product...",
  "avatar_id": "anna_costume1_cameraA",
  "voice_id": "pNInz6obpgDQGcFmaJgB",
  "language": "en"
}
```

### WhatsApp Automation

#### GET `/api/whatsapp/numbers`
Get WhatsApp numbers

#### POST `/api/whatsapp/numbers`
Add WhatsApp number
```json
{
  "phone_number": "+1234567890",
  "display_name": "Business Account"
}
```

### CRM

#### GET `/api/crm/contacts`
Get contacts with optional filtering
- Query params: `status`, `source`

#### POST `/api/crm/contacts`
Create new contact (requires 5 credits)
```json
{
  "first_name": "Jane",
  "last_name": "Doe",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "company": "Acme Corp",
  "source": "website",
  "status": "lead"
}
```

### AI Agents

#### GET `/api/ai-agents`
Get user's AI agents

#### POST `/api/ai-agents`
Create AI agent (requires 20 credits)
```json
{
  "name": "Customer Support Bot",
  "description": "Handles customer inquiries",
  "personality": "helpful and professional",
  "instructions": "Answer questions about our products...",
  "model": "gpt-4o",
  "temperature": 0.7
}
```

### E-commerce

#### GET `/api/stores`
Get user's stores

#### POST `/api/stores`
Create new store
```json
{
  "name": "My Dropship Store",
  "domain": "mystore.com",
  "store_type": "dropship",
  "platform": "shopify"
}
```

#### GET `/api/products`
Get products
- Query params: `store_id`

#### POST `/api/products/import`
Import product from dropshipping API (requires 3 credits)
```json
{
  "external_id": "CJ123456",
  "store_id": "store-uuid",
  "source": "cj_dropshipping"
}
```

### Marketing Campaigns

#### GET `/api/campaigns`
Get campaigns
- Query params: `platform`

#### POST `/api/campaigns`
Create campaign (requires 15 credits)
```json
{
  "name": "Summer Sale Campaign",
  "platform": "facebook",
  "objective": "conversions",
  "target_audience": {
    "age_min": 25,
    "age_max": 45,
    "interests": ["technology", "gadgets"]
  },
  "budget": 100,
  "daily_budget": 10
}
```

### Analytics

#### GET `/api/analytics`
Get user analytics
- Query params: `start_date`, `end_date`

## Webhooks

### WhatsApp Webhook
- URL: `/webhooks/whatsapp`
- Method: POST
- Handles incoming WhatsApp messages and triggers automation flows

### Payment Webhook
- URL: `/webhooks/payment/:provider`
- Method: POST
- Handles payment confirmations and subscription updates

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer your-jwt-token-here
```

## Error Handling

API returns standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 402: Payment Required (insufficient credits)
- 403: Forbidden (plan upgrade required)
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error

Error response format:
```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```

## Rate Limiting

- 100 requests per 15 minutes per IP
- Additional rate limiting based on user plan
- Credit-based usage limits for AI features

## Plan-Based Access Control

Features are gated by subscription plan:

### Free Plan
- magic_pages, product_scraper, crm, generate_income, whatsapp_bot

### Pro Plan  
- All Free features plus: video_creator, facebook_ads, ai_agents

### Premium Plan
- All features including: tiktok_ads, youtube_automation

## Background Jobs

Async processing for:
- Video generation
- Campaign creation  
- Content generation
- Product imports
- WhatsApp message sending

## Multi-Language Support

All content generation endpoints support language parameter:
- `en` (English)
- `es` (Spanish) 
- `pt` (Portuguese)
- `ar` (Arabic)
- `he` (Hebrew)

## Integration Services

### AI Services
- OpenAI GPT-4o for content generation
- D-ID for video avatars
- ElevenLabs for text-to-speech
- Replicate for image generation

### Marketing Platforms
- Facebook Marketing API
- TikTok Marketing API
- YouTube Data API
- WhatsApp Business API

### E-commerce
- CJ Dropshipping API
- DSers API
- Shopify API

### Media Assets
- Pexels API for stock photos
- Unsplash API for high-quality images

## Security Features

- JWT-based authentication
- Row Level Security (RLS) in database
- API key encryption
- Rate limiting
- Input validation
- CORS protection
- Helmet security headers

## Monitoring & Logging

- Comprehensive request/response logging
- Error tracking with Sentry integration
- Performance monitoring
- User activity analytics
- Credit usage tracking

## Development

### Running Tests
```bash
npm test
```

### Code Linting
```bash
npm run lint
npm run lint:fix
```

### Building for Production
```bash
npm run build
npm start
```

## Deployment

The backend is designed for deployment on:
- Supabase Edge Functions
- Vercel
- Railway
- Heroku
- AWS/GCP/Azure

Ensure all environment variables are configured in your deployment platform.