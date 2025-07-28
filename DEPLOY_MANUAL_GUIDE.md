# 🚀 GUIA DE DEPLOY COMPLETO - NEXUSONE AI

## 📋 PRÉ-REQUISITOS

Antes de fazer o deploy, certifique-se de ter:

1. **Node.js 18+** instalado
2. **Conta Supabase** criada
3. **Conta Vercel** criada
4. **APIs configuradas** (OpenAI obrigatório)

## 🔧 PASSO 1: CONFIGURAÇÃO DAS VARIÁVEIS

1. Copie o arquivo de exemplo:
```bash
cp .env.example .env.local
```

2. Configure as variáveis obrigatórias em `.env.local`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=sk-proj-your_openai_api_key
OPENAI_ASSISTANT_ID=asst_your_assistant_id
```

## 🗄️ PASSO 2: DEPLOY DO BACKEND (Supabase)

### Instalar Supabase CLI:
```bash
npm install -g supabase
```

### Login no Supabase:
```bash
supabase login
```

### Deploy das Edge Functions:
```bash
# Deploy individual de cada função
supabase functions deploy ai-content-generation
supabase functions deploy nexbrain-chat
supabase functions deploy cj-dropshipping-catalog
supabase functions deploy facebook-ads-manager
supabase functions deploy whatsapp-automation
supabase functions deploy video-generator
supabase functions deploy landing-page-builder
supabase functions deploy product-scraper
supabase functions deploy save-api-config
supabase functions deploy nexus-api-manager

# Ou deploy em lote (se preferir):
cd supabase/functions && for dir in */; do supabase functions deploy "${dir%/}"; done
```

### Configurar variáveis no Supabase:
```bash
supabase secrets set OPENAI_API_KEY=your_openai_key
supabase secrets set CJ_DROPSHIPPING_API_KEY=your_cj_key
supabase secrets set ELEVENLABS_API_KEY=your_elevenlabs_key
supabase secrets set REPLICATE_API_TOKEN=your_replicate_token
supabase secrets set GUPSHUP_API_KEY=your_gupshup_key
supabase secrets set LUMA_API_KEY=your_luma_key
supabase secrets set UNSPLASH_ACCESS_KEY=your_unsplash_key
supabase secrets set FACEBOOK_ACCESS_TOKEN=your_facebook_token
```

## 🎨 PASSO 3: DEPLOY DO FRONTEND (Vercel)

### Instalar Vercel CLI:
```bash
npm install -g vercel
```

### Build do projeto:
```bash
npm install
npm run build:prod
```

### Deploy para Vercel:
```bash
vercel --prod
```

### Configurar variáveis no Vercel:
No dashboard do Vercel, adicione as variáveis de ambiente:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- Outras variáveis que começam com `VITE_`

## 🔍 PASSO 4: VALIDAÇÃO

### Teste as APIs:
```bash
# Testar se as Edge Functions estão funcionando
curl -X POST "https://your-project.supabase.co/functions/v1/test-api-connection" \
  -H "Authorization: Bearer your_anon_key" \
  -H "Content-Type: application/json"
```

### Teste o Frontend:
1. Acesse sua URL do Vercel
2. Teste o login/registro
3. Teste criação de campanhas
4. Verifique se as APIs estão conectadas

## 🌐 PASSO 5: CONFIGURAÇÃO FINAL

### DNS (Opcional):
Configure seu domínio customizado no Vercel

### Monitoramento:
Configure alertas no Supabase e Vercel

### Backup:
Configure backups automáticos do banco

## 🚨 SOLUÇÃO DE PROBLEMAS

### Erro: "Function not found"
- Verifique se todas as Edge Functions foram deployadas
- Confirme se as variáveis estão configuradas no Supabase

### Erro: "API Key invalid"
- Verifique se as chaves de API estão corretas
- Confirme se as secrets foram configuradas no Supabase

### Erro de Build:
- Execute `npm install` novamente
- Verifique se as dependências estão atualizadas

## 📞 COMANDOS ÚTEIS

```bash
# Ver logs das functions
supabase functions logs

# Redeploy rápido
vercel --prod

# Testar localmente
npm run dev

# Ver status do projeto
supabase projects list
vercel projects list
```

## ✅ CHECKLIST FINAL

- [ ] Backend deployado no Supabase
- [ ] Frontend deployado no Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] APIs testadas e funcionando
- [ ] Login/registro funcionando
- [ ] Criação de campanhas funcionando
- [ ] WhatsApp conectado
- [ ] Sistema de créditos ativo

## 🎉 SUCESSO!

Seu NexusOne AI está agora online e pronto para uso!

**URLs importantes:**
- Frontend: `https://your-app.vercel.app`
- Supabase Dashboard: `https://app.supabase.com`
- Vercel Dashboard: `https://vercel.com/dashboard`