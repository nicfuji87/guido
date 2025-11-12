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
    const url = import.meta.env.VITE_UAZAPI_VALIDATE_NUMBER_URL;
    
    if (!url) {
      throw new Error('URL da Edge Function de validação não configurada');
    }

    const authUser = supabase.auth.user();
    
    if (!authUser) {
      throw new Error('Usuário não autenticado');
    }

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

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na validação: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('[UAZapi] Erro ao validar número:', error);
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
    const url = import.meta.env.VITE_UAZAPI_INIT_INSTANCE_URL;
    
    if (!url) {
      throw new Error('URL da Edge Function de criação não configurada');
    }

    const authUser = supabase.auth.user();
    
    if (!authUser) {
      throw new Error('Usuário não autenticado');
    }

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

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao criar instância: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('[UAZapi] Erro ao criar instância:', error);
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
    const url = import.meta.env.VITE_UAZAPI_CONNECT_INSTANCE_URL;
    
    if (!url) {
      throw new Error('URL da Edge Function de conexão não configurada');
    }

    const authUser = supabase.auth.user();
    
    if (!authUser) {
      throw new Error('Usuário não autenticado');
    }

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

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao conectar: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('[UAZapi] Erro ao conectar WhatsApp:', error);
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
    const url = import.meta.env.VITE_UAZAPI_CHECK_STATUS_URL;
    
    if (!url) {
      throw new Error('URL da Edge Function de status não configurada');
    }

    const authUser = supabase.auth.user();
    
    if (!authUser) {
      throw new Error('Usuário não autenticado');
    }

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

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro ao verificar status: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('[UAZapi] Erro ao verificar status:', error);
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

