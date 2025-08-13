# 📋 Plano de Implementação - Sistema de Assinaturas com Trial

## 🎯 Objetivo
Implementar sistema completo de assinaturas com trial de 7 dias, integrado ao Asaas para cobrança e Supabase para controle de acesso.

---

## 📊 1. Ajustes no Schema do Banco

### 🔧 A. Melhorias na Tabela `assinaturas`

```sql
-- Adicionar campos necessários para controle completo do trial
ALTER TABLE assinaturas ADD COLUMN IF NOT EXISTS data_inicio_trial timestamptz;
ALTER TABLE assinaturas ADD COLUMN IF NOT EXISTS tentativas_cobranca int default 0;
ALTER TABLE assinaturas ADD COLUMN IF NOT EXISTS motivo_cancelamento text;
ALTER TABLE assinaturas ADD COLUMN IF NOT EXISTS metadata_asaas jsonb; -- Para armazenar dados do Asaas

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_assinaturas_status ON assinaturas(status);
CREATE INDEX IF NOT EXISTS idx_assinaturas_data_fim_trial ON assinaturas(data_fim_trial);
CREATE INDEX IF NOT EXISTS idx_assinaturas_conta_id ON assinaturas(conta_id);
```

### 🔧 B. Nova Tabela `usuarios` 

```sql
-- Adicionar campos para integração com Asaas
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS id_cliente_asaas varchar(255) UNIQUE;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS data_ultimo_login timestamptz;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS fonte_cadastro varchar(50) DEFAULT 'SITE'; -- SITE, INDICACAO, etc.
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS dados_asaas jsonb; -- Dados preparados para criar cliente no Asaas

-- Índice para busca rápida
CREATE INDEX IF NOT EXISTS idx_usuarios_id_cliente_asaas ON usuarios(id_cliente_asaas);
```

### 🔧 C. Função para Verificar Acesso Ativo

```sql
-- Função para verificar se uma conta tem acesso ativo (trial ou pago)
CREATE OR REPLACE FUNCTION conta_tem_acesso_ativo(conta_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM assinaturas a
    WHERE a.conta_id = conta_uuid
    AND (
      (a.status = 'TRIAL' AND a.data_fim_trial > now()) OR
      a.status = 'ATIVO'
    )
  );
$$;

-- Função para obter dias restantes do trial
CREATE OR REPLACE FUNCTION dias_restantes_trial(conta_uuid uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT CASE 
    WHEN a.status = 'TRIAL' AND a.data_fim_trial > now() 
    THEN EXTRACT(DAY FROM (a.data_fim_trial - now()))::integer
    ELSE 0 
  END
  FROM assinaturas a
  WHERE a.conta_id = conta_uuid;
$$;
```

---

## 🚀 2. Fluxo Completo de Cadastro de Usuário

### 📋 A. Passos do Cadastro (Ordem Crítica)

#### **Passo 1: Validações Iniciais**
```typescript
// 1.1 Validar CPF/CNPJ único
const cpfJaExiste = await supabase
  .from('usuarios')
  .select('id')
  .eq('documento', cpfFormatado)
  .single();

if (cpfJaExiste.data) {
  throw new Error('CPF/CNPJ já cadastrado');
}

// 1.2 Validar email único
const emailJaExiste = await supabase
  .from('usuarios')
  .select('id')
  .eq('email', email)
  .single();

if (emailJaExiste.data) {
  throw new Error('Email já cadastrado');
}
```

#### **Passo 2: Criar Conta Principal**
```typescript
// 2.1 Determinar tipo de conta baseado no documento
const tipoConta = cpf.length === 11 ? 'INDIVIDUAL' : 'IMOBILIARIA';

// 2.2 Criar registro na tabela contas
const { data: novaConta, error: erroNovaConta } = await supabase
  .from('contas')
  .insert({
    nome_conta: nomeCompleto,
    tipo_conta: tipoConta,
    documento: cpfFormatado,
    data_criacao: new Date().toISOString()
  })
  .select()
  .single();

if (erroNovaConta) throw erroNovaConta;
```

#### **Passo 3: Preparar Dados para Futuro Cliente Asaas (NÃO CRIAR AINDA)**
```typescript
// 3.1 Apenas preparar dados - cliente será criado no Asaas apenas quando pagar
// Isso evita "lixo" no banco do Asaas com trials que nunca convertem

const dadosParaAsaas = {
  name: nomeCompleto,
  email: email,
  cpfCnpj: cpfFormatado,
  phone: whatsappFormatado,
  mobilePhone: whatsappFormatado,
  // Campos opcionais se coletados no futuro
  address: endereco?.logradouro,
  addressNumber: endereco?.numero,
  complement: endereco?.complemento,
  province: endereco?.bairro,
  city: endereco?.cidade,
  state: endereco?.estado,
  postalCode: endereco?.cep
};

// 3.2 Salvar dados preparados para uso posterior (quando pagar)
// id_cliente_asaas ficará NULL durante o trial
```

