import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Brain,
  Lightning,
  Target,
  Megaphone,
  Images,
  VideoCamera,
  TrendingUp,
  DollarSign,
  Users,
  Eye,
  MousePointer,
  ShoppingCart,
  Sparkle,
  Robot
} from '@phosphor-icons/react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCredits } from '@/contexts/CreditContext';
import { nexBrainService } from '@/services/nexBrainService';
import { toast } from 'sonner';

interface CampaignData {
  productName: string;
  productDescription: string;
  targetAudience: string;
  budget: number;
  objective: string;
  urgency: string;
  uniqueSellingPoint: string;
  pricePoint: string;
  industry: string;
}

interface GeneratedCampaign {
  strategy: any;
  adSets: any[];
  creatives: any[];
  videoAds: any[];
  landingPage: any;
  whatsappFlow: any;
  projectedMetrics: {
    reach: number;
    clicks: number;
    conversions: number;
    roas: number;
    cost: number;
  };
}

export function AIAdsCampaignGenerator() {
  const { t } = useLanguage();
  const { credits, useCredits } = useCredits();
  const [campaignData, setCampaignData] = useState<CampaignData>({
    productName: '',
    productDescription: '',
    targetAudience: '',
    budget: 100,
    objective: 'CONVERSIONS',
    urgency: '',
    uniqueSellingPoint: '',
    pricePoint: '',
    industry: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [generatedCampaign, setGeneratedCampaign] = useState<GeneratedCampaign | null>(null);
  const [selectedCreative, setSelectedCreative] = useState(0);

  const industries = [
    'E-commerce', 'SaaS/Software', 'Health & Fitness', 'Beauty & Cosmetics',
    'Fashion & Apparel', 'Home & Garden', 'Electronics', 'Education',
    'Financial Services', 'Real Estate', 'Food & Beverage', 'Travel & Tourism'
  ];

  const objectives = [
    { value: 'CONVERSIONS', label: 'Conversions (Sales/Leads)' },
    { value: 'TRAFFIC', label: 'Website Traffic' },
    { value: 'AWARENESS', label: 'Brand Awareness' },
    { value: 'REACH', label: 'Reach' },
    { value: 'ENGAGEMENT', label: 'Engagement' },
    { value: 'APP_INSTALLS', label: 'App Installs' },
    { value: 'VIDEO_VIEWS', label: 'Video Views' }
  ];

  const generateCampaign = async () => {
    if (!campaignData.productName || !campaignData.productDescription || !campaignData.targetAudience) {
      toast.error(t('Please fill in all required fields'));
      return;
    }

    const cost = 150; // Credits for full campaign generation
    if (!useCredits(cost)) {
      toast.error(t('Insufficient credits. Please upgrade your plan.'));
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Step 1: Initialize NexBrain
      setCurrentStep(t('Initializing NexBrain AI Campaign Generator...'));
      setGenerationProgress(10);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 2: Generate Campaign Strategy
      setCurrentStep(t('Creating AI-powered campaign strategy...'));
      setGenerationProgress(25);
      
      const productData = {
        name: campaignData.productName,
        description: campaignData.productDescription,
        usp: campaignData.uniqueSellingPoint,
        price: campaignData.pricePoint,
        industry: campaignData.industry,
        urgency: campaignData.urgency
      };

      const targetAudience = {
        description: campaignData.targetAudience,
        size: 'broad' // Could be calculated based on audience description
      };

      const adsCampaign = await nexBrainService.generateAdsCampaign(
        productData,
        targetAudience,
        campaignData.budget
      );

      // Step 3: Generate Landing Page
      setCurrentStep(t('Creating optimized landing page...'));
      setGenerationProgress(50);
      
      const landingPage = await nexBrainService.generateMagicPage(
        productData,
        { 
          template: 'conversion-focused',
          audience: targetAudience,
          urgency: campaignData.urgency
        }
      );

      // Step 4: Generate Video Content
      setCurrentStep(t('Generating promotional videos...'));
      setGenerationProgress(70);
      
      const promoVideo = await nexBrainService.generateProductVideo(
        productData,
        'promo'
      );

      // Step 5: Generate WhatsApp Sales Flow
      setCurrentStep(t('Creating WhatsApp sales automation...'));
      setGenerationProgress(85);
      
      const whatsappFlow = await nexBrainService.generateWhatsAppFlow(
        productData,
        'consultative_selling'
      );

      // Step 6: Finalize Campaign
      setCurrentStep(t('Optimizing campaign for maximum ROI...'));
      setGenerationProgress(100);
      
      const finalCampaign: GeneratedCampaign = {
        strategy: adsCampaign,
        adSets: adsCampaign.adSets || [],
        creatives: adsCampaign.adCreatives || [],
        videoAds: adsCampaign.videoAds || [],
        landingPage,
        whatsappFlow,
        projectedMetrics: {
          reach: adsCampaign.estimatedReach || 50000,
          clicks: Math.floor((adsCampaign.estimatedReach || 50000) * 0.02),
          conversions: Math.floor((adsCampaign.estimatedReach || 50000) * 0.02 * 0.05),
          roas: adsCampaign.projectedROAS || 3.2,
          cost: campaignData.budget
        }
      };

      setGeneratedCampaign(finalCampaign);
      toast.success(t('AI campaign generated successfully!'));

    } catch (error) {
      console.error('Campaign generation failed:', error);
      toast.error(t('Failed to generate campaign. Please try again.'));
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
      setCurrentStep('');
    }
  };

  const resetForm = () => {
    setCampaignData({
      productName: '',
      productDescription: '',
      targetAudience: '',
      budget: 100,
      objective: 'CONVERSIONS',
      urgency: '',
      uniqueSellingPoint: '',
      pricePoint: '',
      industry: ''
    });
    setGeneratedCampaign(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
            <Megaphone className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">{t('AI Ads Campaign Generator')} 🚀</h1>
        <p className="text-lg text-muted-foreground">
          {t('Create complete Facebook/Instagram campaigns with NexBrain AI')}
        </p>
        <div className="flex items-center justify-center gap-4 mt-4">
          <Badge variant="secondary" className="gap-2">
            <Sparkle className="h-4 w-4" />
            {credits} {t('Credits Available')}
          </Badge>
          <Badge variant="outline" className="gap-2">
            <Brain className="h-4 w-4" />
            {t('NexBrain AI Powered')}
          </Badge>
        </div>
      </div>

      {/* Generation Progress */}
      {isGenerating && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 animate-pulse text-blue-500" />
                <span className="font-semibold">{t('NexBrain AI is creating your campaign...')}</span>
              </div>
              <Progress value={generationProgress} className="h-2" />
              <p className="text-sm text-muted-foreground">{currentStep}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {!generatedCampaign ? (
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Campaign Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Robot className="h-5 w-5 text-blue-500" />
                {t('Campaign Configuration')}
              </CardTitle>
              <CardDescription>
                {t('Provide details about your product and target audience')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="product-name">{t('Product/Service Name')} *</Label>
                  <Input
                    id="product-name"
                    placeholder={t('e.g., Premium Fitness Tracker')}
                    value={campaignData.productName}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, productName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="industry">{t('Industry')}</Label>
                  <Select value={campaignData.industry} onValueChange={(value) => setCampaignData(prev => ({ ...prev, industry: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('Select industry')} />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry.toLowerCase()}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="product-description">{t('Product Description')} *</Label>
                <Textarea
                  id="product-description"
                  placeholder={t('Describe your product, its benefits, and what problems it solves...')}
                  value={campaignData.productDescription}
                  onChange={(e) => setCampaignData(prev => ({ ...prev, productDescription: e.target.value }))}
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="usp">{t('Unique Selling Point')}</Label>
                  <Input
                    id="usp"
                    placeholder={t('What makes your product special?')}
                    value={campaignData.uniqueSellingPoint}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, uniqueSellingPoint: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="price">{t('Price Point')}</Label>
                  <Input
                    id="price"
                    placeholder={t('e.g., $99, $19.99, Contact Us')}
                    value={campaignData.pricePoint}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, pricePoint: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="target-audience">{t('Target Audience')} *</Label>
                <Textarea
                  id="target-audience"
                  placeholder={t('Describe your ideal customer: age, interests, behaviors, demographics...')}
                  value={campaignData.targetAudience}
                  onChange={(e) => setCampaignData(prev => ({ ...prev, targetAudience: e.target.value }))}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="budget">{t('Daily Budget')} ($)</Label>
                  <Input
                    id="budget"
                    type="number"
                    min="10"
                    max="10000"
                    value={campaignData.budget}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, budget: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label htmlFor="objective">{t('Campaign Objective')}</Label>
                  <Select value={campaignData.objective} onValueChange={(value) => setCampaignData(prev => ({ ...prev, objective: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('Select objective')} />
                    </SelectTrigger>
                    <SelectContent>
                      {objectives.map((obj) => (
                        <SelectItem key={obj.value} value={obj.value}>{obj.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="urgency">{t('Urgency/Scarcity Elements')}</Label>
                <Textarea
                  id="urgency"
                  placeholder={t('e.g., Limited time offer, Only 50 left, Sale ends tonight...')}
                  value={campaignData.urgency}
                  onChange={(e) => setCampaignData(prev => ({ ...prev, urgency: e.target.value }))}
                />
              </div>

              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 gap-2"
                onClick={generateCampaign}
                disabled={isGenerating || !campaignData.productName || !campaignData.productDescription || !campaignData.targetAudience}
              >
                {isGenerating ? (
                  <>
                    <Brain className="h-5 w-5 animate-pulse" />
                    {t('AI is creating your campaign...')}
                  </>
                ) : (
                  <>
                    <Lightning className="h-5 w-5" />
                    {t('Generate AI Campaign')} (150 {t('Credits')})
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Generated Campaign Results */
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">🎯 {t('Campaign Generated Successfully!')}</h2>
            <p className="text-muted-foreground">{t('Your AI-optimized marketing campaign is ready to launch')}</p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">{t('Overview')}</TabsTrigger>
              <TabsTrigger value="creatives">{t('Ad Creatives')}</TabsTrigger>
              <TabsTrigger value="targeting">{t('Targeting')}</TabsTrigger>
              <TabsTrigger value="landing">{t('Landing Page')}</TabsTrigger>
              <TabsTrigger value="whatsapp">{t('WhatsApp')}</TabsTrigger>
              <TabsTrigger value="metrics">{t('Projections')}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Eye className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{generatedCampaign.projectedMetrics.reach.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{t('Estimated Reach')}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <MousePointer className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{generatedCampaign.projectedMetrics.clicks.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{t('Expected Clicks')}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <ShoppingCart className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{generatedCampaign.projectedMetrics.conversions}</p>
                    <p className="text-sm text-muted-foreground">{t('Projected Conversions')}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <DollarSign className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{generatedCampaign.projectedMetrics.roas.toFixed(1)}x</p>
                    <p className="text-sm text-muted-foreground">{t('Projected ROAS')}</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>{t('Campaign Strategy')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold">{t('Objective')}</h4>
                      <p className="text-sm text-muted-foreground">{campaignData.objective}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">{t('Budget Allocation')}</h4>
                      <p className="text-sm text-muted-foreground">
                        ${campaignData.budget}/day - {t('Optimized for')} {campaignData.objective}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold">{t('AI Recommendations')}</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline">{t('Mobile-First Creative')}</Badge>
                        <Badge variant="outline">{t('Video + Image Mix')}</Badge>
                        <Badge variant="outline">{t('A/B Test Headlines')}</Badge>
                        <Badge variant="outline">{t('Retargeting Setup')}</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="creatives" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {generatedCampaign.creatives.map((creative, index) => (
                  <Card key={index} className={selectedCreative === index ? 'ring-2 ring-blue-500' : ''}>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center justify-between">
                        {t('Ad Creative')} {index + 1}
                        <Badge variant="outline" className="gap-1">
                          <Brain className="h-3 w-3" />
                          AI
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="w-full h-40 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <Images className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{t('Headline')}</h4>
                        <p className="text-sm">{creative.headline || `${t('AI-Generated Headline')} ${index + 1}`}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{t('Description')}</h4>
                        <p className="text-xs text-muted-foreground">{creative.description || t('Compelling ad copy optimized for your audience...')}</p>
                      </div>
                      <Button 
                        size="sm" 
                        variant={selectedCreative === index ? "default" : "outline"}
                        className="w-full"
                        onClick={() => setSelectedCreative(index)}
                      >
                        {selectedCreative === index ? t('Selected') : t('Select')}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                
                {/* Video Ad */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center justify-between">
                      {t('Video Ad')}
                      <Badge variant="outline" className="gap-1">
                        <VideoCamera className="h-3 w-3" />
                        Video
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="w-full h-40 bg-gradient-to-r from-red-100 to-pink-100 rounded-lg flex items-center justify-center">
                      <VideoCamera className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{t('Video Script')}</h4>
                      <p className="text-xs text-muted-foreground">{t('30-second promotional video with product showcase...')}</p>
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      {t('Generate Video')}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="targeting" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    {t('AI-Optimized Targeting')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">{t('Demographics')}</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>{t('Age Range')}:</span>
                          <span>25-45</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('Gender')}:</span>
                          <span>{t('All')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('Location')}:</span>
                          <span>{t('United States')}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">{t('Interests')}</h4>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary">{t('Fitness')}</Badge>
                        <Badge variant="secondary">{t('Technology')}</Badge>
                        <Badge variant="secondary">{t('Health')}</Badge>
                        <Badge variant="secondary">{t('Shopping')}</Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">{t('Behaviors')}</h4>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline">{t('Online Shoppers')}</Badge>
                      <Badge variant="outline">{t('Mobile Users')}</Badge>
                      <Badge variant="outline">{t('Engaged Shoppers')}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="landing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('AI-Generated Landing Page')}</CardTitle>
                  <CardDescription>{t('Optimized for maximum conversions')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4 bg-muted/20">
                    <div className="text-center space-y-4">
                      <h2 className="text-2xl font-bold">{generatedCampaign.landingPage.headline || campaignData.productName}</h2>
                      <p className="text-muted-foreground">{generatedCampaign.landingPage.subheadline || campaignData.productDescription}</p>
                      <div className="w-full h-32 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                        <span className="text-muted-foreground">{t('Product Hero Image')}</span>
                      </div>
                      <Button size="lg" className="bg-primary">
                        {t('Get Started Now')}
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-4">
                    <Button variant="outline" size="sm">
                      {t('Preview Full Page')}
                    </Button>
                    <Button variant="outline" size="sm">
                      {t('Edit Page')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="whatsapp" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t('WhatsApp Sales Automation')}</CardTitle>
                  <CardDescription>{t('AI-powered conversation flows for lead nurturing')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2">{t('Welcome Message')}</h4>
                      <p className="text-sm text-green-700">
                        {t('Hi! 👋 Thanks for your interest in')} {campaignData.productName}. {t('I\'m here to help you get started!')}
                      </p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">{t('Product Presentation')}</h4>
                      <p className="text-sm text-blue-700">
                        {t('Here are the key benefits of')} {campaignData.productName}...
                      </p>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h4 className="font-semibold text-purple-800 mb-2">{t('Closing Sequence')}</h4>
                      <p className="text-sm text-purple-700">
                        {t('Ready to get started? Here\'s your special offer...')}
                      </p>
                    </div>
                  </div>
                  <Button className="mt-4">
                    {t('Setup WhatsApp Integration')}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t('Performance Projections')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>{t('Daily Reach')}:</span>
                        <span className="font-semibold">{(generatedCampaign.projectedMetrics.reach / 30).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('CTR')}:</span>
                        <span className="font-semibold">2.1%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('CPC')}:</span>
                        <span className="font-semibold">$1.25</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('CVR')}:</span>
                        <span className="font-semibold">4.8%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('CPA')}:</span>
                        <span className="font-semibold">$26.04</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{t('Monthly Projections')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>{t('Total Spend')}:</span>
                        <span className="font-semibold">${(campaignData.budget * 30).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('Total Conversions')}:</span>
                        <span className="font-semibold">{(generatedCampaign.projectedMetrics.conversions * 30).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('Revenue')}:</span>
                        <span className="font-semibold">${((campaignData.budget * 30) * generatedCampaign.projectedMetrics.roas).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('Profit')}:</span>
                        <span className="font-semibold text-green-600">
                          ${(((campaignData.budget * 30) * generatedCampaign.projectedMetrics.roas) - (campaignData.budget * 30)).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('ROI')}:</span>
                        <span className="font-semibold text-green-600">
                          {((generatedCampaign.projectedMetrics.roas - 1) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={resetForm} className="gap-2">
              <Lightning className="h-4 w-4" />
              {t('Create New Campaign')}
            </Button>
            <Button className="gap-2">
              <TrendingUp className="h-4 w-4" />
              {t('Launch Campaign')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}