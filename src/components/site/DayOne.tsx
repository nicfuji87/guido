import { SectionShell } from "./SectionShell";

type Coluna = {
  nome: string;
  total: number;
  cards: string[];
  /** Colunas quentes recebem o barro. Só as que significam dinheiro perto. */
  quente?: boolean;
};

const COLUNAS: Coluna[] = [
  {
    nome: "Novo lead",
    total: 48,
    cards: ["Bruna M. · 2q Águas Claras", "Paulo R. · investimento"],
  },
  {
    nome: "Qualificando",
    total: 31,
    cards: ["Ana e Felipe · FGTS", "Denise C. · 3q Sudoeste"],
  },
  {
    nome: "Visita marcada",
    total: 12,
    cards: ["Rodrigo S. · sábado 10h"],
    quente: true,
  },
  {
    nome: "Proposta",
    total: 6,
    cards: ["Márcia T. · R$ 850 mil"],
    quente: true,
  },
  { nome: "Fechamento", total: 3, cards: ["Casal Nunes · minuta"] },
];

/**
 * Única seção em papel. O âmbar não sobrevive a fundo claro, então aqui o
 * calor vem do barro — mesma temperatura, substrato diferente.
 */
export function DayOne() {
  return (
    <SectionShell id="dia-um" folio="03 — DIA 1" invertido>
      <div data-reveal className="max-w-3xl">
        <p className="eyebrow">O diferencial que ninguém tem</p>
        <h2 className="mt-5 font-display text-4xl leading-[1.03] tracking-[-0.03em] text-ink-900 sm:text-5xl lg:text-[3.75rem]">
          Todo CRM começa com uma tela vazia.
          <span className="text-clay"> O seu começa cheio.</span>
        </h2>
        <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-500">
          É na tela vazia que o CRM morre — ninguém tem paciência de cadastrar
          duzentos clientes à mão. Então o Guido faz isso por você: no momento
          em que conecta, ele lê o histórico do seu WhatsApp e devolve o funil
          montado, com cada cliente já no lugar certo.
        </p>
      </div>

      <div
        data-reveal
        className="mt-16 overflow-x-auto rounded-xl border border-paper-dim bg-paper-lift p-6 shadow-[0_24px_60px_-40px_rgba(16,14,11,0.45)]"
      >
        <div className="flex min-w-max gap-5">
          {COLUNAS.map((coluna, i) => (
            <div key={coluna.nome} className="w-52 shrink-0">
              <div className="flex items-baseline justify-between border-b border-paper-dim pb-2.5">
                <span className="text-xs font-medium text-ink-700">
                  {coluna.nome}
                </span>
                <span
                  className={`font-mono text-xs ${
                    coluna.quente ? "text-clay" : "text-ink-400"
                  }`}
                >
                  {coluna.total}
                </span>
              </div>

              <div className="mt-3 space-y-2">
                {coluna.cards.map((card) => (
                  <div
                    key={card}
                    className={`rounded-md border px-3 py-2.5 text-[0.6875rem] leading-snug ${
                      coluna.quente
                        ? "border-clay/35 bg-clay/[0.06] text-ink-700"
                        : "border-paper-dim bg-paper text-ink-600"
                    }`}
                  >
                    {card}
                  </div>
                ))}
                {Array.from({ length: 2 }).map((_, j) => (
                  <div
                    key={j}
                    className="h-9 rounded-md border border-dashed border-paper-dim"
                    style={{ opacity: 0.85 - j * 0.35 }}
                  />
                ))}
              </div>

              {i === 0 && (
                <p className="mt-3 font-mono text-[0.625rem] leading-relaxed text-ink-400">
                  100 leads recuperados
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <p
        data-reveal
        className="mt-6 font-mono text-xs leading-relaxed text-ink-400"
      >
        Exemplo ilustrativo · O import de histórico está disponível na conexão
        por número próprio
      </p>
    </SectionShell>
  );
}
