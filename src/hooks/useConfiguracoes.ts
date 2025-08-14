import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useViewContext } from './useViewContext';
import { 
  ConfiguracaoSecao, 
  PerfilUsuario, 
  ConfiguracaoEmpresa, 
  ConfiguracaoNotificacao, 
  ConfiguracaoPrivacidade 
} from '@/types/configuracoes';

export const useConfiguracoes = () => {
  const { currentCorretor, userRole } = useViewContext();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [perfilUsuario, setPerfilUsuario] = useState<PerfilUsuario>({
    nome: '',
    email: '',
    telefone: '',
    cargo: '',
    creci: ''
  });
  
  const [configuracaoEmpresa, setConfiguracaoEmpresa] = useState<ConfiguracaoEmpresa>({
    nomeEmpresa: '',
    cnpj: '',
    endereco: '',
    telefone: '',
    email: '',
    website: '',
    creciEmpresa: ''
  });
  
  const [notificacoes, setNotificacoes] = useState<ConfiguracaoNotificacao>({
    email: true,
    whatsapp: true,
    push: true,
    novoCliente: true,
    lembreteVencido: true,
    conversaPendente: true,
    relatorioSemanal: false
  });
  
  const [privacidade, setPrivacidade] = useState<ConfiguracaoPrivacidade>({
    perfilPublico: false,
    mostrarContatos: true,
    mostrarHistoricoVendas: false,
    compartilharDados: false
  });

  // Definir seções baseadas no tipo de usuário
  const getSecoesDisponiveis = useCallback((): ConfiguracaoSecao[] => {
    const secoes: ConfiguracaoSecao[] = [
      {
        id: 'perfil',
        titulo: 'Perfil Pessoal',
        descricao: 'Informações pessoais e profissionais',
        icone: '👤',
        visible: true
      },
      {
        id: 'notificacoes',
        titulo: 'Notificações',
        descricao: 'Configure como e quando receber alertas',
        icone: '🔔',
        visible: true
      },
      {
        id: 'privacidade',
        titulo: 'Privacidade & Segurança',
        descricao: 'Controle sobre seus dados e visibilidade',
        icone: '🔒',
        visible: true
      },
      {
        id: 'empresa',
        titulo: 'Dados da Empresa',
        descricao: 'Informações da imobiliária ou escritório',
        icone: '🏢',
        visible: userRole === 'DONO' || userRole === 'ADMIN',
        permissaoMinima: 'ADMIN'
      },
      {
        id: 'equipe',
        titulo: 'Gerenciar Equipe',
        descricao: 'Adicionar e gerenciar corretores',
        icone: '👥',
        visible: userRole === 'DONO' || userRole === 'ADMIN',
        permissaoMinima: 'ADMIN'
      },
      {
        id: 'planos',
        titulo: 'Planos & Cobrança',
        descricao: 'Gerenciar assinatura e pagamentos',
        icone: '💳',
        visible: userRole === 'DONO',
        permissaoMinima: 'DONO'
      },
      {
        id: 'integracao',
        titulo: 'Integrações',
        descricao: 'APIs e webhooks personalizados',
        icone: '🔗',
        visible: userRole === 'DONO' || userRole === 'ADMIN',
        permissaoMinima: 'ADMIN'
      }
    ];

    return secoes.filter(secao => secao.visible);
  }, [userRole]);

  const carregarConfiguracoes = useCallback(async () => {
    if (!currentCorretor?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setError(null);
      
      // Carregar dados do perfil
      const { data: corretorData, error: corretorError } = await supabase
        .from('corretores')
        .select('*')
        .eq('id', currentCorretor.id)
        .single();

      if (corretorError) throw corretorError;

      setPerfilUsuario({
        nome: corretorData.nome || '',
        email: corretorData.email || '',
        telefone: corretorData.telefone || '',
        cargo: corretorData.funcao || '',
        creci: corretorData.cpf || '' // Usando CPF como CRECI por enquanto
      });

      // Carregar dados da empresa (se for ADMIN ou DONO)
      if (userRole === 'DONO' || userRole === 'ADMIN') {
        const { data: contaData, error: contaError } = await supabase
          .from('contas')
          .select('*')
          .eq('id', currentCorretor.conta_id)
          .single();

        if (contaError) throw contaError;

        setConfiguracaoEmpresa({
          nomeEmpresa: contaData.nome_conta || '',
          cnpj: contaData.documento || '',
          endereco: '',
          telefone: '',
          email: '',
          website: '',
          creciEmpresa: ''
        });
      }

      // TODO: Carregar configurações de notificação e privacidade do banco
      // Por enquanto, usar valores padrão
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar configurações');
    } finally {
      setIsLoading(false);
    }
  }, [currentCorretor?.id, currentCorretor?.conta_id, userRole]);

  const salvarPerfil = async (novosPerfil: Partial<PerfilUsuario>): Promise<boolean> => {
    if (!currentCorretor?.id) return false;

    try {
      setError(null);
      
      const { error } = await supabase
        .from('corretores')
        .update({
          nome: novosPerfil.nome,
          // telefone: novosPerfil.telefone, // Adicionar campos se necessário
        })
        .eq('id', currentCorretor.id);

      if (error) throw error;

      setPerfilUsuario(prev => ({ ...prev, ...novosPerfil }));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar perfil');
      return false;
    }
  };

  const salvarEmpresa = async (novaEmpresa: Partial<ConfiguracaoEmpresa>): Promise<boolean> => {
    if (!currentCorretor?.conta_id) return false;

    try {
      setError(null);
      
      const { error } = await supabase
        .from('contas')
        .update({
          nome_conta: novaEmpresa.nomeEmpresa,
          documento: novaEmpresa.cnpj,
        })
        .eq('id', currentCorretor.conta_id);

      if (error) throw error;

      setConfiguracaoEmpresa(prev => ({ ...prev, ...novaEmpresa }));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar dados da empresa');
      return false;
    }
  };

  const salvarNotificacoes = async (novasNotificacoes: Partial<ConfiguracaoNotificacao>): Promise<boolean> => {
    try {
      setError(null);
      // TODO: Implementar salvamento no banco quando tivermos tabela de configurações
      setNotificacoes(prev => ({ ...prev, ...novasNotificacoes }));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar notificações');
      return false;
    }
  };

  const salvarPrivacidade = async (novaPrivacidade: Partial<ConfiguracaoPrivacidade>): Promise<boolean> => {
    try {
      setError(null);
      // TODO: Implementar salvamento no banco quando tivermos tabela de configurações
      setPrivacidade(prev => ({ ...prev, ...novaPrivacidade }));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar configurações de privacidade');
      return false;
    }
  };

  useEffect(() => {
    carregarConfiguracoes();
  }, [carregarConfiguracoes]);

  return {
    isLoading,
    error,
    secoesDisponiveis: getSecoesDisponiveis(),
    perfilUsuario,
    configuracaoEmpresa,
    notificacoes,
    privacidade,
    salvarPerfil,
    salvarEmpresa,
    salvarNotificacoes,
    salvarPrivacidade,
    recarregar: carregarConfiguracoes
  };
};
