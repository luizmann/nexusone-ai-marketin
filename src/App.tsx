import { useKV } from '@github/spark/hooks'
import { CleanDashboardLayout } from './components/layout/CleanDashboardLayout'
import { WelcomeScreen } from './components/WelcomeScreen'
import { Toaster } from '@/components/ui/sonner'
import { LanguageProvider } from './contexts/CleanLanguageContext'
import { AuthProvider } from './contexts/AuthContext'
import { CreditProvider } from './contexts/CreditContext'

function App() {
  const [user] = useKV('user-profile', null)
  
  return (
    <AuthProvider>
      <CreditProvider>
        <LanguageProvider>
          {!user ? <WelcomeScreen /> : <CleanDashboardLayout />}
          <Toaster />
        </LanguageProvider>
      </CreditProvider>
    </AuthProvider>
  )
}

export default App