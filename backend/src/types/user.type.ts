
export enum Role {
    USER = "USER",
    ADMIN = "ADMIN",
    SUPER_ADMIN = "SUPER_ADMIN"
}

export interface User {
    id: string;
    email: string;
    role: Role;
    person_id: string;
    isVerified: boolean;
    verifiedAt?: Date;
    password: string;
}

export interface CreateUserDto {
    email: string;
    password: string;
    person_id: string;
    role: Role;
}