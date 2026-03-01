import { Zap } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col relative overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 gradient-primary opacity-10" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl" />

        <div className="relative z-10 p-8">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-xl text-white">Artemis</span>
          </Link>
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="max-w-sm">
            <h2 className="text-3xl font-bold text-white mb-4">
              Gerencie seu SaaS com total controle
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Plataforma completa para gestão de usuários, assinaturas,
              pagamentos e suporte. Tudo em um só lugar.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12 w-full max-w-sm">
            {[
              { value: "500+", label: "Empresas" },
              { value: "99.9%", label: "Uptime" },
              { value: "24/7", label: "Suporte" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-zinc-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 p-8">
          <p className="text-xs text-zinc-600 text-center">
            © {new Date().getFullYear()} Artemis. Todos os direitos reservados.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex flex-col items-center justify-center p-8 min-h-screen">
        <div className="lg:hidden mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-xl">Artemis</span>
          </Link>
        </div>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
