# 🚀 Como Usar as Edge Functions UAZapi

## 📋 Guia Rápido para Desenvolvedores

Este documento mostra **como usar** as 4 Edge Functions criadas no frontend.

---

## 🔧 Pré-requisitos

1. ✅ Secrets configurados no Supabase (ver `CHECKLIST_SUPABASE_SECRETS.md`)
2. ✅ Variáveis no `.env`:
   ```env
   VITE_UAZAPI_VALIDATE_NUMBER_URL=https://...
   VITE_UAZAPI_INIT_INSTANCE_URL=https://...
   VITE_UAZAPI_CONNECT_INSTANCE_URL=https://...
   VITE_UAZAPI_CHECK_STATUS_URL=https://...
   ```
3. ✅ Usuário autenticado (ter `session.access_token`)

---

## 1️⃣ Validar Número no WhatsApp

**Quando usar:** No cadastro, para verificar se número existe no WhatsApp

```typescript
import { useSession } from '@/hooks/useSession';

async function validarWhatsApp(telefone: string) {
  const { session } = useSession();

  const response = await fetch(
    import.meta.env.VITE_UAZAPI_VALIDATE_NUMBER_URL,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        numbers: [telefone]  // Array de números
      })
    }
  );

  const result = await response.json();

  if (result.success) {
    const validation = result.data[0];
    
    console.log('Está no WhatsApp?', validation.isInWhatsapp);
    console.log('Nome verificado:', validation.verifiedName);
    console.log('JID:', validation.jid);
    
    return validation.isInWhatsapp;
  } else {
    console.error('Erro:', result.error);
    return false;
  }
}

// Uso:
const isValid = await validarWhatsApp('5561981446666');
if (isValid) {
  console.log('✅ Número válido!');
} else {
  console.error('❌ Número não está no WhatsApp');
}
```

**Resposta de sucesso:**

```json
{
  "success": true,
  "data": [
    {
      "query": "5561981446666",
      "isInWhatsapp": true,
      "jid": "556181446666@s.whatsapp.net",
      "verifiedName": "Nicolas Fujimoto"
    }
  ]
}
```

---

## 2️⃣ Criar Instância UAZapi

**Quando usar:** Após validar WhatsApp, criar instância para o usuário

```typescript
import { useSession } from '@/hooks/useSession';

async function criarInstancia(nome: string, whatsapp: string) {
  const { session, user } = useSession();

  if (!user) {
    throw new Error('Usuário não autenticado');
  }

  const response = await fetch(
    import.meta.env.VITE_UAZAPI_INIT_INSTANCE_URL,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        nome: nome,
        whatsapp: whatsapp,
        userId: user.id  // ID do auth.users
      })
    }
  );

  const result = await response.json();

  if (result.success) {
    console.log('✅ Instância criada!');
    console.log('Instance Name:', result.data.instanceName);
    console.log('Token:', result.data.token);  // Já salvo no banco
    console.log('Status:', result.data.status);  // "disconnected"
    
    return result.data;
  } else {
    console.error('Erro:', result.error);
    throw new Error(result.error);
  }
}

// Uso:
const instance = await criarInstancia('João Silva', '5561981446666');
console.log('Instância:', instance.instanceName);
```

**Resposta de sucesso:**

```json
{
  "success": true,
  "data": {
    "instanceName": "guido-joaosilva-446666",
    "instanceId": "r123abc456",
    "token": "95923455-f3df-4b8e-bcff-11fe84eb2579",
    "status": "disconnected"
  }
}
```

⚠️ **Importante:** O token é salvo automaticamente no banco (`usuarios.uazapi_token`). Você **não precisa** salvá-lo manualmente.

---

## 3️⃣ Conectar WhatsApp (QR Code ou Paircode)

**Quando usar:** Após criar instância, para conectar ao WhatsApp

### **Opção A: QR Code (Web)**

```typescript
import { useSession } from '@/hooks/useSession';

async function conectarComQRCode() {
  const { session, user } = useSession();

  const response = await fetch(
    import.meta.env.VITE_UAZAPI_CONNECT_INSTANCE_URL,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        userId: user.id,
        isMobile: false  // QR code
      })
    }
  );

  const result = await response.json();

  if (result.success && result.data.qrcode) {
    console.log('✅ QR Code gerado!');
    
    // Renderizar QR code
    const imgElement = document.getElementById('qrcode-img');
    imgElement.src = result.data.qrcode;  // data:image/png;base64,...
    
    return result.data.qrcode;
  } else {
    console.error('Erro:', result.error);
  }
}

// Uso:
const qrcode = await conectarComQRCode();
```

---

### **Opção B: Paircode (Mobile)**

