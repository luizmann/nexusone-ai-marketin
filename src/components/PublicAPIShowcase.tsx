import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  AlertCircle, 
  Download, 
  Mail, 
  Share, 
  Sparkles, 
  Code, 
  ExternalLink,
  Copy,
  Check,
  Play,
  Database,
  CloudLightning,
  Globe,
  Heart,
  Lightbulb
} from '@phosphor-icons/react';
import { freePublicAPIs } from '../services/freePublicAPIs';
import { emailTemplates, socialMediaGenerator } from '../services/openSourceMarketingTools';
import { useLanguage } from '../contexts/CleanLanguageContext';

// Comprehensive list of 15+ free APIs for marketing and content creation
const FREE_APIS = [
  {
    name: "JSONPlaceholder",
    category: "Testing",
    description: "Free fake API for testing and prototyping",
    url: "https://jsonplaceholder.typicode.com",
    endpoint: "/posts",
    method: "GET",
    features: ["No API key required", "RESTful endpoints", "JSON responses"],
    useCase: "Perfect for testing API integrations before connecting real data sources",
    icon: Database,
    color: "bg-blue-500"
  },
  {
    name: "Lorem Picsum",
    category: "Images",
    description: "Lorem Ipsum for photos - random placeholder images",
    url: "https://picsum.photos",
    endpoint: "/200/300",
    method: "GET",
    features: ["Random images", "Custom dimensions", "Grayscale/blur filters"],
    useCase: "Generate placeholder images for landing pages and campaigns",
    icon: Globe,
    color: "bg-green-500"
  },
  {
    name: "Quotable",
    category: "Content",
    description: "Free API for inspirational quotes",
    url: "https://api.quotable.io",
    endpoint: "/random",
    method: "GET",
    features: ["Random quotes", "Filter by author/tags", "No rate limits"],
    useCase: "Add inspirational content to social media posts and emails",
    icon: Lightbulb,
    color: "bg-yellow-500"
  },
  {
    name: "JokeAPI",
    category: "Content",
    description: "Free API for jokes and humor content",
    url: "https://v2.jokeapi.dev",
    endpoint: "/joke/Any",
    method: "GET",
    features: ["Multiple categories", "Safe mode", "Custom formats"],
    useCase: "Create engaging social media content with humor",
    icon: Heart,
    color: "bg-pink-500"
  },
  {
    name: "Cat Facts API",
    category: "Fun",
    description: "Random cat facts for engaging content",
    url: "https://catfact.ninja",
    endpoint: "/fact",
    method: "GET",
    features: ["Random facts", "JSON format", "No authentication"],
    useCase: "Add fun facts to break ice in marketing content",
    icon: Heart,
    color: "bg-purple-500"
  },
  {
    name: "QR Code API",
    category: "Utilities",
    description: "Generate QR codes for marketing campaigns",
    url: "https://api.qrserver.com",
    endpoint: "/v1/create-qr-code/",
    method: "GET",
    features: ["Custom size", "Multiple formats", "Color customization"],
    useCase: "Create QR codes for campaigns, contact info, and URLs",
    icon: Code,
    color: "bg-gray-600"
  },
  {
    name: "Unsplash API",
    category: "Images",
    description: "High-quality free photos (requires API key)",
    url: "https://api.unsplash.com",
    endpoint: "/photos/random",
    method: "GET",
    features: ["HD photos", "Search by topic", "Attribution info"],
    useCase: "Professional photos for landing pages and social media",
    icon: Globe,
    color: "bg-orange-500"
  },
  {
    name: "OpenWeatherMap",
    category: "Data",
    description: "Weather data for location-based marketing",
    url: "https://api.openweathermap.org",
    endpoint: "/data/2.5/weather",
    method: "GET",
    features: ["Current weather", "Forecasts", "Historical data"],
    useCase: "Weather-based marketing campaigns and content personalization",
    icon: CloudLightning,
    color: "bg-blue-400"
  },
  {
    name: "REST Countries",
    category: "Data",
    description: "Get information about countries",
    url: "https://restcountries.com",
    endpoint: "/v3.1/all",
    method: "GET",
    features: ["Country data", "Flags", "Currency info"],
    useCase: "International marketing and localization features",
    icon: Globe,
    color: "bg-green-600"
  },
  {
    name: "Advice Slip",
    category: "Content",
    description: "Random advice for motivational content",
    url: "https://api.adviceslip.com",
    endpoint: "/advice",
    method: "GET",
    features: ["Random advice", "Search advice", "JSON format"],
    useCase: "Daily motivation content for social media and emails",
    icon: Lightbulb,
    color: "bg-indigo-500"
  },
  {
    name: "Dog API",
    category: "Fun",
    description: "Random dog images for engaging content",
    url: "https://dog.ceo",
    endpoint: "/api/breeds/image/random",
    method: "GET",
    features: ["Random dog images", "Breed specific", "No rate limits"],
    useCase: "Add cute content to marketing materials",
    icon: Heart,
    color: "bg-rose-500"
  },
  {
    name: "Numbers API",
    category: "Content",
    description: "Interesting facts about numbers",
    url: "http://numbersapi.com",
    endpoint: "/random",
    method: "GET",
    features: ["Math facts", "Date facts", "Trivia facts"],
    useCase: "Educational content and interesting statistics",
    icon: Database,
    color: "bg-teal-500"
  },
  {
    name: "Lorem Ipsum API",
    category: "Content",
    description: "Generate placeholder text",
    url: "https://loripsum.net",
    endpoint: "/api",
    method: "GET",
    features: ["Custom length", "HTML formatting", "Multiple formats"],
    useCase: "Fill content areas during design and development",
    icon: Code,
    color: "bg-slate-600"
  },
  {
    name: "Kanye REST",
    category: "Fun",
    description: "Random Kanye West quotes",
    url: "https://api.kanye.rest",
    endpoint: "/",
    method: "GET",
    features: ["Random quotes", "No authentication", "JSON format"],
    useCase: "Pop culture content for social media engagement",
    icon: Heart,
    color: "bg-violet-500"
  },
  {
    name: "JSONStorage",
    category: "Storage",
    description: "Free JSON data storage",
    url: "https://jsonstorage.net",
    endpoint: "/api/items",
    method: "POST",
    features: ["Free storage", "REST API", "No registration"],
    useCase: "Store user preferences and campaign data temporarily",
    icon: Database,
    color: "bg-emerald-600"
  }
];

