# 🔄 Comparação de Endpoints: Evolution API vs UAZapi

## 📊 Tabela Resumida

| Funcionalidade | Evolution API | UAZapi (Edge Function) |
|----------------|---------------|------------------------|
| **Validar WhatsApp** | ❌ `/chat/whatsappNumbers/{instance}` | ✅ `uazapi-validate-number` |
| **Criar Instância** | ❌ `/instance/create` | ✅ `uazapi-init-instance` |
| **Conectar WhatsApp** | ❌ Incluído no create | ✅ `uazapi-connect-instance` |
| **Verificar Status** | ❌ Não documentado | ✅ `uazapi-check-status` |
| **Segurança** | ⚠️ Credenciais no frontend | ✅ Server-side (Edge Functions) |

---

## 1️⃣ VALIDAR NÚMERO NO WHATSAPP

### **ANTES - Evolution API**

```typescript
// ❌ Chamada direta do frontend (menos seguro)
const response = await fetch(
  `${EVOLUTION_URL}/chat/whatsappNumbers/${EVOLUTION_INSTANCE_NAME}`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': EVOLUTION_API_KEY  // ⚠️ Exposto no frontend
    },
    body: JSON.stringify({
      numbers: ['5561981446666']
    })
  }
);
```

**Problemas:**
- ❌ URL e credenciais expostas no frontend
- ❌ Precisa do nome da instância na URL
- ❌ Menos controle server-side

---

### **DEPOIS - UAZapi (Edge Function)**

```typescript
// ✅ Chamada via Edge Function (seguro)
const response = await fetch(
  import.meta.env.VITE_UAZAPI_VALIDATE_NUMBER_URL,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,  // ✅ JWT do Supabase
      'Authorization': `Bearer ${session.access_token}`  // ✅ Autenticação
    },
    body: JSON.stringify({
      numbers: ['5561981446666']
    })
  }
);

// Edge Function faz:
// 1. Valida JWT do usuário
// 2. Pega token da instância Nicolas (secret server-side)
// 3. Chama UAZapi: POST /chat/check
// 4. Retorna resultado
```

**Vantagens:**
- ✅ Credenciais UAZapi ficam no server (Supabase Secrets)
- ✅ Autenticação via JWT
- ✅ Logs centralizados
- ✅ Fácil trocar provedor sem alterar frontend

---

## 2️⃣ CRIAR INSTÂNCIA

### **ANTES - Evolution API**

```typescript
// ❌ Payload complexo, token gerado pelo cliente
const response = await fetch(
  `${EVOLUTION_URL}/instance/create`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': EVOLUTION_API_GLOBAL_KEY  // ⚠️ Exposto
    },
    body: JSON.stringify({
      instanceName: 'guido-joao-123456',
      token: 'token-123456',  // ⚠️ Cliente define token
      qrcode: true,
      integration: 'WHATSAPP-BAILEYS',
      rejectCall: false,
      groupsIgnore: true,
      alwaysOnline: false,
      readMessages: false,
      readStatus: false,
      syncFullHistory: true,
      // ... mais 10+ campos opcionais
    })
  }
);

// Resposta:
// { instance: { instanceName: "...", ... } }
```

**Problemas:**
- ❌ Payload muito complexo
- ❌ Token definido pelo cliente (menos seguro)
- ❌ Credenciais expostas
- ❌ QR code gerado imediatamente (pode expirar antes do usuário ver)

---

### **DEPOIS - UAZapi (Edge Function)**

```typescript
// ✅ Payload simples, token gerado pelo servidor
const response = await fetch(
  import.meta.env.VITE_UAZAPI_INIT_INSTANCE_URL,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${session.access_token}`
    },
    body: JSON.stringify({
      nome: 'João',
      whatsapp: '5561981446666',
      userId: user.id  // ✅ Identifica o usuário autenticado
    })
  }
);

