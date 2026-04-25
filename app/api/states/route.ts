import { NextResponse } from "next/server";

// Proxy to CountriesNow API to get states/provinces for a given country
export async function POST(req: Request) {
  try {
    const { country } = await req.json();

    if (!country) {
      return NextResponse.json({ error: "Country is required" }, { status: 400 });
    }

    const res = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country }),
    });

    const data = await res.json();

    if (data.error || !data.data?.states) {
      return NextResponse.json({ states: [] });
    }

    // Return just the state names as a sorted array
    const states: string[] = data.data.states
      .map((s: { name: string }) => s.name)
      .sort((a: string, b: string) => a.localeCompare(b));

    return NextResponse.json({ states });
  } catch {
    return NextResponse.json({ states: [] });
  }
}
