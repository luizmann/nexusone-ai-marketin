/**
 * Enhanced Magic Pages with Public Repository Integration
 * Example of how to enhance existing NexusOne features with public APIs
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { freePublicAPIs } from '../services/freePublicAPIs';
import { emailTemplates, socialMediaGenerator } from '../services/openSourceMarketingTools';
import { Sparkles, Eye, Download, Share } from '@phosphor-icons/react';

interface EnhancedPageData {
  title: string;
  subtitle: string;
  heroImage: string;
  content: string;
  ctaText: string;
  ctaUrl: string;
  inspirationalQuote?: any;
  testimonials: string[];
  socialProof: string[];
}

export function EnhancedMagicPages() {
  const [pageData, setPageData] = useState<EnhancedPageData>({
    title: '',
    subtitle: '',
    heroImage: '',
    content: '',
    ctaText: 'Get Started',
    ctaUrl: '#',
    testimonials: [],
    socialProof: []
  });

  const [loading, setLoading] = useState(false);
  const [generatedAssets, setGeneratedAssets] = useState<any>({});
  const [topic, setTopic] = useState('');

  // Enhanced page generation with public APIs
  const generateEnhancedPage = async () => {
    if (!topic) return;
    
    setLoading(true);
    try {
      // Get inspiration content
      const [quote, heroImage, stockImages] = await Promise.allSettled([
        freePublicAPIs.getInspirationalQuote(),
        freePublicAPIs.getRandomImageWithCategory(topic, 1200, 600),
        freePublicAPIs.getFreeStockImages(topic)
      ]);

      // Generate social media content for the page
      const socialContent = socialMediaGenerator.generateInstagramPost({
        topic,
        mood: 'motivational',
        includeHashtags: true,
        targetAudience: 'entrepreneurs'
      });

      // Generate email template for follow-up
      const followUpEmail = emailTemplates.generateEmail('welcome', {
        company: 'Your Business',
        firstName: '{{firstName}}',
        ctaUrl: pageData.ctaUrl || '#',
        address: 'Your Business Address'
      });

      // Generate QR code for easy sharing
      const qrCode = await freePublicAPIs.generateQRCode(
        `Landing Page: ${topic} - ${window.location.href}`
      );

      const assets = {
        quote: quote.status === 'fulfilled' ? quote.value : null,
        heroImage: heroImage.status === 'fulfilled' ? heroImage.value : null,
        stockImages: stockImages.status === 'fulfilled' ? stockImages.value.images : [],
        socialContent,
        followUpEmail,
        qrCode
      };

      setGeneratedAssets(assets);

      // Auto-populate page data
      setPageData(prev => ({
        ...prev,
        title: `Transform Your ${topic.charAt(0).toUpperCase() + topic.slice(1)} Journey`,
        subtitle: assets.quote ? assets.quote.content : `Discover the power of ${topic}`,
        heroImage: assets.heroImage || '',
        content: generatePageContent(topic, assets.quote),
        inspirationalQuote: assets.quote,
        testimonials: generateTestimonials(topic),
        socialProof: generateSocialProof()
      }));

    } catch (error) {
      console.error('Error generating enhanced page:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePageContent = (topic: string, quote: any) => {
    return `
# Welcome to Your ${topic.charAt(0).toUpperCase() + topic.slice(1)} Transformation

${quote ? `> "${quote.content}" - ${quote.author}` : ''}

Are you ready to revolutionize your approach to ${topic}? You've come to the right place.

## Why Choose Us?

✅ **Expert Guidance**: Learn from industry professionals
✅ **Proven Results**: Join thousands of successful clients
✅ **24/7 Support**: We're here when you need us
✅ **Money-Back Guarantee**: Risk-free transformation

## What You'll Get

- Comprehensive ${topic} strategy
- Step-by-step implementation guide
- Access to exclusive tools and resources
- Direct support from our expert team

## Success Stories

Our clients have achieved incredible results with our ${topic} solutions. 
From small businesses to enterprise companies, we've helped transform 
operations and drive meaningful growth.

Ready to get started? Click the button below to begin your transformation today!
    `.trim();
  };

  const generateTestimonials = (topic: string) => [
    `"This ${topic} solution completely transformed our business. We saw results within the first week!"`,
    `"I've tried many ${topic} approaches, but this one actually works. Highly recommended!"`,
    `"The team's expertise in ${topic} is unmatched. They guided us every step of the way."`
  ];

  const generateSocialProof = () => [
    "Trusted by 10,000+ businesses",
    "Featured in TechCrunch, Forbes, and Entrepreneur",
    "99% customer satisfaction rate",
    "24/7 award-winning support"
  ];

  const downloadAssets = () => {
    const assetsData = {
      pageData,
      generatedAssets,
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(assetsData, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${topic}-landing-page-assets.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Enhanced Magic Pages</h2>
          <p className="text-muted-foreground">
            Create stunning landing pages with public API enhancements
          </p>
        </div>
        {Object.keys(generatedAssets).length > 0 && (
          <Button onClick={downloadAssets} variant="outline">
            <Download size={16} className="mr-2" />
            Download Assets
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles size={20} />
                AI-Enhanced Page Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Enter your topic (e.g., fitness, marketing, technology)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
              
              <Button 
                onClick={generateEnhancedPage} 
                disabled={loading || !topic}
                className="w-full"
              >
                {loading ? 'Generating Enhanced Page...' : 'Generate with Public APIs'}
              </Button>

              {loading && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">
                    Fetching inspiration, images, and content...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Generated Assets Panel */}
          {Object.keys(generatedAssets).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Assets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="social" className="w-full">
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="social">Social</TabsTrigger>
                    <TabsTrigger value="email">Email</TabsTrigger>
                    <TabsTrigger value="tools">Tools</TabsTrigger>
                  </TabsList>

                  <TabsContent value="social" className="space-y-3">
                    {generatedAssets.socialContent && (
                      <div>
                        <label className="text-sm font-medium">Instagram Caption:</label>
                        <Textarea 
                          value={generatedAssets.socialContent.caption} 
                          readOnly 
                          rows={3}
                          className="mt-1"
                        />
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="email" className="space-y-3">
                    {generatedAssets.followUpEmail && (
                      <div>
                        <label className="text-sm font-medium">Follow-up Email Subject:</label>
                        <Input 
                          value={generatedAssets.followUpEmail.subject} 
                          readOnly 
                          className="mt-1"
                        />
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="tools" className="space-y-3">
                    {generatedAssets.qrCode && (
                      <div className="text-center">
                        <label className="text-sm font-medium">QR Code for Sharing:</label>
                        <div className="mt-2">
                          <img 
                            src={generatedAssets.qrCode} 
                            alt="Page QR Code" 
                            className="w-32 h-32 mx-auto border rounded"
                          />
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Preview Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye size={20} />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg bg-white min-h-[500px] p-6">
                {pageData.heroImage && (
                  <img 
                    src={pageData.heroImage} 
                    alt="Hero" 
                    className="w-full h-40 object-cover rounded-lg mb-6"
                  />
                )}
                
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {pageData.title || 'Your Page Title'}
                  </h1>
                  
                  <p className="text-xl text-gray-600">
                    {pageData.subtitle || 'Your compelling subtitle goes here'}
                  </p>

                  {pageData.inspirationalQuote && (
                    <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 my-6">
                      "{pageData.inspirationalQuote.content}"
                      <footer className="text-sm text-gray-500 mt-1">
                        — {pageData.inspirationalQuote.author}
                      </footer>
                    </blockquote>
                  )}

                  <div className="prose max-w-none">
                    {pageData.content.split('\n').map((line, index) => {
                      if (line.startsWith('# ')) {
                        return <h2 key={index} className="text-2xl font-bold text-gray-900 mb-3">{line.slice(2)}</h2>
                      }
                      if (line.startsWith('## ')) {
                        return <h3 key={index} className="text-xl font-semibold text-gray-800 mb-2">{line.slice(3)}</h3>
                      }
                      if (line.startsWith('> ')) {
                        return <blockquote key={index} className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-2">{line.slice(2)}</blockquote>
                      }
                      if (line.startsWith('✅')) {
                        return <div key={index} className="flex items-center gap-2 text-green-700 my-1">{line}</div>
                      }
                      if (line.trim()) {
                        return <p key={index} className="text-gray-700 mb-2">{line}</p>
                      }
                      return <br key={index} />
                    })}
                  </div>

                  {pageData.socialProof.length > 0 && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <div className="flex flex-wrap gap-2">
                        {pageData.socialProof.map((proof, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {proof}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-8 text-center">
                    <Button size="lg" className="px-8">
                      {pageData.ctaText}
                    </Button>
                  </div>

                  {pageData.testimonials.length > 0 && (
                    <div className="mt-8 space-y-3">
                      <h4 className="font-semibold text-gray-900">What Our Clients Say:</h4>
                      {pageData.testimonials.map((testimonial, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded italic text-sm text-gray-700">
                          {testimonial}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}