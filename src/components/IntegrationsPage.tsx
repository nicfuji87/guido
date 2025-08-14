import React from 'react';
import { DashboardLayout } from './DashboardLayout';
import { EvolutionWhatsAppWidget } from './widgets/EvolutionWhatsAppWidget';
import { CRMIntegrationsWidget } from './widgets/CRMIntegrationsWidget';
import { Separator } from '@/components/ui';

// AI dev note: Página principal de integrações para corretor
// Combina widgets de Evolution API (WhatsApp) e integrações de CRM

export const IntegrationsPage = () => {
  return (
    <DashboardLayout title="Integrações">
      <div className="flex-1 bg-gradient-to-br from-gray-900 to-black">
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
          {/* WhatsApp Integration */}
          <section className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white">WhatsApp Business</h2>
              <p className="text-gray-400 text-sm">
                Conecte o Guido no seu WhatsApp
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
