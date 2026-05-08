import {z} from "zod";
import {validatePhoneNumber} from "../../shared/validation/user.validation.js"

export const CreateAddressSchema = z.object({
    street: z.string().min(2).max(30),
    cityId: z.string().min(2).max(20),
});
export type CreateAddressDto = z.infer<typeof CreateAddressSchema>;

export const UpdateAddressSchema = z.object({
    street: z.string().min(2).max(30).optional(),
    cityId: z.string().min(2).max(20).optional(),
});
export type UpdateAddressDto = z.infer<typeof UpdateAddressSchema>;

export const UpdateProfileSchema = z.object({
    middleName: z.string().min(2).max(18).optional(),
    phoneNumber: validatePhoneNumber.optional(),
})
export type UpdateProfileDto = z.infer<typeof UpdateProfileSchema>;