import { AIRPORTS, findAirport } from "./airports";
import { AIRLINES, airlineByCode } from "./airlines";

export type SearchFlight = {
  id: string;
  flightNumber: string;
  airlineCode: string;
  airline: string;
  airlineColor: string;
  fromCode: string;
  fromCity: string;
  toCode: string;
  toCity: string;
  departAt: string; // ISO
  arriveAt: string; // ISO
  durationMin: number;
  stops: number;
  aircraft: string;
  cabin: string;
  fare: number;
};

/* deterministic hash for stable results */
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/* approximate great-circle distance in km */
function distanceKm(aCode: string, bCode: string): number {
  const a = findAirport(aCode);
  const b = findAirport(bCode);
  if (!a || !b) return 5000;
  const coords: Record<string, [number, number]> = {
    LHR: [51.47, -0.4543], LGW: [51.1537, -0.1821], CDG: [49.0097, 2.5479],
    AMS: [52.3105, 4.7683], FRA: [50.0379, 8.5622], MUC: [48.3538, 11.7861], MAD: [40.4722, -3.5609],
    BCN: [41.2974, 2.0833], FCO: [41.8003, 12.2389], MXP: [45.6306, 8.7281], ZRH: [47.4647, 8.5492],
    GVA: [46.2381, 6.109], VIE: [48.1103, 16.5697], BRU: [50.9014, 4.4844], DUB: [53.4264, -6.2499],
    LIS: [38.7742, -9.1342], ATH: [37.9364, 23.9445], IST: [41.2753, 28.7519], CPH: [55.618, 12.6508],
    ARN: [59.6519, 17.9186], OSL: [60.1939, 11.1004], HEL: [60.3172, 24.9633], WAW: [52.1657, 20.9671],
    PRG: [50.1008, 14.26], BUD: [47.4298, 19.2611], SOF: [42.6952, 23.4062], JFK: [40.6413, -73.7781],
    EWR: [40.6895, -74.1745], ORD: [41.9742, -87.9073], ATL: [33.6407, -84.4277], MIA: [25.7959, -80.287],
    LAX: [33.9416, -118.4085], SFO: [37.6213, -122.379], SEA: [47.4502, -122.3088], DFW: [32.8998, -97.0403],
    IAH: [29.9902, -95.3368], BOS: [42.3656, -71.0096], YYZ: [43.6777, -79.6248], YUL: [45.4706, -73.7408],
    YVR: [49.1967, -123.1815], MEX: [19.4361, -99.0725], CUN: [21.0365, -86.877], GRU: [-23.4356, -46.4731],
    GIG: [-22.8099, -43.2506], EZE: [-34.8222, -58.5358], SCL: [-33.393, -70.7858], BOG: [4.7016, -74.1469],
    LIM: [-12.0219, -77.1143], PTY: [9.0714, -79.3835], DXB: [25.2532, 55.3657], AUH: [24.433, 54.6511],
    DOH: [25.2731, 51.6081], JED: [21.6796, 39.1565], RUH: [24.9576, 46.6988], KWI: [29.2266, 47.9689],
    BAH: [26.2708, 50.6337], TLV: [32.0114, 34.8867], DEL: [28.5562, 77.1], BOM: [19.0896, 72.8656],
    BLR: [13.1986, 77.7066], MAA: [12.9941, 80.1709], DAC: [23.8433, 90.3978], KUL: [2.7456, 101.7099],
    SIN: [1.3644, 103.9915], CGK: [-6.1256, 106.6559], BKK: [13.69, 100.7501], HKT: [8.1132, 98.3169],
    MNL: [14.5086, 121.0198], SGN: [10.8188, 106.652], HAN: [21.2212, 105.8072], HKG: [22.308, 113.9185],
    PVG: [31.1443, 121.8083], PEK: [40.0799, 116.6031], CAN: [23.3924, 113.2988], SZX: [22.6393, 113.8108],
    ICN: [37.4602, 126.4407], NRT: [35.7647, 140.3864], HND: [35.5494, 139.7798], KIX: [34.4347, 135.244],
    TPE: [25.0777, 121.2328], SYD: [-33.9461, 151.1772], MEL: [-37.6733, 144.8435], BNE: [-27.3842, 153.1175],
    PER: [-31.9403, 115.9673], AKL: [-37.0082, 174.785],
  };
  const [la1, lo1] = coords[aCode] ?? [0, 0];
  const [la2, lo2] = coords[bCode] ?? [0, 0];
  const R = 6371;
  const dLat = ((la2 - la1) * Math.PI) / 180;
  const dLon = ((lo2 - lo1) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((la1 * Math.PI) / 180) * Math.cos((la2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s)));
}

