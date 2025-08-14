export interface ConfiguracaoSecao {
  id: string;
  titulo: string;
  descricao: string;
  icone: string;
  visible: boolean;
  permissaoMinima?: 'AGENTE' | 'ADMIN' | 'DONO';
  tipoContaRequerido?: 'INDIVIDUAL' | 'IMOBILIARIA';
}

export interface ConfiguracaoItem {
  id: string;
  titulo: string;
  descricao?: string;
  tipo: 'toggle' | 'text' | 'select' | 'number' | 'action';
  valor?: string | number | boolean;
  opcoes?: { label: string; value: string }[];
  placeholder?: string;
  visible: boolean;
  permissaoMinima?: 'AGENTE' | 'ADMIN' | 'DONO';
}

export interface PerfilUsuario {
  nome: string;
  email: string;
  telefone?: string;
  foto?: string;
  cargo?: string;
  creci?: string;
}

export interface ConfiguracaoEmpresa {
  nomeEmpresa: string;
  cnpj: string;
  endereco: string;
  telefone: string;
  email: string;
  website?: string;
  logo?: string;
  creciEmpresa?: string;
}

export interface ConfiguracaoNotificacao {
  email: boolean;
  whatsapp: boolean;
  push: boolean;
  novoCliente: boolean;
  lembreteVencido: boolean;
  conversaPendente: boolean;
  relatorioSemanal: boolean;
}

export interface ConfiguracaoPrivacidade {
  perfilPublico: boolean;
  mostrarContatos: boolean;
  mostrarHistoricoVendas: boolean;
  compartilharDados: boolean;
}
