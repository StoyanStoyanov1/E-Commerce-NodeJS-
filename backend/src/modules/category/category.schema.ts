import {z} from "zod";

export const CreateCategorySchema = z.object({
    name: z.string().min(2).max(20),
    parentId: z.string().optional(),
});

export const UpdateCategorySchema = z.object({
    name: z.string().min(2).max(20).optional(),
    parentId: z.string().optional(),
})