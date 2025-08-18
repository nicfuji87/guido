# 🧾 Asaas: Tipos de URL e Fallbacks

## ❓ **Qual Link de Fallback Usar?**

O sistema agora **detecta automaticamente** qual é a melhor URL baseado na resposta do webhook do Asaas. Veja os formatos suportados:

### **📋 Formatos de Resposta Suportados:**

#### **1. Formato Simples (Atual):**
```json
{
  "response": "https://www.asaas.com/i/7aker5to0nd0asqi"
}
```
→ **Sistema usa**: `response` como URL principal

#### **2. Formato com Fallback:**
```json
{
  "response": "https://www.asaas.com/i/7aker5to0nd0asqi",
  "fallback_url": "https://www.asaas.com/p/7aker5to0nd0asqi"
}
```
→ **Sistema usa**: `response` como principal, `fallback_url` como backup

#### **3. Formato com URL Direta:**
```json
{
  "response": "https://www.asaas.com/i/7aker5to0nd0asqi",
  "direct_url": "https://www.asaas.com/d/7aker5to0nd0asqi"
}
```
→ **Sistema usa**: `direct_url` (prioridade máxima - sem iframe)

#### **4. Formato com URL de Pagamento:**
```json
{
  "response": "https://www.asaas.com/i/7aker5to0nd0asqi",
  "payment_url": "https://www.asaas.com/pay/7aker5to0nd0asqi"
}
```
→ **Sistema usa**: `payment_url` (prioridade alta - específica para pagamento)

## 🎯 **Prioridade Automática do Sistema:**

### **Ordem de Prioridade (automática):**
1. 🥇 **`direct_url`** - URL direta sem iframe (melhor UX)
2. 🥈 **`payment_url`** - URL específica de pagamento  
3. 🥉 **`response`** - URL padrão da resposta
4. 🏅 **`fallback_url`** - URL de fallback (última opção)

### **Como o Sistema Decide:**
```typescript
// O helper getAsaasUrls() analisa a resposta e retorna:
{
  primaryUrl: "https://www.asaas.com/d/7aker5to0nd0asqi",    // Melhor URL
  fallbackUrl: "https://www.asaas.com/i/7aker5to0nd0asqi",  // URL alternativa  
  urlType: "direct",                                        // Tipo detectado
  description: "URL direta do Asaas (sem iframe)"          // Descrição
}
```

## 🔧 **Configuração no seu n8n:**

### **Opção 1: Retorno Simples (Atual)**
```javascript
// No n8n, retorne simplesmente:
return {
  response: urlDaFaturaAsaas
};
```

### **Opção 2: Retorno com Fallback (Recomendado)**
```javascript
// No n8n, retorne com URLs específicas:
return {
  response: urlPadraoAsaas,           // URL padrão
  direct_url: urlDiretaAsaas,         // URL sem iframe (se disponível)
  payment_url: urlPagamentoAsaas,     // URL específica de pagamento
  fallback_url: urlFallbackAsaas      // URL de backup
};
```

## 📊 **Tipos de URL do Asaas:**

| Tipo | Formato | Descrição | Prioridade |
|------|---------|-----------|------------|
| **Direct** | `/d/xxxxx` | URL direta sem iframe | 🥇 Alta |
| **Payment** | `/pay/xxxxx` | URL específica pagamento | 🥈 Alta |
| **Standard** | `/i/xxxxx` | URL padrão da fatura | 🥉 Média |
| **Fallback** | `/p/xxxxx` | URL de backup | 🏅 Baixa |

## 🎯 **Recomendação:**

### **Para o seu n8n, use:**

```javascript
// Se o Asaas retornar múltiplas URLs, configure assim:
return {
  response: faturaUrl,                    // URL principal que você tem
  direct_url: faturaUrlDireta,           // Se Asaas fornecer URL direta
  fallback_url: faturaUrlFallback        // Se Asaas fornecer URL de fallback
};
```

### **Se só tem uma URL (atual):**
```javascript
// Continue como está - o sistema funcionará perfeitamente:
return {
  response: "https://www.asaas.com/i/7aker5to0nd0asqi"
};
```

## 🧪 **Como Testar Diferentes URLs:**

### **1. Teste URL Atual:**
```json
{"response": "https://www.asaas.com/i/7aker5to0nd0asqi"}
```
→ Sistema detecta como "standard" e abre normalmente

### **2. Teste com Fallback:**
```json
{
  "response": "https://www.asaas.com/i/7aker5to0nd0asqi",
  "fallback_url": "https://www.asaas.com/p/7aker5to0nd0asqi"
}
```
→ Sistema usa `response` como principal e tem `fallback_url` como backup

## 🚀 **Resultado Final:**

**O sistema funciona com qualquer formato que o Asaas retornar:**
- ✅ **URL Simples**: Funciona como está
- ✅ **Múltiplas URLs**: Escolhe automaticamente a melhor
- ✅ **Fallback Automático**: Usa URL alternativa se necessário
- ✅ **Flexibilidade**: Adaptável a mudanças do Asaas

**💡 Resposta à sua pergunta:**
**Você pode usar QUALQUER URL que o Asaas fornecer** - o sistema detecta automaticamente e escolhe a melhor opção! 🎯
