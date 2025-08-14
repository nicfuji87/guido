import React, { useState } from 'react';
import { Bell, Save, Smartphone, Mail, Monitor } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { ConfiguracaoNotificacao } from '@/types/configuracoes';

interface NotificacoesSectionProps {
  notificacoes: ConfiguracaoNotificacao;
  onSalvar: (notificacoes: Partial<ConfiguracaoNotificacao>) => Promise<boolean>;
  isLoading?: boolean;
}

export const NotificacoesSection: React.FC<NotificacoesSectionProps> = ({
  notificacoes,
  onSalvar,
  isLoading = false
}) => {
  const [editedNotificacoes, setEditedNotificacoes] = useState<ConfiguracaoNotificacao>(notificacoes);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await onSalvar(editedNotificacoes);
    setIsSaving(false);
  };

  const handleToggle = (field: keyof ConfiguracaoNotificacao) => {
    setEditedNotificacoes(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const ToggleSwitch: React.FC<{
    checked: boolean;
    onChange: () => void;
    disabled?: boolean;
  }> = ({ checked, onChange, disabled = false }) => (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors
        ${checked 
          ? 'bg-blue-600 hover:bg-blue-700' 
          : 'bg-gray-600 hover:bg-gray-500'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          ${checked ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  );

  const canaisNotificacao = [
    {
      id: 'email',
      titulo: 'E-mail',
      descricao: 'Receber notificações por e-mail',
      icon: Mail,
      valor: editedNotificacoes.email
    },
    {
      id: 'whatsapp',
      titulo: 'WhatsApp',
      descricao: 'Receber notificações via WhatsApp',
      icon: Smartphone,
      valor: editedNotificacoes.whatsapp
    },
    {
      id: 'push',
      titulo: 'Push (Navegador)',
      descricao: 'Notificações do navegador em tempo real',
      icon: Monitor,
      valor: editedNotificacoes.push
    }
  ];

  const tiposNotificacao = [
    {
      id: 'novoCliente',
      titulo: 'Novo Cliente',
      descricao: 'Quando um novo lead chegar pelo WhatsApp',
      valor: editedNotificacoes.novoCliente
    },
    {
      id: 'lembreteVencido',
      titulo: 'Lembretes Vencidos',
      descricao: 'Quando um lembrete está atrasado',
      valor: editedNotificacoes.lembreteVencido
    },
    {
      id: 'conversaPendente',
      titulo: 'Conversas Pendentes',
      descricao: 'Quando há mensagens não respondidas',
      valor: editedNotificacoes.conversaPendente
    },
    {
      id: 'relatorioSemanal',
      titulo: 'Relatório Semanal',
      descricao: 'Resumo semanal de atividades e métricas',
      valor: editedNotificacoes.relatorioSemanal
    }
  ];

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Notificações</h3>
              <p className="text-sm text-gray-400">Configure como receber alertas</p>
            </div>
          </div>
          
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>

        <div className="space-y-8">
          {/* Canais de Notificação */}
          <div>
            <h4 className="text-white font-medium mb-4">Canais de Notificação</h4>
            <div className="space-y-4">
              {canaisNotificacao.map((canal) => {
                const Icon = canal.icon;
                return (
                  <div
                    key={canal.id}
                    className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-gray-400" />
                      <div>
                        <Label className="text-white font-medium">
                          {canal.titulo}
                        </Label>
                        <p className="text-sm text-gray-400">
                          {canal.descricao}
                        </p>
                      </div>
                    </div>
                    <ToggleSwitch
                      checked={canal.valor}
                      onChange={() => handleToggle(canal.id as keyof ConfiguracaoNotificacao)}
                      disabled={isSaving}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tipos de Notificação */}
          <div>
            <h4 className="text-white font-medium mb-4">Tipos de Notificação</h4>
            <div className="space-y-4">
              {tiposNotificacao.map((tipo) => (
                <div
                  key={tipo.id}
                  className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700"
                >
                  <div>
                    <Label className="text-white font-medium">
                      {tipo.titulo}
                    </Label>
                    <p className="text-sm text-gray-400">
                      {tipo.descricao}
                    </p>
                  </div>
                  <ToggleSwitch
                    checked={tipo.valor}
                    onChange={() => handleToggle(tipo.id as keyof ConfiguracaoNotificacao)}
                    disabled={isSaving}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Informações adicionais */}
          <div className="p-4 bg-yellow-900/10 border border-yellow-700/30 rounded-lg">
            <h4 className="text-yellow-400 font-medium mb-2">⚡ Dicas de Notificação</h4>
            <ul className="text-sm text-yellow-300 space-y-1">
              <li>• WhatsApp é o canal mais rápido para alertas urgentes</li>
              <li>• E-mail é ideal para relatórios e resumos detalhados</li>
              <li>• Notificações push funcionam apenas quando o navegador está aberto</li>
              <li>• Você pode desativar notificações temporariamente</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
