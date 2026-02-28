"use client";

import Link from "next/link";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Envelope, Lock, CircleNotch, ArrowRight, HandWaving } from "@phosphor-icons/react";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const message = searchParams.get("message");

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            if (data.user) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", data.user.id)
                    .single();

                if (profile?.role === "expert") {
                    router.push("/dashboard/expert");
                } else {
                    router.push("/experts");
                }
            }
        } catch (err: any) {
            setError(err.message || "Email ou mot de passe incorrect.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 bg-stone-50/50">
            <motion.div
                className="w-full max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="bg-white rounded-3xl shadow-2xl shadow-stone-200/50 border border-stone-100 overflow-hidden">
                    {/* Header */}
                    <div className="p-8 pb-6 text-center border-b border-stone-100 bg-gradient-to-b from-indigo-50/50 to-white">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-900 flex items-center justify-center mx-auto mb-4">
                            <HandWaving size={28} weight="duotone" className="text-amber-400" />
                        </div>
                        <h1 className="font-heading text-2xl font-bold text-slate-900" data-testid="login-page-title">Bon retour !</h1>
                        <p className="text-stone-500 text-sm mt-1">Connectez-vous à votre compte LSFCONNECT</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="p-8 space-y-5">
                        {message && (
                            <div className="p-4 rounded-xl bg-indigo-50 text-indigo-700 text-sm font-medium border border-indigo-100 text-center">
                                {message}
                            </div>
                        )}
                        {error && (
                            <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100 text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700" htmlFor="email">
                                Adresse email
                            </label>
                            <div className="relative">
                                <Envelope size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="vous@exemple.com"
                                    data-testid="login-email-input"
                                    className="w-full pl-12 pr-4 h-12 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-sm transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-slate-700" htmlFor="password">
                                    Mot de passe
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                                >
                                    Mot de passe oublié ?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    data-testid="login-password-input"
                                    className="w-full pl-12 pr-4 h-12 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-sm transition-all"
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            data-testid="login-submit-btn"
                            className="w-full h-12 rounded-xl bg-indigo-900 hover:bg-indigo-800 text-white font-semibold shadow-lg shadow-indigo-900/20 transition-all active:scale-[0.98]"
                        >
                            {loading ? (
                                <CircleNotch size={20} className="animate-spin" />
                            ) : (
                                <>
                                    Se connecter
                                    <ArrowRight size={18} weight="bold" className="ml-2" />
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="px-8 pb-8 text-center">
                        <p className="text-sm text-stone-500">
                            Pas encore de compte ?{" "}
                            <Link href="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                                Créer un compte
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
                <CircleNotch size={32} className="animate-spin text-indigo-600" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
