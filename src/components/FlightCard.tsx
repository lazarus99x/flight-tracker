"use client";

import { fmtTime, fmtDuration, fmtMoney } from "@/lib/format";
import type { SearchFlight } from "@/lib/flights";

export default function FlightCard({ f, href }: { f: SearchFlight; href: string }) {
  return (
    <a
      href={href}
      style={{
        display: "block", textDecoration: "none",
        background: "#FFFFFF", border: "1px solid #E6E6E6", borderRadius: 10,
        padding: "18px 22px", transition: "border-color .15s, box-shadow .15s",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.borderColor = "#0070F3";
        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,112,243,.07)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.borderColor = "#E6E6E6";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
        {/* airline */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 140 }}>
          <span
            style={{
              width: 10, height: 10, borderRadius: 3, background: f.airlineColor,
              display: "inline-block", flexShrink: 0,
            }}
          />
          <div>
            <p style={{ fontSize: 13.5, fontWeight: 600, color: "#111" }}>{f.airline}</p>
            <p style={{ fontSize: 12, color: "#9B9B9B", fontFamily: "var(--font-geist-mono)" }}>
              {f.flightNumber} · {f.aircraft}
            </p>
          </div>
        </div>

        {/* times */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1, minWidth: 200, justifyContent: "center" }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 20, fontWeight: 600, color: "#111", fontFamily: "var(--font-geist-mono)" }}>
              {fmtTime(f.departAt)}
            </p>
            <p style={{ fontSize: 12, color: "#6B6B6B", fontFamily: "var(--font-geist-mono)" }}>{f.fromCode}</p>
          </div>
          <div style={{ flex: 1, maxWidth: 150, textAlign: "center" }}>
            <p style={{ fontSize: 11.5, color: "#9B9B9B", marginBottom: 4 }}>{fmtDuration(f.durationMin)}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ flex: 1, height: 1, background: "#D4D4D4" }} />
              {f.stops > 0 ? (
                <span style={{ fontSize: 10.5, color: "#F5A623", whiteSpace: "nowrap" }}>{f.stops} stop</span>
              ) : (
                <span style={{ fontSize: 10.5, color: "#0A8754", whiteSpace: "nowrap" }}>non-stop</span>
              )}
              <div style={{ flex: 1, height: 1, background: "#D4D4D4" }} />
            </div>
          </div>
          <div>
            <p style={{ fontSize: 20, fontWeight: 600, color: "#111", fontFamily: "var(--font-geist-mono)" }}>
              {fmtTime(f.arriveAt)}
            </p>
            <p style={{ fontSize: 12, color: "#6B6B6B", fontFamily: "var(--font-geist-mono)" }}>{f.toCode}</p>
          </div>
        </div>

        {/* cabin + fare */}
        <div style={{ textAlign: "right", minWidth: 120 }}>
          <p style={{ fontSize: 12, color: "#6B6B6B", marginBottom: 4 }}>{f.cabin}</p>
          <p style={{ fontSize: 18, fontWeight: 600, color: "#111" }}>{fmtMoney(f.fare)}</p>
          <p style={{ fontSize: 11.5, color: "#0070F3", fontWeight: 500, marginTop: 4 }}>Select →</p>
        </div>
      </div>
    </a>
  );
}