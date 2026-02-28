"use client";

import { Mail, ArrowRight, RefreshCw, ShieldCheck, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";

export default function VerificationPendingPage() {
    const [resending, setResending] = useState(false);

    const handleResend = () => {
        setResending(true);
        setTimeout(() => setResending(false), 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />

            <Card className="max-w-xl w-full rounded-[3.5rem] border-none shadow-3xl bg-white/80 backdrop-blur-xl overflow-hidden animate-in zoom-in-95 duration-700">
                <div className="p-12 md:p-16 flex flex-col items-center text-center space-y-8">
                    {/* Animated Icon Container */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 rounded-[2.5rem] blur-2xl animate-pulse" />
                        <div className="relative w-24 h-24 bg-primary rounded-[2.5rem] flex items-center justify-center text-white shadow-xl shadow-primary/30">
                            <Mail className="h-10 w-10 animate-bounce transition-all duration-1000" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center text-white">
                            <ShieldCheck className="h-4 w-4" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">
                            Vérifiez <span className="text-primary not-italic">Vos Emails</span>
                        </h1>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                            Une dernière étape pour activer votre accès
                        </p>
                    </div>

                    <p className="text-slate-600 font-medium italic italic leading-relaxed max-w-sm">
                        Nous avons envoyé un lien de confirmation à votre adresse email. Veuillez cliquer sur ce lien pour valider votre identité et commencer votre formation sur LSFCONNECT.
                    </p>

                    <div className="w-full space-y-4 pt-4">
                        <Button asChild className="w-full h-16 rounded-[1.25rem] bg-slate-900 text-white font-black uppercase tracking-widest text-xs gap-3 hover:-translate-y-1 shadow-2xl transition-all">
                            <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer">
                                Ouvrir ma boîte mail
                                <ArrowRight className="h-4 w-4" />
                            </a>
                        </Button>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                variant="ghost"
                                onClick={handleResend}
                                disabled={resending}
                                className="flex-1 h-14 rounded-xl border border-slate-100 bg-white font-bold text-slate-500 hover:bg-slate-50 gap-2"
                            >
                                {resending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4 font-bold" />}
                                Renvoyer le lien
                            </Button>
                            <Button variant="ghost" asChild className="flex-1 h-14 rounded-xl font-bold text-slate-400 hover:text-slate-600 gap-2">
                                <Link href="/login">
                                    <HelpCircle className="h-4 w-4" />
                                    Besoin d'aide ?
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Footer info */}
                <div className="p-8 bg-slate-50/50 border-t border-slate-50 text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        N'oubliez pas de vérifier vos courriers indésirables (Spams)
                    </p>
                </div>
            </Card>

            <div className="mt-12 flex items-center gap-6 opacity-30 grayscale saturate-0 pointer-events-none">
                <span className="text-xs font-black uppercase tracking-widest text-slate-900 italic">LSFCONNECT SECURED</span>
                <div className="h-4 w-px bg-slate-300" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-900 italic">GDPR COMPLIANT</span>
            </div>
        </div>
    );
}
