import {z} from 'zod';

export const CreateProductSchema = z.object({
    name: z.string().min(2).max(100),
    description: z.string().min(2).max(1000),
    price: z.number().positive(),
    stock: z.number().int().nonnegative(),
    categoryIds: z.array(z.string()).min(1)
});

export const UpdateProductSchema = z.object({
    name: z.string().min(2).max(100),
    description: z.string().min(2).max(1000),
    price: z.number().positive(),
    stock: z.number().int().nonnegative(),
}).partial();

export const CreateProductImageSchema = z.object({
    url: z.string().min(2).max(100),
    isPrimary: z.boolean(),
})