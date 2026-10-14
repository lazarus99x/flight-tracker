"use client";

import { useState, FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import { flightById } from "@/lib/flights";
import { findAirport } from "@/lib/airports";
import { fmtTime, fmtDate, fmtDuration, fmtMoney } from "@/lib/format";

export default function BookPage({ params }: { params: { id: string } }) {
  const sp = useSearchParams();
  const from = (sp.get("from") ?? "").toUpperCase();
  const to = (sp.get("to") ?? "").toUpperCase();
  const date = sp.get("date") ?? new Date().toISOString().slice(0, 10);

  const f = flightById(params.id, from, to, date);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cabin, setCabin] = useState(f?.cabin ?? "Economy");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  if (!f) {
    return (
      <>
        <Header />
        <main style={{ maxWidth: 640, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <p style={{ fontSize: 32, marginBottom: 12 }}>✈️</p>
          <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Flight not found</h1>
          <p style={{ color: "#6B6B6B", fontSize: 14 }}>This flight link is invalid or expired. Go back and search again.</p>
        </main>
      </>
    );
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim()) { setErr("Passenger name and email are required"); return; }
    setErr(""); setBusy(true);
    try {
      const res = await fetch("/api/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flight: f,
          passengerName: name.trim(),
          passengerEmail: email.trim(),
          passengerPhone: phone.trim(),
          cabin,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.error ?? "Booking failed"); setBusy(false); return; }
      window.location.href = `/confirmation/${data.ticket.pnr}`;
    } catch { setErr("Network error"); setBusy(false); }
  }

  const fromA = findAirport(from);
  const toA = findAirport(to);

  return (
    <>
      <Header />
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "32px 24px 80px" }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: "#111", letterSpacing: "-0.02em", marginBottom: 24 }}>
          Book this flight
        </h1>

        {/* flight summary */}
        <div style={{ border: "1px solid #E6E6E6", borderRadius: 10, padding: "20px 24px", background: "#FAFAFA", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: f.airlineColor, display: "inline-block" }} />
            <span style={{ fontWeight: 600, fontSize: 14.5 }}>{f.airline}</span>
            <span style={{ color: "#9B9B9B", fontFamily: "var(--font-geist-mono)", fontSize: 13 }}>{f.flightNumber}</span>
            <span style={{ color: "#9B9B9B", fontSize: 13 }}>· {f.aircraft}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <p style={{ fontSize: 26, fontWeight: 600, fontFamily: "var(--font-geist-mono)" }}>{fmtTime(f.departAt)}</p>
              <p style={{ fontSize: 13, color: "#6B6B6B", fontFamily: "var(--font-geist-mono)" }}>{f.fromCode}</p>
              <p style={{ fontSize: 13, color: "#6B6B6B" }}>{fromA?.city}, {fromA?.country}</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 12, color: "#9B9B9B", marginBottom: 6 }}>{fmtDuration(f.durationMin)}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, width: 120 }}>
                <div style={{ flex: 1, height: 1, background: "#D4D4D4" }} />
                <span style={{ fontSize: 11, color: f.stops ? "#F5A623" : "#0A8754" }}>
                  {f.stops ? `${f.stops} stop` : "non-stop"}
                </span>
                <div style={{ flex: 1, height: 1, background: "#D4D4D4" }} />
              </div>
              <p style={{ fontSize: 12, color: "#9B9B9B", marginTop: 6 }}>{fmtDate(f.departAt, undefined, false)}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 26, fontWeight: 600, fontFamily: "var(--font-geist-mono)" }}>{fmtTime(f.arriveAt)}</p>
              <p style={{ fontSize: 13, color: "#6B6B6B", fontFamily: "var(--font-geist-mono)" }}>{f.toCode}</p>
              <p style={{ fontSize: 13, color: "#6B6B6B" }}>{toA?.city}, {toA?.country}</p>
            </div>
          </div>
        </div>

        {/* passenger form */}
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            <Field label="Passenger full name" value={name} set={setName} placeholder="As on passport" required />
            <Field label="Email" value={email} set={setEmail} placeholder="you@example.com" type="email" required />
            <Field label="Phone (optional)" value={phone} set={setPhone} placeholder="+1 555 ..." type="tel" />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#6B6B6B", marginBottom: 6 }}>
              Cabin class
            </label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Economy", "Premium Economy", "Business"].map((c) => {
                const base = f.cabin === "Business" ? 0.42 : f.cabin === "Premium Economy" ? 0.22 : 0.13;
                const price = Math.round(f.fare * (c === "Business" ? 0.42 / base : c === "Premium Economy" ? 0.22 / base : 1));
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCabin(c)}
                    style={{
                      padding: "10px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13.5,
                      border: cabin === c ? "1px solid #0070F3" : "1px solid #E6E6E6",
                      background: cabin === c ? "#F0F6FF" : "#FFFFFF",
                      color: cabin === c ? "#0070F3" : "#111",
                      fontWeight: cabin === c ? 600 : 450,
                    }}
                  >
                    {c} · {fmtMoney(price)}
                  </button>
                );
              })}
            </div>
          </div>

          {err && <p style={{ color: "#EE0000", fontSize: 13.5 }}>{err}</p>}

          <div style={{ borderTop: "1px solid #E6E6E6", paddingTop: 18, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <p style={{ fontSize: 13, color: "#6B6B6B" }}>Total</p>
              <p style={{ fontSize: 24, fontWeight: 600 }}>
                {fmtMoney(Math.round(f.fare * (cabin === f.cabin ? 1 : cabin === "Business" ? 0.42 / (f.cabin === "Business" ? 0.42 : f.cabin === "Premium Economy" ? 0.22 : 0.13) : 0.22 / (f.cabin === "Business" ? 0.42 : f.cabin === "Premium Economy" ? 0.22 : 0.13))))}
              </p>
            </div>
            <button
              type="submit"
              disabled={busy}
              style={{
                padding: "13px 32px", borderRadius: 8, border: "none",
                background: "#0070F3", color: "#fff", fontSize: 15, fontWeight: 600, cursor: busy ? "not-allowed" : "pointer",
              }}
            >
              {busy ? "Confirming..." : "Confirm booking"}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}

function Field({ label, value, set, placeholder, type = "text", required }: {
  label: string; value: string; set: (v: string) => void;
  placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#6B6B6B", marginBottom: 6 }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => set(e.target.value)}
        style={{
          width: "100%", padding: "12px 14px", border: "1px solid #E6E6E6",
          background: "#FFFFFF", color: "#111", fontSize: 14.5,
        }}
      />
    </div>
  );
}