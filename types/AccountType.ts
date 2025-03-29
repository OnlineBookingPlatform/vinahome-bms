export interface AccountType {
    _id: string;
    username: string | null;
    password: string | null;
    status: boolean;
    name: string | null;
    phone: string | null;
    email: string | null;
    date_birth: null | Date;
    citizen_id: string | null;
    note: string | null;
    gender: number | null;
    role: number | null;
    license_class: string | null;
    license_expiry_date: null | Date;
    area: string | null;
    company_id: number;
}
