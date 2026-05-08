export interface CreateProductDto {
    name: string;
    description: string;
    price: number;
    stock: number;
    categoryIds: string[];
}

export interface UpdateProductDto {
    name?: string;
    description?: string;
    price?: number;
    stock?: number;
}

export interface CreateProductImage {
    url: string;
    isPrimary: boolean;
}

export interface ProductFilters {
    search?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    sortBy?: "price" | "createdAt";
    sortOrder?: "asc" | "desc";
}