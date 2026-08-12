import type { Metadata } from "next";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export const metadata: Metadata = {
  title: "Privacidade",
  description:
    "Como o Guido trata os dados de quem entra na lista de espera da Turma Fundadores.",
};

const CONTATO = "contato@guidoguia.com.br";

/**
 * Descreve apenas o que o Guido faz HOJE: uma lista de espera.
 * Quando o produto começar a ler conversas de WhatsApp, esta página precisa
 * ser reescrita antes — não depois.
 */
export default function Privacidade() {
  return (
    <>
      <Nav />

      <main className="relative mx-auto max-w-3xl px-6 pt-36 pb-24 sm:pt-44">
        <p className="eyebrow">Privacidade</p>
        <h1 className="mt-5 font-display text-4xl leading-[1.05] tracking-[-0.03em] sm:text-5xl">
          O que fazemos com os seus dados.
        </h1>
        <p className="mt-6 font-mono text-xs text-mute-300">
          Vigente desde 12 de agosto de 2026
        </p>

        <div className="mt-14 space-y-12">
          <section>
            <h2 className="font-display text-2xl tracking-[-0.02em] text-paper">
              Hoje o Guido só tem uma lista de espera
            </h2>
            <p className="mt-4 leading-relaxed text-mute-100">
              O produto ainda está sendo construído. Neste momento não lemos,
              armazenamos nem processamos nenhuma conversa de WhatsApp — nem
              sua, nem dos seus clientes. A única coisa que coletamos é o que
              você digita no formulário da Turma Fundadores.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-[-0.02em] text-paper">
              O que coletamos
            </h2>
            <ul className="mt-4 space-y-2.5 text-mute-100">
              {[
                "Seu nome, para saber como te chamar.",
                "Seu número de WhatsApp, para avisar quando sua vaga abrir.",
                "Seu e-mail, se você quiser informar — é opcional.",
                "Se você atende por conta própria ou numa imobiliária.",
              ].map((item) => (
                <li key={item} className="flex gap-3 leading-relaxed">
                  <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-signal" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-[-0.02em] text-paper">
              Para que usamos
            </h2>
            <p className="mt-4 leading-relaxed text-mute-100">
              Só para te avisar da abertura e conversar sobre o produto. Nada
              de disparo em massa, nada de assunto que não seja o Guido.{" "}
              <strong className="text-paper">
                Não vendemos, alugamos nem repassamos sua lista para ninguém
              </strong>{" "}
              — nem para parceiros, nem para anunciantes.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-[-0.02em] text-paper">
              Onde ficam guardados
            </h2>
            <p className="mt-4 leading-relaxed text-mute-100">
              Num banco de dados Supabase com acesso restrito, criptografado em
              trânsito e em repouso. A chave pública do site consegue apenas
              gravar novos cadastros — ela não consegue ler a lista. Só quem tem
              credencial administrativa acessa os contatos.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-[-0.02em] text-paper">
              Seus direitos
            </h2>
            <p className="mt-4 leading-relaxed text-mute-100">
              Pela LGPD você pode pedir, a qualquer momento e sem justificar, o
              acesso, a correção ou a exclusão dos seus dados. Responder{" "}
              <span className="font-mono text-signal">sair</span> em qualquer
              mensagem nossa já basta para te tirar da lista, e apagamos o
              cadastro. Se preferir escrever, é só mandar um e-mail.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-[-0.02em] text-paper">
              Por quanto tempo
            </h2>
            <p className="mt-4 leading-relaxed text-mute-100">
              Até o lançamento e por até doze meses depois dele. Passado esse
              prazo, quem não virou cliente é apagado da base — não guardamos
              contato por hábito.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl tracking-[-0.02em] text-paper">
              Falar com a gente
            </h2>
            <p className="mt-4 leading-relaxed text-mute-100">
              Qualquer dúvida ou pedido sobre seus dados:{" "}
              <a
                href={`mailto:${CONTATO}`}
                className="text-signal underline underline-offset-4 hover:text-signal-hot"
              >
                {CONTATO}
              </a>
              .
            </p>
          </section>

          <section className="rounded-2xl border border-ink-500 bg-ink-700 p-6">
            <p className="eyebrow">Quando o produto abrir</p>
            <p className="mt-3 leading-relaxed text-mute-200">
              O Guido vai passar a ler conversas do seu WhatsApp para montar seu
              funil. Isso muda tudo o que está escrito aqui — e por isso esta
              página será reescrita e apresentada a você{" "}
              <strong className="text-paper">antes</strong> de qualquer conexão
              ser feita. Você vai saber exatamente o que é lido, por quê, e por
              quanto tempo fica guardado, e vai precisar concordar.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
