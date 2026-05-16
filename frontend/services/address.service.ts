import api from "@/lib/axios";
import { ENDPOINTS } from "@/lib/endpoints";

export interface Address {
    id: string;
    street: string;
    cityId: string;
    isDefault: boolean;
    city?: {
        id: string;
        name: string;
        postCode: string;
        country: {
            id: string;
            name: string;
        };
    };
}

export interface CreateAddressDto {
    street: string;
    cityId: string;
}

export const addressService = {
    async getAddresses(): Promise<Address[]> {
        const { data } = await api.get(ENDPOINTS.users.addresses);
        return data;
    },

    async createAddress(dto: CreateAddressDto): Promise<Address> {
        const { data } = await api.post(ENDPOINTS.users.addresses, dto);
        return data;
    },
};