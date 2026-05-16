import { CartItem as CartItemType } from "@/types";
import CartItem from "./CartItem";

interface CartListProps {
    items: CartItemType[];
    onRemove: (itemId: string) => void;
}

export default function CartList({ items, onRemove }: CartListProps) {
    return (
        <div className="space-y-4">
            {items.map((item) => (
                <CartItem key={item.id} item={item} onRemove={onRemove} />
            ))}
        </div>
    );
}