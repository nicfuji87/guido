import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, User, Phone, Loader2, CheckCircle, Building, UserCheck, AlertCircle, CreditCard, Shield, MapPin, Home, Hash } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { useSignup } from '@/hooks/useSignup';
import { useWhatsAppValidation } from '@/hooks/useWhatsAppValidation';
import { useAssinatura, Plano } from '@/hooks/useAssinatura';
import { formatCPF, validateCPF, isCPFFormatComplete } from '@/utils/cpfUtils';
import { formatCEP, validateCEP, isCEPFormatComplete, buscarEnderecoPorCEP } from '@/utils/cepUtils';

// AI dev note: Modal de cadastro integrado com sistema de assinaturas
// Mostra planos dinâmicos do banco e cria trial de 7 dias automaticamente

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  skipPlanSelection?: boolean;
  defaultPlan?: AccountType;
}

type AccountType = 'INDIVIDUAL' | 'IMOBILIARIA';

interface FormData {
  nome: string;
  email: string;
  whatsapp: string;
  cpf: string;
  tipo_conta: AccountType;
  nome_empresa?: string;
  plano_codigo?: string;
  // Campos de endereço
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  numero_residencia: string;
  complemento_endereco: string;
}

interface FormErrors {
  nome?: string;
  email?: string;
  whatsapp?: string;
  cpf?: string;
  nome_empresa?: string;
  cep?: string;
  numero_residencia?: string;
}

interface ValidationStates {
  whatsapp: 'idle' | 'validating' | 'valid' | 'invalid';
  cpf: 'idle' | 'valid' | 'invalid';
  cep: 'idle' | 'validating' | 'valid' | 'invalid';
}

// Planos são carregados dinamicamente via useAssinatura

