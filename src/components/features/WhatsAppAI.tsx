import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useLanguage } from '../../contexts/CleanLanguageContext'
import { MessageCircle, Bot, Phone, Users, TrendingUp, Send } from 'lucide-react'
import { toast } from 'sonner'

export function WhatsAppAI() {
  const { t } = useLanguage()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [conversations] = useState([
    {
      id: '1',
      contact: '+55 11 99999-1234',
      name: 'Maria Silva',
      lastMessage: 'Olá! Gostaria de saber mais sobre o produto.',
      time: '10:30',
      unread: 2,
      status: 'active'
    },
    {
      id: '2',
      contact: '+55 11 99999-5678',
      name: 'João Santos',
      lastMessage: 'Qual é o prazo de entrega?',
      time: '09:45',
      unread: 1,
      status: 'pending'
    },
    {
      id: '3',
      contact: '+55 11 99999-9012',
      name: 'Ana Costa',
      lastMessage: 'Produto entregue! Muito obrigada!',
      time: '08:15',
      unread: 0,
      status: 'completed'
    }
  ])

  const connectWhatsApp = async () => {
    if (!phoneNumber) {
      toast.error(t('please_enter_phone_number'))
      return
    }

    setIsConnecting(true)
    
    try {
      // Simular conexão com WhatsApp
      await new Promise(resolve => setTimeout(resolve, 3000))
      setIsConnected(true)
      toast.success(t('whatsapp_connected_successfully'))
    } catch (error) {
      toast.error(t('error_connecting_whatsapp'))
    } finally {
      setIsConnecting(false)
    }
  }

  const sendBroadcast = () => {
    toast.success(t('broadcast_message_sent'))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('whatsapp_ai')}</h1>
        <p className="text-muted-foreground">{t('automate_sales_with_intelligent_whatsapp_bot')}</p>
      </div>

      {!isConnected ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              {t('connect_whatsapp')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">{t('whatsapp_number')}</label>
              <Input
                placeholder="+55 11 99999-9999"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">{t('business_type')}</label>
              <Textarea
                placeholder={t('describe_your_business_for_ai_optimization')}
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                rows={3}
              />
            </div>

            <Button 
              onClick={connectWhatsApp}
              disabled={isConnecting}
              className="w-full"
              size="lg"
            >
              {isConnecting ? (
                <>
                  <Phone className="h-4 w-4 mr-2 animate-pulse" />
                  {t('connecting')}...
                </>
              ) : (
                <>
                  <Phone className="h-4 w-4 mr-2" />
                  {t('connect_whatsapp')}
                </>
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <p>{t('scan_qr_code_instruction')}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">127</div>
                <div className="text-sm text-muted-foreground">{t('total_contacts')}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">45</div>
                <div className="text-sm text-muted-foreground">{t('active_conversations')}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">89%</div>
                <div className="text-sm text-muted-foreground">{t('response_rate')}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">R$ 3.2k</div>
                <div className="text-sm text-muted-foreground">{t('sales_today')}</div>
              </CardContent>
            </Card>
          </div>

          {/* Conversations */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                {t('recent_conversations')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {conversations.map(conversation => (
                  <div 
                    key={conversation.id}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted cursor-pointer transition-colors"
                  >
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {conversation.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium truncate">{conversation.name}</h4>
                        <span className="text-xs text-muted-foreground">{conversation.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unread > 0 && (
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-xs text-white">
                        {conversation.unread}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Bot Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                {t('ai_bot_settings')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">{t('auto_responses')}</h4>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700">{t('greeting_message')}</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700">{t('product_info')}</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700">{t('order_tracking')}</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">{t('broadcast_campaigns')}</h4>
                <Button onClick={sendBroadcast} variant="outline" className="w-full">
                  <Send className="h-3 w-3 mr-1" />
                  {t('send_promotion')}
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">{t('performance')}</h4>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('messages_sent')}:</span>
                    <span>1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('messages_received')}:</span>
                    <span>892</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('conversion_rate')}:</span>
                    <span className="text-green-600">12.3%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>{t('quick_actions')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Users className="h-6 w-6" />
                  <span className="text-sm">{t('import_contacts')}</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <TrendingUp className="h-6 w-6" />
                  <span className="text-sm">{t('create_funnel')}</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Bot className="h-6 w-6" />
                  <span className="text-sm">{t('train_ai')}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}