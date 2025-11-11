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

// AI dev note: generateInstanceName e generateInstanceApiKey foram removidas
// Agora a criação de instância é feita via Edge Function no Supabase
// A geração do instanceName acontece na Edge Function para maior segurança

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

// AI dev note: createEvolutionInstance removida - agora usa Edge Function do Supabase
// A criação de instância com WhatsApp é feita via supabase.functions.invoke('create-evolution-instance')
// Apenas createEvolutionInstanceWithoutWhatsApp permanece para uso no widget de configuração

// AI dev note: Função para criar instância SEM número de WhatsApp
// Usada quando usuário ainda não cadastrou WhatsApp mas precisa conectar
// Implementa fallback automático - tenta com proxy, se falhar tenta sem proxy
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

    // Gerar nome da instância e token SIMPLIFICADO para evitar conflitos
    // AI dev note: Usando timestamp + hash simples para garantir unicidade sem causar erros no Evolution
    const timestamp = Date.now().toString();
    const nomeClean = nome.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z]/g, '')
      .substring(0, 8);
    
    const instanceName = `guido-${nomeClean}-${timestamp.slice(-6)}`;
    const token = `token-${timestamp.slice(-10)}`;
    
    console.log(`[Evolution API] Gerando instância (sem WhatsApp): ${instanceName}`);
    
    // Verificar se proxy está configurado
    const hasProxyConfig = Boolean(import.meta.env.VITE_EVOLUTION_PROXY_HOST);
    
    // Preparar dados base da instância (SEM número de WhatsApp e sem proxy)
    // AI dev note: Payload simplificado - campos complexos como webhook removidos para evitar erros
    // O número será vinculado quando usuário escanear QR Code
    const baseInstanceData = {
      instanceName,
      token,
      qrcode: true,
      integration: 'WHATSAPP-BAILEYS' as const,
      rejectCall: false,
      groupsIgnore: true,
      alwaysOnline: false,
      readMessages: false,
      readStatus: false,
      syncFullHistory: true
    };

    const createInstanceUrl = `${baseUrl}${baseUrl.endsWith('/') ? '' : '/'}instance/create`;

    // TENTATIVA 1: Com proxy (se configurado)
    if (hasProxyConfig) {
      console.log('[Evolution API] Tentando criar instância COM proxy (sem WhatsApp)...');
      
      const instanceDataWithProxy: EvolutionInstanceData = {
        ...baseInstanceData,
        proxyHost: import.meta.env.VITE_EVOLUTION_PROXY_HOST,
        proxyPort: import.meta.env.VITE_EVOLUTION_PROXY_PORT,
        proxyProtocol: import.meta.env.VITE_EVOLUTION_PROXY_PROTOCOL,
        proxyUsername: import.meta.env.VITE_EVOLUTION_PROXY_USERNAME,
        proxyPassword: import.meta.env.VITE_EVOLUTION_PROXY_PASSWORD,
      };

      try {
        const responseWithProxy = await fetch(createInstanceUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': apiKey,
            'Authorization': `Bearer ${apiKey}`,
            'x-api-key': apiKey
          },
          body: JSON.stringify(instanceDataWithProxy)
        });

        if (responseWithProxy.ok) {
          const result: EvolutionInstanceResponse = await responseWithProxy.json();
          console.log('[Evolution API] Instância criada COM SUCESSO usando proxy (sem WhatsApp)');
          
          return {
            success: true,
            data: {
              instanceName: result.instance.instanceName,
              apiKey: token,
              evolutionUrl: baseUrl
            }
          };
        }

        // Se chegou aqui, houve erro - vamos verificar se é erro de proxy
        const errorText = await responseWithProxy.text();
        
        if (errorText.includes('Invalid proxy') || errorText.includes('proxy')) {
          console.warn('[Evolution API] Falha com proxy, tentando sem proxy (sem WhatsApp)...');
          // Continua para tentativa sem proxy
        } else {
          // Erro diferente de proxy - propaga o erro
          throw new Error(`Erro ${responseWithProxy.status}: ${responseWithProxy.statusText} - ${errorText}`);
        }
      } catch (fetchError) {
        console.warn('[Evolution API] Erro ao tentar com proxy, tentando sem proxy (sem WhatsApp)...', fetchError);
        // Continua para tentativa sem proxy
      }
    }

    // TENTATIVA 2: Sem proxy (sempre executada se não tem proxy OU se falhou com proxy)
    console.log('[Evolution API] Tentando criar instância SEM proxy (sem WhatsApp)...');
    
    const response = await fetch(createInstanceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey,
        'Authorization': `Bearer ${apiKey}`,
        'x-api-key': apiKey
      },
      body: JSON.stringify(baseInstanceData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ${response.status}: ${response.statusText} - ${errorText}`);
    }

    const result: EvolutionInstanceResponse = await response.json();
    console.log('[Evolution API] Instância criada COM SUCESSO sem proxy (sem WhatsApp)');
    
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
