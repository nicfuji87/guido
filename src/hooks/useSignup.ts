import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { unformatCPF } from '@/utils/cpfUtils';

interface SignupData {
  nome: string;
  email: string;
  whatsapp: string;
  cpf: string;
  tipo_conta: 'INDIVIDUAL' | 'IMOBILIARIA';
  nome_empresa?: string;
}

interface SignupResult {
  success: boolean;
  data?: {
    conta_id: string;
    corretor_id: string;
    assinatura_id: string;
  };
  error?: string;
}

export const useSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = async (data: SignupData): Promise<SignupResult> => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Verificar se email já existe
      const { data: existingEmail, error: emailCheckError } = await supabase
        .from('corretores')
        .select('id')
        .eq('email', data.email)
        .single();

      if (emailCheckError && emailCheckError.code !== 'PGRST116') {
        throw new Error('Erro ao verificar email');
      }

      if (existingEmail) {
        throw new Error('Este email já está cadastrado');
      }

      // 2. Verificar se WhatsApp já existe
      const { data: existingWhatsApp, error: whatsappCheckError } = await supabase
        .from('leads')
        .select('id')
        .eq('whatsapp', data.whatsapp)
        .single();

      if (whatsappCheckError && whatsappCheckError.code !== 'PGRST116') {
        // Erro ao verificar WhatsApp no leads - continuar processo
      }

      if (existingWhatsApp) {
        throw new Error('Este número do WhatsApp já está cadastrado');
      }

      // 3. Verificar se CPF já existe
      const cleanCPF = unformatCPF(data.cpf);
      const { data: existingCPF, error: cpfCheckError } = await supabase
        .from('corretores')
        .select('id')
        .eq('cpf', data.cpf)
        .single();

      if (cpfCheckError && cpfCheckError.code !== 'PGRST116') {
        throw new Error('Erro ao verificar CPF');
      }

      if (existingCPF) {
        throw new Error('Este CPF já está cadastrado');
      }

      // 4. Salvar no leads para capture rápido
      const { error: leadError } = await supabase
        .from('leads')
        .insert({
          name: data.nome,
          whatsapp: data.whatsapp
        })
        .select()
        .single();

      if (leadError) {
        // Erro ao salvar lead - continuar processo
        // Não falha aqui, é só backup
      }

      // 5. Criar conta
      const { data: contaData, error: contaError } = await supabase
        .from('contas')
        .insert({
          nome_conta: data.tipo_conta === 'IMOBILIARIA' ? data.nome_empresa! : data.nome,
          tipo_conta: data.tipo_conta,
          documento: cleanCPF // Usar o CPF como documento principal
        })
        .select()
        .single();

      if (contaError) {
        throw new Error(`Erro ao criar conta: ${contaError.message}`);
      }

      // 6. Criar corretor/usuário
      const { data: corretorData, error: corretorError } = await supabase
        .from('corretores')
        .insert({
          conta_id: contaData.id,
          nome: data.nome,
          email: data.email,
          cpf: data.cpf, // CPF formatado
          hash_senha: 'TEMP_HASH', // Será definido no onboarding
          funcao: 'DONO'
        })
        .select()
        .single();

      if (corretorError) {
        throw new Error(`Erro ao criar corretor: ${corretorError.message}`);
      }

      // 7. Criar assinatura de trial
      const planoId = data.tipo_conta === 'INDIVIDUAL' ? 1 : 2;
      const dataFimTrial = new Date();
      dataFimTrial.setDate(dataFimTrial.getDate() + 7); // 7 dias de trial

      const { data: assinaturaData, error: assinaturaError } = await supabase
        .from('assinaturas')
        .insert({
          conta_id: contaData.id,
          plano_id: planoId,
          status: 'TRIAL',
          data_fim_trial: dataFimTrial.toISOString()
        })
        .select()
        .single();

      if (assinaturaError) {
        throw new Error(`Erro ao criar assinatura: ${assinaturaError.message}`);
      }

      // 8. Sucesso! Retornar IDs para redirecionamento
      return {
        success: true,
        data: {
          conta_id: contaData.id,
          corretor_id: corretorData.id,
          assinatura_id: assinaturaData.id
        }
      };

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro interno. Tente novamente.';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = useCallback(() => setError(null), []);

  return {
    signup,
    isLoading,
    error,
    clearError
  };
};
