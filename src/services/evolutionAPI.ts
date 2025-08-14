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
  hash: {
    apikey: string;
  };
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

// Função para gerar nome da instância baseado no nome e WhatsApp
export const generateInstanceName = (nome: string, whatsapp: string): string => {
  // Remove espaços e caracteres especiais do nome, mantém apenas letras
  const nomeClean = nome.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z]/g, ''); // Remove tudo que não é letra
  
  // Remove tudo que não é número do WhatsApp
  const whatsappNumbers = whatsapp.replace(/\D/g, '');
  
  // Combina nome + números do WhatsApp (limitado a 20 caracteres)
  const instanceName = `${nomeClean}${whatsappNumbers}`.substring(0, 20);
  
  return instanceName;
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
    const apiKey = evolutionApiKey || import.meta.env.VITE_EVOLUTION_API_KEY;
    
    if (!apiKey) {
      throw new Error('Evolution API key não configurada');
    }

    // Gerar nome da instância
    const instanceName = generateInstanceName(nome, whatsapp);
    const token = instanceName; // Token igual ao nome da instância
    
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
      proxyHost: 'p.webshare.io',
      proxyPort: '80',
      proxyProtocol: 'http',
      proxyUsername: 'dbcnwkxu-rotate',
      proxyPassword: 'm8gnsoxw553d',
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
    const createInstanceUrl = `${baseUrl}instance/create`;

    // console.log('[Evolution API] Criando instância:', {
    //   instanceName,
    //   createInstanceUrl
    // });

    // Fazer requisição para criar instância
    const response = await fetch(createInstanceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey
      },
      body: JSON.stringify(instanceData)
    });

    if (!response.ok) {
      // const errorText = await response.text();
      // console.error('[Evolution API] Erro na resposta:', {
      //   status: response.status,
      //   statusText: response.statusText,
      //   body: errorText
      // });
      
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }

    const result: EvolutionInstanceResponse = await response.json();
    
    // console.log('[Evolution API] Instância criada com sucesso:', {
    //   instanceName: result.instance?.instanceName,
    //   status: result.instance?.status
    // });

    return {
      success: true,
      data: {
        instanceName: result.instance.instanceName,
        apiKey: result.hash.apikey,
        evolutionUrl: baseUrl
      }
    };

  } catch (error) {
    // console.error('[Evolution API] Erro ao criar instância:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Erro desconhecido ao criar instância WhatsApp';
    
    return {
      success: false,
      error: errorMessage
    };
  }
};
