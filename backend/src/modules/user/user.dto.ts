export interface UpdateProfileDto {
    middleName?: string;
    phoneNumber?: string;
}

export interface CreateAddressDto {
    street: string;
    cityId: string;
}

export interface UpdateAddressDto {
    street?: string;
    cityId?: string;
}