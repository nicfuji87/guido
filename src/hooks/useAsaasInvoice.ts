// AI dev note: Hook para gerenciar abertura de faturas do Asaas
import { useState } from 'react';

export interface AsaasInvoiceResponse {
  response: string; // URL da fatura
  // Possíveis formatos de resposta do Asaas:
  fallback_url?: string; // URL alternativa se a principal não funcionar
  direct_url?: string; // URL direta sem iframe
  payment_url?: string; // URL específica de pagamento
}

export const useAsaasInvoice = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);
  const [error] = useState<string | null>(null);
  const [isLoading] = useState(false);

  const openInvoice = (url: string, options: {
    newTab?: boolean;
    showFallback?: boolean;
  } = {}) => {
    const { newTab = true, showFallback = true } = options;

    try {
      if (newTab) {
        // Abrir em nova guia/janela
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
        
        if (!newWindow) {
          // Popup bloqueado - mostrar fallback
          if (showFallback) {
            setInvoiceUrl(url);
            return {
              success: false,
              error: 'popup_blocked',
              fallbackUrl: url
            };
          }
          throw new Error('Não foi possível abrir a fatura. Verifique se o bloqueador de popup está ativo.');
        }

        return {
          success: true,
          window: newWindow
        };
      } else {
        // Redirecionar na mesma guia
        window.location.href = url;
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao abrir fatura'
      };
    }
  };

  const clearInvoiceUrl = () => {
    setInvoiceUrl(null);
  };

  return {
    openInvoice,
    invoiceUrl,
    clearInvoiceUrl,
    isProcessing,
    setIsProcessing,
    error,
    isLoading
  };
};
