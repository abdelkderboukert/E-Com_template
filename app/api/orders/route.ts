import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { readOrders, saveOrders } from '@/lib/ordersManager';
import { readCredentials } from '@/lib/adminConfig';

/** POST — called silently from checkout after a Dahabia payment */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const orders = await readOrders();

    const newOrder = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: 'pending', // pending | confirmed | shipped | done
      ...body,
    };

    orders.unshift(newOrder); // newest first
    await saveOrders(orders);

    return NextResponse.json({ success: true, orderId: newOrder.id });
  } catch {
    return NextResponse.json({ error: 'Failed to save order' }, { status: 500 });
  }
}

/** GET — admin only, returns all orders */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('aurum_admin_session');
    const creds = await readCredentials();

    if (session?.value !== creds.sessionSecret) {
      return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
    }

    const orders = await readOrders();
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
