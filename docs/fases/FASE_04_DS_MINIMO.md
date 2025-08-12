## Fase 4 — Design System Base + shadcn (vendorizado via MCP)

Objetivo: criar um kit básico de componentes com Tailwind, acessíveis e coerentes com a marca, incorporando componentes shadcn obtidos via MCP e adaptados para o stack (React 16, TS 3.4).

### Componentes-alvo
- shadcn vendorizados (sem Radix): `button`, `input`, `label`, `textarea`, `card`, `badge`, `separator` (opcional).
- Casos não compatíveis (ex.: `dialog`, `dropdown-menu`, `avatar`) serão adiados até migração para React 18/TS 5.

AI dev note: A incorporação shadcn será feita por cópia e adaptação dos arquivos, não via CLI oficial, garantindo compatibilidade com o stack legado.

### Diretrizes de estilo
- Fonte: Inter (ou sistema).
- Raio: 8px padrão.
- Contraste mínimo AA.
- Foco visível (outline ciano com offset).

### Organização
- `src/components/ui/` para os componentes reutilizáveis.
- Exportar via `src/components/ui/index.ts`.

### Adaptações de compatibilidade
- Remover dependências de Radix quando presentes.
- Se `class-variance-authority` (cva) acusar erro de tipos, simplificar as variantes para um mapeamento manual de classes e relaxar typings (tipar `variants` como `any` se necessário).
- Garantir que util `cn()` esteja disponível localmente.

### Segurança
- AI dev note: Não importar componentes de terceiros diretamente de CDNs em páginas logadas.
- Evitar dependências que exijam chaves públicas/privadas dentro do frontend.

### Checklist de conclusão
- [ ] Componentes criados e exportados
- [ ] Acessibilidade básica verificada (labels, foco)
- [ ] Variantes de Button funcionais

### Dicas de desenvolvimento
- Reaproveitar padrões entre componentes (ex.: tamanhos, radii, tipografia).
- Manter tipagens simples e claras; evite generics complexos no TS 3.4.
- Não alterar lógica de execução; mantenha componentes puros e previsíveis.
- Corrija apenas o necessário para acessibilidade/estilo.


