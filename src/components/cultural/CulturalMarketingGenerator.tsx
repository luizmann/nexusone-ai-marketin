import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Sparkles, Copy, Download, Share2, Clock, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { culturalMarketingService, culturalContexts, type MarketingCopyRequest, type CulturallyAdaptedCopy } from '@/services/culturalMarketingService';
import MarketInsightCard from './MarketInsightCard';

const copyTypes = [
  { value: 'headline', label: 'Headlines' },
  { value: 'description', label: 'Product Descriptions' },
  { value: 'cta', label: 'Call-to-Actions' },
  { value: 'social_post', label: 'Social Media Posts' },
  { value: 'email_subject', label: 'Email Subjects' },
  { value: 'full_page', label: 'Full Landing Page' }
];

const industries = [
  'Technology', 'E-commerce', 'Fashion', 'Health & Wellness', 'Education', 
  'Finance', 'Travel', 'Food & Beverage', 'Real Estate', 'Automotive'
];

const tones = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'luxurious', label: 'Luxurious' }
];

export default function CulturalMarketingGenerator() {
  const { t } = useLanguage();
  const [request, setRequest] = useState<Partial<MarketingCopyRequest>>({
    productName: '',
    productDescription: '',
    targetMarket: 'en-US',
    copyType: 'headline',
    tone: 'professional',
    industry: 'Technology',
    targetAudience: ''
  });

  const [results, setResults] = useState<Record<string, CulturallyAdaptedCopy>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>(['en-US']);
  const [activeTab, setActiveTab] = useState('single');

  const handleSingleGeneration = async () => {
    if (!request.productName || !request.productDescription || !request.targetMarket) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await culturalMarketingService.generateCulturallyAdaptedCopy(request as MarketingCopyRequest);
      setResults({ [request.targetMarket!]: result });
      toast.success('Cultural copy generated successfully!');
    } catch (error) {
      console.error('Error generating copy:', error);
      toast.error('Failed to generate copy. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMultiMarketGeneration = async () => {
    if (!request.productName || !request.productDescription || selectedMarkets.length === 0) {
      toast.error('Please fill in all required fields and select markets');
      return;
    }

    setIsGenerating(true);
    try {
      const results = await culturalMarketingService.generateMultiMarketCopy(
        request as Omit<MarketingCopyRequest, 'targetMarket'>,
        selectedMarkets
      );
      setResults(results);
      toast.success(`Generated copy for ${Object.keys(results).length} markets!`);
    } catch (error) {
      console.error('Error generating multi-market copy:', error);
      toast.error('Failed to generate copy for some markets. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, market: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${market} copy to clipboard!`);
  };

  const exportResults = () => {
    const exportData = {
      product: {
        name: request.productName,
        description: request.productDescription,
        industry: request.industry
      },
      copyType: request.copyType,
      generatedAt: new Date().toISOString(),
      results: results
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `cultural-marketing-copy-${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Results exported successfully!');
  };

  const toggleMarketSelection = (market: string) => {
    setSelectedMarkets(prev => 
      prev.includes(market) 
        ? prev.filter(m => m !== market)
        : [...prev, market]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
          <Globe className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{t('cultural.marketing.title')}</h1>
          <p className="text-muted-foreground">{t('cultural.marketing.subtitle')}</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="single">{t('cultural.single_market')}</TabsTrigger>
          <TabsTrigger value="multi">{t('cultural.multiple_markets')}</TabsTrigger>
          <TabsTrigger value="insights">{t('cultural.cultural_insights')}</TabsTrigger>
        </TabsList>

        {/* Single Market Generation */}
        <TabsContent value="single" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                {t('cultural.product_information')}
              </CardTitle>
              <CardDescription>
                {t('Provide details about your product for cultural adaptation')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('cultural.product_name')} *</label>
                  <Input
                    placeholder={t('Enter product name')}
                    value={request.productName}
                    onChange={(e) => setRequest(prev => ({ ...prev, productName: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('cultural.target_market')} *</label>
                  <Select
                    value={request.targetMarket}
                    onValueChange={(value) => setRequest(prev => ({ ...prev, targetMarket: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select target market" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(culturalContexts).map(([code, context]) => (
                        <SelectItem key={code} value={code}>
                          <div className="flex items-center gap-2">
                            <span>{context.name}</span>
                            <Badge variant="outline">{context.language}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Copy Type</label>
                  <Select
                    value={request.copyType}
                    onValueChange={(value: any) => setRequest(prev => ({ ...prev, copyType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select copy type" />
                    </SelectTrigger>
                    <SelectContent>
                      {copyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tone</label>
                  <Select
                    value={request.tone}
                    onValueChange={(value: any) => setRequest(prev => ({ ...prev, tone: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {tones.map((tone) => (
                        <SelectItem key={tone.value} value={tone.value}>
                          {tone.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Industry</label>
                  <Select
                    value={request.industry}
                    onValueChange={(value) => setRequest(prev => ({ ...prev, industry: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Audience</label>
                  <Input
                    placeholder="e.g., Young professionals, Parents, Entrepreneurs"
                    value={request.targetAudience}
                    onChange={(e) => setRequest(prev => ({ ...prev, targetAudience: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Product Description *</label>
                <Textarea
                  placeholder="Describe your product, its benefits, and key features..."
                  rows={4}
                  value={request.productDescription}
                  onChange={(e) => setRequest(prev => ({ ...prev, productDescription: e.target.value }))}
                />
              </div>

              <Button 
                onClick={handleSingleGeneration}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Generating Cultural Copy...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Cultural Copy
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Multiple Markets Generation */}
        <TabsContent value="multi" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Market Campaign</CardTitle>
              <CardDescription>
                Generate culturally adapted copy for multiple markets simultaneously
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product Name *</label>
                  <Input
                    placeholder="Enter product name"
                    value={request.productName}
                    onChange={(e) => setRequest(prev => ({ ...prev, productName: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Copy Type</label>
                  <Select
                    value={request.copyType}
                    onValueChange={(value: any) => setRequest(prev => ({ ...prev, copyType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select copy type" />
                    </SelectTrigger>
                    <SelectContent>
                      {copyTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Product Description *</label>
                <Textarea
                  placeholder="Describe your product, its benefits, and key features..."
                  rows={3}
                  value={request.productDescription}
                  onChange={(e) => setRequest(prev => ({ ...prev, productDescription: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Target Markets</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(culturalContexts).map(([code, context]) => (
                    <div 
                      key={code}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedMarkets.includes(code) 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => toggleMarketSelection(code)}
                    >
                      <div className="text-sm font-medium">{context.name}</div>
                      <div className="text-xs text-muted-foreground">{context.language}</div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Selected: {selectedMarkets.length} markets
                </p>
              </div>

              <Button 
                onClick={handleMultiMarketGeneration}
                disabled={isGenerating || selectedMarkets.length === 0}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Generating for {selectedMarkets.length} markets...
                  </>
                ) : (
                  <>
                    <Globe className="h-4 w-4 mr-2" />
                    Generate for {selectedMarkets.length} Markets
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cultural Insights */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Object.entries(culturalContexts).map(([code, context]) => (
              <MarketInsightCard
                key={code}
                marketCode={code}
                marketData={context}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Results Section */}
      {Object.keys(results).length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Generated Cultural Copy
              </CardTitle>
              <CardDescription>
                Culturally adapted marketing copy for your selected markets
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportResults}>
                <Download className="h-4 w-4 mr-2" />
                Export Results
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(results).map(([market, result]) => {
              const context = culturalContexts[market as keyof typeof culturalContexts];
              return (
                <div key={market} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{context?.name}</h3>
                      <Badge variant="outline">{context?.language}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(result.adaptedCopy, context?.name || market)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-3 w-3 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Adapted Copy</div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm leading-relaxed">{result.adaptedCopy}</p>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-1">Cultural Adaptations</div>
                      <p className="text-sm text-muted-foreground">{result.culturalExplanation}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">Localized Elements</div>
                        <div className="flex flex-wrap gap-1">
                          {result.localizedElements.map((element, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {element}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">Best Timing</div>
                        <p className="text-sm">{result.suggestedTiming}</p>
                      </div>
                    </div>

                    {result.localizedCta && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground mb-1">Recommended CTA</div>
                        <Badge variant="outline">{result.localizedCta}</Badge>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}