#### **Passo 4: Criar Usuário Local**
```typescript
// 4.1 Inserir na tabela usuarios (sem id_cliente_asaas durante trial)
const { data: novoUsuario, error: erroNovoUsuario } = await supabase
  .from('usuarios')
  .insert({
    conta_id: novaConta.id,
    nome: nomeCompleto,
    email: email,
    documento: cpfFormatado,
    whatsapp: whatsappFormatado,
    // id_cliente_asaas: NULL (será preenchido apenas quando pagar)
    fonte_cadastro: 'SITE',
    data_criacao: new Date().toISOString(),
    // Salvar dados para Asaas como JSON para uso posterior
    dados_asaas: dadosParaAsaas
  })
  .select()
  .single();

if (erroNovoUsuario) throw erroNovoUsuario;
```

#### **Passo 5: Criar Corretor (Dono da Conta)**
```typescript
// 5.1 Criar corretor principal (DONO)
const { data: novoCorretor, error: erroNovoCorretor } = await supabase
  .from('corretores')
  .insert({
    conta_id: novaConta.id,
    nome: nomeCompleto,
    email: email,
    hash_senha: 'magic_link', // Placeholder para magic link
    funcao: 'DONO'
  })
  .select()
  .single();

if (erroNovoCorretor) throw erroNovoCorretor;
```

#### **Passo 6: Criar Assinatura Trial**
```typescript
// 6.1 Definir datas do trial
const dataInicioTrial = new Date();
const dataFimTrial = new Date(Date.now() + (7 * 24 * 60 * 60 * 1000)); // +7 dias
const dataProximaCobranca = new Date(dataFimTrial.getTime() + (24 * 60 * 60 * 1000)); // +1 dia após trial

// 6.2 Buscar plano padrão (ou plano escolhido)
const { data: plano } = await supabase
  .from('planos')
  .select('*')
  .eq('codigo_externo', 'individual') // ou o plano escolhido
  .eq('is_ativo', true)
  .single();

// 6.3 Criar assinatura
const { data: novaAssinatura, error: erroNovaAssinatura } = await supabase
  .from('assinaturas')
  .insert({
    conta_id: novaConta.id,
    plano_id: plano.id,
    status: 'TRIAL',
    data_inicio_trial: dataInicioTrial.toISOString(),
    data_fim_trial: dataFimTrial.toISOString(),
    data_proxima_cobranca: dataProximaCobranca.toISOString().split('T')[0], // Apenas data
    tentativas_cobranca: 0,
    metadata_asaas: {
      customer_id: clienteAsaas.id,
      plan_name: plano.nome_plano
    }
  })
  .select()
  .single();

if (erroNovaAssinatura) throw erroNovaAssinatura;
```

#### **Passo 7: Criar Auth User (Magic Link)**
```typescript
// 7.1 Criar usuário no Supabase Auth
const { data: authUser, error: authError } = await supabase.auth.signIn({
  email: email,
  options: {
    redirectTo: `${window.location.origin}/app/welcome`,
    data: {
      // Metadata personalizada
      conta_id: novaConta.id,
      corretor_id: novoCorretor.id,
      nome: nomeCompleto,
      is_new_user: true
    }
  }
});

if (authError) throw authError;
```

#### **Passo 8: Atualizar Relação Auth User**
```typescript
// 8.1 Atualizar usuario com auth_user_id quando disponível
// Isso será feito via trigger do banco ou webhook
// Trigger: handle_new_auth_user já existe e fará essa associação
```

### 📧 B. Notificações e Onboarding

#### **Email de Boas-vindas**
```typescript
// Enviar email de boas-vindas com guia
const emailData = {
  to: email,
  template: 'welcome-trial',
  data: {
    nome: nomeCompleto,
    dias_trial: 7,
    data_expiracao: dataFimTrial.toLocaleDateString('pt-BR'),
    link_app: `${window.location.origin}/app`,
    features_liberadas: [
      'Guia de Conversas com IA',
      'Memória Inteligente de Clientes',
      'Lembretes Personalizados',
      'Dashboard de Performance'
    ]
  }
};

await emailService.send(emailData);
```

#### **Setup Inicial da Conta**
```typescript
// Criar dados iniciais para nova conta
const setupInicial = async (contaId: string) => {
  // Criar tags padrão
  await supabase.from('tags').insert([
    { conta_id: contaId, nome: 'Cliente Potencial', cor: '#3B82F6' },
    { conta_id: contaId, nome: 'Negociação', cor: '#F59E0B' },
    { conta_id: contaId, nome: 'Fechado', cor: '#10B981' }
  ]);

  // Criar funil padrão
  await supabase.from('funis').insert({
    conta_id: contaId,
    nome: 'Funil Principal',
    etapas: ['Lead', 'Qualificado', 'Proposta', 'Negociação', 'Fechado']
  });

  // Criar configurações padrão
  await supabase.from('configuracoes_conta').insert({
    conta_id: contaId,
    timezone: 'America/Sao_Paulo',
    idioma: 'pt-BR',
    notificacoes_email: true,
    notificacoes_whatsapp: true
  });
};
```

