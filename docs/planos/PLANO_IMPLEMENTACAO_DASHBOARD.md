# 📊 PLANO DE IMPLEMENTAÇÃO - Dashboard Unificado Guido

## 🎯 **OBJETIVO**
Implementar dashboard unificado que se adapta ao tipo de usuário (Corretor Individual vs Gestor de Imobiliária) com widgets contextuais e sistema de filtros inteligente.

## 🏗️ **ARQUITETURA APROVADA**

### **Layout Base:**
- **Sidebar:** Navegação lateral fixa
- **Header:** Barra superior com filtro de visualização (gestores)
- **Main:** Área de conteúdo com widgets responsivos

### **Hierarquia de Componentes:**
```
Template: DashboardPage
├── Domain: DashboardLayout
│   ├── Composed: AppSidebar
│   ├── Composed: DashboardHeader
│   └── Domain: DashboardContent
│       ├── Composed: WidgetGrid
│       └── Domain: UserSpecificWidgets
└── Primitives: Card, Button, Badge, etc.
```

## 📋 **IMPLEMENTAÇÃO FASEADA**

### **FASE 1: Estrutura Base (APROVADA)**

#### **1.1 Componentes Primitives (shadcn)**
- [ ] Verificar componentes disponíveis: Card, Button, Badge, Avatar
- [ ] Implementar primitives customizados se necessário

#### **1.2 Composed Components**
- [ ] `<AppSidebar />` - Navegação lateral com itens dinâmicos
- [ ] `<DashboardHeader />` - Header com filtro de visualização
- [ ] `<WidgetGrid />` - Grid responsivo para widgets

#### **1.3 Domain Components**
- [ ] `<DashboardLayout />` - Layout principal
- [ ] `<DashboardContent />` - Área de conteúdo principal
- [ ] `<UserSpecificWidgets />` - Widgets baseados no tipo de usuário

#### **1.4 Template**
- [ ] `<DashboardPage />` - Página completa do dashboard

### **FASE 2: Widgets por Tipo de Usuário (APROVADA)**

#### **2.1 Widgets do Corretor (AGENTE)**
- [ ] `<ConversasPrioritariasWidget />` - Conversas aguardando resposta
- [ ] `<LembretesHojeWidget />` - Lembretes do dia
- [ ] `<MetricasPessoaisWidget />` - Estatísticas pessoais
- [ ] `<AtividadeRecenteWidget />` - Feed de atividades

#### **2.2 Widgets do Gestor (ADMIN/DONO)**
- [ ] `<DesempenhoEquipeWidget />` - Métricas da equipe
- [ ] `<ConversasRiscoWidget />` - Conversas que exigem atenção
- [ ] `<RankingEquipeWidget />` - Ranking de performance
- [ ] `<FunilVendasWidget />` - Funil de vendas da equipe

### **FASE 3: Sistema de Filtros (APROVADA)**

#### **3.1 Hooks**
- [ ] `useViewContext` - Context para filtros de visualização
- [ ] `useDashboardData` - Dados do dashboard baseados no contexto
- [ ] `useRealTimeUpdates` - Updates em tempo real

#### **3.2 Componentes de Filtro**
- [ ] `<ViewFilter />` - Dropdown para gestores filtrarem visualização
- [ ] `<TimeRangeFilter />` - Filtro de período

## 🗄️ **INTEGRAÇÃO COM BANCO**

### **Queries Necessárias:**
1. **Conversas Prioritárias:** `status_conversa = 'AGUARDANDO_CORRETOR'`
2. **Lembretes Hoje:** `data_lembrete::date = CURRENT_DATE AND status = 'PENDENTE'`
3. **Métricas Pessoais:** Agregações por `corretor_id`
4. **Métricas de Equipe:** Agregações por `conta_id`

### **Otimizações:**
- [ ] Criar índices para queries do dashboard
- [ ] Implementar função SQL `get_dashboard_metrics()`
- [ ] View materializada para métricas rápidas (opcional)

## 🎨 **ESPECIFICAÇÕES DE UI**

### **Responsive Design:**
- **Mobile:** Grid de 1 coluna
- **Tablet:** Grid de 2 colunas
- **Desktop:** Grid de 3-4 colunas (dependendo do widget)

### **Cores Semânticas:**
- **Urgente:** Vermelho (`hsl(0, 84%, 60%)`)
- **Atenção:** Âmbar (`hsl(38, 92%, 50%)`)
- **Sucesso:** Verde (`hsl(142, 76%, 36%)`)
- **Info:** Azul (`hsl(217, 91%, 60%)`)

## 🔧 **CRITÉRIOS DE ACEITAÇÃO**

### **Funcionalidade:**
- [ ] Dashboard se adapta automaticamente ao tipo de usuário
- [ ] Filtros funcionam corretamente para gestores
- [ ] Widgets carregam dados reais do Supabase
- [ ] Updates em tempo real funcionam
- [ ] Responsividade em todas as telas

### **Performance:**
- [ ] Carregamento inicial < 3 segundos
- [ ] Queries otimizadas com índices
- [ ] Lazy loading de widgets
- [ ] Cache inteligente de dados

### **UX:**
- [ ] Loading states para todos os widgets
- [ ] Estados de erro tratados
- [ ] Navegação intuitiva
- [ ] Acessibilidade (ARIA labels)

## 🚀 **ORDEM DE EXECUÇÃO**

1. **Primeiro:** Verificar componentes shadcn disponíveis
2. **Segundo:** Implementar estrutura base (Layout + Sidebar)
3. **Terceiro:** Implementar widgets do corretor
4. **Quarto:** Implementar widgets do gestor
5. **Quinto:** Sistema de filtros e context
6. **Sexto:** Integração com Supabase
7. **Sétimo:** Otimizações e polish

## ✅ **DEFINIÇÃO DE PRONTO**

Cada componente deve:
- [ ] Ter tipagem TypeScript completa
- [ ] Ser responsivo (mobile-first)
- [ ] Ter loading e error states
- [ ] Estar registrado no registry
- [ ] Passar no lint e testes
- [ ] Ter documentação básica

