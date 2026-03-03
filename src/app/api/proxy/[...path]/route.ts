import { NextRequest, NextResponse } from "next/server";

function getApiBaseUrl(): string {
  const url = process.env.API_URL ?? "";
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `http://${url}`;
  }
  return url;
}

async function handler(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const targetUrl = `${getApiBaseUrl()}/${path.join("/")}${request.nextUrl.search}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const authHeader = request.headers.get("Authorization");
  if (authHeader) headers["Authorization"] = authHeader;

  const init: RequestInit = { method: request.method, headers };
  if (!["GET", "HEAD"].includes(request.method)) {
    init.body = await request.text();
  }

  const upstream = await fetch(targetUrl, init);
  const body = await upstream.text();

  return new NextResponse(body, {
    status: upstream.status,
    headers: {
      "Content-Type":
        upstream.headers.get("Content-Type") ?? "application/json",
    },
  });
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
