import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Play, Zap, AlertCircle } from '@phosphor-icons/react';
import { apiConfigService } from '@/services/apiConfigurationService';
import { apiService } from '@/services/api-integration';
import { toast } from 'sonner';

export default function ApiTestPage() {
  const [testing, setTesting] = useState<{ [key: string]: boolean }>({});
  const [results, setResults] = useState<{ [key: string]: { success: boolean; message: string; data?: any } }>({});

  const tests = [
    {
      id: 'openai',
      name: 'OpenAI Content Generation',
      description: 'Test AI content generation with GPT-4',
      test: async () => {
        const content = await apiService.generateContent('Write a short test message for API validation');
        return { success: true, message: 'Content generated successfully', data: content };
      }
    },
    {
      id: 'elevenlabs',
      name: 'ElevenLabs Text-to-Speech',
      description: 'Test voice synthesis functionality',
      test: async () => {
        const audio = await apiService.generateSpeech('Hello, this is a test of the text to speech API');
        return { success: true, message: 'Audio generated successfully', data: audio.size + ' bytes' };
      }
    },
    {
      id: 'replicate',
      name: 'Replicate Image Generation',
      description: 'Test AI image generation',
      test: async () => {
        const images = await apiService.generateImage('A beautiful sunset over mountains, digital art');
        return { success: true, message: 'Image generated successfully', data: images.length + ' images' };
      }
    },
    {
      id: 'unsplash',
      name: 'Unsplash Image Search',
      description: 'Test stock photo access',
      test: async () => {
        const images = await apiService.searchImages('business meeting');
        return { success: true, message: 'Images found successfully', data: images.length + ' photos' };
      }
    },
    {
      id: 'cj',
      name: 'CJ Dropshipping Product Search',
      description: 'Test product catalog access',
      test: async () => {
        const products = await apiService.searchProducts({ keyword: 'phone case', pageSize: 5 });
        return { success: true, message: 'Products found successfully', data: products?.length + ' products' };
      }
    },
    {
      id: 'health',
      name: 'API Health Check',
      description: 'Test connectivity to all configured APIs',
      test: async () => {
        const health = await apiService.checkApiHealth();
        const activeApis = Object.values(health).filter(Boolean).length;
        const totalApis = Object.keys(health).length;
        return { 
          success: activeApis > 0, 
          message: `${activeApis}/${totalApis} APIs are responsive`,
          data: health 
        };
      }
    }
  ];

  const runTest = async (testId: string) => {
    const test = tests.find(t => t.id === testId);
    if (!test) return;

    setTesting(prev => ({ ...prev, [testId]: true }));
    
    try {
      const result = await test.test();
      setResults(prev => ({ ...prev, [testId]: result }));
      toast.success(`${test.name} test completed successfully`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setResults(prev => ({ 
        ...prev, 
        [testId]: { success: false, message: errorMessage } 
      }));
      toast.error(`${test.name} test failed: ${errorMessage}`);
    } finally {
      setTesting(prev => ({ ...prev, [testId]: false }));
    }
  };

  const runAllTests = async () => {
    toast.info('Running all API tests...');
    for (const test of tests) {
      await runTest(test.id);
      // Small delay between tests to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    toast.success('All API tests completed');
  };

  const getStatusIcon = (testId: string) => {
    if (testing[testId]) {
      return <div className="w-4 h-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />;
    }
    
    const result = results[testId];
    if (!result) return <Play className="w-4 h-4 text-gray-400" />;
    
    return result.success ? 
      <CheckCircle className="w-4 h-4 text-green-500" /> : 
      <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getStatusBadge = (testId: string) => {
    if (testing[testId]) {
      return <Badge variant="secondary">Testing...</Badge>;
    }
    
    const result = results[testId];
    if (!result) return <Badge variant="outline">Ready</Badge>;
    
    return result.success ? 
      <Badge className="bg-green-100 text-green-800">Success</Badge> : 
      <Badge variant="destructive">Failed</Badge>;
  };

  const successfulTests = Object.values(results).filter(r => r.success).length;
  const totalTests = Object.keys(results).length;
  const completionPercentage = totalTests > 0 ? Math.round((successfulTests / totalTests) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">API Integration Testing</h1>
        <p className="text-lg text-muted-foreground">
          Validate your API configurations and test core functionality
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tests Run</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTests}</div>
            <p className="text-xs text-muted-foreground">of {tests.length} total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Successful</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{successfulTests}</div>
            <p className="text-xs text-muted-foreground">APIs working</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{completionPercentage}%</div>
            <p className="text-xs text-muted-foreground">Completion rate</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completionPercentage >= 80 ? '🟢' : completionPercentage >= 60 ? '🟡' : '🔴'}
            </div>
            <p className="text-xs text-muted-foreground">
              {completionPercentage >= 80 ? 'Excellent' : completionPercentage >= 60 ? 'Good' : 'Needs work'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Global Test Button */}
      <div className="flex space-x-4">
        <Button 
          onClick={runAllTests}
          disabled={Object.values(testing).some(Boolean)}
          className="flex items-center space-x-2"
        >
          <Zap className="w-4 h-4" />
          <span>Run All Tests</span>
        </Button>
      </div>

      {/* Individual Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tests.map((test) => (
          <Card key={test.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(test.id)}
                  <CardTitle className="text-lg">{test.name}</CardTitle>
                </div>
                {getStatusBadge(test.id)}
              </div>
              <CardDescription>{test.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results[test.id] && (
                  <Alert className={results[test.id].success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                    {results[test.id].success ? 
                      <CheckCircle className="h-4 w-4 text-green-600" /> : 
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    }
                    <AlertDescription className={results[test.id].success ? 'text-green-800' : 'text-red-800'}>
                      {results[test.id].message}
                      {results[test.id].data && (
                        <div className="mt-1 text-xs font-mono">
                          {typeof results[test.id].data === 'object' ? 
                            JSON.stringify(results[test.id].data, null, 2) : 
                            results[test.id].data
                          }
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
                
                <Button
                  variant="outline"
                  onClick={() => runTest(test.id)}
                  disabled={testing[test.id]}
                  className="w-full flex items-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>{testing[test.id] ? 'Testing...' : 'Run Test'}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Testing Instructions</CardTitle>
          <CardDescription>How to interpret test results and troubleshoot issues</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">✅ Success</h4>
            <p className="text-sm text-muted-foreground">
              API is properly configured and functioning. Feature is ready for production use.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">❌ Failed</h4>
            <p className="text-sm text-muted-foreground">
              API configuration issue detected. Check your API keys in Settings → API Configuration.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">🔧 Troubleshooting</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Verify API keys are correctly entered in the configuration</li>
              <li>• Check if API keys have sufficient permissions/credits</li>
              <li>• Ensure your IP address is not blocked by the API provider</li>
              <li>• Verify rate limits are not exceeded</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}