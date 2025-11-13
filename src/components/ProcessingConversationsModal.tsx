import React from 'react';
import { X, Loader2, MessageSquare, Clock } from 'lucide-react';

interface ProcessingConversationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// AI dev note: Modal exibido após primeira conexão do WhatsApp
// Informa que conversas estão sendo importadas e processadas
export const ProcessingConversationsModal: React.FC<ProcessingConversationsModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/10">
              <Loader2 className="w-5 h-5 text-green-500 animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-white">
              Processando Conversas
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500/50">
                <MessageSquare className="w-10 h-10 text-green-500" />
              </div>
              <div className="absolute -top-1 -right-1">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="text-center space-y-3">
            <h3 className="text-lg font-semibold text-white">
              WhatsApp Conectado com Sucesso! 🎉
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Estamos importando e processando suas conversas do WhatsApp.
              Este processo pode levar até <span className="font-semibold text-white">10 minutos</span>.
            </p>
          </div>

          {/* Info Box */}
          <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Clock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-blue-300">
                <span className="font-semibold">Você será notificado pelo WhatsApp</span> quando tudo estiver pronto e você puder começar a usar o Guido!
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-center">
            <p className="text-xs text-gray-400">
              Enquanto isso, você pode explorar o painel e conhecer as funcionalidades.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Entendi, Obrigado!
          </button>
        </div>
      </div>
    </div>
  );
};

