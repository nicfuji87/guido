import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { log } from '@/utils/logger';


// AI dev note: Hook de autenticação integrado com Supabase
// Gerencia estado de login/logout e redirecionamentos automáticos

interface User {
  id: string;
  email: string;
  name?: string;
  corretorId?: string; // ID do corretor na tabela corretores
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // AI dev note: Função para verificar se o corretor está ativo (não soft-deleted)
  const checkCorretorStatus = async (authUserId: string, email: string): Promise<{ isValid: boolean; corretorId?: string; name?: string }> => {
    try {
      // Buscar corretor associado ao email (único)
      const { data: corretor, error } = await supabase
        .from('corretores')
        .select('id, nome, deleted_at')
        .eq('email', email.toLowerCase())
        .single();

      if (error) {
        log.warn('Corretor não encontrado para o email', 'useAuth', { email, error });
        return { isValid: false };
      }

      // Verificar se o corretor foi soft-deleted
      if (corretor.deleted_at) {
        log.warn('Corretor soft-deleted tentando acessar', 'useAuth', { 
          corretorId: corretor.id, 
          deletedAt: corretor.deleted_at 
        });
        return { isValid: false };
      }

      log.debug('Corretor válido encontrado', 'useAuth', { corretorId: corretor.id });
      return { 
        isValid: true, 
        corretorId: corretor.id,
        name: corretor.nome
      };
    } catch (error) {
      log.error('Erro ao verificar status do corretor', 'useAuth', { error });
      return { isValid: false };
    }
  };

  useEffect(() => {
    // Verificar sessão inicial (v1.x)
    const checkSession = async () => {
      try {
        const authUser = supabase.auth.user();
        
        if (authUser) {
          // VERIFICAR SE EMAIL FOI CONFIRMADO
          if (!authUser.email_confirmed_at) {
            // Usuário não deveria estar logado sem confirmar email
            supabase.auth.signOut();
            return;
          }

          // AI dev note: Verificar se o corretor está ativo (não soft-deleted)
          const corretorStatus = await checkCorretorStatus(authUser.id, authUser.email!);
          
          if (!corretorStatus.isValid) {
            // Corretor foi soft-deleted ou não encontrado - forçar logout
            log.warn('Acesso negado: corretor não ativo', 'useAuth', { email: authUser.email });
            await supabase.auth.signOut();
            return;
          }
          
          setUser({
            id: authUser.id,
            email: authUser.email!,
            name: corretorStatus.name || authUser.user_metadata?.name,
            corretorId: corretorStatus.corretorId
          });
        }
      } catch (error) {
        log.error('Erro ao verificar sessão', 'useAuth', { error });
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listener para mudanças de autenticação (v1.x)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        log.debug('Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          // Verificar se é login válido (email confirmado)
          if (event === 'SIGNED_IN') {
            // Só permitir login se email foi confirmado
            if (!session.user.email_confirmed_at) {
              await supabase.auth.signOut();
              return;
            }

            // AI dev note: Verificar se o corretor está ativo (não soft-deleted)
            const corretorStatus = await checkCorretorStatus(session.user.id, session.user.email!);
            
            if (!corretorStatus.isValid) {
              // Corretor foi soft-deleted ou não encontrado - forçar logout
              log.warn('Login negado: corretor não ativo', 'useAuth', { 
                email: session.user.email,
                event 
              });
              await supabase.auth.signOut();
              return;
            }
            
            // Redirecionar para dashboard apenas se estiver na tela de login
            if (window.location.pathname === '/login') {
              window.location.href = '/app';
            }
          }

          // Para outros eventos (TOKEN_REFRESHED, etc), também verificar corretor
          if (event !== 'SIGNED_IN') {
            const corretorStatus = await checkCorretorStatus(session.user.id, session.user.email!);
            if (!corretorStatus.isValid) {
              log.warn('Sessão invalidada: corretor não ativo', 'useAuth', { 
                email: session.user.email,
                event 
              });
              await supabase.auth.signOut();
              return;
            }
          }

          // Apenas definir user se passou em todas as verificações
          const corretorInfo = await checkCorretorStatus(session.user.id, session.user.email!);
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: corretorInfo.name || session.user.user_metadata?.name,
            corretorId: corretorInfo.corretorId
          });
        } else {
          setUser(null);
          
          // Se o usuário fez logout, redirecionar para home
          if (event === 'SIGNED_OUT') {
            window.location.href = '/';
          }
        }
        
        setIsLoading(false);
      }
    );

    // Cleanup subscription (v1.x)
    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      log.error('Erro ao fazer logout', 'useAuth', { error });
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
