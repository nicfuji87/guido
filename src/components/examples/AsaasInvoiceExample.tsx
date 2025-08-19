// AI dev note: Exemplo de como usar a funcionalidade de fatura Asaas em outros componentes
import React, { useState, useEffect } from 'react';
import { useAsaasInvoice } from '../../hooks/useAsaasInvoice';
import { supabase } from '../../lib/supabaseClient';
import { Session } from '@supabase/supabase-js';
import AsaasInvoiceFallback from '../AsaasInvoiceFallback';

// Componente de Exemplo para Exibir a Fatura
const AsaasInvoiceExample: React.FC = () => {
  const [, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = supabase.auth.session();
        setSession(session);
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);
  

  const { invoiceUrl, error: invoiceError, isLoading: isInvoiceLoading } = useAsaasInvoice();

  if (loading || isInvoiceLoading) {
    return <div>Carregando informações da fatura...</div>;
  }

  if (invoiceError) {
    return <AsaasInvoiceFallback invoiceUrl={invoiceUrl || ''} onClose={() => {}} />;
  }

  if (!invoiceUrl) {
    return <AsaasInvoiceFallback invoiceUrl={invoiceUrl || ''} onClose={() => {}} />;
  }

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <iframe
        src={invoiceUrl}
        title="Fatura Asaas"
        style={{ border: 'none', width: '100%', height: '100%' }}
        onError={(e) => console.error("Erro ao carregar o iframe da fatura:", e)}
      />
    </div>
  );
};

export default AsaasInvoiceExample;
