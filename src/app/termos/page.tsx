import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Zap } from "lucide-react";

export const metadata = {
  title: "Termos de Uso | Artemis",
  description: "Termos e condições de uso da plataforma Artemis.",
};

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-3xl py-16 px-4">
        <h1 className="text-3xl font-bold mb-2">Termos de Uso</h1>
        <p className="text-sm text-muted-foreground mb-10">
          Última atualização: {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
        </p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed text-muted-foreground [&_h2]:text-foreground [&_h2]:font-semibold [&_h2]:text-base [&_h2]:mb-3 [&_h2]:mt-8">

          <section>
            <h2>1. Aceitação dos termos</h2>
            <p>
              Ao criar uma conta ou utilizar a plataforma <strong className="text-foreground">Artemis</strong>,
              você ("Usuário") concorda com estes Termos de Uso. Caso não concorde, não utilize
              nossos serviços. Estes termos se aplicam a todos os usuários, administradores e
              empresas cadastradas na plataforma.
            </p>
          </section>

          <section>
            <h2>2. Descrição do serviço</h2>
            <p>
              A Artemis é uma plataforma SaaS B2B que fornece ferramentas para gestão de usuários,
              controle de assinaturas e pagamentos, sistema de chamados, notificações, logs de
              auditoria e configurações empresariais. O acesso é fornecido mediante assinatura de
              um dos planos disponíveis.
            </p>
          </section>

          <section>
            <h2>3. Cadastro e conta</h2>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>O cadastro é realizado por empresa (CNPJ obrigatório), com um usuário administrador.</li>
              <li>Você é responsável por manter a confidencialidade de suas credenciais de acesso.</li>
              <li>Informações fornecidas no cadastro devem ser verdadeiras e atualizadas.</li>
              <li>Uma conta por empresa. Contas duplicadas podem ser removidas sem aviso prévio.</li>
              <li>Você deve ter ao menos 18 anos e autoridade legal para contratar em nome da empresa.</li>
            </ul>
          </section>

          <section>
            <h2>4. Planos e pagamentos</h2>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Os planos e preços estão descritos na página de planos e podem ser alterados com aviso prévio de 30 dias.</li>
              <li>Pagamentos são processados pelo Stripe e cobrados conforme o intervalo do plano contratado (mensal ou anual).</li>
              <li>O não pagamento pode resultar na suspensão ou encerramento do acesso.</li>
              <li>Não há reembolso proporcional por cancelamento antecipado, exceto nos casos previstos no CDC.</li>
              <li>Um período de teste gratuito pode ser oferecido conforme indicado na página de planos.</li>
            </ul>
          </section>

          <section>
            <h2>5. Uso aceitável</h2>
            <p>É proibido utilizar a plataforma para:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Atividades ilegais, fraudulentas ou que violem direitos de terceiros.</li>
              <li>Envio de spam, phishing ou conteúdo malicioso.</li>
              <li>Acesso não autorizado a sistemas, contas ou dados de outras empresas.</li>
              <li>Armazenamento de dados sensíveis não relacionados ao objetivo da plataforma.</li>
              <li>Revenda ou sublicenciamento do acesso sem autorização expressa.</li>
              <li>Engenharia reversa, decompilação ou tentativa de extrair o código-fonte.</li>
            </ul>
          </section>

          <section>
            <h2>6. Propriedade intelectual</h2>
            <p>
              Todo o conteúdo, código, marca, logotipo e recursos da plataforma Artemis são de
              propriedade exclusiva da empresa operadora. O uso dos serviços não transfere nenhum
              direito de propriedade intelectual ao Usuário.
            </p>
            <p className="mt-2">
              Os dados inseridos pelo Usuário na plataforma pertencem ao Usuário. A Artemis não
              reivindica propriedade sobre seus dados.
            </p>
          </section>

          <section>
            <h2>7. Disponibilidade e SLA</h2>
            <p>
              Nos esforçamos para manter a plataforma disponível 99,5% do tempo. Manutenções
              programadas serão informadas com antecedência. Não garantimos disponibilidade
              ininterrupta e não nos responsabilizamos por perdas decorrentes de indisponibilidades
              fora do nosso controle (força maior, falhas de infraestrutura de terceiros, etc.).
            </p>
          </section>

          <section>
            <h2>8. Limitação de responsabilidade</h2>
            <p>
              A Artemis não se responsabiliza por danos indiretos, lucros cessantes ou perda de
              dados decorrentes do uso ou impossibilidade de uso da plataforma. Nossa
              responsabilidade total não excederá o valor pago pelo Usuário nos últimos 3 meses.
            </p>
          </section>

          <section>
            <h2>9. Cancelamento e encerramento</h2>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>O Usuário pode cancelar a assinatura a qualquer momento pelo painel de configurações.</li>
              <li>O acesso permanece ativo até o fim do período já pago.</li>
              <li>A Artemis pode encerrar contas que violem estes termos, sem reembolso.</li>
              <li>Após o encerramento, os dados ficam disponíveis para exportação por 30 dias.</li>
            </ul>
          </section>

          <section>
            <h2>10. Privacidade e dados</h2>
            <p>
              O tratamento dos seus dados pessoais é regido pela nossa{" "}
              <Link href="/privacidade" className="text-primary hover:underline">
                Política de Privacidade
              </Link>
              , em conformidade com a LGPD (Lei nº 13.709/2018).
            </p>
          </section>

          <section>
            <h2>11. Alterações nos termos</h2>
            <p>
              Podemos modificar estes Termos a qualquer momento. Alterações relevantes serão
              notificadas por e-mail com antecedência mínima de 15 dias. O uso continuado da
              plataforma após esse prazo implica aceitação das mudanças.
            </p>
          </section>

          <section>
            <h2>12. Lei aplicável e foro</h2>
            <p>
              Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o
              foro da comarca de São Paulo — SP para dirimir quaisquer controvérsias, com renúncia
              a qualquer outro, por mais privilegiado que seja.
            </p>
          </section>

          <section>
            <h2>13. Contato</h2>
            <p>
              Dúvidas sobre estes Termos? Fale conosco em{" "}
              <a href="mailto:suporte@artemis.com.br" className="text-primary hover:underline">
                suporte@artemis.com.br
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
            <Link href="/termos" className="hover:text-foreground text-foreground font-medium">Termos de Uso</Link>
            <Link href="/privacidade" className="hover:text-foreground">Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
