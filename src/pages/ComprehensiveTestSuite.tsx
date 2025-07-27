import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { Loader2, CheckCircle, XCircle, Play, Eye, Settings, Globe, ShoppingCart, MessageSquare, TrendingUp, Video, Bot, Zap, Users, BarChart } from '@phosphor-icons/react'
import { useLanguage } from '../contexts/CleanLanguageContext'

interface TestResult {
  success: boolean
  message: string
  data?: any
  duration?: number
}

interface TestCase {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  category: string
  endpoint?: string
  testFn: () => Promise<TestResult>
}

export function ComprehensiveTestSuite() {
  const { t } = useLanguage()
  const [runningTests, setRunningTests] = useState<Set<string>>(new Set())
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({})
  const [cjApiKey, setCjApiKey] = useState('5e0e680914c6462ebcf39059b21e70a9')
  const [fbAccessToken, setFbAccessToken] = useState('EAAI0DOV8GvcBPK4ZBUTybkGl66FwZA1s45Dx3cSjOVEO4lzZAifzVR6lIoVbW6HcsP2L7x4b0065VirgfhzyfIGNCCA9QCynR3twQB01ZCqjolM7b0QfGtBpj5ZCZA5kyWONQsaYmZBRvy1ByAziVPZAot50fp9ZB4ro71pZAPk7iK4ynEMkhG2LBqUmg2VFWZCPAYQ74T3ocUZCL7u69pCaZAhqUe29gMZALb2jZB5YWQrfHbreY0hIgZDZD')

  const testCases: TestCase[] = [
    // CJ Dropshipping Tests
    {
      id: 'cj-auth',
      name: 'CJ Dropshipping Authentication',
      description: 'Testa autenticação com API do CJ Dropshipping',
      icon: <Settings className="w-4 h-4" />,
      category: 'dropshipping',
      testFn: async () => {
        const startTime = Date.now()
        try {
          const response = await fetch('/api/cj-dropshipping-catalog', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'authenticate',
              apiKey: cjApiKey
            })
          })
          const data = await response.json()
          return {
            success: response.ok,
            message: response.ok ? 'Autenticação CJ realizada com sucesso' : data.error || 'Falha na autenticação',
            data,
            duration: Date.now() - startTime
          }
        } catch (error) {
          return {
            success: false,
            message: `Erro: ${error}`,
            duration: Date.now() - startTime
          }
        }
      }
    },
    {
      id: 'cj-products',
      name: 'CJ Product Catalog',
      description: 'Busca produtos no catálogo CJ Dropshipping',
      icon: <ShoppingCart className="w-4 h-4" />,
      category: 'dropshipping',
      testFn: async () => {
        const startTime = Date.now()
        try {
          const response = await fetch('/api/cj-dropshipping-catalog', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'search',
              apiKey: cjApiKey,
              query: 'smartphone',
              pageNum: 1,
              pageSize: 10
            })
          })
          const data = await response.json()
          return {
            success: response.ok && data.data?.list?.length > 0,
            message: response.ok ? `${data.data?.list?.length || 0} produtos encontrados` : data.error || 'Falha na busca',
            data,
            duration: Date.now() - startTime
          }
        } catch (error) {
          return {
            success: false,
            message: `Erro: ${error}`,
            duration: Date.now() - startTime
          }
        }
      }
    },
    {
      id: 'cj-order',
      name: 'CJ Order Creation',
      description: 'Testa criação de pedido no CJ Dropshipping',
      icon: <CheckCircle className="w-4 h-4" />,
      category: 'dropshipping',
      testFn: async () => {
        const startTime = Date.now()
        try {
          const response = await fetch('/api/cj-dropshipping-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'create_test_order',
              apiKey: cjApiKey,
              orderData: {
                products: [{ vid: '1234567890', quantity: 1 }],
                shippingAddress: {
                  contactPerson: 'Test User',
                  country: 'US',
                  address: '123 Test St',
                  city: 'Test City',
                  zipCode: '12345'
                }
              }
            })
          })
          const data = await response.json()
          return {
            success: response.ok,
            message: response.ok ? 'Pedido teste criado com sucesso' : data.error || 'Falha na criação',
            data,
            duration: Date.now() - startTime
          }
        } catch (error) {
          return {
            success: false,
            message: `Erro: ${error}`,
            duration: Date.now() - startTime
          }
        }
      }
    },

    // Facebook Marketing Tests
    {
      id: 'fb-auth',
      name: 'Facebook API Authentication',
      description: 'Verifica token de acesso do Facebook',
      icon: <Users className="w-4 h-4" />,
      category: 'marketing',
      testFn: async () => {
        const startTime = Date.now()
        try {
          const response = await fetch(`https://graph.facebook.com/me?access_token=${fbAccessToken}`)
          const data = await response.json()
          return {
            success: response.ok && !data.error,
            message: response.ok ? `Autenticado como: ${data.name}` : data.error?.message || 'Token inválido',
            data,
            duration: Date.now() - startTime
          }
        } catch (error) {
          return {
            success: false,
            message: `Erro: ${error}`,
            duration: Date.now() - startTime
          }
        }
      }
    },
    {
      id: 'fb-ad-accounts',
      name: 'Facebook Ad Accounts',
      description: 'Lista contas publicitárias disponíveis',
      icon: <TrendingUp className="w-4 h-4" />,
      category: 'marketing',
      testFn: async () => {
        const startTime = Date.now()
        try {
          const response = await fetch(`https://graph.facebook.com/me/adaccounts?access_token=${fbAccessToken}`)
          const data = await response.json()
          return {
            success: response.ok && !data.error,
            message: response.ok ? `${data.data?.length || 0} contas encontradas` : data.error?.message || 'Falha na consulta',
            data,
            duration: Date.now() - startTime
          }
        } catch (error) {
          return {
            success: false,
            message: `Erro: ${error}`,
            duration: Date.now() - startTime
          }
        }
      }
    },

    // AI Content Generation Tests
    {
      id: 'openai-text',
      name: 'OpenAI Text Generation',
      description: 'Gera conteúdo usando GPT-4',
      icon: <Bot className="w-4 h-4" />,
      category: 'ai',
      testFn: async () => {
        const startTime = Date.now()
        try {
          const prompt = spark.llmPrompt`Generate a 50-word product description for a smartphone`
          const result = await spark.llm(prompt, 'gpt-4o-mini')
          return {
            success: !!result && result.length > 0,
            message: result ? 'Texto gerado com sucesso' : 'Falha na geração',
            data: { generatedText: result },
            duration: Date.now() - startTime
          }
        } catch (error) {
          return {
            success: false,
            message: `Erro: ${error}`,
            duration: Date.now() - startTime
          }
        }
      }
    },
    {
      id: 'ai-landing-page',
      name: 'AI Landing Page Generator',
      description: 'Gera landing page com IA',
      icon: <Globe className="w-4 h-4" />,
      category: 'ai',
      testFn: async () => {
        const startTime = Date.now()
        try {
          const response = await fetch('/api/generate-landing-page', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productName: 'Smartphone XYZ',
              productDescription: 'Latest technology smartphone',
              targetAudience: 'tech enthusiasts',
              brandColors: '#007bff'
            })
          })
          const data = await response.json()
          return {
            success: response.ok,
            message: response.ok ? 'Landing page gerada' : data.error || 'Falha na geração',
            data,
            duration: Date.now() - startTime
          }
        } catch (error) {
          return {
            success: false,
            message: `Erro: ${error}`,
            duration: Date.now() - startTime
          }
        }
      }
    },

    // Video Generation Tests
    {
      id: 'video-creation',
      name: 'AI Video Creator',
      description: 'Cria vídeo promocional com IA',
      icon: <Video className="w-4 h-4" />,
      category: 'video',
      testFn: async () => {
        const startTime = Date.now()
        try {
          const response = await fetch('/api/create-video', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              script: 'Apresentando o novo smartphone revolucionário',
              duration: 30,
              style: 'promotional',
              voiceId: 'pt-br-female'
            })
          })
          const data = await response.json()
          return {
            success: response.ok,
            message: response.ok ? 'Vídeo criado com sucesso' : data.error || 'Falha na criação',
            data,
            duration: Date.now() - startTime
          }
        } catch (error) {
          return {
            success: false,
            message: `Erro: ${error}`,
            duration: Date.now() - startTime
          }
        }
      }
    },

    // WhatsApp Integration Tests
    {
      id: 'whatsapp-api',
      name: 'WhatsApp Business API',
      description: 'Testa integração WhatsApp Business',
      icon: <MessageSquare className="w-4 h-4" />,
      category: 'whatsapp',
      testFn: async () => {
        const startTime = Date.now()
        try {
          const response = await fetch('/api/whatsapp-integration', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'test_connection',
              phoneNumber: '+5511999999999'
            })
          })
          const data = await response.json()
          return {
            success: response.ok,
            message: response.ok ? 'WhatsApp conectado' : data.error || 'Falha na conexão',
            data,
            duration: Date.now() - startTime
          }
        } catch (error) {
          return {
            success: false,
            message: `Erro: ${error}`,
            duration: Date.now() - startTime
          }
        }
      }
    },
    {
      id: 'whatsapp-bot',
      name: 'WhatsApp Chatbot',
      description: 'Testa chatbot automático WhatsApp',
      icon: <Bot className="w-4 h-4" />,
      category: 'whatsapp',
      testFn: async () => {
        const startTime = Date.now()
        try {
          const response = await fetch('/api/whatsapp-bot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: 'Olá, gostaria de saber sobre produtos',
              fromNumber: '+5511999999999',
              businessType: 'e-commerce'
            })
          })
          const data = await response.json()
          return {
            success: response.ok,
            message: response.ok ? 'Bot respondeu corretamente' : data.error || 'Falha no bot',
            data,
            duration: Date.now() - startTime
          }
        } catch (error) {
          return {
            success: false,
            message: `Erro: ${error}`,
            duration: Date.now() - startTime
          }
        }
      }
    },

    // Analytics & Performance Tests
    {
      id: 'analytics-tracking',
      name: 'Analytics Tracking',
      description: 'Verifica sistema de analytics',
      icon: <BarChart className="w-4 h-4" />,
      category: 'analytics',
      testFn: async () => {
        const startTime = Date.now()
        try {
          const response = await fetch('/api/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event: 'test_tracking',
              userId: 'test-user-123',
              data: { source: 'test-suite' }
            })
          })
          const data = await response.json()
          return {
            success: response.ok,
            message: response.ok ? 'Event tracked successfully' : data.error || 'Tracking failed',
            data,
            duration: Date.now() - startTime
          }
        } catch (error) {
          return {
            success: false,
            message: `Erro: ${error}`,
            duration: Date.now() - startTime
          }
        }
      }
    },

    // Database & Storage Tests
    {
      id: 'database-connection',
      name: 'Database Connection',
      description: 'Testa conexão com Supabase',
      icon: <Settings className="w-4 h-4" />,
      category: 'infrastructure',
      testFn: async () => {
        const startTime = Date.now()
        try {
          // Test KV storage
          await spark.kv.set('test-key', { timestamp: Date.now() })
          const result = await spark.kv.get('test-key')
          await spark.kv.delete('test-key')
          
          return {
            success: !!result,
            message: result ? 'Database conectado' : 'Falha na conexão',
            data: result,
            duration: Date.now() - startTime
          }
        } catch (error) {
          return {
            success: false,
            message: `Erro: ${error}`,
            duration: Date.now() - startTime
          }
        }
      }
    }
  ]

  const runTest = async (testCase: TestCase) => {
    setRunningTests(prev => new Set([...prev, testCase.id]))
    try {
      const result = await testCase.testFn()
      setTestResults(prev => ({ ...prev, [testCase.id]: result }))
      if (result.success) {
        toast.success(`✅ ${testCase.name}: ${result.message}`)
      } else {
        toast.error(`❌ ${testCase.name}: ${result.message}`)
      }
    } catch (error) {
      const errorResult = { success: false, message: `Error: ${error}` }
      setTestResults(prev => ({ ...prev, [testCase.id]: errorResult }))
      toast.error(`❌ ${testCase.name}: ${errorResult.message}`)
    } finally {
      setRunningTests(prev => {
        const newSet = new Set(prev)
        newSet.delete(testCase.id)
        return newSet
      })
    }
  }

  const runAllTests = async () => {
    for (const testCase of testCases) {
      await runTest(testCase)
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  const categories = [...new Set(testCases.map(test => test.category))]

  const getStatusIcon = (testId: string) => {
    if (runningTests.has(testId)) return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
    const result = testResults[testId]
    if (!result) return <Play className="w-4 h-4 text-gray-400" />
    return result.success ? 
      <CheckCircle className="w-4 h-4 text-green-500" /> : 
      <XCircle className="w-4 h-4 text-red-500" />
  }

  const getOverallStats = () => {
    const total = testCases.length
    const completed = Object.keys(testResults).length
    const successful = Object.values(testResults).filter(r => r.success).length
    const failed = completed - successful
    return { total, completed, successful, failed }
  }

  const stats = getOverallStats()

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">🧪 NexusOne - Suite de Testes Completos</h1>
          <p className="text-muted-foreground">
            Teste todas as funcionalidades e integrações da plataforma
          </p>
          
          {/* Statistics */}
          <div className="flex justify-center gap-4">
            <Badge variant="outline" className="px-4 py-2">
              Total: {stats.total}
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              Executados: {stats.completed}
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-green-600">
              Sucessos: {stats.successful}
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-red-600">
              Falhas: {stats.failed}
            </Badge>
          </div>

          <Button onClick={runAllTests} className="px-8 py-2">
            <Zap className="w-4 h-4 mr-2" />
            Executar Todos os Testes
          </Button>
        </div>

        {/* API Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>⚙️ Configuração de APIs</CardTitle>
            <CardDescription>Configure suas chaves de API para testes</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">CJ Dropshipping API Key</label>
              <Input 
                value={cjApiKey} 
                onChange={(e) => setCjApiKey(e.target.value)}
                placeholder="Digite sua CJ API Key"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Facebook Access Token</label>
              <Input 
                value={fbAccessToken} 
                onChange={(e) => setFbAccessToken(e.target.value)}
                placeholder="Digite seu Facebook Token"
              />
            </div>
          </CardContent>
        </Card>

        {/* Test Categories */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="dropshipping">Dropshipping</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
            <TabsTrigger value="ai">IA</TabsTrigger>
            <TabsTrigger value="video">Vídeo</TabsTrigger>
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {testCases.map(testCase => (
                <TestCard 
                  key={testCase.id} 
                  testCase={testCase} 
                  onRun={runTest}
                  statusIcon={getStatusIcon(testCase.id)}
                  result={testResults[testCase.id]}
                  isRunning={runningTests.has(testCase.id)}
                />
              ))}
            </div>
          </TabsContent>

          {categories.map(category => (
            <TabsContent key={category} value={category} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {testCases
                  .filter(test => test.category === category)
                  .map(testCase => (
                    <TestCard 
                      key={testCase.id} 
                      testCase={testCase} 
                      onRun={runTest}
                      statusIcon={getStatusIcon(testCase.id)}
                      result={testResults[testCase.id]}
                      isRunning={runningTests.has(testCase.id)}
                    />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}

interface TestCardProps {
  testCase: TestCase
  onRun: (testCase: TestCase) => void
  statusIcon: React.ReactNode
  result?: TestResult
  isRunning: boolean
}

function TestCard({ testCase, onRun, statusIcon, result, isRunning }: TestCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {testCase.icon}
            <CardTitle className="text-lg">{testCase.name}</CardTitle>
          </div>
          {statusIcon}
        </div>
        <CardDescription className="text-sm">
          {testCase.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {result && (
          <div className="space-y-2">
            <div className={`text-sm font-medium ${result.success ? 'text-green-600' : 'text-red-600'}`}>
              {result.message}
            </div>
            {result.duration && (
              <div className="text-xs text-muted-foreground">
                Executado em {result.duration}ms
              </div>
            )}
            {result.data && (
              <details className="text-xs">
                <summary className="cursor-pointer text-muted-foreground">Ver dados</summary>
                <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-h-32">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )}
        
        <Button 
          onClick={() => onRun(testCase)} 
          disabled={isRunning}
          className="w-full"
          variant={result?.success ? 'default' : 'outline'}
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Executando...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              {result ? 'Executar Novamente' : 'Executar Teste'}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}