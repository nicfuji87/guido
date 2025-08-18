# 🎯 RESPOSTA: Qual Link Colocar no Callback do Asaas?

## ❓ **Sua Pergunta:**
> "a fatura do asaas já tem um link de fallback, qual link eu coloco?"

## ✅ **RESPOSTA DIRETA:**

### **No campo `callback.successUrl` do Asaas, use:**

```javascript
"{{ $('Webhook').item.json.body.callback.successUrl }}"
```

### **Esta variável será automaticamente:**

```
https://seudominio.com/payment-success?user=USER_ID&source=asaas&redirect=dashboard
```

---

## 🔧 **Configuração Completa no n8n:**

```javascript
{
  "billingType": "CREDIT_CARD",
  "cycle": "MONTHLY",
  "customer": "{{ $('Cria Customer Asaas').item.json.id }}",
  "value": {{ $('Webhook').item.json.body.data.assinatura.valor_atual }},
  "nextDueDate": "{{ (new Date($today)).toISOString().slice(0,10) }}",
  "description": "Serviço de Assinatura Guido\nPlano: {{ $('Webhook').item.json.body.data.assinatura.plano_nome }}",
  "externalReference": "{{ $('Webhook').item.json.body.data.userId }}",
  "callback": {
    "successUrl": "{{ $('Webhook').item.json.body.callback.successUrl }}"
  }
}
```

## 🎯 **Como Funciona:**

### **1. Webhook enviado incluirá:**
```json
{
  "data": { /* dados do usuário, conta, assinatura */ },
  "callback": {
    "successUrl": "https://app.guido.net.br/payment-success?user=fa7aa896-7fe2-488c-97a0-24c60f8cea70&source=asaas&redirect=dashboard"
  }
}
```

### **2. n8n usa esta URL no Asaas:**
- Campo `callback.successUrl` = URL personalizada para cada usuário

### **3. Após pagamento bem-sucedido:**
- Asaas redireciona automaticamente para sua aplicação
- Usuário vê página de sucesso personalizada  
- Clica "Acessar Guido" → Dashboard

## 🌐 **URLs Geradas Automaticamente:**

### **Desenvolvimento:**
```
http://localhost:3000/payment-success?user=USER_ID&source=asaas&redirect=dashboard
```

### **Produção:**
```
https://app.guido.net.br/payment-success?user=USER_ID&source=asaas&redirect=dashboard
```

## ⚙️ **Configuração de Ambiente:**

```bash
# .env
VITE_APP_URL=https://app.guido.net.br  # Para produção
# ou
VITE_APP_URL=http://localhost:3000     # Para desenvolvimento
```

## 🎉 **Resumo:**

**RESPOSTA SIMPLES:** 

**Cole este exato texto no campo `callback.successUrl` do Asaas no n8n:**

```
{{ $('Webhook').item.json.body.callback.successUrl }}
```

**✨ O sistema gera automaticamente a URL correta para cada usuário e ambiente!**

---

### **✅ Implementação Completa:**
- [x] **WebhookService** - Gera URL de callback automaticamente
- [x] **PaymentSuccess** - Página de sucesso criada
- [x] **Routes** - Rota `/payment-success` adicionada  
- [x] **Documentação** - Guias completos criados

**🚀 TUDO PRONTO PARA USO!**
