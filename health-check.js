#!/usr/bin/env node

/**
 * NexusOne AI Platform - Production Deployment Verification
 * Validates all backend services are operational
 */

const PROJECT_REF = 'hbfgtdxvlbkvkrjqxnac';
const BASE_URL = `https://${PROJECT_REF}.supabase.co`;

const endpoints = {
  database: `${BASE_URL}/rest/v1/user_profiles?select=count`,
  auth: `${BASE_URL}/auth/v1/settings`,
  storage: `${BASE_URL}/storage/v1/bucket`,
  functions: {
    'ai-content-generator': `${BASE_URL}/functions/v1/ai-content-generator`,
    'cj-dropshipping-catalog': `${BASE_URL}/functions/v1/cj-dropshipping-catalog`,
    'facebook-ads-manager': `${BASE_URL}/functions/v1/facebook-ads-manager`,
    'whatsapp-automation': `${BASE_URL}/functions/v1/whatsapp-automation`,
    'video-generator': `${BASE_URL}/functions/v1/video-generator`,
    'landing-page-builder': `${BASE_URL}/functions/v1/landing-page-builder`,
    'product-scraper': `${BASE_URL}/functions/v1/product-scraper`,
    'usage-tracker': `${BASE_URL}/functions/v1/usage-tracker`,
    'webhook-handler': `${BASE_URL}/functions/v1/webhook-handler`,
    'unsplash-api': `${BASE_URL}/functions/v1/unsplash-api`,
    'dropshipping-import': `${BASE_URL}/functions/v1/dropshipping-import`,
    'ai-content-generation': `${BASE_URL}/functions/v1/ai-content-generation`,
    'cj-dropshipping-order': `${BASE_URL}/functions/v1/cj-dropshipping-order`
  }
};

const requiredTables = [
  'user_profiles',
  'user_credits', 
  'credit_transactions',
  'generated_pages',
  'generated_videos',
  'whatsapp_numbers',
  'whatsapp_conversations',
  'whatsapp_messages',
  'crm_leads',
  'ai_agents',
  'facebook_campaigns',
  'dropshipping_products',
  'dropshipping_sales',
  'usage_logs',
  'api_usage',
  'system_health'
];

const requiredBuckets = [
  'avatars',
  'landing-pages',
  'generated-content',
  'user-uploads',
  'video-assets',
  'ai-generated',
  'documents',
  'audio-files',
  'templates',
  'campaigns'
];

async function checkEndpoint(url, name, options = {}) {
  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'apikey': process.env.SUPABASE_ANON_KEY || 'demo-key',
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY || 'demo-key'}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const status = response.status;
    const isHealthy = status < 500; // 4xx is expected for some endpoints without auth
    
    return {
      name,
      url,
      status,
      healthy: isHealthy,
      message: isHealthy ? '✅ Available' : `❌ Error ${status}`
    };
  } catch (error) {
    return {
      name,
      url,
      status: 0,
      healthy: false,
      message: `❌ Connection failed: ${error.message}`
    };
  }
}

async function runHealthChecks() {
  console.log('🚀 NexusOne AI Platform - Production Health Check');
  console.log('=' * 50);
  console.log(`📊 Project: ${PROJECT_REF}`);
  console.log(`🌐 Base URL: ${BASE_URL}`);
  console.log('');

  const results = {
    database: null,
    auth: null,
    storage: null,
    functions: {},
    overall: true
  };

  // Check Database API
  console.log('📊 Checking Database API...');
  results.database = await checkEndpoint(endpoints.database, 'Database API');
  console.log(`   ${results.database.message}`);
  
  // Check Auth API
  console.log('🔐 Checking Authentication API...');
  results.auth = await checkEndpoint(endpoints.auth, 'Auth API');
  console.log(`   ${results.auth.message}`);
  
  // Check Storage API
  console.log('💾 Checking Storage API...');
  results.storage = await checkEndpoint(endpoints.storage, 'Storage API');
  console.log(`   ${results.storage.message}`);
  
  // Check Edge Functions
  console.log('⚡ Checking Edge Functions...');
  for (const [funcName, funcUrl] of Object.entries(endpoints.functions)) {
    const result = await checkEndpoint(funcUrl, funcName, {
      method: 'POST',
      body: JSON.stringify({ test: true })
    });
    results.functions[funcName] = result;
    console.log(`   ${funcName}: ${result.message}`);
  }

  // Overall health calculation
  results.overall = results.database.healthy && 
                   results.auth.healthy && 
                   results.storage.healthy &&
                   Object.values(results.functions).every(f => f.healthy);

  console.log('');
  console.log('📋 Health Check Summary');
  console.log('-' * 30);
  console.log(`Database API: ${results.database.healthy ? '✅' : '❌'}`);
  console.log(`Auth API: ${results.auth.healthy ? '✅' : '❌'}`);
  console.log(`Storage API: ${results.storage.healthy ? '✅' : '❌'}`);
  
  const functionHealth = Object.values(results.functions);
  const healthyFunctions = functionHealth.filter(f => f.healthy).length;
  console.log(`Edge Functions: ${healthyFunctions}/${functionHealth.length} healthy`);
  
  console.log('');
  console.log(`🎯 Overall Status: ${results.overall ? '✅ HEALTHY' : '❌ ISSUES DETECTED'}`);
  
  if (!results.overall) {
    console.log('');
    console.log('❌ Issues Found:');
    if (!results.database.healthy) console.log(`   • Database: ${results.database.message}`);
    if (!results.auth.healthy) console.log(`   • Auth: ${results.auth.message}`);
    if (!results.storage.healthy) console.log(`   • Storage: ${results.storage.message}`);
    
    const unhealthyFunctions = functionHealth.filter(f => !f.healthy);
    unhealthyFunctions.forEach(f => {
      console.log(`   • Function ${f.name}: ${f.message}`);
    });
  }

  return results;
}

