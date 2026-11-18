import { promises as fs } from "fs";
import path from "path";
import type { Ticket } from "./types";

const KEY = "tickets";
const LOCAL_FILE = path.join(process.cwd(), "data", "tickets.json");

function kvCreds() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url, token };
}

async function kv(cmd: unknown[]): Promise<unknown> {
  const c = kvCreds();
  if (!c) throw new Error("KV not configured");
  const res = await fetch(c.url, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + c.token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cmd),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("KV error " + res.status);
  const json = (await res.json()) as { result?: unknown };
  return json.result;
}

async function readLocal(): Promise<Ticket[]> {
  try {
    const raw = await fs.readFile(LOCAL_FILE, "utf8");
    return JSON.parse(raw) as Ticket[];
  } catch {
    return [];
  }
}

async function writeLocal(rows: Ticket[]): Promise<void> {
  await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await fs.writeFile(LOCAL_FILE, JSON.stringify(rows, null, 2), "utf8");
}

export async function getTickets(): Promise<Ticket[]> {
  let rows: Ticket[];
  if (kvCreds()) {
    const r = await kv(["GET", KEY]);
    if (!r) rows = [];
    else if (typeof r === "string") rows = JSON.parse(r) as Ticket[];
    else rows = r as Ticket[];
  } else {
    rows = await readLocal();
  }
  return mergeSeeds(rows);
}

export async function saveTickets(rows: Ticket[]): Promise<void> {
  if (kvCreds()) {
    await kv(["SET", KEY, JSON.stringify(rows)]);
    return;
  }
  await writeLocal(rows);
}

export async function findTicket(pnr: string): Promise<Ticket | null> {
  const rows = await getTickets();
  const key = pnr.trim().toUpperCase();
  return rows.find((t) => t.pnr === key) ?? null;
}

export function newId(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  ).toUpperCase();
}

const PNR_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I
export function makePnr(): string {
  let out = "";
  const rnd = (s: string) => hash(s);
  let seed = Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  for (let i = 0; i < 6; i++) {
    seed = seed + i;
    out += PNR_CHARS[rnd(seed) % PNR_CHARS.length];
  }
  return out;
}

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function seatFor(row: Ticket): string {
  return `${18 + (hash(row.pnr) % 25)}${"ABCDEFGHJK"[hash(row.pnr + "x") % 9]}`;
}

/* ── Seed data ──────────────────────────────────── */

const SEED_TICKETS: Ticket[] = [
  {
    id: "SEED-AC1512",
    pnr: "AC-8X92K4",
    flightId: "AC-1512",
    flightNumber: "AC 1512",
    airline: "Air Canada",
    airlineCode: "AC",
    fromCode: "YYZ",
    fromCity: "Toronto",
    toCode: "EWR",
    toCity: "Newark (New York)",
    departAt: "2026-10-22T20:55:00Z",
    arriveAt: "2026-10-22T21:30:00Z",
    passengerName: "Bruce Jackson",
    passengerEmail: "brucejackson998@gmail.com",
    passengerPhone: "+1 (437) 998-0147",
    seat: "2A",
    cabin: "First",
    fare: 0,
    status: "confirmed",
    issuedAt: "2026-10-22T00:00:00Z",
  },
  {
    id: "SEED-TK813",
    pnr: "M4KQ7T",
    flightId: "TK-813",
    flightNumber: "TK 813",
    airline: "Turkish Airlines",
    airlineCode: "TK",
    fromCode: "AMM",
    fromCity: "Amman",
    toCode: "BOS",
    toCity: "Boston",
    departAt: "2026-12-15T08:05:00Z", // 11:05 Asia/Amman
    arriveAt: "2026-12-15T23:05:00Z", // 18:05 America/New_York (EST)
    via: {
      code: "IST",
      city: "Istanbul",
      flightNumber: "TK 81",
      arriveAt: "2026-12-15T10:50:00Z", // 13:50 Europe/Istanbul
      departAt: "2026-12-15T12:40:00Z", // 15:40 Europe/Istanbul
    },
    passengerName: "Jace Richard",
    passengerEmail: "jace.richard@example.com",
    passengerPhone: "",
    seat: "3K",
    cabin: "Business",
    fare: 0,
    status: "confirmed",
    issuedAt: "2026-11-18T00:00:00Z",
  },
];

/* Seeds are merged in memory so they are always served, even on a
   read-only filesystem (Vercel lambdas) where persistence is impossible. */
async function mergeSeeds(rows: Ticket[]): Promise<Ticket[]> {
  const missing = SEED_TICKETS.filter((s) => !rows.some((t) => t.pnr === s.pnr));
  if (!missing.length) return rows;
  const next = [...rows, ...missing];
  try {
    await saveTickets(next);
  } catch {
    /* not persistable (read-only FS) — serve from memory */
  }
  return next;
}
