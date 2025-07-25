import { useKV } from '@github/spark/hooks'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { WelcomeScreen } from './components/WelcomeScreen'
import { CJComprehensiveTest } from './pages/CJComprehensiveTest'
import { Toaster } from '@/components/ui/sonner'
import { LanguageProvider } from './contexts/LanguageContext'

function App() {
  const [user] = useKV('user-profile', null)
  const [showCJTest] = useKV('show-cj-comprehensive-test', true) // Show CJ comprehensive test
  
  if (showCJTest) {
    return (
      <LanguageProvider>
        <CJComprehensiveTest />
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