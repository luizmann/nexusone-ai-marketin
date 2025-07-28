import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/CleanLanguageContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { 
  Users, 
  DollarSign, 
  Activity, 
  TrendingUp, 
  Settings, 
  Key, 
  Database,
  Shield,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Download,
  RefreshCw
} from '@phosphor-icons/react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

interface Customer {
  id: string
  name: string
  email: string
  plan: 'free' | 'pro' | 'premium'
  credits: number
  totalSpent: number
  joinDate: string
  lastActive: string
  status: 'active' | 'inactive' | 'suspended'
  avatar?: string
}

interface APIConfig {
  name: string
  key: string
  status: 'active' | 'inactive' | 'error'
  usage: number
  limit: number
  cost: number
}

interface Analytics {
  totalUsers: number
  activeUsers: number
  totalRevenue: number
  monthlyGrowth: number
  creditsUsed: number
  apiCalls: number
}

export function AdminDashboard() {
  const { t } = useLanguage()
  const [customers, setCustomers] = useKV<Customer[]>('admin-customers', [])
  const [apiConfigs, setApiConfigs] = useKV<APIConfig[]>('admin-api-configs', [])
  const [analytics, setAnalytics] = useKV<Analytics>('admin-analytics', {
    totalUsers: 0,
    activeUsers: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    creditsUsed: 0,
    apiCalls: 0
  })

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Initialize with sample data
  useEffect(() => {
    if (customers.length === 0) {
      const sampleCustomers: Customer[] = [
        {
          id: '1',
          name: 'João Silva',
          email: 'joao@empresa.com',
          plan: 'premium',
          credits: 1500,
          totalSpent: 297.00,
          joinDate: '2024-01-15',
          lastActive: '2024-01-20',
          status: 'active'
        },
        {
          id: '2',
          name: 'Maria Santos',
          email: 'maria@negocio.com',
          plan: 'pro',
          credits: 300,
          totalSpent: 194.00,
          joinDate: '2024-01-10',
          lastActive: '2024-01-19',
          status: 'active'
        },
        {
          id: '3',
          name: 'Pedro Costa',
          email: 'pedro@startup.com',
          plan: 'free',
          credits: 25,
          totalSpent: 0,
          joinDate: '2024-01-18',
          lastActive: '2024-01-18',
          status: 'active'
        }
      ]
      setCustomers(sampleCustomers)
    }

    if (apiConfigs.length === 0) {
      const sampleConfigs: APIConfig[] = [
        {
          name: 'OpenAI GPT-4',
          key: 'sk-proj-****************************',
          status: 'active',
          usage: 75,
          limit: 100,
          cost: 45.20
        },
        {
          name: 'Luma AI Video',
          key: 'luma-****************************',
          status: 'active',
          usage: 60,
          limit: 100,
          cost: 30.50
        },
        {
          name: 'ElevenLabs TTS',
          key: 'sk_****************************',
          status: 'active',
          usage: 40,
          limit: 100,
          cost: 15.80
        },
        {
          name: 'Replicate AI',
          key: 'r8_****************************',
          status: 'active',
          usage: 85,
          limit: 100,
          cost: 25.60
        },
        {
          name: 'CJ Dropshipping',
          key: 'cj_****************************',
          status: 'active',
          usage: 20,
          limit: 100,
          cost: 5.00
        },
        {
          name: 'Gupshup WhatsApp',
          key: 'gup_****************************',
          status: 'active',
          usage: 50,
          limit: 100,
          cost: 12.30
        }
      ]
      setApiConfigs(sampleConfigs)
    }

    const sampleAnalytics: Analytics = {
      totalUsers: 156,
      activeUsers: 89,
      totalRevenue: 12847.50,
      monthlyGrowth: 23.5,
      creditsUsed: 45890,
      apiCalls: 123456
    }
    setAnalytics(sampleAnalytics)
  }, [])

  const handleAddAPI = (newAPI: Omit<APIConfig, 'usage' | 'cost'>) => {
    const apiWithDefaults: APIConfig = {
      ...newAPI,
      usage: 0,
      cost: 0
    }
    setApiConfigs([...apiConfigs, apiWithDefaults])
    toast.success('API configurada com sucesso!')
  }

  const handleUpdateAPI = (index: number, updatedAPI: APIConfig) => {
    const newConfigs = [...apiConfigs]
    newConfigs[index] = updatedAPI
    setApiConfigs(newConfigs)
    toast.success('API atualizada com sucesso!')
  }

  const handleDeleteAPI = (index: number) => {
    const newConfigs = apiConfigs.filter((_, i) => i !== index)
    setApiConfigs(newConfigs)
    toast.success('API removida com sucesso!')
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'premium': return 'bg-gradient-to-r from-purple-500 to-pink-500'
      case 'pro': return 'bg-gradient-to-r from-blue-500 to-cyan-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'error': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Gerencie clientes, APIs e monitore performance</p>
        </div>
        <Button onClick={() => setIsLoading(!isLoading)}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar Dados
        </Button>
      </div>

      {/* Analytics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.activeUsers} ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {analytics.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +{analytics.monthlyGrowth}% este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Créditos Utilizados</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.creditsUsed.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chamadas de API</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.apiCalls.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="customers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="customers">
            <Users className="h-4 w-4 mr-2" />
            Clientes
          </TabsTrigger>
          <TabsTrigger value="apis">
            <Key className="h-4 w-4 mr-2" />
            APIs
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <Activity className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Clientes</CardTitle>
              <CardDescription>
                Monitore e gerencie todos os clientes da plataforma
              </CardDescription>
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Plano</TableHead>
                    <TableHead>Créditos</TableHead>
                    <TableHead>Total Gasto</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={customer.avatar} />
                          <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-muted-foreground">{customer.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getPlanColor(customer.plan)} text-white`}>
                          {customer.plan.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{customer.credits.toLocaleString()}</TableCell>
                      <TableCell>R$ {customer.totalSpent.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(customer.status)}>
                          {customer.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedCustomer(customer)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
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

        <TabsContent value="apis" className="space-y-4">
          <APIManagementPanel
            apiConfigs={apiConfigs}
            onAdd={handleAddAPI}
            onUpdate={handleUpdateAPI}
            onDelete={handleDeleteAPI}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsPanel analytics={analytics} customers={customers} />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <SystemSettingsPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface APIManagementPanelProps {
  apiConfigs: APIConfig[]
  onAdd: (api: Omit<APIConfig, 'usage' | 'cost'>) => void
  onUpdate: (index: number, api: APIConfig) => void
  onDelete: (index: number) => void
}

function APIManagementPanel({ apiConfigs, onAdd, onUpdate, onDelete }: APIManagementPanelProps) {
  const [newAPI, setNewAPI] = useState({
    name: '',
    key: '',
    status: 'active' as const,
    limit: 100
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newAPI.name && newAPI.key) {
      onAdd(newAPI)
      setNewAPI({ name: '', key: '', status: 'active', limit: 100 })
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Nova API</CardTitle>
          <CardDescription>Configure uma nova integração de API</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-name">Nome da API</Label>
              <Input
                id="api-name"
                value={newAPI.name}
                onChange={(e) => setNewAPI({ ...newAPI, name: e.target.value })}
                placeholder="Ex: OpenAI GPT-4"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-key">Chave da API</Label>
              <Input
                id="api-key"
                type="password"
                value={newAPI.key}
                onChange={(e) => setNewAPI({ ...newAPI, key: e.target.value })}
                placeholder="Insira a chave da API"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="api-limit">Limite de Uso (%)</Label>
              <Input
                id="api-limit"
                type="number"
                value={newAPI.limit}
                onChange={(e) => setNewAPI({ ...newAPI, limit: parseInt(e.target.value) })}
                placeholder="100"
              />
            </div>
            <Button type="submit" className="w-full">
              <Key className="h-4 w-4 mr-2" />
              Adicionar API
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>APIs Configuradas</CardTitle>
          <CardDescription>Gerencie suas integrações ativas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {apiConfigs.map((api, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{api.name}</h4>
                  <Badge className={getStatusColor(api.status)}>
                    {api.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {api.key.replace(/(.{10}).*(.{6})/, '$1...$2')}
                </p>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Uso: {api.usage}%</span>
                    <span>Custo: R$ {api.cost.toFixed(2)}</span>
                  </div>
                  <Progress value={api.usage} className="h-2" />
                </div>
              </div>
              <div className="ml-4 flex items-center space-x-2">
                <Switch
                  checked={api.status === 'active'}
                  onCheckedChange={(checked) => {
                    const updatedAPI = { ...api, status: checked ? 'active' as const : 'inactive' as const }
                    onUpdate(index, updatedAPI)
                  }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function AnalyticsPanel({ analytics, customers }: { analytics: Analytics, customers: Customer[] }) {
  const planDistribution = customers.reduce((acc, customer) => {
    acc[customer.plan] = (acc[customer.plan] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Planos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(planDistribution).map(([plan, count]) => (
            <div key={plan} className="flex items-center justify-between">
              <span className="capitalize">{plan}</span>
              <Badge variant="secondary">{count} usuários</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Receita por Plano</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Premium</span>
            <span className="font-medium">R$ 8.910,00</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Pro</span>
            <span className="font-medium">R$ 3.937,50</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Free</span>
            <span className="font-medium">R$ 0,00</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Uso de APIs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>OpenAI</span>
              <span>75%</span>
            </div>
            <Progress value={75} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Luma AI</span>
              <span>60%</span>
            </div>
            <Progress value={60} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Replicate</span>
              <span>85%</span>
            </div>
            <Progress value={85} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SystemSettingsPanel() {
  const [settings, setSettings] = useKV('admin-settings', {
    maintenanceMode: false,
    allowRegistrations: true,
    maxUsersPerPlan: {
      free: 1000,
      pro: 500,
      premium: 100
    },
    defaultCredits: {
      free: 50,
      pro: 500,
      premium: 2000
    }
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações do Sistema</CardTitle>
          <CardDescription>Gerencie configurações globais da plataforma</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="maintenance">Modo de Manutenção</Label>
              <p className="text-sm text-muted-foreground">
                Bloqueia acesso de novos usuários ao sistema
              </p>
            </div>
            <Switch
              id="maintenance"
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, maintenanceMode: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="registrations">Permitir Registros</Label>
              <p className="text-sm text-muted-foreground">
                Permite que novos usuários se cadastrem
              </p>
            </div>
            <Switch
              id="registrations"
              checked={settings.allowRegistrations}
              onCheckedChange={(checked) =>
                setSettings({ ...settings, allowRegistrations: checked })
              }
            />
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Créditos Padrão por Plano</h4>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="free-credits">Plano Free</Label>
                <Input
                  id="free-credits"
                  type="number"
                  value={settings.defaultCredits.free}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      defaultCredits: {
                        ...settings.defaultCredits,
                        free: parseInt(e.target.value)
                      }
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pro-credits">Plano Pro</Label>
                <Input
                  id="pro-credits"
                  type="number"
                  value={settings.defaultCredits.pro}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      defaultCredits: {
                        ...settings.defaultCredits,
                        pro: parseInt(e.target.value)
                      }
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="premium-credits">Plano Premium</Label>
                <Input
                  id="premium-credits"
                  type="number"
                  value={settings.defaultCredits.premium}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      defaultCredits: {
                        ...settings.defaultCredits,
                        premium: parseInt(e.target.value)
                      }
                    })
                  }
                />
              </div>
            </div>
          </div>

          <Button>
            <Database className="h-4 w-4 mr-2" />
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backup e Segurança</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Fazer Backup do Banco de Dados
          </Button>
          <Button variant="outline">
            <Shield className="h-4 w-4 mr-2" />
            Verificar Integridade do Sistema
          </Button>
          <Button variant="destructive">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Limpar Logs Antigos
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function getStatusColor(status: string) {
  switch (status) {
    case 'active':
      return 'text-green-600 bg-green-100'
    case 'error':
      return 'text-red-600 bg-red-100'
    default:
      return 'text-gray-600 bg-gray-100'
  }
}