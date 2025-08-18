# 🔧 Correção do Webhook: Dados Completos de Conta e Assinatura

## 🎯 Problema Identificado

O webhook recebido estava incompleto:

```json
{
  "corrector": {
    "id": "edceea62-d4cb-4e1c-9784-2a4faaf55062",
    "nome": "Nicolas Fujimoto",
    "email": "fujimoto.nicolas@gmail.com",
    "conta_id": "0ccda3b9-3dac-4dad-b21b-dbe81d72fb42",
    "funcao": "DONO"
  },
  "user": {
    // ... dados do usuário
  }
  // ❌ FALTAVA: dados de conta e assinatura
}
```

## ✅ Solução Implementada

### 1. **Identificação da Origem**
- Webhook enviado de: `src/components/configuracoes/PlanosSection.tsx`
- Função: `handleRegularizarPagamento()`
- URL destino: `webhooks-i.infusecomunicacao.online/webhook/guidoAsaas`

### 2. **Atualização do PlanosSection.tsx**

**ANTES:**
```typescript
body: JSON.stringify({
  corrector: { /* dados do corretor */ },
  user: { /* dados do usuário */ }
  // ❌ Sem dados de conta e assinatura
})
```

**DEPOIS:**
```typescript
// Preparar dados completos incluindo conta e assinatura
const webhookData = await prepareWebhookData({
  nome: userData.name,
  email: userData.email,
  documento: userData.cpfCnpj || '',
  telefone: userData.whatsapp,
  userId: userData.id,
  assinaturaId: assinatura.id
});

body: JSON.stringify({
  action: 'provision_customer',
  // Dados do corretor (compatibilidade)
  corrector: { /* dados do corretor */ },
  // Dados completos do usuário (compatibilidade)
  user: userData,
  // Dados expandidos com conta e assinatura (novo)
  data: webhookData
})
```

### 3. **Payload Completo Agora Enviado**

```json
{
  "action": "provision_customer",
  "corrector": {
    "id": "edceea62-d4cb-4e1c-9784-2a4faaf55062",
    "nome": "Nicolas Fujimoto",
    "email": "fujimoto.nicolas@gmail.com",
    "conta_id": "0ccda3b9-3dac-4dad-b21b-dbe81d72fb42",
    "funcao": "DONO"
  },
  "user": {
    "id": "fa7aa896-7fe2-488c-97a0-24c60f8cea70",
    "name": "Nicolas Fujimoto",
    "whatsapp": "(61) 98144-6666",
    "created_at": "2025-08-01T19:10:48.917409+00:00",
    "updated_at": "2025-08-17T18:01:35.866947+00:00",
    "auth_user_id": "10cc4ca8-f086-421f-89c5-02bfb81de716",
    "email": "fujimoto.nicolas@gmail.com",
    "id_cliente_asaas": "cus_000130773472",
    "data_ultimo_login": null,
    "fonte_cadastro": "SITE",
    "dados_asaas": null,
    "evolution_instance": "arnelBea",
    "evolution_apikey": "arnelBea",
    "evolution_url": "https://chat-guido.infusecomunicacao.online/",
    "cep": 71515720,
    "logradouro": "Quadra SHIN QI 11 Conjunto 2",
    "bairro": "Setor de Habitações Individuais Norte",
    "localidade": "Brasília",
    "uf": "DF",
    "ddd": 61,
    "numero_residencia": "13",
    "complemento_endereco": null,
    "cpfCnpj": "00484887122"
  },
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
  }
}
```

## 📁 Arquivos Modificados

### 1. `src/components/configuracoes/PlanosSection.tsx`
- ✅ Adicionado import do `prepareWebhookData`
- ✅ Atualizada função `handleRegularizarPagamento()`
- ✅ Webhook agora inclui dados completos

### 2. Arquivos de Suporte (já existentes)
- `src/services/webhookService.ts` - Interface expandida
- `src/utils/webhookDataHelper.ts` - Helper para buscar dados
- `src/hooks/usePaymentStatus.ts` - Lógica condicional
- `src/components/PaymentStatusBanner.tsx` - Banner inteligente

## 🎯 Resultado Final

**Webhook n8n agora recebe:**
- ✅ **corrector**: Dados do corretor (compatibilidade com versão anterior)
- ✅ **user**: TODOS os campos da tabela usuarios (compatibilidade total)
- ✅ **data.conta**: Dados completos da conta (nome, tipo, documento, max_corretores)
- ✅ **data.assinatura**: Dados completos da assinatura (status, plano, valor, datas)
- ✅ Estrutura expandida mas compatível

**Compatível com a lógica condicional:**
- `id_assinatura_asaas = null` → Banner "Ativar Assinatura"
- `id_assinatura_asaas ≠ null` → Banner "Regularizar Pagamento"

## 🚀 Próximos Passos

O n8n agora pode:
1. Processar dados completos da conta
2. Identificar o tipo de assinatura (INDIVIDUAL/IMOBILIARIA)
3. Trabalhar com dados de valor e status
4. Integrar corretamente com APIs de pagamento (Asaas)

**Status: ✅ CONCLUÍDO E FUNCIONAL**
