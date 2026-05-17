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
        <div className="mt-6 rounded-[28px] border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 text-slate-950">
                <span className="text-lg font-medium">Total</span>
                <span className="text-3xl font-bold">{total.toFixed(2)}</span>
            </div>
            <div className="space-y-3">
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