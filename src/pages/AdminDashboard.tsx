import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useKV } from '@github/spark/hooks'
import { useLanguage } from '../contexts/CleanLanguageContext'
import { apiService, APIKeys } from '../services/apiService'
import { NexBrainTester } from '../components/NexBrainTester'
import { OpenAIKeyHelper } from '../components/OpenAIKeyHelper'
import { NexBrainCapabilities } from '../components/NexBrainCapabilities'
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Settings,
  Database,
  BarChart3,
  Key,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Cpu,
  Brain,
  Video,
  MessageSquare,
  Camera,
  Globe,
  TestTube,
  ExternalLink,
  HelpCircle
} from 'lucide-react'
import { toast } from 'sonner'

interface AdminUser {
  id: string
  name: string
  email: string
  plan: 'free' | 'pro' | 'premium'
  credits: number
  videoCredits: number
  createdAt: string
  lastActive: string
  totalSpent: number
  campaignsCreated: number
  videosGenerated: number
  leads: number
  sales: number
}

interface APIStatus {
  service: keyof APIKeys
  name: string
  status: 'connected' | 'disconnected' | 'testing'
  icon: any
  description: string
}

export function AdminDashboard() {
  const { t } = useLanguage()
  const [users, setUsers] = useKV<AdminUser[]>('admin-users', [])
  const [stats, setStats] = useKV('admin-stats', {
    totalUsers: 0,
    totalRevenue: 0,
    activeUsers: 0,
    totalCampaigns: 0
  })
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [apiKeys, setApiKeys] = useState<APIKeys>(apiService.getAPIKeys())
  const [apiStatuses, setApiStatuses] = useState<APIStatus[]>([])
  const [systemSettings, setSystemSettings] = useKV('system-settings', {
    maintenanceMode: false,
    registrationOpen: true,
    defaultCredits: { free: 50, pro: 500, premium: 2000 },
    creditCosts: { campaign: 20, video: 30, magicPage: 15, whatsapp: 5 }
  })

  // Initialize API statuses
  useEffect(() => {
    const statuses: APIStatus[] = [
      {
        service: 'openai',
        name: 'OpenAI GPT-4',
        status: 'disconnected',
        icon: Brain,
        description: 'AI content generation and NexBrain assistant'
      },
      {
        service: 'luma',
        name: 'Luma AI',
        status: 'disconnected',
        icon: Video,
        description: 'AI video generation and creation'
      },
      {
        service: 'elevenlabs',
        name: 'ElevenLabs',
        status: 'disconnected',
        icon: MessageSquare,
        description: 'Text-to-speech and voice generation'
      },
      {
        service: 'replicate',
        name: 'Replicate',
        status: 'disconnected',
        icon: Camera,
        description: 'AI image generation and processing'
      },
      {
        service: 'gupshup',
        name: 'Gupshup WhatsApp',
        status: 'disconnected',
        icon: MessageSquare,
        description: 'WhatsApp Business API integration'
      },
      {
        service: 'cj_dropshipping',
        name: 'CJ Dropshipping',
        status: 'disconnected',
        icon: Globe,
        description: 'Product catalog and order fulfillment'
      },
      {
        service: 'unsplash',
        name: 'Unsplash',
        status: 'disconnected',
        icon: Camera,
        description: 'Stock photography and images'
      },
      {
        service: 'facebook',
        name: 'Facebook Marketing',
        status: 'disconnected',
        icon: TrendingUp,
        description: 'Facebook and Instagram ad campaigns'
      }
    ]

    setApiStatuses(statuses)
    checkAllAPIStatuses(statuses)
  }, [])

  const checkAllAPIStatuses = async (statuses: APIStatus[]) => {
    const updatedStatuses = [...statuses]
    
    for (let i = 0; i < updatedStatuses.length; i++) {
      const status = updatedStatuses[i]
      if (apiService.isConfigured(status.service)) {
        status.status = 'testing'
        setApiStatuses([...updatedStatuses])
        
        try {
          const isConnected = await apiService.testAPI(status.service)
          status.status = isConnected ? 'connected' : 'disconnected'
        } catch (error) {
          status.status = 'disconnected'
        }
      } else {
        status.status = 'disconnected'
      }
    }
    
    setApiStatuses(updatedStatuses)
  }

  // Mock data for demonstration
  useEffect(() => {
    const mockUsers: AdminUser[] = [
      {
        id: '1',
        name: 'João Silva',
        email: 'joao@email.com',
        plan: 'pro',
        credits: 250,
        videoCredits: 8,
        createdAt: '2024-01-15',
        lastActive: '2024-01-20',
        totalSpent: 297,
        campaignsCreated: 15,
        videosGenerated: 8,
        leads: 124,
        sales: 8
      },
      {
        id: '2',
        name: 'Maria Santos',
        email: 'maria@email.com',
        plan: 'premium',
        credits: 850,
        videoCredits: 25,
        createdAt: '2024-01-10',
        lastActive: '2024-01-20',
        totalSpent: 594,
        campaignsCreated: 32,
        videosGenerated: 18,
        leads: 287,
        sales: 23
      },
      {
        id: '3',
        name: 'Pedro Costa',
        email: 'pedro@email.com',
        plan: 'free',
        credits: 15,
        videoCredits: 1,
        createdAt: '2024-01-18',
        lastActive: '2024-01-19',
        totalSpent: 0,
        campaignsCreated: 3,
        videosGenerated: 1,
        leads: 45,
        sales: 2
      }
    ]

    if (users.length === 0) {
      setUsers(mockUsers)
      setStats({
        totalUsers: mockUsers.length,
        totalRevenue: mockUsers.reduce((sum, user) => sum + user.totalSpent, 0),
        activeUsers: mockUsers.filter(user => {
          const lastActive = new Date(user.lastActive)
          const daysDiff = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
          return daysDiff <= 7
        }).length,
        totalCampaigns: mockUsers.reduce((sum, user) => sum + user.campaignsCreated, 0)
      })
    }
  }, [users.length, setUsers, setStats])

  const updateUserPlan = (userId: string, newPlan: 'free' | 'pro' | 'premium') => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, plan: newPlan } : user
    ))
    toast.success('User plan updated successfully')
  }

  const addCredits = (userId: string, amount: number) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, credits: user.credits + amount } : user
    ))
    toast.success(`${amount} credits added successfully`)
  }

  const handleAPIKeyChange = (service: keyof APIKeys, value: string) => {
    const newKeys = { ...apiKeys, [service]: value }
    setApiKeys(newKeys)
  }

  const saveAPIKeys = () => {
    apiService.saveAPIKeys(apiKeys)
    toast.success('API keys saved successfully')
    // Re-test all APIs
    checkAllAPIStatuses(apiStatuses)
  }

  const testSingleAPI = async (service: keyof APIKeys) => {
    const statusIndex = apiStatuses.findIndex(s => s.service === service)
    if (statusIndex === -1) return

    const updatedStatuses = [...apiStatuses]
    updatedStatuses[statusIndex].status = 'testing'
    setApiStatuses(updatedStatuses)

    try {
      const isConnected = await apiService.testAPI(service)
      updatedStatuses[statusIndex].status = isConnected ? 'connected' : 'disconnected'
      toast.success(isConnected ? 'API connection successful' : 'API connection failed')
    } catch (error) {
      updatedStatuses[statusIndex].status = 'disconnected'
      toast.error('API connection failed')
    }

    setApiStatuses(updatedStatuses)
  }

  const updateSystemSettings = (key: string, value: any) => {
    setSystemSettings(prev => ({ ...prev, [key]: value }))
    toast.success('System settings updated')
  }

  const getStatusIcon = (status: APIStatus['status']) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'disconnected':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'testing':
        return <AlertTriangle className="h-5 w-5 text-yellow-500 animate-pulse" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage users, API integrations, and system settings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">R$ {stats.totalRevenue}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{stats.activeUsers}</p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Campaigns</p>
                <p className="text-2xl font-bold">{stats.totalCampaigns}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="apis" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="apis">API Configuration</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
        </TabsList>

        <TabsContent value="apis" className="space-y-4">
          {/* NexBrain AI Assistant Section */}
          <Card className="border-2 border-primary/20 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">NexBrain AI Assistant</h3>
                  <p className="text-sm text-muted-foreground font-normal">
                    Core AI engine powering Magic Pages, Ads Generation, and Campaign Optimization
                  </p>
                </div>
                <div className="ml-auto">
                  {apiStatuses.find(api => api.service === 'openai')?.status === 'connected' ? (
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      <CheckCircle className="h-4 w-4" />
                      Active
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                      <XCircle className="h-4 w-4" />
                      Inactive
                    </div>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="text-lg font-bold text-primary">GPT-4o</div>
                  <div className="text-sm text-muted-foreground">Model</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="text-lg font-bold text-primary">asst_0jsx...</div>
                  <div className="text-sm text-muted-foreground">Assistant ID</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="text-lg font-bold text-primary">AI Agents</div>
                  <div className="text-sm text-muted-foreground">Capability</div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="Enter OpenAI API key (sk-proj-...)"
                  value={apiKeys.openai}
                  onChange={(e) => handleAPIKeyChange('openai', e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={() => testSingleAPI('openai')}
                  disabled={apiStatuses.find(api => api.service === 'openai')?.status === 'testing'}
                >
                  {apiStatuses.find(api => api.service === 'openai')?.status === 'testing' ? 'Testing...' : 'Test'}
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="default" size="sm" className="shrink-0">
                      <TestTube className="h-4 w-4 mr-1" />
                      Advanced Test
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>NexBrain AI Assistant Testing</DialogTitle>
                    </DialogHeader>
                    <NexBrainTester />
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="shrink-0">
                      <HelpCircle className="h-4 w-4 mr-1" />
                      Capabilities
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>NexBrain AI Capabilities</DialogTitle>
                    </DialogHeader>
                    <NexBrainCapabilities />
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-blue-900">What NexBrain Powers:</h4>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                        Need API Key? <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>OpenAI API Key Setup Guide</DialogTitle>
                      </DialogHeader>
                      <OpenAIKeyHelper />
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
                  <div>• Automatic Sales Page Generation</div>
                  <div>• Facebook Ads Campaign Creation</div>
                  <div>• WhatsApp Sales Flow Automation</div>
                  <div>• Product Video Script Writing</div>
                  <div>• Campaign Performance Analysis</div>
                  <div>• Lead Conversation Optimization</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Other API Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {apiStatuses.filter(api => api.service !== 'openai').map((api) => (
                <div key={api.service} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <api.icon className="h-6 w-6" />
                      <div>
                        <h3 className="font-medium">{api.name}</h3>
                        <p className="text-sm text-muted-foreground">{api.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(api.status)}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => testSingleAPI(api.service)}
                        disabled={api.status === 'testing'}
                      >
                        Test
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      type="password"
                      placeholder={`Enter ${api.name} API key`}
                      value={apiKeys[api.service]}
                      onChange={(e) => handleAPIKeyChange(api.service, e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              ))}
              
              <Button onClick={saveAPIKeys} className="w-full">
                Save All API Keys
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Campaigns</TableHead>
                    <TableHead>Leads</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          user.plan === 'premium' ? 'default' : 
                          user.plan === 'pro' ? 'secondary' : 'outline'
                        }>
                          {user.plan.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.credits}</TableCell>
                      <TableCell>{user.campaignsCreated}</TableCell>
                      <TableCell>{user.leads}</TableCell>
                      <TableCell>{user.sales}</TableCell>
                      <TableCell>R$ {user.totalSpent}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => addCredits(user.id, 100)}
                          >
                            +100
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedUser(user)}
                          >
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Revenue by Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Premium</span>
                    <span className="font-bold">R$ 594</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Pro</span>
                    <span className="font-bold">R$ 297</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Free</span>
                    <span className="font-bold">R$ 0</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  API Usage Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>OpenAI Calls</span>
                    <span className="font-bold">1,247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Videos Generated</span>
                    <span className="font-bold">27</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Images Created</span>
                    <span className="font-bold">156</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>WhatsApp Messages</span>
                    <span className="font-bold">892</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenance">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">Block new user access</p>
                </div>
                <Switch
                  id="maintenance"
                  checked={systemSettings.maintenanceMode}
                  onCheckedChange={(checked) => updateSystemSettings('maintenanceMode', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="registration">Open Registration</Label>
                  <p className="text-sm text-muted-foreground">Allow new user signups</p>
                </div>
                <Switch
                  id="registration"
                  checked={systemSettings.registrationOpen}
                  onCheckedChange={(checked) => updateSystemSettings('registrationOpen', checked)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Free Plan Credits</Label>
                  <Input 
                    type="number" 
                    value={systemSettings.defaultCredits.free}
                    onChange={(e) => updateSystemSettings('defaultCredits', {
                      ...systemSettings.defaultCredits,
                      free: parseInt(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label>Pro Plan Credits</Label>
                  <Input 
                    type="number" 
                    value={systemSettings.defaultCredits.pro}
                    onChange={(e) => updateSystemSettings('defaultCredits', {
                      ...systemSettings.defaultCredits,
                      pro: parseInt(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label>Premium Plan Credits</Label>
                  <Input 
                    type="number" 
                    value={systemSettings.defaultCredits.premium}
                    onChange={(e) => updateSystemSettings('defaultCredits', {
                      ...systemSettings.defaultCredits,
                      premium: parseInt(e.target.value)
                    })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Campaign Cost</Label>
                  <Input 
                    type="number" 
                    value={systemSettings.creditCosts.campaign}
                    onChange={(e) => updateSystemSettings('creditCosts', {
                      ...systemSettings.creditCosts,
                      campaign: parseInt(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label>Video Cost</Label>
                  <Input 
                    type="number" 
                    value={systemSettings.creditCosts.video}
                    onChange={(e) => updateSystemSettings('creditCosts', {
                      ...systemSettings.creditCosts,
                      video: parseInt(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label>Magic Page Cost</Label>
                  <Input 
                    type="number" 
                    value={systemSettings.creditCosts.magicPage}
                    onChange={(e) => updateSystemSettings('creditCosts', {
                      ...systemSettings.creditCosts,
                      magicPage: parseInt(e.target.value)
                    })}
                  />
                </div>
                <div>
                  <Label>WhatsApp Cost</Label>
                  <Input 
                    type="number" 
                    value={systemSettings.creditCosts.whatsapp}
                    onChange={(e) => updateSystemSettings('creditCosts', {
                      ...systemSettings.creditCosts,
                      whatsapp: parseInt(e.target.value)
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline">
                  Export Users
                </Button>
                <Button variant="outline">
                  Backup Database
                </Button>
                <Button variant="destructive">
                  Clear Cache
                </Button>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Database Statistics</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total Users:</span>
                    <span className="ml-2 font-medium">{users.length}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Storage Used:</span>
                    <span className="ml-2 font-medium">2.3 MB</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Campaigns:</span>
                    <span className="ml-2 font-medium">{stats.totalCampaigns}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">API Calls Today:</span>
                    <span className="ml-2 font-medium">1,247</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Edit Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardHeader>
              <CardTitle>Edit User: {selectedUser.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Plan</Label>
                <div className="flex gap-2 mt-1">
                  {(['free', 'pro', 'premium'] as const).map(plan => (
                    <Button
                      key={plan}
                      size="sm"
                      variant={selectedUser.plan === plan ? 'default' : 'outline'}
                      onClick={() => updateUserPlan(selectedUser.id, plan)}
                    >
                      {plan.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={() => setSelectedUser(null)}>Close</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}