"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, MapPin, Star, Video, Hand, Filter, ShieldCheck } from "lucide-react";
import Link from "next/link";

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

export default function ExpertsPage() {
    const supabase = createClient();
    const [experts, setExperts] = useState<Expert[]>([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="flex flex-col min-h-screen">
            <div className="bg-slate-50 border-b">
                <div className="container py-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 leading-tight">
                                Trouvez un expert <span className="text-primary italic">LSF</span>
                            </h1>
                            <p className="text-slate-600 max-w-[600px]">
                                Parcourez les profils de nos interprètes et experts certifiés en Langue des Signes Française.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:w-80">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Rechercher par nom ou spécialité..."
                                    className="w-full pl-10 h-11 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                />
                            </div>
                            <Button variant="outline" className="h-11">
                                <Filter className="h-4 w-4 mr-2" />
                                Filtres
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="container py-12">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-[400px] bg-slate-100 animate-pulse rounded-2xl" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {experts.length > 0 ? (
                            experts.map((expert) => (
                                <Card key={expert.id} className="group overflow-hidden border-slate-200 hover:border-primary/30 transition-all hover:shadow-xl rounded-2xl">
                                    <div className="aspect-[4/3] relative bg-slate-900 overflow-hidden">
                                        {expert.avatar_url ? (
                                            <img
                                                src={expert.avatar_url}
                                                alt={expert.full_name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-800 text-white font-bold text-4xl">
                                                {expert.full_name.charAt(0)}
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2 py-1 rounded-full flex items-center gap-1 text-xs font-bold text-slate-900 border border-slate-100 shadow-sm">
                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                            4.9
                                        </div>
                                        {expert.experts?.is_verified && (
                                            <div className="absolute top-4 left-4 bg-primary px-3 py-1 rounded-full flex items-center gap-1 text-[10px] font-bold text-white uppercase tracking-wider shadow-lg">
                                                <ShieldCheck className="h-3 w-3" />
                                                Vérifié
                                            </div>
                                        )}
                                    </div>
                                    <CardHeader className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{expert.full_name}</CardTitle>
                                            <div className="text-lg font-bold text-primary">{expert.experts?.hourly_rate}€<span className="text-xs text-slate-400 font-medium">/h</span></div>
                                        </div>
                                        <div className="flex flex-wrap gap-1 pt-1">
                                            {expert.experts?.specialties?.map((s) => (
                                                <span key={s} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed font-medium">
                                            Expert certifié en LSF avec plus de 5 ans d'expérience dans les domaines juridique et médical.
                                        </p>
                                    </CardContent>
                                    <CardFooter className="pt-0 flex gap-2">
                                        <Button asChild variant="outline" className="flex-1 font-bold">
                                            <Link href={`/experts/${expert.id}`}>Profil</Link>
                                        </Button>
                                        <Button className="flex-1 font-bold">Réserver</Button>
                                    </CardFooter>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center">
                                <Hand className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-slate-900">Aucun expert trouvé</h3>
                                <p className="text-slate-500">Essayez de modifier vos critères de recherche.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
