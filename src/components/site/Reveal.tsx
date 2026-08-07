"use client";

import { useEffect } from "react";

/** Se nada tiver aparecido até aqui, assumimos que o observer não vai disparar. */
const REDE_DE_SEGURANCA_MS = 2000;

/**
 * Observa todo elemento com [data-reveal] e o revela ao entrar na viewport.
 * Fica montado uma única vez na página para que as seções continuem
 * sendo Server Components.
 *
 * O conteúdo começa com opacity:0 no CSS, então qualquer falha do observer
 * deixaria a página inteira em branco — o pior defeito possível num site de
 * marketing. Por isso existe a rede de segurança: se nada foi revelado depois
 * de REDE_DE_SEGURANCA_MS, mostramos tudo e desistimos da animação.
 * (Acontece de verdade: aba nunca pintada, prerender, WebView exótica.)
 */
export function Reveal() {
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    if (nodes.length === 0) return;

    const revelarTudo = () => nodes.forEach((n) => n.classList.add("is-in"));

    if (!("IntersectionObserver" in window)) {
      revelarTudo();
      return;
    }

    let revelados = 0;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          revelados += 1;
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    nodes.forEach((node) => observer.observe(node));

    const rede = window.setTimeout(() => {
      if (revelados === 0) {
        observer.disconnect();
        revelarTudo();
      }
    }, REDE_DE_SEGURANCA_MS);

    return () => {
      window.clearTimeout(rede);
      observer.disconnect();
    };
  }, []);

  return null;
}
