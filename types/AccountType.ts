export interface AccountType {
    id: number;
    username: string;
    password: string;
    status: boolean;
    name: string;
    phone: string;
    email: string;
    date_birth: null | Date;
    citizen_id: string;
    gender: number;
    role: number | null;
    license_class: string | null;
    license_expiry_date: null | Date;
    area: string;
    company_id: number;
}