import { useKV } from '@github/spark/hooks'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { WelcomeScreen } from './components/WelcomeScreen'
import { Toaster } from '@/components/ui/sonner'

function App() {
  const [user] = useKV('user-profile', null)
  
  return (
    <>
      {!user ? <WelcomeScreen /> : <DashboardLayout />}
      <Toaster />
    </>
  )
}

export default App