---

## ⚙️ 3. Componentes Frontend

### 🎨 A. Hook de Assinatura

```typescript
// src/hooks/useAssinatura.ts
export const useAssinatura = () => {
  const [assinatura, setAssinatura] = useState(null);
  const [carregando, setCarregando] = useState(true);
  
  const buscarAssinatura = useCallback(async () => {
    const user = supabase.auth.user();
    if (!user) return;

    const { data } = await supabase
      .from('assinaturas')
      .select(`
        *,
        plano:planos(*),
        conta:contas(*)
      `)
      .eq('conta_id', user.user_metadata.conta_id)
      .single();

    setAssinatura(data);
    setCarregando(false);
  }, []);

  const diasRestantes = useMemo(() => {
    if (!assinatura || assinatura.status !== 'TRIAL') return 0;
    
    const hoje = new Date();
    const fimTrial = new Date(assinatura.data_fim_trial);
    const diff = Math.ceil((fimTrial.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diff);
  }, [assinatura]);

  const temAcessoAtivo = useMemo(() => {
    if (!assinatura) return false;
    
    if (assinatura.status === 'ATIVO') return true;
    if (assinatura.status === 'TRIAL') {
      return diasRestantes > 0;
    }
    
    return false;
  }, [assinatura, diasRestantes]);

  return {
    assinatura,
    carregando,
    diasRestantes,
    temAcessoAtivo,
    buscarAssinatura
  };
};
```

### 🎨 B. Componente Trial Banner

```typescript
// src/components/TrialBanner.tsx
export const TrialBanner = () => {
  const { assinatura, diasRestantes } = useAssinatura();
  const [mostrarModal, setMostrarModal] = useState(false);

  if (!assinatura || assinatura.status !== 'TRIAL') return null;

  const isUrgente = diasRestantes <= 2;
  
  return (
    <div className={cn(
      "p-4 text-white",
      isUrgente 
        ? "bg-gradient-to-r from-red-500 to-red-600" 
        : "bg-gradient-to-r from-orange-500 to-orange-600"
    )}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <Zap className="h-5 w-5" />
          <div>
            <p className="font-medium">
              {diasRestantes > 0 
                ? `🚀 Teste grátis - ${diasRestantes} ${diasRestantes === 1 ? 'dia restante' : 'dias restantes'}`
                : '⏰ Seu teste grátis expirou'
              }
            </p>
            <p className="text-sm opacity-90">
              Assine agora e continue aproveitando todas as funcionalidades
            </p>
          </div>
        </div>
        
        <Button 
          variant="secondary"
          onClick={() => setMostrarModal(true)}
          className="bg-white text-orange-600 hover:bg-gray-100"
        >
          {diasRestantes > 0 ? 'Assinar Agora' : 'Reativar Conta'}
        </Button>
      </div>

      <ModalAssinatura 
        isOpen={mostrarModal}
        onClose={() => setMostrarModal(false)}
        plano={assinatura.plano}
        isUrgente={isUrgente}
      />
    </div>
  );
};
```

### 🎨 C. Modal de Conversão

```typescript
// src/components/ModalAssinatura.tsx
export const ModalAssinatura = ({ isOpen, onClose, plano, isUrgente }) => {
  const [carregando, setCarregando] = useState(false);
  const [formaPagamento, setFormaPagamento] = useState('CREDIT_CARD');

  const criarAssinatura = async () => {
    setCarregando(true);
    
    try {
      const response = await fetch('/api/assinaturas/criar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plano_id: plano.id,
          forma_pagamento: formaPagamento,
          ciclo: 'MONTHLY' // ou 'YEARLY'
        })
      });

      const { subscription_url } = await response.json();
      
      // Redirecionar para página de pagamento do Asaas
      window.location.href = subscription_url;
      
    } catch (error) {
      console.error('Erro ao criar assinatura:', error);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isUrgente ? '⏰ Última chance!' : '🚀 Continue com o Guido'}
          </DialogTitle>
          <DialogDescription>
            Assine agora e tenha acesso completo a todas as funcionalidades
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Plano selecionado */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="font-medium">{plano.nome_plano}</h3>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold">
                R$ {plano.preco_mensal.toFixed(2)}
              </span>
              <span className="text-gray-600">/mês</span>
            </div>
            
            {isUrgente && (
              <Badge variant="destructive" className="mt-2">
                🔥 Oferta especial: 30% OFF no primeiro mês
              </Badge>
            )}
          </div>

          {/* Forma de pagamento */}
          <div>
            <Label>Forma de Pagamento</Label>
            <RadioGroup value={formaPagamento} onValueChange={setFormaPagamento}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="CREDIT_CARD" id="card" />
                <Label htmlFor="card">💳 Cartão de Crédito</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="PIX" id="pix" />
                <Label htmlFor="pix">🔸 PIX</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="BOLETO" id="boleto" />
                <Label htmlFor="boleto">📄 Boleto</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Benefícios */}
          <div>
            <h4 className="font-medium mb-2">✨ O que você terá:</h4>
            <ul className="text-sm space-y-1 text-gray-600">
              <li>✅ Guia de Conversas com IA</li>
              <li>✅ Memória Inteligente ilimitada</li>
              <li>✅ Lembretes automáticos</li>
              <li>✅ Dashboard completo</li>
              <li>✅ Suporte prioritário</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Decidir depois
          </Button>
          <Button 
            onClick={criarAssinatura}
            disabled={carregando}
            className="bg-gradient-to-r from-orange-500 to-red-500"
          >
            {carregando ? 'Processando...' : 'Assinar Agora'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
```

