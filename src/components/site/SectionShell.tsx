import type { ReactNode } from "react";

type Props = {
  id?: string;
  /** Numeração de margem, estilo revista. Dá ritmo vertical à página. */
  folio: string;
  /** Bloco claro no meio do site escuro. Usar com parcimônia — vale pelo choque. */
  invertido?: boolean;
  className?: string;
  children: ReactNode;
};

export function SectionShell({
  id,
  folio,
  invertido = false,
  className = "",
  children,
}: Props) {
  return (
    <section
      id={id}
      className={`relative border-t py-24 sm:py-32 ${
        invertido
          ? "invertido border-paper-dim"
          : "border-ink-600 bg-ink-800/60 backdrop-blur-[2px]"
      } ${className}`}
    >
      {/* Fica fora do fluxo e só aparece em telas largas: é ornamento com
          função, não informação que alguém precise ler. */}
      <span
        aria-hidden
        className="folio absolute top-24 left-6 hidden xl:block"
      >
        {folio}
      </span>

      <div className="relative mx-auto max-w-6xl px-6">{children}</div>
    </section>
  );
}
