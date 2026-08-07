-- ===========================================================================
-- Guido v2 — schema inicial
--
-- Todas as tabelas usam o prefixo g_ e convivem com as tabelas do v1 sem
-- tocá-las. Nada aqui altera ou remove estrutura existente.
--
-- Conceitos:
--   org      = tenant. Corretor autônomo é uma org de um membro só.
--   member   = pessoa. Espelha um agente do Chatwoot.
--   lead     = contato + conversa do Chatwoot.
--   card     = o lead dentro do funil. Dono = assignee da conversa.
-- ===========================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tenancy
-- ---------------------------------------------------------------------------

create table g_orgs (
  id                    uuid primary key default gen_random_uuid(),
  nome                  text not null,
  tipo                  text not null default 'autonomo'
                          check (tipo in ('autonomo', 'imobiliaria')),
  chatwoot_account_id   integer unique,
  criado_em             timestamptz not null default now()
);

create table g_members (
  id                    uuid primary key default gen_random_uuid(),
  org_id                uuid not null references g_orgs (id) on delete cascade,
  auth_user_id          uuid unique references auth.users (id) on delete set null,
  chatwoot_user_id      integer,
  chatwoot_agent_id     integer,
  papel                 text not null default 'corretor'
                          check (papel in ('corretor', 'gestor')),
  nome                  text not null,
  email                 text,
  ativo                 boolean not null default true,
  criado_em             timestamptz not null default now(),
  unique (org_id, chatwoot_user_id)
);

create index on g_members (org_id);

-- Uma inbox sem member_id é o número central da imobiliária: as conversas
-- chegam sem dono e entram no pool de distribuição.
create table g_inboxes (
  id                    uuid primary key default gen_random_uuid(),
  org_id                uuid not null references g_orgs (id) on delete cascade,
  member_id             uuid references g_members (id) on delete set null,
  chatwoot_inbox_id     integer not null,
  canal                 text not null
                          check (canal in ('whatsapp_oficial', 'whatsapp_nao_oficial')),
  numero                text,
  ativo                 boolean not null default true,
  criado_em             timestamptz not null default now(),
  unique (org_id, chatwoot_inbox_id)
);

-- ---------------------------------------------------------------------------
-- Leads
-- ---------------------------------------------------------------------------

create table g_leads (
  id                        uuid primary key default gen_random_uuid(),
  org_id                    uuid not null references g_orgs (id) on delete cascade,
  inbox_id                  uuid references g_inboxes (id) on delete set null,
  chatwoot_contact_id       integer,
  chatwoot_conversation_id  integer not null,
  nome                      text,
  telefone                  text,
  origem                    text,   -- 'zap', 'vivareal', 'olx', 'site', 'indicacao', 'organico'
  -- Estes dois campos sustentam o radar de lead esfriando: a distância entre
  -- a última mensagem dele e a nossa última resposta é o SLA.
  ultima_msg_lead_em        timestamptz,
  ultima_resposta_em        timestamptz,
  criado_em                 timestamptz not null default now(),
  unique (org_id, chatwoot_conversation_id)
);

create index on g_leads (org_id, ultima_msg_lead_em desc);

-- O coração do produto. Cada campo extraído carrega, em `confianca`, o grau
-- de certeza e a mensagem de origem — sem isso o corretor não confia no dado
-- e o produto morre.
--   confianca = { "quartos": { "score": 0.94, "chatwoot_message_id": 88213 }, ... }
create table g_lead_profiles (
  lead_id               uuid primary key references g_leads (id) on delete cascade,
  tipo_imovel           text,
  quartos               smallint,
  vagas                 smallint,
  bairros               text[],
  preco_min             numeric(12, 2),
  preco_max             numeric(12, 2),
  tem_fgts              boolean,
  valor_fgts            numeric(12, 2),
  status_financiamento  text
                          check (status_financiamento is null or status_financiamento in
                            ('nao_sabe', 'vai_buscar', 'em_analise', 'pre_aprovado', 'a_vista')),
  prazo_mudanca_dias    integer,
  motivacao             text check (motivacao is null or motivacao in ('moradia', 'investimento')),
  decisor               text,
  confianca             jsonb not null default '{}'::jsonb,
  atualizado_em         timestamptz not null default now()
);

