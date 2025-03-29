export interface OfficeType {
  id: number;
  name: string | null;
  code: string | null;
  address: string | null;
  company_id: number;
  type_ticket: boolean;
  type_goods: boolean;
  phone_ticket: string | null;
  phone_goods: string | null;
  note: string | null;
}
