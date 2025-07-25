// Popup script for NexusOne CJ Extension
document.addEventListener('DOMContentLoaded', async () => {
  // Get stored settings
  const settings = await chrome.storage.sync.get([
    'nexusone_api_key',
    'nexusone_endpoint',
    'auto_price_calc',
    'auto_campaign_gen',
    'default_profit_margin'
  ]);
  
  // Initialize UI with stored settings
  if (settings.nexusone_api_key) {
    document.getElementById('api-key').value = settings.nexusone_api_key;
    showMainSection();
  }
  
  if (settings.nexusone_endpoint) {
    document.getElementById('endpoint').value = settings.nexusone_endpoint;
  }
  
  if (settings.auto_price_calc) {
    document.getElementById('auto-price-switch').classList.add('active');
  }
  
  if (settings.auto_campaign_gen !== false) {
    document.getElementById('auto-campaign-switch').classList.add('active');
  }
  
  if (settings.default_profit_margin) {
    document.getElementById('profit-margin').value = settings.default_profit_margin;
  }
  
  // Check if we're on a CJ Dropshipping page
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (tab.url && tab.url.includes('cjdropshipping.com')) {
    checkProductPage(tab.id);
  } else {
    showNotOnCJPage();
  }
  
  // Event listeners
  document.getElementById('connect-btn').addEventListener('click', connectToNexusOne);
  document.getElementById('import-btn').addEventListener('click', importCurrentProduct);
  document.getElementById('bulk-mode-btn').addEventListener('click', toggleBulkMode);
  document.getElementById('settings-btn').addEventListener('click', toggleSettings);
  document.getElementById('open-dashboard-btn').addEventListener('click', openDashboard);
  document.getElementById('help-link').addEventListener('click', openHelp);
  
  // Toggle switches
  document.getElementById('auto-price-switch').addEventListener('click', toggleAutoPrice);
  document.getElementById('auto-campaign-switch').addEventListener('click', toggleAutoCampaign);
  
  // Auto-save settings
  document.getElementById('profit-margin').addEventListener('change', saveSettings);
});

// Connect to NexusOne API
async function connectToNexusOne() {
  const apiKey = document.getElementById('api-key').value.trim();
  const endpoint = document.getElementById('endpoint').value.trim() || 'https://nexusone.ai/api';
  
  if (!apiKey) {
    showStatus('Please enter your API key', 'error');
    return;
  }
  
  // Test API connection
  try {
    const response = await fetch(`${endpoint}/auth/validate`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      // Save settings
      await chrome.storage.sync.set({
        nexusone_api_key: apiKey,
        nexusone_endpoint: endpoint
      });
      
      showStatus('Connected successfully!', 'success');
      showMainSection();
    } else {
      showStatus('Invalid API key or endpoint', 'error');
    }
  } catch (error) {
    showStatus('Connection failed. Check your endpoint.', 'error');
  }
}

// Show main interface
function showMainSection() {
  document.getElementById('setup-section').style.display = 'none';
  document.getElementById('main-section').style.display = 'block';
  document.getElementById('status').className = 'status connected';
  document.getElementById('status').textContent = '✅ Connected to NexusOne';
}

// Check if current page is a product page
async function checkProductPage(tabId) {
  try {
    const [result] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        // Check if this is a product page
        const isProduct = window.location.pathname.includes('/product/') || 
                         window.location.pathname.includes('/detail/');
        
        if (isProduct) {
          // Extract basic product info
          const name = document.querySelector('h1, .product-title, [class*="title"]')?.textContent?.trim();
          const priceElement = document.querySelector('.price, .sell-price, [class*="price"]');
          const price = priceElement ? parseFloat(priceElement.textContent.replace(/[^\d.]/g, '')) : 0;
          
          return { isProduct: true, name, price };
        }
        
        return { isProduct: false };
      }
    });
    
    if (result.result.isProduct) {
      showProductSection(result.result);
    }
  } catch (error) {
    console.error('Error checking product page:', error);
  }
}

// Show product import section
function showProductSection(productData) {
  document.getElementById('product-section').style.display = 'block';
  document.getElementById('product-name').textContent = productData.name || 'Unknown Product';
  document.getElementById('product-price').textContent = `$${productData.price?.toFixed(2) || '0.00'}`;
  
  // Auto-calculate selling price if enabled
  const autoPriceEnabled = document.getElementById('auto-price-switch').classList.contains('active');
  if (autoPriceEnabled && productData.price) {
    const profitMargin = parseInt(document.getElementById('profit-margin').value) || 60;
    const sellingPrice = productData.price * (1 + profitMargin / 100);
    document.getElementById('sell-price').value = sellingPrice.toFixed(2);
  }
}

