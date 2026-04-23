import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readCredentials } from "@/lib/adminConfig";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("aurum_admin_session");
  const creds = await readCredentials();
  const authenticated = session?.value === creds.sessionSecret;
  return NextResponse.json({ authenticated });
}
