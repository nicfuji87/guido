## Fase 10 — Conteúdo inicial (Landing de Vendas e Login)

Objetivo: publicar páginas base com branding e fluxo de autenticação.

### Landing (`/`)
- Hero com:
  - Título: “Menos digitação, mais negociação.”
  - Subtítulo: “O guia inteligente do corretor.”
  - CTAs primários: “Começar agora” → `/login`
- Fundo com gradiente Guido.
  
AI dev note: Landing é pública e não deve carregar nenhum dado de usuário/tokens.

### Login (`/login`)
- Formulário com input de email e botão de envio.
- Integração com `supabase.auth.signIn({ email })` (v1).
- Mensagens de sucesso/erro.

### Segurança
- Formular validações no cliente e servidor (se aplicável) para evitar abuso.
- Limitar tentativas de OTP (no painel Supabase) e proteger URLs de redirecionamento.

### Layout e navegação
- Header com logotipo “Guido”.
- Links básicos para `/app` (após login) e `/settings`.

### Checklist de conclusão
- [ ] Landing renderiza com tema e CTAs
- [ ] `/login` envia magic link e informa o usuário
- [ ] Redirecionamento pós-login para `/app`

### Dicas de desenvolvimento
- Reaproveitar componentes do DS (Button/Input/Card) ao compor Landing/Login.
- Não alterar lógica de autenticação na UI; apenas invocar fluxo do Supabase.
- Otimize imagens/ilustrações da landing; evite assets pesados.


