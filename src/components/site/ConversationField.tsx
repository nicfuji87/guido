const NOISE_WIDTHS = [
  [62, 84],
  [45, 72],
  [70, 55],
  [52, 90],
  [58, 66],
  [66, 78],
  [48, 60],
  [74, 82],
] as const;

type Signal = {
  nome: string;
  previa: string;
  hora: string;
  score: number;
  motivo: string;
};

const SIGNALS: Signal[] = [
  {
    nome: "Márcia Toledo",
    previa: "Consegue me mandar a planta do 302?",
    hora: "ontem 19:42",
    score: 94,
    motivo: "Pré-aprovada · R$ 850 mil · sem resposta há 14h",
  },
  {
    nome: "Rodrigo Sales",
    previa: "Podemos ver no sábado de manhã?",
    hora: "08:15",
    score: 88,
    motivo: "Pediu visita · você ainda não confirmou",
  },
  {
    nome: "Ana e Felipe",
    previa: "O FGTS entra na entrada?",
    hora: "11:03",
    score: 81,
    motivo: "Casal decisor · mudança em 60 dias",
  },
];

function NoiseRow({ widths }: { widths: readonly [number, number] }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 opacity-45">
      <div className="size-8 shrink-0 rounded-full bg-ink-500" />
      <div className="min-w-0 flex-1 space-y-1.5">
        <div
          className="h-2 rounded-full bg-ink-500"
          style={{ width: `${widths[0]}%` }}
        />
        <div
          className="h-2 rounded-full bg-ink-500/70"
          style={{ width: `${widths[1]}%` }}
        />
      </div>
      <div className="h-2 w-8 shrink-0 rounded-full bg-ink-500/60" />
    </div>
  );
}

function SignalRow({ signal, rank }: { signal: Signal; rank: number }) {
  return (
    <div className="relative border-y border-signal-dim/40 bg-ink-600 px-4 py-3.5">
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-[3px] bg-signal"
      />
      <div className="flex items-start gap-3">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-signal font-mono text-xs font-bold text-ink-900">
          {rank}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <p className="truncate text-sm font-medium text-paper">
              {signal.nome}
            </p>
            <span className="shrink-0 font-mono text-[0.625rem] text-mute-300">
              {signal.hora}
            </span>
          </div>
          <p className="mt-0.5 truncate text-sm text-mute-100">
            {signal.previa}
          </p>
          <p className="mt-1.5 font-mono text-[0.625rem] leading-relaxed text-signal">
            {signal.motivo}
          </p>
        </div>

        <div className="shrink-0 rounded-md border border-signal-dim/60 px-1.5 py-0.5 font-mono text-[0.625rem] text-signal">
          {signal.score}
        </div>
      </div>
    </div>
  );
}

/**
 * O visual-âncora do site: a lista do corretor, quase toda apagada,
 * com três conversas acesas. É o produto inteiro numa imagem.
 */
export function ConversationField() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-ink-500 bg-ink-700 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
      <div className="flex items-center justify-between border-b border-ink-500 px-4 py-3">
        <span className="eyebrow">Suas conversas</span>
        <span className="font-mono text-[0.625rem] text-mute-300">203</span>
      </div>

      <div className="relative">
        <NoiseRow widths={NOISE_WIDTHS[0]} />
        <NoiseRow widths={NOISE_WIDTHS[1]} />
        <SignalRow signal={SIGNALS[0]} rank={1} />
        <NoiseRow widths={NOISE_WIDTHS[2]} />
        <NoiseRow widths={NOISE_WIDTHS[3]} />
        <SignalRow signal={SIGNALS[1]} rank={2} />
        <NoiseRow widths={NOISE_WIDTHS[4]} />
        <SignalRow signal={SIGNALS[2]} rank={3} />
        <NoiseRow widths={NOISE_WIDTHS[5]} />
        <NoiseRow widths={NOISE_WIDTHS[6]} />
        <NoiseRow widths={NOISE_WIDTHS[7]} />

        {/* Esvanece o fim da lista: o ruído continua para sempre */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
          style={{
            background:
              "linear-gradient(to top, var(--color-ink-700), transparent)",
          }}
        />
      </div>

      <div className="relative border-t border-ink-500 px-4 py-3">
        <p className="font-mono text-[0.625rem] leading-relaxed text-mute-200">
          <span className="text-signal">3 conversas</span> valem sua manhã.
          <span className="text-mute-300"> As outras 200 podem esperar.</span>
        </p>
      </div>
    </div>
  );
}
