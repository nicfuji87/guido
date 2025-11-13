import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { CheckCircle, Smartphone, MessageSquare, Zap, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui';
import { supabase } from '@/lib/supabaseClient';
import { useViewContext } from '@/hooks/useViewContext';
import { log } from '@/utils/logger';
import { cn } from '@/lib/utils';

// AI dev note: Modal de boas-vindas que aparece apenas no primeiro acesso
// Educa o usuário sobre o fluxo e a importância de conectar o WhatsApp
// Não é bloqueante - usuário pode dispensar e explorar o sistema

interface OnboardingModalProps {
  onClose?: () => void;
}

export const OnboardingModal = ({ onClose }: OnboardingModalProps) => {
  const history = useHistory();
  const { currentCorretor } = useViewContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkIfShouldShow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCorretor]);

  const checkIfShouldShow = async () => {
    try {
      setIsLoading(true);

      // Não mostrar se não tem corretor logado
      if (!currentCorretor) {
        setIsOpen(false);
        return;
      }

      // Verificar no banco se é primeiro acesso
      const user = supabase.auth.user();
      if (!user) {
        setIsOpen(false);
        return;
      }

      const { data: userData, error } = await supabase
        .from('usuarios')
        .select('primeiro_acesso, uazapi_status, jid')
        .eq('auth_user_id', user.id)
        .single();

      if (error) {
        log.error('Erro ao verificar primeiro acesso', 'ONBOARDING', { error });
        setIsOpen(false);
        return;
      }

      // AI dev note: Lógica corrigida do onboarding
      // primeiro_acesso: false = ainda não conectou (mostrar modal)
      // primeiro_acesso: true = já conectou (não mostrar mais)
      // uazapi_status: 'connected' = WhatsApp conectado
      
      // Mostrar modal APENAS se:
      // - primeiro_acesso === false (ainda não conectou)
      // - E status não é 'connected' (ainda não está conectado)
      const jaConectou = userData.primeiro_acesso === true || userData.uazapi_status === 'connected';
      const shouldShow = !jaConectou;
      
      log.info('Verificação de onboarding', 'ONBOARDING', { 
        shouldShow, 
        primeiro_acesso: userData.primeiro_acesso,
        uazapi_status: userData.uazapi_status,
        jid: !!userData.jid,
        jaConectou
      });

      setIsOpen(shouldShow);

    } catch (error) {
      log.error('Erro no checkIfShouldShow', 'ONBOARDING', { error });
      setIsOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = async () => {
    try {
      // AI dev note: Ao dispensar, NÃO altera primeiro_acesso
      // primeiro_acesso só muda para true quando WhatsApp conecta
      // Assim o modal aparecerá novamente se não conectar
      
      setIsOpen(false);
      onClose?.();
    } catch (error) {
      log.error('Erro ao fechar onboarding', 'ONBOARDING', { error });
      setIsOpen(false);
      onClose?.();
    }
  };

  const handleConnectNow = async () => {
    await handleDismiss();
    history.push('/integrations');
  };

  // Não renderizar nada enquanto está carregando ou se não deve mostrar
  if (isLoading || !isOpen) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-300"
        onClick={handleDismiss}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl max-w-2xl w-full pointer-events-auto animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header com botão fechar */}
          <div className="relative p-6 pb-0">
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 pt-2 space-y-6">
            {/* Icon + Title */}
            <div className="text-center space-y-3">
              <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-900/50">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Bem-vindo ao Guido! 🎉
                </h2>
                <p className="text-gray-400 text-lg">
                  Você tem <strong className="text-green-400 font-semibold">7 dias grátis</strong> para testar todas as funcionalidades
                </p>
              </div>
            </div>

            {/* Steps */}
            <div className="bg-gray-800/50 rounded-xl p-6 space-y-4 border border-gray-700/50">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Como começar:
              </h3>
              
              {/* Step 1 - Conectar WhatsApp (destacado) */}
              <div className="flex items-start gap-4 p-4 rounded-lg bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-700/30">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-900/50">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Smartphone className="w-4 h-4 text-green-400" />
                    <p className="font-semibold text-white">Conecte seu WhatsApp</p>
                  </div>
                  <p className="text-sm text-gray-300">
                    Escaneie o QR Code em segundos e comece a usar
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4 p-3 rounded-lg">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-300 font-bold text-lg">2</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    <p className="font-medium text-gray-200">Suas conversas serão analisadas</p>
                  </div>
                  <p className="text-sm text-gray-400">
                    Nossa IA identifica automaticamente leads e oportunidades
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4 p-3 rounded-lg">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-300 font-bold text-lg">3</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-4 h-4 text-gray-400" />
                    <p className="font-medium text-gray-200">Receba insights automáticos</p>
                  </div>
                  <p className="text-sm text-gray-400">
                    Lembretes inteligentes, follow-ups e análises detalhadas
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleDismiss}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                Explorar Depois
              </Button>
              <Button
                onClick={handleConnectNow}
                className={cn(
                  "flex-1 font-semibold shadow-lg",
                  "bg-gradient-to-r from-green-600 to-emerald-600",
                  "hover:from-green-700 hover:to-emerald-700",
                  "text-white"
                )}
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Conectar WhatsApp
              </Button>
            </div>

            {/* Footer Note */}
            <p className="text-center text-xs text-gray-500">
              Você pode conectar seu WhatsApp a qualquer momento em <strong className="text-gray-400">Integrações</strong>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

