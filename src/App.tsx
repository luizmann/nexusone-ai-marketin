import { useKV } from '@github/spark/hooks'
import { CleanDashboardLayout } from './components/layout/CleanDashboardLayout'
import { WelcomeScreen } from './components/WelcomeScreen'
import { Toaster } from '@/components/ui/sonner'
import { LanguageProvider } from './contexts/CleanLanguageContext'

function App() {
  const [user] = useKV('user-profile', null)
  
  return (
    <LanguageProvider>
      {!user ? <WelcomeScreen /> : <CleanDashboardLayout />}
      <Toaster />
    </LanguageProvider>
  )
}

export default App