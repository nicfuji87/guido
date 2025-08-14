// AI dev note: Configuração das colunas do Kanban

import { KanbanColumn, FunilStage } from '@/types/kanban';

export const KANBAN_COLUMNS: Omit<KanbanColumn, 'clients'>[] = [
  {
    id: 'NOVO_LEAD',
    title: 'Novos Leads',
    icon: '📥',
    color: 'bg-blue-500',
    description: 'Leads recém-chegados que precisam de primeiro contato'
  },
  {
    id: 'CONTATO_INICIAL', 
    title: 'Contato Inicial',
    icon: '💬',
    color: 'bg-purple-500',
    description: 'Primeiro contato realizado, qualificando o lead'
  },
  {
    id: 'INTERESSE_GERADO',
    title: 'Interesse Gerado', 
    icon: '👁️',
    color: 'bg-yellow-500',
    description: 'Cliente demonstrou interesse em imóveis específicos'
  },
  {
    id: 'VISITA_AGENDADA',
    title: 'Visita Agendada',
    icon: '🏠', 
    color: 'bg-orange-500',
    description: 'Visita marcada, aguardando realização'
  },
  {
    id: 'PROPOSTA_ENVIADA',
    title: 'Proposta Enviada',
    icon: '📋',
    color: 'bg-indigo-500', 
    description: 'Proposta enviada, aguardando decisão do cliente'
  },
  {
    id: 'FECHAMENTO',
    title: 'Fechamento',
    icon: '✅',
    color: 'bg-green-500',
    description: 'Negócio fechado com sucesso!'
  }
];

export const URGENCIA_CONFIG = {
  alta: {
    color: 'bg-red-500',
    textColor: 'text-red-100', 
    dias: 3
  },
  media: {
    color: 'bg-yellow-500',
    textColor: 'text-yellow-100',
    dias: 1
  },
  baixa: {
    color: 'bg-green-500', 
    textColor: 'text-green-100',
    dias: 0
  }
};

export const PROXIMAS_ACOES: Record<FunilStage, string> = {
  'NOVO_LEAD': 'Fazer primeiro contato',
  'CONTATO_INICIAL': 'Qualificar necessidades',
  'INTERESSE_GERADO': 'Apresentar imóveis',
  'VISITA_AGENDADA': 'Realizar visita',
  'PROPOSTA_ENVIADA': 'Acompanhar decisão',
  'FECHAMENTO': 'Documentação',
  'PERDIDO': 'Analisar motivos'
};
