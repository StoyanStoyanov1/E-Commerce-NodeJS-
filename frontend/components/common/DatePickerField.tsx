"use client";

import { useState } from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerFieldProps<T extends FieldValues> {
    name: Path<T>;
    label: string;
    control: Control<T>;
}

export default function DatePickerField<T extends FieldValues>({
    name,
    label,
    control,
}: DatePickerFieldProps<T>) {
    const [open, setOpen] = useState(false);

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>{label}</FieldLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? field.value : "DD-MM-YYYY"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={
                                    field.value
                                        ? new Date(
                                              field.value.split("-").reverse().join("-")
                                          )
                                        : undefined
                                }
                                onSelect={(date) => {
                                    if (date) {
                                        field.onChange(format(date, "dd-MM-yyyy"));
                                    }
                                    setOpen(false);
                                }}
                                disabled={(date) => date > new Date()}
                                captionLayout="dropdown"
                                fromYear={1900}
                                toYear={new Date().getFullYear()}
                            />
                        </PopoverContent>
                    </Popover>
                    {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                    )}
                </Field>
            )}
        />
    );
}