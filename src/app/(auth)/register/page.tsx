"use client";
// Force build trigger: v2.0 - Resolved conflict markers

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { User, ShieldCheck, CircleNotch, Envelope, Lock, UserCircle, ArrowRight, Info } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { emailService } from "@/lib/email";

export default function RegisterPage() {
    const router = useRouter();
    const supabase = createClient();

    const [role, setRole] = useState<"client" | "expert">("client");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const fullName = formData.get("fullName") as string;
        const domain = formData.get("domain") as string;

        try {
            const { data, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        role: role,
                        domain: domain,
                    },
                },
            });

            if (authError) throw authError;

            if (data.user) {
                // Trigger welcome email (non-blocking)
                emailService.sendEmail({
                    to: email,
                    subject: "Bienvenue sur LSFCONNECT !",
                    template: 'welcome',
                    data: { name: fullName, domain: 'LSF' }
                }).catch(err => console.error("Email failed:", err));

                router.push("/login?message=Consultez vos emails pour confirmer votre compte.");
            }
        } catch (err: any) {
            setError(err.message || "Une erreur est survenue lors de l'inscription.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 bg-stone-50/50">
            <motion.div
                className="w-full max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="bg-white rounded-3xl shadow-2xl shadow-stone-200/50 border border-stone-100 overflow-hidden">
                    {/* Header */}
                    <div className="p-8 pb-6 text-center border-b border-stone-100 bg-gradient-to-b from-indigo-50/50 to-white">
                        <h1 className="font-heading text-2xl font-bold text-slate-900" data-testid="register-page-title">
                            Créer votre compte
                        </h1>
                        <p className="text-stone-500 text-sm mt-1">
                            Rejoignez la communauté LSFCONNECT
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleRegister} className="p-8 space-y-6">
                        {/* Role Selection */}
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setRole("client")}
                                data-testid="role-client-btn"
                                className={cn(
                                    "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-5 transition-all",
                                    role === "client"
                                        ? "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-600/20"
                                        : "border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                                )}
                            >
                                <User
                                    size={32}
                                    weight="duotone"
                                    className={cn(role === "client" ? "text-indigo-600" : "text-stone-400")}
                                />
                                <div className="text-center">
                                    <div className={cn(
                                        "text-sm font-bold",
                                        role === "client" ? "text-indigo-900" : "text-slate-700"
                                    )}>
                                        Client
                                    </div>
                                    <p className="text-xs text-stone-500 mt-0.5">Je cherche un expert LSF</p>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setRole("expert")}
                                data-testid="role-expert-btn"
                                className={cn(
                                    "flex flex-col items-center justify-center gap-3 rounded-2xl border-2 p-5 transition-all",
                                    role === "expert"
                                        ? "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-600/20"
                                        : "border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                                )}
                            >
                                <ShieldCheck
                                    size={32}
                                    weight="duotone"
                                    className={cn(role === "expert" ? "text-indigo-600" : "text-stone-400")}
                                />
                                <div className="text-center">
                                    <div className={cn(
                                        "text-sm font-bold",
                                        role === "expert" ? "text-indigo-900" : "text-slate-700"
                                    )}>
                                        Expert
                                    </div>
                                    <p className="text-xs text-stone-500 mt-0.5">Je suis professionnel LSF</p>
                                </div>
                            </button>
                        </div>

                        {error && (
                            <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100 text-center">
                                {error}
                            </div>
                        )}

                        {/* Name Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700" htmlFor="fullName">
                                Nom complet
                            </label>
                            <div className="relative">
                                <UserCircle size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    required
                                    placeholder="Jean Dupont"
                                    data-testid="register-name-input"
                                    className="w-full pl-12 pr-4 h-12 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-sm transition-all"
                                />
                            </div>
                        </div>

                        {/* Domain Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700" htmlFor="domain">
                                Domaine Principal LSF
                            </label>
                            <div className="relative">
                                <select
                                    id="domain"
                                    name="domain"
                                    required
                                    className="w-full px-4 h-12 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-sm transition-all appearance-none cursor-pointer"
                                >
                                    <option value="Judicial">⚖ Judiciaire</option>
                                    <option value="Medical">🏥 Médical</option>
                                    <option value="Commercial">🏢 Commercial</option>
                                    <option value="Social">🤝 Social</option>
                                </select>
                            </div>
                        </div>

                        {/* Email Input */}
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
                                    data-testid="register-email-input"
                                    className="w-full pl-12 pr-4 h-12 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-sm transition-all"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700" htmlFor="password">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    data-testid="register-password-input"
                                    className="w-full pl-12 pr-4 h-12 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-sm transition-all"
                                />
                            </div>
                        </div>
                        {role === "expert" && (
                            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100">
                                <Info size={20} className="text-amber-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-800 leading-relaxed">
                                    <span className="font-bold">Note :</span> En tant qu'expert, vous devrez télécharger une vidéo de présentation LSF et vos certifications après l'inscription pour validation.
                                </p>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            data-testid="register-submit-btn"
                            className="w-full h-12 rounded-xl bg-indigo-900 hover:bg-indigo-800 text-white font-semibold shadow-lg shadow-indigo-900/20 transition-all active:scale-[0.98]"
                        >
                            {loading ? (
                                <CircleNotch size={20} className="animate-spin" />
                            ) : (
                                <>
                                    Créer mon compte
                                    <ArrowRight size={18} weight="bold" className="ml-2" />
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="px-8 pb-8 text-center">
                        <p className="text-sm text-stone-500">
                            Déjà inscrit ?{" "}
                            <Link href="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">
                                Se connecter
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
