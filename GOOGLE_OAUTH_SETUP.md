# 🔧 Configuração Completa do Google OAuth para MindWave.AI

## 📋 Pré-requisitos

- Conta no Google Cloud Console
- Projeto Supabase configurado
- Domínio ou localhost para testes

## 🚀 Passo 1: Configurar Google Cloud Console

### 1.1 Criar/Selecionar Projeto
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Anote o **Project ID** para referência

### 1.2 Ativar APIs Necessárias
1. Vá para **APIs & Services** > **Library**
2. Procure e ative as seguintes APIs:
   - ✅ **Google+ API**
   - ✅ **Google Identity API** 
   - ✅ **People API** (opcional, para dados extras do perfil)

### 1.3 Configurar Tela de Consentimento OAuth
1. Vá para **APIs & Services** > **OAuth consent screen**
2. Selecione **External** (para uso público)
3. Preencha as informações obrigatórias:
   - **App name**: MindWave.AI
   - **User support email**: seu@email.com
   - **Developer contact information**: seu@email.com
4. Adicione escopos (opcional):
   - `email`
   - `profile`
   - `openid`
5. Salve e continue

### 1.4 Criar Credenciais OAuth 2.0
1. Vá para **APIs & Services** > **Credentials**
2. Clique em **+ CREATE CREDENTIALS** > **OAuth 2.0 Client IDs**
3. Selecione **Web application**
4. Configure:

**Nome da aplicação:**
\`\`\`
MindWave.AI - Produção
\`\`\`

**Authorized JavaScript origins:**
\`\`\`
http://localhost:3000
https://yourdomain.com
https://mindwave.vercel.app
\`\`\`

**Authorized redirect URIs:**
\`\`\`
https://gxhfvoadnhdyepbmrrcn.supabase.co/auth/v1/callback
\`\`\`

⚠️ **CRÍTICO**: Use exatamente a URL do Supabase, NÃO a URL do seu app!

5. Clique em **CREATE**
6. **Copie e salve** o Client ID e Client Secret

## 🔧 Passo 2: Configurar Supabase Dashboard

### 2.1 Acessar Configurações de Autenticação
1. Acesse [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto: `gxhfvoadnhdyepbmrrcn`
3. Vá para **Authentication** > **Providers**

### 2.2 Configurar Google Provider
1. Encontre **Google** na lista de providers
2. **Ative o toggle** (deve ficar verde)
3. Adicione as credenciais do Google Cloud Console:
   - **Client ID**: Cole exatamente como copiado
   - **Client Secret**: Cole exatamente como copiado
4. Clique em **Save**

### 2.3 Configurar URLs do Site
1. Vá para **Authentication** > **URL Configuration**
2. Configure:

**Site URL:**
\`\`\`
http://localhost:3000
\`\`\`

**Redirect URLs (adicione uma por linha):**
\`\`\`
http://localhost:3000/auth/callback
https://yourdomain.com/auth/callback
https://mindwave.vercel.app/auth/callback
\`\`\`

3. Clique em **Save**

## 🔧 Passo 3: Configurar Variáveis de Ambiente

### 3.1 Arquivo .env.local
Crie/atualize o arquivo `.env.local` na raiz do projeto:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://gxhfvoadnhdyepbmrrcn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4aGZ2b2FkbmhkeWVwYm1ycmNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExNzEyMTMsImV4cCI6MjA2Njc0NzIxM30.oQqizo1hYjEwGeGlJ8ZXrd0BfmXI1D0gC6Bkztjh9PA
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4aGZ2b2FkbmhkeWVwYm1ycmNuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTE3MTIxMywiZXhwIjoyMDY2NzQ3MjEzfQ.m6odwzjd1KL0kGF-ArrLV78AkcD4C4PXZ3zCUakecM0

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
\`\`\`

### 3.2 Para Deploy (Vercel/Netlify)
Adicione as mesmas variáveis no painel da plataforma de deploy, alterando apenas:
\`\`\`env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
\`\`\`

## 🧪 Passo 4: Testar a Configuração

### 4.1 Executar o Projeto Localmente
\`\`\`bash
# Instalar dependências
npm install
# ou
bun install

# Executar em modo desenvolvimento
npm run dev
# ou
bun dev
\`\`\`

### 4.2 Testar o Fluxo OAuth
1. Acesse `http://localhost:3000/auth`
2. Clique em **"Continuar com Google"**
3. Verifique se redireciona para o Google
4. Faça login com sua conta Google
5. Autorize a aplicação
6. Verifique se retorna para `/dashboard` ou `/onboarding`

