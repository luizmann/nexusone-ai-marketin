import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { useKV } from '@github/spark/hooks'
import { 
  Key, 
  Shield, 
  Globe, 
  Video, 
  MessageSquare, 
  ShoppingCart, 
  Wand2, 
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2
} from '@phosphor-icons/react'

interface ApiConfig {
  key: string
  status: 'active' | 'inactive' | 'testing' | 'error'
  lastTested?: string
  endpoint?: string
  description: string
  required: boolean
  category: string
}

export function ApiConfiguration() {
  const [apiConfigs, setApiConfigs] = useKV('api-configurations', {})
  const [testing, setTesting] = useState<Record<string, boolean>>({})
  const [saving, setSaving] = useState(false)

  const apiServices = {
    'openai': {
      name: 'OpenAI GPT-4',
      category: 'AI Generation',
      description: 'Core AI for content generation, copywriting, and NexBrain assistant',
      placeholder: 'sk-proj-...',
      required: true,
      endpoint: 'https://api.openai.com/v1/models',
      icon: Wand2
    },
    'openai-assistant': {
      name: 'OpenAI Assistant ID',
      category: 'AI Generation', 
      description: 'NexBrain Assistant ID for personalized AI interactions',
      placeholder: 'asst_...',
      required: true,
      endpoint: null,
      icon: Wand2
    },
    'elevenlabs': {
      name: 'ElevenLabs TTS',
      category: 'AI Generation',
      description: 'Text-to-speech for video narration and voice synthesis',
      placeholder: 'sk_...',
      required: false,
      endpoint: 'https://api.elevenlabs.io/v1/voices',
      icon: Video
    },
    'replicate': {
      name: 'Replicate AI',
      category: 'AI Generation',
      description: 'Image generation and AI model hosting',
      placeholder: 'r8_...',
      required: false,
      endpoint: 'https://api.replicate.com/v1/models',
      icon: Eye
    },
    'luma': {
      name: 'Luma Video AI',
      category: 'Video Generation',
      description: 'Professional video generation from text prompts',
      placeholder: 'luma-...',
      required: false,
      endpoint: null,
      icon: Video
    },
    'gupshup': {
      name: 'Gupshup WhatsApp',
      category: 'Communication',
      description: 'WhatsApp Business API for automated messaging',
      placeholder: 'sk_...',
      required: true,
      endpoint: 'https://api.gupshup.io/wa/api/v1/users',
      icon: MessageSquare
    },
    'facebook': {
      name: 'Facebook Marketing',
      category: 'Marketing',
      description: 'Facebook & Instagram Ads automation',
      placeholder: 'EAAI...',
      required: false,
      endpoint: 'https://graph.facebook.com/v18.0/me',
      icon: Globe
    },
    'cj-dropshipping': {
      name: 'CJ Dropshipping',
      category: 'E-commerce',
      description: 'Product sourcing and order fulfillment',
      placeholder: 'CJ_API_KEY',
      required: true,
      endpoint: 'https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken',
      icon: ShoppingCart
    },
    'unsplash': {
      name: 'Unsplash Images',
      category: 'Media',
      description: 'High-quality stock photos for campaigns',
      placeholder: 'Access Key',
      required: false,
      endpoint: 'https://api.unsplash.com/photos',
      icon: Eye
    },
    'supabase-url': {
      name: 'Supabase URL',
      category: 'Backend',
      description: 'Your Supabase project URL',
      placeholder: 'https://your-project.supabase.co',
      required: true,
      endpoint: null,
      icon: Shield
    },
    'supabase-anon': {
      name: 'Supabase Anon Key',
      category: 'Backend',
      description: 'Supabase anonymous public key',
      placeholder: 'eyJ...',
      required: true,
      endpoint: null,
      icon: Shield
    }
  }

  const testApiConnection = async (apiKey: string, service: any) => {
    if (!service.endpoint) {
      toast.info(`${service.name} - No endpoint to test`)
      return 'active'
    }

    setTesting(prev => ({ ...prev, [apiKey]: true }))
    
    try {
      const response = await fetch('/api/test-api-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: apiKey,
          apiKey: apiConfigs[apiKey]?.key || '',
          endpoint: service.endpoint
        })
      })

      const result = await response.json()
      
      if (result.success) {
        toast.success(`${service.name} - Connection successful!`)
        return 'active'
      } else {
        toast.error(`${service.name} - ${result.error}`)
        return 'error'
      }
    } catch (error) {
      toast.error(`${service.name} - Connection failed`)
      return 'error'
    } finally {
      setTesting(prev => ({ ...prev, [apiKey]: false }))
    }
  }

  const saveApiConfig = async (serviceKey: string, value: string) => {
    const service = apiServices[serviceKey as keyof typeof apiServices]
    if (!service) return

    const newConfig = {
      ...apiConfigs,
      [serviceKey]: {
        key: value,
        status: 'inactive' as const,
        lastTested: new Date().toISOString(),
        description: service.description,
        required: service.required,
        category: service.category
      }
    }

    setApiConfigs(newConfig)
    
    if (value.trim()) {
      const status = await testApiConnection(serviceKey, service)
      setApiConfigs(prev => ({
        ...prev,
        [serviceKey]: {
          ...prev[serviceKey],
          status
        }
      }))
    }
  }

  const saveAllConfigs = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/save-api-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ configs: apiConfigs })
      })

      if (response.ok) {
        toast.success('API configurations saved successfully!')
      } else {
        toast.error('Failed to save configurations')
      }
    } catch (error) {
      toast.error('Error saving configurations')
    } finally {
      setSaving(false)
    }
  }

  const testAllConnections = async () => {
    for (const [key, service] of Object.entries(apiServices)) {
      if (apiConfigs[key]?.key && service.endpoint) {
        await testApiConnection(key, service)
        await new Promise(resolve => setTimeout(resolve, 1000)) // Rate limiting
      }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />
      case 'testing': return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
      default: return <AlertTriangle className="w-4 h-4 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      'active': 'default',
      'error': 'destructive', 
      'testing': 'secondary',
      'inactive': 'outline'
    }
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {status}
      </Badge>
    )
  }

  const categorizedServices = Object.entries(apiServices).reduce((acc, [key, service]) => {
    if (!acc[service.category]) acc[service.category] = []
    acc[service.category].push([key, service])
    return acc
  }, {} as Record<string, [string, any][]>)

  const requiredConfigured = Object.entries(apiServices)
    .filter(([_, service]) => service.required)
    .filter(([key]) => apiConfigs[key]?.key && apiConfigs[key]?.status === 'active')
    .length

  const totalRequired = Object.values(apiServices).filter(s => s.required).length

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Key className="w-8 h-8" />
            API Configuration Center
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure all API integrations for NexusOneAI platform
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="font-medium">{requiredConfigured}/{totalRequired}</span>
            <span className="text-muted-foreground"> required APIs configured</span>
          </div>
          <Button onClick={saveAllConfigs} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Save All Configs
          </Button>
        </div>
      </div>

      {requiredConfigured < totalRequired && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{totalRequired - requiredConfigured} required APIs</strong> still need configuration.
            The platform may not function properly until all required APIs are set up.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Quick Actions</CardTitle>
            <Button variant="outline" onClick={testAllConnections}>
              Test All Connections
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(categorizedServices).map(([category, services]) => (
              <div key={category} className="text-center">
                <h3 className="font-medium mb-2">{category}</h3>
                <div className="text-2xl font-bold">
                  {services.filter(([key]) => apiConfigs[key]?.status === 'active').length}/{services.length}
                </div>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="AI Generation" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {Object.keys(categorizedServices).map(category => (
            <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(categorizedServices).map(([category, services]) => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid gap-4">
              {services.map(([key, service]) => {
                const Icon = service.icon
                const config = apiConfigs[key] || {}
                const isTestingThis = testing[key]
                
                return (
                  <Card key={key}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5" />
                          <div>
                            <CardTitle className="text-lg">{service.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {service.required && (
                            <Badge variant="outline">Required</Badge>
                          )}
                          {isTestingThis ? (
                            <Badge variant="secondary">
                              <Loader2 className="w-3 h-3 animate-spin mr-1" />
                              Testing
                            </Badge>
                          ) : (
                            getStatusBadge(config.status || 'inactive')
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={key}>API Key / Token</Label>
                        <div className="flex gap-2">
                          <Input
                            id={key}
                            type="password"
                            placeholder={service.placeholder}
                            value={config.key || ''}
                            onChange={(e) => {
                              const newConfigs = {
                                ...apiConfigs,
                                [key]: {
                                  ...config,
                                  key: e.target.value
                                }
                              }
                              setApiConfigs(newConfigs)
                            }}
                            onBlur={(e) => {
                              if (e.target.value !== config.key) {
                                saveApiConfig(key, e.target.value)
                              }
                            }}
                          />
                          {service.endpoint && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => testApiConnection(key, service)}
                              disabled={isTestingThis || !config.key}
                            >
                              {isTestingThis ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                'Test'
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {config.lastTested && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {getStatusIcon(config.status || 'inactive')}
                          Last tested: {new Date(config.lastTested).toLocaleString()}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Backend Health Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {Object.values(apiConfigs).filter(c => c.status === 'active').length}
              </div>
              <p className="text-sm text-muted-foreground">Active APIs</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-500">
                {Object.values(apiConfigs).filter(c => c.status === 'error').length}
              </div>
              <p className="text-sm text-muted-foreground">Failed APIs</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">
                {Object.values(apiConfigs).filter(c => c.status === 'inactive').length}
              </div>
              <p className="text-sm text-muted-foreground">Inactive APIs</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}