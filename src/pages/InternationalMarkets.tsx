import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { InternationalMarketingService } from '@/services/InternationalMarketingService';
import { toast } from 'sonner';
import { 
  Globe, 
  Sparkles, 
  TrendingUp, 
  Users, 
  DollarSign,
  Target,
  Eye,
  Plus,
  Translate,
  ChartBar,
  MapPin,
  Calendar,
  Clock,
  Copy,
  Download,
  Share,
  Edit,
  Trash2
} from '@phosphor-icons/react';

interface LandingPage {
  id: string;
  title: string;
  market: string;
  language: string;
  currency: string;
  status: 'draft' | 'published' | 'testing';
  views: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
  createdAt: string;
  lastUpdated: string;
  slug: string;
  isABTesting?: boolean;
}

export default function InternationalMarkets() {
  const { t, currentLanguage } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [productUrl, setProductUrl] = useState('');
  const [productDescription, setProductDescription] = useState('');
  
  // Get market configurations from service
  const globalMarkets = InternationalMarketingService.getAllMarkets();
  const [selectedMarket, setSelectedMarket] = useState(globalMarkets[0]);
  
  const [landingPages, setLandingPages] = useState<LandingPage[]>([
    {
      id: '1',
      title: 'Wireless Earbuds - Premium Sound Quality',
      market: 'United States',
      language: 'English',
      currency: 'USD',
      status: 'published',
      views: 15420,
      conversions: 892,
      conversionRate: 5.8,
      revenue: 34567,
      createdAt: '2024-01-15',
      lastUpdated: '2024-01-20',
      slug: 'wireless-earbuds-us',
      isABTesting: true
    },
    {
      id: '2',
      title: 'Fones Bluetooth - Som Premium Para Brasileiros',
      market: 'Brazil',
      language: 'Portuguese',
      currency: 'BRL',
      status: 'published',
      views: 8932,
      conversions: 445,
      conversionRate: 4.9,
      revenue: 15234,
      createdAt: '2024-01-12',
      lastUpdated: '2024-01-18',
      slug: 'fones-bluetooth-br'
    },
    {
      id: '3',
      title: 'Auriculares Inalámbricos - Calidad Premium',
      market: 'Spain',
      language: 'Spanish',
      currency: 'EUR',
      status: 'testing',
      views: 3456,
      conversions: 123,
      conversionRate: 3.6,
      revenue: 4567,
      createdAt: '2024-01-10',
      lastUpdated: '2024-01-16',
      slug: 'auriculares-es'
    }
  ]);

  const handleCreateInternationalPage = async () => {
    if (!productUrl.trim() && !productDescription.trim()) {
      toast.error('Please provide either a product URL or description');
      return;
    }

    setLoading(true);
    try {
      toast.info(`${t('international.creating_localized')} ${selectedMarket.country}...`);

      // Use the InternationalMarketingService
      const marketCode = getMarketCode(selectedMarket.country);
      const localizedPage = await InternationalMarketingService.generateLocalizedPage(
        productUrl,
        productDescription,
        marketCode
      );

      const newPage: LandingPage = {
        id: Date.now().toString(),
        title: localizedPage.title,
        market: selectedMarket.country,
        language: selectedMarket.language,
        currency: selectedMarket.currency,
        status: 'draft',
        views: 0,
        conversions: 0,
        conversionRate: 0,
        revenue: 0,
        createdAt: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0],
        slug: `product-${marketCode.toLowerCase()}-${Date.now()}`
      };

      setLandingPages(prev => [newPage, ...prev]);
      setProductUrl('');
      setProductDescription('');
      toast.success(`${t('international.page_created_for')} ${selectedMarket.country}!`);
    } catch (error) {
      console.error('Error creating international page:', error);
      toast.error('Failed to create page. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMarketCode = (country: string): string => {
    const countryToCode = {
      'United States': 'US',
      'Brazil': 'BR',
      'Spain': 'ES',
      'Israel': 'IL',
      'Saudi Arabia': 'SA'
    };
    return countryToCode[country as keyof typeof countryToCode] || 'US';
  };

  const getMarketFlag = (country: string): string => {
    const countryToFlag = {
      'United States': '🇺🇸',
      'Brazil': '🇧🇷',
      'Spain': '🇪🇸',
      'Israel': '🇮🇱',
      'Saudi Arabia': '🇸🇦'
    };
    return countryToFlag[country as keyof typeof countryToFlag] || '🌍';
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      published: { className: 'bg-green-100 text-green-800', text: 'Live' },
      draft: { className: 'bg-gray-100 text-gray-800', text: 'Draft' },
      testing: { className: 'bg-blue-100 text-blue-800', text: 'A/B Testing' }
    };
    const variant = variants[status as keyof typeof variants] || variants.draft;
    
    return (
      <Badge className={variant.className}>
        {variant.text}
      </Badge>
    );
  };

  const formatCurrency = (amount: number, currency: string) => {
    const locale = {
      USD: 'en-US',
      BRL: 'pt-BR', 
      EUR: 'es-ES',
      ILS: 'he-IL',
      SAR: 'ar-SA'
    }[currency] || 'en-US';

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <Globe className="h-8 w-8 text-blue-600" />
          {t('international.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('international.subtitle')}
        </p>
      </div>

      {/* Market Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-purple-600" />
            {t('international.create_for_market')}
          </CardTitle>
          <CardDescription>
            Generate culturally adapted pages with local language, currency, and marketing approaches
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Market Selection */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label>{t('international.target_market')}</Label>
              <Select
                value={getMarketCode(selectedMarket.country)}
                onValueChange={(value) => {
                  const market = globalMarkets.find(m => getMarketCode(m.country) === value);
                  if (market) setSelectedMarket(market);
                }}
              >
                <SelectTrigger>
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getMarketFlag(selectedMarket.country)}</span>
                      <span>{selectedMarket.country}</span>
                      <Badge variant="outline" className="ml-auto">
                        {selectedMarket.language}
                      </Badge>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {globalMarkets.map((market) => (
                    <SelectItem key={getMarketCode(market.country)} value={getMarketCode(market.country)}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getMarketFlag(market.country)}</span>
                        <span>{market.country}</span>
                        <Badge variant="outline" className="ml-auto">
                          {market.language}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Market Insights */}
              <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                <h4 className="font-semibold text-blue-900">{t('international.market_insights')}</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-blue-700">{t('international.population')}:</span>
                    <div className="font-medium">N/A</div>
                  </div>
                  <div>
                    <span className="text-blue-700">{t('international.currency')}:</span>
                    <div className="font-medium">{selectedMarket.currency}</div>
                  </div>
                  <div>
                    <span className="text-blue-700">Language:</span>
                    <div className="font-medium">{selectedMarket.language}</div>
                  </div>
                  <div>
                    <span className="text-blue-700">Market Style:</span>
                    <div className="font-medium text-green-600">{selectedMarket.marketingStyle}</div>
                  </div>
                </div>
              </div>

              {/* Cultural Notes */}
              <div className="bg-amber-50 p-4 rounded-lg">
                <h4 className="font-semibold text-amber-900 mb-2">{t('international.cultural_considerations')}</h4>
                <ul className="text-sm space-y-1">
                  {selectedMarket.culturalNotes.map((note, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-amber-600 mt-1">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Product Input */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="product-url">Product URL (Optional)</Label>
                <Input
                  id="product-url"
                  type="url"
                  placeholder="https://example.com/product"
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="product-description">Product Description</Label>
                <Textarea
                  id="product-description"
                  placeholder="Describe your product and target audience..."
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <Button 
                onClick={handleCreateInternationalPage}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
              >
                {loading ? (
                  <>
                    <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                    Creating Localized Page...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-5 w-5" />
                    Create for {selectedMarket.country}
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* International Pages */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">{t('international.all_markets')}</TabsTrigger>
          <TabsTrigger value="live">{t('international.live_pages')}</TabsTrigger>
          <TabsTrigger value="testing">{t('international.ab_testing')}</TabsTrigger>
          <TabsTrigger value="analytics">{t('international.performance')}</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {landingPages.map((page) => (
              <Card key={page.id} className="hover:shadow-lg transition-all duration-200">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{page.title}</h3>
                        {getStatusBadge(page.status)}
                        {page.isABTesting && (
                          <Badge className="bg-orange-100 text-orange-800">
                            <ChartBar className="h-3 w-3 mr-1" />
                            A/B Test
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {page.market}
                        </span>
                        <span className="flex items-center gap-1">
                          <Translate className="h-4 w-4" />
                          {page.language}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {page.currency}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {page.createdAt}
                        </span>
                      </div>

                      {/* Performance Metrics */}
                      <div className="grid grid-cols-4 gap-4">
                        <div className="bg-blue-50 p-3 rounded-lg text-center">
                          <div className="text-lg font-bold text-blue-600">
                            {formatNumber(page.views)}
                          </div>
                          <div className="text-xs text-muted-foreground">Views</div>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg text-center">
                          <div className="text-lg font-bold text-green-600">
                            {formatNumber(page.conversions)}
                          </div>
                          <div className="text-xs text-muted-foreground">Conversions</div>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg text-center">
                          <div className="text-lg font-bold text-purple-600">
                            {page.conversionRate}%
                          </div>
                          <div className="text-xs text-muted-foreground">CVR</div>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-lg text-center">
                          <div className="text-lg font-bold text-orange-600">
                            {formatCurrency(page.revenue, page.currency)}
                          </div>
                          <div className="text-xs text-muted-foreground">Revenue</div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 ml-6">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4 mr-1" />
                        Clone
                      </Button>
                      <Button variant="outline" size="sm">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Analytics
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="live" className="space-y-4">
          <div className="grid gap-4">
            {landingPages.filter(page => page.status === 'published').map((page) => (
              <Card key={page.id} className="border-green-200 bg-green-50/50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                        <h3 className="font-semibold">{page.title}</h3>
                        <Badge className="bg-green-100 text-green-800">
                          Live in {page.market}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        nexusoneai.com/{page.slug}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(page.revenue, page.currency)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {page.conversionRate}% conversion rate
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <div className="text-center py-8">
            <ChartBar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">A/B Testing Dashboard</h3>
            <p className="text-muted-foreground mb-4">
              Compare performance across different market adaptations
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Start A/B Test
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {formatCurrency(
                    landingPages.reduce((sum, page) => sum + page.revenue, 0),
                    'USD'
                  )}
                </div>
                <p className="text-sm text-muted-foreground">Across all markets</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Best Performing Market</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {landingPages.reduce((best, page) => 
                    page.conversionRate > best.conversionRate ? page : best
                  ).market}
                </div>
                <p className="text-sm text-muted-foreground">
                  {landingPages.reduce((best, page) => 
                    page.conversionRate > best.conversionRate ? page : best
                  ).conversionRate}% conversion rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Active Markets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {new Set(landingPages.map(page => page.market)).size}
                </div>
                <p className="text-sm text-muted-foreground">Countries reached</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Market Stats */}
      <Card>
        <CardHeader>
          <CardTitle>{t('international.global_opportunities')}</CardTitle>
          <CardDescription>
            Discover high-potential markets for your products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {globalMarkets.map((market) => (
              <div key={getMarketCode(market.country)} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getMarketFlag(market.country)}</span>
                    <div>
                      <h4 className="font-semibold">{market.country}</h4>
                      <p className="text-sm text-muted-foreground">{market.language}</p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {market.marketingStyle}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Currency:</span>
                    <span className="font-medium">{market.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Timezone:</span>
                    <span className="font-medium">{market.timezone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Style:</span>
                    <span className="font-medium">{market.marketingStyle}</span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-3"
                  onClick={() => setSelectedMarket(market)}
                >
                  {t('international.create_for_market')} {market.country}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}