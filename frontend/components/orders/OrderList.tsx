import { Order } from "@/types";
import OrderCard from "./OrderCart";

interface OrderListProps {
    orders: Order[];
    onCancel: (id: string) => void;
}

export default function OrderList({ orders, onCancel }: OrderListProps) {
    return (
        <div className="space-y-4">
            {orders.map((order) => (
                <OrderCard
                    key={order.id}
                    order={order}
                    onCancel={onCancel}
                />
            ))}
        </div>
    );
}