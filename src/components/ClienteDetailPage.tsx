import React, { useState, useEffect } from 'react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, User, Phone, Mail, MessageCircle, Clock, DollarSign, 
  TrendingUp, Calendar, AlertCircle, CheckCircle, XCircle, 
  Target, Brain, Lightbulb, Building2, Plus, Bot, X
} from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent, Badge, Skeleton, Avatar, AvatarImage, AvatarFallback, Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { ClienteWithConversa, useClientesData } from '@/hooks/useClientesData';
import { useLembretes } from '@/hooks/useLembretes';
import { LembreteForm } from '@/components/lembretes/LembreteForm';
import { CreateLembreteData } from '@/types/lembretes';
import { useToastContext } from '@/contexts/ToastContext';
import { useViewContext } from '@/hooks/useViewContext';
import { prepareWebhookData } from '@/utils/webhookDataHelper';
import { supabase } from '@/lib/supabaseClient';

// AI dev note: Página de detalhamento completo do cliente
// Mostra todos os dados de IA e análises da conversa

interface ClienteDetailParams {
  clienteId: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'NOVO_LEAD':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    case 'CONTATO_INICIAL':
      return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    case 'INTERESSE_GERADO':
      return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    case 'VISITA_AGENDADA':
      return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    case 'PROPOSTA_ENVIADA':
      return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
    case 'FECHAMENTO':
      return 'bg-green-500/10 text-green-400 border-green-500/20';
    case 'PERDIDO':
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    default:
      return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  }
};

const formatStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'NOVO_LEAD': 'Novo Lead',
    'CONTATO_INICIAL': 'Contato Inicial',
    'INTERESSE_GERADO': 'Interesse Gerado',
    'VISITA_AGENDADA': 'Visita Agendada',
    'PROPOSTA_ENVIADA': 'Proposta Enviada',
    'FECHAMENTO': 'Fechamento',
    'PERDIDO': 'Lead Perdido'
  };
  return statusMap[status] || status;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Não informado';
  return new Date(dateString).toLocaleString('pt-BR');
};

