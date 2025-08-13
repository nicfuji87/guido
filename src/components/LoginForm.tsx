import React, { useState, useEffect } from 'react';
import { Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { supabase } from '@/lib/supabaseClient';

interface LoginFormProps {
  className?: string;
  onSuccess?: () => void;
}

export function LoginForm({ className, onSuccess, ...props }: LoginFormProps & React.ComponentProps<"div">) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Escutar mudanças de autenticação (usuário retornando do magic link)
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Usuário logou com sucesso via magic link
        setMessage({ 
          type: 'success', 
          text: 'Login realizado com sucesso! Redirecionando...' 
        });
        
        // Redirecionar para dashboard após pequeno delay
        setTimeout(() => {
          window.location.href = '/app';
        }, 1500);
      }
      
      if (event === 'SIGNED_OUT') {
        setMessage(null);
      }
    });

    return () => {
      authListener?.unsubscribe?.();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage({ type: 'error', text: 'Por favor, insira seu email' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      // Primeiro, verificar se o usuário existe na tabela usuarios
      const { data: existingUser, error: checkError } = await supabase
        .from('usuarios')
        .select('email')
        .eq('email', email.trim())
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        // Erro diferente de "não encontrado"
        throw new Error('Erro ao verificar usuário');
      }

      if (!existingUser) {
        // Usuário não existe - não enviar magic link
        setMessage({ 
          type: 'error', 
          text: 'Email não encontrado. Você precisa criar uma conta primeiro.' 
        });
        return;
      }

      // Usuário existe - enviar magic link
      // Na v1.x, usar signIn para magic link
      const { error } = await supabase.auth.signIn({
        email: email.trim()
      }, {
        redirectTo: `${window.location.origin}/app`
      });

      if (error) {
        throw error;
      }

      setMessage({ 
        type: 'success', 
        text: 'Link de acesso enviado! Verifique seu email.' 
      });
      
      // Call success callback if provided
      onSuccess?.();
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setMessage({ 
        type: 'error', 
        text: errorMessage 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col items-center gap-2">
            <a
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex items-center justify-center rounded-md">
                <img 
                  src="/images/guido/guido%20logo%20dark%20-%20sem%20fundo.png" 
                  alt="Guido" 
                  className="h-10 w-auto max-w-[120px]"
                />
              </div>
              <span className="sr-only">Guido</span>
            </a>
            <h1 className="text-xl font-bold">Bem-vindo ao Guido</h1>
            <div className="text-center text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <a href="/#pricing" className="underline underline-offset-4 text-primary hover:text-primary/80">
                Cadastrar-se
              </a>
            </div>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Status Message */}
            {message && (
              <div className={cn(
                "flex items-center gap-2 p-3 rounded-lg text-sm",
                message.type === 'success' && "bg-green-50 text-green-700 border border-green-200",
                message.type === 'error' && "bg-red-50 text-red-700 border border-red-200"
              )}>
                {message.type === 'success' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                {message.text}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !email.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar link de acesso'
              )}
            </Button>
          </div>

          {/* Separator */}
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Ou
            </span>
          </div>

          {/* Alternative Options */}
          <div className="grid gap-4 sm:grid-cols-1">
            <Button 
              variant="outline" 
              type="button" 
              className="w-full"
              onClick={() => window.location.href = '/'}
            >
              Voltar ao início
            </Button>
          </div>
        </div>
      </form>
      
      {/* Terms */}
      <div className="text-muted-foreground text-center text-xs text-balance">
        Ao continuar, você concorda com nossos{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Termos de Uso
        </a>{" "}
        e{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Política de Privacidade
        </a>
        .
      </div>
    </div>
  );
}
