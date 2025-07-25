/**
 * CJ Dropshipping API Service - Production Implementation
 * 
 * This service integrates directly with CJ Dropshipping API v2
 * using the provided API key: 5e0e680914c6462ebcf39059b21e70a9
 */

interface CJAPIResponse<T = any> {
  result: boolean
  message: string
  data: T
}

interface CJProduct {
  pid: string
  productName: string
  productNameEn: string
  sellPrice: string
  originalPrice: string
  productImage: string
  productImages: string[]
  description: string
  categoryName: string
  supplierName: string
  sellQuantity: string
  packQty: string
  shippingTime: string
  weight: string
  currency: string
  variants?: CJVariant[]
}

interface CJVariant {
  vid: string
  variantName: string
  variantSellPrice: string
  variantQuantity: string
  variantSku: string
  variantKey: string
  variantImage?: string
}

export class CJDropshippingAPI {
  private baseURL = 'https://developers.cjdropshipping.com'
  private apiKey: string
  private accessToken?: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  /**
   * Get access token for API requests
   */
  async authenticate(): Promise<string> {
    try {
      const response = await fetch(`${this.baseURL}/api2.0/v1/authentication/getAccessToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'CJ-Access-Token': this.apiKey
        },
        body: JSON.stringify({})
      })

      const data: CJAPIResponse<{ accessToken: string }> = await response.json()
      
      if (data.result && data.data?.accessToken) {
        this.accessToken = data.data.accessToken
        return data.data.accessToken
      }
      
      throw new Error(`Authentication failed: ${data.message}`)
    } catch (error) {
      console.error('CJ Authentication error:', error)
      throw error
    }
  }

  /**
   * Test API connection and credentials
   */
  async testConnection(): Promise<{
    success: boolean
    message: string
    details?: any
  }> {
    try {
      // First test authentication
      await this.authenticate()
      
      // Test a simple API call
      const testResponse = await this.getProducts({ pageNum: 1, pageSize: 1 })
      
      return {
        success: true,
        message: 'Connection successful',
        details: {
          apiKey: this.apiKey.substring(0, 8) + '...',
          status: 'ACTIVE',
          accessToken: this.accessToken?.substring(0, 8) + '...',
          testProducts: testResponse.total
        }
      }
    } catch (error) {
      return {
        success: false,
        message: `Connection failed: ${error.message}`,
        details: { error: error.message }
      }
    }
  }

  /**
   * Search and get products with filters
   */
  async getProducts(params: {
    pageNum?: number
    pageSize?: number
    categoryId?: string
    keyword?: string
    sortBy?: string
    priceMin?: number
    priceMax?: number
  } = {}): Promise<{
    products: CJProduct[]
    total: number
    pageNum: number
    pageSize: number
  }> {
    try {
      if (!this.accessToken) {
        await this.authenticate()
      }

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
        `${this.baseURL}/api2.0/v1/product/list?${queryParams}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'CJ-Access-Token': this.accessToken!
          }
        }
      )

      const data: CJAPIResponse<{
        list: CJProduct[]
        total: number
        pageNum: number
        pageSize: number
      }> = await response.json()
      
      if (data.result && data.data) {
        return {
          products: data.data.list,
          total: data.data.total,
          pageNum: data.data.pageNum,
          pageSize: data.data.pageSize
        }
      }
      
