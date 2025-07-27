import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLanguage } from '../../contexts/CleanLanguageContext'
import { Calendar, Clock, MapPin, User, Phone, MessageCircle, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

export function SmartAppointments() {
  const { t } = useLanguage()
  const [businessInfo, setBusinessInfo] = useState({
    name: '',
    type: '',
    phone: '',
    schedule: '',
    services: ''
  })
  const [isSetupComplete, setIsSetupComplete] = useState(false)
  const [appointments] = useState([
    {
      id: '1',
      clientName: 'Maria Silva',
      clientPhone: '+55 11 99999-1234',
      service: 'Corte e Escova',
      date: '2025-01-15',
      time: '14:00',
      status: 'confirmed'
    },
    {
      id: '2',
      clientName: 'João Santos',
      clientPhone: '+55 11 99999-5678',
      service: 'Barba e Cabelo',
      date: '2025-01-15',
      time: '15:30',
      status: 'pending'
    },
    {
      id: '3',
      clientName: 'Ana Costa',
      clientPhone: '+55 11 99999-9012',
      service: 'Manicure',
      date: '2025-01-16',
      time: '10:00',
      status: 'confirmed'
    }
  ])

  const setupBookingBot = async () => {
    if (!businessInfo.name || !businessInfo.type || !businessInfo.phone) {
      toast.error(t('please_fill_all_fields'))
      return
    }

    try {
      // Simular configuração do bot
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsSetupComplete(true)
      toast.success(t('booking_bot_configured_successfully'))
    } catch (error) {
      toast.error(t('error_setting_up_bot'))
    }
  }

  const confirmAppointment = (appointmentId: string) => {
    toast.success(t('appointment_confirmed'))
  }

  const cancelAppointment = (appointmentId: string) => {
    toast.success(t('appointment_cancelled'))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('smart_appointments')}</h1>
        <p className="text-muted-foreground">{t('automate_appointment_booking_via_whatsapp')}</p>
      </div>

      {!isSetupComplete ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {t('setup_booking_system')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">{t('business_name')} *</label>
                <Input
                  placeholder="Salão da Maria"
                  value={businessInfo.name}
                  onChange={(e) => setBusinessInfo(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium">{t('business_type')} *</label>
                <Select 
                  value={businessInfo.type} 
                  onValueChange={(value) => setBusinessInfo(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('select_business_type')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salon">{t('hair_salon')}</SelectItem>
                    <SelectItem value="barbershop">{t('barbershop')}</SelectItem>
                    <SelectItem value="nails">{t('nail_salon')}</SelectItem>
                    <SelectItem value="spa">{t('spa')}</SelectItem>
                    <SelectItem value="clinic">{t('clinic')}</SelectItem>
                    <SelectItem value="dentist">{t('dentist')}</SelectItem>
                    <SelectItem value="massage">{t('massage_therapy')}</SelectItem>
                    <SelectItem value="other">{t('other')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">{t('whatsapp_number')} *</label>
              <Input
                placeholder="+55 11 99999-9999"
                value={businessInfo.phone}
                onChange={(e) => setBusinessInfo(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">{t('operating_hours')}</label>
              <Textarea
                placeholder={t('example_schedule')}
                value={businessInfo.schedule}
                onChange={(e) => setBusinessInfo(prev => ({ ...prev, schedule: e.target.value }))}
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium">{t('services_offered')}</label>
              <Textarea
                placeholder={t('list_your_services')}
                value={businessInfo.services}
                onChange={(e) => setBusinessInfo(prev => ({ ...prev, services: e.target.value }))}
                rows={4}
              />
            </div>

            <Button onClick={setupBookingBot} className="w-full" size="lg">
              <Calendar className="h-4 w-4 mr-2" />
              {t('activate_booking_bot')}
            </Button>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">{t('how_it_works')}</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• {t('customers_message_whatsapp')}</li>
                <li>• {t('ai_shows_available_times')}</li>
                <li>• {t('customer_selects_preferred_time')}</li>
                <li>• {t('automatic_confirmation_reminder')}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">27</div>
                <div className="text-sm text-muted-foreground">{t('appointments_today')}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">156</div>
                <div className="text-sm text-muted-foreground">{t('appointments_this_month')}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">92%</div>
                <div className="text-sm text-muted-foreground">{t('booking_rate')}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">4.8</div>
                <div className="text-sm text-muted-foreground">{t('average_rating')}</div>
              </CardContent>
            </Card>
          </div>

          {/* Today's Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t('todays_appointments')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {appointments.map(appointment => (
                  <div 
                    key={appointment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{appointment.clientName}</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          {appointment.clientPhone}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          {appointment.service}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{appointment.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {appointment.status === 'confirmed' ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-green-600">{t('confirmed')}</span>
                          </>
                        ) : (
                          <>
                            <Clock className="h-4 w-4 text-yellow-500" />
                            <span className="text-sm text-yellow-600">{t('pending')}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {appointment.status === 'pending' && (
                        <Button 
                          size="sm"
                          onClick={() => confirmAppointment(appointment.id)}
                        >
                          {t('confirm')}
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => cancelAppointment(appointment.id)}
                      >
                        {t('cancel')}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bot Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                {t('bot_performance')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-xl font-bold text-green-600">89%</div>
                  <div className="text-sm text-green-700">{t('successful_bookings')}</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-xl font-bold text-blue-600">2.3min</div>
                  <div className="text-sm text-blue-700">{t('average_booking_time')}</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-xl font-bold text-purple-600">247</div>
                  <div className="text-sm text-purple-700">{t('messages_today')}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>{t('quick_actions')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-16 flex flex-col gap-2">
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm">{t('block_time_slot')}</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col gap-2">
                  <MessageCircle className="h-5 w-5" />
                  <span className="text-sm">{t('send_reminder')}</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col gap-2">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm">{t('extend_hours')}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}