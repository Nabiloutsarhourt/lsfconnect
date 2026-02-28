"use client";

import { ShieldCheck, Lock, Eye, FileText } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="container max-w-4xl py-20 space-y-12">
            <div className="space-y-4 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-widest">
                    <ShieldCheck className="h-4 w-4" /> Conformité GDPR France
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 italic uppercase">
                    Politique de <span className="text-primary not-italic">Confidentialité</span>
                </h1>
                <p className="text-slate-500 font-medium italic">Dernière mise à jour : 28 Février 2026</p>
            </div>

            <div className="prose prose-slate max-w-none bg-white p-10 md:p-16 rounded-[3rem] shadow-xl space-y-10">
                <section className="space-y-4">
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3 italic">
                        <User className="h-6 w-6 text-primary" /> Collecte des Données
                    </h2>
                    <p className="text-slate-600 leading-relaxed font-medium">
                        LSFCONNECT collecte les informations nécessaires à votre formation : nom, prénom, email, et domaine de spécialisation.
                        Ces données sont utilisées exclusivement pour la gestion de votre compte et le suivi de vos progrès pédagogiques.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3 italic">
                        <Lock className="h-6 w-6 text-primary" /> Sécurité & Stockage
                    </h2>
                    <p className="text-slate-600 leading-relaxed font-medium">
                        Vos données sont hébergées sur des serveurs sécurisés conformes aux normes européennes. Nous utilisons le chiffrement
                        SSL (TLS) pour toutes les communications et les mots de passe sont hachés via Algorithme Argon2/Bcrypt.
                    </p>
                </section>

                <section className="space-y-4 border-l-4 border-primary pl-6 py-2 bg-slate-50 rounded-r-2xl">
                    <h3 className="font-black text-slate-900 italic">Vos Droits (RGPD)</h3>
                    <ul className="list-disc list-inside text-slate-600 space-y-2 font-medium">
                        <li>Droit d'accès et de rectification</li>
                        <li>Droit à l'effacement ("Droit à l'oubli")</li>
                        <li>Droit à la portabilité des données</li>
                        <li>Droit d'opposition au traitement</li>
                    </ul>
                </section>

                <section className="pt-10 border-t border-slate-100 text-center">
                    <p className="text-slate-400 text-sm italic font-bold">
                        Pour toute question : <span className="text-primary underline">privacy@lsfconnect.fr</span>
                    </p>
                </section>
            </div>
        </div>
    );
}

function User({ className }: { className?: string }) {
    return <Eye className={className} />;
}
