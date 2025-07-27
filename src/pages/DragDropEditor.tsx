import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useKV } from '@github/spark/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Palette,
  Type,
  Image as ImageIcon,
  Layout,
  MousePointer,
  Eye,
  Code,
  Smartphone,
  Monitor,
  Tablet,
  Save,
  Play,
  Plus,
  Trash,
  Move,
  Copy,
  Settings,
  Grid3X3,
  Square,
  Circle,
  Triangle,
  Images,
  Brain,
  Sparkles
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { useLanguage } from '../contexts/LanguageContext';
import { fixedCampaignService } from '@/services/fixedCampaignService';

interface PageElement {
  id: string;
  type: 'text' | 'image' | 'button' | 'form' | 'video' | 'spacer' | 'container';
  content: string;
  styles: {
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    backgroundColor?: string;
    padding?: string;
    margin?: string;
    borderRadius?: string;
    textAlign?: 'left' | 'center' | 'right';
    width?: string;
    height?: string;
  };
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  children?: PageElement[];
}

interface LandingPage {
  id: string;
  name: string;
  template: string;
  elements: PageElement[];
  settings: {
    backgroundColor: string;
    fontFamily: string;
    primaryColor: string;
    secondaryColor: string;
  };
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  campaignAssets?: {
    generatedImages: Array<{
      id: string;
      url: string;
      type: string;
      prompt: string;
    }>;
    designElements: Array<{
      id: string;
      type: string;
      content: string;
      styles: any;
    }>;
  };
}

interface AIImageAsset {
  id: string;
  url: string;
  type: 'hero' | 'product' | 'background' | 'icon';
  prompt: string;
}

const elementTemplates = [
  { 
    type: 'text' as const, 
    label: 'Text', 
    icon: Type,
    template: {
      content: 'Your text here',
      styles: { fontSize: '16px', color: '#000000' }
    }
  },
  { 
    type: 'image' as const, 
    label: 'Image', 
    icon: ImageIcon,
    template: {
      content: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400',
      styles: { width: '100%', borderRadius: '8px' }
    }
  },
  { 
    type: 'button' as const, 
    label: 'Button', 
    icon: MousePointer,
    template: {
      content: 'Click Me',
      styles: { 
        backgroundColor: '#007bff', 
        color: '#ffffff', 
        padding: '12px 24px',
        borderRadius: '6px',
        textAlign: 'center' as const
      }
    }
  },
  { 
    type: 'container' as const, 
    label: 'Container', 
    icon: Square,
    template: {
      content: '',
      styles: { 
        backgroundColor: '#f8f9fa', 
        padding: '20px',
        borderRadius: '8px',
        minHeight: '100px'
      }
    }
  }
];

const deviceSizes = [
  { name: 'Mobile', width: 375, height: 812, icon: Smartphone },
  { name: 'Tablet', width: 768, height: 1024, icon: Tablet },
  { name: 'Desktop', width: 1200, height: 800, icon: Monitor }
];

