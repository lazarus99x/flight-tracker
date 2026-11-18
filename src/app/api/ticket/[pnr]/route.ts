import { NextResponse } from "next/server";
import { findTicket } from "@/lib/store";
import { fmtTime, fmtDate } from "@/lib/format";
import { findAirport } from "@/lib/airports";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Params = { params: { pnr: string } };

export async function GET(_: Request, { params }: Params) {
  const t = await findTicket(params.pnr);
  if (!t) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const depTz = findAirport(t.fromCode)?.tz;
  const arrTz = findAirport(t.toCode)?.tz;
  const viaTz = t.via ? findAirport(t.via.code)?.tz : undefined;
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 48;
  let y = 0;

  /* ── top accent strip + header ── */
  doc.setFillColor(0, 112, 243);
  doc.rect(0, 0, W, 8, "F");
  doc.setTextColor(17, 17, 17);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("AeroFlights", M, 56);
  doc.setTextColor(107, 107, 107);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("ELECTRONIC FLIGHT ITINERARY", W - M, 50, { align: "right" });
  doc.text(`Issued ${fmtDate(t.issuedAt, undefined, true)}`, W - M, 64, { align: "right" });

  y = 92;
  /* thin rule */
  doc.setDrawColor(230, 230, 230);
  doc.setLineWidth(1);
  doc.line(M, y, W - M, y);
  y += 24;

  /* ── PNR + Ticket Number ── */
  doc.setTextColor(155, 155, 155);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("BOOKING REFERENCE (PNR)", M, y);
  doc.text("E-TICKET NUMBER", W - M, y, { align: "right" });

  doc.setTextColor(0, 112, 243);
  doc.setFont("courier", "bold");
  doc.setFontSize(26);
  doc.text(t.pnr, M, y + 24);

  doc.setTextColor(17, 17, 17);
  doc.setFont("courier", "bold");
  doc.setFontSize(14);
  const ticketNum = "014" + (hash(t.pnr + t.flightNumber + t.passengerName) % 10000000000).toString().padStart(10, "0");
  doc.text(ticketNum, W - M, y + 24, { align: "right" });

  doc.setTextColor(155, 155, 155);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("STATUS", W / 2, y, { align: "right" });
  const statusColor = t.status === "cancelled" ? [238, 0, 0] : t.status === "confirmed" ? [10, 135, 84] : [0, 112, 243];
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(t.status === "confirmed" ? "CONFIRMED" : t.status.toUpperCase(), W / 2, y + 20, { align: "right" });
  y += 56;

  /* ── passenger ── */
  doc.setFillColor(250, 250, 250);
  doc.rect(M, y, W - 2 * M, 62, "F");
  doc.setTextColor(155, 155, 155);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("PASSENGER", M + 14, y + 18);
  doc.text("CABIN", M + 260, y + 18);
  doc.text("SEAT", M + 340, y + 18);
  doc.text("BAGGAGE", W - M - 14, y + 18, { align: "right" });

  doc.setTextColor(17, 17, 17);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(t.passengerName, M + 14, y + 40);
  doc.text(t.cabin, M + 260, y + 40);
  doc.setFont("courier", "bold");
  doc.text(t.seat ?? "-", M + 340, y + 40);

  /* baggage allowance by cabin */
  const baggage: Record<string, string> = {
    "First": "2 x 32kg",
    "Business": "2 x 32kg",
    "Premium Economy": "2 x 23kg",
    "Economy": "1 x 23kg",
  };
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(baggage[t.cabin] ?? baggage["Economy"], W - M - 14, y + 40, { align: "right" });
  y += 62 + 10;

  /* ── booking details row ── */
  doc.setFillColor(250, 250, 250);
  doc.rect(M, y, W - 2 * M, 28, "F");
  const fareBasis = t.cabin === "First" ? "F1A" : t.cabin === "Business" ? "J1A" : t.cabin === "Premium Economy" ? "W1A" : "Y1A";
  const bookingClass = t.cabin === "First" ? "F" : t.cabin === "Business" ? "J" : t.cabin === "Premium Economy" ? "W" : "Y";
  doc.setTextColor(155, 155, 155);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("BOOKING CLASS", M + 14, y + 16);
  doc.text("FARE BASIS", M + 130, y + 16);
  doc.text("TICKET TYPE", M + 260, y + 16);
  doc.text("ISSUING AIRLINE", W - M - 14, y + 16, { align: "right" });

  doc.setTextColor(17, 17, 17);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(bookingClass, M + 14, y + 16);
  doc.text(fareBasis, M + 130, y + 16);
  doc.text("Electronic / Refundable", M + 260, y + 16);
  doc.text(t.airline, W - M - 14, y + 16, { align: "right" });
  y += 28 + 10;

  /* ── route board ── */
  doc.setTextColor(17, 17, 17);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(`${t.fromCode}  >  ${t.via ? t.via.code + "  >  " : ""}${t.toCode}`, M, y);
  doc.setTextColor(155, 155, 155);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(`${t.fromCity}  to  ${t.toCity}`, M, y + 16);
  if (t.via) {
    doc.setFontSize(8.5);
    doc.text(
      `Transit ${t.via.code} (${t.via.city}) - arrive ${fmtTime(t.via.arriveAt, viaTz)} / depart ${fmtTime(t.via.departAt, viaTz)}`,
      M,
      y + 30
    );
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.text(t.flightNumber, W - M, y, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(t.airline, W - M, y + 14, { align: "right" });
  y += t.via ? 48 : 34;

  /* ── times grid ── */
  doc.setFillColor(250, 250, 250);
  doc.rect(M, y, W - 2 * M, 92, "F");
  const cw = (W - 2 * M) / 2;
  const col1 = M + 14;
  const col2 = M + cw + 14;

  doc.setTextColor(155, 155, 155);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("DEPARTURE", col1, y + 18);
  doc.text("ARRIVAL", col2, y + 18);
  doc.text("DATE", col1, y + 62);
  doc.text("DATE", col2, y + 62);

  doc.setTextColor(17, 17, 17);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(fmtTime(t.departAt, depTz), col1, y + 40);
  doc.text(fmtTime(t.arriveAt, arrTz), col2, y + 40);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(fmtDate(t.departAt, depTz, false), col1, y + 76);
  doc.text(fmtDate(t.arriveAt, arrTz, false), col2, y + 76);
  y += 92 + 10;

  /* ── passenger contact ── */
  doc.setTextColor(155, 155, 155);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("PASSENGER CONTACT", M, y);
  doc.setTextColor(17, 17, 17);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.text(`${t.passengerEmail}${t.passengerPhone ? "   -   " + t.passengerPhone : ""}`, M, y + 14);
  y += 40;

  /* ── footer notes ── */
  doc.setTextColor(107, 107, 107);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  const notes = [
    "This is an electronic flight itinerary issued by AeroFlights on behalf of the operating carrier.",
    "Check in at least 3 hours before international departure. Carry valid travel documents.",
    "Present this itinerary or your booking reference (PNR) at the airline check-in counter.",
    "Seat assignment and boarding gate are subject to change. Verify at the airport.",
    `Baggage allowance: ${baggage[t.cabin] ?? baggage["Economy"]}. Overweight/oversize fees may apply.`,
    "Schedule is subject to change. Verify live status at aerotrack.vercel.app with your PNR.",
  ];
  notes.forEach((n, i) => {
    doc.text(n, M, y + i * 13);
  });

  /* ── footer ── */
  doc.setDrawColor(230, 230, 230);
  doc.line(M, H - 48, W - M, H - 48);
  doc.setTextColor(155, 155, 155);
  doc.setFontSize(8);
  doc.text("AeroFlights - International Flight Itinerary Service", M, H - 32);
  doc.text("PNR " + t.pnr + " - issued " + fmtDate(t.issuedAt, undefined, false), W - M, H - 32, { align: "right" });
  doc.setTextColor(107, 107, 107);
  doc.setFontSize(7);
  doc.text("This is not a boarding pass. Check-in and boarding passes are issued by the operating airline.", M, H - 16);

  const bytes = doc.output("arraybuffer");
  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="itinerary-${t.pnr}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}