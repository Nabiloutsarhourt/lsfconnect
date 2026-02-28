"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Users, BookOpen, CreditCard, Star,
    ArrowUpRight, ArrowDownRight, Activity,
    Zap, Calendar, GraduationCap
} from "lucide-react";
import Link from "next/link";
import { BusinessIntelligence } from "@/components/admin/BusinessIntelligence";

export default function AdminOverviewPage() {
    const supabase = createClient();

    return (
        <div className="container py-10 space-y-12 animate-in fade-in duration-700">
            <div className="space-y-1">
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">
                    Performance <span className="text-primary not-italic">Globale</span>
                </h1>
                <p className="text-slate-500 font-medium italic">Analyse avancée de l'activité LSFCONNECT.</p>
            </div>

            <BusinessIntelligence />

            <div className="space-y-6">
                <h2 className="text-xl font-black italic uppercase text-slate-900 leading-none">Accès <span className="text-primary not-italic">Rapide</span></h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: "Utilisateurs", icon: Users, href: "/dashboard/admin/users", count: "Gérer les comptes", color: "bg-blue-500" },
                        { label: "Catalogue", icon: BookOpen, href: "/dashboard/admin/courses", count: "Cours & Modules", color: "bg-indigo-500" },
                        { label: "Abonnements", icon: CreditCard, href: "/dashboard/admin/subscriptions", count: "Flux de revenus", color: "bg-emerald-500" },
                        { label: "Correction", icon: GraduationCap, href: "/dashboard/admin/grading", count: "Études de cas", color: "bg-amber-500" },
                        { label: "Audit Traçabilité", icon: Activity, href: "/dashboard/admin/logs", count: "Logs système", color: "bg-slate-700" },
                    ].map((nav, i) => (
                        <Card key={i} className="group rounded-[2rem] border-none shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all bg-white relative overflow-hidden">
                            <Link href={nav.href} className="absolute inset-0 z-10" />
                            <CardContent className="p-8 flex flex-col gap-4">
                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", nav.color)}>
                                    <nav.icon className="h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-900 group-hover:text-primary transition-colors uppercase italic">{nav.label}</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{nav.count}</p>
                                </div>
                                <div className="absolute top-4 right-4 text-slate-100 group-hover:text-primary/10 transition-colors">
                                    <nav.icon className="h-20 w-20 -mr-10 -mt-10" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ArrowRight({ className }: { className?: string }) {
    return <ArrowUpRight className={cn("rotate-90", className)} />;
}
