export interface RegisterDto {
    email: string;
    password: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    phoneNumber: string;
    birthDate: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface RefreshTokenDto {
    refreshToken: string;
}

export interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}

export interface ForgotPasswordDto {
    email: string;
}

export interface ResetPasswordDto {
    token: string;
    newPassword: string;
}