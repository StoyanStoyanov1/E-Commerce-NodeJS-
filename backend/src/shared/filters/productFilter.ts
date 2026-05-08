import type {ProductFilters} from "../../modules/product/product.dto.js";

export default function productFilter(filters: ProductFilters ) {
    const where : ProductFilters = {};

    if (filters.search) where.name = {contains: filters.search, mode: "insensitive"};

    if (filters.categoryId) where.categories = {some: {categoryId: filters.categoryId}};

    if (filters.minPrice || filters.maxPrice) {
        where.price = {};
        if (filters.minPrice) where.price.gte = filters.minPrice;
        if (filters.maxPrice) where.price.lte = filters.maxPrice;
    }

    if (filters.inStock) where.stock = {gt: 0};

    return where;
}