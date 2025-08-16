// AI dev note: Tipos para o sistema de Kanban de funil de vendas

export type FunilStage = 
  | 'NOVO_LEAD'           // 📥 Novos leads
  | 'CONTATO_INICIAL'     // 💬 Primeiro contato feito  
  | 'INTERESSE_GERADO'    // 👁️ Cliente demonstrou interesse
  | 'VISITA_AGENDADA'     // 🏠 Visita marcada
  | 'PROPOSTA_ENVIADA'    // 📋 Proposta em análise
  | 'FECHAMENTO'          // ✅ Venda confirmada
  | 'PERDIDO';            // ❌ Lead perdido/desistiu

export interface KanbanColumn {
  id: FunilStage;
  title: string;
  icon: string;
  color: string;
  description: string;
  clients: KanbanClient[];
  // Métricas de conversão
  conversionRate?: number; // Taxa para próxima etapa
  conversionCount?: string; // Ex: "8/12"
  conversionStatus?: 'high' | 'medium' | 'low'; // Para cores
}

export interface KanbanClient {
  id: string;
  nome: string;
  telefone?: string;
  email?: string;
  status_funil: FunilStage;
  data_criacao: string;
  updated_at: string;
  corretor_id: string;
  conta_id: string;
  profilePicUrl?: string;
  // Campos calculados para o Kanban
  tempoNaEtapa?: number; // em dias
  proximaAcao?: string;
  urgencia?: 'alta' | 'media' | 'baixa';
  ultimoContato?: string;
}

export interface KanbanStats {
  totalClientes: number;
  taxaConversao: number;
  tempoMedioFunil: number;
  valorPipeline: number;
  metaMensal: number;
  clientesPorEtapa: Record<FunilStage, number>;
}

export interface DragDropResult {
  clienteId: string;
  sourceStage: FunilStage;
  destinationStage: FunilStage;
  sourceIndex: number;
  destinationIndex: number;
}
