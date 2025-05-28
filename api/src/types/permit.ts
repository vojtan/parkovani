export interface AddPermitDto {
    validFrom: string;
    validTo: string;
    price: number;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    city: string | null;
    street: string | null;
    houseNumber: string | null;
    permitDuration: string | null;
    paymentMethod: string | null;
    carRegistration: string | null;
    userId: string | null;
    zones: any[] | null;
}


export interface PermitDto extends AddPermitDto {
    id: number,
    status: string;
    variableSymbol: string | null;
}