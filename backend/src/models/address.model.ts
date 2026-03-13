export interface Address {
    id: number;
    street: string;
    number: bigint;
    post: bigint;
    city: string;
}

export interface CreateAddressDto {
    street: string;
    number: bigint;
    post: bigint;
    city: string;
}