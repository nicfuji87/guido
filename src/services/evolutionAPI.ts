// AI dev note: Serviço para integração com Evolution API
// Responsável por criar e gerenciar instâncias do WhatsApp para usuários

export interface EvolutionInstanceData {
  instanceName: string;
  token: string;
  qrcode: boolean;
  number?: string;
  integration: 'WHATSAPP-BAILEYS';
  rejectCall: boolean;
  msgCall?: string;
  groupsIgnore: boolean;
  alwaysOnline: boolean;
  readMessages: boolean;
  readStatus: boolean;
  syncFullHistory: boolean;
  proxyHost?: string;
  proxyPort?: string;
  proxyProtocol?: string;
  proxyUsername?: string;
  proxyPassword?: string;
  webhook?: {
    url: string;
    byEvents: boolean;
    base64: boolean;
    headers?: {
      authorization?: string;
      'Content-Type'?: string;
    };
    events?: string[];
  };
  rabbitmq?: {
    enabled: boolean;
    events?: string[];
  };
  sqs?: {
    enabled: boolean;
    events?: string[];
  };
}

export interface EvolutionInstanceResponse {
  instance: {
    instanceName: string;
    instanceId: string;
    status: string;
  };
  hash: string; // A API key é o próprio hash (string)
  webhook?: {
    webhook: string;
  };
  qrcode?: {
    pairingCode?: string;
    code?: string;
    base64?: string;
  };
}

export interface CreateEvolutionInstanceResult {
  success: boolean;
  data?: {
    instanceName: string;
    apiKey: string;
    evolutionUrl: string;
  };
  error?: string;
}

// Função para gerar nome da instância personalizado
export const generateInstanceName = (nome: string, whatsapp: string): string => {
  // Remove espaços e caracteres especiais do nome, mantém apenas letras
  const nomeClean = nome.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z]/g, ''); // Remove tudo que não é letra
  
  // Pega os 10 primeiros caracteres do nome (ou todos se menos de 10)
  const nomeParte = nomeClean.substring(0, 10);
  
  // Remove tudo que não é número do WhatsApp
  const whatsappNumbers = whatsapp.replace(/\D/g, '');
  
  // Pega os 9 últimos dígitos do WhatsApp
  const telefoneParte = whatsappNumbers.slice(-9);
  
  // Combina: 10 chars nome + 9 últimos dígitos telefone
  const instanceName = `${nomeParte}${telefoneParte}`;
  
  return instanceName;
};

// AI dev note: Função para gerar nome de instância SEM WhatsApp
// Usado quando o usuário ainda não cadastrou WhatsApp
// Formato: {nome_limpo_10_chars}{hash_email_9_chars}
export const generateInstanceNameWithoutWhatsApp = (nome: string, email: string): string => {
  // Remove espaços e caracteres especiais do nome, mantém apenas letras
  const nomeClean = nome.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z]/g, ''); // Remove tudo que não é letra
  
  // Pega os 10 primeiros caracteres do nome (ou todos se menos de 10)
  const nomeParte = nomeClean.substring(0, 10).padEnd(10, 'x'); // Preenche com 'x' se menos de 10
  
  // Gerar hash simples do email (9 caracteres)
  // Usar apenas parte antes do @ e converter para base alphanumerica
  const emailParte = email.split('@')[0].toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
  
  // Pegar 9 caracteres do email ou preencher
  const emailHash = emailParte.substring(0, 9).padEnd(9, '0');
  
  // Combina: 10 chars nome + 9 chars do email
  const instanceName = `${nomeParte}${emailHash}`;
  
  return instanceName;
};

