import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  Calendar, 
  Clock, 
  Phone, 
  User,
  CheckCircle,
  XCircle,
  MessageCircle,
  TrendUp,
  Star,
  Filter
} from '@phosphor-icons/react'

interface Appointment {
  id: string
  botId: string
  clientName: string
  clientPhone: string
  serviceName: string
  serviceId: string
  date: string
  time: string
  duration: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string
  createdAt: string
  reminderSent: boolean
}

interface AppointmentStats {
  totalAppointments: number
  confirmedAppointments: number
  completedAppointments: number
  cancelledAppointments: number
  todayAppointments: number
  weekRevenue: number
  averageRating: number
}

interface AppointmentManagerProps {
  botId: string
  businessName: string
  onBack: () => void
}

export function AppointmentManager({ botId, businessName, onBack }: AppointmentManagerProps) {
  const { t, isRTL } = useLanguage()
  const [appointments, setAppointments] = useKV<Appointment[]>(`appointments-${botId}`, [])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [stats, setStats] = useState<AppointmentStats>({
    totalAppointments: 0,
    confirmedAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    todayAppointments: 0,
    weekRevenue: 0,
    averageRating: 4.8
  })

  // Simular dados de agendamentos para demonstração
  useEffect(() => {
    if (appointments.length === 0) {
      const sampleAppointments: Appointment[] = [
        {
          id: 'app_1',
          botId,
          clientName: 'Maria Silva',
          clientPhone: '+55 11 99999-0001',
          serviceName: 'Corte + Escova',
          serviceId: 'service_1',
          date: new Date().toISOString().split('T')[0],
          time: '09:00',
          duration: 60,
          status: 'confirmed',
          notes: 'Cliente prefere corte mais curto',
          createdAt: new Date().toISOString(),
          reminderSent: true
        },
        {
          id: 'app_2',
          botId,
          clientName: 'João Santos',
          clientPhone: '+55 11 99999-0002',
          serviceName: 'Barba + Bigode',
          serviceId: 'service_2',
          date: new Date().toISOString().split('T')[0],
          time: '14:30',
          duration: 45,
          status: 'pending',
          createdAt: new Date().toISOString(),
          reminderSent: false
        },
        {
          id: 'app_3',
          botId,
          clientName: 'Ana Costa',
          clientPhone: '+55 11 99999-0003',
          serviceName: 'Manicure + Pedicure',
          serviceId: 'service_3',
          date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // tomorrow
          time: '10:00',
          duration: 90,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
          reminderSent: false
        }
      ]
      
      setAppointments(sampleAppointments)
    }
  }, [botId, appointments.length, setAppointments])

  // Calcular estatísticas
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    
    const todayApps = appointments.filter(app => app.date === today)
    const weekApps = appointments.filter(app => app.date >= weekAgo)
    
    setStats({
      totalAppointments: appointments.length,
      confirmedAppointments: appointments.filter(app => app.status === 'confirmed').length,
      completedAppointments: appointments.filter(app => app.status === 'completed').length,
      cancelledAppointments: appointments.filter(app => app.status === 'cancelled').length,
      todayAppointments: todayApps.length,
      weekRevenue: weekApps.length * 50, // estimativa
      averageRating: 4.8
    })
  }, [appointments])

  const updateAppointmentStatus = async (appointmentId: string, newStatus: Appointment['status']) => {
    setAppointments(current => 
      current.map(app => 
        app.id === appointmentId ? { ...app, status: newStatus } : app
      )
    )
    
    // Simular envio de confirmação via WhatsApp
    const appointment = appointments.find(app => app.id === appointmentId)
    if (appointment && newStatus === 'confirmed') {
      const prompt = spark.llmPrompt`
        Send WhatsApp confirmation message to ${appointment.clientName} at ${appointment.clientPhone}
        for appointment: ${appointment.serviceName} on ${appointment.date} at ${appointment.time}
        Business: ${businessName}
      `
      
      try {
        await spark.llm(prompt)
        toast.success('Confirmação enviada via WhatsApp!')
      } catch (error) {
        toast.error('Erro ao enviar confirmação')
      }
    }
    
    toast.success(`Agendamento ${newStatus === 'confirmed' ? 'confirmado' : newStatus === 'cancelled' ? 'cancelado' : 'atualizado'}!`)
  }

  const sendReminder = async (appointmentId: string) => {
    const appointment = appointments.find(app => app.id === appointmentId)
    if (!appointment) return

    const prompt = spark.llmPrompt`
      Send WhatsApp reminder message to ${appointment.clientName} at ${appointment.clientPhone}
      for appointment: ${appointment.serviceName} tomorrow at ${appointment.time}
      Business: ${businessName}
      Be friendly and include option to reschedule if needed
    `
    
    try {
      await spark.llm(prompt)
      
      setAppointments(current => 
        current.map(app => 
          app.id === appointmentId ? { ...app, reminderSent: true } : app
        )
      )
      
      toast.success('Lembrete enviado via WhatsApp!')
    } catch (error) {
      toast.error('Erro ao enviar lembrete')
    }
  }

  const filteredAppointments = appointments
    .filter(app => app.date === selectedDate)
    .filter(app => filterStatus === 'all' || app.status === filterStatus)
    .sort((a, b) => a.time.localeCompare(b.time))

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed': return 'default'
      case 'pending': return 'secondary'
      case 'completed': return 'outline'
      case 'cancelled': return 'destructive'
      default: return 'secondary'
    }
  }

  const getStatusIcon = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'completed': return <Star className="w-4 h-4" />
      case 'cancelled': return <XCircle className="w-4 h-4" />
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
            Gerenciar Agendamentos
          </h1>
          <p className="text-muted-foreground mt-2">
            {businessName} • Agenda Inteligente
          </p>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.totalAppointments}</p>
                <p className="text-sm text-muted-foreground">Total de Agendamentos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.confirmedAppointments}</p>
                <p className="text-sm text-muted-foreground">Confirmados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendUp className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">R$ {stats.weekRevenue}</p>
                <p className="text-sm text-muted-foreground">Receita da Semana</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{stats.averageRating}</p>
                <p className="text-sm text-muted-foreground">Avaliação Média</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Agenda do Dia</CardTitle>
          <CardDescription>
            Gerencie os agendamentos e envie confirmações automáticas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Data</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md"
              />
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md"
              >
                <option value="all">Todos</option>
                <option value="pending">Pendente</option>
                <option value="confirmed">Confirmado</option>
                <option value="completed">Concluído</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
          </div>

          {/* Lista de Agendamentos */}
          <div className="space-y-4">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum agendamento</h3>
                <p className="text-muted-foreground">
                  Não há agendamentos para esta data ou filtro selecionado.
                </p>
              </div>
            ) : (
              filteredAppointments.map((appointment) => (
                <Card key={appointment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{appointment.time}</div>
                          <div className="text-sm text-muted-foreground">
                            {appointment.duration}min
                          </div>
                        </div>
                        
                        <Separator orientation="vertical" className="h-12" />
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <User className="w-4 h-4" />
                            <span className="font-semibold">{appointment.clientName}</span>
                            <Badge variant={getStatusColor(appointment.status)}>
                              {getStatusIcon(appointment.status)}
                              <span className="ml-1">
                                {appointment.status === 'pending' && 'Pendente'}
                                {appointment.status === 'confirmed' && 'Confirmado'}
                                {appointment.status === 'completed' && 'Concluído'}
                                {appointment.status === 'cancelled' && 'Cancelado'}
                              </span>
                            </Badge>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Phone className="w-4 h-4" />
                              <span>{appointment.clientPhone}</span>
                            </div>
                            <div>
                              <strong>Serviço:</strong> {appointment.serviceName}
                            </div>
                          </div>
                          
                          {appointment.notes && (
                            <div className="mt-2 text-sm">
                              <strong>Observações:</strong> {appointment.notes}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        {appointment.status === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateAppointmentStatus(appointment.id, 'confirmed')}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Confirmar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Cancelar
                            </Button>
                          </>
                        )}
                        
                        {appointment.status === 'confirmed' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                            >
                              <Star className="w-4 h-4 mr-1" />
                              Concluir
                            </Button>
                            {!appointment.reminderSent && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => sendReminder(appointment.id)}
                              >
                                <MessageCircle className="w-4 h-4 mr-1" />
                                Lembrete
                              </Button>
                            )}
                          </>
                        )}
                        
                        {appointment.status === 'completed' && (
                          <Badge variant="outline">
                            <Star className="w-4 h-4 mr-1" />
                            Concluído
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}