"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuthStore from "@/store/authStore";
import CreateProductForm from "@/components/products/CreateProductForm";

export default function CreateProductPage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }
        if (user?.role !== "SELLER" && user?.role !== "ADMIN") {
            router.push("/products");
        }
    }, [isAuthenticated, user, router]);

    if (!isAuthenticated || (user?.role !== "SELLER" && user?.role !== "ADMIN")) {
        return null;
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">Create Product</h1>
            <CreateProductForm />
        </div>
    );
}