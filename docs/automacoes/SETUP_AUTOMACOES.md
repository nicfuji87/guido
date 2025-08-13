# 🤖 Setup das Automações - Guido

Este documento explica como configurar e testar todas as automações do sistema de assinaturas.

## 📋 **Visão Geral**

O sistema de automações do Guido inclui:
- ✅ **Emails automáticos** para trial expirando/expirado
- ✅ **Lembretes de pagamento** com escalação de urgência
- ✅ **Webhooks Asaas** para atualização em tempo real
- ✅ **Edge Functions** para cron jobs automáticos
- ✅ **Centro de notificações** no frontend

---

## 🔧 **1. Configurar Variáveis de Ambiente**

### **1.1 Supabase (.env ou Dashboard)**
```bash
# Supabase URLs e Keys
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Cron Jobs Secret
CRON_SECRET_TOKEN=your_secure_cron_token_here
```

### **1.2 Asaas Integration**
```bash
# Asaas API (Sandbox para testes)
ASAAS_API_KEY=your_asaas_sandbox_api_key
ASAAS_WEBHOOK_TOKEN=your_webhook_secret_token

# Production (quando for deploy)
NODE_ENV=production
ASAAS_API_KEY=your_asaas_production_api_key
```

### **1.3 Email Service (Resend)**
```bash
# Resend for transactional emails
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=noreply@yourdomain.com
SUPPORT_EMAIL=support@yourdomain.com
```

### **1.4 Application URLs**
```bash
# Frontend URLs
APP_URL=https://yourdomain.com
DASHBOARD_URL=https://yourdomain.com/app
```

---

## 📧 **2. Configurar Resend (Email Service)**

### **2.1 Criar Conta Resend**
1. Acesse: https://resend.com
2. Crie conta gratuita (100 emails/dia)
3. Verifique seu domínio ou use domínio do Resend

### **2.2 Configurar API Key**
1. Acesse Dashboard → API Keys
2. Crie nova API Key com permissões de envio
3. Copie a key para `RESEND_API_KEY`

### **2.3 Configurar Domínio (Opcional)**
```bash
# Para production, configure seu próprio domínio
FROM_EMAIL=noreply@seudominio.com.br
SUPPORT_EMAIL=suporte@seudominio.com.br
```

---

## ⚙️ **3. Edge Functions Deployadas**

### **3.1 Asaas Webhook Handler**
- **URL**: `https://your-project.supabase.co/functions/v1/asaas-webhook`
- **Método**: POST
- **Headers**: `asaas-access-token: your_webhook_token`

**Eventos processados:**
- `PAYMENT_RECEIVED` → Ativa assinatura
- `PAYMENT_OVERDUE` → Incrementa tentativas
- `PAYMENT_REFUNDED` → Cancela assinatura

### **3.2 Check Trial Status**
- **URL**: `https://your-project.supabase.co/functions/v1/check-trial-status`
- **Método**: POST
- **Headers**: `x-cron-secret: your_cron_token`

**Funcionalidades:**
- Verifica trials expirando (2 dias, 1 dia)
- Atualiza trials expirados para EXPIRADO
- Envia emails automáticos

### **3.3 Check Payment Status**
- **URL**: `https://your-project.supabase.co/functions/v1/check-payment-status`
- **Método**: POST
- **Headers**: `x-cron-secret: your_cron_token`

**Funcionalidades:**
- Verifica pagamentos em atraso
- Envia lembretes progressivos
- Suspende contas após 3 tentativas

---

## 🕐 **4. Configurar Cron Jobs**

### **4.1 Opção 1: Supabase Cron (Recomendado)**
Configure diretamente no Supabase Dashboard:

```sql
-- Trial Status Check (diário às 9h)
SELECT cron.schedule(
  'check-trial-status',
  '0 9 * * *',
  $$
  SELECT net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/check-trial-status',
    headers := '{"Content-Type": "application/json", "x-cron-secret": "your_cron_token"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);

-- Payment Status Check (diário às 10h)
SELECT cron.schedule(
  'check-payment-status',
  '0 10 * * *',
  $$
  SELECT net.http_post(
    url := 'https://your-project.supabase.co/functions/v1/check-payment-status',
    headers := '{"Content-Type": "application/json", "x-cron-secret": "your_cron_token"}'::jsonb,
    body := '{}'::jsonb
  );
  $$
);
```

### **4.2 Opção 2: External Cron (Vercel Cron, GitHub Actions)**

