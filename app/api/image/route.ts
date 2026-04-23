import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Missing image id", { status: 400 });
  }

  try {
    // using export=download forces the raw image file rather than the HTML viewer
    const driveUrl = `https://drive.google.com/uc?export=download&id=${id}`;
    
    // fetch the raw file from Google Servers
    const response = await fetch(driveUrl);
    
    if (!response.ok) {
      return new Response("Error fetching from Google Drive", { status: response.status });
    }

    // Pass the raw image buffer to the browser, stripping Google's strict security headers
    const buffer = await response.arrayBuffer();
    
    return new Response(buffer, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable", // Cache heavily
      },
    });
  } catch (error) {
    return new Response("Proxy error", { status: 500 });
  }
}
