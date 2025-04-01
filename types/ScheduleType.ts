export interface ScheduleType {
  id: number;
  route_id: number | null;
  route_name: string | null;
  seat_map_id: number | null;
  seat_map_name: string | null;
  start_date: Date | null;
  end_date: Date | null;
  start_time: string | null;
  is_end_date_set: boolean;
  company_id: number;
}