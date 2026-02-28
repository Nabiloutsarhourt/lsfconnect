"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    ShieldCheck, FileDown, Trash2,
    Info, Mail, Eye, Lock,
    CheckCircle2, AlertTriangle, ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function PrivacyCenterPage() {
    const [requestSent, setRequestSent] = useState<string | null>(null);

    const handleRequest = (type: string) => {
        // Simulate request sending
        setRequestSent(type);
        setTimeout(() => setRequestSent(null), 5000);
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="bg-slate-900 text-white pt-32 pb-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -mr-24 -mt-24" />
                <div className="container relative z-10 text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-primary italic">
                        <ShieldCheck className="h-4 w-4" />
                        Protection des Données (RGPD)
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
                        Centre de <span className="text-primary not-italic">Confidentialité</span>
                    </h1>
                    <p className="text-slate-400 font-medium italic max-w-2xl mx-auto text-lg md:text-xl">
                        Vos données vous appartiennent. LSFCONNECT s'engage à une transparence totale conformément aux réglementations françaises et européennes.
                    </p>
                </div>
            </section>

            {/* Content Grid */}
            <section className="container py-24 -mt-12 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Information */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                {
                                    title: "Droit à la Portabilité",
                                    desc: "Obtenez une copie formatée de toutes vos données personnelles incluant vos progrès, messages et transactions.",
                                    icon: FileDown,
                                    color: "text-blue-500"
                                },
                                {
                                    title: "Droit à l'Oubli",
                                    desc: "Supprimez définitivement votre compte et toutes les données associées de nos serveurs en un clic.",
                                    icon: Trash2,
                                    color: "text-red-500"
                                },
                                {
                                    title: "Accès & Rectification",
                                    desc: "Consultez et modifiez vos informations à tout moment via votre tableau de bord utilisateur.",
                                    icon: Eye,
                                    color: "text-primary"
                                },
                                {
                                    title: "Sécurité & Chiffrement",
                                    desc: "Vos données sont stockées de manière chiffrée avec les standards de sécurité les plus élevés (AES-256).",
                                    icon: Lock,
                                    color: "text-slate-900"
                                }
                            ].map((right, i) => (
                                <Card key={i} className="rounded-[2.5rem] border-none shadow-xl bg-white p-10 hover:-translate-y-2 transition-all duration-500">
                                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-slate-50", right.color)}>
                                        <right.icon className="h-6 w-6" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 italic uppercase mb-4">{right.title}</h3>
                                    <p className="text-slate-500 text-sm font-medium italic leading-relaxed">{right.desc}</p>
                                </Card>
                            ))}
                        </div>

                        <div className="p-12 rounded-[3.5rem] bg-white shadow-2xl space-y-10">
                            <h2 className="text-3xl font-black uppercase italic text-slate-900">Notre Engagement <span className="text-primary not-italic">Transparence</span></h2>
                            <div className="space-y-6">
                                {[
                                    "Nous ne vendons jamais vos données à des tiers.",
                                    "Vos communications privées sont chiffrées et inaccessibles au personnel non-autorisé.",
                                    "Nous conservons vos données uniquement le temps nécessaire à votre formation.",
                                    "Toutes nos infrastructures sont hébergées dans l'UE (Paris/Francfort)."
                                ].map((step, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="mt-1 p-1 rounded-full bg-primary/10 text-primary">
                                            <CheckCircle2 className="h-4 w-4" />
                                        </div>
                                        <p className="text-slate-600 font-bold italic">{step}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Interactive Requests */}
                    <div className="space-y-8">
                        <Card className="rounded-[3rem] border-none shadow-2xl bg-white overflow-hidden sticky top-8">
                            <CardHeader className="p-10 bg-slate-50 border-b border-slate-100">
                                <CardTitle className="text-xl font-black uppercase italic text-slate-900">Actions Rapides</CardTitle>
                                <CardDescription className="text-xs font-bold italic opacity-60">Réponses sous 48h ouvrées</CardDescription>
                            </CardHeader>
                            <CardContent className="p-10 space-y-8">
                                <div className="space-y-4">
                                    <Button
                                        onClick={() => handleRequest('export')}
                                        className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] gap-3 hover:translate-x-1 transition-all"
                                    >
                                        <FileDown className="h-4 w-4" />
                                        Demander un export (JSON)
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleRequest('delete')}
                                        className="w-full h-14 rounded-2xl border-red-100 text-red-500 hover:bg-red-50 font-black uppercase tracking-widest text-[10px] gap-3"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Supprimer mon compte
                                    </Button>
                                </div>

                                {requestSent && (
                                    <div className="flex items-center gap-3 p-4 bg-green-50 text-green-700 rounded-2xl border border-green-100 animate-in fade-in slide-in-from-top-2">
                                        <CheckCircle2 className="h-5 w-5 fill-current" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Requête {requestSent} envoyée !</span>
                                    </div>
                                )}

                                <div className="pt-8 border-t border-slate-100">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-black uppercase text-slate-900">DPO Contact</h4>
                                            <p className="text-[10px] font-bold text-slate-400">dpo@lsfconnect.fr</p>
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-medium text-slate-400 italic leading-relaxed">
                                        Pour toute question spécifique sur vos droits, contactez notre Délégué à la Protection des Données via l'adresse ci-dessus.
                                    </p>
                                </div>

                                <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
                                    <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
                                    <p className="text-[9px] font-black uppercase italic text-amber-700 leading-tight">
                                        La suppression de compte est irréversible. Vos certificats acquis ne seront plus récupérables.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Domain Footer CTA */}
            <section className="py-24 bg-white border-t border-slate-100">
                <div className="container text-center max-w-2xl space-y-6">
                    <h2 className="text-3xl font-black uppercase italic text-slate-900 italic">Mieux Comprendre le RGPD ?</h2>
                    <p className="text-slate-500 font-medium italic">Consultez les guides officiels de la CNIL pour connaître l'étendue de vos droits numériques en tant que citoyen français.</p>
                    <Button variant="ghost" asChild className="text-primary font-black uppercase tracking-widest text-[10px] gap-2">
                        <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
                            Visiter le site de la CNIL
                            <ArrowRight className="h-4 w-4" />
                        </a>
                    </Button>
                </div>
            </section>
        </div>
    );
}
