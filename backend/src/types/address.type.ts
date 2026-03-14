export interface Address {
    id: string;
    street: string;
    number: string;
    zipCode: string;
    city: string;
    county: string;
}

export interface CreateAddressDto {
    street: string;
    number: string;
    zipCode: string;
    city: string;
    county: string;
}