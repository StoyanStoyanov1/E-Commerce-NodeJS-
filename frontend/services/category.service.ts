import api from "@/lib/axios";
import { ENDPOINTS } from "@/lib/endpoints";
import { Category } from "@/types";

export const categoryService = {
    async getAll(): Promise<Category[]> {
        const { data } = await api.get(ENDPOINTS.categories);
        return data.data;
    },
};