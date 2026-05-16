import { z } from "zod";

export const CreateCitySchema = z.object({
    name: z.string().min(2).max(255),
    postCode: z.string().min(2).max(255).optional(),
    countryId: z.string().uuid(),
});

export type CreateCityDto = z.infer<typeof CreateCitySchema>;

export const CreateCountrySchema = z.object({
    name: z.string().min(2).max(255),
});

export type CreateCountryDto = z.infer<typeof CreateCountrySchema>;