import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { message } = await request.json();

    // simple echo response for testing
    const reply = "Echo: " + message;

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
