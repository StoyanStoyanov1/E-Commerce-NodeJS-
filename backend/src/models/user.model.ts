import {Person} from './person.model.ts';
export enum Role {
    USER = "USER",
    ADMIN = "ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN"
}

export interface User {
    id: bigint;
    email: string;
    role: Role;
    person: Person;
    isVerified: boolean;
    verifiedAt?: Date;
    password: string;
}

export interface CreateUserDto {
    email: string;
    role: Role;
    person: Person;
    isVerified: boolean;
    verifiedAt?: Date;
    password: string;
}