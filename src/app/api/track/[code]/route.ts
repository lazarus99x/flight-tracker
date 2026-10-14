import { NextResponse } from "next/server";
import { findTicket } from "@/lib/store";

export const dynamic = "force-dynamic";

type Params = { params: { code: string } };

export async function GET(_: Request, { params }: Params) {
  const t = await findTicket(params.code);
  if (!t) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  return NextResponse.json({ ticket: t });
}