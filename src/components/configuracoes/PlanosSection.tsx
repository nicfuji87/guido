import React, { useState, useEffect, useCallback } from 'react';
import { CreditCard, CheckCircle, AlertTriangle, Calendar, Clock, Zap, Shield, Star, ArrowRight, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { supabase } from '@/lib/supabaseClient';
import { useViewContext } from '@/hooks/useViewContext';
// AI dev note: UpgradeSubscriptionForm removido - agora usa modal simplificado de cadastro
import { CustomerRegistrationModal } from '@/components/CustomerRegistrationModal';
import { useAssinatura, type Plano } from '@/hooks/useAssinatura';
import { useCustomerProvisioning } from '@/hooks/useCustomerProvisioning';

interface AssinaturaInfo {
  id: string;
  plano_nome: string;
  status: string;
  valor_atual: number;
  data_proxima_cobranca: string;
  ciclo_cobranca: string;
  data_fim_trial?: string;
  tentativas_cobranca?: number;
  id_assinatura_asaas?: string;
  id_customer_asaas?: string;
}

interface PlanoDisponivel {
  id: number;
  nome: string;
  codigo_externo: string;
  preco: number;
  descricao: string;
  tipo: 'INDIVIDUAL' | 'IMOBILIARIA';
  recursos: string[];
  destaque?: boolean;
}

// AI dev note: Tipo union para lidar com diferentes formatos de plano  
type PlanoUnion = PlanoDisponivel | Plano | {
  id?: number;
  nome_plano: string;
  preco_mensal: number;
  tipo_plano?: string;
  nome?: string;
  preco?: number;
  tipo?: string;
  [key: string]: unknown; // Index signature para compatibilidade
};

// AI dev note: Tipo para planos no formato de upgrade/modal
interface PlanoUpgrade {
  id: number;
  nome_plano: string;
  preco_mensal: number;
  preco_anual: number | null;
  limite_corretores: number;
  tipo_plano: string;
  recursos: Record<string, unknown>; // Objeto flexível com chaves conhecidas
  is_ativo: boolean;
}

export const PlanosSection: React.FC = () => {
  const { currentCorretor } = useViewContext();
  const { planos } = useAssinatura();
  // AI dev note: refetchAssinatura removido - não usado mais
  const { isLoading: isProvisioning } = useCustomerProvisioning();
  // AI dev note: provisionCustomer removido - usado via modal separado agora
  const [assinatura, setAssinatura] = useState<AssinaturaInfo | null>(null);
  const [planosDisponiveis, setPlanosDisponiveis] = useState<PlanoDisponivel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanoDisponivel | PlanoUpgrade | null>(null);
  // AI dev note: showProvisioningStep removido - não usado na nova abordagem
  const [showCustomerRegistrationModal, setShowCustomerRegistrationModal] = useState(false);

  const carregarDados = useCallback(async () => {
    // // console.log('🔥 DEBUG - =================== INÍCIO CARREGAMENTO DADOS ===================');
    // // console.log('🔥 DEBUG - Iniciando carregamento de dados da seção Planos');
    
    if (!currentCorretor?.conta_id) {
      // console.log('🔥 DEBUG - AVISO: Corretor ou conta_id não disponível');
      // console.log('🔥 DEBUG - CurrentCorretor:', {
      //   existe: !!currentCorretor,
      //   contaId: currentCorretor?.conta_id,
      //   nome: currentCorretor?.nome
      // });
      return;
    }

    // console.log('🔥 DEBUG - ✅ Corretor validado:', {
    //   contaId: currentCorretor.conta_id,
    //   corretorId: currentCorretor.id,
    //   nome: currentCorretor.nome
    // });

    try {
      // console.log('🔥 DEBUG - Limpando erros anteriores');
      setError(null);
      
      // Carregar assinatura atual
      const { data: assinaturaData, error: assinaturaError } = await supabase
        .from('assinaturas')
        .select(`
          id,
          status,
          valor_atual,
          data_proxima_cobranca,
          ciclo_cobranca,
          data_fim_trial,
          tentativas_cobranca,
          id_assinatura_asaas,
          id_customer_asaas,
          planos(nome_plano)
        `)
        .eq('conta_id', currentCorretor.conta_id)
        .single();

      if (assinaturaError && assinaturaError.code !== 'PGRST116') {
        throw assinaturaError;
      }

      if (assinaturaData) {
        setAssinatura({
          id: assinaturaData.id,
          plano_nome: assinaturaData.planos?.nome_plano || 'Plano Básico',
          status: assinaturaData.status,
          valor_atual: assinaturaData.valor_atual,
          data_proxima_cobranca: assinaturaData.data_proxima_cobranca,
          ciclo_cobranca: assinaturaData.ciclo_cobranca,
          data_fim_trial: assinaturaData.data_fim_trial,
          tentativas_cobranca: assinaturaData.tentativas_cobranca,
          id_assinatura_asaas: assinaturaData.id_assinatura_asaas,
          id_customer_asaas: assinaturaData.id_customer_asaas
        });
      }

      // Carregar planos disponíveis
      const { data: planosData, error: planosError } = await supabase
        .from('planos')
        .select('*')
        .eq('is_ativo', true)
        .order('preco_mensal', { ascending: true });

      if (planosError) throw planosError;

      const planosFormatados = planosData.map(plano => ({
        id: plano.id,
        nome: plano.nome_plano,
        codigo_externo: plano.codigo_externo,
        preco: parseFloat(plano.preco_mensal),
        descricao: plano.descricao || '',
        tipo: plano.tipo_plano as 'INDIVIDUAL' | 'IMOBILIARIA',
        recursos: Object.keys(plano.recursos || {}),
        destaque: plano.codigo_externo === 'individual' || plano.codigo_externo === 'imobiliaria_basica'
      }));

      setPlanosDisponiveis(planosFormatados);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar informações');
    } finally {
      setIsLoading(false);
    }
  }, [currentCorretor]);

  useEffect(() => {
    carregarDados();
  }, [currentCorretor?.conta_id, carregarDados]);

  const getStatusInfo = (status: string, assinatura?: AssinaturaInfo | null) => {
    const isTrialExpired = assinatura?.data_fim_trial && new Date(assinatura.data_fim_trial) < new Date();
    const isOverdue = assinatura?.data_proxima_cobranca && new Date(assinatura.data_proxima_cobranca) < new Date();
    
    const statusMap = {
      'TRIAL': { 
        label: isTrialExpired ? 'Trial Expirado' : 'Período de Teste', 
        color: isTrialExpired ? 'bg-red-900/20 text-red-400 border-red-700/30' : 'bg-blue-900/20 text-blue-400 border-blue-700/30',
        icon: isTrialExpired ? AlertTriangle : Clock,
        description: isTrialExpired ? 'Period de teste vencido - Ative sua assinatura!' : 'Aproveitando o período gratuito',
        action: isTrialExpired ? 'ACTIVATE' : 'INFO'
      },
      'ATIVO': { 
        label: 'Ativo', 
        color: 'bg-green-900/20 text-green-400 border-green-700/30',
        icon: CheckCircle,
        description: 'Assinatura em dia e funcionando',
        action: 'INFO'
      },
      'PAGAMENTO_PENDENTE': { 
        label: 'Pagamento Atrasado', 
        color: 'bg-red-900/20 text-red-400 border-red-700/30',
        icon: AlertTriangle,
        description: `${isOverdue ? 'Pagamento em atraso desde ' + formatDate(assinatura?.data_proxima_cobranca || '') : 'Aguardando pagamento'}`,
        action: 'REGULARIZE'
      },
      'CANCELADO': { 
        label: 'Cancelado', 
        color: 'bg-red-900/20 text-red-400 border-red-700/30',
        icon: AlertTriangle,
        description: 'Assinatura foi cancelada',
        action: 'REACTIVATE'
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

  const getDiasRestantesTrialOuVencimento = (assinatura: AssinaturaInfo) => {
    if (assinatura.status === 'TRIAL' && assinatura.data_fim_trial) {
      const hoje = new Date();
      const fimTrial = new Date(assinatura.data_fim_trial);
      const diffTime = fimTrial.getTime() - hoje.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { tipo: 'trial', dias: Math.max(0, diffDays) };
    }
    
    if (assinatura.data_proxima_cobranca) {
      const hoje = new Date();
      const proximaCobranca = new Date(assinatura.data_proxima_cobranca);
      const diffTime = proximaCobranca.getTime() - hoje.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { tipo: 'cobranca', dias: diffDays };
    }
    
    return null;
  };

  const verificarEProvisionarCliente = async (): Promise<boolean> => {
    // console.log('🔥 DEBUG - [SIMPLIFICADO] Verificando se cliente precisa ser provisionado');
    
    if (!assinatura || !currentCorretor) {
      // console.error('🔥 DEBUG - ERRO: Dados essenciais ausentes');
      setError('Dados da assinatura ou corretor não encontrados');
      return false;
    }

    // 1. VERIFICAÇÃO SIMPLES: se já tem customer ID, está tudo ok
    if (assinatura.id_customer_asaas) {
      // console.log('🔥 DEBUG - ✅ Cliente já tem ID do Asaas:', assinatura.id_customer_asaas);
      return true;
    }
    
    // console.log('🔥 DEBUG - ❌ Cliente NÃO tem ID do Asaas - precisa provisionar');
    
    // 2. SE NÃO TEM: abrir modal de cadastro
    // O modal vai coletar os dados e enviar via webhook para n8n
    setError('Cliente precisa ser cadastrado no Asaas. Por favor, preencha os dados.');
    return false; // Força abertura do modal de cadastro
  };

  const handleRegularizarPagamento = async () => {
    // console.log('🔥 DEBUG - [SIMPLIFICADO] Iniciando regularização de pagamento');
    setError(null);
    setIsProcessing(true);
    
    try {
      // 1. VERIFICAR SE CLIENTE TEM ID DO ASAAS
      const clienteOk = await verificarEProvisionarCliente();
      if (!clienteOk) {
        // console.log('🔥 DEBUG - [SIMPLIFICADO] Cliente precisa ser cadastrado - abrindo modal');
        setShowCustomerRegistrationModal(true);
        return;
      }
      
      // 2. ENCONTRAR PLANO ATUAL
      if (!assinatura) {
        setError('Assinatura não encontrada');
        return;
      }
      
      const planoAtual: PlanoUnion | undefined = planosDisponiveis.find(p => p.nome === assinatura.plano_nome) || 
        planos.find(p => p.nome_plano === assinatura.plano_nome);
      
      if (!planoAtual) {
        setError('Plano da assinatura não encontrado');
        return;
      }
      
      // 3. CONVERTER PARA FORMATO COMPATÍVEL
      const planoParaUpgrade: PlanoUpgrade = {
        id: planoAtual.id || 0,
        nome_plano: ('nome' in planoAtual ? planoAtual.nome : planoAtual.nome_plano) as string,
        preco_mensal: ('preco' in planoAtual ? planoAtual.preco : planoAtual.preco_mensal) as number,
        preco_anual: null,
        limite_corretores: 1,
        tipo_plano: (('tipo' in planoAtual ? planoAtual.tipo : planoAtual.tipo_plano) || 'INDIVIDUAL') as string,
        recursos: {},
        is_ativo: true
      };
      
      // console.log('🔥 DEBUG - Abrindo modal de pagamento para plano:', planoParaUpgrade.nome_plano);
      setSelectedPlan(planoParaUpgrade);
      setShowUpgradeModal(true);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro na regularização';
      // console.error('🔥 DEBUG - Erro na regularização:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAtivarAssinatura = async (planoId?: number) => {
    // console.log('🔥 DEBUG - Iniciando ativação de assinatura');
    // console.log('🔥 DEBUG - Parâmetros:', { planoId });
    // console.log('🔥 DEBUG - Estado atual:', {
    //   assinaturaStatus: assinatura?.status,
    //   assinaturaId: assinatura?.id,
    //   customerId: assinatura?.id_customer_asaas,
    //   corretorId: currentCorretor?.id,
    //   contaId: currentCorretor?.conta_id
    // });
    
    setError(null);
    setIsProcessing(true);

    try {
      // 1. VERIFICAR SE CLIENTE TEM ID DO ASAAS
      const clienteOk = await verificarEProvisionarCliente();
      if (!clienteOk) {
        // console.log('🔥 DEBUG - [SIMPLIFICADO] Cliente precisa ser cadastrado para ativar - abrindo modal');
        setShowCustomerRegistrationModal(true);
        return;
      }

      // 2. ENCONTRAR PLANO PARA ATIVAÇÃO
      // console.log('🔥 DEBUG - Passo 2: Encontrando plano para ativação');
      let planoParaAtivar;

      if (planoId) {
        // console.log('🔥 DEBUG - Buscando plano específico por ID:', planoId);
        planoParaAtivar = planosDisponiveis.find(p => p.id === planoId);
        // console.log('🔥 DEBUG - Resultado busca por ID:', planoParaAtivar ? 'encontrado' : 'não encontrado');
      } else {
        // console.log('🔥 DEBUG - Buscando plano baseado na assinatura atual ou primeiro disponível');
        if (assinatura) {
          // console.log('🔥 DEBUG - Buscando por nome do plano na assinatura:', assinatura.plano_nome);
          planoParaAtivar = planosDisponiveis.find(p => p.nome === assinatura.plano_nome);
        } else {
          // console.log('🔥 DEBUG - Sem assinatura, usando primeiro plano disponível');
          planoParaAtivar = planosDisponiveis[0];
        }
        // console.log('🔥 DEBUG - Resultado busca automática:', planoParaAtivar ? 'encontrado' : 'não encontrado');
      }

      if (!planoParaAtivar) {
        // console.error('🔥 DEBUG - ERRO: Plano não encontrado para ativação');
        // console.log('🔥 DEBUG - Planos disponíveis:', planosDisponiveis.map(p => ({ id: p.id, nome: p.nome, preco: p.preco })));
        if (assinatura) {
          // console.log('🔥 DEBUG - Nome do plano na assinatura:', assinatura.plano_nome);
        }
        setError('Plano não encontrado para ativação');
        return;
      }

      // console.log('🔥 DEBUG - ✅ Plano encontrado para ativação:', {
      //   id: planoParaAtivar.id,
      //   nome: planoParaAtivar.nome,
      //   preco: planoParaAtivar.preco,
      //   tipo: planoParaAtivar.tipo
      // });

      // 3. CONVERTER PARA FORMATO COMPATÍVEL DO MODAL
      // console.log('🔥 DEBUG - Passo 3: Convertendo plano para formato do modal de ativação');
      const planoParaUpgrade: PlanoUpgrade = {
        id: planoParaAtivar.id,
        nome_plano: planoParaAtivar.nome,
        preco_mensal: planoParaAtivar.preco,
        preco_anual: null,
        limite_corretores: 1,
        tipo_plano: planoParaAtivar.tipo,
        recursos: {},
        is_ativo: true
      };

      // console.log('🔥 DEBUG - ✅ Plano formatado para ativação:', planoParaUpgrade);
      // console.log('🔥 DEBUG - Passo 4: Abrindo modal de ativação/pagamento');

      setSelectedPlan(planoParaUpgrade);
      setShowUpgradeModal(true);

      // console.log('🔥 DEBUG - ✅ Modal de ativação aberto com sucesso');
      // console.log('🔥 DEBUG - Cliente pode prosseguir com dados do cartão');

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro na ativação';
      // console.error('🔥 DEBUG - ERRO CRÍTICO na ativação:', errorMessage);
      // console.error('🔥 DEBUG - Stack trace completo:', error);
      setError(errorMessage);
    } finally {
      // console.log('🔥 DEBUG - Finalizando processo de ativação, removendo loading');
      setIsProcessing(false);
    }
  };
  
  // AI dev note: handleUpgradeSuccess e handleUpgradeCancel removidos
  // Funcionalidade de upgrade agora é via webhook n8n

  const handleCustomerRegistrationSuccess = async (customerId: string) => {
    // console.log('🔥 DEBUG - [SIMPLIFICADO] ✅ Cadastro realizado com sucesso:', customerId);
    
    // Atualizar assinatura local com customer ID
    if (assinatura) {
      const { error } = await supabase
        .from('assinaturas')
        .update({ 
          id_customer_asaas: customerId,
          updated_at: new Date().toISOString()
        })
        .eq('id', assinatura.id);

      if (error) {
        // console.error('🔥 DEBUG - Erro ao atualizar assinatura:', error);
      } else {
        // Atualizar estado local
        setAssinatura(prev => prev ? { ...prev, id_customer_asaas: customerId } : null);
        // console.log('🔥 DEBUG - ✅ Assinatura atualizada localmente');
      }
    }
    
    // Fechar modal e recarregar dados
    setShowCustomerRegistrationModal(false);
    await carregarDados();
  };

  const handleCustomerRegistrationCancel = () => {
    setShowCustomerRegistrationModal(false);
    setError(null);
    setIsProcessing(false);
  };

  const getRecursosPlano = (recursos: string[], tipo: string) => {
    const recursosBase = [
      'WhatsApp Business integrado',
      'CRM completo e intuitivo',
      'Lembretes inteligentes',
      'Análise de conversas com IA'
    ];

    if (tipo === 'IMOBILIARIA') {
      return [
        ...recursosBase,
        'Gestão de equipe',
        'Dashboard administrativo',
        'Relatórios avançados',
        'Controle de permissões'
      ];
    }

    return [
      ...recursosBase,
      'Ideal para autônomos',
      'Suporte prioritário'
    ];
  };

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
            {/* Status Alert Crítico */}
            {(assinatura.status === 'PAGAMENTO_PENDENTE' || 
              assinatura.status === 'TRIAL' && assinatura.data_fim_trial && new Date(assinatura.data_fim_trial) < new Date()) && (
              <div className="p-4 bg-red-900/20 border-2 border-red-500/50 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-red-400 font-semibold mb-1">
                      {assinatura.status === 'PAGAMENTO_PENDENTE' ? '🚨 Pagamento Atrasado!' : '⏰ Trial Expirado!'}
                    </h4>
                    <p className="text-red-300 text-sm mb-3">
                      {assinatura.status === 'PAGAMENTO_PENDENTE' 
                        ? 'Sua assinatura está com pagamento em atraso. Regularize agora para manter o acesso completo.'
                        : 'Seu período de teste gratuito venceu. Ative sua assinatura para continuar usando o Guido.'
                      }
                    </p>
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white"
                      onClick={assinatura.status === 'PAGAMENTO_PENDENTE' ? handleRegularizarPagamento : () => handleAtivarAssinatura()}
                      disabled={isProcessing || isProvisioning}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      {(isProcessing || isProvisioning) ? 'Processando...' : assinatura.status === 'PAGAMENTO_PENDENTE' ? 'Regularizar Pagamento' : 'Ativar Assinatura'}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Status de Provisioning */}
            {isProvisioning && (
              <div className="p-4 bg-blue-900/20 border-2 border-blue-500/50 rounded-lg mb-6">
                <div className="flex items-start gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 flex-shrink-0 mt-0.5"></div>
                  <div className="flex-1">
                    <h4 className="text-blue-400 font-semibold mb-1">
                      🔄 Configurando Cliente no Sistema de Pagamentos
                    </h4>
                    <p className="text-blue-300 text-sm mb-2">
                      Estamos verificando e criando sua conta no sistema de pagamentos Asaas...
                    </p>
                    <div className="text-xs text-blue-200 space-y-1">
                      <p>• Verificando cadastro existente por CPF/CNPJ</p>
                      <p>• Criando cliente se necessário</p>
                      <p>• Desabilitando notificações nativas</p>
                      <p>• Integrando com sua assinatura</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Informações da assinatura atual */}
            <div className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-white font-medium text-lg mb-1">{assinatura.plano_nome}</h4>
                  <p className="text-2xl font-bold text-green-400">
                    {formatCurrency(assinatura.valor_atual)}
                    <span className="text-sm text-gray-400 font-normal">
                      /{assinatura.ciclo_cobranca === 'MONTHLY' ? 'mês' : 'ano'}
                    </span>
                  </p>
                  {!assinatura.id_customer_asaas && (
                    <p className="text-xs text-yellow-400 mt-1">
                      ⚠️ Cliente não configurado no sistema de pagamentos
                    </p>
                  )}
                  {assinatura.id_customer_asaas && !assinatura.id_assinatura_asaas && (
                    <p className="text-xs text-blue-400 mt-1">
                      ℹ️ Cliente configurado - Assinatura pendente
                    </p>
                  )}
                  {assinatura.id_customer_asaas && assinatura.id_assinatura_asaas && (
                    <p className="text-xs text-green-400 mt-1">
                      ✅ Totalmente integrado com Asaas
                    </p>
                  )}
                </div>
                
                <div className="text-right">
                  {(() => {
                    const statusInfo = getStatusInfo(assinatura.status, assinatura);
                    const Icon = statusInfo.icon;
                    return (
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className="w-4 h-4" />
                          <Badge className={`${statusInfo.color} text-xs px-3 py-1`}>
                            {statusInfo.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400 text-right max-w-32">{statusInfo.description}</p>
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Informações detalhadas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {assinatura.data_proxima_cobranca && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">
                      Próxima cobrança: 
                      <span className={new Date(assinatura.data_proxima_cobranca) < new Date() ? 'text-red-400 font-semibold ml-1' : 'text-white ml-1'}>
                        {formatDate(assinatura.data_proxima_cobranca)}
                      </span>
                    </span>
                  </div>
                )}
                
                {assinatura.data_fim_trial && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-300">
                      Trial: <span className="text-blue-400">{formatDate(assinatura.data_fim_trial)}</span>
                    </span>
                  </div>
                )}

                {assinatura.tentativas_cobranca && assinatura.tentativas_cobranca > 0 && (
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    <span className="text-yellow-400">
                      {assinatura.tentativas_cobranca} tentativa(s) de cobrança
                    </span>
                  </div>
                )}

                {(() => {
                  const tempo = getDiasRestantesTrialOuVencimento(assinatura);
                  if (!tempo) return null;
                  
                  if (tempo.tipo === 'trial') {
                    return (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400">
                          {tempo.dias > 0 ? `${tempo.dias} dias restantes no trial` : 'Trial expirado'}
                        </span>
                      </div>
                    );
                  }
                  
                  if (tempo.tipo === 'cobrança') {
                    return (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className={tempo.dias < 0 ? 'text-red-400' : 'text-gray-300'}>
                          {tempo.dias < 0 ? `${Math.abs(tempo.dias)} dias em atraso` : 
                           tempo.dias === 0 ? 'Vence hoje' : `${tempo.dias} dias para vencer`}
                        </span>
                      </div>
                    );
                  }
                })()}
              </div>
            </div>

            {/* Ações */}
            <div className="flex flex-wrap gap-3">
              {assinatura.status === 'PAGAMENTO_PENDENTE' && (
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleRegularizarPagamento}
                  disabled={isProcessing}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  {isProcessing ? 'Processando...' : 'Regularizar Pagamento'}
                </Button>
              )}
              
              {(assinatura.status === 'TRIAL' && assinatura.data_fim_trial && new Date(assinatura.data_fim_trial) < new Date()) && (
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => handleAtivarAssinatura()}
                  disabled={isProcessing}
                >
                  <Star className="w-4 h-4 mr-2" />
                  {isProcessing ? 'Processando...' : 'Ativar Assinatura'}
                </Button>
              )}

              <Button
                size="sm"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                onClick={() => alert('Histórico de faturas será implementado em breve!')}
              >
                Ver Histórico
              </Button>
              
              {assinatura.status === 'ATIVO' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-blue-600 text-blue-400 hover:bg-blue-900/20"
                  onClick={() => alert('Upgrade de plano será implementado em breve!')}
                >
                  Fazer Upgrade
                </Button>
              )}
              
              <Button
                size="sm"
                variant="outline"
                className="border-red-600 text-red-400 hover:bg-red-900/20"
                onClick={() => alert('Cancelamento será implementado em breve!')}
              >
                Cancelar
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {planosDisponiveis
                .filter(plano => plano.codigo_externo !== 'TRIAL') // Não mostrar o TRIAL nos planos disponíveis
                .map((plano) => (
                <div
                  key={plano.id}
                  className={`relative p-6 bg-gray-900/50 border rounded-lg transition-all duration-200 hover:scale-[1.02] ${
                    plano.destaque 
                      ? 'border-blue-500/50 shadow-lg shadow-blue-500/10' 
                      : 'border-gray-700 hover:border-blue-500/30'
                  }`}
                >
                  {plano.destaque && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-600 text-white px-3 py-1 text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        Mais Popular
                      </Badge>
                    </div>
                  )}

                  <div className="text-center mb-4">
                    <h4 className="text-white font-semibold text-lg mb-2">{plano.nome}</h4>
                    <div className="mb-2">
                      <p className="text-3xl font-bold text-green-400">
                        {plano.preco === 0 ? 'Grátis' : formatCurrency(plano.preco)}
                        {plano.preco > 0 && <span className="text-sm text-gray-400 font-normal">/mês</span>}
                      </p>
                    </div>
                    <p className="text-sm text-gray-400">{plano.descricao}</p>
                    <div className="mt-2">
                      <Badge className={`text-xs px-2 py-1 ${
                        plano.tipo === 'INDIVIDUAL' 
                          ? 'bg-purple-900/20 text-purple-400 border-purple-700/30' 
                          : 'bg-emerald-900/20 text-emerald-400 border-emerald-700/30'
                      }`}>
                        {plano.tipo === 'INDIVIDUAL' ? '👤 Individual' : '🏢 Imobiliária'}
                      </Badge>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6 min-h-[120px]">
                    {getRecursosPlano(plano.recursos, plano.tipo).map((recurso, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>{recurso}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${
                      plano.destaque 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                        : 'bg-gray-700 hover:bg-gray-600 text-white'
                    } transition-all duration-200`}
                    onClick={() => handleAtivarAssinatura(plano.id)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      'Processando...'
                    ) : (
                      <>
                        {plano.preco === 0 ? 'Iniciar Trial' : 'Contratar Plano'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Informações adicionais e garantias */}
        <div className="grid grid-cols-1 gap-6 mt-6">
          <div className="p-4 bg-emerald-900/10 border border-emerald-700/30 rounded-lg">
            <h4 className="text-emerald-400 font-medium mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Garantias
            </h4>
            <ul className="text-sm text-emerald-300 space-y-1">
              <li>• 7 dias de teste gratuito</li>
              <li>• Cancele a qualquer momento</li>
              <li>• Sem fidelidade ou multa</li>
              <li>• Suporte técnico incluído</li>
            </ul>
          </div>
        </div>

        {/* Status da integração Asaas */}
        {assinatura && !assinatura.id_customer_asaas && (
          <div className="mt-6 p-4 bg-yellow-900/10 border border-yellow-700/30 rounded-lg">
            <h4 className="text-yellow-400 font-medium mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Cliente Não Configurado
            </h4>
            <p className="text-sm text-yellow-300">
              Seu cliente ainda não foi configurado no sistema de pagamentos Asaas. 
              Clique em "Regularizar Pagamento" para configurar automaticamente e ativar pagamentos recorrentes.
            </p>
            <div className="mt-3 text-xs text-yellow-200 space-y-1">
              <p>• Verificação automática por CPF/CNPJ</p>
              <p>• Criação segura do cliente</p>
              <p>• Desativação de notificações desnecessárias</p>
              <p>• Integração completa com sua assinatura</p>
            </div>
          </div>
        )}
        
        {assinatura && assinatura.id_customer_asaas && !assinatura.id_assinatura_asaas && (
          <div className="mt-6 p-4 bg-blue-900/10 border border-blue-700/30 rounded-lg">
            <h4 className="text-blue-400 font-medium mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Cliente Configurado
            </h4>
            <p className="text-sm text-blue-300">
              Seu cliente está configurado no sistema de pagamentos (ID: {assinatura.id_customer_asaas}). 
              Agora você pode criar assinaturas e processar pagamentos automaticamente.
            </p>
          </div>
        )}

        {/* Modal de Upgrade/Regularização */}
        {showUpgradeModal && selectedPlan && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-lg border border-gray-700 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-white">
                  {assinatura?.status === 'PAGAMENTO_PENDENTE' ? 'Regularizar Pagamento' : 'Ativar Assinatura'}
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-600 text-gray-400 hover:bg-gray-700"
                  onClick={() => setShowUpgradeModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="p-6">
                {/* AI dev note: UpgradeSubscriptionForm removido - funcionalidade movida para n8n webhook */}
                <div className="text-center text-gray-400">
                  <p>Processamento de pagamentos foi movido para n8n.</p>
                  <p>Esta funcionalidade será reativada em breve.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Cadastro de Cliente */}
        <CustomerRegistrationModal
          isOpen={showCustomerRegistrationModal}
          onClose={handleCustomerRegistrationCancel}
          onSuccess={handleCustomerRegistrationSuccess}
          assinaturaId={assinatura?.id || ''}
          userId={currentCorretor?.id || ''}
          initialData={{
            nome: '',
            email: '',
            documento: ''
          }}
        />
      </CardContent>
    </Card>
  );
};