create table g_lead_scores (
  id                    uuid primary key default gen_random_uuid(),
  lead_id               uuid not null references g_leads (id) on delete cascade,
  score                 smallint not null check (score between 0 and 100),
  componentes           jsonb not null default '{}'::jsonb,
  calculado_em          timestamptz not null default now()
);

create index on g_lead_scores (lead_id, calculado_em desc);

-- ---------------------------------------------------------------------------
-- Funil
-- ---------------------------------------------------------------------------

create table g_pipelines (
  id                    uuid primary key default gen_random_uuid(),
  org_id                uuid not null references g_orgs (id) on delete cascade,
  nome                  text not null default 'Funil de vendas',
  padrao                boolean not null default true,
  criado_em             timestamptz not null default now()
);

create table g_stages (
  id                    uuid primary key default gen_random_uuid(),
  pipeline_id           uuid not null references g_pipelines (id) on delete cascade,
  nome                  text not null,
  ordem                 smallint not null,
  tipo                  text not null default 'aberto'
                          check (tipo in ('aberto', 'ganho', 'perdido')),
  unique (pipeline_id, ordem)
);

create table g_cards (
  id                    uuid primary key default gen_random_uuid(),
  org_id                uuid not null references g_orgs (id) on delete cascade,
  lead_id               uuid not null unique references g_leads (id) on delete cascade,
  stage_id              uuid not null references g_stages (id),
  -- Espelha o assignee da conversa no Chatwoot. Nulo = pool de distribuição.
  owner_member_id       uuid references g_members (id) on delete set null,
  posicao               numeric not null default 0,
  valor_estimado        numeric(12, 2),
  atualizado_em         timestamptz not null default now()
);

create index on g_cards (org_id, stage_id, posicao);
create index on g_cards (owner_member_id);

-- Toda mudança de card é registrada com ator, justificativa e ponteiro de
-- desfazer. É isso que torna o Autopiloto aceitável: se a IA move sem
-- explicar e sem permitir voltar atrás, o corretor desliga e nunca mais liga.
create table g_card_events (
  id                    uuid primary key default gen_random_uuid(),
  card_id               uuid not null references g_cards (id) on delete cascade,
  ator                  text not null check (ator in ('ia', 'humano', 'sistema')),
  member_id             uuid references g_members (id) on delete set null,
  tipo                  text not null
                          check (tipo in ('criar', 'mover', 'atribuir', 'desfazer')),
  de_stage_id           uuid references g_stages (id),
  para_stage_id         uuid references g_stages (id),
  justificativa         text,
  confianca             numeric(3, 2) check (confianca is null or confianca between 0 and 1),
  desfaz_evento_id      uuid references g_card_events (id),
  criado_em             timestamptz not null default now()
);

create index on g_card_events (card_id, criado_em desc);

-- A IA só age sem justificativa registrada por cima do nosso cadáver.
alter table g_card_events
  add constraint g_card_events_ia_exige_justificativa
  check (ator <> 'ia' or justificativa is not null);

-- ---------------------------------------------------------------------------
-- Operação
-- ---------------------------------------------------------------------------

-- O webhook do Chatwoot responde rápido e enfileira aqui. Processamento de IA
-- nunca acontece no caminho do request.
create table g_jobs (
  id                    uuid primary key default gen_random_uuid(),
  org_id                uuid references g_orgs (id) on delete cascade,
  tipo                  text not null,
  payload               jsonb not null default '{}'::jsonb,
  status                text not null default 'pendente'
                          check (status in ('pendente', 'processando', 'concluido', 'erro')),
  tentativas            smallint not null default 0,
  erro                  text,
  agendado_para         timestamptz not null default now(),
  criado_em             timestamptz not null default now(),
  processado_em         timestamptz
);

create index on g_jobs (status, agendado_para) where status = 'pendente';

create table g_subscriptions (
  org_id                uuid primary key references g_orgs (id) on delete cascade,
  plano                 text not null default 'copiloto'
                          check (plano in ('copiloto', 'autopiloto')),
  status                text not null default 'trial'
                          check (status in ('trial', 'ativa', 'inadimplente', 'cancelada')),
  assentos              smallint not null default 1,
  trial_termina_em      timestamptz,
  provedor_id           text,
  atualizado_em         timestamptz not null default now()
);

-- ===========================================================================
-- RLS
--
-- As funções abaixo são SECURITY DEFINER de propósito: uma policy em g_members
-- que consultasse g_members entraria em recursão infinita.
-- ===========================================================================

