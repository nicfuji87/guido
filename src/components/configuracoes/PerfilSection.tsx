import React, { useState } from 'react';
import { User, Save, Edit } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { PerfilUsuario } from '@/types/configuracoes';
import { useViewContext } from '@/hooks/useViewContext';

interface PerfilSectionProps {
  perfil: PerfilUsuario;
  onSalvar: (perfil: Partial<PerfilUsuario>) => Promise<boolean>;
  isLoading?: boolean;
}

export const PerfilSection: React.FC<PerfilSectionProps> = ({
  perfil,
  onSalvar,
  isLoading = false
}) => {
  const { userRole } = useViewContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editedPerfil, setEditedPerfil] = useState<PerfilUsuario>(perfil);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = () => {
    setEditedPerfil(perfil);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedPerfil(perfil);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const sucesso = await onSalvar(editedPerfil);
    if (sucesso) {
      setIsEditing(false);
    }
    setIsSaving(false);
  };

  const handleChange = (field: keyof PerfilUsuario, value: string) => {
    setEditedPerfil(prev => ({
      ...prev,
      [field]: value
    }));
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

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Perfil Pessoal</h3>
              <p className="text-sm text-gray-400">Suas informações profissionais</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge className={`${roleInfo.color} text-xs px-3 py-1`}>
              {roleInfo.label}
            </Badge>
            
            {!isEditing ? (
              <Button
                size="sm"
                variant="outline"
                onClick={handleEdit}
                disabled={isLoading}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-white">
              Nome Completo *
            </Label>
            {isEditing ? (
              <Input
                id="nome"
                value={editedPerfil.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                className="bg-gray-900 border-gray-600 text-white"
                placeholder="Seu nome completo"
                disabled={isSaving}
              />
            ) : (
              <div className="p-3 bg-gray-900/50 rounded-md text-white">
                {perfil.nome || 'Não informado'}
              </div>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              E-mail
            </Label>
            <div className="p-3 bg-gray-900/30 rounded-md text-gray-400 border border-gray-600">
              {perfil.email}
              <span className="text-xs text-gray-500 block mt-1">
                Não é possível alterar o e-mail
              </span>
            </div>
          </div>

          {/* Telefone (WhatsApp) */}
          <div className="space-y-2">
            <Label htmlFor="telefone" className="text-white">
              WhatsApp
            </Label>
            <div className="p-3 bg-gray-900/30 rounded-md text-gray-400 border border-gray-600">
              {perfil.telefone || 'Não informado'}
              <span className="text-xs text-gray-500 block mt-1">
                WhatsApp conectado - não é possível alterar
              </span>
            </div>
          </div>

          {/* CRECI */}
          <div className="space-y-2">
            <Label htmlFor="creci" className="text-white">
              CRECI
            </Label>
            {isEditing ? (
              <Input
                id="creci"
                value={editedPerfil.creci || ''}
                onChange={(e) => handleChange('creci', e.target.value)}
                className="bg-gray-900 border-gray-600 text-white"
                placeholder="CRECI/SP 123456"
                disabled={isSaving}
              />
            ) : (
              <div className="p-3 bg-gray-900/50 rounded-md text-white">
                {perfil.creci || 'Não informado'}
              </div>
            )}
          </div>
        </div>

        {/* Informações adicionais */}
        <div className="mt-6 p-4 bg-blue-900/10 border border-blue-700/30 rounded-lg">
          <h4 className="text-blue-400 font-medium mb-2">ℹ️ Informações Importantes</h4>
          <ul className="text-sm text-blue-300 space-y-1">
            <li>• O e-mail não pode ser alterado após o cadastro</li>
            <li>• Mantenha seus dados atualizados para melhor experiência</li>
            <li>• O CRECI é importante para validação profissional</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
