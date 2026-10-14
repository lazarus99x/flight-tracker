import Header from "@/components/Header";
import FlightSearchForm from "@/components/FlightSearchForm";
import RouteGrid from "@/components/RouteGrid";
import { popularRoutes } from "@/lib/flights";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* ──────── HERO ──────── */}
        <section style={{ borderBottom: "1px solid #E6E6E6", background: "#FFFFFF" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto", padding: "64px 24px 56px", textAlign: "center" }}>
            <p
              style={{
                fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase",
                color: "#6B6B6B", marginBottom: 16, fontWeight: 500,
              }}
            >
              International flight Tracking
            </p>
            <h1
              style={{
                fontSize: "clamp(32px, 5vw, 54px)", fontWeight: 600,
                lineHeight: 1.1, letterSpacing: "-0.03em", color: "#111",
                maxWidth: 720, margin: "0 auto 16px",
              }}
            >
              Track any flight.
              <br />
              <span style={{ color: "#0070F3" }}>Book with confidence.</span>
            </h1>
            <p style={{ color: "#6B6B6B", fontSize: 16, maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.6 }}>
              Real-time status for flights across international airports.
              Search by route, check a booking by PNR, or download a professional itinerary PDF.
            </p>

            <FlightSearchForm />

            <div
              style={{
                display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap",
                marginTop: 40, color: "#9B9B9B", fontSize: 13,
              }}
            >
              <span><span style={{ color: "#111", fontWeight: 600 }}>200+</span> airports</span>
              <span><span style={{ color: "#111", fontWeight: 600 }}>38</span> airlines</span>
              <span><span style={{ color: "#111", fontWeight: 600 }}>PDF</span> itineraries</span>
            </div>
          </div>
        </section>

        {/* ──────── POPULAR ROUTES ──────── */}
        <section style={{ maxWidth: 1080, margin: "0 auto", padding: "48px 24px" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: "#111", marginBottom: 20, letterSpacing: "-0.01em" }}>
            Popular international routes
          </h2>
          <RouteGrid routes={popularRoutes()} />
        </section>

        {/* ──────── HOW IT WORKS ──────── */}
        <section style={{ background: "#FAFAFA", borderTop: "1px solid #E6E6E6", borderBottom: "1px solid #E6E6E6" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto", padding: "56px 24px" }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "#111", marginBottom: 32, letterSpacing: "-0.01em" }}>
              How it works
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
              {[
                { n: "01", t: "Search a route", d: "Pick origin, destination and date. See live flight options from real international carriers." },
                { n: "02", t: "Book your flight", d: "Choose the flight that fits, add passenger details, and confirm in seconds." },
                { n: "03", t: "Get your PNR", d: "Receive a booking reference (PNR) plus a professional PDF itinerary for your records." },
                { n: "04", t: "Track anytime", d: "Follow the flight status from check-in to landing using your PNR or route search." },
              ].map((c) => (
                <div key={c.n}>
                  <p style={{ fontSize: 12, color: "#9B9B9B", marginBottom: 6, fontFamily: "var(--font-geist-mono)" }}>{c.n}</p>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "#111", marginBottom: 6 }}>{c.t}</h3>
                  <p style={{ fontSize: 13.5, color: "#6B6B6B", lineHeight: 1.55 }}>{c.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ──────── TRACK BY PNR ──────── */}
        <section style={{ maxWidth: 1080, margin: "0 auto", padding: "56px 24px", textAlign: "center" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: "#111", marginBottom: 12, letterSpacing: "-0.01em" }}>
            Already booked? Track your flight
          </h2>
          <p style={{ color: "#6B6B6B", fontSize: 14, marginBottom: 24 }}>
            Enter your 6-character booking reference to see your itinerary and live status.
          </p>
          <form action="/track" method="get" style={{ display: "flex", gap: 8, maxWidth: 420, margin: "0 auto" }}>
            <input
              name="code"
              required
              placeholder="PNR e.g. AB12CD"
              style={{
                flex: 1, padding: "12px 16px", border: "1px solid #E6E6E6",
                background: "#FFFFFF", color: "#111", fontSize: 14,
              }}
            />
            <button
              type="submit"
              style={{
                padding: "12px 24px", border: "1px solid #0070F3", background: "#0070F3",
                color: "#FFFFFF", fontSize: 14, fontWeight: 500, borderRadius: 6, cursor: "pointer",
              }}
            >
              Track
            </button>
          </form>
        </section>

        {/* ──────── FOOTER ──────── */}
        <footer style={{ borderTop: "1px solid #E6E6E6", background: "#FFFFFF" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto", padding: "28px 24px", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <span style={{ color: "#9B9B9B", fontSize: 13 }}>AeroFlights © {new Date().getFullYear()}</span>
            <span style={{ color: "#9B9B9B", fontSize: 13 }}>
              International flight tracking & booking
            </span>
          </div>
        </footer>
      </main>
    </>
  );
}