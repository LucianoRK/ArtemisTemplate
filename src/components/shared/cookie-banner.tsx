"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const COOKIE_KEY = "artemis_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_KEY);
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem(COOKIE_KEY, "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none">
      <div className="mx-auto max-w-4xl rounded-2xl border bg-background/95 backdrop-blur-sm shadow-2xl p-4 md:p-6 pointer-events-auto">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Cookie className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium mb-1">Utilizamos cookies</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Usamos cookies essenciais para o funcionamento da plataforma e cookies analíticos
                para melhorar sua experiência. Seus dados são tratados conforme nossa{" "}
                <Link href="/privacidade" className="text-primary underline underline-offset-2 hover:opacity-80">
                  Política de Privacidade
                </Link>
                {" "}e{" "}
                <Link href="/termos" className="text-primary underline underline-offset-2 hover:opacity-80">
                  Termos de Uso
                </Link>
                .
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" size="sm" onClick={decline} className="text-muted-foreground">
              Só essenciais
            </Button>
            <Button variant="gradient" size="sm" onClick={accept}>
              Aceitar tudo
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground md:hidden"
              onClick={decline}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
