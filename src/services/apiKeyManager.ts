import { useKV } from '@github/spark/hooks'

interface APIConfiguration {
  [key: string]: {
    key: string
    status: 'active' | 'inactive' | 'error'
    lastTested?: string
  }
}

class APIKeyManager {
  private static instance: APIKeyManager
  private apiConfigs: APIConfiguration = {}

  static getInstance(): APIKeyManager {
    if (!this.instance) {
      this.instance = new APIKeyManager()
    }
    return this.instance
  }

  // Load API keys from KV storage
  async loadAPIKeys(): Promise<APIConfiguration> {
    try {
      const stored = localStorage.getItem('nexusone-api-configs')
      if (stored) {
        this.apiConfigs = JSON.parse(stored)
      }
      return this.apiConfigs
    } catch (error) {
      console.error('Failed to load API keys:', error)
      return {}
    }
  }

  // Save API keys to KV storage
  async saveAPIKeys(configs: APIConfiguration): Promise<void> {
    try {
      this.apiConfigs = { ...this.apiConfigs, ...configs }
      localStorage.setItem('nexusone-api-configs', JSON.stringify(this.apiConfigs))
    } catch (error) {
      console.error('Failed to save API keys:', error)
      throw error
    }
  }

  // Get specific API key
  getAPIKey(service: string): string | null {
    return this.apiConfigs[service]?.key || null
  }

  // Check if service is configured
  isConfigured(service: string): boolean {
    return !!(this.apiConfigs[service]?.key && this.apiConfigs[service]?.status === 'active')
  }

  // Update API key status
  updateStatus(service: string, status: 'active' | 'inactive' | 'error'): void {
    if (this.apiConfigs[service]) {
      this.apiConfigs[service].status = status
      this.apiConfigs[service].lastTested = new Date().toISOString()
      localStorage.setItem('nexusone-api-configs', JSON.stringify(this.apiConfigs))
    }
  }

  // Get all configurations
  getAllConfigs(): APIConfiguration {
    return { ...this.apiConfigs }
  }

  // Set default API keys for testing
  setDefaultKeys(): void {
    const defaultKeys = {
      'openai': {
        key: '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',
        status: 'active' as const
      },
      'openai-assistant': {
        key: 'asst_0jsx8eD6P3W9XGsSRRNU2Pfd',
        status: 'active' as const
      },
      'elevenlabs': {
        key: 'sk_189b755ede03dfdf1633da77e125d682b44c1ddb54b08a07',
        status: 'active' as const
      },
      'replicate': {
        key: 'r8_HbwQQ4NxMfhVPy0BS0xqOMkERd9B5JM440l66',
        status: 'active' as const
      },
      'luma': {
        key: 'luma-12423eab-79ee-4f52-ad44-00c485686cf2-ab1b6b03-15a1-4c76-b056-6765bf41ab05',
        status: 'active' as const
      },
      'gupshup': {
        key: 'sk_d5fe7cdab5164e53bcbffdc428fd431e',
        status: 'active' as const
      },
      'cj-dropshipping': {
        key: '5e0e680914c6462ebcf39059b21e70a9',
        status: 'active' as const
      },
      'facebook': {
        key: 'EAAI0DOV8GvcBPK4ZBUTybkGl66FwZA1s45Dx3cSjOVEO4lzZAifzVR6lIoVbW6HcsP2L7x4b0065VirgfhzyfIGNCCA9QCynR3twQB01ZCqjolM7b0QfGtBpj5ZCZA5kyWONQsaYmZBRvy1ByAziVPZAot50fp9ZB4ro71pZAPk7iK4ynEMkhG2LBqUmg2VFWZCPAYQ74T3ocUZCL7u69pCaZAhqUe29gMZALb2jZB5YWQrfHbreY0hIgZDZD',
        status: 'active' as const
      },
      'unsplash': {
        key: '-zZ5LsB2CAMUhbPca_UKw31ngzc1W3_hfxSPdz_aBUE',
        status: 'active' as const
      }
    }

    this.apiConfigs = { ...this.apiConfigs, ...defaultKeys }
    localStorage.setItem('nexusone-api-configs', JSON.stringify(this.apiConfigs))
  }
}

export const apiKeyManager = APIKeyManager.getInstance()