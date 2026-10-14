import Link from "next/link";
import Header from "@/components/Header";
import { findTicket } from "@/lib/store";
import { fmtTime, fmtDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function ConfirmationPage({ params }: { params: { pnr: string } }) {
  const t = await findTicket(params.pnr);
  if (!t) {
    return (
      <>
        <Header />
        <main style={{ maxWidth: 600, margin: "0 auto", padding: "100px 24px", textAlign: "center" }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Booking not found</h1>
          <p style={{ color: "#6B6B6B", fontSize: 14 }}>
            We couldn&apos;t find a booking with reference <b>{params.pnr}</b>.
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "48px 24px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              width: 56, height: 56, borderRadius: 28, background: "#EAF7F0",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              marginBottom: 16, color: "#0A8754", fontSize: 28,
            }}
          >
            ✓
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 8 }}>
            Booking confirmed
          </h1>
          <p style={{ color: "#6B6B6B", fontSize: 14.5 }}>
            Your itinerary for {t.airline} {t.flightNumber} has been issued
          </p>
        </div>

        {/* PNR card */}
        <div
          style={{
            border: "1px solid #E6E6E6", borderRadius: 12, padding: "28px 24px",
            background: "#FFFFFF", textAlign: "center", boxShadow: "0 1px 2px rgba(0,0,0,.04)",
          }}
        >
          <p style={{ fontSize: 11, color: "#9B9B9B", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 8 }}>
            Booking reference
          </p>
          <p style={{ fontSize: 36, fontWeight: 700, fontFamily: "var(--font-geist-mono)", color: "#0070F3", letterSpacing: "4px" }}>
            {t.pnr}
          </p>
          <p style={{ fontSize: 12.5, color: "#6B6B6B", marginTop: 12 }}>
            Save this. You can track your flight with it anytime.
          </p>

          <div
            style={{
              margin: "24px 0", paddingTop: 20, borderTop: "1px solid #E6E6E6",
              display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16, textAlign: "left",
            }}
          >
            <Summary k="Passenger" v={t.passengerName} />
            <Summary k="Flight" v={`${t.airline} ${t.flightNumber}`} />
            <Summary k="Route" v={`${t.fromCode} → ${t.toCode}`} />
            <Summary k="Date" v={fmtDate(t.departAt, undefined, false)} />
            <Summary k="Departure" v={`${fmtTime(t.departAt)}`} />
            <Summary k="Arrival" v={fmtTime(t.arriveAt)} />
            <Summary k="Cabin / Seat" v={`${t.cabin} · ${t.seat ?? "-"}`} />
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href={`/api/ticket/${t.pnr}`}
              style={{
                padding: "12px 26px", borderRadius: 8, textDecoration: "none",
                background: "#0070F3", color: "#fff", fontSize: 14, fontWeight: 600,
              }}
            >
              ⬇ Download PDF
            </a>
            <Link
              href={`/track/${t.pnr}`}
              style={{
                padding: "12px 26px", borderRadius: 8, textDecoration: "none",
                background: "#FFFFFF", color: "#111", fontSize: 14, fontWeight: 500,
                border: "1px solid #E6E6E6",
              }}
            >
              Track flight
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

function Summary({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p style={{ fontSize: 11, color: "#9B9B9B", marginBottom: 4 }}>{k}</p>
      <p style={{ fontSize: 13.5, color: "#111", fontWeight: 500 }}>{v}</p>
    </div>
  );
}