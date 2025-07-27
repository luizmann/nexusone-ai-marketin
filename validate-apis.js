// API Configuration Validation Script for NexusOneAI
// Run this to validate all API integrations are working properly

const API_ENDPOINTS = {
  openai: {
    url: 'https://api.openai.com/v1/models',
    headers: (key) => ({ 'Authorization': `Bearer ${key}` }),
    test: 'OpenAI GPT-4 API'
  },
  elevenlabs: {
    url: 'https://api.elevenlabs.io/v1/voices',
    headers: (key) => ({ 'xi-api-key': key }),
    test: 'ElevenLabs TTS API'
  },
  replicate: {
    url: 'https://api.replicate.com/v1/models',
    headers: (key) => ({ 'Authorization': `Token ${key}` }),
    test: 'Replicate AI API'
  },
  gupshup: {
    url: 'https://api.gupshup.io/wa/api/v1/users',
    headers: (key) => ({ 'apikey': key }),
    test: 'Gupshup WhatsApp API'
  },
  facebook: {
    url: 'https://graph.facebook.com/v18.0/me',
    headers: (key) => ({}),
    params: (key) => ({ access_token: key }),
    test: 'Facebook Marketing API'
  },
  unsplash: {
    url: 'https://api.unsplash.com/photos?per_page=1',
    headers: (key) => ({ 'Authorization': `Client-ID ${key}` }),
    test: 'Unsplash Images API'
  }
}

const API_KEYS = {
  openai: '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',
  elevenlabs: 'sk_189b755ede03dfdf1633da77e125d682b44c1ddb54b08a07',
  replicate: 'r8_HbwQQ4NxMfhVPy0BS0xqOMkERd9B5JM440l66',
  gupshup: 'sk_d5fe7cdab5164e53bcbffdc428fd431e',
  luma: 'luma-12423eab-79ee-4f52-ad44-00c485686cf2-ab1b6b03-15a1-4c76-b056-6765bf41ab05',
  facebook: 'EAAI0DOV8GvcBPK4ZBUTybkGl66FwZA1s45Dx3cSjOVEO4lzZAifzVR6lIoVbW6HcsP2L7x4b0065VirgfhzyfIGNCCA9QCynR3twQB01ZCqjolM7b0QfGtBpj5ZCZA5kyWONQsaYmZBRvy1ByAziVPZAot50fp9ZB4ro71pZAPk7iK4ynEMkhG2LBqUmg2VFWZCPAYQ74T3ocUZCL7u69pCaZAhqUe29gMZALb2jZB5YWQrfHbreY0hIgZDZD',
  cj_dropshipping: '5e0e680914c6462ebcf39059b21e70a9',
  unsplash: '-zZ5LsB2CAMUhbPca_UKw31ngzc1W3_hfxSPdz_aBUE'
}

async function testApiConnection(service, config, apiKey) {
  try {
    console.log(`🧪 Testing ${config.test}...`)
    
    let url = config.url
    let headers = config.headers(apiKey)
    
    if (config.params) {
      const params = new URLSearchParams(config.params(apiKey))
      url += (url.includes('?') ? '&' : '?') + params.toString()
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    })
    
    if (response.ok) {
      console.log(`✅ ${service} - Connection successful`)
      return { service, status: 'success', message: 'Connected successfully' }
    } else {
      console.log(`❌ ${service} - Failed (${response.status}: ${response.statusText})`)
      return { service, status: 'error', message: `HTTP ${response.status}` }
    }
    
  } catch (error) {
    console.log(`❌ ${service} - Error: ${error.message}`)
    return { service, status: 'error', message: error.message }
  }
}

async function validateAllApis() {
  console.log('🚀 Starting API Validation for NexusOneAI')
  console.log('='.repeat(50))
  
  const results = []
  
  for (const [service, config] of Object.entries(API_ENDPOINTS)) {
    const apiKey = API_KEYS[service]
    
    if (!apiKey) {
      console.log(`⚠️  ${service} - No API key provided`)
      results.push({ service, status: 'missing', message: 'API key not provided' })
      continue
    }
    
    const result = await testApiConnection(service, config, apiKey)
    results.push(result)
    
    // Rate limiting delay
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  console.log('\n' + '='.repeat(50))
  console.log('📊 API Validation Summary')
  console.log('='.repeat(50))
  
  const successful = results.filter(r => r.status === 'success').length
  const failed = results.filter(r => r.status === 'error').length
  const missing = results.filter(r => r.status === 'missing').length
  
  console.log(`✅ Successful: ${successful}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`⚠️  Missing: ${missing}`)
  console.log(`📈 Success Rate: ${Math.round((successful / results.length) * 100)}%`)
  
  if (failed > 0) {
    console.log('\n❌ Failed APIs:')
    results.filter(r => r.status === 'error').forEach(r => {
      console.log(`   ${r.service}: ${r.message}`)
    })
  }
  
  if (missing > 0) {
    console.log('\n⚠️  Missing API Keys:')
    results.filter(r => r.status === 'missing').forEach(r => {
      console.log(`   ${r.service}: ${r.message}`)
    })
  }
  
  return results
}

// Backend Function Testing
async function testBackendFunctions() {
  console.log('\n🔧 Testing Backend Functions')
  console.log('='.repeat(50))
  
  // These would be your actual Supabase function URLs
  const supabaseUrl = 'YOUR_SUPABASE_URL' // Replace with actual URL
  
  const functions = [
    'test-api-connection',
    'save-api-config', 
    'api-proxy',
    'nexbrain-chat',
    'ai-content-generator',
    'landing-page-builder',
    'video-generator',
    'facebook-ads-manager',
    'cj-dropshipping-catalog',
    'whatsapp-automation'
  ]
  
  for (const func of functions) {
    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/${func}`, {
        method: 'OPTIONS'
      })
      
      if (response.ok) {
        console.log(`✅ Function ${func} - Available`)
      } else {
        console.log(`❌ Function ${func} - Unavailable (${response.status})`)
      }
    } catch (error) {
      console.log(`❌ Function ${func} - Error: ${error.message}`)
    }
  }
}

// Configuration Generation
function generateConfig(results) {
  console.log('\n⚙️  Generated Configuration for Frontend:')
  console.log('='.repeat(50))
  
  const config = {
    apis: {},
    deployment: {
      timestamp: new Date().toISOString(),
      environment: 'production',
      version: '1.0.0'
    }
  }
  
  results.forEach(result => {
    config.apis[result.service] = {
      status: result.status,
      configured: result.status === 'success',
      lastTested: new Date().toISOString()
    }
  })
  
  console.log(JSON.stringify(config, null, 2))
  
  return config
}

// Main execution
async function main() {
  try {
    const results = await validateAllApis()
    await testBackendFunctions()
    const config = generateConfig(results)
    
    console.log('\n🎯 Next Steps:')
    console.log('1. Fix any failed API connections')
    console.log('2. Update your Supabase environment variables')
    console.log('3. Deploy Edge Functions to Supabase')
    console.log('4. Test the full application workflow')
    
  } catch (error) {
    console.error('❌ Validation failed:', error)
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    validateAllApis,
    testBackendFunctions,
    generateConfig,
    API_KEYS,
    API_ENDPOINTS
  }
} else {
  // Run directly in browser/node
  main()
}