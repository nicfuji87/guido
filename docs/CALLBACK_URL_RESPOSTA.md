# 🎯 RESPOSTA DIRETA: Link para Callback do Asaas

## ❓ **Sua Pergunta:**
> "qual link eu coloco?" (no callback do Asaas)

---

## ✅ **RESPOSTA:**

### **Cole EXATAMENTE isto no campo `callback.successUrl` do Asaas:**

```javascript
{{ $('Webhook').item.json.body.callback.successUrl }}
```

---

## 🔧 **Configuração Completa no n8n:**

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

---

## 🎯 **O que acontece:**

1. **Webhook enviado** → Inclui URL personalizada para cada usuário
2. **n8n usa a URL** → Campo `callback.successUrl` do Asaas  
3. **Usuário paga** → Asaas processa pagamento
4. **Asaas redireciona** → Para página de sucesso personalizada
5. **Usuário vê sucesso** → Página bonita de confirmação
6. **Clica "Acessar Guido"** → Dashboard da aplicação

---

## 🌐 **URL que será gerada automaticamente:**

```
https://app.guido.net.br/payment-success?user=USER_ID&source=asaas&redirect=dashboard
```

---

## ⚙️ **Configuração no .env:**

```bash
# Para produção:
VITE_APP_URL=https://app.guido.net.br

# Para desenvolvimento:  
VITE_APP_URL=http://localhost:3000
```

---

## 🎉 **RESUMO:**

**USE ESTA LINHA no n8n:**

```
"successUrl": "{{ $('Webhook').item.json.body.callback.successUrl }}"
```

**✨ SIMPLES ASSIM! O sistema faz todo o resto automaticamente.**