// Componente interno que terá acesso ao ViewContext
const ClienteDetailContent: React.FC<{ 
  clienteId: string; 
  isFromKanban: boolean; 
  onClienteLoaded?: (cliente: ClienteWithConversa) => void; 
}> = ({ clienteId, isFromKanban, onClienteLoaded }) => {
  const history = useHistory();
  const { getClienteById } = useClientesData();
  const { createLembrete } = useLembretes();
  const toast = useToastContext();
  const { currentCorretor } = useViewContext();
  
  const [cliente, setCliente] = useState<ClienteWithConversa | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para o modal de lembrete
  const [isLembreteModalOpen, setIsLembreteModalOpen] = useState(false);
  const [isCreatingLembrete, setIsCreatingLembrete] = useState(false);
  const [shouldUsePseudoLembrete, setShouldUsePseudoLembrete] = useState(false);
  
  // Estados para geração de follow-up
  const [isGeneratingFollowUp, setIsGeneratingFollowUp] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState<string | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);

  const handleBack = () => {
    if (isFromKanban) {
      history.push('/conversations');
    } else {
      history.push('/clientes');
    }
  };

  useEffect(() => {
    const fetchCliente = async () => {
      if (!clienteId) return;
      
      setIsLoading(true);
      try {
        const clienteData = await getClienteById(clienteId);
        if (clienteData) {
          setCliente(clienteData);
          onClienteLoaded?.(clienteData);
          

        } else {
          setError('Cliente não encontrado');
        }
      } catch (err) {
        setError('Erro ao carregar dados do cliente');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCliente();
  }, [clienteId, getClienteById, onClienteLoaded]);

  // Função para criar lembrete com dados pré-preenchidos
  const handleCreateLembrete = () => {
    setShouldUsePseudoLembrete(true);
    setIsLembreteModalOpen(true);
  };

  const handleLembreteSubmit = async (data: CreateLembreteData) => {
    setIsCreatingLembrete(true);
    try {
      const success = await createLembrete(data);
      if (success) {
        setIsLembreteModalOpen(false);
        setShouldUsePseudoLembrete(false);
      }
      return success;
    } finally {
      setIsCreatingLembrete(false);
    }
  };

  const handleLembreteModalClose = () => {
    setIsLembreteModalOpen(false);
    setShouldUsePseudoLembrete(false);
  };

  // Preparar pseudo-lembrete com dados da próxima ação para pré-preenchimento
  const getPseudoLembreteForEdit = () => {
    if (!cliente?.conversa) return null;

    const conversa = cliente.conversa;
    const dataLimite = conversa.data_limite_proxima_acao;
    
    // Se tiver data limite, usar ela, senão usar 1 hora no futuro
    let dataLembrete = '';
    if (dataLimite) {
      dataLembrete = dataLimite;
    } else {
      const agora = new Date();
      agora.setHours(agora.getHours() + 1);
      dataLembrete = agora.toISOString();
    }

    // Criar um pseudo-lembrete que servirá para pré-preenchimento
    return {
      id: 'temp',
      corretor_id: '',
      cliente_id: cliente.id,
      titulo: conversa.proxima_acao_recomendada || 'Follow-up com cliente',
      descricao: conversa.proxima_acao_recomendada || '',
      data_lembrete: dataLembrete,
      tipo_lembrete: 'FOLLOW_UP' as const,
      prioridade: 'MEDIA' as const,
      status: 'PENDENTE' as const,
      notificacao_enviada: false,
      tentativas_envio: 0,
      created_at: '',
      updated_at: ''
    };
  };

  // AI dev note: Função para gerar follow-up via IA usando webhook n8n - seguindo padrão dos outros webhooks
  const handleGenerateFollowUp = async () => {
    if (!cliente || !currentCorretor) return;
    
    setIsGeneratingFollowUp(true);
    
    try {
      toast.info('Gerando follow-up...', 'Aguarde enquanto nossa IA analisa o perfil do cliente e gera uma sugestão personalizada');
      
      // Buscar dados do usuário atual (seguindo padrão dos outros webhooks)
      const user = supabase.auth.user();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();

      if (userError || !userData) {
        throw new Error('Dados do usuário não encontrados');
      }

      // Buscar assinatura ativa do corretor atual
      const { data: assinaturaData, error: assinaturaError } = await supabase
        .from('assinaturas')
        .select('id')
        .eq('conta_id', currentCorretor.conta_id)
        .is('deleted_at', null)
        .single();

      if (assinaturaError || !assinaturaData) {
        throw new Error('Assinatura do corretor não encontrada');
      }

      // Preparar dados completos do webhook
      const webhookData = await prepareWebhookData({
        nome: userData.name,
        email: userData.email,
        documento: userData.cpfCnpj || '',
        telefone: userData.whatsapp,
        userId: userData.id,
        assinaturaId: assinaturaData.id
      });

      const webhookUrl = import.meta.env.VITE_WEBHOOK_ASAAS_PROVISIONING_URL;
      const apiKey = import.meta.env.VITE_WEBHOOK_ASAAS_PROVISIONING_API_KEY;
      
      if (!webhookUrl) {
        throw new Error('URL do webhook não configurada');
      }

      if (!apiKey) {
        throw new Error('API Key do webhook não configurada');
      }
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api': apiKey
        },
        body: JSON.stringify({
          action: 'generate_followup',
          // Dados do corretor atual
          corrector: {
            id: currentCorretor.id,
            nome: currentCorretor.nome,
            email: currentCorretor.email,
            conta_id: currentCorretor.conta_id,
            funcao: currentCorretor.funcao
          },
          // Dados completos do usuário
          user: userData,
          // Dados expandidos com conta e assinatura
          data: webhookData,
          // Dados específicos do cliente para o follow-up
          cliente: {
            id: cliente.id,
            nome: cliente.nome,
            telefone: cliente.telefone,
            email: cliente.email,
            status_funil: cliente.status_funil,
            conversa: cliente.conversa ? {
              resumo_gerado: cliente.conversa.resumo_gerado,
              necessidade: cliente.conversa.necessidade,
              perfil: cliente.conversa.perfil,
              principal_insight_estrategico: cliente.conversa.principal_insight_estrategico,
              proxima_acao_recomendada: cliente.conversa.proxima_acao_recomendada,
              sentimento_geral: cliente.conversa.sentimento_geral,
              inteligencia_motivacao_principal: cliente.conversa.inteligencia_motivacao_principal,
              inteligencia_budget_declarado: cliente.conversa.inteligencia_budget_declarado
            } : null,
            timestamp: new Date().toISOString()
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Erro no webhook: ${response.status} ${response.statusText}`);
      }

      // Processar resposta do webhook com a mensagem gerada pela IA
      const result = await response.json();
      
      // Extrair mensagem do formato retornado pela IA - versão robusta
      let mensagemGerada = '';
      
      try {
        // Formato padrão da IA: [{"content":{"parts":[{"text":"..."}]}}]
        if (Array.isArray(result) && result.length > 0) {
          const firstItem = result[0];
          if (firstItem?.content?.parts && Array.isArray(firstItem.content.parts)) {
            for (const part of firstItem.content.parts) {
              if (part?.text && typeof part.text === 'string') {
                mensagemGerada = part.text.trim();
                break;
              }
            }
          }
        }
        
        // Fallbacks para outros formatos possíveis
        if (!mensagemGerada) {
          // Formato objeto direto: {"content":{"parts":[{"text":"..."}]}}
          if (result?.content?.parts?.[0]?.text) {
            mensagemGerada = result.content.parts[0].text.trim();
          }
          // Formato resposta direta: {"response": "..."}
          else if (result?.response) {
            mensagemGerada = result.response.trim();
          }
          // Formato texto direto: {"text": "..."}
          else if (result?.text) {
            mensagemGerada = result.text.trim();
          }
          // Formato mensagem: {"message": "..."}
          else if (result?.message) {
            mensagemGerada = result.message.trim();
          }
        }
        
      } catch (parseError) {
        console.error('Erro ao processar resposta da IA:', parseError);
      }

      if (!mensagemGerada || mensagemGerada.length === 0) {
        throw new Error('Não foi possível extrair a mensagem gerada pela IA');
      }

      // Armazenar mensagem e mostrar modal
      setGeneratedMessage(mensagemGerada);
      setShowMessageModal(true);
      
      toast.success('Follow-up gerado!', 'Mensagem personalizada criada pela IA. Revise e envie quando quiser.');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      toast.error('Erro ao gerar follow-up', errorMessage);
    } finally {
      setIsGeneratingFollowUp(false);
    }
  };

  // Função para enviar mensagem para WhatsApp
  const handleSendToWhatsApp = () => {
    if (!generatedMessage || !cliente) return;

    const phoneNumbers = cliente.telefone?.replace(/\D/g, '');
    if (phoneNumbers) {
      // Codificar mensagem para URL
      const encodedMessage = encodeURIComponent(generatedMessage);
      const whatsappUrl = `https://wa.me/${phoneNumbers}?text=${encodedMessage}`;
      
      // Abrir WhatsApp em nova aba
      window.open(whatsappUrl, '_blank');
      
      // Fechar modal e limpar mensagem
      setShowMessageModal(false);
      setGeneratedMessage(null);
      
      toast.info('WhatsApp aberto!', 'A mensagem foi pré-preenchida. Revise e envie quando quiser.');
    }
  };

  // Função para fechar modal sem enviar
  const handleCloseMessageModal = () => {
    setShowMessageModal(false);
    setGeneratedMessage(null);
  };



  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-64 bg-gray-700" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48 bg-gray-700" />
            <Skeleton className="h-64 bg-gray-700" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-32 bg-gray-700" />
            <Skeleton className="h-40 bg-gray-700" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !cliente) {
    return (
      <div className="flex items-center justify-center h-64 p-6">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Cliente não encontrado</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            {isFromKanban ? 'Voltar para Conversas' : 'Voltar para lista'}
          </button>
        </div>
      </div>
    );
  }

  const conversa = cliente.conversa;

  return (
    <div className="space-y-6 p-6">
        {/* Header com navegação */}
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBack}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div className="flex items-center gap-3">
            <Avatar className="w-16 h-16 ring-2 ring-gray-600/50">
              {cliente.profilePicUrl && (
                <AvatarImage 
                  src={cliente.profilePicUrl} 
                  alt={cliente.nome}
                  className="object-cover"
                />
              )}
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white font-bold text-lg">
                {cliente.nome.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-white">{cliente.nome}</h1>
              <div className={cn(
                "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border",
                getStatusColor(cliente.status_funil)
              )}>
                {formatStatusText(cliente.status_funil)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Coluna principal */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Informações básicas */}
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informações Básicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Telefone</p>
                      <p className="text-white">{cliente.telefone}</p>
                    </div>
                  </div>
                  
                  {cliente.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-400">E-mail</p>
                        <p className="text-white">{cliente.email}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Cliente desde</p>
                      <p className="text-white">{formatDate(cliente.created_at)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Última atualização</p>
                      <p className="text-white">{formatDate(cliente.updated_at)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>



            {conversa ? (
              <>
                {/* Resumo da conversa */}
                <Card className="bg-gray-900/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Resumo da Conversa
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 leading-relaxed">
                      {conversa.resumo_gerado || 'Nenhum resumo disponível'}
                    </p>
                    
                    {conversa.tags_conversa && conversa.tags_conversa.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-400 mb-2">Tags:</p>
                        <div className="flex gap-2 flex-wrap">
                          {conversa.tags_conversa.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="bg-gray-800 text-gray-300">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Análise de IA */}
                <Card className="bg-gray-900/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      Análise de IA
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    
                    {/* Perfil comportamental */}
                    {conversa.contato_perfil_comportamental && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Perfil Comportamental</h4>
                        <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                          {conversa.contato_perfil_comportamental}
                        </Badge>
                      </div>
                    )}

                    {/* Emoção predominante */}
                    {conversa.contato_emocao_predominante && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Emoção Predominante</h4>
                        <p className="text-gray-300">{conversa.contato_emocao_predominante}</p>
                      </div>
                    )}

                    {/* Motivação principal */}
                    {conversa.inteligencia_motivacao_principal && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Motivação Principal</h4>
                        <p className="text-gray-300">{conversa.inteligencia_motivacao_principal}</p>
                      </div>
                    )}

                    {/* Necessidades */}
                    {conversa.necessidade && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Oportunidade Identificada</h4>
                        <p className="text-gray-300">{conversa.necessidade}</p>
                      </div>
                    )}

                    {/* Perfil detalhado */}
                    {conversa.perfil && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Perfil do Cliente</h4>
                        <p className="text-gray-300">{conversa.perfil}</p>
                      </div>
                    )}

                    {/* Insight estratégico */}
                    {conversa.principal_insight_estrategico && (
                      <div className="p-4 bg-yellow-900/10 border border-yellow-700/30 rounded-lg">
                        <h4 className="text-sm font-medium text-yellow-400 mb-2 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4" />
                          Insight Estratégico
                        </h4>
                        <p className="text-gray-300">{conversa.principal_insight_estrategico}</p>
                      </div>
                    )}

                    {/* Resumo do imóvel do CRM */}
                    {conversa.resumo_imovel_crm && (
                      <div className="p-4 bg-blue-900/10 border border-blue-700/30 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-400 mb-2 flex items-center gap-2">
                          <Building2 className="w-4 h-4" />
                          Resumo do Imóvel (CRM)
                        </h4>
                        {conversa.interacao_item_de_interesse && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-400 mb-1">Código:</p>
                            <p className="text-white font-mono">{conversa.interacao_item_de_interesse}</p>
                          </div>
                        )}
                        <p className="text-gray-300">{conversa.resumo_imovel_crm}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-gray-900/50 border-gray-700">
                <CardContent className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Nenhuma conversa registrada</h3>
                  <p className="text-gray-400">
                    Este cliente ainda não possui uma conversa registrada no sistema.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {conversa && (
              <>
                {/* Métricas da conversa */}
                <Card className="bg-gray-900/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Métricas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4">
                      <div className="text-center p-3 bg-blue-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-400">{conversa.total_mensagens || 0}</div>
                        <div className="text-xs text-gray-400">Mensagens</div>
                      </div>
                      
                      <div className="text-center p-3 bg-green-900/20 rounded-lg">
                        <div className="text-lg font-bold text-green-400">
                          {conversa.sentimento_geral || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-400">Sentimento</div>
                      </div>
                      
                      <div className="text-center p-3 bg-purple-900/20 rounded-lg">
                        <div className="text-sm font-bold text-purple-400">
                          {conversa.plataforma || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-400">Plataforma</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Orçamento */}
                {conversa.inteligencia_budget_declarado && (
                  <Card className="bg-gray-900/50 border-gray-700">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Orçamento
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-green-400 font-semibold text-lg">
                        {conversa.inteligencia_budget_declarado}
                      </p>
                    </CardContent>
                  </Card>
                )}



                {/* Próxima ação */}
                {conversa.proxima_acao_recomendada && (
                  <Card className="bg-blue-900/20 border-blue-700/30">
                    <CardHeader>
                      <CardTitle className="text-blue-400 flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Próxima Ação
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 mb-3">{conversa.proxima_acao_recomendada}</p>
                      {conversa.data_limite_proxima_acao && (
                        <div className="text-sm text-blue-400 mb-3">
                          <Clock className="w-4 h-4 inline mr-1" />
                          Até: {formatDate(conversa.data_limite_proxima_acao)}
                        </div>
                      )}
                      <Button
                        onClick={handleCreateLembrete}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm"
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Criar lembrete
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Status de follow-up */}
                <Card className="bg-gray-900/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Follow-up
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {conversa?.status_followup && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            {conversa.status_followup === 'Concluído' ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : conversa.status_followup === 'Pendente' ? (
                              <Clock className="w-4 h-4 text-yellow-400" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-400" />
                            )}
                            <span className="text-white">{conversa.status_followup}</span>
                          </div>
                          
                          {conversa.motivo_followup && (
                            <p className="text-sm text-gray-400">{conversa.motivo_followup}</p>
                          )}
                          
                          {conversa.data_proximo_followup && (
                            <p className="text-sm text-blue-400">
                              Próximo: {formatDate(conversa.data_proximo_followup)}
                            </p>
                          )}
                        </div>
                      )}
                      
                      {/* Seção de geração de follow-up via IA */}
                      <div className="border-t border-gray-700 pt-4">
                        <div className="mb-3">
                          <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                            <Bot className="w-4 h-4 text-cyan-400" />
                            Gerar Follow-up com IA
                          </h4>
                          <p className="text-xs text-gray-400">
                            Nossa IA criará uma sugestão personalizada de follow-up baseada no perfil e histórico do cliente.
                          </p>
                        </div>
                        
                        <Button
                          onClick={handleGenerateFollowUp}
                          disabled={isGeneratingFollowUp}
                          className="bg-cyan-600 hover:bg-cyan-700 text-white text-sm w-full"
                          size="sm"
                        >
                          {isGeneratingFollowUp ? (
                            <>
                              <Clock className="w-4 h-4 mr-2 animate-spin" />
                              Gerando...
                            </>
                          ) : (
                            <>
                              <Bot className="w-4 h-4 mr-2" />
                              Gerar Follow-up
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
        
        {/* Modal de Lembrete */}
        <LembreteForm
          isOpen={isLembreteModalOpen}
          onClose={handleLembreteModalClose}
          onSubmit={handleLembreteSubmit}
          isLoading={isCreatingLembrete}
          lembrete={shouldUsePseudoLembrete ? getPseudoLembreteForEdit() : null}
        />

        {/* Modal da Mensagem Gerada */}
        {showMessageModal && generatedMessage && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg border border-gray-700 w-full max-w-2xl max-h-[80vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <div>
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Bot className="w-5 h-5 text-cyan-400" />
                    Follow-up Gerado pela IA
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Para: {cliente?.nome} ({cliente?.telefone})
                  </p>
                </div>
                <button 
                  onClick={handleCloseMessageModal}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Conteúdo da mensagem */}
              <div className="p-6 overflow-y-auto max-h-96">
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-600">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Mensagem personalizada:</h4>
                  <p className="text-white leading-relaxed whitespace-pre-wrap">
                    {generatedMessage}
                  </p>
                </div>
              </div>

              {/* Footer com ações */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-700 bg-gray-900/50">
                <Button
                  onClick={handleCloseMessageModal}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSendToWhatsApp}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Enviar no WhatsApp
                </Button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export const ClienteDetailPage: React.FC = () => {
  const { clienteId } = useParams<ClienteDetailParams>();
  const location = useLocation();
  const [pageTitle, setPageTitle] = useState('Detalhes do Cliente');
  
  // Detectar se veio do Kanban através do parâmetro query
  const isFromKanban = new URLSearchParams(location.search).get('from') === 'kanban';

  const handleClienteLoaded = (cliente: ClienteWithConversa) => {
    setPageTitle(cliente.nome);
  };

  return (
    <DashboardLayout title={pageTitle}>
      <ClienteDetailContent 
        clienteId={clienteId} 
        isFromKanban={isFromKanban} 
        onClienteLoaded={handleClienteLoaded}
      />
    </DashboardLayout>
  );
};
