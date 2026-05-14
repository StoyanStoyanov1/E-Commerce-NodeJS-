import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-xl p-10 rounded-2xl border bg-white shadow-md">
                <h1 className="text-2xl font-semibold mb-6">Create account</h1>
                <RegisterForm />
            </div>
        </div>
    );
}