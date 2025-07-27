#!/bin/bash

# 🚀 NexusOne AI - Quick Production Deploy
# Simple deployment script for immediate production launch

echo "🚀 NexusOne AI - Production Deployment Starting..."
echo "=================================================="

# Function to print status
print_status() {
    echo "ℹ️  $1"
}

print_success() {
    echo "✅ $1"
}

print_error() {
    echo "❌ $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run from project root."
    exit 1
fi

print_status "Validating environment..."

# Create production environment if it doesn't exist
if [ ! -f ".env.production" ]; then
    print_status "Creating .env.production..."
    cp .env.production.example .env.production 2>/dev/null || echo "# Add your production environment variables here" > .env.production
fi

print_status "Installing dependencies..."
npm install

print_status "Building application..."
npm run build

if [ ! -d "dist" ]; then
    print_error "Build failed - no dist directory created"
    exit 1
fi

print_success "Build completed successfully!"

print_status "Application is ready for deployment!"
echo ""
echo "📋 Next steps:"
echo "1. Configure your environment variables in .env.production"
echo "2. Deploy to your hosting platform (Netlify/Vercel/etc.)"
echo "3. Set up your Supabase production database"
echo "4. Configure remaining APIs (Stripe, D-ID, Runway)"
echo ""
echo "🌍 Deployment targets:"
echo "• Netlify: netlify deploy --prod --dir=dist"
echo "• Vercel: vercel --prod"
echo "• Manual: Upload dist/ folder to your hosting provider"
echo ""
echo "✅ NexusOne AI is ready for production!"

# Test if basic environment is working
print_status "Running basic health checks..."

# Check if node_modules exists
if [ -d "node_modules" ]; then
    print_success "Dependencies installed"
else
    print_error "Dependencies not properly installed"
fi

# Check if dist exists and has content
if [ -d "dist" ] && [ "$(ls -A dist)" ]; then
    print_success "Production build ready"
else
    print_error "Production build not ready"
fi

# Check basic file structure
REQUIRED_FILES=("dist/index.html" "dist/assets")
for file in "${REQUIRED_FILES[@]}"; do
    if [ -e "$file" ]; then
        print_success "$file exists"
    else
        print_error "$file missing"
    fi
done

echo ""
echo "🎉 Quick deployment preparation complete!"
echo "Your NexusOne AI platform is ready for production deployment!"