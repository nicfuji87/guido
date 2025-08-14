import React from 'react';
import { DashboardLayout } from './DashboardLayout';
import { EvolutionWhatsAppWidget } from './widgets/EvolutionWhatsAppWidget';
import { CRMIntegrationsWidget } from './widgets/CRMIntegrationsWidget';
import { Separator } from '@/components/ui';

// AI dev note: Página principal de integrações para corretor
// Combina widgets de Evolution API (WhatsApp) e integrações de CRM

export const IntegrationsPage = () => {
  return (
    <DashboardLayout>
      <div className="flex-1 bg-gradient-to-br from-gray-900 to-black">
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
              Integrações
            </h1>
            <p className="text-gray-300">
              Conecte seu WhatsApp e integre com seus CRMs favoritos
            </p>
          </div>

          <Separator className="bg-gray-700" />

          {/* WhatsApp Integration */}
          <section className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white">WhatsApp Business</h2>
              <p className="text-gray-400 text-sm">
                Conecte seu WhatsApp para receber e enviar mensagens diretamente no Guido
              </p>
            </div>
            <EvolutionWhatsAppWidget />
          </section>

          <Separator className="bg-gray-700" />

          {/* CRM Integrations */}
          <section className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white">Integrações CRM</h2>
              <p className="text-gray-400 text-sm">
                Configure suas chaves de API para sincronizar dados com seus CRMs
              </p>
            </div>
            <CRMIntegrationsWidget />
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};
