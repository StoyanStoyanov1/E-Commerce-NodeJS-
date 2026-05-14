"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import FormField from "@/components/common/FormField";
import FormWrapper from "@/components/common/FormWrapper";
import DatePickerField from "@/components/common/DatePickerField";
import PhoneField from "@/components/common/PhoneField";



const registerSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[0-9]/, "Must contain at least one number")
        .regex(/[!@#$%^&*]/, "Must contain at least one special character"),
    firstName: z.string().min(2, "Min 2 characters").max(18, "Max 18 characters"),
    lastName: z.string().min(2, "Min 2 characters").max(18, "Max 18 characters"),
   phoneNumber: z.string()
    .regex(/^\+?\d{7,15}$/, "Phone must be 7-15 digits, optionally starting with +"),
    birthday: z.string().regex(/^\d{2}-\d{2}-\d{4}$/, "Format must be DD-MM-YYYY"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterForm() {
    const router = useRouter();
    const [authError, setAuthError] = useState<string | null>(null);

    const form = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            birthday: "",
        },
        mode: "onSubmit",
    });

    const onSubmit = async (data: RegisterForm) => {
        setAuthError(null);
        try {
            await authService.register(data);
            toast.success("Account created! Please verify your email.");
            router.push("/login");
        } catch (error: any) {
            if (error.response?.status === 409) {
                setAuthError("Email already exists.");
            } else {
                setAuthError("Something went wrong. Please try again.");
            }
        }
    };

    return (
        <FormWrapper
            onSubmit={form.handleSubmit(onSubmit)}
            buttonLabel="Sign up"
            isSubmitting={form.formState.isSubmitting}
            error={authError}
            className="space-y-4"
        >
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    name="firstName"
                    label="First name"
                    placeholder="John"
                    control={form.control}
                    info="Between 2 and 18 characters"
                />
                <FormField
                    name="lastName"
                    label="Last name"
                    placeholder="Doe"
                    control={form.control}
                    info="Between 2 and 18 characters"
                />
            </div>

            <FormField
                name="email"
                label="Email"
                type="email"
                placeholder="you@example.com"
                control={form.control}
                info="Must be a valid email address"
            />

            <FormField
                name="password"
                label="Password"
                type="password"
                placeholder="••••••••"
                control={form.control}
                info="Min 8 chars, uppercase, number and special character"
            />

           <PhoneField
                name="phoneNumber"
                label="Phone number"
                placeholder="+359888123456"
                control={form.control}
            />

            <DatePickerField
                 name="birthday"
                label="Birthday"
                control={form.control}
            />

            <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-medium underline">
                    Sign in
                </Link>
            </p>
        </FormWrapper>
    );
}