import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "@/types";

interface CartItemProps {
    item: CartItemType;
    onRemove: (itemId: string) => void;
}

export default function CartItem({ item, onRemove }: CartItemProps) {
    const primaryImage = item.product.images?.find(img => img.isPrimary)?.url;
    const currency = item.product.currency === "USD" ? "$" : "€";
    console.log("CartItem render", { item, primaryImage });
    return (
        <div className="flex items-center gap-4 p-4 border rounded-xl bg-white">
            <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                {primaryImage ? (
                    <Image src={primaryImage} alt={item.product.name} fill className="object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No image
                    </div>
                )}
            </div>

            <div className="flex-1">
                <Link href={`/products/${item.product.id}`}>
                    <h3 className="font-medium hover:underline">{item.product.name}</h3>
                </Link>
                <p className="text-sm text-muted-foreground">
                    {currency}{Number(item.product.price).toFixed(2)} × {item.quantity}
                </p>
            </div>

            <div className="text-right">
                <p className="font-semibold">
                    {currency}{(Number(item.product.price) * item.quantity).toFixed(2)}
                </p>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 cursor-pointer mt-1"
                    onClick={() => onRemove(item.id)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}