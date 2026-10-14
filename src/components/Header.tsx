"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header style={{ borderBottom: "1px solid #E6E6E6", background: "#FFFFFF" }}>
      <div
        style={{
          maxWidth: 1080, margin: "0 auto", padding: "0 24px",
          display: "flex", alignItems: "center", height: 60, gap: 32,
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M2.5 19h19L12.5 5h-2L2.5 19z" fill="#0070F3" />
            <path d="M12 5v14" stroke="#0070F3" strokeWidth="1.5" />
          </svg>
          <span style={{ fontWeight: 600, fontSize: 17, color: "#111", letterSpacing: "-0.3px" }}>
            AeroFlights
          </span>
        </Link>
        <nav style={{ display: "flex", gap: 24, marginLeft: "auto" }}>
          <NavLink href="/">Track a flight</NavLink>
          <NavLink href="/flights">Search flights</NavLink>
        </nav>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        fontSize: 14, color: "#6B6B6B", textDecoration: "none", fontWeight: 450,
        display: "flex", alignItems: "center",
        transition: "color .15s",
      }}
      onMouseOver={(e) => (e.currentTarget.style.color = "#111")}
      onMouseOut={(e) => (e.currentTarget.style.color = "#6B6B6B")}
    >
      {children}
    </Link>
  );
}