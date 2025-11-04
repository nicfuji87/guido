# Estratégia de Resiliência do Signup

## 🎯 Problema Identificado

**Situação atual:**
```
Passo 1-4: ✅ Validações, buscar plano, criar conta
Passo 5: ✅ Criar auth.user                    <-- PROBLEMA AQUI
Passo 6: ❌ FALHA ao criar usuário/instância   (rede, Evolution API, timeout)
Passo 7-9: ❌ Não executado

Resultado: auth.user existe, mas sem dados relacionados
         → Usuário não consegue usar o sistema
```

## 🛡️ Solução em 3 Camadas

### **Camada 1: Middleware de Verificação no Login** ✅
**Status:** IMPLEMENTADO (via criação automática de instância)

Quando o usuário faz login, o sistema já verifica e cria a instância Evolution automaticamente.

**Onde:** `src/components/widgets/EvolutionWhatsAppWidget.tsx`
```typescript
// Função ensureInstanceExists() já implementada
// Garante que usuário tenha instância antes de conectar
```

**Benefício:**
- ✅ Self-healing: sistema se recupera automaticamente
- ✅ Transparente para o usuário
- ✅ Já funciona para o caso Evolution API

### **Camada 2: Verificação Completa no AuthProvider** 🔄
**Status:** A IMPLEMENTAR

Adicionar verificação no `useAuth` para garantir que todos os registros existam.

**Local:** `src/hooks/useAuth.tsx`

```typescript
// AI dev note: Verificação de cadastro completo
const checkCompleteSignup = async (authUserId: string, email: string) => {
  try {
    // 1. Verificar se existe corretor
    const { data: corretor } = await supabase
      .from('corretores')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (!corretor) {
      // Corretor não existe - cadastro incompleto!
      console.warn('⚠️ Cadastro incompleto detectado:', email);
      await completeSignup(authUserId, email);
    }

    // 2. Verificar se existe usuario
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('*')
      .eq('auth_user_id', authUserId)
      .single();

    if (!usuario) {
      console.warn('⚠️ Usuário sem registro na tabela usuarios');
      await createUsuarioRecord(authUserId, email);
    }

  } catch (error) {
    console.error('Erro ao verificar cadastro:', error);
  }
};
```

**Benefício:**
- ✅ Detecta e corrige cadastros incompletos ao fazer login
- ✅ Funciona para qualquer tipo de falha parcial
- ✅ Não precisa refatorar signup (menos risco)

### **Camada 3: Reordenar Signup (Preventivo)** 🎯
**Status:** PROPOSTO (requer análise de impacto)

Mudar ordem para criar `auth.user` **POR ÚLTIMO**.

**Ordem atual:**
```
1. Validações
2. Buscar plano
3. Criar conta
4. Criar auth.user    <-- AQUI
5. Criar usuário
6. Criar corretor
7. Criar assinatura
```

**Ordem proposta:**
```
1. Validações
2. Buscar plano
3. Criar conta
4. Criar corretor      <-- Movido para cá
5. Criar assinatura    <-- Movido para cá
6. Tentar criar Evolution (não-crítico)
7. Criar auth.user     <-- POR ÚLTIMO
8. Criar usuário (com auth_user_id)
```

**Vantagens:**
- ✅ Se falhar antes do auth.user, não fica órfão
- ✅ auth.user só criado quando tudo OK
- ✅ Rollback mais simples (apenas deletar conta/corretor/assinatura)

**Desvantagens:**
- ❌ Mudança grande no fluxo
- ❌ Precisa teste extensivo
- ❌ Pode quebrar integrações existentes

### **Camada 4: Database Triggers** 🔐
**Status:** PROPOSTO

Criar trigger no Supabase que garante consistência.

```sql
-- AI dev note: Trigger para garantir que auth.user tem registros relacionados
-- Quando novo auth.user é criado, verificar se tem corretor/usuario

CREATE OR REPLACE FUNCTION check_auth_user_consistency()
RETURNS TRIGGER AS $$
BEGIN
  -- Agendar verificação após 30 segundos (dar tempo pro signup completar)
  PERFORM pg_sleep(30);
  
  -- Verificar se existe corretor
  IF NOT EXISTS (
    SELECT 1 FROM corretores WHERE email = NEW.email
  ) THEN
    -- Log warning
    RAISE WARNING 'Auth user % sem corretor associado', NEW.id;
  END IF;
  
  -- Verificar se existe usuario
  IF NOT EXISTS (
    SELECT 1 FROM usuarios WHERE auth_user_id = NEW.id
  ) THEN
    RAISE WARNING 'Auth user % sem usuario associado', NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auth_user_consistency_check
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION check_auth_user_consistency();
```

**Benefício:**
- ✅ Camada adicional de segurança
- ✅ Logs automáticos de inconsistências
- ✅ Pode enviar alertas

## 📊 Matriz de Implementação

