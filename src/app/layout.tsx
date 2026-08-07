import type { Metadata, Viewport } from "next";
import { Fraunces, Archivo, Martian_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

const martianMono = Martian_Mono({
  variable: "--font-martian",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://guido.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Guido — a inteligência de vendas do corretor de imóveis",
    template: "%s · Guido",
  },
  description:
    "Seu WhatsApp tem 200 conversas. Três vão virar venda. O Guido descobre quais, monta seu funil sozinho e diz o que falar.",
  keywords: [
    "CRM para corretor de imóveis",
    "IA para corretor imobiliário",
    "funil de vendas imobiliário",
    "WhatsApp para corretor",
    "gestão de leads imobiliários",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: "Guido",
    title: "Guido — a inteligência de vendas do corretor de imóveis",
    description:
      "Seu WhatsApp tem 200 conversas. Três vão virar venda. O Guido descobre quais.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Guido — a inteligência de vendas do corretor de imóveis",
    description:
      "Seu WhatsApp tem 200 conversas. Três vão virar venda. O Guido descobre quais.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#100e0b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${fraunces.variable} ${archivo.variable} ${martianMono.variable} antialiased`}
      >
        {/* Sem JS não há IntersectionObserver, e o conteúdo ficaria invisível
            para sempre. Este bloco devolve tudo — inclusive para crawlers que
            não executam script. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
