"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { productService } from "@/services/product.service";
import { cartService } from "@/services/cart.service";
import ProductImages from "@/components/products/ProductImages";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import useAuthStore from "@/store/authStore";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { isAuthenticated } = useAuthStore();

    const { data: product, isLoading } = useQuery({
        queryKey: ["products", id],
        queryFn: () => productService.getById(id),
    });

    const { mutate: addToCart, isPending } = useMutation({
        mutationFn: () => cartService.addItem(id, 1),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            toast.success("Added to cart!");
        },
        onError: () => {
            toast.error("Failed to add to cart.");
        },
    });

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }
        addToCart();
    };

    if (isLoading) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <Skeleton className="aspect-square rounded-xl" />
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8 text-center">
                <p className="text-muted-foreground">Product not found.</p>
                <Link href="/products">
                    <Button variant="ghost" className="mt-4">Back to products</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <Link href="/products">
                <Button variant="ghost" size="sm" className="mb-6 cursor-pointer">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to products
                </Button>
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <ProductImages images={product.images} name={product.name} />

                <div className="space-y-4">
                    <h1 className="text-3xl font-semibold">{product.name}</h1>

                    <p className="text-muted-foreground">{product.description}</p>

                    {product.categories?.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                            {product.categories.map((cat) => (
                                <span
                                    key={cat.id}
                                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                                >
                                    {cat.name}
                                </span>
                            ))}
                        </div>
                    )}

                    <p className="text-2xl font-bold">${product.price}</p>

                    <p className={`text-sm ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                        {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </p>

                    <Button
                        className="w-full cursor-pointer"
                        disabled={isPending || product.stock === 0}
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {isPending ? "Adding..." : "Add to cart"}
                    </Button>
                </div>
            </div>
        </div>
    );
}