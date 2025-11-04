# 🎯 Sistema de Onboarding e Notificação de WhatsApp

## 📋 Visão Geral

Sistema de UX não-intrusivo para guiar usuários a conectar o WhatsApp e maximizar o uso da plataforma Guido.

---

## 🏗️ Arquitetura

### **1. Banner Persistente** (`WhatsAppConnectionBanner.tsx`)

**Quando aparece:**
- WhatsApp **não está conectado** (`status !== 'open'`)
- Usuário **não está na página de Integrações**
- Banner **não foi dispensado** (apenas durante a sessão)

**Comportamento:**
- ✅ Sempre visível no topo de todas as páginas
- ✅ Mostra status atual (Desconectado/Conectando)
- ✅ Botão "Conectar Agora" → redireciona para `/app/integracoes`
- ✅ Botão "X" → dispensar (até recarregar página)
- ✅ Cores dinâmicas baseadas no status:
  - 🟠 Laranja: Desconectado
  - 🟡 Amarelo: Conectando

**Implementação:**
```tsx
// Usa hook existente para verificar status real-time
const { systemStatus } = useWhatsAppStatus();

// Não mostra se conectado ou na página de integrações
if (isConnected || isIntegrationsPage || isDismissed) return null;
```

**Localização:**
- Integrado em `DashboardLayout.tsx`
- Aparece **entre a Sidebar e o Header**

---

### **2. Modal de Onboarding** (`OnboardingModal.tsx`)

**Quando aparece:**
- **Primeiro acesso** ao sistema (`primeiro_acesso = true` ou `null`)
- **OU** Usuário nunca conectou WhatsApp (`evolution_instance = null`)

**Comportamento:**
- ✅ Educacional (mostra 3 passos do fluxo)
- ✅ Não-bloqueante (pode dispensar e explorar)
- ✅ Só aparece **uma vez** por usuário
- ✅ Marca `primeiro_acesso = false` ao dispensar
- ✅ Duas opções:
  - **"Explorar Depois"** → fecha modal, deixa explorar
  - **"Conectar WhatsApp"** → redireciona para `/app/integracoes`

**Estrutura do Modal:**
```
1️⃣ Conecte seu WhatsApp (DESTACADO)
   → Escaneie QR Code em segundos

2️⃣ Suas conversas serão analisadas
   → IA identifica leads e oportunidades

3️⃣ Receba insights automáticos
   → Lembretes, follow-ups e análises
```

**Implementação:**
```tsx
// Verifica se deve mostrar baseado em:
// 1. Primeiro acesso (flag no banco)
// 2. Tem evolution_instance (já conectou antes)
const shouldShow = (userData.primeiro_acesso !== false) || !userData.evolution_instance;

// Ao dispensar, marca como não sendo mais primeiro acesso
await supabase.from('usuarios')
  .update({ primeiro_acesso: false })
  .eq('auth_user_id', user.id);
```

**Localização:**
- Integrado em `DashboardLayout.tsx`
- Renderizado **fora do SidebarInset** (overlay global)

---

## 🗄️ Banco de Dados

### **Migração: `add_primeiro_acesso_to_usuarios`**

```sql
-- Adiciona coluna para controlar onboarding
ALTER TABLE public.usuarios
ADD COLUMN IF NOT EXISTS primeiro_acesso BOOLEAN DEFAULT true;

-- Usuários que já têm evolution_instance não precisam ver onboarding
UPDATE public.usuarios
SET primeiro_acesso = false
WHERE evolution_instance IS NOT NULL;
```

**Lógica:**
- `primeiro_acesso = true` → Mostrar modal de onboarding
- `primeiro_acesso = false` → Não mostrar mais
- `primeiro_acesso = null` → Considerado como `true` (mostrar)

---

## 🎨 UX Flow

### **Cenário 1: Novo Usuário**
```
1. Login → Modal de Onboarding aparece
2. Usuário escolhe:
   a) "Conectar WhatsApp" → vai para Integrações
   b) "Explorar Depois" → fecha modal
3. Banner aparece no topo de todas as páginas
4. Usuário pode clicar "Conectar Agora" a qualquer momento
```

### **Cenário 2: WhatsApp Desconecta**
```
1. Polling detecta desconexão (hook useWhatsAppStatus)
2. Banner muda cor para laranja "WhatsApp não conectado"
3. Botão "Conectar Agora" disponível
4. Usuário clica → vai para Integrações
5. Gera QR Code → conecta → Banner desaparece
```

