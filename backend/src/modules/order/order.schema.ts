import {z} from 'zod';

export const CreateOrderSchema = z.object({
    addressId: z.string(),
});