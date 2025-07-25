/**
 * CJ Dropshipping API Integration Service
 * 
 * This service provides comprehensive integration with CJ Dropshipping API
 * for product import, order management, and fulfillment automation.
 * 
 * API Documentation: https://developers.cjdropshipping.cn/en/api/start/development.html
 */

import { createClient } from '@supabase/supabase-js'
import { API_KEYS } from '../config/api-keys'

// CJ Dropshipping API Configuration
const CJ_API_BASE_URL = 'https://api.cjdropshipping.com'
const CJ_API_VERSION = '/api/v2'

interface CJConfig {
  accessToken: string
  email: string
  password: string
  warehouseCode?: string
}

interface CJProduct {
  id: string
  name: string
  nameEn: string
  sellPrice: number
  originalPrice: number
  currency: string
  weight: number
  imageUrl: string
  images: string[]
  description: string
  variants: CJVariant[]
  category: string
  shippingTime: string
  supplierName: string
  moq: number
  stockQuantity: number
  tags: string[]
  specifications: Record<string, any>
}

interface CJVariant {
  id: string
  name: string
  price: number
  stockQuantity: number
  sku: string
  attributes: Record<string, string>
  image?: string
}

interface CJOrder {
  orderNumber: string
  clientOrderId: string
  products: CJOrderProduct[]
  shippingAddress: CJShippingAddress
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  trackingNumber?: string
  totalAmount: number
  currency: string
  createdAt: string
  updatedAt: string
}

interface CJOrderProduct {
  productId: string
  variantId: string
  quantity: number
  price: number
  name: string
}

interface CJShippingAddress {
  firstName: string
  lastName: string
  email: string
  phone: string
  address1: string
  address2?: string
  city: string
  state: string
  country: string
  zipCode: string
}

export class CJDropshippingService {
  private config: CJConfig
  private supabase: any

  constructor(config: CJConfig) {
    this.config = config
    this.supabase = createClient(
      process.env.SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_KEY || ''
    )
  }

