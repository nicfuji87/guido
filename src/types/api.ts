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
