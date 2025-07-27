import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Zap, Settings } from '@phosphor-icons/react';
import { apiConfigService } from '@/services/apiConfigurationService';
import { toast } from 'sonner';

export function ApiStatusWidget() {
  const [summary, setSummary] = useState<any>(null);
  const [features, setFeatures] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = () => {
    const configSummary = apiConfigService.getConfigurationSummary();
    const featureAvailability = apiConfigService.getFeatureAvailability();
    setSummary(configSummary);
    setFeatures(featureAvailability);
  };

  const runQuickTest = async () => {
    setTesting(true);
    try {
      // Test critical APIs only for quick check
      const criticalApis = ['openai', 'supabase', 'luma', 'cjDropshipping'];
      const results = await Promise.all(
        criticalApis.map(api => apiConfigService.testApiConnectivity(api))
      );
      
      const successCount = results.filter(Boolean).length;
      
      if (successCount === criticalApis.length) {
        toast.success('All critical APIs are working correctly!');
      } else {
        toast.warning(`${successCount}/${criticalApis.length} critical APIs tested successfully`);
      }
      
      loadStatus();
    } catch (error) {
      toast.error('API testing failed');
    } finally {
      setTesting(false);
    }
  };

  if (!summary || !features) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>API Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">Loading API status...</div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = () => {
    if (summary.readyForLaunch) return 'text-green-600';
    if (summary.completionPercentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = () => {
    if (summary.readyForLaunch) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (summary.completionPercentage >= 60) return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    return <XCircle className="h-5 w-5 text-red-600" />;
  };

  const getStatusMessage = () => {
    if (summary.readyForLaunch) return 'All systems ready for production!';
    if (summary.completionPercentage >= 60) return 'Most features available, some setup needed';
    return 'Critical setup required before launch';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              {getStatusIcon()}
              <span>API Configuration</span>
            </CardTitle>
            <CardDescription>{getStatusMessage()}</CardDescription>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getStatusColor()}`}>
              {summary.completionPercentage}%
            </div>
            <div className="text-xs text-muted-foreground">Complete</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={summary.completionPercentage} className="w-full" />
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium">APIs Configured</div>
            <div className="text-muted-foreground">{summary.configured}/{summary.total}</div>
          </div>
          <div>
            <div className="font-medium">Critical Ready</div>
            <div className="text-muted-foreground">{summary.criticalConfigured}/{summary.criticalTotal}</div>
          </div>
        </div>

        {/* Quick Feature Status */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Core Features</div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              {features.magicPages ? <CheckCircle className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-red-500" />}
              <span className="text-xs">Magic Pages</span>
            </div>
            <div className="flex items-center space-x-2">
              {features.videoCreator ? <CheckCircle className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-red-500" />}
              <span className="text-xs">Video Creator</span>
            </div>
            <div className="flex items-center space-x-2">
              {features.whatsappAutomation ? <CheckCircle className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-red-500" />}
              <span className="text-xs">WhatsApp</span>
            </div>
            <div className="flex items-center space-x-2">
              {features.dropshipping ? <CheckCircle className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3 text-red-500" />}
              <span className="text-xs">Dropshipping</span>
            </div>
          </div>
        </div>

        {!summary.readyForLaunch && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Configure {summary.criticalTotal - summary.criticalConfigured} more critical API(s) to enable full functionality.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex space-x-2">
          <Button 
            size="sm" 
            onClick={runQuickTest}
            disabled={testing}
            className="flex items-center space-x-1"
          >
            <Zap className="h-3 w-3" />
            <span>{testing ? 'Testing...' : 'Quick Test'}</span>
          </Button>
          
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => window.location.href = '/settings?tab=api'}
            className="flex items-center space-x-1"
          >
            <Settings className="h-3 w-3" />
            <span>Configure</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}