import Link from "next/link";
import { Product } from "@/types";
import Image from "next/image";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const primaryImage = product.images?.find(img => img.isPrimary)?.url;
    const currency = product.currency === "USD" ? "$" : "€";

    return (
        <Link href={`/products/${product.id}`}>
            <div className="border rounded-xl overflow-hidden bg-white hover:shadow-md transition cursor-pointer">
                <div className="aspect-square bg-gray-100 relative overflow-hidden">
                    {primaryImage ? (
                        <Image
                            src={primaryImage}
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-gray-400 text-sm">No image</span>
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                    <p className="font-semibold mt-2">{currency}{Number(product.price).toFixed(2)}</p>
                </div>
            </div>
        </Link>
    );
}