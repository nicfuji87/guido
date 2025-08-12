## Fase 2 — Bootstrap (Vite 2 + React 16 + TypeScript 3.4)

Objetivo: criar o esqueleto do app com Vite, React 16.14 e TypeScript 3.4.16.

### Versões-alvo
- Vite 2.9.18
- @vitejs/plugin-react-refresh 1.3.6
- React 16.14.0, React DOM 16.14.0
- TypeScript 3.4.16

### Passos
1) Criar projeto via Vite (template react-ts)
   - Ajustar versões manualmente em `package.json` para corresponder às acima.

2) Configurar Vite
   - `vite.config.ts`: usar `reactRefresh()` de `@vitejs/plugin-react-refresh`.
   - Habilitar alias `@` → `src/`.

3) Configurar TypeScript
   - `tsconfig.json`: 
     - `target`: `es2019`
     - `module`: `esnext`
     - `jsx`: `react`
     - `esModuleInterop`: `true`
     - `skipLibCheck`: `true`
     - `baseUrl`: `.` e `paths` para `@/*` → `src/*`

4) Scripts NPM
   - `dev`: `vite`
   - `build`: `vite build`
   - `preview`: `vite preview`

### Segurança
- AI dev note: Não incluir chaves privadas no bundle; apenas `VITE_SUPABASE_ANON_KEY` é permitido no cliente.
- Configurar `define` no Vite somente para variáveis `VITE_` necessárias.
- Revisar CSP e CORS no provedor de deploy (permitir apenas domínio oficial).

### Limpeza de boilerplate (Vite)
- Remover arquivos e assets padrão para evitar conflitos com nossa estrutura:
  - `src/App.css`
  - `src/index.css` (usaremos `src/styles/index.css`)
  - `src/assets/**` (ex.: `react.svg`)
  - `public/vite.svg`
- Atualizar `main.tsx` para importar `src/styles/index.css`.
- Substituir o conteúdo de `src/App.tsx` pelo shell mínimo que apenas renderiza as rotas (será definido na Fase 6) ou remover e usar `routes.tsx` como entry.
- Conferir `index.html`: remover referências a logos padrão e meta-tags desnecessárias do template.

### Estrutura mínima gerada
- `index.html`
- `src/main.tsx`, `src/App.tsx`
- `vite.config.ts`, `tsconfig.json`

### Checklist de conclusão
- [ ] Projeto compila (`vite build`) e roda (`vite`) sem erros
- [ ] Alias `@/*` funcional
- [ ] TS 3.4.16 instalado e reconhecido

### Dicas de desenvolvimento
- Não reescreva o código inteiro; ajuste apenas o necessário para compilar/rodar.
- Evite `any` e `@ts-ignore`. Se inevitável, isole e comente o motivo (AI dev note).
- Mantenha `vite.config.ts` simples; mudanças devem ser justificadas.
- Priorize compatibilidade com React 16.14 e TS 3.4 ao instalar libs.


