// AI dev note: Serviço de email para automações críticas do sistema
// Usa Resend para envio confiável de emails transacionais
// Templates organizados e logs estratégicos para debug

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export interface TrialExpiringEmailData {
  nome: string;
  dias_restantes: number;
  plano_atual: string;
  valor_plano: string;
  dashboard_url: string;
}

export interface TrialExpiredEmailData {
  nome: string;
  plano_atual: string;
  data_expiracao: string;
  dashboard_url: string;
}

export interface PaymentFailedEmailData {
  nome: string;
  valor: string;
  data_vencimento: string;
  tentativa: number;
  boleto_url?: string;
  dashboard_url: string;
}

export interface PaymentSuccessEmailData {
  nome: string;
  plano: string;
  valor: string;
  proxima_cobranca: string;
  dashboard_url: string;
}

class EmailService {
  private apiKey: string;
  private baseUrl = 'https://api.resend.com';
  private fromEmail: string;

  constructor() {
    this.apiKey = process.env.RESEND_API_KEY || '';
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@guido.com.br';
    
    if (!this.apiKey) {
      console.warn('[EmailService] RESEND_API_KEY não configurada');
    }
  }

  private async sendEmail(data: EmailData): Promise<boolean> {
    const logPrefix = '[EmailService]';
    
    if (!this.apiKey) {
      console.error(`${logPrefix} API key não configurada`);
      return false;
    }

    try {
      console.log(`${logPrefix} Enviando email para:`, data.to);

      const response = await fetch(`${this.baseUrl}/emails`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: data.from || this.fromEmail,
          to: data.to,
          subject: data.subject,
          html: data.html,
          text: data.text,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error(`${logPrefix} Erro ao enviar email:`, result);
        return false;
      }

      console.log(`${logPrefix} ✅ Email enviado com sucesso:`, result.id);
      return true;

    } catch (error) {
      console.error(`${logPrefix} Erro na requisição:`, error);
      return false;
    }
  }

