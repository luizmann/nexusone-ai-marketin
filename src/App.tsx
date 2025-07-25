import { useKV } from '@github/spark/hooks'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { WelcomeScreen } from './components/WelcomeScreen'
import { CJComprehensiveTest } from './pages/CJComprehensiveTest'
import InventoryFulfillmentDashboard from './pages/InventoryFulfillmentDashboard'
import { ComprehensiveTestSuite } from './pages/ComprehensiveTestSuite'
import { Toaster } from '@/components/ui/sonner'
import { LanguageProvider } from './contexts/LanguageContext'

function App() {
  const [user] = useKV('user-profile', null)
  const [showCJTest] = useKV('show-cj-comprehensive-test', false) // Disabled by default
  const [showInventoryDashboard] = useKV('show-inventory-dashboard', false) // Disabled
  const [showTestSuite] = useKV('show-comprehensive-test-suite', true) // Show test suite
  
  if (showCJTest) {
    return (
      <LanguageProvider>
        <CJComprehensiveTest />
        <Toaster />
      </LanguageProvider>
    )
  }
  
  if (showInventoryDashboard) {
    return (
      <LanguageProvider>
        <InventoryFulfillmentDashboard />
        <Toaster />
      </LanguageProvider>
    )
  }
  
  if (showTestSuite) {
    return (
      <LanguageProvider>
        <ComprehensiveTestSuite />
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