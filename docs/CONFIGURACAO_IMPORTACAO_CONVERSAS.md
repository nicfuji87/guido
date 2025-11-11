# Configuração - Importação Automática de Conversas WhatsApp

## ✅ Implementação Concluída

Sistema completo de importação automática de conversas quando o corretor conecta seu WhatsApp pela primeira vez.

---

## 🏗️ Arquitetura

```
Usuário conecta WhatsApp
    ↓
Widget detecta (state = 'open')
    ↓
Verifica: primeira_importacao_solicitada?
    ↓ (se FALSE)
Edge Function → Webhook n8n
    ↓
n8n processa conversas em background
    ↓
Envia WhatsApp quando concluir
```

---

## 🔐 Configurar Secrets no Supabase (OBRIGATÓRIO)

### **Você precisa adicionar 4 secrets:**

1. Acesse: https://supabase.com/dashboard/project/zpzzvkjwnttrdtuvtmwv/settings/functions
2. Clique em **"Secrets"**
3. Adicione as seguintes variáveis:

```bash
# Já configurados (Edge Function create-evolution-instance)
EVOLUTION_API_URL=https://chat-guido.infusecomunicacao.online/
EVOLUTION_API_GLOBAL_KEY=9b6cd7db-bf58-4b18-8226-f202d9baaf67

# NOVOS (Edge Function trigger-import-conversations)
WEBHOOK_UPDATE_CONVERSATIONS_URL=https://webhook-flows-disp.infusecomunicacao.online/webhook/guidoAtualizaConversas
WEBHOOK_UPDATE_CONVERSATIONS_API_KEY=fc830405-46c5-4690-a5f7-d0d15d2add04
```

---

## 📋 Componentes Criados

### 1. **Migração de Banco de Dados** ✅

**Colunas adicionadas na tabela `usuarios`:**
- `primeira_importacao_solicitada` (BOOLEAN) - Flag para controle
- `data_primeira_importacao` (TIMESTAMP) - Quando foi solicitada

### 2. **Edge Function** ✅

**Nome:** `trigger-import-conversations`  
**Status:** ACTIVE  
**Versão:** 1

**Função:**
- Recebe dados do corretor e instância
- Busca informações completas do banco
- Dispara webhook n8n
- Retorna imediatamente (não espera processar)

**Payload enviado ao n8n:**
```json
{
  "action": "import_conversations",
  "corretor_id": "uuid",
  "corretor_nome": "Nicolas",
  "corretor_email": "email@example.com",
  "conta_id": "uuid",
  "conta_nome": "Nome da Conta",
  "whatsapp": "(61) 98144-6666",
  "instanceName": "guido-nicolass-446666",
  "apiKey": "446666-nicolass",
  "evolution_url": "https://chat-guido.infusecomunicacao.online/",
  "limit": 30,
  "tipo": "particular"
}
```

### 3. **Modal de Feedback** ✅

**Componente:** `src/components/WhatsAppImportModal.tsx`

**Mensagens:**
- "🎉 WhatsApp Conectado!"
- "Suas conversas estão sendo processadas"
- "Estamos importando suas últimas 30 conversas"
- "Te avisaremos quando estiver pronto"
- "⏱️ Tempo estimado: 5 a 15 minutos"
- Botão: "Entendi, pode fechar"

### 4. **Widget Atualizado** ✅

**Arquivo:** `src/components/widgets/EvolutionWhatsAppWidget.tsx`

**Lógica:**
1. Monitora mudança de estado da instância
2. Quando detecta `state: 'open'` (conectado)
3. Verifica flag `primeira_importacao_solicitada`
4. Se FALSE:
   - Dispara Edge Function
   - Marca flag como TRUE
   - Exibe modal
5. Polling continua verificando apenas STATUS (não re-importa)

### 5. **Banner Persistente** ✅

**Componente:** `src/components/WhatsAppConnectionBanner.tsx`

**Funcionalidades:**
- Aparece em todas as páginas até WhatsApp conectar
- Botão "Conectar Agora" leva para /integrations
- Auto-refresh a cada 30 segundos
- Pode ser dispensado (sessão)

---

## 🔄 Fluxo Completo

### **Passo 1: Usuário faz cadastro**
- Sistema cria instância Evolution automaticamente
- Email de confirmação enviado

### **Passo 2: Usuário confirma email**
- Redirecionado para dashboard autenticado
- Banner aparece: "WhatsApp não conectado"

### **Passo 3: Usuário conecta WhatsApp**
- Clica em "Conectar Agora" ou vai em Integrações
- Escaneia QR Code
- Estado muda para 'open'

### **Passo 4: Sistema detecta primeira conexão**
- Widget verifica flag `primeira_importacao_solicitada`
- Se FALSE → dispara importação

### **Passo 5: Edge Function dispara webhook**
- Busca dados completos do corretor
- POST para webhook n8n
- Marca flag como TRUE

### **Passo 6: Modal exibido**
- "Suas conversas estão sendo processadas"
- "Te avisaremos pelo WhatsApp quando estiver pronto"
- Usuário pode fechar e continuar usando

### **Passo 7: n8n processa em background**
- Busca últimas 30 conversas da Evolution API
- Cria clientes + conversas + mensagens no banco
- Envia WhatsApp de confirmação

### **Passo 8: Usuário recebe notificação**
- "✅ Pronto! Importamos X conversas..."
- Acessa Guido e vê conversas organizadas

### **Passo 9: Uso normal**
- Webhooks processam novas mensagens em tempo real
- Polling verifica apenas STATUS (não re-importa)
- Banner desaparece automaticamente

