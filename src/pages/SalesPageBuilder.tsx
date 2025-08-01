import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertContent, AlertDescription } from '@/components/ui/alert';
import { 
  Wand, 
  Eye, 
  Edit, 
  Download, 
  ChartBar,
  Sparkles,
  Brain,
  Paste,
  Copy,
  RefreshCw,
  ImageIcon,
  Video,
  Globe,
  Play
} from '@phosphor-icons/react';
import { useLanguage } from '@/contexts/CleanLanguageContext';
import { toast } from 'sonner';
import { copyPasteService, ExtractedContent } from '@/services/copyPasteIntegration';
import { URLSalesPageDemo } from '@/components/demos/URLSalesPageDemo';

interface PageSection {
  id: string;
  type: 'hero' | 'features' | 'testimonials' | 'pricing' | 'cta' | 'product' | 'image' | 'video';
  title: string;
  content: string;
  metadata?: {
    source?: string;
    author?: string;
    price?: string;
    image?: string;
    [key: string]: any;
  };
  style: {
    backgroundColor: string;
    textColor: string;
    padding: string;
  };
}

const SalesPageBuilder = () => {
  const { t } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);
  const [pageTitle, setPageTitle] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [generatedPage, setGeneratedPage] = useState<PageSection[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  // Copy-paste integration state
  const [copyPasteInput, setCopyPasteInput] = useState('');
  const [extractedContent, setExtractedContent] = useState<ExtractedContent | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);

  // Enhanced content extraction from copy-paste
  const extractContentFromPaste = async () => {
    if (!copyPasteInput.trim()) {
      toast.error(t('Please paste some content to extract'));
      return;
    }

    setIsExtracting(true);
    try {
      const extracted = await copyPasteService.extractContent(copyPasteInput);
      setExtractedContent(extracted);
      toast.success(t('Content extracted successfully!'));
      
      // Show suggestions
      const suggestions = copyPasteService.generateContentSuggestions(extracted);
      if (suggestions.length > 0) {
        toast.info(`${t('Suggestions')}: ${suggestions[0]}`);
      }
    } catch (error) {
      toast.error(t('Failed to extract content'));
      console.error('Content extraction error:', error);
    } finally {
      setIsExtracting(false);
    }
  };

  // Add extracted content to page
  const addExtractedContentToPage = () => {
    if (!extractedContent) return;

    const elements = copyPasteService.convertToPageElements(extractedContent);
    const newSections: PageSection[] = elements.map((element, index) => ({
      id: `extracted-${Date.now()}-${index}`,
      type: element.type === 'image' ? 'image' : 
            element.type === 'video' ? 'video' :
            extractedContent.type === 'product' ? 'product' : 'features',
      title: element.title || extractedContent.metadata.title || 'Extracted Content',
      content: element.content,
      metadata: extractedContent.metadata,
      style: {
        backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa',
        textColor: '#1a1a1a',
        padding: '2rem'
      }
    }));

    setGeneratedPage(prev => [...prev, ...newSections]);
    toast.success(t('Content added to page successfully!'));
    setExtractedContent(null);
    setCopyPasteInput('');
  };

  const generateSalesPage = async () => {
    if (!pageTitle || !productDescription) {
      toast.error(t('Please fill in all required fields'));
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate AI generation with enhanced content
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockSections: PageSection[] = [
        {
          id: 'hero',
          type: 'hero',
          title: pageTitle,
          content: `Transform your business with ${pageTitle}. ${productDescription}`,
          style: {
            backgroundColor: '#1a1a1a',
            textColor: '#ffffff',
            padding: '4rem 2rem'
          }
        },
        {
          id: 'features',
          type: 'features',
          title: 'Key Features',
          content: 'Discover the powerful features that make this product unique and valuable for your business.',
          style: {
            backgroundColor: '#ffffff',
            textColor: '#1a1a1a',
            padding: '3rem 2rem'
          }
        },
        {
          id: 'testimonials',
          type: 'testimonials',
          title: 'What Our Customers Say',
          content: 'Join thousands of satisfied customers who have transformed their business with our solution.',
          style: {
            backgroundColor: '#f8f9fa',
            textColor: '#1a1a1a',
            padding: '3rem 2rem'
          }
        },
        {
          id: 'pricing',
          type: 'pricing',
          title: 'Choose Your Plan',
          content: 'Select the perfect plan for your business needs and start growing today.',
          style: {
            backgroundColor: '#ffffff',
            textColor: '#1a1a1a',
            padding: '3rem 2rem'
          }
        },
        {
          id: 'cta',
          type: 'cta',
          title: 'Ready to Get Started?',
          content: 'Join now and transform your business in just 30 days or get your money back.',
          style: {
            backgroundColor: '#007bff',
            textColor: '#ffffff',
            padding: '3rem 2rem'
          }
        }
      ];

      setGeneratedPage(mockSections);
      toast.success(t('Sales page generated successfully!'));
    } catch (error) {
      toast.error(t('Failed to generate sales page'));
    } finally {
      setIsGenerating(false);
    }
  };

  const resetBuilder = () => {
    setPageTitle('');
    setProductDescription('');
    setTargetAudience('');
    setGeneratedPage([]);
    setIsPreviewMode(false);
    toast.success(t('Builder reset successfully'));
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <Wand className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{t('URL to Sales Page Generator')}</h1>
            <p className="text-muted-foreground">
              {t('Copy any product URL and instantly generate a professional sales page with AI')}
            </p>
          </div>
        </div>
        
        {/* Quick Demo Examples */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            Try These Example URLs:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            <button 
              onClick={() => setCopyPasteInput('https://www.amazon.com/dp/B08N5WRWNW')}
              className="text-left p-2 rounded bg-white hover:bg-gray-50 border"
            >
              📱 Amazon Product URL
            </button>
            <button 
              onClick={() => setCopyPasteInput('https://shopify.com/example-product')}
              className="text-left p-2 rounded bg-white hover:bg-gray-50 border"
            >
              🛍️ Shopify Store URL
            </button>
            <button 
              onClick={() => setCopyPasteInput('https://youtube.com/watch?v=example')}
              className="text-left p-2 rounded bg-white hover:bg-gray-50 border"
            >
              🎥 YouTube Video URL
            </button>
            <button 
              onClick={() => setCopyPasteInput('Premium Wireless Headphones\n\nHigh-quality sound with noise cancellation\nPrice: $199.99')}
              className="text-left p-2 rounded bg-white hover:bg-gray-50 border"
            >
              📝 Product Description Text
            </button>
          </div>
        </div>
      </div>

      {generatedPage.length === 0 ? (
        <Tabs defaultValue="generator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generator" className="gap-2">
              <Wand className="h-4 w-4" />
              {t('URL Generator')}
            </TabsTrigger>
            <TabsTrigger value="demo" className="gap-2">
              <Play className="h-4 w-4" />
              {t('Live Demo')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Copy-Paste Integration Panel - Now Primary */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Paste className="h-5 w-5" />
                    {t('🚀 Instant Sales Page Generator')}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {t('Copy any product URL, social media post, or content and watch AI create a professional sales page instantly!')}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="copyPasteInput" className="text-base font-semibold">
                      {t('Paste Your Content Here')} ⬇️
                    </Label>
                    <Textarea
                      id="copyPasteInput"
                      placeholder={t('✅ Product URLs (Amazon, Shopify, eBay, AliExpress)\n✅ Social media posts (Instagram, Facebook, TikTok)\n✅ YouTube video links\n✅ Product descriptions or any text content\n✅ Image URLs from Unsplash, Pexels\n\nExample:\nhttps://www.amazon.com/dp/B08N5WRWNW\n\nJust paste and click "Generate Sales Page"!')}
                      value={copyPasteInput}
                      onChange={(e) => setCopyPasteInput(e.target.value)}
                      rows={8}
                      className="font-mono text-sm"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={extractContentFromPaste}
                      disabled={!copyPasteInput.trim() || isExtracting}
                      className="flex-1 gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                      size="lg"
                    >
                      {isExtracting ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Wand className="h-4 w-4" />
                      )}
                      {isExtracting ? t('Analyzing Content...') : t('🪄 Generate Sales Page')}
                    </Button>
                    
                    {copyPasteInput && (
                      <Button
                        variant="outline"
                        onClick={() => setCopyPasteInput('')}
                        size="lg"
                      >
                        Clear
                      </Button>
                    )}
                  </div>

                  {extractedContent && (
                    <div className="space-y-3">
                      <Alert className="border-green-200 bg-green-50">
                        <Sparkles className="h-4 w-4" />
                        <AlertContent>
                          <AlertDescription>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                  {extractedContent.type}
                                </Badge>
                                <span className="text-sm font-medium">
                                  {extractedContent.metadata.title || 'Content Extracted Successfully!'}
                                </span>
                              </div>
                              
                              {extractedContent.metadata.description && (
                                <p className="text-sm text-muted-foreground">
                                  {extractedContent.metadata.description.slice(0, 150)}...
                                </p>
                              )}
                              
                              <div className="flex flex-wrap gap-1">
                                {extractedContent.metadata.tags.map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </AlertDescription>
                        </AlertContent>
                      </Alert>

                      {extractedContent.type === 'product' && extractedContent.metadata.image && (
                        <div className="text-center bg-white p-4 rounded-lg border">
                          <img 
                            src={extractedContent.metadata.image} 
                            alt="Product preview"
                            className="w-32 h-32 object-cover rounded-lg mx-auto mb-2"
                          />
                          {extractedContent.metadata.price && (
                            <p className="text-xl font-bold text-green-600">
                              {extractedContent.metadata.price}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            {extractedContent.metadata.brand}
                          </p>
                        </div>
                      )}

                      <Button
                        onClick={addExtractedContentToPage}
                        className="w-full gap-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                        size="lg"
                      >
                        <Copy className="h-4 w-4" />
                        {t('✨ Create Sales Page Now')}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Manual Configuration Panel - Secondary */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    {t('Manual Configuration')}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {t('Or create a custom sales page from scratch')}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="pageTitle">{t('Page Title')} *</Label>
                    <Input
                      id="pageTitle"
                      placeholder={t('Enter your product or service name')}
                      value={pageTitle}
                      onChange={(e) => setPageTitle(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productDescription">{t('Product Description')} *</Label>
                    <Textarea
                      id="productDescription"
                      placeholder={t('Describe your product or service in detail')}
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetAudience">{t('Target Audience')}</Label>
                    <Input
                      id="targetAudience"
                      placeholder={t('Who is your ideal customer?')}
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                    />
                  </div>

                  <Button 
                    onClick={generateSalesPage}
                    disabled={isGenerating || !pageTitle || !productDescription}
                    className="w-full gap-2"
                    variant="outline"
                  >
                    {isGenerating ? (
                      <Brain className="h-4 w-4 animate-pulse" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    {isGenerating ? t('Generating Page...') : t('Generate Sales Page')}
                  </Button>
                </CardContent>
              </Card>

              {/* Tips Panel */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    {t('💡 Pro Tips')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span>🎯</span>
                    <span>Works with any e-commerce URL (Amazon, Shopify, eBay)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>📱</span>
                    <span>Copy social media posts for viral sales pages</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>🎥</span>
                    <span>YouTube videos become video sales letters</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>🖼️</span>
                    <span>Image URLs get converted to visual sales pages</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span>⚡</span>
                    <span>AI optimizes copy for maximum conversions</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="demo" className="space-y-6">
            <URLSalesPageDemo />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-6">
          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="preview" className="gap-2">
                <Eye className="h-4 w-4" />
                {t('Preview')}
              </TabsTrigger>
              <TabsTrigger value="edit" className="gap-2">
                <Edit className="h-4 w-4" />
                {t('Edit')}
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2">
                <ChartBar className="h-4 w-4" />
                {t('Analytics')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="space-y-0">
              <Card>
                <CardContent className="p-0">
                  <div className="bg-white rounded-lg overflow-hidden">
                    {generatedPage.map((section) => (
                      <div
                        key={section.id}
                        style={{
                          backgroundColor: section.style.backgroundColor,
                          color: section.style.textColor,
                          padding: section.style.padding
                        }}
                        className="border-b last:border-b-0"
                      >
                        <div className="max-w-4xl mx-auto text-center">
                          {section.type === 'image' && section.metadata?.image ? (
                            <div className="mb-4">
                              <img 
                                src={section.metadata.image} 
                                alt={section.title}
                                className="w-full max-w-md h-48 object-cover rounded-lg mx-auto"
                              />
                            </div>
                          ) : null}
                          
                          {section.type === 'product' && section.metadata?.image ? (
                            <div className="mb-4">
                              <img 
                                src={section.metadata.image} 
                                alt={section.title}
                                className="w-full max-w-sm h-64 object-cover rounded-lg mx-auto"
                              />
                              {section.metadata.price && (
                                <div className="mt-2">
                                  <span className="text-2xl font-bold text-green-600">
                                    {section.metadata.price}
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : null}
                          
                          <h2 className="text-3xl font-bold mb-4">{section.title}</h2>
                          <p className="text-lg opacity-90">{section.content}</p>
                          
                          {section.metadata?.author && (
                            <p className="text-sm opacity-75 mt-2">— {section.metadata.author}</p>
                          )}
                          
                          {section.type === 'hero' && (
                            <Button className="mt-6" size="lg">
                              {t('Get Started Now')}
                            </Button>
                          )}
                          
                          {section.type === 'product' && (
                            <Button className="mt-6 bg-green-600 hover:bg-green-700" size="lg">
                              {t('Buy Now')}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="edit" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('Edit Sections')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {generatedPage.map((section) => (
                      <Card key={section.id} className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="outline">{section.type}</Badge>
                          <h3 className="font-semibold">{section.title}</h3>
                        </div>
                        <Textarea
                          value={section.content}
                          onChange={(e) => {
                            const updated = generatedPage.map(s => 
                              s.id === section.id ? { ...s, content: e.target.value } : s
                            );
                            setGeneratedPage(updated);
                          }}
                          rows={3}
                        />
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('Page Analytics')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <ChartBar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {t('Analytics will appear here once your page starts receiving traffic')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button 
              variant="outline" 
              onClick={resetBuilder}
              className="gap-2"
            >
              <Edit className="h-4 w-4" />
              {t('Create New Page')}
            </Button>
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              {t('Export Page')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesPageBuilder;