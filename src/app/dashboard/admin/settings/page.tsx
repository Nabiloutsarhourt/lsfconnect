"use client";

import { TestimonialsManager } from "@/components/admin/TestimonialsManager";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Sparkles, Settings as SettingsIcon } from "lucide-react";

export default function AdminSettingsPage() {
    return (
        <div className="container py-10 space-y-12 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">
                        Paramètres <span className="text-primary not-italic">& Social</span>
                    </h1>
                    <p className="text-slate-500 font-medium italic">Gérez l'identité de la plateforme et les retours clients.</p>
                </div>
                <div className="flex gap-4">
                    <div className="px-6 py-3 rounded-2xl bg-primary/5 text-primary border border-primary/10 flex items-center gap-3">
                        <Shield className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Admin Sécurisé</span>
                    </div>
                </div>
            </div>

            <section className="space-y-8">
                <div className="flex items-center gap-3">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <h2 className="text-xl font-black uppercase tracking-tight italic">Témoignages & Preuve Sociale</h2>
                </div>
                <TestimonialsManager />
            </section>
        </div>
    );
}
