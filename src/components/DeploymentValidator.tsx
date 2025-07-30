import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Settings, 
  TestTube,
  Database,
  Zap,
  Globe,
  Rocket
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface DeploymentCheck {
  id: string
  name: string
  description: string
  status: 'pending' | 'checking' | 'success' | 'error'
  message: string
  critical: boolean
}

export function DeploymentValidator() {
  const [supabaseUrl, setSupabaseUrl] = useState('')
  const [anonKey, setAnonKey] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [progress, setProgress] = useState(0)
  
  const [checks, setChecks] = useState<DeploymentCheck[]>([
    {
      id: 'supabase-connection',
      name: 'Supabase Connection',
      description: 'Verify database connection and authentication',
      status: 'pending',
      message: 'Not tested',
      critical: true
    },
    {
      id: 'edge-functions',
      name: 'Edge Functions Deployment',
      description: 'Check if all Edge Functions are deployed',
      status: 'pending',
      message: 'Not tested',
      critical: true
    },
    {
      id: 'openai-integration',
      name: 'OpenAI API Integration',
      description: 'Test GPT-4 and Assistant API connectivity',
      status: 'pending',
      message: 'Not tested',
      critical: true
    },
    {
      id: 'replicate-integration',
      name: 'Replicate API Integration',
      description: 'Test AI image generation functionality',
      status: 'pending',
      message: 'Not tested',
      critical: false
    },
    {
      id: 'luma-integration',
      name: 'Luma AI Integration',
      description: 'Test AI video generation functionality',
      status: 'pending',
      message: 'Not tested',
      critical: false
    },
    {
      id: 'elevenlabs-integration',
      name: 'ElevenLabs Integration',
      description: 'Test text-to-speech functionality',
      status: 'pending',
      message: 'Not tested',
      critical: false
    },
    {
      id: 'cj-dropshipping',
      name: 'CJ Dropshipping API',
      description: 'Test product catalog integration',
      status: 'pending',
      message: 'Not tested',
      critical: false
    },
    {
      id: 'whatsapp-integration',
      name: 'WhatsApp Business API',
      description: 'Test messaging automation',
      status: 'pending',
      message: 'Not tested',
      critical: false
    },
    {
      id: 'database-schema',
      name: 'Database Schema',
      description: 'Verify all tables and RLS policies exist',
      status: 'pending',
      message: 'Not tested',
      critical: true
    },
    {
      id: 'frontend-build',
      name: 'Frontend Application',
      description: 'Check if the app loads and renders correctly',
      status: 'pending',
      message: 'Not tested',
      critical: true
    }
  ])

  // Load saved configuration
  useEffect(() => {
    const savedUrl = localStorage.getItem('supabase-url')
    const savedKey = localStorage.getItem('supabase-anon-key')
    
    if (savedUrl) setSupabaseUrl(savedUrl)
    if (savedKey) setAnonKey(savedKey)
  }, [])

  const updateCheck = (id: string, updates: Partial<DeploymentCheck>) => {
    setChecks(prev => prev.map(check => 
      check.id === id ? { ...check, ...updates } : check
    ))
  }

  const runCheck = async (check: DeploymentCheck) => {
    updateCheck(check.id, { status: 'checking', message: 'Testing...' })

    try {
      switch (check.id) {
        case 'supabase-connection':
          await testSupabaseConnection()
          break
        case 'edge-functions':
          await testEdgeFunctions()
          break
        case 'openai-integration':
          await testOpenAI()
          break
        case 'replicate-integration':
          await testReplicate()
          break
        case 'luma-integration':
          await testLuma()
          break
        case 'elevenlabs-integration':
          await testElevenLabs()
          break
        case 'cj-dropshipping':
          await testCJDropshipping()
          break
        case 'whatsapp-integration':
          await testWhatsApp()
          break
        case 'database-schema':
          await testDatabaseSchema()
          break
        case 'frontend-build':
          await testFrontend()
          break
        default:
          throw new Error('Unknown check')
      }
    } catch (error) {
      updateCheck(check.id, {
        status: 'error',
        message: error.message
      })
    }
  }

  const testSupabaseConnection = async () => {
    if (!supabaseUrl || !anonKey) {
      throw new Error('Supabase URL and Anon Key are required')
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`
      }
    })

    if (response.ok) {
      updateCheck('supabase-connection', {
        status: 'success',
        message: 'Connection successful'
      })
      // Save configuration
      localStorage.setItem('supabase-url', supabaseUrl)
      localStorage.setItem('supabase-anon-key', anonKey)
    } else {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
  }

  const testEdgeFunctions = async () => {
    const functionsToTest = [
      'openai-assistant',
      'replicate-image',
      'luma-video',
      'elevenlabs-tts',
      'cj-dropshipping-catalog',
      'facebook-ads-generator',
      'whatsapp-automation',
      'magic-page-generator',
      'campaign-generator'
    ]

    let successCount = 0
    
    for (const func of functionsToTest) {
      try {
        const response = await fetch(`${supabaseUrl}/functions/v1/${func}`, {
          method: 'OPTIONS',
          headers: {
            'apikey': anonKey,
            'Authorization': `Bearer ${anonKey}`
          }
        })
        
        if (response.status === 200 || response.status === 405) {
          successCount++
        }
      } catch (error) {
        // Function might not be deployed
      }
    }

    if (successCount === functionsToTest.length) {
      updateCheck('edge-functions', {
        status: 'success',
        message: `All ${functionsToTest.length} Edge Functions deployed`
      })
    } else if (successCount > 0) {
      updateCheck('edge-functions', {
        status: 'error',
        message: `Only ${successCount}/${functionsToTest.length} functions deployed`
      })
    } else {
      throw new Error('No Edge Functions found')
    }
  }

  const testOpenAI = async () => {
    const response = await fetch(`${supabaseUrl}/functions/v1/openai-assistant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`
      },
      body: JSON.stringify({
        prompt: 'Test connection',
        max_tokens: 10
      })
    })

    if (response.ok) {
      updateCheck('openai-integration', {
        status: 'success',
        message: 'OpenAI API connected successfully'
      })
    } else {
      const error = await response.text()
      throw new Error(`OpenAI test failed: ${error}`)
    }
  }

  const testReplicate = async () => {
    const response = await fetch(`${supabaseUrl}/functions/v1/replicate-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`
      },
      body: JSON.stringify({
        prompt: 'test image',
        model: 'black-forest-labs/flux-schnell'
      })
    })

    if (response.ok) {
      updateCheck('replicate-integration', {
        status: 'success',
        message: 'Replicate API connected successfully'
      })
    } else {
      const error = await response.text()
      if (error.includes('API key')) {
        updateCheck('replicate-integration', {
          status: 'error',
          message: 'API key not configured'
        })
      } else {
        throw new Error(`Replicate test failed: ${error}`)
      }
    }
  }

  const testLuma = async () => {
    const response = await fetch(`${supabaseUrl}/functions/v1/luma-video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`
      },
      body: JSON.stringify({
        prompt: 'test video'
      })
    })

    if (response.ok) {
      updateCheck('luma-integration', {
        status: 'success',
        message: 'Luma AI connected successfully'
      })
    } else {
      const error = await response.text()
      if (error.includes('API key')) {
        updateCheck('luma-integration', {
          status: 'error',
          message: 'API key not configured'
        })
      } else {
        throw new Error(`Luma test failed: ${error}`)
      }
    }
  }

  const testElevenLabs = async () => {
    const response = await fetch(`${supabaseUrl}/functions/v1/elevenlabs-tts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`
      },
      body: JSON.stringify({
        text: 'test',
        voice_id: 'pNInz6obpgDQGcFmaJgB'
      })
    })

    if (response.ok) {
      updateCheck('elevenlabs-integration', {
        status: 'success',
        message: 'ElevenLabs API connected successfully'
      })
    } else {
      const error = await response.text()
      if (error.includes('API key')) {
        updateCheck('elevenlabs-integration', {
          status: 'error',
          message: 'API key not configured'
        })
      } else {
        throw new Error(`ElevenLabs test failed: ${error}`)
      }
    }
  }

  const testCJDropshipping = async () => {
    const response = await fetch(`${supabaseUrl}/functions/v1/cj-dropshipping-catalog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`
      },
      body: JSON.stringify({
        search: 'test',
        page: 1,
        pageSize: 5
      })
    })

    if (response.ok) {
      updateCheck('cj-dropshipping', {
        status: 'success',
        message: 'CJ Dropshipping API connected successfully'
      })
    } else {
      const error = await response.text()
      if (error.includes('API key')) {
        updateCheck('cj-dropshipping', {
          status: 'error',
          message: 'API key not configured'
        })
      } else {
        throw new Error(`CJ Dropshipping test failed: ${error}`)
      }
    }
  }

  const testWhatsApp = async () => {
    const response = await fetch(`${supabaseUrl}/functions/v1/whatsapp-automation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`
      },
      body: JSON.stringify({
        message: 'test',
        phone: '+1234567890'
      })
    })

    if (response.ok) {
      updateCheck('whatsapp-integration', {
        status: 'success',
        message: 'WhatsApp API connected successfully'
      })
    } else {
      const error = await response.text()
      if (error.includes('API key')) {
        updateCheck('whatsapp-integration', {
          status: 'error',
          message: 'API key not configured'
        })
      } else {
        throw new Error(`WhatsApp test failed: ${error}`)
      }
    }
  }

  const testDatabaseSchema = async () => {
    const tables = [
      'profiles',
      'credits',
      'api_keys',
      'magic_pages',
      'campaigns',
      'whatsapp_numbers',
      'products',
      'sales'
    ]

    let successCount = 0

    for (const table of tables) {
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/${table}?select=count&limit=1`, {
          headers: {
            'apikey': anonKey,
            'Authorization': `Bearer ${anonKey}`
          }
        })

        if (response.ok) {
          successCount++
        }
      } catch (error) {
        // Table might not exist
      }
    }

    if (successCount === tables.length) {
      updateCheck('database-schema', {
        status: 'success',
        message: `All ${tables.length} tables exist`
      })
    } else {
      updateCheck('database-schema', {
        status: 'error',
        message: `Only ${successCount}/${tables.length} tables found`
      })
    }
  }

  const testFrontend = async () => {
    // Test if current app is working
    if (typeof window !== 'undefined' && document.getElementById('root')) {
      updateCheck('frontend-build', {
        status: 'success',
        message: 'Frontend application loaded successfully'
      })
    } else {
      throw new Error('Frontend application not loaded properly')
    }
  }

  const runAllChecks = async () => {
    setIsValidating(true)
    setProgress(0)
    
    const totalChecks = checks.length
    
    for (let i = 0; i < checks.length; i++) {
      const check = checks[i]
      await runCheck(check)
      setProgress(((i + 1) / totalChecks) * 100)
      
      // Small delay between checks
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    setIsValidating(false)
    
    const passed = checks.filter(c => c.status === 'success').length
    const failed = checks.filter(c => c.status === 'error').length
    
    if (failed === 0) {
      toast.success(`🎉 All deployment checks passed! (${passed}/${totalChecks})`)
    } else {
      toast.error(`⚠️ ${failed} checks failed (${passed}/${totalChecks} passed)`)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'checking':
        return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />
    }
  }

  const criticalChecks = checks.filter(c => c.critical)
  const nonCriticalChecks = checks.filter(c => !c.critical)
  const allCriticalPassed = criticalChecks.every(c => c.status === 'success')
  const readyForProduction = checks.every(c => c.status === 'success')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Production Deployment Validator</h2>
          <p className="text-muted-foreground">
            Verify that NexusOne AI is properly deployed and all features are working
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={runAllChecks}
            disabled={isValidating || !supabaseUrl || !anonKey}
            className="gap-2"
          >
            {isValidating ? (
              <Clock className="h-4 w-4 animate-pulse" />
            ) : (
              <TestTube className="h-4 w-4" />
            )}
            Run All Checks
          </Button>
        </div>
      </div>

      {isValidating && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Running deployment validation...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="config" className="w-full">
        <TabsList>
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="critical">Critical Checks</TabsTrigger>
          <TabsTrigger value="features">Feature Checks</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Deployment Configuration
              </CardTitle>
              <CardDescription>
                Configure your Supabase deployment details to run the validation tests
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supabase-url">Supabase URL</Label>
                  <Input
                    id="supabase-url"
                    placeholder="https://your-project.supabase.co"
                    value={supabaseUrl}
                    onChange={(e) => setSupabaseUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="anon-key">Supabase Anon Key</Label>
                  <Input
                    id="anon-key"
                    type="password"
                    placeholder="eyJhbGci..."
                    value={anonKey}
                    onChange={(e) => setAnonKey(e.target.value)}
                  />
                </div>
              </div>
              
              <Alert>
                <Database className="h-4 w-4" />
                <AlertDescription>
                  These credentials are stored locally in your browser and used only for validation tests.
                  Make sure you're using the production Supabase project credentials.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="critical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Critical System Checks
                <Badge variant={allCriticalPassed ? "default" : "destructive"}>
                  {criticalChecks.filter(c => c.status === 'success').length}/{criticalChecks.length}
                </Badge>
              </CardTitle>
              <CardDescription>
                These checks must pass for the system to work properly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {criticalChecks.map(check => (
                  <div key={check.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(check.status)}
                      <div>
                        <div className="font-medium">{check.name}</div>
                        <div className="text-sm text-muted-foreground">{check.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">{check.message}</div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => runCheck(check)}
                        disabled={check.status === 'checking'}
                      >
                        Test
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Feature Integration Checks
                <Badge variant="outline">
                  {nonCriticalChecks.filter(c => c.status === 'success').length}/{nonCriticalChecks.length}
                </Badge>
              </CardTitle>
              <CardDescription>
                These checks validate specific AI features and integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {nonCriticalChecks.map(check => (
                  <div key={check.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(check.status)}
                      <div>
                        <div className="font-medium">{check.name}</div>
                        <div className="text-sm text-muted-foreground">{check.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">{check.message}</div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => runCheck(check)}
                        disabled={check.status === 'checking'}
                      >
                        Test
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5" />
                Deployment Status Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-500">
                    {checks.filter(c => c.status === 'success').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Passed</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-red-500">
                    {checks.filter(c => c.status === 'error').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-500">
                    {checks.filter(c => c.status === 'checking').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Testing</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-muted-foreground">
                    {checks.filter(c => c.status === 'pending').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
              </div>

              {readyForProduction ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    🎉 <strong>Ready for Production!</strong> All deployment checks passed successfully. 
                    NexusOne AI is fully operational and ready to serve users.
                  </AlertDescription>
                </Alert>
              ) : allCriticalPassed ? (
                <Alert>
                  <Zap className="h-4 w-4" />
                  <AlertDescription>
                    ⚡ <strong>Core System Ready!</strong> All critical checks passed. Some AI features may need API key configuration.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert>
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    ⚠️ <strong>Deployment Issues Detected!</strong> Critical system checks failed. Please review the configuration.
                  </AlertDescription>
                </Alert>
              )}

              <div className="text-sm text-muted-foreground">
                <h4 className="font-medium mb-2">Next Steps:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {!allCriticalPassed && (
                    <li>Fix critical system issues before proceeding</li>
                  )}
                  <li>Configure API keys in the Admin Dashboard for AI features</li>
                  <li>Test user registration and authentication flow</li>
                  <li>Monitor system performance and error logs</li>
                  <li>Set up production monitoring and alerts</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}