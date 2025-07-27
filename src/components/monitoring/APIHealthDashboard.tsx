import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Zap,
  Refresh,
  Download,
  ExternalLink
} from '@phosphor-icons/react'

// API Health Monitor Component
export function APIHealthDashboard() {
  const [healthData, setHealthData] = useState(null)
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    // Initialize health monitor if available
    if (typeof window !== 'undefined' && window.healthMonitor) {
      // Add listener for health updates
      const handleHealthUpdate = (status) => {
        setHealthData(status)
        setLastUpdate(new Date())
      }

      window.healthMonitor.addListener(handleHealthUpdate)
      setIsMonitoring(window.healthMonitor.isRunning)

      // Get initial status
      setHealthData(window.healthMonitor.getStatus())

      // Cleanup listener on unmount
      return () => {
        window.healthMonitor.removeListener(handleHealthUpdate)
      }
    }
  }, [])

  const toggleMonitoring = () => {
    if (typeof window !== 'undefined' && window.healthMonitor) {
      if (isMonitoring) {
        window.healthMonitor.stop()
        setIsMonitoring(false)
      } else {
        window.healthMonitor.start()
        setIsMonitoring(true)
      }
    }
  }

  const forceRefresh = async () => {
    if (typeof window !== 'undefined' && window.healthMonitor) {
      await window.healthMonitor.runHealthCheck()
    }
  }

  const downloadReport = () => {
    if (typeof window !== 'undefined' && window.healthMonitor) {
      const report = window.healthMonitor.generateReport()
      const blob = new Blob([report], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `nexusone-health-report-${new Date().toISOString().split('T')[0]}.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'timeout':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'error':
      case 'unhealthy':
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'timeout':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'error':
      case 'unhealthy':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (!healthData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            API Health Monitor
          </CardTitle>
          <CardDescription>
            Loading health monitoring system...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { summary, apis } = healthData
  const criticalAPIs = apis.filter(api => api.critical)
  const optionalAPIs = apis.filter(api => !api.critical)

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="w-6 h-6" />
            API Health Dashboard
          </h2>
          <p className="text-muted-foreground">
            Real-time monitoring of all integrated services
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={forceRefresh}
            disabled={!isMonitoring}
          >
            <Refresh className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={downloadReport}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          
          <Button
            variant={isMonitoring ? "destructive" : "default"}
            size="sm"
            onClick={toggleMonitoring}
          >
            <Zap className="w-4 h-4 mr-2" />
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </Button>
        </div>
      </div>

      {/* Overall Status Alert */}
      {summary.overallStatus === 'degraded' && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription>
            Some critical services are experiencing issues. Check the details below.
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overall Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              {summary.healthPercentage}%
            </div>
            <Progress value={summary.healthPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {summary.healthy} of {summary.total} services healthy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Critical Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">
              {summary.criticalHealthy}/{summary.criticalTotal}
            </div>
            <Progress value={summary.criticalHealthPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Core functionality status
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge 
              className={`text-sm ${
                summary.overallStatus === 'operational' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {summary.overallStatus === 'operational' ? 'Operational' : 'Degraded'}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">
              Current system state
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Last Update
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">
              {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className="text-xs text-muted-foreground">
                {isMonitoring ? 'Live monitoring' : 'Monitoring stopped'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Details */}
      <Tabs defaultValue="critical" className="w-full">
        <TabsList>
          <TabsTrigger value="critical">Critical Services ({criticalAPIs.length})</TabsTrigger>
          <TabsTrigger value="optional">Optional Services ({optionalAPIs.length})</TabsTrigger>
          <TabsTrigger value="all">All Services ({apis.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="critical" className="space-y-4">
          <APIServiceList apis={criticalAPIs} />
        </TabsContent>

        <TabsContent value="optional" className="space-y-4">
          <APIServiceList apis={optionalAPIs} />
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <APIServiceList apis={apis} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// API Service List Component
function APIServiceList({ apis }) {
  return (
    <div className="grid gap-4">
      {apis.map((api) => (
        <Card key={api.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(api.status)}
                <div>
                  <CardTitle className="text-base">{api.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {api.description}
                  </CardDescription>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {api.critical && (
                  <Badge variant="outline" className="text-xs">
                    Critical
                  </Badge>
                )}
                <Badge className={`text-xs ${getStatusColor(api.status)}`}>
                  {api.status}
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {api.responseTime && (
                <div>
                  <span className="text-muted-foreground">Response Time:</span>
                  <div className="font-medium">{api.responseTime}ms</div>
                </div>
              )}
              
              {api.statusCode && (
                <div>
                  <span className="text-muted-foreground">Status Code:</span>
                  <div className="font-medium">{api.statusCode}</div>
                </div>
              )}
              
              {api.lastCheck && (
                <div>
                  <span className="text-muted-foreground">Last Check:</span>
                  <div className="font-medium">
                    {new Date(api.lastCheck).toLocaleTimeString()}
                  </div>
                </div>
              )}
              
              <div>
                <span className="text-muted-foreground">Uptime:</span>
                <div className="font-medium">{api.uptime || 0}%</div>
              </div>
            </div>
            
            {api.error && (
              <Alert className="mt-3 border-red-200 bg-red-50">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {api.error}
                </AlertDescription>
              </Alert>
            )}
            
            {api.endpoint && (
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <ExternalLink className="w-3 h-3" />
                <span className="font-mono truncate">{api.endpoint}</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function getStatusIcon(status) {
  switch (status) {
    case 'healthy':
      return <CheckCircle className="w-4 h-4 text-green-500" />
    case 'timeout':
      return <Clock className="w-4 h-4 text-yellow-500" />
    case 'error':
    case 'unhealthy':
      return <XCircle className="w-4 h-4 text-red-500" />
    default:
      return <AlertTriangle className="w-4 h-4 text-gray-500" />
  }
}

function getStatusColor(status) {
  switch (status) {
    case 'healthy':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'timeout':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'error':
    case 'unhealthy':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}