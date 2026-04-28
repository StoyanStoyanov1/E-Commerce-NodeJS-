export interface CreateCategoryDto {
    name: string;
    parentId?: string;
}

export interface UpdateCategoryDto {
    name?: string;
    parentId?: string;
}