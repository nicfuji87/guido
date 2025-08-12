## Fase 5 — Supabase v1 (cliente e autenticação)

Objetivo: preparar cliente Supabase v1 e autenticação por magic link (email OTP).

### Dependências
- `@supabase/supabase-js` 1.35.7

### Variáveis de ambiente
- `.env` (não versionado) e `.env.example` com:
  - `VITE_SUPABASE_URL="https://YOUR-PROJECT.supabase.co"`
  - `VITE_SUPABASE_ANON_KEY="YOUR_ANON_PUBLIC_KEY"`

AI dev note: Nunca expor `service_role` no frontend. Manter apenas a chave `anon` no cliente. Secrets de servidor devem ficar em edge functions/APIs privadas.

### Cliente Supabase
- `src/lib/supabaseClient.ts`:
  - Criar singleton com `createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)`.
  - Exportar `supabase`.

### Autenticação (magic link)
- Tela `/login` com input de email e botão “Enviar link de acesso”.
- Chamar `supabase.auth.signIn({ email })`.
- Exibir feedback (sucesso/erro) e instrução para abrir o email.

### Sessão e guarda
- Listener: `supabase.auth.onAuthStateChange` para reagir a login/logout.
- Guardar sessão em estado global simples (Context API) ou hook.
- Rota protegida redireciona para `/login` se não autenticado.

### Segurança
- Habilitar RLS no banco e validar que queries do cliente respeitam RLS.
- Não persistir dados sensíveis além do necessário no `localStorage`.
- Configurar Redirect URLs do Supabase apenas para domínios oficiais.
- Usar `https` sempre; habilitar verificação de e-mail, limitar tentativas de OTP.

### Checklist de conclusão
- [ ] `.env.example` criado
- [ ] Cliente Supabase funcional
- [ ] Fluxo de magic link end-to-end confirmado

### Dicas de desenvolvimento
- Valide mensagens de erro do Supabase antes de tratar; não mascare.
- Não altere a lógica de autenticação; apenas trate estados (carregando/erro/sucesso).
- Isolar chamadas de API em um módulo (`lib/`) para facilitar testes e manutenção.


