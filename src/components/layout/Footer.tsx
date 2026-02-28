"use client";

import Link from "next/link";
import { HandWaving, LinkedinLogo, YoutubeLogo, InstagramLogo } from "@phosphor-icons/react";

export function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-400 py-20 border-t border-slate-800">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                                <HandWaving size={24} weight="duotone" className="text-amber-400" />
                            </div>
                            <span className="font-heading font-bold text-xl tracking-tight text-white">
                                LSF<span className="text-primary">CONNECT</span>
                            </span>
                        </Link>
                        <p className="max-w-sm text-sm leading-relaxed">
                            La première plateforme SaaS dédiée à l'apprentissage de la Langue des Signes Française pour les professionnels de la justice, de la santé et du commerce.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-white font-bold uppercase tracking-widest text-xs italic">Plateforme</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/experts" className="hover:text-primary transition-colors">Nos Experts</Link></li>
                            <li><Link href="/pricing" className="hover:text-primary transition-colors">Tarifs</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                            <li><Link href="/register" className="hover:text-primary transition-colors">S'inscrire</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-white font-bold uppercase tracking-widest text-xs italic">Légal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Confidentialité</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-20 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs font-medium uppercase tracking-[0.2em]">© 2026 LSFCONNECT. MADE WITH PASSION IN FRANCE.</p>
                    <div className="flex items-center gap-4 text-slate-500">
                        <LinkedinLogo size={20} className="hover:text-primary transition-colors cursor-pointer" />
                        <YoutubeLogo size={20} className="hover:text-primary transition-colors cursor-pointer" />
                        <InstagramLogo size={20} className="hover:text-primary transition-colors cursor-pointer" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
