type Coluna = {
  nome: string;
  total: number;
  cards: string[];
  /** Colunas quentes recebem o âmbar. Só as que significam dinheiro perto. */
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

export function DayOne() {
  return (
    <section
      id="dia-um"
      className="grain relative overflow-hidden border-t border-ink-600 py-24 sm:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/4 h-[30rem] w-[40rem] rounded-full opacity-[0.10] blur-[130px]"
        style={{
          background:
            "radial-gradient(closest-side, var(--color-signal), transparent)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div data-reveal className="max-w-3xl">
          <p className="eyebrow">O diferencial que ninguém tem</p>
          <h2 className="mt-5 font-display text-4xl leading-[1.05] tracking-[-0.025em] sm:text-5xl lg:text-[3.5rem]">
            Todo CRM começa com uma tela vazia.
            <span className="text-signal"> O seu começa cheio.</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-mute-100">
            É na tela vazia que o CRM morre — ninguém tem paciência de cadastrar
            duzentos clientes à mão. Então o Guido faz isso por você: no momento
            em que conecta, ele lê o histórico do seu WhatsApp e devolve o funil
            montado, com cada cliente já no lugar certo.
          </p>
        </div>

        <div
          data-reveal
          className="mt-14 overflow-x-auto rounded-2xl border border-ink-500 bg-ink-700 p-5 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]"
        >
          <div className="flex min-w-max gap-4">
            {COLUNAS.map((coluna, i) => (
              <div key={coluna.nome} className="w-52 shrink-0">
                <div className="flex items-baseline justify-between border-b border-ink-500 pb-2.5">
                  <span className="text-xs font-medium text-paper-dim">
                    {coluna.nome}
                  </span>
                  <span
                    className={`font-mono text-xs ${
                      coluna.quente ? "text-signal" : "text-mute-300"
                    }`}
                  >
                    {coluna.total}
                  </span>
                </div>

                <div className="mt-3 space-y-2">
                  {coluna.cards.map((card) => (
                    <div
                      key={card}
                      className={`rounded-lg border px-3 py-2.5 text-[0.6875rem] leading-snug ${
                        coluna.quente
                          ? "border-signal-dim/50 bg-ink-600 text-paper-dim"
                          : "border-ink-500 bg-ink-600/60 text-mute-200"
                      }`}
                    >
                      {card}
                    </div>
                  ))}
                  {/* Cards restantes, sugeridos como blocos vazios */}
                  {Array.from({ length: 2 }).map((_, j) => (
                    <div
                      key={j}
                      className="h-9 rounded-lg border border-dashed border-ink-500/70"
                      style={{ opacity: 0.4 - j * 0.15 }}
                    />
                  ))}
                </div>

                {i === 0 && (
                  <p className="mt-3 font-mono text-[0.625rem] leading-relaxed text-mute-300">
                    100 leads recuperados
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <p
          data-reveal
          className="mt-6 font-mono text-xs leading-relaxed text-mute-300"
        >
          Exemplo ilustrativo · O import de histórico está disponível na conexão
          por número próprio
        </p>
      </div>
    </section>
  );
}
