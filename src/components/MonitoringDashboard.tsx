import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { useKV } from '@github/spark/hooks'
import { 
  Activity, 
  Users, 
  Server, 
  Database, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  TrendUp,
  TrendDown,
  Cpu,
  HardDrive,
  Wifi,
  Globe,
  CreditCard,
  Eye,
  MousePointer,
  Target,
  ArrowUp,
  ArrowDown,
  Warning,
  Info
} from '@phosphor-icons/react'
import { useLanguage } from '../contexts/LanguageContext'

interface SystemMetrics {
  uptime: number
  responseTime: number
  errorRate: number
  cpuUsage: number
  memoryUsage: number
  dbConnections: number
  apiCalls: number
  status: 'healthy' | 'warning' | 'error'
}

interface UserMetrics {
  totalUsers: number
  activeUsers: number
  newUsers: number
  churnRate: number
  avgSessionTime: number
  pageViews: number
  conversionRate: number
  revenueGrowth: number
}

interface PerformanceAlert {
  id: string
  type: 'error' | 'warning' | 'info'
  message: string
  timestamp: Date
  resolved: boolean
}

export function MonitoringDashboard() {
  const { t } = useLanguage()
  const [systemMetrics, setSystemMetrics] = useKV<SystemMetrics>('system-metrics', {
    uptime: 99.8,
    responseTime: 245,
    errorRate: 0.02,
    cpuUsage: 35,
    memoryUsage: 68,
    dbConnections: 12,
    apiCalls: 1542,
    status: 'healthy'
  })

  const [userMetrics, setUserMetrics] = useKV<UserMetrics>('user-metrics', {
    totalUsers: 1247,
    activeUsers: 423,
    newUsers: 89,
    churnRate: 2.1,
    avgSessionTime: 18.5,
    pageViews: 8934,
    conversionRate: 3.4,
    revenueGrowth: 12.8
  })

  const [alerts, setAlerts] = useKV<PerformanceAlert[]>('performance-alerts', [
    {
      id: '1',
      type: 'warning',
      message: 'API response time increased by 15% in the last hour',
      timestamp: new Date(Date.now() - 3600000),
      resolved: false
    },
    {
      id: '2',
      type: 'info',
      message: 'Daily backup completed successfully',
      timestamp: new Date(Date.now() - 7200000),
      resolved: true
    },
    {
      id: '3',
      type: 'error',
      message: 'Failed payment processing for user #1234',
      timestamp: new Date(Date.now() - 1800000),
      resolved: false
    }
  ])

  const [realtimeData, setRealtimeData] = useState({
    currentUsers: 156,
    requestsPerSecond: 23,
    errorCount: 2,
    lastUpdated: new Date()
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeData(prev => ({
        currentUsers: Math.floor(Math.random() * 50) + 120,
        requestsPerSecond: Math.floor(Math.random() * 30) + 15,
        errorCount: Math.floor(Math.random() * 5),
        lastUpdated: new Date()
      }))

      // Update system metrics occasionally
      if (Math.random() > 0.7) {
        setSystemMetrics(prev => ({
          ...prev,
          responseTime: Math.floor(Math.random() * 100) + 200,
          cpuUsage: Math.floor(Math.random() * 40) + 20,
          memoryUsage: Math.floor(Math.random() * 30) + 50,
          apiCalls: prev.apiCalls + Math.floor(Math.random() * 20)
        }))
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [setSystemMetrics])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'error': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy': return <Badge className="bg-green-100 text-green-800">Healthy</Badge>
      case 'warning': return <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
      case 'error': return <Badge className="bg-red-100 text-red-800">Error</Badge>
      default: return <Badge>Unknown</Badge>
    }
  }

  const resolveAlert = (alertId: string) => {
    setAlerts(currentAlerts => 
      currentAlerts.map(alert => 
        alert.id === alertId ? { ...alert, resolved: true } : alert
      )
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            {t('monitoring.title', 'System Monitoring')}
          </h2>
          <p className="text-muted-foreground">
            {t('monitoring.subtitle', 'Real-time analytics and system performance tracking')}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Last updated</p>
          <p className="text-sm font-medium">{realtimeData.lastUpdated.toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Real-time Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Users</p>
                <p className="text-2xl font-bold text-foreground">{realtimeData.currentUsers}</p>
                <div className="flex items-center text-xs text-green-600">
                  <ArrowUp className="w-3 h-3 mr-1" />
                  <span>+12% from yesterday</span>
                </div>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" weight="fill" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Requests/sec</p>
                <p className="text-2xl font-bold text-foreground">{realtimeData.requestsPerSecond}</p>
                <div className="flex items-center text-xs text-yellow-600">
                  <TrendUp className="w-3 h-3 mr-1" />
                  <span>Normal load</span>
                </div>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-600" weight="fill" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Errors</p>
                <p className="text-2xl font-bold text-foreground">{realtimeData.errorCount}</p>
                <div className="flex items-center text-xs text-red-600">
                  <Warning className="w-3 h-3 mr-1" />
                  <span>Requires attention</span>
                </div>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" weight="fill" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="system" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="system">System Health</TabsTrigger>
          <TabsTrigger value="users">User Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  System Status
                </CardTitle>
                <CardDescription>Overall system health indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Overall Status</span>
                  {getStatusBadge(systemMetrics.status)}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Uptime</span>
                      <span>{systemMetrics.uptime}%</span>
                    </div>
                    <Progress value={systemMetrics.uptime} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>CPU Usage</span>
                      <span>{systemMetrics.cpuUsage}%</span>
                    </div>
                    <Progress value={systemMetrics.cpuUsage} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Memory Usage</span>
                      <span>{systemMetrics.memoryUsage}%</span>
                    </div>
                    <Progress value={systemMetrics.memoryUsage} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Database & API
                </CardTitle>
                <CardDescription>Database connections and API performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Response Time</p>
                    <p className="text-lg font-semibold">{systemMetrics.responseTime}ms</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Error Rate</p>
                    <p className="text-lg font-semibold">{systemMetrics.errorRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">DB Connections</p>
                    <p className="text-lg font-semibold">{systemMetrics.dbConnections}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">API Calls Today</p>
                    <p className="text-lg font-semibold">{systemMetrics.apiCalls.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { icon: Cpu, label: 'CPU Load', value: `${systemMetrics.cpuUsage}%`, status: systemMetrics.cpuUsage > 80 ? 'error' : 'healthy' },
              { icon: HardDrive, label: 'Disk Usage', value: '42%', status: 'healthy' },
              { icon: Wifi, label: 'Network', value: '1.2 GB/s', status: 'healthy' },
              { icon: Globe, label: 'CDN Status', value: 'Online', status: 'healthy' }
            ].map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      metric.status === 'healthy' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <metric.icon className={`w-4 h-4 ${getStatusColor(metric.status)}`} weight="fill" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{metric.label}</p>
                      <p className="text-sm font-semibold">{metric.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Total Users',
                value: userMetrics.totalUsers.toLocaleString(),
                change: '+5.2%',
                trend: 'up',
                icon: Users,
                color: 'blue'
              },
              {
                title: 'Active Users',
                value: userMetrics.activeUsers.toLocaleString(),
                change: '+12.1%',
                trend: 'up',
                icon: Activity,
                color: 'green'
              },
              {
                title: 'New Users',
                value: userMetrics.newUsers.toLocaleString(),
                change: '+8.7%',
                trend: 'up',
                icon: TrendUp,
                color: 'purple'
              },
              {
                title: 'Churn Rate',
                value: `${userMetrics.churnRate}%`,
                change: '-0.5%',
                trend: 'down',
                icon: TrendDown,
                color: 'red'
              }
            ].map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                      <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                      <div className={`flex items-center text-xs ${
                        metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.trend === 'up' ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                        <span>{metric.change}</span>
                      </div>
                    </div>
                    <div className={`w-10 h-10 bg-${metric.color}-100 rounded-lg flex items-center justify-center`}>
                      <metric.icon className={`w-5 h-5 text-${metric.color}-600`} weight="fill" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
                <CardDescription>User behavior and interaction metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Session Time</p>
                    <p className="text-lg font-semibold">{userMetrics.avgSessionTime} min</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Page Views</p>
                    <p className="text-lg font-semibold">{userMetrics.pageViews.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Conversion Rate</p>
                    <p className="text-lg font-semibold">{userMetrics.conversionRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue Growth</p>
                    <p className="text-lg font-semibold text-green-600">+{userMetrics.revenueGrowth}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
                <CardDescription>User segments and plan distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Free Plan</span>
                    <span className="text-sm font-semibold">65%</span>
                  </div>
                  <Progress value={65} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pro Plan</span>
                    <span className="text-sm font-semibold">28%</span>
                  </div>
                  <Progress value={28} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Premium Plan</span>
                    <span className="text-sm font-semibold">7%</span>
                  </div>
                  <Progress value={7} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">API Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>OpenAI API</span>
                    <span className="text-green-600">245ms</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Facebook API</span>
                    <span className="text-yellow-600">892ms</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Supabase</span>
                    <span className="text-green-600">156ms</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Payment API</span>
                    <span className="text-green-600">321ms</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Resource Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Credits Used Today</span>
                      <span>1,247 / 5,000</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Storage Used</span>
                      <span>2.4GB / 10GB</span>
                    </div>
                    <Progress value={24} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Bandwidth</span>
                      <span>127GB / 500GB</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Success Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>API Calls</span>
                    <span className="text-green-600">99.2%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Payment Processing</span>
                    <span className="text-green-600">98.7%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Content Generation</span>
                    <span className="text-green-600">99.8%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Email Delivery</span>
                    <span className="text-yellow-600">94.3%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Alerts</CardTitle>
              <CardDescription>System alerts and notifications requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.filter(alert => !alert.resolved).map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-4 border rounded-lg">
                    <div className="mt-0.5">
                      {alert.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-600" />}
                      {alert.type === 'warning' && <Warning className="w-5 h-5 text-yellow-600" />}
                      {alert.type === 'info' && <Info className="w-5 h-5 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {alert.timestamp.toLocaleString()}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => resolveAlert(alert.id)}
                    >
                      Resolve
                    </Button>
                  </div>
                ))}
                
                {alerts.filter(alert => !alert.resolved).length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">All Clear!</h3>
                    <p className="text-muted-foreground">No active alerts at this time</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Recently resolved alerts and system events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.filter(alert => alert.resolved).map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground">
                        Resolved • {alert.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}