### **Cenário 3: Usuário Conectando**
```
1. Banner muda cor para amarelo "WhatsApp conectando..."
2. Remove botão "Conectar Agora" (já está conectando)
3. Usuário aguarda conexão estabelecer
4. Quando conecta → Banner desaparece automaticamente
```

---

## 🔧 Integração no Layout

**`DashboardLayout.tsx`** (arquivo modificado):

```tsx
export const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  return (
    <ViewContextProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          
          <SidebarInset className="flex flex-col w-full">
            {/* 🔥 NOVO: Banner de conexão WhatsApp */}
            <WhatsAppConnectionBanner />
            
            <DashboardHeader title={title} />
            
            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </SidebarInset>
        </div>

        {/* 🔥 NOVO: Modal de onboarding */}
        <OnboardingModal />
      </SidebarProvider>
    </ViewContextProvider>
  );
};
```

**Ordem de renderização:**
1. Sidebar
2. **Banner** (topo do conteúdo)
3. Header
4. Conteúdo (children)
5. **Modal** (overlay global)

---

## 📊 Dependências

### **Hooks Utilizados:**

1. **`useWhatsAppStatus()`** (já existente)
   - Monitora status da instância Evolution
   - Polling a cada 30 segundos
   - Retorna: `{ systemStatus: { isOnline, status, statusText } }`

2. **`useViewContext()`** (já existente)
   - Acesso ao `currentCorretor`
   - Dados de `evolution_instance`, `evolution_apikey`

3. **`useNavigate()`** (React Router)
   - Redirecionamento para `/app/integracoes`

4. **`useLocation()`** (React Router)
   - Detectar página atual (esconder banner em Integrações)

---

## 🎯 Objetivos Alcançados

✅ **Não-intrusivo**: Usuário pode explorar o sistema livremente  
✅ **Sempre visível**: Banner constante lembra de conectar  
✅ **Educacional**: Modal explica o valor do produto  
✅ **Ação clara**: Botão "Conectar Agora" em destaque  
✅ **Responsivo**: Adapta-se ao status real-time  
✅ **Performático**: Usa hooks existentes, sem overhead  
✅ **Escalonável**: Fácil adicionar novos estados/mensagens  

---

## 🚀 Próximos Passos (Sugestões)

1. **Toast de Desconexão** (Camada 4)
   - Notificação urgente quando WhatsApp desconecta
   - Usar biblioteca de toast (ex: Sonner)

2. **Empty State no Dashboard** (Camada 3)
   - Card motivacional quando não tem conversas
   - Apenas se WhatsApp não conectado

3. **Analytics**
   - Rastrear quantos usuários conectam no primeiro acesso
   - Tempo médio até primeira conexão
   - Taxa de conversão (modal → conexão)

4. **A/B Testing**
   - Testar diferentes mensagens no banner
   - Testar diferentes CTAs no modal
   - Medir impacto na taxa de ativação

---

## 📝 Notas Técnicas

### **Performance:**
- ✅ Modal só renderiza se `isOpen = true`
- ✅ Banner só renderiza se necessário (early return)
- ✅ Polling já existente (useWhatsAppStatus), sem overhead adicional

### **Acessibilidade:**
- ✅ Botão de fechar com `title` (tooltip)
- ✅ Contraste adequado (WCAG AA)
- ✅ Foco nos CTAs principais

### **Mobile:**
- ✅ Banner responsivo (flex-wrap, padding adaptativo)
- ✅ Modal centralizado com padding em mobile
- ✅ Botões empilham em telas pequenas

---

## 🐛 Troubleshooting

### **Modal não aparece:**
1. Verificar `primeiro_acesso` no banco
2. Verificar se `currentCorretor` está carregado
3. Ver console: logs com tag `ONBOARDING`

### **Banner não desaparece:**
1. Verificar `systemStatus.isOnline`
2. Verificar `systemStatus.status === 'connected'`
3. Ver sidebar: status também deve estar "Online"

### **Redirecionamento não funciona:**
1. Verificar rota `/app/integracoes` existe
2. Ver console: erros de navegação
3. Verificar `react-router-dom` versão

---

**Documentado por:** AI Assistant  
**Data:** 2025-11-04  
**Versão:** 1.0.0

