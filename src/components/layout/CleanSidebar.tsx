import { cn } from '@/lib/utils'
import { useLanguage } from '../../contexts/CleanLanguageContext'
import { 
  LayoutDashboard, 
  Wand2, 
  Target, 
  Video, 
  TrendingUp, 
  MessageCircle, 
  Calendar, 
  Brain, 
  CreditCard, 
  Settings,
  Plug,
  Play,
  Shield
} from 'lucide-react'

interface CleanSidebarProps {
  activeModule: string
  onModuleChange: (module: string) => void
}

export function CleanSidebar({ activeModule, onModuleChange }: CleanSidebarProps) {
  const { t, isRTL } = useLanguage()

  const modules = [
    {
      id: 'dashboard',
      label: t('dashboard'),
      icon: LayoutDashboard,
      description: t('overview_and_stats')
    },
    {
      id: 'magic-pages',
      label: t('magic_pages'),
      icon: Wand2,
      description: t('ai_landing_pages')
    },
    {
      id: 'smart-campaigns',
      label: t('smart_campaigns'),
      icon: Target,
      description: t('facebook_ads_automation')
    },
    {
      id: 'video-generator',
      label: t('video_generator'),
      icon: Video,
      description: t('ai_video_creation')
    },
    {
      id: 'winner-products',
      label: t('winner_products'),
      icon: TrendingUp,
      description: t('dropshipping_products')
    },
    {
      id: 'whatsapp-ai',
      label: t('whatsapp_ai'),
      icon: MessageCircle,
      description: t('automated_sales')
    },
    {
      id: 'smart-appointments',
      label: t('smart_appointments'),
      icon: Calendar,
      description: t('booking_automation')
    },
    {
      id: 'nexbrain',
      label: t('nexbrain'),
      icon: Brain,
      description: t('ai_assistant')
    },
    {
      id: 'credits',
      label: t('credits'),
      icon: CreditCard,
      description: t('usage_and_billing')
    },
    {
      id: 'api-config',
      label: 'API Config',
      icon: Plug,
      description: 'Configure API integrations'
    },
    {
      id: 'live-test',
      label: 'Live Test',
      icon: Play,
      description: 'Test AI campaign generation'
    },
    {
      id: 'quick-api-test',
      label: '🔍 API Test',
      icon: Plug,
      description: 'Quick API status check'
    },
    {
      id: 'admin',
      label: 'Admin Panel',
      icon: Shield,
      description: 'System administration'
    },
    {
      id: 'system-status',
      label: '🔧 System Status',
      icon: Shield,
      description: 'Monitor all integrations'
    },
    {
      id: 'settings',
      label: t('settings'),
      icon: Settings,
      description: t('preferences')
    }
  ]

  return (
    <div className={`w-64 bg-card border-r border-border flex flex-col ${isRTL ? 'border-l border-r-0' : ''}`}>
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold text-foreground">NexusOne AI</h1>
        <p className="text-sm text-muted-foreground">{t('marketing_automation')}</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {modules.map((module) => {
          const Icon = module.icon
          const isActive = activeModule === module.id
          
          return (
            <button
              key={module.id}
              onClick={() => onModuleChange(module.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted text-foreground"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{module.label}</div>
                <div className="text-xs opacity-75 truncate">{module.description}</div>
              </div>
            </button>
          )
        })}
      </nav>
    </div>
  )
}