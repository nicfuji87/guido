import { supabase } from '@/lib/supabaseClient';

// AI dev note: Utilitários para gerenciar soft delete de forma consistente
// Todas as queries que não devem mostrar registros deletados devem usar essas helpers

// AI dev note: Filtros desabilitados temporariamente devido a problemas de compatibilidade com a versão do Supabase
export const softDeleteFilters = {
  // Filtro padrão para assinaturas ativas (não soft-deleted)
  // assinaturasAtivas: () => supabase.from('assinaturas').select('*').or('deleted_at.is.null'),
  
  // Filtro padrão para usuários ativos (não soft-deleted)  
  // usuariosAtivos: () => supabase.from('usuarios').select('*').or('deleted_at.is.null'),
  
  // Para queries que precisam incluir soft-deleted (ex: durante cancelamento)
  assinaturasTodas: () => supabase.from('assinaturas').select(),
  usuariosTodos: () => supabase.from('usuarios').select()
};

export const performSoftDelete = {
  // Soft delete de assinatura
  assinatura: async (assinaturaId: string, motivo?: string) => {
    const now = new Date().toISOString();
    
    return await supabase
      .from('assinaturas')
      .update({
        deleted_at: now,
        status: 'CANCELADO',
        data_cancelamento: now,
        motivo_cancelamento: motivo || 'Cancelado pelo usuário',
        updated_at: now
      })
      .eq('id', assinaturaId);
  },

  // Soft delete de usuário
  usuario: async (usuarioId: string) => {
    const now = new Date().toISOString();
    
    return await supabase
      .from('usuarios')
      .update({
        deleted_at: now,
        updated_at: now
      })
      .eq('id', usuarioId);
  },

  // Soft delete de usuário por auth_user_id
  usuarioPorAuthId: async (authUserId: string) => {
    const now = new Date().toISOString();
    
    return await supabase
      .from('usuarios')
      .update({
        deleted_at: now,
        updated_at: now
      })
      .eq('auth_user_id', authUserId);
  }
};

export const restoreSoftDelete = {
  // Restaurar assinatura soft-deleted
  assinatura: async (assinaturaId: string) => {
    const now = new Date().toISOString();
    
    return await supabase
      .from('assinaturas')
      .update({
        deleted_at: null,
        updated_at: now
      })
      .eq('id', assinaturaId);
  },

  // Restaurar usuário soft-deleted
  usuario: async (usuarioId: string) => {
    const now = new Date().toISOString();
    
    return await supabase
      .from('usuarios')
      .update({
        deleted_at: null,
        updated_at: now
      })
      .eq('id', usuarioId);
  }
};

// Helper para verificar se um registro está soft-deleted
export const isSoftDeleted = {
  assinatura: async (assinaturaId: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('assinaturas')
      .select('deleted_at')
      .eq('id', assinaturaId)
      .single();
      
    if (error) return false;
    return data?.deleted_at !== null;
  },

  usuario: async (usuarioId: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('usuarios')
      .select('deleted_at')
      .eq('id', usuarioId)
      .single();
      
    if (error) return false;
    return data?.deleted_at !== null;
  }
};