```typescript
import { useSession } from '@/hooks/useSession';

async function conectarComPaircode(telefone: string) {
  const { session, user } = useSession();

  const response = await fetch(
    import.meta.env.VITE_UAZAPI_CONNECT_INSTANCE_URL,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        userId: user.id,
        isMobile: true,  // Paircode
        phone: telefone
      })
    }
  );

  const result = await response.json();

  if (result.success && result.data.paircode) {
    console.log('✅ Paircode gerado!');
    console.log('Código:', result.data.paircode);  // Ex: "QNRM-ZQMB"
    
    // Mostrar código para usuário digitar no WhatsApp
    alert(`Digite este código no WhatsApp: ${result.data.paircode}`);
    
    return result.data.paircode;
  } else {
    console.error('Erro:', result.error);
  }
}

// Uso:
const paircode = await conectarComPaircode('5561981446666');
```

---

### **Detecção Automática (Mobile vs Web)**

```typescript
function detectarDispositivo() {
  // Opção 1: User-Agent
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  // Opção 2: Largura da tela
  const isMobileScreen = window.innerWidth < 768;
  
  return isMobile || isMobileScreen;
}

async function conectarWhatsApp(telefone: string) {
  const isMobile = detectarDispositivo();
  
  const { session, user } = useSession();

  const response = await fetch(
    import.meta.env.VITE_UAZAPI_CONNECT_INSTANCE_URL,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        userId: user.id,
        isMobile: isMobile,
        phone: isMobile ? telefone : undefined
      })
    }
  );

  const result = await response.json();

  if (result.success) {
    if (result.data.qrcode) {
      // Mostrar QR code
      return { type: 'qrcode', data: result.data.qrcode };
    } else if (result.data.paircode) {
      // Mostrar paircode
      return { type: 'paircode', data: result.data.paircode };
    }
  }
}
```

**Resposta (QR Code):**

```json
{
  "success": true,
  "data": {
    "status": "connecting",
    "qrcode": "data:image/png;base64,iVBORw0KG...",
    "paircode": null,
    "connected": false,
    "loggedIn": false
  }
}
```

**Resposta (Paircode):**

```json
{
  "success": true,
  "data": {
    "status": "connecting",
    "qrcode": null,
    "paircode": "QNRM-ZQMB",
    "connected": false,
    "loggedIn": false
  }
}
```

---

## 4️⃣ Verificar Status (Polling)

**Quando usar:** Após chamar `/connect`, fazer polling até status = "connected"

```typescript
import { useSession } from '@/hooks/useSession';

function iniciarPollingStatus(
  onStatusChange: (status: string) => void,
  onConnected: (data: any) => void
) {
  const { session, user } = useSession();

  const interval = setInterval(async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_UAZAPI_CHECK_STATUS_URL,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({
            userId: user.id
          })
        }
      );

      const result = await response.json();

      if (result.success) {
        const { status, connected, loggedIn, profileName, profilePicUrl } = result.data;
        
        console.log('Status atual:', status);
        onStatusChange(status);

        if (status === 'connected' && connected && loggedIn) {
          clearInterval(interval);
          console.log('✅ WhatsApp conectado!');
          console.log('Nome:', profileName);
          console.log('Foto:', profilePicUrl);
          
          onConnected(result.data);
        }
      }
    } catch (error) {
      console.error('Erro no polling:', error);
    }
  }, 10000);  // 10 segundos

  // Retornar função para parar polling
  return () => clearInterval(interval);
}

// Uso:
const stopPolling = iniciarPollingStatus(
  (status) => {
    console.log('Status mudou para:', status);
  },
  (data) => {
    console.log('Conectado!', data.profileName);
  }
);

// Para parar manualmente:
// stopPolling();
```

**Resposta (connecting):**

```json
{
  "success": true,
  "data": {
    "status": "connecting",
    "connected": false,
    "loggedIn": false,
    "qrcode": "data:image/png;base64,...",  // QR atualizado
    "paircode": null,
    "profileName": null,
    "profilePicUrl": null
  }
}
```

**Resposta (connected):**

```json
{
  "success": true,
  "data": {
    "status": "connected",
    "connected": true,
    "loggedIn": true,
    "qrcode": null,
    "paircode": null,
    "profileName": "João Silva",
    "profilePicUrl": "https://pps.whatsapp.net/...",
    "jid": "556181446666@s.whatsapp.net",
    "lastDisconnect": null,
    "lastDisconnectReason": null
  }
}
```

---

## 🔄 Fluxo Completo de Cadastro

