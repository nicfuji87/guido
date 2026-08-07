import { SectionShell } from "./SectionShell";

const PERFIL = [
  { campo: "Tipo", valor: "Apartamento, 3 quartos" },
  { campo: "Vagas", valor: "2" },
  { campo: "Região", valor: "Sudoeste ou Noroeste" },
  { campo: "Faixa", valor: "R$ 700 a 900 mil" },
  { campo: "FGTS", valor: "Sim, ~R$ 60 mil" },
  { campo: "Financiamento", valor: "Pré-aprovado (Itaú)" },
  { campo: "Prazo", valor: "Mudança em 60 dias" },
];

export function Panel() {
  return (
    <SectionShell folio="04 — NA CONVERSA">
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[1fr_0.82fr] lg:gap-24">
        <div data-reveal>
          <p className="eyebrow">Dentro da conversa</p>
          <h2 className="mt-5 font-display text-4xl leading-[1.05] tracking-[-0.025em] sm:text-5xl">
            Você não troca de tela.
            <span className="text-signal"> O Guido aparece na sua.</span>
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-mute-100">
            Enquanto você conversa, ele preenche a ficha do cliente ao lado — o
            que a pessoa procura, quanto pode pagar, se já tem financiamento
            aprovado, quando quer mudar. Tudo extraído da própria conversa, com
            a mensagem de origem registrada.
          </p>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-mute-200">
            Nada para digitar. Nada para lembrar. Quando você voltar nessa
            conversa daqui a três semanas, tudo ainda vai estar ali.
          </p>
        </div>

        <div
          data-reveal
          className="overflow-hidden rounded-2xl border border-ink-500 bg-ink-700 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]"
        >
          <div className="flex items-center justify-between border-b border-ink-500 px-4 py-3">
            <span className="font-display text-lg leading-none text-paper">
              Guido<span className="text-signal">.</span>
            </span>
            <span className="rounded-md bg-signal px-2 py-0.5 font-mono text-[0.625rem] font-bold text-ink-900">
              94 · quente
            </span>
          </div>

          <div className="px-4 py-4">
            <p className="eyebrow">Perfil de busca</p>
            <dl className="mt-3 space-y-2">
              {PERFIL.map((item) => (
                <div
                  key={item.campo}
                  className="flex items-baseline justify-between gap-4 border-b border-ink-600 pb-2 last:border-0"
                >
                  <dt className="font-mono text-[0.625rem] whitespace-nowrap text-mute-300">
                    {item.campo}
                  </dt>
                  <dd className="text-right text-xs text-paper-dim">
                    {item.valor}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="border-t border-ink-500 bg-ink-600 px-4 py-4">
            <p className="eyebrow">Próxima ação</p>
            <p className="mt-2 text-sm leading-relaxed text-paper">
              Confirmar a visita de sábado às 10h.
            </p>
            <p className="mt-1.5 font-mono text-[0.625rem] leading-relaxed text-signal">
              Ela pediu confirmação há 14h e não teve resposta.
            </p>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                className="flex-1 rounded-lg bg-signal px-3 py-2 text-xs font-medium text-ink-900 transition-colors hover:bg-signal-hot"
              >
                Usar mensagem pronta
              </button>
              <button
                type="button"
                className="rounded-lg border border-ink-400 px-3 py-2 text-xs text-paper-dim transition-colors hover:border-mute-300"
              >
                Mover no funil
              </button>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
