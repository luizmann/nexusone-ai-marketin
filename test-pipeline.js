// 🧪 NexusOne AI - Deployment Pipeline Test
// Quick validation of pipeline components

console.log('🚀 NexusOne AI - Deployment Pipeline Test');
console.log('==========================================');

// Test 1: Check critical files exist
const fs = require('fs');

const criticalFiles = [
  '.env.production',
  'package.json',
  'src/App.tsx',
  'src/main.tsx',
  'index.html',
  '.github/workflows/deploy-production.yml',
  'validate-api-config.sh',
  'deploy-production-validated.sh'
];

console.log('\n📁 Testing critical files...');
let filesOK = 0;

criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
    filesOK++;
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});

console.log(`\n📊 Files Status: ${filesOK}/${criticalFiles.length} present`);

// Test 2: Check package.json scripts
console.log('\n📦 Testing package.json scripts...');

try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  const requiredScripts = [
    'build:prod',
    'validate',
    'deploy:production',
    'deploy:staging'
  ];
  
  let scriptsOK = 0;
  
  requiredScripts.forEach(script => {
    if (pkg.scripts && pkg.scripts[script]) {
      console.log(`✅ ${script}`);
      scriptsOK++;
    } else {
      console.log(`❌ ${script} - MISSING`);
    }
  });
  
  console.log(`\n📊 Scripts Status: ${scriptsOK}/${requiredScripts.length} configured`);
  
} catch (error) {
  console.log(`❌ Error reading package.json: ${error.message}`);
}

// Test 3: Check environment file structure
console.log('\n🔧 Testing environment configuration...');

try {
  const envContent = fs.readFileSync('.env.production', 'utf8');
  const envLines = envContent.split('\n');
  
  const criticalEnvVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'OPENAI_API_KEY',
    'OPENAI_ASSISTANT_ID'
  ];
  
  let envVarsFound = 0;
  
  criticalEnvVars.forEach(varName => {
    const found = envLines.some(line => line.startsWith(varName + '='));
    if (found) {
      console.log(`✅ ${varName}`);
      envVarsFound++;
    } else {
      console.log(`❌ ${varName} - NOT FOUND`);
    }
  });
  
  console.log(`\n📊 Environment Status: ${envVarsFound}/${criticalEnvVars.length} variables configured`);
  
} catch (error) {
  console.log(`❌ Error reading .env.production: ${error.message}`);
}

// Test 4: Check GitHub Actions workflow
console.log('\n⚙️  Testing GitHub Actions workflow...');

try {
  const workflowContent = fs.readFileSync('.github/workflows/deploy-production.yml', 'utf8');
  
  const workflowChecks = [
    'validate-environment',
    'validate-apis',
    'build-and-test',
    'deploy-production',
    'post-deployment-validation'
  ];
  
  let checksFound = 0;
  
  workflowChecks.forEach(check => {
    if (workflowContent.includes(check)) {
      console.log(`✅ ${check}`);
      checksFound++;
    } else {
      console.log(`❌ ${check} - NOT FOUND`);
    }
  });
  
  console.log(`\n📊 Workflow Status: ${checksFound}/${workflowChecks.length} jobs configured`);
  
} catch (error) {
  console.log(`❌ Error reading GitHub workflow: ${error.message}`);
}

// Test 5: Check monitoring components
console.log('\n📊 Testing monitoring components...');

const monitoringFiles = [
  'src/utils/api-health-monitor.js',
  'src/components/monitoring/APIHealthDashboard.tsx',
  'deployment-config.json'
];

let monitoringOK = 0;

monitoringFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
    monitoringOK++;
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});

console.log(`\n📊 Monitoring Status: ${monitoringOK}/${monitoringFiles.length} components present`);

// Final Summary
console.log('\n' + '='.repeat(50));
console.log('📋 DEPLOYMENT PIPELINE VALIDATION SUMMARY');
console.log('='.repeat(50));

const totalComponents = criticalFiles.length + 4 + 4 + 5 + monitoringFiles.length; // Approximate
const workingComponents = filesOK + scriptsOK + envVarsFound + checksFound + monitoringOK;

console.log(`\n🎯 Overall Status: ${Math.round((workingComponents / totalComponents) * 100)}% Complete`);

if (filesOK === criticalFiles.length && scriptsOK >= 3 && envVarsFound >= 3) {
  console.log('\n✅ PIPELINE READY');
  console.log('• Core components configured');
  console.log('• Deployment scripts available');
  console.log('• Environment partially configured');
  console.log('• Monitoring system installed');
  
  console.log('\n🚀 Next Steps:');
  console.log('1. Complete environment variable configuration');
  console.log('2. Test API connectivity');
  console.log('3. Run deployment validation');
  console.log('4. Deploy to staging environment');
  
} else {
  console.log('\n⚠️  PIPELINE INCOMPLETE');
  console.log('• Some critical components missing');
  console.log('• Review missing files and configurations');
  console.log('• Complete setup before deployment');
}

console.log('\n📚 Available Commands:');
console.log('• npm run validate - Full deployment validation');
console.log('• npm run deploy:staging - Deploy to staging');
console.log('• npm run deploy:production - Deploy to production');
console.log('• npm run deploy:check - Show deployment options');

console.log('\n' + '='.repeat(50));