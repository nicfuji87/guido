# 🔔 Sistema de Notificações de Lembretes - Guia Completo

## 🎯 Visão Geral

Sistema completo que:
1. Permite criar lembretes via API (agente IA no n8n)
2. Verifica lembretes pendentes a cada 5 minutos (cron)
3. Dispara webhook para n8n quando chegar a hora
4. n8n envia WhatsApp via Evolution API

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE CRON JOB                        │
│              Executa a cada 5 minutos                       │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│           Edge Function: check-lembretes                    │
│  1. Busca lembretes com data_lembrete <= now()             │
│  2. Status PENDENTE e notificacao_enviada = false          │
│  3. Para cada lembrete encontrado:                          │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                  HTTP POST → Webhook n8n                    │
│  Envia dados do lembrete + corretor + cliente              │
└──────────────────────┬──────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                     n8n Workflow                            │
│  1. Recebe webhook                                          │
│  2. Formata mensagem WhatsApp                               │
│  3. Envia via Evolution API                                 │
│  4. (Opcional) Confirma envio de volta ao Supabase         │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 PASSO A PASSO: Configuração Completa

---

## 📋 PARTE 1: Criar Lembretes via API

### Endpoint
```
POST https://zpzzvkjwnttrdtuvtmwv.supabase.co/functions/v1/create-lembrete
```

### Headers
```
apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwenp2a2p3bnR0cmR0dXZ0bXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDEzOTIsImV4cCI6MjA2OTIxNzM5Mn0.p1gdUMzd3dW2KavL5oqMG0yALOFW9IKktDlfLWLfW68

Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwenp2a2p3bnR0cmR0dXZ0bXd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzY0MTM5MiwiZXhwIjoyMDY5MjE3MzkyfQ._H8utVfPmTg1ZUWukLjEqEZS2H4fWYtdA-YDoJ_enDQ
```

### Body
```json
{
  "corretor_id": "edceea62-d4cb-4e1c-9784-2a4faaf55062",
  "titulo": "Ligar para cliente João",
  "descricao": "Cliente interessado em apartamento",
  "data_lembrete": "2025-11-01T14:30:00.000Z",
  "tipo_lembrete": "FOLLOW_UP",  // FOLLOW_UP, VISITA, DOCUMENTO, PROPOSTA, GERAL
  "prioridade": "ALTA",           // ALTA, MEDIA, BAIXA
  "cliente_id": "uuid-do-cliente" // opcional
}
```

---

## 📋 PARTE 2: Sistema de Notificações (Cron + Webhook)

### Passo 1: Configurar Cron no Supabase

**SQL Editor → Execute:**

```sql
-- Habilitar extensões
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS http;

-- Criar job (a cada 5 minutos)
SELECT cron.schedule(
  'check-lembretes-job',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://zpzzvkjwnttrdtuvtmwv.supabase.co/functions/v1/check-lembretes',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'apikey', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwenp2a2p3bnR0cmR0dXZ0bXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDEzOTIsImV4cCI6MjA2OTIxNzM5Mn0.p1gdUMzd3dW2KavL5oqMG0yALOFW9IKktDlfLWLfW68',
      'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwenp2a2p3bnR0cmR0dXZ0bXd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzY0MTM5MiwiZXhwIjoyMDY5MjE3MzkyfQ._H8utVfPmTg1ZUWukLjEqEZS2H4fWYtdA-YDoJ_enDQ'
    ),
    body := '{}'::jsonb
  );
  $$
);

-- Verificar
SELECT * FROM cron.job WHERE jobname = 'check-lembretes-job';
```

**⚠️ Como funciona o timing:**
- Cron executa: 15:40, 15:45, 15:50...
- Lembrete agendado: 15:47
- Na execução das 15:50, a query `WHERE data_lembrete <= NOW()` pega TODOS os lembretes entre 15:45 e 15:50
- **Atraso máximo:** 5 minutos (se quiser menos atraso, use `*/1 * * * *` = a cada 1 minuto)

---

### Passo 2: Adaptar Workflow n8n Existente

Seu webhook: `https://webhooks-i.infusecomunicacao.online/webhook/guidoAsaas`

**Adicionar Switch Node para detectar action:**

#### 1.1 Criar Workflow no n8n

**Nome:** "Enviar Lembretes WhatsApp"

**Nodes:**
```
[Webhook] → [Function: Formatar Mensagem] → [HTTP: Evolution API] → [Respond]
```

