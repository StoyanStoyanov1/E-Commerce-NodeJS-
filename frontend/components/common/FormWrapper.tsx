import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";


interface FormWrapperProps {
    onSubmit: (e: React.FormEvent) => void;
    children: React.ReactNode;
    buttonLabel?: string;
    isSubmitting?: boolean;
    className?: string;
    error?: string | null;
}

export default function FormWrapper({
    onSubmit,
    children,
    buttonLabel,
    isSubmitting,
    className,
    error,
}: FormWrapperProps) {
    return (
        <form onSubmit={onSubmit} className={className}>
            {children}
            {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                    <span>⚠️ {error}</span>
                </div>
            )}
            {buttonLabel && (
                <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading...
                        </span>
                    ) : buttonLabel}
                </Button>
            )}
        </form>
    );
}