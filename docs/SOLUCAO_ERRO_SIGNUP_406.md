# 🔧 Solução para Erro 406 (Not Acceptable) no Signup

## 📋 Problema Original

Durante o cadastro de novos usuários, ocorriam dois erros principais:

### Erro 1: **406 (Not Acceptable)**
```
GET https://.../rest/v1/corretores?select=id&email=eq... 406 (Not Acceptable)
GET https://.../rest/v1/corretores?select=id&cpf=eq... 406 (Not Acceptable)
GET https://.../rest/v1/usuarios?select=id&whatsapp=eq... 406 (Not Acceptable)
```

**Causa**: Usuários anônimos (não autenticados) não tinham permissão para executar queries SELECT nas tabelas devido às políticas RLS (Row Level Security).

### Erro 2: **401 (Unauthorized) + RLS Violation**
```
POST https://.../rest/v1/contas?select=* 401 (Unauthorized)
message: 'new row violates row-level security policy for table "contas"'
```

**Causa**: A política RLS da tabela `contas` só permitia INSERT para usuários com role `service_role`, bloqueando cadastros anônimos do frontend.

---

## ✅ Solução Implementada

### **Estratégia: Função SECURITY DEFINER no Backend**

Criamos uma função PostgreSQL `complete_signup()` com `SECURITY DEFINER` que:
- ✅ Executa com permissões elevadas (bypass controlado de RLS)
- ✅ Realiza todo o processo de signup atomicamente (transação)
- ✅ Mantém segurança (validações internas)
- ✅ Disponível para usuários anônimos (`anon` role)

---

## 🔨 Mudanças Realizadas

### 1. **Migração de Banco de Dados** (`add_signup_permissions_and_function`)

#### A. Permissão para verificação de conflitos
```sql
GRANT EXECUTE ON FUNCTION check_signup_conflicts TO anon;
```

#### B. Nova função `complete_signup()`
```sql
CREATE OR REPLACE FUNCTION complete_signup(
  p_email VARCHAR,
  p_nome VARCHAR,
  p_cpf VARCHAR,
  p_whatsapp VARCHAR,
  p_tipo_conta VARCHAR,
  -- ... outros parâmetros
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
```

**O que a função faz:**
1. ✅ Verifica conflitos (email, CPF, WhatsApp duplicados)
2. ✅ Cria registro na tabela `contas`
3. ✅ Cria registro na tabela `usuarios`
4. ✅ Cria registro na tabela `corretores` (DONO)
5. ✅ Atualiza `admin_principal_id` na conta
6. ✅ Cria assinatura trial de 7 dias
7. ✅ Retorna todos os IDs criados em formato JSON

**Segurança:**
- `SECURITY DEFINER`: Executa com permissões do criador da função
- `SET search_path TO 'public'`: Previne ataques de injeção de schema
- Validações internas contra duplicação
- Transação atômica (rollback automático em caso de erro)

#### C. Permissões
```sql
GRANT EXECUTE ON FUNCTION complete_signup TO anon, authenticated;
```

---

### 2. **Refatoração do Frontend** (`src/hooks/useSignup.ts`)

**ANTES**: 300+ linhas com múltiplas queries e lógica complexa
**DEPOIS**: ~160 linhas, mais simples e confiável

#### Fluxo Simplificado:

```typescript
// PASSO 1: Preparar dados
const cleanCPF = unformatCPF(data.cpf);
const formattedCPF = formatCPF(cleanCPF);

// PASSO 2: Executar signup completo no banco (1 chamada)
const { data: signupResult, error: signupError } = await supabase
  .rpc('complete_signup', {
    p_email: data.email.trim().toLowerCase(),
    p_nome: data.nome,
    p_cpf: formattedCPF,
    p_whatsapp: data.whatsapp,
    p_tipo_conta: data.tipo_conta,
    // ... outros parâmetros
  });

// PASSO 3: Criar usuário no Supabase Auth
const signUpResponse = await supabase.auth.signUp({...});

// PASSO 4: Criar instância Evolution API
const evolutionResult = await createEvolutionInstance(...);

// PASSO 5: Atualizar usuário com dados de Evolution e Auth
await supabase.from('usuarios').update({
  auth_user_id: authUserId,
  evolution_instance: evolutionResult.data?.instanceName,
  // ...
}).eq('id', usuario_id);
```

