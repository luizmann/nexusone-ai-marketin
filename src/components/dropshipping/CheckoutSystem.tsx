import React, { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { 
  ShoppingCart, 
  MessageCircle, 
  CreditCard,
  Shield,
  Star,
  Minus,
  Plus,
  Truck,
  ArrowRight,
  DollarSign,
  Gift,
  Lock,
  Check
} from '@phosphor-icons/react'
import { toast } from 'sonner'

interface CheckoutProduct {
  id: string
  name: string
  image: string
  price: number
  originalPrice: number
  quantity: number
  variant?: {
    color?: string
    size?: string
  }
}

interface CheckoutData {
  products: CheckoutProduct[]
  customer: {
    name: string
    email: string
    phone: string
    address: {
      street: string
      city: string
      state: string
      zipCode: string
      country: string
    }
  }
  payment: {
    method: 'whatsapp' | 'credit_card' | 'paypal' | 'apple_pay' | 'google_pay'
    cardDetails?: {
      number: string
      expiry: string
      cvv: string
      name: string
    }
  }
  shipping: {
    method: 'standard' | 'express' | 'overnight'
    cost: number
  }
  totals: {
    subtotal: number
    shipping: number
    tax: number
    discount: number
    total: number
  }
}

export function CheckoutSystem({ campaignId }: { campaignId?: string }) {
  const [checkoutData, setCheckoutData] = useKV<CheckoutData>('checkout-data', {
    products: [
      {
        id: '1',
        name: 'Wireless Bluetooth Earbuds Pro Max',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200',
        price: 29.99,
        originalPrice: 59.99,
        quantity: 1,
        variant: { color: 'Black' }
      }
    ],
    customer: {
      name: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States'
      }
    },
    payment: {
      method: 'whatsapp'
    },
    shipping: {
      method: 'standard',
      cost: 0
    },
    totals: {
      subtotal: 29.99,
      shipping: 0,
      tax: 2.40,
      discount: 5.00,
      total: 27.39
    }
  })

  const [currentStep, setCurrentStep] = useState<'cart' | 'shipping' | 'payment' | 'review'>('cart')
  const [isProcessing, setIsProcessing] = useState(false)

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    
    setCheckoutData(prev => ({
      ...prev,
      products: prev.products.map(p => 
        p.id === productId ? { ...p, quantity: newQuantity } : p
      )
    }))
    
    calculateTotals()
  }

  const removeProduct = (productId: string) => {
    setCheckoutData(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== productId)
    }))
    
    calculateTotals()
  }

  const calculateTotals = () => {
    const subtotal = checkoutData.products.reduce((sum, product) => 
      sum + (product.price * product.quantity), 0
    )
    
    const shipping = checkoutData.shipping.cost
    const tax = subtotal * 0.08 // 8% tax
    const discount = subtotal > 50 ? 5.00 : 0 // $5 discount on orders over $50
    const total = subtotal + shipping + tax - discount

    setCheckoutData(prev => ({
      ...prev,
      totals: {
        subtotal: Number(subtotal.toFixed(2)),
        shipping: Number(shipping.toFixed(2)),
        tax: Number(tax.toFixed(2)),
        discount: Number(discount.toFixed(2)),
        total: Number(total.toFixed(2))
      }
    }))
  }

  const updateCustomerInfo = (field: string, value: string) => {
    setCheckoutData(prev => ({
      ...prev,
      customer: {
        ...prev.customer,
        [field]: value
      }
    }))
  }

  const updateAddress = (field: string, value: string) => {
    setCheckoutData(prev => ({
      ...prev,
      customer: {
        ...prev.customer,
        address: {
          ...prev.customer.address,
          [field]: value
        }
      }
    }))
  }

  const updatePaymentMethod = (method: CheckoutData['payment']['method']) => {
    setCheckoutData(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        method
      }
    }))
  }

  const updateShippingMethod = (method: CheckoutData['shipping']['method']) => {
    const shippingCosts = {
      standard: 0,
      express: 9.99,
      overnight: 19.99
    }
    
    setCheckoutData(prev => ({
      ...prev,
      shipping: {
        method,
        cost: shippingCosts[method]
      }
    }))
    
    calculateTotals()
  }

  const processWhatsAppOrder = () => {
    const orderSummary = checkoutData.products.map(p => 
      `${p.quantity}x ${p.name} - $${(p.price * p.quantity).toFixed(2)}`
    ).join('\n')
    
    const message = `Hi! I'd like to place an order:

${orderSummary}

Total: $${checkoutData.totals.total}

Customer Info:
Name: ${checkoutData.customer.name}
Email: ${checkoutData.customer.email}
Phone: ${checkoutData.customer.phone}

Shipping Address:
${checkoutData.customer.address.street}
${checkoutData.customer.address.city}, ${checkoutData.customer.address.state} ${checkoutData.customer.address.zipCode}
${checkoutData.customer.address.country}

Please confirm my order. Thank you!`

    const whatsappUrl = `https://wa.me/1234567890?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
    
    toast.success('Redirecting to WhatsApp to complete your order!')
  }

  const processDirectPayment = async () => {
    setIsProcessing(true)
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      toast.success('Payment processed successfully!')
      
      // Here you would integrate with actual payment processors
      // Stripe, PayPal, Square, etc.
      
    } catch (error) {
      toast.error('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCheckout = () => {
    if (checkoutData.payment.method === 'whatsapp') {
      processWhatsAppOrder()
    } else {
      processDirectPayment()
    }
  }

  useEffect(() => {
    calculateTotals()
  }, [checkoutData.products, checkoutData.shipping.method])

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Checkout Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {['cart', 'shipping', 'payment', 'review'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === step 
                    ? 'bg-blue-600 text-white' 
                    : ['cart', 'shipping', 'payment', 'review'].indexOf(currentStep) > index
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {['cart', 'shipping', 'payment', 'review'].indexOf(currentStep) > index ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="ml-2 text-sm font-medium capitalize">{step}</span>
                {index < 3 && <ArrowRight className="w-4 h-4 text-gray-400 mx-4" />}
              </div>
            ))}
          </div>

          {/* Cart Step */}
          {currentStep === 'cart' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Shopping Cart
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {checkoutData.products.map(product => (
                  <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold">{product.name}</h3>
                      {product.variant?.color && (
                        <p className="text-sm text-gray-600">Color: {product.variant.color}</p>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-lg font-bold text-green-600">
                          ${product.price}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ${product.originalPrice}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => updateQuantity(product.id, product.quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center">{product.quantity}</span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => updateQuantity(product.id, product.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">
                        ${(product.price * product.quantity).toFixed(2)}
                      </p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600"
                        onClick={() => removeProduct(product.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="flex justify-end">
                  <Button onClick={() => setCurrentStep('shipping')}>
                    Continue to Shipping
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Shipping Step */}
          {currentStep === 'shipping' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name"
                      value={checkoutData.customer.name}
                      onChange={(e) => updateCustomerInfo('name', e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email"
                      type="email"
                      value={checkoutData.customer.email}
                      onChange={(e) => updateCustomerInfo('email', e.target.value)}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone"
                    value={checkoutData.customer.phone}
                    onChange={(e) => updateCustomerInfo('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <Label htmlFor="street">Street Address</Label>
                  <Input 
                    id="street"
                    value={checkoutData.customer.address.street}
                    onChange={(e) => updateAddress('street', e.target.value)}
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city"
                      value={checkoutData.customer.address.city}
                      onChange={(e) => updateAddress('city', e.target.value)}
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input 
                      id="state"
                      value={checkoutData.customer.address.state}
                      onChange={(e) => updateAddress('state', e.target.value)}
                      placeholder="NY"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input 
                      id="zipCode"
                      value={checkoutData.customer.address.zipCode}
                      onChange={(e) => updateAddress('zipCode', e.target.value)}
                      placeholder="10001"
                    />
                  </div>
                </div>

                <div>
                  <Label>Shipping Method</Label>
                  <RadioGroup 
                    value={checkoutData.shipping.method} 
                    onValueChange={(value: any) => updateShippingMethod(value)}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="standard" id="standard" />
                      <Label htmlFor="standard" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Standard Shipping</p>
                            <p className="text-sm text-gray-600">7-15 business days</p>
                          </div>
                          <span className="font-semibold">FREE</span>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="express" id="express" />
                      <Label htmlFor="express" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Express Shipping</p>
                            <p className="text-sm text-gray-600">3-5 business days</p>
                          </div>
                          <span className="font-semibold">$9.99</span>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="overnight" id="overnight" />
                      <Label htmlFor="overnight" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Overnight Shipping</p>
                            <p className="text-sm text-gray-600">1-2 business days</p>
                          </div>
                          <span className="font-semibold">$19.99</span>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep('cart')}>
                    Back to Cart
                  </Button>
                  <Button onClick={() => setCurrentStep('payment')}>
                    Continue to Payment
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Step */}
          {currentStep === 'payment' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup 
                  value={checkoutData.payment.method} 
                  onValueChange={(value: any) => updatePaymentMethod(value)}
                >
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="whatsapp" id="whatsapp" />
                    <Label htmlFor="whatsapp" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <MessageCircle className="w-6 h-6 text-green-600" />
                        <div>
                          <p className="font-medium">WhatsApp Checkout</p>
                          <p className="text-sm text-gray-600">Complete your order via WhatsApp chat</p>
                        </div>
                        <Badge className="bg-green-100 text-green-700">Recommended</Badge>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="credit_card" id="credit_card" />
                    <Label htmlFor="credit_card" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                        <div>
                          <p className="font-medium">Credit/Debit Card</p>
                          <p className="text-sm text-gray-600">Visa, Mastercard, American Express</p>
                        </div>
                        <Shield className="w-5 h-5 text-green-600" />
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                          P
                        </div>
                        <div>
                          <p className="font-medium">PayPal</p>
                          <p className="text-sm text-gray-600">Pay with your PayPal account</p>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>

                {checkoutData.payment.method === 'credit_card' && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input 
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input 
                          id="expiry"
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input 
                          id="cvv"
                          placeholder="123"
                          maxLength={4}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input 
                          id="cardName"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep('shipping')}>
                    Back to Shipping
                  </Button>
                  <Button onClick={() => setCurrentStep('review')}>
                    Review Order
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Review Step */}
          {currentStep === 'review' && (
            <Card>
              <CardHeader>
                <CardTitle>Review Your Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Order Items</h3>
                  {checkoutData.products.map(product => (
                    <div key={product.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-600">Qty: {product.quantity}</p>
                        </div>
                      </div>
                      <span className="font-semibold">
                        ${(product.price * product.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3">Shipping Address</h3>
                  <div className="text-sm text-gray-600">
                    <p>{checkoutData.customer.name}</p>
                    <p>{checkoutData.customer.address.street}</p>
                    <p>
                      {checkoutData.customer.address.city}, {checkoutData.customer.address.state} {checkoutData.customer.address.zipCode}
                    </p>
                    <p>{checkoutData.customer.address.country}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-3">Payment Method</h3>
                  <div className="flex items-center gap-2">
                    {checkoutData.payment.method === 'whatsapp' && (
                      <>
                        <MessageCircle className="w-5 h-5 text-green-600" />
                        <span>WhatsApp Checkout</span>
                      </>
                    )}
                    {checkoutData.payment.method === 'credit_card' && (
                      <>
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <span>Credit/Debit Card</span>
                      </>
                    )}
                    {checkoutData.payment.method === 'paypal' && (
                      <>
                        <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                          P
                        </div>
                        <span>PayPal</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setCurrentStep('payment')}>
                    Back to Payment
                  </Button>
                  <Button 
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isProcessing ? (
                      <>Processing...</>
                    ) : checkoutData.payment.method === 'whatsapp' ? (
                      <>
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Complete Order via WhatsApp
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Place Order - ${checkoutData.totals.total}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${checkoutData.totals.subtotal}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {checkoutData.totals.shipping === 0 ? 'FREE' : `$${checkoutData.totals.shipping}`}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${checkoutData.totals.tax}</span>
              </div>
              
              {checkoutData.totals.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${checkoutData.totals.discount}</span>
                </div>
              )}
              
              <Separator />
              
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${checkoutData.totals.total}</span>
              </div>
            </CardContent>
          </Card>

          {/* Trust Badges */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Secure SSL encryption</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Free shipping worldwide</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Gift className="w-4 h-4 text-purple-600" />
                <span>30-day money-back guarantee</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>4.8/5 customer rating</span>
              </div>
            </CardContent>
          </Card>

          {/* Promo Code */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Promo Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input placeholder="Enter code" className="text-sm" />
                <Button variant="outline" size="sm">Apply</Button>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <Gift className="w-4 h-4" />
                  <span className="font-medium">SAVE5 applied!</span>
                </div>
                <p className="text-xs text-green-600 mt-1">You saved $5.00</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}