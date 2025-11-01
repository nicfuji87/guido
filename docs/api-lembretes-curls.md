# 📋 API Completa de Lembretes - CURLs

## 🔑 Credenciais

```bash
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwenp2a2p3bnR0cmR0dXZ0bXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDEzOTIsImV4cCI6MjA2OTIxNzM5Mn0.p1gdUMzd3dW2KavL5oqMG0yALOFW9IKktDlfLWLfW68"

SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwenp2a2p3bnR0cmR0dXZ0bXd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzY0MTM5MiwiZXhwIjoyMDY5MjE3MzkyfQ._H8utVfPmTg1ZUWukLjEqEZS2H4fWYtdA-YDoJ_enDQ"

CORRETOR_ID="edceea62-d4cb-4e1c-9784-2a4faaf55062"
```

---

## 1️⃣ CRIAR Lembrete

```bash
curl -X POST \
  https://zpzzvkjwnttrdtuvtmwv.supabase.co/functions/v1/create-lembrete \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwenp2a2p3bnR0cmR0dXZ0bXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDEzOTIsImV4cCI6MjA2OTIxNzM5Mn0.p1gdUMzd3dW2KavL5oqMG0yALOFW9IKktDlfLWLfW68" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwenp2a2p3bnR0cmR0dXZ0bXd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzY0MTM5MiwiZXhwIjoyMDY5MjE3MzkyfQ._H8utVfPmTg1ZUWukLjEqEZS2H4fWYtdA-YDoJ_enDQ" \
  -H "Content-Type: application/json" \
  -d '{
    "corretor_id": "edceea62-d4cb-4e1c-9784-2a4faaf55062",
    "titulo": "Ligar para cliente João",
    "descricao": "Cliente interessado em apartamento 3 quartos",
    "data_lembrete": "2025-11-01T14:30:00.000Z",
    "tipo_lembrete": "FOLLOW_UP",
    "prioridade": "ALTA"
  }'
```

---

## 2️⃣ LISTAR Lembretes (com paginação e filtros)

### Listar todos do corretor

```bash
curl -X GET \
  "https://zpzzvkjwnttrdtuvtmwv.supabase.co/functions/v1/list-lembretes?corretor_id=edceea62-d4cb-4e1c-9784-2a4faaf55062" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwenp2a2p3bnR0cmR0dXZ0bXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDEzOTIsImV4cCI6MjA2OTIxNzM5Mn0.p1gdUMzd3dW2KavL5oqMG0yALOFW9IKktDlfLWLfW68" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwenp2a2p3bnR0cmR0dXZ0bXd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzY0MTM5MiwiZXhwIjoyMDY5MjE3MzkyfQ._H8utVfPmTg1ZUWukLjEqEZS2H4fWYtdA-YDoJ_enDQ"
```

### Filtrar por status PENDENTE

```bash
curl -X GET \
  "https://zpzzvkjwnttrdtuvtmwv.supabase.co/functions/v1/list-lembretes?corretor_id=edceea62-d4cb-4e1c-9784-2a4faaf55062&status=PENDENTE" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwenp2a2p3bnR0cmR0dXZ0bXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDEzOTIsImV4cCI6MjA2OTIxNzM5Mn0.p1gdUMzd3dW2KavL5oqMG0yALOFW9IKktDlfLWLfW68" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwenp2a2p3bnR0cmR0dXZ0bXd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzY0MTM5MiwiZXhwIjoyMDY5MjE3MzkyfQ._H8utVfPmTg1ZUWukLjEqEZS2H4fWYtdA-YDoJ_enDQ"
```

### Filtrar por prioridade ALTA

```bash
curl -X GET \
  "https://zpzzvkjwnttrdtuvtmwv.supabase.co/functions/v1/list-lembretes?corretor_id=edceea62-d4cb-4e1c-9784-2a4faaf55062&prioridade=ALTA" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwenp2a2p3bnR0cmR0dXZ0bXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDEzOTIsImV4cCI6MjA2OTIxNzM5Mn0.p1gdUMzd3dW2KavL5oqMG0yALOFW9IKktDlfLWLfW68" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwenp2a2p3bnR0cmR0dXZ0bXd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzY0MTM5MiwiZXhwIjoyMDY5MjE3MzkyfQ._H8utVfPmTg1ZUWukLjEqEZS2H4fWYtdA-YDoJ_enDQ"
```

### Com paginação (limite e offset)

```bash
curl -X GET \
  "https://zpzzvkjwnttrdtuvtmwv.supabase.co/functions/v1/list-lembretes?corretor_id=edceea62-d4cb-4e1c-9784-2a4faaf55062&limit=10&offset=0" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwenp2a2p3bnR0cmR0dXZ0bXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDEzOTIsImV4cCI6MjA2OTIxNzM5Mn0.p1gdUMzd3dW2KavL5oqMG0yALOFW9IKktDlfLWLfW68" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwenp2a2p3bnR0cmR0dXZ0bXd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzY0MTM5MiwiZXhwIjoyMDY5MjE3MzkyfQ._H8utVfPmTg1ZUWukLjEqEZS2H4fWYtdA-YDoJ_enDQ"
```