const AIRCRAFT = ["Boeing 737-800", "Airbus A320neo", "Airbus A321neo", "Boeing 787-9", "Airbus A350-900", "Boeing 777-300ER", "Airbus A380-800", "Embraer E195-E2", "Boeing 737 MAX 9"];

function offsetMinutes(tz: string, dateUtc: Date): number {
  try {
    const tzDate = new Date(dateUtc.toLocaleString("en-US", { timeZone: tz }));
    const offset = tzDate.getTime() - dateUtc.getTime();
    return Math.round(offset / 60000);
  } catch {
    return 0;
  }
}

export function searchFlights(fromCode: string, toCode: string, dateStr: string): SearchFlight[] {
  const from = findAirport(fromCode);
  const to = findAirport(toCode);
  if (!from || !to || fromCode === toCode) return [];

  const dist = distanceKm(fromCode, toCode);
  /* flight time: ~850 km/h cruise + 50 min taxi/boarding buffer */
  const flightMin = Math.round((dist / 850) * 60 + 50);
  /* only airlines that plausibly fly this range: short-haul → regional, long-haul → mainline */
  const longHaul = dist > 3000;
  const pool = AIRLINES.filter((a) => {
    if (longHaul) return !["W6", "FR", "U2", "P4"].includes(a.code);
    return true;
  });
  const n = longHaul ? 4 + (hash(fromCode + toCode + dateStr) % 3) : 5 + (hash(toCode + fromCode + dateStr) % 4);

  const out: SearchFlight[] = [];
  const day = dateStr || new Date().toISOString().slice(0, 10);
  const base = new Date(day + "T00:00:00Z");

  for (let i = 0; i < n; i++) {
    const airline = pool[hash(fromCode + toCode + day + i) % pool.length];
    const cabin = i % 4 === 0 ? "Business" : i % 7 === 0 ? "Premium Economy" : "Economy";
    const departOffset = 6 * 60 + (hash(toCode + fromCode + day + i * 7) % (14 * 60)); // 06:00–20:00
    /* account roughly for timezone: depart in origin tz, arrive in dest tz */
    const departUtc = new Date(base.getTime() + departOffset * 60000 - offsetMinutes(from.tz, base) * 60000);
    const duration = flightMin + (hash(day + airline.code) % 45);
    const arriveUtc = new Date(departUtc.getTime() + duration * 60000 + (offsetMinutes(to.tz, departUtc) - offsetMinutes(from.tz, departUtc)) * 60000);
    const stops = dist < 1200 ? 0 : hash(fromCode + toCode + i) % 3 === 0 ? 1 : 0;
    const baseFare = Math.round(dist * (cabin === "Business" ? 0.42 : cabin === "Premium Economy" ? 0.22 : 0.13) + (cabin === "Business" ? 180 : cabin === "Premium Economy" ? 90 : 45));
    const fare = Math.round((baseFare + (hash(day + i) % 90)) / 5) * 5 - 5;

    out.push({
      id: `${airline.code}-${900 + (hash(fromCode + to + i) % 900)}`,
      flightNumber: `${airline.code} ${900 + (hash(fromCode + to + i) % 900)}`,
      airlineCode: airline.code,
      airline: airline.name,
      airlineColor: airline.color,
      fromCode,
      fromCity: from.city,
      toCode,
      toCity: to.city,
      departAt: departUtc.toISOString(),
      arriveAt: arriveUtc.toISOString(),
      durationMin: duration,
      stops,
      aircraft: AIRCRAFT[hash(day + i) % AIRCRAFT.length],
      cabin,
      fare: Math.max(fare, 49),
    });
  }

  return out.sort((a, b) => new Date(a.departAt).getTime() - new Date(b.departAt).getTime());
}

export function flightById(id: string, fromCode: string, toCode: string, dateStr: string): SearchFlight | undefined {
  return searchFlights(fromCode, toCode, dateStr).find((f) => f.id === id);
}

export function popularRoutes(): { from: string; to: string; label: string }[] {
  return [
    { from: "LHR", to: "JFK", label: "London → New York" },
    { from: "CDG", to: "DXB", label: "Paris → Dubai" },
    { from: "SIN", to: "SYD", label: "Singapore → Sydney" },
    { from: "DXB", to: "SIN", label: "Dubai → Singapore" },
    { from: "JFK", to: "LAX", label: "New York → Los Angeles" },
    { from: "LHR", to: "CDG", label: "London → Paris" },
    { from: "FRA", to: "JFK", label: "Frankfurt → New York" },
    { from: "HND", to: "SFO", label: "Tokyo → San Francisco" },
  ];
}

export { distanceKm };