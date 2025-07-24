import { Button } from '@/components/ui/button'
import { useKV } from '@github/spark/hooks'
import { 
  House, 
  PenNib, 
  Target, 
  BarChart3, 
  CurrencyCircleDollar,
  Zap
} from '@phosphor-icons/react'

interface SidebarProps {
  activeModule: string
  onModuleChange: (module: string) => void
}

export function Sidebar({ activeModule, onModuleChange }: SidebarProps) {
  const [user] = useKV('user-profile', null)

  const modules = [
    { id: 'dashboard', label: 'Dashboard', icon: House },
    { id: 'content', label: 'Content Generator', icon: PenNib },
    { id: 'campaigns', label: 'Campaigns', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'credits', label: 'Credits', icon: CurrencyCircleDollar },
  ]

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" weight="fill" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">NexusOne</h2>
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
              className="w-full justify-start text-left"
              onClick={() => onModuleChange(module.id)}
            >
              <Icon className="w-5 h-5 mr-3" weight={isActive ? "fill" : "regular"} />
              {module.label}
            </Button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="bg-muted rounded-lg p-3 text-center">
          <p className="text-sm font-medium text-foreground">{user?.credits || 0} Credits</p>
          <p className="text-xs text-muted-foreground">{user?.plan?.toUpperCase()} Plan</p>
        </div>
      </div>
    </div>
  )
}