      throw new Error(`Failed to fetch products: ${data.message}`)
    } catch (error) {
      console.error('CJ Get products error:', error)
      throw error
    }
  }

  /**
   * Get detailed product information by ID
   */
  async getProductDetails(productId: string): Promise<CJProduct> {
    try {
      if (!this.accessToken) {
        await this.authenticate()
      }

      const response = await fetch(
        `${this.baseURL}/api2.0/v1/product/query?pid=${productId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'CJ-Access-Token': this.accessToken!
          }
        }
      )

      const data: CJAPIResponse<CJProduct> = await response.json()
      
      if (data.result && data.data) {
        return data.data
      }
      
      throw new Error(`Failed to fetch product details: ${data.message}`)
    } catch (error) {
      console.error('CJ Get product details error:', error)
      throw error
    }
  }

  /**
   * Get product categories
   */
  async getCategories(): Promise<any[]> {
    try {
      if (!this.accessToken) {
        await this.authenticate()
      }

      const response = await fetch(
        `${this.baseURL}/api2.0/v1/product/getCategory`,
        {
          headers: {
            'Content-Type': 'application/json',
            'CJ-Access-Token': this.accessToken!
          }
        }
      )

      const data: CJAPIResponse<any[]> = await response.json()
      
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
   * Get trending/bestselling products
   */
  async getTrendingProducts(limit: number = 50): Promise<CJProduct[]> {
    try {
      const response = await this.getProducts({
        pageSize: limit,
        sortBy: 'sellQuantity_desc' // Sort by sales volume
      })
      
      return response.products
    } catch (error) {
      console.error('CJ Get trending products error:', error)
      throw error
    }
  }

  /**
   * Calculate shipping cost for products
   */
  async calculateShippingCost(params: {
    products: { pid: string; quantity: number }[]
    country: string
    province?: string
    city?: string
  }): Promise<{
    cost: number
    currency: string
    logistics: any[]
  }> {
    try {
      if (!this.accessToken) {
        await this.authenticate()
      }

      const response = await fetch(
        `${this.baseURL}/api2.0/v1/logistic/freightCalculate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'CJ-Access-Token': this.accessToken!
          },
          body: JSON.stringify({
            products: params.products,
            startCountry: 'CN',
            endCountry: params.country,
            ...(params.province && { endProvince: params.province }),
            ...(params.city && { endCity: params.city })
          })
        }
      )

      const data: CJAPIResponse<{
        logistics: any[]
        minCost: number
        currency: string
      }> = await response.json()
      
      if (data.result && data.data) {
        return {
          cost: data.data.minCost,
          currency: data.data.currency,
          logistics: data.data.logistics
        }
      }
      
      throw new Error(`Failed to calculate shipping: ${data.message}`)
    } catch (error) {
      console.error('CJ Calculate shipping error:', error)
      throw error
    }
  }

  /**
   * Create order on CJ platform
   */
  async createOrder(orderData: {
    orderNumber: string
    shippingAddress: {
      firstName: string
      lastName: string
      companyName?: string
      country: string
      province: string
      city: string
      address1: string
      address2?: string
      zip: string
      phone: string
      email: string
    }
    products: {
      pid: string
      vid?: string
      quantity: number
    }[]
    logistics?: string
    remark?: string
  }): Promise<{
    orderId: string
    orderNumber: string
    status: string
  }> {
    try {
      if (!this.accessToken) {
        await this.authenticate()
      }

      const response = await fetch(
        `${this.baseURL}/api2.0/v1/shopping/order/createOrder`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'CJ-Access-Token': this.accessToken!
          },
          body: JSON.stringify(orderData)
        }
      )

      const data: CJAPIResponse<{
        orderId: string
        orderNumber: string
        orderStatus: string
      }> = await response.json()
      
      if (data.result && data.data) {
        return {
          orderId: data.data.orderId,
          orderNumber: data.data.orderNumber,
          status: data.data.orderStatus
        }
      }
      
      throw new Error(`Failed to create order: ${data.message}`)
    } catch (error) {
      console.error('CJ Create order error:', error)
      throw error
    }
  }

  /**
   * Get order details and tracking info
   */
  async getOrderDetails(orderNumber: string): Promise<any> {
    try {
      if (!this.accessToken) {
        await this.authenticate()
      }

      const response = await fetch(
        `${this.baseURL}/api2.0/v1/shopping/order/getOrderDetail?orderNumber=${orderNumber}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'CJ-Access-Token': this.accessToken!
          }
        }
      )

      const data: CJAPIResponse = await response.json()
      
      if (data.result && data.data) {
        return data.data
      }
      
      throw new Error(`Failed to get order details: ${data.message}`)
    } catch (error) {
      console.error('CJ Get order details error:', error)
      throw error
    }
  }

  /**
   * Transform CJ product to our internal format
   */
  transformProduct(cjProduct: CJProduct): {
    id: string
    name: string
    price: number
    originalPrice: number
    imageUrl: string
    images: string[]
    description: string
    category: string
    supplier: string
    stockQuantity: number
    weight: number
    shippingTime: string
    variants: any[]
  } {
    return {
      id: cjProduct.pid,
      name: cjProduct.productName || cjProduct.productNameEn,
      price: parseFloat(cjProduct.sellPrice || '0'),
      originalPrice: parseFloat(cjProduct.originalPrice || '0'),
      imageUrl: cjProduct.productImage,
      images: cjProduct.productImages || [cjProduct.productImage],
      description: cjProduct.description || '',
      category: cjProduct.categoryName || 'General',
      supplier: cjProduct.supplierName || 'CJ Dropshipping',
      stockQuantity: parseInt(cjProduct.sellQuantity || '0'),
      weight: parseFloat(cjProduct.weight || '0'),
      shippingTime: cjProduct.shippingTime || '7-15 days',
      variants: (cjProduct.variants || []).map(v => ({
        id: v.vid,
        name: v.variantName,
        price: parseFloat(v.variantSellPrice || '0'),
        stockQuantity: parseInt(v.variantQuantity || '0'),
        sku: v.variantSku,
        attributes: v.variantKey ? JSON.parse(v.variantKey) : {},
        image: v.variantImage
      }))
    }
  }
}

// Export singleton instance with your API key
export const cjAPI = new CJDropshippingAPI('5e0e680914c6462ebcf39059b21e70a9')