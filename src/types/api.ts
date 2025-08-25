// AI dev note: Interfaces para APIs externas e integrações
// Substitui tipos 'any' por tipos específicos

// AI dev note: TIPOS ASAAS REMOVIDOS - agora processamento via webhook n8n
// As definições antigas foram removidas para simplificar a codebase

// AI dev note: Todas as interfaces antigas do Asaas foram removidas
// Agora o processamento é via webhook n8n

// === EVOLUTION API TYPES ===
export interface EvolutionApiContact {
  id: string;
  pushName: string;
  profilePicUrl?: string;
}

export interface EvolutionApiMessage {
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
  status: string;
}

export interface EvolutionApiResponse {
  status: 'success' | 'error';
  message?: string;
  data?: unknown;
}

// === EMAIL SERVICE TYPES ===
export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  filename: string;
  content: string | Buffer;
  contentType: string;
}

export interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

// === GENERIC API TYPES ===
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  totalCount: number;
  hasMore: boolean;
  offset?: number;
  limit?: number;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: ValidationError[];
}

// === DATABASE ENTITY TYPES ===

// AI dev note: Interface para a tabela corretores com suporte a soft delete
export interface Corretor {
  id: string;
  conta_id: string;
  nome: string;
  email: string;
  hash_senha: string;
  funcao: 'DONO' | 'ADMIN' | 'AGENTE';
  cpf?: string;
  crm?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null; // Campo para soft delete
  
  // Campos de integração CRM
  crm_loft_key?: string;
  crm_rd_key?: string;
  crm_imoview_email?: string;
  crm_imoview_senha?: string;
  crm_imoview_chave?: string;
  crm_loft_url?: string;
  crm_loft_id?: string;
  crm_loft_email?: string;
}

// AI dev note: Interface para usuários com suporte a soft delete  
export interface Usuario {
  id: string;
  name: string;
  whatsapp: string;
  email?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null; // Campo para soft delete
  auth_user_id?: string;
  id_cliente_asaas?: string;
  data_ultimo_login?: string;
  fonte_cadastro?: string;
  dados_asaas?: unknown;
  
  // Campos Evolution
  evolution_instance?: string;
  evolution_apikey?: string;
  evolution_url?: string;
  jid?: string;
  
  // Dados de endereço
  cep?: number;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  ddd?: number;
  numero_residencia?: string;
  complemento_endereco?: string;
  cpfCnpj?: string;
}

// AI dev note: Interface para assinaturas com suporte a soft delete
export interface Assinatura {
  id: string;
  conta_id: string;
  plano_id: number;
  status: 'TRIAL' | 'ATIVO' | 'PAGAMENTO_PENDENTE' | 'CANCELADO';
  data_fim_trial?: string;
  data_proxima_cobranca?: string;
  id_gateway_pagamento?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null; // Campo para soft delete
  
  // Campos específicos
  id_assinatura_asaas?: string;
  data_cancelamento?: string;
  valor_atual?: number;
  ciclo_cobranca?: string;
  responsavel_pagamento?: string;
  tentativas_cobranca?: number;
  id_customer_asaas?: string;
  url_ultima_fatura?: string;
  motivo_cancelamento?: string;
}