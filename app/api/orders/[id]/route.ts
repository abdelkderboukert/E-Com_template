import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';
import { readCredentials } from '@/lib/adminConfig';

const ORDERS_PATH = path.join(process.cwd(), 'lib', 'orders.json');

async function readOrders(): Promise<any[]> {
  try { return JSON.parse(await fs.readFile(ORDERS_PATH, 'utf-8')); }
  catch { return []; }
}

/** PATCH — update order status */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('aurum_admin_session');
    const creds = await readCredentials();
    if (session?.value !== creds.sessionSecret) {
      return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await req.json();
    const orders = await readOrders();
    const idx = orders.findIndex((o: any) => String(o.id) === id);
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    orders[idx].status = status;
    await fs.writeFile(ORDERS_PATH, JSON.stringify(orders, null, 2));
    return NextResponse.json(orders[idx]);
  } catch {
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
