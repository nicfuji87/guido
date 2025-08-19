import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';

// AI dev note: Hook para gerenciar dados dos clientes com informações das conversas
// Inclui busca e filtros para a seção Clientes

export interface ClienteWithConversa {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
  status_funil: string;
  created_at: string;
  updated_at: string;
  profilePicUrl?: string;
  
  // Dados da conversa associada
  conversa: {
    id: string;
    plataforma: string;
    status_conversa: string;
    timestamp_ultima_mensagem?: string;
    resumo_gerado?: string;
    sentimento_geral?: string;
    prioridade?: string;
    total_mensagens?: number;
    
    // Campos de análise de IA
    tags_conversa?: string[];
    resolucao_primeiro_contato?: string;
    pendencia_status?: string;
    pendencia_detalhe?: string;
    contato_nome_detectado?: string;
    contato_perfil_comportamental?: string;
    contato_emocao_predominante?: string;
    contato_relacionamento?: string;
    contato_canal_preferencial?: string;
    contato_poder_decisao?: string;
    interacao_tipo_solicitacao?: string;
    interacao_item_de_interesse?: string;
    resumo_imovel_crm?: string;
    inteligencia_motivacao_principal?: string;
    inteligencia_budget_declarado?: string;
    principal_insight_estrategico?: string;
    proxima_acao_recomendada?: string;
    data_limite_proxima_acao?: string;
    status_followup?: string;
    data_proximo_followup?: string;
    motivo_followup?: string;
    prioridade_followup?: string;
    perfil?: string;
    necessidade?: string;
  } | null;
}

// Função para normalizar texto (remover acentos e case insensitive)
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

export const useClientesData = () => {
  const [clientes, setClientes] = useState<ClienteWithConversa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchClientes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('clientes')
        .select(`
          id,
          nome,
          telefone,
          email,
          status_funil,
          created_at,
          updated_at,
          profilePicUrl,
          conversas (
            id,
            plataforma,
            status_conversa,
            timestamp_ultima_mensagem,
            resumo_gerado,
            sentimento_geral,
            prioridade,
            total_mensagens,
            tags_conversa,
            resolucao_primeiro_contato,
            pendencia_status,
            pendencia_detalhe,
            contato_nome_detectado,
            contato_perfil_comportamental,
            contato_emocao_predominante,
            contato_relacionamento,
            contato_canal_preferencial,
            contato_poder_decisao,
            interacao_tipo_solicitacao,
            interacao_item_de_interesse,
            resumo_imovel_crm,
            inteligencia_motivacao_principal,
            inteligencia_budget_declarado,
            principal_insight_estrategico,
            proxima_acao_recomendada,
            data_limite_proxima_acao,
            status_followup,
            data_proximo_followup,
            motivo_followup,
            prioridade_followup,
            perfil,
            necessidade
          )
        `)
        .order('updated_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      // Transformar dados para incluir apenas a primeira conversa de cada cliente
      const clientesWithConversa: ClienteWithConversa[] = (data || []).map(cliente => ({
        ...cliente,
        conversa: Array.isArray(cliente.conversas) && cliente.conversas.length > 0 
          ? cliente.conversas[0] 
          : null
      }));

      setClientes(clientesWithConversa);
    } catch (err) {
      setError('Erro ao carregar clientes');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Buscar dados na primeira renderização
  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  // Filtrar clientes baseado no termo de busca
  const filteredClientes = useMemo(() => {
    if (!searchTerm || searchTerm.length < 3) {
      return clientes;
    }

    const normalizedSearch = normalizeText(searchTerm);
    
    return clientes.filter(cliente => {
      // Busca por nome (case e accent insensitive)
      const nomeMatch = normalizeText(cliente.nome).includes(normalizedSearch);
      
      // Busca por telefone (apenas dígitos)
      const phoneDigits = cliente.telefone.replace(/\D/g, '');
      const searchDigits = searchTerm.replace(/\D/g, '');
      const phoneMatch = searchDigits.length >= 3 && phoneDigits.includes(searchDigits);
      
      return nomeMatch || phoneMatch;
    });
  }, [clientes, searchTerm]);

  // Função para buscar cliente específico por ID
  const getClienteById = useCallback(async (clienteId: string): Promise<ClienteWithConversa | null> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('clientes')
        .select(`
          id,
          nome,
          telefone,
          email,
          status_funil,
          created_at,
          updated_at,
          profilePicUrl,
          conversas (*)
        `)
        .eq('id', clienteId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      return {
        ...data,
        conversa: Array.isArray(data.conversas) && data.conversas.length > 0 
          ? data.conversas[0] 
          : null
      };
    } catch (err) {
      return null;
    }
  }, []);

  return {
    clientes: filteredClientes,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    refetchClientes: fetchClientes,
    getClienteById
  };
};
