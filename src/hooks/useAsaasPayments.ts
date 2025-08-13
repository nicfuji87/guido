import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { getAsaasClient, AsaasCustomer, AsaasSubscription, AsaasApiError } from '../lib/asaasClient';
import { useAssinatura, Plano } from './useAssinatura';
import { log } from '@/utils/logger';

// AI dev note: Hook para gerenciar pagamentos e assinaturas via Asaas
// Implementa fluxo completo: criar cliente → criar assinatura → webhook → atualizar status

export interface PaymentIntent {
  plano: Plano;
  ciclo: 'MONTHLY' | 'YEARLY';
  metodo_pagamento: 'BOLETO' | 'CREDIT_CARD' | 'PIX';
  dados_cartao?: {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    ccv: string;
  };
  dados_portador?: {
    name: string;
    email: string;
    cpfCnpj: string;
    postalCode: string;
    addressNumber: string;
    addressComplement?: string;
    phone: string;
    mobilePhone?: string;
  };
}

export interface PaymentResult {
  success: boolean;
  assinatura_id?: string;
  payment_link?: string;
  customer_id?: string;
  subscription_id?: string;
  error?: string;
  requires_action?: boolean; // Para casos que precisam de ação do usuário
}

interface UseAsaasPaymentsReturn {
  isProcessing: boolean;
  error: string | null;
  processUpgrade: (paymentIntent: PaymentIntent) => Promise<PaymentResult>;
  createAsaasCustomer: (usuarioId: string) => Promise<string | null>;
  updateAssinaturaStatus: (assinaturaId: string, status: string, asaasData?: Record<string, unknown>) => Promise<void>;
  clearError: () => void;
}

