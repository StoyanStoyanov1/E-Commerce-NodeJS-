"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductImage } from "@/types";

interface ProductImagesProps {
    images: ProductImage[];
    name: string;
}

export default function ProductImages({ images, name }: ProductImagesProps) {
    const primaryImage = images?.find(img => img.isPrimary) || images?.[0];
    const [selected, setSelected] = useState(primaryImage?.url || null);

    if (!images || images.length === 0) {
        return (
            <div className="aspect-square rounded-[2rem] bg-slate-100 flex items-center justify-center shadow-sm">
                <span className="text-slate-400">No image</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-slate-100 shadow-sm">
                {selected && (
                    <Image
                        src={selected}
                        alt={name}
                        fill
                        className="object-cover"
                    />
                )}
            </div>

            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                    {images.map((img) => (
                        <button
                            key={img.id}
                            onClick={() => setSelected(img.url)}
                            className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-3xl border transition duration-300 ${
                                selected === img.url
                                    ? "border-primary ring-2 ring-primary/20"
                                    : "border-border hover:border-slate-400"
                            }`}
                        >
                            <Image
                                src={img.url}
                                alt={name}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}