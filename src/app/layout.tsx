import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Artemis — Plataforma SaaS",
    template: "%s | Artemis",
  },
  description:
    "Plataforma SaaS completa para gestão empresarial com controle de usuários, assinaturas, pagamentos e suporte.",
  keywords: ["saas", "gestão", "empresas", "assinaturas"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
