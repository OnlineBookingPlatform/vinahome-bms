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
