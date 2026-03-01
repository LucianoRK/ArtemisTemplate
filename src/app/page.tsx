import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Zap, Shield, Users, CreditCard, Bell, Headphones,
  BarChart3, Globe, Lock, CheckCircle2, ArrowRight, Star,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Users,
    title: "Gestão de Usuários",
    description: "Controle total de usuários, permissões e papéis dentro da plataforma.",
  },
  {
    icon: CreditCard,
    title: "Assinaturas & Pagamentos",
    description: "Integração nativa com Stripe para gestão de planos e cobranças automáticas.",
  },
  {
    icon: Bell,
    title: "Notificações em Tempo Real",
    description: "Mantenha sua equipe informada com notificações instantâneas e personalizáveis.",
  },
  {
    icon: Headphones,
    title: "Suporte por Chamados",
    description: "Sistema de tickets completo para atendimento ao cliente eficiente.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Logs",
    description: "Auditoria completa de todas as ações com dashboards intuitivos.",
  },
  {
    icon: Shield,
    title: "Segurança Avançada",
    description: "Autenticação JWT, controle de acesso e criptografia de dados.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "R$ 99",
    period: "/mês",
    description: "Ideal para pequenas empresas",
    features: [
      "Até 5 usuários",
      "1 empresa",
      "Suporte por email",
      "Relatórios básicos",
      "5GB de armazenamento",
    ],
    cta: "Começar agora",
    popular: false,
  },
  {
    name: "Pro",
    price: "R$ 299",
    period: "/mês",
    description: "Para equipes em crescimento",
    features: [
      "Até 25 usuários",
      "5 empresas",
      "Suporte prioritário",
      "Relatórios avançados",
      "50GB de armazenamento",
      "API access",
      "Integrações avançadas",
    ],
    cta: "Assinar Pro",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Sob consulta",
    period: "",
    description: "Para grandes organizações",
    features: [
      "Usuários ilimitados",
      "Empresas ilimitadas",
      "Suporte dedicado 24/7",
      "Relatórios customizados",
      "Armazenamento ilimitado",
      "SLA garantido",
      "Onboarding personalizado",
    ],
    cta: "Falar com vendas",
    popular: false,
  },
];

const testimonials = [
  {
    name: "Ana Silva",
    role: "CEO, TechCorp",
    avatar: "AS",
    content:
      "O Artemis transformou como gerenciamos nossas assinaturas. A integração com Stripe é perfeita e economizamos horas por semana.",
    rating: 5,
  },
  {
    name: "Carlos Mendes",
    role: "CTO, StartupXYZ",
    avatar: "CM",
    content:
      "A melhor plataforma SaaS que já usei. O sistema de chamados é excelente e a equipe de suporte é muito prestativa.",
    rating: 5,
  },
  {
    name: "Maria Santos",
    role: "Diretora, AgênciaDigital",
    avatar: "MS",
    content:
      "Implementamos em 1 semana e já vimos resultados. Os logs de auditoria nos dão total visibilidade das operações.",
    rating: 5,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="container text-center">
          <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm">
            <Zap className="h-3.5 w-3.5 mr-1.5 text-primary" />
            Plataforma SaaS completa para empresas modernas
          </Badge>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Gerencie seu SaaS com{" "}
            <span className="bg-clip-text text-transparent gradient-primary">
              total controle
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Template Next.js completo com autenticação, gestão de usuários,
            assinaturas Stripe, notificações e suporte. Pronto para produção em
            minutos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="xl" variant="gradient" asChild>
              <Link href="/registro">
                Começar grátis
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="xl" variant="outline" asChild>
              <Link href="/login">Ver demo</Link>
            </Button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            {["Sem cartão de crédito", "Setup em 5 minutos", "Cancele quando quiser"].map(
              (item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {item}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="recursos" className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Recursos</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Uma suite completa de ferramentas para gerenciar, escalar e monitorar
              sua plataforma SaaS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="hover:shadow-lg transition-shadow duration-300 border-0 bg-background"
              >
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tech stack */}
      <section className="py-16 border-y">
        <div className="container">
          <p className="text-center text-sm text-muted-foreground mb-8">
            Construído com as melhores tecnologias do mercado
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
            {["Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "shadcn/ui", "NextAuth.js", "Stripe", "TanStack Query"].map(
              (tech) => (
                <div key={tech} className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm font-medium">{tech}</span>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="planos" className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Planos</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Preço transparente e justo
            </h2>
            <p className="text-muted-foreground">
              Escolha o plano ideal para o tamanho do seu negócio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative flex flex-col ${
                  plan.popular
                    ? "border-primary shadow-xl shadow-primary/10 scale-105"
                    : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="px-3 py-1">Mais popular</Badge>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.popular ? "gradient" : "outline"}
                    className="w-full mt-4"
                    asChild
                  >
                    <Link href="/registro">{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Depoimentos</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              O que nossos clientes dizem
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="border-0 bg-background">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    &ldquo;{t.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-sm font-semibold text-primary-foreground">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="container max-w-3xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Perguntas frequentes</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Posso cancelar a qualquer momento?",
                a: "Sim, você pode cancelar sua assinatura a qualquer momento sem taxas ou penalidades.",
              },
              {
                q: "Como funciona o período de teste?",
                a: "Oferecemos 14 dias de teste gratuito sem necessidade de cartão de crédito.",
              },
              {
                q: "Os pagamentos são seguros?",
                a: "Sim, usamos Stripe para processar pagamentos, garantindo total segurança e conformidade com PCI DSS.",
              },
              {
                q: "Posso migrar meus dados existentes?",
                a: "Sim, oferecemos suporte completo para migração de dados. Nossa equipe pode ajudá-lo no processo.",
              },
            ].map((faq) => (
              <Card key={faq.q} className="border-0 bg-muted/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t">
        <div className="container text-center">
          <div className="relative inline-flex flex-col items-center">
            <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-3xl" />
            <div className="relative space-y-6 py-16 px-8">
              <Lock className="h-12 w-12 text-primary mx-auto" />
              <h2 className="text-3xl md:text-4xl font-bold">
                Comece a usar hoje mesmo
              </h2>
              <p className="text-muted-foreground max-w-md">
                Junte-se a centenas de empresas que já gerenciam seus negócios com
                o Artemis.
              </p>
              <Button size="xl" variant="gradient" asChild>
                <Link href="/registro">
                  Criar conta grátis
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded gradient-primary flex items-center justify-center">
                <Zap className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-bold">Artemis</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Artemis. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground">Privacidade</Link>
              <Link href="#" className="hover:text-foreground">Termos</Link>
              <Link href="#" className="hover:text-foreground">Contato</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
