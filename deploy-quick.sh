#!/bin/bash

# 🚀 DEPLOY RÁPIDO NEXUSONE AI
# ============================

echo "🚀 Iniciando deploy do NexusOne AI..."

# Verificar se temos os comandos necessários
command -v npm >/dev/null 2>&1 || { echo "❌ npm não encontrado. Instale Node.js primeiro."; exit 1; }

echo "📦 Instalando dependências..."
npm install

echo "🔧 Verificando configuração..."
node check-deploy-readiness.js

echo ""
echo "📋 INSTRUÇÕES DE DEPLOY:"
echo "========================"
echo ""
echo "🎨 FRONTEND (Vercel):"
echo "1. npm install -g vercel"
echo "2. vercel login"
echo "3. npm run deploy:vercel"
echo ""
echo "🔧 BACKEND (Supabase):"
echo "1. npm install -g supabase"
echo "2. supabase login"
echo "3. cd supabase && supabase functions deploy --project-ref SEU_PROJECT_REF"
echo ""
echo "⚙️ Variáveis de ambiente:"
echo "- Configure no dashboard do Vercel"
echo "- Configure no dashboard do Supabase"
echo "- Use os valores do arquivo .env.example"
echo ""
echo "🌐 URLs importantes:"
echo "- Vercel: https://vercel.com/dashboard"
echo "- Supabase: https://app.supabase.com"
echo ""
echo "📖 Consulte DEPLOY_MANUAL_GUIDE.md para detalhes completos"
echo ""
echo "✅ Projeto preparado para deploy!"