---

## 🏢 4. Modelo de Negócio - Imobiliárias vs Individuais

### 🎯 A. Diferenças dos Modelos

#### **🏠 Individual (B2C)**
- 1 corretor = 1 conta = 1 assinatura
- Corretor paga sua própria assinatura
- Trial individual de 7 dias
- Cobrança direta do corretor

#### **🏢 Imobiliária (B2B)**  
- 1 imobiliária = 1 conta master = 1 assinatura
- Admin da imobiliária gerencia todos os corretores
- Trial para toda a imobiliária (testam com todos os corretores)
- Cobrança baseada no número de corretores ativos
- Imobiliária paga por todos os corretores

### 📊 B. Ajustes no Schema para Imobiliárias

```sql
-- Adicionar campos para controle de imobiliárias
ALTER TABLE contas ADD COLUMN IF NOT EXISTS max_corretores int DEFAULT 1;
ALTER TABLE contas ADD COLUMN IF NOT EXISTS admin_principal_id uuid REFERENCES corretores(id);

-- Adicionar função para responsável pela cobrança
ALTER TABLE assinaturas ADD COLUMN IF NOT EXISTS responsavel_pagamento varchar(50) DEFAULT 'CONTA_PROPRIA';
-- Valores: 'CONTA_PROPRIA' (individual) ou 'ADMIN_CONTA' (imobiliária)

-- Adicionar tabela para convites de corretores (imobiliárias)
CREATE TABLE IF NOT EXISTS convites_corretor (
  id uuid primary key default gen_random_uuid(),
  conta_id uuid not null references contas(id) on delete cascade,
  email_convidado varchar(255) not null,
  nome_convidado varchar(255) not null,
  codigo_convite varchar(100) not null unique,
  admin_convite_id uuid not null references corretores(id),
  status varchar(50) not null check (status in ('PENDENTE','ACEITO','EXPIRADO')) default 'PENDENTE',
  data_criacao timestamptz not null default now(),
  data_expiracao timestamptz not null default (now() + interval '7 days')
);
```

### 🔄 C. Fluxo Cadastro Imobiliária

#### **Admin Principal (Primeiro Usuário)**
```typescript
// Cadastro do admin segue fluxo normal, mas:
const novaAssinatura = {
  conta_id: contaId,
  plano_id: planoImobiliaria, // Plano específico para imobiliárias
  status: 'TRIAL',
  responsavel_pagamento: 'ADMIN_CONTA', // Admin paga por todos
  // ... demais campos
};

// Atualizar conta com limite de corretores
await supabase
  .from('contas')
  .update({ 
    max_corretores: plano.limite_corretores, // Ex: 10, 25, 50, ilimitado
    admin_principal_id: novoCorretor.id 
  })
  .eq('id', contaId);
```

#### **Convite de Corretores**
```typescript
// Admin convida novos corretores
const criarConvite = async (emailCorretor: string, nomeCorretor: string) => {
  const codigoConvite = generateUniqueCode(); // UUID ou código amigável
  
  const { data: convite } = await supabase
    .from('convites_corretor')
    .insert({
      conta_id: adminContaId,
      email_convidado: emailCorretor,
      nome_convidado: nomeCorretor,
      codigo_convite: codigoConvite,
      admin_convite_id: adminCorretorId
    })
    .select()
    .single();

  // Enviar email de convite
  await emailService.send({
    template: 'convite-corretor',
    to: emailCorretor,
    data: {
      nome_corretor: nomeCorretor,
      nome_imobiliaria: nomeImobiliaria,
      link_aceitar: `${SITE_URL}/aceitar-convite/${codigoConvite}`,
      nome_admin: nomeAdmin
    }
  });
};
```

