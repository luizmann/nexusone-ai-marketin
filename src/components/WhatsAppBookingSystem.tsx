import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  MessageCircle, 
  Bot, 
  Calendar, 
  Clock, 
  Phone, 
  Settings, 
  Users,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  Play,
  Pause,
  Save,
  Eye,
  Link,
  Scissors,
  Coffee,
  Car,
  Stethoscope,
  PaintBrush,
  Wrench,
  GraduationCap,
  Camera,
  Sparkle,
  ShoppingBag,
  Heart,
  UtensilsCrossed
} from '@phosphor-icons/react'

interface BusinessHours {
  day: string
  isOpen: boolean
  openTime: string
  closeTime: string
  breakStart?: string
  breakEnd?: string
}

interface ServiceConfig {
  id: string
  name: string
  duration: number // em minutos
  price?: number
  description?: string
  isActive: boolean
}

interface BusinessSettings {
  automaticConfirmation: boolean
  requiresPrePayment: boolean
  cancellationHours: number
  sendReminders: boolean
  reminderHours: number
  maxDailyBookings: number
  bufferMinutes: number // tempo entre agendamentos
}

interface WhatsAppBot {
  id: string
  businessName: string
  businessType: string
  phoneNumber: string
  businessPrompt: string
  businessHours: BusinessHours[]
  services: ServiceConfig[]
  settings: BusinessSettings
  isActive: boolean
  createdAt: string
  totalBookings: number
  monthlyBookings: number
  lastActivity: string
  qrCode?: string
  webhookUrl?: string
}

const BUSINESS_TYPES = [
  { id: 'restaurant', name: 'Restaurante', icon: UtensilsCrossed, color: 'text-orange-500' },
  { id: 'beauty_salon', name: 'Salão de Beleza', icon: Sparkle, color: 'text-pink-500' },
  { id: 'barbershop', name: 'Barbearia', icon: Scissors, color: 'text-blue-500' },
  { id: 'nail_salon', name: 'Manicure/Pedicure', icon: PaintBrush, color: 'text-purple-500' },
  { id: 'locksmith', name: 'Chaveiro', icon: Wrench, color: 'text-yellow-500' },
  { id: 'auto_repair', name: 'Oficina Mecânica', icon: Car, color: 'text-gray-500' },
  { id: 'dental_clinic', name: 'Clínica Odontológica', icon: Heart, color: 'text-red-500' },
  { id: 'veterinary', name: 'Veterinário', icon: Heart, color: 'text-green-500' },
  { id: 'cleaning_service', name: 'Serviço de Limpeza', icon: Sparkle, color: 'text-blue-400' },
  { id: 'massage_therapy', name: 'Massoterapia', icon: Heart, color: 'text-indigo-500' },
  { id: 'personal_trainer', name: 'Personal Trainer', icon: Users, color: 'text-orange-600' },
  { id: 'tutoring', name: 'Aulas Particulares', icon: GraduationCap, color: 'text-blue-600' },
  { id: 'photography', name: 'Fotografia', icon: Camera, color: 'text-gray-600' },
  { id: 'coffee_shop', name: 'Cafeteria', icon: Coffee, color: 'text-amber-600' },
  { id: 'consulting', name: 'Consultoria', icon: Users, color: 'text-teal-500' },
  { id: 'other', name: 'Outros', icon: ShoppingBag, color: 'text-gray-500' }
]

const DAYS_OF_WEEK = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
]

