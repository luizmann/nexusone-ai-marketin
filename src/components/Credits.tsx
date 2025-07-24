import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useKV } from '@github/spark/hooks'
import { CurrencyCircleDollar, CreditCard, History, Plus } from '@phosphor-icons/react'
import { toast } from 'sonner'

export function Credits() {
  const [user, setUser] = useKV('user-profile', null)
  const [creditHistory, setCreditHistory] = useKV('credit-history', [])
  const [showPurchaseForm, setShowPurchaseForm] = useState(false)
  const [creditPackage, setCreditPackage] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')

  const creditPackages = [
    { value: '100', label: '100 Credits', price: '$9.99', bonus: '' },
    { value: '250', label: '250 Credits', price: '$19.99', bonus: '+25 Bonus Credits' },
    { value: '500', label: '500 Credits', price: '$34.99', bonus: '+75 Bonus Credits' },
    { value: '1000', label: '1000 Credits', price: '$59.99', bonus: '+200 Bonus Credits' }
  ]

  const usageCosts = [
    { feature: 'Content Generation', cost: '10 credits', description: 'AI-powered marketing copy' },
    { feature: 'Campaign Creation', cost: '15 credits', description: 'Build marketing campaigns' },
    { feature: 'Analytics Report', cost: '5 credits', description: 'Detailed performance insights' },
    { feature: 'A/B Test Setup', cost: '20 credits', description: 'Campaign optimization testing' }
  ]

  const purchaseCredits = () => {
    if (!creditPackage || !paymentMethod) {
      toast.error('Please select a credit package and payment method')
      return
    }

    const selectedPackage = creditPackages.find(p => p.value === creditPackage)
    if (!selectedPackage) return

    const baseCredits = parseInt(creditPackage)
    const bonusCredits = selectedPackage.bonus ? parseInt(selectedPackage.bonus.match(/\d+/)?.[0] || '0') : 0
    const totalCredits = baseCredits + bonusCredits

    if (user) {
      setUser({
        ...user,
        credits: user.credits + totalCredits
      })
    }

    const transaction = {
      id: Date.now(),
      type: 'purchase',
      amount: totalCredits,
      price: selectedPackage.price,
      description: `Purchased ${selectedPackage.label}${selectedPackage.bonus ? ` (${selectedPackage.bonus})` : ''}`,
      timestamp: new Date().toISOString()
    }

    setCreditHistory((prev) => [transaction, ...prev])
    toast.success(`Successfully purchased ${totalCredits} credits!`)
    setShowPurchaseForm(false)
    setCreditPackage('')
    setPaymentMethod('')
  }

  const getCurrentPlanLimits = () => {
    const plan = user?.plan || 'free'
    switch (plan) {
      case 'free':
        return { monthly: 50, features: 'Basic features only' }
      case 'pro':
        return { monthly: 500, features: 'Advanced features included' }
      case 'premium':
        return { monthly: 2000, features: 'All features + priority support' }
      default:
        return { monthly: 50, features: 'Basic features only' }
    }
  }

  const planLimits = getCurrentPlanLimits()
  const recentTransactions = creditHistory.slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Credits Management</h2>
        <p className="text-muted-foreground">
          Manage your credit balance and purchase additional credits
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center">
              <CurrencyCircleDollar className="w-6 h-6 mr-2 text-accent" />
              Current Balance
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-4xl font-bold text-accent mb-2">{user?.credits || 0}</p>
            <p className="text-sm text-muted-foreground mb-4">Credits available</p>
            <Button onClick={() => setShowPurchaseForm(true)} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Buy More Credits
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Your subscription plan details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Plan Type</span>
                <span className="text-lg font-semibold capitalize">{user?.plan || 'Free'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Monthly Credits</span>
                <span className="text-lg font-semibold">{planLimits.monthly}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Features</span>
                <span className="text-sm text-foreground">{planLimits.features}</span>
              </div>
              <Button variant="outline" className="w-full">
                Upgrade Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {showPurchaseForm && (
        <Card>
          <CardHeader>
            <CardTitle>Purchase Credits</CardTitle>
            <CardDescription>Select a credit package to add to your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {creditPackages.map((pkg) => (
                <div
                  key={pkg.value}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    creditPackage === pkg.value
                      ? 'border-accent bg-accent/5'
                      : 'border-border hover:border-accent/50'
                  }`}
                  onClick={() => setCreditPackage(pkg.value)}
                >
                  <div className="text-center">
                    <p className="font-semibold">{pkg.label}</p>
                    <p className="text-2xl font-bold text-accent">{pkg.price}</p>
                    {pkg.bonus && (
                      <p className="text-xs text-green-600 font-medium">{pkg.bonus}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-method">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit-card">Credit Card</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex space-x-2">
              <Button onClick={purchaseCredits} disabled={!creditPackage || !paymentMethod}>
                <CreditCard className="w-4 h-4 mr-2" />
                Complete Purchase
              </Button>
              <Button variant="outline" onClick={() => setShowPurchaseForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Credit Usage Guide</CardTitle>
            <CardDescription>How credits are used across features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {usageCosts.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{item.feature}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <span className="text-sm font-semibold text-accent">{item.cost}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <History className="w-5 h-5 mr-2" />
              Recent Transactions
            </CardTitle>
            <CardDescription>Your latest credit activities</CardDescription>
          </CardHeader>
          <CardContent>
            {recentTransactions.length > 0 ? (
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'purchase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'purchase' ? '+' : '-'}{transaction.amount}
                      </p>
                      {transaction.price && (
                        <p className="text-xs text-muted-foreground">{transaction.price}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <History className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No transactions yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}