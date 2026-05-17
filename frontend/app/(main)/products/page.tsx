"use client";

import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import ProductCard from "@/components/products/ProductCart";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductsPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["products"],
        queryFn: () => productService.getAll(),
    });

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="rounded-[28px] border border-border bg-white shadow-sm overflow-hidden">
                            <Skeleton className="aspect-square" />
                            <div className="p-4 space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-4 w-1/4" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="rounded-[28px] border border-border bg-white p-10 text-center shadow-sm">
                    <p className="text-red-500">Failed to load products.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="mb-8 rounded-[32px] border border-border bg-white p-8 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-slate-950">Products</h1>
                        <p className="text-sm text-slate-600 mt-2">Browse our latest catalog with premium visuals and crisp product cards.</p>
                    </div>
                </div>
            </div>

            {data?.data.length === 0 ? (
                <div className="rounded-[28px] border border-border bg-white p-10 text-center shadow-sm">
                    <p className="text-muted-foreground">No products found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {data?.data.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}