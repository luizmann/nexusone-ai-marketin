import { Button } from '@/components/ui/button'
import { useKV } from '@github/spark/hooks'
import { 
  House, 
  PenNib, 
  Target, 
  BarChart3, 
  CurrencyCircleDollar,
  Zap,
  Hash,
  BookOpen,
  Shield,
  ShoppingCart,
  FileText,
  Activity,
  Handshake,
  Users,
  Calendar,
  Bot,
  MessageCircle,
  Package,
  Storefront,
  Layout,
  Rocket,
  FlaskIcon,
  Video
} from '@phosphor-icons/react'
import { useLanguage } from '../../contexts/LanguageContext'

interface SidebarProps {
  activeModule: string
  onModuleChange: (module: string) => void
}

export function Sidebar({ activeModule, onModuleChange }: SidebarProps) {
  const [user] = useKV('user-profile', null)
  const { t, isRTL } = useLanguage()

  const modules = [
    { id: 'dashboard', label: t('navigation.dashboard'), icon: House },
    { id: 'launch-campaigns', label: 'Launch Campaign Manager', icon: Rocket },
    { id: 'dropshipping-marketplace', label: 'CJ Dropshipping', icon: Package },
    { id: 'drop-magic', label: 'Drop Magic - Marketplace', icon: Zap },
    { id: 'smart-appointments', label: 'Smart Appointments', icon: Bot },
    { id: 'drag-drop-editor', label: 'Drag & Drop Editor', icon: Layout },
    { id: 'dropshipping', label: 'Marketplace Dropshipping', icon: Storefront },
    { id: 'page-editor', label: t('modules.page_editor.title'), icon: FileText },
    { id: 'content', label: t('modules.content_generator'), icon: PenNib },
    { id: 'luma-video', label: 'Luma AI Video Creator', icon: Video },
    { id: 'social-media', label: t('modules.social_media.title'), icon: Hash },
    { id: 'campaigns', label: t('campaign_builder.title'), icon: Target },
    { id: 'whatsapp-booking', label: 'Sistema WhatsApp Agendamento', icon: MessageCircle },
    { id: 'whatsapp-ai', label: 'WhatsApp AI Extreme', icon: Bot },
    { id: 'appointment', label: t('appointment.title', 'Agendamento Simples'), icon: Calendar },
    { id: 'api-testing', label: 'API Testing Dashboard', icon: FlaskIcon },
    { id: 'analytics', label: t('navigation.analytics'), icon: BarChart3 },
    { id: 'monitoring', label: t('monitoring.title', 'Monitoring'), icon: Activity },
    { id: 'affiliate', label: t('affiliate.title'), icon: Users },
    { id: 'partners', label: t('partners.title'), icon: Handshake },
    { id: 'credits', label: t('navigation.credits'), icon: CurrencyCircleDollar },
    { id: 'sales-page', label: t('sales_page.hero.title'), icon: ShoppingCart },
    { id: 'documentation', label: t('navigation.documentation'), icon: BookOpen },
    { id: 'privacy', label: t('footer.privacy'), icon: Shield },
    { id: 'status', label: t('footer.status'), icon: FileText },
  ]

  return (
    <div className={`w-64 bg-card border-r border-border flex flex-col ${isRTL ? 'border-l border-r-0' : ''}`}>
      <div className="p-6 border-b border-border">
        <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" weight="fill" />
          </div>
          <div className={isRTL ? 'text-right' : ''}>
            <h2 className="text-lg font-semibold text-foreground">{t('common.nexusone')}</h2>
            <p className="text-sm text-muted-foreground">{user?.company}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {modules.map((module) => {
          const Icon = module.icon
          const isActive = activeModule === module.id
          
          return (
            <Button
              key={module.id}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start ${isRTL ? 'text-right flex-row-reverse' : 'text-left'}`}
              onClick={() => onModuleChange(module.id)}
            >
              <Icon className={`w-5 h-5 ${isRTL ? 'ml-3' : 'mr-3'}`} weight={isActive ? "fill" : "regular"} />
              {module.label}
            </Button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className={`bg-muted rounded-lg p-3 text-center ${isRTL ? 'text-right' : ''}`}>
          <p className="text-sm font-medium text-foreground">{user?.credits || 0} {t('credits.balance')}</p>
          <p className="text-xs text-muted-foreground">{user?.plan?.toUpperCase()} {t('pricing.title')}</p>
        </div>
      </div>
    </div>
  )
}