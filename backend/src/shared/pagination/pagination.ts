export interface PaginationQuery {
    page?: number;
    limit?: number;
}

export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export const paginate = (page = 1, limit = 10) => {
    const take = limit;
    const skip = (page - 1) * limit;
    return {take, skip}
}