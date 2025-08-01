import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Download, Mail, Share, Sparkles, Code } from '@phosphor-icons/react';
import { freePublicAPIs } from '../services/freePublicAPIs';
import { emailTemplates, socialMediaGenerator } from '../services/openSourceMarketingTools';
import { useLanguage } from '../contexts/CleanLanguageContext';

export function PublicAPIShowcase() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>({});
  
  // Form states
  const [emailData, setEmailData] = useState({
    templateType: 'welcome',
    company: 'Your Company',
    firstName: 'John',
    ctaUrl: 'https://your-site.com'
  });
  
  const [socialData, setSocialData] = useState({
    topic: 'digital marketing',
    platform: 'instagram',
    audience: 'entrepreneurs',
    mood: 'motivational'
  });
  
  const [contentQuery, setContentQuery] = useState('business motivation');

  // Generate email template
  const generateEmailTemplate = () => {
    try {
      const email = emailTemplates.generateEmail(emailData.templateType, {
        company: emailData.company,
        firstName: emailData.firstName,
        ctaUrl: emailData.ctaUrl,
        address: '123 Business Street, Success City'
      });
      
      setResults(prev => ({ ...prev, email }));
    } catch (error) {
      console.error('Email generation error:', error);
    }
  };

  // Generate social media content
  const generateSocialContent = async () => {
    setLoading(true);
    try {
      let content;
      
      switch (socialData.platform) {
        case 'instagram':
          content = socialMediaGenerator.generateInstagramPost({
            topic: socialData.topic,
            mood: socialData.mood as any,
            includeHashtags: true,
            targetAudience: socialData.audience
          });
          break;
        case 'facebook':
          content = socialMediaGenerator.generateFacebookPost({
            topic: socialData.topic,
            postType: 'tips',
            includeEmojis: true,
            targetAudience: socialData.audience
          });
          break;
        case 'twitter':
          content = socialMediaGenerator.generateTwitterThread({
            topic: socialData.topic,
            threadLength: 5,
            targetAudience: socialData.audience
          });
          break;
        case 'linkedin':
          content = socialMediaGenerator.generateLinkedInPost({
            topic: socialData.topic,
            postStyle: 'professional',
            targetAudience: socialData.audience
          });
          break;
      }
      
      setResults(prev => ({ ...prev, social: content }));
    } catch (error) {
      console.error('Social content generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get inspiration content
  const getInspirationContent = async () => {
    setLoading(true);
    try {
      const [quote, catFact, joke, image] = await Promise.allSettled([
        freePublicAPIs.getInspirationalQuote(),
        freePublicAPIs.getCatFact(),
        freePublicAPIs.getRandomJoke(),
        freePublicAPIs.getRandomImageWithCategory(contentQuery)
      ]);

      const inspiration = {
        quote: quote.status === 'fulfilled' ? quote.value : null,
        catFact: catFact.status === 'fulfilled' ? catFact.value : null,
        joke: joke.status === 'fulfilled' ? joke.value : null,
        image: image.status === 'fulfilled' ? image.value : null
      };

      setResults(prev => ({ ...prev, inspiration }));
    } catch (error) {
      console.error('Inspiration content error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate campaign assets
  const generateCampaignAssets = async () => {
    setLoading(true);
    try {
      const assets = await freePublicAPIs.generateCampaignAssets(contentQuery);
      const qrCode = await freePublicAPIs.generateQRCode(`Campaign: ${contentQuery}`);
      
      setResults(prev => ({ 
        ...prev, 
        campaign: { ...assets, qrCode }
      }));
    } catch (error) {
      console.error('Campaign assets error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Public API Showcase</h2>
          <p className="text-muted-foreground">
            Practical examples of using public repositories and APIs
          </p>
        </div>
      </div>

      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail size={16} />
            Email Templates
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Share size={16} />
            Social Media
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Sparkles size={16} />
            Content APIs
          </TabsTrigger>
          <TabsTrigger value="campaign" className="flex items-center gap-2">
            <Code size={16} />
            Campaign Assets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Template Generator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={emailData.templateType} onValueChange={(value) => 
                  setEmailData(prev => ({ ...prev, templateType: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select template type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="welcome">Welcome Email</SelectItem>
                    <SelectItem value="promotional">Promotional Email</SelectItem>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Company Name"
                  value={emailData.company}
                  onChange={(e) => setEmailData(prev => ({ ...prev, company: e.target.value }))}
                />

                <Input
                  placeholder="First Name"
                  value={emailData.firstName}
                  onChange={(e) => setEmailData(prev => ({ ...prev, firstName: e.target.value }))}
                />

                <Input
                  placeholder="CTA URL"
                  value={emailData.ctaUrl}
                  onChange={(e) => setEmailData(prev => ({ ...prev, ctaUrl: e.target.value }))}
                />

                <Button onClick={generateEmailTemplate} className="w-full">
                  Generate Email Template
                </Button>
              </CardContent>
            </Card>

            {results.email && (
              <Card>
                <CardHeader>
                  <CardTitle>Generated Email</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Subject:</label>
                    <p className="text-sm bg-muted p-2 rounded">{results.email.subject}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">HTML Preview:</label>
                    <div className="border rounded-lg p-4 max-h-40 overflow-auto">
                      <div dangerouslySetInnerHTML={{ __html: results.email.html }} />
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => navigator.clipboard.writeText(results.email.html)}
                    className="w-full"
                  >
                    <Download size={16} className="mr-2" />
                    Copy HTML
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Generator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Topic (e.g., digital marketing)"
                  value={socialData.topic}
                  onChange={(e) => setSocialData(prev => ({ ...prev, topic: e.target.value }))}
                />

                <Select value={socialData.platform} onValueChange={(value) => 
                  setSocialData(prev => ({ ...prev, platform: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Target Audience"
                  value={socialData.audience}
                  onChange={(e) => setSocialData(prev => ({ ...prev, audience: e.target.value }))}
                />

                <Select value={socialData.mood} onValueChange={(value) => 
                  setSocialData(prev => ({ ...prev, mood: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mood" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="motivational">Motivational</SelectItem>
                    <SelectItem value="educational">Educational</SelectItem>
                    <SelectItem value="promotional">Promotional</SelectItem>
                    <SelectItem value="fun">Fun</SelectItem>
                  </SelectContent>
                </Select>

                <Button onClick={generateSocialContent} disabled={loading} className="w-full">
                  {loading ? 'Generating...' : 'Generate Social Content'}
                </Button>
              </CardContent>
            </Card>

            {results.social && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share size={20} />
                    {socialData.platform.charAt(0).toUpperCase() + socialData.platform.slice(1)} Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {results.social.caption && (
                    <div>
                      <label className="text-sm font-medium">Caption:</label>
                      <Textarea 
                        value={results.social.caption} 
                        readOnly 
                        className="mt-1"
                        rows={4}
                      />
                    </div>
                  )}

                  {results.social.content && (
                    <div>
                      <label className="text-sm font-medium">Content:</label>
                      <Textarea 
                        value={results.social.content} 
                        readOnly 
                        className="mt-1"
                        rows={4}
                      />
                    </div>
                  )}

                  {results.social.thread && (
                    <div>
                      <label className="text-sm font-medium">Thread ({results.social.totalTweets} tweets):</label>
                      <div className="space-y-2 mt-1">
                        {results.social.thread.map((tweet: string, index: number) => (
                          <div key={index} className="text-sm bg-muted p-2 rounded">
                            {index + 1}. {tweet}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.social.engagementTips && (
                    <div>
                      <label className="text-sm font-medium">Engagement Tips:</label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {results.social.engagementTips.map((tip: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tip}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => navigator.clipboard.writeText(
                      results.social.caption || results.social.content || 
                      results.social.thread?.join('\n\n') || ''
                    )}
                    className="w-full"
                  >
                    Copy Content
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Free Content APIs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search query (e.g., business motivation)"
                  value={contentQuery}
                  onChange={(e) => setContentQuery(e.target.value)}
                />
                <Button onClick={getInspirationContent} disabled={loading}>
                  {loading ? 'Loading...' : 'Get Content'}
                </Button>
              </div>

              {results.inspiration && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.inspiration.quote && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Inspirational Quote</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <blockquote className="text-sm italic border-l-4 border-primary pl-4">
                          "{results.inspiration.quote.content}"
                        </blockquote>
                        <p className="text-xs text-muted-foreground mt-2">
                          — {results.inspiration.quote.author}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {results.inspiration.joke && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Programming Joke</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{results.inspiration.joke.setup}</p>
                        <p className="text-sm font-medium mt-2">{results.inspiration.joke.punchline}</p>
                      </CardContent>
                    </Card>
                  )}

                  {results.inspiration.catFact && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Fun Fact</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{results.inspiration.catFact.fact}</p>
                      </CardContent>
                    </Card>
                  )}

                  {results.inspiration.image && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Random Image</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <img 
                          src={results.inspiration.image} 
                          alt="Generated content" 
                          className="w-full h-32 object-cover rounded"
                        />
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaign" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Asset Generator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Campaign theme (e.g., fitness, technology)"
                  value={contentQuery}
                  onChange={(e) => setContentQuery(e.target.value)}
                />
                <Button onClick={generateCampaignAssets} disabled={loading}>
                  {loading ? 'Generating...' : 'Generate Assets'}
                </Button>
              </div>

              {results.campaign && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.campaign.qrCode && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">QR Code</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <img 
                          src={results.campaign.qrCode} 
                          alt="Campaign QR Code" 
                          className="w-32 h-32 mx-auto"
                        />
                        <p className="text-xs text-center text-muted-foreground mt-2">
                          Campaign: {contentQuery}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {results.campaign.inspirationalQuote && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Campaign Quote</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <blockquote className="text-sm italic">
                          "{results.campaign.inspirationalQuote.results?.[0]?.content}"
                        </blockquote>
                      </CardContent>
                    </Card>
                  )}

                  {results.campaign.heroImage && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Hero Image</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <img 
                          src={results.campaign.heroImage} 
                          alt="Campaign hero" 
                          className="w-full h-32 object-cover rounded"
                        />
                      </CardContent>
                    </Card>
                  )}

                  {results.campaign.engagementContent && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Engagement Content</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{results.campaign.engagementContent.setup}</p>
                        <p className="text-sm font-medium mt-1">{results.campaign.engagementContent.punchline}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800">Integration Guide</h4>
              <p className="text-sm text-amber-700 mt-1">
                These examples demonstrate how to integrate public repositories and free APIs into your NexusOne AI workflows. 
                All generated content can be used in your Magic Pages, Smart Campaigns, and other automation features.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}