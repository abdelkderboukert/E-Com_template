import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';
import { readCredentials } from '@/lib/adminConfig';

const SETTINGS_PATH = path.join(process.cwd(), 'lib', 'storeSettings.json');

async function readSettings() {
  try {
    const raw = await fs.readFile(SETTINGS_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    // Fallback if missing
    return { payments: { whatsapp: true, dahabia: true, instagram: true }, deliveryPrices: {} };
  }
}

// Public route to get settings (used by Checkout Modal)
export async function GET() {
  try {
    const settings = await readSettings();
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: 'Failed to read settings' }, { status: 500 });
  }
}

// Secure route to update settings (Admin)
export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('aurum_admin_session');
    const creds = await readCredentials();

    if (session?.value !== creds.sessionSecret) {
      return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
    }

    const updates = await req.json();
    const currentSettings = await readSettings();

    const newSettings = {
      ...currentSettings,
      ...(updates.payments && {
        payments: {
          ...(currentSettings.payments || {}),
          ...updates.payments,
        }
      }),
      ...(updates.deliveryPrices && {
        deliveryPrices: updates.deliveryPrices
      })
    };

    await fs.writeFile(SETTINGS_PATH, JSON.stringify(newSettings, null, 2));

    return NextResponse.json({ success: true, settings: newSettings });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur Serveur' }, { status: 500 });
  }
}
