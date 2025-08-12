## Fase 5A — Banco de Dados (PostgreSQL/Supabase): Schema, RLS e pgvector

Objetivo: definir o esquema completo multi-tenant, habilitar RLS e preparar extensões (pgcrypto, pgjwt, pgvector) no PostgreSQL 14+ (Supabase recomendado).

### SGBD recomendado
- PostgreSQL 14+
- Extensões: `pgcrypto`, `uuid-ossp` (se necessário), `pgvector`, `pg_trgm` (opcional)

### Arquitetura
- Multi-tenant com tabela `contas` e colunas `conta_id` nas tabelas sensíveis.
- Segurança via Row-Level Security (RLS) em todas as tabelas de dados do cliente.
- Chaves: `UUID` para entidades principais; `INT` para catálogo de `planos`.

### Esquema (DDL)

AI dev note: Ajuste tipos ENUM para `CHECK` + `VARCHAR` se preferir portabilidade. Abaixo, uso `VARCHAR` com `CHECK` para compatibilidade.

```sql
-- Extensões
create extension if not exists pgcrypto;
create extension if not exists "uuid-ossp";
create extension if not exists vector; -- pgvector

-- 1) planos
create table if not exists planos (
  id serial primary key,
  nome_plano varchar(100) not null,
  codigo_externo varchar(100) not null unique,
  preco_mensal numeric(10,2) not null,
  preco_anual numeric(10,2),
  limite_corretores int not null,
  descricao text,
  is_ativo boolean not null default true
);

-- 2) contas
create table if not exists contas (
  id uuid primary key default gen_random_uuid(),
  nome_conta varchar(255) not null,
  tipo_conta varchar(50) not null check (tipo_conta in ('IMOBILIARIA','INDIVIDUAL')),
  documento varchar(18) not null unique,
  data_criacao timestamptz not null default now()
);

-- 3) assinaturas
create table if not exists assinaturas (
  id uuid primary key default gen_random_uuid(),
  conta_id uuid not null unique references contas(id) on delete cascade,
  plano_id int not null references planos(id),
  status varchar(50) not null check (status in ('TRIAL','ATIVO','PAGAMENTO_PENDENTE','CANCELADO')),
  data_fim_trial timestamptz,
  data_proxima_cobranca date,
  id_gateway_pagamento varchar(255) unique
);

-- 4) faturas
create table if not exists faturas (
  id uuid primary key default gen_random_uuid(),
  assinatura_id uuid not null references assinaturas(id) on delete cascade,
  valor numeric(10,2) not null,
  status varchar(50) not null check (status in ('PENDENTE','PAGO','FALHOU','REEMBOLSADO')),
  data_vencimento date not null,
  data_pagamento timestamptz,
  url_documento text,
  id_gateway_pagamento varchar(255) unique
);

-- 5) corretores
create table if not exists corretores (
  id uuid primary key default gen_random_uuid(),
  conta_id uuid not null references contas(id) on delete cascade,
  nome varchar(255) not null,
  email varchar(255) not null unique,
  hash_senha text not null,
  funcao varchar(50) not null check (funcao in ('DONO','ADMIN','AGENTE'))
);

-- 6) conexoes_externas
create table if not exists conexoes_externas (
  id uuid primary key default gen_random_uuid(),
  conta_id uuid not null references contas(id) on delete cascade,
  plataforma varchar(100) not null,
  chave_api_criptografada text not null,
  status varchar(50) not null check (status in ('ATIVA','INATIVA','ERRO_AUTENTICACAO'))
);

-- 7) clientes
create table if not exists clientes (
  id uuid primary key default gen_random_uuid(),
  conta_id uuid not null references contas(id) on delete cascade,
  corretor_id uuid references corretores(id) on delete set null,
  nome varchar(255) not null,
  telefone varchar(20),
  email varchar(255),
  status_funil varchar(50),
  data_criacao timestamptz not null default now()
);

-- 8) conversas
create table if not exists conversas (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references clientes(id) on delete cascade,
  plataforma varchar(50) not null,
  status_conversa varchar(50) not null check (status_conversa in ('AGUARDANDO_CORRETOR','AGUARDANDO_CLIENTE','FINALIZADA')),
  timestamp_ultima_mensagem timestamptz
);

-- 9) mensagens
create table if not exists mensagens (
  id uuid primary key default gen_random_uuid(),
  conversa_id uuid not null references conversas(id) on delete cascade,
  remetente varchar(50) not null check (remetente in ('CORRETOR','CLIENTE','SISTEMA')),
  conteudo_texto text not null,
  timestamp timestamptz not null,
  embedding_vetorial vector(1536) -- ajustar dimensão conforme modelo
);

-- 10) lembretes
create table if not exists lembretes (
  id uuid primary key default gen_random_uuid(),
  corretor_id uuid not null references corretores(id) on delete cascade,
  cliente_id uuid references clientes(id) on delete set null,
  descricao text not null,
  data_lembrete timestamptz not null,
  status varchar(50) not null check (status in ('PENDENTE','CONCLUIDO'))
);

-- 11) dossies_ia
create table if not exists dossies_ia (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null unique references clientes(id) on delete cascade,
  resumo_gerado text,
  sentimento_geral varchar(50),
  ultima_atualizacao timestamptz
);
```

