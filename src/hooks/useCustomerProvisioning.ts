// AI dev note: Hook simplificado para provisão via webhook n8n
// Substitui o useAsaasProvisioning complexo

import { useState } from 'react';
import { webhookService, CustomerData, WebhookResponse } from '../services/webhookService';
// AI dev note: Logger removido - usando console.log por enquanto
// import { logger } from '../lib/logger';

export const useCustomerProvisioning = () => {
  const [isLoading, setIsLoading] = useState(false);

  const provisionCustomer = async (data: CustomerData): Promise<WebhookResponse> => {
    setIsLoading(true);
    
    // console.log('🔥 DEBUG - [useCustomerProvisioning] Iniciando provisão via webhook:', data.nome);
    
    try {
      const result = await webhookService.provisionCustomer(data);
      
      if (result.success) {
        // console.log('🔥 DEBUG - [useCustomerProvisioning] ✅ Provisão bem-sucedida');
        // logger.info('[CustomerProvisioning] Provisão bem-sucedida', {
        //   customerId: result.customerId,
        //   nome: data.nome
        // });
      } else {
        // console.error('🔥 DEBUG - [useCustomerProvisioning] ❌ Falha na provisão:', result.error);
        // logger.error('[CustomerProvisioning] Falha na provisão', {
        //   error: result.error,
        //   documento: data.documento
        // });
      }
      
      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      // console.error('🔥 DEBUG - [useCustomerProvisioning] ❌ Erro crítico:', errorMessage);
      
      // logger.error('[CustomerProvisioning] Erro crítico', {
      //   error: errorMessage,
      //   documento: data.documento
      // });

      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    provisionCustomer,
    isLoading
  };
};
