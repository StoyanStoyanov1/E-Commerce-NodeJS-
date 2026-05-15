import api from "@/lib/axios";
import { ENDPOINTS } from "@/lib/endpoints";
import { Cart } from "@/types/cart.types";

export const cartService = {
    async getCart(): Promise<Cart> {
        const response = await api.get(ENDPOINTS.cart.base);
        return response.data;
    },
    async addItem(productId: string, quantity: number): Promise<void> {
        await api.post(ENDPOINTS.cart.items, { productId, quantity });
    },
    async updateItem(itemId: string, quantity: number): Promise<void> {
        await api.put(`${ENDPOINTS.cart.items}/${itemId}`, { quantity });
    },
    
    async removeItem(itemId: string): Promise<void> {
        await api.delete(`${ENDPOINTS.cart.items}/${itemId}`);
    },

    async clearCart(): Promise<void> {
        await api.delete(`${ENDPOINTS.cart.base}/clear`);
    },
};