---

## 🧪 Como Testar

### **1. Configurar secrets no Supabase** (obrigatório)
Ver seção "Configurar Secrets" acima

### **2. Fazer novo cadastro**
```bash
# Excluir usuário de teste
# Fazer novo cadastro
# Confirmar email
```

### **3. Conectar WhatsApp**
- Ir em Integrações
- Clicar em "Conectar WhatsApp"
- Escanear QR Code
- Aguardar conexão

### **4. Verificar modal**
- Modal deve aparecer automaticamente
- Mensagem: "Suas conversas estão sendo processadas"
- Botão "Entendi, pode fechar"

### **5. Verificar logs**

**Console do browser:**
```
🎯 Primeira conexão detectada! Verificando se precisa importar conversas...
📥 Disparando importação de conversas...
✅ Importação disparada com sucesso
```

**Supabase Edge Function logs:**
```
[Edge Function] Disparando webhook n8n: https://webhook-flows-disp...
[Edge Function] Payload: { action: 'import_conversations', ... }
[Edge Function] Webhook disparado com sucesso!
```

**n8n logs:**
- Webhook recebido
- Processando conversas
- Salvando no banco
- Enviando WhatsApp

---

## 📊 Payload Exemplo para n8n

```json
{
  "action": "import_conversations",
  "corretor_id": "16b3bcbc-50e0-4489-b404-ed6d18ec5a46",
  "corretor_nome": "Nicolas Shuith Ramos Fujimoto",
  "corretor_email": "fujimoto.nicolas@gmail.com",
  "conta_id": "a08c63f7-cce7-436a-b93f-d777767b22d7",
  "conta_nome": "Nicolas Shuith Ramos Fujimoto",
  "whatsapp": "(61) 98144-6666",
  "instanceName": "guido-nicolass-446666",
  "apiKey": "446666-nicolass",
  "evolution_url": "https://chat-guido.infusecomunicacao.online/",
  "limit": 30,
  "tipo": "particular"
}
```

---

## 🎯 Workflow n8n Esperado

### **Nodes necessários:**

1. **Webhook Trigger**
   - Path: `/webhook/guidoAtualizaConversas`
   - Method: POST
   - Auth: Header `x-api-key`

2. **Evolution API: Buscar Chats**
   - GET `{{evolution_url}}/chat/findChats/{{instanceName}}`
   - Headers: `apikey: {{apiKey}}`
   - Limit: 30
   - Filtro: apenas conversas particulares (não grupos)

3. **Loop: Para cada chat**
   - Iterar sobre conversas retornadas

4. **Evolution API: Buscar Mensagens** (opcional)
   - GET `{{evolution_url}}/chat/findMessages/{{instanceName}}/{{chatId}}`
   - Últimas mensagens de cada conversa

5. **Supabase: Criar/Atualizar Cliente**
   - INSERT ou UPDATE na tabela `clientes`
   - Verificar por JID ou telefone

6. **Supabase: Criar Conversa**
   - INSERT na tabela `conversas`
   - Link com cliente_id

7. **Supabase: Criar Mensagens**
   - INSERT na tabela `mensagens`
   - Batch insert para performance

8. **Contador**
   - Contar total de conversas processadas

9. **Evolution API: Enviar WhatsApp**
   - POST `{{evolution_url}}/message/sendText/{{instanceName}}`
   - Mensagem de confirmação ao corretor

10. **Respond to Webhook**
    - Retornar sucesso

---

## 📱 Mensagem de WhatsApp Sugerida

```
✅ *Guido - Conversas Importadas!*

Olá! Suas conversas do WhatsApp foram importadas com sucesso! 🎉

📊 *Resumo:*
• {{total_conversas}} conversas importadas
• {{total_clientes}} clientes identificados
• {{total_mensagens}} mensagens processadas

🚀 *Próximos passos:*
1. Acesse guidoguia.com.br
2. Vá em "Conversas" para ver tudo organizado
3. O Guido já está analisando e gerando insights!

A partir de agora, todas as novas mensagens serão processadas automaticamente! 🤖

Qualquer dúvida, estamos aqui para ajudar! 😊
```

---

## ⚙️ Configurações

### **Limite de conversas:** 30 últimas
### **Tipo:** Apenas conversas particulares (não grupos)
### **Frequência:** Uma única vez (primeira conexão)
### **Reprocessar:** Apenas se marcar flag como FALSE manualmente

---

## 🔍 Troubleshooting

### **Modal não aparece:**
- Verificar console: "Primeira conexão detectada"
- Verificar flag no banco: `SELECT primeira_importacao_solicitada FROM usuarios`
- Verificar logs da Edge Function

### **Webhook não dispara:**
- Verificar secrets configurados
- Verificar logs da Edge Function
- Testar webhook manualmente com curl

### **Conversas não aparecem:**
- Verificar logs do n8n
- Verificar se n8n está salvando no Supabase
- Verificar RLS da tabela conversas

---

## 📝 Próximos Passos

1. ✅ Banco de dados atualizado
2. ✅ Edge Function deployada
3. ✅ Modal criado
4. ✅ Widget atualizado
5. ⏳ **VOCÊ: Configurar secrets no Supabase**
6. ⏳ **VOCÊ: Adaptar workflow n8n existente**
7. ⏳ Testar fluxo completo
8. ⏳ Ajustar mensagem WhatsApp final

---

**Data:** 11/11/2025  
**Status:** Implementação completa - Aguardando configuração de secrets e teste

