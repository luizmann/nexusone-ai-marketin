import { useState, useEffect, useCallback } from 'react'
import { useKV } from '@github/spark/hooks'
import { toast } from 'sonner'

export interface InventoryItem {
  id: string
  external_id: string
  name: string
  price: number
  stock_quantity: number
  is_available: boolean
  last_sync_at: string
  supplier: string
  category: string
  image_url?: string
  total_sales: number
  low_stock_threshold: number
  auto_sync_enabled: boolean
  performance_score: number
}

export interface Order {
  id: string
  external_order_id?: string
  status: string
  fulfillment_status: string
  products: any[]
  shipping_address: any
  tracking_number?: string
  total_amount: number
  commission_amount: number
  created_at: string
  updated_at: string
  estimated_delivery_days?: number
}

export interface AutomationSchedule {
  id: string
  name: string
  task_type: string
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly'
  is_active: boolean
  last_run_at?: string
  next_run_at?: string
  success_count: number
  failure_count: number
  config: any
}

export interface SyncStatus {
  isRunning: boolean
  progress: number
  currentTask: string
  startTime?: Date
  estimatedCompletion?: Date
}

export interface DashboardMetrics {
  products: {
    total: number
    active: number
    lowStock: number
    outOfStock: number
  }
  orders: {
    total: number
    pending: number
    shipped: number
    delivered: number
  }
  automation: {
    activeSchedules: number
    tasksToday: number
    successRate: number
  }
  revenue: {
    total: number
    commission: number
    thisMonth: number
  }
}

