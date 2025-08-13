#!/usr/bin/env node

// AI dev note: Script para testar todas as automações do sistema
// Facilita debug e validação das Edge Functions e webhooks
// Executa cenários de teste realistas

const fetch = require('node-fetch');
require('dotenv').config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const CRON_SECRET = process.env.CRON_SECRET_TOKEN;
const WEBHOOK_TOKEN = process.env.ASAAS_WEBHOOK_TOKEN;

if (!SUPABASE_URL) {
  console.error('❌ SUPABASE_URL não configurada');
  process.exit(1);
}

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

function logStep(step, description) {
  log(colors.blue, `\n🔄 Passo ${step}: ${description}`);
}

function logSuccess(message) {
  log(colors.green, `✅ ${message}`);
}

function logError(message) {
  log(colors.red, `❌ ${message}`);
}

function logWarning(message) {
  log(colors.yellow, `⚠️  ${message}`);
}

async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: options.body ? JSON.stringify(options.body) : undefined
    });

    const data = await response.json();
    
    return {
      ok: response.ok,
      status: response.status,
      data
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: error.message
    };
  }
}

async function testWebhook() {
  logStep(1, 'Testando Webhook do Asaas');
  
  if (!WEBHOOK_TOKEN) {
    logWarning('ASAAS_WEBHOOK_TOKEN não configurada - pulando teste');
    return;
  }

  const url = `${SUPABASE_URL}/functions/v1/asaas-webhook`;
  
  // Teste 1: Payment Received
  console.log('  📧 Testando PAYMENT_RECEIVED...');
  const paymentReceived = await makeRequest(url, {
    headers: {
      'asaas-access-token': WEBHOOK_TOKEN
    },
    body: {
      event: 'PAYMENT_RECEIVED',
      payment: {
        id: 'pay_test_' + Date.now(),
        customer: 'cus_test_123',
        subscription: 'sub_test_123',
        value: 97.00,
        status: 'RECEIVED',
        dueDate: new Date().toISOString(),
        externalReference: 'test_assinatura_id'
      }
    }
  });

  if (paymentReceived.ok) {
    logSuccess('PAYMENT_RECEIVED processado');
  } else {
    logError(`PAYMENT_RECEIVED falhou: ${paymentReceived.status} - ${paymentReceived.data?.error || paymentReceived.error}`);
  }

  // Teste 2: Payment Overdue
  console.log('  📧 Testando PAYMENT_OVERDUE...');
  const paymentOverdue = await makeRequest(url, {
    headers: {
      'asaas-access-token': WEBHOOK_TOKEN
    },
    body: {
      event: 'PAYMENT_OVERDUE',
      payment: {
        id: 'pay_overdue_' + Date.now(),
        customer: 'cus_test_123',
        subscription: 'sub_test_123',
        value: 97.00,
        status: 'OVERDUE',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 dias atrás
        externalReference: 'test_assinatura_id'
      }
    }
  });

  if (paymentOverdue.ok) {
    logSuccess('PAYMENT_OVERDUE processado');
  } else {
    logError(`PAYMENT_OVERDUE falhou: ${paymentOverdue.status} - ${paymentOverdue.data?.error || paymentOverdue.error}`);
  }
}

async function testTrialCheck() {
  logStep(2, 'Testando Check Trial Status');
  
  if (!CRON_SECRET) {
    logWarning('CRON_SECRET_TOKEN não configurada - pulando teste');
    return;
  }

  const url = `${SUPABASE_URL}/functions/v1/check-trial-status`;
  
  console.log('  🔍 Verificando trials expirando/expirados...');
  const result = await makeRequest(url, {
    headers: {
      'x-cron-secret': CRON_SECRET
    }
  });

  if (result.ok) {
    logSuccess('Check Trial Status executado');
    if (result.data?.results) {
      console.log(`    📊 Resultados:`);
      console.log(`       - Trials expirando: ${result.data.results.trials_expirando_processados}`);
      console.log(`       - Trials expirados: ${result.data.results.trials_expirados_processados}`);
      console.log(`       - Emails enviados: ${result.data.results.emails_enviados}`);
      if (result.data.results.errors?.length > 0) {
        console.log(`       - Erros: ${result.data.results.errors.length}`);
      }
    }
  } else {
    logError(`Check Trial Status falhou: ${result.status} - ${result.data?.error || result.error}`);
  }
}

