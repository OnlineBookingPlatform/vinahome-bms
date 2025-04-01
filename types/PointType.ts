export interface PointType {
  id: number;
  name: string | null;
  address: string | null;
  provinces_id: number | null;
  districts_id: number | null;
  wards_id: number | null;
  company_id: number;
}
export interface PointNameType {
  id: number;
  name: string;
}

export interface PointOfRouteType {
  id: number;
  name: string | null;
  time: string | null;
  display_order: number;
  point_id: number;
  route_id: number;
  company_id: number;
}
