import Link from "next/link";
import Header from "@/components/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <section style={{ maxWidth: 480, margin: "0 auto", padding: "100px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 48, marginBottom: 12 }}>✈️</p>
        <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 10, letterSpacing: "-0.02em" }}>
          Page not found
        </h1>
        <p style={{ color: "#6B6B6B", fontSize: 14.5, marginBottom: 28 }}>
          The page or booking you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          style={{
            padding: "12px 28px", borderRadius: 8, textDecoration: "none",
            background: "#0070F3", color: "#fff", fontSize: 14, fontWeight: 600,
            display: "inline-block",
          }}
        >
          ← Back to home
        </Link>
      </section>
    </>
  );
}