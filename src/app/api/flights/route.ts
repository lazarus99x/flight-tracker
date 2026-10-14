import { NextResponse } from "next/server";
import { getTickets } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const tickets = await getTickets();
  const sorted = [...tickets].sort(
    (a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime()
  );
  return NextResponse.json({ tickets: sorted });
}