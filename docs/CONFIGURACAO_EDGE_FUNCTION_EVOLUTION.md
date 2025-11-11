# Configuração da Edge Function - Create Evolution Instance

## ✅ Edge Function Criada

A Edge Function `create-evolution-instance` foi criada com sucesso no Supabase.

---

## 🔐 Configurar Secrets (OBRIGATÓRIO)

A Edge Function precisa de 2 secrets configurados no Supabase:

### Via Supabase Dashboard

1. Acesse: **Supabase Dashboard → Project Settings → Edge Functions**
2. Clique em **"Secrets"** ou **"Environment Variables"**
3. Adicione as seguintes variáveis:

```bash
EVOLUTION_API_URL=https://chat-guido.infusecomunicacao.online/
EVOLUTION_API_GLOBAL_KEY=9b6cd7db-bf58-4b18-8226-f202d9baaf67
```

### Via Supabase CLI (alternativa)

```bash
supabase secrets set EVOLUTION_API_URL=https://chat-guido.infusecomunicacao.online/
supabase secrets set EVOLUTION_API_GLOBAL_KEY=9b6cd7db-bf58-4b18-8226-f202d9baaf67
```

---

## 🔄 Fluxo Atualizado

### ANTES (Frontend → Evolution API)
```
Browser 
  → createEvolutionInstance()
    → fetch() Evolution API ❌ (CORS/Headers/Problemas)
```

### AGORA (Frontend → Edge Function → Evolution API)
```
Browser
  → supabase.functions.invoke('create-evolution-instance')
    → Edge Function (Supabase Server)
      → fetch() Evolution API ✅ (Servidor → Servidor)
```

---

## 📋 Payload da Edge Function

### Request (do frontend)
```typescript
{
  nome: "Nicolas Fujimoto",
  whatsapp: "(11) 99999-9999"
}
```

### Response (sucesso)
```typescript
{
  success: true,
  data: {
    instanceName: "guido-nicolas-123456",
    apiKey: "token-1234567890",
    evolutionUrl: "https://chat-guido.infusecomunicacao.online/"
  }
}
```

### Response (erro)
```typescript
{
  success: false,
  error: "Mensagem de erro detalhada"
}
```

---

## 🧪 Como Testar

### 1. Via Dashboard Supabase

1. Acesse: **Edge Functions → create-evolution-instance**
2. Clique em **"Invoke Function"**
3. Body:
```json
{
  "nome": "Teste Usuario",
  "whatsapp": "(11) 99999-9999"
}
```
4. Clique em **"Invoke"**
5. Verifique a resposta

### 2. Via curl

```bash
curl -X POST \
  'https://zpzzvkjwnttrdtuvtmwv.supabase.co/functions/v1/create-evolution-instance' \
  -H 'Content-Type: application/json' \
  -H 'apikey: YOUR_SUPABASE_ANON_KEY' \
  -H 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY' \
  -d '{
    "nome": "Teste Usuario",
    "whatsapp": "(11) 99999-9999"
  }'
```

### 3. Via Frontend (integrado)

Simplesmente faça um **novo cadastro** na aplicação. A Edge Function será chamada automaticamente.

---

## 📊 Logs da Edge Function

Para ver os logs:

1. **Supabase Dashboard → Edge Functions**
2. Clique em **"create-evolution-instance"**
3. Aba **"Logs"**

Logs esperados (sucesso):
```
[Edge Function] Criando instância: guido-nicolas-123456
[Edge Function] Payload: { ... }
[Edge Function] Calling Evolution API: https://chat-guido.infusecomunicacao.online/instance/create
[Edge Function] Evolution API response status: 200
[Edge Function] Instância criada com sucesso: guido-nicolas-123456
```

---

## ⚠️ Troubleshooting

### Erro: "Configuração da Evolution API não encontrada"

**Causa:** Secrets não configurados  
**Solução:** Configurar `EVOLUTION_API_URL` e `EVOLUTION_API_GLOBAL_KEY` nos secrets

### Erro: "Evolution API error: 400"

**Causa:** Payload inválido ou servidor Evolution com problema  
**Solução:** 
1. Verificar logs da Edge Function
2. Testar curl manual no servidor Evolution
3. Verificar se servidor Evolution está OK

### Erro: "Network error"

**Causa:** Edge Function não consegue acessar Evolution API  
**Solução:** Verificar firewall/rede do servidor Evolution

---

## 🎯 Benefícios da Nova Arquitetura

✅ **Segurança** - API keys não expostas no frontend  
✅ **CORS** - Sem problemas de CORS (servidor → servidor)  
✅ **Headers** - Headers consistentes (igual ao curl)  
✅ **Logs** - Centralizados no Supabase  
✅ **Debugging** - Fácil debugar no dashboard do Supabase  
✅ **Rate Limiting** - Controle no servidor  
✅ **Retry Logic** - Fácil adicionar retry automático  

---

## 📝 Próximos Passos

1. ✅ Edge Function criada
2. ✅ Frontend atualizado para chamar Edge Function
3. ⏳ **VOCÊ: Configurar secrets no Supabase Dashboard**
4. ⏳ Fazer novo cadastro e testar
5. ⏳ Verificar logs no dashboard
6. ⏳ Confirmar instância criada com sucesso

---

**Data:** 11/11/2025  
**Status:** Edge Function deployada - Aguardando configuração de secrets

