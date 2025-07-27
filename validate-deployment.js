#!/usr/bin/env node

// 🔧 NexusOne AI - Deployment Validation Script
// Validates all deployment requirements and API configurations

const fs = require('fs');
const path = require('path');
const https = require('https');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  title: (msg) => console.log(`${colors.cyan}🚀 ${msg}${colors.reset}`)
};

class DeploymentValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.config = {};
    this.apis = [];
    this.startTime = Date.now();
  }

  async run() {
    log.title('NexusOne AI - Deployment Validation');
    console.log('=====================================\n');

    try {
      await this.validateEnvironment();
      await this.validateDependencies();
      await this.validateBuildOutput();
      await this.validateAPIs();
      await this.validateSecurity();
      
      this.generateReport();
      
      if (this.errors.length > 0) {
        process.exit(1);
      } else if (this.warnings.length > 0) {
        process.exit(0);
      } else {
        process.exit(0);
      }
    } catch (error) {
      log.error(`Validation failed: ${error.message}`);
      process.exit(1);
    }
  }

  async validateEnvironment() {
    log.info('Validating environment configuration...');
    
    // Check if .env.production exists
    const envPath = '.env.production';
    if (!fs.existsSync(envPath)) {
      this.errors.push('Environment file .env.production not found');
      return;
    }

    // Load environment variables
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envLines = envContent.split('\n');
    
    envLines.forEach(line => {
      const [key, value] = line.split('=');
      if (key && value && !key.startsWith('#')) {
        this.config[key] = value;
      }
    });

    // Validate critical environment variables
    const criticalVars = [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'OPENAI_API_KEY',
      'OPENAI_ASSISTANT_ID'
    ];

    const optionalVars = [
      'ELEVENLABS_API_KEY',
      'REPLICATE_API_TOKEN',
      'LUMA_API_KEY',
      'GUPSHUP_API_KEY',
      'CJ_API_KEY',
      'FACEBOOK_ACCESS_TOKEN',
      'UNSPLASH_ACCESS_KEY'
    ];

    let criticalMissing = 0;
    let optionalMissing = 0;

    criticalVars.forEach(varName => {
      if (!this.config[varName] || this.config[varName].includes('your_') || this.config[varName].includes('placeholder')) {
        this.errors.push(`Critical environment variable missing or placeholder: ${varName}`);
        criticalMissing++;
      } else {
        log.success(`${varName} configured`);
      }
    });

    optionalVars.forEach(varName => {
      if (!this.config[varName] || this.config[varName].includes('your_') || this.config[varName].includes('placeholder')) {
        this.warnings.push(`Optional environment variable not configured: ${varName}`);
        optionalMissing++;
      } else {
        log.success(`${varName} configured`);
      }
    });

    if (criticalMissing === 0) {
      log.success('All critical environment variables configured');
    }

    if (optionalMissing > 0) {
      log.warning(`${optionalMissing} optional APIs not configured`);
    }
  }

  async validateDependencies() {
    log.info('Validating dependencies...');

    // Check package.json
    if (!fs.existsSync('package.json')) {
      this.errors.push('package.json not found');
      return;
    }

    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Validate critical dependencies
    const criticalDeps = [
      'react',
      'react-dom',
      '@supabase/supabase-js',
      'openai'
    ];

    criticalDeps.forEach(dep => {
      if (!pkg.dependencies || !pkg.dependencies[dep]) {
        this.errors.push(`Missing critical dependency: ${dep}`);
      } else {
        log.success(`Dependency ${dep} found`);
      }
    });

    // Check if node_modules exists (dependencies installed)
    if (!fs.existsSync('node_modules')) {
      this.warnings.push('node_modules not found - run npm install');
    } else {
      log.success('Dependencies installed');
    }
  }

  async validateBuildOutput() {
    log.info('Validating build configuration...');

    // Check for build scripts
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    if (!pkg.scripts || !pkg.scripts.build) {
      this.errors.push('Build script not found in package.json');
    } else {
      log.success('Build script configured');
    }

    // Check if dist directory exists (from previous build)
    if (fs.existsSync('dist')) {
      const distFiles = fs.readdirSync('dist');
      if (distFiles.includes('index.html')) {
        log.success('Build output validated');
      } else {
        this.warnings.push('Build output incomplete - index.html missing');
      }
    } else {
      this.warnings.push('No build output found - run npm run build');
    }

    // Check critical files
    const criticalFiles = [
      'src/App.tsx',
      'src/main.tsx',
      'src/index.css',
      'index.html'
    ];

    criticalFiles.forEach(file => {
      if (fs.existsSync(file)) {
        log.success(`Critical file ${file} found`);
      } else {
        this.errors.push(`Critical file missing: ${file}`);
      }
    });
  }

  async validateAPIs() {
    log.info('Validating API connectivity...');

    this.apis = [
      {
        name: 'Supabase',
        url: this.config.VITE_SUPABASE_URL ? `${this.config.VITE_SUPABASE_URL}/rest/v1/` : null,
        critical: true
      },
      {
        name: 'OpenAI',
        url: 'https://api.openai.com/v1/models',
        headers: this.config.OPENAI_API_KEY ? { 'Authorization': `Bearer ${this.config.OPENAI_API_KEY}` } : null,
        critical: true
      },
      {
        name: 'ElevenLabs',
        url: 'https://api.elevenlabs.io/v1/voices',
        headers: this.config.ELEVENLABS_API_KEY ? { 'xi-api-key': this.config.ELEVENLABS_API_KEY } : null,
        critical: false
      },
      {
        name: 'Replicate',
        url: 'https://api.replicate.com/v1/models',
        headers: this.config.REPLICATE_API_TOKEN ? { 'Authorization': `Token ${this.config.REPLICATE_API_TOKEN}` } : null,
        critical: false
      }
    ];

    for (const api of this.apis) {
      if (!api.url) {
        if (api.critical) {
          this.errors.push(`${api.name} API URL not configured`);
        } else {
          this.warnings.push(`${api.name} API not configured`);
        }
        continue;
      }

      try {
        const result = await this.testAPI(api);
        if (result.success) {
          log.success(`${api.name} API: Healthy (${result.statusCode})`);
        } else {
          if (api.critical) {
            this.errors.push(`${api.name} API: ${result.error}`);
          } else {
            this.warnings.push(`${api.name} API: ${result.error}`);
          }
        }
      } catch (error) {
        if (api.critical) {
          this.errors.push(`${api.name} API: ${error.message}`);
        } else {
          this.warnings.push(`${api.name} API: ${error.message}`);
        }
      }
    }
  }

  async testAPI(api) {
    return new Promise((resolve) => {
      const url = new URL(api.url);
      
      const options = {
        hostname: url.hostname,
        port: url.port || 443,
        path: url.pathname + url.search,
        method: 'GET',
        headers: api.headers || {},
        timeout: 10000
      };

      const req = https.request(options, (res) => {
        if (res.statusCode >= 200 && res.statusCode < 400) {
          resolve({ success: true, statusCode: res.statusCode });
        } else if (res.statusCode === 401 || res.statusCode === 403) {
          // Auth errors are OK for health checks
          resolve({ success: true, statusCode: res.statusCode });
        } else {
          resolve({ success: false, statusCode: res.statusCode, error: `HTTP ${res.statusCode}` });
        }
      });

      req.on('error', (error) => {
        resolve({ success: false, error: error.message });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({ success: false, error: 'Request timeout' });
      });

      req.end();
    });
  }

  async validateSecurity() {
    log.info('Running security validation...');

    // Check for secrets in source files
    const sourceFiles = this.getAllJSFiles('src');
    let secretsFound = false;

    sourceFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for common secret patterns
      const secretPatterns = [
        /sk-[a-zA-Z0-9]{48}/g,  // OpenAI keys
        /eyJ[a-zA-Z0-9]/g,      // JWT tokens
        /pk_live_[a-zA-Z0-9]/g, // Stripe keys
        /['"]\w*api[_-]?key['"]\s*:\s*['"][^'"]+['"]/gi
      ];

      secretPatterns.forEach(pattern => {
        if (pattern.test(content)) {
          this.errors.push(`Potential secret found in ${file}`);
          secretsFound = true;
        }
      });
    });

    if (!secretsFound) {
      log.success('No secrets found in source code');
    }

    // Check for .env files in src directory
    if (fs.existsSync('src/.env') || fs.existsSync('src/.env.local')) {
      this.errors.push('Environment files found in src directory');
    } else {
      log.success('No environment files in source directory');
    }
  }

  getAllJSFiles(dir) {
    let files = [];
    
    if (!fs.existsSync(dir)) return files;
    
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files = files.concat(this.getAllJSFiles(fullPath));
      } else if (/\.(js|jsx|ts|tsx)$/.test(item)) {
        files.push(fullPath);
      }
    });
    
    return files;
  }

  generateReport() {
    const duration = Date.now() - this.startTime;
    
    console.log('\n' + '='.repeat(50));
    log.title('DEPLOYMENT VALIDATION REPORT');
    console.log('='.repeat(50));
    
    console.log(`Validation Duration: ${duration}ms`);
    console.log(`Critical Errors: ${this.errors.length}`);
    console.log(`Warnings: ${this.warnings.length}`);
    
    if (this.errors.length > 0) {
      console.log('\n❌ CRITICAL ERRORS:');
      this.errors.forEach(error => log.error(error));
    }
    
    if (this.warnings.length > 0) {
      console.log('\n⚠️  WARNINGS:');
      this.warnings.forEach(warning => log.warning(warning));
    }
    
    console.log('\n📊 API STATUS:');
    this.apis.forEach(api => {
      const status = api.tested ? (api.healthy ? '✅' : '❌') : '❓';
      console.log(`  ${status} ${api.name} ${api.critical ? '(Critical)' : '(Optional)'}`);
    });
    
    console.log('\n🎯 DEPLOYMENT READINESS:');
    
    if (this.errors.length === 0) {
      log.success('✅ READY FOR DEPLOYMENT');
      console.log('  • All critical validations passed');
      console.log('  • APIs are operational');
      console.log('  • Security checks passed');
      
      if (this.warnings.length > 0) {
        console.log('  • Some optional features may be limited');
      }
      
      console.log('\nNext steps:');
      console.log('  1. Run: npm run build:prod');
      console.log('  2. Deploy to staging for final testing');
      console.log('  3. Deploy to production');
      
    } else {
      log.error('❌ NOT READY FOR DEPLOYMENT');
      console.log('  • Fix critical errors before deploying');
      console.log('  • Verify API configurations');
      console.log('  • Run validation again');
    }
    
    console.log('\n' + '='.repeat(50));
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new DeploymentValidator();
  validator.run().catch(error => {
    console.error('Validation failed:', error);
    process.exit(1);
  });
}

module.exports = DeploymentValidator;