### 4.3 Verificar Logs
Abra o **Developer Tools** (F12) e verifique:
- Console para erros JavaScript
- Network tab para requisições HTTP
- Application tab para cookies/localStorage

## 🚨 Troubleshooting Comum

### ❌ Erro: "redirect_uri_mismatch"
**Causa**: URL de redirecionamento incorreta

**Solução**:
1. Verifique se a URL no Google Cloud Console é exatamente:
   \`\`\`
   https://gxhfvoadnhdyepbmrrcn.supabase.co/auth/v1/callback
   \`\`\`
2. Não adicione `/` no final
3. Use HTTPS, não HTTP
4. Aguarde 5-10 minutos para propagação

### ❌ Erro: "invalid_client"
**Causa**: Client ID ou Client Secret incorretos

**Solução**:
1. Verifique se copiou corretamente (sem espaços)
2. Regenere as credenciais no Google Cloud Console
3. Atualize no Supabase Dashboard
4. Limpe cache do navegador

### ❌ Erro: "access_denied"
**Causa**: Usuário cancelou ou app não aprovado

**Solução**:
1. Configure corretamente a tela de consentimento
2. Adicione domínios autorizados
3. Publique o app se necessário (para produção)

### ❌ Erro: "Configuration not found"
**Causa**: Provider não ativado no Supabase

**Solução**:
1. Verifique se o toggle do Google está ativado
2. Confirme se as credenciais foram salvas
3. Aguarde alguns minutos para propagação
4. Recarregue a página do Supabase Dashboard

### ❌ Erro: "CORS policy"
**Causa**: Domínio não autorizado

**Solução**:
1. Adicione o domínio nas **Authorized JavaScript origins**
2. Verifique se não há typos na URL
3. Aguarde propagação das configurações

## 🚀 Deploy em Produção

### Para Vercel:
1. Conecte seu repositório GitHub
2. Configure as variáveis de ambiente:
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=https://gxhfvoadnhdyepbmrrcn.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key
   SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
   NEXT_PUBLIC_APP_URL=https://seu-projeto.vercel.app
   \`\`\`
3. Atualize as URLs autorizadas no Google Cloud Console
4. Atualize as Redirect URLs no Supabase

### URLs de Produção:
**Google Cloud Console - Authorized JavaScript origins:**
\`\`\`
https://seu-projeto.vercel.app
\`\`\`

**Google Cloud Console - Authorized redirect URIs:**
\`\`\`
https://gxhfvoadnhdyepbmrrcn.supabase.co/auth/v1/callback
\`\`\`

**Supabase Dashboard - Redirect URLs:**
\`\`\`
https://seu-projeto.vercel.app/auth/callback
\`\`\`

## ✅ Checklist Final

### Google Cloud Console:
- [ ] Projeto criado/selecionado
- [ ] APIs ativadas (Google+ API, Google Identity API)
- [ ] Tela de consentimento configurada
- [ ] OAuth 2.0 Client ID criado
- [ ] JavaScript origins configuradas
- [ ] Redirect URIs configuradas
- [ ] Client ID e Secret copiados

### Supabase Dashboard:
- [ ] Google Provider ativado
- [ ] Client ID adicionado
- [ ] Client Secret adicionado
- [ ] Site URL configurada
- [ ] Redirect URLs configuradas
- [ ] Configurações salvas

### Aplicação:
- [ ] Variáveis de ambiente configuradas
- [ ] Dependências instaladas
- [ ] Projeto executando localmente
- [ ] Teste de login funcionando
- [ ] Callback funcionando
- [ ] Perfil sendo criado automaticamente

### Deploy (se aplicável):
- [ ] Variáveis de ambiente configuradas na plataforma
- [ ] URLs de produção atualizadas no Google
- [ ] URLs de produção atualizadas no Supabase
- [ ] Teste em produção funcionando

## 🎉 Sucesso!

Se todos os itens do checklist estão marcados, seu Google OAuth está funcionando perfeitamente! 

**Próximos passos:**
- Implementar outros providers (GitHub, Discord, etc.)
- Adicionar 2FA
- Configurar recuperação de senha
- Implementar rate limiting
- Adicionar analytics de conversão

---

**Suporte**: Se encontrar problemas, verifique os logs do Supabase Dashboard em **Authentication** > **Logs** e os logs do navegador no Developer Tools.
