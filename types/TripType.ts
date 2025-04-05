export interface TripType {
  id: number;
  time_departure: string;
  date_departure: string;
  total_ticket: number;
  total_ticket_booking: number;
  seat_map: {
    id: number;
    name: string;
  }
  route: {
    id: number;
    name: string;
  }
}
