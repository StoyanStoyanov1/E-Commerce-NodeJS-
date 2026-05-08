import {z} from "zod";

export const AddCartSchema = z.object({
    productId: z.string(),
    quantity: z.number().positive(),
});
export type AddCartItemDTO = z.infer<typeof AddCartSchema>;

export const UpdateCartSchema = z.object({
    quantity: z.number().int().positive(),
})
export type UpdateCartItemDTO = z.infer<typeof UpdateCartSchema>;