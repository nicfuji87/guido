import React, { useState, useEffect, useCallback } from 'react';
import { CreditCard, CheckCircle, AlertTriangle, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { supabase } from '@/lib/supabaseClient';
import { useViewContext } from '@/hooks/useViewContext';

interface AssinaturaInfo {
  id: string;
  plano_nome: string;
  status: string;
  valor_atual: number;
  data_proxima_cobranca: string;
  ciclo_cobranca: string;
  data_fim_trial?: string;
}

export const PlanosSection: React.FC = () => {
  const { currentCorretor } = useViewContext();
  const [assinatura, setAssinatura] = useState<AssinaturaInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarAssinatura = useCallback(async () => {
    if (!currentCorretor?.conta_id) return;

    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('assinaturas')
        .select(`
          id,
          status,
          valor_atual,
          data_proxima_cobranca,
          ciclo_cobranca,
          data_fim_trial,
          planos(nome_plano)
        `)
        .eq('conta_id', currentCorretor.conta_id)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          // Nenhuma assinatura encontrada
          setAssinatura(null);
        } else {
          throw fetchError;
        }
      } else {
        setAssinatura({
          id: data.id,
          plano_nome: data.planos?.nome_plano || 'Plano Básico',
          status: data.status,
          valor_atual: data.valor_atual,
          data_proxima_cobranca: data.data_proxima_cobranca,
          ciclo_cobranca: data.ciclo_cobranca,
          data_fim_trial: data.data_fim_trial
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar informações da assinatura');
    } finally {
      setIsLoading(false);
    }
  }, [currentCorretor?.conta_id]);

  useEffect(() => {
    carregarAssinatura();
  }, [currentCorretor?.conta_id, carregarAssinatura]);

  const getStatusInfo = (status: string) => {
    const statusMap = {
      'TRIAL': { 
        label: 'Período de Teste', 
        color: 'bg-blue-900/20 text-blue-400 border-blue-700/30',
        icon: CheckCircle,
        description: 'Aproveitando o período gratuito'
      },
      'ATIVO': { 
        label: 'Ativo', 
        color: 'bg-green-900/20 text-green-400 border-green-700/30',
        icon: CheckCircle,
        description: 'Assinatura em dia'
      },
      'PAGAMENTO_PENDENTE': { 
        label: 'Pagamento Pendente', 
        color: 'bg-yellow-900/20 text-yellow-400 border-yellow-700/30',
        icon: AlertTriangle,
        description: 'Aguardando pagamento'
      },
      'CANCELADO': { 
        label: 'Cancelado', 
        color: 'bg-red-900/20 text-red-400 border-red-700/30',
        icon: AlertTriangle,
        description: 'Assinatura cancelada'
      }
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.ATIVO;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const planosDisponiveis = [
    {
      nome: 'Guido Individual',
      preco: 97,
      descricao: 'Perfeito para corretores autônomos',
      recursos: [
        'WhatsApp Business integrado',
        'CRM completo',
        'Lembretes inteligentes',
        'Relatórios básicos',
        'Suporte por email'
      ]
    },
    {
      nome: 'Guido Imobiliária',
      preco: 297,
      descricao: 'Para equipes de até 10 corretores',
      recursos: [
        'Tudo do plano Individual',
        'Até 10 corretores',
        'Gestão de equipe',
        'Relatórios avançados',
        'Integrações com CRMs',
        'Suporte prioritário'
      ]
    }
  ];

  if (isLoading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          <Skeleton className="h-8 w-1/3 bg-gray-700 mb-4" />
          <Skeleton className="h-32 w-full bg-gray-700" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Planos & Cobrança</h3>
            <p className="text-sm text-gray-400">Gerencie sua assinatura</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {assinatura ? (
          <div className="space-y-6">
            {/* Informações da assinatura atual */}
            <div className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-white font-medium text-lg">{assinatura.plano_nome}</h4>
                  <p className="text-2xl font-bold text-green-400">
                    {formatCurrency(assinatura.valor_atual)}
                    <span className="text-sm text-gray-400 font-normal">
                      /{assinatura.ciclo_cobranca === 'MONTHLY' ? 'mês' : 'ano'}
                    </span>
                  </p>
                </div>
                
                <div className="text-right">
                  {(() => {
                    const statusInfo = getStatusInfo(assinatura.status);
                    const Icon = statusInfo.icon;
                    return (
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-4 h-4" />
                        <Badge className={`${statusInfo.color} text-xs px-3 py-1`}>
                          {statusInfo.label}
                        </Badge>
                      </div>
                    );
                  })()}
                  <p className="text-sm text-gray-400">{getStatusInfo(assinatura.status).description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {assinatura.data_proxima_cobranca && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-4 h-4" />
                    <span>Próxima cobrança: {formatDate(assinatura.data_proxima_cobranca)}</span>
                  </div>
                )}
                
                {assinatura.data_fim_trial && (
                  <div className="flex items-center gap-2 text-blue-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Trial até: {formatDate(assinatura.data_fim_trial)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Ações */}
            <div className="flex gap-4">
              <Button
                size="sm"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                onClick={() => alert('Histórico de faturas será implementado em breve!')}
              >
                Ver Fatura
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-red-600 text-red-400 hover:bg-red-900/20"
                onClick={() => alert('Cancelamento será implementado em breve!')}
              >
                Cancelar Assinatura
              </Button>
            </div>
          </div>
        ) : (
          /* Sem assinatura - mostrar planos disponíveis */
          <div className="space-y-6">
            <div className="text-center py-8">
              <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h4 className="text-white font-medium mb-2">Nenhuma assinatura ativa</h4>
              <p className="text-gray-400">Escolha um plano para começar</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {planosDisponiveis.map((plano) => (
                <div
                  key={plano.nome}
                  className="p-6 bg-gray-900/50 border border-gray-700 rounded-lg hover:border-blue-500/50 transition-colors"
                >
                  <div className="text-center mb-4">
                    <h4 className="text-white font-medium text-lg mb-2">{plano.nome}</h4>
                    <p className="text-3xl font-bold text-green-400">
                      {formatCurrency(plano.preco)}
                      <span className="text-sm text-gray-400 font-normal">/mês</span>
                    </p>
                    <p className="text-sm text-gray-400 mt-2">{plano.descricao}</p>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {plano.recursos.map((recurso, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        {recurso}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => alert('Contratação será implementada em breve!')}
                  >
                    Contratar Plano
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Informações adicionais */}
        <div className="mt-6 p-4 bg-emerald-900/10 border border-emerald-700/30 rounded-lg">
          <h4 className="text-emerald-400 font-medium mb-2">💳 Informações de Cobrança</h4>
          <ul className="text-sm text-emerald-300 space-y-1">
            <li>• Cobrança automática via cartão de crédito ou PIX</li>
            <li>• Cancele a qualquer momento sem multas</li>
            <li>• Período de teste gratuito de 7 dias</li>
            <li>• Suporte técnico incluído em todos os planos</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