export function DragDropEditor() {
  const { t } = useLanguage();
  const [pages, setPages] = useKV<LandingPage[]>('landing-pages', []);
  const [currentPage, setCurrentPage] = useState<LandingPage | null>(null);
  const [selectedElement, setSelectedElement] = useState<PageElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedDevice, setSelectedDevice] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [aiImages, setAiImages] = useState<AIImageAsset[]>([]);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Load campaign assets when page loads
  useEffect(() => {
    loadCampaignAssets();
  }, []);

  const loadCampaignAssets = async () => {
    setIsLoadingAssets(true);
    try {
      // Load last generated campaign assets
      const campaigns = JSON.parse(localStorage.getItem('generated-campaigns') || '[]');
      if (campaigns.length > 0) {
        const lastCampaign = campaigns[campaigns.length - 1];
        console.log('Loading campaign assets:', lastCampaign);
        
        // Load images from campaign
        if (lastCampaign.dragDropAssets?.generatedImages) {
          console.log('Found generated images:', lastCampaign.dragDropAssets.generatedImages);
          setAiImages(lastCampaign.dragDropAssets.generatedImages);
        }
        
        // Update current page with campaign assets if editing
        if (currentPage && lastCampaign.id) {
          setCurrentPage(prev => prev ? {
            ...prev,
            campaignAssets: lastCampaign.dragDropAssets,
            updatedAt: new Date().toISOString()
          } : null);
        }
        
        toast.success(`${t('Campaign assets loaded successfully!')} (${lastCampaign.dragDropAssets?.generatedImages?.length || 0} images)`);
      } else {
        console.log('No campaigns found in localStorage');
        // Load placeholder images if no campaigns exist
        setAiImages([
          {
            id: 'placeholder_1',
            url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
            type: 'hero',
            prompt: 'Placeholder hero image'
          },
          {
            id: 'placeholder_2',
            url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
            type: 'product',
            prompt: 'Placeholder product image'
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to load campaign assets:', error);
      toast.error(t('Failed to load campaign assets'));
    } finally {
      setIsLoadingAssets(false);
    }
  };

  const createNewPage = () => {
    const newPage: LandingPage = {
      id: `page_${Date.now()}`,
      name: 'New Landing Page',
      template: 'blank',
      elements: [],
      settings: {
        backgroundColor: '#ffffff',
        fontFamily: 'Inter',
        primaryColor: '#007bff',
        secondaryColor: '#6c757d'
      },
      isPublished: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setPages(current => [...current, newPage]);
    setCurrentPage(newPage);
    toast.success('New page created!');
  };

  const addElementWithAIImage = (template: typeof elementTemplates[0], imageUrl?: string) => {
    if (!currentPage) return;

    const content = template.type === 'image' && imageUrl ? imageUrl : template.template.content;

    const newElement: PageElement = {
      id: `elem_${Date.now()}`,
      type: template.type,
      content,
      styles: template.template.styles,
      position: {
        x: 50,
        y: 50,
        width: 200,
        height: template.type === 'text' ? 50 : template.type === 'image' ? 150 : 40
      }
    };

    setCurrentPage(prev => prev ? {
      ...prev,
      elements: [...prev.elements, newElement],
      updatedAt: new Date().toISOString()
    } : null);

    setSelectedElement(newElement);
  };

  // Create sample campaign for testing
  const createSampleCampaign = () => {
    const sampleCampaign = {
      id: `sample_${Date.now()}`,
      title: 'Sample Product Campaign',
      productName: 'FitTracker Pro',
      description: 'Revolutionary fitness tracker that helps you achieve your health goals',
      targetAudience: 'Fitness enthusiasts',
      businessType: 'E-commerce',
      price: '$149',
      cta: 'Order Now',
      generatedContent: {
        headline: 'Transform Your Health Journey with FitTracker Pro',
        subheadline: 'The smart fitness tracker that adapts to your lifestyle and motivates you every step of the way',
        heroSection: {
          title: 'Revolutionary FitTracker Pro',
          subtitle: 'Your personal health companion',
          imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
          ctaText: 'Start Your Journey'
        },
        problemSection: {
          title: 'Struggling to Stay Motivated?',
          description: 'Many fitness enthusiasts struggle with consistency, tracking progress, and staying motivated to reach their health goals.',
          painPoints: [
            'Lack of accurate fitness tracking',
            'Difficulty staying motivated',
            'No personalized insights'
          ]
        },
        solutionSection: {
          title: 'FitTracker Pro is Your Solution',
          description: 'Our AI-powered fitness tracker provides personalized insights, motivation, and comprehensive health monitoring.',
          benefits: [
            'AI-powered personalized insights',
            '24/7 health monitoring',
            'Smart motivation system',
            'Advanced sleep tracking',
            'Water-resistant design'
          ]
        },
        featuresSection: {
          title: 'Powerful Features',
          features: [
            { title: 'Heart Rate Monitoring', description: '24/7 continuous heart rate tracking', icon: 'heart' },
            { title: 'Sleep Analysis', description: 'Detailed sleep quality insights', icon: 'moon' },
            { title: 'Fitness Coaching', description: 'AI-powered workout recommendations', icon: 'trophy' }
          ]
        },
        socialProof: {
          testimonials: [
            { name: 'Sarah Johnson', role: 'Marathon Runner', content: 'FitTracker Pro helped me improve my training efficiency by 40%!', rating: 5 },
            { name: 'Mike Chen', role: 'Busy Professional', content: 'Finally a tracker that understands my lifestyle. Love the insights!', rating: 5 }
          ],
          stats: [
            { number: '50,000+', label: 'Happy Users' },
            { number: '99.5%', label: 'Accuracy Rate' }
          ]
        },
        pricingSection: {
          title: 'Special Launch Offer',
          price: '$149',
          originalPrice: '$249',
          ctaText: 'Order Now - Limited Time',
          guarantees: ['30-day money-back guarantee', 'Free worldwide shipping']
        },
        faqSection: {
          title: 'Frequently Asked Questions',
          questions: [
            { question: 'How accurate is the heart rate monitoring?', answer: 'FitTracker Pro uses advanced sensors with 99.5% accuracy rate.' },
            { question: 'Is it waterproof?', answer: 'Yes, it\'s rated IP68 for swimming and showering.' }
          ]
        },
        footer: {
          companyName: 'FitTech Solutions',
          contactInfo: 'support@fittrackerpro.com | 1-800-FIT-TRACK',
          disclaimer: 'Results may vary. This device is not intended for medical diagnosis.'
        }
      },
      marketingAssets: {
        landingPageUrl: 'https://nexusone.ai/sample-landing',
        facebookAds: [
          {
            id: 'ad_1',
            headline: 'Transform Your Health Journey with FitTracker Pro',
            description: 'AI-powered fitness tracking that adapts to your lifestyle',
            imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
            targeting: { interests: ['fitness', 'health'], ageRange: '25-65' }
          }
        ],
        videos: [
          {
            id: 'video_1',
            title: 'FitTracker Pro Introduction',
            description: 'See how FitTracker Pro can transform your fitness journey',
            scriptContent: 'Meet FitTracker Pro - the revolutionary fitness tracker that adapts to YOU...'
          }
        ],
        whatsappFlow: {
          welcomeMessage: 'Hi! 👋 Welcome to FitTracker Pro! Ready to transform your health journey?',
          productPresentation: 'FitTracker Pro uses AI to provide personalized fitness insights. With 24/7 heart rate monitoring and smart coaching, you\'ll achieve your goals faster than ever!',
          objectionHandling: ['I understand the investment concern - think of it as investing in your health and future!'],
          closingMessages: ['Ready to start your transformation? Get your FitTracker Pro today! 💪']
        }
      },
      dragDropAssets: {
        generatedImages: [
          {
            id: 'hero_fitness',
            url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800',
            type: 'hero',
            prompt: 'Fitness tracker hero image'
          },
          {
            id: 'product_showcase',
            url: 'https://images.unsplash.com/photo-1508746829417-e1b5e819d300?w=800',
            type: 'product',
            prompt: 'Product showcase image'
          },
          {
            id: 'lifestyle_bg',
            url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
            type: 'background',
            prompt: 'Fitness lifestyle background'
          }
        ],
        designElements: [
          {
            id: 'main_headline',
            type: 'text',
            content: 'Transform Your Health Journey with FitTracker Pro',
            styles: { fontSize: '36px', fontWeight: 'bold', color: '#1a1a1a', textAlign: 'center' }
          },
          {
            id: 'cta_button',
            type: 'button',
            content: 'Order Now - Limited Time',
            styles: { backgroundColor: '#007bff', color: '#ffffff', padding: '16px 32px', borderRadius: '8px' }
          }
        ]
      },
      status: 'completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to localStorage
    const existingCampaigns = JSON.parse(localStorage.getItem('generated-campaigns') || '[]');
    existingCampaigns.push(sampleCampaign);
    localStorage.setItem('generated-campaigns', JSON.stringify(existingCampaigns));

    toast.success(t('Sample campaign created! You can now test all features.'));
    
    // Reload assets
    loadCampaignAssets();
  };
    if (!currentPage) return;

    setIsLoadingAssets(true);
    try {
      // Generate images based on page content
      const pageDescription = `Landing page for ${currentPage.name}`;
      
      // Mock AI image generation - in real implementation, this would call the API
      const mockImages: AIImageAsset[] = [
        {
          id: 'ai_hero_1',
          url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
          type: 'hero',
          prompt: `Hero image for ${pageDescription}`
        },
        {
          id: 'ai_product_1',
          url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
          type: 'product',
          prompt: `Product showcase for ${pageDescription}`
        },
        {
          id: 'ai_background_1',
          url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800',
          type: 'background',
          prompt: `Background image for ${pageDescription}`
        }
      ];

      setAiImages(prev => [...prev, ...mockImages]);
      toast.success('AI images generated successfully!');
      
    } catch (error) {
      console.error('AI image generation failed:', error);
      toast.error('Failed to generate AI images');
    } finally {
      setIsLoadingAssets(false);
    }
  };

  const updateElement = (elementId: string, updates: Partial<PageElement>) => {
    if (!currentPage) return;

    setCurrentPage(prev => prev ? {
      ...prev,
      elements: prev.elements.map(el => 
        el.id === elementId ? { ...el, ...updates } : el
      ),
      updatedAt: new Date().toISOString()
    } : null);

    if (selectedElement && selectedElement.id === elementId) {
      setSelectedElement(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteElement = (elementId: string) => {
    if (!currentPage) return;

    setCurrentPage(prev => prev ? {
      ...prev,
      elements: prev.elements.filter(el => el.id !== elementId),
      updatedAt: new Date().toISOString()
    } : null);

    if (selectedElement && selectedElement.id === elementId) {
      setSelectedElement(null);
    }
  };

  const duplicateElement = (elementId: string) => {
    if (!currentPage) return;

    const element = currentPage.elements.find(el => el.id === elementId);
    if (!element) return;

    const duplicated: PageElement = {
      ...element,
      id: `elem_${Date.now()}`,
      position: {
        ...element.position,
        x: element.position.x + 20,
        y: element.position.y + 20
      }
    };

    setCurrentPage(prev => prev ? {
      ...prev,
      elements: [...prev.elements, duplicated],
      updatedAt: new Date().toISOString()
    } : null);
  };

  const handleMouseDown = (e: React.MouseEvent, element: PageElement) => {
    if (isPreviewMode) return;

    setSelectedElement(element);
    setIsDragging(true);
    
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !selectedElement || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - canvasRect.left - dragOffset.x;
    const newY = e.clientY - canvasRect.top - dragOffset.y;

    updateElement(selectedElement.id, {
      position: {
        ...selectedElement.position,
        x: Math.max(0, newX),
        y: Math.max(0, newY)
      }
    });
  }, [isDragging, selectedElement, dragOffset, updateElement]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const savePage = () => {
    if (!currentPage) return;

    setPages(current => 
      current.map(page => 
        page.id === currentPage.id ? currentPage : page
      )
    );

    toast.success('Page saved successfully!');
  };

  const publishPage = () => {
    if (!currentPage) return;

    const updatedPage = { ...currentPage, isPublished: true };
    setCurrentPage(updatedPage);
    
    setPages(current => 
      current.map(page => 
        page.id === currentPage.id ? updatedPage : page
      )
    );

    toast.success('Page published successfully!');
  };

  const renderElement = (element: PageElement) => {
    const elementStyle = {
      position: 'absolute' as const,
      left: element.position.x,
      top: element.position.y,
      width: element.position.width,
      height: element.type === 'text' ? 'auto' : element.position.height,
      cursor: isPreviewMode ? 'default' : 'move',
      border: selectedElement?.id === element.id && !isPreviewMode ? '2px solid #007bff' : 'none',
      ...element.styles
    };

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isPreviewMode) {
        setSelectedElement(element);
      }
    };

    switch (element.type) {
      case 'text':
        return (
          <div
            key={element.id}
            style={elementStyle}
            onMouseDown={(e) => handleMouseDown(e, element)}
            onClick={handleClick}
            contentEditable={!isPreviewMode}
            suppressContentEditableWarning
            onBlur={(e) => {
              if (!isPreviewMode) {
                updateElement(element.id, { content: e.target.textContent || '' });
              }
            }}
          >
            {element.content}
          </div>
        );

      case 'image':
        return (
          <img
            key={element.id}
            src={element.content}
            alt="Element"
            style={elementStyle}
            onMouseDown={(e) => handleMouseDown(e, element)}
            onClick={handleClick}
            draggable={false}
          />
        );

      case 'button':
        return (
          <button
            key={element.id}
            style={elementStyle}
            onMouseDown={(e) => handleMouseDown(e, element)}
            onClick={handleClick}
          >
            {element.content}
          </button>
        );

      case 'container':
        return (
          <div
            key={element.id}
            style={elementStyle}
            onMouseDown={(e) => handleMouseDown(e, element)}
            onClick={handleClick}
          >
            {element.children?.map(renderElement)}
          </div>
        );

      default:
        return null;
    }
  };

  const currentDevice = deviceSizes[selectedDevice];

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">Page Editor</h1>
          {currentPage && (
            <Input
              value={currentPage.name}
              onChange={(e) => setCurrentPage(prev => prev ? { ...prev, name: e.target.value } : null)}
              className="w-64"
            />
          )}
          <Button 
            size="sm" 
            variant="outline" 
            onClick={createSampleCampaign}
            className="gap-2"
          >
            <Sparkles className="w-4 h-4" />
            Load Sample Assets
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* Device Selector */}
          <div className="flex items-center border rounded-lg p-1">
            {deviceSizes.map((device, index) => {
              const Icon = device.icon;
              return (
                <Button
                  key={device.name}
                  variant={selectedDevice === index ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedDevice(index)}
                >
                  <Icon className="w-4 h-4" />
                </Button>
              );
            })}
          </div>

          {/* Preview Toggle */}
          <Button
            variant={isPreviewMode ? 'default' : 'outline'}
            size="sm"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>

          {/* Actions */}
          <Button size="sm" onClick={savePage} disabled={!currentPage}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          
          <Button size="sm" onClick={publishPage} disabled={!currentPage}>
            <Play className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {!isPreviewMode && (
          <div className="w-80 border-r bg-muted/30 overflow-y-auto">
            <Tabs defaultValue="elements" className="w-full">
              <TabsList className="grid w-full grid-cols-4 m-2">
                <TabsTrigger value="elements">Elements</TabsTrigger>
                <TabsTrigger value="ai-assets">AI Assets</TabsTrigger>
                <TabsTrigger value="pages">Pages</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="elements" className="p-4 space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">Add Elements</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {elementTemplates.map((template) => {
                      const Icon = template.icon;
                      return (
                        <Button
                          key={template.type}
                          variant="outline"
                          className="h-20 flex-col gap-2"
                          onClick={() => addElementWithAIImage(template)}
                          disabled={!currentPage}
                        >
                          <Icon className="w-6 h-6" />
                          {template.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Element Properties */}
                {selectedElement && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Element Properties</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <Label>Content</Label>
                        {selectedElement.type === 'image' ? (
                          <div className="space-y-2">
                            <Input
                              value={selectedElement.content}
                              onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                              placeholder="Image URL"
                            />
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="w-full gap-2"
                              onClick={() => setShowImageGallery(true)}
                            >
                              <Images className="w-4 h-4" />
                              Choose AI Image
                            </Button>
                          </div>
                        ) : (
                          <Textarea
                            value={selectedElement.content}
                            onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                            rows={3}
                          />
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Width</Label>
                          <Input
                            value={selectedElement.position.width}
                            onChange={(e) => updateElement(selectedElement.id, {
                              position: { ...selectedElement.position, width: parseInt(e.target.value) || 0 }
                            })}
                            type="number"
                          />
                        </div>
                        <div>
                          <Label>Height</Label>
                          <Input
                            value={selectedElement.position.height}
                            onChange={(e) => updateElement(selectedElement.id, {
                              position: { ...selectedElement.position, height: parseInt(e.target.value) || 0 }
                            })}
                            type="number"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Background</Label>
                          <Input
                            type="color"
                            value={selectedElement.styles.backgroundColor || '#ffffff'}
                            onChange={(e) => updateElement(selectedElement.id, {
                              styles: { ...selectedElement.styles, backgroundColor: e.target.value }
                            })}
                          />
                        </div>
                        <div>
                          <Label>Text Color</Label>
                          <Input
                            type="color"
                            value={selectedElement.styles.color || '#000000'}
                            onChange={(e) => updateElement(selectedElement.id, {
                              styles: { ...selectedElement.styles, color: e.target.value }
                            })}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => duplicateElement(selectedElement.id)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteElement(selectedElement.id)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="ai-assets" className="p-4 space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">AI Generated Assets</h3>
                    <Button 
                      size="sm"
                      onClick={generateAIImagesForPage}
                      disabled={isLoadingAssets || !currentPage}
                      className="gap-2"
                    >
                      {isLoadingAssets ? (
                        <Brain className="w-4 h-4 animate-pulse" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                      Generate
                    </Button>
                  </div>

                  {aiImages.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {aiImages.map((image) => (
                        <div key={image.id} className="space-y-2">
                          <div 
                            className="aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary"
                            onClick={() => addElementWithAIImage(elementTemplates[1], image.url)}
                          >
                            <img 
                              src={image.url} 
                              alt={image.type}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="space-y-1">
                            <Badge variant="outline" className="text-xs">
                              {image.type}
                            </Badge>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {image.prompt}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Images className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-sm">No AI assets available</p>
                      <p className="text-xs">Generate a campaign first or create new assets</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="pages" className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Your Pages</h3>
                  <Button size="sm" onClick={createNewPage}>
                    <Plus className="w-4 h-4 mr-2" />
                    New
                  </Button>
                </div>

                <div className="space-y-2">
                  {pages.map((page) => (
                    <Card
                      key={page.id}
                      className={`cursor-pointer transition-colors ${
                        currentPage?.id === page.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{page.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {page.elements.length} elements
                            </p>
                          </div>
                          <Badge variant={page.isPublished ? 'default' : 'secondary'}>
                            {page.isPublished ? 'Published' : 'Draft'}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="settings" className="p-4 space-y-4">
                {currentPage && (
                  <div className="space-y-4">
                    <h3 className="font-semibold">Page Settings</h3>
                    
                    <div>
                      <Label>Background Color</Label>
                      <Input
                        type="color"
                        value={currentPage.settings.backgroundColor}
                        onChange={(e) => setCurrentPage(prev => prev ? {
                          ...prev,
                          settings: { ...prev.settings, backgroundColor: e.target.value }
                        } : null)}
                      />
                    </div>

                    <div>
                      <Label>Primary Color</Label>
                      <Input
                        type="color"
                        value={currentPage.settings.primaryColor}
                        onChange={(e) => setCurrentPage(prev => prev ? {
                          ...prev,
                          settings: { ...prev.settings, primaryColor: e.target.value }
                        } : null)}
                      />
                    </div>

                    <div>
                      <Label>Font Family</Label>
                      <Select
                        value={currentPage.settings.fontFamily}
                        onValueChange={(value) => setCurrentPage(prev => prev ? {
                          ...prev,
                          settings: { ...prev.settings, fontFamily: value }
                        } : null)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inter">Inter</SelectItem>
                          <SelectItem value="Arial">Arial</SelectItem>
                          <SelectItem value="Georgia">Georgia</SelectItem>
                          <SelectItem value="Roboto">Roboto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Canvas */}
        <div className="flex-1 flex items-center justify-center bg-gray-100 p-8">
          <div className="relative">
            {/* Device Frame */}
            <div
              className="bg-white shadow-2xl rounded-lg overflow-hidden relative"
              style={{
                width: currentDevice.width,
                height: currentDevice.height,
                transform: `scale(${Math.min(1, (window.innerHeight - 200) / currentDevice.height, (window.innerWidth - 400) / currentDevice.width)})`
              }}
            >
              {/* Canvas */}
              <div
                ref={canvasRef}
                className="relative w-full h-full overflow-hidden"
                style={{
                  backgroundColor: currentPage?.settings.backgroundColor || '#ffffff',
                  fontFamily: currentPage?.settings.fontFamily || 'Inter'
                }}
                onClick={() => !isPreviewMode && setSelectedElement(null)}
              >
                {currentPage?.elements.map(renderElement)}
                
                {/* Empty State */}
                {currentPage && currentPage.elements.length === 0 && !isPreviewMode && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Layout className="w-12 h-12 mx-auto mb-4" />
                      <p>Drag elements here to start building</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Device Label */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <Badge variant="outline">
                {currentDevice.name} ({currentDevice.width} × {currentDevice.height})
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* AI Image Gallery Dialog */}
      <Dialog open={showImageGallery} onOpenChange={setShowImageGallery}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              AI Generated Images
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {aiImages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {aiImages.map((image) => (
                  <Card 
                    key={image.id}
                    className="cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                    onClick={() => {
                      if (selectedElement && selectedElement.type === 'image') {
                        updateElement(selectedElement.id, { content: image.url });
                        setShowImageGallery(false);
                        toast.success('Image applied to element!');
                      } else {
                        addElementWithAIImage(elementTemplates[1], image.url);
                        setShowImageGallery(false);
                        toast.success('Image element created!');
                      }
                    }}
                  >
                    <CardContent className="p-2">
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-2">
                        <img 
                          src={image.url} 
                          alt={image.type}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <Badge variant="outline" className="text-xs">
                          {image.type}
                        </Badge>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {image.prompt}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Images className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No AI Images Available</h3>
                <p className="text-muted-foreground mb-4">
                  Generate a marketing campaign first to access AI-generated images
                </p>
                <Button onClick={generateAIImagesForPage} disabled={isLoadingAssets}>
                  {isLoadingAssets ? (
                    <Brain className="w-4 h-4 animate-pulse mr-2" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  Generate AI Images
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}