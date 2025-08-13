// AI dev note: Interfaces para APIs externas e integrações
// Substitui tipos 'any' por tipos específicos

// === ASAAS API TYPES ===
export interface AsaasCustomer {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  mobilePhone?: string;
  cpfCnpj: string;
  postalCode?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  province?: string;
  city?: string;
  state?: string;
  country?: string;
  externalReference?: string;
  notificationDisabled?: boolean;
  additionalEmails?: string;
  municipalInscription?: string;
  stateInscription?: string;
  observations?: string;
}

export interface AsaasSubscription {
  id?: string;
  dateCreated?: string;
  customer: string;
  billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX' | 'UNDEFINED';
  value: number;
  nextDueDate: string;
  description?: string;
  cycle: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'SEMIANNUALLY' | 'YEARLY';
  endDate?: string;
  maxPayments?: number;
  externalReference?: string;
  split?: AsaasSplit[];
  callback?: AsaasCallback;
  creditCard?: AsaasCreditCard;
}

export interface AsaasPayment {
  id?: string;
  dateCreated?: string;
  customer: string;
  subscription?: string;
  installment?: string;
  paymentLink?: string;
  value: number;
  netValue?: number;
  originalValue?: number;
  interestValue?: number;
  description?: string;
  billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX' | 'UNDEFINED';
  confirmedDate?: string;
  pixTransaction?: string;
  status: 'PENDING' | 'RECEIVED' | 'CONFIRMED' | 'OVERDUE' | 'REFUNDED' | 'RECEIVED_IN_CASH' | 'REFUND_REQUESTED' | 'REFUND_IN_PROGRESS' | 'CHARGEBACK_REQUESTED' | 'CHARGEBACK_DISPUTE' | 'AWAITING_CHARGEBACK_REVERSAL' | 'DUNNING_REQUESTED' | 'DUNNING_RECEIVED' | 'AWAITING_RISK_ANALYSIS';
  dueDate: string;
  originalDueDate?: string;
  paymentDate?: string;
  clientPaymentDate?: string;
  installmentNumber?: number;
  invoiceUrl?: string;
  invoiceNumber?: string;
  externalReference?: string;
  deleted?: boolean;
  anticipated?: boolean;
  anticipable?: boolean;
}

export interface AsaasCreditCard {
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
}

export interface AsaasSplit {
  walletId: string;
  fixedValue?: number;
  percentualValue?: number;
  totalFixedValue?: number;
}

export interface AsaasCallback {
  successUrl?: string;
  autoRedirect?: boolean;
}

export interface AsaasWebhookPayload {
  event: string;
  payment?: AsaasPayment;
  subscription?: AsaasSubscription;
  customer?: AsaasCustomer;
}

// === EVOLUTION API TYPES ===
export interface EvolutionApiContact {
  id: string;
  pushName: string;
  profilePicUrl?: string;
}

export interface EvolutionApiMessage {
  key: {
    remoteJid: string;
    fromMe: boolean;
    id: string;
  };
  message: {
    conversation?: string;
    extendedTextMessage?: {
      text: string;
    };
  };
  messageTimestamp: number;
  status: string;
}

export interface EvolutionApiResponse {
  status: 'success' | 'error';
  message?: string;
  data?: unknown;
}

// === EMAIL SERVICE TYPES ===
export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: EmailAttachment[];
}

export interface EmailAttachment {
  filename: string;
  content: string | Buffer;
  contentType: string;
}

export interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

// === GENERIC API TYPES ===
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = unknown> {
  data: T[];
  totalCount: number;
  hasMore: boolean;
  offset?: number;
  limit?: number;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: ValidationError[];
}
