import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, AlertCircle, Play, Settings, Zap } from '@phosphor-icons/react';
import { apiConfigService, ApiStatus, ApiPriority } from '@/services/apiConfigurationService';
import { useLanguage } from '@/contexts/CleanLanguageContext';

export function ApiConfigurationDashboard() {
  const { t } = useLanguage();
  const [apis, setApis] = useState<ApiStatus[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [testing, setTesting] = useState<{ [service: string]: boolean }>({});
  const [testResults, setTestResults] = useState<{ [service: string]: boolean }>({});

  useEffect(() => {
    loadApiStatuses();
  }, []);

  const loadApiStatuses = () => {
    const allApis = apiConfigService.getAllApiStatuses();
    const configSummary = apiConfigService.getConfigurationSummary();
    setApis(allApis);
    setSummary(configSummary);
  };

  const testApi = async (service: string) => {
    setTesting(prev => ({ ...prev, [service]: true }));
    
    try {
      const result = await apiConfigService.testApiConnectivity(service);
      setTestResults(prev => ({ ...prev, [service]: result }));
      loadApiStatuses(); // Refresh to get updated status
    } catch (error) {
      console.error(`Failed to test ${service}:`, error);
      setTestResults(prev => ({ ...prev, [service]: false }));
    } finally {
      setTesting(prev => ({ ...prev, [service]: false }));
    }
  };

  const testAllApis = async () => {
    const allServices = apis.map(api => api.service);
    
    for (const service of allServices) {
      await testApi(service);
    }
  };

  const getStatusIcon = (status: string, testResult?: boolean) => {
    if (testResult === true) return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (testResult === false) return <XCircle className="w-4 h-4 text-red-500" />;
    
    switch (status) {
      case 'configured':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'missing':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'invalid':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'testing':
        return <div className="w-4 h-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string, priority: ApiPriority, required: boolean) => {
    const variant = status === 'configured' ? 'default' : 
                   status === 'missing' && required ? 'destructive' : 'secondary';
    
    return (
      <Badge variant={variant} className="ml-2">
        {status === 'configured' ? '✅ Ready' : 
         status === 'missing' ? '🔧 Setup' : 
         status === 'invalid' ? '❌ Error' : '🔄 Testing'}
      </Badge>
    );
  };

  const getPriorityColor = (priority: ApiPriority) => {
    switch (priority) {
      case 'critical': return 'border-l-red-500';
      case 'high': return 'border-l-orange-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const renderApisByPriority = (priority: ApiPriority) => {
    const priorityApis = apis.filter(api => api.priority === priority);
    
    return (
      <div className="space-y-4">
        {priorityApis.map((api) => (
          <Card key={api.service} className={`border-l-4 ${getPriorityColor(api.priority)}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(api.status, testResults[api.service])}
                  <CardTitle className="text-lg">{api.name}</CardTitle>
                  {getStatusBadge(api.status, api.priority, api.required)}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => testApi(api.service)}
                  disabled={testing[api.service]}
                  className="flex items-center space-x-1"
                >
                  <Play className="w-3 h-3" />
                  <span>{testing[api.service] ? 'Testing...' : 'Test'}</span>
                </Button>
              </div>
              <CardDescription className="text-sm text-muted-foreground">
                {api.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Priority: <span className="capitalize font-medium">{api.priority}</span>
                  {api.required && <span className="ml-2 text-red-500">• Required</span>}
                </span>
                {api.lastTested && (
                  <span className="text-xs text-muted-foreground">
                    Last tested: {api.lastTested.toLocaleTimeString()}
                  </span>
                )}
              </div>
              {api.errorMessage && (
                <Alert className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{api.errorMessage}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (!summary) return <div>Loading API configuration...</div>;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total APIs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total}</div>
            <p className="text-xs text-muted-foreground">Integrated services</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Configured</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summary.configured}</div>
            <p className="text-xs text-muted-foreground">Ready to use</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Critical Ready</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {summary.criticalConfigured}/{summary.criticalTotal}
            </div>
            <p className="text-xs text-muted-foreground">Core functionality</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.completionPercentage}%</div>
            <Progress value={summary.completionPercentage} className="mt-1" />
          </CardContent>
        </Card>
      </div>

      {/* Launch Readiness Alert */}
      {summary.readyForLaunch ? (
        <Alert className="border-green-500 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            🚀 <strong>Ready for Launch!</strong> All critical APIs are configured and ready for production.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert className="border-orange-500 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            ⚠️ <strong>Setup Required:</strong> {summary.criticalTotal - summary.criticalConfigured} critical API(s) need configuration before launch.
          </AlertDescription>
        </Alert>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button onClick={testAllApis} className="flex items-center space-x-2">
          <Zap className="w-4 h-4" />
          <span>Test All APIs</span>
        </Button>
        
        <Button variant="outline" onClick={loadApiStatuses} className="flex items-center space-x-2">
          <Settings className="w-4 h-4" />
          <span>Refresh Status</span>
        </Button>
      </div>

      {/* API Tabs by Priority */}
      <Tabs defaultValue="critical" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="critical" className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            <span>Critical</span>
          </TabsTrigger>
          <TabsTrigger value="high" className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
            <span>High</span>
          </TabsTrigger>
          <TabsTrigger value="medium" className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            <span>Medium</span>
          </TabsTrigger>
          <TabsTrigger value="low" className="flex items-center space-x-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Low</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="critical" className="mt-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-red-600">Critical APIs</h3>
            <p className="text-sm text-muted-foreground">
              Required for core functionality. Configure these first.
            </p>
          </div>
          {renderApisByPriority('critical')}
        </TabsContent>
        
        <TabsContent value="high" className="mt-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-orange-600">High Priority APIs</h3>
            <p className="text-sm text-muted-foreground">
              Core features. Configure after critical APIs.
            </p>
          </div>
          {renderApisByPriority('high')}
        </TabsContent>
        
        <TabsContent value="medium" className="mt-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-yellow-600">Medium Priority APIs</h3>
            <p className="text-sm text-muted-foreground">
              Enhanced features and monetization.
            </p>
          </div>
          {renderApisByPriority('medium')}
        </TabsContent>
        
        <TabsContent value="low" className="mt-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-green-600">Low Priority APIs</h3>
            <p className="text-sm text-muted-foreground">
              Future enhancements and additional integrations.
            </p>
          </div>
          {renderApisByPriority('low')}
        </TabsContent>
      </Tabs>

      {/* Configuration Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Next Steps</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {apiConfigService.generateConfigInstructions().map((instruction, index) => (
              <p key={index} className="text-sm font-mono bg-muted p-2 rounded">
                {instruction}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}