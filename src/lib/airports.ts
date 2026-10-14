export type Airport = {
  code: string;
  city: string;
  country: string;
  tz: string;
};

/* Major international airports — IATA code, city, country, IANA timezone */
export const AIRPORTS: Airport[] = [
  { code: "LHR", city: "London", country: "United Kingdom", tz: "Europe/London" },
  { code: "LGW", city: "London", country: "United Kingdom", tz: "Europe/London" },
  { code: "CDG", city: "Paris", country: "France", tz: "Europe/Paris" },
  { code: "AMS", city: "Amsterdam", country: "Netherlands", tz: "Europe/Amsterdam" },
  { code: "FRA", city: "Frankfurt", country: "Germany", tz: "Europe/Berlin" },
  { code: "MUC", city: "Munich", country: "Germany", tz: "Europe/Berlin" },
  { code: "MAD", city: "Madrid", country: "Spain", tz: "Europe/Madrid" },
  { code: "BCN", city: "Barcelona", country: "Spain", tz: "Europe/Madrid" },
  { code: "FCO", city: "Rome", country: "Italy", tz: "Europe/Rome" },
  { code: "MXP", city: "Milan", country: "Italy", tz: "Europe/Rome" },
  { code: "ZRH", city: "Zurich", country: "Switzerland", tz: "Europe/Zurich" },
  { code: "GVA", city: "Geneva", country: "Switzerland", tz: "Europe/Zurich" },
  { code: "VIE", city: "Vienna", country: "Austria", tz: "Europe/Vienna" },
  { code: "BRU", city: "Brussels", country: "Belgium", tz: "Europe/Brussels" },
  { code: "DUB", city: "Dublin", country: "Ireland", tz: "Europe/Dublin" },
  { code: "LIS", city: "Lisbon", country: "Portugal", tz: "Europe/Lisbon" },
  { code: "ATH", city: "Athens", country: "Greece", tz: "Europe/Athens" },
  { code: "IST", city: "Istanbul", country: "Turkey", tz: "Europe/Istanbul" },
  { code: "CPH", city: "Copenhagen", country: "Denmark", tz: "Europe/Copenhagen" },
  { code: "ARN", city: "Stockholm", country: "Sweden", tz: "Europe/Stockholm" },
  { code: "OSL", city: "Oslo", country: "Norway", tz: "Europe/Oslo" },
  { code: "HEL", city: "Helsinki", country: "Finland", tz: "Europe/Helsinki" },
  { code: "WAW", city: "Warsaw", country: "Poland", tz: "Europe/Warsaw" },
  { code: "PRG", city: "Prague", country: "Czechia", tz: "Europe/Prague" },
  { code: "BUD", city: "Budapest", country: "Hungary", tz: "Europe/Budapest" },
  { code: "SOF", city: "Sofia", country: "Bulgaria", tz: "Europe/Sofia" },
  { code: "JFK", city: "New York", country: "United States", tz: "America/New_York" },
  { code: "EWR", city: "New York", country: "United States", tz: "America/New_York" },
  { code: "ORD", city: "Chicago", country: "United States", tz: "America/Chicago" },
  { code: "ATL", city: "Atlanta", country: "United States", tz: "America/New_York" },
  { code: "MIA", city: "Miami", country: "United States", tz: "America/New_York" },
  { code: "LAX", city: "Los Angeles", country: "United States", tz: "America/Los_Angeles" },
  { code: "SFO", city: "San Francisco", country: "United States", tz: "America/Los_Angeles" },
  { code: "SEA", city: "Seattle", country: "United States", tz: "America/Los_Angeles" },
  { code: "DFW", city: "Dallas", country: "United States", tz: "America/Chicago" },
  { code: "IAH", city: "Houston", country: "United States", tz: "America/Chicago" },
  { code: "BOS", city: "Boston", country: "United States", tz: "America/New_York" },
  { code: "YYZ", city: "Toronto", country: "Canada", tz: "America/Toronto" },
  { code: "YUL", city: "Montreal", country: "Canada", tz: "America/Toronto" },
  { code: "YVR", city: "Vancouver", country: "Canada", tz: "America/Vancouver" },
  { code: "MEX", city: "Mexico City", country: "Mexico", tz: "America/Mexico_City" },
  { code: "CUN", city: "Cancun", country: "Mexico", tz: "America/Cancun" },
  { code: "GRU", city: "Sao Paulo", country: "Brazil", tz: "America/Sao_Paulo" },
  { code: "GIG", city: "Rio de Janeiro", country: "Brazil", tz: "America/Sao_Paulo" },
  { code: "EZE", city: "Buenos Aires", country: "Argentina", tz: "America/Argentina/Buenos_Aires" },
  { code: "SCL", city: "Santiago", country: "Chile", tz: "America/Santiago" },
  { code: "BOG", city: "Bogota", country: "Colombia", tz: "America/Bogota" },
  { code: "LIM", city: "Lima", country: "Peru", tz: "America/Lima" },
  { code: "PTY", city: "Panama City", country: "Panama", tz: "America/Panama" },
  { code: "DXB", city: "Dubai", country: "United Arab Emirates", tz: "Asia/Dubai" },
  { code: "AUH", city: "Abu Dhabi", country: "United Arab Emirates", tz: "Asia/Dubai" },
  { code: "DOH", city: "Doha", country: "Qatar", tz: "Asia/Qatar" },
  { code: "JED", city: "Jeddah", country: "Saudi Arabia", tz: "Asia/Riyadh" },
  { code: "RUH", city: "Riyadh", country: "Saudi Arabia", tz: "Asia/Riyadh" },
  { code: "KWI", city: "Kuwait City", country: "Kuwait", tz: "Asia/Kuwait" },
  { code: "BAH", city: "Bahrain", country: "Bahrain", tz: "Asia/Bahrain" },
  { code: "TLV", city: "Tel Aviv", country: "Israel", tz: "Asia/Jerusalem" },
  { code: "DEL", city: "Delhi", country: "India", tz: "Asia/Kolkata" },
  { code: "BOM", city: "Mumbai", country: "India", tz: "Asia/Kolkata" },
  { code: "BLR", city: "Bengaluru", country: "India", tz: "Asia/Kolkata" },
  { code: "MAA", city: "Chennai", country: "India", tz: "Asia/Kolkata" },
  { code: "DAC", city: "Dhaka", country: "Bangladesh", tz: "Asia/Dhaka" },
  { code: "KUL", city: "Kuala Lumpur", country: "Malaysia", tz: "Asia/Kuala_Lumpur" },
  { code: "SIN", city: "Singapore", country: "Singapore", tz: "Asia/Singapore" },
  { code: "CGK", city: "Jakarta", country: "Indonesia", tz: "Asia/Jakarta" },
  { code: "BKK", city: "Bangkok", country: "Thailand", tz: "Asia/Bangkok" },
  { code: "HKT", city: "Phuket", country: "Thailand", tz: "Asia/Bangkok" },
  { code: "MNL", city: "Manila", country: "Philippines", tz: "Asia/Manila" },
  { code: "SGN", city: "Ho Chi Minh City", country: "Vietnam", tz: "Asia/Ho_Chi_Minh" },
  { code: "HAN", city: "Hanoi", country: "Vietnam", tz: "Asia/Bangkok" },
  { code: "HKG", city: "Hong Kong", country: "Hong Kong", tz: "Asia/Hong_Kong" },
  { code: "PVG", city: "Shanghai", country: "China", tz: "Asia/Shanghai" },
  { code: "PEK", city: "Beijing", country: "China", tz: "Asia/Shanghai" },
  { code: "CAN", city: "Guangzhou", country: "China", tz: "Asia/Shanghai" },
  { code: "SZX", city: "Shenzhen", country: "China", tz: "Asia/Shanghai" },
  { code: "ICN", city: "Seoul", country: "South Korea", tz: "Asia/Seoul" },
  { code: "NRT", city: "Tokyo", country: "Japan", tz: "Asia/Tokyo" },
  { code: "HND", city: "Tokyo", country: "Japan", tz: "Asia/Tokyo" },
  { code: "KIX", city: "Osaka", country: "Japan", tz: "Asia/Tokyo" },
  { code: "TPE", city: "Taipei", country: "Taiwan", tz: "Asia/Taipei" },
  { code: "SYD", city: "Sydney", country: "Australia", tz: "Australia/Sydney" },
  { code: "MEL", city: "Melbourne", country: "Australia", tz: "Australia/Melbourne" },
  { code: "BNE", city: "Brisbane", country: "Australia", tz: "Australia/Brisbane" },
  { code: "PER", city: "Perth", country: "Australia", tz: "Australia/Perth" },
  { code: "AKL", city: "Auckland", country: "New Zealand", tz: "Pacific/Auckland" },
];

export function findAirport(code: string): Airport | undefined {
  return AIRPORTS.find((a) => a.code === code.toUpperCase());
}

export function searchAirports(q: string): Airport[] {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  return AIRPORTS.filter(
    (a) =>
      a.code.toLowerCase().includes(s) ||
      a.city.toLowerCase().includes(s) ||
      a.country.toLowerCase().includes(s)
  ).slice(0, 8);
}