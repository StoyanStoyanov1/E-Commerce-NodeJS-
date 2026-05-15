"use client";

import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Info } from "lucide-react";

interface FormFieldProps<T extends FieldValues> {
    name: Path<T>;
    label: string;
    type?: string;
    placeholder?: string;
    control: Control<T>;
    info?: string;
    showError?: boolean;
    min?: number;
    hideArrows?: boolean;
}

export default function FormField<T extends FieldValues>({
    name,
    label,
    type = "text",
    placeholder,
    control,
    info,
    showError = true,
    min,
    hideArrows,
}: FormFieldProps<T>) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center gap-1.5">
                        <FieldLabel htmlFor={name}>{label}</FieldLabel>
                        {info && (
                            <div className="group relative">
                                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-10">
                                    <div className="bg-popover text-popover-foreground text-xs rounded-md px-3 py-2 shadow-md border w-48">
                                        {info}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                   <Input
                        {...field}
                        id={name}
                        type={type}
                        placeholder={placeholder}
                        min={min}
                        aria-invalid={fieldState.invalid}
                       onChange={(e) => {
    const value = e.target.value;
    if (type === "number" && min !== undefined) {
        const cleaned = value.replace(/[^0-9]/g, "");
        const num = cleaned === "" ? min : Number(cleaned);
        field.onChange(num);
        e.target.value = String(num === 0 ? "" : num);
    } else {
        field.onChange(value);
    }
}}
                        onKeyDown={(e) => {
                            if (hideArrows && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
                                e.preventDefault();
                            }
                        }}
                        onWheel={(e) => {
                            if (hideArrows) e.currentTarget.blur();
                        }}
                    />
                    {showError && fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                    )}
                </Field>
            )}
        />
    );
}