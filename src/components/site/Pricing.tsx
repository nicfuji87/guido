import Link from "next/link";
import { SectionShell } from "./SectionShell";

/**
 * Base de custo (ago/2026): plano Negócios da CWMKT, R$ 499/mês FIXO —
 * 25 conexões, usuários ilimitados, Kanban e Perfex CRM inclusos, CRM negociado.
 *
 * O gargalo é CONEXÃO, não usuário. Corretor autônomo com número próprio
 * consome 1 conexão, logo ~25 assinantes por instância. A R$ 97 o break-even
 * é 6 assinantes; a 25 o custo cai para R$ 19,96 por corretor.
 *
 * Imobiliária em número central consome 1 conexão para a equipe inteira —
 * é onde a economia deste plano fica desproporcional.
 */
const PLANOS = [
  {
    nome: "Copiloto",
    preco: "97",
    resumo: "O Guido pensa. Você decide.",
    descricao:
      "Ele lê tudo, monta o funil, prioriza e escreve. Nada sai sem você apertar o botão.",
    itens: [
      "Funil montado a partir do seu histórico",
      "Ficha do cliente preenchida sozinha",
      "Fila do dia com justificativa",
      "Radar de lead esfriando",
      "Mensagens prontas para aprovar",
      "Conversas ilimitadas",
    ],
    cta: "Garantir preço de fundador",
    destaque: false,
  },
  {
    nome: "Autopiloto",
    preco: "197",
    resumo: "O Guido age. Você audita.",
    descricao:
      "Tudo do Copiloto, e mais: ele move o funil e responde sozinho — sempre mostrando o porquê, sempre com desfazer.",
    itens: [
      "Tudo do Copiloto",
      "Funil atualizado sozinho, com justificativa",
      "Desfazer em um clique, sempre",
      "Limite de confiança configurável",
      "Follow-up automático por etapa",
      "Ciclo de visita completo",
    ],
    cta: "Garantir preço de fundador",
    destaque: true,
  },
];

export function Pricing() {
  return (
    <SectionShell id="planos" folio="06 — PLANOS">
      <div>
        <div data-reveal className="max-w-2xl">
          <p className="eyebrow">Planos</p>
          <h2 className="mt-5 font-display text-4xl leading-[1.05] tracking-[-0.025em] sm:text-5xl">
            A diferença é só uma:
            <span className="text-signal"> quem aperta o botão.</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          {PLANOS.map((plano, i) => (
            <article
              key={plano.nome}
              data-reveal
              style={{ transitionDelay: `${i * 100}ms` }}
              className={`relative flex flex-col rounded-2xl border p-8 ${
                plano.destaque
                  ? "border-signal-dim bg-ink-600"
                  : "border-ink-500 bg-ink-700"
              }`}
            >
              {plano.destaque && (
                <span className="absolute -top-2.5 left-8 rounded-full bg-signal px-3 py-0.5 font-mono text-[0.625rem] font-bold tracking-wide text-ink-900">
                  MAIS ESCOLHIDO
                </span>
              )}

              <h3 className="font-display text-3xl tracking-[-0.02em] text-paper">
                {plano.nome}
              </h3>
              <p className="mt-1.5 text-sm text-signal">{plano.resumo}</p>

              <div className="mt-7 flex items-baseline gap-1.5">
                <span className="font-mono text-sm text-mute-300">R$</span>
                <span className="font-display text-6xl leading-none tracking-[-0.03em] text-paper">
                  {plano.preco}
                </span>
                <span className="font-mono text-sm text-mute-300">/mês</span>
              </div>

              <p className="mt-5 text-[0.9375rem] leading-relaxed text-mute-100">
                {plano.descricao}
              </p>

              <ul className="mt-7 flex-1 space-y-3 border-t border-ink-500 pt-7">
                {plano.itens.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <span
                      className={`mt-2 h-1 w-1 shrink-0 rounded-full ${
                        plano.destaque ? "bg-signal" : "bg-mute-300"
                      }`}
                    />
                    <span className="text-mute-100">{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/lista-de-espera"
                className={`mt-8 inline-flex items-center justify-center rounded-full px-6 py-3.5 font-medium transition-all ${
                  plano.destaque
                    ? "bg-signal text-ink-900 hover:bg-signal-hot hover:shadow-[0_0_30px_-6px_var(--color-signal)]"
                    : "border border-ink-400 text-paper hover:border-mute-300"
                }`}
              >
                {plano.cta}
              </Link>
            </article>
          ))}
        </div>

        <div
          data-reveal
          className="mt-6 flex flex-col gap-4 rounded-2xl border border-ink-500 bg-ink-700 p-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h3 className="font-display text-2xl tracking-[-0.02em] text-paper">
              Tem equipe?
            </h3>
            <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-mute-200">
              Distribuição de leads por performance, funil por corretor, visão
              do gestor e relatório de coaching. Preço por corretor.
            </p>
          </div>
          <Link
            href="/lista-de-espera"
            className="inline-flex shrink-0 items-center justify-center rounded-full border border-ink-400 px-6 py-3 text-sm text-paper transition-colors hover:border-mute-300"
          >
            Falar sobre imobiliária
          </Link>
        </div>
      </div>
    </SectionShell>
  );
}
