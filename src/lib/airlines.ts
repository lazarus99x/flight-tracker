export type Airline = {
  code: string;
  name: string;
  color: string;
};

/* Major international airlines — IATA code, name, brand color */
export const AIRLINES: Airline[] = [
  { code: "EK", name: "Emirates", color: "#D71921" },
  { code: "QR", name: "Qatar Airways", color: "#5C0632" },
  { code: "BA", name: "British Airways", color: "#075AAA" },
  { code: "LH", name: "Lufthansa", color: "#05164D" },
  { code: "AF", name: "Air France", color: "#002157" },
  { code: "KL", name: "KLM", color: "#00A1DE" },
  { code: "TK", name: "Turkish Airlines", color: "#E8192C" },
  { code: "VS", name: "Virgin Atlantic", color: "#D8202A" },
  { code: "EY", name: "Etihad Airways", color: "#BD8B13" },
  { code: "SQ", name: "Singapore Airlines", color: "#F0AB00" },
  { code: "CX", name: "Cathay Pacific", color: "#00605D" },
  { code: "JL", name: "Japan Airlines", color: "#C9202C" },
  { code: "NH", name: "ANA", color: "#011D41" },
  { code: "KE", name: "Korean Air", color: "#005697" },
  { code: "UA", name: "United Airlines", color: "#002244" },
  { code: "AA", name: "American Airlines", color: "#0078D2" },
  { code: "DL", name: "Delta Air Lines", color: "#003366" },
  { code: "AC", name: "Air Canada", color: "#D71921" },
  { code: "IB", name: "Iberia", color: "#D71920" },
  { code: "TP", name: "TAP Air Portugal", color: "#005A9C" },
  { code: "LX", name: "SWISS", color: "#C8102E" },
  { code: "OS", name: "Austrian Airlines", color: "#E41E2A" },
  { code: "SN", name: "Brussels Airlines", color: "#00A1DE" },
  { code: "SK", name: "SAS", color: "#00205B" },
  { code: "AY", name: "Finnair", color: "#0061AA" },
  { code: "EI", name: "Aer Lingus", color: "#00846B" },
  { code: "W6", name: "Wizz Air", color: "#C6007E" },
  { code: "FR", name: "Ryanair", color: "#073590" },
  { code: "U2", name: "easyJet", color: "#FF6600" },
  { code: "Q2", name: "DHL Air", color: "#FFCC00" },
];

export function airlineByCode(code: string): Airline | undefined {
  return AIRLINES.find((a) => a.code === code);
}