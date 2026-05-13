export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: "ADMIN" | "CUSTOMER" | "MODERATOR";
    isAktiv: boolean;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    sellerId: string;
    images: ProductImage[];
    categories: Category[];
}

export interface ProductImage {
    id: string;
    url: string;
    isPrimary: boolean;
}

export interface Category {
    id: string;
    name: string;
    parentId: string | null;
}

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

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}