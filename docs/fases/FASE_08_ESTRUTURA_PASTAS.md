## Fase 8 — Estrutura de Pastas

Objetivo: organizar o projeto para escalabilidade.

### Layout proposto
```
src/
  app/
    routes.tsx
    guards/
      PrivateRoute.tsx
    layout/
      AppLayout.tsx
  components/
    ui/
      Button.tsx
      Input.tsx
      Textarea.tsx
      Card.tsx
      Badge.tsx
      index.ts
  pages/
    Landing/
      index.tsx
    Login/
      index.tsx
    Dashboard/
      index.tsx
    Settings/
      index.tsx
  lib/
    supabaseClient.ts
    utils.ts (cn, helpers)
  styles/
    index.css
    tokens.css
  types/
index.html
vite.config.ts
tsconfig.json
tailwind.config.js
postcss.config.js
.env.example
.eslintrc.js
.prettierrc
jest.config.js
```

### Convenções
- Importar via `@/` a partir de `src/`.
- Componentes em `components/ui/` com export centralizado.
- Páginas em `pages/` por rota.

### Segurança
- Separar claramente `pages/Landing` (pública) do restante; nada de hooks de sessão carregados na landing.
- Não incluir chaves ou endpoints administrativos em código cliente.

### Checklist de conclusão
- [ ] Estrutura criada
- [ ] Alias funcionando
- [ ] Imports limpos (sem caminhos relativos profundos)

### Dicas de desenvolvimento
- Respeite a estrutura proposta; evite diretórios “utils/” genéricos inchados.
- Prefira coesão por feature/rota nas páginas.
- Centralize reexports em `components/ui/index.ts` para imports curtos.


