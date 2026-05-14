export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    birthday: string;
}

export interface LoginDto {
    email: string;
    password: string;
}