#### **Aceitar Convite**
```typescript
// Corretor aceita convite via link
const aceitarConvite = async (codigoConvite: string) => {
  // 1. Buscar convite válido
  const { data: convite } = await supabase
    .from('convites_corretor')
    .select(`
      *,
      conta:contas(*),
      admin:corretores(nome)
    `)
    .eq('codigo_convite', codigoConvite)
    .eq('status', 'PENDENTE')
    .gt('data_expiracao', new Date().toISOString())
    .single();

  if (!convite) throw new Error('Convite inválido ou expirado');

  // 2. Verificar limite de corretores
  const { count: corretoresAtivos } = await supabase
    .from('corretores')
    .select('id', { count: 'exact' })
    .eq('conta_id', convite.conta_id);

  if (corretoresAtivos >= convite.conta.max_corretores) {
    throw new Error('Limite de corretores atingido');
  }

  // 3. Criar corretor na conta da imobiliária
  const { data: novoCorretor } = await supabase
    .from('corretores')
    .insert({
      conta_id: convite.conta_id,
      nome: convite.nome_convidado,
      email: convite.email_convidado,
      hash_senha: 'magic_link',
      funcao: 'AGENTE' // Não é admin
    })
    .select()
    .single();

  // 4. Marcar convite como aceito
  await supabase
    .from('convites_corretor')
    .update({ status: 'ACEITO' })
    .eq('id', convite.id);

  // 5. Enviar magic link
  await supabase.auth.signIn({
    email: convite.email_convidado,
    options: {
      redirectTo: `${SITE_URL}/app/welcome-team`,
      data: {
        conta_id: convite.conta_id,
        corretor_id: novoCorretor.id,
        is_new_team_member: true
      }
    }
  });
};
```

### 💰 D. Cobrança Diferenciada

#### **Individual**
```typescript
// Cobrança simples: 1 corretor = 1 assinatura fixa
const valor = plano.preco_mensal; // Ex: R$ 97/mês
```

#### **Imobiliária**
```typescript
// Cobrança por corretor ativo
const calcularValorImobiliaria = async (contaId: string) => {
  // Contar corretores ativos
  const { count: corretoresAtivos } = await supabase
    .from('corretores')
    .select('id', { count: 'exact' })
    .eq('conta_id', contaId);

  // Buscar plano com pricing por corretor
  const { data: plano } = await supabase
    .from('planos')
    .select('*')
    .eq('codigo_externo', 'imobiliaria')
    .single();

  // Calcular valor total
  const valorPorCorretor = plano.preco_mensal; // Ex: R$ 67/corretor
  const valorTotal = corretoresAtivos * valorPorCorretor;
  
  // Aplicar desconto por volume (opcional)
  let desconto = 0;
  if (corretoresAtivos >= 20) desconto = 0.2; // 20% para 20+
  else if (corretoresAtivos >= 10) desconto = 0.1; // 10% para 10+
  
  return valorTotal * (1 - desconto);
};
```

### 🎛️ E. Dashboard Admin Imobiliária

```typescript
// Componente para admin gerenciar equipe
const DashboardImobiliaria = () => {
  const [corretores, setCorretores] = useState([]);
  const [convitesPendentes, setConvitesPendentes] = useState([]);
  const { assinatura } = useAssinatura();

  const buscarEquipe = async () => {
    // Corretores ativos
    const { data: corretoresData } = await supabase
      .from('corretores')
      .select('*')
      .eq('conta_id', user.conta_id);

    // Convites pendentes  
    const { data: convitesData } = await supabase
      .from('convites_corretor')
      .select('*')
      .eq('conta_id', user.conta_id)
      .eq('status', 'PENDENTE');

    setCorretores(corretoresData);
    setConvitesPendentes(convitesData);
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent>
            <h3>Corretores Ativos</h3>
            <p className="text-2xl font-bold">{corretores.length}</p>
            <p className="text-sm text-gray-600">
              de {assinatura.conta.max_corretores} disponíveis
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <h3>Convites Pendentes</h3>
            <p className="text-2xl font-bold">{convitesPendentes.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <h3>Próxima Cobrança</h3>
            <p className="text-2xl font-bold">
              R$ {calcularProximaCobranca()}
            </p>
            <p className="text-sm text-gray-600">
              {assinatura.data_proxima_cobranca}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de corretores + botão convidar */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2>Equipe de Corretores</h2>
          <Button onClick={abrirModalConvite}>
            + Convidar Corretor
          </Button>
        </div>
        
        {/* Tabela de corretores */}
        <TabelaCorretores corretores={corretores} />
        
        {/* Convites pendentes */}
        {convitesPendentes.length > 0 && (
          <ConvitesPendentes convites={convitesPendentes} />
        )}
      </div>
    </div>
  );
};
```

