import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Atalho para falar em palco: "guidoguia.com.br barra vaga".
      { source: "/vaga", destination: "/lista-de-espera", permanent: false },
      { source: "/fundador", destination: "/lista-de-espera", permanent: false },

      // Rotas do v1 que ainda circulam por aí. Melhor cair na lista do que em 404.
      { source: "/cadastro", destination: "/lista-de-espera", permanent: false },
      { source: "/entrar", destination: "/lista-de-espera", permanent: false },
      {
        source: "/imobiliarias",
        destination: "/lista-de-espera",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
