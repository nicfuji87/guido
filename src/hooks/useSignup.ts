import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { log } from '@/utils/logger';
import { unformatCPF, formatCPF } from '@/utils/cpfUtils';
import { createEvolutionInstance } from '@/services/evolutionAPI';

// AI dev note: Tipos específicos para Supabase Auth v1
interface SupabaseUser {
  id: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
  confirmed_at?: string;
}

interface SupabaseAuthError {
  message: string;
  status?: number;
  code?: string;
}

// AI dev note: Hook crítico para onboarding - implementa fluxo completo de 8 passos
// Inclui logs estratégicos e validações de segurança para debug de problemas

interface SignupData {
  nome: string;
  email: string;
  whatsapp: string;
  cpf: string;
  tipo_conta: 'INDIVIDUAL' | 'IMOBILIARIA';
  nome_empresa?: string;
  plano_codigo?: string; // Código do plano selecionado
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
      
      // === PASSO 1: VALIDAÇÕES INICIAIS ===
      
      // 1.1 Validar email único
      log.info('Verificando email único', 'SIGNUP', { email: data.email.trim().toLowerCase() });
      
      const { data: existingEmail, error: emailCheckError } = await supabase
        .from('corretores')
        .select('id')
        .eq('email', data.email.trim().toLowerCase())
        .single();

      log.debug('Resultado verificação email', 'SIGNUP', { existingEmail, emailCheckError });

      if (emailCheckError && emailCheckError.code !== 'PGRST116') {
        log.error('Erro na verificação de email (continuando)', 'SIGNUP', emailCheckError);
        // Não interromper o cadastro por erro na verificação - pode ser problema de conectividade/cache
        // O signup continuará e se o email já existir, o Supabase Auth retornará erro apropriado
      }

      if (existingEmail) {
        throw new Error('Este email já está cadastrado. Faça login ou use outro email.');
      }

      // 1.2 Validar CPF único
      const cleanCPF = unformatCPF(data.cpf);
      const formattedCPF = formatCPF(cleanCPF);
      
      log.info('Verificando CPF único', 'SIGNUP', { original: data.cpf, clean: cleanCPF, formatted: formattedCPF });
      
      const { data: existingCPF, error: cpfCheckError } = await supabase
        .from('corretores')
        .select('id')
        .eq('cpf', formattedCPF)
        .single();

      log.debug('Resultado verificação CPF', 'SIGNUP', { existingCPF, cpfCheckError });

      if (cpfCheckError && cpfCheckError.code !== 'PGRST116') {
        log.error('Erro na verificação de CPF (continuando)', 'SIGNUP', cpfCheckError);
        // Não interromper o cadastro por erro na verificação - pode ser problema de conectividade/cache
        // Se o CPF já existir, o INSERT no Supabase retornará erro de constraint
      }

      if (existingCPF) {
        throw new Error('Este CPF já está cadastrado. Entre em contato se precisar de ajuda.');
      }

      // 1.3 Validar WhatsApp único na tabela usuarios
      log.info('Verificando WhatsApp único', 'SIGNUP', { whatsapp: data.whatsapp });
      
      const { data: existingWhatsApp, error: whatsappCheckError } = await supabase
        .from('usuarios')
        .select('id')
        .eq('whatsapp', data.whatsapp)
        .single();

      log.debug('Resultado verificação WhatsApp', 'SIGNUP', { existingWhatsApp, whatsappCheckError });

      if (whatsappCheckError && whatsappCheckError.code !== 'PGRST116') {
        log.warn('Erro na verificação de WhatsApp (continuando)', 'SIGNUP', whatsappCheckError);
        // Não interromper por erro na verificação - pode ser problema de conectividade/cache
      } else if (existingWhatsApp) {
        throw new Error('Este número do WhatsApp já está cadastrado.');
      }

      log.info('Validações iniciais concluídas com sucesso', 'SIGNUP');

