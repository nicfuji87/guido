import { useState } from 'react';
import { prepareWebhookData } from '@/utils/webhookDataHelper';
import { supabase } from '@/lib/supabaseClient';
import { log } from '@/utils/logger';
import { performSoftDelete } from '@/utils/softDeleteHelper';

// AI dev note: Hook para gerenciar cancelamento de assinatura via webhook n8n
// Usa o mesmo endpoint de provisionamento mas com action diferente

interface CancelarAssinaturaData {
  assinaturaId: string;
  idAssinaturaAsaas?: string;
  userId: string;
  motivo?: string;
}

interface UseCancelarAssinaturaReturn {
  isLoading: boolean;
  error: string | null;
  solicitarCancelamento: (data: CancelarAssinaturaData) => Promise<boolean>;
}

export const useCancelarAssinatura = (): UseCancelarAssinaturaReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performLocalSoftDelete = async (assinaturaId: string, userId: string, motivo?: string): Promise<void> => {
    try {
      // Soft delete da assinatura usando helper
      const { error: assinaturaError } = await performSoftDelete.assinatura(assinaturaId, motivo);

      if (assinaturaError) {
        log.error('[useCancelarAssinatura] Erro no soft delete da assinatura:', assinaturaError.message);
        throw assinaturaError;
      }

      // Soft delete do usuário usando helper
      const { error: userError } = await performSoftDelete.usuario(userId);

      if (userError) {
        log.error('[useCancelarAssinatura] Erro no soft delete do usuário:', userError.message);
        throw userError;
      }

      log.debug('[useCancelarAssinatura] Soft delete local realizado com sucesso');
    } catch (error) {
      log.error('[useCancelarAssinatura] Erro no soft delete local:', String(error));
      throw error;
    }
  };

  const solicitarCancelamento = async (data: CancelarAssinaturaData): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      log.debug(`[useCancelarAssinatura] Iniciando processo de cancelamento - assinaturaId: ${data.assinaturaId}, userId: ${data.userId}`);

      // Buscar dados completos do usuário
      const user = supabase.auth.user();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      // Buscar dados do usuário (incluir soft-deleted pois estamos cancelando)
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();

      if (userError) {
        throw new Error(`Erro ao buscar dados do usuário: ${userError.message}`);
      }

      if (!userData) {
        throw new Error('Dados do usuário não encontrados');
      }

      // Buscar dados da assinatura (incluir soft-deleted pois estamos cancelando)
      const { data: assinaturaData, error: assinaturaError } = await supabase
        .from('assinaturas')
        .select(`
          *,
          contas(*),
          planos(*)
        `)
        .eq('id', data.assinaturaId)
        .single();

      if (assinaturaError) {
        throw new Error(`Erro ao buscar dados da assinatura: ${assinaturaError.message}`);
      }

      if (!assinaturaData) {
        throw new Error('Assinatura não encontrada');
      }

      // Preparar dados completos do webhook
      const webhookData = await prepareWebhookData({
        nome: userData.name,
        email: userData.email,
        documento: userData.cpfCnpj || '',
        telefone: userData.whatsapp,
        userId: userData.id,
        assinaturaId: data.assinaturaId
      });

      // Configurar webhook
      const webhookUrl = import.meta.env.VITE_WEBHOOK_ASAAS_PROVISIONING_URL;
      const apiKey = import.meta.env.VITE_WEBHOOK_ASAAS_PROVISIONING_API_KEY;
      
      if (!webhookUrl) {
        throw new Error('URL do webhook não configurada');
      }

      if (!apiKey) {
        throw new Error('API Key do webhook não configurada');
      }

      // Payload específico para cancelamento
      const payload = {
        action: 'cancel_subscription',
        user: userData,
        data: webhookData,
        subscription: {
          id: data.assinaturaId,
          asaas_id: data.idAssinaturaAsaas || assinaturaData.id_assinatura_asaas,
          current_status: assinaturaData.status,
          plan_name: assinaturaData.planos?.nome_plano,
          cancel_reason: data.motivo || 'Solicitado pelo usuário'
        },
        soft_delete: {
          enable_soft_delete: true,
          delete_user: true,
          delete_subscription: true
        }
      };

      log.debug(`[useCancelarAssinatura] Enviando webhook de cancelamento - url: ${webhookUrl}, action: ${payload.action}, assinaturaId: ${payload.subscription.id}`);

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api': apiKey,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = `Erro no webhook: ${response.status}`;
        try {
          const errorData = await response.text();
          
          if (errorData.includes('subscription_not_found')) {
            errorMessage = '❌ Assinatura não encontrada no sistema de pagamento.';
          } else if (errorData.includes('already_cancelled')) {
            errorMessage = '❌ Esta assinatura já foi cancelada anteriormente.';
          } else if (errorData.includes('invalid_subscription')) {
            errorMessage = '❌ Assinatura inválida ou não pode ser cancelada.';
          } else if (errorData.includes('AxiosError')) {
            errorMessage = '❌ Erro na comunicação com o sistema de pagamento (Asaas).';
          }
        } catch (parseError) {
          // Se não conseguir parsear, usar mensagem padrão
        }
        
        throw new Error(errorMessage);
      }

      // Processar resposta e fazer soft delete local se webhook foi bem-sucedido
      try {
        const responseData = await response.json();
        log.debug('[useCancelarAssinatura] Cancelamento processado com sucesso', responseData);
      } catch (jsonError) {
        // Resposta não é JSON válido - ainda assim sucesso se status OK
        log.debug('[useCancelarAssinatura] Cancelamento enviado com sucesso');
      }

      // Fazer soft delete local da assinatura e do usuário
      await performLocalSoftDelete(data.assinaturaId, data.userId, data.motivo);

      log.debug('[useCancelarAssinatura] Cancelamento solicitado com sucesso');
      return true;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao cancelar assinatura';
      log.error('[useCancelarAssinatura] Erro no cancelamento:', errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    solicitarCancelamento
  };
};
