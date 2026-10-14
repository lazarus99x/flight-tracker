"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AIRPORTS } from "@/lib/airports";
import { todayStr, daysFromNow } from "@/lib/format";

const MAX_DATE = daysFromNow(365);

export default function FlightSearchForm({ initialFrom, initialTo, initialDate }: {
  initialFrom?: string; initialTo?: string; initialDate?: string;
}) {
  const [from, setFrom] = useState(initialFrom ?? "");
  const [to, setTo] = useState(initialTo ?? "");
  const [date, setDate] = useState(initialDate ?? todayStr());
  const [err, setErr] = useState("");
  const router = useRouter();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!from || !to) { setErr("Select both origin and destination"); return; }
    if (from === to) { setErr("Origin and destination must differ"); return; }
    setErr("");
    router.push(`/flights?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}`);
  }

  return (
    <form
      onSubmit={submit}
      style={{
        maxWidth: 760, margin: "0 auto", textAlign: "left",
        background: "#FFFFFF", border: "1px solid #E6E6E6", borderRadius: 10,
        boxShadow: "0 1px 2px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.05)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 0 }}>
          <Field label="From" code={from} setCode={setFrom} filter={(to) ? to : undefined} opposite={to} />
          <Field label="To" code={to} setCode={setTo} filter={from ? from : undefined} opposite={from} />
          <div style={{ padding: "14px 16px", borderLeft: "1px solid #E6E6E6", borderTop: "1px solid #E6E6E6" }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6 }}>
              Departure date
            </label>
            <input
              type="date"
              value={date}
              min={todayStr()}
              max={MAX_DATE}
              onChange={(e) => setDate(e.target.value)}
              style={{ width: "100%", border: "none", background: "transparent", color: "#111", fontSize: 15, padding: 0 }}
            />
          </div>
        </div>
        {err && <p style={{ color: "#EE0000", fontSize: 12.5, padding: "0 16px 8px" }}>{err}</p>}
        <div style={{ padding: "10px 16px 16px" }}>
          <button
            type="submit"
            style={{
              width: "100%", padding: "13px", borderRadius: 8, border: "none",
              background: "#0070F3", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer",
            }}
          >
            Search flights
          </button>
        </div>
      </div>
    </form>
  );
}

function Field({ label, code, setCode, filter, opposite }: {
  label: string; code: string; setCode: (v: string) => void; filter?: string; opposite: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const listed = AIRPORTS.filter((a) => {
    if (!q) return true;
    const s = q.toLowerCase();
    return a.code.toLowerCase().includes(s) || a.city.toLowerCase().includes(s) || a.country.toLowerCase().includes(s);
  })
    .filter((a) => a.code !== (opposite || ""))
    .slice(0, 7);

  const chosen = AIRPORTS.find((a) => a.code === code);

  return (
    <div style={{ padding: "14px 16px", borderLeft: "1px solid #E6E6E6", position: "relative" }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 500, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 6 }}>
        {label}
      </label>
      <input
        readOnly
        value={chosen ? `${chosen.city} (${chosen.code})` : ""}
        placeholder="Type to search"
        onFocus={() => { setQ(""); setOpen(true); }}
        onChange={(e) => { setQ(e.target.value); if (!code) setOpen(true); }}
        onClick={() => setOpen(true)}
        style={{ width: "100%", border: "none", background: "transparent", color: "#111", fontSize: 15, cursor: "pointer", padding: 0 }}
      />
      {open && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 9 }} onClick={() => setOpen(false)} />
          <div
            style={{
              position: "absolute", top: "100%", left: 0, right: 0, zIndex: 10,
              background: "#fff", border: "1px solid #E6E6E6", borderRadius: 8,
              boxShadow: "0 8px 24px rgba(0,0,0,.08)", marginTop: 4, overflow: "hidden",
            }}
          >
            <input
              autoFocus
              placeholder="Search airport or city"
              value={q}
              onChange={(e) => { setQ(e.target.value); }}
              style={{ width: "100%", padding: "10px 14px", border: "none", borderBottom: "1px solid #E6E6E6", fontSize: 13.5 }}
            />
            <div style={{ maxHeight: 220, overflowY: "auto" }}>
              {listed.map((a) => (
                <button
                  key={a.code}
                  type="button"
                  onClick={() => { setCode(a.code); setOpen(false); }}
                  style={{
                    display: "flex", width: "100%", gap: 12, alignItems: "center",
                    padding: "9px 14px", border: "none", background: "transparent",
                    cursor: "pointer", textAlign: "left",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = "#F5F5F5")}
                  onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12.5, color: "#0070F3", fontWeight: 600, width: 40 }}>{a.code}</span>
                  <span style={{ fontSize: 13.5, color: "#111" }}>
                    {a.city} <span style={{ color: "#9B9B9B" }}>— {a.country}</span>
                  </span>
                </button>
              ))}
              {listed.length === 0 && (
                <p style={{ padding: "12px 14px", fontSize: 13, color: "#9B9B9B" }}>No airport found</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}