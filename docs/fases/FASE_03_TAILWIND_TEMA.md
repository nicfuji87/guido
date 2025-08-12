## Fase 3 — Tailwind CSS e Tema Guido

Objetivo: configurar Tailwind CSS e aplicar a identidade visual do Guido.

### Dependências
- tailwindcss 3.4.x
- postcss 8.4.x
- autoprefixer 10.4.x

### Passos
1) Inicializar Tailwind
   - Gerar `tailwind.config.js` e `postcss.config.js`.
   - `content`: `./index.html`, `./src/**/*.{ts,tsx}`.

2) Definir tokens da marca
   - Criar `src/styles/tokens.css` com CSS variables:
     - `--color-bg: #0D1117`
     - `--color-accent: #00F6FF`
     - `--color-text: #F0F6FC`
     - `--gradient-main: linear-gradient(135deg, #0D1117 0%, #00F6FF 100%)`

3) Estilos globais
   - `src/styles/index.css` com diretivas `@tailwind base; @tailwind components; @tailwind utilities;` e aplicação:
     - `body { background: var(--color-bg); color: var(--color-text); }`

4) Integração
   - Importar `src/styles/index.css` em `src/main.tsx`.
   - Opcional: tipografia (Inter) via CDN/Google Fonts no `index.html`.

5) Limpeza de boilerplate (Tailwind)
   - Remover quaisquer estilos utilitários padrão do template caso conflitem.
   - Garantir que `index.css` contenha apenas `@tailwind` + nossas camadas e tokens.
   - Conferir que não há `@layer` conflitante vindo de CSS antigo (`App.css`, etc.).

### Componentes utilitários
- Classe de gradiente: `bg-gradient-main` (via plugin custom ou CSS global).
- Util de merge de classes: `cn()` em `src/lib/utils.ts` (sem dependências externas).

### Checklist de conclusão
- [ ] Tailwind aplicado e ativo nas páginas
- [ ] Paleta Guido aplicada ao `body`
- [ ] Tokens centralizados em `tokens.css`

### Segurança
- AI dev note: CSS não deve carregar assets externos sem necessidade (evitar fontes self-host sem licença).
- Evitar inclusão de CSS/JS de terceiros via CDN nas páginas protegidas.

### Dicas de desenvolvimento
- Reutilize utilitários Tailwind e tokens antes de criar novas classes.
- Mantenha componentes estilizados com classes claras; evite sobreescritas complexas.
- Prefira utilitários ao CSS custom quando possível.


