// AI dev note: Serviço simplificado para enviar dados via webhook para n8n
// Substitui toda a complexidade do AsaasClient

export interface CustomerData {
  nome: string;
  email: string;
  documento: string; // CPF/CNPJ limpo (só números)
  telefone?: string;
  userId: string;
  assinaturaId: string;
}

export interface WebhookResponse {
  success: boolean;
  customerId?: string;
  error?: string;
}

class WebhookService {
  private webhookUrl: string;

  constructor() {
    // URL do webhook do n8n para processar cadastro Asaas
    this.webhookUrl = import.meta.env.VITE_WEBHOOK_ASAAS_PROVISIONING_URL || 'https://editori.infusecomunicacao.online/webhook-test/guidoAsaas';
    
    // console.log('🔥 DEBUG - [WebhookService] URL configurada:', this.webhookUrl);
  }

  async provisionCustomer(data: CustomerData): Promise<WebhookResponse> {
    // console.log('🔥 DEBUG - [WebhookService] Enviando dados para n8n:', {
    //   nome: data.nome,
    //   email: data.email,
    //   documento: data.documento,
    //   userId: data.userId,
    //   assinaturaId: data.assinaturaId
    // });

    try {
      // const startTime = Date.now();
      
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'provision_customer',
          data: {
            nome: data.nome,
            email: data.email,
            cpfCnpj: data.documento,
            telefone: data.telefone || '',
            userId: data.userId,
            assinaturaId: data.assinaturaId,
            timestamp: new Date().toISOString()
          }
        })
      });

      // const duration = Date.now() - startTime;
      // console.log('🔥 DEBUG - [WebhookService] Resposta do webhook:', {
      //   status: response.status,
      //   statusText: response.statusText,
      //   duration: `${duration}ms`
      // });

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      // console.log('🔥 DEBUG - [WebhookService] ✅ Resultado:', result);

      return {
        success: true,
        customerId: result.customerId || result.customer_id,
        error: undefined
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      // console.error('🔥 DEBUG - [WebhookService] ❌ Erro:', errorMessage);
      
      return {
        success: false,
        customerId: undefined,
        error: `Erro no webhook: ${errorMessage}`
      };
    }
  }
}

export const webhookService = new WebhookService();