// Show when not on CJ page
function showNotOnCJPage() {
  document.getElementById('status').innerHTML = '
    ℹ️ Navigate to CJ Dropshipping to import products';
  document.getElementById('status').className = 'status';
}

// Import current product
async function importCurrentProduct() {
  const button = document.getElementById('import-btn');
  const originalText = button.textContent;
  
  button.textContent = 'Importing...';
  button.disabled = true;
  
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Get product data from content script
    const response = await chrome.tabs.sendMessage(tab.id, { type: 'GET_PRODUCT_DATA' });
    
    if (response && response.success) {
      const productData = response.product;
      const sellingPrice = parseFloat(document.getElementById('sell-price').value);
      
      if (sellingPrice) {
        productData.sellingPrice = sellingPrice;
      }
      
      // Send to background for import
      chrome.runtime.sendMessage({
        type: 'IMPORT_PRODUCT',
        data: productData
      }, (importResponse) => {
        if (importResponse.success) {
          showStatus('Product imported successfully!', 'success');
          
          // Auto-generate campaign if enabled
          const autoCampaignEnabled = document.getElementById('auto-campaign-switch').classList.contains('active');
          if (autoCampaignEnabled) {
            generateCampaign(productData);
          }
        } else {
          showStatus('Import failed: ' + importResponse.error, 'error');
        }
      });
    } else {
      showStatus('Failed to extract product data', 'error');
    }
  } catch (error) {
    showStatus('Import error: ' + error.message, 'error');
  } finally {
    button.textContent = originalText;
    button.disabled = false;
  }
}

// Generate campaign for imported product
async function generateCampaign(productData) {
  try {
    const settings = await chrome.storage.sync.get(['nexusone_api_key', 'nexusone_endpoint']);
    const apiEndpoint = settings.nexusone_endpoint || 'https://nexusone.ai/api';
    
    const response = await fetch(`${apiEndpoint}/campaigns/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.nexusone_api_key}`
      },
      body: JSON.stringify({
        productId: productData.id,
        autoLaunch: false
      })
    });
    
    if (response.ok) {
      showStatus('Campaign generated automatically!', 'success');
    }
  } catch (error) {
    console.error('Campaign generation failed:', error);
  }
}

// Toggle bulk mode
async function toggleBulkMode() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_BULK_MODE' });
  
  const button = document.getElementById('bulk-mode-btn');
  button.textContent = button.textContent === 'Bulk Mode' ? 'Exit Bulk' : 'Bulk Mode';
}

// Toggle settings panel
function toggleSettings() {
  const panel = document.getElementById('settings-panel');
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

// Open NexusOne dashboard
function openDashboard() {
  chrome.tabs.create({ url: 'https://nexusone.ai/dashboard' });
}

// Open help documentation
function openHelp() {
  chrome.tabs.create({ url: 'https://nexusone.ai/docs/chrome-extension' });
}

// Toggle auto price calculation
function toggleAutoPrice() {
  const toggle = document.getElementById('auto-price-switch');
  toggle.classList.toggle('active');
  saveSettings();
}

// Toggle auto campaign generation
function toggleAutoCampaign() {
  const toggle = document.getElementById('auto-campaign-switch');
  toggle.classList.toggle('active');
  saveSettings();
}

// Save settings to storage
async function saveSettings() {
  const settings = {
    auto_price_calc: document.getElementById('auto-price-switch').classList.contains('active'),
    auto_campaign_gen: document.getElementById('auto-campaign-switch').classList.contains('active'),
    default_profit_margin: parseInt(document.getElementById('profit-margin').value) || 60
  };
  
  await chrome.storage.sync.set(settings);
}

// Show status message
function showStatus(message, type = 'info') {
  const status = document.getElementById('status');
  
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  const classes = {
    success: 'status connected',
    error: 'status disconnected',
    warning: 'status',
    info: 'status'
  };
  
  status.innerHTML = `${icons[type]} ${message}`;
  status.className = classes[type];
  
  // Clear status after 5 seconds for non-persistent messages
  if (type !== 'success') {
    setTimeout(() => {
      const currentSettings = chrome.storage.sync.get(['nexusone_api_key']);
      if (currentSettings.nexusone_api_key) {
        status.innerHTML = '✅ Connected to NexusOne';
        status.className = 'status connected';
      } else {
        status.innerHTML = '⚠️ Not Connected';
        status.className = 'status disconnected';
      }
    }, 5000);
  }
}