### Ordenação personalizada

```bash
# Ordenar por prioridade, descendente
curl -X GET \
  "https://zpzzvkjwnttrdtuvtmwv.supabase.co/functions/v1/list-lembretes?corretor_id=edceea62-d4cb-4e1c-9784-2a4faaf55062&order=prioridade&direction=desc" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwenp2a2p3bnR0cmR0dXZ0bXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDEzOTIsImV4cCI6MjA2OTIxNzM5Mn0.p1gdUMzd3dW2KavL5oqMG0yALOFW9IKktDlfLWLfW68" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwenp2a2p3bnR0cmR0dXZ0bXd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzY0MTM5MiwiZXhwIjoyMDY5MjE3MzkyfQ._H8utVfPmTg1ZUWukLjEqEZS2H4fWYtdA-YDoJ_enDQ"
```

**Parâmetros disponíveis:**
- `corretor_id` (obrigatório)
- `status`: PENDENTE, CONCLUIDO
- `prioridade`: ALTA, MEDIA, BAIXA
- `tipo`: FOLLOW_UP, VISITA, DOCUMENTO, PROPOSTA, GERAL
- `limit`: quantidade (padrão: 50)
- `offset`: pular registros (padrão: 0)
- `order`: data_lembrete, created_at, prioridade (padrão: data_lembrete)
- `direction`: asc, desc (padrão: asc)

---

## 3️⃣ ATUALIZAR Lembrete

### Atualizar título e descrição

```bash
curl -X PUT \
  https://zpzzvkjwnttrdtuvtmwv.supabase.co/functions/v1/update-lembrete \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwenp2a2p3bnR0cmR0dXZ0bXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDEzOTIsImV4cCI6MjA2OTIxNzM5Mn0.p1gdUMzd3dW2KavL5oqMG0yALOFW9IKktDlfLWLfW68" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwenp2a2p3bnR0cmR0dXZ0bXd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzY0MTM5MiwiZXhwIjoyMDY5MjE3MzkyfQ._H8utVfPmTg1ZUWukLjEqEZS2H4fWYtdA-YDoJ_enDQ" \
  -H "Content-Type: application/json" \
  -d '{
    "lembrete_id": "5a349508-fd91-41c8-a7e7-ac3cd14bb12e",
    "titulo": "Título atualizado",
    "descricao": "Nova descrição do lembrete"
  }'
```

### Marcar como concluído

```bash
curl -X PUT \
  https://zpzzvkjwnttrdtuvtmwv.supabase.co/functions/v1/update-lembrete \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwenp2a2p3bnR0cmR0dXZ0bXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDEzOTIsImV4cCI6MjA2OTIxNzM5Mn0.p1gdUMzd3dW2KavL5oqMG0yALOFW9IKktDlfLWLfW68" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwenp2a2p3bnR0cmR0dXZ0bXd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzY0MTM5MiwiZXhwIjoyMDY5MjE3MzkyfQ._H8utVfPmTg1ZUWukLjEqEZS2H4fWYtdA-YDoJ_enDQ" \
  -H "Content-Type: application/json" \
  -d '{
    "lembrete_id": "5a349508-fd91-41c8-a7e7-ac3cd14bb12e",
    "status": "CONCLUIDO"
  }'
```

### Adiar lembrete (mudar data)

```bash
curl -X PUT \
  https://zpzzvkjwnttrdtuvtmwv.supabase.co/functions/v1/update-lembrete \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwenp2a2p3bnR0cmR0dXZ0bXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDEzOTIsImV4cCI6MjA2OTIxNzM5Mn0.p1gdUMzd3dW2KavL5oqMG0yALOFW9IKktDlfLWLfW68" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwenp2a2p3bnR0cmR0dXZ0bXd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzY0MTM5MiwiZXhwIjoyMDY5MjE3MzkyfQ._H8utVfPmTg1ZUWukLjEqEZS2H4fWYtdA-YDoJ_enDQ" \
  -H "Content-Type: application/json" \
  -d '{
    "lembrete_id": "5a349508-fd91-41c8-a7e7-ac3cd14bb12e",
    "data_lembrete": "2025-11-02T14:30:00.000Z"
  }'
```

### Atualizar prioridade

```bash
curl -X PUT \
  https://zpzzvkjwnttrdtuvtmwv.supabase.co/functions/v1/update-lembrete \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwenp2a2p3bnR0cmR0dXZ0bXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDEzOTIsImV4cCI6MjA2OTIxNzM5Mn0.p1gdUMzd3dW2KavL5oqMG0yALOFW9IKktDlfLWLfW68" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwenp2a2p3bnR0cmR0dXZ0bXd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzY0MTM5MiwiZXhwIjoyMDY5MjE3MzkyfQ._H8utVfPmTg1ZUWukLjEqEZS2H4fWYtdA-YDoJ_enDQ" \
  -H "Content-Type: application/json" \
  -d '{
    "lembrete_id": "5a349508-fd91-41c8-a7e7-ac3cd14bb12e",
    "prioridade": "BAIXA"
  }'
```