// Função para gerar API key personalizada (inverso do nome da instância)
export const generateInstanceApiKey = (nome: string, whatsapp: string): string => {
  // Remove espaços e caracteres especiais do nome, mantém apenas letras
  const nomeClean = nome.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z]/g, ''); // Remove tudo que não é letra
  
  // Pega os 10 primeiros caracteres do nome (ou todos se menos de 10)
  const nomeParte = nomeClean.substring(0, 10);
  
  // Remove tudo que não é número do WhatsApp
  const whatsappNumbers = whatsapp.replace(/\D/g, '');
  
  // Pega os 9 últimos dígitos do WhatsApp
  const telefoneParte = whatsappNumbers.slice(-9);
  
  // Combina INVERSO: 9 últimos dígitos + 10 chars nome
  const instanceApiKey = `${telefoneParte}${nomeParte}`;
  
  return instanceApiKey;
};

// Função para criar instância na Evolution API
export const createEvolutionInstance = async (
  nome: string, 
  whatsapp: string,
  evolutionUrl?: string,
  evolutionApiKey?: string
): Promise<CreateEvolutionInstanceResult> => {
  try {
    // Usar URLs e API keys padrão ou das variáveis de ambiente
    const baseUrl = evolutionUrl || import.meta.env.VITE_EVOLUTION_API_URL;
    const apiKey = evolutionApiKey || import.meta.env.VITE_EVOLUTION_API_GLOBAL_KEY;
    
    if (!apiKey) {
      throw new Error('Evolution Global API key não configurada');
    }

    // Gerar nome da instância e token personalizado
    const instanceName = generateInstanceName(nome, whatsapp);
    const token = generateInstanceApiKey(nome, whatsapp);
    
    // Preparar dados da instância
    const instanceData: EvolutionInstanceData = {
      instanceName,
      token,
      qrcode: true,
      number: whatsapp.replace(/\D/g, ''), // Apenas números
      integration: 'WHATSAPP-BAILEYS',
      rejectCall: false,
      msgCall: 'Olá! Esta é uma chamada automatizada. Por favor, envie uma mensagem.',
      groupsIgnore: true,
      alwaysOnline: false,
      readMessages: false,
      readStatus: false,
      syncFullHistory: true,
      // AI dev note: Proxy removido - causava erro 400 "Invalid proxy"
      // Se necessário, adicionar via variáveis de ambiente
      ...(import.meta.env.VITE_EVOLUTION_PROXY_HOST && {
        proxyHost: import.meta.env.VITE_EVOLUTION_PROXY_HOST,
        proxyPort: import.meta.env.VITE_EVOLUTION_PROXY_PORT,
        proxyProtocol: import.meta.env.VITE_EVOLUTION_PROXY_PROTOCOL,
        proxyUsername: import.meta.env.VITE_EVOLUTION_PROXY_USERNAME,
        proxyPassword: import.meta.env.VITE_EVOLUTION_PROXY_PASSWORD,
      }),
      webhook: {
        url: `${import.meta.env.VITE_APP_URL || 'https://app.guido.net.br'}/webhook/evolution/${instanceName}`,
        byEvents: true,
        base64: true,
        headers: {
          authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        events: [
          'APPLICATION_STARTUP',
          'QRCODE_UPDATED',
          'CONNECTION_UPDATE',
          'MESSAGES_UPSERT',
          'MESSAGES_UPDATE',
          'SEND_MESSAGE'
        ]
      },
      rabbitmq: {
        enabled: false,
        events: []
      },
      sqs: {
        enabled: false,
        events: []
      }
    };

    // Construir URL de criação dinamicamente  
    const createInstanceUrl = `${baseUrl}${baseUrl.endsWith('/') ? '' : '/'}instance/create`;

    // Fazer requisição para criar instância
    const response = await fetch(createInstanceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey,
        'Authorization': `Bearer ${apiKey}`, // Tentar Bearer também
        'x-api-key': apiKey // Tentar x-api-key também
      },
      body: JSON.stringify(instanceData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ${response.status}: ${response.statusText} - ${errorText}`);
    }

    const result: EvolutionInstanceResponse = await response.json();
    
    // Usar nosso token personalizado como API key
    const instanceApiKey = token;
    
    return {
      success: true,
      data: {
        instanceName: result.instance.instanceName,
        apiKey: instanceApiKey,
        evolutionUrl: baseUrl
      }
    };

  } catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Erro desconhecido ao criar instância WhatsApp';
    
    return {
      success: false,
      error: errorMessage
    };
  }
};

// AI dev note: Função para criar instância SEM número de WhatsApp
// Usada quando usuário ainda não cadastrou WhatsApp mas precisa conectar
export const createEvolutionInstanceWithoutWhatsApp = async (
  nome: string,
  email: string,
  evolutionUrl?: string,
  evolutionApiKey?: string
): Promise<CreateEvolutionInstanceResult> => {
  try {
    // Usar URLs e API keys padrão ou das variáveis de ambiente
    const baseUrl = evolutionUrl || import.meta.env.VITE_EVOLUTION_API_URL;
    const apiKey = evolutionApiKey || import.meta.env.VITE_EVOLUTION_API_GLOBAL_KEY;
    
    if (!apiKey) {
      throw new Error('Evolution Global API key não configurada');
    }

    // Gerar nome da instância baseado em nome + email (sem WhatsApp)
    const instanceName = generateInstanceNameWithoutWhatsApp(nome, email);
    
    // Token será o inverso do instanceName para manter padrão
    const token = instanceName.split('').reverse().join('');
    
    // Preparar dados da instância (SEM número de WhatsApp)
    const instanceData: EvolutionInstanceData = {
      instanceName,
      token,
      qrcode: true,
      // AI dev note: number é opcional - não passar quando não temos WhatsApp
      // O número será vinculado quando usuário escanear QR Code
      integration: 'WHATSAPP-BAILEYS',
      rejectCall: false,
      msgCall: 'Olá! Esta é uma chamada automatizada. Por favor, envie uma mensagem.',
      groupsIgnore: true,
      alwaysOnline: false,
      readMessages: false,
      readStatus: false,
      syncFullHistory: true,
      // AI dev note: Proxy removido - causava erro 400 "Invalid proxy"
      // Se necessário, adicionar via variáveis de ambiente
      ...(import.meta.env.VITE_EVOLUTION_PROXY_HOST && {
        proxyHost: import.meta.env.VITE_EVOLUTION_PROXY_HOST,
        proxyPort: import.meta.env.VITE_EVOLUTION_PROXY_PORT,
        proxyProtocol: import.meta.env.VITE_EVOLUTION_PROXY_PROTOCOL,
        proxyUsername: import.meta.env.VITE_EVOLUTION_PROXY_USERNAME,
        proxyPassword: import.meta.env.VITE_EVOLUTION_PROXY_PASSWORD,
      }),
      webhook: {
        url: `${import.meta.env.VITE_APP_URL || 'https://app.guido.net.br'}/webhook/evolution/${instanceName}`,
        byEvents: true,
        base64: true,
        headers: {
          authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        events: [
          'APPLICATION_STARTUP',
          'QRCODE_UPDATED',
          'CONNECTION_UPDATE',
          'MESSAGES_UPSERT',
          'MESSAGES_UPDATE',
          'SEND_MESSAGE'
        ]
      },
      rabbitmq: {
        enabled: false,
        events: []
      },
      sqs: {
        enabled: false,
        events: []
      }
    };

    // Construir URL de criação dinamicamente  
    const createInstanceUrl = `${baseUrl}${baseUrl.endsWith('/') ? '' : '/'}instance/create`;

    // Fazer requisição para criar instância
    const response = await fetch(createInstanceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey,
        'Authorization': `Bearer ${apiKey}`,
        'x-api-key': apiKey
      },
      body: JSON.stringify(instanceData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ${response.status}: ${response.statusText} - ${errorText}`);
    }

    const result: EvolutionInstanceResponse = await response.json();
    
    return {
      success: true,
      data: {
        instanceName: result.instance.instanceName,
        apiKey: token,
        evolutionUrl: baseUrl
      }
    };

  } catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Erro desconhecido ao criar instância WhatsApp';
    
    return {
      success: false,
      error: errorMessage
    };
  }
};
