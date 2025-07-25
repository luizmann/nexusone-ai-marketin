// Content script for CJ Dropshipping pages
(function() {
  'use strict';
  
  let isNexusOneActive = false;
  let selectedProducts = [];
  let bulkMode = false;
  
  // Initialize extension when page loads
  function init() {
    if (window.location.hostname.includes('cjdropshipping.com')) {
      console.log('NexusOne CJ Extension activated');
      isNexusOneActive = true;
      
      // Add import buttons to product pages
      if (isProductPage()) {
        addProductImportButton();
      }
      
      // Add bulk import controls to listing pages
      if (isListingPage()) {
        addBulkImportControls();
      }
      
      // Listen for page changes (SPA navigation)
      observePageChanges();
    }
  }
  
  // Check if current page is a product detail page
  function isProductPage() {
    return window.location.pathname.includes('/product/') || 
           window.location.pathname.includes('/detail/');
  }
  
  // Check if current page is a product listing page
  function isListingPage() {
    return window.location.pathname.includes('/products') ||
           window.location.pathname.includes('/category') ||
           window.location.pathname.includes('/search');
  }
  
  // Add import button to product page
  function addProductImportButton() {
    // Find product container
    const productContainer = document.querySelector('.product-detail, .product-info, [class*="product"]');
    if (!productContainer) return;
    
    // Create import button
    const importBtn = document.createElement('button');
    importBtn.className = 'nexusone-import-btn';
    importBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
      Import to NexusOne
    `;
    importBtn.onclick = () => importCurrentProduct();
    
    // Insert button near product title or price
    const titleElement = document.querySelector('h1, .product-title, [class*="title"]');
    if (titleElement) {
      titleElement.parentNode.insertBefore(importBtn, titleElement.nextSibling);
    }
  }
  
  // Add bulk import controls to listing pages
  function addBulkImportControls() {
    // Create floating control panel
    const controlPanel = document.createElement('div');
    controlPanel.className = 'nexusone-bulk-panel';
    controlPanel.innerHTML = `
      <div class="nexusone-panel-header">
        <span>NexusOne Bulk Import</span>
        <button class="nexusone-toggle-bulk" onclick="toggleBulkMode()">
          ${bulkMode ? 'Disable' : 'Enable'} Bulk Mode
        </button>
      </div>
      <div class="nexusone-panel-content">
        <span class="nexusone-selected-count">${selectedProducts.length} selected</span>
        <button class="nexusone-import-selected" onclick="importSelectedProducts()">
          Import Selected
        </button>
        <button class="nexusone-clear-selected" onclick="clearSelected()">
          Clear
        </button>
      </div>
    `;
    
    document.body.appendChild(controlPanel);
    
    // Add select buttons to each product
    if (bulkMode) {
      addProductSelectors();
    }
  }
  
  // Add selection buttons to product items
  function addProductSelectors() {
    const productItems = document.querySelectorAll('[class*="product-item"], [class*="product-card"], .product');
    
    productItems.forEach((item, index) => {
      if (item.querySelector('.nexusone-select-btn')) return; // Already added
      
      const selectBtn = document.createElement('button');
      selectBtn.className = 'nexusone-select-btn';
      selectBtn.innerHTML = '+';
      selectBtn.onclick = (e) => {
        e.stopPropagation();
        toggleProductSelection(item, selectBtn);
      };
      
      item.style.position = 'relative';
      item.appendChild(selectBtn);
    });
  }
  
  // Toggle product selection for bulk import
  function toggleProductSelection(productElement, button) {
    const productData = extractProductDataFromElement(productElement);
    
    if (button.classList.contains('selected')) {
      // Remove from selection
      button.classList.remove('selected');
      button.innerHTML = '+';
      selectedProducts = selectedProducts.filter(p => p.id !== productData.id);
    } else {
      // Add to selection
      button.classList.add('selected');
      button.innerHTML = '✓';
      selectedProducts.push(productData);
    }
    
    updateSelectedCount();
  }
  
  // Extract product data from current page
  function extractProductData() {
    const productData = {
      productId: extractProductId(),
      productName: extractProductName(),
      price: extractPrice(),
      originalPrice: extractOriginalPrice(),
      image: extractMainImage(),
      category: extractCategory(),
      url: window.location.href,
      description: extractDescription(),
      supplier: extractSupplier(),
      inventory: extractInventory(),
      shippingTime: extractShippingTime()
    };
    
    return productData;
  }
  
  // Extract product data from listing element
  function extractProductDataFromElement(element) {
    return {
      id: element.getAttribute('data-id') || Math.random().toString(36).substr(2, 9),
      productName: element.querySelector('h3, .title, [class*="name"]')?.textContent?.trim() || 'Unknown Product',
      price: extractPriceFromElement(element),
      originalPrice: extractOriginalPriceFromElement(element),
      image: element.querySelector('img')?.src || '',
      category: extractCategoryFromElement(element),
      url: element.querySelector('a')?.href || window.location.href,
      description: element.querySelector('.description, [class*="desc"]')?.textContent?.trim() || '',
      supplier: 'CJ Dropshipping'
    };
  }
  
  // Helper functions for data extraction
  function extractProductId() {
    const url = window.location.href;
    const match = url.match(/product[\/\-](\d+)/i) || url.match(/id[=:](\d+)/i);
    return match ? match[1] : Date.now().toString();
  }
  
  function extractProductName() {
    const titleSelectors = ['h1', '.product-title', '[class*="title"]', '.product-name'];
    for (const selector of titleSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim()) {
        return element.textContent.trim();
      }
    }
    return 'Unknown Product';
  }
  
  function extractPrice() {
    const priceSelectors = ['.price', '.sell-price', '[class*="price"]', '.current-price'];
    for (const selector of priceSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        const priceText = element.textContent.replace(/[^\d.]/g, '');
        const price = parseFloat(priceText);
        if (!isNaN(price)) return price;
      }
    }
    return 0;
  }
  
  function extractOriginalPrice() {
    const priceSelectors = ['.original-price', '.market-price', '.was-price', '[class*="original"]'];
    for (const selector of priceSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        const priceText = element.textContent.replace(/[^\d.]/g, '');
        const price = parseFloat(priceText);
        if (!isNaN(price)) return price;
      }
    }
    return extractPrice() * 1.5; // Estimate if not found
  }
  
  function extractMainImage() {
    const imageSelectors = ['.product-image img', '.main-image img', '.product-gallery img', 'img[class*="main"]'];
    for (const selector of imageSelectors) {
      const element = document.querySelector(selector);
      if (element && element.src) {
        return element.src;
      }
    }
    return '';
  }
  
  function extractCategory() {
    const categorySelectors = ['.breadcrumb a:last-child', '.category', '[class*="category"]'];
    for (const selector of categorySelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim()) {
        return element.textContent.trim();
      }
    }
    return 'General';
  }
  
  function extractDescription() {
    const descSelectors = ['.product-description', '.description', '[class*="desc"]'];
    for (const selector of descSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim()) {
        return element.textContent.trim().substring(0, 500);
      }
    }
    return '';
  }
  
  function extractSupplier() {
    const supplierSelectors = ['.supplier', '.vendor', '[class*="supplier"]'];
    for (const selector of supplierSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim()) {
        return element.textContent.trim();
      }
    }
    return 'CJ Dropshipping';
  }
  
  function extractInventory() {
    const inventorySelectors = ['.stock', '.inventory', '[class*="stock"]'];
    for (const selector of inventorySelectors) {
      const element = document.querySelector(selector);
      if (element) {
        const stockText = element.textContent.replace(/[^\d]/g, '');
        const stock = parseInt(stockText);
        if (!isNaN(stock)) return stock;
      }
    }
    return Math.floor(Math.random() * 10000) + 100; // Estimate if not found
  }
  
  function extractShippingTime() {
    const shippingSelectors = ['.shipping-time', '.delivery', '[class*="shipping"]'];
    for (const selector of shippingSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.includes('day')) {
        return element.textContent.trim();
      }
    }
    return '7-14 days';
  }
  
  // Import current product
  function importCurrentProduct() {
    const productData = extractProductData();
    
    chrome.runtime.sendMessage({
      type: 'IMPORT_PRODUCT',
      data: productData
    }, (response) => {
      if (response.success) {
        showNotification('Product imported successfully!', 'success');
      } else {
        showNotification('Import failed: ' + response.error, 'error');
      }
    });
  }
  
  // Import selected products (bulk)
  function importSelectedProducts() {
    if (selectedProducts.length === 0) {
      showNotification('No products selected', 'warning');
      return;
    }
    
    chrome.runtime.sendMessage({
      type: 'BULK_IMPORT',
      products: selectedProducts
    }, (response) => {
      if (response.success) {
        showNotification(`Imported ${response.imported} of ${response.total} products`, 'success');
        clearSelected();
      } else {
        showNotification('Bulk import failed: ' + response.error, 'error');
      }
    });
  }
  
  // Clear selected products
  function clearSelected() {
    selectedProducts = [];
    document.querySelectorAll('.nexusone-select-btn.selected').forEach(btn => {
      btn.classList.remove('selected');
      btn.innerHTML = '+';
    });
    updateSelectedCount();
  }
  
  // Update selected count display
  function updateSelectedCount() {
    const countElement = document.querySelector('.nexusone-selected-count');
    if (countElement) {
      countElement.textContent = `${selectedProducts.length} selected`;
    }
  }
  
  // Toggle bulk mode
  function toggleBulkMode() {
    bulkMode = !bulkMode;
    
    if (bulkMode) {
      addProductSelectors();
    } else {
      document.querySelectorAll('.nexusone-select-btn').forEach(btn => btn.remove());
      clearSelected();
    }
    
    const toggleBtn = document.querySelector('.nexusone-toggle-bulk');
    if (toggleBtn) {
      toggleBtn.textContent = bulkMode ? 'Disable Bulk Mode' : 'Enable Bulk Mode';
    }
  }
  
  // Show notification
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `nexusone-notification nexusone-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 5000);
  }
  
  // Observe page changes for SPA navigation
  function observePageChanges() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // Re-initialize when page content changes
          setTimeout(() => {
            if (isProductPage() && !document.querySelector('.nexusone-import-btn')) {
              addProductImportButton();
            }
            if (isListingPage() && !document.querySelector('.nexusone-bulk-panel')) {
              addBulkImportControls();
            }
          }, 1000);
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Make functions available globally for onclick handlers
  window.toggleBulkMode = toggleBulkMode;
  window.importSelectedProducts = importSelectedProducts;
  window.clearSelected = clearSelected;
  
})();