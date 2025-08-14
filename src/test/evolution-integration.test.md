# Teste de Integração Evolution API

## Teste 1: Geração de Nome da Instância

```typescript
import { generateInstanceName } from '@/services/evolutionAPI';

// Casos de teste
console.log(generateInstanceName('João Silva', '(11) 99999-8888'));
// Esperado: "joaosilva1199998888"

console.log(generateInstanceName('Maria José Santos', '(21) 98765-4321')); 
// Esperado: "mariajosesantos21987"

console.log(generateInstanceName('Ana', '(11) 9-8888-7777'));
// Esperado: "ana11988887777"
```

## Teste 2: Cadastro Completo

### Configurar Variáveis de Ambiente

```env
# .env.local (para teste)
VITE_EVOLUTION_API_URL=https://chat-guido.infusecomunicacao.online/
VITE_EVOLUTION_API_KEY=nicolas
VITE_EVOLUTION_INSTANCE_NAME=nicolas
VITE_APP_URL=http://localhost:3000
```

### Dados de Teste

```typescript
const testUserData = {
  nome: "Teste Evolution",
  email: "teste.evolution@guido.net.br",
  whatsapp: "(11) 98765-4321", 
  cpf: "123.456.789-00",
  tipo_conta: "INDIVIDUAL" as const
};
```

### Executar Teste

```typescript
import { useSignup } from '@/hooks/useSignup';

// No componente de teste
const { signup, isLoading, error } = useSignup();

const handleTest = async () => {
  console.log('[TESTE] Iniciando cadastro com Evolution...');
  
  const result = await signup(testUserData);
  
  if (result.success) {
    console.log('[TESTE] ✅ Cadastro realizado com sucesso!');
    console.log('[TESTE] Dados:', result.data);
    
    // Verificar se instância foi criada
    const usuario = await supabase
      .from('usuarios')
      .select('evolution_instance, evolution_apikey, evolution_url')
      .eq('id', result.data.usuario_id)
      .single();
    
    if (usuario.data?.evolution_instance) {
      console.log('[TESTE] ✅ Instância Evolution criada:', usuario.data);
    } else {
      console.log('[TESTE] ⚠️ Instância Evolution não criada');
    }
  } else {
    console.log('[TESTE] ❌ Erro no cadastro:', result.error);
  }
};
```

## Teste 3: Verificar Criação Manual de Instância

```typescript
import { createEvolutionInstance } from '@/services/evolutionAPI';

const testManualCreation = async () => {
  console.log('[TESTE] Criando instância manualmente...');
  
  const result = await createEvolutionInstance('Teste Manual', '(11) 91234-5678');
  
  if (result.success) {
    console.log('[TESTE] ✅ Instância criada:', result.data);
    /*
    Esperado:
    {
      instanceName: "testemanual1191234567",
      apiKey: "generated-api-key-abc123",
      evolutionUrl: "https://evolution-demo.guido.net.br"
    }
    */
  } else {
    console.log('[TESTE] ❌ Erro:', result.error);
  }
};
```

## Teste 4: Verificar Dados no Banco

```sql
-- Verificar usuários criados recentemente com Evolution
SELECT 
  name,
  email,
  whatsapp,
  evolution_instance,
  evolution_apikey IS NOT NULL as has_apikey,
  evolution_url,
  created_at
FROM usuarios 
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;
```

## Teste 5: Simular Falha da Evolution API

```typescript
// Configurar URL inválida temporariamente
const testWithFailure = async () => {
  // Temporariamente definir URL inválida
  const originalUrl = import.meta.env.VITE_EVOLUTION_URL;
  
  // Simular falha
  Object.defineProperty(import.meta.env, 'VITE_EVOLUTION_URL', {
    value: 'https://evolution-invalid-url.com',
    writable: true
  });
  
  const result = await signup(testUserData);
  
  // Verificar que o cadastro continua mesmo com falha da Evolution
  if (result.success) {
    console.log('[TESTE] ✅ Cadastro funcionou mesmo com falha da Evolution');
    
    // Verificar se usuario foi criado sem dados Evolution
    const usuario = await supabase
      .from('usuarios')
      .select('evolution_instance')
      .eq('id', result.data.usuario_id)
      .single();
    
    if (!usuario.data?.evolution_instance) {
      console.log('[TESTE] ✅ Usuário criado sem instância Evolution (comportamento esperado)');
    }
  }
  
  // Restaurar URL original
  Object.defineProperty(import.meta.env, 'VITE_EVOLUTION_URL', {
    value: originalUrl,
    writable: true
  });
};
```

## Resultado Esperado

### Cadastro com Sucesso
- ✅ Usuário criado na tabela `usuarios`
- ✅ Corretor criado na tabela `corretores`  
- ✅ Conta criada na tabela `contas`
- ✅ Assinatura de trial criada
- ✅ Instância Evolution criada
- ✅ Dados Evolution salvos na tabela `usuarios`

### Cadastro com Falha da Evolution
- ✅ Usuário criado na tabela `usuarios` 
- ✅ Corretor criado na tabela `corretores`
- ✅ Conta criada na tabela `contas`
- ✅ Assinatura de trial criada
- ❌ Instância Evolution não criada
- ✅ Campos Evolution ficam como `null`
- ⚠️ Erro logado mas não bloqueia cadastro

## Checklist de Verificação

- [ ] Variáveis de ambiente configuradas
- [ ] Servidor Evolution acessível
- [ ] Nome da instância gerado corretamente
- [ ] Chamada da API Evolution funcional
- [ ] Dados salvos na tabela usuarios
- [ ] Tratamento de erro funcional
- [ ] Cadastro não é bloqueado por falha da Evolution
- [ ] Logs adequados nos console.log