// Edge Function faz:
// 1. Valida JWT
// 2. Gera instanceName: guido-joao-123456
// 3. Chama UAZapi: POST /instance/init { name, systemName }
// 4. UAZapi GERA token único
// 5. Salva token no banco (usuarios.uazapi_token)
// 6. Retorna dados

// Resposta:
// {
//   success: true,
//   data: {
//     instanceName: "guido-joao-123456",
//     instanceId: "r123abc",
//     token: "95923455-f3df-4b8e-bcff-11fe84eb2579",  // ✅ Gerado pelo servidor
//     status: "disconnected"
//   }
// }
```

**Vantagens:**
- ✅ Payload minimalista (só nome e WhatsApp)
- ✅ Token gerado pelo servidor UAZapi (mais seguro)
- ✅ Token salvo automaticamente no banco
- ✅ Não gera QR ainda (separado em outro endpoint)

---

## 3️⃣ CONECTAR WHATSAPP (QR CODE / PAIRCODE)

### **ANTES - Evolution API**

```typescript
// ❌ QR code já vinha no /instance/create
// Sem suporte oficial para paircode
// Sem endpoint separado para regerar QR

// Se QR expirasse, tinha que criar nova instância
```

**Problemas:**
- ❌ QR code gerado imediatamente (pode expirar)
- ❌ Sem suporte a paircode (mobile)
- ❌ Difícil regerar QR sem recriar instância

---

### **DEPOIS - UAZapi (Edge Function)**

```typescript
// ✅ Endpoint separado para conectar

// Web (QR Code)
const response = await fetch(
  import.meta.env.VITE_UAZAPI_CONNECT_INSTANCE_URL,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${session.access_token}`
    },
    body: JSON.stringify({
      userId: user.id,
      isMobile: false  // ✅ Não envia phone → QR code
    })
  }
);

// Resposta:
// {
//   success: true,
//   data: {
//     status: "connecting",
//     qrcode: "data:image/png;base64,iVBORw0KG...",  // ✅ QR code base64
//     paircode: null,
//     connected: false
//   }
// }

// ---

// Mobile (Paircode)
const response = await fetch(
  import.meta.env.VITE_UAZAPI_CONNECT_INSTANCE_URL,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${session.access_token}`
    },
    body: JSON.stringify({
      userId: user.id,
      isMobile: true,  // ✅ Envia phone → Paircode
      phone: '5561981446666'
    })
  }
);

// Resposta:
// {
//   success: true,
//   data: {
//     status: "connecting",
//     qrcode: null,
//     paircode: "QNRM-ZQMB",  // ✅ Código para digitar no WhatsApp
//     connected: false
//   }
// }
```

**Vantagens:**
- ✅ Endpoint separado (gera QR quando usuário está pronto)
- ✅ Suporte a paircode para mobile
- ✅ Pode regerar QR/paircode chamando novamente
- ✅ Timeout tratado (basta chamar de novo)

---

## 4️⃣ VERIFICAR STATUS (POLLING)

### **ANTES - Evolution API**

```typescript
// ❌ Não havia endpoint documentado para polling
// Precisava recriar instância ou chamar webhook
```

**Problemas:**
- ❌ Sem polling oficial
- ❌ Difícil monitorar progresso da conexão

---

### **DEPOIS - UAZapi (Edge Function)**

```typescript
// ✅ Endpoint dedicado para polling

const interval = setInterval(async () => {
  const response = await fetch(
    import.meta.env.VITE_UAZAPI_CHECK_STATUS_URL,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        userId: user.id
      })
    }
  );

  const { data } = await response.json();
  
  console.log('Status:', data.status);  // connecting → connected
  
  if (data.status === 'connected') {
    clearInterval(interval);
    console.log('✅ WhatsApp conectado!');
    console.log('Perfil:', data.profileName);
    console.log('Foto:', data.profilePicUrl);
    console.log('JID:', data.jid);
  }
}, 10000);  // A cada 10 segundos

