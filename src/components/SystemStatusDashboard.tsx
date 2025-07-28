import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Loader2,
  Settings,
  RefreshCw,
  Shield,
  Key
} from '@phosphor-icons/react'

interface SystemStatus {
  name: string
  status: 'active' | 'error' | 'inactive' | 'testing'
  description: string
  lastChecked?: string
  error?: string
}

export function SystemStatusDashboard() {
  const [systems, setSystems] = useState<SystemStatus[]>([])
  const [isTestingAll, setIsTestingAll] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>('')

  const checkSystemStatus = async (systemName: string): Promise<SystemStatus> => {
    try {
      const { apiService } = await import('../../services/apiService')
      const isWorking = await apiService.testAPI(systemName as any)
      
      return {
        name: systemName,
        status: isWorking ? 'active' : 'error',
        description: getSystemDescription(systemName),
        lastChecked: new Date().toLocaleTimeString(),
        error: isWorking ? undefined : 'API connection failed'
      }
    } catch (error) {
      return {
        name: systemName,
        status: 'error',
        description: getSystemDescription(systemName),
        lastChecked: new Date().toLocaleTimeString(),
        error: error.message
      }
    }
  }

  const getSystemDescription = (systemName: string): string => {
    const descriptions = {
      'openai': 'Core AI for content generation and NexBrain assistant',
      'luma': 'AI video generation from text prompts',
      'elevenlabs': 'Text-to-speech and voice synthesis',
      'replicate': 'AI image generation and processing',
      'gupshup': 'WhatsApp Business API for messaging',
      'cj_dropshipping': 'Product sourcing and order fulfillment',
      'facebook': 'Facebook & Instagram Ads automation',
      'unsplash': 'High-quality stock photos'
    }
    return descriptions[systemName] || 'System component'
  }

  const testAllSystems = async () => {
    setIsTestingAll(true)
    const systemNames = ['openai', 'luma', 'elevenlabs', 'replicate', 'gupshup', 'cj_dropshipping', 'facebook', 'unsplash']
    
    console.log('Testing all systems...')
    toast.info('Testing all system connections...')
    
    const statusPromises = systemNames.map(name => checkSystemStatus(name))
    const results = await Promise.all(statusPromises)
    
    setSystems(results)
    setLastUpdate(new Date().toLocaleString())
    setIsTestingAll(false)
    
    const activeCount = results.filter(s => s.status === 'active').length
    const totalCount = results.length
    
    if (activeCount === totalCount) {
      toast.success(`All ${totalCount} systems are operational! 🎉`)
    } else if (activeCount > totalCount / 2) {
      toast.warning(`${activeCount}/${totalCount} systems operational. Some APIs need configuration.`)
    } else {
      toast.error(`Only ${activeCount}/${totalCount} systems operational. Check API configurations.`)
    }
  }

  useEffect(() => {
    testAllSystems()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />
      case 'testing': return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
      default: return <AlertTriangle className="w-5 h-5 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      'active': { variant: 'default' as const, text: 'Active' },
      'error': { variant: 'destructive' as const, text: 'Error' },
      'testing': { variant: 'secondary' as const, text: 'Testing' },
      'inactive': { variant: 'outline' as const, text: 'Inactive' }
    }
    const config = variants[status] || variants.inactive
    return <Badge variant={config.variant}>{config.text}</Badge>
  }

  const activeCount = systems.filter(s => s.status === 'active').length
  const totalCount = systems.length
  const healthPercentage = totalCount > 0 ? Math.round((activeCount / totalCount) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <Shield className="w-6 h-6" />
            System Status Dashboard
          </h2>
          <p className="text-muted-foreground">Monitor all NexusOne AI platform integrations</p>
        </div>
        <Button onClick={testAllSystems} disabled={isTestingAll}>
          {isTestingAll ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Test All Systems
        </Button>
      </div>

      {/* Overall Health */}
      <Card>
        <CardHeader>
          <CardTitle>Overall System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-3xl font-bold ${healthPercentage >= 80 ? 'text-green-500' : healthPercentage >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                {healthPercentage}%
              </div>
              <p className="text-sm text-muted-foreground">System Health</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">{activeCount}</div>
              <p className="text-sm text-muted-foreground">Active APIs</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500">{totalCount - activeCount}</div>
              <p className="text-sm text-muted-foreground">Failed APIs</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500">{totalCount}</div>
              <p className="text-sm text-muted-foreground">Total APIs</p>
            </div>
          </div>
          
          {lastUpdate && (
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Last updated: {lastUpdate}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Health Alert */}
      {healthPercentage < 70 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>System Health Warning:</strong> Some critical APIs are not functioning properly. 
            This may affect platform functionality. Please check API configurations in the Admin panel.
          </AlertDescription>
        </Alert>
      )}

      {/* Individual System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {systems.map((system, index) => (
          <Card key={index} className={`border-l-4 ${
            system.status === 'active' ? 'border-l-green-500' : 
            system.status === 'error' ? 'border-l-red-500' : 
            'border-l-yellow-500'
          }`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg capitalize">{system.name.replace('_', ' ')}</CardTitle>
                {getStatusIcon(system.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{system.description}</p>
              
              <div className="flex items-center justify-between">
                {getStatusBadge(system.status)}
                {system.lastChecked && (
                  <span className="text-xs text-muted-foreground">
                    {system.lastChecked}
                  </span>
                )}
              </div>
              
              {system.error && (
                <div className="p-2 bg-red-50 border border-red-200 rounded">
                  <p className="text-xs text-red-700">{system.error}</p>
                </div>
              )}
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => checkSystemStatus(system.name).then(result => {
                  setSystems(prev => prev.map(s => s.name === system.name ? result : s))
                  toast.info(`${system.name} tested: ${result.status}`)
                })}
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Test Again
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Key className="w-6 h-6" />
              <span className="font-medium">Configure APIs</span>
              <span className="text-xs text-muted-foreground">Set up API keys and tokens</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <RefreshCw className="w-6 h-6" />
              <span className="font-medium">Test All Connections</span>
              <span className="text-xs text-muted-foreground">Verify all integrations</span>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Shield className="w-6 h-6" />
              <span className="font-medium">View Logs</span>
              <span className="text-xs text-muted-foreground">Check system logs</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}