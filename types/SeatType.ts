export interface SeatMapType {
  id: number;
  name: string | null;
  total_floor: number;
  total_column: number;
  total_row: number;
  seats: SeatType[];
  company_id: number;
}

export interface SeatType {
  id: number;
  column: number;
  row: number;
  floor: number;
  code: string;
  status: boolean;
  name: string;
}

export interface SeatMapNameType {
  id: number;
  name: string;
}
