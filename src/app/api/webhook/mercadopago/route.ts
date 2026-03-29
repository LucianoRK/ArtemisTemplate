import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const API_URL = process.env.API_URL!;
const WEBHOOK_SECRET = process.env.MERCADOPAGO_WEBHOOK_SECRET;

function verifySignature(request: NextRequest, rawBody: string): boolean {
  if (!WEBHOOK_SECRET) return true;

  const signatureHeader = request.headers.get("x-signature");
  const requestId = request.headers.get("x-request-id");
  const dataId = new URL(request.url).searchParams.get("data.id");

  if (!signatureHeader) return false;

  const ts = signatureHeader.split(",").find((p) => p.startsWith("ts="))?.slice(3);
  const v1 = signatureHeader.split(",").find((p) => p.startsWith("v1="))?.slice(3);

  if (!ts || !v1) return false;

  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
  const expected = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(manifest)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected, "hex"),
      Buffer.from(v1, "hex")
    );
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();

    if (!verifySignature(request, rawBody)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);

    // Forward payment and subscription notifications to the backend
    if (payload.type === "payment" || payload.type === "subscription_preapproval") {
      await fetch(`${API_URL}/webhook/mercadopago`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }

    // Always return 200 quickly — MercadoPago retries on non-2xx responses
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[webhook/mercadopago]", error);
    return NextResponse.json({ received: true });
  }
}
