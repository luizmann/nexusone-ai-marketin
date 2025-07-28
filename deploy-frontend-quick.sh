#!/bin/bash
# Quick Frontend Deployment to Vercel

echo "🌐 Deploying NexusOne AI Frontend to Vercel..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build for production
echo "🔨 Building for production..."
NODE_ENV=production npm run build:prod

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod --confirm

echo "✅ Frontend deployment complete!"
echo "🌐 Your app is live at: https://nexusone.vercel.app"

# Set environment variables (if not already set)
echo "🔧 Configuring environment variables..."

vercel env add VITE_SUPABASE_URL production
vercel env add VITE_SUPABASE_ANON_KEY production  
vercel env add VITE_APP_NAME production
vercel env add VITE_ENVIRONMENT production
vercel env add VITE_CJ_API_KEY production
vercel env add VITE_FACEBOOK_ACCESS_TOKEN production

echo "💡 Note: Set the following environment variables in Vercel dashboard:"
echo "   VITE_SUPABASE_URL=https://hbfgtdxvlbkvkrjqxnac.supabase.co"
echo "   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiZmd0ZHh2bGJrdmtyanlkHnhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY2NjA0NzcsImV4cCI6MjAyMjIzNjQ3N30.4L1VGpMOQR4zNjL5xVKjN8QX9hBf2wP0sA7rD3kF1mE"
echo "   VITE_APP_NAME=NexusOne AI"
echo "   VITE_ENVIRONMENT=production"

echo "🎉 Deployment complete! Visit your app at: https://nexusone.vercel.app"