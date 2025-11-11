import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { log } from '@/utils/logger';
import { unformatCPF, formatCPF } from '@/utils/cpfUtils';
import { createEvolutionInstance } from '@/services/evolutionAPI';

// AI dev note: Hook crítico para onboarding - implementa fluxo completo de signup
// Inclui logs estratégicos e validações de segurança para debug de problemas

interface SignupData {
  nome: string;
  email: string;
  whatsapp: string;
  cpf: string;
  tipo_conta: 'INDIVIDUAL' | 'IMOBILIARIA';
  nome_empresa?: string;
  plano_codigo?: string; // Código do plano selecionado
  // Campos de endereço
  cep?: string;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  ddd?: string;
  numero_residencia?: string;
  complemento_endereco?: string;
}

interface SignupResult {
  success: boolean;
  data?: {
    conta_id: string;
    corretor_id: string;
    usuario_id: string;
    assinatura_id: string;
    auth_user_id?: string;
  };
  error?: string;
}

// AI dev note: DadosAsaas removido - agora processamento via webhook n8n
// interface DadosAsaas { ... }

export const useSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = async (data: SignupData): Promise<SignupResult> => {
    setIsLoading(true);
    setError(null);

    try {
      log.info('Iniciando cadastro', 'SIGNUP', {
        email: data.email,
        tipo_conta: data.tipo_conta,
        nome: data.nome,
        whatsapp: data.whatsapp,
        cpf: data.cpf
      });
      
      // === PASSO 1: PREPARAR DADOS ===
      const cleanCPF = unformatCPF(data.cpf);
      const formattedCPF = formatCPF(cleanCPF);
      
      // === PASSO 2: CRIAR USUÁRIO NO AUTH.USERS PRIMEIRO (SEGURANÇA) ===
      log.info('PASSO 2: Criando usuário no sistema de autenticação', 'SIGNUP');
      
      const signUpResponse = await supabase.auth.signUp({
        email: data.email.trim().toLowerCase(),
        password: crypto.randomUUID() // Senha temporária - usuário usará magic link
      });

      const authUser = signUpResponse.user;
      const authError = signUpResponse.error;

      log.debug('Resultado signUp', 'SIGNUP', { 
        authUser: authUser ? { id: authUser.id, email: authUser.email } : null, 
        authError 
      });

      if (authError) {
        log.error('Erro no signUp', 'SIGNUP', authError);
        // Tratar erros específicos em português
        let mensagemErro = authError.message;
        
        if (authError.message === 'User already registered') {
          mensagemErro = 'Este email já possui uma conta. Faça login ou use outro email.';
        } else if (authError.message.includes('Invalid email')) {
          mensagemErro = 'Email inválido. Verifique o formato do email.';
        } else if (authError.message.includes('Password should be at least')) {
          mensagemErro = 'Senha deve ter pelo menos 6 caracteres.';
        } else if (authError.message.includes('Email not confirmed')) {
          mensagemErro = 'Email não confirmado. Verifique sua caixa de entrada.';
        } else {
          mensagemErro = `Erro na autenticação: ${authError.message}`;
        }
        
        throw new Error(mensagemErro);
      }

      if (!authUser || !authUser.id) {
        log.error('authUser inválido', 'SIGNUP', { authUser });
        throw new Error('Não foi possível criar o usuário. Tente novamente em alguns minutos.');
      }

      const authUserId = authUser.id;
      log.info('Usuário criado no auth.users com sucesso', 'SIGNUP', { auth_user_id: authUserId });

      // === PASSO 3: BUSCAR PLANO SE FORNECIDO ===
      let plano_id = null;
      if (data.plano_codigo) {
        const { data: planoSelecionado } = await supabase
          .from('planos')
          .select('id')
          .eq('codigo_externo', data.plano_codigo)
          .eq('is_ativo', true)
          .single();
        
        if (planoSelecionado) {
          plano_id = planoSelecionado.id;
        }
      }

      log.info('PASSO 4: Executando signup completo no banco', 'SIGNUP');

      // === PASSO 4: USAR FUNÇÃO COMPLETE_SIGNUP DO BANCO ===
      // AI dev note: Esta função faz todo o processo atomicamente com SECURITY DEFINER
      // Cria: conta, corretor, usuário e assinatura trial em uma transação
      // IMPORTANTE: auth_user_id é passado para vincular corretamente desde o início
      const { data: signupResultRaw, error: signupError } = await supabase
        .rpc('complete_signup', {
          p_email: data.email.trim().toLowerCase(),
          p_nome: data.nome,
          p_cpf: formattedCPF,
          p_whatsapp: data.whatsapp,
          p_tipo_conta: data.tipo_conta,
          p_auth_user_id: authUserId, // ⭐ VINCULADO DESDE O INÍCIO
          p_nome_empresa: data.nome_empresa || null,
          p_cep: data.cep ? Number(data.cep.replace(/\D/g, '')) : null,
          p_logradouro: data.logradouro || null,
          p_bairro: data.bairro || null,
          p_localidade: data.localidade || null,
          p_uf: data.uf || null,
          p_numero_residencia: data.numero_residencia || null,
          p_complemento: data.complemento_endereco || null,
          p_plano_id: plano_id
        });

      log.debug('Resultado complete_signup', 'SIGNUP', { signupResultRaw, signupError });

      if (signupError) {
        log.error('Erro no complete_signup', 'SIGNUP', signupError);
        throw new Error(signupError.message);
      }

      // Tipar corretamente o resultado (função retorna JSON)
      const signupResult = signupResultRaw as unknown as {
        success: boolean;
        conta_id: string;
        corretor_id: string;
        usuario_id: string;
        assinatura_id: string;
        plano_id: number;
        message: string;
      };

      if (!signupResult || !signupResult.success) {
        throw new Error('Erro ao criar cadastro. Tente novamente.');
      }

      const { conta_id, corretor_id, usuario_id, assinatura_id } = signupResult;

      log.info('Cadastro criado com sucesso no banco', 'SIGNUP', { 
        conta_id, 
        corretor_id, 
        usuario_id, 
        assinatura_id 
      });

      // === PASSO 5: CRIAR INSTÂNCIA EVOLUTION ===
      log.info('PASSO 5: Criando instância Evolution', 'SIGNUP');
      
      const evolutionResult = await createEvolutionInstance(data.nome, data.whatsapp);

      if (!evolutionResult.success) {
        log.warn('Falha ao criar instância Evolution', 'SIGNUP', evolutionResult.error);
      }

      // === PASSO 6: ATUALIZAR USUÁRIO COM DADOS DA EVOLUTION ===
      // AI dev note: Usando função RPC com SECURITY DEFINER para bypassar RLS
      // O usuário acabou de ser criado mas não está autenticado, então RLS normal bloquearia
      log.info('PASSO 6: Atualizando usuário com dados de Evolution', 'SIGNUP');
      
      if (evolutionResult.success && evolutionResult.data) {
        const { error: updateError } = await supabase.rpc('update_evolution_data_after_signup', {
          p_usuario_id: usuario_id,
          p_evolution_instance: evolutionResult.data.instanceName,
          p_evolution_apikey: evolutionResult.data.apiKey,
          p_evolution_url: evolutionResult.data.evolutionUrl
        });

        if (updateError) {
          log.warn('Erro ao atualizar usuário com dados Evolution', 'SIGNUP', updateError);
          // Não bloqueia o signup, apenas registra o warning
        } else {
          log.info('Dados Evolution salvos com sucesso', 'SIGNUP', {
            instance: evolutionResult.data.instanceName
          });
        }
      }

      // === SUCESSO TOTAL ===
      const resultado = {
        success: true,
        data: {
          conta_id,
          corretor_id,
          usuario_id,
          assinatura_id,
          auth_user_id: authUserId
        }
      };

      log.info('Signup completo com sucesso!', 'SIGNUP', resultado.data);

      return resultado;

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
