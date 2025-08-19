import React, { useState } from 'react';
import { X, AlertTriangle, Calendar, CreditCard } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { useCancelarAssinatura } from '@/hooks/useCancelarAssinatura';

// AI dev note: Modal de confirmação para cancelamento de assinatura
// Inclui texto explicativo sobre continuidade até o fim do ciclo pago

interface CancelarAssinaturaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  assinatura: {
    id: string;
    plano_nome: string;
    valor_atual: number;
    data_proxima_cobranca?: string;
    id_assinatura_asaas?: string;
  };
  userId: string;
}

export const CancelarAssinaturaModal: React.FC<CancelarAssinaturaModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  assinatura,
  userId
}) => {
  const [motivoSelecionado, setMotivoSelecionado] = useState('');
  const [motivoPersonalizado, setMotivoPersonalizado] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const { isLoading, error, solicitarCancelamento } = useCancelarAssinatura();

  // Motivos pré-definidos
  const motivosDisponiveis = [
    'Preço muito alto',
    'Não estou usando o suficiente',
    'Problemas técnicos/bugs',
    'Falta de funcionalidades que preciso',
    'Encontrei uma alternativa melhor',
    'Questões financeiras/orçamento',
    'Difícil de usar',
    'Suporte insatisfatório',
    'Outros'
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Não informado';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setMotivoSelecionado('');
    setMotivoPersonalizado('');
    setLocalError(null);
    onClose();
  };

  const handleConfirmCancel = async () => {
    // Validação final antes de enviar
    if (!motivoSelecionado) {
      setLocalError('Por favor, selecione um motivo para o cancelamento.');
      return;
    }

    if (motivoSelecionado === 'Outros' && !motivoPersonalizado.trim()) {
      setLocalError('Por favor, descreva o motivo do cancelamento.');
      return;
    }

    // Determinar o motivo final a ser enviado
    let motivoFinal = '';
    if (motivoSelecionado === 'Outros') {
      motivoFinal = motivoPersonalizado.trim();
    } else {
      motivoFinal = motivoSelecionado;
    }

    const success = await solicitarCancelamento({
      assinaturaId: assinatura.id,
      idAssinaturaAsaas: assinatura.id_assinatura_asaas,
      userId,
      motivo: motivoFinal
    });

    if (success) {
      setShowConfirmation(false);
      setMotivoSelecionado('');
      setMotivoPersonalizado('');
      onSuccess();
      onClose();
    }
  };

  const renderFirstStep = () => (
    <>
      <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            Cancelar Assinatura
          </h3>
          <p className="text-sm text-gray-400 mt-0.5">
            {assinatura.plano_nome}
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="border-gray-600 text-gray-400 hover:bg-gray-700"
          onClick={handleCancel}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        {/* Informações da Assinatura */}
        <div className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
          <h4 className="text-white font-medium mb-2 flex items-center gap-2 text-sm">
            <CreditCard className="w-4 h-4" />
            Informações da Assinatura
          </h4>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-400 text-xs">Plano</p>
              <p className="text-white font-medium">{assinatura.plano_nome}</p>
            </div>
            
            <div>
              <p className="text-gray-400 text-xs">Valor Mensal</p>
              <p className="text-white font-medium">{formatCurrency(assinatura.valor_atual)}</p>
            </div>
            
            {assinatura.data_proxima_cobranca && (
              <div className="col-span-2">
                <p className="text-gray-400 flex items-center gap-1 text-xs">
                  <Calendar className="w-3 h-3" />
                  Próxima Cobrança: <span className="text-white font-medium">{formatDate(assinatura.data_proxima_cobranca)}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Aviso Importante */}
        <div className="p-3 bg-blue-900/10 border border-blue-700/30 rounded-lg">
          <h4 className="text-blue-400 font-medium mb-2 flex items-center gap-2 text-sm">
            <AlertTriangle className="w-4 h-4" />
            Importante
          </h4>
          <ul className="text-xs text-blue-300 space-y-1">
            <li>• Acesso continua até o fim do período pago</li>
            <li>• Sem novas cobranças após o cancelamento</li>
            <li>• Pode reativar a qualquer momento</li>
            <li>• Todos os dados serão preservados</li>
          </ul>
        </div>

        {/* Motivos de Cancelamento */}
        <div className="space-y-2">
          <Label className="text-gray-300 text-sm">
            Motivo do cancelamento <span className="text-red-400">*</span>
          </Label>
          <p className="text-xs text-gray-400 mb-2">
            Selecione o principal motivo (obrigatório):
          </p>
          
          <div className="space-y-1">
            {motivosDisponiveis.map((motivo) => (
              <label
                key={motivo}
                className="flex items-center gap-2 p-2 bg-gray-800/50 border border-gray-700 rounded hover:bg-gray-800/70 cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name="motivo-cancelamento"
                  value={motivo}
                  checked={motivoSelecionado === motivo}
                  onChange={(e) => setMotivoSelecionado(e.target.value)}
                  className="w-3 h-3 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:ring-1"
                />
                <span className="text-gray-300 text-xs">{motivo}</span>
              </label>
            ))}
          </div>

          {/* Campo de texto quando "Outros" é selecionado */}
          {motivoSelecionado === 'Outros' && (
            <div className="mt-2 space-y-1">
              <Label htmlFor="motivo-personalizado" className="text-gray-300 text-xs">
                Descreva o motivo <span className="text-red-400">*</span>
              </Label>
              <Textarea
                id="motivo-personalizado"
                placeholder="Conte-nos mais detalhes..."
                value={motivoPersonalizado}
                onChange={(e) => setMotivoPersonalizado(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 min-h-[60px] resize-none text-sm"
                maxLength={300}
                required
              />
              <p className="text-xs text-gray-500">
                {motivoPersonalizado.length}/300 caracteres
              </p>
            </div>
          )}
        </div>

        {/* Validação de motivo obrigatório */}
        {(!motivoSelecionado || (motivoSelecionado === 'Outros' && !motivoPersonalizado.trim())) && (
          <div className="p-3 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
            <p className="text-yellow-400 text-sm">
              ⚠️ Por favor, selecione um motivo para continuar
              {motivoSelecionado === 'Outros' && !motivoPersonalizado.trim() && ' e descreva os detalhes'}
            </p>
          </div>
        )}

        {(error || localError) && (
          <div className="p-3 bg-red-900/20 border border-red-700/30 rounded-lg">
            <p className="text-red-400 text-sm">{error || localError}</p>
          </div>
        )}
      </div>

      <div className="px-4 py-3 bg-gray-800/50 border-t border-gray-700 flex-shrink-0">
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Manter Assinatura
          </Button>
          <Button
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={() => {
              // Validar se motivo foi selecionado
              if (!motivoSelecionado) {
                return; // Não prossegue se não tiver motivo
              }
              
              // Se selecionou "Outros", validar se preencheu o campo
              if (motivoSelecionado === 'Outros' && !motivoPersonalizado.trim()) {
                return; // Não prossegue se "Outros" sem descrição
              }
              
              setShowConfirmation(true);
            }}
            disabled={isLoading || !motivoSelecionado || (motivoSelecionado === 'Outros' && !motivoPersonalizado.trim())}
          >
            Continuar Cancelamento
          </Button>
        </div>
      </div>
    </>
  );

  const renderConfirmationStep = () => (
    <>
      <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Confirmar Cancelamento
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Esta ação não pode ser desfeita
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          className="border-gray-600 text-gray-400 hover:bg-gray-700"
          onClick={() => setShowConfirmation(false)}
          disabled={isLoading}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 mx-auto bg-red-900/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          
          <div>
            <h4 className="text-base font-semibold text-white mb-1">
              Tem certeza que deseja cancelar?
            </h4>
            <p className="text-gray-300 text-sm">
              Cancelando sua assinatura do <strong>{assinatura.plano_nome}</strong>.
            </p>
          </div>

          <div className="p-3 bg-gray-800/50 border border-gray-700 rounded text-left">
            <h5 className="text-white font-medium mb-2 text-sm">O que acontecerá:</h5>
            <ul className="text-xs text-gray-300 space-y-0.5">
              <li>✓ Acesso até {formatDate(assinatura.data_proxima_cobranca)}</li>
              <li>✓ Sem cobrança de {formatCurrency(assinatura.valor_atual)}</li>
              <li>✓ Dados preservados</li>
              <li>✓ Reativação disponível</li>
            </ul>
          </div>

          {/* Mostrar o motivo selecionado - sempre mostra pois é obrigatório */}
          <div className="p-2 bg-blue-900/10 border border-blue-700/30 rounded text-left">
            <h5 className="text-blue-400 font-medium mb-1 text-xs">Motivo selecionado:</h5>
            <p className="text-blue-300 text-xs">
              {motivoSelecionado === 'Outros' 
                ? motivoPersonalizado.trim() || 'Outros (aguardando descrição)' 
                : motivoSelecionado || 'Nenhum motivo selecionado'
              }
            </p>
          </div>

          {(error || localError) && (
            <div className="p-3 bg-red-900/20 border border-red-700/30 rounded-lg">
              <p className="text-red-400 text-sm">{error || localError}</p>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 py-3 bg-gray-800/50 border-t border-gray-700 flex-shrink-0">
        <div className="flex justify-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
            onClick={() => setShowConfirmation(false)}
            disabled={isLoading}
          >
            Voltar
          </Button>
          <Button
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={handleConfirmCancel}
            disabled={isLoading}
          >
            {isLoading ? 'Cancelando...' : 'Confirmar Cancelamento'}
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && !isLoading) handleCancel();
    }}>
      <DialogContent className="max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        {showConfirmation ? renderConfirmationStep() : renderFirstStep()}
      </DialogContent>
    </Dialog>
  );
};