**Campos atualizáveis:**
- `titulo`
- `descricao`
- `data_lembrete` (ISO 8601)
- `tipo_lembrete` (FOLLOW_UP, VISITA, DOCUMENTO, PROPOSTA, GERAL)
- `prioridade` (ALTA, MEDIA, BAIXA)
- `status` (PENDENTE, CONCLUIDO)

---

## 4️⃣ DELETAR Lembrete

```bash
curl -X DELETE \
  https://zpzzvkjwnttrdtuvtmwv.supabase.co/functions/v1/delete-lembrete \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwenp2a2p3bnR0cmR0dXZ0bXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDEzOTIsImV4cCI6MjA2OTIxNzM5Mn0.p1gdUMzd3dW2KavL5oqMG0yALOFW9IKktDlfLWLfW68" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwenp2a2p3bnR0cmR0dXZ0bXd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzY0MTM5MiwiZXhwIjoyMDY5MjE3MzkyfQ._H8utVfPmTg1ZUWukLjEqEZS2H4fWYtdA-YDoJ_enDQ" \
  -H "Content-Type: application/json" \
  -d '{
    "lembrete_id": "5a349508-fd91-41c8-a7e7-ac3cd14bb12e"
  }'
```

---

## 5️⃣ TESTAR Webhook Manualmente (Disparar Verificação)

```bash
curl -X POST \
  https://zpzzvkjwnttrdtuvtmwv.supabase.co/functions/v1/check-lembretes \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwenp2a2p3bnR0cmR0dXZ0bXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2NDEzOTIsImV4cCI6MjA2OTIxNzM5Mn0.p1gdUMzd3dW2KavL5oqMG0yALOFW9IKktDlfLWLfW68" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwenp2a2p3bnR0cmR0dXZ0bXd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzY0MTM5MiwiZXhwIjoyMDY5MjE3MzkyfQ._H8utVfPmTg1ZUWukLjEqEZS2H4fWYtdA-YDoJ_enDQ"
```

**Resposta esperada:**
```json
{
  "message": "Processamento concluído",
  "total": 2,
  "sucessos": 2,
  "falhas": 0,
  "resultados": [
    {
      "lembrete_id": "...",
      "titulo": "...",
      "status": "success"
    }
  ]
}
```

---

## 🧪 Fluxo de Teste Completo

```bash
# 1. Criar lembrete
LEMBRETE_ID=$(curl -s -X POST \
  https://zpzzvkjwnttrdtuvtmwv.supabase.co/functions/v1/create-lembrete \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "corretor_id": "edceea62-d4cb-4e1c-9784-2a4faaf55062",
    "titulo": "Teste completo",
    "descricao": "Lembrete de teste",
    "data_lembrete": "2025-11-01T10:00:00.000Z",
    "tipo_lembrete": "GERAL",
    "prioridade": "MEDIA"
  }' | jq -r '.lembrete.id')

echo "Lembrete criado: $LEMBRETE_ID"

# 2. Listar lembretes
curl -X GET \
  "https://zpzzvkjwnttrdtuvtmwv.supabase.co/functions/v1/list-lembretes?corretor_id=edceea62-d4cb-4e1c-9784-2a4faaf55062&status=PENDENTE"

# 3. Atualizar lembrete
curl -X PUT \
  https://zpzzvkjwnttrdtuvtmwv.supabase.co/functions/v1/update-lembrete \
  -H "Content-Type: application/json" \
  -d "{\"lembrete_id\": \"$LEMBRETE_ID\", \"prioridade\": \"ALTA\"}"

# 4. Marcar como concluído
curl -X PUT \
  https://zpzzvkjwnttrdtuvtmwv.supabase.co/functions/v1/update-lembrete \
  -H "Content-Type: application/json" \
  -d "{\"lembrete_id\": \"$LEMBRETE_ID\", \"status\": \"CONCLUIDO\"}"

# 5. Deletar lembrete
curl -X DELETE \
  https://zpzzvkjwnttrdtuvtmwv.supabase.co/functions/v1/delete-lembrete \
  -H "Content-Type: application/json" \
  -d "{\"lembrete_id\": \"$LEMBRETE_ID\"}"
```

---

## 📊 Resumo de URLs

```
CREATE:  POST   /functions/v1/create-lembrete
LIST:    GET    /functions/v1/list-lembretes?corretor_id={id}&...
UPDATE:  PUT    /functions/v1/update-lembrete
DELETE:  DELETE /functions/v1/delete-lembrete
CHECK:   POST   /functions/v1/check-lembretes (cron/manual)
```

**Base URL:** `https://zpzzvkjwnttrdtuvtmwv.supabase.co`

