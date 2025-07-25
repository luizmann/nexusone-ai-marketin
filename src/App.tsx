import { useKV } from '@github/spark/hooks'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { WelcomeScreen } from './components/WelcomeScreen'
import { CJComprehensiveTest } from './pages/CJComprehensiveTest'
import InventoryFulfillmentDashboard from './pages/InventoryFulfillmentDashboard'
import { Toaster } from '@/components/ui/sonner'
import { LanguageProvider } from './contexts/LanguageContext'

function App() {
  const [user] = useKV('user-profile', null)
  const [showCJTest] = useKV('show-cj-comprehensive-test', false) // Disabled by default
  const [showInventoryDashboard] = useKV('show-inventory-dashboard', true) // Show inventory dashboard
  
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
  
  return (
    <LanguageProvider>
      {!user ? <WelcomeScreen /> : <DashboardLayout />}
      <Toaster />
    </LanguageProvider>
  )
}

export default App