  /**
   * Authenticate with CJ Dropshipping API
   */
  async authenticate(): Promise<string> {
    try {
      const response = await fetch(`${CJ_API_BASE_URL}${CJ_API_VERSION}/authentication/getAccessToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.config.email,
          password: this.config.password
        })
      })

      const data = await response.json()
      
      if (data.result && data.data) {
        this.config.accessToken = data.data.accessToken
        return data.data.accessToken
      }
      
      throw new Error(`Authentication failed: ${data.message}`)
    } catch (error) {
      console.error('CJ Authentication error:', error)
      throw error
    }
  }

  /**
   * Get product list with pagination and filters
   */
  async getProducts(params: {
    pageNum?: number
    pageSize?: number
    categoryId?: string
    keyword?: string
    sortBy?: 'price' | 'sales' | 'newest'
    priceMin?: number
    priceMax?: number
  } = {}): Promise<{ products: CJProduct[], total: number }> {
    try {
      const queryParams = new URLSearchParams({
        pageNum: (params.pageNum || 1).toString(),
        pageSize: (params.pageSize || 20).toString(),
        ...(params.categoryId && { categoryId: params.categoryId }),
        ...(params.keyword && { keyword: params.keyword }),
        ...(params.sortBy && { sortBy: params.sortBy }),
        ...(params.priceMin && { priceMin: params.priceMin.toString() }),
        ...(params.priceMax && { priceMax: params.priceMax.toString() })
      })

      const response = await fetch(
        `${CJ_API_BASE_URL}${CJ_API_VERSION}/products/list?${queryParams}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      const data = await response.json()
      
      if (data.result && data.data) {
        const products = data.data.list.map(this.transformCJProduct)
        return {
          products,
          total: data.data.total
        }
      }
      
      throw new Error(`Failed to fetch products: ${data.message}`)
    } catch (error) {
      console.error('CJ Get products error:', error)
      throw error
    }
  }

  /**
   * Get detailed product information
   */
  async getProductDetails(productId: string): Promise<CJProduct> {
    try {
      const response = await fetch(
        `${CJ_API_BASE_URL}${CJ_API_VERSION}/products/query?pid=${productId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      const data = await response.json()
      
      if (data.result && data.data) {
        return this.transformCJProduct(data.data)
      }
      
      throw new Error(`Failed to fetch product details: ${data.message}`)
    } catch (error) {
      console.error('CJ Get product details error:', error)
      throw error
    }
  }

  /**
   * Import products to our catalog
   */
  async importProductsToCatalog(productIds: string[], userId: string): Promise<void> {
    try {
      for (const productId of productIds) {
        const product = await this.getProductDetails(productId)
        
        // Save to our dropshipping_catalog table
        await this.supabase
          .from('dropshipping_catalog')
          .upsert({
            external_id: product.id,
            name: product.name,
            description: product.description,
            price: product.sellPrice,
            original_price: product.originalPrice,
            currency: product.currency,
            image_url: product.imageUrl,
            images: product.images,
            category: product.category,
            tags: product.tags,
            stock_quantity: product.stockQuantity,
            supplier: 'cj_dropshipping',
            supplier_data: {
              weight: product.weight,
              shippingTime: product.shippingTime,
              supplierName: product.supplierName,
              moq: product.moq,
              variants: product.variants,
              specifications: product.specifications
            },
            imported_by: userId,
            is_active: true
          })
      }
    } catch (error) {
      console.error('Import products error:', error)
      throw error
    }
  }

  /**
   * Create order on CJ Dropshipping
   */
  async createOrder(orderData: {
    clientOrderId: string
    products: CJOrderProduct[]
    shippingAddress: CJShippingAddress
    userId: string
  }): Promise<CJOrder> {
    try {
      const response = await fetch(
        `${CJ_API_BASE_URL}${CJ_API_VERSION}/orders/create`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            orderNumber: orderData.clientOrderId,
            products: orderData.products.map(p => ({
              pid: p.productId,
              vid: p.variantId,
              quantity: p.quantity
            })),
            shippingAddress: orderData.shippingAddress,
            warehouseCode: this.config.warehouseCode || 'CN'
          })
        }
      )

      const data = await response.json()
      
      if (data.result && data.data) {
        const order: CJOrder = {
          orderNumber: data.data.orderNumber,
          clientOrderId: orderData.clientOrderId,
          products: orderData.products,
          shippingAddress: orderData.shippingAddress,
          status: 'pending',
          totalAmount: orderData.products.reduce((sum, p) => sum + (p.price * p.quantity), 0),
          currency: 'USD',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }

        // Save order to our database
        await this.supabase
          .from('dropshipping_orders')
          .insert({
            external_order_id: order.orderNumber,
            client_order_id: order.clientOrderId,
            user_id: orderData.userId,
            products: order.products,
            shipping_address: order.shippingAddress,
            status: order.status,
            total_amount: order.totalAmount,
            currency: order.currency,
            supplier: 'cj_dropshipping',
            created_at: order.createdAt
          })

        return order
      }
      
      throw new Error(`Failed to create order: ${data.message}`)
    } catch (error) {
      console.error('CJ Create order error:', error)
      throw error
    }
  }

  /**
   * Get order status and tracking information
   */
  async getOrderStatus(orderNumber: string): Promise<CJOrder> {
    try {
      const response = await fetch(
        `${CJ_API_BASE_URL}${CJ_API_VERSION}/orders/query?orderNumber=${orderNumber}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      const data = await response.json()
      
      if (data.result && data.data) {
        return this.transformCJOrder(data.data)
      }
      
      throw new Error(`Failed to get order status: ${data.message}`)
    } catch (error) {
      console.error('CJ Get order status error:', error)
      throw error
    }
  }

  /**
   * Get shipping tracking information
   */
  async getTrackingInfo(trackingNumber: string): Promise<any> {
    try {
      const response = await fetch(
        `${CJ_API_BASE_URL}${CJ_API_VERSION}/logistic/tracking?trackingNumber=${trackingNumber}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      const data = await response.json()
      
      if (data.result && data.data) {
        return data.data
      }
      
      throw new Error(`Failed to get tracking info: ${data.message}`)
    } catch (error) {
      console.error('CJ Get tracking info error:', error)
      throw error
    }
  }

  /**
   * Calculate shipping cost
   */
  async calculateShippingCost(params: {
    products: { productId: string; quantity: number }[]
    country: string
    state?: string
    city?: string
  }): Promise<{ cost: number; currency: string; estimatedDays: number }> {
    try {
      const response = await fetch(
        `${CJ_API_BASE_URL}${CJ_API_VERSION}/logistic/shipping-cost`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            products: params.products.map(p => ({
              pid: p.productId,
              quantity: p.quantity
            })),
            country: params.country,
            state: params.state,
            city: params.city
          })
        }
      )

      const data = await response.json()
      
      if (data.result && data.data) {
        return {
          cost: data.data.cost,
          currency: data.data.currency,
          estimatedDays: data.data.estimatedDays
        }
      }
      
      throw new Error(`Failed to calculate shipping cost: ${data.message}`)
    } catch (error) {
      console.error('CJ Calculate shipping cost error:', error)
      throw error
    }
  }

  /**
   * Get trending/hot products
   */
  async getTrendingProducts(limit: number = 50): Promise<CJProduct[]> {
    try {
      const response = await this.getProducts({
        pageSize: limit,
        sortBy: 'sales'
      })
      
      return response.products
    } catch (error) {
      console.error('CJ Get trending products error:', error)
      throw error
    }
  }

  /**
   * Get product categories
   */
  async getCategories(): Promise<any[]> {
    try {
      const response = await fetch(
        `${CJ_API_BASE_URL}${CJ_API_VERSION}/products/categories`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )

      const data = await response.json()
      
      if (data.result && data.data) {
        return data.data
      }
      
      throw new Error(`Failed to get categories: ${data.message}`)
    } catch (error) {
      console.error('CJ Get categories error:', error)
      throw error
    }
  }

  /**
   * Transform CJ product data to our format
   */
  private transformCJProduct(cjProduct: any): CJProduct {
    return {
      id: cjProduct.pid,
      name: cjProduct.productName,
      nameEn: cjProduct.productNameEn,
      sellPrice: parseFloat(cjProduct.sellPrice),
      originalPrice: parseFloat(cjProduct.originalPrice),
      currency: cjProduct.currency || 'USD',
      weight: parseFloat(cjProduct.weight),
      imageUrl: cjProduct.productImage,
      images: cjProduct.productImages || [cjProduct.productImage],
      description: cjProduct.description,
      variants: (cjProduct.variants || []).map((v: any) => ({
        id: v.vid,
        name: v.variantName,
        price: parseFloat(v.variantSellPrice),
        stockQuantity: parseInt(v.variantQuantity),
        sku: v.variantSku,
        attributes: v.variantKey ? JSON.parse(v.variantKey) : {},
        image: v.variantImage
      })),
      category: cjProduct.categoryName,
      shippingTime: cjProduct.shippingTime,
      supplierName: cjProduct.supplierName,
      moq: parseInt(cjProduct.packQty || '1'),
      stockQuantity: parseInt(cjProduct.sellQuantity),
      tags: cjProduct.productTags ? cjProduct.productTags.split(',') : [],
      specifications: cjProduct.specifications || {}
    }
  }

  /**
   * Transform CJ order data to our format
   */
  private transformCJOrder(cjOrder: any): CJOrder {
    return {
      orderNumber: cjOrder.orderNumber,
      clientOrderId: cjOrder.clientOrderId,
      products: cjOrder.products,
      shippingAddress: cjOrder.shippingAddress,
      status: this.mapCJOrderStatus(cjOrder.orderStatus),
      trackingNumber: cjOrder.trackingNumber,
      totalAmount: parseFloat(cjOrder.totalAmount),
      currency: cjOrder.currency,
      createdAt: cjOrder.createTime,
      updatedAt: cjOrder.updateTime
    }
  }

  /**
   * Map CJ order status to our status
   */
  private mapCJOrderStatus(cjStatus: string): CJOrder['status'] {
    const statusMap: Record<string, CJOrder['status']> = {
      'PENDING': 'pending',
      'CONFIRMED': 'confirmed',
      'SHIPPED': 'shipped',
      'DELIVERED': 'delivered',
      'CANCELLED': 'cancelled'
    }
    
    return statusMap[cjStatus] || 'pending'
  }
}

// Export factory function
export function createCJDropshippingService(config: CJConfig): CJDropshippingService {
  return new CJDropshippingService(config)
}

// Export factory function with default configuration
export function createCJDropshippingServiceWithDefaults(): CJDropshippingService {
  const config: CJConfig = {
    accessToken: API_KEYS.CJ_DROPSHIPPING.ACCESS_TOKEN,
    email: API_KEYS.CJ_DROPSHIPPING.EMAIL,
    password: API_KEYS.CJ_DROPSHIPPING.PASSWORD,
    warehouseCode: API_KEYS.CJ_DROPSHIPPING.WAREHOUSE_CODE
  }
  return new CJDropshippingService(config)
}

// Export types
export type {
  CJConfig,
  CJProduct,
  CJVariant,
  CJOrder,
  CJOrderProduct,
  CJShippingAddress
}