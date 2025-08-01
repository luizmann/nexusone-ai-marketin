/**
 * Copy-Paste Integration Examples
 * Demonstrates various copy-paste scenarios for Magic Pages
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertContent, AlertDescription } from '@/components/ui/alert';
import { 
  Copy, 
  ExternalLink, 
  Sparkles, 
  ShoppingCart, 
  Video, 
  Image as ImageIcon,
  MessageCircle,
  Mail,
  Phone,
  Quote,
  Lightbulb
} from '@phosphor-icons/react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/CleanLanguageContext';

interface CopyPasteExample {
  id: string;
  title: string;
  description: string;
  category: 'product' | 'social' | 'content' | 'media' | 'contact';
  icon: React.ComponentType<{ size?: number }>;
  content: string;
  expectedOutput: {
    type: string;
    title: string;
    description: string;
    metadata: Record<string, any>;
  };
}

export function CopyPasteExamples() {
  const { t } = useLanguage();
  const [copiedExample, setCopiedExample] = useState<string | null>(null);

  const examples: CopyPasteExample[] = [
    {
      id: 'amazon-product',
      title: 'Amazon Product URL',
      description: 'Copy a product URL from Amazon to auto-extract product details',
      category: 'product',
      icon: ShoppingCart,
      content: 'https://amazon.com/dp/B08N5WRWNW',
      expectedOutput: {
        type: 'product',
        title: 'Premium Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        metadata: {
          price: '$199.99',
          brand: 'AudioTech',
          rating: '4.5/5',
          image: 'Auto-extracted product image'
        }
      }
    },
    {
      id: 'shopify-product',
      title: 'Shopify Store Product',
      description: 'Extract product information from any Shopify store',
      category: 'product',
      icon: ShoppingCart,
      content: 'https://mystore.shopify.com/products/amazing-coffee-blend',
      expectedOutput: {
        type: 'product',
        title: 'Artisan Coffee Blend',
        description: 'Premium single-origin coffee beans roasted to perfection',
        metadata: {
          price: '$24.99',
          brand: 'Mountain Roasters',
          image: 'Product image URL'
        }
      }
    },
    {
      id: 'youtube-video',
      title: 'YouTube Video Link',
      description: 'Extract video metadata and thumbnail from YouTube',
      category: 'media',
      icon: Video,
      content: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
      expectedOutput: {
        type: 'video',
        title: 'How to Create Landing Pages',
        description: 'Learn the secrets of creating high-converting landing pages',
        metadata: {
          platform: 'YouTube',
          duration: '12:34',
          thumbnail: 'Video thumbnail URL'
        }
      }
    },
    {
      id: 'instagram-post',
      title: 'Instagram Post',
      description: 'Extract content from Instagram post URLs',
      category: 'social',
      icon: MessageCircle,
      content: 'https://instagram.com/p/CXyz123/',
      expectedOutput: {
        type: 'social',
        title: 'Amazing sunset photo',
        description: 'Check out this incredible sunset I captured!',
        metadata: {
          author: '@photographer_jane',
          platform: 'Instagram',
          hashtags: ['#sunset', '#photography']
        }
      }
    },
    {
      id: 'image-url',
      title: 'Direct Image URL',
      description: 'Add images directly from URLs',
      category: 'media',
      icon: ImageIcon,
      content: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      expectedOutput: {
        type: 'image',
        title: 'Beautiful landscape image',
        description: 'High-quality image for your landing page',
        metadata: {
          source: 'Unsplash',
          dimensions: '800x600'
        }
      }
    },
    {
      id: 'testimonial-text',
      title: 'Customer Testimonial',
      description: 'Paste customer testimonials and reviews',
      category: 'content',
      icon: Quote,
      content: '"This product completely transformed our business! We saw a 300% increase in sales within the first month. I highly recommend it to anyone looking to grow their business."',
      expectedOutput: {
        type: 'testimonial',
        title: 'Customer Review',
        description: 'Positive testimonial about business transformation',
        metadata: {
          sentiment: 'positive',
          topics: ['business growth', 'sales increase']
        }
      }
    },
    {
      id: 'contact-info',
      title: 'Contact Information',
      description: 'Extract emails and phone numbers from text',
      category: 'contact',
      icon: Mail,
      content: 'Contact us at support@example.com or call +1 (555) 123-4567 for more information about our services.',
      expectedOutput: {
        type: 'contact',
        title: 'Contact Information',
        description: 'Extracted contact details',
        metadata: {
          emails: ['support@example.com'],
          phones: ['+1 (555) 123-4567']
        }
      }
    },
    {
      id: 'social-media-post',
      title: 'Social Media Content',
      description: 'Content with hashtags and mentions',
      category: 'social',
      icon: MessageCircle,
      content: 'Just launched our new product! 🚀 Excited to share this with the world. Thanks to @team for all the hard work! #startup #innovation #tech #launch',
      expectedOutput: {
        type: 'social',
        title: 'Product Launch Post',
        description: 'Social media announcement with engagement elements',
        metadata: {
          hashtags: ['#startup', '#innovation', '#tech', '#launch'],
          mentions: ['@team'],
          hasEmoji: true
        }
      }
    },
    {
      id: 'article-excerpt',
      title: 'Article or Blog Content',
      description: 'Long-form content with title and body',
      category: 'content',
      icon: Quote,
      content: 'The Future of AI in Marketing\n\nArtificial Intelligence is revolutionizing the way businesses approach marketing. From personalized content creation to predictive analytics, AI tools are enabling marketers to achieve unprecedented levels of efficiency and effectiveness.',
      expectedOutput: {
        type: 'text',
        title: 'The Future of AI in Marketing',
        description: 'Article about AI revolutionizing marketing approaches',
        metadata: {
          wordCount: 32,
          topics: ['AI', 'marketing', 'business']
        }
      }
    }
  ];

  const copyToClipboard = (content: string, exampleId: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopiedExample(exampleId);
      toast.success(t('Example copied to clipboard!'));
      setTimeout(() => setCopiedExample(null), 2000);
    }).catch(() => {
      toast.error(t('Failed to copy to clipboard'));
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'product': return ShoppingCart;
      case 'social': return MessageCircle;
      case 'content': return Quote;
      case 'media': return ImageIcon;
      case 'contact': return Mail;
      default: return Lightbulb;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'product': return 'bg-green-100 text-green-800';
      case 'social': return 'bg-blue-100 text-blue-800';
      case 'content': return 'bg-purple-100 text-purple-800';
      case 'media': return 'bg-orange-100 text-orange-800';
      case 'contact': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const groupedExamples = examples.reduce((groups, example) => {
    const category = example.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(example);
    return groups;
  }, {} as Record<string, CopyPasteExample[]>);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">
          {t('Copy-Paste Integration Examples')}
        </h2>
        <p className="text-muted-foreground">
          {t('Try these examples in the Enhanced Magic Pages to see dynamic content extraction in action')}
        </p>
      </div>

      <Alert>
        <Sparkles size={16} />
        <AlertContent>
          <AlertDescription>
            {t('Copy any example below and paste it into the Enhanced Magic Pages copy-paste field to see automatic content extraction and enhancement.')}
          </AlertDescription>
        </AlertContent>
      </Alert>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="all">{t('All')}</TabsTrigger>
          <TabsTrigger value="product">{t('Products')}</TabsTrigger>
          <TabsTrigger value="social">{t('Social')}</TabsTrigger>
          <TabsTrigger value="content">{t('Content')}</TabsTrigger>
          <TabsTrigger value="media">{t('Media')}</TabsTrigger>
          <TabsTrigger value="contact">{t('Contact')}</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {examples.map((example) => (
              <ExampleCard
                key={example.id}
                example={example}
                copiedExample={copiedExample}
                onCopy={copyToClipboard}
                getCategoryColor={getCategoryColor}
                t={t}
              />
            ))}
          </div>
        </TabsContent>

        {Object.entries(groupedExamples).map(([category, categoryExamples]) => (
          <TabsContent key={category} value={category}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryExamples.map((example) => (
                <ExampleCard
                  key={example.id}
                  example={example}
                  copiedExample={copiedExample}
                  onCopy={copyToClipboard}
                  getCategoryColor={getCategoryColor}
                  t={t}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb size={20} />
            {t('Pro Tips')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">{t('Supported Content Types:')}</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• {t('E-commerce product URLs (Amazon, Shopify, etc.)')}</li>
                <li>• {t('Social media posts (Instagram, Facebook, Twitter)')}</li>
                <li>• {t('Video links (YouTube, Vimeo)')}</li>
                <li>• {t('Image URLs from any source')}</li>
                <li>• {t('Text content with automatic formatting')}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">{t('Automatic Enhancements:')}</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• {t('Price and product information extraction')}</li>
                <li>• {t('Image and thumbnail generation')}</li>
                <li>• {t('Social proof and testimonial formatting')}</li>
                <li>• {t('Contact information parsing')}</li>
                <li>• {t('SEO-optimized content structure')}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ExampleCardProps {
  example: CopyPasteExample;
  copiedExample: string | null;
  onCopy: (content: string, id: string) => void;
  getCategoryColor: (category: string) => string;
  t: (key: string) => string;
}

function ExampleCard({ example, copiedExample, onCopy, getCategoryColor, t }: ExampleCardProps) {
  const IconComponent = example.icon;
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <IconComponent size={20} />
            <div>
              <CardTitle className="text-sm font-medium">{example.title}</CardTitle>
              <Badge variant="secondary" className={`text-xs mt-1 ${getCategoryColor(example.category)}`}>
                {example.category}
              </Badge>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{example.description}</p>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="bg-muted p-3 rounded-lg">
          <p className="text-xs font-mono break-all">
            {example.content.length > 100 
              ? `${example.content.slice(0, 100)}...` 
              : example.content
            }
          </p>
        </div>
        
        <div className="text-xs space-y-2">
          <div className="font-medium">{t('Expected Output:')}</div>
          <div className="space-y-1 text-muted-foreground">
            <div><strong>{t('Type')}:</strong> {example.expectedOutput.type}</div>
            <div><strong>{t('Title')}:</strong> {example.expectedOutput.title}</div>
            {example.expectedOutput.metadata.price && (
              <div><strong>{t('Price')}:</strong> {example.expectedOutput.metadata.price}</div>
            )}
          </div>
        </div>
        
        <Button
          onClick={() => onCopy(example.content, example.id)}
          variant="outline"
          size="sm"
          className="w-full"
          disabled={copiedExample === example.id}
        >
          {copiedExample === example.id ? (
            <>
              <Sparkles size={14} className="mr-2" />
              {t('Copied!')}
            </>
          ) : (
            <>
              <Copy size={14} className="mr-2" />
              {t('Copy Example')}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}