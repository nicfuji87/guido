## Fase 11 — Limitações e Migração Futura

Objetivo: explicitar limitações do stack atual e plano de migração.

### Limitações
- TypeScript 3.4.16 limita bibliotecas modernas (tipos e features).
- Sem shadcn/Radix: componentes e acessibilidade exigem mais esforço manual.
- React Router 5 (API antiga) e ausência de `Suspense`/features modernas.
- Supabase v1: API mais simples, menos recursos que v2.

### Plano de migração sugerido (ordem)
1. Atualizar para TypeScript 5.x
2. Atualizar React 18 e React Router 6
3. Migrar Supabase para v2
4. Adotar shadcn UI e Radix UI

### Critérios para iniciar migração
- Base estável e em produção com MVP validado
- Tempo alocado para refatoração sem interromper roadmap

### Riscos e mitigação
- Quebra de tipos e APIs: usar branches de migração e testes abrangentes
- UI regressões: teste visual e smoke em rotas críticas
- Segurança: revisar políticas RLS após cada migração; revalidar que nenhum segredo é exposto por engano no bundle.

### Dicas de desenvolvimento
- Planeje migração em etapas pequenas; valide cada etapa em PRs curtos.
- Não troque múltiplas versões (React/TS/Router) no mesmo PR.
- Documente divergências e workarounds como “AI dev note”.


