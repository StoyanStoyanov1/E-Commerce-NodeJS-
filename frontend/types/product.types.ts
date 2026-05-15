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

export interface CreateProductDto {
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryIds: string[];
}