// AI dev note: Utilitários para formatação e validação de CEP + integração com API ViaCEP
export interface EnderecoViaCEP {
  cep: string;
  logradouro: string;
  complemento?: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge?: string;
  gia?: string;
  ddd?: string;
  siafi?: string;
  erro?: boolean;
}

export interface EnderecoFormatado {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  ddd?: string;
  erro?: boolean;
}

/**
 * Formatar CEP adicionando máscara
 * @param cep CEP sem formatação
 * @returns CEP formatado (00000-000)
 */
export const formatCEP = (cep: string): string => {
  // Remove tudo que não é número
  const numbers = cep.replace(/\D/g, '');
  
  // Aplica a máscara 00000-000
  if (numbers.length <= 5) return numbers;
  return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
};

/**
 * Remove formatação do CEP
 * @param cep CEP formatado
 * @returns CEP sem formatação
 */
export const unformatCEP = (cep: string): string => {
  return cep.replace(/\D/g, '');
};

/**
 * Validar se CEP tem formato completo
 * @param cep CEP para validar
 * @returns true se tem 8 dígitos
 */
export const isCEPFormatComplete = (cep: string): boolean => {
  const cleanCEP = unformatCEP(cep);
  return cleanCEP.length === 8;
};

/**
 * Validar se CEP é válido (formato brasileiro)
 * @param cep CEP para validar
 * @returns true se é válido
 */
export const validateCEP = (cep: string): boolean => {
  const cleanCEP = unformatCEP(cep);
  
  // Deve ter exatamente 8 dígitos
  if (cleanCEP.length !== 8) return false;
  
  // Não pode ser todos os números iguais
  if (/^(\d)\1{7}$/.test(cleanCEP)) return false;
  
  return true;
};

/**
 * Buscar endereço por CEP na API ViaCEP
 * @param cep CEP para buscar
 * @returns Promise com dados do endereço
 */
export const buscarEnderecoPorCEP = async (cep: string): Promise<EnderecoFormatado> => {
  const cleanCEP = unformatCEP(cep);
  
  if (!validateCEP(cleanCEP)) {
    throw new Error('CEP inválido');
  }
  
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
    
    if (!response.ok) {
      throw new Error('Erro na consulta do CEP');
    }
    
    const data: EnderecoViaCEP = await response.json();
    
    if (data.erro) {
      throw new Error('CEP não encontrado');
    }
    
    return {
      cep: formatCEP(cleanCEP),
      logradouro: data.logradouro || '',
      bairro: data.bairro || '',
      localidade: data.localidade || '',
      uf: data.uf || '',
      ddd: data.ddd
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Erro ao consultar CEP');
  }
};
