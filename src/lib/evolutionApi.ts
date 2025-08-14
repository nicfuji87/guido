// AI dev note: Cliente para integração com Evolution API
// Usa a instância global da Evolution API do Guido

import { EvolutionInstance, EvolutionInstanceCreate, EvolutionQRCode } from '@/types/evolution';

const EVOLUTION_BASE_URL = 'https://chat-guido.infusecomunicacao.online';
const GLOBAL_API_KEY = '9b6cd7db-bf58-4b18-8226-f202d9baaf67';

class EvolutionApiClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = EVOLUTION_BASE_URL;
    this.apiKey = GLOBAL_API_KEY;
  }

  private async makeRequest(endpoint: string, options: any = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'apikey': this.apiKey,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Evolution API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Criar uma nova instância para o corretor
  async createInstance(instanceData: EvolutionInstanceCreate): Promise<EvolutionInstance> {
    return this.makeRequest('/instance/create', {
      method: 'POST',
      body: JSON.stringify(instanceData),
    });
  }

  // Conectar instância (gerar QR code)
  async connectInstance(instanceName: string): Promise<EvolutionQRCode> {
    return this.makeRequest(`/instance/connect/${instanceName}`, {
      method: 'GET',
    });
  }

  // Verificar status da instância
  async getInstanceStatus(instanceName: string): Promise<EvolutionInstance> {
    return this.makeRequest(`/instance/connectionState/${instanceName}`, {
      method: 'GET',
    });
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
  async logoutInstance(instanceName: string): Promise<void> {
    return this.makeRequest(`/instance/logout/${instanceName}`, {
      method: 'DELETE',
    });
  }
}

export const evolutionApi = new EvolutionApiClient();
