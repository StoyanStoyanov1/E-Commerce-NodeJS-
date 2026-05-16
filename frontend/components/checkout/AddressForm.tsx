"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { cityService } from "@/services/city.service";
import FormWrapper from "@/components/common/FormWrapper";
import FormField from "@/components/common/FormField";

const addressSchema = z.object({
    street: z.string().min(2, "Min 2 characters").max(255, "Max 255 characters"),
    cityId: z.string().uuid("Please select a city"),
});

type AddressForm = z.infer<typeof addressSchema>;

interface AddressFormProps {
    onSubmit: (data: AddressForm) => void;
    isSubmitting: boolean;
}

export default function AddressForm({ onSubmit, isSubmitting }: AddressFormProps) {
    const { data: cities } = useQuery({
        queryKey: ["cities"],
        queryFn: () => cityService.getCities(),
    });

    const form = useForm<AddressForm>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            street: "",
            cityId: "",
        },
    });

    return (
        <FormWrapper
            onSubmit={form.handleSubmit(onSubmit)}
            buttonLabel="Use this address"
            isSubmitting={isSubmitting}
            className="space-y-4"
        >
            <FormField
                name="street"
                label="Street"
                placeholder="ул. Витоша 10"
                control={form.control}
            />

            <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <select
                    {...form.register("cityId")}
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
                >
                    <option value="">Select a city</option>
                    {cities?.map((city) => (
                        <option key={city.id} value={city.id}>
                            {city.name} — {city.country.name}
                        </option>
                    ))}
                </select>
                {form.formState.errors.cityId && (
                    <p className="text-sm text-red-500">{form.formState.errors.cityId.message}</p>
                )}
            </div>
        </FormWrapper>
    );
}