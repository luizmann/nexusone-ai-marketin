import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCredits } from '@/contexts/CreditContext'
import { useAuth } from '@/contexts/AuthContext'
import { 
  WhatsappLogo, 
  Robot, 
  Phone,
  MessageCircle,
  Users,
  TrendingUp,
  Lightning,
  Play,
  Pause,
  Settings as SettingsIcon,
  Plus,
  QrCode,
  CheckCircle,
  Clock
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface WhatsAppNumber {
  id: string
  number: string
  name: string
  status: 'active' | 'inactive' | 'pending'
  messages: number
  conversions: number
  connectedAt: string
}

interface Conversation {
  id: string
  contact: string
  lastMessage: string
  timestamp: string
  status: 'new' | 'responded' | 'converted' | 'cold'
  source: string
}

export const WhatsAppMarketing: React.FC = () => {
  const { credits, useCredits, getCreditCost } = useCredits()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [botConfig, setBotConfig] = useState({
    businessName: '',
    businessType: '',
    greeting: '',
    productInfo: '',
    pricing: '',
    objectionHandling: '',
    closingMessage: ''
  })
  const [isTrainingBot, setIsTrainingBot] = useState(false)

  const whatsappNumbers: WhatsAppNumber[] = [
    {
      id: '1',
      number: '+1 (555) 123-4567',
      name: 'Main Business',
      status: 'active',
      messages: 1247,
      conversions: 89,
      connectedAt: '2024-01-15'
    },
    {
      id: '2', 
      number: '+1 (555) 987-6543',
      name: 'Support Line',
      status: 'active',
      messages: 634,
      conversions: 23,
      connectedAt: '2024-01-20'
    }
  ]

  const conversations: Conversation[] = [
    {
      id: '1',
      contact: 'John Smith',
      lastMessage: 'I\'m interested in the fitness tracker',
      timestamp: '5 mins ago',
      status: 'new',
      source: 'Landing Page'
    },
    {
      id: '2',
      contact: 'Maria Garcia',
      lastMessage: 'Can you tell me more about pricing?',
      timestamp: '12 mins ago',
      status: 'responded',
      source: 'Facebook Ad'
    },
    {
      id: '3',
      contact: 'David Johnson',
      lastMessage: 'Perfect! I want to buy this',
      timestamp: '1 hour ago',
      status: 'converted',
      source: 'Winner Products'
    },
    {
      id: '4',
      contact: 'Sarah Wilson',
      lastMessage: 'Thanks for the info',
      timestamp: '2 hours ago',
      status: 'cold',
      source: 'Instagram'
    }
  ]

  const businessTypes = [
    'E-commerce Store',
    'Digital Services',
    'Physical Products',
    'Consulting',
    'Real Estate',
    'Restaurant/Food',
    'Beauty/Wellness',
    'Education/Training',
    'Other'
  ]

  const trainBot = async () => {
    if (!botConfig.businessName || !botConfig.businessType) {
      toast.error('Please fill in required fields')
      return
    }

    const cost = getCreditCost('whatsapp-message') * 10 // Training cost
    if (!useCredits(cost)) {
      toast.error('Insufficient credits. Please upgrade your plan.')
      return
    }

    setIsTrainingBot(true)
    
    // Simulate AI training
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setIsTrainingBot(false)
    toast.success('WhatsApp bot trained successfully!')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'responded': return 'bg-purple-100 text-purple-800'
      case 'converted': return 'bg-green-100 text-green-800'
      case 'cold': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const maxNumbers = user?.plan === 'free' ? 1 : user?.plan === 'pro' ? 5 : 20

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-3 rounded-xl">
            <WhatsappLogo className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">WhatsApp Marketing</h1>
        <p className="text-lg text-muted-foreground">
          Intelligent sales automation with 90%+ open rates
        </p>
        <Badge variant="secondary" className="mt-2">
          {credits} Credits Available
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Connected Numbers</p>
                <p className="text-2xl font-bold">{whatsappNumbers.length}/{maxNumbers}</p>
              </div>
              <Phone className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Messages</p>
                <p className="text-2xl font-bold">1,881</p>
              </div>
              <MessageCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Conversations</p>
                <p className="text-2xl font-bold">156</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">24.3%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg max-w-md">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'bot-setup', label: 'Bot Setup' },
          { id: 'conversations', label: 'Conversations' },
          { id: 'numbers', label: 'Numbers' }
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab(tab.id)}
            className="flex-1"
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Robot className="h-5 w-5" />
                AI Sales Bot Status
              </CardTitle>
              <CardDescription>
                Your intelligent WhatsApp assistant for lead qualification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border">
                <div>
                  <h3 className="font-semibold text-green-800">Bot Active</h3>
                  <p className="text-sm text-green-600">Responding to messages automatically</p>
                </div>
                <Badge className="bg-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Online
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-xl font-bold">89</div>
                  <div className="text-sm text-muted-foreground">Leads Today</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-xl font-bold">23</div>
                  <div className="text-sm text-muted-foreground">Conversions</div>
                </div>
              </div>

              <Button className="w-full">
                <SettingsIcon className="h-4 w-4 mr-2" />
                Configure Bot
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest WhatsApp interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {conversations.slice(0, 4).map((conv) => (
                  <div key={conv.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {conv.contact.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm">{conv.contact}</h3>
                        <Badge className={getStatusColor(conv.status)} variant="secondary">
                          {conv.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                      <p className="text-xs text-muted-foreground">{conv.timestamp} • {conv.source}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'bot-setup' && (
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Robot className="h-5 w-5" />
                AI Sales Bot Configuration
              </CardTitle>
              <CardDescription>
                Train your AI bot to understand your business and convert leads
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="business-name">Business Name *</Label>
                  <Input
                    id="business-name"
                    placeholder="e.g., FitTech Store"
                    value={botConfig.businessName}
                    onChange={(e) => setBotConfig(prev => ({ ...prev, businessName: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="business-type">Business Type *</Label>
                  <Select value={botConfig.businessType} onValueChange={(value) => setBotConfig(prev => ({ ...prev, businessType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map(type => (
                        <SelectItem key={type} value={type.toLowerCase()}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="greeting">Welcome Greeting</Label>
                <Textarea
                  id="greeting"
                  placeholder="Hi! 👋 Welcome to FitTech Store! How can I help you today?"
                  value={botConfig.greeting}
                  onChange={(e) => setBotConfig(prev => ({ ...prev, greeting: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="product-info">Product Information</Label>
                <Textarea
                  id="product-info"
                  placeholder="Describe your main products/services, key benefits, and what makes them special..."
                  value={botConfig.productInfo}
                  onChange={(e) => setBotConfig(prev => ({ ...prev, productInfo: e.target.value }))}
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="pricing">Pricing Information</Label>
                <Textarea
                  id="pricing"
                  placeholder="Include your pricing structure, payment methods, discounts, etc..."
                  value={botConfig.pricing}
                  onChange={(e) => setBotConfig(prev => ({ ...prev, pricing: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="objection-handling">Common Objections & Responses</Label>
                <Textarea
                  id="objection-handling"
                  placeholder="How should the bot handle price objections, shipping questions, guarantee concerns, etc..."
                  value={botConfig.objectionHandling}
                  onChange={(e) => setBotConfig(prev => ({ ...prev, objectionHandling: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="closing">Closing Message</Label>
                <Textarea
                  id="closing"
                  placeholder="What should the bot say to close the sale and get the customer to take action?"
                  value={botConfig.closingMessage}
                  onChange={(e) => setBotConfig(prev => ({ ...prev, closingMessage: e.target.value }))}
                />
              </div>

              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90"
                onClick={trainBot}
                disabled={isTrainingBot || !botConfig.businessName || !botConfig.businessType}
              >
                {isTrainingBot ? (
                  <>
                    <Lightning className="h-5 w-5 mr-2 animate-pulse" />
                    Training AI Bot...
                  </>
                ) : (
                  <>
                    <Robot className="h-5 w-5 mr-2" />
                    Train AI Bot (50 Credits)
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'conversations' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Active Conversations
              </span>
              <Badge variant="secondary">{conversations.length} total</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {conversations.map((conv) => (
                <div key={conv.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {conv.contact.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold">{conv.contact}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(conv.status)} variant="secondary">
                          {conv.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{conv.timestamp}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{conv.lastMessage}</p>
                    <p className="text-xs text-muted-foreground">Source: {conv.source}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    View Chat
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'numbers' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Connected Numbers
                </span>
                <Button size="sm" disabled={whatsappNumbers.length >= maxNumbers}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Number
                </Button>
              </CardTitle>
              <CardDescription>
                Manage your WhatsApp business numbers ({whatsappNumbers.length}/{maxNumbers} used)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {whatsappNumbers.map((number) => (
                  <div key={number.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{number.name}</h3>
                        <Badge className={getStatusColor(number.status)} variant="secondary">
                          {number.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{number.number}</p>
                      <p className="text-xs text-muted-foreground">Connected: {number.connectedAt}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">
                        <span className="font-semibold">{number.messages}</span> messages
                      </div>
                      <div className="text-sm">
                        <span className="font-semibold text-green-600">{number.conversions}</span> conversions
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <QrCode className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <SettingsIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {whatsappNumbers.length < maxNumbers && (
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Add Another Number</h3>
                    <p className="text-muted-foreground mb-4">
                      Connect additional WhatsApp numbers to scale your outreach
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Connect Number
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {user?.plan === 'free' && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">Upgrade for More Numbers</h3>
                    <p className="text-muted-foreground">
                      Pro: 5 numbers • Premium: 20 numbers
                    </p>
                  </div>
                  <Button>
                    Upgrade Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

export default WhatsAppMarketing