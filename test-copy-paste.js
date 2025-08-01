/**
 * Test script for copy-paste URL to sales page functionality
 */

import { copyPasteService } from '../src/services/copyPasteIntegration';

// Test URLs and content
const testCases = [
  {
    name: 'Amazon Product URL',
    input: 'https://www.amazon.com/dp/B08N5WRWNW',
    expectedType: 'product'
  },
  {
    name: 'Shopify Store URL',
    input: 'https://example-store.myshopify.com/products/protein-powder',
    expectedType: 'product'
  },
  {
    name: 'YouTube Video URL',
    input: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    expectedType: 'video'
  },
  {
    name: 'Product Description Text',
    input: `Premium Wireless Headphones
    
High-quality sound with noise cancellation technology. Perfect for music lovers and professionals.

Features:
- 30-hour battery life
- Quick charge technology
- Premium build quality

Price: $199.99`,
    expectedType: 'text'
  },
  {
    name: 'Social Media Post',
    input: 'Just tried this amazing #coffee from @mountainroasters! The best single-origin beans I\'ve ever tasted ☕️ #coffee #organic',
    expectedType: 'social'
  },
  {
    name: 'Image URL',
    input: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    expectedType: 'image'
  }
];

async function runTests() {
  console.log('🧪 Testing Copy-Paste URL to Sales Page Functionality\n');
  
  for (const testCase of testCases) {
    console.log(`Testing: ${testCase.name}`);
    console.log(`Input: ${testCase.input.slice(0, 100)}${testCase.input.length > 100 ? '...' : ''}`);
    
    try {
      const result = await copyPasteService.extractContent(testCase.input);
      
      console.log(`✅ Type: ${result.type} (expected: ${testCase.expectedType})`);
      console.log(`📝 Title: ${result.metadata.title || 'No title'}`);
      console.log(`🏷️ Tags: ${result.metadata.tags.join(', ')}`);
      console.log(`🔍 Confidence: ${(result.metadata.confidence * 100).toFixed(1)}%`);
      
      if (result.type === 'product') {
        console.log(`💰 Price: ${result.metadata.price || 'No price'}`);
        console.log(`🏪 Brand: ${result.metadata.brand || 'No brand'}`);
      }
      
      // Test page elements generation
      const pageElements = copyPasteService.convertToPageElements(result);
      console.log(`📄 Generated ${pageElements.length} page elements`);
      
      // Test suggestions
      const suggestions = copyPasteService.generateContentSuggestions(result);
      console.log(`💡 Suggestions: ${suggestions.length} items`);
      
      console.log('✅ Test passed!\n');
      
    } catch (error) {
      console.log(`❌ Test failed: ${error.message}\n`);
    }
  }
  
  console.log('🎉 All tests completed!');
}

// Export for manual testing
export { runTests, testCases };

// Auto-run if this file is executed directly
if (typeof window !== 'undefined') {
  console.log('Copy-paste service test available. Run runTests() in console.');
}