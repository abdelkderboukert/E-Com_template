import { NextResponse } from "next/server";
import { readCredentials } from "@/lib/adminConfig";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const creds = await readCredentials();

    if (email !== creds.email || password !== creds.password) {
      return NextResponse.json({ error: "Identifiants incorrects." }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("aurum_admin_session", creds.sessionSecret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 8,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
