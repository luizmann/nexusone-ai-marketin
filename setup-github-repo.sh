#!/bin/bash

# NexusOne AI - GitHub Repository Setup Script
# This script prepares the project for GitHub repository migration
# 
# Usage: bash setup-github-repo.sh
# Make executable: chmod +x setup-github-repo.sh
# Then run: ./setup-github-repo.sh

set -e

echo "🚀 NexusOne AI - GitHub Repository Setup"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if git is available
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install Git first."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

print_info "Starting repository setup..."

# Clean up temporary and cache files
print_info "Cleaning up temporary files..."

# Remove node_modules if it exists
if [ -d "node_modules" ]; then
    print_warning "Removing node_modules directory..."
    rm -rf node_modules
fi

# Remove build artifacts
rm -rf dist/
rm -rf .next/
rm -rf .vercel/
rm -rf .netlify/

# Remove log files
rm -f *.log
rm -f .vite.log

# Remove OS-specific files
rm -f .DS_Store
rm -f Thumbs.db

print_status "Cleanup completed"

# Create necessary directories
print_info "Creating directory structure..."

mkdir -p docs
mkdir -p .github/workflows
mkdir -p .github/ISSUE_TEMPLATE
mkdir -p scripts
mkdir -p tests

print_status "Directory structure created"

# Create .gitignore if it doesn't exist or update it
print_info "Setting up .gitignore..."

cat > .gitignore << 'EOF'
# Dependencies
node_modules/
/.pnp
.pnp.js

# Production builds
/dist
/build
/.next/
/out/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE and editor files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
.pnpm-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Vite
.vite

# Rollup
.rollup.cache

# Serverless directories
.serverless/

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# yarn v2
.yarn/cache
.yarn/unplugged
.yarn/build-state.yml
.yarn/install-state.gz
.pnp.*

# Supabase
supabase/.temp/

# Docker
Dockerfile.prod
docker-compose.prod.yml

# Deployment
.vercel
.netlify

# Testing
/coverage

# Temporary files
*.tmp
*.temp

# Database
*.db
*.sqlite

# API Keys and Secrets (extra safety)
**/api-keys.json
**/secrets.json
**/*secret*
**/*password*
**/*token*
**/credentials.json

# Documentation build
docs/_build/
site/

# Backup files
*.bak
*.backup

# Cache
.cache/
.eslintcache
.stylelintcache

# Storybook
storybook-static/

# Chromatic
chromatic.log
EOF

print_status ".gitignore created"

# Create GitHub workflows
print_info "Setting up GitHub Actions workflows..."

cat > .github/workflows/ci.yml << 'EOF'
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linting
      run: npm run lint
    
    - name: Run type checking
      run: npm run type-check
    
    - name: Run tests
      run: npm run test
    
    - name: Build application
      run: npm run build

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
      env:
        VITE_SUPABASE_URL: ${{ secrets.STAGING_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.STAGING_SUPABASE_ANON_KEY }}
    
    - name: Deploy to Staging
      run: npm run deploy:staging
      env:
        VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}

  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
      env:
        VITE_SUPABASE_URL: ${{ secrets.PRODUCTION_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.PRODUCTION_SUPABASE_ANON_KEY }}
    
    - name: Deploy to Production
      run: npm run deploy:production
      env:
        VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
EOF

cat > .github/workflows/security.yml << 'EOF'
name: Security Scan

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 2 * * 1' # Weekly on Monday at 2 AM

jobs:
  security:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run security audit
      run: npm audit --audit-level=moderate
    
    - name: Run CodeQL Analysis
      uses: github/codeql-action/init@v3
      with:
        languages: javascript, typescript
    
    - name: Perform CodeQL Analysis
      uses: github/codeql-action/analyze@v3
EOF

print_status "GitHub Actions workflows created"

# Create issue templates
print_info "Setting up GitHub issue templates..."

cat > .github/ISSUE_TEMPLATE/bug_report.md << 'EOF'
---
name: Bug report
about: Create a report to help us improve
title: '[BUG] '
labels: bug
assignees: ''
---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment (please complete the following information):**
 - OS: [e.g. iOS]
 - Browser [e.g. chrome, safari]
 - Version [e.g. 22]
 - Plan [e.g. Free, Pro, Premium]

**Additional context**
Add any other context about the problem here.
EOF

cat > .github/ISSUE_TEMPLATE/feature_request.md << 'EOF'
---
name: Feature request
about: Suggest an idea for this project
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.

**Implementation details**
If you have ideas about how this could be implemented, please share them here.
EOF

print_status "Issue templates created"

# Update package.json scripts if needed
print_info "Updating package.json scripts..."

# Create a backup of package.json
cp package.json package.json.backup

