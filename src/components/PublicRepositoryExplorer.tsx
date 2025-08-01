import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Download, ExternalLink, Github, Code, Image, Lightbulb, Package, Sparkles } from '@phosphor-icons/react';
import { publicRepoIntegration } from '../services/publicRepositoryIntegrations';
import { PublicAPIShowcase } from './PublicAPIShowcase';
import { useLanguage } from '../contexts/CleanLanguageContext';

interface Repository {
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  language: string;
  license?: { name: string };
}

interface Template {
  name: string;
  repo: string;
  description: string;
  category: string;
  license: string;
}

interface Quote {
  content: string;
  author: string;
  tags: string[];
}

interface StockImage {
  id: string;
  urls: {
    regular: string;
    thumb: string;
  };
  alt_description: string;
  user: {
    name: string;
  };
}

export function PublicRepositoryExplorer() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('showcase');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for different data types
  const [inspirationData, setInspirationData] = useState<{
    quotes: Quote[];
    advice: string;
  }>({ quotes: [], advice: '' });
  
  const [templatesData, setTemplatesData] = useState<{
    landingPages: Template[];
    emailTemplates: Template[];
    components: Template[];
  }>({ landingPages: [], emailTemplates: [], components: [] });
  
  const [aiToolsData, setAiToolsData] = useState<{
    repositories: Repository[];
    packages: any[];
  }>({ repositories: [], packages: [] });
  
  const [marketingData, setMarketingData] = useState<{
    repositories: Repository[];
    packages: any[];
  }>({ repositories: [], packages: [] });
  
  const [stockImages, setStockImages] = useState<StockImage[]>([]);
  const [codeSnippets, setCodeSnippets] = useState<any>({});

  // Load data based on active tab
  useEffect(() => {
    if (activeTab !== 'showcase') {
      loadTabData(activeTab);
    }
  }, [activeTab]);

  const loadTabData = async (tab: string) => {
    setLoading(true);
    try {
      switch (tab) {
        case 'inspiration':
          const inspiration = await publicRepoIntegration.getInspirationContent();
          if (inspiration.success) {
            setInspirationData(inspiration);
          }
          break;
        
        case 'templates':
          const templates = await publicRepoIntegration.getMarketingTemplates();
          if (templates.success) {
            setTemplatesData(templates);
          }
          break;
        
        case 'ai-tools':
          const aiTools = await publicRepoIntegration.getAIToolsAndLibraries();
          if (aiTools.success) {
            setAiToolsData(aiTools);
          }
          break;
        
        case 'marketing':
          const marketing = await publicRepoIntegration.getMarketingAutomationResources();
          if (marketing.success) {
            setMarketingData(marketing);
          }
          break;
        
        case 'images':
          const images = await publicRepoIntegration.getFreeStockImages(searchQuery || 'business marketing');
          if (images.success) {
            setStockImages(images.images);
          }
          break;
        
        case 'code':
          const snippets = await publicRepoIntegration.getUsefulCodeSnippets();
          if (snippets.success) {
            setCodeSnippets(snippets);
          }
          break;
      }
    } catch (error) {
      console.error('Error loading tab data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSearch = () => {
    if (activeTab === 'images') {
      loadTabData('images');
    }
  };

  const renderRepositoryCard = (repo: Repository) => (
    <Card key={repo.full_name} className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm font-medium">{repo.name}</CardTitle>
          <Badge variant="secondary" className="text-xs">
            ⭐ {repo.stargazers_count.toLocaleString()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground mb-3 line-clamp-3">
          {repo.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {repo.language && (
              <Badge variant="outline" className="text-xs">
                {repo.language}
              </Badge>
            )}
            {repo.license && (
              <Badge variant="outline" className="text-xs">
                {repo.license.name}
              </Badge>
            )}
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => window.open(repo.html_url, '_blank')}
            className="h-8 w-8 p-0"
          >
            <ExternalLink size={14} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderTemplateCard = (template: Template) => (
    <Card key={template.name} className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">{template.name}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-xs text-muted-foreground mb-3">
          {template.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {template.category}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {template.license}
            </Badge>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => window.open(`https://github.com/${template.repo}`, '_blank')}
            className="h-8 w-8 p-0"
          >
            <Github size={14} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderImageCard = (image: StockImage) => (
    <Card key={image.id} className="overflow-hidden">
      <div className="aspect-video relative">
        <img
          src={image.urls.regular}
          alt={image.alt_description}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => window.open(image.urls.regular, '_blank')}
          >
            <Download size={14} className="mr-1" />
            Download
          </Button>
        </div>
      </div>
      <CardContent className="p-3">
        <p className="text-xs text-muted-foreground truncate">
          Photo by {image.user.name}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Public Repository Explorer</h2>
          <p className="text-muted-foreground">
            Discover and integrate open-source tools, templates, and resources
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-7 w-full">
          <TabsTrigger value="showcase" className="flex items-center gap-2">
            <Sparkles size={16} />
            Showcase
          </TabsTrigger>
          <TabsTrigger value="inspiration" className="flex items-center gap-2">
            <Lightbulb size={16} />
            Inspiration
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Code size={16} />
            Templates
          </TabsTrigger>
          <TabsTrigger value="ai-tools" className="flex items-center gap-2">
            <Package size={16} />
            AI Tools
          </TabsTrigger>
          <TabsTrigger value="marketing" className="flex items-center gap-2">
            <Package size={16} />
            Marketing
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-2">
            <Image size={16} />
            Images
          </TabsTrigger>
          <TabsTrigger value="code" className="flex items-center gap-2">
            <Code size={16} />
            Code
          </TabsTrigger>
        </TabsList>

        <TabsContent value="showcase" className="space-y-4">
          <PublicAPIShowcase />
        </TabsContent>

        <TabsContent value="inspiration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb size={20} />
                Daily Inspiration
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Loading inspiration...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {inspirationData.advice && (
                    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                      <CardContent className="p-4">
                        <p className="text-sm font-medium text-blue-900">
                          💡 {inspirationData.advice}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {inspirationData.quotes.slice(0, 6).map((quote, index) => (
                      <Card key={index} className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                          <blockquote className="text-sm italic mb-2">
                            "{quote.content}"
                          </blockquote>
                          <p className="text-xs text-muted-foreground">
                            — {quote.author}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {quote.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading templates...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Landing Page Templates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templatesData.landingPages.map(renderTemplateCard)}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Email Templates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templatesData.emailTemplates.map(renderTemplateCard)}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-3">UI Components</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templatesData.components.map(renderTemplateCard)}
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="ai-tools" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading AI tools...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {aiToolsData.repositories.slice(0, 12).map(renderRepositoryCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="marketing" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading marketing tools...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketingData.repositories.slice(0, 12).map(renderRepositoryCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Search for images (e.g., business, marketing, technology)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleImageSearch()}
            />
            <Button onClick={handleImageSearch} disabled={loading}>
              Search
            </Button>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading images...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {stockImages.slice(0, 16).map(renderImageCard)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="code" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading code snippets...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">React Hooks</h3>
                <div className="space-y-4">
                  {codeSnippets.reactHooks?.map((snippet: any, index: number) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-base">{snippet.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{snippet.description}</p>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-40">
                          <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
                            <code>{snippet.code}</code>
                          </pre>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Marketing Utils</h3>
                <div className="space-y-4">
                  {codeSnippets.marketingUtils?.map((snippet: any, index: number) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="text-base">{snippet.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{snippet.description}</p>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-40">
                          <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto">
                            <code>{snippet.code}</code>
                          </pre>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}