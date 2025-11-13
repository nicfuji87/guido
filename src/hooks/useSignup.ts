import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { log } from '@/utils/logger';
import { unformatCPF, formatCPF } from '@/utils/cpfUtils';

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
      
      const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
      
      // AI dev note: redirectTo DEVE ir para /auth/callback para processar o token ANTES de ir para /app
      log.debug('Configurando redirectTo', 'SIGNUP', { baseUrl, redirectTo: `${baseUrl}/auth/callback` });
      
      const signUpResponse = await supabase.auth.signUp(
        {
          email: data.email.trim().toLowerCase(),
          password: crypto.randomUUID() // Senha temporária - usuário usará magic link
        },
        {
          redirectTo: `${baseUrl}/auth/callback` // Processar token e então ir para dashboard
        }
      );

      const authUser = signUpResponse.user;
      const authError = signUpResponse.error;

      log.debug('Resultado signUp', 'SIGNUP', { 
        authUser: authUser ? { id: authUser.id, email: authUser.email } : null, 
        authError,
        fullResponse: signUpResponse
      });

      if (authError) {
        log.error('Erro no signUp', 'SIGNUP', authError);
        log.error('Detalhes completos do erro', 'SIGNUP', { 
          message: authError.message,
          status: authError.status
        });
        
        // Tratar erros específicos em português
        let mensagemErro = authError.message;
        
        if (authError.message === 'User already registered' || 
            authError.message.includes('already been registered') ||
            authError.status === 400) {
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
        
        // Tratar erros do banco de forma amigável
        let mensagemErro = 'Erro ao criar sua conta. Tente novamente.';
        
        if (signupError.message.includes('usuarios_auth_user_id_fkey')) {
          mensagemErro = 'Erro ao vincular sua conta. Por favor, tente novamente.';
        } else if (signupError.message.includes('duplicate key') || signupError.code === '23505') {
          if (signupError.message.includes('email')) {
            mensagemErro = 'Este email já está cadastrado. Faça login ou use outro email.';
          } else if (signupError.message.includes('cpf')) {
            mensagemErro = 'Este CPF já está cadastrado. Entre em contato se precisar de ajuda.';
          } else if (signupError.message.includes('whatsapp')) {
            mensagemErro = 'Este número do WhatsApp já está cadastrado.';
          } else {
            mensagemErro = 'Estes dados já estão cadastrados. Faça login ou use outros dados.';
          }
        } else if (signupError.message.includes('violates foreign key')) {
          mensagemErro = 'Erro ao processar seu cadastro. Por favor, aguarde alguns segundos e tente novamente.';
        }
        
        throw new Error(mensagemErro);
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

      // === PASSO 5: CRIAR INSTÂNCIA UAZAPI VIA EDGE FUNCTION ===
      // AI dev note: Migrado de Evolution para UAZapi via Edge Function
      // Credenciais sensíveis ficam no Supabase Secrets (server-side)
      log.info('PASSO 5: Criando instância UAZapi via Edge Function', 'SIGNUP');
      
      const { data: uazapiResultRaw, error: uazapiError } = await supabase.functions.invoke<{
        success: boolean;
        data?: { instanceName: string; instanceId: string; token: string; status: string };
        error?: string;
      }>(
        'uazapi-init-instance',
        {
          body: JSON.stringify({
            nome: data.nome,
            whatsapp: data.whatsapp,
            userId: authUserId
          })
        }
      );

      let uazapiResult: {
        success: boolean;
        data?: { instanceName: string; instanceId: string; token: string; status: string };
        error?: string;
      } = {
        success: false,
        data: undefined,
        error: ''
      };

      if (uazapiError) {
        log.warn('Erro ao chamar Edge Function UAZapi', 'SIGNUP', uazapiError);
        uazapiResult = {
          success: false,
          error: uazapiError.message
        };
      } else if (uazapiResultRaw) {
        uazapiResult = uazapiResultRaw;
        if (!uazapiResult.success) {
          log.warn('Falha ao criar instância UAZapi', 'SIGNUP', uazapiResult.error);
        } else {
          log.info('Instância UAZapi criada com sucesso', 'SIGNUP', uazapiResult.data);
        }
      }

      // === PASSO 6: VERIFICAR DADOS UAZAPI ===
      // AI dev note: Dados UAZapi já são salvos automaticamente pela Edge Function uazapi-init-instance
      // Apenas logar sucesso ou falha
      log.info('PASSO 6: Verificando dados UAZapi salvos', 'SIGNUP');
      
      if (uazapiResult.success && uazapiResult.data) {
        log.info('Dados UAZapi salvos com sucesso', 'SIGNUP', {
          instanceName: uazapiResult.data.instanceName,
          instanceId: uazapiResult.data.instanceId,
          status: uazapiResult.data.status
        });
        } else {
        log.warn('UAZapi não foi criado - usuário precisará conectar manualmente', 'SIGNUP', {
          error: uazapiResult.error
          });
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
