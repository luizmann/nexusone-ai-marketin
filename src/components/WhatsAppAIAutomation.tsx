/**
 * GupShup WhatsApp AI Frontend Interface
 * Maximum conversion optimization interface
 */

import React, { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MessageSquare, Bot, TrendingUp, Users, Zap, Target, Phone, Clock, DollarSign, BarChart3, Settings, Play, Pause, Send, Eye, CheckCircle, AlertCircle, ArrowUp, ArrowDown, MessageCircle, Calendar, Star, Award, Rocket, Crown, Activity, Globe, HeartHandshake, Timer, Smartphone } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface WhatsAppConversation {
  id: string
  phoneNumber: string
  stage: string
  intent: string
  leadScore: number
  conversionProbability: number
  lastActivity: string
  messagesCount: number
  urgencyLevel: 'high' | 'medium' | 'low'
  painPoints: string[]
}

interface AIPersonality {
  name: string
  role: string
  tone: 'professional' | 'friendly' | 'casual' | 'urgent' | 'helpful'
  approach: 'consultative' | 'direct' | 'educational' | 'emotional'
  expertise: string[]
  salesStyle: 'soft_sell' | 'hard_sell' | 'problem_solver' | 'relationship_builder'
}

interface ConversionMetrics {
  totalConversations: number
  highIntentLeads: number
  conversionReady: number
  averageLeadScore: number
  byStage: Record<string, number>
  byIntent: Record<string, number>
  dailyStats: {
    messages: number
    conversions: number
    revenue: number
  }
}

