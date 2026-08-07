# Guido v2 — Arquitetura e Produto

> Documento âncora. Substitui o `PRD_GUIDO.md` do v1 (arquivado na tag `v1-legacy`).
> Última revisão: 2026-08-07

---

## 1. O que o Guido é agora

**O Guido deixou de ser um CRM. Ele virou a camada de inteligência comercial sobre o Chatwoot.**

No v1, o Guido tentava ser a interface: inbox própria, tela de conversas, gestão de canais. Isso significava competir com plataformas maduras em tudo que é infraestrutura de atendimento — e sobrar pouco tempo para o que ninguém faz bem.

No v2, o Chatwoot (white label CWMKT) é onde o corretor trabalha. O Guido é o cérebro que:

- **lê** cada conversa e extrai o que importa para vender imóvel;
- **decide** o que o corretor deve fazer agora, e por quê;
- **age** — move o funil, cobra retorno, agenda visita, rascunha a mensagem.

Frase de posicionamento interno:

> O Chatwoot mostra as conversas. O Guido diz qual delas vale dinheiro.

---

## 2. Guido vs Captain — a decisão

O Chatwoot 4.x traz o **Captain**, IA nativa da plataforma (assistente sobre base de conhecimento, copiloto de resposta, resumo, memórias, detecção de lacunas de FAQ). O white label da CWMKT tem Captain habilitado.

**Não competimos com o Captain. Ocupamos outra função.**

A diferença não é qualidade de modelo — é função-objetivo:

| | Captain | Guido |
|---|---|---|
| Domínio | Suporte ao cliente | Venda imobiliária |
| Sucesso = | **Encerrar** a conversa | **Avançar** o negócio |
| Unidade de trabalho | Ticket | Lead / funil |
| Conhece | Base de conhecimento, FAQ | Perfil de busca, estoque, visita, comissão, performance do corretor |
| Horizonte | A mensagem atual | A jornada de meses até a escritura |

O Captain nunca vai dizer *"fale com a Márcia antes das 11h"*, porque ele não tem o conceito de uma Márcia que vale R$ 850 mil.

### Decisão operacional

**Um cérebro por conversa.** Rodar Captain e Guido respondendo na mesma conversa gera resposta inconsistente, custo duplicado e nenhum dos dois auditável.

- **Padrão:** Captain desligado. O Guido é o cérebro único.
- **Exceção (imobiliária):** Captain confinado a FAQ institucional ("qual o horário?", "quais documentos preciso?") em inbox separada. Guido em tudo que é lead.

### Nota econômica

O Captain não é gratuito: no self-hosted exige plano Premium Support (~US$ 19/agente/mês) ou Enterprise, com chave OpenAI própria; no cloud consome créditos (300–800/mês inclusos, US$ 20 por 1.000 excedentes). Isso trabalha a nosso favor — reforça que inteligência dentro do Chatwoot é um custo consciente, e o Guido entrega mais por ele.

---

## 3. Arquitetura

```
┌──────────────────────────────────────────────────────────────┐
│  guido.com.br            SITE                                │
│  Next.js · marketing, planos, cadastro self-service          │
└───────────────────────────┬──────────────────────────────────┘
                            │ signup
┌───────────────────────────▼──────────────────────────────────┐
│  app.guido.com.br        GUIDO APP                           │
│  Kanban · Fila do dia · Relatórios · Estoque · Config        │
└───────────────────────────┬──────────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────────┐
│                       GUIDO BRAIN                            │
│  Ingest de webhook · Fila · Pipeline de IA (Claude)          │
│  extrair → pontuar → decidir → agir                          │
└──────┬─────────────────────────────────────┬─────────────────┘
       │ Application API                     │ Platform API
┌──────▼─────────────────────────────────────▼─────────────────┐
│              CHATWOOT (white label CWMKT)                    │
│  Inboxes · Conversas · Agentes · Labels · Custom Attributes  │
│                                                              │
│   ┌────────────────────────────────────────────────────┐     │
│   │  PAINEL DO GUIDO  (Dashboard App, iframe)          │     │
│   │  na sidebar da conversa                            │     │
│   └────────────────────────────────────────────────────┘     │
└──────┬───────────────────────────────────────────────────────┘
       │
   WhatsApp (oficial Cloud API  ou  não-oficial)
```

### As quatro superfícies

| Superfície | O que é | Tecnologia |
|---|---|---|
| **Site** | Marketing, planos, cadastro | Next.js (rota `(site)`) |
| **Guido App** | Kanban, fila do dia, relatórios do gestor, estoque | Next.js (rota `(app)`) |
| **Painel do Guido** | Temperatura, perfil extraído, próxima ação, imóveis sugeridos, mover card — tudo dentro da conversa | Dashboard App: iframe na sidebar, contexto via `postMessage` |
| **Guido Brain** | Pipeline de IA | API routes + fila em Postgres + worker |