export const SignupModal: React.FC<SignupModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  skipPlanSelection = false, 
  defaultPlan = 'INDIVIDUAL' 
}) => {
  const [step, setStep] = useState<'plan' | 'form' | 'loading' | 'success' | 'error'>('plan');
  const [selectedPlan, setSelectedPlan] = useState<Plano | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    whatsapp: '',
    cpf: '',
    tipo_conta: 'INDIVIDUAL',
    cep: '',
    logradouro: '',
    bairro: '',
    localidade: '',
    uf: '',
    numero_residencia: '',
    complemento_endereco: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [validationStates, setValidationStates] = useState<ValidationStates>({
    whatsapp: 'idle',
    cpf: 'idle',
    cep: 'idle'
  });
  
  const { signup, isLoading, error: signupError, clearError } = useSignup();
  const { validateWhatsApp } = useWhatsAppValidation();
  const { planos, isLoading: planosLoading } = useAssinatura();

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen) {
      const initialStep = skipPlanSelection ? 'form' : 'plan';
      setStep(initialStep);
      
      // Selecionar plano padrão baseado no tipo
      const planosPorTipo = planos.filter(p => p.tipo_plano === defaultPlan);
      const planoDefault = planosPorTipo[0] || null;
      setSelectedPlan(planoDefault);
      
      setFormData({
        nome: '',
        email: '',
        whatsapp: '',
        cpf: '',
        tipo_conta: defaultPlan,
        plano_codigo: planoDefault?.codigo_externo,
        cep: '',
        logradouro: '',
        bairro: '',
        localidade: '',
        uf: '',
        numero_residencia: '',
        complemento_endereco: ''
      });
      setErrors({});
      setValidationStates({
        whatsapp: 'idle',
        cpf: 'idle',
        cep: 'idle'
      });
      clearError();
    }
  }, [isOpen, skipPlanSelection, defaultPlan, clearError, planos]);

  // Função para obter planos por tipo
  const getPlanosPorTipo = (tipo: AccountType): Plano[] => {
    return planos.filter(plano => plano.tipo_plano === tipo);
  };

  // Função para formatar preço
  const formatarPreco = (preco: number, ciclo: 'mensal' | 'anual' = 'mensal'): string => {
    const valor = ciclo === 'anual' ? preco * 12 : preco;
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
    return `${formatted}/${ciclo === 'anual' ? 'ano' : 'mês'}`;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'WhatsApp é obrigatório';
    } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.whatsapp)) {
      newErrors.whatsapp = 'Formato: (11) 99999-9999';
    } else if (validationStates.whatsapp === 'invalid') {
      newErrors.whatsapp = 'Número do WhatsApp inválido';
    } else if (validationStates.whatsapp === 'validating') {
      newErrors.whatsapp = 'Aguarde a validação do WhatsApp';
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!isCPFFormatComplete(formData.cpf)) {
      newErrors.cpf = 'CPF incompleto';
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    if (formData.tipo_conta === 'IMOBILIARIA' && !formData.nome_empresa?.trim()) {
      newErrors.nome_empresa = 'Nome da empresa é obrigatório';
    }

    if (!formData.cep.trim()) {
      newErrors.cep = 'CEP é obrigatório';
    } else if (!isCEPFormatComplete(formData.cep)) {
      newErrors.cep = 'CEP incompleto';
    } else if (!validateCEP(formData.cep)) {
      newErrors.cep = 'CEP inválido';
    } else if (validationStates.cep === 'invalid') {
      newErrors.cep = 'CEP não encontrado';
    } else if (validationStates.cep === 'validating') {
      newErrors.cep = 'Aguarde a validação do CEP';
    }

    if (!formData.numero_residencia.trim()) {
      newErrors.numero_residencia = 'Número da residência é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatWhatsApp = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara (11) 99999-9999
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  // Debounced WhatsApp validation
  const validateWhatsAppDebounced = useCallback(
    async (phone: string) => {
      if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(phone)) {
        setValidationStates(prev => ({ ...prev, whatsapp: 'idle' }));
        return;
      }

      setValidationStates(prev => ({ ...prev, whatsapp: 'validating' }));
      
      try {
        const result = await validateWhatsApp(phone);
        setValidationStates(prev => ({ 
          ...prev, 
          whatsapp: result.isValid ? 'valid' : 'invalid' 
        }));
        
        if (!result.isValid && result.error) {
          setErrors(prev => ({ ...prev, whatsapp: result.error }));
        }
      } catch (error) {
        setValidationStates(prev => ({ ...prev, whatsapp: 'invalid' }));
      }
    },
    [validateWhatsApp]
  );

  // Debounced CEP validation and address lookup
  const validateCEPDebounced = useCallback(
    async (cep: string) => {
      if (!isCEPFormatComplete(cep)) {
        setValidationStates(prev => ({ ...prev, cep: 'idle' }));
        return;
      }

      if (!validateCEP(cep)) {
        setValidationStates(prev => ({ ...prev, cep: 'invalid' }));
        setErrors(prev => ({ ...prev, cep: 'CEP inválido' }));
        return;
      }

      setValidationStates(prev => ({ ...prev, cep: 'validating' }));
      
      try {
        const endereco = await buscarEnderecoPorCEP(cep);
        setValidationStates(prev => ({ ...prev, cep: 'valid' }));
        
        // Auto-completar campos de endereço
        setFormData(prev => ({
          ...prev,
          logradouro: endereco.logradouro || '',
          bairro: endereco.bairro || '',
          localidade: endereco.localidade || '',
          uf: endereco.uf || ''
        }));
        
        // Limpar erro se havia
        setErrors(prev => ({ ...prev, cep: undefined }));
      } catch (error) {
        setValidationStates(prev => ({ ...prev, cep: 'invalid' }));
        const errorMessage = error instanceof Error ? error.message : 'Erro ao validar CEP';
        setErrors(prev => ({ ...prev, cep: errorMessage }));
      }
    },
    []
  );

  // Debounce timer for WhatsApp validation
  React.useEffect(() => {
    if (formData.whatsapp && /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(formData.whatsapp)) {
      const timer = setTimeout(() => {
        validateWhatsAppDebounced(formData.whatsapp);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [formData.whatsapp, validateWhatsAppDebounced]);

  // Debounce timer for CEP validation
  React.useEffect(() => {
    if (formData.cep && isCEPFormatComplete(formData.cep)) {
      const timer = setTimeout(() => {
        validateCEPDebounced(formData.cep);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [formData.cep, validateCEPDebounced]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    if (field === 'whatsapp') {
      value = formatWhatsApp(value);
      // Reset WhatsApp validation state when typing
      setValidationStates(prev => ({ ...prev, whatsapp: 'idle' }));
    }
    
    if (field === 'cpf') {
      value = formatCPF(value);
      // Validate CPF in real-time
      if (isCPFFormatComplete(value)) {
        setValidationStates(prev => ({ 
          ...prev, 
          cpf: validateCPF(value) ? 'valid' : 'invalid' 
        }));
      } else {
        setValidationStates(prev => ({ ...prev, cpf: 'idle' }));
      }
    }

    if (field === 'cep') {
      value = formatCEP(value);
      // Reset CEP validation state when typing
      setValidationStates(prev => ({ ...prev, cep: 'idle' }));
      // Limpar campos de endereço quando CEP muda
      if (formData.cep !== value) {
        setFormData(prev => ({
          ...prev,
          logradouro: '',
          bairro: '',
          localidade: '',
          uf: ''
        }));
      }
    }

    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (field in errors) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePlanSelect = (plano: Plano) => {
    // Plano selecionado para upgrade
    setSelectedPlan(plano);
    setFormData(prev => ({ 
      ...prev, 
      tipo_conta: plano.tipo_plano,
      plano_codigo: plano.codigo_externo
    }));
    setStep('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setStep('loading');

    try {
      const result = await signup(formData);
      
      if (result.success) {
        setStep('success');
        
        // Auto-close after success and redirect to login
        setTimeout(() => {
          onClose();
          onSuccess?.();
          // Redirecionar para tela de login após cadastro bem-sucedido
          window.location.href = '/login';
        }, 2500);
      } else {
        setStep('error');
      }
      
    } catch (error) {
      // Erro no cadastro - error contém detalhes
      setStep('error');
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: 'spring', damping: 25, stiffness: 300 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50,
      transition: { duration: 0.2 }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto px-2 sm:px-0"
        >
          <Card className="bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border/50">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-foreground">
                  {step === 'plan' && 'Escolha seu Plano'}
                  {step === 'form' && 'Criar Conta'}
                  {step === 'loading' && 'Criando sua conta...'}
                  {step === 'success' && 'Bem-vindo!'}
                  {step === 'error' && 'Ops! Algo deu errado'}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {step === 'plan' && 'Teste grátis por 7 dias, sem cartão'}
                  {step === 'form' && '7 dias grátis + acesso imediato'}
                  {step === 'loading' && 'Preparando sua experiência...'}
                  {step === 'success' && 'Conta criada com sucesso!'}
                  {step === 'error' && 'Vamos tentar novamente'}
                </p>
              </div>
              
              {step !== 'loading' && step !== 'success' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
              <AnimatePresence>
                {/* Plan Selection */}
                {step === 'plan' && (
                  <motion.div
                    key="plan"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-4"
                  >
                    {planosLoading ? (
                      <div className="space-y-4">
                        {[1, 2].map((i) => (
                          <div key={i} className="p-4 rounded-xl border-2 animate-pulse">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
                                <div>
                                  <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
                                  <div className="h-3 w-16 bg-gray-200 rounded"></div>
                                </div>
                              </div>
                              <div className="h-6 w-20 bg-gray-200 rounded"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        {/* Planos Individuais */}
                        {getPlanosPorTipo('INDIVIDUAL').map((plano) => (
                          <div
                            key={plano.id}
                            onClick={() => handlePlanSelect(plano)}
                            className={cn(
                              "p-4 rounded-xl border-2 cursor-pointer transition-all",
                              "hover:border-primary/50 hover:bg-primary/5",
                              selectedPlan?.id === plano.id && "border-primary bg-primary/10"
                            )}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                  <UserCheck className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-foreground">{plano.nome_plano}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {plano.limite_corretores === 1 ? '1 corretor' : `Até ${plano.limite_corretores} corretores`}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge variant="secondary">{formatarPreco(plano.preco_mensal)}</Badge>
                                {plano.preco_anual && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    ou {formatarPreco(plano.preco_anual / 12, 'anual')}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            {plano.descricao && (
                              <p className="text-sm text-muted-foreground mt-2">{plano.descricao}</p>
                            )}
                            
                            {/* Features do plano */}
                            {plano.recursos && Object.keys(plano.recursos).length > 0 && (
                              <ul className="mt-3 space-y-1">
                                {Object.entries(plano.recursos).map(([key, value], idx) => {
                                  if (value === true) {
                                    const featureName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                                    return (
                                      <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                                        <CheckCircle className="w-3 h-3 text-primary" />
                                        {featureName}
                                      </li>
                                    );
                                  }
                                  return null;
                                })}
                              </ul>
                            )}
                          </div>
                        ))}

                        {/* Planos para Imobiliária */}
                        {getPlanosPorTipo('IMOBILIARIA').map((plano) => (
                          <div
                            key={plano.id}
                            onClick={() => handlePlanSelect(plano)}
                            className={cn(
                              "p-4 rounded-xl border-2 cursor-pointer transition-all",
                              "hover:border-primary/50 hover:bg-primary/5",
                              selectedPlan?.id === plano.id && "border-primary bg-primary/10"
                            )}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10">
                                  <Building className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-foreground">{plano.nome_plano}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {plano.limite_corretores === 999999 
                                      ? 'Corretores ilimitados' 
                                      : `Até ${plano.limite_corretores} corretores`
                                    }
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge variant="secondary">{formatarPreco(plano.preco_mensal)}</Badge>
                                <p className="text-xs text-muted-foreground mt-1">por corretor</p>
                                {plano.preco_anual && (
                                  <p className="text-xs text-muted-foreground">
                                    ou {formatarPreco(plano.preco_anual / 12, 'anual')}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            {plano.descricao && (
                              <p className="text-sm text-muted-foreground mt-2">{plano.descricao}</p>
                            )}
                            
                            {/* Features do plano */}
                            {plano.recursos && Object.keys(plano.recursos).length > 0 && (
                              <ul className="mt-3 space-y-1">
                                {Object.entries(plano.recursos).map(([key, value], idx) => {
                                  if (value === true) {
                                    const featureName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                                    return (
                                      <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                                        <CheckCircle className="w-3 h-3 text-primary" />
                                        {featureName}
                                      </li>
                                    );
                                  }
                                  return null;
                                })}
                              </ul>
                            )}
                          </div>
                        ))}
                      </>
                    )}
                  </motion.div>
                )}

                {/* Form */}
                {step === 'form' && (
                  <motion.form
                    key="form"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onSubmit={handleSubmit}
                    className="space-y-3"
                  >
                    {/* Selected Plan Badge */}
                    <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
                      {formData.tipo_conta === 'INDIVIDUAL' ? (
                        <UserCheck className="w-4 h-4 text-primary" />
                      ) : (
                        <Building className="w-4 h-4 text-primary" />
                      )}
                      <span className="text-sm font-medium text-primary">
                        {selectedPlan?.nome_plano || 'Plano selecionado'} - 7 dias grátis
                      </span>
                      <button
                        type="button"
                        onClick={() => setStep('plan')}
                        className="ml-auto text-xs text-primary hover:underline"
                      >
                        Alterar
                      </button>
                    </div>

                    {/* Nome */}
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome completo</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="nome"
                          placeholder="Seu nome completo"
                          value={formData.nome}
                          onChange={(e) => handleInputChange('nome', e.target.value)}
                          className={cn("pl-10", errors.nome && "border-red-500")}
                        />
                      </div>
                      {errors.nome && <p className="text-xs text-red-500">{errors.nome}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={cn("pl-10", errors.email && "border-red-500")}
                        />
                      </div>
                      {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                    </div>

                    {/* WhatsApp */}
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="whatsapp"
                          placeholder="(11) 99999-9999"
                          value={formData.whatsapp}
                          onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                          className={cn(
                            "pl-10 pr-10", 
                            errors.whatsapp && "border-red-500",
                            validationStates.whatsapp === 'valid' && "border-green-500",
                            validationStates.whatsapp === 'invalid' && "border-red-500"
                          )}
                          maxLength={15}
                        />
                        {/* Validation indicator */}
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {validationStates.whatsapp === 'validating' && (
                            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                          )}
                          {validationStates.whatsapp === 'valid' && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                          {validationStates.whatsapp === 'invalid' && (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      </div>
                      {errors.whatsapp && <p className="text-xs text-red-500">{errors.whatsapp}</p>}
                      {validationStates.whatsapp === 'valid' && !errors.whatsapp && (
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          WhatsApp verificado
                        </p>
                      )}
                    </div>

                    {/* CPF */}
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="cpf"
                          placeholder="123.456.789-00"
                          value={formData.cpf}
                          onChange={(e) => handleInputChange('cpf', e.target.value)}
                          className={cn(
                            "pl-10 pr-10", 
                            errors.cpf && "border-red-500",
                            validationStates.cpf === 'valid' && "border-green-500",
                            validationStates.cpf === 'invalid' && "border-red-500"
                          )}
                          maxLength={14}
                        />
                        {/* Validation indicator */}
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {validationStates.cpf === 'valid' && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                          {validationStates.cpf === 'invalid' && (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      </div>
                      {errors.cpf && <p className="text-xs text-red-500">{errors.cpf}</p>}
                      {validationStates.cpf === 'valid' && !errors.cpf && (
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          CPF válido
                        </p>
                      )}
                    </div>

                    {/* CEP */}
                    <div className="space-y-2">
                      <Label htmlFor="cep">CEP</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="cep"
                          placeholder="00000-000"
                          value={formData.cep}
                          onChange={(e) => handleInputChange('cep', e.target.value)}
                          className={cn(
                            "pl-10 pr-10", 
                            errors.cep && "border-red-500",
                            validationStates.cep === 'valid' && "border-green-500",
                            validationStates.cep === 'invalid' && "border-red-500"
                          )}
                          maxLength={9}
                        />
                        {/* Validation indicator */}
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {validationStates.cep === 'validating' && (
                            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                          )}
                          {validationStates.cep === 'valid' && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                          {validationStates.cep === 'invalid' && (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                      </div>
                      {errors.cep && <p className="text-xs text-red-500">{errors.cep}</p>}
                      {validationStates.cep === 'valid' && !errors.cep && (
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Endereço encontrado
                        </p>
                      )}
                    </div>

                    {/* Campos de endereço auto-completados (read-only) */}
                    {(formData.logradouro || formData.bairro || formData.localidade) && (
                      <div className="space-y-2">
                        <Label>Endereço</Label>
                        <div className="grid grid-cols-1 gap-2">
                          {formData.logradouro && (
                            <Input
                              value={formData.logradouro}
                              placeholder="Logradouro"
                              readOnly
                              className="bg-muted/50 text-muted-foreground"
                            />
                          )}
                          <div className="grid grid-cols-2 gap-2">
                            {formData.bairro && (
                              <Input
                                value={formData.bairro}
                                placeholder="Bairro"
                                readOnly
                                className="bg-muted/50 text-muted-foreground"
                              />
                            )}
                            {formData.localidade && formData.uf && (
                              <Input
                                value={`${formData.localidade} - ${formData.uf}`}
                                placeholder="Cidade - UF"
                                readOnly
                                className="bg-muted/50 text-muted-foreground"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Número da Residência */}
                    <div className="space-y-2">
                      <Label htmlFor="numero_residencia">Número da Residência</Label>
                      <div className="relative">
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="numero_residencia"
                          placeholder="123"
                          value={formData.numero_residencia}
                          onChange={(e) => handleInputChange('numero_residencia', e.target.value)}
                          className={cn("pl-10", errors.numero_residencia && "border-red-500")}
                        />
                      </div>
                      {errors.numero_residencia && <p className="text-xs text-red-500">{errors.numero_residencia}</p>}
                    </div>

                    {/* Complemento do Endereço */}
                    <div className="space-y-2">
                      <Label htmlFor="complemento_endereco">Complemento (opcional)</Label>
                      <div className="relative">
                        <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="complemento_endereco"
                          placeholder="Apartamento, bloco, etc."
                          value={formData.complemento_endereco}
                          onChange={(e) => handleInputChange('complemento_endereco', e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    {/* Nome da Empresa (apenas para Imobiliária) */}
                    {formData.tipo_conta === 'IMOBILIARIA' && (
                      <div className="space-y-2">
                        <Label htmlFor="nome_empresa">Nome da Imobiliária</Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="nome_empresa"
                            placeholder="Nome da sua imobiliária"
                            value={formData.nome_empresa || ''}
                            onChange={(e) => handleInputChange('nome_empresa', e.target.value)}
                            className={cn("pl-10", errors.nome_empresa && "border-red-500")}
                          />
                        </div>
                        {errors.nome_empresa && <p className="text-xs text-red-500">{errors.nome_empresa}</p>}
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Criando conta...
                        </>
                      ) : (
                        'Começar teste grátis'
                      )}
                    </Button>

                                         {/* Login Link */}
                     <div className="text-center text-sm text-muted-foreground">
                       Já tem uma conta?{" "}
                       <a href="/login" className="text-primary hover:underline">
                         Entrar
                       </a>
                     </div>

                    {/* Terms */}
                    <p className="text-xs text-muted-foreground text-center">
                      Ao continuar, você concorda com nossos{' '}
                      <a href="#" className="text-primary hover:underline">Termos de Uso</a>
                      {' '}e{' '}
                      <a href="#" className="text-primary hover:underline">Política de Privacidade</a>
                    </p>
                  </motion.form>
                )}

                {/* Loading */}
                {step === 'loading' && (
                  <motion.div
                    key="loading"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="text-center py-8"
                  >
                    <div className="flex justify-center mb-4">
                      <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    </div>
                    <p className="text-muted-foreground">
                      Configurando sua conta e período de teste...
                    </p>
                  </motion.div>
                )}

                {/* Success */}
                {step === 'success' && (
                  <motion.div
                    key="success"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="text-center py-8"
                  >
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Conta criada com sucesso!
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Seu teste grátis de 7 dias começou agora. Faça login para acessar sua conta.
                    </p>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                      Redirecionando para o login...
                    </Badge>
                  </motion.div>
                )}

                {/* Error */}
                {step === 'error' && (
                  <motion.div
                    key="error"
                    variants={stepVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="text-center py-8"
                  >
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Não foi possível criar sua conta
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {signupError || 'Tente novamente em alguns instantes'}
                    </p>
                    <div className="space-y-3">
                      <Button
                        onClick={() => setStep('form')}
                        className="w-full"
                      >
                        Tentar novamente
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={onClose}
                        className="w-full"
                      >
                        Fechar
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
