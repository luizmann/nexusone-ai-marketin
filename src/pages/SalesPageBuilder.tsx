import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Wand, 
  Eye, 
  Edit, 
  Download, 
  ChartBar,
  Sparkles,
  Brain
} from '@phosphor-icons/react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface PageSection {
  id: string;
  type: 'hero' | 'features' | 'testimonials' | 'pricing' | 'cta';
  title: string;
  content: string;
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

  const generateSalesPage = async () => {
    if (!pageTitle || !productDescription) {
      toast.error(t('Please fill in all required fields'));
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate AI generation
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
                          <h2 className="text-3xl font-bold mb-4">{section.title}</h2>
                          <p className="text-lg opacity-90">{section.content}</p>
                          {section.type === 'hero' && (
                            <Button className="mt-6" size="lg">
                              {t('Get Started Now')}
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