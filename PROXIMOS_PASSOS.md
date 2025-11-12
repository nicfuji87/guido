# ✅ Próximos Passos - Migração UAZapi

## 🎯 O Que Foi Feito

✅ Banco de dados atualizado (8 novas colunas)  
✅ 4 Edge Functions criadas e deployadas  
✅ Variáveis de ambiente atualizadas  
✅ Documentação completa criada

---

## 🔴 AÇÃO URGENTE - Você Precisa Fazer AGORA

### 1. Configurar Secrets no Supabase (5 minutos)

**URL:** https://supabase.com/dashboard/project/zpzzvkjwnttrdtuvtmwv/settings/functions

**Clique em:** Edge Functions → Secrets → Add new secret

**Adicione estes 4 secrets:**

```
Nome: UAZAPI_URL
Valor: https://infuse.uazapi.com

Nome: UAZAPI_ADMIN_TOKEN
Valor: VnQFslXgeZ9vAR1QDxUeY3WMyjq2zeqGHkUyc420L2hRsaajnS

Nome: UAZAPI_SYSTEM_NAME
Valor: infuse

Nome: UAZAPI_NICOLAS_TOKEN
Valor: 443290d9-6639-4060-abaa-234079180cfb
```

📄 **Guia detalhado:** `docs/CHECKLIST_SUPABASE_SECRETS.md`

---

### 2. Testar Edge Functions (2 minutos)

Após configurar os secrets, teste se está funcionando:

```bash
curl -X POST https://zpzzvkjwnttrdtuvtmwv.supabase.co/functions/v1/uazapi-validate-number \
  -H "Content-Type: application/json" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwenp2a2p3bnR0cmR0dXZ0bXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDEzOTIsImV4cCI6MjA2OTIxNzM5Mn0.p1gdUMzd3dW2KavL5oqMG0yALOFW9IKktDlfLWLfW68" \
  -d '{"numbers": ["5561981446666"]}'
```

**Resposta esperada:** `{"success":true,"data":[...]}`

---

### 3. Configurar Vercel (3 minutos)

**URL:** https://vercel.com/seu-projeto/settings/environment-variables

**Adicione:**

```
VITE_UAZAPI_VALIDATE_NUMBER_URL=https://zpzzvkjwnttrdtuvtmwv.supabase.co/functions/v1/uazapi-validate-number
VITE_UAZAPI_INIT_INSTANCE_URL=https://zpzzvkjwnttrdtuvtmwv.supabase.co/functions/v1/uazapi-init-instance
VITE_UAZAPI_CONNECT_INSTANCE_URL=https://zpzzvkjwnttrdtuvtmwv.supabase.co/functions/v1/uazapi-connect-instance
VITE_UAZAPI_CHECK_STATUS_URL=https://zpzzvkjwnttrdtuvtmwv.supabase.co/functions/v1/uazapi-check-status
```

**Depois:** Fazer redeploy do projeto

---

## 🟡 Próximo - Atualizar Frontend

Arquivos que precisam ser modificados:

1. `src/hooks/useWhatsAppValidation.ts` - Usar `VITE_UAZAPI_VALIDATE_NUMBER_URL`
2. `src/services/evolutionAPI.ts` - Migrar para chamar Edge Functions
3. `src/components/widgets/EvolutionWhatsAppWidget.tsx` - Adicionar polling + QR/paircode

📄 **Exemplos de código:** `docs/COMO_USAR_EDGE_FUNCTIONS.md`

---

## 📚 Documentação Criada

| Arquivo | Conteúdo |
|---------|----------|
| `docs/RESUMO_MIGRACAO_UAZAPI.md` | Resumo executivo completo |
| `docs/CHECKLIST_SUPABASE_SECRETS.md` | Como configurar secrets (passo a passo) |
| `docs/MIGRACAO_UAZAPI.md` | Guia técnico detalhado |
| `docs/COMPARACAO_ENDPOINTS.md` | Evolution vs UAZapi (antes/depois) |
| `docs/COMO_USAR_EDGE_FUNCTIONS.md` | Exemplos de código para frontend |
| `PROXIMOS_PASSOS.md` | Este arquivo (ações urgentes) |

---

## 🔄 O Que Mudou?

### **ANTES (Evolution API)**
```
Frontend → Evolution API
(credentials expostas)
```

### **DEPOIS (UAZapi)**
```
Frontend → Edge Functions → UAZapi
(credentials protegidas server-side)
```

---

## 📊 Status Atual

| Item | Status |
|------|--------|
| Banco de dados | ✅ COMPLETO |
| Edge Functions | ✅ DEPLOYADAS |
| Secrets Supabase | ⚠️ **VOCÊ PRECISA CONFIGURAR** |
| Variáveis Vercel | ⚠️ **VOCÊ PRECISA CONFIGURAR** |
| Frontend | 🔴 PENDENTE |

---

## ❓ Dúvidas?

Leia `docs/RESUMO_MIGRACAO_UAZAPI.md` para entender tudo.

---

**Data:** 2025-11-12  
**Próxima ação:** Configurar secrets no Supabase (URGENTE)

