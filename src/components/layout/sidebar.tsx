"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  LayoutDashboard, Users, Building2, CreditCard, Receipt,
  Settings, FileText, Bell, Headphones, Zap, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Usuários",
    href: "/dashboard/usuarios",
    icon: Users,
  },
  {
    title: "Empresas",
    href: "/dashboard/empresas",
    icon: Building2,
  },
  {
    title: "Assinatura",
    href: "/dashboard/assinatura",
    icon: Zap,
  },
  {
    title: "Pagamentos",
    href: "/dashboard/pagamentos",
    icon: CreditCard,
  },
  {
    title: "Chamados",
    href: "/dashboard/chamados",
    icon: Headphones,
  },
  {
    title: "Notificações",
    href: "/dashboard/notificacoes",
    icon: Bell,
  },
  {
    title: "Logs",
    href: "/dashboard/logs",
    icon: FileText,
  },
  {
    title: "Configurações",
    href: "/dashboard/configuracoes",
    icon: Settings,
  },
  {
    title: "Pagamento Registrar",
    href: "/dashboard/pagamentos/registrar",
    icon: Receipt,
    hidden: true,
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const visibleItems = navItems.filter((item) => !item.hidden);

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "relative flex flex-col border-r bg-sidebar transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          className
        )}
      >
        {/* Logo */}
        <div className={cn("flex items-center h-16 border-b px-4", collapsed && "justify-center px-0")}>
          {collapsed ? (
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
          ) : (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-lg bg-clip-text text-transparent gradient-primary">
                Artemis
              </span>
            </Link>
          )}
        </div>

        {/* Nav */}
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-2">
            {visibleItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return collapsed ? (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex h-10 w-10 mx-auto items-center justify-center rounded-lg transition-all duration-200",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.title}</TooltipContent>
                </Tooltip>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 h-10 rounded-lg px-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Collapse button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-20 h-6 w-6 rounded-full border bg-background shadow-md"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>
      </aside>
    </TooltipProvider>
  );
}