export const useAsaasPayments = (): UseAsaasPaymentsReturn => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refetchAssinatura } = useAssinatura();

  const clearError = useCallback(() => setError(null), []);

  // Função para criar cliente no Asaas baseado nos dados do usuário
  const createAsaasCustomer = useCallback(async (usuarioId: string): Promise<string | null> => {
    const logPrefix = '[useAsaasPayments:createCustomer]';
    log.debug('Criando cliente Asaas para usuário', 'useAsaasPayments', { usuarioId });

    try {
      // 1. Buscar dados do usuário
      const { data: usuario, error: usuarioError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', usuarioId)
        .single();

      if (usuarioError || !usuario) {
        log.error('Usuário não encontrado', 'useAsaasPayments', usuarioError);
        throw new Error('Usuário não encontrado');
      }

      // 2. Verificar se já tem cliente Asaas
      if (usuario.id_cliente_asaas) {
        log.info('Cliente Asaas já existe', 'useAsaasPayments', { clienteId: usuario.id_cliente_asaas });
        return usuario.id_cliente_asaas;
      }

      // 3. Usar dados preparados ou criar novos
      const dadosAsaas = usuario.dados_asaas || {
        name: usuario.nome,
        email: usuario.email,
        cpfCnpj: usuario.documento,
        phone: usuario.whatsapp,
        mobilePhone: usuario.whatsapp
      };

      const customerData: AsaasCustomer = {
        name: dadosAsaas.name,
        email: dadosAsaas.email,
        cpfCnpj: dadosAsaas.cpfCnpj,
        phone: dadosAsaas.phone,
        mobilePhone: dadosAsaas.mobilePhone,
        externalReference: usuarioId,
        notificationDisabled: false
      };

      // 4. Criar cliente no Asaas
      const asaasClient = getAsaasClient();
      const asaasCustomer = await asaasClient.createCustomer(customerData);

      log.info('Cliente criado no Asaas', 'useAsaasPayments', { clienteId: asaasCustomer.id });

      // 5. Salvar ID do cliente na nossa base
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ 
          id_cliente_asaas: asaasCustomer.id,
          data_atualizacao: new Date().toISOString()
        })
        .eq('id', usuarioId);

      if (updateError) {
        log.error('Erro ao salvar ID do cliente', 'useAsaasPayments', { error: updateError });
        // Não falha aqui, cliente foi criado no Asaas
      }

      return asaasCustomer.id;

    } catch (error) {
      const errorMessage = error instanceof AsaasApiError 
        ? `Erro Asaas: ${error.getErrorDetails().join(', ')}`
        : error instanceof Error 
          ? error.message 
          : 'Erro ao criar cliente';
      
      log.error(`${logPrefix} ❌ Erro:`, errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Função para atualizar status da assinatura
  const updateAssinaturaStatus = useCallback(async (
    assinaturaId: string, 
    novoStatus: string, 
    asaasData?: Record<string, unknown>
  ): Promise<void> => {
    const logPrefix = '[useAsaasPayments:updateStatus]';
    log.debug(`${logPrefix} Atualizando assinatura ${assinaturaId} para ${novoStatus}`);

    try {
      const updateData: Record<string, unknown> = {
        status: novoStatus,
        data_atualizacao: new Date().toISOString()
      };

      // Adicionar dados específicos baseados no status
      if (novoStatus === 'ATIVO') {
        updateData.data_proxima_cobranca = asaasData?.nextDueDate;
        updateData.tentativas_cobranca = 0;
      } else if (novoStatus === 'PAUSADO' || novoStatus === 'CANCELADO') {
        updateData.data_cancelamento = new Date().toISOString();
      }

      // Adicionar dados do Asaas se fornecidos
      if (asaasData?.subscriptionId) {
        updateData.id_assinatura_asaas = asaasData.subscriptionId;
      }
      if (asaasData?.value) {
        updateData.valor_atual = asaasData.value;
      }

      const { error } = await supabase
        .from('assinaturas')
        .update(updateData)
        .eq('id', assinaturaId);

      if (error) {
        log.error('Erro ao atualizar assinatura', 'useAsaasPayments', { error });
        throw error;
      }

      log.debug(`${logPrefix} ✅ Assinatura atualizada com sucesso`);
      
      // Recarregar dados da assinatura
      await refetchAssinatura();

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar assinatura';
      log.error(`${logPrefix} ❌ Erro:`, errorMessage);
      throw new Error(errorMessage);
    }
  }, [refetchAssinatura]);

  // Função principal para processar upgrade/pagamento
  const processUpgrade = useCallback(async (paymentIntent: PaymentIntent): Promise<PaymentResult> => {
    const logPrefix = '[useAsaasPayments:processUpgrade]';
    log.debug(`${logPrefix} Processando upgrade para plano:`, paymentIntent.plano.nome_plano);

    setIsProcessing(true);
    setError(null);

    try {
      // 1. Buscar assinatura atual do usuário
      const { data: assinaturaAtual, error: assinaturaError } = await supabase
        .from('assinaturas')
        .select(`
          *,
          conta_id,
          usuarios!inner(id, id_cliente_asaas, dados_asaas, nome, email, documento, whatsapp)
        `)
        .in('status', ['TRIAL', 'ATIVO'])
        .order('data_criacao', { ascending: false })
        .limit(1)
        .single();

      if (assinaturaError || !assinaturaAtual) {
        log.error('Assinatura não encontrada', 'useAsaasPayments', { error: assinaturaError });
        throw new Error('Assinatura ativa não encontrada');
      }

      const usuario = assinaturaAtual.usuarios[0];
      if (!usuario) {
        throw new Error('Usuário da assinatura não encontrado');
      }

      // 2. Garantir que o cliente existe no Asaas
      let customerId = usuario.id_cliente_asaas;
      if (!customerId) {
        customerId = await createAsaasCustomer(usuario.id);
        if (!customerId) {
          throw new Error('Falha ao criar cliente no Asaas');
        }
      }

      // 3. Calcular valor baseado no ciclo
      const valorAssinatura = paymentIntent.ciclo === 'YEARLY' 
        ? paymentIntent.plano.preco_anual || (paymentIntent.plano.preco_mensal * 12)
        : paymentIntent.plano.preco_mensal;

      // 4. Preparar dados da assinatura
      const nextDueDate = new Date();
      nextDueDate.setMonth(nextDueDate.getMonth() + (paymentIntent.ciclo === 'YEARLY' ? 12 : 1));

      const subscriptionData: AsaasSubscription = {
        customer: customerId,
        billingType: paymentIntent.metodo_pagamento,
        nextDueDate: nextDueDate.toISOString().split('T')[0],
        value: valorAssinatura,
        cycle: paymentIntent.ciclo,
        description: `${paymentIntent.plano.nome_plano} - ${paymentIntent.ciclo === 'YEARLY' ? 'Anual' : 'Mensal'}`,
        externalReference: assinaturaAtual.id
      };

      // 5. Adicionar dados do cartão se necessário
      if (paymentIntent.metodo_pagamento === 'CREDIT_CARD') {
        if (!paymentIntent.dados_cartao || !paymentIntent.dados_portador) {
          throw new Error('Dados do cartão são obrigatórios para pagamento com cartão');
        }
        
        subscriptionData.creditCard = paymentIntent.dados_cartao;
        subscriptionData.creditCardHolderInfo = paymentIntent.dados_portador;
      }

      // 6. Criar assinatura no Asaas
      const asaasClient = getAsaasClient();
      const asaasSubscription = await asaasClient.createSubscription(subscriptionData);

      log.debug(`${logPrefix} ✅ Assinatura criada no Asaas:`, asaasSubscription.id);

      // 7. Atualizar assinatura local
      await updateAssinaturaStatus(assinaturaAtual.id, 'ATIVO', {
        subscriptionId: asaasSubscription.id,
        nextDueDate: asaasSubscription.nextDueDate,
        value: asaasSubscription.value
      });

      // 8. Retornar resultado de sucesso
      const result: PaymentResult = {
        success: true,
        assinatura_id: assinaturaAtual.id,
        customer_id: customerId,
        subscription_id: asaasSubscription.id,
        payment_link: asaasSubscription.paymentLink
      };

      // 9. Para boleto e PIX, usuário precisa completar pagamento
      if (paymentIntent.metodo_pagamento === 'BOLETO' || paymentIntent.metodo_pagamento === 'PIX') {
        result.requires_action = true;
      }

      log.debug('Upgrade processado com sucesso', 'useAsaasPayments', { result });
      return result;

    } catch (error) {
      const errorMessage = error instanceof AsaasApiError 
        ? `Erro Asaas: ${error.getErrorDetails().join(', ')}`
        : error instanceof Error 
          ? error.message 
          : 'Erro ao processar pagamento';
      
      log.error(`${logPrefix} ❌ Erro no upgrade:`, errorMessage);
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };

    } finally {
      setIsProcessing(false);
    }
  }, [createAsaasCustomer, updateAssinaturaStatus]);

  return {
    isProcessing,
    error,
    processUpgrade,
    createAsaasCustomer,
    updateAssinaturaStatus,
    clearError
  };
};