      // === PASSO 2: BUSCAR PLANO SELECIONADO ===
      log.info('PASSO 2: Buscando plano selecionado', 'SIGNUP');
      
      const plano_codigo = data.plano_codigo || (data.tipo_conta === 'INDIVIDUAL' ? 'individual' : 'imobiliaria_basica');
      log.debug('Plano código', 'SIGNUP', { plano_codigo });
      
      const { data: planoSelecionado, error: planoError } = await supabase
        .from('planos')
        .select('*')
        .eq('codigo_externo', plano_codigo)
        .eq('is_ativo', true)
        .single();

      log.debug('Resultado busca plano', 'SIGNUP', { planoSelecionado, planoError });

      if (planoError || !planoSelecionado) {
        throw new Error('Plano selecionado não está disponível. Recarregue a página.');
      }

      log.info('Plano encontrado', 'SIGNUP', { nome_plano: planoSelecionado.nome_plano });

      // AI dev note: PASSO 3 REMOVIDO - dados Asaas não são mais preparados no signup
      // Agora o cadastro Asaas é feito via webhook n8n quando necessário

      // === PASSO 4: CRIAR CONTA ===
      log.info('PASSO 4: Criando conta', 'SIGNUP');
      
      const nomeContaFinal = data.tipo_conta === 'IMOBILIARIA' && data.nome_empresa 
        ? data.nome_empresa.trim() 
        : data.nome;

      log.debug('Dados da conta a ser criada', 'SIGNUP', { nome_conta: nomeContaFinal, tipo_conta: data.tipo_conta, max_corretores: planoSelecionado.limite_corretores, documento: cleanCPF });

      const { data: novaConta, error: erroNovaConta } = await supabase
          .from('contas')
          .insert({
            nome_conta: nomeContaFinal,
            tipo_conta: data.tipo_conta,
            max_corretores: planoSelecionado.limite_corretores,
            documento: cleanCPF
          })
          .select()
          .single();

      log.debug('Resultado criação conta', 'SIGNUP', { novaConta, erroNovaConta });

      if (erroNovaConta) {
        log.error('Erro ao criar conta', 'SIGNUP', erroNovaConta);
        throw new Error(`Erro ao criar conta: ${erroNovaConta.message}`);
      }

      log.info('Conta criada com sucesso', 'SIGNUP', { conta_id: novaConta.id });

      // === PASSO 5: CRIAR USUÁRIO NO AUTH.USERS DO SUPABASE ===
      log.info('PASSO 5: Criando usuário no sistema de autenticação', 'SIGNUP');
      
      // Declarar variáveis fora do try/catch para uso posterior
      let authUser: SupabaseUser | null = null;
      let authError: SupabaseAuthError | null = null;
      
      log.debug('Dados para signUp', 'SIGNUP', { email: data.email.trim().toLowerCase(), hasPassword: true });
      
      const signUpResponse = await supabase.auth.signUp({
        email: data.email.trim().toLowerCase(),
        password: crypto.randomUUID() // Senha temporária - usuário usará magic link
      });

      // CORREÇÃO: v1.x retorna {user, session, error} - NÃO {data, error}
      const response = signUpResponse;
      authUser = response.user;
      authError = response.error;

      log.debug('Resultado signUp', 'SIGNUP', { authUser: authUser ? { id: authUser.id, email: authUser.email } : null, authError });

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

      // Verificar se o signUp funcionou corretamente
      if (!authUser || !authUser.id) {
        log.error('authUser inválido', 'SIGNUP', { authUser });
        throw new Error('Não foi possível criar o usuário. Tente novamente em alguns minutos.');
      }

      const authUserId = authUser.id;
      log.info('Usuário criado no auth.users com sucesso', 'SIGNUP', { auth_user_id: authUserId });

