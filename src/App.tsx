import { useKV } from '@github/spark/hooks'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { WelcomeScreen } from './components/WelcomeScreen'
import { CJComprehensiveTest } from './pages/CJComprehensiveTest'
import InventoryFulfillmentDashboard from './pages/InventoryFulfillmentDashboard'
import { ComprehensiveTestSuite } from './pages/ComprehensiveTestSuite'
import { AIContentGenerationPipeline } from './pages/AIContentGenerationPipeline'
import { ComprehensiveTestingDashboard } from './pages/ComprehensiveTestingDashboard'
import { UnsplashIntegration } from './pages/UnsplashIntegration'
import { Toaster } from '@/components/ui/sonner'
import { LanguageProvider } from './contexts/LanguageContext'

function App() {
  const [user] = useKV('user-profile', null)
  const [showCJTest] = useKV('show-cj-comprehensive-test', false) // Disabled by default
  const [showInventoryDashboard] = useKV('show-inventory-dashboard', false) // Disabled
  const [showTestSuite] = useKV('show-comprehensive-test-suite', false) // Disabled
  const [showAIPipeline] = useKV('show-ai-content-pipeline', false) // Disabled
  const [showTestingDashboard] = useKV('show-testing-dashboard', false) // Disabled
  const [showUnsplashIntegration] = useKV('show-unsplash-integration', true) // Show Unsplash integration
  
  
  if (showUnsplashIntegration) {
    return (
      <LanguageProvider>
        <UnsplashIntegration />
        <Toaster />
      </LanguageProvider>
    )
  }
  
  if (showTestingDashboard) {
    return (
      <LanguageProvider>
        <ComprehensiveTestingDashboard />
        <Toaster />
      </LanguageProvider>
    )
  }
  
  if (showAIPipeline) {
    return (
      <LanguageProvider>
        <AIContentGenerationPipeline />
        <Toaster />
      </LanguageProvider>
    )
  }
  
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