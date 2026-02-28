"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, X, Check, Cookie, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem("lsfconnect-cookie-consent");
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem("lsfconnect-cookie-consent", "accepted");
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem("lsfconnect-cookie-consent", "declined");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-8 left-8 right-8 md:left-auto md:right-12 md:w-[480px] z-[100] animate-in slide-in-from-bottom-10 fade-in duration-700">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-3xl border border-white/10 relative overflow-hidden group">
                {/* Background glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-1000" />

                <div className="relative z-10 flex flex-col gap-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary shadow-inner">
                                <Cookie className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-black text-white italic uppercase tracking-tighter leading-none">
                                    Respect de la <span className="text-primary not-italic">Vie Privée</span>
                                </h3>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-3 w-3 text-slate-500" />
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">En conformité avec le RGPD</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="text-slate-500 hover:text-white transition-colors p-2"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <p className="text-sm text-slate-400 font-medium italic leading-relaxed">
                        Nous utilisons des cookies pour optimiser votre expérience d'apprentissage, analyser le trafic et assurer la sécurité de vos transactions. En continuant, vous acceptez notre utilisation de ces traceurs.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                        <Button
                            onClick={handleAccept}
                            className="w-full sm:flex-1 h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-[10px] gap-2 shadow-xl shadow-primary/20 group/btn"
                        >
                            <Check className="h-4 w-4 transition-transform group-hover:scale-110" />
                            Tout Accepter
                        </Button>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <Button
                                variant="ghost"
                                onClick={handleDecline}
                                className="flex-1 sm:flex-none h-14 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 font-black uppercase tracking-widest text-[10px]"
                            >
                                Refuser
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-14 w-14 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 border border-white/5"
                            >
                                <Settings2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.2em] text-center italic border-t border-white/5 pt-4">
                        Consultez notre <a href="/privacy-center" className="text-slate-400 hover:text-primary underline">Centre de Confidentialité</a>
                    </div>
                </div>
            </div>
        </div>
    );
}
