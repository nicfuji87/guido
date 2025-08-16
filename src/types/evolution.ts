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

// AI dev note: Tipos para dados de corretor do Supabase
export interface CorretorData {
  id: string;
  crm: string;
  crm_loft_key?: string;
  crm_loft_token?: string;
  crm_loft_url?: string;
  crm_loft_id?: string;
  crm_loft_email?: string;
  crm_rd_key?: string;
  crm_imobzi_token?: string;
  crm_imoview_usuario?: string;
  crm_imoview_email?: string;
  crm_imoview_senha?: string;
  crm_imoview_chave?: string;
}

// AI dev note: Dados de atualização para corretor com configurações CRM
export interface CorretorUpdateData {
  crm?: string;
  updated_at?: string;
  crm_loft_key?: string;
  crm_loft_token?: string;
  crm_loft_url?: string;
  crm_loft_id?: string;
  crm_loft_email?: string;
  crm_rd_key?: string;
  crm_imobzi_token?: string;
  crm_imoview_usuario?: string;
  crm_imoview_email?: string;
  crm_imoview_senha?: string;
  crm_imoview_chave?: string;
}