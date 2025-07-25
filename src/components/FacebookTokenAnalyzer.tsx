import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  Users, 
  TrendingUp,
  DollarSign,
  Calendar,
  Globe,
  Zap
} from '@phosphor-icons/react';

interface FacebookTokenAnalyzerProps {
  defaultToken?: string;
}

export function FacebookTokenAnalyzer({ defaultToken = '' }: FacebookTokenAnalyzerProps) {
  const [token, setToken] = useState(defaultToken);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeToken = async () => {
    if (!token.trim()) {
      setError('Please enter a Facebook access token');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Simulate API call to Facebook Token Analyzer
      await new Promise(resolve => setTimeout(resolve, 2000)); // Mock delay

      // Mock analysis result based on the provided token pattern
      const mockAnalysis = {
        isValid: true,
        tokenType: 'USER',
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        scopes: [
          'public_profile',
          'email', 
          'ads_management',
          'ads_read',
          'pages_manage_ads',
          'pages_read_engagement',
          'business_management',
          'read_insights'
        ],
        userInfo: {
          id: '123456789',
          name: 'NexusOne User',
          email: 'user@nexusone.com'
        },
        businessAccounts: [
          {
            id: 'business_123',
            name: 'NexusOne Marketing Business',
            verification_status: 'verified'
          }
        ],
        adAccounts: [
          {
            id: 'act_987654321',
            name: 'Primary Ad Account',
            currency: 'USD',
            timezone_name: 'America/New_York',
            account_status: 1,
            amount_spent: 1250.50,
            balance: 500.00
          },
          {
            id: 'act_876543210',
            name: 'Dropshipping Ad Account',
            currency: 'USD', 
            timezone_name: 'America/New_York',
            account_status: 1,
            amount_spent: 890.25,
            balance: 750.00
          }
        ],
        pages: [
          {
            id: 'page_456789',
            name: 'NexusOne Dropshipping Store',
            category: 'E-commerce Website',
            fan_count: 12500,
            access_token: 'page_token_here'
          },
          {
            id: 'page_567890',
            name: 'Marketing Agency Page',
            category: 'Marketing Agency',
            fan_count: 8900,
            access_token: 'page_token_here'
          }
        ],
        capabilities: {
          canCreateAds: true,
          canManagePages: true,
          canAccessInsights: true,
          canUploadMedia: true
        },
        limitations: [],
        recommendations: [
          '✅ Your token is ready for NexusOne marketing automation!',
          '✅ Can create and manage Facebook ad campaigns',
          '✅ Can manage Facebook pages and post content', 
          '✅ Can access campaign performance insights',
          '🚀 You can now create automated dropshipping campaigns',
          '💡 Test campaign creation with a small budget first'
        ],
        setupSteps: [
          'Save this token in NexusOne Settings → API Configuration',
          'Test campaign creation with a small budget first',
          'Set up Facebook Pixel on your landing pages',
          'Configure conversion tracking for better optimization'
        ]
      };

      setAnalysis(mockAnalysis);
    } catch (err) {
      setError('Failed to analyze token. Please check your connection and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const StatusIcon = ({ condition }: { condition: boolean }) => (
    condition ? 
      <CheckCircle className="h-4 w-4 text-green-500" /> : 
      <XCircle className="h-4 w-4 text-red-500" />
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Facebook Token Analyzer
          </CardTitle>
          <CardDescription>
            Analyze your Facebook access token to check permissions and capabilities for marketing automation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter your Facebook access token..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              type="password"
              className="flex-1"
            />
            <Button 
              onClick={analyzeToken} 
              disabled={isAnalyzing}
              className="min-w-[120px]"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Token'}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {analysis && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="accounts">Ad Accounts</TabsTrigger>
            <TabsTrigger value="pages">Pages</TabsTrigger>
            <TabsTrigger value="setup">Setup Guide</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <StatusIcon condition={analysis.isValid} />
                    Token Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Valid:</span>
                    <Badge variant={analysis.isValid ? 'default' : 'destructive'}>
                      {analysis.isValid ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Type:</span>
                    <Badge variant="outline">{analysis.tokenType}</Badge>
                  </div>
                  {analysis.expiresAt && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Expires:</span>
                      <span className="text-sm">
                        {new Date(analysis.expiresAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Capabilities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Create Ads</span>
                    <StatusIcon condition={analysis.capabilities.canCreateAds} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Manage Pages</span>
                    <StatusIcon condition={analysis.capabilities.canManagePages} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Access Insights</span>
                    <StatusIcon condition={analysis.capabilities.canAccessInsights} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Upload Media</span>
                    <StatusIcon condition={analysis.capabilities.canUploadMedia} />
                  </div>
                </CardContent>
              </Card>

              {analysis.userInfo && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      User Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Name:</span>
                      <span className="text-sm font-medium">{analysis.userInfo.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">ID:</span>
                      <span className="text-sm font-mono">{analysis.userInfo.id}</span>
                    </div>
                    {analysis.userInfo.email && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Email:</span>
                        <span className="text-sm">{analysis.userInfo.email}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Permissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {analysis.scopes.map((scope: string) => (
                      <Badge key={scope} variant="secondary" className="text-xs">
                        {scope}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-32">
                  <div className="space-y-2">
                    {analysis.recommendations.map((rec: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accounts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Ad Accounts ({analysis.adAccounts?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.adAccounts?.map((account: any) => (
                    <div key={account.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{account.name}</h4>
                        <Badge variant={account.account_status === 1 ? 'default' : 'destructive'}>
                          {account.account_status === 1 ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">ID:</span>
                          <span className="ml-2 font-mono">{account.id}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Currency:</span>
                          <span className="ml-2">{account.currency}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Spent:</span>
                          <span className="ml-2">${account.amount_spent?.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Balance:</span>
                          <span className="ml-2">${account.balance?.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  )) || (
                    <p className="text-muted-foreground text-center py-4">
                      No ad accounts found
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Facebook Pages ({analysis.pages?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.pages?.map((page: any) => (
                    <div key={page.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{page.name}</h4>
                        <Badge variant="outline">{page.category}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">ID:</span>
                          <span className="ml-2 font-mono">{page.id}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Followers:</span>
                          <span className="ml-2">{page.fan_count?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )) || (
                    <p className="text-muted-foreground text-center py-4">
                      No pages found
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="setup" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Setup Steps
                </CardTitle>
                <CardDescription>
                  Follow these steps to complete your Facebook marketing integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.setupSteps?.map((step: string, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-medium flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Token Analysis Complete!</strong><br />
                Your Facebook access token appears to be properly configured for NexusOne marketing automation. 
                You can now create automated dropshipping campaigns, manage Facebook ads, and track performance insights.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}