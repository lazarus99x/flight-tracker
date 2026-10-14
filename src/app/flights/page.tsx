import Header from "@/components/Header";
import FlightSearchForm from "@/components/FlightSearchForm";
import FlightCard from "@/components/FlightCard";
import { searchFlights } from "@/lib/flights";
import { findAirport } from "@/lib/airports";
import { fmtDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default function FlightsPage({
  searchParams,
}: {
  searchParams: { from?: string; to?: string; date?: string };
}) {
  const from = (searchParams.from ?? "").toUpperCase();
  const to = (searchParams.to ?? "").toUpperCase();
  const date = searchParams.date ?? new Date().toISOString().slice(0, 10);

  const flights = from && to ? searchFlights(from, to, date) : [];
  const fromA = findAirport(from);
  const toA = findAirport(to);

  return (
    <>
      <Header />
      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "28px 24px 80px" }}>
        <h1 style={{ fontSize: 20, fontWeight: 600, color: "#111", letterSpacing: "-0.02em", marginBottom: 4 }}>
          {fromA?.city ?? from} <span style={{ color: "#9B9B9B", fontWeight: 400 }}>({from})</span>
          {" → "}
          {toA?.city ?? to} <span style={{ color: "#9B9B9B", fontWeight: 400 }}>({to})</span>
        </h1>
        <p style={{ color: "#6B6B6B", fontSize: 13.5, marginBottom: 24 }}>
          {flights.length} flight{flights.length !== 1 ? "s" : ""} · {fmtDate(date + "T00:00:00Z", undefined, false)}
        </p>

        <FlightSearchForm initialFrom={from} initialTo={to} initialDate={date} />

        <div style={{ height: 32 }} />

        {flights.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 24px", border: "1px solid #E6E6E6", borderRadius: 10, background: "#FAFAFA" }}>
            <p style={{ fontSize: 24, marginBottom: 8 }}>✈️</p>
            <h2 style={{ fontSize: 17, fontWeight: 600, color: "#111", marginBottom: 8 }}>No flights found</h2>
            <p style={{ fontSize: 14, color: "#6B6B6B" }}>
              Try a different route or another date.
            </p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {flights.map((f) => (
            <FlightCard key={f.id} f={f} href={`/book/${f.id}?from=${from}&to=${to}&date=${date}`} />
          ))}
        </div>
      </main>
    </>
  );
}