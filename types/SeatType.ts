export interface SeatMap {
  id: number;
  name: string;
  total_floor: number;
  total_column: number;
  total_row: number;
  seats: Seat[];
}

export interface Seat {
  id: number;
  column: number;
  row: number;
  floor: number;
  code: string;
  status: boolean;
  name: string;
}
