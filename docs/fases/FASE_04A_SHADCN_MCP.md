## Fase 4A — Integração shadcn via MCP

Objetivo: obter componentes shadcn por MCP e adaptá-los ao stack (React 16, TS 3.4), colocando-os em `src/components/ui/`.

### Premissas
- Sem execução de CLI shadcn oficial; uso de MCP para recuperar o código-fonte dos componentes e incorporá-los manualmente (vendorização).
- Sem Radix UI por enquanto, priorizar componentes puros (button, input, label, textarea, card, badge, separator).

### Passos com MCP
1) Obter lista de componentes disponíveis
   - Usar MCP para listar componentes e confirmar nomes.
2) Baixar fonte dos componentes-alvo
   - Para cada componente (ex.: `button`), requisitar o código v4 (React + Tailwind) via MCP.
3) Adaptar código
   - Remover imports de Radix quando existirem.
   - Ajustar tipos que quebrem em TS 3.4 (trocar generics complexos por `any` se necessário).
   - Substituir `class-variance-authority` por mapas simples de classes se a tipagem impedir build.
4) Salvar em `src/components/ui/` com nomes equivalentes.
5) Exportar todos em `src/components/ui/index.ts`.

### Seleção curada (compatível com React 16 + TS 3.4)
- Componentes base (sem Radix): `button`, `input`, `label`, `textarea`, `card`, `badge`, `separator`, `skeleton`.
- Evitar por ora (dependem de Radix/React 18): `dialog`, `dropdown-menu`, `tabs`, `tooltip`, `popover`, `select`, `avatar`, `menubar`, `navigation-menu`.

### Blocks de referência (layout e conteúdo)
- Login: `login-02` (estrutura visual e UX do formulário)
- Dashboard: `dashboard-01` (estrutura de colunas/cards)
- Sidebar: `sidebar-02` (navegação lateral simples)

AI dev note: Usar blocks como referência de layout e classes; replicar com componentes base sem Radix.

### Mapeamento para páginas
- Landing (pública): `card`, `badge`, `separator`, `button` para CTAs; opcional `accordion` apenas se vendorizado sem Radix (caso contrário, evitar).
- Login (`/login`): `card` (wrapper), `label` + `input` (email), `button` (enviar), `separator` (divisor social – adiado), `skeleton` (loading leve).
- Dashboard (`/app`): estrutura inspirada em `dashboard-01` com `card` para métricas e listas; `sidebar-02` adaptada como layout estático.

### Limpeza de boilerplate (shadcn via MCP)
- Não copiar arquivos de tema/registry do shadcn que conflitem com nosso Tailwind.
- Remover imports de `@/registry/...` ao vendoriar; ajustar para `@/components/ui/...`.
- Testar cada componente isoladamente antes de compor páginas.

### Verificações
- Build do Vite sem erros de tipos ou sintaxe.
- Componentes aparecem estilizados conforme tema Guido.

### Checklist de conclusão
- [ ] Código dos componentes shadcn obtido via MCP
- [ ] Adaptações para TS 3.4 aplicadas
- [ ] Export centralizado pronto

AI dev note: Esta fase documenta a estratégia de integração shadcn sem dependências pesadas e com compatibilidade máxima ao stack atual.

### Segurança
- AI dev note: Checar licenças e cabeçalhos de código vendorizado; manter créditos quando exigido.
- Revisar código obtido via MCP antes de incorporar (evitar trechos com acessos externos indesejados).

### Dicas de desenvolvimento
- Não usar `any`/`@ts-ignore` como padrão; se necessário na adaptação, isolar e documentar.
- Reaproveitar tokens/estilos definidos na Fase 3.
- Corrigir somente o que quebra build/tipos; não reescrever o componente inteiro.


