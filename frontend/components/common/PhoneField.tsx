"use client";

import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

interface PhoneFieldProps<T extends FieldValues> {
    name: Path<T>;
    label: string;
    placeholder?: string;
    control: Control<T>;
}

export default function PhoneField<T extends FieldValues>({
    name,
    label,
    placeholder,
    control,
}: PhoneFieldProps<T>) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>{label}</FieldLabel>
                    <Input
                        {...field}
                        maxLength={16}
                        placeholder={placeholder}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^\+?\d*$/.test(value)) {
                                field.onChange(value);
                            }
                        }}
                    />
                    {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                    )}
                </Field>
            )}
        />
    );
}