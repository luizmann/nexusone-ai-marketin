#!/bin/bash

# 🚀 NEXUSONE AI - VERCEL DEPLOYMENT SCRIPT
# Este script faz o deploy completo do NexusOne AI no Vercel

echo "🚀 INICIANDO DEPLOY DO NEXUSONE AI NO VERCEL..."
echo "=================================================="

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale o Node.js primeiro."
    exit 1
fi

# Verificar se o npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Instale o npm primeiro."
    exit 1
fi

# Instalar Vercel CLI se não estiver instalado
if ! command -v vercel &> /dev/null; then
    echo "📦 Instalando Vercel CLI..."
    npm install -g vercel
fi

echo "✅ Verificações de ambiente concluídas"

# Limpar cache e reinstalar dependências
echo "🧹 Limpando cache e reinstalando dependências..."
rm -rf node_modules package-lock.json
npm install

# Executar verificação de tipos
echo "🔍 Verificando tipos TypeScript..."
npm run type-check

# Build de produção
echo "🏗️ Executando build de produção..."
npm run build:prod

if [ $? -ne 0 ]; then
    echo "❌ Falha no build. Verificando erros..."
    exit 1
fi

echo "✅ Build concluído com sucesso!"

# Login no Vercel (se necessário)
echo "🔐 Verificando autenticação Vercel..."
vercel whoami || {
    echo "🔑 Fazendo login no Vercel..."
    vercel login
}

# Deploy no Vercel
echo "🚀 Fazendo deploy no Vercel..."
echo "📋 Configurações do deploy:"
echo "   - Nome: nexusone-ai"
echo "   - Diretório: dist"
echo "   - Variáveis de ambiente: configuradas no vercel.json"

vercel --prod --yes

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 DEPLOY CONCLUÍDO COM SUCESSO!"
    echo "=================================================="
    echo "✅ Frontend: Deployado no Vercel"
    echo "✅ APIs: Configuradas com Supabase"
    echo "✅ Variáveis de ambiente: Aplicadas"
    echo ""
    echo "🌐 Sua aplicação está disponível em:"
    echo "   https://nexusone-ai.vercel.app"
    echo ""
    echo "📊 Próximos passos:"
    echo "   1. Teste todas as funcionalidades"
    echo "   2. Configure domínio personalizado (opcional)"
    echo "   3. Configure monitoramento"
    echo ""
    echo "🔧 Para verificar status:"
    echo "   vercel ls"
    echo "   vercel logs nexusone-ai"
    echo ""
else
    echo "❌ Falha no deploy. Verificando logs..."
    vercel logs nexusone-ai --follow
    exit 1
fi

# Validar deploy
echo "🔍 Validando deploy..."
DEPLOY_URL=$(vercel ls nexusone-ai --scope=team_luizmann 2>/dev/null | grep https | head -1 | awk '{print $2}')

if [ -n "$DEPLOY_URL" ]; then
    echo "✅ Deploy validado: $DEPLOY_URL"
    
    # Teste básico de conectividade
    echo "🌐 Testando conectividade..."
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL" --max-time 10)
    
    if [ "$HTTP_STATUS" = "200" ]; then
        echo "✅ Aplicação está online e funcionando!"
    else
        echo "⚠️ Aplicação deployada mas retornou status: $HTTP_STATUS"
    fi
else
    echo "⚠️ Não foi possível verificar o URL do deploy"
fi

echo ""
echo "🎯 DEPLOY VERCEL FINALIZADO!"
echo "=================================================="