| Camada | Esforço | Risco | Impacto | Prioridade | Status |
|--------|---------|-------|---------|------------|--------|
| 1. Auto-criação Evolution | ⚡ Baixo | 🟢 Baixo | 🎯 Alto | 🔥 Alta | ✅ FEITO |
| 2. Middleware Auth | ⚡⚡ Médio | 🟢 Baixo | 🎯🎯 Muito Alto | 🔥 Alta | 📋 TODO |
| 3. Reordenar Signup | ⚡⚡⚡ Alto | 🟡 Médio | 🎯🎯 Muito Alto | 🟡 Média | 💭 Analisar |
| 4. Database Triggers | ⚡⚡ Médio | 🟢 Baixo | 🎯 Alto | 🟢 Baixa | 💭 Futuro |

## 🚀 Plano de Ação Recomendado

### **Fase 1: Imediata** (esta semana)
- [x] ✅ Criar auto-criação de instância Evolution
- [ ] ⏳ Implementar Camada 2 (Middleware Auth)
- [ ] ⏳ Adicionar logs detalhados no signup
- [ ] ⏳ Criar documentação

### **Fase 2: Curto Prazo** (próximas 2 semanas)
- [ ] 📋 Analisar impacto de reordenar signup
- [ ] 📋 Criar ambiente de staging para testes
- [ ] 📋 Implementar rollback automático
- [ ] 📋 Adicionar métricas de sucesso do signup

### **Fase 3: Médio Prazo** (próximo mês)
- [ ] 💭 Considerar reordenar signup (se análise for positiva)
- [ ] 💭 Implementar triggers no banco
- [ ] 💭 Sistema de alertas para cadastros incompletos
- [ ] 💭 Dashboard de health check de usuários

## 🔍 Monitoramento e Alertas

### Métricas para acompanhar:
```typescript
// Adicionar no signup
log.metric('signup_step_success', { step: 'auth_user' });
log.metric('signup_step_failure', { step: 'evolution_instance', error });
log.metric('signup_complete', { duration_ms: Date.now() - startTime });
```

### Queries para detectar inconsistências:

```sql
-- Usuários com auth mas sem corretor
SELECT 
  au.id as auth_user_id,
  au.email,
  au.created_at
FROM auth.users au
LEFT JOIN corretores c ON c.email = au.email
WHERE c.id IS NULL
  AND au.created_at > NOW() - INTERVAL '7 days';

-- Usuários com auth mas sem usuario
SELECT 
  au.id as auth_user_id,
  au.email,
  au.created_at
FROM auth.users au
LEFT JOIN usuarios u ON u.auth_user_id = au.id
WHERE u.id IS NULL
  AND au.created_at > NOW() - INTERVAL '7 days';

-- Usuários sem instância Evolution
SELECT 
  u.id,
  u.email,
  u.created_at
FROM usuarios u
WHERE u.evolution_instance IS NULL
  AND u.created_at > NOW() - INTERVAL '7 days';
```

## 📝 Próximos Passos

### 1. **Implementar Camada 2 imediatamente**
```typescript
// Em src/hooks/useAuth.tsx - adicionar após checkCorretorStatus

const ensureCompleteSignup = async (authUserId: string, email: string) => {
  // Verificar corretor
  const corretor = await checkCorretorStatus(authUserId, email);
  
  if (!corretor.isValid) {
    console.warn('🔧 Corretor não encontrado - tentando recuperar cadastro');
    await attemptSignupRecovery(authUserId, email);
  }
  
  // Verificar usuario
  const { data: usuario } = await supabase
    .from('usuarios')
    .select('id')
    .eq('auth_user_id', authUserId)
    .single();
    
  if (!usuario) {
    console.warn('🔧 Usuario não encontrado - criando registro');
    await createUsuarioFromAuth(authUserId, email);
  }
};
```

### 2. **Criar função de recuperação**
```typescript
const attemptSignupRecovery = async (authUserId: string, email: string) => {
  try {
    // Buscar dados do auth.user
    const { data: authUser } = await supabase.auth.admin.getUserById(authUserId);
    
    // Criar registros faltantes
    // ... implementar lógica completa
    
    log.info('✅ Cadastro recuperado com sucesso', { authUserId, email });
  } catch (error) {
    log.error('❌ Falha na recuperação de cadastro', { authUserId, email, error });
    // Notificar equipe de suporte
  }
};
```

### 3. **Adicionar alertas**
```typescript
// Quando detectar cadastro incompleto
await sendSlackAlert({
  channel: '#tech-alerts',
  message: `⚠️ Cadastro incompleto detectado: ${email}`,
  severity: 'warning'
});
```

## ✅ Checklist de Deploy

**Camada 2 (Middleware):**
- [ ] Implementar `ensureCompleteSignup`
- [ ] Adicionar testes unitários
- [ ] Testar em staging com casos edge
- [ ] Adicionar logs e métricas
- [ ] Deploy em produção
- [ ] Monitorar por 48h

**Monitoramento:**
- [ ] Criar dashboard de métricas
- [ ] Configurar alertas
- [ ] Documentar runbook de troubleshooting
- [ ] Treinar equipe de suporte

---

**Documento criado em:** 04/11/2025  
**Última atualização:** 04/11/2025  
**Status:** 🟡 Em Implementação (Camada 1 completa, Camada 2 em desenvolvimento)

