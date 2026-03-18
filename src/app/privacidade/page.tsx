import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Zap } from "lucide-react";

export const metadata = {
  title: "Política de Privacidade | Artemis",
  description: "Como coletamos, usamos e protegemos seus dados pessoais.",
};

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-3xl py-16 px-4">
        <h1 className="text-3xl font-bold mb-2">Política de Privacidade</h1>
        <p className="text-sm text-muted-foreground mb-10">
          Última atualização: {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
        </p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed text-muted-foreground [&_h2]:text-foreground [&_h2]:font-semibold [&_h2]:text-base [&_h2]:mb-3 [&_h2]:mt-8">

          <section>
            <h2>1. Quem somos</h2>
            <p>
              A <strong className="text-foreground">Artemis</strong> é uma plataforma SaaS B2B que oferece ferramentas de gestão de
              usuários, assinaturas, pagamentos e suporte para empresas. Neste documento,
              "nós", "nosso" ou "Artemis" referem-se à empresa operadora da plataforma.
            </p>
          </section>

          <section>
            <h2>2. Dados que coletamos</h2>
            <p>Coletamos os seguintes dados pessoais e empresariais:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong className="text-foreground">Dados de cadastro:</strong> nome completo, e-mail, telefone, CNPJ e razão social da empresa.</li>
              <li><strong className="text-foreground">Dados de acesso:</strong> endereço IP, data e hora de login, dispositivo e navegador.</li>
              <li><strong className="text-foreground">Dados de pagamento:</strong> informações de cobrança processadas pelo Stripe (não armazenamos dados de cartão diretamente).</li>
              <li><strong className="text-foreground">Dados de uso:</strong> ações realizadas na plataforma, logs de auditoria e registros de suporte.</li>
              <li><strong className="text-foreground">Cookies:</strong> identificadores de sessão e preferências de interface.</li>
            </ul>
          </section>

          <section>
            <h2>3. Como usamos seus dados</h2>
            <p>Utilizamos seus dados para:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Criar e gerenciar sua conta e a conta da sua empresa.</li>
              <li>Processar pagamentos e gerenciar assinaturas.</li>
              <li>Prestar suporte técnico e atender chamados.</li>
              <li>Enviar notificações relacionadas ao serviço.</li>
              <li>Garantir a segurança da plataforma e prevenir fraudes.</li>
              <li>Cumprir obrigações legais e regulatórias.</li>
              <li>Melhorar nossos serviços com base em dados de uso anonimizados.</li>
            </ul>
          </section>

          <section>
            <h2>4. Base legal para o tratamento (LGPD)</h2>
            <p>
              O tratamento de dados pessoais realizado pela Artemis tem como bases legais (nos termos
              da Lei nº 13.709/2018 — LGPD):
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong className="text-foreground">Execução de contrato:</strong> para criar e manter sua conta e fornecer os serviços contratados.</li>
              <li><strong className="text-foreground">Consentimento:</strong> para envio de comunicações de marketing (quando aplicável).</li>
              <li><strong className="text-foreground">Legítimo interesse:</strong> para segurança da plataforma, prevenção a fraudes e melhorias do serviço.</li>
              <li><strong className="text-foreground">Obrigação legal:</strong> para cumprimento de exigências fiscais e regulatórias.</li>
            </ul>
          </section>

          <section>
            <h2>5. Compartilhamento de dados</h2>
            <p>
              Não vendemos seus dados pessoais. Podemos compartilhá-los apenas com:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong className="text-foreground">Stripe:</strong> processamento de pagamentos.</li>
              <li><strong className="text-foreground">Provedores de infraestrutura:</strong> servidores em nuvem (Railway/Vercel) com contratos de confidencialidade.</li>
              <li><strong className="text-foreground">Autoridades:</strong> quando exigido por lei ou ordem judicial.</li>
            </ul>
          </section>

          <section>
            <h2>6. Cookies</h2>
            <p>Utilizamos os seguintes tipos de cookies:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong className="text-foreground">Essenciais:</strong> necessários para o funcionamento da plataforma (autenticação, sessão).</li>
              <li><strong className="text-foreground">Analíticos:</strong> para entender como a plataforma é utilizada (dados anonimizados).</li>
              <li><strong className="text-foreground">Preferências:</strong> para salvar configurações como tema e idioma.</li>
            </ul>
            <p className="mt-2">
              Você pode gerenciar suas preferências de cookies a qualquer momento nas configurações
              do navegador ou através do nosso banner de cookies.
            </p>
          </section>

          <section>
            <h2>7. Retenção de dados</h2>
            <p>
              Mantemos seus dados enquanto sua conta estiver ativa. Após o encerramento, os dados
              são retidos por até 5 anos para fins fiscais e legais, sendo então excluídos de forma
              segura.
            </p>
          </section>

          <section>
            <h2>8. Seus direitos (LGPD)</h2>
            <p>Você tem direito a:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Confirmar a existência do tratamento de seus dados.</li>
              <li>Acessar seus dados pessoais.</li>
              <li>Corrigir dados incompletos, inexatos ou desatualizados.</li>
              <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários.</li>
              <li>Solicitar a portabilidade dos dados.</li>
              <li>Revogar o consentimento a qualquer momento.</li>
            </ul>
            <p className="mt-2">
              Para exercer seus direitos, entre em contato pelo e-mail{" "}
              <a href="mailto:privacidade@artemis.com.br" className="text-primary hover:underline">
                privacidade@artemis.com.br
              </a>
              .
            </p>
          </section>

          <section>
            <h2>9. Segurança</h2>
            <p>
              Adotamos medidas técnicas e organizacionais para proteger seus dados, incluindo
              criptografia em trânsito (TLS), autenticação segura (JWT), controle de acesso por
              perfil e logs de auditoria de todas as operações.
            </p>
          </section>

          <section>
            <h2>10. Alterações nesta política</h2>
            <p>
              Podemos atualizar esta política periodicamente. Notificaremos usuários sobre mudanças
              relevantes por e-mail ou através da plataforma. O uso continuado dos serviços após a
              notificação implica aceitação das alterações.
            </p>
          </section>

          <section>
            <h2>11. Contato</h2>
            <p>
              Dúvidas sobre esta política? Entre em contato com nosso Encarregado de Proteção de
              Dados (DPO) em{" "}
              <a href="mailto:privacidade@artemis.com.br" className="text-primary hover:underline">
                privacidade@artemis.com.br
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t py-8 mt-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded gradient-primary flex items-center justify-center">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-foreground">Artemis</span>
          </div>
          <div className="flex gap-4">
            <Link href="/termos" className="hover:text-foreground">Termos de Uso</Link>
            <Link href="/privacidade" className="hover:text-foreground text-foreground font-medium">Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
