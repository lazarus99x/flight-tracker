import { NextResponse } from "next/server";
import type { SearchFlight } from "@/lib/flights";
import { getTickets, saveTickets, makePnr, newId, seatFor } from "@/lib/store";
import type { Ticket } from "@/lib/types";

export const dynamic = "force-dynamic";

type Body = {
  flight: SearchFlight;
  passengerName: string;
  passengerEmail: string;
  passengerPhone?: string;
  cabin?: string;
};

export async function POST(req: Request) {
  const body = (await req.json()) as Body;
  if (!body.flight?.flightNumber || !body.passengerName || !body.passengerEmail) {
    return NextResponse.json({ error: "Missing booking data" }, { status: 400 });
  }

  const rows = await getTickets();
  let pnr = makePnr();
  let guard = 0;
  while (rows.some((t) => t.pnr === pnr) && guard++ < 20) pnr = makePnr();

  const now = new Date().toISOString();
  const ticket: Ticket = {
    id: newId(),
    pnr,
    flightId: body.flight.id,
    flightNumber: body.flight.flightNumber,
    airline: body.flight.airline,
    airlineCode: body.flight.airlineCode,
    fromCode: body.flight.fromCode,
    fromCity: body.flight.fromCity,
    toCode: body.flight.toCode,
    toCity: body.flight.toCity,
    departAt: body.flight.departAt,
    arriveAt: body.flight.arriveAt,
    passengerName: body.passengerName,
    passengerEmail: body.passengerEmail,
    passengerPhone: body.passengerPhone ?? "",
    cabin: body.cabin ?? body.flight.cabin,
    fare: body.flight.fare,
    status: "confirmed",
    issuedAt: now,
  };
  ticket.seat = seatFor(ticket);

  rows.push(ticket);
  await saveTickets(rows);
  return NextResponse.json({ ticket }, { status: 201 });
}