import { Button } from '@/components/ui/button'
import { useKV } from '@github/spark/hooks'
import { User, SignOut } from '@phosphor-icons/react'
import { useLanguage } from '../../contexts/LanguageContext'
import { LanguageSelector } from '../LanguageSelector'

export function Header() {
  const [user, setUser] = useKV('user-profile', null)
  const { t, isRTL } = useLanguage()

  const handleSignOut = () => {
    setUser(null)
  }

  return (
    <header className={`h-16 bg-card border-b border-border flex items-center justify-between px-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
      <div className={isRTL ? 'text-right' : ''}>
        <h1 className="text-xl font-semibold text-foreground">
          {t('welcome.title')}, {user?.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t('dashboard.subtitle')}
        </p>
      </div>

      <div className={`flex items-center space-x-4 ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
        <LanguageSelector />
        
        <div className={`flex items-center space-x-2 text-sm text-muted-foreground ${isRTL ? 'space-x-reverse flex-row-reverse' : ''}`}>
          <User className="w-4 h-4" />
          <span>{user?.name}</span>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleSignOut}
          className="text-muted-foreground hover:text-foreground"
        >
          <SignOut className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('common.logout')}
        </Button>
      </div>
    </header>
  )
}