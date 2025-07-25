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
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { useLanguage } from '../contexts/LanguageContext'
import { AppointmentManager } from './AppointmentManager'
import { AppointmentWebhook } from './AppointmentWebhook'
import { 
  Calendar, 
  Clock, 
  Phone, 
  Settings, 
  Bot,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  Play,
  Pause,
  Save,
  MessageCircle,
  Eye,
  Link
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

interface AppointmentBot {
  id: string
  businessName: string
  businessType: string
  phoneNumber: string
  businessPrompt: string
  businessHours: BusinessHours[]
  services: ServiceConfig[]
  isActive: boolean
  createdAt: string
  totalBookings: number
  lastActivity: string
}

const BUSINESS_TYPES = [
  'restaurant',
  'beauty_salon', 
  'barbershop',
  'nail_salon',
  'locksmith',
  'auto_repair',
  'dental_clinic',
  'veterinary',
  'cleaning_service',
  'massage_therapy',
  'personal_trainer',
  'tutoring',
  'photography',
  'other'
]

const DAYS_OF_WEEK = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
]

export function AppointmentScheduler() {
  const { t, isRTL } = useLanguage()
  const [appointmentBots, setAppointmentBots] = useKV<AppointmentBot[]>('appointment-bots', [])
  const [user] = useKV('user-profile', null)
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'manage' | 'webhook'>('list')
  const [selectedBot, setSelectedBot] = useState<AppointmentBot | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  // Se estiver gerenciando um bot específico, mostrar o AppointmentManager
  if (activeTab === 'manage' && selectedBot) {
    return (
      <AppointmentManager
        botId={selectedBot.id}
        businessName={selectedBot.businessName}
        onBack={() => {
          setActiveTab('list')
          setSelectedBot(null)
        }}
      />
    )
  }

  // Se estiver configurando webhook, mostrar o AppointmentWebhook
  if (activeTab === 'webhook' && selectedBot) {
    return (
      <AppointmentWebhook
        botId={selectedBot.id}
        businessName={selectedBot.businessName}
        phoneNumber={selectedBot.phoneNumber}
        onBack={() => {
          setActiveTab('list')
          setSelectedBot(null)
        }}
      />
    )
  }

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
    services: [] as ServiceConfig[]
  })

  const [newService, setNewService] = useState({
    name: '',
    duration: 60,
    price: 0,
    description: ''
  })

  // Template de prompts por tipo de negócio
  const getBusinessPromptTemplate = (businessType: string) => {
    const templates = {
      restaurant: `Você é um assistente de agendamento para o restaurante [NOME]. Ajude os clientes a fazer reservas de mesa de forma amigável e eficiente. Pergunte: número de pessoas, data preferida, horário preferido. Confirme os dados e informe que a reserva foi registrada.`,
      
      beauty_salon: `Você é um assistente de agendamento para o salão de beleza [NOME]. Ajude as clientes a agendar serviços como corte, coloração, manicure, etc. Pergunte qual serviço deseja, data e horário preferido. Informe a duração estimada e confirme o agendamento.`,
      
      barbershop: `Você é um assistente de agendamento para a barbearia [NOME]. Ajude os clientes a agendar cortes de cabelo, barba, etc. Seja amigável e pergunte: tipo de serviço, data e horário preferido. Confirme os detalhes do agendamento.`,
      
      locksmith: `Você é um assistente para a chaveiro [NOME]. Ajude clientes com emergências de fechaduras ou agendamento de serviços. Para emergências, colete localização e telefone. Para agendamentos normais, pergunte tipo de serviço, data e horário.`,
      
      dental_clinic: `Você é um assistente de agendamento para a clínica odontológica [NOME]. Ajude pacientes a agendar consultas, limpezas, procedimentos. Pergunte: tipo de consulta, preferência de data/horário, se é primeira vez na clínica.`,
      
      other: `Você é um assistente de agendamento para [NOME]. Ajude clientes a agendar serviços de forma educada e eficiente. Colete as informações necessárias: serviço desejado, data, horário. Confirme todos os detalhes antes de finalizar.`
    }
    
    return templates[businessType as keyof typeof templates] || templates.other
  }

  const createAppointmentBot = async () => {
    if (!formData.businessName || !formData.phoneNumber || !formData.businessType) {
      toast.error(t('appointment.errors.required_fields', 'Preencha todos os campos obrigatórios'))
      return
    }

    setIsCreating(true)
    
    try {
      const prompt = spark.llmPrompt`
        Configure WhatsApp appointment bot for business:
        Business: ${formData.businessName}
        Type: ${formData.businessType}
        Phone: ${formData.phoneNumber}
        Custom prompt: ${formData.businessPrompt || getBusinessPromptTemplate(formData.businessType)}
        Business hours: ${JSON.stringify(formData.businessHours)}
        Services: ${JSON.stringify(formData.services)}
      `

      const response = await spark.llm(prompt)
      
      const newBot: AppointmentBot = {
        id: `bot_${Date.now()}`,
        businessName: formData.businessName,
        businessType: formData.businessType,
        phoneNumber: formData.phoneNumber,
        businessPrompt: formData.businessPrompt || getBusinessPromptTemplate(formData.businessType),
        businessHours: formData.businessHours,
        services: formData.services,
        isActive: true,
        createdAt: new Date().toISOString(),
        totalBookings: 0,
        lastActivity: new Date().toISOString()
      }

      setAppointmentBots(current => [...current, newBot])
      
      // Simular configuração do webhook WhatsApp
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success(t('appointment.bot_created', 'Bot de agendamento criado com sucesso!'))
      setActiveTab('list')
      resetForm()
      
    } catch (error) {
      toast.error(t('appointment.errors.creation_failed', 'Erro ao criar bot de agendamento'))
    } finally {
      setIsCreating(false)
    }
  }

  const toggleBotStatus = async (botId: string) => {
    setAppointmentBots(current => 
      current.map(bot => 
        bot.id === botId ? { ...bot, isActive: !bot.isActive } : bot
      )
    )
    toast.success(t('appointment.status_updated', 'Status do bot atualizado'))
  }

  const deleteBot = async (botId: string) => {
    setAppointmentBots(current => current.filter(bot => bot.id !== botId))
    toast.success(t('appointment.bot_deleted', 'Bot excluído com sucesso'))
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
      services: []
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">
            {t('appointment.title', 'Agendamento Inteligente WhatsApp')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('appointment.description', 'Configure bots inteligentes para agendamento automático via WhatsApp')}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant={activeTab === 'list' ? 'default' : 'outline'}
            onClick={() => setActiveTab('list')}
          >
            Meus Bots
          </Button>
          <Button 
            variant={activeTab === 'create' ? 'default' : 'outline'}
            onClick={() => setActiveTab('create')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Bot
          </Button>
        </div>
      </div>

      {/* Lista de Bots */}
      {activeTab === 'list' && (
        <div className="grid gap-4">
          {appointmentBots.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum bot configurado</h3>
                <p className="text-muted-foreground mb-4">
                  Crie seu primeiro bot de agendamento para começar a automatizar seus agendamentos
                </p>
                <Button onClick={() => setActiveTab('create')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Bot
                </Button>
              </CardContent>
            </Card>
          ) : (
            appointmentBots.map((bot) => (
              <Card key={bot.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <MessageCircle className="w-5 h-5" />
                        <span>{bot.businessName}</span>
                        <Badge variant={bot.isActive ? 'default' : 'secondary'}>
                          {bot.isActive ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {t(`business_types.${bot.businessType}`, bot.businessType)} • {bot.phoneNumber}
                      </CardDescription>
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
                          setActiveTab('manage')
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedBot(bot)
                          setActiveTab('webhook')
                        }}
                      >
                        <Link className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteBot(bot.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Total de Agendamentos:</span>
                      <p className="font-semibold">{bot.totalBookings}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Serviços:</span>
                      <p className="font-semibold">{bot.services.length}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Última Atividade:</span>
                      <p className="font-semibold">
                        {new Date(bot.lastActivity).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Formulário de Criação */}
      {activeTab === 'create' && (
        <div className="grid gap-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Negócio</CardTitle>
              <CardDescription>
                Configure as informações básicas do seu negócio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessName">Nome do Negócio</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => setFormData(current => ({
                      ...current,
                      businessName: e.target.value
                    }))}
                    placeholder="Ex: Salão Bella Vita"
                  />
                </div>
                
                <div>
                  <Label htmlFor="businessType">Tipo de Negócio</Label>
                  <Select 
                    value={formData.businessType}
                    onValueChange={(value) => setFormData(current => ({
                      ...current,
                      businessType: value,
                      businessPrompt: getBusinessPromptTemplate(value)
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUSINESS_TYPES.map(type => (
                        <SelectItem key={type} value={type}>
                          {t(`business_types.${type}`, type)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="phoneNumber">Número do WhatsApp</Label>
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
              
              <div>
                <Label htmlFor="businessPrompt">Prompt Personalizado (Opcional)</Label>
                <Textarea
                  id="businessPrompt"
                  value={formData.businessPrompt}
                  onChange={(e) => setFormData(current => ({
                    ...current,
                    businessPrompt: e.target.value
                  }))}
                  placeholder="Personalize como o bot deve se comportar..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Horários de Funcionamento */}
          <Card>
            <CardHeader>
              <CardTitle>Horários de Funcionamento</CardTitle>
              <CardDescription>
                Configure os dias e horários que seu negócio funciona
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.businessHours.map((hour, index) => (
                  <div key={hour.day} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-20">
                      <span className="font-semibold">
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
                          <Label>Abertura:</Label>
                          <Input
                            type="time"
                            value={hour.openTime}
                            onChange={(e) => updateBusinessHour(index, 'openTime', e.target.value)}
                            className="w-32"
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Label>Fechamento:</Label>
                          <Input
                            type="time"
                            value={hour.closeTime}
                            onChange={(e) => updateBusinessHour(index, 'closeTime', e.target.value)}
                            className="w-32"
                          />
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Label>Pausa:</Label>
                          <Input
                            type="time"
                            value={hour.breakStart || ''}
                            onChange={(e) => updateBusinessHour(index, 'breakStart', e.target.value)}
                            className="w-32"
                            placeholder="Início"
                          />
                          <span>até</span>
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

          {/* Serviços */}
          <Card>
            <CardHeader>
              <CardTitle>Serviços Oferecidos</CardTitle>
              <CardDescription>
                Configure os serviços que podem ser agendados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Adicionar Serviço */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
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
                      duration: parseInt(e.target.value)
                    }))}
                    placeholder="Duração (min)"
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    value={newService.price}
                    onChange={(e) => setNewService(current => ({
                      ...current,
                      price: parseFloat(e.target.value)
                    }))}
                    placeholder="Preço (opcional)"
                  />
                </div>
                <div>
                  <Input
                    value={newService.description}
                    onChange={(e) => setNewService(current => ({
                      ...current,
                      description: e.target.value
                    }))}
                    placeholder="Descrição"
                  />
                </div>
                <div>
                  <Button onClick={addService} disabled={!newService.name}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Lista de Serviços */}
              <div className="space-y-2">
                {formData.services.map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <span className="font-semibold">{service.name}</span>
                      <span className="text-muted-foreground ml-2">
                        {service.duration}min
                        {service.price ? ` • R$ ${service.price}` : ''}
                      </span>
                      {service.description && (
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeService(service.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => setActiveTab('list')}>
              Cancelar
            </Button>
            <Button onClick={createAppointmentBot} disabled={isCreating}>
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Criando Bot...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Criar Bot de Agendamento
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}