      // === PASSO 6: CRIAR USUÁRIO LOCAL E INSTÂNCIA EVOLUTION ===
      log.info('Passo 6: Criando usuário local e instância Evolution', 'SIGNUP');
      
      // 6.1 Criar instância Evolution primeiro
      const evolutionResult = await createEvolutionInstance(data.nome, data.whatsapp);

      // 6.2 Criar usuário com dados da Evolution e link para auth.user
      const usuarioData = {
        name: data.nome, // Campo correto é 'name', não 'nome'
        email: data.email.trim().toLowerCase(),
        whatsapp: data.whatsapp,
        fonte_cadastro: 'SITE',
        auth_user_id: authUserId, // 🔗 Link crítico para auth.users
        // AI dev note: dados_asaas removido - não mais necessário com webhook n8n
        // Dados da Evolution (se disponíveis)
        evolution_instance: evolutionResult.success ? evolutionResult.data?.instanceName : null,
        evolution_apikey: evolutionResult.success ? evolutionResult.data?.apiKey : null,
        evolution_url: evolutionResult.success ? evolutionResult.data?.evolutionUrl : null
      };
      
      const { data: novoUsuario, error: erroNovoUsuario } = await supabase
        .from('usuarios')
        .insert(usuarioData)
        .select()
        .single();

      if (erroNovoUsuario) {
        throw new Error(`Erro ao criar usuário: ${erroNovoUsuario.message}`);
      }

      // === PASSO 7: CRIAR CORRETOR (DONO DA CONTA) ===
      const { data: novoCorretor, error: erroNovoCorretor } = await supabase
        .from('corretores')
        .insert({
          conta_id: novaConta.id,
          nome: data.nome,
          email: data.email.trim().toLowerCase(),
          cpf: formattedCPF,
          hash_senha: 'magic_link', // Será autenticado via magic link
          funcao: 'DONO'
        })
        .select()
        .single();

      if (erroNovoCorretor) {
        throw new Error(`Erro ao criar corretor: ${erroNovoCorretor.message}`);
      }

      // === PASSO 8: ATUALIZAR CONTA COM ADMIN PRINCIPAL ===
      // console.log(`${logPrefix} Passo 8: Definindo admin principal`);
      
      const { error: erroUpdateConta } = await supabase
        .from('contas')
        .update({ admin_principal_id: novoCorretor.id })
        .eq('id', novaConta.id);

      if (erroUpdateConta) {
        // console.error(`${logPrefix} Erro ao definir admin principal:`, erroUpdateConta);
        // Não falha aqui, é complementar
      }

      // === PASSO 9: CRIAR ASSINATURA DE TRIAL ===
      const dataInicioTrial = new Date();
      const dataFimTrial = new Date(dataInicioTrial);
      dataFimTrial.setDate(dataFimTrial.getDate() + 7); // 7 dias de trial

      const responsavelPagamento = data.tipo_conta === 'IMOBILIARIA' ? 'ADMIN_CONTA' : 'CONTA_PROPRIA';

      const { data: novaAssinatura, error: erroNovaAssinatura } = await supabase
        .from('assinaturas')
        .insert({
          conta_id: novaConta.id,
          plano_id: planoSelecionado.id,
          status: 'TRIAL',
          data_fim_trial: dataFimTrial.toISOString(),
          responsavel_pagamento: responsavelPagamento,
          ciclo_cobranca: 'MONTHLY',
          valor_atual: planoSelecionado.preco_mensal
        })
        .select()
        .single();

      if (erroNovaAssinatura) {
        throw new Error(`Erro ao criar assinatura: ${erroNovaAssinatura.message}`);
      }

      // === SUCESSO TOTAL ===
      const resultado = {
        success: true,
        data: {
          conta_id: novaConta.id,
          corretor_id: novoCorretor.id,
          usuario_id: novoUsuario.id,
          assinatura_id: novaAssinatura.id,
          auth_user_id: authUserId // 🔗 ID do auth.users criado
        }
      };

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