async function testPaymentCheck() {
  logStep(3, 'Testando Check Payment Status');
  
  if (!CRON_SECRET) {
    logWarning('CRON_SECRET_TOKEN não configurada - pulando teste');
    return;
  }

  const url = `${SUPABASE_URL}/functions/v1/check-payment-status`;
  
  console.log('  💳 Verificando pagamentos em atraso...');
  const result = await makeRequest(url, {
    headers: {
      'x-cron-secret': CRON_SECRET
    }
  });

  if (result.ok) {
    logSuccess('Check Payment Status executado');
    if (result.data?.results) {
      console.log(`    📊 Resultados:`);
      console.log(`       - Pagamentos verificados: ${result.data.results.pagamentos_verificados}`);
      console.log(`       - Emails enviados: ${result.data.results.emails_enviados}`);
      console.log(`       - Contas suspensas: ${result.data.results.contas_suspensas}`);
      if (result.data.results.errors?.length > 0) {
        console.log(`       - Erros: ${result.data.results.errors.length}`);
      }
    }
  } else {
    logError(`Check Payment Status falhou: ${result.status} - ${result.data?.error || result.error}`);
  }
}

async function testEmailConfig() {
  logStep(4, 'Verificando Configuração de Email');
  
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL;
  
  if (!resendKey) {
    logWarning('RESEND_API_KEY não configurada - emails não funcionarão');
    return;
  }

  if (!fromEmail) {
    logWarning('FROM_EMAIL não configurada - usando default');
  }

  console.log('  📧 Testando conectividade com Resend...');
  
  try {
    const response = await fetch('https://api.resend.com/domains', {
      headers: {
        'Authorization': `Bearer ${resendKey}`
      }
    });

    if (response.ok) {
      logSuccess('Conexão com Resend OK');
      const data = await response.json();
      console.log(`    📊 Domínios configurados: ${data.data?.length || 0}`);
    } else {
      logError(`Falha na conexão com Resend: ${response.status}`);
    }
  } catch (error) {
    logError(`Erro ao conectar com Resend: ${error.message}`);
  }
}

async function testAsaasConfig() {
  logStep(5, 'Verificando Configuração do Asaas');
  
  const asaasKey = process.env.ASAAS_API_KEY;
  
  if (!asaasKey) {
    logWarning('ASAAS_API_KEY não configurada - pagamentos não funcionarão');
    return;
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const baseUrl = isProduction 
    ? 'https://api.asaas.com/v3'
    : 'https://sandbox.asaas.com/api/v3';

  console.log(`  💳 Testando conectividade com Asaas ${isProduction ? '(Production)' : '(Sandbox)'}...`);
  
  try {
    const response = await fetch(`${baseUrl}/customers?limit=1`, {
      headers: {
        'access_token': asaasKey
      }
    });

    if (response.ok) {
      logSuccess(`Conexão com Asaas ${isProduction ? 'Production' : 'Sandbox'} OK`);
    } else {
      logError(`Falha na conexão com Asaas: ${response.status}`);
    }
  } catch (error) {
    logError(`Erro ao conectar com Asaas: ${error.message}`);
  }
}

async function showSummary() {
  logStep(6, 'Resumo da Configuração');
  
  const configs = [
    { name: 'SUPABASE_URL', value: !!SUPABASE_URL },
    { name: 'CRON_SECRET_TOKEN', value: !!CRON_SECRET },
    { name: 'ASAAS_WEBHOOK_TOKEN', value: !!WEBHOOK_TOKEN },
    { name: 'ASAAS_API_KEY', value: !!process.env.ASAAS_API_KEY },
    { name: 'RESEND_API_KEY', value: !!process.env.RESEND_API_KEY },
    { name: 'FROM_EMAIL', value: !!process.env.FROM_EMAIL },
    { name: 'DASHBOARD_URL', value: !!process.env.DASHBOARD_URL }
  ];

  console.log('\n📋 Status das Variáveis de Ambiente:');
  configs.forEach(config => {
    const status = config.value ? '✅' : '❌';
    console.log(`  ${status} ${config.name}`);
  });

  const configured = configs.filter(c => c.value).length;
  const total = configs.length;
  
  console.log(`\n📊 Configuração: ${configured}/${total} (${Math.round(configured/total*100)}%)`);
  
  if (configured === total) {
    logSuccess('🎉 Todas as automações estão configuradas!');
  } else {
    logWarning(`⚠️  Configure as variáveis em falta para ativar todas as automações`);
  }
}

async function main() {
  log(colors.bold, '\n🤖 TESTE DAS AUTOMAÇÕES - GUIDO\n');
  log(colors.blue, `🔗 Supabase URL: ${SUPABASE_URL}`);
  
  try {
    await testEmailConfig();
    await testAsaasConfig();
    await testWebhook();
    await testTrialCheck();
    await testPaymentCheck();
    await showSummary();
    
    log(colors.bold, '\n✅ Testes concluídos!');
    
  } catch (error) {
    logError(`Erro geral: ${error.message}`);
    process.exit(1);
  }
}

// Executar testes se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = {
  testWebhook,
  testTrialCheck,
  testPaymentCheck,
  testEmailConfig,
  testAsaasConfig
};
