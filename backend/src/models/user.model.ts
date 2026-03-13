import {CreatePersonDto, Person} from "./person.model";

export enum Role {
    USER = "USER",
    ADMIN = "ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN"
}

export interface User {
    id: number;
    email: string;
    role: Role;
    person: Person;
    isVerified: boolean;
    verifiedAt?: Date;
    passwordHash: string;
}

export interface CreateUserDto {
    email: string;
    password: string;
    person: CreatePersonDto;
    role: Role;
}