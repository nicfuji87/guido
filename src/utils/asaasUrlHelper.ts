// AI dev note: Helper para determinar a melhor URL da fatura Asaas baseado na resposta do webhook
import { AsaasInvoiceResponse } from '@/hooks/useAsaasInvoice';

export interface AsaasUrlInfo {
  primaryUrl: string;
  fallbackUrl?: string;
  urlType: 'standard' | 'direct' | 'payment' | 'fallback';
  description: string;
}

/**
 * Determina a melhor URL para abrir baseado na resposta do Asaas
 */
export const getAsaasUrls = (response: AsaasInvoiceResponse): AsaasUrlInfo | null => {
  // Verificar se tem URL válida do Asaas
  const asaasUrls = [
    response.response,
    response.direct_url,
    response.payment_url,
    response.fallback_url
  ].filter(url => url && url.includes('asaas.com'));

  if (asaasUrls.length === 0) {
    return null;
  }

  // Priorizar URLs baseado no tipo
  let primaryUrl: string;
  let urlType: AsaasUrlInfo['urlType'];
  let description: string;

  if (response.direct_url && response.direct_url.includes('asaas.com')) {
    // URL direta tem prioridade (sem iframe)
    primaryUrl = response.direct_url;
    urlType = 'direct';
    description = 'URL direta do Asaas (sem iframe)';
  } else if (response.payment_url && response.payment_url.includes('asaas.com')) {
    // URL específica de pagamento
    primaryUrl = response.payment_url;
    urlType = 'payment';
    description = 'URL de pagamento do Asaas';
  } else if (response.response && response.response.includes('asaas.com')) {
    // URL padrão da resposta
    primaryUrl = response.response;
    urlType = 'standard';
    description = 'URL padrão da fatura';
  } else if (response.fallback_url && response.fallback_url.includes('asaas.com')) {
    // URL de fallback como última opção
    primaryUrl = response.fallback_url;
    urlType = 'fallback';
    description = 'URL de fallback do Asaas';
  } else {
    return null;
  }

  // Determinar URL de fallback (diferente da primária)
  const fallbackUrl = asaasUrls.find(url => url !== primaryUrl);

  return {
    primaryUrl,
    fallbackUrl,
    urlType,
    description
  };
};

/**
 * Verifica se uma URL é do Asaas
 */
export const isAsaasUrl = (url: string): boolean => {
  return Boolean(url && (
    url.startsWith('https://www.asaas.com/') ||
    url.startsWith('https://asaas.com/') ||
    url.startsWith('https://sandbox.asaas.com/') ||
    url.includes('.asaas.com/')
  ));
};

/**
 * Formata a URL do Asaas para garantir que seja segura
 */
export const formatAsaasUrl = (url: string): string => {
  // Garantir que seja HTTPS
  if (url.startsWith('http://')) {
    url = url.replace('http://', 'https://');
  }

  // Adicionar parâmetros de segurança se necessário
  const urlObj = new URL(url);
  
  // Remover parâmetros potencialmente inseguros
  const unsafeParams = ['callback', 'redirect', 'return_url'];
  unsafeParams.forEach(param => {
    if (urlObj.searchParams.has(param)) {
      urlObj.searchParams.delete(param);
    }
  });

  return urlObj.toString();
};
