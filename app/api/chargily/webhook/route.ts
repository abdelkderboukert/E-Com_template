import { NextResponse } from "next/server";
import { verifySignature } from "@chargily/chargily-pay";
import fs from "fs/promises";
import path from "path";

const ORDERS_PATH = path.join(process.cwd(), "lib", "orders.json");
const API_SECRET_KEY = process.env.CHARGILY_SECRET_KEY || "test_sk_O1o9N2rYy0aN2VfS8BfL1xS3";

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
    const signature = req.headers.get("signature") || "";
    // We need the raw body as text for verification, then parse as JSON
    const rawBody = await req.text();
    
    if (!signature) {
      console.error("Webhook Error: Signature is missing");
      return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
    }

    try {
      if (!verifySignature(rawBody, signature, API_SECRET_KEY)) {
        console.error("Webhook Error: Invalid Signature");
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    } catch {
      console.error("Webhook Error: Signature verification threw an error");
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Webhook is valid ! Parse the body
    const event = JSON.parse(rawBody);
    console.log("Chargily Webhook Event:", event.type);

    if (event.type === "checkout.paid") {
      const orderIdObj = event.data?.metadata?.orderId;
      if (orderIdObj) {
        const orderId = Number(orderIdObj);
        const orders = await readOrders();
        
        const orderIndex = orders.findIndex((o: any) => o.id === orderId);
        if (orderIndex > -1) {
          orders[orderIndex].status = "confirmed"; // The bank officially confirmed payment
          await fs.writeFile(ORDERS_PATH, JSON.stringify(orders, null, 2));
          console.log(`Order ${orderId} successfully marked as confirmed.`);
        }
      }
    } else if (event.type === "checkout.failed") {
      const orderIdObj = event.data?.metadata?.orderId;
      if (orderIdObj) {
        const orderId = Number(orderIdObj);
        const orders = await readOrders();
        const orderIndex = orders.findIndex((o: any) => o.id === orderId);
        if (orderIndex > -1) {
          orders[orderIndex].status = "failed"; // The payment failed
          await fs.writeFile(ORDERS_PATH, JSON.stringify(orders, null, 2));
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error("Webhook crash:", err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
