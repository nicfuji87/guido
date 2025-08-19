// AI dev note: Hook para verificar status de pagamento e cadastro no Asaas
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface PaymentStatusData {
  hasAsaasSubscription: boolean; // Se tem id_assinatura_asaas preenchido
  assinaturaStatus: string | null;
  proximaCobranca: string | null;
  valorMensal: number;
  planoNome: string | null;
  isLoading: boolean;
}

// Alias para retrocompatibilidade
export type PaymentStatus = PaymentStatusData;

export const usePaymentStatus = (userId?: string) => {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusData>({
    hasAsaasSubscription: false,
    assinaturaStatus: null,
    proximaCobranca: null,
    valorMensal: 0,
    planoNome: null,
    isLoading: true
  });

  useEffect(() => {
    if (!userId) {
      setPaymentStatus(prev => ({ ...prev, isLoading: false }));
      return;
    }

    const fetchPaymentStatus = async () => {
      try {
        // Buscar dados do usuário e assinatura - foco no id_assinatura_asaas
        const { data: userData, error: userError } = await supabase
          .from('usuarios')
          .select(`
            id,
            email,
            corretores!inner (
              conta_id,
              contas!inner (
                id,
                nome_conta,
                tipo_conta,
                assinaturas!inner (
                  id,
                  status,
                  data_proxima_cobranca,
                  valor_atual,
                  id_assinatura_asaas,
                  planos!inner (
                    nome_plano,
                    preco_mensal
                  )
                )
              )
            )
          `)
          .eq('id', userId)
          .single();

        if (userError || !userData) {
          // console.error('Erro ao buscar dados do usuário:', userError);
          return;
        }

        // Buscar dados da assinatura
        const assinatura = userData.corretores?.[0]?.contas?.assinaturas?.[0];

        // Verificar se tem assinatura no Asaas (id_assinatura_asaas preenchido)
        const hasAsaasSubscription = !!assinatura?.id_assinatura_asaas;

        setPaymentStatus({
          hasAsaasSubscription,
          assinaturaStatus: assinatura?.status || null,
          proximaCobranca: assinatura?.data_proxima_cobranca || null,
          valorMensal: assinatura?.planos?.preco_mensal || assinatura?.valor_atual || 0,
          planoNome: assinatura?.planos?.nome_plano || null,
          isLoading: false
        });

      } catch (error) {
        // console.error('Erro ao verificar status de pagamento:', error);
        setPaymentStatus(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchPaymentStatus();
  }, [userId]);

  return paymentStatus;
};