---

#### 1.2 Configurar Webhook Trigger

**Node:** Webhook

**Configurações:**
- **Path:** `/webhook/lembrete-notificacao`
- **Method:** POST
- **Authentication:** Header Auth
  - Name: `x-api-key`
  - Value: `fc830405-46c5-4690-a5f7-d0d15d2add04`
- **Response Mode:** "Using Respond to Webhook Node"

**URL gerada:** 
```
https://seu-n8n.com/webhook/lembrete-notificacao
```

**⚠️ Guarde essa URL!** Você vai precisar configurar no Supabase.

---

#### 1.3 Formatar Mensagem (Function Node)

```javascript
const lembrete = $input.first().json;

// Formatar data para exibição
const data = new Date(lembrete.data_lembrete);
const dataFormatada = data.toLocaleString('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
});

// Ícones por tipo
const icones = {
  'FOLLOW_UP': '📞',
  'VISITA': '🏠',
  'DOCUMENTO': '📄',
  'PROPOSTA': '💰',
  'GERAL': '📋'
};

const icone = icones[lembrete.tipo_lembrete] || '📋';

// Montar mensagem
let mensagem = `🔔 *LEMBRETE GUIDO*\n\n`;
mensagem += `${icone} *${lembrete.titulo}*\n\n`;
mensagem += `📝 ${lembrete.descricao}\n\n`;
mensagem += `📅 Agendado para: ${dataFormatada}\n`;
mensagem += `⭐ Prioridade: ${lembrete.prioridade}\n`;

if (lembrete.cliente) {
  mensagem += `\n👤 Cliente: ${lembrete.cliente.nome}`;
  if (lembrete.cliente.telefone) {
    mensagem += `\n📱 Telefone: ${lembrete.cliente.telefone}`;
  }
}

mensagem += `\n\n_Acesse o Guido para marcar como concluído._`;

return {
  corretor_id: lembrete.corretor.id,
  evolution_instance: lembrete.corretor.evolution_instance,
  evolution_apikey: lembrete.corretor.evolution_apikey,
  mensagem: mensagem,
  lembrete_id: lembrete.lembrete_id
};
```

---

#### 1.4 Enviar WhatsApp (HTTP Request Node)

**Node:** HTTP Request

**Method:** POST

**URL:** 
```
https://chat-guido.infusecomunicacao.online/message/sendText/{{ $json.evolution_instance }}
```

**Authentication:** Generic Credential Type
- **Generic Auth Type:** Header Auth
- **Name:** `apikey`
- **Value:** `={{ $json.evolution_apikey }}`

**Headers:**
```json
{
  "Content-Type": "application/json"
}
```

**Body (JSON):**
```json
{
  "number": "SEU_NUMERO_WHATSAPP_AQUI",
  "text": "={{ $json.mensagem }}"
}
```

**⚠️ Nota:** O número do WhatsApp do corretor precisa estar configurado. Você pode buscar da tabela `corretores` ou configurar um número fixo de notificações.

---

#### 1.5 Responder (Respond to Webhook Node)

```javascript
return {
  success: true,
  message: 'Lembrete enviado com sucesso',
  lembrete_id: $input.first().json.lembrete_id
};
```

---

### Passo 2: Configurar Secrets no Supabase

Acesse: **Supabase Dashboard → Project Settings → Edge Functions → Secrets**

Adicione as seguintes variáveis:

```bash
N8N_LEMBRETE_WEBHOOK_URL=https://seu-n8n.com/webhook/lembrete-notificacao
N8N_LEMBRETE_WEBHOOK_API_KEY=fc830405-46c5-4690-a5f7-d0d15d2add04
```

**🔧 Como adicionar:**
```sql
-- Via SQL Editor no Supabase (não recomendado para secrets)
-- OU via CLI do Supabase:

supabase secrets set N8N_LEMBRETE_WEBHOOK_URL=https://seu-n8n.com/webhook/lembrete-notificacao
supabase secrets set N8N_LEMBRETE_WEBHOOK_API_KEY=fc830405-46c5-4690-a5f7-d0d15d2add04
```

**🌐 Ou via Dashboard:**
1. Vá em Project Settings → Edge Functions
2. Clique em "Secrets"
3. Adicione cada variável

---

### Passo 3: Configurar Cron Job no Supabase

#### Opção A: Via pg_cron (Recomendado)

Execute no **SQL Editor** do Supabase:

```sql
-- Habilitar extensão pg_cron (se não estiver habilitada)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Criar job que executa a cada 5 minutos
SELECT cron.schedule(
  'check-lembretes-job',              -- Nome do job
  '*/5 * * * *',                       -- A cada 5 minutos
  $$
  SELECT
    net.http_post(
      url := 'https://zpzzvkjwnttrdtuvtmwv.supabase.co/functions/v1/check-lembretes',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwenp2a2p3bnR0cmR0dXZ0bXd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzY0MTM5MiwiZXhwIjoyMDY5MjE3MzkyfQ._H8utVfPmTg1ZUWukLjEqEZS2H4fWYtdA-YDoJ_enDQ'
      ),
      body := '{}'::jsonb
    ) as request_id;
  $$
);

-- Verificar se o job foi criado
SELECT * FROM cron.job WHERE jobname = 'check-lembretes-job';
```

**⏰ Expressão Cron:**
- `*/5 * * * *` = A cada 5 minutos
- `*/10 * * * *` = A cada 10 minutos
- `0 * * * *` = A cada hora
- `0 9-18 * * *` = Todo dia, das 9h às 18h

---

#### Opção B: Cron Externo (Alternativa)

Se preferir, use um serviço externo como:
- **Vercel Cron**
- **GitHub Actions**
- **Render Cron Jobs**
- **cron-job.org**

Configure para chamar:
```
POST https://zpzzvkjwnttrdtuvtmwv.supabase.co/functions/v1/check-lembretes
```

---

### Passo 4: Testar o Sistema

#### 4.1 Teste Manual da Edge Function

```bash
curl -X POST \
  https://zpzzvkjwnttrdtuvtmwv.supabase.co/functions/v1/check-lembretes \
  -H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwenp2a2p3bnR0cmR0dXZ0bXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDEzOTIsImV4cCI6MjA2OTIxNzM5Mn0.p1gdUMzd3dW2KavL5oqMG0yALOFW9IKktDlfLWLfW68' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwenp2a2p3bnR0cmR0dXZ0bXd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzY0MTM5MiwiZXhwIjoyMDY5MjE3MzkyfQ._H8utVfPmTg1ZUWukLjEqEZS2H4fWYtdA-YDoJ_enDQ'
```

**Resposta esperada:**
```json
{
  "message": "Processamento concluído",
  "total": 1,
  "sucessos": 1,
  "falhas": 0,
  "resultados": [
    {
      "lembrete_id": "5a349508-fd91-41c8-a7e7-ac3cd14bb12e",
      "titulo": "Teste API",
      "status": "success"
    }
  ]
}
```

---

#### 4.2 Criar Lembrete de Teste

```bash
curl -X POST \
  https://zpzzvkjwnttrdtuvtmwv.supabase.co/functions/v1/create-lembrete \
  -H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwenp2a2p3bnR0cmR0dXZ0bXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDEzOTIsImV4cCI6MjA2OTIxNzM5Mn0.p1gdUMzd3dW2KavL5oqMG0yALOFW9IKktDlfLWLfW68' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwenp2a2p3bnR0cmR0dXZ0bXd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzY0MTM5MiwiZXhwIjoyMDY5MjE3MzkyfQ._H8utVfPmTg1ZUWukLjEqEZS2H4fWYtdA-YDoJ_enDQ' \
  -H 'Content-Type: application/json' \
  -d '{
    "corretor_id": "edceea62-d4cb-4e1c-9784-2a4faaf55062",
    "titulo": "Teste de Notificação",
    "descricao": "Este lembrete deve disparar em 2 minutos",
    "data_lembrete": "'$(date -u -d '+2 minutes' +%Y-%m-%dT%H:%M:%S.000Z)'"
  }'
```

**Aguarde 5-10 minutos** e verifique:
1. Logs da Edge Function `check-lembretes`
2. Webhook do n8n recebido
3. WhatsApp enviado
4. Campo `notificacao_enviada` atualizado no banco

---

## 📊 Payload do Webhook n8n

O webhook recebe este payload:

