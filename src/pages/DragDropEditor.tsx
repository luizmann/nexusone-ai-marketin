import React, { useState, useCallback, useRef } from 'react';
import { useKV } from '@github/spark/hooks';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Triangle
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { useLanguage } from '../contexts/LanguageContext';

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
  const canvasRef = useRef<HTMLDivElement>(null);

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

  const addElement = (template: typeof elementTemplates[0]) => {
    if (!currentPage) return;

    const newElement: PageElement = {
      id: `elem_${Date.now()}`,
      type: template.type,
      content: template.template.content,
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
              <TabsList className="grid w-full grid-cols-3 m-2">
                <TabsTrigger value="elements">Elements</TabsTrigger>
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
                          onClick={() => addElement(template)}
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
                          <Input
                            value={selectedElement.content}
                            onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                            placeholder="Image URL"
                          />
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
    </div>
  );
}