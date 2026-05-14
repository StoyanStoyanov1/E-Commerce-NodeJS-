import api from "@/lib/axios";
import { ENDPOINTS } from "@/lib/endpoints";
import { Product, PaginatedResponse } from "@/types";

export interface ProductFilters {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
}

export const productService = {
    async getAll(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
        const params = new URLSearchParams();
        if (filters.page) params.append("page", String(filters.page));
        if (filters.limit) params.append("limit", String(filters.limit));
        if (filters.search) params.append("search", filters.search);
        if (filters.categoryId) params.append("categoryId", filters.categoryId);
        if (filters.minPrice) params.append("minPrice", String(filters.minPrice));
        if (filters.maxPrice) params.append("maxPrice", String(filters.maxPrice));

        const { data } = await api.get(`${ENDPOINTS.products}?${params.toString()}`);
        return data;
    },

    async getById(id: string): Promise<Product> {
        const { data } = await api.get(`${ENDPOINTS.products}/${id}`);
        return data;
    },
};