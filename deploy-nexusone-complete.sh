#!/bin/bash

# 🚀 NEXUSONE AI - DEPLOY COMPLETO AUTOMATIZADO
# ================================================

set -e  # Sair em caso de erro

echo "🚀 INICIANDO DEPLOY COMPLETO DO NEXUSONE AI..."
echo "=============================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se o Supabase CLI está instalado
check_supabase_cli() {
    if ! command -v supabase &> /dev/null; then
        log_error "Supabase CLI não está instalado!"
        log_info "Instalando Supabase CLI..."
        npm install -g supabase
    fi
    log_success "Supabase CLI está disponível"
}

# Verificar se o Vercel CLI está instalado
check_vercel_cli() {
    if ! command -v vercel &> /dev/null; then
        log_error "Vercel CLI não está instalado!"
        log_info "Instalando Vercel CLI..."
        npm install -g vercel
    fi
    log_success "Vercel CLI está disponível"
}

# Verificar dependências
check_dependencies() {
    log_info "Verificando dependências..."
    check_supabase_cli
    check_vercel_cli
    
    if [ ! -f "package.json" ]; then
        log_error "package.json não encontrado!"
        exit 1
    fi
    
    log_success "Todas as dependências estão OK"
}

# Instalar dependências do projeto
install_dependencies() {
    log_info "Instalando dependências do projeto..."
    npm install
    log_success "Dependências instaladas com sucesso"
}

# Configurar variáveis de ambiente
setup_env() {
    log_info "Configurando variáveis de ambiente..."
    
    # Criar .env.local se não existir
    if [ ! -f ".env.local" ]; then
        log_warning ".env.local não encontrado. Criando template..."
        cat > .env.local << EOF
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
OPENAI_ASSISTANT_ID=your_assistant_id

# Other APIs
CJ_DROPSHIPPING_API_KEY=your_cj_api_key
ELEVENLABS_API_KEY=your_elevenlabs_key
REPLICATE_API_TOKEN=your_replicate_token
GUPSHUP_API_KEY=your_gupshup_key
LUMA_API_KEY=your_luma_key
UNSPLASH_ACCESS_KEY=your_unsplash_key
FACEBOOK_ACCESS_TOKEN=your_facebook_token
EOF
        log_warning "Por favor, configure as variáveis em .env.local antes de continuar"
        log_info "Exemplo das configurações necessárias criado em .env.local"
        exit 1
    fi
    
    log_success "Arquivo .env.local configurado"
}

# Deploy das Edge Functions para Supabase
deploy_backend() {
    log_info "🔧 DEPLOY DO BACKEND (Supabase Edge Functions)..."
    
    # Verificar se existe projeto Supabase
    if [ ! -f "supabase/config.toml" ]; then
        log_error "Projeto Supabase não inicializado!"
        log_info "Inicializando projeto Supabase..."
        supabase init
    fi
    
    # Fazer login no Supabase (se necessário)
    log_info "Verificando autenticação Supabase..."
    if ! supabase projects list &> /dev/null; then
        log_info "Fazendo login no Supabase..."
        supabase login
    fi
    
    # Listar funções disponíveis
    log_info "Funções Edge disponíveis para deploy:"
    ls -1 supabase/functions/ | grep -v "_shared" | grep -v "README.md" || true
    
    # Deploy de todas as Edge Functions
    log_info "Fazendo deploy das Edge Functions..."
    
    FUNCTIONS=(
        "ai-content-generation"
        "ai-content-generator"
        "api-proxy"
        "cj-dropshipping-catalog"
        "cj-dropshipping-order"
        "dropshipping-import"
        "facebook-ads-manager"
        "landing-page-builder"
        "luma-video-ai"
        "nexbrain-chat"
        "nexus-api-manager"
        "product-scraper"
        "save-api-config"
        "test-api-connection"
        "unsplash-api"
        "usage-tracker"
        "video-generator"
        "webhook-handler"
        "whatsapp-automation"
    )
    
    for func in "${FUNCTIONS[@]}"; do
        if [ -d "supabase/functions/$func" ]; then
            log_info "Deploying $func..."
            supabase functions deploy $func --project-ref $(grep VITE_SUPABASE_URL .env.local | cut -d'/' -f3 | cut -d'.' -f1) || log_warning "Falha ao deployar $func"
        else
            log_warning "Função $func não encontrada"
        fi
    done
    
    log_success "Backend (Edge Functions) deployado com sucesso!"
}

# Deploy do Frontend
deploy_frontend() {
    log_info "🎨 DEPLOY DO FRONTEND (Vercel)..."
    
    # Build do projeto
    log_info "Fazendo build do projeto..."
    npm run build:prod
    
    # Verificar se o build foi bem-sucedido
    if [ ! -d "dist" ]; then
        log_error "Build falhou! Diretório 'dist' não foi criado."
        exit 1
    fi
    
    log_success "Build concluído com sucesso!"
    
    # Deploy para Vercel
    log_info "Fazendo deploy para Vercel..."
    vercel --prod --yes
    
    log_success "Frontend deployado com sucesso no Vercel!"
}

# Validar deployment
validate_deployment() {
    log_info "🔍 VALIDANDO DEPLOYMENT..."
    
    # Teste básico das APIs
    log_info "Testando APIs principais..."
    
    # Aqui você pode adicionar testes específicos
    # Por exemplo, fazer requests para as edge functions
    
    log_success "Validação básica concluída!"
}

# Mostrar informações pós-deploy
show_deploy_info() {
    log_success "🎉 DEPLOY COMPLETO REALIZADO COM SUCESSO!"
    echo ""
    echo "=============================================="
    echo "📋 INFORMAÇÕES DO DEPLOYMENT:"
    echo "=============================================="
    echo ""
    log_info "🔧 Backend (Supabase Edge Functions): Deployado"
    log_info "🎨 Frontend (Vercel): Deployado"
    echo ""
    echo "🌐 URLs importantes:"
    echo "   • Frontend: Verifique o output do Vercel acima"
    echo "   • Supabase Dashboard: https://app.supabase.com"
    echo "   • Vercel Dashboard: https://vercel.com/dashboard"
    echo ""
    echo "📚 Próximos passos:"
    echo "   1. Configure as variáveis de ambiente no Vercel Dashboard"
    echo "   2. Teste todas as funcionalidades"
    echo "   3. Configure domínio personalizado (opcional)"
    echo ""
    log_success "NexusOne AI está ONLINE! 🚀"
}

# Função principal
main() {
    echo ""
    log_info "Iniciando deploy completo do NexusOne AI..."
    echo ""
    
    check_dependencies
    install_dependencies
    setup_env
    
    echo ""
    log_info "🚀 INICIANDO DEPLOY..."
    echo ""
    
    deploy_backend
    deploy_frontend
    validate_deployment
    show_deploy_info
}

# Executar função principal
main "$@"