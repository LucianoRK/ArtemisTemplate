import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { serverApi } from "@/services/api";
import Stripe from "stripe";

// In-memory idempotency guard — prevents duplicate event processing on retries.
// For multi-instance deployments, replace with a database-backed check.
const processedEvents = new Set<string>();

// Internal server token for webhook → backend communication
const INTERNAL_TOKEN = process.env.WEBHOOK_INTERNAL_TOKEN ?? "";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  // Idempotency: skip already-processed events
  if (processedEvents.has(event.id)) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  const api = serverApi(INTERNAL_TOKEN);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await api.post("/assinatura", {
          stripe_subscription_id: session.subscription,
          stripe_customer_id: session.customer,
          status: "ativa",
        });
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await api.post("/pagamento", {
          stripe_invoice_id: invoice.id,
          stripe_subscription_id: invoice.subscription,
          valor: (invoice.amount_paid ?? 0) / 100,
          status: "pago",
          data_pagamento: new Date(invoice.created * 1000).toISOString(),
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await api.post("/pagamento", {
          stripe_invoice_id: invoice.id,
          stripe_subscription_id: invoice.subscription,
          valor: (invoice.amount_due ?? 0) / 100,
          status: "falhou",
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await api.patch(`/assinatura`, {
          stripe_subscription_id: subscription.id,
          status: "cancelada",
        });
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await api.patch(`/assinatura`, {
          stripe_subscription_id: subscription.id,
          status: subscription.status === "active" ? "ativa" : subscription.status,
        });
        break;
      }

      default:
        // Unhandled event — not an error, just not processed
        break;
    }

    processedEvents.add(event.id);

    // Prevent unbounded growth: remove oldest entries when set exceeds 10k
    if (processedEvents.size > 10_000) {
      const first = processedEvents.values().next().value;
      if (first) processedEvents.delete(first);
    }
  } catch (err) {
    console.error(`[webhook] Failed to handle event ${event.type}:`, err);
    // Return 500 so Stripe retries the event
    return NextResponse.json(
      { error: "Failed to process webhook event" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
