"use client";

import { useState } from "react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import ProductImages from "./ProductImages";

interface ProductDetailProps {
    product: Product;
    onAddToCart: (quantity: number) => void;
    isPending: boolean;
}

export default function ProductDetail({ product, onAddToCart, isPending }: ProductDetailProps) {
    const [quantity, setQuantity] = useState(1);
    const currency = product.currency === "USD" ? "$" : "€";
    const increment = () => {
    if (quantity < product.stock) setQuantity(q => q + 1);
};

    const decrement = () => {
        if (quantity > 1) setQuantity(q => q - 1);
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
    if (isNaN(value) || value < 1) {
        setQuantity(1);
    } else if (value > product.stock) {
        setQuantity(product.stock);
    } else {
        setQuantity(value);
    }
    };  

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <ProductImages images={product.images} name={product.name} />

            <div className="space-y-4">
                <h1 className="text-3xl font-semibold">{product.name}</h1>

                <p className="text-muted-foreground">{product.description}</p>

                {product.categories?.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                        {product.categories.map((cat: any) => (
                            <span
                                key={cat.category?.id || cat.categoryId}
                                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                            >
                                {cat.category?.name}
                            </span>
                        ))}
                    </div>
                )}

                <p className="text-2xl font-bold">
                    {currency}{Number(product.price).toFixed(2)}
                </p>

                <p className={`text-sm ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </p>

               {product.stock > 0 && (
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={decrement}
                        disabled={quantity <= 1}
                        className="cursor-pointer"
                    >
                        <Minus className="h-4 w-4" />
                    </Button>
                    <input
                        type="number"
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="w-16 text-center border rounded-lg py-1.5 text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={increment}
                        disabled={quantity >= product.stock}
                        className="cursor-pointer"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Max: {product.stock}
                    </span>
                </div>
            )}

                <Button
                    className="w-full cursor-pointer"
                    disabled={isPending || product.stock === 0}
                    onClick={() => onAddToCart(quantity)}
                >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {isPending ? "Adding..." : "Add to cart"}
                </Button>
            </div>
        </div>
    );
}