// AI dev note: Hook atualizado para usar UAZapi via Supabase Edge Functions
import { useState, useCallback, useRef } from 'react';
import { validateWhatsAppNumber, formatPhoneForAPI } from '@/services/uazapiService';

interface WhatsAppValidationResult {
  jid: string;
  isInWhatsapp: boolean;
  query: string;
  verifiedName: string;
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
  data?: WhatsAppValidationResult;
}

export const useWhatsAppValidation = () => {
  const [isValidating, setIsValidating] = useState(false);
  const validationCache = useRef<Record<string, ValidationResult>>({});

  const validateWhatsApp = useCallback(async (phone: string): Promise<ValidationResult> => {
    const formattedPhone = formatPhoneForAPI(phone);
    
    // Verificar cache primeiro
    if (validationCache.current[formattedPhone]) {
      return validationCache.current[formattedPhone];
    }

    // Validação básica de formato
    if (formattedPhone.length < 12 || formattedPhone.length > 13) {
      const result: ValidationResult = {
        isValid: false,
        error: 'Formato de telefone inválido'
      };
      validationCache.current[formattedPhone] = result;
      return result;
    }

    setIsValidating(true);

    try {
      // Chamar Edge Function via serviço UAZapi
      const response = await validateWhatsAppNumber(formattedPhone);
      
      if (!response.success || !response.data || response.data.length === 0) {
        const result: ValidationResult = {
          isValid: false,
          error: response.error || 'Não foi possível validar o número'
        };
        validationCache.current[formattedPhone] = result;
        return result;
      }

      const validationData = response.data[0];
      const result: ValidationResult = {
        isValid: validationData.isInWhatsapp,
        error: validationData.isInWhatsapp ? undefined : 'Número do WhatsApp não encontrado',
        data: validationData
      };

      // Salvar no cache
      validationCache.current[formattedPhone] = result;
      
      return result;

    } catch (error: unknown) {
      console.error('[useWhatsAppValidation] Erro:', error);
      
      const result: ValidationResult = {
        isValid: false,
        error: 'Erro ao validar WhatsApp. Tente novamente.'
      };
      
      validationCache.current[formattedPhone] = result;
      return result;
    } finally {
      setIsValidating(false);
    }
  }, []);

  const clearCache = useCallback(() => {
    validationCache.current = {};
  }, []);

  return {
    validateWhatsApp,
    isValidating,
    clearCache,
    formatPhoneForAPI
  };
};
