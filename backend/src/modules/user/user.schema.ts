import {z} from "zod";
import {validatePhoneNumber} from "../../shared/validation/user.validation.js"

export const CreateAddressSchema = z.object({
    street: z.string().min(2).max(30),
    cityId: z.string().min(2).max(20),
});

export const UpdateAddressSchema = z.object({
    street: z.string().min(2).max(30).optional(),
    cityId: z.string().min(2).max(20).optional(),
});

export const UpdateProfileSchema = z.object({
    middleName: z.string().min(2).max(18).optional(),
    phoneNumber: validatePhoneNumber.optional(),
})