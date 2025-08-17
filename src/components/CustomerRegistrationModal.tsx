// AI dev note: Modal simplificado para cadastro de cliente via webhook n8n

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCustomerProvisioning } from '@/hooks/useCustomerProvisioning';
import { CustomerData } from '@/services/webhookService';

interface CustomerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (customerId: string) => void;
  assinaturaId: string;
  userId: string;
  initialData?: {
    nome?: string;
    email?: string;
    documento?: string;
  };
}

export const CustomerRegistrationModal: React.FC<CustomerRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  assinaturaId,
  userId,
  initialData
}) => {
  const { provisionCustomer, isLoading } = useCustomerProvisioning();
  
  const [formData, setFormData] = useState({
    nome: initialData?.nome || '',
    email: initialData?.email || '',
    documento: initialData?.documento || '',
    telefone: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.documento.trim()) {
      newErrors.documento = 'CPF/CNPJ é obrigatório';
    } else {
      const documento = formData.documento.replace(/\D/g, '');
      if (documento.length !== 11 && documento.length !== 14) {
        newErrors.documento = 'CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // console.log('🔥 DEBUG - [CustomerRegistrationModal] Enviando dados para provisão');
    
    const customerData: CustomerData = {
      nome: formData.nome.trim(),
      email: formData.email.trim(),
      documento: formData.documento.replace(/\D/g, ''), // Só números
      telefone: formData.telefone.trim(),
      userId,
      assinaturaId
    };
    
    try {
      const result = await provisionCustomer(customerData);
      
      if (result.success && result.customerId) {
        // console.log('🔥 DEBUG - [CustomerRegistrationModal] ✅ Cadastro realizado com sucesso');
        onSuccess(result.customerId);
        onClose();
      } else {
        // console.error('🔥 DEBUG - [CustomerRegistrationModal] ❌ Falha no cadastro:', result.error);
        setErrors({ submit: result.error || 'Erro no cadastro' });
      }
    } catch (error) {
      // console.error('🔥 DEBUG - [CustomerRegistrationModal] ❌ Erro crítico:', error);
      setErrors({ submit: 'Erro inesperado no cadastro' });
    }
  };

  const formatDocument = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 11) {
      // CPF: 000.000.000-00
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')  
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    } else {
      // CNPJ: 00.000.000/0000-00
      return numbers
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Cadastro de Cliente
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            Para processar pagamentos, precisamos cadastrar seus dados no sistema Asaas.
          </div>
          
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome / Razão Social *
            </label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.nome ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Digite o nome ou razão social"
              disabled={isLoading}
            />
            {errors.nome && <p className="text-red-500 text-xs mt-1">{errors.nome}</p>}
          </div>
          
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Digite o email"
              disabled={isLoading}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          
          {/* Documento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CPF / CNPJ *
            </label>
            <input
              type="text"
              value={formData.documento}
              onChange={(e) => setFormData(prev => ({ ...prev, documento: formatDocument(e.target.value) }))}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.documento ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="000.000.000-00 ou 00.000.000/0000-00"
              disabled={isLoading}
            />
            {errors.documento && <p className="text-red-500 text-xs mt-1">{errors.documento}</p>}
          </div>
          
          {/* Telefone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefone
            </label>
            <input
              type="text"
              value={formData.telefone}
              onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="(00) 00000-0000"
              disabled={isLoading}
            />
          </div>
          
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}
          
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
