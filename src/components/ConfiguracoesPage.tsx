import React, { useState } from 'react';
import { Shield, Loader2 } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useConfiguracoes } from '@/hooks/useConfiguracoes';
import { useViewContext } from '@/hooks/useViewContext';
import { PerfilSection } from '@/components/configuracoes/PerfilSection';
import { NotificacoesSection } from '@/components/configuracoes/NotificacoesSection';
import { EmpresaSection } from '@/components/configuracoes/EmpresaSection';
import { EquipeSection } from '@/components/configuracoes/EquipeSection';
import { PlanosSection } from '@/components/configuracoes/PlanosSection';

const ConfiguracoesContent: React.FC = () => {
  const { userRole } = useViewContext();
  const {
    isLoading,
    error,
    secoesDisponiveis,
    perfilUsuario,
    configuracaoEmpresa,
    notificacoes,
    // privacidade,
    salvarPerfil,
    salvarEmpresa,
    salvarNotificacoes,
    // salvarPrivacidade
  } = useConfiguracoes();

  const [secaoAtiva, setSecaoAtiva] = useState('perfil');

  // const getSecaoIcon = (secaoId: string) => {
  //   const icons = {
  //     'perfil': User,
  //     'notificacoes': Bell,
  //     'privacidade': Shield,
  //     'empresa': Building2,
  //     'equipe': Users,
  //     'planos': CreditCard,
  //     'integracao': Settings
  //   };
  //   return icons[secaoId as keyof typeof icons] || Settings;
  // };

  const renderSecaoContent = () => {
    switch (secaoAtiva) {
      case 'perfil':
        return (
          <PerfilSection
            perfil={perfilUsuario}
            onSalvar={salvarPerfil}
            isLoading={isLoading}
          />
        );
      
      case 'notificacoes':
        return (
          <NotificacoesSection
            notificacoes={notificacoes}
            onSalvar={salvarNotificacoes}
            isLoading={isLoading}
          />
        );
      
      case 'empresa':
        return (
          <EmpresaSection
            empresa={configuracaoEmpresa}
            onSalvar={salvarEmpresa}
            isLoading={isLoading}
          />
        );
      
      case 'equipe':
        return <EquipeSection />;
      
      case 'planos':
        return <PlanosSection />;
      
      case 'privacidade':
        return (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Privacidade & Segurança</h3>
                  <p className="text-sm text-gray-400">Controle seus dados e privacidade</p>
                </div>
              </div>
              
              <div className="text-center py-12">
                <Shield className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h4 className="text-white font-medium mb-2">Em Desenvolvimento</h4>
                <p className="text-gray-400">
                  Configurações de privacidade serão implementadas em breve
                </p>
              </div>
            </CardContent>
          </Card>
        );
      

      
      default:
        return <div className="text-white">Seção não encontrada</div>;
    }
  };

  const getRoleLabel = (role: string) => {
    const roles = {
      'DONO': { label: 'Proprietário', color: 'bg-purple-900/20 text-purple-400 border-purple-700/30' },
      'ADMIN': { label: 'Administrador', color: 'bg-blue-900/20 text-blue-400 border-blue-700/30' },
      'AGENTE': { label: 'Corretor', color: 'bg-green-900/20 text-green-400 border-green-700/30' }
    };
    return roles[role as keyof typeof roles] || { label: role, color: 'bg-gray-900/20 text-gray-400 border-gray-700/30' };
  };

  const roleInfo = getRoleLabel(userRole || '');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge className={`${roleInfo.color} text-xs px-2 py-1`}>
              {roleInfo.label}
            </Badge>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-900/20 border border-red-700/30 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar de navegação */}
        <div className="lg:col-span-1">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-4">
              <nav className="space-y-2">
                {secoesDisponiveis.map((secao) => {
                  // const Icon = getSecaoIcon(secao.id);
                  const isActive = secaoAtiva === secao.id;
                  
                  return (
                    <button
                      key={secao.id}
                      onClick={() => setSecaoAtiva(secao.id)}
                      className={`
                        w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors
                        ${isActive 
                          ? 'bg-blue-600/20 border border-blue-500/30 text-blue-400' 
                          : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                        }
                      `}
                    >
                      <span className="text-lg">{secao.icone}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium truncate ${isActive ? 'text-blue-400' : 'text-gray-300'}`}>
                          {secao.titulo}
                        </p>
                        <p className={`text-xs truncate ${isActive ? 'text-blue-300' : 'text-gray-500'}`}>
                          {secao.descricao}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Conteúdo da seção */}
        <div className="lg:col-span-3">
          {renderSecaoContent()}
        </div>
      </div>
    </div>
  );
};

export const ConfiguracoesPage: React.FC = () => {
  return (
    <DashboardLayout title="Configurações">
      <ConfiguracoesContent />
    </DashboardLayout>
  );
};
