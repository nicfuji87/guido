import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { unformatCPF, formatCPF } from '@/utils/cpfUtils';

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

interface DadosAsaas {
  name: string;
  email: string;
  cpfCnpj: string;
  phone: string;
  mobilePhone: string;
}

export const useSignup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = async (data: SignupData): Promise<SignupResult> => {
    setIsLoading(true);
    setError(null);

    const logPrefix = '[useSignup]';
    console.log(`${logPrefix} Iniciando cadastro para:`, { 
      email: data.email, 
      tipo_conta: data.tipo_conta,
      nome: data.nome 
    });

    try {
      // === PASSO 1: VALIDAÇÕES INICIAIS ===
      console.log(`${logPrefix} Passo 1: Validações iniciais`);
      
      // 1.1 Validar email único
      const { data: existingEmail, error: emailCheckError } = await supabase
        .from('corretores')
        .select('id')
        .eq('email', data.email.trim().toLowerCase())
        .single();

      if (emailCheckError && emailCheckError.code !== 'PGRST116') {
        console.error(`${logPrefix} Erro ao verificar email:`, emailCheckError);
        throw new Error('Erro ao verificar email. Tente novamente.');
      }

      if (existingEmail) {
        console.warn(`${logPrefix} Email já cadastrado:`, data.email);
        throw new Error('Este email já está cadastrado. Faça login ou use outro email.');
      }

      // 1.2 Validar CPF único
      const cleanCPF = unformatCPF(data.cpf);
      const formattedCPF = formatCPF(cleanCPF);
      
      const { data: existingCPF, error: cpfCheckError } = await supabase
        .from('corretores')
        .select('id')
        .eq('cpf', formattedCPF)
        .single();

      if (cpfCheckError && cpfCheckError.code !== 'PGRST116') {
        console.error(`${logPrefix} Erro ao verificar CPF:`, cpfCheckError);
        throw new Error('Erro ao verificar CPF. Tente novamente.');
      }

      if (existingCPF) {
        console.warn(`${logPrefix} CPF já cadastrado:`, formattedCPF);
        throw new Error('Este CPF já está cadastrado. Entre em contato se precisar de ajuda.');
      }

      // 1.3 Validar WhatsApp único na tabela usuarios
      const { data: existingWhatsApp, error: whatsappCheckError } = await supabase
        .from('usuarios')
        .select('id')
        .eq('whatsapp', data.whatsapp)
        .single();

      if (whatsappCheckError && whatsappCheckError.code !== 'PGRST116') {
        console.error(`${logPrefix} Erro ao verificar WhatsApp:`, whatsappCheckError);
        // Não falha aqui, continua processo
      } else if (existingWhatsApp) {
        console.warn(`${logPrefix} WhatsApp já cadastrado:`, data.whatsapp);
        throw new Error('Este número do WhatsApp já está cadastrado.');
      }

      console.log(`${logPrefix} ✅ Validações iniciais concluídas`);

      // === PASSO 2: BUSCAR PLANO SELECIONADO ===
      console.log(`${logPrefix} Passo 2: Buscando plano`);
      
      const plano_codigo = data.plano_codigo || (data.tipo_conta === 'INDIVIDUAL' ? 'individual' : 'imobiliaria_basica');
      
      const { data: planoSelecionado, error: planoError } = await supabase
        .from('planos')
        .select('*')
        .eq('codigo_externo', plano_codigo)
        .eq('is_ativo', true)
        .single();

      if (planoError || !planoSelecionado) {
        console.error(`${logPrefix} Plano não encontrado:`, plano_codigo, planoError);
        throw new Error('Plano selecionado não está disponível. Recarregue a página.');
      }

      console.log(`${logPrefix} ✅ Plano encontrado:`, planoSelecionado.nome_plano);

      // === PASSO 3: PREPARAR DADOS PARA ASAAS (NÃO CRIAR AINDA) ===
      console.log(`${logPrefix} Passo 3: Preparando dados para Asaas`);
      
      const dadosAsaas: DadosAsaas = {
        name: data.nome,
        email: data.email.trim().toLowerCase(),
        cpfCnpj: cleanCPF,
        phone: data.whatsapp,
        mobilePhone: data.whatsapp,
      };

      console.log(`${logPrefix} ✅ Dados Asaas preparados (cliente será criado apenas quando pagar)`);

      // === PASSO 4: CRIAR CONTA ===
      console.log(`${logPrefix} Passo 4: Criando conta`);
      
      const nomeContaFinal = data.tipo_conta === 'IMOBILIARIA' && data.nome_empresa 
        ? data.nome_empresa.trim() 
        : data.nome;

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

      if (erroNovaConta) {
        console.error(`${logPrefix} Erro ao criar conta:`, erroNovaConta);
        throw new Error(`Erro ao criar conta: ${erroNovaConta.message}`);
      }

      console.log(`${logPrefix} ✅ Conta criada:`, novaConta.id);

      // === PASSO 5: CRIAR USUÁRIO LOCAL ===
      console.log(`${logPrefix} Passo 5: Criando usuário local`);
      
      const { data: novoUsuario, error: erroNovoUsuario } = await supabase
        .from('usuarios')
        .insert({
          conta_id: novaConta.id,
          nome: data.nome,
          email: data.email.trim().toLowerCase(),
          documento: formattedCPF,
          whatsapp: data.whatsapp,
          fonte_cadastro: 'SITE',
          dados_asaas: dadosAsaas // Salva para uso posterior
        })
        .select()
        .single();

      if (erroNovoUsuario) {
        console.error(`${logPrefix} Erro ao criar usuário:`, erroNovoUsuario);
        throw new Error(`Erro ao criar usuário: ${erroNovoUsuario.message}`);
      }

      console.log(`${logPrefix} ✅ Usuário criado:`, novoUsuario.id);

      // === PASSO 6: CRIAR CORRETOR (DONO DA CONTA) ===
      console.log(`${logPrefix} Passo 6: Criando corretor principal`);
      
      const { data: novoCorretor, error: erroNovoCorretor } = await supabase
        .from('corretores')
        .insert({
          conta_id: novaConta.id,
          nome: data.nome,
          email: data.email.trim().toLowerCase(),
          cpf: formattedCPF,
          whatsapp: data.whatsapp,
          hash_senha: 'magic_link', // Será autenticado via magic link
          funcao: 'DONO'
        })
        .select()
        .single();

      if (erroNovoCorretor) {
        console.error(`${logPrefix} Erro ao criar corretor:`, erroNovoCorretor);
        throw new Error(`Erro ao criar corretor: ${erroNovoCorretor.message}`);
      }

      console.log(`${logPrefix} ✅ Corretor criado:`, novoCorretor.id);

      // === PASSO 7: ATUALIZAR CONTA COM ADMIN PRINCIPAL ===
      console.log(`${logPrefix} Passo 7: Definindo admin principal`);
      
      const { error: erroUpdateConta } = await supabase
        .from('contas')
        .update({ admin_principal_id: novoCorretor.id })
        .eq('id', novaConta.id);

      if (erroUpdateConta) {
        console.error(`${logPrefix} Erro ao definir admin principal:`, erroUpdateConta);
        // Não falha aqui, é complementar
      }

      // === PASSO 8: CRIAR ASSINATURA DE TRIAL ===
      console.log(`${logPrefix} Passo 8: Criando assinatura de trial`);
      
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
          data_inicio: dataInicioTrial.toISOString(),
          data_fim_trial: dataFimTrial.toISOString(),
          responsavel_pagamento: responsavelPagamento,
          ciclo_cobranca: 'MONTHLY'
        })
        .select()
        .single();

      if (erroNovaAssinatura) {
        console.error(`${logPrefix} Erro ao criar assinatura:`, erroNovaAssinatura);
        throw new Error(`Erro ao criar assinatura: ${erroNovaAssinatura.message}`);
      }

      console.log(`${logPrefix} ✅ Assinatura criada:`, novaAssinatura.id);

      // === SUCESSO TOTAL ===
      const resultado = {
        success: true,
        data: {
          conta_id: novaConta.id,
          corretor_id: novoCorretor.id,
          usuario_id: novoUsuario.id,
          assinatura_id: novaAssinatura.id
        }
      };

      console.log(`${logPrefix} 🎉 Cadastro concluído com sucesso!`, resultado.data);
      return resultado;

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro interno. Tente novamente.';
      console.error(`${logPrefix} ❌ Erro no cadastro:`, errorMessage);
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
