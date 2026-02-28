"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
    CheckCircle, Lightning, ShieldCheck, GlobeSimple,
    Star, ArrowRight, HandWaving, Sparkle
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const plans = [
    {
        name: "Standard",
        price: "0",
        description: "Pour découvrir l'univers de la LSF et s'initier aux bases.",
        features: [
            "Accès aux cours d'initiation",
            "Modules de base gratuits",
            "Profil utilisateur standard",
            "Accès au forum communautaire"
        ],
        cta: "Commencer gratuitement",
        popular: false,
        href: "/register"
    },
    {
        name: "Pro",
        price: "29",
        description: "La solution complète pour les passionnés et futurs experts.",
        features: [
            "Tous les cours & modules",
            "Certificats illimités",
            "Support prioritaire LSF",
            "Ressources PDF exclusives",
            "Chat direct avec les experts",
            "Mode hors-ligne disponible"
        ],
        cta: "Passer à Pro",
        popular: true,
        href: "/register?plan=pro"
    },
    {
        name: "Entreprise",
        price: "Custom",
        description: "Solutions sur mesure pour les organisations et services publics.",
        features: [
            "Accès multi-utilisateurs",
            "Tableau de bord manager",
            "Intégration API personnalisée",
            "Formations sur site (option)",
            "Facturation annuelle groupée",
            "SLA garanti"
        ],
        cta: "Contacter l'équipe",
        popular: false,
        href: "/contact"
    }
];

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

    const handleSubscribe = async (plan: any) => {
        if (plan.name === "Standard") return;
        if (plan.name === "Entreprise") {
            window.location.href = "/contact";
            return;
        }

        setLoadingPlan(plan.name);
        try {
            // Placeholder IDs - in production these would be real Stripe Price IDs
            const priceId = billingCycle === "monthly" ? "price_1Pro_Monthly" : "price_1Pro_Annually";

            const response = await fetch("/api/checkout/subscription", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ priceId }),
            });

            if (response.status === 401) {
                window.location.href = `/login?redirect=/pricing`;
                return;
            }

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error("Subscription error:", error);
        } finally {
            setLoadingPlan(null);
        }
    };

    return (
        <div className="flex flex-col bg-stone-50/30">
            {/* Hero Section */}
            <section className="py-20 md:py-28 bg-white border-b border-stone-100">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center space-y-6 max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-900 text-xs font-semibold">
                            <Lightning size={14} weight="duotone" className="text-amber-500" />
                            Tarification Simple
                        </div>

                        <h1 className="font-heading text-4xl md:text-6xl font-bold text-slate-900 tracking-tight leading-tight" data-testid="pricing-page-title">
                            Investissez dans votre{" "}
                            <span className="text-gradient">Avenir LSF</span>
                        </h1>

                        <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto">
                            Des plans flexibles pour tous les besoins, de l'initiation personnelle à l'excellence professionnelle.
                        </p>

                        {/* Billing Toggle */}
                        <div className="flex items-center justify-center pt-8">
                            <div className="bg-stone-100 p-1.5 rounded-full flex items-center gap-1 border border-stone-200">
                                <button
                                    onClick={() => setBillingCycle("monthly")}
                                    data-testid="billing-monthly-btn"
                                    className={cn(
                                        "px-6 py-2.5 rounded-full text-sm font-semibold transition-all",
                                        billingCycle === "monthly"
                                            ? "bg-white text-slate-900 shadow-md"
                                            : "text-stone-500 hover:text-slate-900"
                                    )}
                                >
                                    Mensuel
                                </button>
                                <button
                                    onClick={() => setBillingCycle("annually")}
                                    data-testid="billing-annually-btn"
                                    className={cn(
                                        "px-6 py-2.5 rounded-full text-sm font-semibold transition-all relative",
                                        billingCycle === "annually"
                                            ? "bg-white text-slate-900 shadow-md"
                                            : "text-stone-500 hover:text-slate-900"
                                    )}
                                >
                                    Annuel
                                    <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-[10px] text-white font-bold shadow-sm">
                                        -20%
                                    </span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-20 md:py-24">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Decorative glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-100/30 rounded-full blur-[150px] pointer-events-none" />

                        {plans.map((plan, i) => (
                            <motion.div
                                key={plan.name}
                                className={cn(
                                    "relative flex flex-col rounded-3xl bg-white border transition-all h-full",
                                    plan.popular
                                        ? "border-indigo-200 shadow-2xl shadow-indigo-900/10 scale-105 z-10"
                                        : "border-stone-100 shadow-lg shadow-stone-200/50 hover:shadow-xl"
                                )}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.15 }}
                                data-testid={`pricing-card-${plan.name.toLowerCase()}`}
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-5 py-1.5 bg-indigo-900 text-white text-xs font-semibold rounded-full shadow-lg">
                                        Plus Populaire
                                    </div>
                                )}

                                <div className="p-8 md:p-10 text-center border-b border-stone-100">
                                    <span className={cn(
                                        "text-sm font-semibold uppercase tracking-wider",
                                        plan.popular ? "text-indigo-600" : "text-stone-400"
                                    )}>
                                        Plan {plan.name}
                                    </span>

                                    <div className="mt-4 mb-3">
                                        {plan.price === "Custom" ? (
                                            <span className="font-heading text-4xl font-bold text-slate-900">Sur Devis</span>
                                        ) : (
                                            <div className="flex items-center justify-center gap-1">
                                                <span className="text-lg text-stone-400 self-start mt-2">€</span>
                                                <span className="font-heading text-6xl font-bold text-slate-900 tracking-tight">
                                                    {billingCycle === "annually" && plan.price !== "0"
                                                        ? Math.floor(parseInt(plan.price) * 0.8)
                                                        : plan.price}
                                                </span>
                                                <span className="text-stone-400 self-end mb-2">/mo</span>
                                            </div>
                                        )}
                                    </div>

                                    <p className="text-sm text-stone-500">{plan.description}</p>
                                </div>

                                <div className="p-8 md:p-10 flex-grow">
                                    <ul className="space-y-4">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-start gap-3 text-sm text-stone-600">
                                                <CheckCircle
                                                    size={20}
                                                    weight="duotone"
                                                    className={cn(
                                                        "shrink-0 mt-0.5",
                                                        plan.popular ? "text-indigo-600" : "text-stone-400"
                                                    )}
                                                />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-8 md:p-10 pt-0">
                                    <Button
                                        onClick={() => handleSubscribe(plan)}
                                        disabled={loadingPlan === plan.name}
                                        className={cn(
                                            "w-full inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold rounded-full transition-all active:scale-[0.98]",
                                            plan.popular
                                                ? "bg-indigo-900 text-white hover:bg-indigo-800 shadow-xl shadow-indigo-900/20"
                                                : "bg-slate-900 text-white hover:bg-slate-800 shadow-lg"
                                        )}
                                        data-testid={`pricing-cta-${plan.name.toLowerCase()}`}
                                    >
                                        {loadingPlan === plan.name ? (
                                            <Sparkle size={18} weight="bold" className="animate-spin" />
                                        ) : (
                                            <>
                                                {plan.cta}
                                                <ArrowRight size={18} weight="bold" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Subscribe Section */}
            <section className="py-20 md:py-24 bg-white border-t border-stone-100">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            className="space-y-6"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                                Pourquoi s'abonner à{" "}
                                <span className="text-gradient">LSFCONNECT Pro ?</span>
                            </h2>
                            <p className="text-lg text-stone-600 leading-relaxed">
                                Nous réinvestissons chaque abonnement dans la création de nouveaux cours et le support aux experts LSF indépendants.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { title: "Sécurité", icon: ShieldCheck, desc: "Paiements 100% sécurisés par Stripe." },
                                { title: "Liberté", icon: Star, desc: "Annulez votre abonnement à tout moment." },
                                { title: "Impact", icon: GlobeSimple, desc: "Contribuez à une société plus inclusive." },
                                { title: "Qualité", icon: CheckCircle, desc: "Cours validés par des experts certifiés." }
                            ].map((item, i) => (
                                <motion.div
                                    key={item.title}
                                    className="p-6 bg-stone-50 rounded-2xl border border-stone-100 hover:bg-white hover:shadow-lg hover:border-indigo-100 transition-all"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-indigo-900 shadow-sm mb-4">
                                        <item.icon size={24} weight="duotone" />
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                                    <p className="text-sm text-stone-500">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Quote CTA */}
            <section className="py-20 md:py-24">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="p-12 md:p-20 gradient-primary rounded-[2.5rem] text-center relative overflow-hidden"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-amber-400/20 rounded-full blur-[100px] pointer-events-none" />

                        <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
                            <HandWaving size={48} weight="duotone" className="text-amber-400 mx-auto" />

                            <p className="font-heading text-2xl md:text-3xl font-bold text-white leading-relaxed">
                                "LSFCONNECT a transformé l'accès à la formation. C'est l'outil indispensable pour toute personne souhaitant s'investir sérieusement."
                            </p>

                            <div className="space-y-1">
                                <span className="block text-amber-400 font-semibold">Jean-Luc R.</span>
                                <span className="block text-indigo-200 text-sm">Interprète Expert Juridique</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
