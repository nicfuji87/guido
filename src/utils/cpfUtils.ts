/**
 * Formata um CPF para o padrão xxx.xxx.xxx-xx
 */
export const formatCPF = (value: string): string => {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');
  
  // Aplica a máscara progressivamente
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
};

/**
 * Remove a formatação do CPF, deixando apenas números
 */
export const unformatCPF = (cpf: string): string => {
  return cpf.replace(/\D/g, '');
};

/**
 * Valida se um CPF é válido usando o algoritmo oficial
 */
export const validateCPF = (cpf: string): boolean => {
  const numbers = unformatCPF(cpf);
  
  // CPF deve ter exatamente 11 dígitos
  if (numbers.length !== 11) return false;
  
  // Elimina CPFs com todos os dígitos iguais
  if (/^(\d)\1{10}$/.test(numbers)) return false;
  
  // Valida o primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers.charAt(i)) * (10 - i);
  }
  let remainder = 11 - (sum % 11);
  const digit1 = remainder >= 10 ? 0 : remainder;
  
  if (digit1 !== parseInt(numbers.charAt(9))) return false;
  
  // Valida o segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers.charAt(i)) * (11 - i);
  }
  remainder = 11 - (sum % 11);
  const digit2 = remainder >= 10 ? 0 : remainder;
  
  return digit2 === parseInt(numbers.charAt(10));
};

/**
 * Verifica se um CPF está com formato válido (máscara completa)
 */
export const isCPFFormatComplete = (cpf: string): boolean => {
  return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf);
};
