import api from "@/lib/axios";
import { ENDPOINTS } from "@/lib/endpoints";
import { Order } from "@/types/order.types";

export interface City {
    id: string;
    name: string;
    postCode: string | null;
    country: {
        id: string;
        name: string;
    };
}

export interface Country {
    id: string;
    name: string;
    cities: City[];
}

export const cityService = {
    async getCities(): Promise<City[]> {
        const { data } = await api.get("/cities");
        return data;
    },

    async getCountries(): Promise<Country[]> {
        const { data } = await api.get("/cities/countries/all");
        return data;
    },
    async createOrder(addressId: string): Promise<Order> {
        const { data } = await api.post(ENDPOINTS.orders, { addressId });
        return data;
    },
};