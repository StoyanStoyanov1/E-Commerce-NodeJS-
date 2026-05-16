"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authService } from "@/services/auth.service";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import FormField from "@/components/common/FormField";
import FormWrapper from "@/components/common/FormWrapper";

const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

interface LoginFormProps {
    onSuccess?: () => void;
}

export default function LoginForm({onSuccess}: LoginFormProps) {
    const router = useRouter();
    const { setUser } = useAuthStore();
    const [authError, setAuthError] = useState<string | null>(null);

    const form = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onSubmit",
    });

      const onSubmit = async (data: LoginForm) => {
        setAuthError(null);
        try {
            const user = await authService.loginAndGetUser(data);
            setUser(user);
            toast.success("Welcome back!");
            if (onSuccess) {
                onSuccess();
            } else {
                router.push("/");
            }
        } catch (error: any) {
            if (error.response) {
                setAuthError("Invalid email or password. Please try again.");
            } else {
                setAuthError("Cannot connect to server. Please try again later.");
            }
        }
    };

    return (
        <FormWrapper
            onSubmit={form.handleSubmit(onSubmit)}
            buttonLabel="Sign in"
            isSubmitting={form.formState.isSubmitting}
            error={authError}
            className="space-y-4"
        >
            <FormField
                name="email"
                label="Email"
                type="email"
                placeholder="you@example.com"
                control={form.control}
                showError={false}
            />
            <FormField
                name="password"
                label="Password"
                type="password"
                placeholder="••••••••"
                control={form.control}
                showError={false}
            />
        </FormWrapper>
    );
}