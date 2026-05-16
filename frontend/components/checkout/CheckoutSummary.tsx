import { Cart } from "@/types";
import { Button } from "@/components/ui/button";

interface CheckoutSummaryProps {
    cart: Cart;
    onConfirm: () => void;
    isSubmitting: boolean;
    selectedAddressId: string | null;
}

export default function CheckoutSummary({
    cart,
    onConfirm,
    isSubmitting,
    selectedAddressId,
}: CheckoutSummaryProps) {
    const total = cart.cartItems.reduce(
        (sum, item) => sum + Number(item.product.price) * item.quantity,
        0
    );

    return (
        <div className="border rounded-xl p-4 bg-white space-y-4">
            <h2 className="font-semibold text-lg">Order summary</h2>

            <div className="space-y-2">
                {cart.cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                            {item.product.name} × {item.quantity}
                        </span>
                        <span className="font-medium">
                            {item.product.currency === "USD" ? "$" : "€"}
                            {(Number(item.product.price) * item.quantity).toFixed(2)}
                        </span>
                    </div>
                ))}
            </div>

            <div className="border-t pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span>{total.toFixed(2)}</span>
            </div>

            <Button
                className="w-full cursor-pointer"
                disabled={isSubmitting || !selectedAddressId}
                onClick={onConfirm}
            >
                {isSubmitting ? "Placing order..." : "Place order"}
            </Button>

            {!selectedAddressId && (
                <p className="text-xs text-red-500 text-center">
                    Please select a delivery address
                </p>
            )}
        </div>
    );
}