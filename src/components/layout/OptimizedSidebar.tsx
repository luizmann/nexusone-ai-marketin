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
  Shield,
  Plug
} from 'lucide-react'

interface OptimizedSidebarProps {
  activeModule: string
  onModuleChange: (module: string) => void
}

export function OptimizedSidebar({ activeModule, onModuleChange }: OptimizedSidebarProps) {
  const { t, isRTL } = useLanguage()

  // Core modules organized by category - no duplicates
  const coreModules = [
    {
      id: 'dashboard',
      label: t('dashboard'),
      icon: LayoutDashboard,
      description: t('overview_and_stats'),
      category: 'main'
    }
  ]

  const aiModules = [
    {
      id: 'nexbrain',
      label: 'NexBrain AI',
      icon: Brain,
      description: 'AI Assistant & Automation',
      category: 'ai'
    },
    {
      id: 'magic-pages',
      label: 'Sales Pages',
      icon: Wand2,
      description: 'AI Landing Page Builder',
      category: 'ai'
    },
    {
      id: 'video-generator',
      label: 'Video Magic',
      icon: Video,
      description: 'AI Video Creation',
      category: 'ai'
    }
  ]

  const marketingModules = [
    {
      id: 'smart-campaigns',
      label: 'Smart Ads',
      icon: Target,
      description: 'Facebook & Instagram Ads',
      category: 'marketing'
    },
    {
      id: 'whatsapp-ai',
      label: 'WhatsApp AI',
      icon: MessageCircle,
      description: 'Automated Sales Chat',
      category: 'marketing'
    },
    {
      id: 'smart-appointments',
      label: 'Booking AI',
      icon: Calendar,
      description: 'Smart Appointment System',
      category: 'marketing'
    }
  ]

  const businessModules = [
    {
      id: 'winner-products',
      label: 'Winner Products',
      icon: TrendingUp,
      description: 'Dropshipping Products',
      category: 'business'
    },
    {
      id: 'credits',
      label: 'Credits & Billing',
      icon: CreditCard,
      description: 'Usage & Payments',
      category: 'business'
    }
  ]

  const systemModules = [
    {
      id: 'api-config',
      label: 'API Setup',
      icon: Plug,
      description: 'Configure Integrations',
      category: 'system'
    },
    {
      id: 'admin',
      label: 'Admin Panel',
      icon: Shield,
      description: 'System Management',
      category: 'system'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      description: 'User Preferences',
      category: 'system'
    }
  ]

  const ModuleSection = ({ title, modules, isExpanded = true }: { 
    title: string
    modules: any[]
    isExpanded?: boolean 
  }) => (
    <div className="mb-6">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
        {title}
      </h3>
      <div className="space-y-1">
        {modules.map((module) => {
          const Icon = module.icon
          const isActive = activeModule === module.id
          
          return (
            <button
              key={module.id}
              onClick={() => onModuleChange(module.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "hover:bg-muted/50 text-foreground hover:shadow-sm"
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
      </div>
    </div>
  )

  return (
    <div className={`w-72 bg-card border-r border-border flex flex-col ${isRTL ? 'border-l border-r-0' : ''}`}>
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">NexusOne AI</h1>
            <p className="text-sm text-muted-foreground">{t('marketing_automation')}</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 overflow-y-auto">
        <ModuleSection title="Dashboard" modules={coreModules} />
        <ModuleSection title="AI Tools" modules={aiModules} />
        <ModuleSection title="Marketing" modules={marketingModules} />
        <ModuleSection title="Business" modules={businessModules} />
        <ModuleSection title="System" modules={systemModules} />
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-3">
          <div className="text-sm font-medium text-foreground">Pro Plan Active</div>
          <div className="text-xs text-muted-foreground">500 credits remaining</div>
        </div>
      </div>
    </div>
  )
}