# Exemplo de Payload do Webhook com Dados Completos

## Estrutura do Payload Enviado para n8n

Agora o webhook inclui dados completos da **conta** e **assinatura** do usuário:

```json
{
  "action": "provision_customer",
  "data": {
    "nome": "João Silva",
    "email": "joao@exemplo.com",
    "cpfCnpj": "12345678900",
    "telefone": "(11) 99999-9999",
    "userId": "uuid-do-usuario",
    "assinaturaId": "uuid-da-assinatura",
    "conta": {
      "id": "uuid-da-conta",
      "nome_conta": "João Silva Corretor",
      "tipo_conta": "INDIVIDUAL",
      "documento": "12345678900",
      "max_corretores": 1
    },
    "assinatura": {
      "id": "uuid-da-assinatura",
      "plano_id": 1,
      "status": "TRIAL",
      "data_fim_trial": "2024-01-22T10:00:00.000Z",
      "data_proxima_cobranca": "2024-01-22",
      "valor_atual": 149.00,
      "ciclo_cobranca": "MONTHLY",
      "plano_nome": "Corretor Individual"
    },
    "timestamp": "2024-01-15T10:00:00.000Z"
  }
}
```

## Lógica Condicional de Mensagens

### Caso 1: Usuário SEM assinatura no Asaas
**Condição:** `id_assinatura_asaas` é `null` na tabela `assinaturas`

**Banner mostrado:**
```tsx
<Card className="p-4 border-blue-200 bg-blue-50">
  <div className="flex items-start gap-4">
    <UserPlus className="w-5 h-5 text-blue-600" />
    <div>
      <h3>Ative sua assinatura</h3>
      <p>Configure sua forma de pagamento para garantir acesso contínuo...</p>
      <Button>Ativar Assinatura</Button>
    </div>
  </div>
</Card>
```

### Caso 2: Usuário COM assinatura no Asaas (tem faturas)
**Condição:** `id_assinatura_asaas` tem valor na tabela `assinaturas`

**Banner mostrado:**
```tsx
<Card className="p-4 border-red-200 bg-red-50">
  <div className="flex items-start gap-4">
    <AlertTriangle className="w-5 h-5 text-red-600" />
    <div>
      <h3>🚨 Pagamento Atrasado!</h3>
      <p>Sua assinatura está com pagamento em atraso. Regularize agora...</p>
      <Button>Regularizar Pagamento</Button>
    </div>
  </div>
</Card>
```

### Critério Simples
- **`id_assinatura_asaas` = `null`** → Botão "Ativar Assinatura" (azul)
- **`id_assinatura_asaas` ≠ `null`** → Botão "Regularizar Pagamento" (vermelho)

## Como Usar na Aplicação

```tsx
import PaymentStatusBanner from '@/components/PaymentStatusBanner';

// Em qualquer página/componente
function MyPage() {
  const userId = "uuid-do-usuario-logado";
  
  return (
    <div>
      {/* Outros conteúdos */}
      
      <PaymentStatusBanner userId={userId} />
      
      {/* Outros conteúdos */}
    </div>
  );
}
```

## Arquivos Modificados/Criados

1. **`src/services/webhookService.ts`** - Interface expandida com dados de conta/assinatura
2. **`src/utils/webhookDataHelper.ts`** - Helper para buscar dados completos
3. **`src/hooks/usePaymentStatus.ts`** - Hook para verificar status de pagamento
4. **`src/components/PaymentStatusBanner.tsx`** - Componente com lógica condicional
5. **`src/components/CustomerRegistrationModal.tsx`** - Atualizado para usar dados completos
