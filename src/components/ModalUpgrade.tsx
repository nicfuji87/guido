import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CreditCard, 
  QrCode, 
  FileText, 
  Crown,
  Check,
  Loader2,
  AlertCircle,
  Building,
  UserCheck,
  Calendar,
  Calculator
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { useAssinatura, Plano } from '@/hooks/useAssinatura';
import { useAsaasPayments, PaymentIntent } from '@/hooks/useAsaasPayments';

// AI dev note: Modal de upgrade com seleção de planos e métodos de pagamento
// Integra com Asaas para processar pagamentos e ativar assinaturas
// Suporte completo para cartão, boleto e PIX

interface ModalUpgradeProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (result: any) => void;
  planoSugerido?: Plano | null; // Plano sugerido baseado no contexto
}

type PaymentMethod = 'CREDIT_CARD' | 'BOLETO' | 'PIX';
type BillingCycle = 'MONTHLY' | 'YEARLY';

interface CreditCardData {
  number: string;
  holderName: string;
  expiryDate: string; // MM/YY
  cvv: string;
}

interface AddressData {
  postalCode: string;
  addressNumber: string;
  addressComplement: string;
  phone: string;
}

const stepVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

export const ModalUpgrade: React.FC<ModalUpgradeProps> = ({
  isOpen,
  onClose,
  onSuccess,
  planoSugerido
}) => {
  const [step, setStep] = useState<'planos' | 'metodo' | 'cartao' | 'endereco' | 'processando' | 'sucesso' | 'erro'>('planos');
  const [selectedPlano, setSelectedPlano] = useState<Plano | null>(planoSugerido || null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('MONTHLY');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CREDIT_CARD');
  const [creditCardData, setCreditCardData] = useState<CreditCardData>({
    number: '',
    holderName: '',
    expiryDate: '',
    cvv: ''
  });
  const [addressData, setAddressData] = useState<AddressData>({
    postalCode: '',
    addressNumber: '',
    addressComplement: '',
    phone: ''
  });
  const [paymentResult, setPaymentResult] = useState<any>(null);

  const { planos, assinatura, status } = useAssinatura();
  const { processUpgrade, isProcessing, error, clearError } = useAsaasPayments();

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('planos');
      setSelectedPlano(planoSugerido || null);
      setBillingCycle('MONTHLY');
      setPaymentMethod('CREDIT_CARD');
      setCreditCardData({
        number: '',
        holderName: '',
        expiryDate: '',
        cvv: ''
      });
      setAddressData({
        postalCode: '',
        addressNumber: '',
        addressComplement: '',
        phone: ''
      });
      setPaymentResult(null);
      clearError();
    }
  }, [isOpen, planoSugerido, clearError]);

  // Função para filtrar planos disponíveis
  const getPlanosDisponiveis = (): Plano[] => {
    if (!assinatura) return planos;
    
    // Para upgrades, mostrar apenas planos superiores ao atual
    const planoAtual = assinatura.plano;
    return planos.filter(plano => {
      if (plano.tipo_plano !== planoAtual.tipo_plano) return false;
      return plano.preco_mensal > planoAtual.preco_mensal;
    });
  };

  const formatPrice = (price: number, cycle: BillingCycle = 'MONTHLY'): string => {
    const value = cycle === 'YEARLY' ? price * 12 : price;
    const suffix = cycle === 'YEARLY' ? '/ano' : '/mês';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value) + suffix;
  };

  const calculateDiscount = (plano: Plano): number => {
    if (!plano.preco_anual) return 0;
    const anualPorMes = plano.preco_anual / 12;
    const economia = plano.preco_mensal - anualPorMes;
    return Math.round((economia / plano.preco_mensal) * 100);
  };

  const formatCardNumber = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  };

  const formatExpiryDate = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return numbers.substring(0, 2) + '/' + numbers.substring(2, 4);
    }
    return numbers;
  };

  const handleContinueToPayment = () => {
    if (!selectedPlano) return;
    setStep('metodo');
  };

  const handleSelectPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethod(method);
    
    if (method === 'CREDIT_CARD') {
      setStep('cartao');
    } else {
      // Para boleto e PIX, ir direto para processamento
      handleProcessPayment();
    }
  };

  const handleCreditCardNext = () => {
    // Validar dados do cartão
    if (!creditCardData.number || !creditCardData.holderName || 
        !creditCardData.expiryDate || !creditCardData.cvv) {
      return;
    }
    setStep('endereco');
  };

  const handleProcessPayment = async () => {
    if (!selectedPlano || !assinatura) return;

    setStep('processando');

    try {
      const paymentIntent: PaymentIntent = {
        plano: selectedPlano,
        ciclo: billingCycle,
        metodo_pagamento: paymentMethod
      };

      // Adicionar dados do cartão se necessário
      if (paymentMethod === 'CREDIT_CARD') {
        const [month, year] = creditCardData.expiryDate.split('/');
        paymentIntent.dados_cartao = {
          holderName: creditCardData.holderName,
          number: creditCardData.number.replace(/\s/g, ''),
          expiryMonth: month,
          expiryYear: `20${year}`,
          ccv: creditCardData.cvv
        };

        // Dados do portador (assumindo que são os mesmos do usuário)
        paymentIntent.dados_portador = {
          name: creditCardData.holderName,
          email: assinatura.conta_id + '@exemplo.com', // TODO: buscar email real
          cpfCnpj: '00000000000', // TODO: buscar CPF real
          postalCode: addressData.postalCode.replace(/\D/g, ''),
          addressNumber: addressData.addressNumber,
          addressComplement: addressData.addressComplement,
          phone: addressData.phone.replace(/\D/g, ''),
          mobilePhone: addressData.phone.replace(/\D/g, '')
        };
      }

      const result = await processUpgrade(paymentIntent);
      
      if (result.success) {
        setPaymentResult(result);
        setStep('sucesso');
        setTimeout(() => {
          onSuccess?.(result);
          onClose();
        }, 3000);
      } else {
        setStep('erro');
      }

    } catch (err) {
      console.error('[ModalUpgrade] Erro ao processar pagamento:', err);
      setStep('erro');
    }
  };

  const handleClose = () => {
    if (step === 'processando') return; // Não permitir fechar durante processamento
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Crown className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {step === 'planos' && 'Escolha seu Plano'}
                {step === 'metodo' && 'Método de Pagamento'}
                {step === 'cartao' && 'Dados do Cartão'}
                {step === 'endereco' && 'Endereço de Cobrança'}
                {step === 'processando' && 'Processando Pagamento'}
                {step === 'sucesso' && 'Pagamento Realizado!'}
                {step === 'erro' && 'Erro no Pagamento'}
              </h2>
              {status?.isTrialExpirando && (
                <p className="text-sm text-amber-600">
                  Seu trial expira em {status.diasRestantes} dia{status.diasRestantes !== 1 ? 's' : ''}
                </p>
              )}
              {status?.isTrialExpirado && (
                <p className="text-sm text-red-600">
                  Seu trial expirou. Assine para continuar usando.
                </p>
              )}
            </div>
          </div>
          
          {step !== 'processando' && (
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <AnimatePresence mode="wait">
            {/* Seleção de Planos */}
            {step === 'planos' && (
              <motion.div
                key="planos"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                {/* Toggle Ciclo de Cobrança */}
                <div className="flex items-center justify-center">
                  <div className="bg-gray-100 p-1 rounded-lg flex">
                    <button
                      onClick={() => setBillingCycle('MONTHLY')}
                      className={cn(
                        'px-4 py-2 rounded-md text-sm font-medium transition-all',
                        billingCycle === 'MONTHLY'
                          ? 'bg-white text-primary shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      )}
                    >
                      Mensal
                    </button>
                    <button
                      onClick={() => setBillingCycle('YEARLY')}
                      className={cn(
                        'px-4 py-2 rounded-md text-sm font-medium transition-all',
                        billingCycle === 'YEARLY'
                          ? 'bg-white text-primary shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      )}
                    >
                      Anual
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        Economize até 20%
                      </span>
                    </button>
                  </div>
                </div>

                {/* Lista de Planos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getPlanosDisponiveis().map((plano) => {
                    const isSelected = selectedPlano?.id === plano.id;
                    const discount = calculateDiscount(plano);
                    
                    return (
                      <Card
                        key={plano.id}
                        className={cn(
                          'p-6 cursor-pointer transition-all border-2',
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-primary/50'
                        )}
                        onClick={() => setSelectedPlano(plano)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              {plano.tipo_plano === 'INDIVIDUAL' ? (
                                <UserCheck className="h-5 w-5 text-primary" />
                              ) : (
                                <Building className="h-5 w-5 text-primary" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {plano.nome_plano}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {plano.limite_corretores === 1 
                                  ? '1 corretor' 
                                  : plano.limite_corretores === 999999
                                    ? 'Ilimitado'
                                    : `Até ${plano.limite_corretores} corretores`
                                }
                              </p>
                            </div>
                          </div>
                          {isSelected && (
                            <Check className="h-5 w-5 text-primary" />
                          )}
                        </div>

                        {/* Preço */}
                        <div className="mb-4">
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-foreground">
                              {formatPrice(plano.preco_mensal, billingCycle)}
                            </span>
                            {billingCycle === 'YEARLY' && discount > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                -{discount}%
                              </Badge>
                            )}
                          </div>
                          {billingCycle === 'YEARLY' && plano.preco_anual && (
                            <p className="text-sm text-muted-foreground">
                              {formatPrice(plano.preco_mensal)} no plano mensal
                            </p>
                          )}
                        </div>

                        {/* Descrição */}
                        {plano.descricao && (
                          <p className="text-sm text-muted-foreground mb-4">
                            {plano.descricao}
                          </p>
                        )}

                        {/* Features */}
                        {plano.recursos && Object.keys(plano.recursos).length > 0 && (
                          <ul className="space-y-2">
                            {Object.entries(plano.recursos).map(([key, value]) => {
                              if (value === true) {
                                const featureName = key.replace(/_/g, ' ')
                                  .replace(/\b\w/g, l => l.toUpperCase());
                                return (
                                  <li key={key} className="flex items-center gap-2 text-sm">
                                    <Check className="h-3 w-3 text-primary" />
                                    {featureName}
                                  </li>
                                );
                              }
                              return null;
                            })}
                          </ul>
                        )}
                      </Card>
                    );
                  })}
                </div>

                {/* Botão Continuar */}
                {selectedPlano && (
                  <div className="flex justify-center pt-4">
                    <Button
                      onClick={handleContinueToPayment}
                      className="px-8 py-3"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Continuar para Pagamento
                    </Button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Seleção do Método de Pagamento */}
            {step === 'metodo' && (
              <motion.div
                key="metodo"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                {/* Resumo do Plano */}
                {selectedPlano && (
                  <Card className="p-4 bg-primary/5 border-primary/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {selectedPlano.nome_plano}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Cobrança {billingCycle === 'YEARLY' ? 'anual' : 'mensal'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">
                          {formatPrice(selectedPlano.preco_mensal, billingCycle)}
                        </p>
                        {billingCycle === 'YEARLY' && calculateDiscount(selectedPlano) > 0 && (
                          <p className="text-xs text-green-600">
                            Economize {calculateDiscount(selectedPlano)}%
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                )}

                {/* Métodos de Pagamento */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Cartão de Crédito */}
                  <Card
                    className={cn(
                      'p-6 cursor-pointer transition-all border-2',
                      paymentMethod === 'CREDIT_CARD'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/50'
                    )}
                    onClick={() => handleSelectPaymentMethod('CREDIT_CARD')}
                  >
                    <div className="text-center">
                      <CreditCard className="h-8 w-8 mx-auto mb-3 text-primary" />
                      <h3 className="font-semibold mb-2">Cartão de Crédito</h3>
                      <p className="text-sm text-muted-foreground">
                        Ativação imediata
                      </p>
                    </div>
                  </Card>

                  {/* PIX */}
                  <Card
                    className={cn(
                      'p-6 cursor-pointer transition-all border-2',
                      paymentMethod === 'PIX'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/50'
                    )}
                    onClick={() => handleSelectPaymentMethod('PIX')}
                  >
                    <div className="text-center">
                      <QrCode className="h-8 w-8 mx-auto mb-3 text-primary" />
                      <h3 className="font-semibold mb-2">PIX</h3>
                      <p className="text-sm text-muted-foreground">
                        Confirmação em minutos
                      </p>
                    </div>
                  </Card>

                  {/* Boleto */}
                  <Card
                    className={cn(
                      'p-6 cursor-pointer transition-all border-2',
                      paymentMethod === 'BOLETO'
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/50'
                    )}
                    onClick={() => handleSelectPaymentMethod('BOLETO')}
                  >
                    <div className="text-center">
                      <FileText className="h-8 w-8 mx-auto mb-3 text-primary" />
                      <h3 className="font-semibold mb-2">Boleto</h3>
                      <p className="text-sm text-muted-foreground">
                        Até 3 dias úteis
                      </p>
                    </div>
                  </Card>
                </div>

                {/* Botão Voltar */}
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setStep('planos')}
                  >
                    Voltar
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Dados do Cartão */}
            {step === 'cartao' && (
              <motion.div
                key="cartao"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6 max-w-md mx-auto"
              >
                <div className="space-y-4">
                  {/* Número do Cartão */}
                  <div>
                    <Label htmlFor="cardNumber">Número do Cartão</Label>
                    <Input
                      id="cardNumber"
                      placeholder="0000 0000 0000 0000"
                      value={creditCardData.number}
                      onChange={(e) => setCreditCardData(prev => ({
                        ...prev,
                        number: formatCardNumber(e.target.value)
                      }))}
                      maxLength={19}
                    />
                  </div>

                  {/* Nome no Cartão */}
                  <div>
                    <Label htmlFor="cardName">Nome no Cartão</Label>
                    <Input
                      id="cardName"
                      placeholder="Nome como está no cartão"
                      value={creditCardData.holderName}
                      onChange={(e) => setCreditCardData(prev => ({
                        ...prev,
                        holderName: e.target.value.toUpperCase()
                      }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Data de Vencimento */}
                    <div>
                      <Label htmlFor="expiryDate">Vencimento</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/AA"
                        value={creditCardData.expiryDate}
                        onChange={(e) => setCreditCardData(prev => ({
                          ...prev,
                          expiryDate: formatExpiryDate(e.target.value)
                        }))}
                        maxLength={5}
                      />
                    </div>

                    {/* CVV */}
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="000"
                        value={creditCardData.cvv}
                        onChange={(e) => setCreditCardData(prev => ({
                          ...prev,
                          cvv: e.target.value.replace(/\D/g, '')
                        }))}
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>

                {/* Botões */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep('metodo')}
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                  <Button
                    onClick={handleCreditCardNext}
                    disabled={!creditCardData.number || !creditCardData.holderName || 
                             !creditCardData.expiryDate || !creditCardData.cvv}
                    className="flex-1"
                  >
                    Continuar
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Endereço de Cobrança */}
            {step === 'endereco' && (
              <motion.div
                key="endereco"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6 max-w-md mx-auto"
              >
                <div className="space-y-4">
                  {/* CEP */}
                  <div>
                    <Label htmlFor="postalCode">CEP</Label>
                    <Input
                      id="postalCode"
                      placeholder="00000-000"
                      value={addressData.postalCode}
                      onChange={(e) => setAddressData(prev => ({
                        ...prev,
                        postalCode: e.target.value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2')
                      }))}
                      maxLength={9}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {/* Número */}
                    <div>
                      <Label htmlFor="addressNumber">Número</Label>
                      <Input
                        id="addressNumber"
                        placeholder="123"
                        value={addressData.addressNumber}
                        onChange={(e) => setAddressData(prev => ({
                          ...prev,
                          addressNumber: e.target.value
                        }))}
                      />
                    </div>

                    {/* Complemento */}
                    <div className="col-span-2">
                      <Label htmlFor="complement">Complemento</Label>
                      <Input
                        id="complement"
                        placeholder="Apto 101"
                        value={addressData.addressComplement}
                        onChange={(e) => setAddressData(prev => ({
                          ...prev,
                          addressComplement: e.target.value
                        }))}
                      />
                    </div>
                  </div>

                  {/* Telefone */}
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      placeholder="(11) 99999-9999"
                      value={addressData.phone}
                      onChange={(e) => setAddressData(prev => ({
                        ...prev,
                        phone: e.target.value
                      }))}
                    />
                  </div>
                </div>

                {/* Botões */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep('cartao')}
                    className="flex-1"
                  >
                    Voltar
                  </Button>
                  <Button
                    onClick={handleProcessPayment}
                    disabled={!addressData.postalCode || !addressData.addressNumber || !addressData.phone}
                    className="flex-1"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Finalizar Pagamento
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Processando */}
            {step === 'processando' && (
              <motion.div
                key="processando"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-center py-12"
              >
                <Loader2 className="h-12 w-12 mx-auto mb-4 text-primary animate-spin" />
                <h3 className="text-xl font-semibold mb-2">Processando Pagamento</h3>
                <p className="text-muted-foreground">
                  Aguarde enquanto processamos seu pagamento...
                </p>
              </motion.div>
            )}

            {/* Sucesso */}
            {step === 'sucesso' && paymentResult && (
              <motion.div
                key="sucesso"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-center py-12"
              >
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-800">
                  Pagamento Realizado com Sucesso!
                </h3>
                <p className="text-muted-foreground mb-4">
                  Sua assinatura foi ativada e você já pode usar todos os recursos.
                </p>
                
                {paymentResult.requires_action && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-blue-800">
                      {paymentMethod === 'BOLETO' && 'Você receberá o boleto por email. Após o pagamento, sua assinatura será ativada automaticamente.'}
                      {paymentMethod === 'PIX' && 'Use o código PIX que você receberá por email para finalizar o pagamento.'}
                    </p>
                  </div>
                )}

                <p className="text-sm text-muted-foreground">
                  Redirecionando para o dashboard...
                </p>
              </motion.div>
            )}

            {/* Erro */}
            {step === 'erro' && (
              <motion.div
                key="erro"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-center py-12"
              >
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-red-800">
                  Erro no Pagamento
                </h3>
                <p className="text-muted-foreground mb-4">
                  {error || 'Ocorreu um erro ao processar seu pagamento. Tente novamente.'}
                </p>

                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setStep('metodo')}
                  >
                    Tentar Novamente
                  </Button>
                  <Button onClick={handleClose}>
                    Fechar
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
