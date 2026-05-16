import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isHydrated: boolean;
    setUser: (user: User) => void;
    logout: () => void;
    setHydrated: () => void;
}

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isHydrated: false,
            setUser: (user) => set({ user, isAuthenticated: true }),
            logout: () => {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                set({ user: null, isAuthenticated: false });
            },
            setHydrated: () => set({ isHydrated: true }),
        }),
        {
            name: "auth-storage",
            onRehydrateStorage: () => (state) => {
                state?.setHydrated();
            },
        }
    )
);

export default useAuthStore;