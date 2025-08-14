# Integração Evolution API - Criação Automática de Instâncias

## Visão Geral

Quando um usuário se cadastra pela primeira vez no sistema, uma instância Evolution API é criada automaticamente para permitir a integração com WhatsApp.

## Fluxo de Cadastro

### 1. Processo Automatizado

Durante o cadastro de um novo usuário (hook `useSignup`), o sistema:

1. **Valida os dados** do usuário (email, CPF, WhatsApp únicos)
2. **Cria conta e corretor** no banco de dados
3. **Cria instância Evolution** usando a API externa
4. **Salva dados da instância** na tabela `usuarios`
5. **Cria assinatura** de trial de 7 dias

### 2. Geração do Nome da Instância

O nome da instância é gerado automaticamente:
- **Formato**: `{nomelimowhatsappnumeros}`
- **Exemplo**: Para "João Silva" com WhatsApp "(11) 99999-8888" → `joaosilva1199998888`
- **Limitação**: Máximo 20 caracteres

### 3. Configurações da Instância

```typescript
{
  instanceName: "joaosilva1199998888",
  token: "joaosilva1199998888", // Mesmo valor do instanceName
  qrcode: true,
  number: "11999998888", // Apenas números
  integration: "WHATSAPP-BAILEYS",
  rejectCall: false,
  msgCall: "Olá! Esta é uma chamada automatizada. Por favor, envie uma mensagem.",
  groupsIgnore: true,
  alwaysOnline: false,
  readMessages: false,
  readStatus: false,
  syncFullHistory: true,
  proxyHost: "p.webshare.io",
  proxyPort: "80",
  proxyProtocol: "http",
  proxyUsername: "dbcnwkxu-rotate",
  proxyPassword: "m8gnsoxw553d",
  webhook: {
    url: "https://app.guido.net.br/webhook/evolution/joaosilva1199998888",
    byEvents: true,
    base64: true,
    headers: {
      authorization: "Bearer {evolution_api_key}",
      "Content-Type": "application/json"
    },
    events: [
      "APPLICATION_STARTUP",
      "QRCODE_UPDATED", 
      "CONNECTION_UPDATE",
      "MESSAGES_UPSERT",
      "MESSAGES_UPDATE",
      "SEND_MESSAGE"
    ]
  }
}
```

## Variáveis de Ambiente

### Obrigatórias

```env
VITE_EVOLUTION_API_URL=https://your-evolution-server.com/
VITE_EVOLUTION_API_KEY=your_evolution_api_key
VITE_EVOLUTION_INSTANCE_NAME=your_instance_name
```

### Opcionais

```env
VITE_APP_URL=https://app.guido.net.br # Para configurar webhook URL
```

### URLs Construídas Dinamicamente

- **Validação WhatsApp**: `${VITE_EVOLUTION_API_URL}chat/whatsappNumbers/${VITE_EVOLUTION_INSTANCE_NAME}`
- **Criação de Instâncias**: `${VITE_EVOLUTION_API_URL}instance/create`

## Tratamento de Erros

### Falha na Criação da Instância

- ❌ **Não bloqueia** o cadastro do usuário
- ⚠️ **Registra o erro** nos logs
- 📝 **Continua** com o fluxo normal
- 🗂️ **Campos Evolution** ficam como `null` na tabela `usuarios`

### Recuperação Manual

Se a instância não for criada durante o cadastro:

1. Identificar usuários sem instância:
```sql
SELECT * FROM usuarios 
WHERE evolution_instance IS NULL 
AND created_at > NOW() - INTERVAL '1 day';
```

2. Criar instância manualmente usando o serviço:
```typescript
import { createEvolutionInstance } from '@/services/evolutionAPI';

const result = await createEvolutionInstance(usuario.name, usuario.whatsapp);
if (result.success) {
  // Atualizar registro do usuário
}
```

## Estrutura de Dados

### Tabela `usuarios`

```sql
-- Campos relacionados à Evolution API
evolution_instance TEXT,     -- Nome da instância (ex: "joaosilva1199998888")
evolution_apikey TEXT,       -- API key gerada pela Evolution
evolution_url TEXT           -- URL do servidor Evolution usado
```

### Resposta da API Evolution

```typescript
interface EvolutionInstanceResponse {
  instance: {
    instanceName: string;
    instanceId: string; 
    status: string;
  };
  hash: {
    apikey: string;
  };
  webhook?: {
    webhook: string;
  };
  qrcode?: {
    pairingCode?: string;
    code?: string;
    base64?: string;
  };
}
```

## Exemplo de Uso

### 1. Cadastro de Usuário

```typescript
// Dados do formulário
const userData = {
  nome: "João Silva",
  email: "joao@email.com", 
  whatsapp: "(11) 99999-8888",
  cpf: "123.456.789-00",
  tipo_conta: "INDIVIDUAL"
};

// Hook de cadastro (já integrado)
const { signup } = useSignup();
const result = await signup(userData);

if (result.success) {
  // Usuário criado com instância Evolution (se bem-sucedida)
  console.log("Usuário criado:", result.data.usuario_id);
  // Instância Evolution criada automaticamente em background
}
```

### 2. Verificar Status da Instância

```typescript
// Buscar dados do usuário com instância
const { data: usuario } = await supabase
  .from('usuarios')
  .select('evolution_instance, evolution_apikey, evolution_url')
  .eq('id', userId)
  .single();

if (usuario.evolution_instance) {
  console.log("Instância ativa:", usuario.evolution_instance);
} else {
  console.log("Instância não criada - criar manualmente");
}
```

## Próximos Passos

1. **Monitoramento**: Implementar dashboard para verificar status das instâncias
2. **Reconexão**: Processo para reconectar instâncias desconectadas  
3. **QR Code**: Interface para mostrar QR code para conexão do WhatsApp
4. **Webhooks**: Processar eventos recebidos da Evolution API
5. **Cleanup**: Remover instâncias de usuários que cancelaram conta

## Logs e Debug

### Logs de Criação

```javascript
// Sucesso
console.log('[Evolution API] Instância criada com sucesso:', {
  instanceName: 'joaosilva1199998888',
  status: 'created'
});

// Erro
console.error('[Evolution API] Erro ao criar instância:', error);
```

### Debugging Local

1. Verificar variáveis de ambiente
2. Testar conectividade com servidor Evolution
3. Validar formato do nome da instância
4. Verificar logs do servidor Evolution
