import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  MessageCircle, 
  Bot,
  Settings,
  BarChart3,
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw
} from '@phosphor-icons/react'

interface WhatsAppIntegration {
  id: string
  botId: string
  phoneNumber: string
  webhookUrl: string
  accessToken: string
  verifyToken: string
  isActive: boolean
  messagesSent: number
  messagesReceived: number
  successRate: number
  lastActivity: string
  status: 'connected' | 'disconnected' | 'error' | 'pending'
}

interface AppointmentWebhookProps {
  botId: string
  businessName: string
  phoneNumber: string
  onBack: () => void
}

export function AppointmentWebhook({ botId, businessName, phoneNumber, onBack }: AppointmentWebhookProps) {
  const { t, isRTL } = useLanguage()
  const [integration, setIntegration] = useKV<WhatsAppIntegration | null>(`whatsapp-integration-${botId}`, null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [webhookLogs, setWebhookLogs] = useKV<any[]>(`webhook-logs-${botId}`, [])

  // Simular dados de integração para demonstração
  useEffect(() => {
    if (!integration) {
      const sampleIntegration: WhatsAppIntegration = {
        id: `integration_${botId}`,
        botId,
        phoneNumber,
        webhookUrl: `https://nexusone.ai/webhook/whatsapp/${botId}`,
        accessToken: 'EAAxxxxxxxxxxxxxxxx',
        verifyToken: `verify_${botId}`,
        isActive: true,
        messagesSent: 156,
        messagesReceived: 89,
        successRate: 94.5,
        lastActivity: new Date().toISOString(),
        status: 'connected'
      }
      setIntegration(sampleIntegration)
    }
  }, [botId, phoneNumber, integration, setIntegration])

  const connectWhatsApp = async () => {
    setIsConnecting(true)
    
    try {
      // Simular processo de conexão com WhatsApp Business API
      const prompt = spark.llmPrompt`
        Configure WhatsApp Business API webhook for appointment bot:
        Business: ${businessName}
        Phone: ${phoneNumber}
        Bot ID: ${botId}
        Setup webhook URL and verify token for receiving messages
      `

      await spark.llm(prompt)
      
      // Simular delay de configuração
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const newIntegration: WhatsAppIntegration = {
        id: `integration_${botId}`,
        botId,
        phoneNumber,
        webhookUrl: `https://nexusone.ai/webhook/whatsapp/${botId}`,
        accessToken: 'EAAxxxxxxxxxxxxxxxx',
        verifyToken: `verify_${botId}`,
        isActive: true,
        messagesSent: 0,
        messagesReceived: 0,
        successRate: 100,
        lastActivity: new Date().toISOString(),
        status: 'connected'
      }
      
      setIntegration(newIntegration)
      toast.success('WhatsApp conectado com sucesso!')
      
    } catch (error) {
      toast.error('Erro ao conectar WhatsApp')
      if (integration) {
        setIntegration({ ...integration, status: 'error' })
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWhatsApp = async () => {
    if (!integration) return
    
    setIntegration({ ...integration, status: 'disconnected', isActive: false })
    toast.success('WhatsApp desconectado')
  }

  const testWebhook = async () => {
    if (!integration) return
    
    try {
      const prompt = spark.llmPrompt`
        Test WhatsApp webhook for appointment bot:
        Send test message to verify connection is working
        Bot ID: ${botId}
        Phone: ${phoneNumber}
      `

      await spark.llm(prompt)
      
      // Simular teste de webhook
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Adicionar log de teste
      const testLog = {
        id: `test_${Date.now()}`,
        timestamp: new Date().toISOString(),
        type: 'test',
        status: 'success',
        message: 'Webhook test successful',
        from: 'system',
        to: phoneNumber
      }
      
      setWebhookLogs(current => [testLog, ...current.slice(0, 9)])
      
      setIntegration(current => current ? {
        ...current,
        lastActivity: new Date().toISOString(),
        successRate: Math.min(100, current.successRate + 0.5)
      } : null)
      
      toast.success('Teste de webhook realizado com sucesso!')
      
    } catch (error) {
      toast.error('Erro no teste de webhook')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'default'
      case 'disconnected': return 'secondary'
      case 'error': return 'destructive'
      case 'pending': return 'secondary'
      default: return 'secondary'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="w-4 h-4" />
      case 'disconnected': return <XCircle className="w-4 h-4" />
      case 'error': return <XCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Button variant="outline" onClick={onBack} className="mb-4">
            ← Voltar
          </Button>
          <h1 className="text-3xl font-bold text-primary">
            Integração WhatsApp
          </h1>
          <p className="text-muted-foreground mt-2">
            {businessName} • {phoneNumber}
          </p>
        </div>
      </div>

      {/* Status da Conexão */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5" />
            <span>Status da Conexão WhatsApp</span>
          </CardTitle>
          <CardDescription>
            Configure e monitore a integração com WhatsApp Business API
          </CardDescription>
        </CardHeader>
        <CardContent>
          {integration ? (
            <div className="space-y-6">
              {/* Status Atual */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">{phoneNumber}</span>
                      <Badge variant={getStatusColor(integration.status)}>
                        {getStatusIcon(integration.status)}
                        <span className="ml-1">
                          {integration.status === 'connected' && 'Conectado'}
                          {integration.status === 'disconnected' && 'Desconectado'}
                          {integration.status === 'error' && 'Erro'}
                          {integration.status === 'pending' && 'Pendente'}
                        </span>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Última atividade: {new Date(integration.lastActivity).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {integration.status === 'connected' ? (
                    <>
                      <Button variant="outline" size="sm" onClick={testWebhook}>
                        <Zap className="w-4 h-4 mr-1" />
                        Testar
                      </Button>
                      <Button variant="outline" size="sm" onClick={disconnectWhatsApp}>
                        <XCircle className="w-4 h-4 mr-1" />
                        Desconectar
                      </Button>
                    </>
                  ) : (
                    <Button onClick={connectWhatsApp} disabled={isConnecting}>
                      {isConnecting ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                          Conectando...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Conectar
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* Estatísticas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {integration.messagesSent}
                  </div>
                  <p className="text-sm text-muted-foreground">Mensagens Enviadas</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {integration.messagesReceived}
                  </div>
                  <p className="text-sm text-muted-foreground">Mensagens Recebidas</p>
                </div>
                
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {integration.successRate}%
                  </div>
                  <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
                </div>
              </div>

              {/* Configurações do Webhook */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Configurações do Webhook</h3>
                
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">URL do Webhook</label>
                    <div className="flex items-center space-x-2">
                      <code className="flex-1 p-2 bg-muted rounded text-sm">
                        {integration.webhookUrl}
                      </code>
                      <Button variant="outline" size="sm" onClick={() => {
                        navigator.clipboard.writeText(integration.webhookUrl)
                        toast.success('URL copiada!')
                      }}>
                        Copiar
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Token de Verificação</label>
                    <div className="flex items-center space-x-2">
                      <code className="flex-1 p-2 bg-muted rounded text-sm">
                        {integration.verifyToken}
                      </code>
                      <Button variant="outline" size="sm" onClick={() => {
                        navigator.clipboard.writeText(integration.verifyToken)
                        toast.success('Token copiado!')
                      }}>
                        Copiar
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Access Token</label>
                    <div className="flex items-center space-x-2">
                      <code className="flex-1 p-2 bg-muted rounded text-sm">
                        {integration.accessToken.substring(0, 20)}...
                      </code>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">WhatsApp não configurado</h3>
              <p className="text-muted-foreground mb-4">
                Configure a integração com WhatsApp Business API para começar a receber agendamentos
              </p>
              <Button onClick={connectWhatsApp} disabled={isConnecting}>
                {isConnecting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Configurando...
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Configurar WhatsApp
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Logs de Atividade */}
      {integration && webhookLogs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Logs de Atividade</span>
            </CardTitle>
            <CardDescription>
              Últimas atividades do webhook WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {webhookLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      log.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium">{log.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {log.from} → {log.to}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}