### 🔒 F. RLS para Imobiliárias

```sql
-- Política que permite corretores verem apenas dados da sua conta
CREATE POLICY corretores_mesma_conta ON corretores
  FOR ALL USING (
    conta_id = get_current_conta_id()
  );

-- Política que permite apenas admin convidar corretores
CREATE POLICY convites_apenas_admin ON convites_corretor
  FOR INSERT WITH CHECK (
    admin_convite_id = get_current_corretor_id() AND
    is_conta_admin(get_current_corretor_id())
  );

-- Função para verificar se corretor é admin
CREATE OR REPLACE FUNCTION is_conta_admin(corretor_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM corretores 
    WHERE id = corretor_uuid 
    AND funcao IN ('DONO', 'ADMIN')
  );
$$;
```

---

## 🔗 5. APIs e Integrações

### 🚀 A. API para Criar Assinatura

```typescript
// src/pages/api/assinaturas/criar.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const user = await getUser(req); // Função para obter usuário autenticado
    const { plano_id, forma_pagamento, ciclo } = req.body;

    // 1. Buscar dados da conta
    const { data: assinatura } = await supabase
      .from('assinaturas')
      .select(`
        *,
        conta:contas(*),
        plano:planos(*)
      `)
      .eq('conta_id', user.conta_id)
      .single();

    // 2. Buscar usuário e criar cliente no Asaas se necessário
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('id_cliente_asaas, dados_asaas')
      .eq('conta_id', user.conta_id)
      .single();

    let clienteAsaasId = usuario.id_cliente_asaas;

    // 2.1 Se não tem cliente no Asaas, criar agora (primeiro pagamento)
    if (!clienteAsaasId) {
      const clienteAsaas = await asaasClient.customers.create(usuario.dados_asaas);
      
      // Salvar ID do cliente criado
      await supabase
        .from('usuarios')
        .update({ id_cliente_asaas: clienteAsaas.id })
        .eq('conta_id', user.conta_id);
        
      clienteAsaasId = clienteAsaas.id;
    }

    // 3. Calcular valor (com desconto se aplicável)
    const valor = ciclo === 'YEARLY' 
      ? assinatura.plano.preco_anual 
      : assinatura.plano.preco_mensal;

    // 4. Criar assinatura no Asaas
    const assinaturaAsaas = await asaasClient.subscriptions.create({
      customer: clienteAsaasId,
      billingType: forma_pagamento,
      value: valor,
      nextDueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Amanhã
      cycle: ciclo,
      description: `${assinatura.plano.nome_plano} - Guido`,
      externalReference: assinatura.id,
      callback: {
        successUrl: `${process.env.NEXT_PUBLIC_URL}/app/assinatura/sucesso`,
        autoRedirect: true
      }
    });

    // 5. Atualizar assinatura local
    await supabase
      .from('assinaturas')
      .update({
        id_gateway_pagamento: assinaturaAsaas.id,
        status: 'PAGAMENTO_PENDENTE'
      })
      .eq('id', assinatura.id);

    res.status(200).json({
      success: true,
      subscription_url: assinaturaAsaas.invoiceUrl
    });

  } catch (error) {
    console.error('Erro ao criar assinatura:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
```

### 🔔 B. Webhook do Asaas

```typescript
// src/pages/api/webhooks/asaas.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const webhook = req.body;
    
    // Verificar assinatura do webhook (segurança)
    const signature = req.headers['asaas-signature'];
    if (!verifyWebhookSignature(webhook, signature)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    switch (webhook.event) {
      case 'PAYMENT_RECEIVED':
        await handlePaymentReceived(webhook.payment);
        break;
        
      case 'PAYMENT_OVERDUE':
        await handlePaymentOverdue(webhook.payment);
        break;
        
      case 'SUBSCRIPTION_CANCELLED':
        await handleSubscriptionCancelled(webhook.subscription);
        break;
        
      case 'INVOICE_CREATED':
        await handleInvoiceCreated(webhook.invoice);
        break;
    }

    res.status(200).json({ success: true });

  } catch (error) {
    console.error('Erro no webhook:', error);
    res.status(500).json({ error: 'Erro interno' });
  }
}

async function handlePaymentReceived(payment: any) {
  // Atualizar fatura para PAGO
  await supabase
    .from('faturas')
    .update({
      status: 'PAGO',
      data_pagamento: new Date().toISOString()
    })
    .eq('id_gateway_pagamento', payment.id);

  // Atualizar assinatura para ATIVO
  await supabase
    .from('assinaturas')
    .update({
      status: 'ATIVO',
      data_proxima_cobranca: payment.nextDueDate,
      tentativas_cobranca: 0
    })
    .eq('id_gateway_pagamento', payment.subscription);

  // Enviar email de confirmação
  await emailService.send({
    template: 'payment-confirmed',
    to: payment.customer.email,
    data: { valor: payment.value, data: payment.dateCreated }
  });
}

async function handlePaymentOverdue(payment: any) {
  // Incrementar tentativas
  const { data: assinatura } = await supabase
    .from('assinaturas')
    .select('tentativas_cobranca')
    .eq('id_gateway_pagamento', payment.subscription)
    .single();

  const novasTentativas = (assinatura?.tentativas_cobranca || 0) + 1;

  await supabase
    .from('assinaturas')
    .update({
      status: 'PAGAMENTO_PENDENTE',
      tentativas_cobranca: novasTentativas
    })
    .eq('id_gateway_pagamento', payment.subscription);

  // Enviar email de cobrança
  await emailService.send({
    template: 'payment-overdue',
    to: payment.customer.email,
    data: { 
      valor: payment.value,
      link_pagamento: payment.invoiceUrl,
      tentativa: novasTentativas
    }
  });
}
```

