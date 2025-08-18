# 🔗 Asaas Callback Configuration

## 🎯 **Configuração do Callback URL no Asaas**

### **📋 O que você deve colocar no n8n:**

No seu workflow n8n, quando criar a assinatura no Asaas, use esta estrutura:

```javascript
{
  "billingType": "CREDIT_CARD",
  "cycle": "MONTHLY", 
  "customer": "{{ $('Cria Customer Asaas').item.json.id }}",
  "value": 149.9,
  "nextDueDate": "{{ (new Date($today)).toISOString().slice(0,10) }}",
  "description": "Serviço de Assinatura Guido\nPlano: Individual (Acesso para 1 usuário).\nDescrição: Licença de uso mensal, não exclusiva, para acesso às ferramentas de inteligência artificial para gestão de comunicação e vendas no setor imobiliário.",
  "externalReference": "{{ $('Webhook').item.json.body.user.id }}",
  "callback": {
    "successUrl": "{{ $('Webhook').item.json.body.callback.successUrl }}"
  }
}
```

### **🔧 Como o Sistema Gera a URL:**

#### **URL Automática Gerada:**
```
https://seudominio.com/payment-success?user=USER_ID&source=asaas&redirect=dashboard
```

#### **Componentes da URL:**
- **`/payment-success`** - Página de sucesso criada
- **`user=USER_ID`** - ID do usuário para identificação
- **`source=asaas`** - Identifica que veio do Asaas
- **`redirect=dashboard`** - Para onde redirecionar depois

### **🌐 URLs de Exemplo:**

#### **Ambiente Local:**
```
http://localhost:3000/payment-success?user=fa7aa896-7fe2-488c-97a0-24c60f8cea70&source=asaas&redirect=dashboard
```

#### **Ambiente Produção:**
```
https://app.guido.net.br/payment-success?user=fa7aa896-7fe2-488c-97a0-24c60f8cea70&source=asaas&redirect=dashboard
```

## 🔧 **Configuração de Ambiente:**

### **Variável de Ambiente Necessária:**
```bash
# .env
VITE_APP_URL=https://app.guido.net.br
# ou para desenvolvimento:
VITE_APP_URL=http://localhost:3000
```

### **Se não configurada:**
- Sistema usa `window.location.origin` como fallback
- Local: `http://localhost:3000`
- Produção: URL atual da aplicação

## 📊 **Payload Completo Enviado para n8n:**

```json
{
  "action": "provision_customer",
  "data": {
    "nome": "Nicolas Fujimoto",
    "email": "fujimoto.nicolas@gmail.com",
    "cpfCnpj": "00484887122",
    "telefone": "(61) 98144-6666",
    "userId": "fa7aa896-7fe2-488c-97a0-24c60f8cea70",
    "assinaturaId": "9094b774-8bae-422b-b5b3-27b6555f799e",
    "conta": {
      "id": "0ccda3b9-3dac-4dad-b21b-dbe81d72fb42",
      "nome_conta": "Fujimoto Imóveis",
      "tipo_conta": "IMOBILIARIA",
      "documento": "12345678000190",
      "max_corretores": 5
    },
    "assinatura": {
      "id": "9094b774-8bae-422b-b5b3-27b6555f799e",
      "plano_id": 2,
      "status": "PAGAMENTO_PENDENTE",
      "data_fim_trial": "2025-08-15T21:57:14.325737Z",
      "data_proxima_cobranca": "2025-08-15",
      "valor_atual": 67.00,
      "ciclo_cobranca": "MONTHLY",
      "plano_nome": "Imobiliária Básica"
    },
    "timestamp": "2025-01-17T10:00:00.000Z"
  },
  "callback": {
    "successUrl": "https://app.guido.net.br/payment-success?user=fa7aa896-7fe2-488c-97a0-24c60f8cea70&source=asaas&redirect=dashboard"
  }
}
```

## 🎯 **Configuração no n8n:**

### **1. Use a URL do webhook:**
```javascript
// No campo callback.successUrl do Asaas:
"{{ $('Webhook').item.json.body.callback.successUrl }}"
```

### **2. Ou configure manualmente:**
```javascript
// Se preferir configurar manualmente:
"https://app.guido.net.br/payment-success?user={{ $('Webhook').item.json.body.data.userId }}&source=asaas&redirect=dashboard"
```

## 🎨 **Experiência do Usuário:**

### **Fluxo Completo:**
1. **Usuário** clica "Regularizar Pagamento"
2. **Sistema** envia webhook para n8n
3. **n8n** cria assinatura no Asaas com callback
4. **Asaas** retorna URL da fatura
5. **Sistema** abre fatura em nova guaba
6. **Usuário** paga no Asaas
7. **Asaas** redireciona para `/payment-success`
8. **Sistema** mostra página de sucesso
9. **Usuário** clica "Acessar Guido" → Dashboard

### **Página de Sucesso:**
```
┌─────────────────────────────────────────────────────┐
│                      ✅                            │
│                                                     │
│            🎉 Pagamento Realizado!                 │
│                                                     │
│     Sua assinatura foi ativada com sucesso.        │
│     Agora você tem acesso completo ao Guido!       │
│                                                     │
│     [✅ Pagamento Confirmado] [🏦 Asaas]          │
│                                                     │
│     Usuário: fa7aa896-7fe2...                      │
│     Gateway: ASAAS                                  │
│                                                     │
│            [→ Acessar Guido]                       │
│            [🏠 Voltar ao Início]                   │
│                                                     │
│     🚀 Bem-vindo ao Guido! Sua jornada de         │
│        vendas inteligentes começa agora.           │
└─────────────────────────────────────────────────────┘
```

## 📝 **URLs de Callback Recomendadas:**

### **Para Dashboard (Recomendado):**
```
https://app.guido.net.br/payment-success?user=USER_ID&source=asaas&redirect=dashboard
```

### **Para Configurações:**
```
https://app.guido.net.br/payment-success?user=USER_ID&source=asaas&redirect=settings
```

### **Para Home:**
```
https://app.guido.net.br/payment-success?user=USER_ID&source=asaas&redirect=home
```

## 🚀 **Resposta à sua pergunta:**

**Para o campo `callback.successUrl` no Asaas, use:**

```javascript
"{{ $('Webhook').item.json.body.callback.successUrl }}"
```

**Esta URL será automaticamente:**
```
https://seudominio.com/payment-success?user=USER_ID&source=asaas&redirect=dashboard
```

**✨ O sistema gera automaticamente a URL correta baseada no ambiente (local/produção) e no usuário específico!**
