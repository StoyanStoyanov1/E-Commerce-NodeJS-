import {z} from "zod";
import type {Category} from "@prisma/client"

export const CreateCategorySchema = z.object({
    name: z.string().min(2).max(20),
    parentId: z.string().optional(),
});
export type CreateCategoryDto = z.infer<typeof CreateCategorySchema>;

export const UpdateCategorySchema = z.object({
    name: z.string().min(2).max(20).optional(),
    parentId: z.string().optional(),
})
export type UpdateCategoryDto = z.infer<typeof UpdateCategorySchema>;
