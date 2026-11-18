"use client";

import { useState } from "react";
import Link from "next/link";
import { fmtTime, fmtDate, fmtDuration } from "@/lib/format";
import { AIRLINES } from "@/lib/airlines";
import { findAirport } from "@/lib/airports";
import type { Ticket } from "@/lib/types";

const SEAT_URL = "https://www.seatguru.com";

export default function TrackResult({ code }: { code: string }) {
  const [q, setQ] = useState(code);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function lookup(e?: React.FormEvent) {
    e?.preventDefault();
    const c = q.trim().toUpperCase();
    if (!c) { setErr("Enter your booking reference"); return; }
    setErr(""); setLoading(true); setTicket(null);
    try {
      const res = await fetch(`/api/track/${encodeURIComponent(c)}`);
      if (res.status === 404) { setErr("No booking found with that reference"); setLoading(false); return; }
      if (!res.ok) { setErr("Lookup failed"); setLoading(false); return; }
      const d = await res.json() as { ticket: Ticket };
      setTicket(d.ticket);
    } catch { setErr("Network error"); }
    setLoading(false);
  }

  function ticketNum(t: Ticket): string {
    return "014" + (hash(t.pnr + t.flightNumber + t.passengerName) % 10000000000).toString().padStart(10, "0");
  }

  function baggageLabel(cabin: string): string {
    const m: Record<string, string> = {
      First: "2 x 32kg (70 lb) complimentary",
      Business: "2 x 32kg (70 lb) complimentary",
      "Premium Economy": "2 x 23kg (50 lb) complimentary",
      Economy: "1 x 23kg (50 lb) complimentary",
    };
    return m[cabin] ?? m.Economy;
  }

  function bookingClass(cabin: string): string {
    const m: Record<string, string> = { First: "F", Business: "J", "Premium Economy": "W", Economy: "Y" };
    return m[cabin] ?? "Y";
  }

  function fareBasis(cabin: string): string {
    const m: Record<string, string> = { First: "F1A", Business: "J1A", "Premium Economy": "W1A", Economy: "Y1A" };
    return m[cabin] ?? "Y1A";
  }

  function durationMs(iso1: string, iso2: string): number {
    return new Date(iso2).getTime() - new Date(iso1).getTime();
  }

  function formatLongDuration(min: number): string {
    const h = Math.floor(min / 60);
    const m = min % 60;
    const d = Math.floor(h / 24);
    if (d > 0) return `${d}d ${h % 24}h ${m}m`;
    return `${h}h ${m}m`;
  }

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px 80px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 6, color: "#111" }}>
        Track your booking
      </h1>
      <p style={{ color: "#6B6B6B", fontSize: 14.5, marginBottom: 24 }}>
        Enter your PNR to view itinerary and real-time flight details.
      </p>

      <form onSubmit={lookup} style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setErr(""); }}
          placeholder="PNR e.g. AB12CD"
          style={{
            flex: 1, padding: "12px 16px", border: "1px solid #E6E6E6",
            background: "#fff", color: "#111", fontSize: 15, fontFamily: "var(--font-geist-mono)",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 28px", border: "1px solid #0070F3", background: "#0070F3",
            color: "#fff", fontSize: 14, fontWeight: 500, borderRadius: 6,
            cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "..." : "Track"}
        </button>
      </form>
      {err && <p style={{ color: "#EE0000", fontSize: 13.5 }}>{err}</p>}

      {ticket && (() => {
        const al = AIRLINES.find((a) => a.code === ticket.airlineCode);
        const alColor = al?.color ?? "#0070F3";
        const dep = new Date(ticket.departAt);
        const arr = new Date(ticket.arriveAt);
        const durMinutes = Math.round((arr.getTime() - dep.getTime()) / 60000);
        const bClass = bookingClass(ticket.cabin);
        const fBasis = fareBasis(ticket.cabin);
        const depTz = findAirport(ticket.fromCode)?.tz;
        const arrTz = findAirport(ticket.toCode)?.tz;
        const viaTz = ticket.via ? findAirport(ticket.via.code)?.tz : undefined;
        const layoverMin = ticket.via
          ? Math.round((new Date(ticket.via.departAt).getTime() - new Date(ticket.via.arriveAt).getTime()) / 60000)
          : 0;

        return (
          <div style={{ marginTop: 32 }}>

            {/* ─── STATUS HEADER ─── */}
            <div style={{
              border: "1px solid #E6E6E6", borderRadius: 12, padding: "22px 24px",
              background: "#FFFFFF", marginBottom: 20, position: "relative", overflow: "hidden",
            }}>
              {/* accent bar */}
              <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: alColor, borderRadius: "12px 0 0 12px" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <p style={{ fontSize: 11, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 4 }}>
                    {ticket.airline} — Flight status
                  </p>
                  <p style={{ fontSize: 24, fontWeight: 700, color: "#0A8754" }}>
                    {ticket.status === "confirmed" ? "Confirmed" : ticket.status === "cancelled" ? "Cancelled" : ticket.status.replace("_", " ")}
                  </p>
                  <p style={{ fontSize: 12, color: "#9B9B9B", marginTop: 4 }}>
                    Booking reference <span style={{ fontFamily: "var(--font-geist-mono)", color: "#0070F3", fontWeight: 600, letterSpacing: "2px" }}>{ticket.pnr}</span>
                    {"  ·  "}E-ticket <span style={{ fontFamily: "var(--font-geist-mono)" }}>{ticketNum(ticket)}</span>
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <a
                    href={`/api/ticket/${ticket.pnr}`}
                    style={{
                      display: "inline-block", padding: "10px 20px", borderRadius: 8,
                      background: "#0070F3", color: "#fff", fontSize: 13.5, fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    ⬇ Download PDF
                  </a>
                </div>
              </div>
            </div>

            {/* ─── FLIGHT ITINERARY ─── */}
            <div style={{ border: "1px solid #E6E6E6", borderRadius: 12, background: "#FFFFFF", marginBottom: 20, overflow: "hidden" }}>
              {/* carrier bar */}
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "16px 24px", background: "#FAFAFA", borderBottom: "1px solid #E6E6E6",
              }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: alColor, display: "inline-block" }} />
                <span style={{ fontWeight: 600, fontSize: 15, color: "#111" }}>{ticket.airline}</span>
                <span style={{ color: "#9B9B9B", fontFamily: "var(--font-geist-mono)", fontSize: 13 }}>{ticket.flightNumber}</span>
                <span style={{ color: "#9B9B9B", fontSize: 12 }}>·</span>
                <span style={{ color: "#9B9B9B", fontSize: 13 }}>Class {bClass} ({ticket.cabin})</span>
              </div>

              {/* route + times */}
              <div style={{ padding: "24px 24px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
                  {/* departure */}
                  <div style={{ textAlign: "left", flex: 1, minWidth: 140 }}>
                    <p style={{ fontSize: 30, fontWeight: 700, fontFamily: "var(--font-geist-mono)", color: "#111" }}>{fmtTime(ticket.departAt, depTz)}</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#111", fontFamily: "var(--font-geist-mono)" }}>{ticket.fromCode}</p>
                    <p style={{ fontSize: 13, color: "#6B6B6B" }}>{ticket.fromCity}</p>
                    <p style={{ fontSize: 12, color: "#9B9B9B", marginTop: 2 }}>{fmtDate(ticket.departAt, depTz, false)}</p>
                  </div>

                  {/* flight arc */}
                  <div style={{ textAlign: "center", flex: "0 0 auto", minWidth: 100 }}>
                    <p style={{ fontSize: 12, color: "#9B9B9B", marginBottom: 4 }}>{fmtDuration(durMinutes)}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ flex: 1, height: 2, background: "#D4D4D4" }} />
                      <span style={{ fontSize: 16 }}>✈</span>
                      <div style={{ flex: 1, height: 2, background: "#D4D4D4" }} />
                    </div>
                    <p style={{ fontSize: 11, color: "#9B9B9B", marginTop: 2 }}>{ticket.via ? `1 stop · ${ticket.via.code}` : "non-stop"}</p>
                  </div>

                  {/* arrival */}
                  <div style={{ textAlign: "right", flex: 1, minWidth: 140 }}>
                    <p style={{ fontSize: 30, fontWeight: 700, fontFamily: "var(--font-geist-mono)", color: "#111" }}>{fmtTime(ticket.arriveAt, arrTz)}</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#111", fontFamily: "var(--font-geist-mono)" }}>{ticket.toCode}</p>
                    <p style={{ fontSize: 13, color: "#6B6B6B" }}>{ticket.toCity}</p>
                    <p style={{ fontSize: 12, color: "#9B9B9B", marginTop: 2 }}>{fmtDate(ticket.arriveAt, arrTz, false)}</p>
                  </div>
                </div>

                {/* transit / connection */}
                {ticket.via && (
                  <div style={{
                    marginTop: 18, paddingTop: 16, borderTop: "1px solid #E6E6E6",
                    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12,
                  }}>
                    {[
                      { k: "Transit", v: `${ticket.via.code} — ${ticket.via.city}` },
                      { k: "Transit flight", v: ticket.via.flightNumber ?? ticket.flightNumber },
                      { k: "Arrive transit", v: `${fmtTime(ticket.via.arriveAt, viaTz)} · ${fmtDate(ticket.via.arriveAt, viaTz, false)}` },
                      { k: "Depart transit", v: `${fmtTime(ticket.via.departAt, viaTz)} · ${fmtDate(ticket.via.departAt, viaTz, false)}` },
                      { k: "Layover", v: fmtDuration(layoverMin) },
                    ].map((r) => (
                      <div key={r.k}>
                        <p style={{ fontSize: 11, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 3 }}>{r.k}</p>
                        <p style={{ fontSize: 13, color: "#111", fontWeight: 450 }}>{r.v}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ─── BOOKING DETAILS GRID ─── */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 12, marginBottom: 20,
            }}>
              {[
                { k: "Passenger", v: ticket.passengerName },
                { k: "Booking class", v: `${bClass} (${ticket.cabin})` },
                ...(ticket.via ? [{ k: "Transit", v: `${ticket.via.code} (${ticket.via.city})` }] : []),
                { k: "Seat assigned", v: ticket.seat ?? "—" },
                { k: "Fare basis", v: fBasis },
                { k: "Baggage allowance", v: baggageLabel(ticket.cabin) },
                { k: "E-ticket number", v: ticketNum(ticket) },
              ].map((r) => (
                <div key={r.k} style={{ border: "1px solid #E6E6E6", borderRadius: 8, padding: "14px 16px", background: "#FFFFFF" }}>
                  <p style={{ fontSize: 11, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 4 }}>{r.k}</p>
                  <p style={{ fontSize: 14, color: "#111", fontWeight: 500 }}>{r.v}</p>
                </div>
              ))}
            </div>

            {/* ─── TRAVEL INFORMATION ─── */}
            <div style={{ border: "1px solid #E6E6E6", borderRadius: 12, padding: "20px 24px", background: "#FAFAFA", marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111", marginBottom: 12, letterSpacing: "-0.01em" }}>
                Travel information
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
                {[
                  { k: "Check-in", v: "Online check-in opens 24 hours before departure" },
                  { k: "Recommended arrival", v: "3 hours before departure (international)" },
                  { k: "Terminal", v: ticket.fromCode === "YYZ" ? "Toronto Pearson Intl (YYZ) — Terminal 1" : "Check airport displays" },
                  { k: "Cabin baggage", v: ticket.cabin === "First" || ticket.cabin === "Business" ? "1 carry-on + 1 personal item" : "1 carry-on + 1 personal item" },
                  { k: "Seat selection", v: `Seat ${ticket.seat ?? "assigned at check-in"} — view at ${SEAT_URL}` },
                  { k: "Ticket type", v: "Electronic / Refundable" },
                ].map((r) => (
                  <div key={r.k}>
                    <p style={{ fontSize: 11, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 3 }}>{r.k}</p>
                    <p style={{ fontSize: 13, color: "#111", fontWeight: 450 }}>{r.v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── STATUS TIMELINE ─── */}
            <div style={{ border: "1px solid #E6E6E6", borderRadius: 12, padding: "20px 24px", background: "#FFFFFF", marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111", marginBottom: 14, letterSpacing: "-0.01em" }}>
                Journey timeline
              </h3>
              <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                {[
                  { l: "Confirmed", done: ticket.status === "confirmed" || ticket.status === "checked_in" || ticket.status === "boarded" || ticket.status === "flown" },
                  { l: "Check-in", done: ticket.status === "checked_in" || ticket.status === "boarded" || ticket.status === "flown" },
                  { l: "Boarding", done: ticket.status === "boarded" || ticket.status === "flown" },
                  { l: "Departed", done: ticket.status === "flown", dim: ticket.status === "flown" },
                  { l: "Arrived", done: false, dim: true },
                ].map((s, i) => (
                  <div key={s.l} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{
                      width: 10, height: 10, borderRadius: 5,
                      background: s.done ? "#0A8754" : s.dim ? "#E6E6E6" : "#D4D4D4",
                      display: "inline-block",
                    }} />
                    <span style={{ fontSize: 12, color: s.done ? "#0A8754" : "#9B9B9B", fontWeight: s.done ? 600 : 400 }}>
                      {s.l}
                    </span>
                    {i < 4 && <span style={{ fontSize: 11, color: "#D4D4D4" }}>—</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* ─── FOOTER ACTION ─── */}
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <a
                href={`/api/ticket/${ticket.pnr}`}
                style={{ display: "inline-block", padding: "12px 32px", borderRadius: 8, background: "#0070F3", color: "#fff", fontSize: 14.5, fontWeight: 600, textDecoration: "none" }}
              >
                ⬇ Download PDF itinerary
              </a>
              <p style={{ fontSize: 12, color: "#9B9B9B", marginTop: 10 }}>
                This is not a boarding pass. Present your PNR at check-in.
              </p>
            </div>

          </div>
        );
      })()}
    </main>
  );
}

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}