## Fase 6 — Roteamento (Landing de vendas, Login, Dashboard)

Objetivo: estruturar rotas públicas e protegidas usando React Router DOM v5.

### Dependências
- `react-router-dom` 5.3.0
- `history` 4.10.1

### Rotas
- `/` — Landing de vendas (pública): seções de UVP, benefícios, CTAs.
- `/login` — Autenticação (pública): magic link por email via Supabase v1.
- `/app` — Dashboard (protegida): área logada com shell básico.
- `/settings` — Conta (protegida): perfil/saída.

### Implementação sugerida
- `src/app/routes.tsx` com `BrowserRouter`, `Switch`, `Route`.
- `PrivateRoute` componente que verifica sessão e:
  - Se autenticado: renderiza a rota.
  - Se não: redireciona para `/login` preservando `from`.

### Segurança
- Landing não deve carregar dados do usuário nem tokens.
- Proteger rotas de app mesmo se o menu/links não estiverem visíveis (defesa em profundidade).
- Evitar query params sensíveis em URLs; preferir estado de navegação seguro.

### Limpeza de boilerplate (Rotas)
- Remover páginas/rotas de demo do template Vite (ex.: home React default).
- Apontar `main.tsx` para o componente `Routes` único.
- Remover estilos globais importados por páginas antigas.

### Layout
- `MarketingLayout` para landing (header simples com CTA para login, footer).
- `AppLayout` para áreas logadas (sidebar/topbar simples).
- Aplicar gradiente no wrapper principal conforme tema.

### Checklist de conclusão
- [ ] Rotas públicas e privadas funcionam
- [ ] Redirecionamento para `/login` quando necessário
- [ ] Layouts (marketing e app) aplicados

### Dicas de desenvolvimento
- Não alterar fluxos de navegação; apenas proteger e tratar estados.
- Evitar props implícitas; tipar rotas e guards conforme necessário.
- Reaproveitar layouts entre páginas; não duplicar estruturas.


