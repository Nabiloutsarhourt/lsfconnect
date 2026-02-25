"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { CheckCircle2, Zap, ShieldCheck, Globe, Star, ArrowRight, HandMetal } from "lucide-react";
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
        color: "slate"
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
        color: "primary"
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
        color: "blue"
    }
];

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");

    return (
        <div className="container py-20 space-y-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="text-center space-y-6 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                    <Zap className="h-3 w-3 fill-current" />
                    Tarification Simple
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-tight italic">
                    Investissez dans votre <span className="text-primary not-italic">Avenir LSF</span>
                </h1>
                <p className="text-xl text-slate-500 font-medium leading-relaxed italic max-w-2xl mx-auto">
                    Des plans flexibles pour tous les besoins, de l'initiation personnelle à l'excellence professionnelle.
                </p>

                <div className="flex items-center justify-center pt-8">
                    <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 border border-slate-200 shadow-inner">
                        <button
                            onClick={() => setBillingCycle("monthly")}
                            className={cn(
                                "px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all",
                                billingCycle === "monthly" ? "bg-white text-slate-900 shadow-lg" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            Mensuel
                        </button>
                        <button
                            onClick={() => setBillingCycle("annually")}
                            className={cn(
                                "px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all relative",
                                billingCycle === "annually" ? "bg-white text-slate-900 shadow-lg" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            Annuel
                            <span className="absolute -top-3 -right-3 px-2 py-0.5 rounded-full bg-green-500 text-[8px] text-white font-black animate-bounce shadow-lg shadow-green-200">
                                -20%
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative pb-20">
                {/* Glow effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-[50%] blur-[120px] pointer-events-none" />

                {plans.map((plan) => (
                    <Card
                        key={plan.name}
                        className={cn(
                            "relative group rounded-[3rem] border-none shadow-2xl transition-all duration-500 hover:-translate-y-4 flex flex-col h-full bg-white/80 backdrop-blur-xl",
                            plan.popular ? "ring-4 ring-primary ring-opacity-10 scale-105 shadow-primary/20 bg-white" : "shadow-slate-200/50"
                        )}
                    >
                        {plan.popular && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-6 py-2 rounded-full font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20">
                                Plus Populaire
                            </div>
                        )}

                        <CardHeader className="p-10 pb-6 text-center space-y-6">
                            <div className="space-y-2">
                                <span className={cn(
                                    "text-[10px] font-black uppercase tracking-[0.3em]",
                                    plan.color === "primary" ? "text-primary text-opacity-80" : "text-slate-400"
                                )}>
                                    Plan {plan.name}
                                </span>
                                <CardTitle className="text-3xl font-black text-slate-900 leading-none">
                                    {plan.price === "Custom" ? "Sur Devis" : (
                                        <div className="flex items-center justify-center gap-1">
                                            <span className="text-sm self-start mt-1">€</span>
                                            <span className="text-5xl tracking-tighter">{billingCycle === "annually" && plan.price !== "0" ? Math.floor(parseInt(plan.price) * 0.8) : plan.price}</span>
                                            <span className="text-xs text-slate-400 italic">/mo</span>
                                        </div>
                                    )}
                                </CardTitle>
                            </div>
                            <CardDescription className="text-sm font-medium text-slate-500 leading-relaxed italic">
                                {plan.description}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="p-10 pt-0 space-y-8 flex-grow">
                            <div className="w-full h-px bg-slate-100" />
                            <ul className="space-y-4">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-4 text-sm font-medium text-slate-600 group/item">
                                        <div className={cn(
                                            "mt-0.5 p-0.5 rounded-full transition-colors",
                                            plan.color === "primary" ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-400"
                                        )}>
                                            <CheckCircle2 className="h-4 w-4" />
                                        </div>
                                        <span className="group-hover/item:text-slate-900 transition-colors">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>

                        <CardFooter className="p-10 pt-0">
                            <Button
                                className={cn(
                                    "w-full h-16 rounded-2xl font-black uppercase tracking-widest text-[10px] gap-3 shadow-xl transition-all",
                                    plan.popular ? "shadow-primary/20" : "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-200"
                                )}
                                asChild
                            >
                                <Link href={plan.price === "0" ? "/register" : "/api/checkout/subscription"}>
                                    {plan.cta}
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-20 border-t border-slate-100">
                <div className="space-y-6">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight italic">
                        Pourquoi s'abonner à <span className="text-primary not-italic underline decoration-slate-200 decoration-8 underline-offset-[-2px]">LSFCONNECT Pro ?</span>
                    </h2>
                    <p className="text-slate-500 font-medium leading-relaxed italic">
                        Nous réinvestissons chaque abonnement dans la création de nouveaux cours et le support aux experts LSF indépendants.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                        { title: "Sécurité", icon: ShieldCheck, desc: "Paiements 100% sécurisés par Stripe." },
                        { title: "Liberté", icon: Star, desc: "Annulez votre abonnement à tout moment." },
                        { title: "Impact", icon: Globe, desc: "Contribuez à une société plus inclusive." },
                        { title: "Qualité", icon: CheckCircle2, desc: "Cours validés par des experts certifiés." }
                    ].map((item) => (
                        <div key={item.title} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                                <item.icon className="h-5 w-5" />
                            </div>
                            <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                            <p className="text-xs text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Trust Quote */}
            <div className="p-12 md:p-20 bg-slate-900 rounded-[4rem] text-center space-y-8 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />

                <div className="relative space-y-6 max-w-2xl mx-auto">
                    <HandMetal className="h-12 w-12 text-primary mx-auto opacity-50 group-hover:rotate-12 transition-transform duration-700" />
                    <p className="text-2xl md:text-3xl font-black text-white italic leading-tight">
                        "LSFCONNECT a transformé l'accès à la formation. C'est l'outil indispensable pour toute personne souhaitant s'investir sérieusement."
                    </p>
                    <div className="space-y-1">
                        <span className="block text-primary font-black uppercase tracking-widest text-[10px]">Jean-Luc R.</span>
                        <span className="block text-slate-400 text-xs font-bold">Interprète Expert Judicial</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
