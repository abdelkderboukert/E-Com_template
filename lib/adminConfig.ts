import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const CREDS_PATH = path.join(process.cwd(), "lib", "adminCredentials.json");

export async function readCredentials() {
  const raw = await fs.readFile(CREDS_PATH, "utf-8");
  return JSON.parse(raw) as { email: string; password: string; sessionSecret: string };
}

export async function writeCredentials(data: { email: string; password: string; sessionSecret: string }) {
  await fs.writeFile(CREDS_PATH, JSON.stringify(data, null, 2));
}
