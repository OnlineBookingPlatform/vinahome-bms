export interface VehicleType {
    id: number;
    license_plate: string | null;
    phone: string | null;
    brand: number | null;
    type: number | null;
    color: string | null;
    note: string | null;
    registration_expiry: Date | null;
    insurance_expiry: Date | null;
    status: number | null;
    company_id: number;
}