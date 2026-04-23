import { NextResponse } from "next/server";
import { ChargilyClient } from "@chargily/chargily-pay";
import fs from "fs/promises";
import path from "path";

const ORDERS_PATH = path.join(process.cwd(), "lib", "orders.json");

// Chargily API Client
const chargily = new ChargilyClient({
  api_key: process.env.CHARGILY_SECRET_KEY || "test_sk_O1o9N2rYy0aN2VfS8BfL1xS3", // put your real API secret key in .env.local
  mode: process.env.NODE_ENV === "production" ? "live" : "test",
});

async function readOrders() {
  try {
    const data = await fs.readFile(ORDERS_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    
    // 1. Create the local order as "unpaid"
    const orders = await readOrders();
    const newOrderId = Date.now();
    
    const newOrder = {
      id: newOrderId,
      createdAt: new Date().toISOString(),
      status: "unpaid", // waiting for Chargily Webhook to become "confirmed"
      ...body,
    };

    orders.unshift(newOrder);
    await fs.writeFile(ORDERS_PATH, JSON.stringify(orders, null, 2));

    // 2. Build items array for Chargily (wait, Chargily expects amounts or prices)
    // The easiest is to just send the total amount instead of line-items without Price IDs.
    // However, the documentation says "amount: 5000" might be supported or "items" with price IDs.
    // Let's create a single generic checkout session with the total amount passing amount.
    
    const checkoutPayload: any = {
      amount: newOrder.total,
      currency: "dzd",
      success_url: `${origin}/success`,
      failure_url: `${origin}/?payment=failed`,
      metadata: {
        orderId: String(newOrderId)
      },
      locale: "fr",
      pass_fees_to_customer: false
    };

    const checkout = await chargily.createCheckout(checkoutPayload);

    if (!checkout || !checkout.checkout_url) {
      throw new Error("Impossible de générer l'URL Chargily.");
    }

    return NextResponse.json({ 
      success: true, 
      checkoutUrl: checkout.checkout_url 
    });

  } catch (err: any) {
    console.error("Erreur Chargily Checkout:", err.message);
    return NextResponse.json({ 
      error: "Erreur de configuration. Avez-vous configuré la clé CHARGILY_SECRET_KEY ?" 
    }, { status: 500 });
  }
}
