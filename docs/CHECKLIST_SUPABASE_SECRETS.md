# ✅ Checklist: Configurar Secrets no Supabase

## 🎯 Objetivo

Configurar as credenciais da UAZapi como **Secrets** no Supabase para que as Edge Functions possam acessá-las de forma segura (sem expor no frontend).

---

## 📋 Passo a Passo

### 1. Acessar o Dashboard do Supabase

**URL:** https://supabase.com/dashboard/project/zpzzvkjwnttrdtuvtmwv/settings/functions

### 2. Navegar para Edge Functions → Secrets

1. No menu lateral, clique em **"Edge Functions"**
2. Clique na aba **"Secrets"**
3. Clique no botão **"Add new secret"**

### 3. Adicionar os Secrets

Adicione **EXATAMENTE** estes 4 secrets (nome e valor):

#### ✅ Secret 1: UAZAPI_URL

| Campo | Valor |
|-------|-------|
| **Name** | `UAZAPI_URL` |
| **Value** | `https://infuse.uazapi.com` |

---

#### ✅ Secret 2: UAZAPI_ADMIN_TOKEN

| Campo | Valor |
|-------|-------|
| **Name** | `UAZAPI_ADMIN_TOKEN` |
| **Value** | `VnQFslXgeZ9vAR1QDxUeY3WMyjq2zeqGHkUyc420L2hRsaajnS` |

⚠️ **IMPORTANTE:** Este token é usado para criar instâncias (admintoken header)

---

#### ✅ Secret 3: UAZAPI_SYSTEM_NAME

| Campo | Valor |
|-------|-------|
| **Name** | `UAZAPI_SYSTEM_NAME` |
| **Value** | `infuse` |

---

#### ✅ Secret 4: UAZAPI_NICOLAS_TOKEN

| Campo | Valor |
|-------|-------|
| **Name** | `UAZAPI_NICOLAS_TOKEN` |
| **Value** | `443290d9-6639-4060-abaa-234079180cfb` |

⚠️ **IMPORTANTE:** Este é o token da instância Nicolas (usado para validação global de números)

---

## 🔍 Verificar Configuração

Após adicionar os 4 secrets, você deve ver esta lista:

```
✅ UAZAPI_URL
✅ UAZAPI_ADMIN_TOKEN
✅ UAZAPI_SYSTEM_NAME
✅ UAZAPI_NICOLAS_TOKEN
```

---

## 🧪 Testar Edge Functions

Após configurar os secrets, teste se as Edge Functions estão funcionando:

### Teste 1: Validar Número

```bash
curl -X POST https://zpzzvkjwnttrdtuvtmwv.supabase.co/functions/v1/uazapi-validate-number \
  -H "Content-Type: application/json" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwenp2a2p3bnR0cmR0dXZ0bXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDEzOTIsImV4cCI6MjA2OTIxNzM5Mn0.p1gdUMzd3dW2KavL5oqMG0yALOFW9IKktDlfLWLfW68" \
  -d '{"numbers": ["5561981446666"]}'
```

**Resposta Esperada:**

```json
{
  "success": true,
  "data": [
    {
      "query": "5561981446666",
      "isInWhatsapp": true,
      "jid": "556181446666@s.whatsapp.net",
      "verifiedName": "Nicolas Fujimoto"
    }
  ]
}
```

---

## ❌ Troubleshooting

### Erro: "Missing configuration"

**Causa:** Secrets não configurados ou com nomes errados

**Solução:**
1. Verifique se os 4 secrets estão listados no Dashboard
2. Verifique se os **nomes** estão EXATAMENTE iguais (case-sensitive)
3. Tente re-deploy da Edge Function:
   ```bash
   # Não precisa fazer nada, só aguardar 1-2 minutos
   ```

### Erro: "UAZapi error: 401"

**Causa:** Token inválido

**Solução:**
1. Verifique se `UAZAPI_ADMIN_TOKEN` está correto
2. Verifique se `UAZAPI_NICOLAS_TOKEN` está correto

### Erro: "UAZapi error: 404"

**Causa:** URL base incorreta

**Solução:**
1. Verifique se `UAZAPI_URL` = `https://infuse.uazapi.com` (SEM barra no final)

---

## 🚀 Próximos Passos

Após configurar os secrets:

1. ✅ Testar Edge Functions (ver acima)
2. ✅ Configurar variáveis de ambiente na Vercel (para produção)
3. ✅ Atualizar frontend para usar as Edge Functions

---

**Data:** 2025-11-12  
**Responsável:** Claude AI + Usuário

