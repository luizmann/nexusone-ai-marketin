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
  Globe
} from '@phosphor-icons/react';
import { useLanguage } from '@/contexts/CleanLanguageContext';
import { toast } from 'sonner';
import { copyPasteService, ExtractedContent } from '@/services/copyPasteIntegration';

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
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Wand className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{t('AI Sales Page Builder')}</h1>
            <p className="text-muted-foreground">
              {t('Create high-converting sales pages with artificial intelligence')}
            </p>
          </div>
        </div>
      </div>

      {generatedPage.length === 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Original Configuration Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                {t('Page Configuration')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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
                  rows={4}
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
                size="lg"
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

          {/* Copy-Paste Integration Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Paste className="h-5 w-5" />
                {t('Copy-Paste Integration')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="copyPasteInput">{t('Paste Content Here')}</Label>
                <Textarea
                  id="copyPasteInput"
                  placeholder={t('Paste any URL, product link, text content, or social media post...\n\nSupported:\n• Product URLs (Amazon, Shopify, etc.)\n• Social media posts\n• Video links (YouTube, Vimeo)\n• Image URLs\n• Text content')}
                  value={copyPasteInput}
                  onChange={(e) => setCopyPasteInput(e.target.value)}
                  rows={6}
                />
              </div>

              <Button
                onClick={extractContentFromPaste}
                disabled={!copyPasteInput.trim() || isExtracting}
                className="w-full gap-2"
              >
                {isExtracting ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Wand className="h-4 w-4" />
                )}
                {isExtracting ? t('Extracting Content...') : t('Extract & Enhance')}
              </Button>

              {extractedContent && (
                <div className="space-y-3">
                  <Alert>
                    <Sparkles className="h-4 w-4" />
                    <AlertContent>
                      <AlertDescription>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{extractedContent.type}</Badge>
                            <span className="text-sm font-medium">
                              {extractedContent.metadata.title || 'Content Extracted'}
                            </span>
                          </div>
                          
                          {extractedContent.metadata.description && (
                            <p className="text-sm text-muted-foreground">
                              {extractedContent.metadata.description.slice(0, 100)}...
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
                    <div className="text-center">
                      <img 
                        src={extractedContent.metadata.image} 
                        alt="Product preview"
                        className="w-24 h-24 object-cover rounded-lg mx-auto"
                      />
                      {extractedContent.metadata.price && (
                        <p className="text-lg font-bold text-green-600 mt-2">
                          {extractedContent.metadata.price}
                        </p>
                      )}
                    </div>
                  )}

                  <Button
                    onClick={addExtractedContentToPage}
                    className="w-full gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    {t('Add to Page')}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
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