export function PublicAPIShowcase() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>({});
  const [selectedAPI, setSelectedAPI] = useState<any>(null);
  const [copiedStates, setCopiedStates] = useState<{[key: string]: boolean}>({});
  const [activeCategory, setActiveCategory] = useState('all');
  
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
  const [testEndpoint, setTestEndpoint] = useState('');
  const [testResults, setTestResults] = useState<any>(null);

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(FREE_APIS.map(api => api.category)))];

  // Filter APIs by category
  const filteredAPIs = activeCategory === 'all' 
    ? FREE_APIS 
    : FREE_APIS.filter(api => api.category === activeCategory);

  // Copy to clipboard function
  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Test API endpoint
  const testAPIEndpoint = async (api: any) => {
    setLoading(true);
    setTestResults(null);
    
    try {
      const fullUrl = api.url + api.endpoint;
      const response = await fetch(fullUrl);
      const data = await response.json();
      
      setTestResults({
        status: response.status,
        data: data,
        url: fullUrl
      });
    } catch (error) {
      setTestResults({
        status: 'Error',
        data: { error: error.message },
        url: api.url + api.endpoint
      });
    } finally {
      setLoading(false);
    }
  };

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
          <h2 className="text-2xl font-bold tracking-tight">15+ Free APIs & Public Resources</h2>
          <p className="text-muted-foreground">
            Discover powerful free APIs to enhance your marketing automation and content creation
          </p>
        </div>
      </div>

      <Tabs defaultValue="directory" className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="directory" className="flex items-center gap-2">
            <Database size={16} />
            API Directory
          </TabsTrigger>
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
          <TabsTrigger value="testing" className="flex items-center gap-2">
            <Code size={16} />
            API Testing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="directory" className="space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className="capitalize"
              >
                {category === 'all' ? 'All Categories' : category}
              </Button>
            ))}
          </div>

          {/* API Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAPIs.map((api, index) => {
              const Icon = api.icon;
              return (
                <Card key={index} className="h-full hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${api.color} text-white`}>
                          <Icon size={16} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{api.name}</CardTitle>
                          <Badge variant="secondary" className="text-xs">
                            {api.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {api.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium">Endpoint:</span>
                        <Badge variant="outline">{api.method}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate">
                          {api.url}{api.endpoint}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(api.url + api.endpoint, `url-${index}`)}
                          className="h-8 w-8 p-0"
                        >
                          {copiedStates[`url-${index}`] ? <Check size={14} /> : <Copy size={14} />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-medium">Features:</span>
                      <div className="flex flex-wrap gap-1">
                        {api.features.map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-medium">Use Case:</span>
                      <p className="text-xs text-muted-foreground">
                        {api.useCase}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => testAPIEndpoint(api)}
                        disabled={loading}
                        className="flex-1"
                      >
                        <Play size={14} className="mr-1" />
                        Test API
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(api.url, '_blank')}
                        className="h-8 w-8 p-0"
                      >
                        <ExternalLink size={14} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* API Integration Guide */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Code className="h-5 w-5 text-blue-600" />
                Quick Integration Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-blue-800 mb-2">Basic Fetch Example:</h4>
                  <ScrollArea className="h-32">
                    <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
                      <code>{`fetch('https://api.quotable.io/random')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));`}</code>
                    </pre>
                  </ScrollArea>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800 mb-2">With Error Handling:</h4>
                  <ScrollArea className="h-32">
                    <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
                      <code>{`async function getQuote() {
  try {
    const response = await fetch('https://api.quotable.io/random');
    if (!response.ok) throw new Error('API Error');
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch:', error);
  }
}`}</code>
                    </pre>
                  </ScrollArea>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-white rounded border">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">Pro Tips:</h4>
                  <ul className="text-sm text-blue-700 mt-1 space-y-1">
                    <li>• Always handle errors gracefully in production</li>
                    <li>• Respect API rate limits and terms of service</li>
                    <li>• Cache responses when possible to improve performance</li>
                    <li>• Use environment variables for API keys</li>
                    <li>• Test APIs in development before deploying</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live API Testing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter API endpoint (e.g., https://api.quotable.io/random)"
                  value={testEndpoint}
                  onChange={(e) => setTestEndpoint(e.target.value)}
                />
                <Button 
                  onClick={() => testAPIEndpoint({ url: '', endpoint: testEndpoint })} 
                  disabled={loading || !testEndpoint}
                >
                  {loading ? 'Testing...' : 'Test'}
                </Button>
              </div>

              {testResults && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <span className={`inline-block w-3 h-3 rounded-full ${
                        testResults.status === 200 ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                      Response (Status: {testResults.status})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">URL:</span>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {testResults.url}
                        </code>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium">Response Data:</span>
                        <ScrollArea className="h-40 mt-2">
                          <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                            <code>{JSON.stringify(testResults.data, null, 2)}</code>
                          </pre>
                        </ScrollArea>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(JSON.stringify(testResults.data, null, 2), 'test-response')}
                      >
                        {copiedStates['test-response'] ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                        Copy Response
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Quick Test Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Quick API Tests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {FREE_APIS.slice(0, 8).map((api, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => testAPIEndpoint(api)}
                    disabled={loading}
                    className="text-xs"
                  >
                    {api.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

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
      </Tabs>

      <Card className="border-emerald-200 bg-emerald-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-emerald-500 text-white">
              <Sparkles size={20} />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-emerald-800 mb-2">Ready to Integrate?</h4>
              <p className="text-sm text-emerald-700 mb-4">
                These 15+ free APIs can be integrated directly into your NexusOne AI workflows. Use them to:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-emerald-700">
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-600" />
                  <span>Enhance your Magic Pages with dynamic content</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-600" />
                  <span>Generate engaging social media campaigns</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-600" />
                  <span>Create personalized email marketing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-600" />
                  <span>Add QR codes and visual elements</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-600" />
                  <span>Gather inspiration for AI content generation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={16} className="text-emerald-600" />
                  <span>Test and prototype new features</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-white rounded border border-emerald-200">
                <p className="text-xs text-emerald-600 font-medium">
                  💡 Pro Tip: These APIs are perfect for reducing costs while maintaining quality. 
                  Use them as fallbacks for premium APIs or for specific use cases in your marketing automation.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}