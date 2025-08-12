## Fase 7 — DX e Qualidade (Lint, Format, Testes)

Objetivo: garantir qualidade com ESLint, Prettier e Jest compatíveis com TS 3.4.

### Dependências
- `eslint` 7.32
- `@typescript-eslint/parser` 4.33
- `@typescript-eslint/eslint-plugin` 4.33
- `prettier` 2.8.x
- `eslint-config-prettier` 8.x
- `jest` 26.x
- `ts-jest` 26.x
- `@testing-library/react` 11.x
- `@testing-library/jest-dom` 5.x
- `jsdom` 16.x

### Configurações
- `.eslintrc.js` com parser TS e regras essenciais (no-unused-vars, import/order).
- `.prettierrc` padronizando aspas, largura de linha e ponto e vírgula.
- `jest.config.js` usando `ts-jest` preset e ambiente `jsdom`.

### Scripts
- `lint`: `eslint "src/**/*.{ts,tsx}"`
- `format`: `prettier --write .`
- `test`: `jest`
- `test:watch`: `jest --watch`
- `typecheck`: `tsc --noEmit`

### Teste smoke inicial
- Render do `App` sem crash e checagem de um texto fixo.

### Checklist de conclusão
- [ ] Lint roda sem erros
- [ ] Testes rodam e passam
- [ ] Typecheck sem quebras

### Segurança
- Ativar regras ESLint para sanitização (no-danger, jsx-no-target-blank, etc.).
- Configurar `pre-commit` com Husky/lint-staged para evitar commit de `.env` (git hook guard).

### Dicas de desenvolvimento
- Corrija uma regra de lint por vez; não desabilite globalmente.
- Se a regra for questionável, comente no código (AI dev note) ao invés de forçar.
- Escreva testes curtos e objetivos; priorize smoke tests nas rotas principais.


