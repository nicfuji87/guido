# Guido

A inteligência de vendas do corretor de imóveis, construída sobre o Chatwoot.

O Guido não é um CRM. O corretor trabalha no Chatwoot (white label CWMKT); o
Guido é a camada que lê cada conversa, extrai o que importa para vender imóvel,
decide o que fazer agora e — no plano Autopiloto — age.

> O Chatwoot mostra as conversas. O Guido diz qual delas vale dinheiro.

**Leia [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md) antes de escrever código.**
Ele explica o posicionamento, as quatro superfícies do produto, o modelo de
tenancy e as regras que não são negociáveis.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router), React 19 |
| Linguagem | TypeScript estrito |
| Estilo | Tailwind v4 |
| Dados | Supabase (Postgres + Auth + RLS) |
| IA | Claude |
| Deploy | Vercel |

## Rodando

```bash
npm install
npm run dev
```

Copie `.env.example` para `.env.local` e preencha.

## Estrutura

```
src/
  app/
    (site)/          site público: marketing, planos, cadastro
    (app)/           Guido App: kanban, fila do dia, relatórios
  components/
    site/            seções do site
supabase/
  migrations/        schema (tabelas com prefixo g_)
docs/
  ARQUITETURA.md     documento âncora
```

## Convenções

- **Nada de IA sem justificativa.** Toda ação automática grava motivo,
  confiança e ponteiro de desfazer em `g_card_events`. Isso é constraint no
  banco, não boa intenção.
- **Webhook não processa IA.** O endpoint do Chatwoot valida, enfileira em
  `g_jobs` e responde. O worker faz o resto.
- **Extração guarda a origem.** Todo campo em `g_lead_profiles` carrega
  confiança e a mensagem de onde veio, em `confianca`.

## Histórico

A versão anterior (app standalone em React 16 + Vite, com Evolution/UAZapi)
está arquivada na tag `v1-legacy`:

```bash
git show v1-legacy:PRD_GUIDO.md
```
