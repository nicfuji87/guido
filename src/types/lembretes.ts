export type TipoLembrete = 'FOLLOW_UP' | 'VISITA' | 'DOCUMENTO' | 'PROPOSTA' | 'GERAL';
export type PrioridadeLembrete = 'ALTA' | 'MEDIA' | 'BAIXA';
export type StatusLembrete = 'PENDENTE' | 'CONCLUIDO';

export interface Lembrete {
  id: string;
  corretor_id: string;
  cliente_id?: string;
  titulo: string;
  descricao: string;
  data_lembrete: string;
  tipo_lembrete: TipoLembrete;
  prioridade: PrioridadeLembrete;
  status: StatusLembrete;
  notificacao_enviada: boolean;
  data_envio_notificacao?: string;
  tentativas_envio: number;
  proximo_tentativa_envio?: string;
  lembrete_original_id?: string;
  data_conclusao?: string;
  created_at: string;
  updated_at: string;
  
  // Dados do cliente (join)
  cliente?: {
    id: string;
    nome: string;
    telefone?: string;
  };
}

export interface CreateLembreteData {
  cliente_id?: string;
  titulo: string;
  descricao: string;
  data_lembrete: string;
  tipo_lembrete: TipoLembrete;
  prioridade: PrioridadeLembrete;
}

export interface UpdateLembreteData {
  titulo?: string;
  descricao?: string;
  data_lembrete?: string;
  tipo_lembrete?: TipoLembrete;
  prioridade?: PrioridadeLembrete;
  status?: StatusLembrete;
  data_conclusao?: string;
}

export const TIPO_LEMBRETE_LABELS: Record<TipoLembrete, string> = {
  FOLLOW_UP: 'Follow-up',
  VISITA: 'Visita',
  DOCUMENTO: 'Documento',
  PROPOSTA: 'Proposta',
  GERAL: 'Geral'
};

export const TIPO_LEMBRETE_ICONS: Record<TipoLembrete, string> = {
  FOLLOW_UP: '📞',
  VISITA: '🏠',
  DOCUMENTO: '📄',
  PROPOSTA: '💰',
  GERAL: '📋'
};

export const PRIORIDADE_LABELS: Record<PrioridadeLembrete, string> = {
  ALTA: 'Alta',
  MEDIA: 'Média',
  BAIXA: 'Baixa'
};

export const PRIORIDADE_COLORS: Record<PrioridadeLembrete, string> = {
  ALTA: 'text-red-400 bg-red-900/20 border-red-700/30',
  MEDIA: 'text-yellow-400 bg-yellow-900/20 border-yellow-700/30',
  BAIXA: 'text-green-400 bg-green-900/20 border-green-700/30'
};