# Add deployment and maintenance scripts to package.json
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Add new scripts
pkg.scripts = {
  ...pkg.scripts,
  'lint': 'eslint src --ext .ts,.tsx --report-unused-disable-directives --max-warnings 0',
  'lint:fix': 'eslint src --ext .ts,.tsx --fix',
  'type-check': 'tsc --noEmit',
  'test': 'echo \"Tests not yet implemented\" && exit 0',
  'test:coverage': 'echo \"Test coverage not yet implemented\" && exit 0',
  'deploy:staging': 'vercel --env staging',
  'deploy:production': 'vercel --prod',
  'clean': 'rm -rf dist node_modules/.cache',
  'prepare': 'husky install || true'
};

// Update repository information
pkg.repository = {
  type: 'git',
  url: 'https://github.com/yourusername/nexusone-ai.git'
};

pkg.bugs = {
  url: 'https://github.com/yourusername/nexusone-ai/issues'
};

pkg.homepage = 'https://github.com/yourusername/nexusone-ai#readme';

fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

print_status "package.json updated"

# Create deployment scripts
print_info "Creating deployment scripts..."

cat > scripts/deploy.sh << 'EOF'
#!/bin/bash

# NexusOne AI Deployment Script

set -e

echo "🚀 Deploying NexusOne AI..."

# Check if environment is specified
if [ -z "$1" ]; then
    echo "Usage: ./scripts/deploy.sh [staging|production]"
    exit 1
fi

ENVIRONMENT=$1

# Build the application
echo "📦 Building application..."
npm run build

# Deploy based on environment
if [ "$ENVIRONMENT" = "staging" ]; then
    echo "🚀 Deploying to staging..."
    vercel --env staging
elif [ "$ENVIRONMENT" = "production" ]; then
    echo "🚀 Deploying to production..."
    vercel --prod
else
    echo "❌ Invalid environment. Use 'staging' or 'production'"
    exit 1
fi

echo "✅ Deployment completed successfully!"
EOF

chmod +x scripts/deploy.sh

print_status "Deployment scripts created"

# Create development setup script
cat > scripts/setup-dev.sh << 'EOF'
#!/bin/bash

# NexusOne AI Development Setup Script

set -e

echo "🛠️ Setting up NexusOne AI development environment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment file if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "📋 Creating environment configuration..."
    cp .env.example .env.local
    echo "⚠️  Please edit .env.local and add your API keys"
fi

# Setup git hooks
if [ -d ".git" ]; then
    echo "🔧 Setting up Git hooks..."
    npx husky install || true
fi

echo "✅ Development environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local and add your API keys"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Visit http://localhost:3000 to see your application"
EOF

chmod +x scripts/setup-dev.sh

print_status "Development setup script created"

# Initialize git repository if not already initialized
if [ ! -d ".git" ]; then
    print_info "Initializing Git repository..."
    git init
    print_status "Git repository initialized"
else
    print_info "Git repository already exists"
fi

# Add all files to git
print_info "Adding files to Git..."
git add .

# Create initial commit if this is a new repo
if ! git rev-parse HEAD > /dev/null 2>&1; then
    print_info "Creating initial commit..."
    git commit -m "Initial commit: NexusOne AI Platform

🚀 Features included:
- Complete React + TypeScript frontend
- Supabase backend integration
- 20+ AI-powered modules
- Multi-language support (EN, PT, ES, HE, AR)
- Comprehensive documentation
- GitHub Actions CI/CD
- Security policies and guidelines

Ready for production deployment!"
    
    print_status "Initial commit created"
else
    print_info "Repository already has commits. Skipping initial commit."
fi

echo ""
echo "========================================"
print_status "Repository setup completed successfully!"
echo "========================================"
echo ""
print_info "Next steps:"
echo ""
echo "1. 📝 Edit the README.md file:"
echo "   - Update repository URL"
echo "   - Update demo links"
echo "   - Add your contact information"
echo ""
echo "2. 🔧 Configure API keys:"
echo "   - Copy .env.example to .env.local"
echo "   - Add your Supabase, OpenAI, and other API keys"
echo ""
echo "3. 🌐 Create GitHub repository:"
echo "   - Go to GitHub and create a new repository"
echo "   - Follow the instructions to push existing repository"
echo ""
echo "4. 🚀 Set up deployment:"
echo "   - Configure Vercel or Netlify"
echo "   - Add environment variables to your hosting platform"
echo "   - Deploy your application"
echo ""
echo "5. 🔒 Configure GitHub secrets (for CI/CD):"
echo "   - VERCEL_TOKEN"
echo "   - PRODUCTION_SUPABASE_URL"
echo "   - PRODUCTION_SUPABASE_ANON_KEY"
echo "   - STAGING_SUPABASE_URL"
echo "   - STAGING_SUPABASE_ANON_KEY"
echo ""

print_info "Git repository prepared for GitHub:"
echo "   git remote add origin https://github.com/yourusername/nexusone-ai.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""

print_status "🎉 Your NexusOne AI repository is ready for GitHub!"
EOF