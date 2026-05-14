import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User) => void;
    logout: () => void;
}

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            setUser: (user) => set({ user, isAuthenticated: true }),
            logout: () => {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                set({ user: null, isAuthenticated: false });
            },
        }),
        {
            name: "auth-storage",
        }
    )
);

export default useAuthStore;