create or replace function public.g_my_org_ids()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select m.org_id
    from g_members m
   where m.auth_user_id = auth.uid()
     and m.ativo;
$$;

create or replace function public.g_my_member_id(p_org uuid)
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select m.id
    from g_members m
   where m.auth_user_id = auth.uid()
     and m.org_id = p_org
     and m.ativo
   limit 1;
$$;

create or replace function public.g_is_gestor(p_org uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
      from g_members m
     where m.auth_user_id = auth.uid()
       and m.org_id = p_org
       and m.papel = 'gestor'
       and m.ativo
  );
$$;

alter table g_orgs           enable row level security;
alter table g_members        enable row level security;
alter table g_inboxes        enable row level security;
alter table g_leads          enable row level security;
alter table g_lead_profiles  enable row level security;
alter table g_lead_scores    enable row level security;
alter table g_pipelines      enable row level security;
alter table g_stages         enable row level security;
alter table g_cards          enable row level security;
alter table g_card_events    enable row level security;
alter table g_jobs           enable row level security;
alter table g_subscriptions  enable row level security;

-- Leitura no escopo da org -------------------------------------------------

create policy g_orgs_leitura on g_orgs
  for select using (id in (select g_my_org_ids()));

create policy g_members_leitura on g_members
  for select using (org_id in (select g_my_org_ids()));

create policy g_inboxes_leitura on g_inboxes
  for select using (org_id in (select g_my_org_ids()));

create policy g_leads_leitura on g_leads
  for select using (org_id in (select g_my_org_ids()));

create policy g_pipelines_leitura on g_pipelines
  for select using (org_id in (select g_my_org_ids()));

create policy g_stages_leitura on g_stages
  for select using (
    pipeline_id in (select id from g_pipelines where org_id in (select g_my_org_ids()))
  );

create policy g_subscriptions_leitura on g_subscriptions
  for select using (org_id in (select g_my_org_ids()));

create policy g_lead_profiles_leitura on g_lead_profiles
  for select using (
    lead_id in (select id from g_leads where org_id in (select g_my_org_ids()))
  );

create policy g_lead_scores_leitura on g_lead_scores
  for select using (
    lead_id in (select id from g_leads where org_id in (select g_my_org_ids()))
  );

-- Cards: o isolamento de carteira ------------------------------------------
-- Corretor enxerga o funil dele e o pool sem dono. Gestor enxerga o time.
-- Este é o ponto que o Chatwoot sozinho não resolve, e a razão de o kanban
-- morar aqui e não lá.

create policy g_cards_leitura on g_cards
  for select using (
    org_id in (select g_my_org_ids())
    and (
      g_is_gestor(org_id)
      or owner_member_id = g_my_member_id(org_id)
      or owner_member_id is null
    )
  );

create policy g_cards_escrita on g_cards
  for update using (
    org_id in (select g_my_org_ids())
    and (
      g_is_gestor(org_id)
      or owner_member_id = g_my_member_id(org_id)
      or owner_member_id is null
    )
  );

create policy g_card_events_leitura on g_card_events
  for select using (card_id in (select id from g_cards));

-- g_jobs não tem policy: é território exclusivo da service_role.
-- Sem policy e com RLS ligado, ninguém autenticado lê ou escreve.

-- ---------------------------------------------------------------------------
-- Funil padrão para toda org nova
-- ---------------------------------------------------------------------------

create or replace function public.g_criar_funil_padrao()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pipeline uuid;
begin
  insert into g_pipelines (org_id, nome, padrao)
       values (new.id, 'Funil de vendas', true)
    returning id into v_pipeline;

  insert into g_stages (pipeline_id, nome, ordem, tipo) values
    (v_pipeline, 'Novo lead',      1, 'aberto'),
    (v_pipeline, 'Qualificando',   2, 'aberto'),
    (v_pipeline, 'Visita marcada', 3, 'aberto'),
    (v_pipeline, 'Proposta',       4, 'aberto'),
    (v_pipeline, 'Fechamento',     5, 'aberto'),
    (v_pipeline, 'Ganho',          6, 'ganho'),
    (v_pipeline, 'Perdido',        7, 'perdido');

  return new;
end;
$$;

create trigger g_orgs_funil_padrao
  after insert on g_orgs
  for each row execute function public.g_criar_funil_padrao();
