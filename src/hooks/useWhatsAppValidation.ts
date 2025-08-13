import { useState, useCallback, useRef } from 'react';

interface WhatsAppValidationResult {
  jid: string;
  exists: boolean;
  number: string;
  name: string;
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
  data?: WhatsAppValidationResult;
}

export const useWhatsAppValidation = () => {
  const [isValidating, setIsValidating] = useState(false);
  const validationCache = useRef<Record<string, ValidationResult>>({});

  // Obter configurações da Evolution API das variáveis de ambiente
  const evolutionApiUrl = import.meta.env.VITE_EVOLUTION_API_URL;
  const evolutionApiKey = import.meta.env.VITE_EVOLUTION_API_KEY;

  // Validar se as variáveis estão definidas
  if (!evolutionApiUrl || !evolutionApiKey) {
    // Evolution API não configurada - variáveis de ambiente necessárias
  }

  const formatPhoneForAPI = (phone: string): string => {
    // Remove tudo que não é número
    const numbers = phone.replace(/\D/g, '');
    
    // Se já tem 13 dígitos (55 + DDD + número), retorna como está
    if (numbers.length === 13) {
      return numbers;
    }
    
    // Se tem 11 dígitos (DDD + número), adiciona o 55
    if (numbers.length === 11) {
      return '55' + numbers;
    }
    
    // Se tem 10 dígitos (DDD + número sem 9), adiciona 55 e o 9
    if (numbers.length === 10) {
      return '55' + numbers.slice(0, 2) + '9' + numbers.slice(2);
    }
    
    return numbers;
  };

  const validateWhatsApp = useCallback(async (phone: string): Promise<ValidationResult> => {
    const formattedPhone = formatPhoneForAPI(phone);
    
    // Verificar se a API está configurada
    if (!evolutionApiUrl || !evolutionApiKey) {
      const result: ValidationResult = {
        isValid: false,
        error: 'Validação de WhatsApp não disponível'
      };
      validationCache.current[formattedPhone] = result;
      return result;
    }
    
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
      const response = await fetch(evolutionApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': evolutionApiKey
        },
        body: JSON.stringify({
          numbers: [formattedPhone]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: WhatsAppValidationResult[] = await response.json();
      
      if (!data || data.length === 0) {
        const result: ValidationResult = {
          isValid: false,
          error: 'Não foi possível validar o número'
        };
        validationCache.current[formattedPhone] = result;
        return result;
      }

      const validationData = data[0];
      const result: ValidationResult = {
        isValid: validationData.exists,
        error: validationData.exists ? undefined : 'Número do WhatsApp não encontrado',
        data: validationData
      };

      // Salvar no cache
      validationCache.current[formattedPhone] = result;
      
      return result;

    } catch (error: unknown) {
      // Erro na validação do WhatsApp
      
      const result: ValidationResult = {
        isValid: false,
        error: 'Erro ao validar WhatsApp. Tente novamente.'
      };
      
      validationCache.current[formattedPhone] = result;
      return result;
    } finally {
      setIsValidating(false);
    }
  }, [evolutionApiUrl, evolutionApiKey]);

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