export function useInventoryFulfillment() {
  const [user] = useKV('user-profile', null)
  
  // State
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [schedules, setSchedules] = useState<AutomationSchedule[]>([])
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isRunning: false,
    progress: 0,
    currentTask: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load initial data
  useEffect(() => {
    if (user?.id) {
      loadDashboardData()
      loadAutomationSchedules()
    }
  }, [user?.id])

  // Simulate real-time sync status updates
  useEffect(() => {
    if (syncStatus.isRunning) {
      const interval = setInterval(() => {
        setSyncStatus(prev => {
          if (prev.progress >= 100) {
            clearInterval(interval)
            return { ...prev, isRunning: false, currentTask: 'Completed' }
          }
          return {
            ...prev,
            progress: Math.min(100, prev.progress + Math.random() * 10),
            currentTask: getRandomSyncTask()
          }
        })
      }, 500)

      return () => clearInterval(interval)
    }
  }, [syncStatus.isRunning])

  const getRandomSyncTask = () => {
    const tasks = [
      'Fetching product data...',
      'Updating stock levels...',
      'Syncing prices...',
      'Checking availability...',
      'Updating database...',
      'Sending notifications...'
    ]
    return tasks[Math.floor(Math.random() * tasks.length)]
  }

  // Load dashboard data
  const loadDashboardData = useCallback(async () => {
    if (!user?.id) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      // In a real implementation, these would be Supabase calls
      // For now, using mock data
      
      const mockInventory: InventoryItem[] = [
        {
          id: '1',
          external_id: 'CJ123456',
          name: 'Wireless Bluetooth Headphones',
          price: 29.99,
          stock_quantity: 45,
          is_available: true,
          last_sync_at: new Date().toISOString(),
          supplier: 'cj_dropshipping',
          category: 'Electronics',
          image_url: 'https://via.placeholder.com/100x100?text=Headphones',
          total_sales: 128,
          low_stock_threshold: 10,
          auto_sync_enabled: true,
          performance_score: 4.2
        },
        {
          id: '2',
          external_id: 'CJ789012',
          name: 'Smart Fitness Watch',
          price: 89.99,
          stock_quantity: 3,
          is_available: true,
          last_sync_at: new Date().toISOString(),
          supplier: 'cj_dropshipping',
          category: 'Electronics',
          image_url: 'https://via.placeholder.com/100x100?text=Watch',
          total_sales: 67,
          low_stock_threshold: 5,
          auto_sync_enabled: true,
          performance_score: 3.8
        },
        {
          id: '3',
          external_id: 'CJ345678',
          name: 'LED Strip Lights',
          price: 19.99,
          stock_quantity: 0,
          is_available: false,
          last_sync_at: new Date().toISOString(),
          supplier: 'cj_dropshipping',
          category: 'Home & Garden',
          image_url: 'https://via.placeholder.com/100x100?text=LED',
          total_sales: 234,
          low_stock_threshold: 15,
          auto_sync_enabled: true,
          performance_score: 4.5
        }
      ]

      const mockOrders: Order[] = [
        {
          id: 'ORD001',
          external_order_id: 'CJ-ORD-123456',
          status: 'shipped',
          fulfillment_status: 'processing',
          products: [{ productId: '1', quantity: 2, price: 29.99 }],
          shipping_address: { country: 'US', state: 'CA', city: 'Los Angeles' },
          tracking_number: 'TRK123456789',
          total_amount: 59.98,
          commission_amount: 17.99,
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
          estimated_delivery_days: 7
        },
        {
          id: 'ORD002',
          external_order_id: 'CJ-ORD-789012',
          status: 'pending',
          fulfillment_status: 'waiting',
          products: [{ productId: '2', quantity: 1, price: 89.99 }],
          shipping_address: { country: 'UK', state: 'London' },
          total_amount: 89.99,
          commission_amount: 26.99,
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
          estimated_delivery_days: 10
        }
      ]

      setInventory(mockInventory)
      setOrders(mockOrders)

      // Calculate metrics
      const newMetrics: DashboardMetrics = {
        products: {
          total: mockInventory.length,
          active: mockInventory.filter(p => p.is_available).length,
          lowStock: mockInventory.filter(p => p.stock_quantity <= p.low_stock_threshold && p.stock_quantity > 0).length,
          outOfStock: mockInventory.filter(p => p.stock_quantity === 0).length
        },
        orders: {
          total: mockOrders.length,
          pending: mockOrders.filter(o => o.status === 'pending').length,
          shipped: mockOrders.filter(o => o.status === 'shipped').length,
          delivered: mockOrders.filter(o => o.status === 'delivered').length
        },
        automation: {
          activeSchedules: 3,
          tasksToday: 15,
          successRate: 98.5
        },
        revenue: {
          total: mockOrders.reduce((sum, o) => sum + o.total_amount, 0),
          commission: mockOrders.reduce((sum, o) => sum + o.commission_amount, 0),
          thisMonth: 1250.00
        }
      }
      
      setMetrics(newMetrics)

    } catch (err) {
      setError(err.message || 'Failed to load dashboard data')
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  // Load automation schedules
  const loadAutomationSchedules = useCallback(async () => {
    if (!user?.id) return

    try {
      const mockSchedules: AutomationSchedule[] = [
        {
          id: '1',
          name: 'Daily Inventory Sync',
          task_type: 'inventory_sync',
          frequency: 'daily',
          is_active: true,
          last_run_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          next_run_at: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
          success_count: 28,
          failure_count: 1,
          config: { syncAll: true, lowStockAlert: true }
        },
        {
          id: '2',
          name: 'Order Status Updates',
          task_type: 'order_fulfillment',
          frequency: 'hourly',
          is_active: true,
          last_run_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          next_run_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          success_count: 156,
          failure_count: 3,
          config: { trackingUpdates: true, customerNotification: true }
        },
        {
          id: '3',
          name: 'Stock Alerts',
          task_type: 'stock_alert',
          frequency: 'daily',
          is_active: false,
          last_run_at: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
          next_run_at: new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString(),
          success_count: 15,
          failure_count: 0,
          config: { threshold: 5, emailAlert: true }
        }
      ]

      setSchedules(mockSchedules)
    } catch (err) {
      console.error('Failed to load automation schedules:', err)
    }
  }, [user?.id])

  // Sync inventory
  const syncInventory = useCallback(async (productIds?: string[], options: any = {}) => {
    if (!user?.id) {
      toast.error('User not authenticated')
      return false
    }

    setSyncStatus({
      isRunning: true,
      progress: 0,
      currentTask: 'Initializing sync...',
      startTime: new Date(),
      estimatedCompletion: new Date(Date.now() + 30000) // 30 seconds estimate
    })

    try {
      // Simulate API call to inventory sync edge function
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const syncedCount = productIds?.length || inventory.length
      
      // Update inventory with new data
      setInventory(prev => prev.map(item => ({
        ...item,
        last_sync_at: new Date().toISOString(),
        stock_quantity: Math.max(0, item.stock_quantity + Math.floor(Math.random() * 10) - 5)
      })))

      toast.success(`Successfully synced ${syncedCount} products`)
      return true

    } catch (err) {
      setError(err.message || 'Sync failed')
      toast.error('Inventory sync failed: ' + err.message)
      return false
    } finally {
      setSyncStatus(prev => ({
        ...prev,
        isRunning: false,
        progress: 100,
        currentTask: 'Completed'
      }))
    }
  }, [user?.id, inventory])

  // Process order fulfillment
  const processOrderFulfillment = useCallback(async (orderId: string, action: string) => {
    if (!user?.id) {
      toast.error('User not authenticated')
      return false
    }

    setIsLoading(true)
    
    try {
      // Simulate API call to order fulfillment edge function
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Update order status
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              status: action === 'confirm' ? 'confirmed' : order.status,
              fulfillment_status: action === 'track' ? 'shipped' : order.fulfillment_status,
              updated_at: new Date().toISOString()
            }
          : order
      ))

      toast.success(`Order ${action} completed successfully`)
      return true

    } catch (err) {
      setError(err.message || 'Order processing failed')
      toast.error(`Order ${action} failed: ` + err.message)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  // Create automation schedule
  const createSchedule = useCallback(async (scheduleData: Partial<AutomationSchedule>) => {
    if (!user?.id) return false

    try {
      const newSchedule: AutomationSchedule = {
        id: Date.now().toString(),
        name: scheduleData.name || 'New Schedule',
        task_type: scheduleData.task_type || 'inventory_sync',
        frequency: scheduleData.frequency || 'daily',
        is_active: scheduleData.is_active ?? true,
        next_run_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        success_count: 0,
        failure_count: 0,
        config: scheduleData.config || {}
      }

      setSchedules(prev => [...prev, newSchedule])
      toast.success('Automation schedule created')
      return true

    } catch (err) {
      toast.error('Failed to create schedule')
      return false
    }
  }, [user?.id])

  // Update automation schedule
  const updateSchedule = useCallback(async (scheduleId: string, updates: Partial<AutomationSchedule>) => {
    try {
      setSchedules(prev => prev.map(schedule => 
        schedule.id === scheduleId 
          ? { ...schedule, ...updates }
          : schedule
      ))
      
      toast.success('Schedule updated successfully')
      return true

    } catch (err) {
      toast.error('Failed to update schedule')
      return false
    }
  }, [])

  // Delete automation schedule
  const deleteSchedule = useCallback(async (scheduleId: string) => {
    try {
      setSchedules(prev => prev.filter(schedule => schedule.id !== scheduleId))
      toast.success('Schedule deleted successfully')
      return true

    } catch (err) {
      toast.error('Failed to delete schedule')
      return false
    }
  }, [])

  // Get filtered inventory
  const getFilteredInventory = useCallback((filters: {
    search?: string
    category?: string
    stockStatus?: 'all' | 'in_stock' | 'low_stock' | 'out_of_stock'
    supplier?: string
  }) => {
    return inventory.filter(item => {
      const matchesSearch = !filters.search || 
        item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        item.external_id.toLowerCase().includes(filters.search.toLowerCase())
      
      const matchesCategory = !filters.category || item.category === filters.category
      
      const matchesSupplier = !filters.supplier || item.supplier === filters.supplier
      
      const matchesStock = !filters.stockStatus || filters.stockStatus === 'all' ||
        (filters.stockStatus === 'in_stock' && item.stock_quantity > item.low_stock_threshold) ||
        (filters.stockStatus === 'low_stock' && item.stock_quantity <= item.low_stock_threshold && item.stock_quantity > 0) ||
        (filters.stockStatus === 'out_of_stock' && item.stock_quantity === 0)
      
      return matchesSearch && matchesCategory && matchesSupplier && matchesStock
    })
  }, [inventory])

  // Get filtered orders
  const getFilteredOrders = useCallback((filters: {
    search?: string
    status?: string
    dateRange?: { start: Date, end: Date }
  }) => {
    return orders.filter(order => {
      const matchesSearch = !filters.search || 
        order.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.external_order_id?.toLowerCase().includes(filters.search.toLowerCase())
      
      const matchesStatus = !filters.status || filters.status === 'all' || order.status === filters.status
      
      const matchesDateRange = !filters.dateRange || 
        (new Date(order.created_at) >= filters.dateRange.start && 
         new Date(order.created_at) <= filters.dateRange.end)
      
      return matchesSearch && matchesStatus && matchesDateRange
    })
  }, [orders])

  return {
    // State
    inventory,
    orders,
    schedules,
    metrics,
    syncStatus,
    isLoading,
    error,
    
    // Actions
    loadDashboardData,
    syncInventory,
    processOrderFulfillment,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    
    // Filters
    getFilteredInventory,
    getFilteredOrders,
    
    // Utils
    refresh: loadDashboardData
  }
}