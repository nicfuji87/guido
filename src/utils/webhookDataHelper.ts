// AI dev note: Helper para preparar dados completos do webhook incluindo conta e assinatura
import { supabase } from '@/lib/supabaseClient';
import { CustomerData } from '@/services/webhookService';

export interface WebhookDataInput {
  nome: string;
  email: string;
  documento: string;
  telefone?: string;
  userId: string;
  assinaturaId: string;
}

export const prepareWebhookData = async (input: WebhookDataInput): Promise<CustomerData> => {
  // Buscar dados da conta e assinatura
  const { data: assinaturaData, error } = await supabase
    .from('assinaturas')
    .select(`
      id,
      plano_id,
      status,
      data_fim_trial,
      data_proxima_cobranca,
      valor_atual,
      ciclo_cobranca,
      contas!inner (
        id,
        nome_conta,
        tipo_conta,
        documento,
        max_corretores
      ),
      planos!inner (
        nome_plano,
        preco_mensal
      )
    `)
    .eq('id', input.assinaturaId)
    .single();

  if (error || !assinaturaData) {
    throw new Error('Não foi possível buscar dados da assinatura');
  }

  const conta = assinaturaData.contas;
  const plano = assinaturaData.planos;

  // Lógica inteligente para documento: usar CNPJ da conta se for IMOBILIARIA
  const documentoCorreto = conta.tipo_conta === 'IMOBILIARIA' 
    ? conta.documento.replace(/\D/g, '')  // CNPJ da conta (sem formatação)
    : input.documento;                    // CPF do input

  return {
    nome: input.nome,
    email: input.email,
    documento: documentoCorreto, // Documento correto baseado no tipo de conta
    telefone: input.telefone,
    userId: input.userId,
    assinaturaId: input.assinaturaId,
    conta: {
      id: conta.id,
      nome_conta: conta.nome_conta,
      tipo_conta: conta.tipo_conta,
      documento: conta.documento,
      max_corretores: conta.max_corretores
    },
    assinatura: {
      id: assinaturaData.id,
      plano_id: assinaturaData.plano_id,
      status: assinaturaData.status,
      data_fim_trial: assinaturaData.data_fim_trial,
      data_proxima_cobranca: assinaturaData.data_proxima_cobranca,
      valor_atual: Number(assinaturaData.valor_atual),
      ciclo_cobranca: assinaturaData.ciclo_cobranca,
      plano_nome: plano.nome_plano
    }
  };
};
