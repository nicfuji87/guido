## Fase 9 — CI simples (GitHub Actions)

Objetivo: validar automaticamente install, lint, typecheck, test e build.

### Workflow sugerido
- Disparo em `push` e `pull_request` na branch principal.
- Passos:
  1. Setup Node 20
  2. Instalar dependências (npm ci)
  3. Rodar `npm run lint`
  4. Rodar `npm run typecheck`
  5. Rodar `npm test -- --ci`
  6. Rodar `npm run build`

### Secretos e envs
- Não exigir variáveis de Supabase para build (somente em runtime no cliente).
- Se necessário, usar `VITE_` vars no provedor de deploy.

### Segurança
- Habilitar secret masking nos logs da pipeline.
- Adicionar etapa de secret scanning (ex.: gitleaks) no CI.

### Checklist de conclusão
- [ ] Workflow criado e passando
- [ ] Checks exigidos em PRs (opcional)

### Dicas de desenvolvimento
- Não torne o CI frágil; evite steps desnecessários.
- Quando um job falhar, leia o log completo antes de alterar configs.
- Mantenha caches (npm) configurados para builds mais rápidos.