  // Email de trial expirando (2 dias antes)
  async sendTrialExpiringEmail(email: string, data: TrialExpiringEmailData): Promise<boolean> {
    const urgencyClass = data.dias_restantes <= 1 ? 'urgent' : 'warning';
    const urgencyText = data.dias_restantes <= 1 ? 'ÚLTIMO DIA' : `${data.dias_restantes} DIAS RESTANTES`;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Seu trial está expirando</title>
        <style>
            .container { max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; }
            .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .content { padding: 30px; background: white; }
            .warning { background: #fef3cd; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .urgent { background: #fee2e2; border: 1px solid #fca5a5; }
            .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🏠 Guido</div>
                <h1 style="color: white; margin: 0;">Seu trial está expirando!</h1>
            </div>
            
            <div class="content">
                <h2>Olá, ${data.nome}! 👋</h2>
                
                <div class="warning ${urgencyClass}">
                    <h3 style="margin-top: 0; color: #dc2626;">⏰ ${urgencyText}</h3>
                    <p>Seu período de teste gratuito do <strong>${data.plano_atual}</strong> está chegando ao fim.</p>
                    <p>Para continuar aproveitando todos os recursos do Guido, assine agora por apenas <strong>${data.valor_plano}</strong>.</p>
                </div>

                <h3>🚀 O que você vai perder:</h3>
                <ul>
                    <li>✨ IA para atendimento de leads</li>
                    <li>💬 WhatsApp integrado</li>
                    <li>📊 CRM completo</li>
                    <li>📈 Relatórios detalhados</li>
                    <li>🔄 Automações inteligentes</li>
                </ul>

                <div style="text-align: center;">
                    <a href="${data.dashboard_url}?upgrade=trial-expiring" class="button">
                        👑 Assinar Agora - ${data.valor_plano}
                    </a>
                </div>

                <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    <strong>Precisa de ajuda?</strong><br>
                    Nossa equipe está aqui para te ajudar: <a href="mailto:${process.env.SUPPORT_EMAIL}">${process.env.SUPPORT_EMAIL}</a>
                </p>
            </div>
            
            <div class="footer">
                <p>Guido - Seu assistente inteligente para vendas imobiliárias</p>
                <p>Se você não deseja mais receber estes emails, <a href="#">clique aqui</a>.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    return this.sendEmail({
      to: email,
      subject: `⏰ ${urgencyText} - Seu trial Guido está expirando`,
      html,
    });
  }

  // Email de trial expirado
  async sendTrialExpiredEmail(email: string, data: TrialExpiredEmailData): Promise<boolean> {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Seu trial expirou</title>
        <style>
            .container { max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            .header { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 30px; text-align: center; }
            .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .content { padding: 30px; background: white; }
            .expired { background: #fee2e2; border: 1px solid #fca5a5; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .button { display: inline-block; background: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🏠 Guido</div>
                <h1 style="color: white; margin: 0;">Seu trial expirou</h1>
            </div>
            
            <div class="content">
                <h2>Olá, ${data.nome}! 😔</h2>
                
                <div class="expired">
                    <h3 style="margin-top: 0; color: #dc2626;">❌ Trial Expirado</h3>
                    <p>Seu período de teste gratuito do <strong>${data.plano_atual}</strong> expirou em ${data.data_expiracao}.</p>
                    <p>Mas não se preocupe! Você ainda pode ativar sua assinatura e voltar a usar todos os recursos.</p>
                </div>

                <h3>🔒 Acesso Suspenso:</h3>
                <p>Sem uma assinatura ativa, você perdeu acesso temporário a:</p>
                <ul>
                    <li>✨ IA para atendimento de leads</li>
                    <li>💬 WhatsApp integrado</li>
                    <li>📊 CRM completo</li>
                    <li>📈 Relatórios detalhados</li>
                </ul>

                <h3>🚀 Reative Agora:</h3>
                <p>Escolha seu plano e volte a vender mais com o Guido!</p>

                <div style="text-align: center;">
                    <a href="${data.dashboard_url}?upgrade=trial-expired" class="button">
                        🔓 Reativar Minha Conta
                    </a>
                </div>

                <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    <strong>Dúvidas?</strong><br>
                    Fale conosco: <a href="mailto:${process.env.SUPPORT_EMAIL}">${process.env.SUPPORT_EMAIL}</a>
                </p>
            </div>
            
            <div class="footer">
                <p>Guido - Seu assistente inteligente para vendas imobiliárias</p>
            </div>
        </div>
    </body>
    </html>
    `;

    return this.sendEmail({
      to: email,
      subject: '❌ Seu trial Guido expirou - Reative sua conta',
      html,
    });
  }

  // Email de falha no pagamento
  async sendPaymentFailedEmail(email: string, data: PaymentFailedEmailData): Promise<boolean> {
    const isLastAttempt = data.tentativa >= 3;
    const urgencyText = isLastAttempt ? 'ÚLTIMA TENTATIVA' : `Tentativa ${data.tentativa}/3`;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Problema com seu pagamento</title>
        <style>
            .container { max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center; }
            .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .content { padding: 30px; background: white; }
            .warning { background: #fef3cd; border: 1px solid #fbbf24; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .critical { background: #fee2e2; border: 1px solid #fca5a5; }
            .button { display: inline-block; background: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px 5px; }
            .button-secondary { background: #6b7280; }
            .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🏠 Guido</div>
                <h1 style="color: white; margin: 0;">Problema com seu pagamento</h1>
            </div>
            
            <div class="content">
                <h2>Olá, ${data.nome}! ⚠️</h2>
                
                <div class="warning ${isLastAttempt ? 'critical' : ''}">
                    <h3 style="margin-top: 0; color: ${isLastAttempt ? '#dc2626' : '#d97706'};">
                        💳 ${urgencyText}
                    </h3>
                    <p>Não conseguimos processar o pagamento de <strong>${data.valor}</strong> com vencimento em ${data.data_vencimento}.</p>
                    ${isLastAttempt ? 
                      '<p><strong>⚠️ ATENÇÃO:</strong> Esta é a última tentativa. Após isso, sua conta será suspensa.</p>' :
                      '<p>Sua conta continua ativa, mas você precisa regularizar o pagamento.</p>'
                    }
                </div>

                <h3>🔧 Como resolver:</h3>
                <div style="text-align: center;">
                    <a href="${data.dashboard_url}?action=update-payment" class="button">
                        💳 Atualizar Forma de Pagamento
                    </a>
                    ${data.boleto_url ? 
                      `<a href="${data.boleto_url}" class="button button-secondary">📄 Pagar Boleto</a>` : 
                      ''
                    }
                </div>

                <h3>❓ Possíveis causas:</h3>
                <ul>
                    <li>Cartão de crédito expirado</li>
                    <li>Limite insuficiente</li>
                    <li>Dados bancários alterados</li>
                    <li>Cartão bloqueado pelo banco</li>
                </ul>

                <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    <strong>Precisa de ajuda?</strong><br>
                    Nossa equipe está pronta para te ajudar: <a href="mailto:${process.env.SUPPORT_EMAIL}">${process.env.SUPPORT_EMAIL}</a>
                </p>
            </div>
            
            <div class="footer">
                <p>Guido - Seu assistente inteligente para vendas imobiliárias</p>
            </div>
        </div>
    </body>
    </html>
    `;

    return this.sendEmail({
      to: email,
      subject: `⚠️ ${urgencyText} - Problema com pagamento Guido`,
      html,
    });
  }

  // Email de pagamento bem-sucedido
  async sendPaymentSuccessEmail(email: string, data: PaymentSuccessEmailData): Promise<boolean> {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pagamento confirmado!</title>
        <style>
            .container { max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; }
            .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .content { padding: 30px; background: white; }
            .success { background: #d1fae5; border: 1px solid #6ee7b7; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .button { display: inline-block; background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🏠 Guido</div>
                <h1 style="color: white; margin: 0;">Pagamento Confirmado! 🎉</h1>
            </div>
            
            <div class="content">
                <h2>Parabéns, ${data.nome}! 🎊</h2>
                
                <div class="success">
                    <h3 style="margin-top: 0; color: #059669;">✅ Pagamento Processado</h3>
                    <p>Seu pagamento de <strong>${data.valor}</strong> foi confirmado com sucesso!</p>
                    <p>Seu plano <strong>${data.plano}</strong> está ativo e você já pode usar todos os recursos.</p>
                </div>

                <h3>📋 Detalhes da sua assinatura:</h3>
                <ul>
                    <li><strong>Plano:</strong> ${data.plano}</li>
                    <li><strong>Valor pago:</strong> ${data.valor}</li>
                    <li><strong>Próxima cobrança:</strong> ${data.proxima_cobranca}</li>
                    <li><strong>Status:</strong> ✅ Ativa</li>
                </ul>

                <h3>🚀 Aproveite todos os recursos:</h3>
                <ul>
                    <li>✨ IA para atendimento de leads</li>
                    <li>💬 WhatsApp integrado</li>
                    <li>📊 CRM completo</li>
                    <li>📈 Relatórios detalhados</li>
                    <li>🔄 Automações inteligentes</li>
                </ul>

                <div style="text-align: center;">
                    <a href="${data.dashboard_url}" class="button">
                        🏠 Acessar Meu Dashboard
                    </a>
                </div>

                <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    <strong>Dúvidas ou sugestões?</strong><br>
                    Estamos aqui para te ajudar: <a href="mailto:${process.env.SUPPORT_EMAIL}">${process.env.SUPPORT_EMAIL}</a>
                </p>
            </div>
            
            <div class="footer">
                <p>Obrigado por escolher o Guido! 🙏</p>
                <p>Guido - Seu assistente inteligente para vendas imobiliárias</p>
            </div>
        </div>
    </body>
    </html>
    `;

    return this.sendEmail({
      to: email,
      subject: '✅ Pagamento confirmado - Sua conta Guido está ativa!',
      html,
    });
  }
}

// Instância singleton
let emailServiceInstance: EmailService | null = null;

export const getEmailService = (): EmailService => {
  if (!emailServiceInstance) {
    emailServiceInstance = new EmailService();
  }
  return emailServiceInstance;
};

export { EmailService };
