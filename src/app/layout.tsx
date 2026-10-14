import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "AeroFlights — Flight Status & Booking",
  description: "Real-time flight tracking and booking for international airlines",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <link rel="icon" href="/icon.svg" sizes="any" type="image/svg+xml" />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}