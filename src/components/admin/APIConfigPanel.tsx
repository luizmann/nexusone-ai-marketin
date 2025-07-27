import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Shield, Key, Globe, Bot, MessageSquare, ShoppingCart, Video, Zap, Check, X, AlertTriangle } from '@phosphor-icons/react'

interface APIConfig {
  name: string
  key: string
  enabled: boolean
  status: 'connected' | 'disconnected' | 'error' | 'testing'
  description: string
  icon: any
  category: string
  endpoint?: string
  testEndpoint?: string
  required: boolean
}

const defaultAPIs: APIConfig[] = [
  // AI & Generation
  {
    name: 'OpenAI',
    key: '',
    enabled: false,
    status: 'disconnected',
    description: 'GPT-4, DALL-E, Assistants API for AI generation',
    icon: Bot,
    category: 'ai',
    endpoint: 'https://api.openai.com/v1',
    testEndpoint: '/models',
    required: true
  },
  {
    name: 'NexBrain Assistant',
    key: 'asst_0jsx8eD6P3W9XGsSRRNU2Pfd',
    enabled: true,
    status: 'connected',
    description: 'Custom OpenAI Assistant for NexusOne',
    icon: Bot,
    category: 'ai',
    required: true
  },
  {
    name: 'ElevenLabs',
    key: '',
    enabled: false,
    status: 'disconnected',
    description: 'Text-to-speech voice generation',
    icon: Bot,
    category: 'ai',
    endpoint: 'https://api.elevenlabs.io/v1',
    testEndpoint: '/voices',
    required: false
  },
  {
    name: 'Replicate',
    key: '',
    enabled: false,
    status: 'disconnected',
    description: 'AI image and video generation models',
    icon: Bot,
    category: 'ai',
    endpoint: 'https://api.replicate.com/v1',
    testEndpoint: '/models',
    required: false
  },
  {
    name: 'Luma AI',
    key: '',
    enabled: false,
    status: 'disconnected',
    description: 'AI video generation platform',
    icon: Video,
    category: 'video',
    endpoint: 'https://api.lumalabs.ai/v1',
    required: false
  },
  
  // WhatsApp & Messaging
  {
    name: 'Gupshup WhatsApp',
    key: '',
    enabled: false,
    status: 'disconnected',
    description: 'WhatsApp Business API for automation',
    icon: MessageSquare,
    category: 'messaging',
    endpoint: 'https://api.gupshup.io/wa',
    testEndpoint: '/api/v1/users',
    required: true
  },
  
  // E-commerce & Dropshipping
  {
    name: 'CJ Dropshipping',
    key: '',
    enabled: false,
    status: 'disconnected',
    description: 'Product catalog and fulfillment',
    icon: ShoppingCart,
    category: 'ecommerce',
    endpoint: 'https://developers.cjdropshipping.com/api2.0',
    testEndpoint: '/v1/product/list',
    required: true
  },
  
  // Social Media & Ads
  {
    name: 'Facebook Marketing',
    key: '',
    enabled: false,
    status: 'disconnected',
    description: 'Facebook & Instagram ads management',
    icon: Globe,
    category: 'marketing',
    endpoint: 'https://graph.facebook.com/v18.0',
    testEndpoint: '/me',
    required: false
  },
  
  // Media & Assets
  {
    name: 'Unsplash',
    key: '',
    enabled: false,
    status: 'disconnected',
    description: 'High-quality stock photos',
    icon: Globe,
    category: 'media',
    endpoint: 'https://api.unsplash.com',
    testEndpoint: '/photos',
    required: false
  },
  {
    name: 'Pexels',
    key: '',
    enabled: false,
    status: 'disconnected',
    description: 'Free stock photos and videos',
    icon: Globe,
    category: 'media',
    endpoint: 'https://api.pexels.com/v1',
    testEndpoint: '/curated',
    required: false
  }
]

