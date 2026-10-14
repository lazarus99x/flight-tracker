import { NextResponse } from "next/server";
import { getTickets, saveTickets, makePnr, newId, seatFor } from "@/lib/store";
import type { Ticket } from "@/lib/types";

export const dynamic = "force-dynamic";

const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASS || "admin123";

type Body = {
  adminPass: string;
  passengerName: string;
  passengerEmail: string;
  passengerPhone?: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  fromCode: string;
  fromCity: string;
  toCode: string;
  toCity: string;
  departAt: string;
  arriveAt: string;
  cabin: string;
  fare: number;
  status?: Ticket["status"];
};

export async function POST(req: Request) {
  const body = (await req.json()) as Body;
  if (body.adminPass !== ADMIN_PASS) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!body.passengerName || !body.passengerEmail || !body.flightNumber || !body.fromCode || !body.toCode) {
    return NextResponse.json({ error: "Missing required fields (passengerName, passengerEmail, flightNumber, fromCode, toCode)" }, { status: 400 });
  }

  const rows = await getTickets();
  let pnr = makePnr();
  let guard = 0;
  while (rows.some((t) => t.pnr === pnr) && guard++ < 20) pnr = makePnr();

  const now = new Date().toISOString();
  const ticket: Ticket = {
    id: newId(),
    pnr,
    flightId: body.airlineCode + "-" + (body.flightNumber.replace(/[^0-9]/g, "")),
    flightNumber: body.flightNumber,
    airline: body.airline,
    airlineCode: body.airlineCode,
    fromCode: body.fromCode.toUpperCase(),
    fromCity: body.fromCity,
    toCode: body.toCode.toUpperCase(),
    toCity: body.toCity,
    departAt: body.departAt,
    arriveAt: body.arriveAt,
    passengerName: body.passengerName,
    passengerEmail: body.passengerEmail,
    passengerPhone: body.passengerPhone ?? "",
    cabin: body.cabin || "Economy",
    fare: body.fare || 0,
    status: body.status || "confirmed",
    issuedAt: now,
  };
  ticket.seat = seatFor(ticket);

  rows.push(ticket);
  await saveTickets(rows);
  return NextResponse.json({ ticket }, { status: 201 });
}