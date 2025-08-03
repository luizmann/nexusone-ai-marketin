import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { APIService } from '@/lib/supabase';
import { toast } from 'sonner';
import { 
  Sparkles, 
  Globe, 
  Eye, 
  MousePointer, 
  TrendingUp,
  Plus,
  Link,
  Palette,
  Smartphone,
  Desktop,
  Edit3,
  Share
} from '@phosphor-icons/react';

interface MagicPage {
  id: string;
  title: string;
  slug: string;
  views: number;
  conversions: number;
  conversion_rate: number;
  status: 'draft' | 'published';
  created_at: string;
  product_url?: string;
}

export default function MagicPages() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [productUrl, setProductUrl] = useState('');
  const [pages, setPages] = useState<MagicPage[]>([
    {
      id: '1',
      title: 'Wireless Bluetooth Earbuds - Premium Sound',
      slug: 'wireless-earbuds-premium',
      views: 1247,
      conversions: 89,
      conversion_rate: 7.1,
      status: 'published',
      created_at: '2024-01-15',
      product_url: 'https://example.com/earbuds'
    },
    {
      id: '2',
      title: 'Smart Fitness Watch - Health Tracking',
      slug: 'smart-fitness-watch',
      views: 892,
      conversions: 34,
      conversion_rate: 3.8,
      status: 'published',
      created_at: '2024-01-12'
    },
    {
      id: '3',
      title: 'LED Gaming Keyboard - RGB Backlit',
      slug: 'led-gaming-keyboard',
      views: 445,
      conversions: 12,
      conversion_rate: 2.7,
      status: 'draft',
      created_at: '2024-01-10'
    }
  ]);

  const handleGeneratePage = async () => {
    if (!productUrl.trim()) {
      toast.error('Please enter a product URL');
      return;
    }

    setLoading(true);
    try {
      // Show immediate feedback
      toast.info(t('ai.creating_page'));

      // Call API to generate magic page
      const result = await APIService.generateMagicPage(productUrl, {
        language: 'en',
        style: 'modern',
        conversion_focused: true
      });

      // Simulate page creation
      const newPage: MagicPage = {
        id: Date.now().toString(),
        title: result.title || 'New Magic Page',
        slug: result.slug || 'new-page',
        views: 0,
        conversions: 0,
        conversion_rate: 0,
        status: 'draft',
        created_at: new Date().toISOString().split('T')[0],
        product_url: productUrl
      };

      setPages(prev => [newPage, ...prev]);
      setProductUrl('');
      toast.success(t('status.page_published'));
    } catch (error) {
      console.error('Error generating page:', error);
      toast.error(t('status.failed'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'published' 
      ? <Badge className="bg-green-100 text-green-800">Published</Badge>
      : <Badge variant="secondary">Draft</Badge>;
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          {t('magic_pages.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('magic_pages.subtitle')}
        </p>
      </div>

      {/* Create New Page */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            {t('magic_pages.create_new')}
          </CardTitle>
          <CardDescription>
            {t('magic_pages.enter_url')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="product-url">{t('magic_pages.product_url')}</Label>
              <Input
                id="product-url"
                type="url"
                placeholder="https://example.com/product"
                value={productUrl}
                onChange={(e) => setProductUrl(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleGeneratePage}
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {loading ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                    {t('magic_pages.generating')}
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('common.generate')}
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pages List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Pages</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {pages.map((page) => (
              <Card key={page.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{page.title}</h3>
                        {getStatusBadge(page.status)}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Globe className="h-4 w-4" />
                          /{page.slug}
                        </span>
                        <span>Created {page.created_at}</span>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-6 pt-2">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">
                            {formatNumber(page.views)} views
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MousePointer className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">
                            {formatNumber(page.conversions)} conversions
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium">
                            {page.conversion_rate}% rate
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        {t('magic_pages.preview')}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit3 className="h-4 w-4 mr-1" />
                        {t('common.edit')}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share className="h-4 w-4 mr-1" />
                        {t('common.share')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="published" className="space-y-4">
          <div className="grid gap-4">
            {pages.filter(page => page.status === 'published').map((page) => (
              <Card key={page.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{page.title}</h3>
                        {getStatusBadge(page.status)}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Link className="h-4 w-4" />
                          nexusoneai.com/{page.slug}
                        </span>
                        <span>Live since {page.created_at}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 pt-3">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {formatNumber(page.views)}
                          </div>
                          <div className="text-sm text-muted-foreground">Views</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {formatNumber(page.conversions)}
                          </div>
                          <div className="text-sm text-muted-foreground">Conversions</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {page.conversion_rate}%
                          </div>
                          <div className="text-sm text-muted-foreground">Rate</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Eye className="h-4 w-4 mr-1" />
                        View Live
                      </Button>
                      <Button variant="outline" size="sm">
                        <Palette className="h-4 w-4 mr-1" />
                        Customize
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

        <TabsContent value="drafts" className="space-y-4">
          <div className="grid gap-4">
            {pages.filter(page => page.status === 'draft').map((page) => (
              <Card key={page.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{page.title}</h3>
                        {getStatusBadge(page.status)}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Created {page.created_at}</span>
                        <span>Not yet published</span>
                      </div>

                      <div className="flex items-center gap-4 pt-2">
                        <div className="flex items-center gap-2 text-yellow-600">
                          <Edit3 className="h-4 w-4" />
                          <span className="text-sm">Ready for editing</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Desktop className="h-4 w-4 mr-1" />
                        Desktop Preview
                      </Button>
                      <Button variant="outline" size="sm">
                        <Smartphone className="h-4 w-4 mr-1" />
                        Mobile Preview
                      </Button>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Globe className="h-4 w-4 mr-1" />
                        {t('magic_pages.publish')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Empty State */}
      {pages.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No magic pages yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first AI-generated sales page to start converting visitors into customers.
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Page
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}