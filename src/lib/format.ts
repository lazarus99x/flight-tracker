export function fmtTime(iso: string, tz?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  const opts: Intl.DateTimeFormatOptions = {
    hour: "2-digit", minute: "2-digit", hour12: false,
  };
  if (tz) opts.timeZone = tz;
  return new Intl.DateTimeFormat("en-GB", opts).format(d);
}

export function fmtDate(iso: string, tz?: string, withTime = true): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  const opts: Intl.DateTimeFormatOptions = {
    day: "2-digit", month: "short", year: "numeric",
  };
  if (withTime) {
    opts.hour = "2-digit";
    opts.minute = "2-digit";
    opts.hour12 = false;
  }
  if (tz) opts.timeZone = tz;
  return new Intl.DateTimeFormat("en-GB", opts).format(d);
}

export function fmtDuration(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${m}m`;
}

export function fmtMoney(n: number): string {
  return "$" + n.toLocaleString("en-US");
}

export function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}