export function GupShupWhatsAppAI() {
  const [apiKey, setApiKey] = useKV('gupshup-api-key', '')
  const [appName, setAppName] = useKV('gupshup-app-name', '')
  const [isConfigured, setIsConfigured] = useState(false)
  const [isActive, setIsActive] = useKV('whatsapp-automation-active', false)
  const [conversations, setConversations] = useState<WhatsAppConversation[]>([])
  const [metrics, setMetrics] = useState<ConversionMetrics | null>(null)
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [aiPersonality, setAiPersonality] = useKV<AIPersonality>('ai-personality', {
    name: 'Sofia',
    role: 'Consultora de Automação',
    tone: 'friendly',
    approach: 'consultative',
    expertise: ['Marketing Digital', 'IA', 'Automação'],
    salesStyle: 'problem_solver'
  })
  const [broadcastMessage, setBroadcastMessage] = useState('')
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [manualMessage, setManualMessage] = useState('')
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState('')

  useEffect(() => {
    setIsConfigured(apiKey && appName)
    if (isConfigured) {
      loadConversations()
      loadMetrics()
    }
  }, [apiKey, appName, isConfigured])

  const loadConversations = async () => {
    try {
      // Mock data for demonstration - replace with actual API call
      const mockConversations: WhatsAppConversation[] = [
        {
          id: '1',
          phoneNumber: '+5511999887766',
          stage: 'qualification',
          intent: 'shopping',
          leadScore: 85,
          conversionProbability: 78,
          lastActivity: '2 min ago',
          messagesCount: 12,
          urgencyLevel: 'high',
          painPoints: ['Tempo perdido', 'Baixa conversão']
        },
        {
          id: '2',
          phoneNumber: '+5511888776655',
          stage: 'presentation',
          intent: 'shopping',
          leadScore: 72,
          conversionProbability: 65,
          lastActivity: '15 min ago',
          messagesCount: 8,
          urgencyLevel: 'medium',
          painPoints: ['Falta de automação']
        },
        {
          id: '3',
          phoneNumber: '+5511777665544',
          stage: 'closing',
          intent: 'appointment',
          leadScore: 95,
          conversionProbability: 92,
          lastActivity: '1 hour ago',
          messagesCount: 24,
          urgencyLevel: 'high',
          painPoints: ['ROI baixo', 'Concorrência']
        }
      ]
      setConversations(mockConversations)
    } catch (error) {
      console.error('Error loading conversations:', error)
      toast.error('Erro ao carregar conversas')
    }
  }

  const loadMetrics = async () => {
    try {
      // Mock metrics - replace with actual API call
      const mockMetrics: ConversionMetrics = {
        totalConversations: 156,
        highIntentLeads: 47,
        conversionReady: 23,
        averageLeadScore: 67,
        byStage: {
          greeting: 23,
          qualification: 45,
          presentation: 34,
          objection: 18,
          closing: 23,
          follow_up: 13
        },
        byIntent: {
          shopping: 78,
          support: 23,
          appointment: 34,
          information: 21
        },
        dailyStats: {
          messages: 234,
          conversions: 12,
          revenue: 15680
        }
      }
      setMetrics(mockMetrics)
    } catch (error) {
      console.error('Error loading metrics:', error)
    }
  }

  const sendManualMessage = async () => {
    if (!selectedPhoneNumber || !manualMessage) {
      toast.error('Selecione um número e digite uma mensagem')
      return
    }

    try {
      const response = await fetch('/api/gupshup-whatsapp-ai/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: selectedPhoneNumber,
          message: {
            type: 'text',
            text: manualMessage
          }
        })
      })

      const result = await response.json()
      if (result.success) {
        toast.success('Mensagem enviada com sucesso!')
        setManualMessage('')
        loadConversations()
      } else {
        toast.error('Erro ao enviar mensagem')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Erro ao enviar mensagem')
    }
  }

  const sendBroadcast = async () => {
    if (!broadcastMessage || selectedContacts.length === 0) {
      toast.error('Digite uma mensagem e selecione os contatos')
      return
    }

    try {
      const response = await fetch('/api/gupshup-whatsapp-ai/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contacts: selectedContacts,
          broadcastMessage: {
            type: 'text',
            text: broadcastMessage
          }
        })
      })

      const result = await response.json()
      toast.success(`Broadcast enviado para ${result.sent} contatos!`)
      setBroadcastMessage('')
      setSelectedContacts([])
    } catch (error) {
      console.error('Error sending broadcast:', error)
      toast.error('Erro ao enviar broadcast')
    }
  }

  const getStageColor = (stage: string) => {
    const colors = {
      greeting: 'bg-blue-100 text-blue-800',
      qualification: 'bg-yellow-100 text-yellow-800',
      presentation: 'bg-purple-100 text-purple-800',
      objection: 'bg-orange-100 text-orange-800',
      closing: 'bg-green-100 text-green-800',
      follow_up: 'bg-gray-100 text-gray-800'
    }
    return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high': return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'medium': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'low': return <CheckCircle className="w-4 h-4 text-green-500" />
      default: return null
    }
  }

  if (!isConfigured) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Bot className="w-16 h-16 mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-2">Configurar GupShup WhatsApp AI</h2>
          <p className="text-muted-foreground">Configure sua API do GupShup para começar a automatizar conversas</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configuração da API
            </CardTitle>
            <CardDescription>
              Conecte sua conta GupShup para automação inteligente de WhatsApp
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">API Key do GupShup</label>
              <Input
                type="password"
                placeholder="Sua API Key do GupShup"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Nome do App</label>
              <Input
                placeholder="Nome do seu app no GupShup"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
              />
            </div>
            <Button 
              onClick={() => setIsConfigured(true)} 
              className="w-full"
              disabled={!apiKey || !appName}
            >
              <Zap className="w-4 h-4 mr-2" />
              Ativar Automação
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with activation toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Smartphone className="w-6 h-6 text-green-600" />
            WhatsApp AI Extreme
          </h2>
          <p className="text-muted-foreground">Sistema de conversão maximizada com IA</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Automação</span>
            <Switch 
              checked={isActive} 
              onCheckedChange={setIsActive}
            />
            {isActive ? (
              <Badge className="bg-green-100 text-green-800">
                <Activity className="w-3 h-3 mr-1" />
                Ativo
              </Badge>
            ) : (
              <Badge variant="secondary">
                <Pause className="w-3 h-3 mr-1" />
                Pausado
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Overview */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Conversas Hoje</p>
                  <p className="text-2xl font-bold">{metrics.totalConversations}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Leads Quentes</p>
                  <p className="text-2xl font-bold text-green-600">{metrics.highIntentLeads}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Crown className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Prontos p/ Fechar</p>
                  <p className="text-2xl font-bold text-purple-600">{metrics.conversionReady}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Receita Hoje</p>
                  <p className="text-2xl font-bold text-yellow-600">R$ {metrics.dailyStats.revenue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="conversations" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="conversations">Conversas</TabsTrigger>
          <TabsTrigger value="ai-config">Config IA</TabsTrigger>
          <TabsTrigger value="manual">Manual</TabsTrigger>
          <TabsTrigger value="broadcast">Broadcast</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="conversations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Conversas Ativas
              </CardTitle>
              <CardDescription>
                Acompanhe todas as conversas em tempo real
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {conversations.map((conv) => (
                  <div key={conv.id} className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                       onClick={() => setSelectedConversation(conv.id)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {conv.phoneNumber.slice(-2)}
                        </div>
                        <div>
                          <p className="font-medium">{conv.phoneNumber}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge className={getStageColor(conv.stage)}>
                              {conv.stage}
                            </Badge>
                            <span>•</span>
                            <span>{conv.lastActivity}</span>
                            <span>•</span>
                            <span>{conv.messagesCount} msgs</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Lead Score</p>
                          <p className="font-bold text-lg">{conv.leadScore}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Conversão</p>
                          <p className="font-bold text-lg text-green-600">{conv.conversionProbability}%</p>
                        </div>
                        {getUrgencyIcon(conv.urgencyLevel)}
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-muted-foreground">Probabilidade de Conversão:</span>
                      </div>
                      <Progress value={conv.conversionProbability} className="h-2" />
                    </div>
                    {conv.painPoints.length > 0 && (
                      <div className="mt-2 flex gap-1 flex-wrap">
                        {conv.painPoints.map((point, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {point}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                Personalidade da IA
              </CardTitle>
              <CardDescription>
                Configure a personalidade do seu assistente para maximizar conversões
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nome do Assistente</label>
                  <Input
                    value={aiPersonality.name}
                    onChange={(e) => setAiPersonality({...aiPersonality, name: e.target.value})}
                    placeholder="Ex: Sofia, Alex, Bruno"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Função/Cargo</label>
                  <Input
                    value={aiPersonality.role}
                    onChange={(e) => setAiPersonality({...aiPersonality, role: e.target.value})}
                    placeholder="Ex: Consultora de Vendas"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Tom de Voz</label>
                  <Select value={aiPersonality.tone} onValueChange={(value: any) => setAiPersonality({...aiPersonality, tone: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Profissional</SelectItem>
                      <SelectItem value="friendly">Amigável</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                      <SelectItem value="helpful">Prestativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Abordagem</label>
                  <Select value={aiPersonality.approach} onValueChange={(value: any) => setAiPersonality({...aiPersonality, approach: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultative">Consultiva</SelectItem>
                      <SelectItem value="direct">Direta</SelectItem>
                      <SelectItem value="educational">Educativa</SelectItem>
                      <SelectItem value="emotional">Emocional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Estilo de Vendas</label>
                  <Select value={aiPersonality.salesStyle} onValueChange={(value: any) => setAiPersonality({...aiPersonality, salesStyle: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="soft_sell">Venda Suave</SelectItem>
                      <SelectItem value="hard_sell">Venda Agressiva</SelectItem>
                      <SelectItem value="problem_solver">Solucionador</SelectItem>
                      <SelectItem value="relationship_builder">Relacionamento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Áreas de Expertise (separar por vírgula)</label>
                <Input
                  value={aiPersonality.expertise.join(', ')}
                  onChange={(e) => setAiPersonality({...aiPersonality, expertise: e.target.value.split(', ').filter(Boolean)})}
                  placeholder="Ex: Marketing Digital, IA, Automação, ROI"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Envio Manual
              </CardTitle>
              <CardDescription>
                Envie mensagens manuais para contatos específicos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Número do WhatsApp</label>
                <Input
                  placeholder="+5511999887766"
                  value={selectedPhoneNumber}
                  onChange={(e) => setSelectedPhoneNumber(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Mensagem</label>
                <Textarea
                  placeholder="Digite sua mensagem aqui..."
                  value={manualMessage}
                  onChange={(e) => setManualMessage(e.target.value)}
                  rows={4}
                />
              </div>
              <Button onClick={sendManualMessage} className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Enviar Mensagem
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="broadcast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Broadcast em Massa
              </CardTitle>
              <CardDescription>
                Envie mensagens para múltiplos contatos simultaneamente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Mensagem do Broadcast</label>
                <Textarea
                  placeholder="Digite a mensagem que será enviada para todos os contatos selecionados..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  rows={4}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Contatos Selecionados</label>
                <div className="flex gap-2 flex-wrap">
                  {conversations.map((conv) => (
                    <Badge
                      key={conv.id}
                      variant={selectedContacts.includes(conv.phoneNumber) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        if (selectedContacts.includes(conv.phoneNumber)) {
                          setSelectedContacts(selectedContacts.filter(c => c !== conv.phoneNumber))
                        } else {
                          setSelectedContacts([...selectedContacts, conv.phoneNumber])
                        }
                      }}
                    >
                      {conv.phoneNumber}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {selectedContacts.length} contatos selecionados
                </p>
              </div>
              <Button onClick={sendBroadcast} className="w-full" disabled={!broadcastMessage || selectedContacts.length === 0}>
                <Globe className="w-4 h-4 mr-2" />
                Enviar Broadcast ({selectedContacts.length} contatos)
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {metrics && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Por Estágio
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(metrics.byStage).map(([stage, count]) => (
                        <div key={stage} className="flex items-center justify-between">
                          <span className="capitalize text-sm">{stage}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={(count / metrics.totalConversations) * 100} className="w-20 h-2" />
                            <span className="text-sm font-medium">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Por Intenção
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(metrics.byIntent).map(([intent, count]) => (
                        <div key={intent} className="flex items-center justify-between">
                          <span className="capitalize text-sm">{intent}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={(count / metrics.totalConversations) * 100} className="w-20 h-2" />
                            <span className="text-sm font-medium">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Performance Hoje
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <p className="text-2xl font-bold text-blue-600">{metrics.dailyStats.messages}</p>
                      <p className="text-sm text-muted-foreground">Mensagens Enviadas</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <p className="text-2xl font-bold text-green-600">{metrics.dailyStats.conversions}</p>
                      <p className="text-sm text-muted-foreground">Conversões</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <DollarSign className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                      <p className="text-2xl font-bold text-yellow-600">R$ {metrics.dailyStats.revenue.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Receita Gerada</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}