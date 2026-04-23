import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readCredentials, writeCredentials } from "@/lib/adminConfig";

/** GET — returns current email (never the password) */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("aurum_admin_session");
    const creds = await readCredentials();

    if (session?.value !== creds.sessionSecret) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    return NextResponse.json({ email: creds.email });
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

/** PUT — update email and/or password (requires current password to confirm) */
export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("aurum_admin_session");
    const creds = await readCredentials();

    if (session?.value !== creds.sessionSecret) {
      return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
    }

    const { currentPassword, newEmail, newPassword } = await req.json();

    if (currentPassword !== creds.password) {
      return NextResponse.json({ error: "Mot de passe actuel incorrect." }, { status: 403 });
    }

    const updated = {
      email: newEmail?.trim() || creds.email,
      password: newPassword?.trim() || creds.password,
      sessionSecret: creds.sessionSecret,
    };

    await writeCredentials(updated);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
