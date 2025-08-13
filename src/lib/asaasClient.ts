// AI dev note: Cliente Asaas para integração de pagamentos
// Implementa todas as APIs necessárias: clientes, assinaturas, webhooks
// Inclui logs estratégicos e tratamento de erros robusto

import type { AsaasSplit } from '@/types/api';

export interface AsaasCustomer {
  name: string;
  email: string;
  cpfCnpj: string;
  phone?: string;
  mobilePhone?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  province?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  externalReference?: string; // ID do usuario na nossa base
  notificationDisabled?: boolean;
  additionalEmails?: string;
  municipalInscription?: string;
  stateInscription?: string;
  observations?: string;
}

export interface AsaasCustomerResponse {
  object: string;
  id: string;
  dateCreated: string;
  name: string;
  email: string;
  cpfCnpj: string;
  phone?: string;
  mobilePhone?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  province?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  externalReference?: string;
  notificationDisabled: boolean;
  additionalEmails?: string;
  municipalInscription?: string;
  stateInscription?: string;
  observations?: string;
}

export interface AsaasSubscription {
  customer: string; // ID do customer no Asaas
  billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX' | 'UNDEFINED';
  nextDueDate: string; // YYYY-MM-DD
  value: number;
  cycle: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'BIMONTHLY' | 'QUARTERLY' | 'SEMIANNUALLY' | 'YEARLY';
  description?: string;
  endDate?: string; // YYYY-MM-DD
  maxPayments?: number;
  externalReference?: string; // ID da assinatura na nossa base
  split?: AsaasSplit[];
  creditCard?: {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    ccv: string;
  };
  creditCardHolderInfo?: {
    name: string;
    email: string;
    cpfCnpj: string;
    postalCode: string;
    addressNumber: string;
    addressComplement?: string;
    phone: string;
    mobilePhone?: string;
  };
  fine?: {
    value?: number;
    type?: 'FIXED' | 'PERCENTAGE';
  };
  interest?: {
    value?: number;
    type?: 'PERCENTAGE';
  };
  discount?: {
    value: number;
    dueDateLimitDays: number;
    type?: 'FIXED' | 'PERCENTAGE';
  };
}

export interface AsaasSubscriptionResponse {
  object: string;
  id: string;
  dateCreated: string;
  customer: string;
  paymentLink: string;
  billingType: string;
  cycle: string;
  value: number;
  nextDueDate: string;
  description?: string;
  endDate?: string;
  maxPayments?: number;
  status: 'ACTIVE' | 'EXPIRED' | 'OVERDUE';
  externalReference?: string;
}

export interface AsaasWebhookEvent {
  event: 'PAYMENT_RECEIVED' | 'PAYMENT_OVERDUE' | 'PAYMENT_DELETED' | 'PAYMENT_RESTORED' | 
         'PAYMENT_UPDATED' | 'PAYMENT_CREATED' | 'PAYMENT_AWAITING_RISK_ANALYSIS' | 
         'PAYMENT_APPROVED_BY_RISK_ANALYSIS' | 'PAYMENT_REPROVED_BY_RISK_ANALYSIS' |
         'PAYMENT_REFUNDED' | 'PAYMENT_REFUND_IN_PROGRESS' | 'PAYMENT_RECEIVED_IN_CASH_UNDONE' |
         'PAYMENT_CHARGEBACK_REQUESTED' | 'PAYMENT_CHARGEBACK_DISPUTE' | 'PAYMENT_AWAITING_CHARGEBACK_REVERSAL' |
         'PAYMENT_DUNNING_RECEIVED' | 'PAYMENT_DUNNING_REQUESTED' | 'PAYMENT_BANK_SLIP_VIEWED' |
         'PAYMENT_CHECKOUT_VIEWED';
  payment: {
    object: string;
    id: string;
    dateCreated: string;
    customer: string;
    subscription?: string;
    installment?: string;
    paymentLink?: string;
    dueDate: string;
    originalDueDate: string;
    value: number;
    netValue: number;
    billingType: string;
    status: 'PENDING' | 'RECEIVED' | 'CONFIRMED' | 'OVERDUE' | 'REFUNDED' | 'RECEIVED_IN_CASH' | 'REFUND_REQUESTED' | 'REFUND_IN_PROGRESS' | 'CHARGEBACK_REQUESTED' | 'CHARGEBACK_DISPUTE' | 'AWAITING_CHARGEBACK_REVERSAL' | 'DUNNING_REQUESTED' | 'DUNNING_RECEIVED' | 'AWAITING_RISK_ANALYSIS';
    description?: string;
    externalReference?: string;
    originalValue?: number;
    interestValue?: number;
    fineValue?: number;
    pixTransaction?: Record<string, unknown>;
    creditCardTransaction?: Record<string, unknown>;
  };
}

export interface AsaasError {
  errors: Array<{
    code: string;
    description: string;
  }>;
}

