// AI dev note: Funções auxiliares para rollback e recuperação de signup
// Previnem auth.users órfãos quando signup falha parcialmente

import { supabase } from '@/lib/supabaseClient';
import { log } from '@/utils/logger';

/**
 * Faz rollback parcial removendo registros do banco (exceto auth.user)
 * Usado quando signup falha antes de criar auth.user
 */
export const rollbackSignupPartial = async (
  contaId?: string,
  corretorId?: string,
  assinaturaId?: string
): Promise<void> => {
  try {
    log.warn('Iniciando rollback parcial do signup', 'SIGNUP_ROLLBACK', {
      contaId,
      corretorId,
      assinaturaId
    });

    // Deletar assinatura (se existir)
    if (assinaturaId) {
      await supabase.from('assinaturas').delete().eq('id', assinaturaId);
      log.info('Assinatura removida', 'SIGNUP_ROLLBACK', { assinaturaId });
    }

    // Deletar corretor (se existir)
    if (corretorId) {
      await supabase.from('corretores').delete().eq('id', corretorId);
      log.info('Corretor removido', 'SIGNUP_ROLLBACK', { corretorId });
    }

    // Deletar conta (se existir)
    if (contaId) {
      await supabase.from('contas').delete().eq('id', contaId);
      log.info('Conta removida', 'SIGNUP_ROLLBACK', { contaId });
    }

    log.info('Rollback parcial concluído', 'SIGNUP_ROLLBACK');
  } catch (error) {
    log.error('Erro durante rollback parcial', 'SIGNUP_ROLLBACK', error);
    // Não lançar erro - rollback é best-effort
  }
};

/**
 * Faz rollback completo incluindo auth.user
 * Usado quando signup falha após criar auth.user
 */
export const rollbackSignupComplete = async (
  authUserId: string,
  contaId?: string,
  corretorId?: string,
  assinaturaId?: string,
  usuarioId?: string
): Promise<void> => {
  try {
    log.warn('Iniciando rollback completo do signup', 'SIGNUP_ROLLBACK', {
      authUserId,
      contaId,
      corretorId,
      assinaturaId,
      usuarioId
    });

    // Primeiro fazer rollback parcial (banco)
    await rollbackSignupPartial(contaId, corretorId, assinaturaId);

    // Deletar usuario (se existir)
    if (usuarioId) {
      await supabase.from('usuarios').delete().eq('id', usuarioId);
      log.info('Usuário removido da tabela usuarios', 'SIGNUP_ROLLBACK', { usuarioId });
    }

    // Por último, deletar auth.user
    // AI dev note: Usar Admin API para deletar auth.user
    // Requer service_role_key (não disponível no client)
    // Por isso, apenas logamos - admin deve limpar manualmente
    log.error(
      'AUTH USER ÓRFÃO DETECTADO - Requer limpeza manual',
      'SIGNUP_ROLLBACK',
      {
        authUserId,
        email: 'Verificar no Supabase Dashboard',
        action: 'DELETE FROM auth.users WHERE id = ' + authUserId
      }
    );

    // TODO: Implementar chamada para Edge Function que use service_role_key
    // para deletar auth.user automaticamente

  } catch (error) {
    log.error('Erro durante rollback completo', 'SIGNUP_ROLLBACK', error);
  }
};

/**
 * Tenta recuperar um signup incompleto
 * Usado quando usuário faz login mas está faltando registros
 */
export const recoverIncompleteSignup = async (
  authUserId: string,
  email: string
): Promise<{success: boolean; message: string}> => {
  try {
    log.info('Tentando recuperar signup incompleto', 'SIGNUP_RECOVERY', {
      authUserId,
      email
    });

    // Verificar o que está faltando
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('*')
      .eq('auth_user_id', authUserId)
      .single();

    const { data: corretor } = await supabase
      .from('corretores')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    // Se não tem corretor, não dá pra recuperar - precisa signup novo
    if (!corretor) {
      log.error('Corretor não encontrado - signup incompleto irreversível', 'SIGNUP_RECOVERY', {
        authUserId,
        email
      });
      
      return {
        success: false,
        message: 'Cadastro incompleto. Entre em contato com o suporte.'
      };
    }

    // Se tem corretor mas não tem usuario, criar usuario
    if (!usuario && corretor) {
      log.info('Criando registro de usuario faltante', 'SIGNUP_RECOVERY', {
        authUserId,
        email
      });

      const { data: newUsuario, error } = await supabase
        .from('usuarios')
        .insert({
          name: corretor.nome,
          email: email.toLowerCase(),
          auth_user_id: authUserId,
          fonte_cadastro: 'RECOVERY',
          whatsapp: '', // Será preenchido pelo usuário
        })
        .select()
        .single();

      if (error) {
        log.error('Erro ao criar usuario na recuperação', 'SIGNUP_RECOVERY', error);
        return {
          success: false,
          message: 'Erro ao recuperar cadastro. Tente novamente.'
        };
      }

      log.info('Usuario criado com sucesso na recuperação', 'SIGNUP_RECOVERY', {
        usuarioId: newUsuario.id
      });

      return {
        success: true,
        message: 'Cadastro recuperado com sucesso!'
      };
    }

    // Tudo OK
    return {
      success: true,
      message: 'Cadastro completo'
    };

  } catch (error) {
    log.error('Erro durante recuperação de signup', 'SIGNUP_RECOVERY', error);
    return {
      success: false,
      message: 'Erro ao verificar cadastro'
    };
  }
};

