// AI dev note: Cliente para integração com Evolution API
// Usa a instância global da Evolution API do Guido

import { EvolutionInstance, EvolutionInstanceCreate, EvolutionQRCode } from '@/types/evolution';

const EVOLUTION_BASE_URL = 'https://chat-guido.infusecomunicacao.online';
const GLOBAL_API_KEY = '9b6cd7db-bf58-4b18-8226-f202d9baaf67';

class EvolutionApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = EVOLUTION_BASE_URL;
  }

  private async makeRequest(endpoint: string, options: any = {}, userApiKey?: string) {
    const url = `${this.baseUrl}${endpoint}`;
    const apiKey = userApiKey || GLOBAL_API_KEY;
    
    console.log('🔍 [DEBUG] Evolution API Request:', {
      url,
      method: options.method || 'GET',
      apiKey: apiKey ? `${apiKey.substring(0, 8)}...` : 'undefined',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey ? `${apiKey.substring(0, 8)}...` : 'undefined'
      }
    });
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey,
        ...options.headers,
      },
    });

    console.log('🔍 [DEBUG] Evolution API Response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔍 [DEBUG] Evolution API Error Response:', errorText);
      throw new Error(`Evolution API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('🔍 [DEBUG] Evolution API Response Data:', data);
    
    return data;
  }

  // Criar uma nova instância para o corretor
  async createInstance(instanceData: EvolutionInstanceCreate): Promise<EvolutionInstance> {
    return this.makeRequest('/instance/create', {
      method: 'POST',
      body: JSON.stringify(instanceData),
    });
  }

  // Conectar instância (gerar QR code)
  async connectInstance(instanceName: string, userApiKey?: string): Promise<EvolutionQRCode> {
    return this.makeRequest(`/instance/connect/${instanceName}`, {
      method: 'GET',
    }, userApiKey);
  }

  // Verificar status da instância
  async getInstanceStatus(instanceName: string, userApiKey?: string): Promise<EvolutionInstance> {
    return this.makeRequest(`/instance/connectionState/${instanceName}`, {
      method: 'GET',
    }, userApiKey);
  }

  // Reiniciar instância
  async restartInstance(instanceName: string, userApiKey?: string): Promise<void> {
    return this.makeRequest(`/instance/restart/${instanceName}`, {
      method: 'PUT',
    }, userApiKey);
  }

  // Listar todas as instâncias
  async listInstances(): Promise<EvolutionInstance[]> {
    return this.makeRequest('/instance/fetchInstances', {
      method: 'GET',
    });
  }

  // Deletar instância
  async deleteInstance(instanceName: string): Promise<void> {
    return this.makeRequest(`/instance/delete/${instanceName}`, {
      method: 'DELETE',
    });
  }

  // Logout da instância (desconectar WhatsApp)
  async logoutInstance(instanceName: string, userApiKey?: string): Promise<void> {
    return this.makeRequest(`/instance/logout/${instanceName}`, {
      method: 'DELETE',
    }, userApiKey);
  }
}

export const evolutionApi = new EvolutionApiClient();
