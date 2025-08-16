import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { log } from '@/utils/logger';

// AI dev note: Hook de autenticação integrado com Supabase
// Gerencia estado de login/logout e redirecionamentos automáticos

interface User {
  id: string;
  email: string;
  name?: string;
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

  useEffect(() => {
    // Verificar sessão inicial (v1.x)
    const checkSession = () => {
      try {
        const authUser = supabase.auth.user();
        
        if (authUser) {
          // VERIFICAR SE EMAIL FOI CONFIRMADO
          if (!authUser.email_confirmed_at) {
            // Usuário não deveria estar logado sem confirmar email
            supabase.auth.signOut();
            return;
          }
          
          setUser({
            id: authUser.id,
            email: authUser.email!,
            name: authUser.user_metadata?.name
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
    const authListener = supabase.auth.onAuthStateChange(
      async (event, session) => {
        log.debug('Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name
          });
          
          // Verificar se é login válido (email confirmado)
          if (event === 'SIGNED_IN') {
            // Só permitir login se email foi confirmado
            if (!session.user.email_confirmed_at) {
              await supabase.auth.signOut();
              return;
            }
            
            // Redirecionar para dashboard apenas se estiver na tela de login
            if (window.location.pathname === '/login') {
              window.location.href = '/app';
            }
          }
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
      if (authListener?.data) {
        // Para Supabase v1.x, o listener retorna um objeto com data, não unsubscribe
        // A função de cleanup é automática no v1.x
      }
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
