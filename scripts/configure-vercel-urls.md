# 🔧 Configurar URLs de Redirecionamento para Vercel

## 📋 **Problema Identificado**
O magic link está redirecionando para `localhost:3000` ao invés da URL da Vercel porque as redirect URLs não estão configuradas corretamente no Supabase Auth.

## ✅ **Correções Aplicadas**
1. ✅ Atualizado `.env` com URL da Vercel
2. ✅ Corrigido `LoginForm.tsx` para usar `VITE_APP_URL`

## 🎯 **Próximos Passos**

### **1. Obter URL exata da Vercel**
Primeiro, confirme qual é a URL exata da sua aplicação na Vercel:
- Acesse seu projeto na Vercel
- Copie a URL de produção (exemplo: `https://guido-abc123.vercel.app`)

### **2. Atualizar arquivo .env**
```bash
# Substitua pela URL real da Vercel
VITE_APP_URL=https://sua-url-real.vercel.app
```

### **3. Obter Token de Acesso do Supabase**
1. Acesse [https://supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens)
2. Clique em "Generate new token"
3. Dê um nome (ex: "Configure Redirect URLs")
4. Copie o token gerado

### **4. Configurar Redirect URLs (via Management API)**

Execute estes comandos no terminal (substitua os valores pelos seus):

```bash
# Definir variáveis
export SUPABASE_ACCESS_TOKEN="seu-token-aqui"
export PROJECT_REF="zpzzvkjwnttrdtuvtmwv"
export VERCEL_URL="https://sua-url-real.vercel.app"

# Configurar Site URL e Redirect URLs
curl -X PATCH "https://api.supabase.com/v1/projects/$PROJECT_REF/config/auth" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"site_url\": \"$VERCEL_URL\",
    \"uri_allow_list\": [
      \"$VERCEL_URL\",
      \"$VERCEL_URL/**\",
      \"http://localhost:3000\",
      \"http://localhost:3000/**\",
      \"https://*-nicfuji87.vercel.app/**\"
    ]
  }"
```

### **5. Método Alternativo (via Dashboard)**
Alternativamente, você pode configurar manualmente:

1. Acesse [https://supabase.com/dashboard/project/_/auth/url-configuration](https://supabase.com/dashboard/project/_/auth/url-configuration)
2. Em **Site URL**, coloque: `https://sua-url-real.vercel.app`
3. Em **Redirect URLs**, adicione:
   - `https://sua-url-real.vercel.app`
   - `https://sua-url-real.vercel.app/**`
   - `http://localhost:3000` (para desenvolvimento)
   - `http://localhost:3000/**`
   - `https://*-nicfuji87.vercel.app/**` (para preview URLs)

## 🔄 **Após Configuração**

1. **Atualizar .env local:**
   ```bash
   VITE_APP_URL=https://sua-url-real.vercel.app
   ```

2. **Fazer commit e push:**
   ```bash
   git add .
   git commit -m "fix: configura URLs de redirecionamento para Vercel"
   git push
   ```

3. **Testar:**
   - Acesse a aplicação na Vercel
   - Faça login com seu email
   - O magic link deve agora redirecionar corretamente para a Vercel

## 📝 **URLs de Exemplo para Vercel**

```bash
# URLs exatas (recomendado para produção)
https://guido.vercel.app
https://guido.vercel.app/app

# Wildcard para preview URLs (recomendado para desenvolvimento)
https://*-nicfuji87.vercel.app/**
http://localhost:3000/**
```

## ⚠️ **Importante**
- As redirect URLs são case-sensitive
- Use wildcards (`**`) para flexibilidade com preview URLs da Vercel
- Mantenha localhost para desenvolvimento local
- Teste após cada mudança

## 🛠️ **Troubleshooting**

Se ainda houver problemas:
1. Verifique se a URL da Vercel está correta
2. Aguarde alguns minutos para propagação das configurações
3. Limpe cache do navegador
4. Teste em navegador anônimo

---
*Gerado automaticamente pelo assistente para corrigir problema de redirecionamento*