export function WhatsAppBookingSystem() {
  const { t, isRTL } = useLanguage()
  const [whatsappBots, setWhatsappBots] = useKV<WhatsAppBot[]>('whatsapp-booking-bots', [])
  const [user] = useKV('user-profile', null)
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'analytics'>('list')
  const [selectedBot, setSelectedBot] = useState<WhatsAppBot | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  // Formulário de criação/edição
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    phoneNumber: '',
    businessPrompt: '',
    businessHours: DAYS_OF_WEEK.map(day => ({
      day,
      isOpen: day !== 'sunday',
      openTime: '09:00',
      closeTime: '18:00',
      breakStart: '12:00',
      breakEnd: '13:00'
    })),
    services: [] as ServiceConfig[],
    settings: {
      automaticConfirmation: true,
      requiresPrePayment: false,
      cancellationHours: 24,
      sendReminders: true,
      reminderHours: 2,
      maxDailyBookings: 20,
      bufferMinutes: 15
    } as BusinessSettings
  })

  const [newService, setNewService] = useState({
    name: '',
    duration: 60,
    price: 0,
    description: ''
  })

  // Templates de prompts inteligentes por tipo de negócio
  const getBusinessPromptTemplate = (businessType: string, businessName: string) => {
    const templates = {
      restaurant: `Você é Sofia, assistente virtual do restaurante ${businessName}. 

🍽️ FUNÇÃO: Auxiliar clientes com reservas de mesa de forma cordial e eficiente.

📋 PROCESSO DE RESERVA:
1. Cumprimente o cliente calorosamente
2. Pergunte: número de pessoas, data preferida, horário preferido
3. Verifique disponibilidade no sistema
4. Confirme todos os detalhes (nome, telefone, data, hora, pessoas)
5. Forneça número de confirmação da reserva
6. Informe política de cancelamento (24h de antecedência)

💬 ESTILO: Seja amigável, profissional e prestativo. Use emojis moderadamente.`,
      
      beauty_salon: `Você é Carla, assistente virtual do salão de beleza ${businessName}.

💅 FUNÇÃO: Agendar serviços de beleza com excelência no atendimento.

📋 PROCESSO DE AGENDAMENTO:
1. Cumprimente a cliente com carinho
2. Pergunte qual serviço deseja (corte, coloração, manicure, pedicure, etc.)
3. Informe duração estimada e valor do serviço
4. Ofereça opções de data e horário disponíveis
5. Confirme dados pessoais (nome, telefone)
6. Envie confirmação com detalhes do agendamento
7. Lembre sobre política de cancelamento

💬 ESTILO: Seja calorosa, atenciosa e demonstre expertise em beleza.`,

      barbershop: `Você é João, assistente virtual da barbearia ${businessName}.

✂️ FUNÇÃO: Agendar serviços masculinos com eficiência e simpatia.

📋 PROCESSO DE AGENDAMENTO:
1. Cumprimente o cliente de forma descontraída
2. Pergunte o tipo de serviço (corte, barba, combo, etc.)
3. Ofereça horários disponíveis
4. Confirme preferência de profissional (se aplicável)
5. Colete dados para contato (nome, telefone)
6. Confirme agendamento com todos os detalhes
7. Lembre sobre pontualidade

💬 ESTILO: Seja amigável, direto e use linguagem masculina casual.`,

      nail_salon: `Você é Ana, assistente virtual do estúdio de unhas ${businessName}.

💅 FUNÇÃO: Agendar serviços de manicure e pedicure com atenção aos detalhes.

📋 PROCESSO DE AGENDAMENTO:
1. Cumprimente a cliente cordialmente
2. Pergunte o serviço desejado (manicure, pedicure, nail art, etc.)
3. Informe tempo necessário e valor
4. Apresente horários disponíveis
5. Pergunte se tem preferência de esmalte ou design
6. Confirme dados pessoais e agendamento
7. Envie lembretes próximo ao horário

💬 ESTILO: Seja delicada, atenciosa e demonstre paixão pela arte das unhas.`,

      locksmith: `Você é Carlos, assistente virtual da chaveiro ${businessName}.

🔧 FUNÇÃO: Atender emergências e agendar serviços de fechaduras.

📋 PROCESSO DE ATENDIMENTO:
EMERGÊNCIAS (24h):
1. Identifique se é emergência (pessoa trancada fora)
2. Colete localização exata e telefone
3. Informe tempo estimado de chegada
4. Forneça preço do atendimento emergencial

AGENDAMENTOS NORMAIS:
1. Pergunte tipo de serviço (cópia de chave, troca de fechadura, etc.)
2. Colete endereço e detalhes do serviço
3. Ofereça horários disponíveis
4. Confirme agendamento e forneça orçamento

💬 ESTILO: Seja confiável, direto e transmita segurança.`,

      dental_clinic: `Você é Dra. Marina, assistente virtual da clínica odontológica ${businessName}.

🦷 FUNÇÃO: Agendar consultas e orientar pacientes com profissionalismo.

📋 PROCESSO DE AGENDAMENTO:
1. Cumprimente o paciente cordialmente
2. Pergunte se é primeira consulta ou retorno
3. Identifique tipo de tratamento necessário
4. Informe sobre documentos necessários (carteirinha, RG)
5. Ofereça horários com dentista disponível
6. Confirme dados pessoais e plano de saúde
7. Envie orientações pré-consulta se necessário
8. Lembre sobre política de cancelamento

💬 ESTILO: Seja profissional, empática e transmita confiança médica.`,

      other: `Você é o assistente virtual inteligente de ${businessName}.

🤖 FUNÇÃO: Auxiliar clientes com agendamentos de forma profissional e eficiente.

📋 PROCESSO GERAL:
1. Cumprimente o cliente cordialmente
2. Pergunte qual serviço deseja agendar
3. Colete informações necessárias (data, horário preferido)
4. Verifique disponibilidade no sistema
5. Confirme dados pessoais para contato
6. Forneça confirmação detalhada do agendamento
7. Informe políticas de cancelamento e remarcação

💬 ESTILO: Seja profissional, prestativo e mantenha tom amigável.`
    }
    
    return templates[businessType as keyof typeof templates] || templates.other
  }

  const createWhatsAppBot = async () => {
    if (!formData.businessName || !formData.phoneNumber || !formData.businessType) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    setIsCreating(true)
    
    try {
      // Gerar prompt inteligente usando IA
      const prompt = spark.llmPrompt`
        Crie um sistema de agendamento WhatsApp inteligente para:
        
        Negócio: ${formData.businessName}
        Tipo: ${formData.businessType}
        Telefone: ${formData.phoneNumber}
        
        Configurações:
        - Horários: ${JSON.stringify(formData.businessHours)}
        - Serviços: ${JSON.stringify(formData.services)}
        - Configurações: ${JSON.stringify(formData.settings)}
        
        Gere um webhook URL e QR Code para conectar o WhatsApp Business.
        Retorne apenas "Sistema configurado com sucesso!" 
      `

      const response = await spark.llm(prompt)
      
      const newBot: WhatsAppBot = {
        id: `whatsapp_bot_${Date.now()}`,
        businessName: formData.businessName,
        businessType: formData.businessType,
        phoneNumber: formData.phoneNumber,
        businessPrompt: formData.businessPrompt || getBusinessPromptTemplate(formData.businessType, formData.businessName),
        businessHours: formData.businessHours,
        services: formData.services,
        settings: formData.settings,
        isActive: true,
        createdAt: new Date().toISOString(),
        totalBookings: 0,
        monthlyBookings: 0,
        lastActivity: new Date().toISOString(),
        webhookUrl: `https://api.nexusone.ai/webhook/whatsapp/${Date.now()}`,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=wa.me/${formData.phoneNumber.replace(/\D/g, '')}`
      }

      setWhatsappBots(current => [...current, newBot])
      
      // Simular configuração do webhook
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Sistema de agendamento WhatsApp criado com sucesso!')
      setActiveTab('list')
      resetForm()
      
    } catch (error) {
      toast.error('Erro ao criar sistema de agendamento')
    } finally {
      setIsCreating(false)
    }
  }

  const toggleBotStatus = async (botId: string) => {
    setWhatsappBots(current => 
      current.map(bot => 
        bot.id === botId ? { ...bot, isActive: !bot.isActive } : bot
      )
    )
    toast.success('Status do bot atualizado')
  }

  const deleteBot = async (botId: string) => {
    setWhatsappBots(current => current.filter(bot => bot.id !== botId))
    toast.success('Sistema de agendamento excluído')
  }

  const addService = () => {
    if (!newService.name) return
    
    const service: ServiceConfig = {
      id: `service_${Date.now()}`,
      name: newService.name,
      duration: newService.duration,
      price: newService.price,
      description: newService.description,
      isActive: true
    }
    
    setFormData(current => ({
      ...current,
      services: [...current.services, service]
    }))
    
    setNewService({ name: '', duration: 60, price: 0, description: '' })
  }

  const removeService = (serviceId: string) => {
    setFormData(current => ({
      ...current,
      services: current.services.filter(s => s.id !== serviceId)
    }))
  }

  const resetForm = () => {
    setFormData({
      businessName: '',
      businessType: '',
      phoneNumber: '',
      businessPrompt: '',
      businessHours: DAYS_OF_WEEK.map(day => ({
        day,
        isOpen: day !== 'sunday',
        openTime: '09:00',
        closeTime: '18:00',
        breakStart: '12:00',
        breakEnd: '13:00'
      })),
      services: [],
      settings: {
        automaticConfirmation: true,
        requiresPrePayment: false,
        cancellationHours: 24,
        sendReminders: true,
        reminderHours: 2,
        maxDailyBookings: 20,
        bufferMinutes: 15
      }
    })
  }

  const updateBusinessHour = (dayIndex: number, field: string, value: any) => {
    setFormData(current => ({
      ...current,
      businessHours: current.businessHours.map((hour, index) =>
        index === dayIndex ? { ...hour, [field]: value } : hour
      )
    }))
  }

  const getBusinessTypeData = (typeId: string) => {
    return BUSINESS_TYPES.find(type => type.id === typeId) || BUSINESS_TYPES[BUSINESS_TYPES.length - 1]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-green-500" />
            Sistema de Agendamento WhatsApp
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure bots inteligentes para agendamento automático de qualquer tipo de negócio
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant={activeTab === 'list' ? 'default' : 'outline'}
            onClick={() => setActiveTab('list')}
          >
            <Bot className="w-4 h-4 mr-2" />
            Meus Sistemas
          </Button>
          <Button 
            variant={activeTab === 'create' ? 'default' : 'outline'}
            onClick={() => setActiveTab('create')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Sistema
          </Button>
          <Button 
            variant={activeTab === 'analytics' ? 'default' : 'outline'}
            onClick={() => setActiveTab('analytics')}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Relatórios
          </Button>
        </div>
      </div>

      {/* Lista de Sistemas */}
      {activeTab === 'list' && (
        <div className="grid gap-6">
          {whatsappBots.length === 0 ? (
            <Card>
              <CardContent className="text-center py-16">
                <MessageCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-3">Nenhum sistema configurado</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Crie seu primeiro sistema de agendamento WhatsApp e automatize 100% dos seus agendamentos
                </p>
                <Button onClick={() => setActiveTab('create')} size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Criar Primeiro Sistema
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {whatsappBots.map((bot) => {
                const businessType = getBusinessTypeData(bot.businessType)
                const IconComponent = businessType.icon
                
                return (
                  <Card key={bot.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-lg bg-secondary ${businessType.color}`}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div>
                            <CardTitle className="flex items-center space-x-3">
                              <span>{bot.businessName}</span>
                              <Badge variant={bot.isActive ? 'default' : 'secondary'}>
                                {bot.isActive ? 'Ativo' : 'Inativo'}
                              </Badge>
                            </CardTitle>
                            <CardDescription className="flex items-center space-x-4 mt-1">
                              <span>{businessType.name}</span>
                              <span>•</span>
                              <span>{bot.phoneNumber}</span>
                              <span>•</span>
                              <span>{bot.services.length} serviços</span>
                            </CardDescription>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleBotStatus(bot.id)}
                          >
                            {bot.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedBot(bot)
                              // Aqui você pode abrir um modal de visualização
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Copiar webhook URL
                              navigator.clipboard.writeText(bot.webhookUrl || '')
                              toast.success('URL do webhook copiada!')
                            }}
                          >
                            <Link className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteBot(bot.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-500">{bot.totalBookings}</div>
                          <div className="text-sm text-muted-foreground">Total Agendamentos</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-500">{bot.monthlyBookings}</div>
                          <div className="text-sm text-muted-foreground">Este Mês</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-500">{bot.services.length}</div>
                          <div className="text-sm text-muted-foreground">Serviços</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-orange-500">
                            {bot.settings.maxDailyBookings}
                          </div>
                          <div className="text-sm text-muted-foreground">Máx. Diário</div>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Última atividade: {new Date(bot.lastActivity).toLocaleDateString('pt-BR')}
                        </span>
                        <div className="flex items-center space-x-4">
                          {bot.settings.automaticConfirmation && (
                            <Badge variant="outline">Confirmação Automática</Badge>
                          )}
                          {bot.settings.sendReminders && (
                            <Badge variant="outline">Lembretes Ativos</Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Formulário de Criação */}
      {activeTab === 'create' && (
        <Tabs defaultValue="business" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="business">Negócio</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="hours">Horários</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          {/* Tab: Informações do Negócio */}
          <TabsContent value="business" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Negócio</CardTitle>
                <CardDescription>
                  Configure as informações básicas do seu negócio para personalizar o atendimento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Nome do Negócio *</Label>
                    <Input
                      id="businessName"
                      value={formData.businessName}
                      onChange={(e) => setFormData(current => ({
                        ...current,
                        businessName: e.target.value
                      }))}
                      placeholder="Ex: Salão Bella Vita, Barbearia do João"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Número do WhatsApp Business *</Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData(current => ({
                        ...current,
                        phoneNumber: e.target.value
                      }))}
                      placeholder="+55 11 99999-9999"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessType">Tipo de Negócio *</Label>
                  <Select 
                    value={formData.businessType}
                    onValueChange={(value) => setFormData(current => ({
                      ...current,
                      businessType: value,
                      businessPrompt: getBusinessPromptTemplate(value, current.businessName)
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo do seu negócio" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUSINESS_TYPES.map(type => {
                        const IconComponent = type.icon
                        return (
                          <SelectItem key={type.id} value={type.id}>
                            <div className="flex items-center space-x-2">
                              <IconComponent className={`w-4 h-4 ${type.color}`} />
                              <span>{type.name}</span>
                            </div>
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessPrompt">Personalização do Atendimento (Opcional)</Label>
                  <Textarea
                    id="businessPrompt"
                    value={formData.businessPrompt}
                    onChange={(e) => setFormData(current => ({
                      ...current,
                      businessPrompt: e.target.value
                    }))}
                    placeholder="Personalize como o assistente virtual deve se comportar..."
                    rows={8}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Deixe em branco para usar o template inteligente otimizado para seu tipo de negócio
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Serviços */}
          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Serviços Oferecidos</CardTitle>
                <CardDescription>
                  Configure os serviços que podem ser agendados via WhatsApp
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Adicionar Serviço */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-lg bg-secondary/30">
                  <div>
                    <Input
                      value={newService.name}
                      onChange={(e) => setNewService(current => ({
                        ...current,
                        name: e.target.value
                      }))}
                      placeholder="Nome do serviço"
                    />
                  </div>
                  <div>
                    <Input
                      type="number"
                      value={newService.duration}
                      onChange={(e) => setNewService(current => ({
                        ...current,
                        duration: parseInt(e.target.value) || 0
                      }))}
                      placeholder="Duração (min)"
                    />
                  </div>
                  <div>
                    <Input
                      type="number"
                      step="0.01"
                      value={newService.price}
                      onChange={(e) => setNewService(current => ({
                        ...current,
                        price: parseFloat(e.target.value) || 0
                      }))}
                      placeholder="Preço (R$)"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Input
                      value={newService.description}
                      onChange={(e) => setNewService(current => ({
                        ...current,
                        description: e.target.value
                      }))}
                      placeholder="Descrição (opcional)"
                    />
                  </div>
                  <div>
                    <Button onClick={addService} disabled={!newService.name} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                </div>
                
                {/* Lista de Serviços */}
                <div className="space-y-3">
                  {formData.services.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Nenhum serviço adicionado ainda</p>
                      <p className="text-sm">Adicione seus serviços usando o formulário acima</p>
                    </div>
                  ) : (
                    formData.services.map((service) => (
                      <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <span className="font-semibold">{service.name}</span>
                            <Badge variant="outline">{service.duration} min</Badge>
                            {service.price > 0 && (
                              <Badge variant="secondary">
                                R$ {service.price.toFixed(2)}
                              </Badge>
                            )}
                          </div>
                          {service.description && (
                            <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeService(service.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Horários */}
          <TabsContent value="hours" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Horários de Funcionamento</CardTitle>
                <CardDescription>
                  Configure os dias e horários que seu negócio funciona para agendamentos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {formData.businessHours.map((hour, index) => (
                    <div key={hour.day} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-24">
                        <span className="font-semibold capitalize">
                          {t(`days.${hour.day}`, hour.day)}
                        </span>
                      </div>
                      
                      <Switch
                        checked={hour.isOpen}
                        onCheckedChange={(checked) => updateBusinessHour(index, 'isOpen', checked)}
                      />
                      
                      {hour.isOpen && (
                        <>
                          <div className="flex items-center space-x-2">
                            <Label className="text-sm">Abertura:</Label>
                            <Input
                              type="time"
                              value={hour.openTime}
                              onChange={(e) => updateBusinessHour(index, 'openTime', e.target.value)}
                              className="w-32"
                            />
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Label className="text-sm">Fechamento:</Label>
                            <Input
                              type="time"
                              value={hour.closeTime}
                              onChange={(e) => updateBusinessHour(index, 'closeTime', e.target.value)}
                              className="w-32"
                            />
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Label className="text-sm">Pausa:</Label>
                            <Input
                              type="time"
                              value={hour.breakStart || ''}
                              onChange={(e) => updateBusinessHour(index, 'breakStart', e.target.value)}
                              className="w-32"
                              placeholder="Início"
                            />
                            <span className="text-sm">até</span>
                            <Input
                              type="time"
                              value={hour.breakEnd || ''}
                              onChange={(e) => updateBusinessHour(index, 'breakEnd', e.target.value)}
                              className="w-32"
                              placeholder="Fim"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Configurações */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Avançadas</CardTitle>
                <CardDescription>
                  Personalize o comportamento do sistema de agendamento
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Confirmação Automática</Label>
                        <p className="text-sm text-muted-foreground">
                          Confirma agendamentos automaticamente
                        </p>
                      </div>
                      <Switch
                        checked={formData.settings.automaticConfirmation}
                        onCheckedChange={(checked) => setFormData(current => ({
                          ...current,
                          settings: { ...current.settings, automaticConfirmation: checked }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Exigir Pré-pagamento</Label>
                        <p className="text-sm text-muted-foreground">
                          Solicita pagamento antes da confirmação
                        </p>
                      </div>
                      <Switch
                        checked={formData.settings.requiresPrePayment}
                        onCheckedChange={(checked) => setFormData(current => ({
                          ...current,
                          settings: { ...current.settings, requiresPrePayment: checked }
                        }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Enviar Lembretes</Label>
                        <p className="text-sm text-muted-foreground">
                          Envia lembretes automáticos
                        </p>
                      </div>
                      <Switch
                        checked={formData.settings.sendReminders}
                        onCheckedChange={(checked) => setFormData(current => ({
                          ...current,
                          settings: { ...current.settings, sendReminders: checked }
                        }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cancellationHours">Cancelamento (horas de antecedência)</Label>
                      <Input
                        id="cancellationHours"
                        type="number"
                        value={formData.settings.cancellationHours}
                        onChange={(e) => setFormData(current => ({
                          ...current,
                          settings: { ...current.settings, cancellationHours: parseInt(e.target.value) || 24 }
                        }))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="reminderHours">Lembrete (horas antes)</Label>
                      <Input
                        id="reminderHours"
                        type="number"
                        value={formData.settings.reminderHours}
                        onChange={(e) => setFormData(current => ({
                          ...current,
                          settings: { ...current.settings, reminderHours: parseInt(e.target.value) || 2 }
                        }))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="maxDailyBookings">Máximo de agendamentos por dia</Label>
                      <Input
                        id="maxDailyBookings"
                        type="number"
                        value={formData.settings.maxDailyBookings}
                        onChange={(e) => setFormData(current => ({
                          ...current,
                          settings: { ...current.settings, maxDailyBookings: parseInt(e.target.value) || 20 }
                        }))}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bufferMinutes">Intervalo entre agendamentos (minutos)</Label>
                      <Input
                        id="bufferMinutes"
                        type="number"
                        value={formData.settings.bufferMinutes}
                        onChange={(e) => setFormData(current => ({
                          ...current,
                          settings: { ...current.settings, bufferMinutes: parseInt(e.target.value) || 15 }
                        }))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => setActiveTab('list')}>
              Cancelar
            </Button>
            <Button onClick={createWhatsAppBot} disabled={isCreating} size="lg">
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Configurando Sistema...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Criar Sistema de Agendamento
                </>
              )}
            </Button>
          </div>
        </Tabs>
      )}

      {/* Relatórios */}
      {activeTab === 'analytics' && (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios de Agendamento</CardTitle>
              <CardDescription>
                Acompanhe o desempenho dos seus sistemas de agendamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold text-green-500">
                    {whatsappBots.reduce((sum, bot) => sum + bot.totalBookings, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total de Agendamentos</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold text-blue-500">
                    {whatsappBots.reduce((sum, bot) => sum + bot.monthlyBookings, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Este Mês</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold text-purple-500">{whatsappBots.length}</div>
                  <div className="text-sm text-muted-foreground">Sistemas Ativos</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-3xl font-bold text-orange-500">
                    {whatsappBots.filter(bot => bot.isActive).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Bots Online</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}