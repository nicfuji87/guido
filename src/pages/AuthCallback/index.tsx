import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { log } from '@/utils/logger'

export default function AuthCallback() {
  const history = useHistory()
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing')
  const [message, setMessage] = useState('Confirmando seu email...')

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('[AuthCallback] Iniciando processamento');
        console.log('[AuthCallback] URL completa:', window.location.href);
        console.log('[AuthCallback] Hash:', window.location.hash);
        console.log('[AuthCallback] Search:', window.location.search);
        
        log.info('Processando callback de autenticação', 'AuthCallback')
        
        // AI dev note: Verificar PRIMEIRO se há token no hash (confirmação de email)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const type = hashParams.get('type')
        
        console.log('[AuthCallback] Token no hash:', accessToken ? 'Sim' : 'Não');
        console.log('[AuthCallback] Type:', type);
        
        if (accessToken && type === 'signup') {
          // É confirmação de email do signup - Supabase v1 já processa automaticamente
          console.log('[AuthCallback] Confirmação de email detectada! Aguardando processamento...');
          log.info('Confirmação de email via signup - aguardando processamento', 'AuthCallback')
          setMessage('Confirmando email e autenticando...')
          
          // Aguardar o Supabase processar o token (v1 faz isso automaticamente)
          await new Promise(resolve => setTimeout(resolve, 1500))
          
          // Verificar sessão
          const user = supabase.auth.user()
          const session = supabase.auth.session()
          
          console.log('[AuthCallback] Após processamento - User:', user ? { id: user.id, email: user.email, confirmed: user.email_confirmed_at } : null);
          console.log('[AuthCallback] Após processamento - Session:', session ? 'Existe' : 'Não existe');
          
          if (user && session) {
            console.log('[AuthCallback] ✅ Usuário autenticado! Redirecionando para dashboard...');
            log.info('Email confirmado e sessão estabelecida com sucesso', 'AuthCallback', {
              email: user.email,
              confirmed: user.email_confirmed_at
            })
            
            setStatus('success')
            setMessage('Email confirmado! Entrando no Guido...')
            
            // Redirecionar para o dashboard
            setTimeout(() => {
              console.log('[AuthCallback] Redirecionando para /app');
              history.push('/app')
            }, 1000)
          } else {
            // Token presente mas sem sessão - pode ser erro temporário
            console.warn('[AuthCallback] Token presente mas sem sessão - tentando novamente...');
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            const retryUser = supabase.auth.user()
            if (retryUser) {
              console.log('[AuthCallback] ✅ Sessão estabelecida na retry!');
              setStatus('success')
              setMessage('Email confirmado! Entrando no Guido...')
              setTimeout(() => history.push('/app'), 1000)
            } else {
              console.error('[AuthCallback] Falha ao estabelecer sessão');
              log.error('Falha ao estabelecer sessão após confirmação', 'AuthCallback')
              setStatus('error')
              setMessage('Erro ao processar confirmação. Por favor, faça login.')
              setTimeout(() => history.push('/login?confirmacao=erro'), 2000)
            }
          }
        } else if (accessToken && type === 'recovery') {
          // Recovery de senha (magic link para resetar senha)
          console.log('[AuthCallback] Recovery detectado');
          log.info('Recovery de senha detectado', 'AuthCallback')
          setStatus('success')
          setMessage('Autenticando...')
          setTimeout(() => history.push('/app'), 1000)
        } else {
          // Verificar se já tem sessão ativa (usuário já autenticado)
          const user = supabase.auth.user()
          const session = supabase.auth.session()
          
          console.log('[AuthCallback] Sem token especial - User:', user ? 'Sim' : 'Não');
          console.log('[AuthCallback] Sem token especial - Session:', session ? 'Sim' : 'Não');
          
          if (user && session) {
            console.log('[AuthCallback] Sessão ativa detectada - redirecionando');
            log.info('Sessão ativa detectada', 'AuthCallback', { email: user.email })
            setStatus('success')
            setMessage('Redirecionando...')
            setTimeout(() => history.push('/app'), 500)
          } else {
            // Sem token e sem sessão - ir para login
            console.warn('[AuthCallback] Sem token e sem sessão - indo para login');
            log.warn('Callback sem token ou sessão', 'AuthCallback')
            setStatus('error')
            setMessage('Redirecionando para o login...')
            setTimeout(() => history.push('/login'), 1500)
          }
        }
      } catch (error) {
        log.error('Erro ao processar callback de autenticação', 'AuthCallback', error)
        console.error('[AuthCallback] Erro:', error);
        setStatus('error')
        setMessage('Erro ao processar autenticação. Redirecionando...')
        setTimeout(() => history.push('/login'), 2000)
      }
    }

    handleCallback()
  }, [history])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-md w-full p-8">
        <div className="bg-card rounded-2xl shadow-2xl p-8 border border-border/50">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            {status === 'processing' && (
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            )}
            {status === 'success' && (
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            )}
            {status === 'error' && (
              <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-yellow-500" />
              </div>
            )}
          </div>

          {/* Message */}
          <h2 className="text-xl font-bold text-center text-foreground mb-2">
            {status === 'processing' && 'Processando...'}
            {status === 'success' && 'Bem-vindo ao Guido! 🎉'}
            {status === 'error' && 'Aguarde...'}
          </h2>
          
          <p className="text-center text-muted-foreground">
            {message}
          </p>

          {/* Loading indicator */}
          {status === 'processing' && (
            <div className="mt-6 flex justify-center">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

