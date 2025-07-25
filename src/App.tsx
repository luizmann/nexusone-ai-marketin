import { useKV } from '@github/spark/hooks'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { WelcomeScreen } from './components/WelcomeScreen'
import { FacebookTokenAnalysisPage } from './pages/FacebookTokenAnalysis'
import { Toaster } from '@/components/ui/sonner'
import { LanguageProvider } from './contexts/LanguageContext'

function App() {
  const [user] = useKV('user-profile', null)
  const [showFacebookAnalysis] = useKV('show-facebook-analysis', true) // For demo purposes
  
  if (showFacebookAnalysis) {
    return (
      <LanguageProvider>
        <FacebookTokenAnalysisPage />
        <Toaster />
      </LanguageProvider>
    )
  }
  
  return (
    <LanguageProvider>
      {!user ? <WelcomeScreen /> : <DashboardLayout />}
      <Toaster />
    </LanguageProvider>
  )
}

export default App