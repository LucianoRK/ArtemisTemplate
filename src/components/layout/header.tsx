"use client";

import { useTheme } from "next-themes";
import { Bell, Moon, Sun, LogOut, User, Settings, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotificacoesNaoLidas } from "@/hooks/use-notificacoes";
import { getInitials } from "@/lib/utils";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export function Header() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { data: naoLidas } = useNotificacoesNaoLidas();

  const count = naoLidas?.count ?? 0;

  return (
    <header className="flex items-center justify-between h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div className="h-8" />
      </div>

      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Alternar tema</span>
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative rounded-full" asChild>
          <Link href="/dashboard/notificacoes">
            <Bell className="h-4 w-4" />
            {count > 0 && (
              <Badge
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
                variant="destructive"
              >
                {count > 9 ? "9+" : count}
              </Badge>
            )}
          </Link>
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 rounded-full px-2 h-10"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {user?.name ? getInitials(user.name) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium leading-none">{user?.name}</span>
                <span className="text-xs text-muted-foreground leading-none mt-0.5">
                  {user?.role ?? "membro"}
                </span>
              </div>
              <ChevronDown className="h-3 w-3 hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/perfil">
                <User className="mr-2 h-4 w-4" />
                Meu perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/configuracoes">
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
