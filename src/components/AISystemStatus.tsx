import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Brain, CheckCircle, XCircle, AlertTriangle, Settings } from 'lucide-react'
import { apiService } from '../services/apiService'
import { useEffect, useState } from 'react'

interface SystemStatus {
  nexbrain: boolean
  videoGeneration: boolean
  imageGeneration: boolean
  whatsappIntegration: boolean
  ecommerce: boolean
}

interface AISystemStatusProps {
  onOpenSettings?: () => void
}

export function AISystemStatus({ onOpenSettings }: AISystemStatusProps) {
  const [status, setStatus] = useState<SystemStatus>({
    nexbrain: false,
    videoGeneration: false,
    imageGeneration: false,
    whatsappIntegration: false,
    ecommerce: false
  })

  useEffect(() => {
    checkSystemStatus()
  }, [])

  const checkSystemStatus = () => {
    const apiKeys = apiService.getAPIKeys()
    
    setStatus({
      nexbrain: !!apiKeys.openai,
      videoGeneration: !!apiKeys.luma,
      imageGeneration: !!apiKeys.replicate,
      whatsappIntegration: !!apiKeys.gupshup,
      ecommerce: !!apiKeys.cj_dropshipping
    })
  }

  const getOverallStatus = () => {
    const activeServices = Object.values(status).filter(Boolean).length
    const totalServices = Object.keys(status).length
    
    if (activeServices === totalServices) return 'optimal'
    if (activeServices >= 3) return 'good'
    if (activeServices >= 1) return 'partial'
    return 'offline'
  }

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'text-green-500' : 'text-red-500'
  }

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? CheckCircle : XCircle
  }

  const overallStatus = getOverallStatus()

  return (
    <Card className="border-l-4 border-l-primary">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg">AI System Status</h3>
              <p className="text-sm text-muted-foreground">Core AI services operational status</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge 
              variant={overallStatus === 'optimal' ? 'default' : 
                      overallStatus === 'good' ? 'secondary' : 
                      overallStatus === 'partial' ? 'outline' : 'destructive'}
              className="capitalize"
            >
              {overallStatus === 'optimal' ? '✅ Optimal' :
               overallStatus === 'good' ? '🟡 Good' :
               overallStatus === 'partial' ? '🟠 Partial' : '🔴 Offline'}
            </Badge>
            
            {onOpenSettings && (
              <Button variant="outline" size="sm" onClick={onOpenSettings}>
                <Settings className="h-4 w-4 mr-1" />
                Configure
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className={`flex items-center gap-2 p-2 rounded ${status.nexbrain ? 'bg-green-50' : 'bg-red-50'}`}>
            {(() => {
              const Icon = getStatusIcon(status.nexbrain)
              return <Icon className={`h-4 w-4 ${getStatusColor(status.nexbrain)}`} />
            })()}
            <div>
              <div className="text-sm font-medium">NexBrain</div>
              <div className="text-xs text-muted-foreground">AI Assistant</div>
            </div>
          </div>

          <div className={`flex items-center gap-2 p-2 rounded ${status.videoGeneration ? 'bg-green-50' : 'bg-red-50'}`}>
            {(() => {
              const Icon = getStatusIcon(status.videoGeneration)
              return <Icon className={`h-4 w-4 ${getStatusColor(status.videoGeneration)}`} />
            })()}
            <div>
              <div className="text-sm font-medium">Video AI</div>
              <div className="text-xs text-muted-foreground">Luma Generation</div>
            </div>
          </div>

          <div className={`flex items-center gap-2 p-2 rounded ${status.imageGeneration ? 'bg-green-50' : 'bg-red-50'}`}>
            {(() => {
              const Icon = getStatusIcon(status.imageGeneration)
              return <Icon className={`h-4 w-4 ${getStatusColor(status.imageGeneration)}`} />
            })()}
            <div>
              <div className="text-sm font-medium">Image AI</div>
              <div className="text-xs text-muted-foreground">Replicate API</div>
            </div>
          </div>

          <div className={`flex items-center gap-2 p-2 rounded ${status.whatsappIntegration ? 'bg-green-50' : 'bg-red-50'}`}>
            {(() => {
              const Icon = getStatusIcon(status.whatsappIntegration)
              return <Icon className={`h-4 w-4 ${getStatusColor(status.whatsappIntegration)}`} />
            })()}
            <div>
              <div className="text-sm font-medium">WhatsApp</div>
              <div className="text-xs text-muted-foreground">Gupshup API</div>
            </div>
          </div>

          <div className={`flex items-center gap-2 p-2 rounded ${status.ecommerce ? 'bg-green-50' : 'bg-red-50'}`}>
            {(() => {
              const Icon = getStatusIcon(status.ecommerce)
              return <Icon className={`h-4 w-4 ${getStatusColor(status.ecommerce)}`} />
            })()}
            <div>
              <div className="text-sm font-medium">E-commerce</div>
              <div className="text-xs text-muted-foreground">CJ Dropshipping</div>
            </div>
          </div>
        </div>

        {overallStatus !== 'optimal' && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-800">System Performance Notice</p>
                <p className="text-amber-700">
                  Some AI services are not configured. 
                  {status.nexbrain 
                    ? ' NexBrain is active, but additional features require API configuration.'
                    : ' Configure OpenAI API key to enable NexBrain AI assistant.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}