---

## ⏰ 5. Automações e Cron Jobs

### 📅 A. Edge Function - Verificar Trials Expirando

```typescript
// supabase/functions/check-expiring-trials/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  try {
    // Buscar trials expirando em 3 dias
    const { data: trialsExpirando } = await supabase
      .from('assinaturas')
      .select(`
        *,
        conta:contas(*),
        usuarios:usuarios(email, nome)
      `)
      .eq('status', 'TRIAL')
      .gte('data_fim_trial', new Date().toISOString())
      .lte('data_fim_trial', new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString());

    for (const trial of trialsExpirando) {
      const diasRestantes = Math.ceil(
        (new Date(trial.data_fim_trial).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );

      // Enviar email baseado nos dias restantes
      let template = '';
      if (diasRestantes === 3) template = 'trial-expires-3-days';
      else if (diasRestantes === 1) template = 'trial-expires-1-day';
      else if (diasRestantes === 0) template = 'trial-expired';

      if (template) {
        await emailService.send({
          template,
          to: trial.usuarios.email,
          data: {
            nome: trial.usuarios.nome,
            dias_restantes: diasRestantes,
            link_assinatura: `${Deno.env.get('SITE_URL')}/app/assinatura`
          }
        });
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
})
```

### ⚡ B. Edge Function - Processar Expiração de Trials

```typescript
// supabase/functions/process-expired-trials/index.ts
serve(async (req) => {
  try {
    // Buscar trials expirados
    const { data: trialsExpirados } = await supabase
      .from('assinaturas')
      .select('*')
      .eq('status', 'TRIAL')
      .lt('data_fim_trial', new Date().toISOString());

    for (const trial of trialsExpirados) {
      // Atualizar status para CANCELADO
      await supabase
        .from('assinaturas')
        .update({
          status: 'CANCELADO',
          motivo_cancelamento: 'TRIAL_EXPIRADO'
        })
        .eq('id', trial.id);

      // Log da expiração
      console.log(`Trial expirado para conta ${trial.conta_id}`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      processados: trialsExpirados.length 
    }), {
      headers: { "Content-Type": "application/json" },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
})
```

---

## 📊 6. Métricas e Dashboard

### 📈 A. Hook para Métricas

```typescript
// src/hooks/useMetricasAssinatura.ts
export const useMetricasAssinatura = () => {
  const [metricas, setMetricas] = useState(null);

  const buscarMetricas = useCallback(async () => {
    const { data } = await supabase.rpc('get_metricas_assinatura');
    setMetricas(data);
  }, []);

  return { metricas, buscarMetricas };
};
```

### 🔢 B. Function SQL para Métricas

```sql
-- Função para calcular métricas importantes
CREATE OR REPLACE FUNCTION get_metricas_assinatura()
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT jsonb_build_object(
    'total_trials_ativos', (
      SELECT count(*) FROM assinaturas 
      WHERE status = 'TRIAL' AND data_fim_trial > now()
    ),
    'total_assinantes_ativos', (
      SELECT count(*) FROM assinaturas WHERE status = 'ATIVO'
    ),
    'taxa_conversao_trial', (
      SELECT CASE 
        WHEN count(*) FILTER (WHERE status IN ('TRIAL', 'CANCELADO')) > 0 
        THEN round(
          (count(*) FILTER (WHERE status = 'ATIVO')::decimal / 
           count(*) FILTER (WHERE status IN ('TRIAL', 'ATIVO', 'CANCELADO'))) * 100, 2
        )
        ELSE 0 
      END
      FROM assinaturas
    ),
    'mrr', (
      SELECT sum(p.preco_mensal)
      FROM assinaturas a
      JOIN planos p ON a.plano_id = p.id
      WHERE a.status = 'ATIVO'
    ),
    'trials_expirando_hoje', (
      SELECT count(*) FROM assinaturas 
      WHERE status = 'TRIAL' 
      AND date(data_fim_trial) = date(now())
    )
  );
$$;
```

