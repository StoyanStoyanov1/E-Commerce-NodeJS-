import Link from "next/link";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";


interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const primaryImage = product.images?.find(img => img.isPrimary)?.url;

    return (
        <div className="border rounded-xl overflow-hidden bg-white hover:shadow-md transition">
            <Link href={`/products/${product.id}`}>
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {primaryImage ? (
                        <Image
                            src={primaryImage}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <span className="text-gray-400 text-sm">No image</span>
                    )}
                </div>
                <div className="p-4">
                    <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                    <p className="font-semibold mt-2">${product.price}</p>
                </div>
            </Link>
            <div className="px-4 pb-4">
                <Button className="w-full cursor-pointer" size="sm">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to cart
                </Button>
            </div>
        </div>
    );
}