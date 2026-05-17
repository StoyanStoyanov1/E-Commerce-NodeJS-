import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-background px-4 py-16 text-slate-950">
            <div className="mx-auto w-full max-w-xl overflow-hidden rounded-[2rem] border border-border bg-white p-10 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.35)]">
                <h1 className="text-3xl font-semibold mb-6">Create account</h1>
                <RegisterForm />
            </div>
        </div>
    );
}