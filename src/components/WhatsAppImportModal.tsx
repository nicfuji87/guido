import React from 'react';
import { CheckCircle, MessageCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui';

interface WhatsAppImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  corretorNome: string;
  whatsappNumero: string;
}

// Modal exibido após primeira conexão do WhatsApp
// Informa que conversas estão sendo processadas e usuário será notificado

export const WhatsAppImportModal: React.FC<WhatsAppImportModalProps> = ({
  isOpen,
  onClose,
  corretorNome: _corretorNome,
  whatsappNumero
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-md w-full border border-green-500/30 overflow-hidden">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            WhatsApp Conectado! 🎉
          </h2>
          <p className="text-green-100 text-sm">
            Sua conta foi vinculada com sucesso
          </p>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-6">
          {/* Informação principal */}
          <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-lg p-5 border border-blue-500/30">
            <div className="flex items-start gap-3 mb-3">
              <MessageCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white font-semibold mb-1">
                  Suas conversas estão sendo processadas
                </h3>
                <p className="text-gray-300 text-sm">
                  Estamos importando suas <strong>últimas 30 conversas</strong> do WhatsApp para o Guido.
                </p>
              </div>
            </div>
          </div>

          {/* Estimativa de tempo */}
          <div className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 rounded-lg p-5 border border-amber-500/30">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white font-semibold mb-1">
                  Te avisaremos quando estiver pronto
                </h3>
                <p className="text-gray-300 text-sm mb-2">
                  Enviaremos uma mensagem no seu WhatsApp <strong className="text-amber-300">{whatsappNumero}</strong> quando todas as conversas estiverem prontas.
                </p>
                <p className="text-amber-200 text-xs">
                  ⏱️ Tempo estimado: 5 a 15 minutos
                </p>
              </div>
            </div>
          </div>

          {/* O que acontece depois */}
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <h4 className="text-white font-semibold text-sm mb-3">
              📋 O que acontece depois:
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-green-400 flex-shrink-0">✓</span>
                <span>Suas conversas aparecerão organizadas na aba "Conversas"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 flex-shrink-0">✓</span>
                <span>O Guido analisará cada conversa e gerará insights</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 flex-shrink-0">✓</span>
                <span>Novas mensagens serão processadas em tempo real</span>
              </li>
            </ul>
          </div>

          {/* Mensagem de tranquilidade */}
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-4">
              Você pode fechar esta janela e continuar usando o Guido normalmente. 
              <span className="text-green-400 font-medium"> Te avisaremos quando tudo estiver pronto!</span>
            </p>
          </div>

          {/* Botão fechar */}
          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3"
          >
            Entendi, pode fechar
          </Button>
        </div>

        {/* Footer */}
        <div className="bg-gray-900/50 px-6 py-3 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center">
            💡 Dica: Enquanto aguarda, explore as outras funcionalidades do Guido!
          </p>
        </div>
      </div>
    </div>
  );
};

