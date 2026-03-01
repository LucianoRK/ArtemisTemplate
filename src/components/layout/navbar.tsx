"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun, Zap, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Recursos", href: "#recursos" },
  { label: "Planos", href: "#planos" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-xl">Artemis</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
            <Button variant="gradient" asChild>
              <Link href="/registro">Começar grátis</Link>
            </Button>
          </div>

          {/* Mobile toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300",
          mobileOpen ? "max-h-96 border-b" : "max-h-0"
        )}
      >
        <div className="container py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium hover:text-primary"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2 border-t">
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
            <Button variant="gradient" className="flex-1" asChild>
              <Link href="/registro">Começar grátis</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
