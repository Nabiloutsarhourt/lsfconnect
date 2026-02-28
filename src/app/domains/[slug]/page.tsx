"use client";

import { use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Gavel, Stethoscope, Briefcase, Heart,
    ShieldCheck, Users, ArrowRight, Star,
    CheckCircle2, Info
} from "lucide-react";
import { cn } from "@/lib/utils";

const DOMAIN_DATA = {
    judicial: {
        title: "Expertise Judiciaire",
        subtitle: "Interprétation certifiée pour le monde du droit",
        description: "Nos experts en LSF judiciaire sont formés aux terminologies complexes des tribunaux, des commissariats et des cabinets d'avocats. Sécurité et précision garantie.",
        icon: Gavel,
        color: "bg-blue-600",
        stats: { users: "1.2K", experts: "85", success: "99.8%" },
        benefits: [
            "Respect strict du secret professionnel",
            "Maîtrise du vocabulaire juridique",
            "Expertise reconnue par les tribunaux",
            "Disponibilité urgente 24/7"
        ]
    },
    medical: {
        title: "Secteur Médical",
        subtitle: "La santé accessible à tous, sans barrière",
        description: "Parce que la santé ne peut pas attendre, nos interprètes médicaux garantissent une communication fluide entre patients sourds et professionnels de santé.",
        icon: Stethoscope,
        color: "bg-red-500",
        stats: { users: "3.5K", experts: "120", success: "100%" },
        benefits: [
            "Connaissance des protocoles hospitaliers",
            "Intervention en urgence ou rendez-vous",
            "Bienveillance et éthique médicale",
            "Support pour examens complexes"
        ]
    },
    commercial: {
        title: "Domaine Entreprise",
        subtitle: "Booster l'inclusion dans le monde du travail",
        description: "Réunions, entretiens d'embauche ou séminaires : rendez votre entreprise réellement inclusive avec nos experts certifiés en milieu professionnel.",
        icon: Briefcase,
        color: "bg-slate-900",
        stats: { users: "850", experts: "210", success: "98.5%" },
        benefits: [
            "Interprétation pour visioconférences",
            "Accompagnement à l'intégration RH",
            "Traduction de documents internes",
            "Formation de sensibilisation d'équipe"
        ]
    },
    social: {
        title: "Secteur Social",
        subtitle: "Renforcer les liens et l'autonomie",
        description: "Accompagnement dans les démarches administratives, milieu scolaire ou associatif. Nous facilitons l'accès aux droits fondamentaux.",
        icon: Heart,
        color: "bg-green-500",
        stats: { users: "5.1K", experts: "150", success: "99.2%" },
        benefits: [
            "Aide aux démarches administratives",
            "Soutien à la parentalité et éducation",
            "Intervention en milieu associatif",
            "Écoute active et médiation culturelle"
        ]
    }
};

export default function DomainPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const domain = DOMAIN_DATA[slug as keyof typeof DOMAIN_DATA];

    if (!domain) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4">
                <div className="p-4 bg-slate-50 rounded-full">
                    <Info className="h-12 w-12 text-slate-400" />
                </div>
                <h1 className="text-2xl font-black uppercase text-slate-900">Domaine introuvable</h1>
                <p className="text-slate-500 italic max-w-sm text-center">
                    Désolé, le domaine que vous recherchez n'existe pas ou a été déplacé.
                </p>
                <Button asChild className="rounded-full">
                    <Link href="/">Retour à l'accueil</Link>
                </Button>
            </div>
        );
    }

    const Icon = domain.icon;

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Header Domain Hero */}
            <section className={cn("relative pt-32 pb-24 text-white overflow-hidden", domain.color)}>
                <div className="absolute inset-0 bg-black/10" />
                <div className="container relative z-10 flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-[2rem] bg-white/20 backdrop-blur-md flex items-center justify-center mb-8 shadow-2xl border border-white/20">
                        <Icon className="h-10 w-10 text-white" />
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-4">
                        {domain.title}
                    </h1>
                    <p className="text-xl md:text-2xl font-medium italic opacity-90 max-w-2xl mb-12">
                        {domain.subtitle}
                    </p>

                    <div className="flex flex-wrap gap-4 justify-center">
                        <Button size="lg" className="h-16 px-10 rounded-[2rem] bg-white text-slate-900 font-black uppercase tracking-widest text-xs hover:shadow-2xl transition-all border-none">
                            <Link href="/experts">Trouver un Expert</Link>
                        </Button>
                        <Button size="lg" variant="outline" className="h-16 px-10 rounded-[2rem] border-white/30 text-white font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all">
                            <Link href="/pricing">Voir les Tarifs</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="bg-white border-b py-12">
                <div className="container grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { label: "Apprenants actifs", value: domain.stats.users, icon: Users },
                        { label: "Experts vérifiés", value: domain.stats.experts, icon: ShieldCheck },
                        { label: "Taux de réussite", value: domain.stats.success, icon: Star },
                    ].map((stat, i) => (
                        <div key={i} className="flex items-center gap-6 justify-center md:justify-start">
                            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                <stat.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <div className="text-2xl font-black italic text-slate-900">{stat.value}</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Content Section */}
            <section className="py-24 container">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-12">
                        <div className="flex flex-col gap-4">
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] italic">Pourquoi nous choisir ?</span>
                            <h2 className="text-4xl font-black italic uppercase text-slate-900 leading-[0.9] tracking-tighter">
                                Une Expertise <span className="text-primary not-italic">Sans Compromis</span>
                            </h2>
                            <p className="text-lg text-slate-500 font-medium italic leading-relaxed">
                                {domain.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {domain.benefits.map((benefit, i) => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="mt-1 p-1 rounded-full bg-primary/10 text-primary">
                                        <CheckCircle2 className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-600 italic leading-snug">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-4 bg-primary/20 rounded-[3rem] blur-2xl opacity-30 animate-pulse" />
                        <div className="relative aspect-4/3 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white bg-slate-100">
                            <img
                                src={`https://images.unsplash.com/photo-1577416416141-7c83b276231c?q=80&w=800&auto=format&fit=crop`}
                                alt={domain.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 bg-slate-50">
                <div className="container text-center max-w-4xl space-y-10">
                    <h2 className="text-4xl md:text-6xl font-black italic uppercase text-slate-900 tracking-tighter leading-none">
                        Maîtrisez le Domaine <br />
                        <span className="text-primary not-italic">Dès Aujourd'hui</span>
                    </h2>
                    <p className="text-xl text-slate-500 font-medium italic">
                        Rejoignez nos formations spécialisées et obtenez votre certificat reconnu par l'industrie.
                    </p>
                    <div className="flex flex-wrap gap-6 justify-center pt-4">
                        <Button size="lg" asChild className="h-16 px-12 rounded-[2rem] bg-slate-900 text-white font-black uppercase tracking-widest text-xs hover:shadow-2xl transition-all">
                            <Link href="/register">S'inscrire Maintenant</Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild className="h-16 px-12 rounded-[2rem] border-slate-200 text-slate-900 font-black uppercase tracking-widest text-xs hover:bg-white transition-all">
                            <Link href="/courses">Voir les Cours</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