// Edge Function faz:
// 1. Valida JWT
// 2. Pega token do usuário no banco
// 3. Chama UAZapi: GET /instance/status
// 4. Atualiza banco com status/perfil/foto
// 5. Retorna dados atualizados
```

**Vantagens:**
- ✅ Polling fácil e seguro
- ✅ Atualiza banco automaticamente
- ✅ Retorna QR code atualizado (se ainda connecting)
- ✅ Detecta quando conectou

---

## 📋 Resumo das Mudanças

| Aspecto | Evolution | UAZapi |
|---------|-----------|---------|
| **Segurança** | ⚠️ Credenciais no frontend | ✅ Server-side (Secrets) |
| **Complexidade** | ⚠️ Payload grande | ✅ Payload simples |
| **Token** | ⚠️ Cliente define | ✅ Servidor gera |
| **QR Code** | ⚠️ Imediato (expira) | ✅ Sob demanda |
| **Paircode** | ❌ Não suporta | ✅ Suporta mobile |
| **Polling** | ❌ Não documentado | ✅ Endpoint dedicado |
| **Flexibilidade** | ⚠️ Difícil mudar | ✅ Fácil adaptar |
| **Logging** | ⚠️ Disperso | ✅ Centralizado |

---

## 🎯 Fluxo Comparado

### **ANTES - Evolution API**

```
1. Frontend → POST /instance/create
   ↓
2. ❌ Recebe QR code (pode expirar antes do usuário ver)
   ↓
3. Frontend renderiza QR
   ↓
4. ❓ Como saber se conectou? (sem polling oficial)
   ↓
5. ⚠️ Se timeout, criar nova instância
```

---

### **DEPOIS - UAZapi + Edge Functions**

```
1. Frontend → POST uazapi-init-instance
   ↓
2. ✅ Instância criada, token salvo no banco
   ↓
3. Frontend → POST uazapi-connect-instance
   ↓
4. ✅ QR/Paircode gerado sob demanda
   ↓
5. Frontend renderiza QR/Paircode
   ↓
6. Frontend → Polling: POST uazapi-check-status (10s)
   ↓
7. ✅ Status atualizado (connecting → connected)
   ↓
8. ✅ Se timeout, chamar connect novamente (novo QR)
```

---

## 🔐 Fluxo de Autenticação

### **ANTES - Evolution API**

```
Frontend
  ↓ apikey (exposto)
Evolution API
```

⚠️ **Problema:** Qualquer pessoa com acesso ao frontend pode pegar o `apikey` e fazer chamadas.

---

### **DEPOIS - UAZapi + Edge Functions**

```
Frontend
  ↓ JWT (session.access_token)
Edge Function (Supabase)
  ↓ Valida JWT
  ↓ Pega token do banco (server-side)
  ↓ admintoken/token (secret)
UAZapi
```

✅ **Vantagem:** 
- Credenciais UAZapi nunca chegam no frontend
- Apenas usuários autenticados podem fazer chamadas
- Controle granular no server

---

## 📞 URLs de Produção

### Edge Functions (Supabase)

```
https://zpzzvkjwnttrdtuvtmwv.supabase.co/functions/v1/uazapi-validate-number
https://zpzzvkjwnttrdtuvtmwv.supabase.co/functions/v1/uazapi-init-instance
https://zpzzvkjwnttrdtuvtmwv.supabase.co/functions/v1/uazapi-connect-instance
https://zpzzvkjwnttrdtuvtmwv.supabase.co/functions/v1/uazapi-check-status
```

### UAZapi (chamadas server-side)

```
https://infuse.uazapi.com/chat/check
https://infuse.uazapi.com/instance/init
https://infuse.uazapi.com/instance/connect
https://infuse.uazapi.com/instance/status
```

⚠️ **Importante:** Frontend NUNCA chama UAZapi diretamente, sempre via Edge Functions.

---

**Data:** 2025-11-12  
**Autor:** Claude AI

