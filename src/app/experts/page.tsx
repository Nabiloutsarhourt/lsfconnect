"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  MagnifyingGlass, MapPin, Star, VideoCamera,
  HandWaving, Funnel, ShieldCheck, ArrowRight,
  Sparkle, Clock, User
} from "@phosphor-icons/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Expert {
    id: string;
    full_name: string;
    avatar_url: string;
    experts: {
        specialties: string[];
        hourly_rate: number;
        lsf_video_url: string;
        is_verified: boolean;
    };
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function ExpertsPage() {
    const supabase = createClient();
    const [experts, setExperts] = useState<Expert[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        async function fetchExperts() {
            const { data, error } = await supabase
                .from("profiles")
                .select(`
                    id,
                    full_name,
                    avatar_url,
                    experts (
                        specialties,
                        hourly_rate,
                        lsf_video_url,
                        is_verified
                    )
                `)
                .eq("role", "expert");

            if (data) setExperts(data as any);
            setLoading(false);
        }
        fetchExperts();
    }, []);

    // Demo experts for empty state
    const demoExperts: Expert[] = [
        {
            id: "1",
            full_name: "Marie Laurent",
            avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
            experts: { specialties: ["Médical", "Social"], hourly_rate: 65, lsf_video_url: "", is_verified: true }
        },
        {
            id: "2",
            full_name: "Thomas Dubois",
            avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
            experts: { specialties: ["Juridique", "Commercial"], hourly_rate: 75, lsf_video_url: "", is_verified: true }
        },
        {
            id: "3",
            full_name: "Sophie Martin",
            avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
            experts: { specialties: ["Entreprise"], hourly_rate: 60, lsf_video_url: "", is_verified: false }
        },
        {
            id: "4",
            full_name: "Lucas Bernard",
            avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
            experts: { specialties: ["Social", "Médical"], hourly_rate: 55, lsf_video_url: "", is_verified: true }
        },
        {
            id: "5",
            full_name: "Emma Petit",
            avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
            experts: { specialties: ["Juridique"], hourly_rate: 80, lsf_video_url: "", is_verified: true }
        },
        {
            id: "6",
            full_name: "Hugo Leroy",
            avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
            experts: { specialties: ["Commercial", "Entreprise"], hourly_rate: 70, lsf_video_url: "", is_verified: false }
        },
    ];

    const displayExperts = experts.length > 0 ? experts : demoExperts;

    return (
        <div className="flex flex-col min-h-screen bg-stone-50/50">
            {/* Hero Header */}
            <section className="bg-white border-b border-stone-100">
                <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    <motion.div 
                        className="flex flex-col md:flex-row md:items-end justify-between gap-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-900">
                                <Sparkle size={14} weight="duotone" className="text-amber-500" />
                                +500 experts vérifiés
                            </div>
                            <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-slate-900" data-testid="experts-page-title">
                                Trouvez votre expert{" "}
                                <span className="text-gradient">LSF</span>
                            </h1>
                            <p className="text-lg text-stone-600 max-w-xl">
                                Parcourez les profils de nos interprètes certifiés en Langue des Signes Française.
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-80">
                                <MagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher par nom ou spécialité..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    data-testid="expert-search-input"
                                    className="w-full pl-12 pr-4 h-12 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-sm font-medium transition-all"
                                />
                            </div>
                            <Button 
                                variant="outline" 
                                className="h-12 px-4 rounded-xl border-stone-200 hover:bg-stone-50"
                                data-testid="expert-filter-btn"
                            >
                                <Funnel size={20} className="mr-2" />
                                Filtres
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Experts Grid - Bento Style */}
            <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-[380px] bg-white animate-pulse rounded-3xl" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayExperts.map((expert, i) => (
                            <motion.div
                                key={expert.id}
                                className="group bg-white rounded-3xl border border-stone-100 overflow-hidden card-hover"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                data-testid={`expert-card-${expert.id}`}
                            >
                                {/* Image Section */}
                                <div className="aspect-[4/3] relative bg-stone-100 overflow-hidden">
                                    {expert.avatar_url ? (
                                        <img
                                            src={expert.avatar_url}
                                            alt={expert.full_name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600">
                                            <User size={64} weight="duotone" />
                                        </div>
                                    )}
                                    
                                    {/* Overlay Badges */}
                                    <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                                        {expert.experts?.is_verified && (
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-900 text-white text-xs font-semibold rounded-full shadow-lg">
                                                <ShieldCheck size={14} weight="fill" />
                                                Vérifié
                                            </div>
                                        )}
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur text-slate-900 text-xs font-semibold rounded-full shadow-sm border border-white/50">
                                            <Star size={14} weight="fill" className="text-amber-400" />
                                            4.9
                                        </div>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-3 bg-white/95 backdrop-blur rounded-xl shadow-lg hover:bg-white transition-colors">
                                            <VideoCamera size={20} weight="duotone" className="text-indigo-900" />
                                        </button>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-heading text-xl font-bold text-slate-900 group-hover:text-indigo-900 transition-colors">
                                                {expert.full_name}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm text-stone-500 mt-1">
                                                <Clock size={14} />
                                                <span>Disponible aujourd'hui</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-indigo-900">
                                                {expert.experts?.hourly_rate}€
                                            </div>
                                            <span className="text-xs text-stone-400">/heure</span>
                                        </div>
                                    </div>

                                    {/* Specialties */}
                                    <div className="flex flex-wrap gap-2 mb-5">
                                        {expert.experts?.specialties?.map((s) => (
                                            <span
                                                key={s}
                                                className="px-3 py-1 text-xs font-semibold bg-stone-100 text-stone-700 rounded-full"
                                            >
                                                {s}
                                            </span>
                                        ))}
                                    </div>

                                    <p className="text-sm text-stone-500 line-clamp-2 mb-6">
                                        Expert certifié en LSF avec plus de 5 ans d'expérience dans l'interprétation professionnelle.
                                    </p>

                                    {/* Actions */}
                                    <div className="flex gap-3">
                                        <Link
                                            href={`/experts/${expert.id}`}
                                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
                                            data-testid={`expert-profile-btn-${expert.id}`}
                                        >
                                            Voir Profil
                                        </Link>
                                        <Link
                                            href={`/experts/${expert.id}#booking`}
                                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-indigo-900 hover:bg-indigo-800 rounded-xl shadow-lg shadow-indigo-900/20 transition-all active:scale-[0.98]"
                                            data-testid={`expert-book-btn-${expert.id}`}
                                        >
                                            Réserver
                                            <ArrowRight size={16} weight="bold" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Empty State (if no experts) */}
                {!loading && experts.length === 0 && displayExperts.length === 0 && (
                    <motion.div 
                        className="py-20 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-6">
                            <HandWaving size={40} weight="duotone" className="text-stone-400" />
                        </div>
                        <h3 className="font-heading text-2xl font-bold text-slate-900 mb-2">Aucun expert trouvé</h3>
                        <p className="text-stone-500 mb-8">Essayez de modifier vos critères de recherche.</p>
                        <Button variant="outline" className="rounded-full px-6">
                            Réinitialiser les filtres
                        </Button>
                    </motion.div>
                )}
            </main>
        </div>
    );
}
