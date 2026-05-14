"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/authStore";
import { authService } from "@/services/auth.service";
import toast from "react-hot-toast";

export default function Navbar() {
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuthStore();

    const handleLogout = async () => {
        try {
            await authService.logout();
        } finally {
            logout();
            toast.success("Logged out successfully");
            router.push("/login");
        }
    };

    return (
        <nav className="border-b bg-white sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-semibold">
                    E-Commerce
                </Link>

                <div className="flex items-center gap-3">
                    {isAuthenticated ? (
                        <>
                            <Link href="/cart">
                                <Button variant="ghost" size="icon">
                                    <ShoppingCart className="h-5 w-5" />
                                </Button>
                            </Link>

                            <span className="text-sm text-muted-foreground">
                                {user?.firstName}
                            </span>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleLogout}
                                className="cursor-pointer"
                            >
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" className="cursor-pointer">
                                    Sign in
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button className="cursor-pointer">
                                    Sign up
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}