### Índices recomendados
```sql
create index if not exists idx_clientes_conta on clientes(conta_id);
create index if not exists idx_corretores_conta on corretores(conta_id);
create index if not exists idx_conversas_cliente on conversas(cliente_id);
create index if not exists idx_mensagens_conversa_time on mensagens(conversa_id, timestamp desc);
create index if not exists idx_mensagens_vector on mensagens using ivfflat (embedding_vetorial vector_l2_ops) with (lists = 100);
```

### RLS (Row-Level Security)
Ativar RLS e políticas baseadas em `conta_id`. No Supabase, o `auth.uid()` pode ser mapeado para `corretores.id` através de uma view/trigger de provisionamento.

AI dev note: Abaixo, as políticas assumem que há uma função `requesting_account_id()` que retorna a `conta_id` do usuário atual (p. ex., via JWT claim personalizada `conta_id`). Ajuste conforme sua estratégia de autenticação.

```sql
-- Ativar RLS
alter table corretores enable row level security;
alter table conexoes_externas enable row level security;
alter table clientes enable row level security;
alter table conversas enable row level security;
alter table mensagens enable row level security;
alter table lembretes enable row level security;
alter table dossies_ia enable row level security;

-- Exemplo de função helper (placeholder)
-- create function requesting_account_id() returns uuid language sql stable as $$
--   select current_setting('app.conta_id', true)::uuid;
-- $$;

-- Políticas exemplo para clientes
create policy if not exists clientes_select on clientes
  for select using (conta_id = requesting_account_id());
create policy if not exists clientes_modify on clientes
  for all using (conta_id = requesting_account_id()) with check (conta_id = requesting_account_id());

-- Replicar padrão para demais tabelas que possuam conta_id direta ou indireta (via join/ownership)
```

### Integração com Supabase Auth
- Estratégias comuns:
  - Tabela `corretores` vinculada ao `auth.users` (via `id` ou mapeamento `user_id` adicional).
  - Claims JWT customizadas com `conta_id` para RLS.
  - Trigger pós-signup para provisionar `corretores` e associar `conta_id`.

### Seed inicial
- Inserir alguns `planos` (individual, imobiliária) e criar uma `conta` demo, um `corretor` admin e assinatura `TRIAL`.

### Checklist de conclusão
- [ ] Tabelas criadas
- [ ] Índices aplicados
- [ ] RLS habilitado e políticas básicas configuradas
- [ ] Integração com Supabase Auth definida (provisionamento/claims)

### Dicas de desenvolvimento
- Não alterar DDL em produção sem migração controlada; usar migrações versionadas.
- Validar constraints/índices com dados reais antes de otimizar.
- Escrever políticas RLS com princípio do menor privilégio; testar SELECT/INSERT/UPDATE/DELETE.
- Comentar dúvidas ao invés de afrouxar segurança.


