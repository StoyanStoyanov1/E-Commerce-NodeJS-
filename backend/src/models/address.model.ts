export interface Address {
    id: number;
    street: string;
    number: string;
    post: string;
    city: string;
}

export interface CreateAddressDto {
    street: string;
    number: string;
    post: string;
    city: string;
}