# API Documentation

Welcome to the NexusOne AI API documentation. This guide covers all available endpoints, authentication, and integration examples.

## 📋 Table of Contents

- [Authentication](#authentication)
- [Base URL](#base-url)
- [Rate Limiting](#rate-limiting)
- [Error Handling](#error-handling)
- [Endpoints](#endpoints)
  - [Authentication](#authentication-endpoints)
  - [Campaigns](#campaigns)
  - [Magic Pages](#magic-pages)
  - [Video Generation](#video-generation)
  - [AI Agents](#ai-agents)
  - [Dropshipping](#dropshipping)
  - [Analytics](#analytics)
- [Webhooks](#webhooks)
- [SDKs](#sdks)

## Authentication

All API requests require authentication using JWT tokens from Supabase Auth.

### Getting an Access Token

```javascript
// Using Supabase client
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})

const accessToken = data.session?.access_token
```

### Using the Token

Include the token in the Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     -H "Content-Type: application/json" \
     https://api.nexusone.ai/v1/campaigns
```

## Base URL

```
Production: https://api.nexusone.ai/v1
Development: http://localhost:54321/functions/v1
```

## Rate Limiting

API requests are limited based on your subscription plan:

| Plan | Requests/Hour | Burst Limit |
|------|---------------|-------------|
| Free | 100 | 10 |
| Pro | 1,000 | 50 |
| Premium | 10,000 | 200 |

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Error Handling

The API uses conventional HTTP response codes:

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Rate Limit Exceeded |
| 500 | Internal Server Error |

Error response format:
```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request parameters are invalid",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  }
}
```

## Endpoints

### Authentication Endpoints

#### Get User Profile
```http
GET /auth/profile
```

Response:
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "plan": "pro",
  "credits": 450,
  "created_at": "2025-01-01T00:00:00Z"
}
```

### Campaigns

#### Create Campaign
```http
POST /campaigns
```

Request body:
```json
{
  "name": "Summer Sale Campaign",
  "type": "complete_funnel",
  "product_url": "https://example.com/product",
  "options": {
    "include_video": true,
    "include_landing_page": true,
    "include_ads": true,
    "target_audience": "tech_enthusiasts"
  }
}
```

Response:
```json
{
  "id": "campaign_123",
  "status": "generating",
  "name": "Summer Sale Campaign",
  "type": "complete_funnel",
  "assets": {
    "landing_page": null,
    "video": null,
    "ads": null
  },
  "created_at": "2025-01-01T00:00:00Z"
}
```

#### Get Campaign
```http
GET /campaigns/{campaign_id}
```

Response:
```json
{
  "id": "campaign_123",
  "status": "completed",
  "name": "Summer Sale Campaign",
  "type": "complete_funnel",
  "assets": {
    "landing_page": {
      "url": "https://nexusone.ai/pages/abc123",
      "title": "Revolutionary Tech Product",
      "sections": ["hero", "features", "testimonials", "cta"]
    },
    "video": {
      "url": "https://storage.nexusone.ai/videos/video_456.mp4",
      "duration": 30,
      "format": "mp4"
    },
    "ads": [
      {
        "platform": "facebook",
        "creative_url": "https://storage.nexusone.ai/ads/fb_creative_789.jpg",
        "copy": "Transform your life with this amazing product!",
        "targeting": {
          "age_range": "25-45",
          "interests": ["technology", "innovation"],
          "behaviors": ["online_shoppers"]
        }
      }
    ]
  },
  "analytics": {
    "views": 1250,
    "clicks": 89,
    "conversions": 12,
    "revenue": 2400.00
  },
  "created_at": "2025-01-01T00:00:00Z",
  "completed_at": "2025-01-01T00:05:30Z"
}
```

#### List Campaigns
```http
GET /campaigns?page=1&limit=20&status=completed
```

Response:
```json
{
  "campaigns": [
    {
      "id": "campaign_123",
      "name": "Summer Sale Campaign",
      "status": "completed",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

### Magic Pages

#### Generate Landing Page
```http
POST /magic-pages
```

Request body:
```json
{
  "product_url": "https://example.com/product",
  "style": "modern",
  "target_audience": "young_professionals",
  "goal": "sales",
  "custom_sections": ["hero", "features", "testimonials", "pricing", "faq"]
}
```

Response:
```json
{
  "id": "page_123",
  "url": "https://nexusone.ai/pages/abc123",
  "title": "Revolutionary Tech Product - Transform Your Life",
  "sections": [
    {
      "type": "hero",
      "content": {
        "headline": "Transform Your Life with Revolutionary Technology",
        "subheadline": "Join thousands who have already experienced the difference",
        "cta_text": "Get Started Today",
        "image_url": "https://storage.nexusone.ai/images/hero_123.jpg"
      }
    },
    {
      "type": "features",
      "content": {
        "title": "Why Choose Our Product",
        "features": [
          {
            "title": "Easy to Use",
            "description": "Set up in minutes, see results immediately",
            "icon": "⚡"
          }
        ]
      }
    }
  ],
  "seo": {
    "meta_title": "Revolutionary Tech Product - Transform Your Life Today",
    "meta_description": "Discover the power of innovation with our revolutionary tech product. Join thousands of satisfied customers.",
    "keywords": ["technology", "innovation", "productivity"]
  },
  "created_at": "2025-01-01T00:00:00Z"
}
```

### Video Generation

#### Create Video
```http
POST /videos
```

Request body:
```json
{
  "type": "product_demo",
  "script": "Discover the amazing features of our revolutionary product...",
  "style": "professional",
  "duration": 30,
  "voice": "female_professional",
  "background_music": true,
  "product_images": [
    "https://example.com/product1.jpg",
    "https://example.com/product2.jpg"
  ]
}
```

Response:
```json
{
  "id": "video_123",
  "status": "generating",
  "type": "product_demo",
  "estimated_completion": "2025-01-01T00:02:30Z",
  "credits_used": 25,
  "created_at": "2025-01-01T00:00:00Z"
}
```

#### Get Video Status
```http
GET /videos/{video_id}
```

Response:
```json
{
  "id": "video_123",
  "status": "completed",
  "type": "product_demo",
  "url": "https://storage.nexusone.ai/videos/video_123.mp4",
  "thumbnail_url": "https://storage.nexusone.ai/thumbnails/video_123.jpg",
  "duration": 30,
  "format": "mp4",
  "resolution": "1920x1080",
  "file_size": 15728640,
  "created_at": "2025-01-01T00:00:00Z",
  "completed_at": "2025-01-01T00:02:28Z"
}
```

### AI Agents

#### Create AI Agent
```http
POST /ai-agents
```

Request body:
```json
{
  "name": "Customer Support Bot",
  "personality": "helpful_professional",
  "knowledge_base": [
    "Our company was founded in 2020...",
    "We offer 30-day money back guarantee...",
    "Shipping takes 3-5 business days..."
  ],
  "capabilities": ["answer_questions", "book_appointments", "process_orders"],
  "language": "en"
}
```

Response:
```json
{
  "id": "agent_123",
  "name": "Customer Support Bot",
  "status": "training",
  "personality": "helpful_professional",
  "webhook_url": "https://api.nexusone.ai/v1/ai-agents/agent_123/webhook",
  "embed_code": "<script src=\"https://cdn.nexusone.ai/agents/agent_123.js\"></script>",
  "created_at": "2025-01-01T00:00:00Z"
}
```

#### Chat with Agent
```http
POST /ai-agents/{agent_id}/chat
```

Request body:
```json
{
  "message": "What's your return policy?",
  "session_id": "session_123",
  "context": {
    "user_id": "user_456",
    "page_url": "https://example.com/product"
  }
}
```

Response:
```json
{
  "response": "We offer a 30-day money-back guarantee on all products. If you're not completely satisfied, you can return your purchase for a full refund within 30 days of delivery.",
  "session_id": "session_123",
  "confidence": 0.95,
  "suggested_actions": [
    {
      "type": "show_return_form",
      "label": "Start Return Process"
    }
  ],
  "credits_used": 1
}
```

### Dropshipping

#### Import Product
```http
POST /dropshipping/import
```

Request body:
```json
{
  "source_url": "https://cjdropshipping.com/product/12345",
  "markup_percentage": 60,
  "custom_title": "Amazing Wireless Headphones",
  "custom_description": "Experience crystal-clear audio...",
  "target_categories": ["electronics", "audio"]
}
```

Response:
```json
{
  "id": "product_123",
  "title": "Amazing Wireless Headphones",
  "description": "Experience crystal-clear audio with our premium wireless headphones...",
  "price": {
    "cost": 25.00,
    "markup": 15.00,
    "selling": 40.00,
    "currency": "USD"
  },
  "images": [
    "https://storage.nexusone.ai/products/product_123_1.jpg",
    "https://storage.nexusone.ai/products/product_123_2.jpg"
  ],
  "specifications": {
    "weight": "200g",
    "battery_life": "24 hours",
    "connectivity": "Bluetooth 5.0"
  },
  "supplier": {
    "name": "CJ Dropshipping",
    "shipping_time": "7-15 days",
    "rating": 4.8
  },
  "created_at": "2025-01-01T00:00:00Z"
}
```

#### Create Order
```http
POST /dropshipping/orders
```

Request body:
```json
{
  "product_id": "product_123",
  "quantity": 2,
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zip": "10001",
      "country": "US"
    }
  },
  "payment": {
    "method": "stripe",
    "amount": 80.00,
    "currency": "USD",
    "transaction_id": "txn_123"
  }
}
```

Response:
```json
{
  "id": "order_123",
  "status": "processing",
  "product_id": "product_123",
  "quantity": 2,
  "total_amount": 80.00,
  "customer": {
    "name": "John Doe",
    "email": "john@example.com"
  },
  "tracking": {
    "number": null,
    "url": null,
    "carrier": null
  },
  "estimated_delivery": "2025-01-15T00:00:00Z",
  "created_at": "2025-01-01T00:00:00Z"
}
```

### Analytics

#### Get Dashboard Stats
```http
GET /analytics/dashboard?period=30d
```

Response:
```json
{
  "period": "30d",
  "overview": {
    "total_campaigns": 45,
    "total_revenue": 12500.00,
    "total_conversions": 234,
    "average_ctr": 3.2
  },
  "campaigns": {
    "active": 12,
    "completed": 33,
    "total_views": 45000,
    "total_clicks": 1440,
    "conversion_rate": 2.8
  },
  "revenue": {
    "current_period": 12500.00,
    "previous_period": 8750.00,
    "growth_rate": 42.9
  },
  "top_performers": [
    {
      "campaign_id": "campaign_123",
      "name": "Summer Sale Campaign",
      "revenue": 2400.00,
      "conversions": 12,
      "roi": 340
    }
  ]
}
```

## Webhooks

Set up webhooks to receive real-time notifications about events in your account.

### Webhook Events

| Event | Description |
|-------|-------------|
| `campaign.completed` | Campaign generation finished |
| `video.completed` | Video generation finished |
| `order.created` | New dropshipping order |
| `order.shipped` | Order shipped |
| `payment.received` | Payment processed |

### Webhook Payload Example

```json
{
  "event": "campaign.completed",
  "timestamp": "2025-01-01T00:05:30Z",
  "data": {
    "campaign_id": "campaign_123",
    "status": "completed",
    "assets": {
      "landing_page": "https://nexusone.ai/pages/abc123",
      "video": "https://storage.nexusone.ai/videos/video_456.mp4"
    }
  }
}
```

### Webhook Verification

Verify webhook authenticity using the signature header:

```javascript
const crypto = require('crypto')

function verifyWebhook(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
  
  return signature === `sha256=${expectedSignature}`
}
```

## SDKs

### JavaScript/TypeScript SDK

```bash
npm install @nexusone/sdk
```

```javascript
import { NexusOneAPI } from '@nexusone/sdk'

const api = new NexusOneAPI({
  apiKey: 'your-api-key',
  baseURL: 'https://api.nexusone.ai/v1'
})

// Create a campaign
const campaign = await api.campaigns.create({
  name: 'My Campaign',
  type: 'complete_funnel',
  product_url: 'https://example.com/product'
})

// Generate a landing page
const page = await api.magicPages.create({
  product_url: 'https://example.com/product',
  style: 'modern'
})
```

### Python SDK

```bash
pip install nexusone-sdk
```

```python
from nexusone import NexusOneAPI

api = NexusOneAPI(api_key='your-api-key')

# Create a campaign
campaign = api.campaigns.create(
    name='My Campaign',
    type='complete_funnel',
    product_url='https://example.com/product'
)

# Generate a video
video = api.videos.create(
    type='product_demo',
    script='Amazing product features...',
    duration=30
)
```

## Support

- **Documentation**: https://docs.nexusone.ai
- **API Status**: https://status.nexusone.ai
- **Support**: api-support@nexusone.ai
- **Discord**: https://discord.gg/nexusone

---

Last updated: January 2025