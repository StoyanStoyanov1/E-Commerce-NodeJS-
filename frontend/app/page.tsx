import Link from "next/link";

export default function Home() {
    return (
        <main className="min-h-[calc(100vh-5rem)]">
            <section className="overflow-hidden bg-primary/5 py-20">
                <div className="absolute inset-x-0 top-0 h-44 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_45%)]" />
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] items-center">
                        <div className="space-y-6">
                            <span className="inline-flex rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
                                Modern e-commerce experience
                            </span>
                            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                                Build a clean, fast and polished storefront for your customers.
                            </h1>
                            <p className="max-w-2xl text-base leading-8 text-slate-600">
                                A lightweight shopping experience with product discovery, cart management and checkout flows designed for conversion.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Link href="/products" className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-primary/90">
                                    Browse products
                                </Link>
                                <Link href="/login" className="inline-flex items-center justify-center rounded-full border border-border bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                                    Sign in
                                </Link>
                            </div>
                        </div>

                        <div className="rounded-[2rem] border border-border bg-white/90 p-8 shadow-[0_30px_90px_-40px_rgba(15,23,42,0.35)] backdrop-blur-lg">
                            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                                Featured benefits
                            </p>
                            <div className="mt-8 space-y-5">
                                <div className="rounded-3xl bg-slate-50 p-5">
                                    <h2 className="font-semibold text-lg text-slate-950">Fast product discovery</h2>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">Search and browse collections with a layout that keeps products in focus.</p>
                                </div>
                                <div className="rounded-3xl bg-slate-50 p-5">
                                    <h2 className="font-semibold text-lg text-slate-950">Smooth checkout flow</h2>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">A polished cart and checkout flow that works beautifully on desktop and mobile.</p>
                                </div>
                                <div className="rounded-3xl bg-slate-50 p-5">
                                    <h2 className="font-semibold text-lg text-slate-950">Clear product visuals</h2>
                                    <p className="mt-2 text-sm leading-6 text-slate-600">Images, badges and cards designed to present your inventory with premium polish.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}