```typescript
async function fluxoCadastroCompleto(nome: string, telefone: string) {
  try {
    // 1. Validar número
    console.log('1️⃣ Validando WhatsApp...');
    const isValid = await validarWhatsApp(telefone);
    if (!isValid) {
      throw new Error('Número não está no WhatsApp');
    }

    // 2. Criar instância
    console.log('2️⃣ Criando instância...');
    const instance = await criarInstancia(nome, telefone);

    // 3. Conectar WhatsApp
    console.log('3️⃣ Conectando WhatsApp...');
    const connection = await conectarWhatsApp(telefone);
    
    if (connection.type === 'qrcode') {
      console.log('📱 Escaneie o QR code');
      // Mostrar QR code na tela
    } else {
      console.log('🔢 Digite o código:', connection.data);
      // Mostrar paircode na tela
    }

    // 4. Polling de status
    console.log('4️⃣ Aguardando conexão...');
    const stopPolling = iniciarPollingStatus(
      (status) => {
        console.log('Status:', status);
      },
      (data) => {
        console.log('✅ Conectado!', data.profileName);
        // Redirecionar para dashboard
        window.location.href = '/dashboard';
      }
    );

    return { success: true };
  } catch (error) {
    console.error('❌ Erro no cadastro:', error);
    return { success: false, error };
  }
}

// Uso:
await fluxoCadastroCompleto('João Silva', '5561981446666');
```

---

## ⏱️ Timeout e Renovação

### **QR Code expirou (2 minutos)**

```typescript
async function renovarQRCode() {
  // Basta chamar /connect novamente
  const qrcode = await conectarComQRCode();
  
  // Atualizar imagem na tela
  document.getElementById('qrcode-img').src = qrcode;
}

// Timer de 2 minutos
setTimeout(() => {
  renovarQRCode();
}, 120000);  // 2 minutos
```

### **Paircode expirou (5 minutos)**

```typescript
async function renovarPaircode(telefone: string) {
  // Basta chamar /connect novamente
  const paircode = await conectarComPaircode(telefone);
  
  // Mostrar novo código
  alert(`Novo código: ${paircode}`);
}

// Timer de 5 minutos
setTimeout(() => {
  renovarPaircode('5561981446666');
}, 300000);  // 5 minutos
```

---

## 🎨 Exemplo de Componente React

```tsx
import { useState, useEffect } from 'react';
import { useSession } from '@/hooks/useSession';

export function WhatsAppConnect() {
  const { session, user } = useSession();
  const [status, setStatus] = useState<'idle' | 'connecting' | 'connected'>('idle');
  const [qrcode, setQrcode] = useState<string | null>(null);
  const [paircode, setPaircode] = useState<string | null>(null);

  const conectar = async () => {
    setStatus('connecting');
    
    const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
    
    const response = await fetch(
      import.meta.env.VITE_UAZAPI_CONNECT_INSTANCE_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          userId: user.id,
          isMobile: isMobile,
          phone: isMobile ? user.whatsapp : undefined
        })
      }
    );

    const result = await response.json();
    
    if (result.success) {
      setQrcode(result.data.qrcode);
      setPaircode(result.data.paircode);
    }
  };

  useEffect(() => {
    if (status !== 'connecting') return;

    const interval = setInterval(async () => {
      const response = await fetch(
        import.meta.env.VITE_UAZAPI_CHECK_STATUS_URL,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${session.access_token}`
          },
          body: JSON.stringify({ userId: user.id })
        }
      );

      const result = await response.json();
      
      if (result.data.status === 'connected') {
        setStatus('connected');
        clearInterval(interval);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [status]);

  return (
    <div>
      {status === 'idle' && (
        <button onClick={conectar}>Conectar WhatsApp</button>
      )}
      
      {status === 'connecting' && qrcode && (
        <div>
          <h3>Escaneie o QR Code</h3>
          <img src={qrcode} alt="QR Code" />
        </div>
      )}
      
      {status === 'connecting' && paircode && (
        <div>
          <h3>Digite o código no WhatsApp</h3>
          <p style={{ fontSize: '2em' }}>{paircode}</p>
        </div>
      )}
      
      {status === 'connected' && (
        <div>
          <h3>✅ WhatsApp Conectado!</h3>
        </div>
      )}
    </div>
  );
}
```

---

## 🐛 Tratamento de Erros

```typescript
async function chamarEdgeFunction(url: string, body: any) {
  try {
    const { session } = useSession();

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify(body)
    });

    const result = await response.json();

    if (!result.success) {
      // Erro retornado pela Edge Function
      throw new Error(result.error);
    }

    return result.data;
  } catch (error) {
    // Erro de rede ou parsing
    console.error('Erro na chamada:', error);
    
    if (error instanceof TypeError) {
      throw new Error('Erro de conexão. Verifique sua internet.');
    }
    
    throw error;
  }
}
```

---

## 📚 Referências

- **Documentação completa:** `docs/MIGRACAO_UAZAPI.md`
- **Comparação de endpoints:** `docs/COMPARACAO_ENDPOINTS.md`
- **Checklist de secrets:** `docs/CHECKLIST_SUPABASE_SECRETS.md`

---

**Data:** 2025-11-12  
**Autor:** Claude AI

