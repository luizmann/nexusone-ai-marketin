/**
 * Enhanced Magic Pages with Copy-Paste Integration Examples
 * Demonstrates how to enhance NexusOne features with dynamic content and copy-paste workflows
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertContent, AlertDescription } from '@/components/ui/alert';
import { 
  Sparkles, 
  Eye, 
  Download, 
  Share, 
  Copy, 
  Paste, 
  Image as ImageIcon,
  Video,
  Text,
  Palette,
  Settings,
  Wand2,
  RefreshCw,
  Globe,
  QrCode,
  BookOpen
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/CleanLanguageContext';
import { copyPasteService, ExtractedContent } from '@/services/copyPasteIntegration';
import { CopyPasteExamples } from './CopyPasteExamples';

interface DynamicContent {
  id: string;
  type: 'text' | 'image' | 'video' | 'button' | 'quote' | 'testimonial';
  content: string;
  metadata?: {
    source?: string;
    author?: string;
    url?: string;
    width?: number;
    height?: number;
    style?: Record<string, string>;
  };
  position: {
    x: number;
    y: number;
    width: string;
    height: string;
  };
}

interface PageTemplate {
  id: string;
  name: string;
  description: string;
  sections: DynamicContent[];
  globalStyles: {
    backgroundColor: string;
    primaryColor: string;
    fontFamily: string;
    borderRadius: string;
  };
}

interface CopyPasteData {
  type: 'url' | 'text' | 'image' | 'product' | 'video';
  content: string;
  extracted: {
    title?: string;
    description?: string;
    image?: string;
    price?: string;
    brand?: string;
    metadata?: Record<string, any>;
  };
}

export function EnhancedMagicPagesWithCopyPaste() {
  const { t } = useLanguage();
  const [currentTemplate, setCurrentTemplate] = useState<PageTemplate | null>(null);
  const [copyPasteInput, setCopyPasteInput] = useState('');
  const [extractedData, setExtractedData] = useState<CopyPasteData | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [selectedElement, setSelectedElement] = useState<DynamicContent | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [aiMode, setAiMode] = useState(true);
  const [showExamples, setShowExamples] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Predefined templates for quick start
  const templates: PageTemplate[] = [
    {
      id: 'product-landing',
      name: 'Product Landing',
      description: 'Perfect for showcasing a single product with conversion focus',
      sections: [
        {
          id: 'hero-1',
          type: 'text',
          content: 'Transform Your Business Today',
          position: { x: 0, y: 0, width: '100%', height: '80px' },
          metadata: { style: { fontSize: '2.5rem', fontWeight: 'bold', textAlign: 'center' } }
        },
        {
          id: 'subtitle-1',
          type: 'text',
          content: 'Discover the powerful solution that industry leaders trust',
          position: { x: 0, y: 90, width: '100%', height: '40px' },
          metadata: { style: { fontSize: '1.25rem', textAlign: 'center', color: '#666' } }
        },
        {
          id: 'hero-image',
          type: 'image',
          content: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
          position: { x: 0, y: 150, width: '100%', height: '300px' },
          metadata: { style: { objectFit: 'cover', borderRadius: '8px' } }
        },
        {
          id: 'cta-button',
          type: 'button',
          content: 'Get Started Now',
          position: { x: 0, y: 470, width: '200px', height: '50px' },
          metadata: { style: { backgroundColor: '#007bff', color: 'white', margin: '0 auto' } }
        }
      ],
      globalStyles: {
        backgroundColor: '#ffffff',
        primaryColor: '#007bff',
        fontFamily: 'Inter, sans-serif',
        borderRadius: '8px'
      }
    },
    {
      id: 'service-showcase',
      name: 'Service Showcase',
      description: 'Ideal for service-based businesses and consultants',
      sections: [
        {
          id: 'service-hero',
          type: 'text',
          content: 'Professional Services That Deliver Results',
          position: { x: 0, y: 0, width: '100%', height: '60px' },
          metadata: { style: { fontSize: '2rem', fontWeight: 'bold', textAlign: 'center' } }
        },
        {
          id: 'service-description',
          type: 'text',
          content: 'We provide expert consultation and implementation services to help your business grow and succeed in today\'s competitive market.',
          position: { x: 0, y: 80, width: '100%', height: '80px' },
          metadata: { style: { fontSize: '1rem', textAlign: 'center', lineHeight: '1.6' } }
        },
        {
          id: 'testimonial-1',
          type: 'testimonial',
          content: '"Working with this team transformed our business. We saw immediate results and couldn\'t be happier with the outcome."',
          position: { x: 0, y: 180, width: '100%', height: '100px' },
          metadata: { author: 'Sarah Johnson, CEO of TechCorp', style: { fontStyle: 'italic', textAlign: 'center' } }
        }
      ],
      globalStyles: {
        backgroundColor: '#f8f9fa',
        primaryColor: '#28a745',
        fontFamily: 'Inter, sans-serif',
        borderRadius: '12px'
      }
    }
  ];

  // Enhanced content extraction from copy-paste
  const extractContentFromInput = async (input: string) => {
    setIsExtracting(true);
    
    try {
      let extractedData: CopyPasteData = {
        type: 'text',
        content: input,
        extracted: {}
      };

      // URL Detection and extraction
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const urls = input.match(urlRegex);
      
      if (urls && urls.length > 0) {
        const url = urls[0];
        extractedData.type = 'url';
        extractedData.content = url;
        
        // Simulate URL scraping (in real implementation, this would call your backend)
        if (url.includes('amazon.com') || url.includes('shopify.com') || url.includes('product')) {
          extractedData.type = 'product';
          extractedData.extracted = {
            title: 'Amazing Product Name',
            description: 'This is an incredible product that will transform your life.',
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
            price: '$99.99',
            brand: 'BrandName',
            metadata: { category: 'Electronics', rating: '4.8/5' }
          };
        } else if (url.includes('youtube.com') || url.includes('vimeo.com')) {
          extractedData.type = 'video';
          extractedData.extracted = {
            title: 'Extracted Video Title',
            description: 'Video description and content',
            image: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400'
          };
        } else {
          // Generic URL extraction
          extractedData.extracted = {
            title: 'Website Content',
            description: 'Extracted content from the provided URL',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400'
          };
        }
      }
      // Image URL detection
      else if (input.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        extractedData.type = 'image';
        extractedData.extracted = {
          image: input,
          title: 'Pasted Image',
          description: 'Image added from URL'
        };
      }
      // Rich text content extraction
      else if (input.length > 100) {
        // Extract potential titles, quotes, etc.
        const lines = input.split('\n').filter(line => line.trim());
        const firstLine = lines[0];
        const restContent = lines.slice(1).join('\n');
        
        if (firstLine && firstLine.length < 100) {
          extractedData.extracted.title = firstLine;
          extractedData.extracted.description = restContent;
        } else {
          extractedData.extracted.description = input;
        }
      }

      setExtractedData(extractedData);
      toast.success(t('Content extracted successfully!'));
      
    } catch (error) {
      toast.error(t('Failed to extract content'));
      console.error('Content extraction error:', error);
    } finally {
      setIsExtracting(false);
    }
  };

  // Add extracted content to canvas
  const addContentToCanvas = (content: CopyPasteData) => {
    if (!currentTemplate) return;

    const newElement: DynamicContent = {
      id: `element-${Date.now()}`,
      type: content.type === 'product' ? 'text' : content.type as any,
      content: content.extracted.title || content.content,
      position: {
        x: 20,
        y: (currentTemplate.sections.length * 120) + 20,
        width: content.type === 'image' ? '300px' : '100%',
        height: content.type === 'image' ? '200px' : 'auto'
      },
      metadata: {
        ...content.extracted,
        source: content.content
      }
    };

    if (content.type === 'image' && content.extracted.image) {
      newElement.content = content.extracted.image;
    }

    setCurrentTemplate(prev => prev ? {
      ...prev,
      sections: [...prev.sections, newElement]
    } : null);

    toast.success(t('Content added to page!'));
  };

  // AI-powered content enhancement
  const enhanceWithAI = async () => {
    if (!currentTemplate) return;

    toast.info(t('Enhancing content with AI...'));
    
    // Simulate AI enhancement
    setTimeout(() => {
      setCurrentTemplate(prev => prev ? {
        ...prev,
        sections: prev.sections.map(section => {
          if (section.type === 'text' && !section.content.includes('✨')) {
            return {
              ...section,
              content: `✨ ${section.content} - Enhanced with AI insights`
            };
          }
          return section;
        })
      } : null);
      
      toast.success(t('Content enhanced with AI!'));
    }, 2000);
  };

  // Generate QR code for sharing
  const generateQRCode = async () => {
    const pageData = {
      template: currentTemplate?.name,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };
    
    // In real implementation, this would generate an actual QR code
    toast.success(t('QR code generated for easy sharing!'));
  };

  // Copy page as JSON for developers
  const copyPageAsJSON = () => {
    if (!currentTemplate) return;
    
    const pageJSON = JSON.stringify(currentTemplate, null, 2);
    navigator.clipboard.writeText(pageJSON);
    toast.success(t('Page structure copied to clipboard!'));
  };

  // Export as different formats
  const exportPage = (format: 'html' | 'json' | 'react') => {
    if (!currentTemplate) return;

    let exportContent = '';
    
    switch (format) {
      case 'html':
        exportContent = generateHTML(currentTemplate);
        break;
      case 'json':
        exportContent = JSON.stringify(currentTemplate, null, 2);
        break;
      case 'react':
        exportContent = generateReactComponent(currentTemplate);
        break;
    }

    const blob = new Blob([exportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `magic-page.${format}`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success(t(`Page exported as ${format.toUpperCase()}!`));
  };

  const generateHTML = (template: PageTemplate) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${template.name}</title>
    <style>
        body { 
            font-family: ${template.globalStyles.fontFamily}; 
            background-color: ${template.globalStyles.backgroundColor};
            margin: 0; padding: 20px;
        }
        .container { max-width: 1200px; margin: 0 auto; position: relative; }
        .element { position: absolute; }
    </style>
</head>
<body>
    <div class="container">
        ${template.sections.map(section => `
            <div class="element" style="
                left: ${section.position.x}px; 
                top: ${section.position.y}px; 
                width: ${section.position.width}; 
                height: ${section.position.height};
                ${Object.entries(section.metadata?.style || {}).map(([key, value]) => 
                    `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`
                ).join(' ')}
            ">
                ${section.type === 'image' ? 
                    `<img src="${section.content}" alt="Content" style="width: 100%; height: 100%; object-fit: cover;">` :
                    section.content
                }
            </div>
        `).join('')}
    </div>
</body>
</html>`;
  };

  const generateReactComponent = (template: PageTemplate) => {
    return `import React from 'react';

const ${template.name.replace(/\s+/g, '')}Page = () => {
  return (
    <div style={{ 
      fontFamily: '${template.globalStyles.fontFamily}',
      backgroundColor: '${template.globalStyles.backgroundColor}',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
        ${template.sections.map(section => `
        <div style={{
          position: 'absolute',
          left: '${section.position.x}px',
          top: '${section.position.y}px',
          width: '${section.position.width}',
          height: '${section.position.height}',
          ${Object.entries(section.metadata?.style || {}).map(([key, value]) => 
            `${key}: '${value}'`
          ).join(',\n          ')}
        }}>
          ${section.type === 'image' ? 
            `<img src="${section.content}" alt="Content" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />` :
            `{${JSON.stringify(section.content)}}`
          }
        </div>`).join('')}
      </div>
    </div>
  );
};

export default ${template.name.replace(/\s+/g, '')}Page;`;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              {t('Enhanced Magic Pages')}
            </h1>
            <p className="text-muted-foreground">
              {t('Create stunning pages with copy-paste integration and AI enhancement')}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Label htmlFor="ai-mode">{t('AI Mode')}</Label>
            <Switch
              id="ai-mode"
              checked={aiMode}
              onCheckedChange={setAiMode}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tools Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Template Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">{t('Quick Start Templates')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {templates.map(template => (
                  <Button
                    key={template.id}
                    variant={currentTemplate?.id === template.id ? "default" : "outline"}
                    className="w-full justify-start text-left"
                    onClick={() => setCurrentTemplate(template)}
                  >
                    <div>
                      <div className="font-medium">{template.name}</div>
                      <div className="text-xs text-muted-foreground">{template.description}</div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Copy-Paste Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Paste size={16} />
                  {t('Copy-Paste Integration')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  placeholder={t('Paste any URL, text, or content here...\n\nExamples:\n- Product URLs\n- YouTube videos\n- Image URLs\n- Article text')}
                  value={copyPasteInput}
                  onChange={(e) => setCopyPasteInput(e.target.value)}
                  rows={4}
                />
                
                <Button
                  onClick={() => extractContentFromInput(copyPasteInput)}
                  disabled={!copyPasteInput || isExtracting}
                  className="w-full"
                  size="sm"
                >
                  {isExtracting ? (
                    <>
                      <RefreshCw size={14} className="mr-2 animate-spin" />
                      {t('Extracting...')}
                    </>
                  ) : (
                    <>
                      <Wand2 size={14} className="mr-2" />
                      {t('Extract Content')}
                    </>
                  )}
                </Button>

                {extractedData && (
                  <div className="space-y-2">
                    <Alert>
                      <Sparkles size={16} />
                      <AlertContent>
                        <AlertDescription>
                          {t('Content extracted:')} <Badge variant="secondary">{extractedData.type}</Badge>
                          {extractedData.extracted.title && (
                            <div className="mt-2 text-sm font-medium">{extractedData.extracted.title}</div>
                          )}
                        </AlertDescription>
                      </AlertContent>
                    </Alert>
                    
                    <Button
                      onClick={() => addContentToCanvas(extractedData)}
                      disabled={!currentTemplate}
                      className="w-full"
                      size="sm"
                    >
                      <Copy size={14} className="mr-2" />
                      {t('Add to Page')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Tools */}
            {aiMode && currentTemplate && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sparkles size={16} />
                    {t('AI Enhancement')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button onClick={enhanceWithAI} className="w-full" size="sm">
                    <Wand2 size={14} className="mr-2" />
                    {t('Enhance with AI')}
                  </Button>
                  
                  <Button onClick={generateQRCode} variant="outline" className="w-full" size="sm">
                    <QrCode size={14} className="mr-2" />
                    {t('Generate QR Code')}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Export Tools */}
            {currentTemplate && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Download size={16} />
                    {t('Export & Share')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button onClick={() => exportPage('html')} variant="outline" className="w-full" size="sm">
                    <Globe size={14} className="mr-2" />
                    {t('Export HTML')}
                  </Button>
                  
                  <Button onClick={() => exportPage('react')} variant="outline" className="w-full" size="sm">
                    <Text size={14} className="mr-2" />
                    {t('Export React')}
                  </Button>
                  
                  <Button onClick={copyPageAsJSON} variant="outline" className="w-full" size="sm">
                    <Copy size={14} className="mr-2" />
                    {t('Copy JSON')}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Examples Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <BookOpen size={16} />
                  {t('Copy-Paste Examples')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">
                  {t('Learn how to use copy-paste integration with real examples')}
                </p>
                <Button 
                  onClick={() => setShowExamples(true)} 
                  variant="outline" 
                  className="w-full" 
                  size="sm"
                >
                  <BookOpen size={14} className="mr-2" />
                  {t('View Examples')}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Canvas Area */}
          <div className="lg:col-span-3">
            <Card className="min-h-[600px]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Eye size={20} />
                    {currentTemplate ? currentTemplate.name : t('Select a template to start')}
                  </CardTitle>
                  
                  {currentTemplate && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPreviewMode(!previewMode)}
                      >
                        {previewMode ? t('Edit Mode') : t('Preview Mode')}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                {!currentTemplate ? (
                  <div className="flex items-center justify-center h-96 text-center">
                    <div className="space-y-4">
                      <Sparkles size={48} className="mx-auto text-muted-foreground" />
                      <div>
                        <h3 className="text-lg font-semibold">{t('Start Creating')}</h3>
                        <p className="text-muted-foreground">
                          {t('Select a template from the sidebar to begin building your page')}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div 
                    ref={canvasRef}
                    className="relative bg-white border-2 border-dashed border-gray-200 rounded-lg min-h-[500px] overflow-hidden"
                    style={{ 
                      backgroundColor: currentTemplate.globalStyles.backgroundColor,
                      fontFamily: currentTemplate.globalStyles.fontFamily 
                    }}
                  >
                    {currentTemplate.sections.map((section) => (
                      <div
                        key={section.id}
                        className={`absolute cursor-pointer transition-all ${
                          selectedElement?.id === section.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                        }`}
                        style={{
                          left: section.position.x,
                          top: section.position.y,
                          width: section.position.width,
                          height: section.position.height,
                          ...section.metadata?.style
                        }}
                        onClick={() => setSelectedElement(section)}
                      >
                        {section.type === 'image' ? (
                          <img
                            src={section.content}
                            alt="Content"
                            className="w-full h-full object-cover rounded"
                            style={{ borderRadius: currentTemplate.globalStyles.borderRadius }}
                          />
                        ) : section.type === 'button' ? (
                          <button
                            className="px-4 py-2 rounded font-medium transition-colors hover:opacity-90"
                            style={{
                              backgroundColor: currentTemplate.globalStyles.primaryColor,
                              color: 'white',
                              borderRadius: currentTemplate.globalStyles.borderRadius,
                              ...section.metadata?.style
                            }}
                          >
                            {section.content}
                          </button>
                        ) : section.type === 'testimonial' ? (
                          <blockquote className="relative">
                            <div className="text-gray-700 italic">{section.content}</div>
                            {section.metadata?.author && (
                              <footer className="mt-2 text-sm text-gray-500">
                                — {section.metadata.author}
                              </footer>
                            )}
                          </blockquote>
                        ) : (
                          <div className="w-full h-full flex items-center">
                            {section.content}
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {/* Drop Zone Indicator */}
                    {extractedData && (
                      <div className="absolute bottom-4 right-4 bg-blue-100 border-2 border-blue-300 border-dashed rounded-lg p-4 text-center">
                        <p className="text-sm text-blue-700">
                          {t('Drop extracted content here')}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Examples Modal */}
      {showExamples && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-6xl max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{t('Copy-Paste Integration Examples')}</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowExamples(false)}
                >
                  {t('Close')}
                </Button>
              </div>
              <CopyPasteExamples />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}