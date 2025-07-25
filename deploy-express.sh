#!/bin/bash

# 🚀 NexusOne AI - Deploy Express (1 comando)
# Este script faz o deploy completo em minutos

set -e

echo "🚀 INICIANDO DEPLOY NEXUSONE AI..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Banner
echo -e "${PURPLE}"
echo "███╗   ██╗███████╗██╗  ██╗██╗   ██╗███████╗ ██████╗ ███╗   ██╗███████╗"
echo "████╗  ██║██╔════╝╚██╗██╔╝██║   ██║██╔════╝██╔═══██╗████╗  ██║██╔════╝"
echo "██╔██╗ ██║█████╗   ╚███╔╝ ██║   ██║███████╗██║   ██║██╔██╗ ██║█████╗  "
echo "██║╚██╗██║██╔══╝   ██╔██╗ ██║   ██║╚════██║██║   ██║██║╚██╗██║██╔══╝  "
echo "██║ ╚████║███████╗██╔╝ ██╗╚██████╔╝███████║╚██████╔╝██║ ╚████║███████╗"
echo "╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝"
echo -e "${NC}"
echo -e "${BLUE}        Plataforma Global de Automação de Marketing com IA${NC}"
echo ""

# Verificações iniciais
echo -e "${BLUE}🔍 Verificando requisitos...${NC}"

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js não encontrado. Instale: https://nodejs.org${NC}"
    exit 1
fi

# Verificar npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm não encontrado${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js e npm encontrados${NC}"

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Execute este script no diretório raiz do projeto${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Diretório do projeto correto${NC}"

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Instalando dependências...${NC}"
    npm install
fi

echo -e "${GREEN}✅ Dependências verificadas${NC}"

# Opções de deploy
echo ""
echo -e "${BLUE}🎯 OPÇÕES DE DEPLOY DISPONÍVEIS:${NC}"
echo "1. 🟢 Vercel (Recomendado) - Deploy automático"
echo "2. 🟡 Netlify - Deploy manual"  
echo "3. 🔵 Build apenas - Para deploy manual"
echo "4. 🟣 Configurar ambiente - Apenas setup"

echo ""
read -p "Escolha uma opção (1-4): " choice

case $choice in
    1)
        echo -e "${GREEN}🚀 Deploy via Vercel selecionado${NC}"
        
        # Verificar se Vercel CLI está instalado
        if ! command -v vercel &> /dev/null; then
            echo -e "${YELLOW}📦 Instalando Vercel CLI...${NC}"
            npm install -g vercel
        fi
        
        # Build do projeto
        echo -e "${BLUE}🏗️ Fazendo build do projeto...${NC}"
        npm run build
        
        # Deploy via Vercel
        echo -e "${BLUE}🚀 Fazendo deploy no Vercel...${NC}"
        vercel --prod --yes
        
        echo -e "${GREEN}✅ Deploy Vercel concluído!${NC}"
        ;;
        
    2)
        echo -e "${GREEN}🚀 Deploy via Netlify selecionado${NC}"
        
        # Verificar se Netlify CLI está instalado
        if ! command -v netlify &> /dev/null; then
            echo -e "${YELLOW}📦 Instalando Netlify CLI...${NC}"
            npm install -g netlify-cli
        fi
        
        # Build do projeto
        echo -e "${BLUE}🏗️ Fazendo build do projeto...${NC}"
        npm run build
        
        # Deploy via Netlify
        echo -e "${BLUE}🚀 Fazendo deploy no Netlify...${NC}"
        netlify deploy --prod --dir=dist
        
        echo -e "${GREEN}✅ Deploy Netlify concluído!${NC}"
        ;;
        
    3)
        echo -e "${GREEN}🏗️ Build do projeto selecionado${NC}"
        
        # Build do projeto
        echo -e "${BLUE}🏗️ Fazendo build do projeto...${NC}"
        npm run build
        
        echo -e "${GREEN}✅ Build concluído! Arquivos em: ./dist${NC}"
        echo -e "${YELLOW}📁 Você pode fazer upload da pasta 'dist' para qualquer hosting${NC}"
        ;;
        
    4)
        echo -e "${GREEN}⚙️ Configuração de ambiente selecionada${NC}"
        
        # Criar arquivo de ambiente se não existir
        if [ ! -f ".env.production" ]; then
            echo -e "${BLUE}📝 Criando arquivo .env.production...${NC}"
            cp .env.production.template .env.production
            echo -e "${YELLOW}⚠️ Edite o arquivo .env.production com suas chaves reais${NC}"
        fi
        
        echo -e "${GREEN}✅ Configuração concluída!${NC}"
        ;;
        
    *)
        echo -e "${RED}❌ Opção inválida${NC}"
        exit 1
        ;;
esac

# Informações finais
echo ""
echo -e "${BLUE}📋 INFORMAÇÕES IMPORTANTES:${NC}"
echo ""
echo -e "${GREEN}✅ CHAVE CJ DROPSHIPPING CONFIGURADA:${NC}"
echo "   5e0e680914c6462ebcf39059b21e70a9"
echo ""
echo -e "${YELLOW}⚠️ CHAVES NECESSÁRIAS PARA RECURSOS COMPLETOS:${NC}"
echo "   - Supabase URL e API Key (obrigatório)"
echo "   - OpenAI API Key (para IA)"
echo "   - Facebook Access Token (para ads)"
echo "   - Stripe Keys (para pagamentos)"
echo ""
echo -e "${BLUE}🌍 IDIOMAS SUPORTADOS:${NC}"
echo "   🇺🇸 English | 🇪🇸 Español | 🇵🇹 Português | 🇮🇱 עברית | 🇸🇦 العربية"
echo ""
echo -e "${PURPLE}💰 PLANOS DE MONETIZAÇÃO:${NC}"
echo "   🆓 FREE: R$ 0/mês (50 créditos)"
echo "   🔥 PRO: R$ 97/mês (500 créditos)"
echo "   💎 PREMIUM: R$ 297/mês (2000 créditos)"
echo ""

if [ "$choice" = "1" ] || [ "$choice" = "2" ]; then
    echo -e "${GREEN}🎉 PARABÉNS! Sua plataforma NexusOne AI está ONLINE!${NC}"
    echo ""
    echo -e "${BLUE}📝 PRÓXIMOS PASSOS:${NC}"
    echo "1. Configure as variáveis de ambiente no dashboard do hosting"
    echo "2. Teste todas as funcionalidades principais"
    echo "3. Configure seu domínio personalizado"
    echo "4. Inicie suas campanhas de marketing"
    echo "5. Monitore analytics e conversões"
    echo ""
    echo -e "${YELLOW}🎯 META DOS PRIMEIROS 30 DIAS:${NC}"
    echo "   - 100+ usuários registrados"
    echo "   - R$ 5.000+ em receita"
    echo "   - Todas funcionalidades operacionais"
    echo ""
fi

echo -e "${PURPLE}🚀 NexusOne AI - Ready for Global Domination! 🌍${NC}"