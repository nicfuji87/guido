// AI dev note: Página de sucesso de pagamento - callback do Asaas
import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface PaymentSuccessPageProps {}

export const PaymentSuccess: React.FC<PaymentSuccessPageProps> = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Extrair parâmetros da URL
    const urlParams = new URLSearchParams(window.location.search);
    const userParam = urlParams.get('user');
    const sourceParam = urlParams.get('source');

    setUserId(userParam);
    setSource(sourceParam);

    // Log para debug
    // console.log('🎉 Callback de sucesso recebido:', {
    //   userId: userParam,
    //   source: sourceParam,
    //   fullUrl: window.location.href
    // });
  }, []);

  const handleRedirectToDashboard = () => {
    setIsRedirecting(true);
    
    // Redirecionar para o dashboard
    setTimeout(() => {
      window.location.href = '/app';
    }, 1000);
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="text-center p-8 shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          {/* Ícone de Sucesso */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
            className="flex justify-center mb-6"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
          </motion.div>

          {/* Título e Descrição */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              🎉 Pagamento Realizado!
            </h1>
            <p className="text-gray-600 mb-4">
              Sua assinatura foi ativada com sucesso. Agora você tem acesso completo ao Guido!
            </p>
          </motion.div>

          {/* Badges de Status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex justify-center gap-2 mb-6"
          >
            <Badge className="bg-green-100 text-green-800">
              ✅ Pagamento Confirmado
            </Badge>
            {source === 'asaas' && (
              <Badge className="bg-blue-100 text-blue-800">
                🏦 Asaas
              </Badge>
            )}
          </motion.div>

          {/* Informações do Callback */}
          {userId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="p-4 bg-gray-50 rounded-lg mb-6"
            >
              <p className="text-sm text-gray-600">
                <strong>Usuário:</strong> <code className="bg-white px-2 py-1 rounded text-xs">{userId}</code>
              </p>
              {source && (
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Gateway:</strong> {source.toUpperCase()}
                </p>
              )}
            </motion.div>
          )}

          {/* Ações */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="space-y-3"
          >
            <Button
              onClick={handleRedirectToDashboard}
              disabled={isRedirecting}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {isRedirecting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Redirecionando...
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Acessar Guido
                </>
              )}
            </Button>

            <Button
              onClick={handleGoHome}
              variant="outline"
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
          </motion.div>

          {/* Mensagem de Agradecimento */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="mt-6 p-4 bg-blue-50 rounded-lg"
          >
            <p className="text-sm text-blue-800">
              🚀 <strong>Bem-vindo ao Guido!</strong> Sua jornada de vendas inteligentes começa agora.
            </p>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