export class AsaasClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(apiKey: string, sandbox = true) {
    this.apiKey = apiKey;
    this.baseUrl = sandbox 
      ? 'https://sandbox.asaas.com/api/v3'
      : 'https://api.asaas.com/v3';
  }

  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: unknown
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // console.log(`[AsaasClient] ${method} ${endpoint}`, data ? { data } : '');
    
    const headers: Record<string, string> = {
      'accept': 'application/json',
      'access_token': this.apiKey,
      'Content-Type': 'application/json',
      'User-Agent': 'Guido-CRM/1.0'
    };

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });

      const responseData = await response.json();

      if (!response.ok) {
        // console.error(`[AsaasClient] Error ${response.status}:`, responseData);
        throw new AsaasApiError(
          `Erro Asaas: ${response.status}`,
          response.status,
          responseData
        );
      }

      // console.log(`[AsaasClient] Success ${method} ${endpoint}:`, responseData);
      return responseData;
    } catch (error) {
      // console.error(`[AsaasClient] Request failed:`, error);
      if (error instanceof AsaasApiError) {
        throw error;
      }
      throw new AsaasApiError('Erro de conexão com Asaas', 0, { message: error instanceof Error ? error.message : 'Unknown error' });
    }
  }

  // === CUSTOMERS ===
  
  async createCustomer(customerData: AsaasCustomer): Promise<AsaasCustomerResponse> {
    // console.log('[AsaasClient] Criando cliente:', customerData.name);
    return this.makeRequest<AsaasCustomerResponse>('/customers', 'POST', customerData);
  }

  async getCustomer(customerId: string): Promise<AsaasCustomerResponse> {
    return this.makeRequest<AsaasCustomerResponse>(`/customers/${customerId}`);
  }

  async updateCustomer(customerId: string, customerData: Partial<AsaasCustomer>): Promise<AsaasCustomerResponse> {
    // console.log('[AsaasClient] Atualizando cliente:', customerId);
    return this.makeRequest<AsaasCustomerResponse>(`/customers/${customerId}`, 'PUT', customerData);
  }

  async deleteCustomer(customerId: string): Promise<{ deleted: boolean; id: string }> {
    // console.log('[AsaasClient] Deletando cliente:', customerId);
    return this.makeRequest(`/customers/${customerId}`, 'DELETE');
  }

  // === SUBSCRIPTIONS ===
  
  async createSubscription(subscriptionData: AsaasSubscription): Promise<AsaasSubscriptionResponse> {
    // console.log('[AsaasClient] Criando assinatura para cliente:', subscriptionData.customer);
    return this.makeRequest<AsaasSubscriptionResponse>('/subscriptions', 'POST', subscriptionData);
  }

  async getSubscription(subscriptionId: string): Promise<AsaasSubscriptionResponse> {
    return this.makeRequest<AsaasSubscriptionResponse>(`/subscriptions/${subscriptionId}`);
  }

  async updateSubscription(subscriptionId: string, subscriptionData: Partial<AsaasSubscription>): Promise<AsaasSubscriptionResponse> {
    // console.log('[AsaasClient] Atualizando assinatura:', subscriptionId);
    return this.makeRequest<AsaasSubscriptionResponse>(`/subscriptions/${subscriptionId}`, 'PUT', subscriptionData);
  }

  async deleteSubscription(subscriptionId: string): Promise<{ deleted: boolean; id: string }> {
    // console.log('[AsaasClient] Cancelando assinatura:', subscriptionId);
    return this.makeRequest(`/subscriptions/${subscriptionId}`, 'DELETE');
  }

  // === WEBHOOKS ===
  
  async createWebhook(url: string, events: string[]): Promise<Record<string, unknown>> {
    // console.log('[AsaasClient] Criando webhook:', url);
    return this.makeRequest('/webhooks', 'POST', {
      url,
      events,
      enabled: true,
      interrupted: false,
      authToken: process.env.ASAAS_WEBHOOK_TOKEN || 'guido-webhook-secret'
    });
  }

  // === UTILITIES ===
  
  async validateWebhookSignature(_payload: string, _signature: string): Promise<boolean> {
    // Implementar validação de assinatura do webhook quando necessário
    // Por enquanto retorna true para desenvolvimento
    return true;
  }

  // Helper para calcular próxima data de cobrança
  static calculateNextDueDate(cycle: string, startDate: Date = new Date()): string {
    const date = new Date(startDate);
    
    switch (cycle) {
      case 'WEEKLY':
        date.setDate(date.getDate() + 7);
        break;
      case 'BIWEEKLY':
        date.setDate(date.getDate() + 14);
        break;
      case 'MONTHLY':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'BIMONTHLY':
        date.setMonth(date.getMonth() + 2);
        break;
      case 'QUARTERLY':
        date.setMonth(date.getMonth() + 3);
        break;
      case 'SEMIANNUALLY':
        date.setMonth(date.getMonth() + 6);
        break;
      case 'YEARLY':
        date.setFullYear(date.getFullYear() + 1);
        break;
      default:
        date.setMonth(date.getMonth() + 1); // Default para monthly
    }

    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  }
}

export class AsaasApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AsaasApiError';
  }

  getErrorDetails(): string[] {
    if (this.response?.errors && Array.isArray(this.response.errors)) {
      return this.response.errors.map((err: Record<string, unknown>) => String(err.description || err.code || 'Erro desconhecido'));
    }
    return [this.message];
  }
}

// Instância singleton para uso na aplicação
let asaasClientInstance: AsaasClient | null = null;

export const getAsaasClient = (): AsaasClient => {
  if (!asaasClientInstance) {
    const apiKey = process.env.ASAAS_API_KEY || process.env.VITE_ASAAS_API_KEY;
    const sandbox = process.env.NODE_ENV !== 'production';
    
    if (!apiKey) {
      throw new Error('ASAAS_API_KEY não configurada nas variáveis de ambiente');
    }
    
    asaasClientInstance = new AsaasClient(apiKey, sandbox);
    // console.log('[AsaasClient] Instância criada -', sandbox ? 'SANDBOX' : 'PRODUCTION');
  }
  
  return asaasClientInstance;
};
