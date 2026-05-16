"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface CartSummaryProps {
    total: number;
    onClear: () => void;
}

export default function CartSummary({ total, onClear }: CartSummaryProps) {
    const router = useRouter();

    return (
        <div className="mt-6 p-4 border rounded-xl bg-white">
            <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium">Total</span>
                <span className="text-2xl font-bold">{total.toFixed(2)}</span>
            </div>
            <div className="space-y-2">
                <Button
                    className="w-full cursor-pointer"
                    onClick={() => router.push("/checkout")}
                >
                    Proceed to checkout
                </Button>
                <Button
                    variant="ghost"
                    className="w-full text-red-500 cursor-pointer"
                    onClick={onClear}
                >
                    Clear cart
                </Button>
            </div>
        </div>
    );
}