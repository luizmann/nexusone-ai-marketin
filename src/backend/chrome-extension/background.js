// Background service worker for NexusOne CJ Extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('NexusOne CJ Extension installed');
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'EXTRACT_PRODUCT') {
    handleProductExtraction(message.data, sendResponse);
    return true; // Keep message channel open for async response
  }
  
  if (message.type === 'IMPORT_PRODUCT') {
    importToNexusOne(message.data, sendResponse);
    return true;
  }
});

// Extract product data from CJ Dropshipping page
async function handleProductExtraction(data, sendResponse) {
  try {
    const productData = {
      id: data.productId,
      name: data.productName,
      price: data.price,
      originalPrice: data.originalPrice,
      image: data.image,
      category: data.category,
      url: data.url,
      description: data.description,
      supplier: data.supplier,
      inventory: data.inventory,
      shippingTime: data.shippingTime
    };
    
    sendResponse({ success: true, product: productData });
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}

// Import product to NexusOne dashboard
async function importToNexusOne(productData, sendResponse) {
  try {
    // Get stored API key
    const result = await chrome.storage.sync.get(['nexusone_api_key', 'nexusone_endpoint']);
    
    if (!result.nexusone_api_key) {
      sendResponse({ success: false, error: 'NexusOne API key not configured' });
      return;
    }
    
    const apiEndpoint = result.nexusone_endpoint || 'https://nexusone.ai/api';
    
    // Send product to NexusOne
    const response = await fetch(`${apiEndpoint}/extension/import-product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${result.nexusone_api_key}`
      },
      body: JSON.stringify({
        product: productData,
        source: 'cj_dropshipping',
        timestamp: Date.now()
      })
    });
    
    if (!response.ok) {
      throw new Error(`Import failed: ${response.statusText}`);
    }
    
    const importResult = await response.json();
    sendResponse({ success: true, result: importResult });
    
    // Show success notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon-48.png',
      title: 'Product Imported Successfully',
      message: `${productData.name} has been added to your NexusOne dashboard`
    });
    
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}

// Handle bulk import
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'BULK_IMPORT') {
    handleBulkImport(message.products, sendResponse);
    return true;
  }
});

async function handleBulkImport(products, sendResponse) {
  try {
    const result = await chrome.storage.sync.get(['nexusone_api_key', 'nexusone_endpoint']);
    
    if (!result.nexusone_api_key) {
      sendResponse({ success: false, error: 'NexusOne API key not configured' });
      return;
    }
    
    const apiEndpoint = result.nexusone_endpoint || 'https://nexusone.ai/api';
    
    // Import products in batches
    const batchSize = 5;
    const results = [];
    
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      const response = await fetch(`${apiEndpoint}/extension/bulk-import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${result.nexusone_api_key}`
        },
        body: JSON.stringify({
          products: batch,
          source: 'cj_dropshipping',
          timestamp: Date.now()
        })
      });
      
      if (response.ok) {
        const batchResult = await response.json();
        results.push(...batchResult.imported);
      }
      
      // Add delay between batches
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    sendResponse({ success: true, imported: results.length, total: products.length });
    
    // Show bulk import notification
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon-48.png',
      title: 'Bulk Import Complete',
      message: `Successfully imported ${results.length} of ${products.length} products`
    });
    
  } catch (error) {
    sendResponse({ success: false, error: error.message });
  }
}