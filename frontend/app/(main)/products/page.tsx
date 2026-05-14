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
                        <div key={i} className="border rounded-xl overflow-hidden">
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
            <div className="max-w-6xl mx-auto px-4 py-8 text-center">
                <p className="text-red-500">Failed to load products.</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">Products</h1>
            {data?.data.length === 0 ? (
                <p className="text-muted-foreground text-center">No products found.</p>
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