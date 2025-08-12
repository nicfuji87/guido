## Fase 1 — Preparação e Diretivas

Objetivo: preparar ambiente, repositório e diretrizes de projeto.

### Requisitos
- Node 20 LTS instalado
- Git instalado
- PowerShell (Windows)

### Passos
1) Criar repositório Git
   - Inicializar Git no diretório do projeto.
   - Configurar `.gitignore` para Node, Vite, logs e `.env`.

2) Estruturar diretórios iniciais
   - Criar `docs/`, `docs/fases/` e placeholders de documentação.

3) Diretrizes do projeto
   - Alias de import `@/*` apontando para `src/` (definir posteriormente em `tsconfig.json` e Vite).
   - Commits semânticos (convencional) — opcional com Husky/lint-staged.

4) Decisões registradas (AI dev note)
   - Manter TypeScript 3.4.16 por estabilidade.
   - Usar React 16.14, React Router 5, Vite 2.9, Supabase v1.
   - Não usar shadcn/Radix devido a incompatibilidades de tipos.

### Artefatos
- `CLAUDE.md` com as decisões acima e trade‑offs.
- `.gitignore` adequado a Node/Vite/Windows.

### Segurança
- AI dev note: Nunca commitar `.env`; usar `.env.example` sem segredos.
- Habilitar secret scanning no repositório (GitHub: push protection).
- Definir papéis de acesso no repositório e revisar permissões regularmente.

### Checklist de conclusão
- [ ] Git inicializado e remoto configurado (se aplicável)
- [ ] Documentação criada com as decisões de arquitetura
- [ ] `.gitignore` pronto
- [ ] Política de segredos documentada e ativa

### Dicas de desenvolvimento
- Reaproveitar código existente antes de criar novo.
- Manter TypeScript com `strict: true` sempre que possível no TS 3.4.
- Analise a mensagem de erro antes de corrigir; corrija apenas o necessário.
- Não use `any`, `@ts-ignore` ou `eslint-disable` como solução primária; prefira `unknown` ou manter os tipos.
- Respeite estrutura, imports e padrões do projeto; não altere `AI dev note`/TODOs.
- Evite mudar configurações do bundler sem justificativa e registro em documentação.
- Se a causa for versão de pacote, sugira a correção em comentário/issue em vez de aplicar direto.
- Se houver dúvida, documente claramente em comentário (sem “gambiarras”).
- Faça a menor alteração possível por ocorrência; funções ≤ 50 linhas, classes ≤ 400 linhas.


