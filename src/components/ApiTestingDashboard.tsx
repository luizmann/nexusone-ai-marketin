import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Loader2, Zap, Image, MessageSquare, ShoppingCart, Mic } from '@phosphor-icons/react';
import { apiService } from '@/services/api-integration';
import { toast } from 'sonner';

export function ApiTestingDashboard() {
  const [apiStatus, setApiStatus] = useState<any>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, any>>({});

  useEffect(() => {
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    setLoading(prev => ({ ...prev, health: true }));
    try {
      const health = await apiService.checkApiHealth();
      setApiStatus(health);
      toast.success('API health check completed');
    } catch (error) {
      toast.error('API health check failed');
    } finally {
      setLoading(prev => ({ ...prev, health: false }));
    }
  };

  const testOpenAI = async () => {
    const prompt = (document.getElementById('openai-prompt') as HTMLTextAreaElement)?.value || 
      'Generate a short marketing copy for a new AI-powered app called NexusOne.';
    
    setLoading(prev => ({ ...prev, openai: true }));
    try {
      const result = await apiService.generateContent(prompt);
      setResults(prev => ({ ...prev, openai: result }));
      toast.success('OpenAI test successful');
    } catch (error) {
      toast.error('OpenAI test failed');
      setResults(prev => ({ ...prev, openai: `Error: ${error}` }));
    } finally {
      setLoading(prev => ({ ...prev, openai: false }));
    }
  };

  const testElevenLabs = async () => {
    const text = (document.getElementById('elevenlabs-text') as HTMLInputElement)?.value || 
      'Hello, welcome to NexusOne AI platform!';
    
    setLoading(prev => ({ ...prev, elevenlabs: true }));
    try {
      const audioBlob = await apiService.generateSpeech(text);
      const audioUrl = URL.createObjectURL(audioBlob);
      setResults(prev => ({ ...prev, elevenlabs: audioUrl }));
      toast.success('ElevenLabs test successful');
    } catch (error) {
      toast.error('ElevenLabs test failed');
      setResults(prev => ({ ...prev, elevenlabs: `Error: ${error}` }));
    } finally {
      setLoading(prev => ({ ...prev, elevenlabs: false }));
    }
  };

  const testReplicate = async () => {
    const prompt = (document.getElementById('replicate-prompt') as HTMLInputElement)?.value || 
      'Professional business logo for AI company, modern, clean, tech';
    
    setLoading(prev => ({ ...prev, replicate: true }));
    try {
      const images = await apiService.generateImage(prompt);
      setResults(prev => ({ ...prev, replicate: images }));
      toast.success('Replicate test successful');
    } catch (error) {
      toast.error('Replicate test failed');
      setResults(prev => ({ ...prev, replicate: `Error: ${error}` }));
    } finally {
      setLoading(prev => ({ ...prev, replicate: false }));
    }
  };

  const testUnsplash = async () => {
    const query = (document.getElementById('unsplash-query') as HTMLInputElement)?.value || 
      'business technology';
    
    setLoading(prev => ({ ...prev, unsplash: true }));
    try {
      const images = await apiService.searchImages(query, { perPage: 6 });
      setResults(prev => ({ ...prev, unsplash: images }));
      toast.success('Unsplash test successful');
    } catch (error) {
      toast.error('Unsplash test failed');
      setResults(prev => ({ ...prev, unsplash: `Error: ${error}` }));
    } finally {
      setLoading(prev => ({ ...prev, unsplash: false }));
    }
  };

  const testCJDropshipping = async () => {
    const keyword = (document.getElementById('cj-keyword') as HTMLInputElement)?.value || 
      'phone case';
    
    setLoading(prev => ({ ...prev, cj: true }));
    try {
      const products = await apiService.searchProducts({ keyword, pageSize: 6 });
      setResults(prev => ({ ...prev, cj: products }));
      toast.success('CJ Dropshipping test successful');
    } catch (error) {
      toast.error('CJ Dropshipping test failed');
      setResults(prev => ({ ...prev, cj: `Error: ${error}` }));
    } finally {
      setLoading(prev => ({ ...prev, cj: false }));
    }
  };

  const testWhatsApp = async () => {
    const phoneNumber = (document.getElementById('whatsapp-phone') as HTMLInputElement)?.value;
    const message = (document.getElementById('whatsapp-message') as HTMLInputElement)?.value || 
      'Test message from NexusOne AI';
    
    if (!phoneNumber) {
      toast.error('Please enter a phone number');
      return;
    }
    
    setLoading(prev => ({ ...prev, whatsapp: true }));
    try {
      const result = await apiService.sendWhatsAppMessage(phoneNumber, message);
      setResults(prev => ({ ...prev, whatsapp: result }));
      toast.success('WhatsApp test successful');
    } catch (error) {
      toast.error('WhatsApp test failed');
      setResults(prev => ({ ...prev, whatsapp: `Error: ${error}` }));
    } finally {
      setLoading(prev => ({ ...prev, whatsapp: false }));
    }
  };

  const ApiStatusBadge = ({ status, label }: { status: boolean; label: string }) => (
    <div className="flex items-center gap-2">
      {status ? (
        <CheckCircle className="w-4 h-4 text-green-500" />
      ) : (
        <XCircle className="w-4 h-4 text-red-500" />
      )}
      <Badge variant={status ? "default" : "destructive"}>
        {label}
      </Badge>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">API Testing Dashboard</h1>
          <p className="text-muted-foreground">Test all NexusOne AI integrations</p>
        </div>
        <Button onClick={checkApiHealth} disabled={loading.health}>
          {loading.health ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Refresh Status
        </Button>
      </div>

      {/* API Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            API Health Status
          </CardTitle>
          <CardDescription>Current status of all integrated APIs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ApiStatusBadge status={apiStatus.openai} label="OpenAI GPT-4" />
            <ApiStatusBadge status={apiStatus.elevenlabs} label="ElevenLabs TTS" />
            <ApiStatusBadge status={apiStatus.replicate} label="Replicate Images" />
            <ApiStatusBadge status={apiStatus.unsplash} label="Unsplash Photos" />
            <ApiStatusBadge status={apiStatus.cjDropshipping} label="CJ Dropshipping" />
            <ApiStatusBadge status={apiStatus.facebook} label="Facebook API" />
            <ApiStatusBadge status={apiStatus.whatsapp} label="WhatsApp Business" />
            <ApiStatusBadge status={false} label="Stripe Payments" />
          </div>
        </CardContent>
      </Card>

      {/* API Testing Tabs */}
      <Tabs defaultValue="openai" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
          <TabsTrigger value="openai" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            OpenAI
          </TabsTrigger>
          <TabsTrigger value="elevenlabs" className="flex items-center gap-2">
            <Mic className="w-4 h-4" />
            Voice
          </TabsTrigger>
          <TabsTrigger value="replicate" className="flex items-center gap-2">
            <Image className="w-4 h-4" />
            AI Images
          </TabsTrigger>
          <TabsTrigger value="unsplash" className="flex items-center gap-2">
            <Image className="w-4 h-4" />
            Photos
          </TabsTrigger>
          <TabsTrigger value="cj" className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Products
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            WhatsApp
          </TabsTrigger>
          <TabsTrigger value="facebook" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Facebook
          </TabsTrigger>
        </TabsList>

        {/* OpenAI Testing */}
        <TabsContent value="openai">
          <Card>
            <CardHeader>
              <CardTitle>OpenAI GPT-4 Testing</CardTitle>
              <CardDescription>Test content generation capabilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                id="openai-prompt"
                placeholder="Enter your prompt here..."
                className="min-h-20"
                defaultValue="Generate a short marketing copy for a new AI-powered app called NexusOne."
              />
              <Button onClick={testOpenAI} disabled={loading.openai}>
                {loading.openai ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Test OpenAI
              </Button>
              {results.openai && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Result:</h4>
                  <p className="whitespace-pre-wrap">{results.openai}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ElevenLabs Testing */}
        <TabsContent value="elevenlabs">
          <Card>
            <CardHeader>
              <CardTitle>ElevenLabs Text-to-Speech Testing</CardTitle>
              <CardDescription>Test voice generation capabilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input 
                id="elevenlabs-text"
                placeholder="Enter text to convert to speech..."
                defaultValue="Hello, welcome to NexusOne AI platform!"
              />
              <Button onClick={testElevenLabs} disabled={loading.elevenlabs}>
                {loading.elevenlabs ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Test ElevenLabs
              </Button>
              {results.elevenlabs && typeof results.elevenlabs === 'string' && results.elevenlabs.startsWith('blob:') && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Generated Audio:</h4>
                  <audio controls src={results.elevenlabs} className="w-full" />
                </div>
              )}
              {results.elevenlabs && typeof results.elevenlabs === 'string' && results.elevenlabs.startsWith('Error:') && (
                <div className="p-4 bg-destructive/10 rounded-lg">
                  <p className="text-destructive">{results.elevenlabs}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Replicate Testing */}
        <TabsContent value="replicate">
          <Card>
            <CardHeader>
              <CardTitle>Replicate Image Generation Testing</CardTitle>
              <CardDescription>Test AI image generation capabilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input 
                id="replicate-prompt"
                placeholder="Enter image generation prompt..."
                defaultValue="Professional business logo for AI company, modern, clean, tech"
              />
              <Button onClick={testReplicate} disabled={loading.replicate}>
                {loading.replicate ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Test Replicate
              </Button>
              {results.replicate && Array.isArray(results.replicate) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.replicate.map((imageUrl: string, index: number) => (
                    <img key={index} src={imageUrl} alt={`Generated ${index + 1}`} className="rounded-lg" />
                  ))}
                </div>
              )}
              {results.replicate && typeof results.replicate === 'string' && results.replicate.startsWith('Error:') && (
                <div className="p-4 bg-destructive/10 rounded-lg">
                  <p className="text-destructive">{results.replicate}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Unsplash Testing */}
        <TabsContent value="unsplash">
          <Card>
            <CardHeader>
              <CardTitle>Unsplash Photo Search Testing</CardTitle>
              <CardDescription>Test photo search and retrieval</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input 
                id="unsplash-query"
                placeholder="Enter search query..."
                defaultValue="business technology"
              />
              <Button onClick={testUnsplash} disabled={loading.unsplash}>
                {loading.unsplash ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Test Unsplash
              </Button>
              {results.unsplash && Array.isArray(results.unsplash) && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {results.unsplash.map((image: any) => (
                    <div key={image.id} className="space-y-2">
                      <img src={image.thumbnail} alt={image.description} className="rounded-lg w-full" />
                      <p className="text-sm text-muted-foreground">by {image.photographer}</p>
                    </div>
                  ))}
                </div>
              )}
              {results.unsplash && typeof results.unsplash === 'string' && results.unsplash.startsWith('Error:') && (
                <div className="p-4 bg-destructive/10 rounded-lg">
                  <p className="text-destructive">{results.unsplash}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* CJ Dropshipping Testing */}
        <TabsContent value="cj">
          <Card>
            <CardHeader>
              <CardTitle>CJ Dropshipping Product Search Testing</CardTitle>
              <CardDescription>Test product search and data retrieval</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input 
                id="cj-keyword"
                placeholder="Enter product keyword..."
                defaultValue="phone case"
              />
              <Button onClick={testCJDropshipping} disabled={loading.cj}>
                {loading.cj ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Test CJ Dropshipping
              </Button>
              {results.cj && Array.isArray(results.cj) && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.cj.slice(0, 6).map((product: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4 space-y-2">
                      <img src={product.image || '/placeholder-product.jpg'} alt={product.name} className="w-full h-32 object-cover rounded" />
                      <h4 className="font-semibold text-sm line-clamp-2">{product.name || `Product ${index + 1}`}</h4>
                      <p className="text-green-600 font-bold">${product.price || 'N/A'}</p>
                    </div>
                  ))}
                </div>
              )}
              {results.cj && typeof results.cj === 'string' && results.cj.startsWith('Error:') && (
                <div className="p-4 bg-destructive/10 rounded-lg">
                  <p className="text-destructive">{results.cj}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* WhatsApp Testing */}
        <TabsContent value="whatsapp">
          <Card>
            <CardHeader>
              <CardTitle>WhatsApp Business API Testing</CardTitle>
              <CardDescription>Test WhatsApp message sending (use test number)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input 
                id="whatsapp-phone"
                placeholder="Enter phone number (with country code)"
                type="tel"
              />
              <Input 
                id="whatsapp-message"
                placeholder="Enter message to send..."
                defaultValue="Test message from NexusOne AI"
              />
              <Button onClick={testWhatsApp} disabled={loading.whatsapp}>
                {loading.whatsapp ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Test WhatsApp
              </Button>
              {results.whatsapp && (
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2">Result:</h4>
                  <pre className="text-sm">{JSON.stringify(results.whatsapp, null, 2)}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Facebook Testing */}
        <TabsContent value="facebook">
          <Card>
            <CardHeader>
              <CardTitle>Facebook Marketing API Testing</CardTitle>
              <CardDescription>Test Facebook campaign creation (currently read-only)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Facebook API testing requires additional setup with Facebook Business Manager.
                Current token can only read account information.
              </p>
              <Button disabled>
                Test Facebook Campaign (Setup Required)
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}