### Por que o kanban não mora dentro do Chatwoot

O Dashboard App do Chatwoot é um **iframe num painel lateral da conversa** — recebe o contexto da conversa e do contato via `postMessage` e tem comunicação bidirecional, mas não é uma página inteira. Um kanban de funil não cabe ali.

Isso é uma vantagem disfarçada: com o kanban no nosso app, controlamos o **isolamento por corretor** via RLS. No Chatwoot, um agente enxerga as conversas das inboxes de que é membro, e permissões granulares por papel são recurso Enterprise — o que não resolve o problema de carteira entre corretores da mesma imobiliária.

### Stack

- **Frontend/BFF:** Next.js 15 (App Router), TypeScript estrito, Tailwind, shadcn/ui
- **Dados/Auth:** Supabase (Postgres + Auth + Storage + RLS)
- **Fila:** tabela de jobs em Postgres + Vercel Cron (troca por Inngest se o volume exigir)
- **IA:** Claude — Sonnet 5 para volume (extração, score), Opus 5 para casos difíceis (decisão de autopiloto, coaching). Structured output para extração; prompt caching no system prompt e no perfil do corretor.
- **Deploy:** Vercel

O webhook do Chatwoot **responde rápido e enfileira** — nunca processa IA no caminho do request.

---

## 4. Modelo de tenancy

O modelo do Chatwoot encaixa direto:

```
Account (tenant)  →  Users/Agents (1 login cada)  →  Inboxes  →  Conversations (assignee_id)
```

### Corretor autônomo — foco inicial

1 Account · 1 agente · 1 inbox (o WhatsApp dele). Simples.

### Imobiliária

1 Account · N agentes. Dois sub-modelos, e precisamos suportar **os dois**, porque o mercado usa os dois:

- **(a) Cada corretor com seu número** → N inboxes na mesma conta. A conversa já nasce com dono.
- **(b) Número central da imobiliária** (recebe lead de portal e do site) → 1 inbox, conversa chega **sem dono** → é aqui que entra a **distribuição de leads**.
- **Híbrido** (o mais comum na prática): o central capta e distribui, o corretor continua no número dele.

### Kanban por agente

O dono do card é o `assignee` da conversa. Um único kanban de dados, várias visões:

- **Corretor** vê o funil dele.
- **Gestor** vê tudo, com filtro por corretor, equipe, origem e estágio.
- Conversa sem `assignee` cai no **pool de distribuição**.

---

## 5. Onboarding self-service (Platform API)

Temos acesso à Platform API do Chatwoot, então o cadastro é 100% automático:

1. Corretor se cadastra no site → Supabase Auth
2. `POST /platform/api/v1/accounts` → cria a Account
3. `POST /platform/api/v1/users` → cria o User → vincula como agente da Account
4. Cria a **inbox de WhatsApp** conforme a escolha dele (oficial ou não-oficial)
5. Cria o **Agent Bot** do Guido e vincula à inbox
6. Registra o **Dashboard App** apontando para o Painel do Guido
7. Configura os **webhooks** para o Guido Brain
8. Gera o token de acesso do agente → **SSO** entre Guido App e Chatwoot

O corretor sai do cadastro já dentro de um Chatwoot funcionando, com o Guido ligado.

### WhatsApp: os dois caminhos

A CWMKT permite ambos, e a escolha é do cliente:

| | Não-oficial | Oficial (Cloud API) |
|---|---|---|
| Ativação | QR code / pairing, ~2 min | Verificação Meta, dias |
| Custo | Fixo | Por conversa |
| Risco | Ban | Nenhum |
| Histórico | **Importa** | Não importa |
| Perfil | Corretor autônomo | Imobiliária, número central |

O **import de histórico** só existe no caminho não-oficial — e ele é o nosso ativo de ativação (ver §7, Onda 1).

---

## 6. Modelo de dados (essencial)

Tabelas novas, prefixo `g_`, no projeto Supabase existente. Nada nas tabelas do v1 é alterado.

```
g_orgs                 tenant. corretor autônomo = org de 1
  └ chatwoot_account_id

g_members              user ↔ org, role: corretor | gestor
  └ chatwoot_user_id, chatwoot_agent_id

g_inboxes              vínculo com a inbox do Chatwoot, canal, número

g_leads                o contato + a conversa do Chatwoot
  └ chatwoot_contact_id, chatwoot_conversation_id, origem (portal, site, indicação)

g_lead_profiles        PERFIL EXTRAÍDO — o coração do produto
  └ tipo, quartos, vagas, bairros[], preço_min/max,
    fgts, status_financiamento, prazo_mudança, motivação, decisor
  └ confiança por campo + mensagem de origem  (auditável)

g_lead_scores          score + componentes (jsonb) + calculado_em

g_pipelines / g_stages estágios do funil, por org

g_cards                lead no funil
  └ stage_id, owner_member_id (= assignee), posição

g_card_events          TODA mudança de card
  └ ator (ai | humano), justificativa, confiança, desfaz_evento_id

g_jobs                 fila de processamento

g_subscriptions        plano, status, trial
```

