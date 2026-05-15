import CreateProductForm from "@/components/products/CreateProductForm";

export default function CreateProductPage() {
    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-semibold mb-6">Create Product</h1>
            <CreateProductForm />
        </div>
    );
}