import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { log } from '@/utils/logger';

// AI dev note: Context para gerenciar filtros de visualização do dashboard
// Controla se usuário vê dados próprios, da equipe ou de corretor específico

export type UserRole = 'DONO' | 'ADMIN' | 'AGENTE';
export type ViewMode = 'self' | 'team' | 'corretor_specific';
export type TimeRange = '7d' | '30d' | '90d';

export interface ViewContext {
  userRole: UserRole;
  viewMode: ViewMode;
  selectedCorretor?: string;
  timeRange: TimeRange;
  canManageTeam: boolean;
  userId: string;
  contaId: string;
  currentCorretor?: {
    id: string;
    nome: string;
    email: string;
    funcao: UserRole;
    conta_id: string;
    evolution_instance?: string;
    evolution_apikey?: string;
  };
  corretores: Array<{
    id: string;
    nome: string;
    email: string;
    funcao: UserRole;
  }>;
}

export interface ViewContextActions {
  setViewMode: (mode: ViewMode) => void;
  setSelectedCorretor: (corretorId?: string) => void;
  setTimeRange: (range: TimeRange) => void;
  refreshCorretores: () => Promise<void>;
}

const ViewContextInstance = createContext<(ViewContext & ViewContextActions) | null>(null);

export const useViewContext = () => {
  const context = useContext(ViewContextInstance);
  if (!context) {
    throw new Error('useViewContext deve ser usado dentro de ViewContextProvider');
  }
  return context;
};

interface ViewContextProviderProps {
  children: ReactNode;
}

export const ViewContextProvider = ({ children }: ViewContextProviderProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('self');
  const [selectedCorretor, setSelectedCorretor] = useState<string>();
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [userRole, setUserRole] = useState<UserRole>('AGENTE');
  const [userId, setUserId] = useState<string>('');
  const [contaId, setContaId] = useState<string>('');
  const [currentCorretor, setCurrentCorretor] = useState<ViewContext['currentCorretor']>();
  const [corretores, setCorretores] = useState<ViewContext['corretores']>([]);

  const canManageTeam = ['DONO', 'ADMIN'].includes(userRole);

  // Buscar dados do usuário atual
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = supabase.auth.user();
        
        if (!user) {
          log.debug('Usuário não autenticado', 'useViewContext');
          // Limpar dados quando não autenticado
          setUserId('');
          setContaId('');
          setUserRole('AGENTE');
          setCurrentCorretor(undefined);
          setCorretores([]);
          return;
        }

        log.debug('Buscando dados do corretor', 'useViewContext', { email: user.email });

        // Buscar corretor atual (apenas ativos)
        const { data: corretor, error } = await supabase
          .from('corretores')
          .select('id, nome, email, funcao, conta_id')
          .eq('email', user.email)
          .is('deleted_at', null)
          .single();

        if (error) {
          log.error('Erro específico ao buscar corretor', 'useViewContext', error);
          // Se for erro 406 ou similar, tentar abordagem alternativa
          if (error.code === 'PGRST116' || error.message?.includes('406')) {
            log.debug('Tentando busca alternativa para corretor', 'useViewContext');
            const { data: corretorList, error: altError } = await supabase
              .from('corretores')
              .select('id, nome, email, funcao, conta_id')
              .eq('email', user.email)
              .is('deleted_at', null);
            
            if (altError) {
              log.error('Erro na busca alternativa', 'useViewContext', altError);
              return;
            }
            
            if (corretorList && corretorList.length > 0) {
              const corretor = corretorList[0];
              
              // Buscar dados Evolution do usuário
              const { data: userData } = await supabase
                .from('usuarios')
                .select('uazapi_instance_name, uazapi_token, uazapi_status, jid')
                .eq('email', user.email)
                .single();

              setUserId(corretor.id);
              setContaId(corretor.conta_id);
              setUserRole(corretor.funcao as UserRole);
              setCurrentCorretor({
                ...corretor,
                uazapi_instance_name: userData?.uazapi_instance_name,
                uazapi_token: userData?.uazapi_token,
                uazapi_status: userData?.uazapi_status,
                jid: userData?.jid
              });

              if (!['DONO', 'ADMIN'].includes(corretor.funcao)) {
                setViewMode('self');
              }
            }
          }
          return;
        }

        if (corretor) {
          log.info('Corretor encontrado', 'useViewContext', { nome: corretor.nome, funcao: corretor.funcao });
          
          // Buscar dados Evolution do usuário
          const { data: userData } = await supabase
            .from('usuarios')
            .select('uazapi_instance_name, uazapi_token, uazapi_status, jid')
            .eq('email', user.email)
            .single();

          setUserId(corretor.id);
          setContaId(corretor.conta_id);
          setUserRole(corretor.funcao as UserRole);
          setCurrentCorretor({
            ...corretor,
            uazapi_instance_name: userData?.uazapi_instance_name,
            uazapi_token: userData?.uazapi_token,
            uazapi_status: userData?.uazapi_status,
            jid: userData?.jid
          });

          // Se não pode gerenciar equipe, forçar modo 'self'
          if (!['DONO', 'ADMIN'].includes(corretor.funcao)) {
            setViewMode('self');
          }
        } else {
          log.warn('Nenhum corretor encontrado', 'useViewContext', { email: user.email });
        }
      } catch (error) {
        log.error('Erro inesperado ao buscar dados do usuário', 'useViewContext', error);
      }
    };

    fetchUserData();
  }, []);

  // Buscar corretores da conta (apenas para gestores)
  const refreshCorretores = useCallback(async () => {
    if (!canManageTeam || !contaId) return;

    try {
      log.debug('Buscando corretores da conta', 'useViewContext', { contaId });
      const { data, error } = await supabase
        .from('corretores')
        .select('id, nome, email, funcao')
        .eq('conta_id', contaId)
        .is('deleted_at', null)
        .order('nome');

      if (error) {
        log.error('Erro ao buscar corretores', 'useViewContext', error);
        return;
      }

      if (data) {
        log.debug('Corretores encontrados', 'useViewContext', { count: data.length });
        setCorretores(data);
      }
    } catch (error) {
      log.error('Erro inesperado ao buscar corretores', 'useViewContext', error);
    }
  }, [canManageTeam, contaId]);

  // Buscar corretores quando necessário
  useEffect(() => {
    if (canManageTeam && contaId) {
      refreshCorretores();
    }
  }, [canManageTeam, contaId, refreshCorretores]);

  // Ajustar viewMode quando selectedCorretor muda
  useEffect(() => {
    if (selectedCorretor && selectedCorretor !== userId) {
      setViewMode('corretor_specific');
    }
  }, [selectedCorretor, userId]);

  const contextValue: ViewContext & ViewContextActions = {
    userRole,
    viewMode,
    selectedCorretor,
    timeRange,
    canManageTeam,
    userId,
    contaId,
    currentCorretor,
    corretores,
    setViewMode: (mode: ViewMode) => {
      setViewMode(mode);
      if (mode === 'self') {
        setSelectedCorretor(userId);
      } else if (mode === 'team') {
        setSelectedCorretor(undefined);
      }
    },
    setSelectedCorretor,
    setTimeRange,
    refreshCorretores,
  };

  return (
    <ViewContextInstance.Provider value={contextValue}>
      {children}
    </ViewContextInstance.Provider>
  );
};
