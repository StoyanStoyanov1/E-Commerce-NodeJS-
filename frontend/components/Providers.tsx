"use client";

import { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/lib/queryClient";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <Toaster position="top-right" />
        </QueryClientProvider>
);
}