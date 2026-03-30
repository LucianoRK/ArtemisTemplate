import { NextRequest, NextResponse } from "next/server";
import { serverApi } from "@/services/api";
import type { Usuario } from "@/types";

// Rehydrates auth state on page refresh — reads httpOnly cookie, returns user + token
export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  try {
    const jwtPayload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    const res = await serverApi(token).get<Usuario>("/usuario/perfil");
    const perfil = res.data;

    const user = {
      id: String(perfil.id),
      name: perfil.nome,
      email: perfil.email,
      role: perfil.role,
      empresa_id: jwtPayload.empresa_id as number,
    };

    return NextResponse.json({ user, token });
  } catch {
    return NextResponse.json({ error: "Sessão inválida" }, { status: 401 });
  }
}
