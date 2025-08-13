# 🔐 **Guia de Segurança - Guido**

## 📋 **Variáveis de Ambiente Obrigatórias**

### **🔑 Configuração Completa (.env):**

```bash
# Supabase Configuration
VITE_SUPABASE_URL="https://YOUR-PROJECT.supabase.co"
VITE_SUPABASE_ANON_KEY="YOUR_ANON_PUBLIC_KEY"

# Evolution API Configuration (WhatsApp Validation)
VITE_EVOLUTION_API_URL="https://your-evolution-instance.com/chat/whatsappNumbers/YOUR_INSTANCE_ID"
VITE_EVOLUTION_API_KEY="YOUR_EVOLUTION_API_KEY"
```

### **🛡️ Boas Práticas de Segurança:**

#### **1. Variáveis de Ambiente**
- ✅ **Nunca commite** arquivos `.env` reais
- ✅ **Use apenas** chaves públicas no frontend (ANON_KEY)
- ✅ **Mantenha** `.env` no `.gitignore`
- ✅ **Rotacione** API keys periodicamente

#### **2. Supabase Security**
- ✅ **RLS habilitado** em todas as tabelas
- ✅ **Apenas anon key** no frontend
- ✅ **Service role** apenas no backend
- ✅ **Políticas específicas** por tenant

#### **3. Evolution API**
- ✅ **API Key** em variável de ambiente
- ✅ **URL específica** para instância
- ✅ **Tratamento de erros** graceful
- ✅ **Cache** para evitar spam de requests

#### **4. Validações de Segurança**
- ✅ **CPF único** por conta
- ✅ **Email único** por sistema
- ✅ **WhatsApp único** e verificado
- ✅ **Validação de formato** antes de API calls

## 🚀 **Setup de Produção**

### **1. Variáveis no Deploy:**
```bash
# Para Vercel/Netlify/Similar
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_EVOLUTION_API_URL=https://your-evolution.com/...
VITE_EVOLUTION_API_KEY=YOUR-KEY
```

### **2. Configuração Supabase:**
```sql
-- Habilitar RLS em todas as tabelas
ALTER TABLE corretores ENABLE ROW LEVEL SECURITY;
ALTER TABLE contas ENABLE ROW LEVEL SECURITY;
-- ... etc

-- Políticas de segurança
CREATE POLICY "Users can only see their own data" 
ON corretores FOR ALL 
USING (auth.uid() = id);
```

### **3. Headers de Segurança:**
```javascript
// CSP Headers recomendados
"Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'"
```

## 🔍 **Checklist de Segurança**

### **Antes do Deploy:**
- [ ] Todas as variáveis configuradas
- [ ] RLS habilitado em todas as tabelas
- [ ] Políticas de acesso definidas
- [ ] API keys rotacionadas
- [ ] Headers de segurança configurados

### **Monitoramento:**
- [ ] Logs de acesso Evolution API
- [ ] Métricas de uso Supabase
- [ ] Alertas de tentativas de duplicata
- [ ] Monitoramento de performance

## ⚠️ **O que NUNCA fazer:**

1. **❌ Nunca commitar** credenciais reais
2. **❌ Nunca usar** service role no frontend
3. **❌ Nunca expor** API keys em código
4. **❌ Nunca desabilitar** RLS sem necessidade
5. **❌ Nunca ignorar** validações de entrada

## 🆘 **Em caso de Vazamento:**

### **Ação Imediata:**
1. **Rotacionar** todas as API keys
2. **Revogar** chaves expostas
3. **Verificar** logs de acesso
4. **Atualizar** todas as instâncias

### **Prevenção:**
1. **Secret scanning** no CI/CD
2. **Git hooks** para detectar secrets
3. **Revisão de código** obrigatória
4. **Treinamento** da equipe

---

**🛡️ Segurança é responsabilidade de todos!**

Mantenha sempre as melhores práticas e monitore regularmente o acesso às APIs.

