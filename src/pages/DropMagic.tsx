import React, { useState, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
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
  MapPin
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
  const [selectedProduct, setSelectedProduct] = useState<CJProduct | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState('validation');

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
        </div>
      </div>

      <Tabs defaultValue="marketplace" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="marketplace">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Product Marketplace
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