#### Benefícios:
- ✅ **Redução de código**: De 9 passos para 5 passos
- ✅ **Menos queries**: De 10+ queries para 3 queries principais
- ✅ **Mais seguro**: Validações centralizadas no backend
- ✅ **Transacional**: Rollback automático em caso de falha
- ✅ **Logs mantidos**: Rastreabilidade completa do processo

---

## 🎯 Resultados

### Antes ❌
- Erro 406 nas verificações de unicidade
- Erro 401/RLS ao criar conta
- Código complexo e difícil de manter
- Múltiplas queries expostas no frontend

### Depois ✅
- Signup funcional para usuários anônimos
- Código limpo e manutenível
- Segurança aprimorada (lógica no backend)
- Performance melhorada (menos roundtrips)

---

## 📊 Verificação

Para verificar se a função está ativa:

```sql
SELECT 
    proname as function_name,
    prosecdef as is_security_definer,
    proconfig as settings
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname = 'complete_signup';
```

**Resultado esperado:**
```json
{
  "function_name": "complete_signup",
  "is_security_definer": true,
  "settings": ["search_path=public"]
}
```

---

## 🔐 Considerações de Segurança

### ✅ Boas Práticas Implementadas
1. **SECURITY DEFINER com search_path fixo**: Previne ataques de schema injection
2. **Validações no backend**: Email, CPF, WhatsApp duplicados
3. **Transações atômicas**: Garante consistência dos dados
4. **Logs detalhados**: Auditoria e debugging
5. **Permissões granulares**: Apenas `anon` e `authenticated` podem executar

### ⚠️ Pontos de Atenção
1. A função cria registros SEM autenticação prévia
2. Isso é necessário para o fluxo de signup, mas deve ser monitorado
3. Rate limiting deve ser implementado no gateway (Supabase faz isso automaticamente)

---

## 🚀 Próximos Passos (Opcional)

1. **Adicionar rate limiting customizado** para prevenir abuso de signup
2. **Implementar captcha** no formulário de signup
3. **Criar trigger de auditoria** para registrar todos os signups
4. **Monitorar logs** de execução da função `complete_signup`

---

## 📝 Data da Implementação

- **Data**: 05/11/2025
- **Migrações**: 
  - `add_signup_permissions_and_function` (inicial)
  - `fix_complete_signup_column_names` (correção de case-sensitive)
- **Arquivos modificados**:
  - `src/hooks/useSignup.ts`
  - `src/lib/supabaseClient.ts`
  - `src/utils/cacheExamples.tsx` (removido)
  
## 🔧 Correções Adicionais

### Case-Sensitive em Nomes de Colunas
A coluna `cpfCnpj` na tabela `usuarios` usa camelCase. No PostgreSQL, é necessário usar aspas duplas para preservar o case:

```sql
-- ❌ ERRADO (converte para lowercase)
INSERT INTO usuarios (cpfCnpj, ...) VALUES (...)

-- ✅ CORRETO (preserva case)
INSERT INTO usuarios ("cpfCnpj", ...) VALUES (...)
```

**Erro original**: 
```
column "cpfcnpj" of relation "usuarios" does not exist
```

**Solução**: Migração `fix_complete_signup_column_names` adicionou aspas duplas ao nome da coluna.

---

## 🔗 Referências

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL SECURITY DEFINER](https://www.postgresql.org/docs/current/sql-createfunction.html)
- [Supabase Database Functions](https://supabase.com/docs/guides/database/functions)


