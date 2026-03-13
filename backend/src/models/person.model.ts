import {Address, CreateAddressDto} from "./address.model";

export interface Person {
    id: number;
    firstName: string;
    lastName: string;
    anotherName?: string;
    phone: string;
    dateOfBirth: Date;
    address: Address;
}

export interface CreatePersonDto {
    firstName: string;
    lastName: string;
    anotherName?: string;
    phone: string;
    dateOfBirth: Date;
    address: CreateAddressDto;
}