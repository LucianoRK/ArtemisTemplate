import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/services/auth.service";
import { serverApi } from "@/services/api";
import { rateLimit } from "@/lib/rate-limit";
import type { Usuario } from "@/types";

export async function POST(request: NextRequest) {
  // Rate limiting: 10 attempts per 15 minutes per IP
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? request.headers.get("x-real-ip")
    ?? "unknown";

  const rl = rateLimit(`login:${ip}`, 10, 15 * 60 * 1000);
  if (!rl.success) {
    return NextResponse.json(
      { error: "Muitas tentativas. Tente novamente em alguns minutos." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) },
      }
    );
  }

  try {
    const body = await request.json();
    const { email, senha } = body;

    // 1. Login — API retorna apenas access_token
    const { access_token } = await authService.login({ email, senha });

    // 2. Busca perfil do usuário com o token
    const perfilRes = await serverApi(access_token).get<Usuario>("/usuario/perfil");
    const perfil = perfilRes.data;

    const user = {
      id: String(perfil.id),
      name: perfil.nome,
      email: perfil.email,
      role: perfil.role,
      empresa_id: perfil.empresa_id,
    };

    // Return token in response body — client stores in memory (Zustand), never in localStorage
    const response = NextResponse.json({ user, token: access_token });

    const cookieOpts = {
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    };

    // auth_token: httpOnly — only readable by server, used for middleware auth and /api/auth/me
    response.cookies.set("auth_token", access_token, {
      ...cookieOpts,
      httpOnly: true,
    });

    // auth_user: readable by JS — contains only display metadata, NO token
    response.cookies.set(
      "auth_user",
      JSON.stringify(user),
      { ...cookieOpts, httpOnly: false }
    );

    return response;
  } catch {
    return NextResponse.json(
      { error: "Email ou senha inválidos" },
      { status: 401 }
    );
  }
}
