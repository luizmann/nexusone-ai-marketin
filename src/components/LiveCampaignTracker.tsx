import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  MousePointer, 
  ShoppingCart, 
  DollarSign,
  AlertTriangle,
  Zap,
  Target,
  BarChart3,
  Refresh,
  PlayCircle,
  PauseCircle
} from '@phosphor-icons/react';
import { useLanguage } from '@/contexts/CleanLanguageContext';
import { nexBrainService, CampaignPerformanceData, OptimizationSuggestion } from '@/services/nexBrainService';
import { toast } from 'sonner';

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  budget: number;
  spent: number;
  startDate: Date;
  endDate: Date;
  platform: 'facebook' | 'google' | 'instagram' | 'tiktok';
}

export function LiveCampaignTracker() {
  const { t } = useLanguage();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [performanceData, setPerformanceData] = useState<Record<string, CampaignPerformanceData>>({});
  const [optimizations, setOptimizations] = useState<Record<string, OptimizationSuggestion[]>>({});
  const [isTracking, setIsTracking] = useState(false);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Load mock campaigns
  useEffect(() => {
    const mockCampaigns: Campaign[] = [
      {
        id: 'cam_001',
        name: 'Holiday Product Launch',
        status: 'active',
        budget: 1000,
        spent: 642,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31'),
        platform: 'facebook'
      },
      {
        id: 'cam_002',
        name: 'Retargeting Campaign',
        status: 'active',
        budget: 500,
        spent: 287,
        startDate: new Date('2025-01-05'),
        endDate: new Date('2025-01-25'),
        platform: 'instagram'
      },
      {
        id: 'cam_003',
        name: 'Brand Awareness',
        status: 'paused',
        budget: 750,
        spent: 234,
        startDate: new Date('2024-12-20'),
        endDate: new Date('2025-01-20'),
        platform: 'google'
      }
    ];
    setCampaigns(mockCampaigns);
    setSelectedCampaign(mockCampaigns[0].id);
  }, []);

  // Real-time tracking toggle
  const toggleTracking = async () => {
    setIsTracking(!isTracking);
    if (!isTracking) {
      toast.success('Real-time tracking activated');
      startRealTimeTracking();
    } else {
      toast.info('Real-time tracking paused');
    }
  };

  // Start real-time tracking
  const startRealTimeTracking = async () => {
    const activeCampaignIds = campaigns
      .filter(c => c.status === 'active')
      .map(c => c.id);

    if (activeCampaignIds.length === 0) {
      toast.error('No active campaigns to track');
      return;
    }

    try {
      const monitoringData = await nexBrainService.monitorCampaignsRealtime(activeCampaignIds);
      
      // Update performance data
      const newPerformanceData: Record<string, CampaignPerformanceData> = {};
      monitoringData.performances.forEach((perf: CampaignPerformanceData) => {
        newPerformanceData[perf.campaignId] = perf;
      });
      setPerformanceData(newPerformanceData);
      
      // Update alerts
      setAlerts(monitoringData.alerts);
      
      toast.success(`Tracking ${activeCampaignIds.length} campaigns`);
    } catch (error) {
      console.error('Real-time tracking failed:', error);
      toast.error('Failed to start tracking');
    }
  };

  // Refresh campaign data
  const refreshData = async () => {
    if (!selectedCampaign) return;
    
    setLoading(true);
    try {
      const performance = await nexBrainService.trackCampaignPerformance(selectedCampaign);
      setPerformanceData(prev => ({
        ...prev,
        [selectedCampaign]: performance
      }));
      
      const optimizationSuggestions = await nexBrainService.optimizeCampaign(selectedCampaign, performance);
      setOptimizations(prev => ({
        ...prev,
        [selectedCampaign]: optimizationSuggestions
      }));
      
      toast.success('Data refreshed');
    } catch (error) {
      console.error('Data refresh failed:', error);
      toast.error('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  // Generate AI insights
  const generateInsights = async () => {
    setLoading(true);
    try {
      const campaignData = Object.values(performanceData);
      const aiInsights = await nexBrainService.generatePerformanceInsights(campaignData);
      setInsights(aiInsights);
      toast.success('AI insights generated');
    } catch (error) {
      console.error('Insights generation failed:', error);
      toast.error('Failed to generate insights');
    } finally {
      setLoading(false);
    }
  };

  const selectedPerformance = selectedCampaign ? performanceData[selectedCampaign] : null;
  const selectedOptimizations = selectedCampaign ? optimizations[selectedCampaign] : [];

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('Live Campaign Tracker')}
          </h1>
          <p className="text-muted-foreground">
            {t('Real-time performance monitoring with AI optimization')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={toggleTracking}
            variant={isTracking ? "destructive" : "default"}
            className="gap-2"
          >
            {isTracking ? <PauseCircle /> : <PlayCircle />}
            {isTracking ? t('Pause Tracking') : t('Start Tracking')}
          </Button>
          <Button
            onClick={refreshData}
            variant="outline"
            disabled={loading}
            className="gap-2"
          >
            <Refresh className={loading ? 'animate-spin' : ''} />
            {t('Refresh')}
          </Button>
          <Button
            onClick={generateInsights}
            variant="outline"
            disabled={loading}
            className="gap-2"
          >
            <Zap />
            {t('AI Insights')}
          </Button>
        </div>
      </div>

      {/* Active Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <Alert key={index} className={alert.severity === 'high' ? 'border-red-500' : 'border-yellow-500'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Campaign {alert.campaignId}:</strong> {alert.message}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Campaign Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target />
            {t('Active Campaigns')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map((campaign) => (
              <Card
                key={campaign.id}
                className={`cursor-pointer transition-colors ${
                  selectedCampaign === campaign.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedCampaign(campaign.id)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-sm">{campaign.name}</h3>
                    <Badge 
                      variant={campaign.status === 'active' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('Spent')}</span>
                      <span>${campaign.spent} / ${campaign.budget}</span>
                    </div>
                    <Progress 
                      value={(campaign.spent / campaign.budget) * 100} 
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{campaign.platform}</span>
                      <span>{Math.round((campaign.spent / campaign.budget) * 100)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Dashboard */}
      {selectedPerformance && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">{t('Overview')}</TabsTrigger>
            <TabsTrigger value="optimization">{t('AI Optimization')}</TabsTrigger>
            <TabsTrigger value="insights">{t('Deep Insights')}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-muted-foreground">{t('Impressions')}</span>
                  </div>
                  <p className="text-2xl font-bold">{selectedPerformance.impressions.toLocaleString()}</p>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +12.5% vs yesterday
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <MousePointer className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-muted-foreground">{t('Clicks')}</span>
                  </div>
                  <p className="text-2xl font-bold">{selectedPerformance.clicks.toLocaleString()}</p>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    CTR: {selectedPerformance.ctr.toFixed(2)}%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-purple-500" />
                    <span className="text-sm text-muted-foreground">{t('Conversions')}</span>
                  </div>
                  <p className="text-2xl font-bold">{selectedPerformance.conversions}</p>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    CVR: {((selectedPerformance.conversions / selectedPerformance.clicks) * 100).toFixed(2)}%
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-orange-500" />
                    <span className="text-sm text-muted-foreground">{t('ROAS')}</span>
                  </div>
                  <p className="text-2xl font-bold">{selectedPerformance.roas.toFixed(1)}x</p>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Revenue: ${selectedPerformance.revenue.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Performance Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 />
                  {t('Performance Trends')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">{t('Performance chart will be displayed here')}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-4">
            {selectedOptimizations.length > 0 ? (
              <div className="space-y-4">
                {selectedOptimizations.map((suggestion, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">
                          {suggestion.suggestion}
                        </CardTitle>
                        <Badge 
                          variant={
                            suggestion.priority === 'high' ? 'destructive' :
                            suggestion.priority === 'medium' ? 'default' : 'secondary'
                          }
                        >
                          {suggestion.priority} priority
                        </Badge>
                      </div>
                      <CardDescription>
                        Expected Impact: {suggestion.expectedImpact}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">{t('Implementation Steps:')}</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          {suggestion.implementationSteps.map((step, stepIndex) => (
                            <li key={stepIndex}>{step}</li>
                          ))}
                        </ul>
                      </div>
                      <Button className="mt-4" size="sm">
                        {t('Apply Optimization')}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {t('Click "Refresh" to generate AI optimization suggestions')}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            {insights ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap />
                    {t('AI-Generated Insights')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap text-sm">
                      {JSON.stringify(insights, null, 2)}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    {t('Generate comprehensive AI insights about your campaign performance')}
                  </p>
                  <Button onClick={generateInsights} disabled={loading}>
                    {loading ? 'Generating...' : t('Generate AI Insights')}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}