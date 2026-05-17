import { Order } from "@/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface OrderCardProps {
    order: Order;
    onCancel?: (id: string) => void;
}

const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    SHIPPED: "bg-purple-100 text-purple-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
};

export default function OrderCard({ order, onCancel }: OrderCardProps) {
    return (
        <div className="border rounded-xl p-4 bg-white space-y-3">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <p className="font-medium text-sm">{order.id}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[order.status]}`}>
                    {order.status}
                </span>
            </div>

            <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                </span>
                <span className="font-semibold">
                    {Number(order.totalPrice).toFixed(2)}
                </span>
            </div>

            <div className="flex gap-2">
                <Link href={`/orders/${order.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full cursor-pointer">
                        View details
                    </Button>
                </Link>
                {order.status === "PENDING" && onCancel && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 cursor-pointer"
                        onClick={() => onCancel(order.id)}
                    >
                        Cancel
                    </Button>
                )}
            </div>
        </div>
    );
}