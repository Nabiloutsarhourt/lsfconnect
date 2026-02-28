"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    Star, Quote, CheckCircle2,
    XCircle, Trash2, Heart,
    Eye, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Testimonial = {
    id: string;
    full_name: string;
    content: string;
    rating: number;
    is_featured: boolean;
    domain: string;
    created_at: string;
};

export function TestimonialsManager() {
    const supabase = createClient();
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

    // Mock data for initial view
    useEffect(() => {
        setTestimonials([
            { id: '1', full_name: "Jean Dupont", content: "Une formation incroyable pour le domaine judiciaire. Je me sens beaucoup plus confiant.", rating: 5, is_featured: true, domain: "Judicial", created_at: new Date().toISOString() },
            { id: '2', full_name: "Marie L.", content: "Les cours médicaux sont précis et très bien expliqués. Merci LSFBuddy !", rating: 4, is_featured: false, domain: "Medical", created_at: new Date().toISOString() }
        ]);
    }, []);

    const toggleFeatured = (id: string) => {
        setTestimonials(prev => prev.map(t =>
            t.id === id ? { ...t, is_featured: !t.is_featured } : t
        ));
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-1000">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testi) => (
                    <Card key={testi.id} className="group rounded-[2.5rem] border-none shadow-xl hover:shadow-2xl transition-all bg-white overflow-hidden flex flex-col">
                        <CardHeader className="p-8 pb-4">
                            <div className="flex justify-between items-start">
                                <Quote className="h-10 w-10 text-primary/10 -ml-2" />
                                <Badge variant="outline" className={cn(
                                    "rounded-xl font-black text-[9px] uppercase tracking-widest",
                                    testi.is_featured ? "bg-primary/5 text-primary border-primary/20" : "bg-slate-50 text-slate-400 border-slate-100"
                                )}>
                                    {testi.is_featured ? "En Vedette" : "Archive"}
                                </Badge>
                            </div>
                        </CardHeader>

                        <CardContent className="p-8 pt-0 flex-1 flex flex-col">
                            <div className="flex gap-1 mb-4">
                                {Array(5).fill(0).map((_, i) => (
                                    <Star key={i} className={cn("h-4 w-4", i < testi.rating ? "text-yellow-400 fill-current" : "text-slate-100")} />
                                ))}
                            </div>

                            <p className="text-slate-600 font-medium italic text-sm leading-relaxed mb-6">"{testi.content}"</p>

                            <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                                <div>
                                    <p className="font-black text-slate-900 text-sm">{testi.full_name}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{testi.domain}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={cn(
                                            "rounded-xl transition-all",
                                            testi.is_featured ? "text-primary bg-primary/10" : "text-slate-300 hover:text-primary hover:bg-primary/5"
                                        )}
                                        onClick={() => toggleFeatured(testi.id)}
                                    >
                                        <Heart className={cn("h-4 w-4", testi.is_featured && "fill-current")} />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="p-12 rounded-[3.5rem] bg-slate-900 text-white relative overflow-hidden group shadow-3xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-1000" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-4 text-center md:text-left">
                        <h3 className="text-2xl font-black italic uppercase leading-none">Collecte <span className="text-primary not-italic">Automatique</span></h3>
                        <p className="text-slate-400 font-medium italic text-sm max-w-lg">Les témoignages sont automatiquement sollicités lors de la génération d'un certificat. Approuvez-les ici pour les afficher sur la page d'accueil.</p>
                    </div>
                    <Button variant="secondary" className="h-14 px-10 rounded-2xl bg-white text-slate-900 font-black uppercase tracking-widest text-[10px] gap-3 hover:bg-primary hover:text-white transition-all">
                        <Globe className="h-4 w-4" />
                        Voir la page publique
                    </Button>
                </div>
            </div>
        </div>
    );
}
