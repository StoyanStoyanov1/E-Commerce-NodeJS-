import {Product} from "@/types";

export interface Order {
    id: string;
    status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    totalPrice: number;
    createdAt: string;
    orderItems: OrderItem[];
}

export interface OrderItem {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    product: Product;
}
