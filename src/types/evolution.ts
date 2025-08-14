// AI dev note: Tipos TypeScript para integração com Evolution API
// Baseado na documentação da Evolution API v2.3.1

export interface EvolutionInstance {
  instanceName: string;
  state: 'open' | 'close' | 'connecting';
  qrcode?: string;
}

export interface EvolutionInstanceCreate {
  instanceName: string;
  token?: string;
  qrcode?: boolean;
  number?: string;
}

export interface EvolutionQRCode {
  base64: string;
  code: string;
}

export interface EvolutionWebhook {
  url: string;
  events: string[];
  webhook_by_events: boolean;
}

export interface EvolutionMessage {
  key: {
    remoteJid: string;
    fromMe: boolean;
    id: string;
  };
  message: {
    conversation?: string;
    extendedTextMessage?: {
      text: string;
    };
  };
  messageTimestamp: number;
  pushName?: string;
}

export interface CRMIntegration {
  id: string;
  plataforma: string;
  chave_api_criptografada: string;
  status: 'ATIVA' | 'INATIVA' | 'ERRO_AUTENTICACAO';
  created_at: string;
  updated_at: string;
}
