"use client";

export default function RouteGrid({ routes }: { routes: { from: string; to: string; label: string }[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
      {routes.map((r) => (
        <a
          key={r.label}
          href={`/flights?from=${r.from}&to=${r.to}`}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "13px 16px", background: "#FAFAFA", border: "1px solid #E6E6E6",
            borderRadius: 8, textDecoration: "none", fontSize: 14, color: "#111",
            transition: "border-color .15s, box-shadow .15s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = "#0070F3";
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,112,243,.08)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = "#E6E6E6";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <span style={{ fontWeight: 500 }}>{r.label}</span>
          <span style={{ color: "#9B9B9B" }}>→</span>
        </a>
      ))}
    </div>
  );
}