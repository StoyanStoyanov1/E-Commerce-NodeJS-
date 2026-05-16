import { Address } from "@/services/address.service";
import { Button } from "@/components/ui/button";

interface AddressSelectorProps {
    addresses: Address[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onAddNew: () => void;
}

export default function AddressSelector({
    addresses,
    selectedId,
    onSelect,
    onAddNew,
}: AddressSelectorProps) {
    return (
        <div className="space-y-3">
            {addresses.map((address) => (
                <div
                    key={address.id}
                    onClick={() => onSelect(address.id)}
                    className={`p-4 border rounded-xl cursor-pointer transition ${
                        selectedId === address.id
                            ? "border-gray-900 bg-gray-50"
                            : "border-gray-200 hover:border-gray-400"
                    }`}
                >
                    <p className="font-medium">{address.street}</p>
                    {address.city && (
                        <p className="text-sm text-muted-foreground">
                            {address.city.name}, {address.city.postCode} — {address.city.country.name}
                        </p>
                    )}
                    {address.isDefault && (
                        <span className="text-xs text-green-600 font-medium">Default</span>
                    )}
                </div>
            ))}

            <Button
                variant="outline"
                className="w-full cursor-pointer"
                onClick={onAddNew}
            >
                + Add new address
            </Button>
        </div>
    );
}