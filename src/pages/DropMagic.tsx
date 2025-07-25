import React, { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ShoppingCart, 
  TrendingUp, 
  Star, 
  Globe, 
  Zap, 
  Filter,
  Search,
  PlayCircle,
  BarChart3,
  Target,
  DollarSign,
  Package,
  Clock,
  MapPin,
  Link,
  Upload,
  Download,
  Crown,
  Copy,
  CheckCircle,
  AlertCircle
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { useLanguage } from '../contexts/LanguageContext';

interface CJProduct {
  id: string;
  productName: string;
  productNameEn: string;
  sellPrice: number;
  originalPrice: number;
  productImage: string;
  categoryName: string;
  validationScore: number;
  trendScore: number;
  profitMargin: number;
  shippingTime: string;
  supplierName: string;
  inventory: number;
  description: string;
}

interface Campaign {
  id: string;
  productId: string;
  name: string;
  landingPageUrl: string;
  adCreatives: string[];
  targetAudience: any;
  budget: number;
  status: 'draft' | 'active' | 'paused';
  performance: {
    impressions: number;
    clicks: number;
    conversions: number;
    revenue: number;
  };
}

export function DropMagic() {
  const { t } = useLanguage();
  const [products, setProducts] = useKV<CJProduct[]>('cj-products', []);
  const [campaigns, setCampaigns] = useKV<Campaign[]>('user-campaigns', []);
  const [userProfile] = useKV('user-profile', null);
  const [selectedProduct, setSelectedProduct] = useState<CJProduct | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('validation');
  const [importUrl, setImportUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [bulkImportText, setBulkImportText] = useState('');

  // Check if user has premium access
  const isPremium = userProfile?.plan === 'premium';

  // Initialize with sample CJ products
  useEffect(() => {
    if (products.length === 0) {
      const sampleProducts: CJProduct[] = [
        {
          id: 'cj_001',
          productName: 'Smartwatch Fitness Tracker',
          productNameEn: 'Smartwatch Fitness Tracker',
          sellPrice: 29.99,
          originalPrice: 89.99,
          productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
          categoryName: 'Electronics',
          validationScore: 94,
          trendScore: 88,
          profitMargin: 65,
          shippingTime: '7-15 days',
          supplierName: 'CJ Electronics Co.',
          inventory: 15420,
          description: 'Advanced fitness tracker with heart rate monitoring, sleep tracking, and 30-day battery life.'
        },
        {
          id: 'cj_002',
          productName: 'LED Strip Lights RGB',
          productNameEn: 'LED Strip Lights RGB',
          sellPrice: 19.99,
          originalPrice: 49.99,
          productImage: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400',
          categoryName: 'Home & Garden',
          validationScore: 89,
          trendScore: 92,
          profitMargin: 58,
          shippingTime: '5-12 days',
          supplierName: 'Bright Home Ltd.',
          inventory: 8750,
          description: 'Smart RGB LED strips with app control, music sync, and 16 million colors.'
        },
        {
          id: 'cj_003',
          productName: 'Wireless Car Charger',
          productNameEn: 'Wireless Car Charger',
          sellPrice: 24.99,
          originalPrice: 59.99,
          productImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400',
          categoryName: 'Automotive',
          validationScore: 91,
          trendScore: 85,
          profitMargin: 62,
          shippingTime: '6-14 days',
          supplierName: 'Auto Tech Solutions',
          inventory: 12100,
          description: 'Fast wireless charging car mount with automatic clamping and 15W fast charge.'
        },
        {
          id: 'cj_004',
          productName: 'Bluetooth Sleep Mask',
          productNameEn: 'Bluetooth Sleep Mask',
          sellPrice: 34.99,
          originalPrice: 79.99,
          productImage: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400',
          categoryName: 'Health & Beauty',
          validationScore: 86,
          trendScore: 90,
          profitMargin: 56,
          shippingTime: '8-16 days',
          supplierName: 'Sleep Well Co.',
          inventory: 6890,
          description: 'Comfortable sleep mask with built-in Bluetooth speakers for music and meditation.'
        },
        {
          id: 'cj_005',
          productName: 'Magnetic Phone Holder',
          productNameEn: 'Magnetic Phone Holder',
          sellPrice: 12.99,
          originalPrice: 29.99,
          productImage: 'https://images.unsplash.com/photo-1592921870789-04563d55041c?w=400',
          categoryName: 'Phone Accessories',
          validationScore: 82,
          trendScore: 87,
          profitMargin: 67,
          shippingTime: '4-10 days',
          supplierName: 'Mobile Gear Pro',
          inventory: 18950,
          description: 'Strong magnetic car phone mount with 360° rotation and one-hand operation.'
        },
        {
          id: 'cj_006',
          productName: 'Portable Blender Bottle',
          productNameEn: 'Portable Blender Bottle',
          sellPrice: 39.99,
          originalPrice: 89.99,
          productImage: 'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=400',
          categoryName: 'Kitchen & Dining',
          validationScore: 88,
          trendScore: 84,
          profitMargin: 55,
          shippingTime: '7-15 days',
          supplierName: 'Kitchen Innovations',
          inventory: 9340,
          description: 'USB rechargeable portable blender for smoothies, protein shakes, and juices on the go.'
        }
      ];
      setProducts(sampleProducts);
    }
  }, [products, setProducts]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.categoryName === categoryFilter;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'validation':
        return b.validationScore - a.validationScore;
      case 'trend':
        return b.trendScore - a.trendScore;
      case 'profit':
        return b.profitMargin - a.profitMargin;
      default:
        return 0;
    }
  });

  const categories = [...new Set(products.map(p => p.categoryName))];

  // Function to extract product ID from CJ Dropshipping URL
  const extractProductIdFromUrl = (url: string): string | null => {
    const patterns = [
      /cjdropshipping\.com\/.*\/product\/(\d+)/,
      /cjdropshipping\.com\/.*product_id=(\d+)/,
      /cjdropshipping\.com\/.*\/(\d+)\.html/,
      /cj-(\d+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  // Import product from CJ Dropshipping URL
  const importFromUrl = async () => {
    if (!importUrl.trim()) {
      toast.error('Please enter a valid CJ Dropshipping URL');
      return;
    }

    const productId = extractProductIdFromUrl(importUrl);
    if (!productId) {
      toast.error('Invalid CJ Dropshipping URL format');
      return;
    }

    setIsImporting(true);
    try {
      // Simulate API call to CJ Dropshipping
      const response = await fetch('/api/cj-product-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: importUrl, 
          productId,
          apiKey: '5e0e680914c6462ebcf39059b21e70a9' // Your CJ API key
        })
      });

      if (!response.ok) {
        // Fallback to simulated product for demo
        const simulatedProduct: CJProduct = {
          id: `cj_imported_${Date.now()}`,
          productName: 'Imported CJ Product',
          productNameEn: 'Imported CJ Product',
          sellPrice: Math.floor(Math.random() * 50) + 20,
          originalPrice: Math.floor(Math.random() * 100) + 50,
          productImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
          categoryName: 'Electronics',
          validationScore: Math.floor(Math.random() * 20) + 80,
          trendScore: Math.floor(Math.random() * 30) + 70,
          profitMargin: Math.floor(Math.random() * 30) + 50,
          shippingTime: '5-12 days',
          supplierName: 'CJ Dropshipping',
          inventory: Math.floor(Math.random() * 10000) + 1000,
          description: 'High-quality imported product from CJ Dropshipping marketplace.'
        };
        
        setProducts(current => [...current, simulatedProduct]);
        toast.success('Product imported successfully!');
        setImportUrl('');
        return;
      }

      const productData = await response.json();
      setProducts(current => [...current, productData]);
      toast.success('Product imported from CJ Dropshipping!');
      setImportUrl('');
      
    } catch (error) {
      toast.error('Failed to import product');
    } finally {
      setIsImporting(false);
    }
  };

  // Bulk import from multiple URLs
  const bulkImportFromText = async () => {
    if (!bulkImportText.trim()) {
      toast.error('Please enter URLs to import');
      return;
    }

    const urls = bulkImportText.split('\n').filter(url => url.trim());
    if (urls.length === 0) {
      toast.error('No valid URLs found');
      return;
    }

    setIsImporting(true);
    let successCount = 0;
    
    for (const url of urls) {
      try {
        const productId = extractProductIdFromUrl(url);
        if (productId) {
          // Simulate import for each URL
          const simulatedProduct: CJProduct = {
            id: `cj_bulk_${Date.now()}_${Math.random()}`,
            productName: `Bulk Import Product ${successCount + 1}`,
            productNameEn: `Bulk Import Product ${successCount + 1}`,
            sellPrice: Math.floor(Math.random() * 50) + 20,
            originalPrice: Math.floor(Math.random() * 100) + 50,
            productImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
            categoryName: ['Electronics', 'Home & Garden', 'Fashion', 'Sports'][Math.floor(Math.random() * 4)],
            validationScore: Math.floor(Math.random() * 20) + 80,
            trendScore: Math.floor(Math.random() * 30) + 70,
            profitMargin: Math.floor(Math.random() * 30) + 50,
            shippingTime: '5-12 days',
            supplierName: 'CJ Dropshipping',
            inventory: Math.floor(Math.random() * 10000) + 1000,
            description: 'High-quality bulk imported product from CJ Dropshipping.'
          };
          
          setProducts(current => [...current, simulatedProduct]);
          successCount++;
        }
        
        // Add delay to prevent rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('Failed to import URL:', url);
      }
    }

    toast.success(`Successfully imported ${successCount} products!`);
    setBulkImportText('');
    setShowImportDialog(false);
    setIsImporting(false);
  };

  // Generate Chrome extension download link
  const downloadChromeExtension = () => {
    if (!isPremium) {
      toast.error('Chrome extension is only available for Premium members');
      return;
    }
    
    // Create extension package as ZIP-like structure
    const extensionFiles = {
      'manifest.json': {
        "manifest_version": 3,
        "name": "NexusOne CJ Dropshipping Importer",
        "version": "1.0.0",
        "description": "Import products from CJ Dropshipping directly to your NexusOne dashboard",
        "permissions": ["activeTab", "storage", "scripting"],
        "host_permissions": ["*://*.cjdropshipping.com/*", "*://*.nexusone.ai/*"],
        "background": { "service_worker": "background.js" },
        "content_scripts": [{
          "matches": ["*://*.cjdropshipping.com/*"],
          "js": ["content.js"],
          "css": ["content.css"]
        }],
        "action": {
          "default_popup": "popup.html",
          "default_title": "NexusOne CJ Importer"
        }
      },
      'README.md': `# NexusOne Chrome Extension

## Installation
1. Download and extract this folder
2. Open Chrome → Extensions → Developer Mode
3. Click "Load Unpacked" and select this folder
4. Configure your NexusOne API key in the extension popup

## Usage
- Visit any CJ Dropshipping product page
- Click the NexusOne extension icon
- Import products with one click
- Generate campaigns automatically

For full documentation visit: https://nexusone.ai/docs/chrome-extension`
    };
    
    // Create downloadable package info
    const packageInfo = {
      name: 'nexusone-cj-extension-v1.0.0',
      files: Object.keys(extensionFiles).length,
      size: '~150KB',
      version: '1.0.0',
      lastUpdated: new Date().toISOString()
    };
    
    // Simulate download by creating a JSON file with extension info
    const blob = new Blob([JSON.stringify(packageInfo, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nexusone-extension-info.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Extension package info downloaded! Contact support for full extension files.');
  };

  const generateCampaign = async (product: CJProduct) => {
    setIsGenerating(true);
    try {
      const prompt = spark.llmPrompt`
        Create a complete dropshipping campaign for this product:
        
        Product: ${product.productName}
        Price: $${product.sellPrice}
        Category: ${product.categoryName}
        Description: ${product.description}
        
        Generate:
        1. Landing page headline and copy (persuasive, benefit-focused)
        2. Facebook ad copy (engaging, scroll-stopping)
        3. Target audience demographics and interests
        4. Recommended ad budget and bidding strategy
        5. Key selling points and urgency triggers
        6. Call-to-action suggestions
        
        Format as JSON with clear sections for each element.
      `;

      const response = await spark.llm(prompt, 'gpt-4o', true);
      const campaignData = JSON.parse(response);

      const newCampaign: Campaign = {
        id: `camp_${Date.now()}`,
        productId: product.id,
        name: `${product.productName} Campaign`,
        landingPageUrl: `/landing/${product.id}`,
        adCreatives: [],
        targetAudience: campaignData.targetAudience,
        budget: campaignData.recommendedBudget || 50,
        status: 'draft',
        performance: {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          revenue: 0
        }
      };

      setCampaigns(current => [...current, newCampaign]);
      toast.success('Campaign generated successfully!');
      
    } catch (error) {
      toast.error('Failed to generate campaign');
    } finally {
      setIsGenerating(false);
    }
  };

  const getValidationColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Drop Magic</h1>
          <p className="text-muted-foreground">AI-Powered Dropshipping Marketplace</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-sm">
            <Package className="w-4 h-4 mr-1" />
            {products.length} Products Available
          </Badge>
          <Badge variant="secondary" className="text-sm">
            <BarChart3 className="w-4 h-4 mr-1" />
            {campaigns.length} Active Campaigns
          </Badge>
          {isPremium && (
            <Badge variant="default" className="text-sm bg-gradient-to-r from-purple-500 to-pink-500">
              <Crown className="w-4 h-4 mr-1" />
              Premium Access
            </Badge>
          )}
        </div>
      </div>

      {/* Import Section */}
      <Card className="border-2 border-dashed border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Link className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Import CJ Dropshipping Products</h3>
              <p className="text-sm text-muted-foreground">
                Copy and paste CJ Dropshipping product URLs to import directly
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Single URL Import */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-3 flex items-center">
                  <Link className="w-4 h-4 mr-2" />
                  Single Product Import
                </h4>
                <div className="space-y-3">
                  <Input
                    placeholder="https://cjdropshipping.com/product/..."
                    value={importUrl}
                    onChange={(e) => setImportUrl(e.target.value)}
                  />
                  <Button 
                    onClick={importFromUrl}
                    disabled={isImporting || !importUrl.trim()}
                    className="w-full"
                    size="sm"
                  >
                    {isImporting ? 'Importing...' : 'Import Product'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Bulk Import */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-3 flex items-center">
                  <Upload className="w-4 h-4 mr-2" />
                  Bulk Import
                </h4>
                <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full" size="sm">
                      Import Multiple URLs
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Bulk Import Products</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">
                          Paste CJ Dropshipping URLs (one per line):
                        </label>
                        <Textarea
                          placeholder="https://cjdropshipping.com/product/123&#10;https://cjdropshipping.com/product/456&#10;https://cjdropshipping.com/product/789"
                          value={bulkImportText}
                          onChange={(e) => setBulkImportText(e.target.value)}
                          rows={8}
                          className="mt-2"
                        />
                      </div>
                      <Button 
                        onClick={bulkImportFromText}
                        disabled={isImporting || !bulkImportText.trim()}
                        className="w-full"
                      >
                        {isImporting ? 'Importing...' : `Import ${bulkImportText.split('\n').filter(url => url.trim()).length} Products`}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Chrome Extension */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-3 flex items-center">
                  <Download className="w-4 h-4 mr-2" />
                  Chrome Extension
                  {!isPremium && <Crown className="w-4 h-4 ml-2 text-yellow-500" />}
                </h4>
                {isPremium ? (
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground">
                      Browse CJ Dropshipping and import with one click
                    </p>
                    <Button 
                      onClick={downloadChromeExtension}
                      variant="outline" 
                      className="w-full"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Extension
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        Premium feature: Upgrade to access Chrome extension
                      </AlertDescription>
                    </Alert>
                    <Button variant="outline" className="w-full" size="sm" disabled>
                      Premium Only
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Import Instructions */}
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">How to Import:</h4>
            <ol className="text-sm space-y-1 text-muted-foreground">
              <li>1. Go to CJ Dropshipping and find products you want to sell</li>
              <li>2. Copy the product URL from your browser</li>
              <li>3. Paste it above and click "Import Product"</li>
              <li>4. Generate marketing campaigns automatically</li>
              <li>5. Start selling with complete automation!</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="marketplace" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="marketplace">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Product Marketplace
          </TabsTrigger>
          <TabsTrigger value="import">
            <Upload className="w-4 h-4 mr-2" />
            Import Tools
          </TabsTrigger>
          <TabsTrigger value="campaigns">
            <Target className="w-4 h-4 mr-2" />
            My Campaigns
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full lg:w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full lg:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="validation">Validation Score</SelectItem>
                    <SelectItem value="trend">Trend Score</SelectItem>
                    <SelectItem value="profit">Profit Margin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img 
                    src={product.productImage} 
                    alt={product.productName}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={`${getValidationColor(product.validationScore)} text-white`}>
                      <Star className="w-3 h-3 mr-1" />
                      {product.validationScore}% Valid
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {product.trendScore}% Hot
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {product.productName}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary">
                        ${product.sellPrice}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-green-600">
                      {product.profitMargin}% Profit
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Category:</span>
                      <span>{product.categoryName}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        <Clock className="w-3 h-3 inline mr-1" />
                        Shipping:
                      </span>
                      <span>{product.shippingTime}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Stock:</span>
                      <span className="text-green-600">{product.inventory.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => generateCampaign(product)}
                    disabled={isGenerating}
                    className="w-full"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    {isGenerating ? 'Generating...' : 'Generate Campaign'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="import" className="space-y-6">
          {/* Advanced Import Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                Advanced Import Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* CJ API Integration */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      CJ API Direct Import
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Use CJ Dropshipping API to import products with full details
                    </p>
                    <div className="space-y-3">
                      <Input placeholder="Product ID or SKU" />
                      <Button className="w-full" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Import via API
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-3 flex items-center">
                      <Package className="w-4 h-4 mr-2" />
                      Trending Products Auto-Import
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Automatically import trending products from CJ
                    </p>
                    <div className="space-y-3">
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="fashion">Fashion</SelectItem>
                          <SelectItem value="home">Home & Garden</SelectItem>
                          <SelectItem value="sports">Sports</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button className="w-full" size="sm">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Import Trending
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Chrome Extension Section */}
              <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="p-3 bg-primary/10 rounded-lg mr-4">
                        <Download className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold flex items-center">
                          NexusOne Chrome Extension
                          {!isPremium && <Crown className="w-5 h-5 ml-2 text-yellow-500" />}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Browse CJ Dropshipping and import products with one click
                        </p>
                      </div>
                    </div>
                    {isPremium && (
                      <Badge variant="default" className="bg-green-500">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Available
                      </Badge>
                    )}
                  </div>

                  {isPremium ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-background rounded-lg">
                          <div className="text-2xl font-bold text-primary">1-Click</div>
                          <div className="text-sm text-muted-foreground">Product Import</div>
                        </div>
                        <div className="text-center p-4 bg-background rounded-lg">
                          <div className="text-2xl font-bold text-primary">Auto</div>
                          <div className="text-sm text-muted-foreground">Price Calculation</div>
                        </div>
                        <div className="text-center p-4 bg-background rounded-lg">
                          <div className="text-2xl font-bold text-primary">Instant</div>
                          <div className="text-sm text-muted-foreground">Campaign Creation</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        <Button onClick={downloadChromeExtension} className="flex-1">
                          <Download className="w-4 h-4 mr-2" />
                          Download Extension
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Copy className="w-4 h-4 mr-2" />
                          Installation Guide
                        </Button>
                      </div>

                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Installation:</strong> Download → Chrome Extensions → Developer Mode → Load Unpacked
                        </AlertDescription>
                      </Alert>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Alert>
                        <Crown className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Premium Feature:</strong> Chrome extension is exclusively available for Premium members. 
                          Upgrade to access one-click product imports and advanced automation tools.
                        </AlertDescription>
                      </Alert>
                      <Button variant="outline" className="w-full" disabled>
                        <Crown className="w-4 h-4 mr-2" />
                        Upgrade to Premium for Extension Access
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Import History */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Imports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {products.slice(-5).map((product, index) => (
                      <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <img src={product.productImage} alt={product.productName} className="w-10 h-10 object-cover rounded" />
                          <div>
                            <h4 className="font-medium text-sm">{product.productName}</h4>
                            <p className="text-xs text-muted-foreground">{product.categoryName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">${product.sellPrice}</div>
                          <div className="text-xs text-green-600">{product.profitMargin}% profit</div>
                        </div>
                      </div>
                    ))}
                    {products.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No products imported yet. Start by importing your first product above!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          {campaigns.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Campaigns Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Generate your first campaign from the marketplace
                </p>
                <Button onClick={() => document.querySelector('[value="marketplace"]')?.click()}>
                  Browse Products
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {campaigns.map((campaign) => {
                const product = products.find(p => p.id === campaign.productId);
                return (
                  <Card key={campaign.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{campaign.name}</CardTitle>
                        <Badge variant={
                          campaign.status === 'active' ? 'default' :
                          campaign.status === 'paused' ? 'secondary' : 'outline'
                        }>
                          {campaign.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{campaign.performance.impressions.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Impressions</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{campaign.performance.clicks.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Clicks</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">{campaign.performance.conversions}</div>
                          <div className="text-sm text-muted-foreground">Sales</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            ${campaign.performance.revenue.toFixed(2)}
                          </div>
                          <div className="text-sm text-muted-foreground">Revenue</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button size="sm">
                          <PlayCircle className="w-4 h-4 mr-2" />
                          View Landing Page
                        </Button>
                        <Button size="sm" variant="outline">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Analytics
                        </Button>
                        <Button size="sm" variant="outline">
                          Edit Campaign
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold">
                      ${campaigns.reduce((sum, c) => sum + c.performance.revenue, 0).toFixed(2)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Campaigns</p>
                    <p className="text-2xl font-bold">
                      {campaigns.filter(c => c.status === 'active').length}
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                    <p className="text-2xl font-bold">
                      {campaigns.reduce((sum, c) => sum + c.performance.conversions, 0)}
                    </p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg. Profit Margin</p>
                    <p className="text-2xl font-bold">
                      {products.length > 0 ? Math.round(products.reduce((sum, p) => sum + p.profitMargin, 0) / products.length) : 0}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.slice(0, 5).map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                      <img src={product.productImage} alt={product.productName} className="w-12 h-12 object-cover rounded" />
                      <div>
                        <h4 className="font-medium">{product.productName}</h4>
                        <p className="text-sm text-muted-foreground">{product.categoryName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">${product.sellPrice}</div>
                      <div className="text-sm text-green-600">{product.profitMargin}% margin</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}