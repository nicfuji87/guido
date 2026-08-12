-- ===========================================================================
-- Lista de espera — Turma Fundadores
--
-- Coleta nome e WhatsApp de quem quer entrar antes do lançamento.
-- Escrita pelo site com a chave anônima; leitura só pelo painel/service_role.
-- ===========================================================================

create extension if not exists "pgcrypto";

create table if not exists g_waitlist (
  id            uuid primary key default gen_random_uuid(),
  nome          text not null check (length(trim(nome)) between 2 and 120),
  whatsapp      text not null check (whatsapp ~ '^[0-9]{10,13}$'),
  email         text check (email is null or email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  perfil        text check (perfil is null or perfil in ('autonomo', 'imobiliaria')),
  origem        text,
  criado_em     timestamptz not null default now()
);

-- Mesma pessoa não entra duas vezes.
create unique index if not exists g_waitlist_whatsapp_key on g_waitlist (whatsapp);

alter table g_waitlist enable row level security;

-- O site insere com a chave anônima...
drop policy if exists g_waitlist_insere on g_waitlist;
create policy g_waitlist_insere on g_waitlist
  for insert to anon
  with check (true);

-- ...e não existe policy de SELECT de propósito. Com RLS ligada e sem policy
-- de leitura, a chave anônima é cega: quem tem a chave pública do site não
-- consegue baixar a lista de contatos. Leitura só via service_role/painel.
