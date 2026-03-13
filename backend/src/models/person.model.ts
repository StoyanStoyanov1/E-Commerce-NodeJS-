import {Address} from "node:cluster";

export interface Person {
    id: bigint;
    firstName: string;
    lastName: string;
    anotherName: string;
    phone: string;
    dateOfBirth: Date;
    address: Address;
}

export interface CreatePersonDto extends Person {
    firstName: string;
    lastName: string;
    anotherName?: string;
    phone: string;
    dateOfBirth: Date;
    address: Address;
}