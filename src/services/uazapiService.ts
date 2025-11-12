// AI dev note: Serviço para integração com UAZapi via Supabase Edge Functions
// Todas as credenciais sensíveis ficam no server-side (Supabase Secrets)

import { supabase } from '@/lib/supabaseClient';

// ============================================
// INTERFACES
// ============================================

export interface WhatsAppValidationResult {
  query: string;
  isInWhatsapp: boolean;
  jid: string;
  verifiedName: string;
}

export interface UAZapiInstanceData {
  instanceName: string;
  instanceId: string;
  token: string;
  status: 'disconnected' | 'connecting' | 'connected';
}

export interface UAZapiConnectionData {
  status: 'disconnected' | 'connecting' | 'connected';
  qrcode: string | null;
  paircode: string | null;
  connected: boolean;
  loggedIn: boolean;
  profileName?: string;
  profilePicUrl?: string;
}

export interface UAZapiStatusData extends UAZapiConnectionData {
  jid?: string;
  lastDisconnect?: string;
  lastDisconnectReason?: string;
}

// ============================================
// VALIDAR NÚMERO NO WHATSAPP
// ============================================

export async function validateWhatsAppNumber(
  phone: string
): Promise<{ success: boolean; data?: WhatsAppValidationResult[]; error?: string }> {
  try {
    console.log('[UAZapi] Iniciando validação de WhatsApp:', phone);
    
    // Construir URL a partir da URL base do Supabase
    const baseUrl = import.meta.env.VITE_SUPABASE_URL;
    const url = `${baseUrl}/functions/v1/uazapi-validate-number`;
    console.log('[UAZapi] URL da Edge Function:', url);
    
    if (!baseUrl) {
      console.error('[UAZapi] ERRO: VITE_SUPABASE_URL não configurada');
      throw new Error('URL base do Supabase não configurada');
    }

    const authUser = supabase.auth.user();
    console.log('[UAZapi] Usuário autenticado:', authUser ? 'Sim' : 'Não');
    
    if (!authUser) {
      console.error('[UAZapi] ERRO: Usuário não autenticado');
      throw new Error('Usuário não autenticado');
    }

    console.log('[UAZapi] Fazendo requisição para:', url);
    console.log('[UAZapi] Número formatado:', phone);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${supabase.auth.session()?.access_token || ''}`
      },
      body: JSON.stringify({
        numbers: [phone]
      })
    });

    console.log('[UAZapi] Resposta HTTP:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[UAZapi] Erro na resposta:', errorText);
      throw new Error(`Erro na validação: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('[UAZapi] Validação bem-sucedida:', result);
    return result;
  } catch (error) {
    console.error('[UAZapi] Erro ao validar número:', error);
    console.error('[UAZapi] Stack trace:', error instanceof Error ? error.stack : 'N/A');
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}

// ============================================
// CRIAR INSTÂNCIA UAZAPI
// ============================================

export async function createUAZapiInstance(
  nome: string,
  whatsapp: string,
  userId: string
): Promise<{ success: boolean; data?: UAZapiInstanceData; error?: string }> {
  try {
    console.log('[UAZapi] Iniciando criação de instância:', { nome, whatsapp, userId });
    
    // Construir URL a partir da URL base do Supabase
    const baseUrl = import.meta.env.VITE_SUPABASE_URL;
    const url = `${baseUrl}/functions/v1/uazapi-init-instance`;
    console.log('[UAZapi] URL da Edge Function (init):', url);
    
    if (!baseUrl) {
      console.error('[UAZapi] ERRO: VITE_SUPABASE_URL não configurada');
      throw new Error('URL base do Supabase não configurada');
    }

    const authUser = supabase.auth.user();
    console.log('[UAZapi] Usuário autenticado:', authUser ? 'Sim' : 'Não');
    
    if (!authUser) {
      console.error('[UAZapi] ERRO: Usuário não autenticado');
      throw new Error('Usuário não autenticado');
    }

    console.log('[UAZapi] Criando instância...');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${supabase.auth.session()?.access_token || ''}`
      },
      body: JSON.stringify({
        nome,
        whatsapp,
        userId
      })
    });

    console.log('[UAZapi] Resposta HTTP (init):', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[UAZapi] Erro ao criar instância:', errorText);
      throw new Error(`Erro ao criar instância: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('[UAZapi] Instância criada com sucesso:', result);
    return result;
  } catch (error) {
    console.error('[UAZapi] Erro ao criar instância:', error);
    console.error('[UAZapi] Stack trace:', error instanceof Error ? error.stack : 'N/A');
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}

// ============================================
// CONECTAR WHATSAPP (QR CODE / PAIRCODE)
// ============================================

export async function connectWhatsApp(
  userId: string,
  options?: {
    isMobile?: boolean;
    phone?: string;
  }
): Promise<{ success: boolean; data?: UAZapiConnectionData; error?: string }> {
  try {
    console.log('[UAZapi] Iniciando conexão WhatsApp:', { userId, options });
    
    // Construir URL a partir da URL base do Supabase
    const baseUrl = import.meta.env.VITE_SUPABASE_URL;
    const url = `${baseUrl}/functions/v1/uazapi-connect-instance`;
    console.log('[UAZapi] URL da Edge Function (connect):', url);
    
    if (!baseUrl) {
      console.error('[UAZapi] ERRO: VITE_SUPABASE_URL não configurada');
      throw new Error('URL base do Supabase não configurada');
    }

    const authUser = supabase.auth.user();
    console.log('[UAZapi] Usuário autenticado:', authUser ? 'Sim' : 'Não');
    
    if (!authUser) {
      console.error('[UAZapi] ERRO: Usuário não autenticado');
      throw new Error('Usuário não autenticado');
    }

    console.log('[UAZapi] Conectando WhatsApp...');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${supabase.auth.session()?.access_token || ''}`
      },
      body: JSON.stringify({
        userId,
        isMobile: options?.isMobile || false,
        phone: options?.phone
      })
    });

    console.log('[UAZapi] Resposta HTTP (connect):', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[UAZapi] Erro ao conectar:', errorText);
      throw new Error(`Erro ao conectar: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('[UAZapi] Conexão iniciada:', result);
    return result;
  } catch (error) {
    console.error('[UAZapi] Erro ao conectar WhatsApp:', error);
    console.error('[UAZapi] Stack trace:', error instanceof Error ? error.stack : 'N/A');
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}

// ============================================
// VERIFICAR STATUS DA INSTÂNCIA
// ============================================

export async function checkInstanceStatus(
  userId: string
): Promise<{ success: boolean; data?: UAZapiStatusData; error?: string }> {
  try {
    console.log('[UAZapi] Verificando status da instância:', userId);
    
    // Construir URL a partir da URL base do Supabase
    const baseUrl = import.meta.env.VITE_SUPABASE_URL;
    const url = `${baseUrl}/functions/v1/uazapi-check-status`;
    console.log('[UAZapi] URL da Edge Function (status):', url);
    
    if (!baseUrl) {
      console.error('[UAZapi] ERRO: VITE_SUPABASE_URL não configurada');
      throw new Error('URL base do Supabase não configurada');
    }

    const authUser = supabase.auth.user();
    console.log('[UAZapi] Usuário autenticado:', authUser ? 'Sim' : 'Não');
    
    if (!authUser) {
      console.error('[UAZapi] ERRO: Usuário não autenticado');
      throw new Error('Usuário não autenticado');
    }

    console.log('[UAZapi] Verificando status...');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${supabase.auth.session()?.access_token || ''}`
      },
      body: JSON.stringify({
        userId
      })
    });

    console.log('[UAZapi] Resposta HTTP (status):', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[UAZapi] Erro ao verificar status:', errorText);
      throw new Error(`Erro ao verificar status: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('[UAZapi] Status obtido:', result);
    return result;
  } catch (error) {
    console.error('[UAZapi] Erro ao verificar status:', error);
    console.error('[UAZapi] Stack trace:', error instanceof Error ? error.stack : 'N/A');
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}

// ============================================
// UTILIDADES
// ============================================

export function formatPhoneForAPI(phone: string): string {
  // Remove tudo que não é número
  const numbers = phone.replace(/\D/g, '');
  
  // Se já tem 13 dígitos (55 + DDD + número), retorna como está
  if (numbers.length === 13) {
    return numbers;
  }
  
  // Se tem 11 dígitos (DDD + número), adiciona o 55
  if (numbers.length === 11) {
    return '55' + numbers;
  }
  
  // Se tem 10 dígitos (DDD + número sem 9), adiciona 55 e o 9
  if (numbers.length === 10) {
    return '55' + numbers.slice(0, 2) + '9' + numbers.slice(2);
  }
  
  return numbers;
}

export function detectMobileDevice(): boolean {
  // Opção 1: User-Agent
  const isMobileUA = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  // Opção 2: Largura da tela
  const isMobileScreen = window.innerWidth < 768;
  
  return isMobileUA || isMobileScreen;
}

