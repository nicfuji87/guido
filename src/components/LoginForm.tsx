import React, { useState } from 'react';
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

  // Redirecionamento será gerenciado pelo AuthProvider

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage({ type: 'error', text: 'Por favor, insira seu email' });
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setMessage({ type: 'error', text: 'Por favor, insira um email válido' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      console.log('[LOGIN] Iniciando login para:', email.trim().toLowerCase());

      // PASSO 1: Verificar se o corretor existe no sistema
      const { data: corretor, error: corretorError } = await supabase
        .from('corretores')
        .select('id, nome, deleted_at')
        .eq('email', email.trim().toLowerCase())
        .maybeSingle();

      console.log('[LOGIN] Resultado da busca:', { corretor, corretorError });

      // Se houver erro na consulta (diferente de "não encontrado")
      if (corretorError && corretorError.code !== 'PGRST116') {
        console.error('[LOGIN] Erro ao verificar corretor:', corretorError);
        // Continuar mesmo assim - deixar o Supabase Auth tratar
      }

      // Se o corretor não existe ou foi deletado
      if (!corretor || corretor.deleted_at) {
        console.warn('[LOGIN] Corretor não encontrado ou deletado');
        setMessage({
          type: 'error',
          text: 'Email não encontrado. Você precisa criar uma conta primeiro.'
        });
        return;
      }

      console.log('[LOGIN] Corretor encontrado:', corretor.nome);

      // PASSO 2: Enviar magic link (corretor existe e está ativo)
      const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
      console.log('[LOGIN] Enviando magic link para:', email.trim().toLowerCase());
      console.log('[LOGIN] RedirectTo:', `${baseUrl}/app`);

      const { error } = await supabase.auth.signIn({
        email: email.trim().toLowerCase()
      }, {
        redirectTo: `${baseUrl}/app`
      });

      console.log('[LOGIN] Resposta do signIn:', { error });

      if (error) {
        console.error('[LOGIN] Erro ao enviar magic link:', error);
        // Tratar erros específicos do Supabase
        if (error.message.includes('Invalid login credentials') || error.message.includes('User not found')) {
          setMessage({
            type: 'error',
            text: 'Email não encontrado. Você precisa criar uma conta primeiro.'
          });
          return;
        }
        throw error;
      }

      console.log('[LOGIN] Magic link enviado com sucesso!');
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
        text: `Erro ao fazer login: ${errorMessage}`
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
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
          <div className="relative flex items-center justify-center text-sm">
            <div className="flex-grow border-t border-border"></div>
            <span className="bg-background text-muted-foreground px-4">
              Ou
            </span>
            <div className="flex-grow border-t border-border"></div>
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
        <a href="/termos-de-uso" className="underline underline-offset-4 hover:text-primary">
          Termos de Uso
        </a>{" "}
        e{" "}
        <a href="/politica-de-privacidade" className="underline underline-offset-4 hover:text-primary">
          Política de Privacidade
        </a>
        .
      </div>
    </div>
  );
}
