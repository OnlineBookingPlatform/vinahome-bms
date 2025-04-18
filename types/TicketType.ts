export interface TicketType {
  id: number;
  seat_name: string;
  seat_code: string;
  seat_floor: number;
  seat_row: number;
  seat_column: number;
  seat_status: boolean;
  status_booking_ticket: boolean;
  base_price: number;
  passenger_name: string;
  passenger_phone: string;
  point_up: string;
  point_down: string;
  ticket_note: string;
}
export interface BookingForm {
  passenger_phone: string | null;
  passenger_name: string | null;
  email: string | null;
  point_up: string | null;
  point_down: string | null;
  note: string | null;
  birth_date: Date | string | null;
  gender: number | null;
  
  payment_method: number;
  amount_received: number | null;
  
  selectedTickets: {
    id: number;
    seat_name: string;
  }[];
}
