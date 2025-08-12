## Guido — Implementação Geral (Base com TypeScript 3.4.16)

**Decisão de arquitetura**: Manter TypeScript 3.4.16 por estabilidade. Ajustes no stack: React 16.14, React Router 5, Vite 2.9, Supabase JS v1. Tailwind 3 com tema Guido. Integraremos componentes do shadcn via MCP (vendorizados/adaptados) de forma compatível.

### Stack e versões
- **Node**: 20 LTS
- **Vite**: 2.9.18 + `@vitejs/plugin-react-refresh` 1.3.6
- **React/DOM**: 16.14.0
- **React Router DOM**: 5.3.0 + `history` 4.10.1
- **TypeScript**: 3.4.16
- **Tailwind CSS**: 3.4.x + PostCSS 8.4.x + Autoprefixer 10.4.x
- **Supabase**: `@supabase/supabase-js` 1.35.7
- **Tooling**: ESLint 7.32, @typescript-eslint 4.33, Prettier 2.8, Jest 26 + ts-jest 26

### Fases
1. Preparação e diretivas (Git, Node, padrões)  
2. Bootstrap (Vite 2 + React 16 + TS 3.4)  
3. Tailwind e tema Guido (paleta e tokens)  
4. Design System base + shadcn via MCP (vendorizado)  
4A. Integração shadcn com MCP: obtenção e adaptação de componentes  
5. Supabase v1 (cliente e auth via magic link)  
5A. Banco de Dados (PostgreSQL/Supabase): schema, RLS e pgvector  
6. Roteamento (Landing de vendas, Login, Dashboard protegido)  
7. DX e Qualidade (ESLint, Prettier, Jest)  
8. Estrutura de pastas  
9. CI simples (GitHub Actions)  
10. Conteúdo inicial (Landing de vendas, Login)  
11. Limitações e migração futura  

### Identidade visual (Paleta Guido)
- **Fundo**: `#0D1117` (Deep Space)
- **Acento/CTA**: `#00F6FF` (Ciano Elétrico)
- **Texto**: `#F0F6FC` (Branco Gelo)
- **Gradiente**: `linear-gradient(135deg, #0D1117 0%, #00F6FF 100%)`

### Critérios de sucesso da base
- App roda (`dev`) e compila (`build`) sem erros.
- Tema Guido aplicado (Tailwind + tokens).
- Autenticação Supabase (magic link) funcional.
- Rotas protegidas com redirecionamento.
- Lint, testes, typecheck e CI verdes.
- `.env.example` com variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.

### Segurança — visão geral
- Landing é pública, mas não deve carregar dados de usuário nem endpoints protegidos.
- Jamais expor segredos: apenas `VITE_SUPABASE_ANON_KEY` no cliente. Nunca usar `service_role` no frontend.
- RLS obrigatório e "default deny" em tabelas multi-tenant; UI não é controle de acesso.
- CSP, CORS e HTTPS: restringir origens e recursos; habilitar HSTS no provedor.
- Sanitização/XSS: evitar `dangerouslySetInnerHTML`; validar entrada de usuários.
- Sessões: usar mecânica do Supabase; não persistir PII sensível em `localStorage` além do necessário.
- CI/Repo: `.env` no `.gitignore`, secret scanning (gitleaks) e bloqueio de commits com chaves.

### Estrutura de páginas
- Landing (vendas): home pública com seções de produto, UVP, CTA → Login.
- Login: página de autenticação (magic link via Supabase v1).
- Dashboard: app protegido após login; link para Settings.

### Convenções
- Alias de import: `@/*` apontando para `src/`.
- Comentários âncora: incluir “AI dev note” em pontos críticos (tema, env, roteamento, auth, versões).

### Próximos passos após a base
- Tabela `profiles` no Supabase e sincronização pós-login.
- Esqueleto de features: Guia de Conversas, Memória Inteligente, Agente Notificador, Lembretes.
- Telemetria (Sentry) opcional.

AI dev note: Esta base foi desenhada para TS 3.4.16. Integração shadcn via MCP será feita por vendorização e possível simplificação de tipos para compatibilidade. Migração futura prevista: TS 5 → React 18 → Router 6 → Supabase v2 → adoção completa do shadcn UI.


