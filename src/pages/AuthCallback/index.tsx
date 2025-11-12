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
        
        // Aguardar um pouco para garantir que o Supabase processou o token
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Verificar se há uma sessão ativa
        const user = supabase.auth.user()
        const session = supabase.auth.session()
        
        console.log('[AuthCallback] User:', user ? { id: user.id, email: user.email } : null);
        console.log('[AuthCallback] Session:', session ? 'Existe' : 'Não existe');
        
        if (user) {
          log.info('Usuário autenticado com sucesso após confirmação', 'AuthCallback', { 
            email: user.email,
            confirmed: user.email_confirmed_at 
          })
          
          setStatus('success')
          setMessage('Email confirmado! Redirecionando para o dashboard...')
          
          // Redirecionar para o dashboard após 1.5 segundos
          setTimeout(() => {
            console.log('[AuthCallback] Redirecionando para /app');
            history.push('/app')
          }, 1500)
        } else {
          console.log('[AuthCallback] Sem usuário - verificando hash...');
          // Sem sessão - verificar hash da URL (Supabase v1 pode passar token no hash)
          const hashParams = new URLSearchParams(window.location.hash.substring(1))
          const accessToken = hashParams.get('access_token')
          
          console.log('[AuthCallback] Access token no hash:', accessToken ? 'Sim' : 'Não');
          
          if (accessToken) {
            console.log('[AuthCallback] Token encontrado! Aguardando processamento...');
            log.info('Token encontrado no hash, processando...', 'AuthCallback')
            setMessage('Autenticando...')
            
            // Aguardar o Supabase processar
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // Tentar novamente
            const userAfterWait = supabase.auth.user()
            console.log('[AuthCallback] Usuário após espera:', userAfterWait ? 'Encontrado' : 'Não encontrado');
            
            if (userAfterWait) {
              console.log('[AuthCallback] Usuário autenticado! Redirecionando...');
              setStatus('success')
              setMessage('Email confirmado! Redirecionando...')
              setTimeout(() => {
                history.push('/app')
              }, 1000)
            } else {
              // Se ainda não tem sessão, redirecionar para login
              console.warn('[AuthCallback] Nenhuma sessão após wait - indo para login');
              log.warn('Nenhuma sessão encontrada após callback', 'AuthCallback')
              setStatus('error')
              setMessage('Redirecionando para o login...')
              setTimeout(() => {
                history.push('/login?confirmacao=true')
              }, 2000)
            }
          } else {
            // Sem token e sem sessão - redirecionar para login
            console.warn('[AuthCallback] Sem token no hash - indo para login');
            log.warn('Callback sem token ou sessão', 'AuthCallback')
            setStatus('error')
            setMessage('Redirecionando para o login...')
            setTimeout(() => {
              history.push('/login?confirmacao=true')
            }, 2000)
          }
        }
      } catch (error) {
        log.error('Erro ao processar callback de autenticação', 'AuthCallback', error)
        setStatus('error')
        setMessage('Erro ao processar autenticação. Redirecionando...')
        setTimeout(() => {
          history.push('/login')
        }, 2000)
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

