import {z} from "zod";

export const AddCartSchema = z.object({
    productId: z.string(),
    quantity: z.number().positive(),
});

export const UpdateCartSchema = z.object({
    quantity: z.number().int().positive(),
})