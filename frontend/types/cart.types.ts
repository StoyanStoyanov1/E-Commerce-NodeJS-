import {Product} from "@/types"

export interface CartItem {
    id: string;
    productId: string;
    quantity: number;
    product: Product;
}

export interface Cart {
    id: string;
    cartItems: CartItem[];
}