---

## 🎯 7. Checklist de Implementação

### ✅ Fase 1: Base (Semana 1)
- [ ] Ajustar schema do banco de dados
- [ ] Criar funções SQL auxiliares
- [ ] Implementar fluxo completo de cadastro
- [ ] Criar hook useAssinatura
- [ ] Implementar TrialBanner
- [ ] Testar cadastro end-to-end

### ✅ Fase 2: Integração Asaas (Semana 2)  
- [ ] Configurar cliente Asaas
- [ ] Implementar criação de clientes
- [ ] Implementar criação de assinaturas
- [ ] Configurar webhooks
- [ ] Implementar ModalAssinatura
- [ ] Testar fluxo de pagamento

### ✅ Fase 3: Automações (Semana 3)
- [ ] Criar Edge Functions
- [ ] Configurar cron jobs
- [ ] Implementar emails transacionais
- [ ] Configurar métricas
- [ ] Testes de expiração
- [ ] Monitoramento

### ✅ Fase 4: Polimento (Semana 4)
- [ ] UX/UI refinado
- [ ] Testes A/B de conversão
- [ ] Documentação completa
- [ ] Deploy em produção
- [ ] Monitoramento ativo

---

## 🚨 Pontos de Atenção

### ⚠️ Segurança
- **Webhook signature**: Sempre verificar assinatura dos webhooks do Asaas
- **RLS policies**: Garantir que dados ficam isolados por conta
- **API keys**: Nunca expor chaves do Asaas no frontend
- **Validações**: Dupla validação (frontend + backend) em todos os fluxos

### ⚠️ UX/Performance
- **Loading states**: Sempre mostrar feedback durante operações
- **Error handling**: Mensagens claras e actionables para o usuário
- **Offline support**: Graceful degradation quando sem internet
- **Mobile first**: Interface otimizada para mobile

### ⚠️ Monitoramento
- **Logs estruturados**: Para facilitar debugging
- **Alertas**: Para falhas críticas (webhooks, expiração de trials)
- **Métricas**: Acompanhar conversão, churn, MRR
- **Health checks**: Endpoints para verificar saúde dos serviços

---

## 📞 Próximos Passos

1. **Validar estrutura** com time técnico
2. **Configurar ambiente** de desenvolvimento com Asaas sandbox
3. **Implementar Fase 1** com testes unitários
4. **Configurar CI/CD** para deploys automáticos
5. **Documentar APIs** para integração com outros sistemas

---

## 📋 10. Resumo dos Modelos de Negócio

### 🏠 **Corretor Individual (B2C)**
```
Cadastro → Trial 7 dias → Conversão Individual
├── 1 usuário = 1 conta = 1 assinatura
├── Trial: Acesso completo por 7 dias
├── Pagamento: R$ 97/mês fixo
├── Cliente Asaas: Criado apenas quando pagar
└── Gestão: Autogerido pelo próprio corretor
```

### 🏢 **Imobiliária (B2B)**
```
Admin Cadastra → Convida Corretores → Trial Coletivo → Pagamento por Sede
├── 1 admin = 1 conta master = múltiplos corretores
├── Trial: 7 dias para toda equipe testar
├── Pagamento: R$ 67/corretor ativo + descontos por volume
├── Cliente Asaas: Criado quando admin pagar
├── Gestão: Admin controla equipe + assinatura
└── Convites: Sistema de convite por email com códigos únicos
```

### 🔄 **Principais Diferenças Técnicas**

| Aspecto | Individual | Imobiliária |
|---------|------------|-------------|
| **Schema** | `responsavel_pagamento: 'CONTA_PROPRIA'` | `responsavel_pagamento: 'ADMIN_CONTA'` |
| **Cobrança** | Valor fixo | Valor × número de corretores |
| **Limite** | 1 corretor | Configurável (10, 25, 50, ∞) |
| **Convites** | N/A | Sistema de convites com códigos |
| **Dashboard** | Individual | Admin + visão de equipe |
| **RLS** | Por conta individual | Por conta + permissões admin |

### ⚡ **Fluxos Simplificados**

#### **🏠 Individual**
```
1. Usuário cadastra
2. Cria conta individual
3. Trial 7 dias
4. Conversão → cria cliente Asaas → assinatura fixa
```

#### **🏢 Imobiliária**  
```
1. Admin cadastra (imobiliária)
2. Trial 7 dias para equipe
3. Admin convida corretores → aceite via link
4. Conversão → cliente Asaas → cobrança por cabeça
5. Admin gerencia equipe + pagamentos
```

**🎯 Meta: Sistema completo funcionando em 4 semanas!**
