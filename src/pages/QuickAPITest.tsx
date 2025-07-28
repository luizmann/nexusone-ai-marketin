import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Clock, AlertCircle, Play } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { API_KEYS } from '@/config/api-keys'

interface APITest {
  name: string
  status: 'idle' | 'testing' | 'success' | 'error'
  message: string
  responseTime?: number
}

export function QuickAPITest() {
  const [tests, setTests] = useState<APITest[]>([
    { name: 'OpenAI GPT-4', status: 'idle', message: 'Ready to test' },
    { name: 'ElevenLabs TTS', status: 'idle', message: 'Ready to test' },
    { name: 'Replicate Images', status: 'idle', message: 'Ready to test' },
    { name: 'Luma AI Video', status: 'idle', message: 'Ready to test' },
    { name: 'Unsplash Images', status: 'idle', message: 'Ready to test' },
    { name: 'Supabase Database', status: 'idle', message: 'Ready to test' },
    { name: 'CJ Dropshipping', status: 'idle', message: 'Ready to test' },
    { name: 'Facebook API', status: 'idle', message: 'Ready to test' }
  ])

  const updateTestStatus = (name: string, status: APITest['status'], message: string, responseTime?: number) => {
    setTests(prev => prev.map(test => 
      test.name === name ? { ...test, status, message, responseTime } : test
    ))
  }

  const testOpenAI = async () => {
    updateTestStatus('OpenAI GPT-4', 'testing', 'Testing connection...')
    const startTime = Date.now()

    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${API_KEYS.openai.key}`,
          'Content-Type': 'application/json'
        }
      })

      const responseTime = Date.now() - startTime

      if (response.ok) {
        updateTestStatus('OpenAI GPT-4', 'success', '✅ API connected successfully', responseTime)
      } else {
        updateTestStatus('OpenAI GPT-4', 'error', `❌ API error: ${response.status}`, responseTime)
      }
    } catch (error) {
      updateTestStatus('OpenAI GPT-4', 'error', `❌ Network error: ${error instanceof Error ? error.message : 'Unknown'}`)
    }
  }

  const testElevenLabs = async () => {
    updateTestStatus('ElevenLabs TTS', 'testing', 'Testing connection...')
    const startTime = Date.now()

    try {
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': API_KEYS.elevenlabs.key
        }
      })

      const responseTime = Date.now() - startTime

      if (response.ok) {
        updateTestStatus('ElevenLabs TTS', 'success', '✅ Voice API connected', responseTime)
      } else {
        updateTestStatus('ElevenLabs TTS', 'error', `❌ API error: ${response.status}`, responseTime)
      }
    } catch (error) {
      updateTestStatus('ElevenLabs TTS', 'error', `❌ Network error: ${error instanceof Error ? error.message : 'Unknown'}`)
    }
  }

  const testReplicate = async () => {
    updateTestStatus('Replicate Images', 'testing', 'Testing connection...')
    const startTime = Date.now()

    try {
      const response = await fetch('https://api.replicate.com/v1/models', {
        headers: {
          'Authorization': `Token ${API_KEYS.replicate.key}`
        }
      })

      const responseTime = Date.now() - startTime

      if (response.ok) {
        updateTestStatus('Replicate Images', 'success', '✅ Image generation API connected', responseTime)
      } else {
        updateTestStatus('Replicate Images', 'error', `❌ API error: ${response.status}`, responseTime)
      }
    } catch (error) {
      updateTestStatus('Replicate Images', 'error', `❌ Network error: ${error instanceof Error ? error.message : 'Unknown'}`)
    }
  }

  const testLuma = async () => {
    updateTestStatus('Luma AI Video', 'testing', 'Testing connection...')
    
    try {
      // Test the Supabase edge function
      const response = await fetch('/functions/v1/luma-video-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEYS.supabase.anonKey}`
        },
        body: JSON.stringify({
          prompt: 'A beautiful sunset over mountains',
          aspectRatio: '16:9'
        })
      })

      if (response.ok) {
        updateTestStatus('Luma AI Video', 'success', '✅ Video generation available')
      } else {
        updateTestStatus('Luma AI Video', 'error', '⚠️ Function deployed, direct API test needed')
      }
    } catch (error) {
      updateTestStatus('Luma AI Video', 'error', '⚠️ Function available, testing via edge function')
    }
  }

  const testUnsplash = async () => {
    updateTestStatus('Unsplash Images', 'testing', 'Testing connection...')
    const startTime = Date.now()

    try {
      const response = await fetch(`https://api.unsplash.com/photos/random?query=business&count=1`, {
        headers: {
          'Authorization': `Client-ID ${API_KEYS.unsplash.key}`
        }
      })

      const responseTime = Date.now() - startTime

      if (response.ok) {
        updateTestStatus('Unsplash Images', 'success', '✅ Stock images API connected', responseTime)
      } else {
        updateTestStatus('Unsplash Images', 'error', `❌ API error: ${response.status}`, responseTime)
      }
    } catch (error) {
      updateTestStatus('Unsplash Images', 'error', `❌ Network error: ${error instanceof Error ? error.message : 'Unknown'}`)
    }
  }

  const testSupabase = async () => {
    updateTestStatus('Supabase Database', 'testing', 'Testing connection...')
    const startTime = Date.now()

    try {
      const response = await fetch(`${API_KEYS.supabase.url}/rest/v1/`, {
        headers: {
          'apikey': API_KEYS.supabase.anonKey,
          'Authorization': `Bearer ${API_KEYS.supabase.anonKey}`
        }
      })

      const responseTime = Date.now() - startTime

      if (response.ok) {
        updateTestStatus('Supabase Database', 'success', '✅ Database connected', responseTime)
      } else {
        updateTestStatus('Supabase Database', 'error', `❌ Database error: ${response.status}`, responseTime)
      }
    } catch (error) {
      updateTestStatus('Supabase Database', 'error', `❌ Network error: ${error instanceof Error ? error.message : 'Unknown'}`)
    }
  }

  const testCJDropshipping = async () => {
    updateTestStatus('CJ Dropshipping', 'testing', 'Testing connection...')
    
    try {
      // Test via our edge function
      const response = await fetch('/functions/v1/cj-dropshipping-catalog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEYS.supabase.anonKey}`
        },
        body: JSON.stringify({
          category: 'electronics',
          limit: 5
        })
      })

      if (response.ok) {
        updateTestStatus('CJ Dropshipping', 'success', '✅ Product catalog accessible')
      } else {
        updateTestStatus('CJ Dropshipping', 'error', '⚠️ Function deployed, API test needed')
      }
    } catch (error) {
      updateTestStatus('CJ Dropshipping', 'error', '⚠️ Service available with demo data')
    }
  }

  const testFacebook = async () => {
    updateTestStatus('Facebook API', 'testing', 'Testing connection...')
    const startTime = Date.now()

    try {
      const response = await fetch(`https://graph.facebook.com/v18.0/me?access_token=${API_KEYS.facebook.accessToken}`)
      const responseTime = Date.now() - startTime

      if (response.ok) {
        updateTestStatus('Facebook API', 'success', '✅ Facebook API connected', responseTime)
      } else {
        updateTestStatus('Facebook API', 'error', `⚠️ Token needs refresh: ${response.status}`, responseTime)
      }
    } catch (error) {
      updateTestStatus('Facebook API', 'error', `❌ Network error: ${error instanceof Error ? error.message : 'Unknown'}`)
    }
  }

  const runAllTests = async () => {
    toast.info('Starting API tests...')
    
    const testFunctions = [
      testOpenAI,
      testElevenLabs, 
      testReplicate,
      testLuma,
      testUnsplash,
      testSupabase,
      testCJDropshipping,
      testFacebook
    ]

    for (const testFn of testFunctions) {
      await testFn()
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    const successCount = tests.filter(t => t.status === 'success').length
    toast.success(`API testing complete! ${successCount}/${tests.length} APIs working`)
  }

  const getStatusIcon = (status: APITest['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'testing':
        return <Clock className="h-5 w-5 text-blue-500 animate-spin" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: APITest['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      case 'testing':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const successCount = tests.filter(t => t.status === 'success').length
  const errorCount = tests.filter(t => t.status === 'error').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">🔍 Quick API Test</h1>
          <p className="text-muted-foreground">
            Real-time validation of critical API integrations
          </p>
        </div>
        <Button onClick={runAllTests} className="flex items-center gap-2">
          <Play className="h-4 w-4" />
          Test All APIs
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{successCount}</div>
              <div className="text-sm text-muted-foreground">Working</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{errorCount}</div>
              <div className="text-sm text-muted-foreground">Issues</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{tests.length}</div>
              <div className="text-sm text-muted-foreground">Total APIs</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {tests.map((test, index) => (
          <Card key={index} className="transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(test.status)}
                  <div>
                    <h3 className="font-medium">{test.name}</h3>
                    <p className="text-sm text-muted-foreground">{test.message}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {test.responseTime && (
                    <span className="text-xs text-muted-foreground">
                      {test.responseTime}ms
                    </span>
                  )}
                  <Badge className={getStatusColor(test.status)}>
                    {test.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>🎯 API Configuration Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-green-600 mb-2">✅ Configured APIs</h4>
              <ul className="text-sm space-y-1">
                <li>• OpenAI GPT-4 (Content Generation)</li>
                <li>• ElevenLabs (Text-to-Speech)</li>
                <li>• Replicate (Image Generation)</li>
                <li>• Luma AI (Video Generation)</li>
                <li>• Unsplash (Stock Images)</li>
                <li>• Supabase (Database)</li>
                <li>• CJ Dropshipping (Products)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-yellow-600 mb-2">⚠️ Needs Attention</h4>
              <ul className="text-sm space-y-1">
                <li>• Facebook API (Token refresh needed)</li>
                <li>• D-ID API (Not configured)</li>
                <li>• Runway API (Not configured)</li>
                <li>• Google APIs (Not configured)</li>
                <li>• Stripe (Not configured)</li>
                <li>• PayPal (Not configured)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}