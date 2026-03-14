export interface Person {
    id: string;
    firstName: string;
    lastName: string;
    otherName?: string;
    phoneNumber: string;
    dateOfBirth: Date;
    address_id: string;
}

export interface CreatePersonDto {
    firstName: string;
    lastName: string;
    otherName?: string;
    phoneNumber: string;
    dateOfBirth: Date;
    address_id: string;
}