```json
{
  "lembrete_id": "5a349508-fd91-41c8-a7e7-ac3cd14bb12e",
  "titulo": "Ligar para cliente João",
  "descricao": "Cliente interessado em apartamento",
  "data_lembrete": "2025-11-01T15:00:00+00:00",
  "tipo_lembrete": "FOLLOW_UP",
  "prioridade": "ALTA",
  "corretor": {
    "id": "edceea62-d4cb-4e1c-9784-2a4faaf55062",
    "nome": "Nicolas Fujimoto",
    "email": "fujimoto.nicolas@gmail.com",
    "evolution_instance": "nicolas",
    "evolution_apikey": "9b6cd7db-bf58-4b18-8226-f202d9baaf67"
  },
  "cliente": {
    "id": "abc123...",
    "nome": "João Silva",
    "telefone": "5511999999999"
  }
}
```

---

## 🔍 Monitoramento

### Verificar Cron Job Status

```sql
-- Ver jobs ativos
SELECT * FROM cron.job;

-- Ver últimas execuções
SELECT * FROM cron.job_run_details 
WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'check-lembretes-job')
ORDER BY start_time DESC 
LIMIT 10;
```

### Ver Logs da Edge Function

**Supabase Dashboard → Edge Functions → check-lembretes → Logs**

Procure por:
- ✅ `Verificando lembretes pendentes...`
- ✅ `Encontrados X lembretes para processar`
- ✅ `Webhook enviado com sucesso`
- ❌ Erros diversos

### Consultar Lembretes Processados

```sql
SELECT 
  l.id,
  l.titulo,
  l.data_lembrete,
  l.notificacao_enviada,
  l.data_envio_notificacao,
  l.tentativas_envio,
  c.nome as corretor
FROM lembretes l
JOIN corretores c ON l.corretor_id = c.id
WHERE l.data_lembrete < NOW()
ORDER BY l.data_lembrete DESC
LIMIT 20;
```

---

## ⚙️ Configurações Avançadas

### Retry Logic

A Edge Function já implementa retry automático:
- **Tentativas:** Incrementa campo `tentativas_envio`
- **Próxima tentativa:** 15 minutos depois
- **Máximo:** Sem limite (você pode adicionar)

Para limitar tentativas, adicione na query SQL:

```typescript
.lte('data_lembrete', agora)
.lt('tentativas_envio', 3) // Máximo 3 tentativas
```

### Horário de Funcionamento

Modificar cron para enviar apenas em horário comercial:

```sql
-- Apenas das 8h às 20h, segunda a sexta
SELECT cron.schedule(
  'check-lembretes-job',
  '*/5 8-20 * * 1-5',  -- A cada 5 min, 8h-20h, seg-sex
  $$ ... $$
);
```

### Notificação de Falhas

Adicionar no n8n um node para notificar erros:

```
[Webhook] → [Try/Catch] 
              ↓ (erro)
         [HTTP: Notificar Admin]
```

---

## 🚨 Troubleshooting

### Webhook não está sendo chamado

1. **Verificar secrets:**
   ```sql
   SELECT * FROM vault.decrypted_secrets WHERE name = 'N8N_LEMBRETE_WEBHOOK_URL';
   ```

2. **Ver logs da Edge Function**

3. **Testar webhook manualmente:**
   ```bash
   curl -X POST https://seu-n8n.com/webhook/lembrete-notificacao \
     -H 'x-api-key: fc830405-46c5-4690-a5f7-d0d15d2add04' \
     -H 'Content-Type: application/json' \
     -d '{"lembrete_id": "test", "titulo": "Teste"}'
   ```

### WhatsApp não está sendo enviado

1. **Verificar Evolution API** está online
2. **Conferir apikey** do corretor
3. **Verificar instância** do corretor está conectada
4. **Ver logs do n8n**

### Lembretes não são marcados como enviados

1. **Verificar RLS** na tabela lembretes
2. **Confirmar service_role** tem acesso
3. **Ver logs** da Edge Function

---

## 📝 Checklist de Implementação

- [ ] Edge Function `check-lembretes` deployada
- [ ] Webhook criado no n8n
- [ ] Workflow do n8n configurado
- [ ] Secrets configurados no Supabase
- [ ] Cron job configurado (pg_cron ou externo)
- [ ] Teste manual funcionando
- [ ] Teste end-to-end funcionando
- [ ] Monitoramento configurado

---

## 🎉 Conclusão

Sistema completo de notificações implementado! Agora lembretes serão automaticamente enviados via WhatsApp quando chegarem na hora configurada.

**Próximos passos sugeridos:**
1. Implementar confirmação de leitura
2. Adicionar botões de ação (concluir, adiar)
3. Relatório de lembretes enviados
4. Dashboard de monitoramento