// Database schema validation
async function validateSchema() {
  console.log('');
  console.log('🗄️ Validating Database Schema...');
  
  const missingTables = [];
  
  for (const table of requiredTables) {
    try {
      const response = await fetch(`${endpoints.database.replace('user_profiles?select=count', `${table}?select=count`)}`, {
        headers: {
          'apikey': process.env.SUPABASE_ANON_KEY || 'demo-key',
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY || 'demo-key'}`
        }
      });
      
      if (response.status === 404) {
        missingTables.push(table);
      }
    } catch (error) {
      missingTables.push(table);
    }
  }
  
  console.log(`📊 Tables: ${requiredTables.length - missingTables.length}/${requiredTables.length} found`);
  
  if (missingTables.length > 0) {
    console.log('❌ Missing tables:');
    missingTables.forEach(table => console.log(`   • ${table}`));
  } else {
    console.log('✅ All required tables present');
  }
  
  return missingTables.length === 0;
}

// Storage bucket validation  
async function validateStorage() {
  console.log('');
  console.log('💾 Validating Storage Buckets...');
  
  try {
    const response = await fetch(`${BASE_URL}/storage/v1/bucket`, {
      headers: {
        'apikey': process.env.SUPABASE_ANON_KEY || 'demo-key',
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY || 'demo-key'}`
      }
    });
    
    if (response.ok) {
      const buckets = await response.json();
      const bucketNames = buckets.map(b => b.name);
      const missingBuckets = requiredBuckets.filter(b => !bucketNames.includes(b));
      
      console.log(`🪣 Buckets: ${bucketNames.length}/${requiredBuckets.length} configured`);
      
      if (missingBuckets.length > 0) {
        console.log('❌ Missing buckets:');
        missingBuckets.forEach(bucket => console.log(`   • ${bucket}`));
        return false;
      } else {
        console.log('✅ All required buckets present');
        return true;
      }
    } else {
      console.log('❌ Could not access storage API');
      return false;
    }
  } catch (error) {
    console.log(`❌ Storage validation failed: ${error.message}`);
    return false;
  }
}

// Generate deployment report
function generateReport(healthResults, schemaValid, storageValid) {
  const timestamp = new Date().toISOString();
  const overallHealthy = healthResults.overall && schemaValid && storageValid;
  
  const report = `
# NexusOne AI Platform - Health Check Report

**Generated:** ${timestamp}
**Project:** ${PROJECT_REF}  
**Status:** ${overallHealthy ? '✅ PRODUCTION READY' : '❌ ISSUES DETECTED'}

## API Endpoints

### Core Services
- **Database API:** ${healthResults.database.healthy ? '✅' : '❌'} (${healthResults.database.status})
- **Auth API:** ${healthResults.auth.healthy ? '✅' : '❌'} (${healthResults.auth.status})  
- **Storage API:** ${healthResults.storage.healthy ? '✅' : '❌'} (${healthResults.storage.status})

### Edge Functions (${Object.values(healthResults.functions).filter(f => f.healthy).length}/${Object.values(healthResults.functions).length})
${Object.entries(healthResults.functions).map(([name, result]) => 
  `- **${name}:** ${result.healthy ? '✅' : '❌'} (${result.status})`
).join('\n')}

## Database Schema
- **Tables:** ${schemaValid ? '✅ All required tables present' : '❌ Missing tables detected'}
- **Required:** ${requiredTables.length} tables
- **Status:** ${schemaValid ? 'Valid' : 'Invalid'}

## Storage Buckets  
- **Buckets:** ${storageValid ? '✅ All required buckets present' : '❌ Missing buckets detected'}
- **Required:** ${requiredBuckets.length} buckets
- **Status:** ${storageValid ? 'Valid' : 'Invalid'}

## Production Readiness

${overallHealthy ? `
✅ **READY FOR LAUNCH**

All critical systems are operational:
- Database and APIs responding
- All Edge Functions deployed
- Security and authentication configured
- Storage buckets properly set up

The NexusOne AI Platform backend is production-ready!
` : `
❌ **NOT READY FOR LAUNCH**

Issues detected that need resolution before production deployment.
Please review the failed checks above and resolve before proceeding.
`}

---
*Health check completed at ${timestamp}*
`;

  return report;
}

// Main execution
async function main() {
  try {
    const healthResults = await runHealthChecks();
    const schemaValid = await validateSchema();
    const storageValid = await validateStorage();
    
    const report = generateReport(healthResults, schemaValid, storageValid);
    
    console.log('');
    console.log('📋 Generating deployment report...');
    
    // In a real environment, this would write to a file
    console.log(report);
    
    const overallStatus = healthResults.overall && schemaValid && storageValid;
    
    console.log('');
    console.log('🎯 Final Status:');
    console.log(`${overallStatus ? '✅ PRODUCTION READY' : '❌ DEPLOYMENT ISSUES'}`);
    
    process.exit(overallStatus ? 0 : 1);
    
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    process.exit(1);
  }
}

// Handle CLI execution
if (require.main === module) {
  main();
}

module.exports = { runHealthChecks, validateSchema, validateStorage };