**GitHub Actions Example:**
```yaml
name: Daily Automation
on:
  schedule:
    - cron: '0 9 * * *'  # 9h UTC (6h BRT)

jobs:
  check-trials:
    runs-on: ubuntu-latest
    steps:
      - name: Check Trial Status
        run: |
          curl -X POST \
            -H "Content-Type: application/json" \
            -H "x-cron-secret: ${{ secrets.CRON_SECRET }}" \
            https://your-project.supabase.co/functions/v1/check-trial-status
```

---

## 🧪 **5. Testar Automações**

### **5.1 Testar Webhook do Asaas**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "asaas-access-token: your_webhook_token" \
  -d '{
    "event": "PAYMENT_RECEIVED",
    "payment": {
      "id": "pay_test123",
      "customer": "cus_test123",
      "subscription": "sub_test123",
      "value": 97.00,
      "status": "RECEIVED",
      "externalReference": "your_assinatura_id"
    }
  }' \
  https://your-project.supabase.co/functions/v1/asaas-webhook
```

### **5.2 Testar Check Trial Status**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-cron-secret: your_cron_token" \
  https://your-project.supabase.co/functions/v1/check-trial-status
```

### **5.3 Testar Check Payment Status**
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "x-cron-secret: your_cron_token" \
  https://your-project.supabase.co/functions/v1/check-payment-status
```

### **5.4 Criar Dados de Teste**
```sql
-- Criar assinatura para testar trial expirando
INSERT INTO assinaturas (
  conta_id, 
  plano_id, 
  status, 
  data_fim_trial
) VALUES (
  'your_conta_id',
  1,
  'TRIAL',
  NOW() + INTERVAL '1 day'  -- Expira em 1 dia
);

-- Criar assinatura para testar pagamento atrasado
INSERT INTO assinaturas (
  conta_id,
  plano_id, 
  status,
  data_proxima_cobranca,
  valor_atual
) VALUES (
  'your_conta_id',
  1,
  'ATIVO',
  NOW() - INTERVAL '2 days',  -- 2 dias atrasado
  97.00
);
```

---

## 📱 **6. Frontend Integration**

### **6.1 Adicionar NotificationCenter**
```tsx
import { NotificationCenter } from '@/components/NotificationCenter';

// No header da aplicação
<NotificationCenter compact />

// Em página de dashboard
<NotificationCenter />
```

### **6.2 Hook useNotifications**
```tsx
import { useNotifications } from '@/hooks/useNotifications';

const { notifications, unreadCount, markAsRead } = useNotifications();
```

---

## 🔍 **7. Monitoramento e Logs**

### **7.1 Logs das Edge Functions**
- Acesse Supabase Dashboard → Edge Functions → Logs
- Filtre por function name para debug específico

### **7.2 Logs de Email (Resend)**
- Acesse Resend Dashboard → Logs
- Monitore delivery rates e bounces

### **7.3 Métricas Importantes**
- Taxa de entrega de emails
- Conversão de trial para paid
- Tempo médio de resposta aos lembretes
- Taxa de reativação de contas suspensas

---

## 🚨 **8. Troubleshooting**

### **8.1 Emails não estão sendo enviados**
1. Verificar `RESEND_API_KEY` configurada
2. Verificar domínio verificado no Resend
3. Checar logs das Edge Functions
4. Testar Resend API diretamente

### **8.2 Webhooks não funcionam**
1. Verificar `ASAAS_WEBHOOK_TOKEN` configurado
2. Confirmar URL do webhook no Asaas Dashboard
3. Testar webhook manualmente
4. Verificar logs da função `asaas-webhook`

### **8.3 Cron jobs não executam**
1. Verificar se pg_cron está habilitado no Supabase
2. Confirmar `CRON_SECRET_TOKEN` configurado
3. Testar Edge Functions manualmente
4. Verificar logs de execução

---

## ✅ **9. Checklist de Deploy**

### **Desenvolvimento**
- [ ] Todas as env vars configuradas
- [ ] Edge Functions deployadas
- [ ] Resend configurado e testado
- [ ] Webhooks testados com Asaas Sandbox
- [ ] Cron jobs funcionando

### **Produção**
- [ ] Domínio de email configurado
- [ ] Asaas Production API Key
- [ ] URLs de produção configuradas
- [ ] Cron jobs em produção
- [ ] Monitoramento ativo

---

## 📞 **10. Suporte**

Para problemas com as automações:
1. Verifique logs das Edge Functions
2. Teste cada componente isoladamente
3. Confirme todas as variáveis de ambiente
4. Entre em contato com suporte se necessário

**Componentes críticos:**
- ✅ Trial expiration emails (conversão)
- ✅ Payment failure notifications (churn prevention)
- ✅ Webhook processing (real-time updates)
- ✅ Account suspension automation (payment enforcement)
