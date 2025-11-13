# Product Requirements Document (PRD)
## Guido - Assistente de IA para Corretores de Imóveis

**Versão:** 1.0  
**Data:** 04 de Novembro de 2025  
**Status:** Produto em Desenvolvimento

---

## 📋 Índice

1. [Visão Geral do Produto](#1-visão-geral-do-produto)
2. [Objetivos e Metas](#2-objetivos-e-metas)
3. [Usuários e Personas](#3-usuários-e-personas)
4. [Proposta de Valor](#4-proposta-de-valor)
5. [Arquitetura e Stack Tecnológico](#5-arquitetura-e-stack-tecnológico)
6. [Funcionalidades Principais](#6-funcionalidades-principais)
7. [Jornada do Usuário](#7-jornada-do-usuário)
8. [Requisitos Funcionais](#8-requisitos-funcionais)
9. [Requisitos Não-Funcionais](#9-requisitos-não-funcionais)
10. [Integrações](#10-integrações)
11. [Modelo de Negócio](#11-modelo-de-negócio)
12. [Segurança e Compliance](#12-segurança-e-compliance)
13. [Roadmap e Fases](#13-roadmap-e-fases)
14. [Métricas de Sucesso](#14-métricas-de-sucesso)
15. [Riscos e Mitigações](#15-riscos-e-mitigações)

---

## 1. Visão Geral do Produto

### 1.1 Descrição

**Guido** é um assistente de inteligência artificial projetado para ser o parceiro estratégico do corretor de imóveis. O Guido não é apenas um CRM tradicional, mas sim um guia proativo que se integra diretamente na rotina do corretor, atuando onde o negócio realmente acontece: no WhatsApp.

### 1.2 Missão

Amplificar o talento dos corretores de imóveis, automatizando tarefas repetitivas e fornecendo insights inteligentes para que possam focar no que fazem de melhor: vender e se relacionar com clientes.

### 1.3 Visão

Tornar-se o assistente de IA líder no mercado imobiliário brasileiro, presente em toda negociação bem-sucedida.

### 1.4 Diferencial Competitivo

- **Proativo vs Passivo:** Age diretamente nas conversas do WhatsApp, não apenas armazena dados
- **Automação Inteligente:** Atualiza o CRM automaticamente sem esforço manual
- **Sugestões em Tempo Real:** Orienta o corretor durante negociações com quebra de objeções
- **Integração com CRMs Existentes:** Não substitui, mas potencializa sistemas já utilizados

---

## 2. Objetivos e Metas

### 2.1 Objetivos de Negócio

1. **Curto Prazo (6 meses):**
   - Alcançar 500 corretores/imobiliárias ativos
   - Taxa de conversão trial → pago de 30%
   - Churn mensal < 5%

2. **Médio Prazo (12 meses):**
   - Alcançar 2.000 corretores ativos
   - MRR (Monthly Recurring Revenue) de R$ 150.000
   - NPS (Net Promoter Score) > 50

3. **Longo Prazo (24 meses):**
   - Alcançar 10.000 corretores ativos
   - Tornar-se referência no mercado imobiliário brasileiro
   - Expandir para outros mercados da América Latina

### 2.2 Objetivos de Produto

1. **Eficiência:**
   - Reduzir em 60% o tempo gasto em atualização de CRM
   - Automatizar 80% das tarefas administrativas

2. **Experiência:**
   - Tempo de resposta da IA < 2 segundos
   - Disponibilidade de 99.9%
   - Interface intuitiva com curva de aprendizado < 30 minutos

3. **Engajamento:**
   - 70% dos usuários ativos diariamente
   - 5+ interações por dia por usuário ativo

---

## 3. Usuários e Personas

### 3.1 Persona 1: Corretor Individual (B2C)

**Nome:** João Silva  
**Idade:** 32 anos  
**Perfil:** Corretor autônomo, trabalha sozinho  
**Experiência:** 5 anos no mercado imobiliário

**Dores:**
- Perde muito tempo atualizando planilhas e CRMs
- Esquece de fazer follow-ups importantes
- Dificuldade em organizar múltiplas conversas simultâneas
- Não consegue lembrar detalhes de cada cliente

**Objetivos:**
- Aumentar o número de vendas fechadas
- Melhorar o relacionamento com clientes
- Ter mais tempo livre
- Profissionalizar sua operação

**Comportamento:**
- Usa WhatsApp para 90% da comunicação
- Trabalha principalmente pelo celular
- Valida tecnologia que é simples de usar
- Busca soluções econômicas

### 3.2 Persona 2: Gestor de Imobiliária (B2B)

**Nome:** Ana Rodrigues  
**Idade:** 42 anos  
**Perfil:** Dona de imobiliária com equipe de 8 corretores  
**Experiência:** 15 anos no mercado

**Dores:**
- Dificuldade em acompanhar performance da equipe
- Falta de visibilidade sobre negociações em andamento
- Inconsistência no processo de vendas entre corretores
- Alto turnover de corretores

**Objetivos:**
- Aumentar produtividade da equipe
- Padronizar processos
- Ter visibilidade completa do pipeline
- Reduzir custos operacionais

**Comportamento:**
- Gerencia equipe remotamente
- Toma decisões baseadas em dados
- Investe em ferramentas que trazem ROI claro
- Precisa de relatórios e dashboards

### 3.3 Persona 3: Corretor Júnior (B2C)

**Nome:** Maria Santos  
**Idade:** 25 anos  
**Perfil:** Corretor iniciante, faz parte de uma equipe  
**Experiência:** 6 meses no mercado

**Dores:**
- Insegurança ao responder objeções de clientes
- Não sabe quais informações priorizar
- Medo de parecer despreparada
- Dificuldade em gerenciar múltiplos leads

**Objetivos:**
- Aprender rapidamente as melhores práticas
- Ganhar confiança nas negociações
- Fechar suas primeiras vendas
- Crescer profissionalmente

**Comportamento:**
- Busca orientação e mentoria
- Aberta a novas tecnologias
- Ativa em grupos e comunidades
- Aprende consumindo conteúdo digital

---

## 4. Proposta de Valor

### 4.1 Para Corretores Individuais

**"Seu parceiro de IA que cuida da burocracia enquanto você vende"**

**Benefícios:**
- ⏱️ **Economiza 10+ horas/semana** em tarefas administrativas
- 🎯 **Nunca mais perca um follow-up** com lembretes inteligentes
- 💬 **Respostas mais eficazes** com sugestões de IA em tempo real
- 📊 **Organize automaticamente** todas suas conversas e clientes

### 4.2 Para Imobiliárias

**"Multiplique a produtividade da sua equipe com inteligência artificial"**

**Benefícios:**
- 📈 **Aumente em 40% a produtividade** da equipe
- 👥 **Visibilidade completa** do pipeline de vendas
- 🎓 **Acelere o onboarding** de novos corretores
- 💰 **Reduza custos operacionais** com automação

### 4.3 Canvas de Proposta de Valor

```
┌─────────────────────┬─────────────────────┐
│   PERFIL DO CLIENTE │   MAPA DE VALOR     │
├─────────────────────┼─────────────────────┤
│ Tarefas do Cliente: │ Produtos/Serviços:  │
│ • Vender imóveis    │ • Assistente de IA  │
│ • Gerenciar leads   │ • Memória de conv.  │
│ • Atualizar CRM     │ • Lembretes auto.   │
│ • Fazer follow-ups  │ • Dashboard         │
│                     │ • Integração CRM    │
├─────────────────────┼─────────────────────┤
│ Dores:              │ Alívio das Dores:   │
│ • Tempo perdido     │ • Automação 80%     │
│ • Esquecer clientes │ • Memória perfeita  │
│ • Desorganização    │ • Organização auto  │
│ • Respostas lentas  │ • Sugestões IA      │
├─────────────────────┼─────────────────────┤
│ Ganhos:             │ Criadores de Ganho: │
│ • Mais vendas       │ • +40% produtividade│
│ • Menos trabalho    │ • 10h/sem economiza │
│ • Profissionalismo  │ • Insights de IA    │
│ • Crescimento       │ • Análise de dados  │
└─────────────────────┴─────────────────────┘
```

---

## 5. Arquitetura e Stack Tecnológico

### 5.1 Arquitetura Geral

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│  ┌──────────┬──────────┬──────────┬──────────┐        │
│  │ Landing  │Dashboard │Conversas │ Clientes │        │
│  └──────────┴──────────┴──────────┴──────────┘        │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS/WSS
┌────────────────────┴────────────────────────────────────┐
│                SUPABASE (Backend as a Service)           │
│  ┌──────────┬──────────┬──────────┬──────────┐        │
│  │PostgreSQL│   Auth   │ Realtime │Storage   │        │
│  │   RLS    │Magic Link│Channels  │          │        │
│  └──────────┴──────────┴──────────┴──────────┘        │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/Webhooks
┌────────────────────┴────────────────────────────────────┐
│                  INTEGRAÇÕES EXTERNAS                     │
│  ┌────────────────┬─────────────────┬──────────────┐   │
│  │ Evolution API  │   Asaas        │    n8n       │   │
│  │  (WhatsApp)    │  (Pagamentos)  │ (Automação)  │   │
│  └────────────────┴─────────────────┴──────────────┘   │
└──────────────────────────────────────────────────────────┘
```

### 5.2 Stack Tecnológico

#### **Frontend**
- **Framework:** React 16.14.0
- **Linguagem:** TypeScript 3.4.16
- **Build Tool:** Vite 2.9.18
- **Roteamento:** React Router 5.3.0
- **Estilização:** Tailwind CSS 3.4.x
- **Componentes:** shadcn/ui (vendorizado)
- **Animações:** Framer Motion 4.1.17
- **Ícones:** Lucide React

**Justificativa:** Stack estável e leve, adequado para deploy rápido e manutenção simplificada.

#### **Backend**
- **BaaS:** Supabase (PostgreSQL + Auth + Realtime + Storage)
- **Database:** PostgreSQL 14+
- **Auth:** Supabase Auth com Magic Link
- **Realtime:** Supabase Realtime Channels
- **Edge Functions:** Deno (para processamento serverless)

**Justificativa:** Reduz complexidade de infraestrutura, acelera desenvolvimento, oferece escalabilidade automática.

#### **Integrações**
- **WhatsApp:** Evolution API v2.3.1
- **Pagamentos:** Asaas Gateway
- **Automação:** n8n (workflows)
- **Proxy:** WebShare (para WhatsApp)

#### **DevOps**
- **Hospedagem:** Vercel (frontend)
- **CI/CD:** GitHub Actions
- **Monitoramento:** Supabase Logs
- **Versionamento:** Git + GitHub

### 5.3 Modelo de Dados (Principais Entidades)

```sql
-- Hierarquia Multi-tenant
contas (id, tipo_conta, documento)
  ├── usuarios (id, conta_id, email, whatsapp)
  ├── corretores (id, conta_id, funcao, evolution_instance)
  ├── assinaturas (id, conta_id, status, data_fim_trial)
  └── planos (id, nome_plano, preco_mensal)

-- Gestão de Clientes
clientes (id, conta_id, nome, status_funil, jid)
  ├── conversas (id, cliente_id, status_conversa)
  │   └── mensagens (id, conversa_id, remetente, conteudo)
  └── lembretes (id, cliente_id, corretor_id, status)

-- Integrações
crm_integrations (id, conta_id, plataforma, status)
```

### 5.4 Segurança (Row Level Security)

```sql
-- Exemplo de política RLS
CREATE POLICY "Corretores veem apenas dados da sua conta"
ON clientes FOR ALL
USING (
  conta_id = get_current_conta_id()
);
```

---

## 6. Funcionalidades Principais

### 6.1 Módulo de Autenticação

**Descrição:** Sistema de autenticação via magic link (link mágico enviado por email).

**Funcionalidades:**
- ✅ Cadastro com email e dados básicos
- ✅ Login via magic link (sem senha)
- ✅ Trial gratuito de 7 dias
- ✅ Verificação de email obrigatória
- ✅ Recuperação de cadastros incompletos
- ✅ Soft delete de usuários (não deleta dados)

**User Stories:**
```
Como corretor individual,
Quero me cadastrar rapidamente sem precisar lembrar de senha,
Para começar a usar o Guido imediatamente.

Critérios de Aceitação:
- Cadastro em menos de 2 minutos
- Link de acesso enviado por email
- Trial de 7 dias ativado automaticamente
- Confirmação de email obrigatória
```

### 6.2 Dashboard Inteligente

**Descrição:** Dashboard adaptativo que muda baseado no tipo de usuário (corretor vs gestor).

**Funcionalidades:**

#### **Para Corretores (AGENTE):**
- ✅ Conversas prioritárias (aguardando resposta)
- ✅ Lembretes do dia
- ✅ Métricas pessoais (conversões, atendimentos)
- ✅ Atividade recente

#### **Para Gestores (ADMIN/DONO):**
- ✅ Desempenho da equipe
- ✅ Conversas em risco (sem resposta há muito tempo)
- ✅ Ranking de produtividade
- ✅ Funil de vendas consolidado
- ✅ Filtro por corretor (visualizar como outro usuário)

**User Stories:**
```
Como gestor de imobiliária,
Quero ver o desempenho de toda minha equipe em um único dashboard,
Para identificar rapidamente quem precisa de suporte.

Critérios de Aceitação:
- Dashboard carrega em < 3 segundos
- Métricas atualizadas em tempo real
- Possibilidade de filtrar por corretor
- Exportação de relatórios
```

### 6.3 Guia de Conversas WhatsApp

**Descrição:** Central de conversas integrada com WhatsApp via Evolution API.

**Funcionalidades:**
- ✅ Sincronização automática de mensagens do WhatsApp
- ✅ Histórico completo de conversas
- ✅ Status de conversas (aguardando, em andamento, finalizado)
- ✅ Busca avançada por cliente, conteúdo ou data
- ✅ Filtros por status e prioridade
- ✅ Indicador visual de conversas sem resposta
- ✅ Integração com sistema de lembretes

**Fluxo de Integração:**
```
WhatsApp → Evolution API → Webhook → Supabase → Frontend
```

**User Stories:**
```
Como corretor,
Quero ver todas minhas conversas do WhatsApp em um só lugar,
Para não precisar ficar alternando entre o WhatsApp e o sistema.

Critérios de Aceitação:
- Sincronização automática em < 5 segundos
- Histórico completo preservado
- Busca funcional e rápida
- Interface similar ao WhatsApp (familiar)
```

### 6.4 Memória Inteligente de Clientes

**Descrição:** Sistema que armazena e organiza automaticamente informações dos clientes.

**Funcionalidades:**
- ✅ Perfil completo do cliente (nome, telefone, email, foto)
- ✅ Histórico completo de conversas
- ✅ Preferências e interesses capturados das conversas
- ✅ Timeline de interações
- ✅ Anotações manuais do corretor
- ✅ Status no funil de vendas
- ✅ Tags personalizadas

**Estrutura do Perfil:**
```
┌─────────────────────────────────┐
│  CLIENTE: João da Silva         │
├─────────────────────────────────┤
│ 📱 (11) 99999-9999             │
│ 📧 joao@email.com              │
│ 🏠 Status: Visita Agendada     │
│ 📅 Última interação: Hoje 14h  │
├─────────────────────────────────┤
│ 💬 CONVERSAS: 12                │
│ ⏰ LEMBRETES: 2 pendentes       │
│ 🏷️ TAGS: Hot Lead, Ap 2dorm    │
├─────────────────────────────────┤
│ 📝 PREFERÊNCIAS                 │
│ • Orçamento: R$ 300-400k        │
│ • Bairros: Pinheiros, Vila Mada│
│ • Garagem: 2 vagas obrigatório │
└─────────────────────────────────┘
```

### 6.5 Sistema de Lembretes Inteligentes

**Descrição:** Sistema automatizado de lembretes com notificações via WhatsApp.

**Funcionalidades:**
- ✅ Criação de lembretes via interface ou API
- ✅ Tipos de lembretes: Follow-up, Visita, Documento, Proposta, Geral
- ✅ Prioridades: Alta, Média, Baixa
- ✅ Notificação automática via WhatsApp (Evolution API)
- ✅ Repetição de lembretes (diário, semanal, mensal)
- ✅ Snooze (adiar lembrete)
- ✅ Histórico de lembretes concluídos

**Fluxo de Notificação:**
```
1. Cron Job (a cada 5 min) verifica lembretes vencidos
2. Edge Function busca lembretes pendentes
3. Envia webhook para n8n
4. n8n formata mensagem e envia via Evolution API
5. Sistema marca lembrete como notificado
```

**Exemplo de Notificação:**
```
🔔 LEMBRETE GUIDO

📞 Ligar para cliente João

📝 Cliente interessado em apartamento
   na Vila Madalena, orçamento 400k

📅 Agendado para: 04/11/2025 14:30
⭐ Prioridade: ALTA

👤 Cliente: João Silva
📱 Telefone: (11) 99999-9999

Acesse o Guido para marcar como concluído.
```

### 6.6 Kanban de Funil de Vendas

**Descrição:** Visualização em kanban do funil de vendas com drag & drop.

**Funcionalidades:**
- ✅ 7 estágios do funil (Novo Lead → Fechamento/Perdido)
- ✅ Drag & drop para mover clientes entre etapas
- ✅ Métricas de conversão por etapa
- ✅ Tempo médio em cada etapa
- ✅ Filtros por corretor (gestores)
- ✅ Indicadores visuais de urgência

**Estágios do Funil:**
```
📥 Novo Lead
  ↓
💬 Contato Inicial
  ↓
👁️ Interesse Gerado
  ↓
🏠 Visita Agendada
  ↓
📋 Proposta Enviada
  ↓
✅ Fechamento  /  ❌ Perdido
```

**Métricas por Etapa:**
- Taxa de conversão para próxima etapa
- Tempo médio na etapa
- Quantidade de clientes
- Valor do pipeline (se aplicável)

### 6.7 Sistema de Assinaturas

**Descrição:** Gestão completa de assinaturas com integração Asaas.

**Funcionalidades:**
- ✅ Trial gratuito de 7 dias
- ✅ Planos: Individual (R$ 97/mês) e Imobiliária (R$ 67/corretor)
- ✅ Pagamento via PIX, Boleto ou Cartão de Crédito
- ✅ Cobrança recorrente automática
- ✅ Banner de status da assinatura
- ✅ Gestão de faturas
- ✅ Cancelamento self-service
- ✅ Webhook de notificações (pagamento, vencimento, cancelamento)

**Status de Assinatura:**
- **TRIAL:** Trial ativo (7 dias)
- **ATIVO:** Assinatura paga e ativa
- **PAGAMENTO_PENDENTE:** Aguardando pagamento
- **CANCELADO:** Assinatura cancelada

**Fluxo de Conversão Trial → Pago:**
```
1. Usuário se cadastra → Trial 7 dias iniciado
2. 5 dias antes do fim: Email lembrando trial
3. 1 dia antes do fim: Email urgente + banner no app
4. Fim do trial: Bloqueio de acesso + modal de conversão
5. Usuário escolhe plano e forma de pagamento
6. Redireciona para página de pagamento Asaas
7. Webhook confirma pagamento → Ativa assinatura
```

### 6.8 Configurações e Integrações

**Descrição:** Central de configurações e integrações com CRMs.

**Funcionalidades:**
- ✅ Perfil do usuário (nome, foto, email, CRECI)
- ✅ Configuração de notificações (email, WhatsApp)
- ✅ Gestão de assinatura e pagamentos
- ✅ Integrações com CRMs (Loft, RD Station, ImoView, Imobzi)
- ✅ Conexão com WhatsApp (Evolution API)
- ✅ Configuração de equipe (gestores)
- ✅ Preferências de privacidade

**CRMs Suportados:**
- **Loft:** Integração via API key
- **RD Station:** Integração via API key
- **ImoView:** Integração via email/senha
- **Imobzi:** Integração via token

---

## 7. Jornada do Usuário

### 7.1 Jornada do Corretor Individual

```
┌─────────────────────────────────────────────────────────┐
│              DESCOBERTA E CADASTRO                       │
└─────────────────────────────────────────────────────────┘
1. Conhece o Guido via anúncio/indicação
2. Acessa landing page
3. Lê sobre benefícios e funcionalidades
4. Clica em "Começar Grátis por 7 dias"
5. Preenche formulário rápido (nome, email, WhatsApp, CPF)
6. Recebe email com magic link
7. Clica no link → Acesso imediato ao sistema

┌─────────────────────────────────────────────────────────┐
│                  ONBOARDING (Trial)                      │
└─────────────────────────────────────────────────────────┘
8. Vê modal de boas-vindas com tour rápido
9. Conecta WhatsApp (QR Code via Evolution API)
10. Sincroniza conversas existentes
11. Explora funcionalidades principais:
    - Dashboard com métricas
    - Conversas do WhatsApp
    - Cria primeiro lembrete
    - Adiciona primeiro cliente ao funil
12. Recebe email: "Dicas para aproveitar ao máximo o Guido"

┌─────────────────────────────────────────────────────────┐
│                   USO DIÁRIO (Trial)                     │
└─────────────────────────────────────────────────────────┘
13. Dia 1-3: Usa básico (conversas + lembretes)
14. Dia 4: Recebe primeiro lembrete via WhatsApp → WOW!
15. Dia 5: Email "Faltam 2 dias de trial"
16. Dia 6: Banner no app "1 dia restante - Assine agora"
17. Dia 7: Modal bloqueando acesso + opções de assinatura

┌─────────────────────────────────────────────────────────┐
│                    CONVERSÃO                             │
└─────────────────────────────────────────────────────────┘
18. Escolhe plano Individual (R$ 97/mês)
19. Seleciona forma de pagamento (PIX)
20. Redireciona para Asaas
21. Efetua pagamento
22. Webhook confirma → Acesso liberado
23. Email de confirmação com fatura

┌─────────────────────────────────────────────────────────┐
│                  USO RECORRENTE                          │
└─────────────────────────────────────────────────────────┘
24. Usa diariamente para:
    - Gerenciar conversas WhatsApp
    - Receber lembretes automáticos
    - Acompanhar funil de vendas
    - Ver métricas de performance
25. Cobrança automática mensal
26. Email mensal com resumo de uso e métricas
```

### 7.2 Jornada do Gestor de Imobiliária

```
┌─────────────────────────────────────────────────────────┐
│              DESCOBERTA E CADASTRO                       │
└─────────────────────────────────────────────────────────┘
1. Conhece o Guido via demo comercial
2. Solicita trial para equipe
3. Cadastra imobiliária (CNPJ, dados empresa)
4. Recebe acesso admin

┌─────────────────────────────────────────────────────────┐
│                 SETUP DA EQUIPE                          │
└─────────────────────────────────────────────────────────┘
5. Convida corretores via email
6. Corretores aceitam convite e fazem onboarding
7. Configura permissões e acessos
8. Define metas e KPIs

┌─────────────────────────────────────────────────────────┐
│                    USO DIÁRIO                            │
└─────────────────────────────────────────────────────────┘
9. Acessa dashboard de gestão
10. Monitora performance individual e da equipe
11. Identifica corretores com dificuldades
12. Acompanha funil consolidado
13. Recebe relatórios semanais automatizados

┌─────────────────────────────────────────────────────────┐
│                    CONVERSÃO                             │
└─────────────────────────────────────────────────────────┘
14. Fim do trial: Avalia ROI da ferramenta
15. Decide assinar plano Imobiliária
16. Configura cobrança (valor × número de corretores)
17. Efetua pagamento inicial
18. Cobrança mensal automática
```

---

## 8. Requisitos Funcionais

### 8.1 Autenticação e Autorização

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| RF01 | Sistema deve permitir cadastro via email | Alta | ✅ Implementado |
| RF02 | Sistema deve enviar magic link para login | Alta | ✅ Implementado |
| RF03 | Sistema deve verificar email antes de liberar acesso | Alta | ✅ Implementado |
| RF04 | Sistema deve criar trial de 7 dias automaticamente | Alta | ✅ Implementado |
| RF05 | Sistema deve recuperar cadastros incompletos | Média | ✅ Implementado |
| RF06 | Sistema deve implementar soft delete de usuários | Média | ✅ Implementado |
| RF07 | Sistema deve bloquear acesso após trial expirado | Alta | ✅ Implementado |

### 8.2 Dashboard

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| RF10 | Dashboard deve adaptar widgets ao tipo de usuário | Alta | 🟡 Em desenvolvimento |
| RF11 | Gestores devem poder filtrar visualização por corretor | Alta | 🟡 Em desenvolvimento |
| RF12 | Widgets devem atualizar em tempo real | Média | 🟡 Em desenvolvimento |
| RF13 | Dashboard deve carregar em < 3 segundos | Alta | 🟡 Em desenvolvimento |
| RF14 | Sistema deve exibir métricas de performance | Alta | 🟡 Em desenvolvimento |

### 8.3 Conversas WhatsApp

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| RF20 | Sistema deve sincronizar mensagens do WhatsApp | Alta | ✅ Implementado |
| RF21 | Sistema deve armazenar histórico completo | Alta | ✅ Implementado |
| RF22 | Sistema deve permitir busca por conteúdo e data | Média | ✅ Implementado |
| RF23 | Sistema deve marcar conversas não respondidas | Alta | ✅ Implementado |
| RF24 | Sistema deve integrar via Evolution API | Alta | ✅ Implementado |

### 8.4 Lembretes

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| RF30 | Sistema deve permitir criar lembretes com data/hora | Alta | ✅ Implementado |
| RF31 | Sistema deve notificar via WhatsApp no horário agendado | Alta | ✅ Implementado |
| RF32 | Sistema deve permitir snooze de lembretes | Média | ⚪ Planejado |
| RF33 | Sistema deve permitir lembretes recorrentes | Média | ⚪ Planejado |
| RF34 | Sistema deve categorizar lembretes por tipo | Média | ✅ Implementado |

### 8.5 Clientes e Funil

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| RF40 | Sistema deve armazenar perfil completo do cliente | Alta | ✅ Implementado |
| RF41 | Sistema deve permitir mover clientes no funil (drag & drop) | Alta | 🟡 Em desenvolvimento |
| RF42 | Sistema deve calcular métricas de conversão | Média | 🟡 Em desenvolvimento |
| RF43 | Sistema deve identificar clientes em risco | Média | ⚪ Planejado |
| RF44 | Sistema deve permitir tags personalizadas | Baixa | ⚪ Planejado |

### 8.6 Assinaturas e Pagamentos

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| RF50 | Sistema deve criar trial automático no cadastro | Alta | ✅ Implementado |
| RF51 | Sistema deve notificar 3, 1 dia antes e no fim do trial | Alta | ✅ Implementado |
| RF52 | Sistema deve bloquear acesso após trial expirado | Alta | ✅ Implementado |
| RF53 | Sistema deve processar webhooks do Asaas | Alta | ✅ Implementado |
| RF54 | Sistema deve exibir fatura para pagamento pendente | Alta | ✅ Implementado |
| RF55 | Sistema deve permitir cancelamento self-service | Média | 🟡 Em desenvolvimento |

### 8.7 Integrações CRM

| ID | Requisito | Prioridade | Status |
|----|-----------|------------|--------|
| RF60 | Sistema deve integrar com Loft via API | Média | ⚪ Planejado |
| RF61 | Sistema deve integrar com RD Station via API | Média | ⚪ Planejado |
| RF62 | Sistema deve integrar com ImoView via API | Média | ⚪ Planejado |
| RF63 | Sistema deve criptografar credenciais de integração | Alta | ✅ Implementado |

---

## 9. Requisitos Não-Funcionais

### 9.1 Performance

| ID | Requisito | Métrica | Prioridade |
|----|-----------|---------|------------|
| RNF01 | Tempo de carregamento inicial | < 3s | Alta |
| RNF02 | Tempo de resposta da API | < 500ms | Alta |
| RNF03 | Sincronização de mensagens WhatsApp | < 5s | Média |
| RNF04 | Atualização de métricas em tempo real | < 2s | Média |
| RNF05 | Suporte a 1000 usuários simultâneos | Sim | Alta |

### 9.2 Disponibilidade

| ID | Requisito | Métrica | Prioridade |
|----|-----------|---------|------------|
| RNF10 | Uptime do sistema | 99.9% | Alta |
| RNF11 | Tempo de recuperação de falhas | < 1h | Alta |
| RNF12 | Backup diário de dados | Sim | Alta |
| RNF13 | Redundância de servidores | Sim | Média |

### 9.3 Segurança

| ID | Requisito | Implementação | Prioridade |
|----|-----------|---------------|------------|
| RNF20 | Criptografia de dados em trânsito | HTTPS/TLS 1.3 | Alta |
| RNF21 | Criptografia de dados em repouso | AES-256 | Alta |
| RNF22 | Autenticação de dois fatores | Magic Link | Alta |
| RNF23 | Row Level Security (RLS) | Supabase RLS | Alta |
| RNF24 | Auditoria de ações sensíveis | Logs estruturados | Média |
| RNF25 | Conformidade LGPD | Sim | Alta |

### 9.4 Usabilidade

| ID | Requisito | Métrica | Prioridade |
|----|-----------|---------|------------|
| RNF30 | Interface intuitiva | Onboarding < 30 min | Alta |
| RNF31 | Responsividade mobile | 100% funcional | Alta |
| RNF32 | Acessibilidade (WCAG 2.1) | Nível AA | Média |
| RNF33 | Suporte a navegadores modernos | Chrome, Firefox, Safari, Edge | Alta |

### 9.5 Escalabilidade

| ID | Requisito | Capacidade | Prioridade |
|----|-----------|------------|------------|
| RNF40 | Suporte a crescimento de usuários | Até 10.000 usuários | Alta |
| RNF41 | Armazenamento de mensagens | Ilimitado | Alta |
| RNF42 | Processamento de webhooks | 1000/min | Média |

---

## 10. Integrações

### 10.1 Evolution API (WhatsApp)

**Propósito:** Integração com WhatsApp para sincronização de mensagens.

**Funcionalidades:**
- Criação automática de instância por usuário
- Sincronização bidirecional de mensagens
- QR Code para conexão
- Webhook para eventos (mensagens, status, etc)
- Envio de mensagens automáticas (lembretes)

**Fluxo de Integração:**
```
1. Cadastro do usuário
2. Sistema cria instância Evolution automaticamente
3. Usuário escaneia QR Code para conectar WhatsApp
4. Evolution envia webhook para cada mensagem recebida/enviada
5. Sistema armazena no banco de dados
6. Frontend exibe em tempo real
```

**Configuração:**
- URL: `https://chat-guido.infusecomunicacao.online`
- Autenticação: API Key por instância
- Webhook: `https://app.guido.net.br/webhook/evolution/{instanceName}`
- Proxy: WebShare (para estabilidade)

### 10.2 Asaas (Gateway de Pagamento)

**Propósito:** Gerenciamento de assinaturas e cobranças recorrentes.

**Funcionalidades:**
- Criação de clientes
- Criação de assinaturas recorrentes
- Geração de faturas (PIX, Boleto, Cartão)
- Webhooks de status de pagamento
- Gestão de inadimplência

**Eventos de Webhook:**
- `PAYMENT_RECEIVED`: Pagamento confirmado
- `PAYMENT_OVERDUE`: Pagamento vencido
- `SUBSCRIPTION_CANCELLED`: Assinatura cancelada
- `INVOICE_CREATED`: Nova fatura gerada

**Fluxo de Assinatura:**
```
1. Fim do trial
2. Usuário escolhe plano
3. Sistema cria cliente no Asaas (se não existir)
4. Cria assinatura recorrente
5. Gera fatura imediata
6. Redireciona para página de pagamento Asaas
7. Webhook confirma pagamento
8. Sistema ativa assinatura
```

### 10.3 n8n (Automação)

**Propósito:** Orquestração de workflows e automações.

**Workflows Implementados:**
1. **Notificação de Lembretes:**
   - Trigger: Webhook do Supabase Edge Function
   - Ação: Enviar mensagem via Evolution API

2. **Webhook Asaas:**
   - Trigger: Webhook do Asaas
   - Ação: Atualizar status de assinatura no Supabase

3. **Emails Transacionais:**
   - Triggers: Vários (cadastro, trial, pagamento)
   - Ação: Enviar email via SMTP

### 10.4 CRMs Imobiliários (Planejado)

**CRMs a serem integrados:**

1. **Loft:**
   - Método: API REST
   - Autenticação: API Key
   - Sincronização: Leads, contatos, negociações

2. **RD Station:**
   - Método: API REST
   - Autenticação: OAuth 2.0
   - Sincronização: Leads, contatos

3. **ImoView:**
   - Método: API REST
   - Autenticação: Email/Senha
   - Sincronização: Clientes, imóveis, negociações

4. **Imobzi:**
   - Método: API REST
   - Autenticação: Token
   - Sincronização: Leads, clientes, negociações

**Fluxo de Sincronização:**
```
1. Corretor configura integração (fornece credenciais)
2. Sistema autentica com CRM externo
3. Cron job sincroniza dados a cada 15 minutos
4. Detecta novos leads/clientes
5. Cria/atualiza registros no Guido
6. Atualiza CRM externo com novas informações
```

---

## 11. Modelo de Negócio

### 11.1 Planos e Preços

#### **Plano Individual (B2C)**

**Público:** Corretores autônomos

**Preço:** R$ 97/mês

**Inclui:**
- ✅ 1 corretor
- ✅ Conversas ilimitadas
- ✅ Lembretes automáticos
- ✅ Dashboard completo
- ✅ Integração WhatsApp
- ✅ Funil de vendas
- ✅ Suporte via chat
- ✅ Trial de 7 dias

#### **Plano Imobiliária (B2B)**

**Público:** Imobiliárias com equipe

**Preço:** R$ 67/corretor/mês

**Inclui:**
- ✅ Múltiplos corretores
- ✅ Dashboard de gestão
- ✅ Visão consolidada da equipe
- ✅ Filtros por corretor
- ✅ Relatórios gerenciais
- ✅ Métricas de performance
- ✅ Sistema de convites
- ✅ Suporte prioritário
- ✅ Trial de 7 dias para equipe

**Descontos por Volume:**
- 10-19 corretores: 10% desconto
- 20-49 corretores: 20% desconto
- 50+ corretores: 30% desconto

### 11.2 Estrutura de Receita

**Modelo:** SaaS com cobrança recorrente mensal

**Fontes de Receita:**
1. **Assinaturas mensais:** 95% da receita
2. **Consultoria/Customização:** 3% da receita
3. **Treinamentos:** 2% da receita

**Projeção de Receita (12 meses):**

| Mês | Usuários | MRR | Churn | Crescimento |
|-----|----------|-----|-------|-------------|
| 1   | 50       | R$ 4.850 | 0% | - |
| 3   | 150      | R$ 14.550 | 5% | 50/mês |
| 6   | 400      | R$ 38.800 | 5% | 80/mês |
| 12  | 1.000    | R$ 97.000 | 5% | 100/mês |

**LTV/CAC:**
- **CAC (Custo de Aquisição):** R$ 200
- **LTV (Lifetime Value):** R$ 1.164 (12 meses × R$ 97)
- **Ratio LTV/CAC:** 5.8x (saudável: > 3x)

### 11.3 Estratégia de Go-to-Market

#### **Fase 1: Validação (Meses 1-3)**
- Lançamento beta para 50 usuários early adopters
- Foco em feedback e iteração rápida
- Marketing orgânico (conteúdo, SEO)
- Parcerias com influenciadores imobiliários

#### **Fase 2: Crescimento (Meses 4-6)**
- Lançamento público
- Campanhas de Google Ads e Facebook Ads
- Webinars e demos ao vivo
- Programa de indicação (R$ 50 de desconto)

#### **Fase 3: Expansão (Meses 7-12)**
- Expansão para outras cidades
- Parcerias com escolas de corretores
- Integração com mais CRMs
- Expansão de funcionalidades (IA avançada)

#### **Canais de Aquisição:**
1. **SEO/Conteúdo:** Blog sobre vendas imobiliárias
2. **Paid Ads:** Google Ads, Facebook/Instagram Ads
3. **Indicação:** Programa de referral
4. **Parcerias:** CRECIs, escolas, imobiliárias
5. **Inside Sales:** Time de vendas B2B

---

## 12. Segurança e Compliance

### 12.1 LGPD (Lei Geral de Proteção de Dados)

**Princípios Aplicados:**
- ✅ **Finalidade:** Dados coletados apenas para operação do sistema
- ✅ **Necessidade:** Coleta apenas dados essenciais
- ✅ **Transparência:** Política de privacidade clara
- ✅ **Segurança:** Criptografia e controles de acesso
- ✅ **Prevenção:** Medidas para evitar vazamentos
- ✅ **Não discriminação:** Tratamento equitativo
- ✅ **Responsabilização:** Registros de consentimento

**Dados Pessoais Tratados:**
- Dados cadastrais: Nome, email, CPF, telefone
- Dados profissionais: CRECI, imobiliária
- Dados de uso: Logs de acesso, métricas
- Dados de comunicação: Mensagens WhatsApp, conversas

**Direitos do Titular:**
- ✅ Acesso aos dados
- ✅ Correção de dados
- ✅ Exclusão de dados (direito ao esquecimento)
- ✅ Portabilidade de dados
- ✅ Revogação de consentimento

**Implementações Técnicas:**
- Soft delete (não exclui dados imediatamente)
- Anonimização após cancelamento (90 dias)
- Logs de auditoria de acessos
- Criptografia de dados sensíveis
- Políticas de retenção de dados

### 12.2 Segurança da Informação

**Camadas de Segurança:**

1. **Infraestrutura:**
   - Hospedagem em Vercel (certificado pela ISO 27001)
   - Database Supabase (certificado pela SOC 2)
   - HTTPS obrigatório (TLS 1.3)
   - Firewall e DDoS protection

2. **Aplicação:**
   - Row Level Security (RLS) no Supabase
   - Autenticação via magic link (mais seguro que senha)
   - Tokens JWT com expiração
   - Sanitização de inputs (prevenção de XSS/SQL Injection)

3. **Dados:**
   - Criptografia em trânsito (HTTPS)
   - Criptografia em repouso (AES-256)
   - Backup diário automático
   - Credenciais de integração criptografadas

4. **Acesso:**
   - Multi-tenancy com isolamento por conta
   - Controle de permissões (DONO/ADMIN/AGENTE)
   - Logs de auditoria
   - Sessões com timeout automático

### 12.3 Conformidade e Certificações

**Certificações Planejadas:**
- [ ] ISO 27001 (Segurança da Informação)
- [ ] SOC 2 Type II (Controles de Segurança)
- [ ] Certificação LGPD
- [ ] PCI DSS (via Asaas - gateway de pagamento)

### 12.4 Política de Privacidade

**Princípios:**
- Transparência total sobre coleta e uso de dados
- Opt-in para comunicações de marketing
- Opt-out fácil e imediato
- Não venda de dados para terceiros
- Compartilhamento apenas com consentimento

**Acesso aos Dados:**
- Usuário: Acesso total aos seus dados
- Equipe Guido: Apenas suporte técnico (com permissão)
- Terceiros: Apenas processadores (Supabase, Asaas, Evolution)

---

## 13. Roadmap e Fases

### 13.1 Fase 1: MVP (Concluído)

**Período:** Meses 1-3  
**Status:** ✅ Completo

**Entregas:**
- ✅ Autenticação via magic link
- ✅ Dashboard básico
- ✅ Integração WhatsApp (Evolution API)
- ✅ Sistema de lembretes
- ✅ Gestão básica de clientes
- ✅ Sistema de assinaturas (trial + pago)

### 13.2 Fase 2: Growth (Atual)

**Período:** Meses 4-6  
**Status:** 🟡 Em andamento

**Entregas:**
- 🟡 Dashboard inteligente (widgets adaptativos)
- 🟡 Kanban de funil de vendas
- 🟡 Métricas avançadas
- ⚪ Sistema de tags
- ⚪ Busca avançada
- ⚪ Relatórios exportáveis

### 13.3 Fase 3: Scale (Planejado)

**Período:** Meses 7-9  
**Status:** ⚪ Planejado

**Entregas:**
- ⚪ Integrações com CRMs (Loft, RD Station)
- ⚪ IA para sugestão de respostas
- ⚪ Análise de sentimento de conversas
- ⚪ Previsão de conversão (ML)
- ⚪ App mobile (iOS/Android)
- ⚪ Sistema de metas e gamificação

### 13.4 Fase 4: Expansion (Futuro)

**Período:** Meses 10-12  
**Status:** ⚪ Planejado

**Entregas:**
- ⚪ Marketplace de integrações
- ⚪ API pública para desenvolvedores
- ⚪ IA conversacional (chatbot avançado)
- ⚪ Análise preditiva de mercado
- ⚪ Expansão internacional (PT, ES, EN)

### 13.5 Backlog (Ideias Futuras)

**Funcionalidades Consideradas:**
- Sistema de contratos digitais
- Integração com bancos para simulação de financiamento
- Tour virtual de imóveis integrado
- CRM próprio (sem dependência de integrações)
- IA para precificação de imóveis
- Marketplace de imóveis
- Sistema de avaliações de corretores

---

## 14. Métricas de Sucesso

### 14.1 Métricas de Produto (Product Metrics)

| Métrica | Definição | Meta | Frequência |
|---------|-----------|------|------------|
| **DAU** | Daily Active Users | 70% dos usuários pagos | Diária |
| **WAU** | Weekly Active Users | 90% dos usuários pagos | Semanal |
| **MAU** | Monthly Active Users | 95% dos usuários pagos | Mensal |
| **Stickiness** | DAU/MAU | > 0.70 (70%) | Semanal |
| **Session Duration** | Tempo médio por sessão | > 15 minutos | Diária |
| **Feature Adoption** | % usuários usando cada feature | > 60% | Mensal |

### 14.2 Métricas de Negócio (Business Metrics)

| Métrica | Definição | Meta | Frequência |
|---------|-----------|------|------------|
| **MRR** | Monthly Recurring Revenue | R$ 100k em 12 meses | Mensal |
| **ARR** | Annual Recurring Revenue | R$ 1.2M em 12 meses | Anual |
| **Trial-to-Paid** | Taxa conversão trial → pago | > 30% | Mensal |
| **Churn Rate** | Taxa de cancelamento | < 5% mensal | Mensal |
| **LTV** | Lifetime Value | R$ 1.164 (12 meses) | Trimestral |
| **CAC** | Customer Acquisition Cost | < R$ 200 | Mensal |
| **LTV/CAC** | Ratio LTV/CAC | > 5x | Trimestral |
| **Payback Period** | Tempo para recuperar CAC | < 3 meses | Trimestral |

### 14.3 Métricas de Experiência (Experience Metrics)

| Métrica | Definição | Meta | Frequência |
|---------|-----------|------|------------|
| **NPS** | Net Promoter Score | > 50 | Trimestral |
| **CSAT** | Customer Satisfaction Score | > 4.5/5 | Mensal |
| **Time to Value** | Tempo até primeira funcionalidade | < 10 min | Mensal |
| **Support Tickets** | Tickets de suporte por usuário | < 0.5/mês | Mensal |
| **Bug Rate** | Bugs críticos por release | < 2 | Por release |

### 14.4 Métricas Técnicas (Technical Metrics)

| Métrica | Definição | Meta | Frequência |
|---------|-----------|------|------------|
| **Uptime** | Disponibilidade do sistema | > 99.9% | Diária |
| **Response Time** | Tempo de resposta API | < 500ms p95 | Diária |
| **Error Rate** | Taxa de erros | < 0.1% | Diária |
| **Deploy Frequency** | Frequência de deploys | 2-3/semana | Semanal |
| **MTTR** | Mean Time to Recovery | < 1 hora | Por incidente |

### 14.5 Dashboard de Métricas

```
┌────────────────────────────────────────────────────┐
│              GUIDO - DASHBOARD EXECUTIVO           │
├────────────────────────────────────────────────────┤
│                                                     │
│  📊 NEGÓCIO                   📈 PRODUTO           │
│  ├─ MRR: R$ 48k             ├─ DAU: 350           │
│  ├─ ARR: R$ 576k            ├─ MAU: 500           │
│  ├─ Churn: 4.2%             ├─ Stickiness: 70%    │
│  └─ Trial→Paid: 32%         └─ NPS: 52            │
│                                                     │
│  👥 USUÁRIOS                  ⚙️ TÉCNICO           │
│  ├─ Total: 520              ├─ Uptime: 99.95%     │
│  ├─ Pagos: 500              ├─ API: 420ms         │
│  ├─ Trial: 20               ├─ Errors: 0.08%      │
│  └─ Novos (mês): 85         └─ Deploy: 2.5/sem    │
│                                                     │
└────────────────────────────────────────────────────┘
```

---

## 15. Riscos e Mitigações

### 15.1 Riscos Técnicos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| **WhatsApp bloqueia contas** | Média | Alto | Usar Evolution API + proxy; educar usuários sobre boas práticas |
| **Supabase com downtime** | Baixa | Alto | Monitoramento 24/7; plano de contingência; backups automáticos |
| **Escalabilidade insuficiente** | Média | Médio | Arquitetura serverless; load testing; monitoramento de performance |
| **Vulnerabilidade de segurança** | Baixa | Alto | Auditorias regulares; bounty program; atualizações frequentes |
| **Integração CRM falha** | Alta | Médio | Tratamento robusto de erros; retry logic; alertas automáticos |

### 15.2 Riscos de Negócio

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| **Churn alto (>10%)** | Média | Alto | Onboarding excelente; suporte proativo; feature discovery |
| **Conversão trial baixa (<20%)** | Média | Alto | Trial de 7 dias; emails educativos; ativar funcionalidades chave |
| **CAC alto (>R$300)** | Média | Médio | Foco em SEO e conteúdo; programa de indicação; otimização de ads |
| **Concorrente com produto melhor** | Baixa | Alto | Inovação contínua; escuta ativa de clientes; diferenciação clara |
| **Mudança regulatória (WhatsApp)** | Baixa | Alto | Múltiplos canais de comunicação; adaptação rápida; monitoramento de políticas |

### 15.3 Riscos de Mercado

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| **Mercado imobiliário em crise** | Média | Médio | Diversificar para outros nichos; reduzir preços; valor em eficiência |
| **Resistência à adoção de IA** | Baixa | Médio | Educação de mercado; cases de sucesso; demonstrações práticas |
| **Saturação de mercado** | Baixa | Médio | Expansão geográfica; novos segmentos (loteamentos, rural) |

### 15.4 Riscos Operacionais

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| **Perda de desenvolvedores chave** | Média | Médio | Documentação completa; pair programming; conhecimento distribuído |
| **Sobrecarga de suporte** | Alta | Médio | Chatbot para dúvidas comuns; base de conhecimento; tutoriais em vídeo |
| **Falta de capital para crescimento** | Baixa | Alto | Bootstrap inicial; foco em lucratividade; investimento externo apenas se necessário |

### 15.5 Plano de Contingência

**Cenário 1: WhatsApp bloqueia integração**
- **Ação imediata:** Notificar usuários via email
- **Plano B:** Migrar para API oficial WhatsApp Business
- **Plano C:** Desenvolver integração com Telegram/outros

**Cenário 2: Churn acima de 10%**
- **Ação imediata:** Pesquisa com usuários que cancelaram
- **Ações corretivas:** Melhorar onboarding; adicionar features solicitadas; reduzir preço temporariamente

**Cenário 3: Downtime prolongado (>4h)**
- **Ação imediata:** Comunicação transparente via status page
- **Compensação:** Crédito proporcional na próxima fatura
- **Prevenção:** Implementar redundância completa

---

## 16. Conclusão

### 16.1 Resumo Executivo

O **Guido** é um assistente de IA projetado para revolucionar a forma como corretores de imóveis gerenciam seu negócio. Diferente de CRMs tradicionais passivos, o Guido é proativo, integrando-se diretamente no WhatsApp para automatizar tarefas administrativas e fornecer insights em tempo real.

**Diferenciais Chave:**
- ✅ **Proatividade:** Age onde o negócio acontece (WhatsApp)
- ✅ **Automação:** Reduz 60% do trabalho administrativo
- ✅ **Inteligência:** Sugestões de respostas e quebra de objeções
- ✅ **Simplicidade:** Onboarding < 30 minutos

**Modelo de Negócio:**
- SaaS B2C (corretores) e B2B (imobiliárias)
- Preços: R$ 97/mês (individual) e R$ 67/corretor (imobiliária)
- Trial de 7 dias para validação
- Projeção: R$ 100k MRR em 12 meses

**Status Atual:**
- ✅ MVP implementado e funcional
- 🟡 Fase de crescimento em andamento
- 🎯 Meta: 500 usuários pagos em 6 meses

### 16.2 Próximos Passos

**Imediato (Próximas 2 semanas):**
1. Finalizar dashboard inteligente
2. Implementar kanban de funil
3. Melhorar onboarding de novos usuários
4. Otimizar conversão trial → pago

**Curto Prazo (Próximos 3 meses):**
1. Lançar programa de indicação
2. Iniciar integrações com CRMs
3. Implementar relatórios avançados
4. Expandir funcionalidades de IA

**Médio Prazo (Próximos 6 meses):**
1. Lançar app mobile
2. Expandir para outras cidades
3. Implementar marketplace de integrações
4. Buscar certificação ISO 27001

### 16.3 Convite à Ação

Este PRD é um documento vivo que será atualizado conforme o produto evolui e aprendemos com nossos usuários. Feedback e sugestões são sempre bem-vindos.

**Contato:**
- Email: contato@guido.net.br
- Website: https://guido.net.br
- Suporte: suporte@guido.net.br

---

**Versão:** 1.0  
**Última Atualização:** 04 de Novembro de 2025  
**Próxima Revisão:** 04 de Dezembro de 2025

---

## Apêndices

### Apêndice A: Glossário

- **BaaS:** Backend as a Service
- **CAC:** Customer Acquisition Cost
- **CRM:** Customer Relationship Management
- **DAU:** Daily Active Users
- **LTV:** Lifetime Value
- **MAU:** Monthly Active Users
- **MRR:** Monthly Recurring Revenue
- **NPS:** Net Promoter Score
- **RLS:** Row Level Security
- **SaaS:** Software as a Service
- **Trial:** Período de teste gratuito
- **WAU:** Weekly Active Users

### Apêndice B: Referências

1. Supabase Documentation: https://supabase.com/docs
2. Evolution API Documentation: https://doc.evolution-api.com
3. Asaas API Documentation: https://docs.asaas.com
4. React Documentation: https://react.dev
5. Tailwind CSS Documentation: https://tailwindcss.com

### Apêndice C: Histórico de Versões

| Versão | Data | Autor | Mudanças |
|--------|------|-------|----------|
| 1.0 | 04/11/2025 | Equipe Guido | Versão inicial completa do PRD |

---

**Fim do Documento**













