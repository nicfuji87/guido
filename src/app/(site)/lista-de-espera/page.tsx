import type { Metadata } from "next";
import { Reveal } from "@/components/site/Reveal";
import { NoiseLayer } from "@/components/site/NoiseLayer";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { WaitlistForm } from "@/components/site/WaitlistForm";

/* ===========================================================================
   A OFERTA — edite aqui. É o único lugar que precisa mudar.
   =========================================================================== */
const OFERTA = {
  vagas: 25,
  precoFundador: "67",
  precoLancamento: "97",
  beneficios: [
    {
      titulo: "Preço de fundador, travado para sempre",
      texto:
        "R$ 67 por mês enquanto você for assinante. Quando o preço subir para R$ 97, o seu não sobe. Nunca.",
    },
    {
      titulo: "Seu funil montado de graça na ativação",
      texto:
        "O Guido lê o histórico do seu WhatsApp e devolve seus clientes já organizados em funil. Você não digita nada.",
    },
    {
      titulo: "Primeiro mês por nossa conta",
      texto:
        "Você usa um mês inteiro antes de pagar o primeiro boleto. Se não valer, é só sair.",
    },
    {
      titulo: "Voz no que vai ser construído",
      texto:
        "Grupo direto com quem está fazendo o produto. O que te atrapalha no dia a dia entra na fila de desenvolvimento.",
    },
  ],
};
/* ======================================================================== */

export const metadata: Metadata = {
  title: "Turma Fundadores — 25 vagas",
  description:
    "Entre na lista de espera do Guido e garanta preço de fundador travado, funil montado de graça e o primeiro mês por nossa conta.",
  robots: { index: false, follow: true },
};

export default function ListaDeEspera() {
  return (
    <>
      <Reveal />
      <NoiseLayer />
      <Nav anuncio={false} />

      <main className="grain relative overflow-hidden pt-32 pb-24 sm:pt-40">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-52 left-1/2 h-[44rem] w-[66rem] -translate-x-1/2 rounded-full opacity-[0.15] blur-[130px]"
          style={{
            background:
              "radial-gradient(closest-side, var(--color-signal), transparent)",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            {/* A oferta */}
            <div>
              <p className="eyebrow animate-rise">Turma Fundadores</p>

              <h1 className="mt-6 font-display leading-[0.95] tracking-[-0.035em]">
                <span
                  className="animate-numeral block text-[clamp(5rem,14vw,11rem)] text-signal"
                  style={{ animationDelay: "0.12s" }}
                >
                  {OFERTA.vagas}
                </span>
                <span
                  className="animate-rise mt-2 block text-[clamp(1.75rem,4.4vw,3.25rem)] text-paper-dim"
                  style={{ animationDelay: "0.3s" }}
                >
                  vagas. Depois,
                  <br />
                  preço cheio.
                </span>
              </h1>

              <p
                className="animate-rise mt-8 max-w-lg text-lg leading-relaxed text-mute-100"
                style={{ animationDelay: "0.44s" }}
              >
                O Guido ainda está sendo construído. A lista é aberta a todo
                mundo — e as {OFERTA.vagas} primeiras pessoas dela entram como
                fundadoras, por ordem de chegada.
              </p>

              <ul className="mt-12 space-y-9">
                {OFERTA.beneficios.map((b, i) => (
                  <li
                    key={b.titulo}
                    data-reveal
                    style={{ transitionDelay: `${i * 90}ms` }}
                    className="flex gap-5"
                  >
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-signal" />
                    <div>
                      <h2 className="font-display text-xl leading-snug tracking-[-0.015em] text-paper sm:text-2xl">
                        {b.titulo}
                      </h2>
                      <p className="mt-2 max-w-md leading-relaxed text-mute-200">
                        {b.texto}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Escassez honesta: o número tem uma razão técnica, e dizer
                  qual é vale mais do que fingir urgência. */}
              <div
                data-reveal
                className="mt-12 max-w-lg rounded-2xl border border-ink-500 bg-ink-700 p-6"
              >
                <p className="eyebrow">
                  Por que só {OFERTA.vagas} com preço de fundador?
                </p>
                <p className="mt-3 leading-relaxed text-mute-200">
                  Porque é quantos WhatsApp a nossa infraestrutura atende na
                  primeira turma. Não é gatilho de venda — é o teto real. A
                  lista continua aberta depois disso: quem entrar além das{" "}
                  {OFERTA.vagas} primeiras é avisado assim que abrirmos a turma
                  seguinte, pelo preço de lançamento.
                </p>
              </div>
            </div>

            {/* O formulário */}
            <div className="lg:pt-8">
              <div
                className="animate-rise lg:sticky lg:top-28"
                style={{ animationDelay: "0.36s" }}
              >
                <div className="rounded-2xl border border-ink-500 bg-ink-700 p-7 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] sm:p-8">
                  <p className="font-display text-2xl leading-tight tracking-[-0.02em] text-paper">
                    Entre agora, entre cedo
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-mute-200">
                    Leva vinte segundos. Quanto antes você entrar, mais perto
                    fica das {OFERTA.vagas} vagas de fundador.
                  </p>

                  <div className="mt-7">
                    <WaitlistForm origem="palestra" />
                  </div>
                </div>

                <div className="mt-4 flex items-baseline justify-center gap-2 font-mono text-xs text-mute-300">
                  <span className="text-mute-100">
                    R$ {OFERTA.precoFundador}/mês
                  </span>
                  <span className="line-through">
                    R$ {OFERTA.precoLancamento}
                  </span>
                  <span>no lançamento</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
