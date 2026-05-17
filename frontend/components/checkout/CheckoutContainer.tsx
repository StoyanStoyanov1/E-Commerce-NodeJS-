"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { cartService } from "@/services/cart.service";
import { addressService } from "@/services/address.service";
import { orderService } from "@/services/order.service";
import AddressSelector from "./AddressSelector";
import AddressForm from "./AddressForm";
import CheckoutSummary from "./CheckoutSummary";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";

export default function CheckoutContainer() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [showAddressForm, setShowAddressForm] = useState(false);

    const { data: cart, isLoading: cartLoading } = useQuery({
        queryKey: ["cart"],
        queryFn: () => cartService.getCart(),
    });

    const { data: addresses, isLoading: addressesLoading } = useQuery({
        queryKey: ["addresses"],
        queryFn: () => addressService.getAddresses(),
    });

    const { mutate: createAddress, isPending: creatingAddress } = useMutation({
        mutationFn: (dto: { street: string; cityId: string }) =>
            addressService.createAddress(dto),
        onSuccess: (newAddress) => {
            queryClient.invalidateQueries({ queryKey: ["addresses"] });
            setSelectedAddressId(newAddress.id);
            setShowAddressForm(false);
            toast.success("Address added!");
        },
        onError: () => {
            toast.error("Failed to add address.");
        },
    });

    const { mutate: placeOrder, isPending: placingOrder } = useMutation({
        mutationFn: () =>
            orderService.createOrder(selectedAddressId!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            toast.success("Order placed successfully!");
            router.push("/orders");
        },
        onError: () => {
            toast.error("Failed to place order.");
        },
    });

    useEffect(() => {
    if (!cartLoading && (!cart || cart.cartItems.length === 0)) {
        router.push("/cart");
    }
    }, [cart, cartLoading, router]);

    if (cartLoading || addressesLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-48 w-full rounded-xl" />
            </div>
        );
    }


   
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">Checkout</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h2 className="font-semibold text-lg">Delivery address</h2>

                    {!showAddressForm ? (
                        <AddressSelector
                            addresses={addresses || []}
                            selectedId={selectedAddressId}
                            onSelect={setSelectedAddressId}
                            onAddNew={() => setShowAddressForm(true)}
                        />
                    ) : (
                        <div className="space-y-3">
                            <AddressForm
                                onSubmit={(data) => createAddress(data)}
                                isSubmitting={creatingAddress}
                            />
                            <button
                                onClick={() => setShowAddressForm(false)}
                                className="text-sm text-muted-foreground hover:underline cursor-pointer"
                            >
                                ← Back to addresses
                            </button>
                        </div>
                    )}
                </div>

               {cart && (
                    <CheckoutSummary
                        cart={cart}
                        onConfirm={() => placeOrder()}
                        isSubmitting={placingOrder}
                        selectedAddressId={selectedAddressId}
                    />
                )}
            </div>
        </div>
    );
}