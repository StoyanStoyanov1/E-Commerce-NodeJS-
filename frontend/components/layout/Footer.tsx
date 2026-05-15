import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t bg-white mt-auto">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="font-semibold mb-3">E-Commerce</h3>
                        <p className="text-sm text-muted-foreground">
                            Your one-stop shop for everything you need.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-3">Navigation</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/" className="hover:text-gray-900 transition">Home</Link></li>
                            <li><Link href="/products" className="hover:text-gray-900 transition">Products</Link></li>
                            <li><Link href="/cart" className="hover:text-gray-900 transition">Cart</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-3">Account</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/login" className="hover:text-gray-900 transition">Sign in</Link></li>
                            <li><Link href="/register" className="hover:text-gray-900 transition">Sign up</Link></li>
                            <li><Link href="/orders" className="hover:text-gray-900 transition">Orders</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} E-Commerce. All rights reserved.
                </div>
            </div>
        </footer>
    );
}