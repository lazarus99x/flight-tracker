"use client";

import { useEffect, useState, useCallback } from "react";
import Header from "@/components/Header";
import { fmtTime, fmtDate } from "@/lib/format";
import type { Ticket } from "@/lib/types";

const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASS || "admin123";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  /* form fields */
  const [fName, setFName] = useState("");
  const [fEmail, setFEmail] = useState("");
  const [fPhone, setFPhone] = useState("");
  const [fAirline, setFAirline] = useState("");
  const [fAlCode, setFAlCode] = useState("");
  const [fFlightNo, setFFlightNo] = useState("");
  const [fFromCode, setFFromCode] = useState("");
  const [fFromCity, setFFromCity] = useState("");
  const [fToCode, setFToCode] = useState("");
  const [fToCity, setFToCity] = useState("");
  const [fDepart, setFDepart] = useState("");
  const [fArrive, setFArrive] = useState("");
  const [fCabin, setFCabin] = useState("Economy");
  const [fFare, setFFare] = useState("");
  const [fStatus, setFStatus] = useState("confirmed");
  const [fErr, setFErr] = useState("");
  const [fBusy, setFBusy] = useState(false);
  const [lastPnr, setLastPnr] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/flights");
      const d = await res.json() as { tickets: Ticket[] };
      setTickets(d.tickets ?? []);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { if (authed) load(); }, [authed, load]);

  function login(e: React.FormEvent) {
    e.preventDefault();
    if (pw === ADMIN_PASS) { setAuthed(true); setPwErr(""); }
    else setPwErr("Invalid password");
  }

  async function createBooking(e: React.FormEvent) {
    e.preventDefault();
    if (!fName.trim() || !fEmail.trim() || !fFlightNo.trim() || !fFromCode.trim() || !fToCode.trim()) {
      setFErr("Passenger name, email, flight no, from/to codes required");
      return;
    }
    setFErr(""); setFBusy(true); setLastPnr("");
    try {
      const res = await fetch("/api/admin/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminPass: pw,
          passengerName: fName.trim(),
          passengerEmail: fEmail.trim(),
          passengerPhone: fPhone.trim(),
          airline: fAirline.trim() || fAlCode.trim(),
          airlineCode: fAlCode.trim() || "AC",
          flightNumber: fFlightNo.trim(),
          fromCode: fFromCode.trim().toUpperCase(),
          fromCity: fFromCity.trim() || fFromCode.trim().toUpperCase(),
          toCode: fToCode.trim().toUpperCase(),
          toCity: fToCity.trim() || fToCode.trim().toUpperCase(),
          departAt: fDepart || new Date().toISOString(),
          arriveAt: fArrive || new Date().toISOString(),
          cabin: fCabin,
          fare: parseInt(fFare) || 0,
          status: fStatus,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setFErr(data.error ?? "Failed"); setFBusy(false); return; }
      setLastPnr(data.ticket.pnr);
      /* clear form */
      setFName(""); setFEmail(""); setFPhone(""); setFAirline(""); setFAlCode("");
      setFFlightNo(""); setFFromCode(""); setFFromCity(""); setFToCode(""); setFToCity("");
      setFDepart(""); setFArrive(""); setFCabin("Economy"); setFFare(""); setFStatus("confirmed");
      load();
    } catch { setFErr("Network error"); }
    setFBusy(false);
  }

  if (!authed) {
    return (
      <>
        <Header />
        <section style={{ maxWidth: 400, margin: "80px auto", padding: "0 24px" }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 20, textAlign: "center" }}>
            Admin login
          </h1>
          <form onSubmit={login} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Enter admin password"
              style={{ padding: "13px 16px", borderRadius: 6, border: "1px solid #E6E6E6", background: "#fff", color: "#111", fontSize: 14.5 }}
            />
            {pwErr && <p style={{ color: "#EE0000", fontSize: 13 }}>{pwErr}</p>}
            <button type="submit" style={{ padding: "13px", borderRadius: 6, border: "none", background: "#0070F3", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: 14.5 }}>
              Login
            </button>
          </form>
        </section>
      </>
    );
  }

  return (
    <>
      <Header />
      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "32px 24px 80px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 4 }}>Admin panel</h1>
            <p style={{ color: "#6B6B6B", fontSize: 13.5 }}>
              {tickets.length} booking{tickets.length !== 1 ? "s" : ""} issued
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => setShowForm(!showForm)}
              style={{ padding: "9px 18px", borderRadius: 6, border: "1px solid #0070F3", background: showForm ? "#fff" : "#0070F3", color: showForm ? "#0070F3" : "#fff", fontWeight: 600, cursor: "pointer", fontSize: 13.5 }}
            >
              {showForm ? "Cancel" : "+ New booking"}
            </button>
            <a
              href="/flights?from=LHR&to=JFK"
              style={{ fontSize: 13.5, color: "#0070F3", textDecoration: "none", fontWeight: 500 }}
            >
              View bookings site →
            </a>
          </div>
        </div>

        {/* ── Create booking form ── */}
        {showForm && (
          <div style={{ border: "1px solid #E6E6E6", borderRadius: 12, padding: "24px", background: "#FAFAFA", marginBottom: 24 }}>
            <h2 style={{ fontSize: 17, fontWeight: 600, color: "#111", marginBottom: 16, letterSpacing: "-0.01em" }}>Create new booking</h2>
            <form onSubmit={createBooking} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: "#6B6B6B", marginBottom: 4 }}>Passenger *</label>
                <input value={fName} onChange={(e) => setFName(e.target.value)} required placeholder="Full name" style={{ width: "100%", padding: "10px 12px", border: "1px solid #E6E6E6", borderRadius: 6, fontSize: 13.5, color: "#111", background: "#fff" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: "#6B6B6B", marginBottom: 4 }}>Email *</label>
                <input type="email" value={fEmail} onChange={(e) => setFEmail(e.target.value)} required placeholder="you@example.com" style={{ width: "100%", padding: "10px 12px", border: "1px solid #E6E6E6", borderRadius: 6, fontSize: 13.5, color: "#111", background: "#fff" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: "#6B6B6B", marginBottom: 4 }}>Phone</label>
                <input value={fPhone} onChange={(e) => setFPhone(e.target.value)} placeholder="+1 555..." style={{ width: "100%", padding: "10px 12px", border: "1px solid #E6E6E6", borderRadius: 6, fontSize: 13.5, color: "#111", background: "#fff" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: "#6B6B6B", marginBottom: 4 }}>Airline name</label>
                <input value={fAirline} onChange={(e) => setFAirline(e.target.value)} placeholder="Air Canada" style={{ width: "100%", padding: "10px 12px", border: "1px solid #E6E6E6", borderRadius: 6, fontSize: 13.5, color: "#111", background: "#fff" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: "#6B6B6B", marginBottom: 4 }}>Airline code *</label>
                <input value={fAlCode} onChange={(e) => setFAlCode(e.target.value)} required placeholder="AC" style={{ width: "100%", padding: "10px 12px", border: "1px solid #E6E6E6", borderRadius: 6, fontSize: 13.5, color: "#111", background: "#fff" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: "#6B6B6B", marginBottom: 4 }}>Flight number *</label>
                <input value={fFlightNo} onChange={(e) => setFFlightNo(e.target.value)} required placeholder="AC 1512" style={{ width: "100%", padding: "10px 12px", border: "1px solid #E6E6E6", borderRadius: 6, fontSize: 13.5, color: "#111", background: "#fff" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: "#6B6B6B", marginBottom: 4 }}>From code *</label>
                <input value={fFromCode} onChange={(e) => setFFromCode(e.target.value)} required placeholder="YYZ" style={{ width: "100%", padding: "10px 12px", border: "1px solid #E6E6E6", borderRadius: 6, fontSize: 13.5, color: "#111", background: "#fff" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: "#6B6B6B", marginBottom: 4 }}>From city</label>
                <input value={fFromCity} onChange={(e) => setFFromCity(e.target.value)} placeholder="Toronto" style={{ width: "100%", padding: "10px 12px", border: "1px solid #E6E6E6", borderRadius: 6, fontSize: 13.5, color: "#111", background: "#fff" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: "#6B6B6B", marginBottom: 4 }}>To code *</label>
                <input value={fToCode} onChange={(e) => setFToCode(e.target.value)} required placeholder="EWR" style={{ width: "100%", padding: "10px 12px", border: "1px solid #E6E6E6", borderRadius: 6, fontSize: 13.5, color: "#111", background: "#fff" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: "#6B6B6B", marginBottom: 4 }}>To city</label>
                <input value={fToCity} onChange={(e) => setFToCity(e.target.value)} placeholder="Newark" style={{ width: "100%", padding: "10px 12px", border: "1px solid #E6E6E6", borderRadius: 6, fontSize: 13.5, color: "#111", background: "#fff" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: "#6B6B6B", marginBottom: 4 }}>Depart (ISO)</label>
                <input value={fDepart} onChange={(e) => setFDepart(e.target.value)} placeholder="2026-10-09T00:55:00Z" style={{ width: "100%", padding: "10px 12px", border: "1px solid #E6E6E6", borderRadius: 6, fontSize: 13.5, color: "#111", background: "#fff" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: "#6B6B6B", marginBottom: 4 }}>Arrive (ISO)</label>
                <input value={fArrive} onChange={(e) => setFArrive(e.target.value)} placeholder="2026-10-09T02:30:00Z" style={{ width: "100%", padding: "10px 12px", border: "1px solid #E6E6E6", borderRadius: 6, fontSize: 13.5, color: "#111", background: "#fff" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: "#6B6B6B", marginBottom: 4 }}>Cabin</label>
                <select value={fCabin} onChange={(e) => setFCabin(e.target.value)} style={{ width: "100%", padding: "10px 12px", border: "1px solid #E6E6E6", borderRadius: 6, fontSize: 13.5, color: "#111", background: "#fff" }}>
                  {["Economy", "Premium Economy", "Business", "First"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: "#6B6B6B", marginBottom: 4 }}>Fare ($)</label>
                <input type="number" value={fFare} onChange={(e) => setFFare(e.target.value)} placeholder="349" style={{ width: "100%", padding: "10px 12px", border: "1px solid #E6E6E6", borderRadius: 6, fontSize: 13.5, color: "#111", background: "#fff" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: "#6B6B6B", marginBottom: 4 }}>Status</label>
                <select value={fStatus} onChange={(e) => setFStatus(e.target.value)} style={{ width: "100%", padding: "10px 12px", border: "1px solid #E6E6E6", borderRadius: 6, fontSize: 13.5, color: "#111", background: "#fff" }}>
                  {["confirmed", "checked_in", "boarded", "flown", "cancelled"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div style={{ gridColumn: "1 / -1", marginTop: 8 }}>
                {lastPnr && (
                  <p style={{ padding: "10px 16px", borderRadius: 8, background: "#EAF7F0", color: "#0A8754", fontWeight: 600, fontSize: 14, marginBottom: 8 }}>
                    ✓ Booking created — PNR: <span style={{ fontFamily: "var(--font-geist-mono)", letterSpacing: "2px" }}>{lastPnr}</span>
                  </p>
                )}
                {fErr && <p style={{ color: "#EE0000", fontSize: 13 }}>{fErr}</p>}
                <button type="submit" disabled={fBusy} style={{ width: "100%", padding: "12px", borderRadius: 8, border: "none", background: "#0070F3", color: "#fff", fontWeight: 600, fontSize: 14.5, cursor: fBusy ? "not-allowed" : "pointer" }}>
                  {fBusy ? "Creating..." : "Create booking"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Tickets table ── */}
        <div style={{ border: "1px solid #E6E6E6", borderRadius: 12, background: "#FFFFFF", overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13.5, minWidth: 720 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #E6E6E6" }}>
                {["PNR", "Passenger", "Flight", "Route", "Date", "Cabin", "Actions"].map((h) => (
                  <th key={h} style={{ textAlign: "left", padding: "12px 16px", color: "#9B9B9B", fontWeight: 500, fontSize: 11.5, letterSpacing: ".04em", textTransform: "uppercase" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id} style={{ borderBottom: "1px solid #F2F2F2" }}>
                  <td style={{ padding: "12px 16px", fontFamily: "var(--font-geist-mono)", color: "#0070F3", fontWeight: 600 }}>
                    {t.pnr}
                  </td>
                  <td style={{ padding: "12px 16px", color: "#111", fontWeight: 500 }}>{t.passengerName}</td>
                  <td style={{ padding: "12px 16px", color: "#6B6B6B" }}>{t.airline} {t.flightNumber}</td>
                  <td style={{ padding: "12px 16px", fontFamily: "var(--font-geist-mono)", color: "#6B6B6B" }}>{t.fromCode} → {t.toCode}</td>
                  <td style={{ padding: "12px 16px", color: "#6B6B6B", whiteSpace: "nowrap" }}>{fmtDate(t.departAt, undefined, false)} · {fmtTime(t.departAt)}</td>
                  <td style={{ padding: "12px 16px", color: "#6B6B6B" }}>{t.cabin}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <a
                        href={`/api/ticket/${t.pnr}`}
                        style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #0070F3", color: "#0070F3", fontSize: 12.5, textDecoration: "none", fontWeight: 500 }}
                      >
                        PDF
                      </a>
                      <a
                        href={`/track/${t.pnr}`}
                        style={{ padding: "5px 12px", borderRadius: 6, border: "1px solid #E6E6E6", color: "#111", fontSize: 12.5, textDecoration: "none" }}
                      >
                        Track
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {tickets.length === 0 && (
            <p style={{ textAlign: "center", padding: "48px 24px", color: "#9B9B9B", fontSize: 14 }}>
              No bookings yet. Create one using the "+ New booking" button above.
            </p>
          )}
        </div>
      </main>
    </>
  );
}