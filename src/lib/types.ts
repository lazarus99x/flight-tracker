export type FlightStatus =
  | "scheduled"
  | "boarding"
  | "departed"
  | "in_air"
  | "landed"
  | "delayed"
  | "cancelled";

export type TicketVia = {
  code: string;
  city: string;
  arriveAt: string;
  departAt: string;
  flightNumber?: string;
};

export type Ticket = {
  id: string;
  pnr: string;
  flightId: string;
  flightNumber: string;
  airline: string;
  airlineCode: string;
  fromCode: string;
  fromCity: string;
  toCode: string;
  toCity: string;
  departAt: string;
  arriveAt: string;
  via?: TicketVia;
  passengerName: string;
  passengerEmail: string;
  passengerPhone?: string;
  seat?: string;
  cabin: string;
  fare: number;
  status: "confirmed" | "checked_in" | "boarded" | "flown" | "cancelled";
  issuedAt: string;
};

export const STATUS_LABEL: Record<FlightStatus, string> = {
  scheduled: "Scheduled",
  boarding: "Boarding",
  departed: "Departed",
  in_air: "In Air",
  landed: "Landed",
  delayed: "Delayed",
  cancelled: "Cancelled",
};

export const CABINS = ["Economy", "Premium Economy", "Business", "First"];