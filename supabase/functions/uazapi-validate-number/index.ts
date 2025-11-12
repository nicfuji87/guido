import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// AI dev note: Edge Function para validar números no WhatsApp via UAZapi
// PÚBLICA - não exige autenticação (usada no modal de cadastro)
// Usa a instância Nicolas global para validação

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { numbers } = await req.json();

    if (!numbers || !Array.isArray(numbers) || numbers.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Array de números é obrigatório' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const uazapiUrl = Deno.env.get('UAZAPI_URL');
    const nicolasToken = Deno.env.get('UAZAPI_NICOLAS_TOKEN');

    if (!uazapiUrl || !nicolasToken) {
      console.error('[UAZapi Validate] Missing credentials');
      return new Response(
        JSON.stringify({ success: false, error: 'Configuração UAZapi não encontrada' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[UAZapi Validate] Validating ${numbers.length} numbers`);

    const response = await fetch(`${uazapiUrl}/chat/check`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'token': nicolasToken
      },
      body: JSON.stringify({ numbers })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[UAZapi Validate] API error:', errorText);
      return new Response(
        JSON.stringify({ success: false, error: `UAZapi error: ${response.status}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await response.json();
    console.log('[UAZapi Validate] Success:', result);

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[UAZapi Validate] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Erro desconhecido' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