Duas escolhas de design que não são negociáveis:

- **`g_lead_profiles` guarda confiança e mensagem de origem por campo.** Sem isso, o corretor não confia no dado extraído e o produto morre.
- **`g_card_events` registra ator, justificativa e undo.** É o que torna o autopiloto aceitável (ver §8).

---

## 7. Diferenciais e roadmap

### Onda 1 — o produto existir

1. **CRM que se preenche sozinho** — extração automática do perfil de busca a partir da conversa. *(moat)*
2. **Kanban por agente** com movimentação manual e sugerida.
3. **Fila do dia com o porquê** — ranking com justificativa e mensagem pronta. A justificativa é o produto; sem ela ninguém confia no ranking.
4. **Radar de lead esfriando + SLA** — "3 leads quentes sem resposta há mais de 2h". O corretor brasileiro perde lead por demora, não por falta de técnica.
5. **Import de histórico → funil pronto no dia 1** — conectou, o Guido lê os últimos meses e entrega o kanban com 200 leads já classificados. *(moat de ativação: mata a tela vazia, que é onde o CRM morre)*

### Onda 2 — o upsell

6. **Autopiloto do kanban** — com justificativa e undo (ver §8).
7. **Ciclo de visita completo** — detecta intenção → agenda → lembra na véspera → **pergunta no dia seguinte o que o cliente achou**. O feedback pós-visita é ouro e ninguém coleta; realimenta o perfil e afina o match.
8. **Áudio nativo** — transcrever, entender e responder por áudio. Corretor e cliente vivem de áudio; quem só lê texto perde metade da conversa.
9. **Cobrança de documentação** — financiamento trava em documento faltando. Checklist por cliente, Guido cobrando sozinho.

### Onda 3 — o ticket alto (imobiliária)

10. **Distribuição de leads** — rodízio ponderado por tempo de resposta e taxa de conversão, não round-robin. Mais anti-duplicidade.
11. **ROI por portal** — Zap, VivaReal, OLX, tráfego pago. A imobiliária gasta pesado e só sabe quantos *leads* veio; não quantas *vendas*.
12. **Coach de conversa** — nota a abordagem: qualificou? ofereceu visita? demorou? Vira coaching pro gestor e treino pro júnior. É o que justifica preço por assento numa casa de 30 corretores.
13. **Match imóvel ↔ cliente** — o estoque indexado cruzando com o perfil extraído, dentro da conversa. *(moat)* Fica na onda 3 não por ser menos importante, mas porque ingerir estoque (planilha, XML, Vista/Kenlo/Imobzi/Jetimob) é um projeto próprio.

---

## 8. Autopiloto: a regra que protege o upsell

O plano caro é "a IA move o kanban sozinha". Isso só funciona sob três regras:

1. **Toda ação mostra o porquê.** *"Movi para Proposta porque o cliente pediu a minuta às 14h32."*
2. **Toda ação tem undo de um clique.**
3. **Limiar de confiança.** Abaixo dele, o Guido **sugere** em vez de agir.

Se o corretor perder a confiança no autopiloto uma vez, ele desliga e nunca mais liga — e o upsell inteiro morre junto.

Por isso os planos se chamam pelo que fazem:

| Plano | O que o Guido faz |
|---|---|
| **Copiloto** | Extrai, pontua, prioriza, sugere. Você aprova. |
| **Autopiloto** | Age sozinho dentro do limiar. Você audita. |

---

## 9. Pendências e riscos

- ⚠️ **Margem por assento.** O v1 cobrava R$ 97/mês (autônomo) e R$ 67/corretor (imobiliária). Se a licença Chatwoot for cobrada por agente, o preço de autônomo pode ficar sem margem. **Confirmar o custo por agente da CWMKT antes de fechar o pricing** — é a variável que define o modelo de negócio inteiro.
- ⚠️ **Isolamento entre corretores** na imobiliária: resolvido no Guido App via RLS, mas dentro do Chatwoot depende de inbox/team. Definir a política antes de vender B2B.
- ⚠️ **Risco de ban** no caminho não-oficial: exige warm-up e rate limiting. Comunicar com honestidade no site.
- ⚠️ **Import de histórico e LGPD:** base legal, consentimento e retenção precisam estar resolvidos antes do lançamento, porque é a feature que mais toca dado de terceiro.