export function APIConfigPanel() {
  const [apis, setApis] = useState<APIConfig[]>(defaultAPIs)
  const [activeCategory, setActiveCategory] = useState('ai')
  const [testing, setTesting] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const categories = [
    { id: 'ai', label: 'AI & Generation', icon: Bot },
    { id: 'messaging', label: 'Messaging', icon: MessageSquare },
    { id: 'ecommerce', label: 'E-commerce', icon: ShoppingCart },
    { id: 'marketing', label: 'Marketing', icon: Globe },
    { id: 'video', label: 'Video', icon: Video },
    { id: 'media', label: 'Media', icon: Zap }
  ]

  const updateAPI = (name: string, updates: Partial<APIConfig>) => {
    setApis(prev => prev.map(api => 
      api.name === name ? { ...api, ...updates } : api
    ))
  }

  const testAPIConnection = async (api: APIConfig) => {
    if (!api.key || !api.testEndpoint) return
    
    setTesting(api.name)
    
    try {
      // Call our edge function to test the API
      const response = await fetch(`/api/test-api-connection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiName: api.name,
          apiKey: api.key,
          endpoint: api.endpoint + api.testEndpoint
        })
      })
      
      if (response.ok) {
        updateAPI(api.name, { status: 'connected' })
        toast.success(`${api.name} connected successfully`)
      } else {
        updateAPI(api.name, { status: 'error' })
        toast.error(`${api.name} connection failed`)
      }
    } catch (error) {
      updateAPI(api.name, { status: 'error' })
      toast.error(`${api.name} connection error`)
    } finally {
      setTesting(null)
    }
  }

  const saveConfiguration = async () => {
    setSaving(true)
    
    try {
      // Save to Supabase
      const response = await fetch(`/api/save-api-config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apis })
      })
      
      if (response.ok) {
        toast.success('API configuration saved successfully')
      } else {
        toast.error('Failed to save configuration')
      }
    } catch (error) {
      toast.error('Error saving configuration')
    } finally {
      setSaving(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <Check className="w-4 h-4 text-green-500" />
      case 'error': return <X className="w-4 h-4 text-red-500" />
      case 'testing': return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      default: return <AlertTriangle className="w-4 h-4 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      connected: 'success',
      disconnected: 'secondary',
      error: 'destructive',
      testing: 'outline'
    } as const
    
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>
  }

  const filteredAPIs = apis.filter(api => api.category === activeCategory)
  const connectedCount = apis.filter(api => api.status === 'connected').length
  const requiredCount = apis.filter(api => api.required).length
  const requiredConnected = apis.filter(api => api.required && api.status === 'connected').length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">API Configuration</h1>
          <p className="text-muted-foreground">Configure external API integrations for NexusOneAI</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-muted-foreground">
              {connectedCount}/{apis.length} APIs Connected
            </div>
            <div className="text-sm text-muted-foreground">
              {requiredConnected}/{requiredCount} Required Connected
            </div>
          </div>
          <Button onClick={saveConfiguration} disabled={saving}>
            {saving ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </div>

      {requiredConnected < requiredCount && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-800">
                {requiredCount - requiredConnected} required API(s) not configured. Some features may not work.
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid w-full grid-cols-6">
          {categories.map(category => {
            const categoryAPIs = apis.filter(api => api.category === category.id)
            const categoryConnected = categoryAPIs.filter(api => api.status === 'connected').length
            const Icon = category.icon
            
            return (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {category.label}
                <Badge variant="outline" className="ml-1">
                  {categoryConnected}/{categoryAPIs.length}
                </Badge>
              </TabsTrigger>
            )
          })}
        </TabsList>

        {categories.map(category => (
          <TabsContent key={category.id} value={category.id} className="space-y-4">
            <div className="grid gap-4">
              {filteredAPIs.map(api => {
                const Icon = api.icon
                return (
                  <Card key={api.name}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="w-6 h-6" />
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {api.name}
                              {api.required && <Badge variant="outline">Required</Badge>}
                            </CardTitle>
                            <CardDescription>{api.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(api.status)}
                          {getStatusBadge(api.status)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={api.enabled}
                            onCheckedChange={(enabled) => updateAPI(api.name, { enabled })}
                          />
                          <Label>Enable {api.name}</Label>
                        </div>
                        
                        {api.enabled && (
                          <div className="space-y-2">
                            <Label htmlFor={`${api.name}-key`}>API Key</Label>
                            <div className="flex gap-2">
                              <Input
                                id={`${api.name}-key`}
                                type="password"
                                placeholder={`Enter ${api.name} API key`}
                                value={api.key}
                                onChange={(e) => updateAPI(api.name, { key: e.target.value })}
                              />
                              {api.testEndpoint && (
                                <Button
                                  variant="outline"
                                  onClick={() => testAPIConnection(api)}
                                  disabled={!api.key || testing === api.name}
                                >
                                  {testing === api.name ? 'Testing...' : 'Test'}
                                </Button>
                              )}
                            </div>
                            {api.endpoint && (
                              <div className="text-sm text-muted-foreground">
                                Endpoint: {api.endpoint}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}