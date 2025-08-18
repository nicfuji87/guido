# 🧾 Exemplo Prático: Callback do Asaas para Nicolas Fujimoto

## 📋 **Dados do Webhook Recebido:**
```json
{
  "user": {
    "id": "fa7aa896-7fe2-488c-97a0-24c60f8cea70",
    "name": "Nicolas Fujimoto",
    "email": "fujimoto.nicolas@gmail.com",
    // ... outros dados
  }
}
```

## 🎯 **URL de Callback Gerada Automaticamente:**

```
https://app.guido.net.br/payment-success?user=fa7aa896-7fe2-488c-97a0-24c60f8cea70&source=asaas&redirect=dashboard
```

### **Breakdown da URL:**
- **`https://app.guido.net.br`** - Base URL da aplicação (VITE_APP_URL)
- **`/payment-success`** - Página de sucesso criada
- **`user=fa7aa896-7fe2-488c-97a0-24c60f8cea70`** - ID do Nicolas
- **`source=asaas`** - Identificador do gateway
- **`redirect=dashboard`** - Redirecionar para dashboard após sucesso

## 🔧 **Configuração no n8n:**

### **No node de criação da assinatura Asaas:**
```javascript
{
  "billingType": "CREDIT_CARD",
  "cycle": "MONTHLY",
  "customer": "{{ $('Cria Customer Asaas').item.json.id }}",
  "value": 67.00,  // Valor do plano Imobiliária Básica do Nicolas
  "nextDueDate": "{{ (new Date($today)).toISOString().slice(0,10) }}",
  "description": "Serviço de Assinatura Guido\nPlano: Imobiliária Básica (Acesso para até 5 usuários).\nDescrição: Licença de uso mensal, não exclusiva, para acesso às ferramentas de inteligência artificial para gestão de comunicação e vendas no setor imobiliário.",
  "externalReference": "fa7aa896-7fe2-488c-97a0-24c60f8cea70",
  "callback": {
    "successUrl": "https://app.guido.net.br/payment-success?user=fa7aa896-7fe2-488c-97a0-24c60f8cea70&source=asaas&redirect=dashboard"
  }
}
```

### **Ou usando variáveis do webhook (dinâmico):**
```javascript
{
  "billingType": "CREDIT_CARD",
  "cycle": "MONTHLY",
  "customer": "{{ $('Cria Customer Asaas').item.json.id }}",
  "value": {{ $('Webhook').item.json.body.data.assinatura.valor_atual }},
  "nextDueDate": "{{ (new Date($today)).toISOString().slice(0,10) }}",
  "description": "Serviço de Assinatura Guido\nPlano: {{ $('Webhook').item.json.body.data.assinatura.plano_nome }}.\nDescrição: Licença de uso mensal, não exclusiva, para acesso às ferramentas de inteligência artificial para gestão de comunicação e vendas no setor imobiliário.",
  "externalReference": "{{ $('Webhook').item.json.body.data.userId }}",
  "callback": {
    "successUrl": "{{ $('Webhook').item.json.body.callback.successUrl }}"
  }
}
```

## 🎯 **Fluxo de Experiência do Nicolas:**

### **1. Nicolas clica "Regularizar Pagamento"**
- Sistema envia webhook com callback URL

### **2. n8n cria assinatura no Asaas**
- Inclui `callback.successUrl` com URL personalizada para o Nicolas

### **3. Asaas retorna URL da fatura**
- `{"response": "https://www.asaas.com/i/abc123"}`

### **4. Sistema abre fatura em nova guaba**
- Nicolas vai para página do Asaas para pagar

### **5. Nicolas completa o pagamento**
- Asaas processa pagamento com sucesso

### **6. Asaas redireciona automaticamente**
- Para: `https://app.guido.net.br/payment-success?user=fa7aa896...&source=asaas&redirect=dashboard`

### **7. Página de sucesso personalizada**
- Mostra confirmação de pagamento
- Dados específicos do Nicolas
- Botão "Acessar Guido" → Dashboard

### **8. Nicolas clica "Acessar Guido"**
- Redireciona para `/app` (dashboard)
- Assinatura já está ativa no sistema

## 🎨 **Página de Sucesso para o Nicolas:**

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
│     Usuário: fa7aa896-7fe2-488c-97a0-24c60f8cea70  │
│     Gateway: ASAAS                                  │
│                                                     │
│            [→ Acessar Guido]                       │
│            [🏠 Voltar ao Início]                   │
│                                                     │
│     🚀 Bem-vindo ao Guido! Sua jornada de         │
│        vendas inteligentes começa agora.           │
└─────────────────────────────────────────────────────┘
```

## ⚙️ **Variáveis de Ambiente:**

### **Para Desenvolvimento:**
```bash
# .env
VITE_APP_URL=http://localhost:3000
```

### **Para Produção:**
```bash
# .env
VITE_APP_URL=https://app.guido.net.br
```

## 🧪 **Como Testar:**

### **1. Teste Local:**
1. Configure `VITE_APP_URL=http://localhost:3000`
2. Clique "Regularizar Pagamento"
3. Verifique no console a URL gerada
4. Simule pagamento no Asaas
5. Asaas deve redirecionar para `localhost:3000/payment-success`

### **2. Teste Produção:**
1. Configure `VITE_APP_URL=https://app.guido.net.br`
2. Deploy da aplicação
3. Teste pagamento real
4. Callback vai para URL de produção

## 📝 **Resumo para o n8n:**

**RESPOSTA SIMPLES:** Use este campo no Asaas:

```javascript
"callback": {
  "successUrl": "{{ $('Webhook').item.json.body.callback.successUrl }}"
}
```

**A URL será automaticamente:**
- ✅ **Personalizada** para cada usuário
- ✅ **Ambiente-aware** (local/produção)
- ✅ **Segura** com parâmetros de identificação
- ✅ **Funcional** com redirecionamento automático

**🎉 Configure uma vez e funciona para todos os usuários!**
