import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/services/auth.service";
import { serverApi } from "@/services/api";
import type { Usuario } from "@/types";

export async function POST(request: NextRequest) {
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

    const response = NextResponse.json({ user });

    const cookieOpts = {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    };

    response.cookies.set("auth_token", access_token, {
      ...cookieOpts,
      httpOnly: true,
    });
    response.cookies.set(
      "auth_user",
      JSON.stringify({ ...user, token: access_token }),
      { ...cookieOpts, httpOnly: false }
    );

    return response;
  } catch (err) {
    console.error("[/api/auth/login] erro:", err);
    return NextResponse.json(
      { error: "Email ou senha inválidos" },
      { status: 401 }
    );
  }
}
