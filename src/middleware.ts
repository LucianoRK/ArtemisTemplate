import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = [
  "/",
  "/login",
  "/registro",
  "/recuperar-senha",
  "/redefinir-senha",
];

// API routes that don't require authentication
const publicApiRoutes = [
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/me",
  "/api/webhook/stripe",
];

const authRoutes = ["/login", "/registro", "/recuperar-senha", "/redefinir-senha"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;

  const isPublicRoute =
    publicRoutes.some((route) => pathname === route) ||
    publicApiRoutes.some((route) => pathname === route);

  const isAuthRoute = authRoutes.some((route) => pathname === route);

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
