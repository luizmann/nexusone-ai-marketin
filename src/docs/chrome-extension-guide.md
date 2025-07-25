# NexusOne CJ Dropshipping Chrome Extension

## Overview
The NexusOne Chrome Extension allows Premium members to import products directly from CJ Dropshipping with one click, automatically generating campaigns and marketing materials.

## Features
- **One-Click Import**: Import any CJ Dropshipping product instantly
- **Auto Price Calculation**: Automatically calculates optimal selling prices
- **Campaign Generation**: Creates complete marketing campaigns with AI
- **Bulk Operations**: Select and import multiple products at once
- **Real-time Sync**: Syncs directly with your NexusOne dashboard

## Installation Guide

### Prerequisites
- NexusOne Premium account
- Google Chrome browser
- Developer mode enabled in Chrome

### Step-by-Step Installation

1. **Download Extension Files**
   - Log into your NexusOne Premium account
   - Go to Drop Magic → Import Tools tab
   - Click "Download Extension" button

2. **Enable Developer Mode**
   - Open Chrome and go to `chrome://extensions/`
   - Toggle "Developer mode" in the top right corner

3. **Install Extension**
   - Click "Load unpacked" button
   - Select the downloaded extension folder
   - Extension will appear in your Chrome toolbar

4. **Configure Extension**
   - Click the NexusOne extension icon
   - Enter your NexusOne API key (found in Settings)
   - Select default import preferences

## Usage Instructions

### Importing Single Products

1. **Browse CJ Dropshipping**
   - Go to any product page on cjdropshipping.com
   - The NexusOne extension icon will light up

2. **Import Product**
   - Click the extension icon
   - Review product details and pricing
   - Click "Import to NexusOne"
   - Product appears in your Drop Magic dashboard

3. **Generate Campaign**
   - Go to your NexusOne dashboard
   - Find the imported product
   - Click "Generate Campaign" for instant marketing assets

### Bulk Import Mode

1. **Enable Bulk Mode**
   - Click extension icon on any CJ page
   - Toggle "Bulk Import Mode"

2. **Select Products**
   - Browse through product listings
   - Click the "+" icon on products you want
   - Selected products show in extension popup

3. **Import All**
   - Review selected products
   - Set pricing rules for all
   - Click "Import All to NexusOne"

## Extension Features

### Smart Price Calculator
- Analyzes market prices automatically
- Suggests optimal selling prices
- Calculates profit margins in real-time
- Considers shipping costs and fees

### Campaign Auto-Generation
- Creates landing pages instantly
- Generates Facebook/Google ad copy
- Produces product videos with AI
- Sets up WhatsApp sales funnels

### Integration Features
- Real-time sync with NexusOne
- Automatic inventory updates
- Order management integration
- Performance tracking

## Troubleshooting

### Common Issues

**Extension Not Loading**
- Ensure Developer mode is enabled
- Check Chrome version (minimum Chrome 88)
- Reload extension from chrome://extensions/

**Import Failures**
- Verify internet connection
- Check NexusOne API key in extension settings
- Ensure Premium subscription is active

**Products Not Syncing**
- Refresh NexusOne dashboard
- Check extension permissions
- Verify CJ Dropshipping login status

### Support
- Extension issues: support@nexusone.ai
- Feature requests: Premium member portal
- Documentation: nexusone.ai/docs/chrome-extension

## API Integration

### Extension Endpoints
```javascript
// Import single product
POST /api/extension/import-product
{
  "productId": "12345",
  "url": "https://cjdropshipping.com/product/12345",
  "pricing": {
    "sellPrice": 29.99,
    "margin": 60
  }
}

// Bulk import
POST /api/extension/bulk-import
{
  "products": [
    {
      "productId": "12345",
      "sellPrice": 29.99
    }
  ]
}
```

### Authentication
- Extension uses OAuth2 with NexusOne
- API key required for all requests
- Automatic token refresh

## Privacy & Security
- Extension only accesses CJ Dropshipping pages
- No personal data collected
- Secure API communication
- Premium member data protection

## Updates
- Automatic updates via Chrome Web Store
- Premium members get early access
- Feature updates announced in dashboard

## Pricing
- **Free with Premium**: Included in Premium plan
- **Standalone**: Not available separately
- **Enterprise**: Custom licensing available

---

*This extension is exclusively available to NexusOne Premium members. Upgrade your plan to access advanced automation tools.*